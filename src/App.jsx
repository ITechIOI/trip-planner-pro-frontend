import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/components/ui/theme-provider'
import DashboardPage from '@/pages/dashboard-page'
import ItineraryPage from '@/features/itinerary/components/page'
import PlaceholderPage from '@/pages/placeholder-page'

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
          <Route
            path="/packing"
            element={
              <PlaceholderPage
                title="Packing"
                description="Packing list management — coming soon."
              />
            }
          />
          <Route
            path="/budget"
            element={
              <PlaceholderPage
                title="Budget"
                description="Expense tracking — coming soon."
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
