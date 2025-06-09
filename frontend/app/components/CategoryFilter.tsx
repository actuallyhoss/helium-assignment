'use client'

import { useTranslationStore } from '../../lib/store'

export function CategoryFilter() {
  const { selectedCategory, setSelectedCategory, categories } = useTranslationStore()
  const availableCategories = categories()

  return (
    <div className="min-w-[200px] relative">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white/70 dark:bg-slate-700/70 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
      >
        <option value="">All Categories</option>
        {availableCategories.map((category) => (
          <option key={category} value={category}>
            {category}
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