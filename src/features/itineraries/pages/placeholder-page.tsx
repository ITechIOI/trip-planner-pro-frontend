import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { AppLayout } from '@/shared/components/app-layout'

export type PlaceholderPageProps = {
  tripId: number
  title: string
  description: string
}

export const PlaceholderPage = ({
  tripId,
  title,
  description,
}: PlaceholderPageProps) => (
  <AppLayout tripId={tripId}>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {description}
      </Typography>
    </Box>
  </AppLayout>
)

export default PlaceholderPage
