export interface ApiErrorBody {
  detail?: string | { msg: string }[]
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const TOKEN_KEY = 'auth_token'

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY)

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

const parseErrorMessage = (body: ApiErrorBody): string => {
  if (typeof body.detail === 'string') return body.detail
  if (Array.isArray(body.detail) && body.detail.length > 0) {
    return body.detail.map((item) => item.msg).join('；')
  }
  return '请求失败，请稍后重试'
}

export async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  const token = getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let message = '请求失败，请稍后重试'
    try {
      const body = (await response.json()) as ApiErrorBody
      message = parseErrorMessage(body)
    } catch {
      // ignore json parse errors
    }
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
