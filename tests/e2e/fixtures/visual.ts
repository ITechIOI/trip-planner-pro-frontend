import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { FIXED_NOW_ISO } from './data'

export const freezeBrowserTime = async (page: Page) => {
  await page.addInitScript((fixedNowIso) => {
    const fixedNow = new Date(fixedNowIso)
    const RealDate = Date

    class MockDate extends RealDate {
      constructor(...args: unknown[]) {
        if (args.length === 0) {
          super(fixedNow.getTime())
          return
        }

        if (args.length === 1) {
          super(args[0] as string | number | Date)
          return
        }

        super(
          ...(args as [
            year: number,
            monthIndex: number,
            date?: number,
            hours?: number,
            minutes?: number,
            seconds?: number,
            ms?: number,
          ])
        )
      }

      static now() {
        return fixedNow.getTime()
      }
    }

    MockDate.UTC = RealDate.UTC
    MockDate.parse = RealDate.parse
    Object.setPrototypeOf(MockDate, RealDate)
    window.Date = MockDate as DateConstructor
  }, FIXED_NOW_ISO)
}

export const stabilizeVisualPage = async (page: Page) => {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-delay: 0ms !important;
        transition-duration: 0.01ms !important;
        transition-delay: 0ms !important;
        scroll-behavior: auto !important;
        caret-color: transparent !important;
      }

      [aria-label="Open React Query Devtools"],
      [data-testid="ReactQueryDevtools"],
      .tsqd-parent-container {
        display: none !important;
      }
    `,
  })

  await page.evaluate(async () => {
    await document.fonts?.ready
  })
}

export const expectNoHorizontalScroll = async (page: Page) => {
  const hasHorizontalScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )

  expect(hasHorizontalScroll).toBe(false)
}
