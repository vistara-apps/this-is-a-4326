import React, { useState } from 'react'
import { AppProvider } from './context/AppContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ProjectGenerator from './components/ProjectGenerator'
import TestManager from './components/TestManager'
import AuthModal from './components/auth/AuthModal'
import './App.css'

function AppContent() {
  const [activeView, setActiveView] = useState('dashboard')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { isAuthenticated, isLoading } = useAuth()

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />
      case 'generate':
        return <ProjectGenerator />
      case 'test-manager':
        return <TestManager />
      default:
        return <Dashboard />
    }
  }

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading AdSpark AI...</p>
        </div>
      </div>
    )
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          {/* Landing Page Header */}
          <header className="px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">✨</span>
                </div>
                <span className="text-2xl font-bold text-white">AdSpark AI</span>
              </div>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Sign In
              </button>
            </div>
          </header>

          {/* Landing Page Content */}
          <main className="px-6 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-6xl font-bold text-white mb-6">
                Generate & Test Ad Creative
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> Instantly</span>
              </h1>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                Upload a single product image and let AI create multiple ad variations optimized for TikTok and Instagram. 
                Test them automatically on your social accounts.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                >
                  Start Creating for Free
                </button>
                <button className="border border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                  Watch Demo
                </button>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-8 mt-20">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <span className="text-white text-2xl">🎨</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">AI-Powered Generation</h3>
                  <p className="text-white/70">
                    Create 3-5 unique ad variations from a single product image with AI-generated visuals and copy.
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <span className="text-white text-2xl">📱</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Platform Optimization</h3>
                  <p className="text-white/70">
                    Automatically optimize creatives for TikTok and Instagram formats and best practices.
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                  <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <span className="text-white text-2xl">🚀</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Auto Test Posting</h3>
                  <p className="text-white/70">
                    Automatically post variations to test accounts and track performance metrics.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    )
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header onAuthClick={() => setShowAuthModal(true)} />
      <div className="flex">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  )
}

export default App
