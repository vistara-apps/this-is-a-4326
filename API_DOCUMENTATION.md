# AdSpark AI - API Documentation

This document provides comprehensive documentation for all API integrations and services used in AdSpark AI.

## Table of Contents
- [Authentication](#authentication)
- [Supabase Integration](#supabase-integration)
- [OpenAI Integration](#openai-integration)
- [Social Media APIs](#social-media-apis)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## Authentication

AdSpark AI uses Supabase Auth for user authentication and session management.

### Sign Up
```javascript
import { supabaseService } from './services/supabase'

const { user, session } = await supabaseService.signUp(email, password)
```

### Sign In
```javascript
const { user, session } = await supabaseService.signIn(email, password)
```

### Sign Out
```javascript
await supabaseService.signOut()
```

### Get Current User
```javascript
const user = await supabaseService.getCurrentUser()
```

## Supabase Integration

### Database Operations

#### Projects

**Create Project**
```javascript
const project = await supabaseService.createProject({
  userId: user.id,
  productImage: imageUrl,
  platforms: ['instagram', 'tiktok'],
  variationCount: 3,
  adType: 'imageAndText'
})
```

**Get User Projects**
```javascript
const projects = await supabaseService.getProjects(userId)
```

**Get Single Project**
```javascript
const project = await supabaseService.getProject(projectId)
```

#### Ad Variations

**Create Ad Variation**
```javascript
const variation = await supabaseService.createAdVariation({
  projectId: 'uuid',
  platform: 'instagram',
  creativeType: 'imageAndText',
  visualAssetUrl: 'https://...',
  textCopy: 'Generated ad copy...',
  status: 'generated'
})
```

**Get Project Variations**
```javascript
const variations = await supabaseService.getAdVariations(projectId)
```

**Update Variation**
```javascript
const updated = await supabaseService.updateAdVariation(variationId, {
  status: 'approved',
  textCopy: 'Updated copy...'
})
```

#### Test Posts

**Create Test Post**
```javascript
const testPost = await supabaseService.createTestPost({
  adVariationId: 'uuid',
  platform: 'instagram',
  accountId: 'test_account_123',
  postUrl: 'https://instagram.com/p/...',
  status: 'posted'
})
```

**Get Test Posts**
```javascript
const testPosts = await supabaseService.getTestPosts(adVariationId)
const allTestPosts = await supabaseService.getAllTestPosts(userId)
```

### File Storage

**Upload File**
```javascript
const { data } = await supabaseService.uploadFile(
  'product-images',
  `${userId}/product-${Date.now()}.jpg`,
  file
)
```

**Get File URL**
```javascript
const url = await supabaseService.getFileUrl('product-images', filePath)
```

**Delete File**
```javascript
await supabaseService.deleteFile('product-images', filePath)
```

## OpenAI Integration

### Ad Copy Generation

**Generate Platform-Specific Ad Copy**
```javascript
import { openaiService } from './services/openai'

const variations = await openaiService.generateAdCopy({
  productDescription: 'Premium wireless headphones with noise cancellation',
  platform: 'instagram',
  tone: 'casual',
  count: 3
})

// Response format:
[
  {
    text: "🎧 Experience pure sound with our premium wireless headphones...",
    hook: "🎧 Experience pure sound",
    cta: "Shop now and get 20% off!",
    hashtags: ["headphones", "wireless", "audio", "music"]
  }
]
```

### Image Analysis

**Analyze Product Image**
```javascript
const analysis = await openaiService.analyzeProductImage(imageUrl)

// Response format:
{
  productType: "wireless headphones",
  description: "Premium over-ear wireless headphones with active noise cancellation",
  features: ["wireless", "noise cancellation", "premium build"],
  targetAudience: "music enthusiasts, professionals, commuters",
  colors: ["black", "silver"],
  marketingAngles: ["premium quality", "noise cancellation", "wireless freedom"]
}
```

### Hashtag Generation

**Generate Platform-Specific Hashtags**
```javascript
const hashtags = await openaiService.generateHashtags({
  productType: 'wireless headphones',
  platform: 'instagram',
  keywords: ['premium', 'noise cancellation']
})

// Response: ["headphones", "wireless", "audio", "music", "premium", ...]
```

### Image Variation Generation

**Generate Image Variations with DALL-E**
```javascript
const imageUrl = await openaiService.generateImageVariation({
  originalImageUrl: 'https://...',
  style: 'modern',
  platform: 'instagram'
})
```

### Rate Limiting and Error Handling

**Check Rate Limits**
```javascript
import { aiUtils } from './services/openai'

try {
  await aiUtils.rateLimiter.checkLimit()
  // Proceed with API call
} catch (error) {
  console.log(error.message) // "Rate limit exceeded. Please wait X seconds."
}
```

**Retry with Backoff**
```javascript
const result = await aiUtils.retryWithBackoff(
  () => openaiService.generateAdCopy(params),
  3, // max retries
  1000 // base delay in ms
)
```

## Social Media APIs

### Instagram Integration

**Create Instagram Post**
```javascript
import { socialMediaService } from './services/socialMedia'

const response = await socialMediaService.instagram.createPost({
  imageUrl: 'https://...',
  caption: 'Check out our amazing product! #product #sale',
  accessToken: 'instagram_access_token'
})

// Response format:
{
  id: 'ig_1234567890',
  permalink: 'https://instagram.com/p/ABC123',
  timestamp: '2024-01-01T12:00:00Z',
  status: 'published'
}
```

**Get Instagram Account Info**
```javascript
const accountInfo = await socialMediaService.instagram.getAccountInfo(accessToken)

// Response format:
{
  id: 'test_account_123',
  username: 'adspark_test',
  name: 'AdSpark Test Account',
  followers_count: 1250,
  media_count: 45
}
```

**Validate Instagram Token**
```javascript
const isValid = await socialMediaService.instagram.validateToken(accessToken)
```

### TikTok Integration

**Create TikTok Post**
```javascript
const response = await socialMediaService.tiktok.createPost({
  videoUrl: 'https://...',
  description: 'Amazing product showcase! #product #viral',
  accessToken: 'tiktok_access_token'
})

// Response format:
{
  id: 'tt_1234567890',
  share_url: 'https://tiktok.com/@adspark_test/video/1234567890',
  timestamp: '2024-01-01T12:00:00Z',
  status: 'published'
}
```

**Get TikTok Account Info**
```javascript
const accountInfo = await socialMediaService.tiktok.getAccountInfo(accessToken)

// Response format:
{
  id: 'test_tiktok_456',
  username: 'adspark_test',
  display_name: 'AdSpark Test',
  follower_count: 2340,
  video_count: 28
}
```

### Content Validation

**Validate Content Before Posting**
```javascript
const validation = socialMediaService.validateContent({
  platform: 'instagram',
  contentType: 'image',
  file: imageFile,
  caption: 'Product caption with #hashtags'
})

// Response format:
{
  isValid: true,
  errors: [],
  warnings: ["Too many hashtags (35). Recommended: 30"]
}
```

**Format Content for Platform**
```javascript
const formattedContent = socialMediaService.formatContent({
  platform: 'instagram',
  text: 'Check out our amazing product!',
  hashtags: ['product', 'sale', 'amazing']
})

// Result: "Check out our amazing product!\n\n#product #sale #amazing"
```

### Platform Requirements

**Get Platform-Specific Requirements**
```javascript
const requirements = socialMediaService.getPlatformRequirements('instagram')

// Response format:
{
  imageFormats: ['jpg', 'jpeg', 'png'],
  videoFormats: ['mp4', 'mov'],
  maxImageSize: 8388608, // 8MB in bytes
  maxVideoSize: 104857600, // 100MB in bytes
  maxCaptionLength: 2200,
  aspectRatios: ['1:1', '4:5', '9:16'],
  maxHashtags: 30
}
```

## OAuth Integration

### Generate OAuth URLs

**Instagram OAuth**
```javascript
import { oauthHelpers } from './services/socialMedia'

const authUrl = oauthHelpers.generateAuthUrl(
  'instagram',
  'your_client_id',
  'https://yourapp.com/callback'
)
```

**TikTok OAuth**
```javascript
const authUrl = oauthHelpers.generateAuthUrl(
  'tiktok',
  'your_client_id',
  'https://yourapp.com/callback'
)
```

### Exchange Authorization Code

```javascript
const tokenResponse = await oauthHelpers.exchangeCodeForToken(
  'instagram',
  authorizationCode,
  clientId,
  clientSecret,
  redirectUri
)

// Response format:
{
  access_token: 'access_token_here',
  token_type: 'bearer',
  expires_in: 3600,
  scope: 'user_profile,user_media'
}
```

## Error Handling

### Common Error Types

**Authentication Errors**
```javascript
try {
  await supabaseService.signIn(email, password)
} catch (error) {
  if (error.message.includes('Invalid login credentials')) {
    // Handle invalid credentials
  } else if (error.message.includes('Email not confirmed')) {
    // Handle unconfirmed email
  }
}
```

**OpenAI API Errors**
```javascript
try {
  await openaiService.generateAdCopy(params)
} catch (error) {
  if (error.message.includes('Rate limit exceeded')) {
    // Handle rate limiting
  } else if (error.message.includes('Insufficient credits')) {
    // Handle billing issues
  }
}
```

**Social Media API Errors**
```javascript
try {
  await socialMediaService.instagram.createPost(params)
} catch (error) {
  if (error.message.includes('access token')) {
    // Handle token issues
  } else if (error.message.includes('content policy')) {
    // Handle content violations
  }
}
```

### Error Response Format

All services return errors in a consistent format:
```javascript
{
  error: true,
  message: "Human-readable error message",
  code: "ERROR_CODE",
  details: {
    // Additional error context
  }
}
```

## Rate Limiting

### OpenAI Rate Limits
- **GPT-4**: 10,000 tokens per minute
- **DALL-E 3**: 5 images per minute
- **Vision API**: 100 requests per minute

### Social Media Rate Limits
- **Instagram**: 200 API calls per hour per user
- **TikTok**: 100 API calls per day per user (sandbox)

### Handling Rate Limits

```javascript
// Built-in rate limiting for OpenAI
import { aiUtils } from './services/openai'

try {
  await aiUtils.rateLimiter.checkLimit()
  const result = await openaiService.generateAdCopy(params)
} catch (error) {
  if (error.message.includes('Rate limit')) {
    // Wait and retry
    setTimeout(() => {
      // Retry the operation
    }, 60000)
  }
}
```

## Environment Variables

### Required Variables
```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# OpenAI
VITE_OPENAI_API_KEY=sk-your-openai-key
```

### Optional Variables
```env
# Social Media (for production)
VITE_INSTAGRAM_CLIENT_ID=your-instagram-client-id
VITE_INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret
VITE_TIKTOK_CLIENT_ID=your-tiktok-client-id
VITE_TIKTOK_CLIENT_SECRET=your-tiktok-client-secret
```

## Testing

### Mock Data for Development

All services include mock data fallbacks for development:

```javascript
// OpenAI service falls back to mock data if API key is missing
const variations = await openaiService.generateAdCopy(params)
// Returns mock variations if OpenAI API fails

// Social media services return mock responses
const response = await socialMediaService.instagram.createPost(params)
// Returns mock post response for testing
```

### Test Accounts

For social media testing, use dedicated test accounts:
- Instagram: Create a test app and test users
- TikTok: Use sandbox environment with test accounts

## Security Considerations

### API Key Security
- Never expose API keys in client-side code
- Use environment variables for all sensitive data
- Implement proper CORS policies
- Use HTTPS for all API communications

### Data Privacy
- All user data is encrypted in transit and at rest
- Implement proper data retention policies
- Follow GDPR and other privacy regulations
- Use Row Level Security for database access

### Rate Limiting Protection
- Implement client-side rate limiting
- Use exponential backoff for retries
- Monitor API usage and costs
- Set up alerts for unusual activity

---

For more detailed information about specific endpoints or integration patterns, please refer to the individual service documentation or contact the development team.
