import React from 'react'
import { Sparkles } from 'lucide-react'

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="card p-12 glass-effect text-center">
      <div className="relative inline-block mb-6">
        <div className="w-16 h-16 border-4 border-white/30 border-t-primary rounded-full animate-spin"></div>
        <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">AI at Work</h3>
      <p className="text-white/70">{message}</p>
      
      <div className="mt-6 space-y-2">
        <div className="text-white/60 text-sm">✨ Analyzing your product image</div>
        <div className="text-white/60 text-sm">🎯 Generating platform-optimized variations</div>
        <div className="text-white/60 text-sm">📝 Creating compelling ad copy</div>
      </div>
    </div>
  )
}