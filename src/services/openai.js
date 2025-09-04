import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
})

export const openaiService = {
  /**
   * Generate ad copy variations using OpenAI
   * @param {Object} params - Parameters for ad generation
   * @param {string} params.productDescription - Description of the product
   * @param {string} params.platform - Target platform (instagram, tiktok)
   * @param {string} params.tone - Tone of voice (casual, professional, playful)
   * @param {number} params.count - Number of variations to generate
   * @returns {Promise<Array>} Array of generated ad copy variations
   */
  async generateAdCopy({ productDescription, platform, tone = 'casual', count = 3 }) {
    try {
      const prompt = this.buildAdCopyPrompt(productDescription, platform, tone, count)
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert social media marketer specializing in creating engaging ad copy for different platforms. Generate compelling, platform-specific ad copy that drives engagement and conversions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.8,
      })

      const response = completion.choices[0].message.content
      return this.parseAdCopyResponse(response)
    } catch (error) {
      console.error('Error generating ad copy:', error)
      throw new Error('Failed to generate ad copy. Please try again.')
    }
  },

  /**
   * Generate image variations using DALL-E
   * @param {Object} params - Parameters for image generation
   * @param {string} params.originalImageUrl - URL of the original product image
   * @param {string} params.style - Style variation (modern, vintage, minimalist, etc.)
   * @param {string} params.platform - Target platform for optimization
   * @returns {Promise<string>} URL of the generated image
   */
  async generateImageVariation({ originalImageUrl, style = 'modern', platform = 'instagram' }) {
    try {
      const prompt = this.buildImagePrompt(style, platform)
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: platform === 'instagram' ? '1024x1024' : '1024x1792', // Square for IG, vertical for TikTok
        quality: "standard",
      })

      return response.data[0].url
    } catch (error) {
      console.error('Error generating image variation:', error)
      throw new Error('Failed to generate image variation. Please try again.')
    }
  },

  /**
   * Analyze uploaded image and extract product information
   * @param {string} imageUrl - URL of the uploaded image
   * @returns {Promise<Object>} Extracted product information
   */
  async analyzeProductImage(imageUrl) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this product image and provide a detailed description including: product type, key features, target audience, style/aesthetic, colors, and suggested marketing angles. Format your response as JSON with these fields: productType, description, features, targetAudience, colors, marketingAngles."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      })

      const response = completion.choices[0].message.content
      return JSON.parse(response)
    } catch (error) {
      console.error('Error analyzing product image:', error)
      throw new Error('Failed to analyze product image. Please try again.')
    }
  },

  /**
   * Generate platform-specific hashtags
   * @param {Object} params - Parameters for hashtag generation
   * @param {string} params.productType - Type of product
   * @param {string} params.platform - Target platform
   * @param {Array} params.keywords - Additional keywords
   * @returns {Promise<Array>} Array of relevant hashtags
   */
  async generateHashtags({ productType, platform, keywords = [] }) {
    try {
      const prompt = `Generate 15-20 relevant hashtags for a ${productType} on ${platform}. 
      Additional keywords: ${keywords.join(', ')}
      
      Mix of:
      - Popular hashtags (high reach)
      - Niche hashtags (targeted audience)
      - Branded hashtags (if applicable)
      
      Return as a JSON array of hashtags without the # symbol.`

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a social media hashtag expert. Generate relevant, trending hashtags that will maximize reach and engagement."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      })

      const response = completion.choices[0].message.content
      return JSON.parse(response)
    } catch (error) {
      console.error('Error generating hashtags:', error)
      throw new Error('Failed to generate hashtags. Please try again.')
    }
  },

  // Helper methods
  buildAdCopyPrompt(productDescription, platform, tone, count) {
    const platformSpecs = {
      instagram: {
        maxLength: 2200,
        style: 'Visual-first, use emojis, include call-to-action',
        format: 'Caption with hashtags'
      },
      tiktok: {
        maxLength: 150,
        style: 'Trendy, conversational, hook-focused',
        format: 'Short, punchy text overlay or caption'
      }
    }

    const spec = platformSpecs[platform] || platformSpecs.instagram

    return `Create ${count} engaging ad copy variations for ${platform} promoting: ${productDescription}

Requirements:
- Tone: ${tone}
- Max length: ${spec.maxLength} characters
- Style: ${spec.style}
- Format: ${spec.format}

Return as a JSON array with objects containing:
- text: the ad copy
- hook: the opening hook/attention grabber
- cta: the call-to-action
- hashtags: array of relevant hashtags (without #)

Make each variation unique in approach while maintaining the ${tone} tone.`
  },

  buildImagePrompt(style, platform) {
    const aspectRatio = platform === 'instagram' ? 'square 1:1' : 'vertical 9:16'
    
    return `Create a ${style} product advertisement image optimized for ${platform}. 
    The image should be ${aspectRatio} aspect ratio, high-quality, and designed to catch attention in a social media feed. 
    Focus on clean composition, good lighting, and ${style} aesthetic that would appeal to the target audience.`
  },

  parseAdCopyResponse(response) {
    try {
      // Try to parse as JSON first
      return JSON.parse(response)
    } catch (error) {
      // If JSON parsing fails, try to extract variations manually
      const variations = response.split('\n\n').filter(v => v.trim())
      return variations.map((variation, index) => ({
        text: variation.trim(),
        hook: variation.split('.')[0] + '.',
        cta: 'Shop now!',
        hashtags: ['ad', 'product', 'sale']
      }))
    }
  }
}

// Utility functions for rate limiting and error handling
export const aiUtils = {
  /**
   * Rate limiter for API calls
   */
  rateLimiter: {
    calls: [],
    maxCalls: 10,
    timeWindow: 60000, // 1 minute

    async checkLimit() {
      const now = Date.now()
      this.calls = this.calls.filter(call => now - call < this.timeWindow)
      
      if (this.calls.length >= this.maxCalls) {
        const oldestCall = Math.min(...this.calls)
        const waitTime = this.timeWindow - (now - oldestCall)
        throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`)
      }
      
      this.calls.push(now)
    }
  },

  /**
   * Retry logic for failed API calls
   */
  async retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        if (i === maxRetries - 1) throw error
        
        const delay = baseDelay * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
}
