'use client'

import { useState } from 'react'
import { TranslationKey } from '../../lib/types'
import { useUpdateTranslationKey } from '../../lib/hooks'
import { useLanguages } from '../../lib/hooks'

interface TranslationEditorProps {
  translationKey: TranslationKey
  onSave: () => void
  onCancel: () => void
}

export function TranslationEditor({ translationKey, onSave, onCancel }: TranslationEditorProps) {
  const [editedTranslations, setEditedTranslations] = useState(translationKey.translations)
  const [editedKey, setEditedKey] = useState(translationKey.key)
  const [editedDescription, setEditedDescription] = useState(translationKey.description || '')
  
  const { data: languages } = useLanguages()
  const updateMutation = useUpdateTranslationKey()

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        id: translationKey.id,
        updates: {
          key: editedKey,
          description: editedDescription,
          translations: editedTranslations
        }
      })
      onSave()
    } catch (error) {
      console.error('Failed to update translation:', error)
    }
  }

  const handleTranslationChange = (langCode: string, value: string) => {
    setEditedTranslations(prev => ({
      ...prev,
      [langCode]: {
        ...prev[langCode],
        value,
        updatedBy: 'current-user',
        updatedAt: new Date().toISOString()
      }
    }))
  }

    return (
    <div className="space-y-6 border-t border-slate-200 dark:border-slate-700 pt-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Translation Key
          </label>
          <input
            type="text"
            value={editedKey}
            onChange={(e) => setEditedKey(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white/70 dark:bg-slate-700/70 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Description
          </label>
          <input
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Optional description..."
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white/70 dark:bg-slate-700/70 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Translations</h4>
        {languages?.map((language) => (
          <div key={language.code} className="flex items-center gap-4 p-3 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-3 min-w-[120px]">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-600 px-2 py-1 rounded border w-10 text-center">
                {language.code.toUpperCase()}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {language.name}
              </span>
            </div>
            <input
              type="text"
              value={editedTranslations[language.code]?.value || ''}
              onChange={(e) => handleTranslationChange(language.code, e.target.value)}
              placeholder={`Enter ${language.name} translation...`}
              className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 text-sm font-medium transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  )
} 