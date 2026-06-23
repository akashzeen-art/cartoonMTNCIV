export const COUNTRY_CODE = '225'
export const COUNTRY_PREFIX = `+${COUNTRY_CODE}`

/** Normalize to digits with 225 country code for API calls */
export function normalizeMsisdn(input) {
  const digits = String(input || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith(COUNTRY_CODE)) {
    if (digits.length === 12) return COUNTRY_CODE + '0' + digits.slice(3)
    return digits
  }
  return COUNTRY_CODE + digits
}

/** Display msisdn with +225 prefix */
export function formatMsisdnDisplay(msisdn) {
  const d = normalizeMsisdn(msisdn)
  if (!d) return '—'
  if (d.length <= 3) return COUNTRY_PREFIX
  const local = d.slice(3)
  if (local.length <= 2) return `${COUNTRY_PREFIX} ${local}`
  if (local.length <= 4) return `${COUNTRY_PREFIX} ${local.slice(0, 2)} ${local.slice(2)}`
  if (local.length <= 6) {
    return `${COUNTRY_PREFIX} ${local.slice(0, 2)} ${local.slice(2, 4)} ${local.slice(4)}`
  }
  return `${COUNTRY_PREFIX} ${local.slice(0, 2)} ${local.slice(2, 4)} ${local.slice(4, 6)} ${local.slice(6)}`
}
