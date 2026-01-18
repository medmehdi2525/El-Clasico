// Browser storage API wrapper
// Using IndexedDB as fallback for browsers that support it
// Otherwise falls back to a simple in-memory storage

let storageData = {}

export const getStorage = (key) => {
  try {
    // Try to use browser storage API if available
    if (typeof window !== 'undefined' && window.storage) {
      return window.storage.get(key)
    }
    // Fallback to localStorage if available
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    }
    // Fallback to in-memory storage
    return storageData[key] || null
  } catch (error) {
    console.error('Error reading storage:', error)
    return storageData[key] || null
  }
}

export const setStorage = (key, value) => {
  try {
    // Try to use browser storage API if available
    if (typeof window !== 'undefined' && window.storage) {
      window.storage.set(key, value)
      return
    }
    // Fallback to localStorage if available
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value))
      return
    }
    // Fallback to in-memory storage
    storageData[key] = value
  } catch (error) {
    console.error('Error writing storage:', error)
    storageData[key] = value
  }
}
