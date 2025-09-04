import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database service functions
export const supabaseService = {
  // User operations
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Project operations
  async createProject(projectData) {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        user_id: projectData.userId,
        product_image: projectData.productImage,
        metadata: {
          platforms: projectData.platforms,
          variationCount: projectData.variationCount,
          adType: projectData.adType
        },
        created_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getProjects(userId) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getProject(projectId) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()
    
    if (error) throw error
    return data
  },

  // Ad Variation operations
  async createAdVariation(variationData) {
    const { data, error } = await supabase
      .from('ad_variations')
      .insert([{
        project_id: variationData.projectId,
        platform: variationData.platform,
        creative_type: variationData.creativeType,
        visual_asset_url: variationData.visualAssetUrl,
        text_copy: variationData.textCopy,
        status: variationData.status || 'generated',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAdVariations(projectId) {
    const { data, error } = await supabase
      .from('ad_variations')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async updateAdVariation(variationId, updates) {
    const { data, error } = await supabase
      .from('ad_variations')
      .update(updates)
      .eq('id', variationId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Test Post operations
  async createTestPost(testPostData) {
    const { data, error } = await supabase
      .from('test_posts')
      .insert([{
        ad_variation_id: testPostData.adVariationId,
        platform: testPostData.platform,
        account_id: testPostData.accountId,
        post_url: testPostData.postUrl,
        status: testPostData.status || 'posted',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getTestPosts(adVariationId) {
    const { data, error } = await supabase
      .from('test_posts')
      .select('*')
      .eq('ad_variation_id', adVariationId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getAllTestPosts(userId) {
    const { data, error } = await supabase
      .from('test_posts')
      .select(`
        *,
        ad_variations!inner(
          *,
          projects!inner(
            user_id
          )
        )
      `)
      .eq('ad_variations.projects.user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // File storage operations
  async uploadFile(bucket, path, file) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) throw error
    return data
  },

  async getFileUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  },

  async deleteFile(bucket, path) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) throw error
  }
}
