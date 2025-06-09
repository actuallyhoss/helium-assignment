import { create } from 'zustand'
import { TranslationKey, Language, Project } from './types'

interface TranslationStore {
  // State
  translationKeys: TranslationKey[]
  selectedProject: Project | null
  selectedLanguages: Language[]
  searchQuery: string
  selectedCategory: string
  isLoading: boolean
  error: string | null

  // Actions
  setTranslationKeys: (keys: TranslationKey[]) => void
  addTranslationKey: (key: TranslationKey) => void
  updateTranslationKey: (id: string, updates: Partial<TranslationKey>) => void
  deleteTranslationKey: (id: string) => void
  setSelectedProject: (project: Project | null) => void
  setSelectedLanguages: (languages: Language[]) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Computed
  filteredKeys: () => TranslationKey[]
  categories: () => string[]
}

export const useTranslationStore = create<TranslationStore>((set, get) => ({
  // Initial state
  translationKeys: [],
  selectedProject: null,
  selectedLanguages: [],
  searchQuery: '',
  selectedCategory: '',
  isLoading: false,
  error: null,

  // Actions
  setTranslationKeys: (keys) => set({ translationKeys: keys }),
  
  addTranslationKey: (key) => set((state) => ({
    translationKeys: [...state.translationKeys, key]
  })),
  
  updateTranslationKey: (id, updates) => set((state) => ({
    translationKeys: state.translationKeys.map(key =>
      key.id === id ? { ...key, ...updates } : key
    )
  })),
  
  deleteTranslationKey: (id) => set((state) => ({
    translationKeys: state.translationKeys.filter(key => key.id !== id)
  })),
  
  setSelectedProject: (project) => set({ selectedProject: project }),
  setSelectedLanguages: (languages) => set({ selectedLanguages: languages }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Computed values
  filteredKeys: () => {
    const { translationKeys, searchQuery, selectedCategory, selectedLanguages } = get()
    
    return translationKeys.filter(key => {
      const matchesSearch = !searchQuery || 
        key.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        key.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = !selectedCategory || key.category === selectedCategory
      
      const matchesLanguage = selectedLanguages.length === 0 || 
        selectedLanguages.some(lang => key.translations[lang.code])
      
      return matchesSearch && matchesCategory && matchesLanguage
    })
  },
  
  categories: () => {
    const { translationKeys } = get()
    const categorySet = new Set(translationKeys.map(key => key.category))
    return Array.from(categorySet).sort()
  }
})) 