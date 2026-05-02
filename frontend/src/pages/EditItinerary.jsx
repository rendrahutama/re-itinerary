import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import { DateInput } from '../components/DateInput'
import { useItinerary } from '../context/ItineraryContext'

const CURRENCIES = ['IDR', 'AUD', 'USD', 'SGD']

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function EditItinerary() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getItinerary, addItinerary, updateItinerary, deleteItinerary, loading, error } = useItinerary()
  const isNew = !id || id === 'new'
  const existing = isNew ? null : getItinerary(id)

  const [form, setForm] = useState({
    name: existing?.name ?? '',
    description: existing?.description ?? '',
    startDate: existing?.startDate ?? todayStr(),
    currency: existing?.currency ?? 'IDR',
    image: existing?.image ?? null,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!existing) return
    setForm({
      name: existing.name ?? '',
      description: existing.description ?? '',
      startDate: existing.startDate ?? todayStr(),
      currency: existing.currency ?? 'IDR',
      image: existing.image ?? null,
    })
  }, [existing])

  const fileRef = useRef()
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => set('image', ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert('Please enter an itinerary name.')
      return
    }
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      startDate: form.startDate || todayStr(),
      currency: form.currency,
      image: form.image,
    }
    setSaving(true)
    try {
      if (isNew) {
        const newId = await addItinerary(payload)
        navigate(`/itinerary/${newId}`)
      } else {
        await updateItinerary(id, payload)
        navigate(`/itinerary/${id}`)
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this itinerary? This cannot be undone.')) return
    setSaving(true)
    try {
      await deleteItinerary(id)
      navigate('/')
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!isNew && loading && !existing) {
    return (
      <>
        <Header right={<Link to="/" className="header-link">My Itinerary List</Link>} />
        <div className="page" style={{ textAlign: 'center', marginTop: 60 }}>
          <p>Loading itinerary...</p>
        </div>
      </>
    )
  }

  if (!isNew && !existing) {
    return (
      <>
        <Header right={<Link to="/" className="header-link">My Itinerary List</Link>} />
        <div className="page" style={{ textAlign: 'center', marginTop: 60 }}>
          <p>Itinerary not found.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header right={<Link to="/" className="header-link">My Itinerary List</Link>} />

      <div className="page-wide">
        {error && (
          <div style={{ textAlign: 'center', color: 'var(--red-icon)', marginBottom: 24 }}>
            Failed to sync itinerary: {error}
          </div>
        )}

        <h2 className="edit-page-title">
          {isNew ? 'Add a New Itinerary' : 'Edit Itinerary'}
        </h2>

        <div className="edit-two-col">
          {/* Left column */}
          <div>
            <p className="form-section-label" style={{ marginTop: 0 }}>Itinerary Highlights</p>

            <div className="form-field">
              <input
                type="text"
                className="form-input"
                placeholder="Itinerary name, example: Bandung 2026, Hanoi Solo Trip 2027"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />
            </div>

            <div className="form-field">
              <textarea
                className="form-textarea"
                placeholder="Itinerary Description"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={6}
              />
            </div>

            <p className="form-section-label">Itinerary Details</p>

            <div className="form-field" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                Planned Date
              </label>
              <DateInput
                value={form.startDate}
                onChange={(e) => set('startDate', e.target.value)}
              />
            </div>

            <div className="form-field" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                Currency used
              </label>
              <select
                className="form-select"
                value={form.currency}
                onChange={(e) => set('currency', e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-btn-row">
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                <span className="btn-icon-circle">+</span>
                Save Itinerary
              </button>
              {!isNew && (
                <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                  Delete Itinerary
                </button>
              )}
              <button
                className="btn btn-cancel"
                disabled={saving}
                onClick={() => navigate(isNew ? '/' : `/itinerary/${id}`)}
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Right column — image upload */}
          <div>
            <div
              className="image-upload-box"
              onClick={() => fileRef.current?.click()}
              title="Click to upload image"
            >
              {form.image && <img src={form.image} alt="Itinerary cover" />}
              <label className="image-upload-label" style={{ cursor: 'pointer' }}>
                <span className="btn-icon-circle">+</span>
                Upload an Image
              </label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                disabled={saving}
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
