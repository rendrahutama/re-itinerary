import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useItinerary } from '../context/ItineraryContext'

function daysToGo(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24))
}

function formatDateRange(start, end) {
  const fmt = (d) =>
    new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  if (!end || end === start) return fmt(start)
  const days = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1
  const nights = days - 1
  return `${fmt(start)} - ${fmt(end)} (${days}D ${nights}N)`
}

function formatCost(amount, currency) {
  if (!amount) return ''
  return currency === 'IDR'
    ? `${currency} ${amount.toLocaleString('id-ID')}`
    : `${currency} ${amount.toLocaleString()}`
}

function computeCost(itinerary) {
  return itinerary.activities.reduce((sum, a) => sum + (a.cost || 0), 0)
}

function cardBgStyle(it) {
  if (it.image) {
    return {
      backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.10) 55%, transparent 100%), url(${it.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return {}
}

function PencilIcon() {
  return (
    <svg className="svg-icon" viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

export default function ItineraryList() {
  const { itineraries, loading, error } = useItinerary()
  const navigate = useNavigate()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = itineraries
    .filter((it) => new Date(it.startDate) >= today)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))

  const others = itineraries
    .filter((it) => new Date(it.startDate) < today)
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

  return (
    <>
      <Header
        right={
          <Link to="/itinerary/new" className="btn-header">
            <span className="btn-icon-circle">+</span>
            Plan a New Itinerary
          </Link>
        }
      />

      <div className="page">
        {error && (
          <div style={{ textAlign: 'center', color: 'var(--red-icon)', marginTop: 24 }}>
            Failed to load itineraries: {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', color: 'var(--text-gray)', marginTop: 80 }}>
            Loading itineraries...
          </div>
        )}

        {upcoming.length > 0 && (
          <>
            <p className="section-title">Your Itineraries Ahead</p>
            <div className="upcoming-grid">
              {upcoming.map((it) => {
                const days = daysToGo(it.startDate)
                const cost = computeCost(it)
                return (
                  <div
                    key={it.id}
                    className="upcoming-card"
                    style={cardBgStyle(it)}
                    onClick={() => navigate(`/itinerary/${it.id}`)}
                  >
                    <button
                      className="icon-btn upcoming-card-edit"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/itinerary/${it.id}/edit`)
                      }}
                      title="Edit itinerary"
                    >
                      <PencilIcon />
                    </button>

                    <div className="upcoming-card-body">
                      <p className="upcoming-card-days">
                        {days > 0
                          ? `${days} days to go!`
                          : days === 0
                          ? "Today's trip!"
                          : 'Trip passed'}
                      </p>
                      <p className="upcoming-card-name">{it.name}</p>
                      <p className="upcoming-card-dates">
                        {formatDateRange(it.startDate, it.endDate)}
                      </p>
                      {cost > 0 && (
                        <p className="upcoming-card-cost">
                          Estimated Cost: {formatCost(cost, it.currency)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {others.length > 0 && (
          <>
            <p className="section-title">Other Itineraries</p>
            <div className="other-list">
              {others.map((it) => (
                <div
                  key={it.id}
                  className="other-list-item"
                  onClick={() => navigate(`/itinerary/${it.id}`)}
                >
                  <span className="other-list-item-name">{it.name}</span>
                  <button
                    className="icon-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/itinerary/${it.id}/edit`)
                    }}
                    title="Edit itinerary"
                  >
                    <PencilIcon />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && itineraries.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-gray)', marginTop: 80 }}>
            <p style={{ fontSize: 16, marginBottom: 12 }}>No itineraries yet.</p>
            <Link to="/itinerary/new" className="btn btn-primary">
              <span className="btn-icon-circle">+</span>
              Plan a New Itinerary
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
