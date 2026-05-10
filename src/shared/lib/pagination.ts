export const DEFAULT_PAGE_LIMIT = 50

export const getPageOffset = (value?: string | null) => {
  const offset = Number(value)

  return Number.isInteger(offset) && offset > 0 ? offset : 0
}
