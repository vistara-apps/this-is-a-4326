import React, { createContext, useContext, useReducer } from 'react'

const AppContext = createContext()

const initialState = {
  user: null,
  projects: [],
  currentProject: null,
  adVariations: [],
  testPosts: [],
  isLoading: false,
  error: null,
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'CREATE_PROJECT':
      const newProject = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
      }
      return {
        ...state,
        projects: [...state.projects, newProject],
        currentProject: newProject,
      }
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload }
    case 'ADD_AD_VARIATIONS':
      return {
        ...state,
        adVariations: [...state.adVariations, ...action.payload],
        isLoading: false,
      }
    case 'ADD_TEST_POST':
      return {
        ...state,
        testPosts: [...state.testPosts, action.payload],
      }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}