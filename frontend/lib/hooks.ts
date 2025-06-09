import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { translationApi } from './api'
import { TranslationKey } from './types'

export const useTranslationKeys = (projectId?: string) => {
  return useQuery({
    queryKey: ['translationKeys', projectId],
    queryFn: () => translationApi.getTranslationKeys(projectId),
  })
}

export const useTranslationKey = (id: string) => {
  return useQuery({
    queryKey: ['translationKey', id],
    queryFn: () => translationApi.getTranslationKey(id),
    enabled: !!id,
  })
}

export const useCreateTranslationKey = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: translationApi.createTranslationKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translationKeys'] })
    },
  })
}

export const useUpdateTranslationKey = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<TranslationKey> }) =>
      translationApi.updateTranslationKey(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translationKeys'] })
      queryClient.invalidateQueries({ queryKey: ['translationKey'] })
    },
  })
}

export const useDeleteTranslationKey = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: translationApi.deleteTranslationKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translationKeys'] })
    },
  })
}

export const useBulkUpdateTranslations = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: translationApi.bulkUpdateTranslations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translationKeys'] })
    },
  })
}

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: translationApi.getProjects,
  })
}

export const useLanguages = () => {
  return useQuery({
    queryKey: ['languages'],
    queryFn: translationApi.getLanguages,
  })
} 