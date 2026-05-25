const TRIP_ROUTE_ID_PREFIX = 't_'
const TRIP_ROUTE_ID_FACTOR = 97
const TRIP_ROUTE_ID_OFFSET = 104729

const isPositiveSafeInteger = (value: number) =>
  Number.isSafeInteger(value) && value > 0

const parseLegacyTripId = (value: string) => {
  if (!/^\d+$/.test(value)) {
    return null
  }

  const parsed = Number(value)

  return isPositiveSafeInteger(parsed) ? parsed : null
}

export const encodeTripRouteId = (tripId: number) => {
  if (!isPositiveSafeInteger(tripId)) {
    return ''
  }

  return `${TRIP_ROUTE_ID_PREFIX}${(
    tripId * TRIP_ROUTE_ID_FACTOR +
    TRIP_ROUTE_ID_OFFSET
  ).toString(36)}`
}

export const decodeTripRouteId = (value: string | undefined) => {
  if (!value) {
    return null
  }

  const legacyTripId = parseLegacyTripId(value)

  if (legacyTripId != null) {
    return legacyTripId
  }

  if (!value.startsWith(TRIP_ROUTE_ID_PREFIX)) {
    return null
  }

  const encoded = value.slice(TRIP_ROUTE_ID_PREFIX.length)

  if (!/^[0-9a-z]+$/i.test(encoded)) {
    return null
  }

  const obfuscated = Number.parseInt(encoded, 36)
  const decoded = (obfuscated - TRIP_ROUTE_ID_OFFSET) / TRIP_ROUTE_ID_FACTOR

  return isPositiveSafeInteger(decoded) &&
    decoded * TRIP_ROUTE_ID_FACTOR + TRIP_ROUTE_ID_OFFSET === obfuscated
    ? decoded
    : null
}
