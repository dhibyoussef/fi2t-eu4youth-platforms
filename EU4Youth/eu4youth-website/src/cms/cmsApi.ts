import axios from 'axios'

const TOKEN_KEY = 'eu4y_edit_token'

/** Preprod is under /eu4youth/; local Vite proxies /api → :8040. */
export const API_BASE = (import.meta.env.VITE_API_BASE || '/api').replace(/\/$/, '')

export const cmsApi = axios.create({
  baseURL: API_BASE,
})

export function setEditToken(token: string | null) {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token)
    // Custom header keeps nginx Basic Auth on Authorization intact (preprod).
    cmsApi.defaults.headers.common['X-EU4Y-Token'] = token
    delete cmsApi.defaults.headers.common.Authorization
  } else {
    sessionStorage.removeItem(TOKEN_KEY)
    delete cmsApi.defaults.headers.common['X-EU4Y-Token']
    delete cmsApi.defaults.headers.common.Authorization
  }
}

export function readEditToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

const saved = readEditToken()
if (saved) setEditToken(saved)
