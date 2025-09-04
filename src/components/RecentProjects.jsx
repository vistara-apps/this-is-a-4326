import React from 'react'
import { useApp } from '../context/AppContext'
import { Calendar, Image } from 'lucide-react'

export default function RecentProjects() {
  const { state, dispatch } = useApp()
  const { projects } = state

  const handleProjectClick = (project) => {
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: project })
  }

  return (
    <div className="card p-6 glass-effect">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Projects</h3>
      
      {projects.length === 0 ? (
        <div className="text-center py-8">
          <Image className="w-12 h-12 text-white/50 mx-auto mb-3" />
          <p className="text-white/70">No projects yet</p>
          <p className="text-white/50 text-sm">Create your first ad generation project</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.slice(0, 3).map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className="p-4 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center">
                  <Image className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">
                    Project {project.id.slice(-4)}
                  </h4>
                  <div className="flex items-center space-x-2 text-white/60 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}