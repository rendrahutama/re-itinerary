import { Link } from 'react-router-dom'

export default function Header({ right }) {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        <i>Re-Itinerary</i>
      </Link>
      <div className="header-right">{right}</div>
    </header>
  )
}
