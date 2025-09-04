import React, { useState } from 'react'
import { Instagram, Music, Download, Send, Heart, MessageCircle, Share } from 'lucide-react'

export default function CreativePreview({ variations }) {
  const [selectedVariation, setSelectedVariation] = useState(null)

  const platformIcons = {
    instagram: Instagram,
    tiktok: Music,
  }

  const platformColors = {
    instagram: 'from-pink-500 to-purple-500',
    tiktok: 'from-black to-gray-700',
  }

  const handleTestPost = (variation) => {
    // This would integrate with social media APIs
    console.log('Test posting variation:', variation)
    alert(`Test post scheduled for ${variation.platform}!`)
  }

  if (!variations || variations.length === 0) {
    return (
      <div className="card p-8 glass-effect text-center">
        <p className="text-white/70">No variations generated yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Generated Variations</h3>
        <div className="text-white/60 text-sm">
          {variations.length} variations generated
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {variations.map((variation) => {
          const PlatformIcon = platformIcons[variation.platform]
          const platformColor = platformColors[variation.platform]
          
          return (
            <div key={variation.id} className="card glass-effect overflow-hidden card-hover">
              {/* Platform Header */}
              <div className={`p-4 bg-gradient-to-r ${platformColor}`}>
                <div className="flex items-center space-x-2">
                  <PlatformIcon className="w-5 h-5 text-white" />
                  <span className="text-white font-medium capitalize">
                    {variation.platform}
                  </span>
                </div>
              </div>

              {/* Content Preview */}
              <div className="p-4">
                {variation.visualAssetUrl && (
                  <div className="mb-4">
                    <img
                      src={variation.visualAssetUrl}
                      alt="Ad creative"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <p className="text-white text-sm leading-relaxed">
                    {variation.textCopy}
                  </p>
                  
                  {/* Mock Social Engagement */}
                  <div className="flex items-center space-x-4 text-white/60 text-sm">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>0</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>0</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share className="w-4 h-4" />
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-white/20 space-y-2">
                <button
                  onClick={() => handleTestPost(variation)}
                  className="w-full btn-primary text-sm py-2"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Test Post
                </button>
                <button className="w-full btn-secondary text-sm py-2">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bulk Actions */}
      <div className="card p-6 glass-effect">
        <h4 className="text-lg font-medium text-white mb-4">Bulk Actions</h4>
        <div className="flex space-x-4">
          <button className="btn-primary">
            Post All to Test Accounts
          </button>
          <button className="btn-secondary">
            Download All Assets
          </button>
          <button className="btn-secondary">
            Save Project
          </button>
        </div>
      </div>
    </div>
  )
}