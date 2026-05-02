const STORAGE_KEY = 'reitinerary_data'
const DEFAULT_API_BASE_URL = 'http://localhost:8080'

export function installLocalStorageImportBridge() {
  if (typeof window === 'undefined') return

  window.importReitineraryLocalStorage = async function importReitineraryLocalStorage(
    apiBaseUrl = DEFAULT_API_BASE_URL
  ) {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      throw new Error(`No localStorage value found for "${STORAGE_KEY}"`)
    }

    let itineraries
    try {
      itineraries = JSON.parse(raw)
    } catch (error) {
      throw new Error(`Failed to parse "${STORAGE_KEY}": ${error.message}`)
    }

    if (!Array.isArray(itineraries) || itineraries.length === 0) {
      throw new Error(`"${STORAGE_KEY}" does not contain any itineraries`)
    }

    const response = await fetch(`${apiBaseUrl}/api/import/local-storage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        replaceExisting: true,
        itineraries,
      }),
    })

    const payload = await response.json()
    if (!response.ok) {
      throw new Error(payload.error || 'LocalStorage import failed')
    }

    console.info('Imported localStorage itineraries into SQLite:', payload)
    return payload
  }
}
