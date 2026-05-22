import { AppSidebar } from './app-sidebar'
import { AppHeader } from './app-header'
import { TripProvider } from '@/lib/trip-context'

export function AppLayout({ children  }) {
  return (
    <TripProvider>
      <div className="min-h-screen bg-background">
        <AppSidebar />
        <div className="pl-64 transition-all duration-300">
          <AppHeader />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </TripProvider>
  )
}
