import React from 'react'
import { Sparkles, Bell, User } from 'lucide-react'

export default function Header() {
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
          <button className="p-2 text-white/70 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm">Demo User</span>
          </div>
        </div>
      </div>
    </header>
  )
}