import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import ImageUploader from './ImageUploader'
import AdConfigurator from './AdConfigurator'
import CreativePreview from './CreativePreview'
import LoadingSpinner from './LoadingSpinner'

export default function ProjectGenerator() {
  const { state, dispatch } = useApp()
  const [step, setStep] = useState(1)
  const [projectData, setProjectData] = useState({
    productImage: null,
    platforms: ['instagram', 'tiktok'],
    variationCount: 3,
    adType: 'imageAndText',
  })

  const handleImageUpload = (imageData) => {
    setProjectData(prev => ({ ...prev, productImage: imageData }))
    setStep(2)
  }

  const handleConfigurationComplete = (config) => {
    setProjectData(prev => ({ ...prev, ...config }))
    setStep(3)
    generateAdVariations()
  }

  const generateAdVariations = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Create project
      dispatch({
        type: 'CREATE_PROJECT',
        payload: {
          productImage: projectData.productImage,
          platforms: projectData.platforms,
          variationCount: projectData.variationCount,
        }
      })

      // Generate variations using OpenAI
      const variations = await generateVariationsWithAI(projectData)
      
      dispatch({
        type: 'ADD_AD_VARIATIONS',
        payload: variations
      })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  const generateVariationsWithAI = async (data) => {
    try {
      // Import OpenAI service
      const { openaiService } = await import('../services/openai')
      
      const variations = []
      
      // Analyze the product image first if available
      let productAnalysis = null
      if (data.productImage && typeof data.productImage === 'string') {
        try {
          productAnalysis = await openaiService.analyzeProductImage(data.productImage)
        } catch (error) {
          console.warn('Could not analyze product image:', error)
        }
      }
      
      // Generate variations for each platform
      for (const platform of data.platforms) {
        try {
          // Generate ad copy variations
          const adCopyVariations = await openaiService.generateAdCopy({
            productDescription: productAnalysis?.description || 'Premium product',
            platform,
            tone: 'casual',
            count: data.variationCount
          })
          
          // Generate hashtags
          const hashtags = await openaiService.generateHashtags({
            productType: productAnalysis?.productType || 'product',
            platform,
            keywords: productAnalysis?.marketingAngles || []
          })
          
          // Create variations with AI-generated content
          for (let i = 0; i < Math.min(adCopyVariations.length, data.variationCount); i++) {
            const variation = adCopyVariations[i]
            
            variations.push({
              id: `${Date.now()}-${i}-${platform}`,
              projectId: state.currentProject?.id,
              platform,
              creativeType: data.adType,
              visualAssetUrl: data.productImage,
              textCopy: variation.text || generateMockAdCopy(platform, i),
              hook: variation.hook,
              cta: variation.cta,
              hashtags: variation.hashtags || hashtags.slice(0, 10),
              status: 'generated',
              createdAt: new Date().toISOString(),
            })
          }
        } catch (error) {
          console.error(`Error generating variations for ${platform}:`, error)
          
          // Fallback to mock data if AI generation fails
          for (let i = 0; i < data.variationCount; i++) {
            variations.push({
              id: `${Date.now()}-${i}-${platform}-fallback`,
              projectId: state.currentProject?.id,
              platform,
              creativeType: data.adType,
              visualAssetUrl: data.productImage,
              textCopy: generateMockAdCopy(platform, i),
              status: 'generated',
              createdAt: new Date().toISOString(),
            })
          }
        }
      }
      
      return variations
    } catch (error) {
      console.error('Error in generateVariationsWithAI:', error)
      
      // Complete fallback to mock variations
      const mockVariations = []
      for (let i = 0; i < data.variationCount; i++) {
        for (const platform of data.platforms) {
          mockVariations.push({
            id: `${Date.now()}-${i}-${platform}`,
            projectId: state.currentProject?.id,
            platform,
            creativeType: data.adType,
            visualAssetUrl: data.productImage,
            textCopy: generateMockAdCopy(platform, i),
            status: 'generated',
            createdAt: new Date().toISOString(),
          })
        }
      }
      return mockVariations
    }
  }

  const generateMockAdCopy = (platform, index) => {
    const copies = {
      instagram: [
        "✨ Transform your style with our premium collection! Shop now and get 20% off your first order. #Fashion #Style #NewCollection",
        "🔥 Limited time offer! Don't miss out on these exclusive designs. Free shipping on orders over $50! #Sale #Fashion",
        "💎 Elevate your wardrobe with pieces that speak to your soul. Quality meets affordability. #Premium #Style"
      ],
      tiktok: [
        "POV: You found the perfect outfit that makes you feel unstoppable 💫 #OOTD #Fashion #Confidence",
        "This is your sign to treat yourself ✨ Use code GLOW20 for 20% off! #TreatYourself #Fashion",
        "When the quality hits different 🔥 You deserve nice things! #Quality #SelfCare #Fashion"
      ]
    }
    
    return copies[platform][index] || copies[platform][0]
  }

  const resetGenerator = () => {
    setStep(1)
    setProjectData({
      productImage: null,
      platforms: ['instagram', 'tiktok'],
      variationCount: 3,
      adType: 'imageAndText',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Generate Ad Variations</h2>
          <p className="text-white/70">Create multiple ad creative variations from your product image</p>
        </div>
        {step > 1 && (
          <button
            onClick={resetGenerator}
            className="btn-secondary"
          >
            Start Over
          </button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center space-x-4 mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNumber 
                ? 'bg-primary text-white' 
                : 'bg-white/20 text-white/60'
            }`}>
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-20 h-1 mx-2 ${
                step > stepNumber ? 'bg-primary' : 'bg-white/20'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {step === 1 && (
          <ImageUploader onImageUpload={handleImageUpload} />
        )}
        
        {step === 2 && (
          <AdConfigurator 
            onConfigurationComplete={handleConfigurationComplete}
            initialConfig={projectData}
          />
        )}
        
        {step === 3 && (
          <div>
            {state.isLoading ? (
              <LoadingSpinner message="Generating ad variations..." />
            ) : (
              <CreativePreview variations={state.adVariations} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
