'use client'

import { TranslationKey } from '../../lib/types'

interface DeleteKeyModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  translationKey: TranslationKey | null
  isLoading?: boolean
}

export function DeleteKeyModal({ isOpen, onClose, onConfirm, translationKey, isLoading = false }: DeleteKeyModalProps) {
  if (!isOpen || !translationKey) return null

  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between p-6 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                Delete Translation Key
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="text-center">
              <p className="text-slate-700 dark:text-slate-300 text-lg">
                Are you sure you want to delete this key?
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                This action cannot be undone.
              </p>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-700/30 rounded-lg p-4 border border-slate-200/50 dark:border-slate-600/50">
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Key</span>
                  <p className="font-mono text-sm text-slate-800 dark:text-slate-200 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded border border-blue-200/50 dark:border-blue-700/50 inline-block ml-2">
                    {translationKey.key}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Category</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-700/80 px-2 py-1 rounded ml-2">
                    {translationKey.category}
                  </span>
                </div>
                {translationKey.description && (
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Description</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {translationKey.description}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Translations</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {Object.keys(translationKey.translations).length} language{Object.keys(translationKey.translations).length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Key
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 