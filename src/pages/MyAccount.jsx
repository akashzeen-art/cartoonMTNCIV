import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Phone, Calendar, Loader2, CheckCircle, XCircle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useSubscription } from '../context/SubscriptionContext'
import {
  getSubscriptionDetail,
  deactivateSubscription,
  redirectToCampaign,
  isActiveStatus,
} from '../services/vasApi'
import { formatMsisdnDisplay } from '../utils/phone'

function formatDate(value) {
  if (!value) return '—'
  return value.replace('T', ' ').slice(0, 19)
}

const MyAccount = () => {
  const { subid, productcode, msisdn, accountQuery } = useSubscription()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  const loadDetail = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getSubscriptionDetail(subid, productcode, msisdn)
      setDetail(data)
    } catch {
      setError('Impossible de charger les informations du compte.')
    } finally {
      setLoading(false)
    }
  }, [subid, productcode, msisdn])

  useEffect(() => { loadDetail() }, [loadDetail])

  const handleUnsubscribe = async () => {
    setActionLoading(true)
    try {
      await deactivateSubscription(subid, productcode, msisdn)
      await loadDetail()
    } catch {
      setError('La désinscription a échoué. Veuillez réessayer.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSubscribe = () => {
    redirectToCampaign(subid, productcode, msisdn)
  }

  const active = detail && isActiveStatus(detail.status)

  return (
    <div style={{ minHeight: '100vh', background: '#F7FFF7' }}>
      <Header />

      <main style={{ padding: '100px 0 60px' }}>
        <div className="container" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <Link
            to={`/${accountQuery}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#1A535C',
              fontWeight: '700',
              fontSize: '0.95rem',
              marginBottom: '24px',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={18} />
            Retour aux vidéos
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'white',
              border: '6px solid #1A535C',
              borderRadius: '24px',
              boxShadow: '12px 12px 0px #FFE66D',
              padding: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: '#FF6B6B',
                border: '3px solid #1A535C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <User size={26} color="white" />
              </div>
              <div>
                <h1 style={{
                  fontSize: '1.8rem',
                  fontWeight: '900',
                  color: '#1A535C',
                  textTransform: 'uppercase',
                }}>
                  Mon Compte
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#636E72', fontWeight: '600' }}>
                  Cartoon Box— {productcode}
                </p>
              </div>
            </div>

            {loading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '48px 0',
                color: '#1A535C',
              }}>
                <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontWeight: '700' }}>Chargement...</span>
              </div>
            )}

            {error && !loading && (
              <p style={{ color: '#FF6B6B', fontWeight: '700', padding: '16px 0' }}>{error}</p>
            )}

            {!loading && detail && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  background: active ? '#E8F5E9' : '#FFEBEE',
                  color: active ? '#2E7D32' : '#C62828',
                  border: `3px solid ${active ? '#2E7D32' : '#C62828'}`,
                }}>
                  {active
                    ? <><CheckCircle size={18} /> Abonnement actif</>
                    : <><XCircle size={18} /> Non abonné</>
                  }
                </div>

                <InfoRow icon={Phone} label="Numéro mobile" value={formatMsisdnDisplay(detail.msisdn || msisdn)} />
                <InfoRow icon={User} label="Service" value={detail.service_name || 'Animes Enfants'} />
                <InfoRow icon={Calendar} label="Valide du" value={formatDate(detail.valid_from || detail.validityfrom)} />
                <InfoRow icon={Calendar} label="Valide jusqu'au" value={formatDate(detail.valid_to || detail.validityto)} />

                <div style={{ paddingTop: '16px', borderTop: '3px solid #1A535C' }}>
                  {active ? (
                    <motion.button
                      onClick={handleUnsubscribe}
                      disabled={actionLoading}
                      whileHover={{ scale: actionLoading ? 1 : 1.02 }}
                      whileTap={{ scale: actionLoading ? 1 : 0.98 }}
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '50px',
                        background: '#FFEBEE',
                        color: '#C62828',
                        border: '4px solid #C62828',
                        fontWeight: '900',
                        fontSize: '1rem',
                        cursor: actionLoading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      {actionLoading && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
                      Se désabonner
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleSubscribe}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '50px',
                        background: '#FF6B6B',
                        color: 'white',
                        border: '4px solid #1A535C',
                        fontWeight: '900',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '4px 4px 0px #1A535C',
                      }}
                    >
                      S'abonner
                    </motion.button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '14px 16px',
      borderRadius: '14px',
      background: '#F7FFF7',
      border: '3px solid #1A535C',
    }}>
      <Icon size={18} color="#1A535C" style={{ marginTop: '2px', flexShrink: 0 }} />
      <div>
        <p style={{ fontSize: '0.75rem', color: '#636E72', fontWeight: '600', marginBottom: '2px' }}>{label}</p>
        <p style={{ fontSize: '0.95rem', color: '#1A535C', fontWeight: '800' }}>{value}</p>
      </div>
    </div>
  )
}

export default MyAccount
