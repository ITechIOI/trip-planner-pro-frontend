import { AppProviders } from './providers'
import { RouterProvider } from './router/RouterProvider'

function App() {
  return (
    <AppProviders>
      <RouterProvider />
    </AppProviders>
  )
}

export default App
