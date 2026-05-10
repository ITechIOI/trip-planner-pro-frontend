import { useParams } from 'react-router-dom'

export const useRequiredTripId = () => {
  const { tripId } = useParams()
  const parsedTripId = Number(tripId)

  return Number.isInteger(parsedTripId) && parsedTripId > 0
    ? parsedTripId
    : undefined
}
