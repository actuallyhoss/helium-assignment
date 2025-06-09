'use client'

import { useProjects } from '../../lib/hooks'
import { useTranslationStore } from '../../lib/store'

export function ProjectSelector() {
  const { data: projects, isLoading } = useProjects()
  const { selectedProject, setSelectedProject } = useTranslationStore()

  if (isLoading) {
    return (
      <div className="relative">
        <div className="w-full px-4 py-3 border border-slate-200/60 dark:border-slate-600/60 rounded-lg bg-white/80 dark:bg-slate-700/80 text-slate-400 dark:text-slate-400">
          Loading projects...
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <select
        value={selectedProject?.id || ''}
        onChange={(e) => {
          const project = projects?.find(p => p.id === e.target.value)
          setSelectedProject(project || null)
        }}
        className="w-full px-4 py-3 border border-slate-200/60 dark:border-slate-600/60 rounded-lg bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer text-sm"
      >
        <option value="">All Projects</option>
        {projects?.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
} 