import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { checkSubscriptionStatus, redirectToCampaign, isActiveStatus } from '../services/vasApi'

const VideoPlayerModal = ({ video, subid, productcode, msisdn, onClose }) => {
  const videoRef = useRef(null)
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await checkSubscriptionStatus(subid, productcode, msisdn)
        if (cancelled) return
        if (!isActiveStatus(data.status)) {
          redirectToCampaign(subid, productcode, msisdn)
          return
        }
        setVerifying(false)
      } catch {
        if (!cancelled) redirectToCampaign(subid, productcode, msisdn)
      }
    })()
    return () => { cancelled = true }
  }, [subid, productcode, msisdn])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    if (verifying) return
    const vid = videoRef.current
    if (vid) vid.play().catch(() => {})
  }, [video, verifying])

  if (!video) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(26,83,92,0.85)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backdropFilter: 'blur(6px)',
        }}
      >
        <motion.div
          initial={{ scale: 0.7, rotate: -4 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0.7, rotate: 4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'white',
            border: '6px solid #1A535C',
            borderRadius: '24px',
            boxShadow: '16px 16px 0px #FFE66D',
            width: '100%',
            maxWidth: '860px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div style={{
            background: '#FFE66D',
            borderBottom: '4px solid #1A535C',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              {video.episode && (
                <span style={{
                  background: '#FF6B6B',
                  color: 'white',
                  padding: '3px 10px',
                  borderRadius: '10px',
                  border: '2px solid #1A535C',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  marginRight: '10px',
                }}>
                  {video.episode}
                </span>
              )}
              <span style={{
                fontSize: '1.1rem',
                fontWeight: '900',
                color: '#1A535C',
                textTransform: 'uppercase',
              }}>
                {video.title}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.15, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{
                background: '#FF6B6B',
                border: '3px solid #1A535C',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '3px 3px 0px #1A535C',
                flexShrink: 0,
              }}
            >
              <X size={20} color="white" />
            </motion.button>
          </div>

          <div style={{ background: 'black', aspectRatio: '16/9', width: '100%', position: 'relative' }}>
            {verifying ? (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                color: 'white',
              }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>Vérification de l'abonnement...</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                key={video.videoUrl}
                src={video.videoUrl}
                controls
                autoPlay
                playsInline
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                style={{ width: '100%', height: '100%', display: 'block' }}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}

export default VideoPlayerModal
