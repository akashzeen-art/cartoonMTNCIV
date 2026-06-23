import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  checkSubscriptionStatus,
  redirectToCampaign,
  isActiveStatus,
} from '../services/vasApi'
import { PRODUCT_CODE } from '../config/api'
import { normalizeMsisdn } from '../utils/phone'

const MSISDN_KEY = 'nicb_msisdn'

const SubscriptionContext = createContext(null)

export function SubscriptionProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams()

  const subid = searchParams.get('subid') || '0'
  const productcode = searchParams.get('productcode') || PRODUCT_CODE

  const [msisdn, setMsisdn] = useState(() => {
    const stored = localStorage.getItem(MSISDN_KEY) || ''
    const normalized = stored ? normalizeMsisdn(stored) : ''
    if (normalized && normalized !== stored) {
      localStorage.setItem(MSISDN_KEY, normalized)
    }
    return normalized
  })
  const [pendingVideo, setPendingVideo] = useState(null)
  const [showMobileModal, setShowMobileModal] = useState(false)
  const [activeVideo, setActiveVideo] = useState(null)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (!searchParams.get('productcode')) {
      const next = new URLSearchParams(searchParams)
      next.set('productcode', PRODUCT_CODE)
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const saveMsisdn = useCallback((phone) => {
    const cleaned = normalizeMsisdn(phone)
    setMsisdn(cleaned)
    localStorage.setItem(MSISDN_KEY, cleaned)
    return cleaned
  }, [])

  const verifyAndPlay = useCallback(async (video, phone) => {
    const msisdnToCheck = phone || msisdn
    if (!msisdnToCheck) return

    setChecking(true)
    try {
      const data = await checkSubscriptionStatus(subid, productcode, msisdnToCheck)
      if (isActiveStatus(data.status)) {
        setActiveVideo(video)
      } else {
        redirectToCampaign(subid, productcode, msisdnToCheck)
      }
    } catch {
      redirectToCampaign(subid, productcode, msisdnToCheck)
    } finally {
      setChecking(false)
    }
  }, [subid, productcode, msisdn])

  const requestPlay = useCallback((video) => {
    if (!msisdn) {
      setPendingVideo(video)
      setShowMobileModal(true)
      return
    }
    verifyAndPlay(video)
  }, [msisdn, verifyAndPlay])

  const handleMobileSubmit = useCallback((phone) => {
    const cleaned = saveMsisdn(phone)
    setShowMobileModal(false)
    if (pendingVideo) {
      const video = pendingVideo
      setPendingVideo(null)
      verifyAndPlay(video, cleaned)
    }
  }, [saveMsisdn, pendingVideo, verifyAndPlay])

  const closeMobileModal = useCallback(() => {
    setShowMobileModal(false)
    setPendingVideo(null)
  }, [])

  const closePlayer = useCallback(() => setActiveVideo(null), [])

  const accountQuery = useMemo(
    () => `?subid=${subid}&productcode=${productcode}`,
    [subid, productcode],
  )

  const value = useMemo(() => ({
    subid,
    productcode,
    msisdn,
    checking,
    activeVideo,
    showMobileModal,
    requestPlay,
    handleMobileSubmit,
    closeMobileModal,
    closePlayer,
    accountQuery,
    redirectToCampaign: () => redirectToCampaign(subid, productcode, msisdn),
  }), [
    subid, productcode, msisdn, checking, activeVideo, showMobileModal,
    requestPlay, handleMobileSubmit, closeMobileModal, closePlayer, accountQuery,
  ])

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider')
  return ctx
}
