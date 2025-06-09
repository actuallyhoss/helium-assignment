import { TranslationKey, Project, Language } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const translationApi = {
  async getTranslationKeys(projectId?: string): Promise<TranslationKey[]> {
    const url = new URL(`${API_BASE_URL}/translation-keys`)
    if (projectId) {
      url.searchParams.set('project_id', projectId)
    }
    
    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`Failed to fetch translation keys: ${response.statusText}`)
    }
    
    return response.json()
  },

  async getTranslationKey(id: string): Promise<TranslationKey | null> {
    const response = await fetch(`${API_BASE_URL}/translation-keys/${id}`)
    
    if (response.status === 404) {
      return null
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch translation key: ${response.statusText}`)
    }
    
    return response.json()
  },

  async createTranslationKey(key: Omit<TranslationKey, 'id'>): Promise<TranslationKey> {
    const response = await fetch(`${API_BASE_URL}/translation-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(key),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to create translation key: ${response.statusText}`)
    }
    
    return response.json()
  },

  async updateTranslationKey(id: string, updates: Partial<TranslationKey>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/translation-keys/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to update translation key: ${response.statusText}`)
    }
  },

  async deleteTranslationKey(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/translation-keys/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete translation key: ${response.statusText}`)
    }
  },

  async bulkUpdateTranslations(updates: Array<{
    keyId: string
    languageCode: string
    value: string
    updatedBy: string
  }>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/translation-keys/bulk-update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updates }),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to bulk update translations: ${response.statusText}`)
    }
  },
  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/projects`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`)
    }
    
    return response.json()
  },
  async getLanguages(): Promise<Language[]> {
    const response = await fetch(`${API_BASE_URL}/languages`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch languages: ${response.statusText}`)
    }
    
    return response.json()
  }
} 