// Social Media API Integration Service
// Note: This is a simplified implementation. In production, you would need proper OAuth flows
// and backend API endpoints to handle social media posting securely.

export const socialMediaService = {
  // Instagram API integration
  instagram: {
    /**
     * Post content to Instagram test account
     * @param {Object} params - Post parameters
     * @param {string} params.imageUrl - URL of the image to post
     * @param {string} params.caption - Post caption
     * @param {string} params.accessToken - Instagram access token
     * @returns {Promise<Object>} Post response with URL and ID
     */
    async createPost({ imageUrl, caption, accessToken }) {
      try {
        // In a real implementation, this would use Instagram Graph API
        // For demo purposes, we'll simulate the API call
        
        if (!accessToken) {
          throw new Error('Instagram access token required')
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Mock successful response
        const mockResponse = {
          id: `ig_${Date.now()}`,
          permalink: `https://instagram.com/p/${this.generatePostId()}`,
          timestamp: new Date().toISOString(),
          status: 'published'
        }

        return mockResponse
      } catch (error) {
        console.error('Instagram posting error:', error)
        throw new Error(`Failed to post to Instagram: ${error.message}`)
      }
    },

    /**
     * Get Instagram account info
     * @param {string} accessToken - Instagram access token
     * @returns {Promise<Object>} Account information
     */
    async getAccountInfo(accessToken) {
      try {
        // Mock account info
        return {
          id: 'test_account_123',
          username: 'adspark_test',
          name: 'AdSpark Test Account',
          followers_count: 1250,
          media_count: 45
        }
      } catch (error) {
        console.error('Error fetching Instagram account info:', error)
        throw error
      }
    },

    /**
     * Validate Instagram access token
     * @param {string} accessToken - Token to validate
     * @returns {Promise<boolean>} Token validity
     */
    async validateToken(accessToken) {
      try {
        if (!accessToken || accessToken.length < 10) {
          return false
        }
        
        // In real implementation, make a test API call
        await this.getAccountInfo(accessToken)
        return true
      } catch (error) {
        return false
      }
    }
  },

  // TikTok API integration
  tiktok: {
    /**
     * Post video content to TikTok test account
     * @param {Object} params - Post parameters
     * @param {string} params.videoUrl - URL of the video to post
     * @param {string} params.description - Post description
     * @param {string} params.accessToken - TikTok access token
     * @returns {Promise<Object>} Post response with URL and ID
     */
    async createPost({ videoUrl, description, accessToken }) {
      try {
        if (!accessToken) {
          throw new Error('TikTok access token required')
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Mock successful response
        const mockResponse = {
          id: `tt_${Date.now()}`,
          share_url: `https://tiktok.com/@adspark_test/video/${this.generatePostId()}`,
          timestamp: new Date().toISOString(),
          status: 'published'
        }

        return mockResponse
      } catch (error) {
        console.error('TikTok posting error:', error)
        throw new Error(`Failed to post to TikTok: ${error.message}`)
      }
    },

    /**
     * Get TikTok account info
     * @param {string} accessToken - TikTok access token
     * @returns {Promise<Object>} Account information
     */
    async getAccountInfo(accessToken) {
      try {
        // Mock account info
        return {
          id: 'test_tiktok_456',
          username: 'adspark_test',
          display_name: 'AdSpark Test',
          follower_count: 2340,
          video_count: 28
        }
      } catch (error) {
        console.error('Error fetching TikTok account info:', error)
        throw error
      }
    },

    /**
     * Validate TikTok access token
     * @param {string} accessToken - Token to validate
     * @returns {Promise<boolean>} Token validity
     */
    async validateToken(accessToken) {
      try {
        if (!accessToken || accessToken.length < 10) {
          return false
        }
        
        await this.getAccountInfo(accessToken)
        return true
      } catch (error) {
        return false
      }
    }
  },

  // Common utilities
  generatePostId() {
    return Math.random().toString(36).substring(2, 15)
  },

  /**
   * Get platform-specific posting requirements
   * @param {string} platform - Platform name (instagram, tiktok)
   * @returns {Object} Platform requirements
   */
  getPlatformRequirements(platform) {
    const requirements = {
      instagram: {
        imageFormats: ['jpg', 'jpeg', 'png'],
        videoFormats: ['mp4', 'mov'],
        maxImageSize: 8 * 1024 * 1024, // 8MB
        maxVideoSize: 100 * 1024 * 1024, // 100MB
        maxCaptionLength: 2200,
        aspectRatios: ['1:1', '4:5', '9:16'],
        maxHashtags: 30
      },
      tiktok: {
        videoFormats: ['mp4', 'mov', 'mpeg', 'flv', 'avi', '3gp', 'webm'],
        maxVideoSize: 287 * 1024 * 1024, // 287MB
        maxDescriptionLength: 150,
        aspectRatios: ['9:16', '1:1'],
        maxHashtags: 100,
        videoDuration: {
          min: 3, // seconds
          max: 180 // seconds
        }
      }
    }

    return requirements[platform] || {}
  },

  /**
   * Validate content before posting
   * @param {Object} params - Validation parameters
   * @param {string} params.platform - Target platform
   * @param {string} params.contentType - Type of content (image, video)
   * @param {File} params.file - File to validate
   * @param {string} params.caption - Caption/description text
   * @returns {Object} Validation result
   */
  validateContent({ platform, contentType, file, caption }) {
    const requirements = this.getPlatformRequirements(platform)
    const errors = []
    const warnings = []

    // File validation
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase()
      const allowedFormats = contentType === 'image' 
        ? requirements.imageFormats || []
        : requirements.videoFormats || []

      if (!allowedFormats.includes(fileExtension)) {
        errors.push(`File format .${fileExtension} not supported for ${platform}`)
      }

      const maxSize = contentType === 'image' 
        ? requirements.maxImageSize 
        : requirements.maxVideoSize

      if (maxSize && file.size > maxSize) {
        errors.push(`File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`)
      }
    }

    // Caption validation
    if (caption) {
      const maxLength = platform === 'instagram' 
        ? requirements.maxCaptionLength 
        : requirements.maxDescriptionLength

      if (maxLength && caption.length > maxLength) {
        errors.push(`Caption exceeds ${maxLength} character limit`)
      }

      // Hashtag validation
      const hashtags = caption.match(/#\w+/g) || []
      if (hashtags.length > requirements.maxHashtags) {
        warnings.push(`Too many hashtags (${hashtags.length}). Recommended: ${requirements.maxHashtags}`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  },

  /**
   * Format content for specific platform
   * @param {Object} params - Formatting parameters
   * @param {string} params.platform - Target platform
   * @param {string} params.text - Original text
   * @param {Array} params.hashtags - Array of hashtags
   * @returns {string} Formatted content
   */
  formatContent({ platform, text, hashtags = [] }) {
    let formattedText = text

    if (platform === 'instagram') {
      // Instagram formatting
      if (hashtags.length > 0) {
        const hashtagString = hashtags.map(tag => `#${tag}`).join(' ')
        formattedText = `${text}\n\n${hashtagString}`
      }
    } else if (platform === 'tiktok') {
      // TikTok formatting - more concise
      const maxLength = 150
      if (text.length > maxLength) {
        formattedText = text.substring(0, maxLength - 3) + '...'
      }
      
      // Add trending hashtags for TikTok
      if (hashtags.length > 0) {
        const trendingTags = hashtags.slice(0, 5).map(tag => `#${tag}`).join(' ')
        formattedText = `${formattedText} ${trendingTags}`
      }
    }

    return formattedText
  }
}

// OAuth helper functions (simplified for demo)
export const oauthHelpers = {
  /**
   * Generate OAuth URL for platform authentication
   * @param {string} platform - Platform name
   * @param {string} clientId - App client ID
   * @param {string} redirectUri - Redirect URI after auth
   * @returns {string} OAuth URL
   */
  generateAuthUrl(platform, clientId, redirectUri) {
    const baseUrls = {
      instagram: 'https://api.instagram.com/oauth/authorize',
      tiktok: 'https://www.tiktok.com/auth/authorize'
    }

    const scopes = {
      instagram: 'user_profile,user_media',
      tiktok: 'user.info.basic,video.publish'
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes[platform],
      response_type: 'code',
      state: this.generateState()
    })

    return `${baseUrls[platform]}?${params.toString()}`
  },

  /**
   * Generate secure state parameter for OAuth
   * @returns {string} Random state string
   */
  generateState() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  },

  /**
   * Exchange authorization code for access token
   * @param {string} platform - Platform name
   * @param {string} code - Authorization code
   * @param {string} clientId - App client ID
   * @param {string} clientSecret - App client secret
   * @param {string} redirectUri - Redirect URI
   * @returns {Promise<Object>} Token response
   */
  async exchangeCodeForToken(platform, code, clientId, clientSecret, redirectUri) {
    // In a real implementation, this would make API calls to exchange the code
    // For demo purposes, return mock tokens
    return {
      access_token: `mock_${platform}_token_${Date.now()}`,
      token_type: 'bearer',
      expires_in: 3600,
      scope: platform === 'instagram' ? 'user_profile,user_media' : 'user.info.basic,video.publish'
    }
  }
}
