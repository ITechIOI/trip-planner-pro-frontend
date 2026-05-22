import { createContext, useEffect, useState } from 'react'




const ThemeContext = createContext(null)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'trip-planner-theme',
}) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(storageKey)
    return stored ?? defaultTheme
  })

  useEffect(() => {
    const root = document.documentElement
    const resolved =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme
    root.classList.toggle('dark', resolved === 'dark')
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
  )
}
