import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ItineraryProvider } from './context/ItineraryContext'
import ItineraryList from './pages/ItineraryList'
import ItineraryDetail from './pages/ItineraryDetail'
import EditItinerary from './pages/EditItinerary'
import EditActivity from './pages/EditActivity'

export default function App() {
  return (
    <ItineraryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ItineraryList />} />
          <Route path="/itinerary/new" element={<EditItinerary />} />
          <Route path="/itinerary/:id" element={<ItineraryDetail />} />
          <Route path="/itinerary/:id/edit" element={<EditItinerary />} />
          <Route path="/itinerary/:id/activity/new" element={<EditActivity />} />
          <Route path="/itinerary/:id/activity/:activityId/edit" element={<EditActivity />} />
        </Routes>
      </BrowserRouter>
    </ItineraryProvider>
  )
}
