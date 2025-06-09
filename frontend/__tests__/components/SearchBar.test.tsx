import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from '../../app/components/SearchBar'
import { useTranslationStore } from '../../lib/store'

// Mock the store
jest.mock('../../lib/store')
const mockUseTranslationStore = useTranslationStore as jest.MockedFunction<typeof useTranslationStore>

describe('SearchBar', () => {
  const mockSetSearchQuery = jest.fn()

  beforeEach(() => {
    mockUseTranslationStore.mockReturnValue({
      searchQuery: '',
      setSearchQuery: mockSetSearchQuery,
    } as any)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders search input', () => {
    render(<SearchBar />)
    
    const input = screen.getByPlaceholderText('Search translation keys...')
    expect(input).toBeInTheDocument()
  })

  it('displays current search query', () => {
    mockUseTranslationStore.mockReturnValue({
      searchQuery: 'test query',
      setSearchQuery: mockSetSearchQuery,
    } as any)

    render(<SearchBar />)
    
    const input = screen.getByDisplayValue('test query')
    expect(input).toBeInTheDocument()
  })

  it('calls setSearchQuery when input changes', () => {
    render(<SearchBar />)
    
    const input = screen.getByPlaceholderText('Search translation keys...')
    fireEvent.change(input, { target: { value: 'new search' } })
    
    expect(mockSetSearchQuery).toHaveBeenCalledWith('new search')
  })
}) 