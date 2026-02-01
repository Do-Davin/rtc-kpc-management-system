import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLanguageStore = defineStore('language', () => {
  // Get saved language from localStorage or default to 'km' (Khmer)
  const currentLanguage = ref(localStorage.getItem('app-language') || 'km')

  // Available languages
  const languages = [
    { code: 'km', name: 'ខ្មែរ', flag: '🇰🇭' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ]

  // Get current language object
  const currentLang = computed(() => {
    return languages.find(lang => lang.code === currentLanguage.value) || languages[0]
  })

  // Set language
  const setLanguage = (langCode) => {
    currentLanguage.value = langCode
    localStorage.setItem('app-language', langCode)
  }

  // Toggle between languages
  const toggleLanguage = () => {
    const newLang = currentLanguage.value === 'km' ? 'en' : 'km'
    setLanguage(newLang)
  }

  return {
    currentLanguage,
    languages,
    currentLang,
    setLanguage,
    toggleLanguage
  }
})
