'use client'

import { useLanguages } from '../../lib/hooks'
import { useTranslationStore } from '../../lib/store'

export function LanguageSelector() {
  const { data: languages, isLoading } = useLanguages()
  const { selectedLanguages, setSelectedLanguages } = useTranslationStore()

  if (isLoading) {
    return (
      <div className="text-sm text-slate-400 dark:text-slate-400 py-4 text-center">
        Loading languages...
      </div>
    )
  }

  const handleLanguageToggle = (languageCode: string) => {
    const language = languages?.find(l => l.code === languageCode)
    if (!language) return

    const isSelected = selectedLanguages.some(l => l.code === languageCode)
    
    if (isSelected) {
      setSelectedLanguages(selectedLanguages.filter(l => l.code !== languageCode))
    } else {
      setSelectedLanguages([...selectedLanguages, language])
    }
  }

  return (
    <div className="space-y-3">
      {languages?.map((language) => {
        const isSelected = selectedLanguages.some(l => l.code === language.code)
        return (
          <label key={language.code} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleLanguageToggle(language.code)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500/20 focus:ring-2 transition-all duration-200"
            />
            <div className="flex-1 flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                  {language.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 font-mono">
                  {language.code.toUpperCase()}
                </span>
              </div>
              {language.isDefault && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                  Default
                </span>
              )}
            </div>
          </label>
        )
      })}
    </div>
  )
} 