'use client'

import { useState } from 'react'
import { useTranslationKeys, useDeleteTranslationKey } from '../../lib/hooks'
import { useTranslationStore } from '../../lib/store'
import { TranslationEditor } from './TranslationEditor'

export function TranslationKeyManager() {
  const { selectedProject, searchQuery, selectedCategory, selectedLanguages, filteredKeys, deleteTranslationKey } = useTranslationStore()
  const { data: translationKeys, isLoading, error } = useTranslationKeys(selectedProject?.id)
  const deleteMutation = useDeleteTranslationKey()
  const [editingKeyId, setEditingKeyId] = useState<string | null>(null)

  const setTranslationKeys = useTranslationStore(state => state.setTranslationKeys)
  
  if (translationKeys && translationKeys !== useTranslationStore.getState().translationKeys) {
    setTranslationKeys(translationKeys)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500 dark:text-slate-400">Loading translations...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500 dark:text-red-400">Error loading translations: {error.message}</div>
      </div>
    )
  }

  const displayKeys = filteredKeys()

  const handleDelete = async (keyId: string) => {
    if (confirm('Are you sure you want to delete this translation key?')) {
      try {
        await deleteMutation.mutateAsync(keyId)
        deleteTranslationKey(keyId)
      } catch (error) {
        console.error('Failed to delete translation key:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {displayKeys.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
              {searchQuery || selectedCategory || selectedLanguages.length > 0
                ? 'No translations match your filters' 
                : 'No translation keys found'
              }
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              {!searchQuery && !selectedCategory && selectedLanguages.length === 0 ? 'Create your first translation key to get started' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          displayKeys.map((key) => (
            <div
              key={key.id}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                    {key.key}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-700/80 px-2.5 py-1 rounded-full">
                    {key.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingKeyId(editingKeyId === key.id ? null : key.id)}
                    className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                    title={editingKeyId === key.id ? 'Cancel editing' : 'Edit translation'}
                  >
                    {editingKeyId === key.id ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(key.id)}
                    className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    title="Delete translation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {key.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 p-3 bg-slate-50/80 dark:bg-slate-700/50 rounded-lg border border-slate-200/50 dark:border-slate-600/50">
                  {key.description}
                </p>
              )}

              {editingKeyId === key.id ? (
                <TranslationEditor
                  translationKey={key}
                  onSave={() => setEditingKeyId(null)}
                  onCancel={() => setEditingKeyId(null)}
                />
              ) : (
                <div className="space-y-3">
                  {Object.entries(key.translations).map(([langCode, translation]) => (
                    <div key={langCode} className="flex items-center gap-4 p-3 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-600 px-2 py-1 rounded border w-10 text-center">
                          {langCode.toUpperCase()}
                        </span>
                      </div>
                      <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                        {translation.value || <em className="text-slate-400 dark:text-slate-500">No translation</em>}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
} 