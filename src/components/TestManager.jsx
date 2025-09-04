import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { TestTube, TrendingUp, Eye, Calendar, Filter } from 'lucide-react'

export default function TestManager() {
  const { state } = useApp()
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  // Mock test posts data
  const mockTestPosts = [
    {
      id: '1',
      platform: 'instagram',
      postUrl: 'https://instagram.com/p/abc123',
      status: 'active',
      createdAt: '2024-01-15T10:00:00Z',
      metrics: {
        views: 1250,
        likes: 89,
        comments: 12,
        shares: 5,
        engagement_rate: 8.5
      }
    },
    {
      id: '2',
      platform: 'tiktok',
      postUrl: 'https://tiktok.com/@user/video/123',
      status: 'completed',
      createdAt: '2024-01-14T15:30:00Z',
      metrics: {
        views: 3420,
        likes: 234,
        comments: 45,
        shares: 23,
        engagement_rate: 8.8
      }
    }
  ]

  const filteredPosts = mockTestPosts.filter(post => 
    filterStatus === 'all' || post.status === filterStatus
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Test Manager</h2>
          <p className="text-white/70">Monitor and analyze your ad test performance</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6 glass-effect">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Active Tests</p>
              <p className="text-2xl font-bold text-white">
                {mockTestPosts.filter(p => p.status === 'active').length}
              </p>
            </div>
            <TestTube className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="card p-6 glass-effect">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Views</p>
              <p className="text-2xl font-bold text-white">
                {mockTestPosts.reduce((sum, post) => sum + post.metrics.views, 0).toLocaleString()}
              </p>
            </div>
            <Eye className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="card p-6 glass-effect">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Avg Engagement</p>
              <p className="text-2xl font-bold text-white">
                {(mockTestPosts.reduce((sum, post) => sum + post.metrics.engagement_rate, 0) / mockTestPosts.length).toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="card p-6 glass-effect">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">
                {mockTestPosts.filter(p => p.status === 'completed').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6 glass-effect">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-white/70" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/10 border border-white/30 text-white px-3 py-2 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/10 border border-white/30 text-white px-3 py-2 rounded-lg"
          >
            <option value="recent">Most Recent</option>
            <option value="engagement">Highest Engagement</option>
            <option value="views">Most Views</option>
          </select>
        </div>
      </div>

      {/* Test Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="card p-8 glass-effect text-center">
            <TestTube className="w-12 h-12 text-white/50 mx-auto mb-3" />
            <p className="text-white/70">No test posts found</p>
            <p className="text-white/50 text-sm">Start by generating and posting some ad variations</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="card p-6 glass-effect">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Post Info */}
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      post.platform === 'instagram' 
                        ? 'bg-gradient-to-br from-pink-500 to-purple-500'
                        : 'bg-gradient-to-br from-black to-gray-700'
                    }`}>
                      {post.platform === 'instagram' ? '📷' : '🎵'}
                    </div>
                    <span className="text-white font-medium capitalize">{post.platform}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      post.status === 'active' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-2">
                    Posted: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  
                  <a
                    href={post.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    View Post →
                  </a>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70 text-sm">Views</span>
                      <span className="text-white font-medium">{post.metrics.views.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70 text-sm">Likes</span>
                      <span className="text-white font-medium">{post.metrics.likes}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70 text-sm">Comments</span>
                      <span className="text-white font-medium">{post.metrics.comments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70 text-sm">Engagement</span>
                      <span className="text-green-400 font-medium">{post.metrics.engagement_rate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}