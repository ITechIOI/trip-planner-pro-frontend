import { describe, expect, it } from 'vitest'
import { loginSchema, registerSchema } from './auth-schemas'

describe('auth schemas', () => {
  it('requires a non-empty username and password for login', () => {
    const result = loginSchema.safeParse({ username: '   ', password: '' })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      'Username is required',
      'Password is required',
    ])
  })

  it('requires full name and an eight-character password for registration', () => {
    const result = registerSchema.safeParse({
      fullName: '',
      username: 'demo',
      password: 'short',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining([
        'Full name is required',
        'Password must be at least 8 characters',
      ]),
    )
  })
})
