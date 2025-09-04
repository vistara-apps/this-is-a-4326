import React, { useState } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../LoadingSpinner'

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode) // 'signin', 'signup', 'forgot'
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [errors, setErrors] = useState({})

  const { signIn, signUp, resetPassword, isLoading, error, clearError } = useAuth()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (mode !== 'forgot') {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }

      if (mode === 'signup') {
        if (!formData.name) {
          newErrors.name = 'Name is required'
        }
        
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()

    if (!validateForm()) return

    try {
      if (mode === 'signin') {
        await signIn(formData.email, formData.password)
        onClose()
      } else if (mode === 'signup') {
        await signUp(formData.email, formData.password, { name: formData.name })
        onClose()
      } else if (mode === 'forgot') {
        await resetPassword(formData.email)
        setMode('signin')
        // Show success message
        alert('Password reset email sent! Check your inbox.')
      }
    } catch (err) {
      console.error('Auth error:', err)
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    })
    setErrors({})
    clearError()
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-white/70">
            {mode === 'signin' && 'Sign in to your AdSpark AI account'}
            {mode === 'signup' && 'Join AdSpark AI and start creating'}
            {mode === 'forgot' && 'Enter your email to reset your password'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-6">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name field (signup only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password field */}
          {mode !== 'forgot' && (
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-12 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>
          )}

          {/* Confirm Password field (signup only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                {mode === 'signin' && 'Sign In'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot' && 'Send Reset Email'}
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 text-center space-y-2">
          {mode === 'signin' && (
            <>
              <button
                onClick={() => switchMode('forgot')}
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Forgot your password?
              </button>
              <div className="text-white/70 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => switchMode('signup')}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Sign up
                </button>
              </div>
            </>
          )}

          {mode === 'signup' && (
            <div className="text-white/70 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => switchMode('signin')}
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign in
              </button>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="text-white/70 text-sm">
              Remember your password?{' '}
              <button
                onClick={() => switchMode('signin')}
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
