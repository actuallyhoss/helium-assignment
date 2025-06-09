import { useTranslationStore } from '../../lib/store'
import { TranslationKey } from '../../lib/types'

const mockTranslationKey: TranslationKey = {
  id: '1',
  key: 'test.key',
  category: 'test',
  description: 'Test key',
  translations: {
    en: {
      value: 'Test value',
      updatedAt: '2023-01-01T00:00:00Z',
      updatedBy: 'test-user'
    }
  }
}

describe('Translation Store', () => {
  beforeEach(() => {
    // Reset store state
    useTranslationStore.setState({
      translationKeys: [],
      selectedProject: null,
      selectedLanguages: [],
      searchQuery: '',
      selectedCategory: '',
      isLoading: false,
      error: null,
    })
  })

  it('should set translation keys', () => {
    const { setTranslationKeys } = useTranslationStore.getState()
    
    setTranslationKeys([mockTranslationKey])
    
    const { translationKeys } = useTranslationStore.getState()
    expect(translationKeys).toHaveLength(1)
    expect(translationKeys[0]).toEqual(mockTranslationKey)
  })

  it('should add translation key', () => {
    const { addTranslationKey } = useTranslationStore.getState()
    
    addTranslationKey(mockTranslationKey)
    
    const { translationKeys } = useTranslationStore.getState()
    expect(translationKeys).toHaveLength(1)
    expect(translationKeys[0]).toEqual(mockTranslationKey)
  })

  it('should update translation key', () => {
    const { setTranslationKeys, updateTranslationKey } = useTranslationStore.getState()
    
    setTranslationKeys([mockTranslationKey])
    updateTranslationKey('1', { description: 'Updated description' })
    
    const { translationKeys } = useTranslationStore.getState()
    expect(translationKeys[0].description).toBe('Updated description')
  })

  it('should delete translation key', () => {
    const { setTranslationKeys, deleteTranslationKey } = useTranslationStore.getState()
    
    setTranslationKeys([mockTranslationKey])
    deleteTranslationKey('1')
    
    const { translationKeys } = useTranslationStore.getState()
    expect(translationKeys).toHaveLength(0)
  })

  it('should filter keys by search query', () => {
    const { setTranslationKeys, setSearchQuery, filteredKeys } = useTranslationStore.getState()
    
    setTranslationKeys([mockTranslationKey])
    setSearchQuery('test')
    
    const filtered = filteredKeys()
    expect(filtered).toHaveLength(1)
    
    setSearchQuery('nonexistent')
    const filteredEmpty = filteredKeys()
    expect(filteredEmpty).toHaveLength(0)
  })

  it('should filter keys by category', () => {
    const { setTranslationKeys, setSelectedCategory, filteredKeys } = useTranslationStore.getState()
    
    setTranslationKeys([mockTranslationKey])
    setSelectedCategory('test')
    
    const filtered = filteredKeys()
    expect(filtered).toHaveLength(1)
    
    setSelectedCategory('other')
    const filteredEmpty = filteredKeys()
    expect(filteredEmpty).toHaveLength(0)
  })

  it('should get categories from translation keys', () => {
    const { setTranslationKeys, categories } = useTranslationStore.getState()
    
    const keys = [
      { ...mockTranslationKey, category: 'buttons' },
      { ...mockTranslationKey, id: '2', category: 'labels' },
      { ...mockTranslationKey, id: '3', category: 'buttons' }
    ]
    
    setTranslationKeys(keys)
    
    const cats = categories()
    expect(cats).toEqual(['buttons', 'labels'])
  })
}) 