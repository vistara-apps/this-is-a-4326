import React from 'react'
import { useApp } from '../context/AppContext'
import { TrendingUp, Zap, TestTube, Clock } from 'lucide-react'
import StatsCard from './StatsCard'
import RecentProjects from './RecentProjects'

export default function Dashboard() {
  const { state } = useApp()
  const { projects, adVariations, testPosts } = state

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Ad Variations',
      value: adVariations.length,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Test Posts',
      value: testPosts.length,
      icon: TestTube,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Active Tests',
      value: testPosts.filter(post => post.status === 'active').length,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
        <p className="text-white/70">Generate and test ad creative variations instantly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjects />
        <div className="card p-6 glass-effect">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left">
              + Create New Project
            </button>
            <button className="w-full btn-secondary text-left">
              View Test Results
            </button>
            <button className="w-full btn-secondary text-left">
              Connect Social Accounts
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}