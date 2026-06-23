import { buildUrl, ENDPOINTS, isActiveStatus, PRODUCT_CODE } from '../config/api'
import { normalizeMsisdn } from '../utils/phone'

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export function getSubParams(subid, productcode = PRODUCT_CODE, msisdn) {
  const params = {
    subid: subid || '0',
    productcode: productcode || PRODUCT_CODE,
  }
  if (msisdn) params.msisdn = normalizeMsisdn(msisdn)
  return params
}

/** Status check — call on every content page load */
export async function checkSubscriptionStatus(subid, productcode, msisdn) {
  const url = buildUrl(ENDPOINTS.status, getSubParams(subid, productcode, msisdn))
  return fetchJson(url)
}

/** My Account — subscription detail */
export async function getSubscriptionDetail(subid, productcode, msisdn) {
  const url = buildUrl(ENDPOINTS.detail, getSubParams(subid, productcode, msisdn))
  return fetchJson(url)
}

/** Deactivation — unsubscribe */
export async function deactivateSubscription(subid, productcode, msisdn) {
  const url = buildUrl(ENDPOINTS.deactivate, getSubParams(subid, productcode, msisdn))
  return fetchJson(url)
}

export function redirectToCampaign(subid, productcode, msisdn) {
  window.location.href = buildUrl(ENDPOINTS.campaign, getSubParams(subid, productcode, msisdn))
}

export { isActiveStatus }
