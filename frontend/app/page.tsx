'use client'

import { TranslationKeyManager } from "./components/TranslationKeyManager";
import { ProjectSelector } from "./components/ProjectSelector";
import { LanguageSelector } from "./components/LanguageSelector";
import { UserProfile } from "./components/UserProfile";
import { Toolbar } from "./components/Toolbar";
import { TranslationStats } from "./components/TranslationStats";
import { AddKeyModal } from "./components/AddKeyModal";
import { DeleteKeyModal } from "./components/DeleteKeyModal";
import Image from "next/image";
import { useState } from "react";
import { useCreateTranslationKey, useDeleteTranslationKey } from "../lib/hooks";
import { TranslationKey } from "../lib/types";

export default function Home() {
  const [isAddKeyModalOpen, setIsAddKeyModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [keyToDelete, setKeyToDelete] = useState<TranslationKey | null>(null)
  const createMutation = useCreateTranslationKey()
  const deleteMutation = useDeleteTranslationKey()

  const handleCreateKey = async (keyData: {
    key: string
    category: string
    description?: string
    translations: Record<string, string>
  }) => {
    try {
      const formattedTranslations: { [languageCode: string]: { value: string; updatedBy: string; updatedAt: string } } = {}
      Object.entries(keyData.translations).forEach(([langCode, value]) => {
        if (value.trim()) {
          formattedTranslations[langCode] = {
            value: value.trim(),
            updatedBy: 'current-user',
            updatedAt: new Date().toISOString()
          }
        }
      })

      await createMutation.mutateAsync({
        key: keyData.key,
        category: keyData.category,
        description: keyData.description,
        translations: formattedTranslations
      })
      setIsAddKeyModalOpen(false)
    } catch (error) {
      console.error('Failed to create translation key:', error)
      alert('Failed to create translation key')
    }
  }

  const handleDeleteKey = (key: TranslationKey) => {
    setKeyToDelete(key)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!keyToDelete) return
    
    try {
      await deleteMutation.mutateAsync(keyToDelete.id)
      setIsDeleteModalOpen(false)
      setKeyToDelete(null)
    } catch (error) {
      console.error('Failed to delete translation key:', error)
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setKeyToDelete(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-200 font-[family-name:var(--font-geist-sans)]">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Helium Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-semibold text-white">Helium</span>
            </div>
            <nav className="flex items-center space-x-4">
              <UserProfile />
            </nav>
          </div>
        </div>
      </header>

      <div className="flex flex-grow container mx-auto px-6 lg:px-8 py-8 gap-8">
        <aside className="w-80 space-y-6">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-sm rounded-xl p-6 border border-slate-200/60 dark:border-slate-700/60">
            <h2 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">
              Project
            </h2>
            <ProjectSelector />
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-sm rounded-xl p-6 border border-slate-200/60 dark:border-slate-700/60">
            <h2 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">
              Languages
            </h2>
            <LanguageSelector />
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-sm rounded-xl p-6 border border-slate-200/60 dark:border-slate-700/60">
            <TranslationStats />
          </div>
        </aside>

        <main className="flex-1 flex flex-col space-y-6">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-sm rounded-xl p-6 border border-slate-200/60 dark:border-slate-700/60">
            <Toolbar onAddKey={() => setIsAddKeyModalOpen(true)} />
          </div>

          <section className="flex-grow bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-sm rounded-xl p-6 border border-slate-200/60 dark:border-slate-700/60">
            <h2 className="text-2xl font-semibold mb-6 text-slate-700 dark:text-slate-300">
              Translation Keys
            </h2>
            <TranslationKeyManager onDeleteKey={handleDeleteKey} />
          </section>
        </main>
      </div>

      <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/60 dark:border-slate-700/60 mt-auto">
        <div className="container mx-auto px-6 lg:px-8 py-6 text-center">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <p className="font-medium">
              <a href="https://hoss.link" target="_blank">
                Built by Ahmed Hossam
              </a>
            </p>
            <p className="mt-1">
              &copy; {new Date().getFullYear()} Helium Translation Management
              System
            </p>
          </div>
        </div>
      </footer>

      <AddKeyModal
        isOpen={isAddKeyModalOpen}
        onClose={() => setIsAddKeyModalOpen(false)}
        onSubmit={handleCreateKey}
        isLoading={createMutation.isPending}
      />

      <DeleteKeyModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        translationKey={keyToDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
