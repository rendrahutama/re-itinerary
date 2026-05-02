import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function makeIcon(num) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:26px;height:26px;border-radius:50%;
      background:#4A9E8E;color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-size:11px;font-weight:700;font-family:sans-serif;
      border:2px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,.35)
    ">${num}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -16],
  })
}

function FitBounds({ points }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 13)
    } else if (points.length > 1) {
      map.fitBounds(points.map((p) => [p.lat, p.lng]), { padding: [32, 32] })
    }
  }, [map, points])
  return null
}

export default function TripMap({ activities }) {
  const sorted = [...activities].sort((a, b) => a.sortOrder - b.sortOrder)
  const points = sorted
    .filter((a) => a.location?.lat && a.location?.lng)
    .map((a, i) => ({
      lat: a.location.lat,
      lng: a.location.lng,
      name: a.location.name || 'Location',
      num: i + 1,
    }))

  if (points.length === 0) {
    return (
      <div className="trip-map-empty">
        <p>Add locations to see them on the map</p>
      </div>
    )
  }

  return (
    <MapContainer
      center={[points[0].lat, points[0].lng]}
      zoom={12}
      className="trip-map"
      scrollWheelZoom={false}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <FitBounds points={points} />
      {points.map((p) => (
        <Marker key={p.num} position={[p.lat, p.lng]} icon={makeIcon(p.num)}>
          <Popup>{p.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
