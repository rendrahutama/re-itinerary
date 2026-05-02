import { useRef } from 'react'

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function parseDateStr(v) {
  const [year, month, day] = v.split('-').map(Number)
  return { year, month, day }
}

function formatDateDisplay(v) {
  if (!v) return null
  const { year, month, day } = parseDateStr(v)
  return `${String(day).padStart(2, '0')} ${MONTHS[month - 1]} ${year}`
}

function formatDatetimeDisplay(v) {
  if (!v) return null
  const [datePart, timePart] = v.split('T')
  if (!datePart) return null
  return `${formatDateDisplay(datePart)}  ${(timePart || '00:00').slice(0, 5)}`
}

function openPicker(ref) {
  try {
    ref.current?.showPicker()
  } catch {
    ref.current?.click()
  }
}

export function DateInput({ value, onChange, style = {} }) {
  const ref = useRef()
  const display = formatDateDisplay(value)

  return (
    <div
      className="date-input-wrapper"
      style={style}
      onClick={() => openPicker(ref)}
    >
      <span className={display ? 'date-display-val' : 'date-placeholder'}>
        {display ?? 'DD MMM YYYY'}
      </span>
      <CalendarIcon />
      <input
        ref={ref}
        type="date"
        value={value || ''}
        onChange={onChange}
        className="date-hidden-input"
        tabIndex={-1}
      />
    </div>
  )
}

export function DatetimeInput({ value, onChange, style = {} }) {
  const ref = useRef()
  const display = formatDatetimeDisplay(value)

  return (
    <div
      className="date-input-wrapper"
      style={style}
      onClick={() => openPicker(ref)}
    >
      <span className={display ? 'date-display-val' : 'date-placeholder'}>
        {display ?? 'DD MMM YYYY  HH:MM'}
      </span>
      <CalendarIcon />
      <input
        ref={ref}
        type="datetime-local"
        value={value || ''}
        onChange={onChange}
        className="date-hidden-input"
        tabIndex={-1}
      />
    </div>
  )
}
