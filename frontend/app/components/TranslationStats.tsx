'use client'

import { useTranslationStore } from '../../lib/store'
import { useLanguages } from '../../lib/hooks'

export function TranslationStats() {
  const { filteredKeys } = useTranslationStore()
  const { data: languages } = useLanguages()
  
  const keys = filteredKeys()
  const totalKeys = keys.length
  
  if (!languages || totalKeys === 0) {
    return null
  }

  const stats = languages.map(language => {
    const translatedCount = keys.filter(key => 
      key.translations[language.code]?.value?.trim()
    ).length
    
    const percentage = totalKeys > 0 ? Math.round((translatedCount / totalKeys) * 100) : 0
    
    return {
      language: language.name,
      code: language.code,
      translated: translatedCount,
      total: totalKeys,
      percentage
    }
  })

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">
        Progress
      </h3>
      <div className="space-y-4">
        {stats.map(stat => (
          <div key={stat.code} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {stat.language}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded uppercase font-mono">
                  {stat.code}
                </span>
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {stat.translated}/{stat.total}
              </span>
            </div>
            <div className="w-full bg-slate-200/60 dark:bg-slate-700/60 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${stat.percentage}%` }}
              />
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {stat.percentage}% complete
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 