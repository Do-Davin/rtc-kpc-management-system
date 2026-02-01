import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useLanguageStore } from '@/stores/language.store'
import km from '@/locales/km'
import en from '@/locales/en'

const translations = { km, en }

export function useTranslation() {
  const languageStore = useLanguageStore()
  const { currentLanguage } = storeToRefs(languageStore)

  /**
   * Get translation by key path (e.g., 'dashboard.title' or 'stats.myPresence')
   * @param {string} key - Dot notation path to translation
   * @param {object} params - Optional parameters for interpolation
   * @returns {string} - Translated string
   */
  const t = (key, params = {}) => {
    const lang = currentLanguage.value
    const keys = key.split('.')
    
    let value = translations[lang]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to key if translation not found
        console.warn(`Translation not found for key: ${key}`)
        return key
      }
    }
    
    // Handle parameter interpolation (e.g., {count})
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{(\w+)\}/g, (_, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : `{${paramKey}}`
      })
    }
    
    return value
  }

  // Current language reactive reference
  const lang = computed(() => currentLanguage.value)
  
  // Check if current language is Khmer
  const isKhmer = computed(() => currentLanguage.value === 'km')
  
  // Check if current language is English
  const isEnglish = computed(() => currentLanguage.value === 'en')

  return {
    t,
    currentLanguage: lang,
    isKhmer,
    isEnglish,
    setLanguage: languageStore.setLanguage,
    toggleLanguage: languageStore.toggleLanguage,
    languages: languageStore.languages
  }
}
