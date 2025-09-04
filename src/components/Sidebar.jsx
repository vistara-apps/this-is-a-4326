import React from 'react'
import { LayoutDashboard, Zap, TestTube, Settings, BarChart } from 'lucide-react'
import { clsx } from 'clsx'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'generate', label: 'Generate Ads', icon: Zap },
  { id: 'test-manager', label: 'Test Manager', icon: TestTube },
  { id: 'analytics', label: 'Analytics', icon: BarChart },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white/10 backdrop-blur-md border-r border-white/20 p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={clsx(
                'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200',
                activeView === item.id
                  ? 'bg-white/20 text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}