import React, { useState } from 'react'
import { AppProvider } from './context/AppContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ProjectGenerator from './components/ProjectGenerator'
import TestManager from './components/TestManager'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState('dashboard')

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

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Header />
        <div className="flex">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
          <main className="flex-1 p-6 ml-64">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </AppProvider>
  )
}

export default App