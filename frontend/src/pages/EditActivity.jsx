import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import { DatetimeInput } from '../components/DateInput'
import LocationInput from '../components/LocationInput'
import { useItinerary } from '../context/ItineraryContext'
import { ACTIVITY_TYPES } from '../data/activityTypes'
const TICKET_STATUSES = ['Secured', 'Unbooked', 'Go Show']

function fmtCostInput(val) {
  const raw = String(val || '').replace(/[^\d]/g, '')
  if (!raw) return ''
  return parseInt(raw, 10).toLocaleString('en-US')
}

function parseCostInput(val) {
  return parseFloat(String(val || '').replace(/,/g, '')) || 0
}

function formatDatetimeLocal(date) {
  const pad = (n) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function getDefaultActivityDatetime(itinerary) {
  const sorted = [...(itinerary?.activities || [])].sort((a, b) => a.sortOrder - b.sortOrder)
  const previous = [...sorted].reverse().find((activity) => activity.datetime)

  if (previous?.datetime) {
    const previousDate = new Date(previous.datetime)
    if (!Number.isNaN(previousDate.getTime())) {
      previousDate.setHours(previousDate.getHours() + 1)
      return formatDatetimeLocal(previousDate)
    }
  }

  if (itinerary?.startDate) {
    return `${itinerary.startDate}T09:00`
  }

  return formatDatetimeLocal(new Date())
}

export default function EditActivity() {
  const { id: itineraryId, activityId } = useParams()
  const navigate = useNavigate()
  const { getItinerary, addActivity, updateActivity, deleteActivity, loading, error } = useItinerary()

  const itinerary = getItinerary(itineraryId)
  const isNew = !activityId || activityId === 'new'
  const existing = isNew ? null : itinerary?.activities?.find((a) => a.id === activityId)

  const [form, setForm] = useState({
    datetime: existing?.datetime ?? getDefaultActivityDatetime(itinerary),
    type: existing?.type ?? '',
    identification: existing?.identification ?? '',
    location: existing?.location ?? { name: '', address: '', lat: null, lng: null },
    cost: existing?.cost ? fmtCostInput(existing.cost) : '',
    ticketStatus: existing?.ticketStatus ?? '',
    details: existing?.details ?? '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isNew) {
      setForm((current) => ({
        ...current,
        datetime: current.datetime || getDefaultActivityDatetime(itinerary),
      }))
      return
    }

    if (!existing) return
    setForm({
      datetime: existing.datetime ?? getDefaultActivityDatetime(itinerary),
      type: existing.type ?? '',
      identification: existing.identification ?? '',
      location: existing.location ?? { name: '', address: '', lat: null, lng: null },
      cost: existing.cost ? fmtCostInput(existing.cost) : '',
      ticketStatus: existing.ticketStatus ?? '',
      details: existing.details ?? '',
    })
  }, [existing, isNew, itinerary])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSave = async () => {
    const payload = {
      datetime: form.datetime || getDefaultActivityDatetime(itinerary),
      type: form.type || 'Other',
      identification: form.identification.trim(),
      location: form.location,
      cost: parseCostInput(form.cost),
      ticketStatus: form.ticketStatus || null,
      details: form.details.trim(),
    }
    setSaving(true)
    try {
      if (isNew) {
        await addActivity(itineraryId, payload)
      } else {
        await updateActivity(itineraryId, activityId, payload)
      }
      navigate(`/itinerary/${itineraryId}`)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this activity?')) return
    setSaving(true)
    try {
      await deleteActivity(itineraryId, activityId)
      navigate(`/itinerary/${itineraryId}`)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading && !itinerary) {
    return (
      <>
        <Header right={<Link to="/" className="header-link">My Itinerary List</Link>} />
        <div className="page" style={{ textAlign: 'center', marginTop: 60 }}>
          <p>Loading itinerary...</p>
        </div>
      </>
    )
  }

  if (!itinerary) {
    return (
      <>
        <Header right={<Link to="/" className="header-link">My Itinerary List</Link>} />
        <div className="page" style={{ textAlign: 'center', marginTop: 60 }}>
          <p>Itinerary not found.</p>
        </div>
      </>
    )
  }

  const currency = itinerary.currency || 'IDR'

  return (
    <>
      <Header right={<Link to="/" className="header-link">My Itinerary List</Link>} />

      <div className="page-wide">
        {error && (
          <div style={{ textAlign: 'center', color: 'var(--red-icon)', marginBottom: 24 }}>
            Failed to sync activity: {error}
          </div>
        )}

        <div style={{ maxWidth: 680 }}>
          <div className="activity-form-grid">
            {/* Date Time */}
            <label className="activity-form-label">Date Time</label>
            <div className="activity-form-field">
              <DatetimeInput
                value={form.datetime}
                onChange={(e) => set('datetime', e.target.value)}
              />
            </div>

            <div /><div style={{ height: 8 }} />

            {/* Activity type */}
            <label className="activity-form-label">New Activity</label>
            <div className="activity-form-field">
              <select
                className="form-select"
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
              >
                <option value="" disabled>Select activity type</option>
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Identification */}
            <div />
            <div className="activity-form-field">
              <input
                type="text"
                className="form-input"
                placeholder="Identification (e.g. GA-417 for Flight)"
                value={form.identification}
                onChange={(e) => set('identification', e.target.value)}
              />
            </div>

            <div /><div style={{ height: 8 }} />

            {/* Location */}
            <label className="activity-form-label">Location</label>
            <div className="activity-form-field">
              <LocationInput
                value={form.location}
                onSelect={(loc) => set('location', loc)}
              />
            </div>

            <div /><div style={{ height: 8 }} />

            {/* Cost */}
            <label className="activity-form-label">Cost</label>
            <div className="activity-form-field">
              <div className="cost-row">
                <span className="cost-currency-label">{currency}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  className="form-input"
                  placeholder="0"
                  value={form.cost}
                  onChange={(e) => set('cost', fmtCostInput(e.target.value))}
                />
              </div>
              <p className="form-hint">Leave blank if its free</p>
            </div>

            <div /><div style={{ height: 8 }} />

            {/* Ticket Status */}
            <label className="activity-form-label">Ticket Status</label>
            <div className="activity-form-field">
              <select
                className="form-select"
                value={form.ticketStatus}
                onChange={(e) => set('ticketStatus', e.target.value)}
              >
                <option value="">Select ticket status</option>
                {TICKET_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div /><div style={{ height: 8 }} />

            {/* Details */}
            <label className="activity-form-label">Details</label>
            <div className="activity-form-field">
              <textarea
                className="form-textarea"
                value={form.details}
                onChange={(e) => set('details', e.target.value)}
                rows={5}
              />
            </div>
          </div>

          <div className="form-btn-row" style={{ justifyContent: 'center', marginTop: 32 }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              <span className="btn-icon-circle">+</span>
              Save
            </button>
            {!isNew && (
              <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                Delete Activity
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
