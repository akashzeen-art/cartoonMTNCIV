import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { useSubscription } from '../context/SubscriptionContext'
import { COUNTRY_PREFIX, normalizeMsisdn } from '../utils/phone'

const MobileNumberModal = () => {
  const { showMobileModal, handleMobileSubmit, closeMobileModal, checking } = useSubscription()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  if (!showMobileModal) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const normalized = normalizeMsisdn(phone)
    const localDigits = normalized.slice(3)
    if (localDigits.length < 8) {
      setError('Veuillez entrer un numéro de mobile valide.')
      return
    }
    setError('')
    handleMobileSubmit(normalized)
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) closeMobileModal() }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(26,83,92,0.9)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backdropFilter: 'blur(6px)',
        }}
      >
        <motion.div
          initial={{ scale: 0.85, rotate: -3 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0.85, rotate: 3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'white',
            border: '6px solid #1A535C',
            borderRadius: '24px',
            boxShadow: '16px 16px 0px #FFE66D',
            width: '100%',
            maxWidth: '420px',
            padding: '28px',
            position: 'relative',
          }}
        >
          <button
            onClick={closeMobileModal}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              background: '#FF6B6B',
              border: '3px solid #1A535C',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px #1A535C',
            }}
            aria-label="Fermer"
          >
            <X size={18} color="white" />
          </button>

          <div style={{ marginBottom: '8px', fontSize: '2rem' }}>📱</div>
          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: '900',
            color: '#1A535C',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            Entrez votre numéro
          </h2>
          <p style={{
            fontSize: '0.9rem',
            color: '#636E72',
            fontWeight: '600',
            marginBottom: '24px',
            lineHeight: 1.5,
          }}>
            Saisissez votre numéro de mobile pour accéder aux vidéos.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 16px',
                borderRadius: '14px',
                background: '#FFE66D',
                border: '3px solid #1A535C',
                fontWeight: '800',
                color: '#1A535C',
                fontSize: '0.95rem',
              }}>
                {COUNTRY_PREFIX}
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError('') }}
                placeholder="07 12 34 56 78"
                autoFocus
                disabled={checking}
                inputMode="numeric"
                aria-label="Numéro de mobile"
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: '3px solid #1A535C',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#1A535C',
                  outline: 'none',
                }}
              />
            </div>

            {error && (
              <p style={{ color: '#FF6B6B', fontSize: '0.85rem', fontWeight: '700', marginBottom: '12px' }}>
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={checking}
              whileHover={{ scale: checking ? 1 : 1.03 }}
              whileTap={{ scale: checking ? 1 : 0.97 }}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '50px',
                background: checking ? '#ccc' : '#FF6B6B',
                color: 'white',
                border: '4px solid #1A535C',
                fontWeight: '900',
                fontSize: '1rem',
                cursor: checking ? 'not-allowed' : 'pointer',
                boxShadow: '4px 4px 0px #1A535C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {checking ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Vérification...
                </>
              ) : (
                'CONTINUER'
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}

export default MobileNumberModal
