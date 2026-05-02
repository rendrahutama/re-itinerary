import { useState, useRef, useEffect } from 'react'

export default function LocationInput({ value, onSelect }) {
  const [query, setQuery] = useState(value?.name || '')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef()

  // Sync display if parent resets the field (e.g. form clear)
  useEffect(() => {
    if (!value?.name) setQuery('')
  }, [value?.name])

  const search = (q) => {
    clearTimeout(debounceRef.current)
    if (q.trim().length < 3) {
      setSuggestions([])
      setOpen(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const url =
          `https://nominatim.openstreetmap.org/search` +
          `?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`
        const res = await fetch(url, {
          headers: { 'Accept-Language': 'en' },
        })
        const data = await res.json()
        setSuggestions(data)
        setOpen(data.length > 0)
      } catch {
        setSuggestions([])
        setOpen(false)
      }
      setLoading(false)
    }, 600)
  }

  const handleChange = (e) => {
    const q = e.target.value
    setQuery(q)
    // clear saved coords while user is re-typing
    onSelect({ name: q, address: '', lat: null, lng: null })
    search(q)
  }

  const handleSelect = (place) => {
    const name = place.name || place.display_name.split(',')[0].trim()
    const location = {
      name,
      address: place.display_name,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    }
    setQuery(name)
    setSuggestions([])
    setOpen(false)
    onSelect(location)
  }

  const handleBlur = () => {
    // delay so onMouseDown on a suggestion fires first
    setTimeout(() => setOpen(false), 180)
  }

  const hasCoords = value?.lat && value?.lng
  const hint = value?.address
    ? `${value.address}${hasCoords ? `  (${Number(value.lat).toFixed(5)}, ${Number(value.lng).toFixed(5)})` : ''}`
    : 'Location address will be here after selecting, it will save the lat, long also'

  return (
    <div className="location-wrapper">
      <input
        type="text"
        className="form-input"
        placeholder="Type location...."
        value={query}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        autoComplete="off"
      />

      {loading && <p className="form-hint">Searching...</p>}

      {open && suggestions.length > 0 && (
        <ul className="location-suggestions">
          {suggestions.map((place) => (
            <li key={place.place_id} onMouseDown={() => handleSelect(place)}>
              <span className="suggestion-name">
                {place.name || place.display_name.split(',')[0].trim()}
              </span>
              <span className="suggestion-addr">{place.display_name}</span>
            </li>
          ))}
        </ul>
      )}

      {!open && !loading && <p className="form-hint">{hint}</p>}
    </div>
  )
}
