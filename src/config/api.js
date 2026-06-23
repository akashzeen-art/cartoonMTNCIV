/** NICB (Animes Enfants) VAS API configuration */
export const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://68.183.88.91'

export const PRODUCT_CODE = import.meta.env.VITE_PRODUCT_CODE ?? 'NICB'

export const ENDPOINTS = {
  status: '/adpoke/cnt/sub/status',
  detail: '/adpoke/cnt/sub/detail',
  campaign: '/adpoke/cnt/act',
  deactivate: '/adpoke/cnt/dct',
}

export function buildUrl(path, params) {
  const base = import.meta.env.VITE_API_BASE
    ?? (typeof window !== 'undefined' ? window.location.origin : API_BASE)
  const url = new URL(path, base)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value ?? 0))
  })
  return url.toString()
}

export function isActiveStatus(status) {
  return status === 1 || status === '1'
}
