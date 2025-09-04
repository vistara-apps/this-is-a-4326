import React, { useState } from 'react'
import { Instagram, Music, Settings } from 'lucide-react'

export default function AdConfigurator({ onConfigurationComplete, initialConfig }) {
  const [config, setConfig] = useState({
    platforms: initialConfig.platforms || ['instagram'],
    variationCount: initialConfig.variationCount || 3,
    adType: initialConfig.adType || 'imageAndText',
    tone: 'energetic',
    targetAudience: 'young-adults',
  })

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-500' },
    { id: 'tiktok', name: 'TikTok', icon: Music, color: 'from-black to-gray-800' },
  ]

  const adTypes = [
    { id: 'imageAndText', name: 'Image + Text', description: 'Product image with engaging copy' },
    { id: 'textOnly', name: 'Text Only', description: 'Compelling text-based ads' },
  ]

  const tones = [
    { id: 'energetic', name: 'Energetic', description: 'High-energy, exciting language' },
    { id: 'professional', name: 'Professional', description: 'Clean, business-focused tone' },
    { id: 'casual', name: 'Casual', description: 'Friendly, conversational style' },
    { id: 'luxury', name: 'Luxury', description: 'Premium, sophisticated messaging' },
  ]

  const audiences = [
    { id: 'young-adults', name: 'Young Adults (18-34)', description: 'Digital natives, trend-conscious' },
    { id: 'professionals', name: 'Professionals (25-45)', description: 'Career-focused, value quality' },
    { id: 'parents', name: 'Parents (28-50)', description: 'Family-oriented, practical' },
    { id: 'seniors', name: 'Seniors (50+)', description: 'Value-conscious, experienced' },
  ]

  const handlePlatformToggle = (platformId) => {
    setConfig(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }))
  }

  const handleSubmit = () => {
    if (config.platforms.length > 0) {
      onConfigurationComplete(config)
    }
  }

  return (
    <div className="card p-8 glass-effect space-y-8">
      <h3 className="text-xl font-semibold text-white mb-6">Configure Your Ad Campaign</h3>
      
      {/* Platform Selection */}
      <div>
        <h4 className="text-lg font-medium text-white mb-4">Select Platforms</h4>
        <div className="grid grid-cols-2 gap-4">
          {platforms.map((platform) => {
            const Icon = platform.icon
            const isSelected = config.platforms.includes(platform.id)
            
            return (
              <button
                key={platform.id}
                onClick={() => handlePlatformToggle(platform.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/20'
                    : 'border-white/30 hover:border-white/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium">{platform.name}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Variation Count */}
      <div>
        <h4 className="text-lg font-medium text-white mb-4">Number of Variations</h4>
        <div className="flex space-x-4">
          {[3, 5, 8].map((count) => (
            <button
              key={count}
              onClick={() => setConfig(prev => ({ ...prev, variationCount: count }))}
              className={`px-6 py-3 rounded-lg border-2 transition-all ${
                config.variationCount === count
                  ? 'border-primary bg-primary/20 text-white'
                  : 'border-white/30 text-white/70 hover:border-white/50 hover:text-white'
              }`}
            >
              {count} variations
            </button>
          ))}
        </div>
      </div>

      {/* Ad Type */}
      <div>
        <h4 className="text-lg font-medium text-white mb-4">Ad Type</h4>
        <div className="space-y-3">
          {adTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setConfig(prev => ({ ...prev, adType: type.id }))}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                config.adType === type.id
                  ? 'border-primary bg-primary/20'
                  : 'border-white/30 hover:border-white/50'
              }`}
            >
              <div className="text-white font-medium">{type.name}</div>
              <div className="text-white/60 text-sm">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tone */}
      <div>
        <h4 className="text-lg font-medium text-white mb-4">Tone & Style</h4>
        <div className="grid grid-cols-2 gap-3">
          {tones.map((tone) => (
            <button
              key={tone.id}
              onClick={() => setConfig(prev => ({ ...prev, tone: tone.id }))}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                config.tone === tone.id
                  ? 'border-primary bg-primary/20'
                  : 'border-white/30 hover:border-white/50'
              }`}
            >
              <div className="text-white font-medium text-sm">{tone.name}</div>
              <div className="text-white/60 text-xs">{tone.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Target Audience */}
      <div>
        <h4 className="text-lg font-medium text-white mb-4">Target Audience</h4>
        <div className="space-y-3">
          {audiences.map((audience) => (
            <button
              key={audience.id}
              onClick={() => setConfig(prev => ({ ...prev, targetAudience: audience.id }))}
              className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                config.targetAudience === audience.id
                  ? 'border-primary bg-primary/20'
                  : 'border-white/30 hover:border-white/50'
              }`}
            >
              <div className="text-white font-medium">{audience.name}</div>
              <div className="text-white/60 text-sm">{audience.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          onClick={handleSubmit}
          disabled={config.platforms.length === 0}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate {config.variationCount} Ad Variations
        </button>
      </div>
    </div>
  )
}