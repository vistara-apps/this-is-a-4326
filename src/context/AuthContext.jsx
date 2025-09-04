import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { supabaseService, supabase } from '../services/supabase'

const AuthContext = createContext()

const initialState = {
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        isAuthenticated: !!action.payload.user,
        isLoading: false,
        error: null,
      }
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        dispatch({
          type: 'SET_USER',
          payload: { user: session?.user || null, session }
        })
      } catch (error) {
        console.error('Error getting initial session:', error)
        dispatch({ type: 'SET_ERROR', payload: error.message })
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        dispatch({
          type: 'SET_USER',
          payload: { user: session?.user || null, session }
        })
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, userData = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      const { user, session } = await supabaseService.signUp(email, password)
      
      // Create user profile if additional data provided
      if (user && userData.name) {
        await supabase
          .from('users')
          .upsert({
            id: user.id,
            email: user.email,
            name: userData.name,
            subscription_tier: 'free',
            created_at: new Date().toISOString()
          })
      }

      return { user, session }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const signIn = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      const { user, session } = await supabaseService.signIn(email, password)
      return { user, session }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const signOut = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      await supabaseService.signOut()
      dispatch({ type: 'CLEAR_USER' })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const resetPassword = async (email) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error
      return true
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updatePassword = async (newPassword) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
      return true
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateProfile = async (updates) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      if (!state.user) throw new Error('No user logged in')

      // Update auth user if email is being changed
      if (updates.email && updates.email !== state.user.email) {
        const { error } = await supabase.auth.updateUser({
          email: updates.email
        })
        if (error) throw error
      }

      // Update user profile in database
      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', state.user.id)

      if (error) throw error
      return true
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return <AuthRequired />
    }

    return <Component {...props} />
  }
}

// Component to show when authentication is required
function AuthRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
        <p className="text-white/70 mb-6">
          Please sign in to access AdSpark AI features.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  )
}
