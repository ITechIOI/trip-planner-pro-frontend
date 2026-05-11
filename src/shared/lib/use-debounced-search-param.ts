import { useEffect, useState } from 'react'
import type { SetURLSearchParams } from 'react-router-dom'

type UseDebouncedSearchParamOptions = {
  delayMs?: number
  key?: string
  searchParams: URLSearchParams
  setSearchParams: SetURLSearchParams
}

export const useDebouncedSearchParam = ({
  delayMs = 300,
  key = 'search',
  searchParams,
  setSearchParams,
}: UseDebouncedSearchParamOptions) => {
  const paramValue = searchParams.get(key) ?? ''
  const [state, setState] = useState({
    paramValue,
    value: paramValue,
  })

  if (state.paramValue !== paramValue) {
    setState({
      paramValue,
      value: paramValue,
    })
  }

  const value = state.paramValue === paramValue ? state.value : paramValue

  useEffect(() => {
    if (value === paramValue) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      const next = new URLSearchParams(searchParams)
      const trimmedValue = value.trim()

      if (trimmedValue) {
        next.set(key, trimmedValue)
      } else {
        next.delete(key)
      }

      next.delete('offset')
      setSearchParams(next)
    }, delayMs)

    return () => window.clearTimeout(timeoutId)
  }, [delayMs, key, paramValue, searchParams, setSearchParams, value])

  return {
    onChange: (nextValue: string) => {
      setState({
        paramValue,
        value: nextValue,
      })
    },
    value,
  }
}
