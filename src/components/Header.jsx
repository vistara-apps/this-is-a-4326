import React, { useState } from 'react'
import { Sparkles, Bell, User, LogOut, ChevronDown, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Header({ onAuthClick }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, signOut, isAuthenticated } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      setShowUserMenu(false)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">AdSpark AI</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <button className="p-2 text-white/70 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          )}
          
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-sm">
                  {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                </span>
                <ChevronDown className="w-4 h-4 text-white/70" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-white/20">
                      <p className="text-white text-sm font-medium">
                        {user?.user_metadata?.name || 'User'}
                      </p>
                      <p className="text-white/70 text-xs">{user?.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        onAuthClick?.()
                      }}
                      className="w-full text-left px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={onAuthClick}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  )
}
