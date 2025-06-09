'use client'

import { SearchBar } from './SearchBar'
import { CategoryFilter } from './CategoryFilter'
import { useTranslationStore } from '../../lib/store'
import { useCreateTranslationKey } from '../../lib/hooks'

export function Toolbar() {
  const { filteredKeys } = useTranslationStore()
  const createMutation = useCreateTranslationKey()

  const handleCreateKey = async () => {
    const key = prompt('Enter translation key:')
    if (key) {
      const category = prompt('Enter category (optional):') || 'general'
      const description = prompt('Enter description (optional):') || ''
      
      try {
        await createMutation.mutateAsync({
          key,
          category,
          description,
          translations: {}
        })
      } catch (error) {
        console.error('Failed to create translation key:', error)
        alert('Failed to create translation key')
      }
    }
  }

  const handleExport = () => {
    const keys = filteredKeys()
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalKeys: keys.length,
      translations: keys
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `translations-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-4 flex-1">
        <SearchBar />
        <CategoryFilter />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleCreateKey}
          disabled={createMutation.isPending}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {createMutation.isPending ? 'Adding...' : 'Add Key'}
        </button>
        <button 
          onClick={handleExport}
          className="px-5 py-2.5 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          Export
        </button>
      </div>
    </div>
  )
} 