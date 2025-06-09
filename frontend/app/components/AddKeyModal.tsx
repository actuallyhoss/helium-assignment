"use client";

import { useState } from "react";
import { useLanguages } from "../../lib/hooks";

interface AddKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (keyData: {
    key: string;
    category: string;
    description?: string;
    translations: Record<string, string>;
  }) => void;
  isLoading?: boolean;
}

export function AddKeyModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: AddKeyModalProps) {
  const { data: languages } = useLanguages();
  const [formData, setFormData] = useState({
    key: "",
    category: "",
    description: "",
    translations: {} as Record<string, string>,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.key.trim()) {
      newErrors.key = "Key is required";
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.key)) {
      newErrors.key =
        "Key can only contain letters, numbers, dots, underscores, and hyphens";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      key: formData.key.trim(),
      category: formData.category.trim(),
      description: formData.description.trim() || undefined,
      translations: formData.translations,
    });
  };

  const handleTranslationChange = (languageCode: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [languageCode]: value,
      },
    }));
  };

  const resetForm = () => {
    setFormData({
      key: "",
      category: "",
      description: "",
      translations: {},
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between p-6 border-b border-slate-200/60 dark:border-slate-700/60">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              Add Translation Key
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, key: e.target.value }))
                  }
                  placeholder="e.g. button.save"
                  className={`w-full px-4 py-3 border rounded-lg bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                    errors.key
                      ? "border-red-300 dark:border-red-600"
                      : "border-slate-200 dark:border-slate-600"
                  }`}
                />
                {errors.key && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.key}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  placeholder="e.g. buttons, labels"
                  className={`w-full px-4 py-3 border rounded-lg bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                    errors.category
                      ? "border-red-300 dark:border-red-600"
                      : "border-slate-200 dark:border-slate-600"
                  }`}
                />
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.category}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Optional description for this translation key"
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-vertical"
              />
            </div>

            {languages && languages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                  Translations
                </label>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {languages.map((language) => (
                    <div
                      key={language.code}
                      className="flex items-center gap-4 p-3 bg-slate-50/50 dark:bg-slate-700/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-600 px-2 py-1 rounded border w-10 text-center">
                          {language.code.toUpperCase()}
                        </span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {language.name}
                          {language.isDefault && (
                            <span className="ml-1 text-xs text-blue-600 dark:text-blue-400">
                              (default)
                            </span>
                          )}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={formData.translations[language.code] || ""}
                        onChange={(e) =>
                          handleTranslationChange(language.code, e.target.value)
                        }
                        placeholder={`Enter translation...`}
                        className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create Key
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
