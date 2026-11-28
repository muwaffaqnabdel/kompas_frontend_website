import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AlertCircle, Loader2, Bell, X } from 'lucide-react';
import PesertaHero from './peserta/PesertaHero';
import PesertaMetrics from './peserta/PesertaMetrics';
import PesertaLiveDPTracker from './peserta/PesertaLiveDPTracker';
import PesertaTimeline from './peserta/PesertaTimeline';
import PesertaDocuments from './peserta/PesertaDocuments';
import PesertaAgenda from './peserta/PesertaAgenda';
import PesertaDataTimBerkas from './peserta/PesertaDataTimBerkas';
import PesertaScheduleView from './peserta/PesertaScheduleView';
import PesertaResultsView from './peserta/PesertaResultsView';
import PesertaEventCatalog from './peserta/PesertaEventCatalog';
import PesertaProfilKontingen from './peserta/PesertaProfilKontingen';
import PesertaRegisterEventModal from './peserta/PesertaRegisterEventModal';
import {
  subscribeDeviceToWebPush,
  isWebPushSupported,
  isSecureContextForPush,
} from '../../utils/webPush';

const SESSION_SELECTED_REG_KEY = 'kompas_peserta_selected_reg_id';
const SESSION_ACK_DP1_KEY = 'kompas_peserta_ack_dp1_calls';

function readAckDp1Keys() {
  try {
    const raw = sessionStorage.getItem(SESSION_ACK_DP1_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAckDp1Key(key) {
  if (!key) return;
  try {
    const list = readAckDp1Keys();
    if (!list.includes(key)) {
      sessionStorage.setItem(SESSION_ACK_DP1_KEY, JSON.stringify([...list.slice(-20), key]));
    }
  } catch { }
}

function getInitialNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission || 'default';
}

function triggerPhoneVibration(pattern) {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch { }
}

  function isUserInsideWebsite() {
    if (typeof document === 'undefined') return true;
    return document.visibilityState === 'visible' && document.hasFocus();
  }

  function sendNativeTopNotification(title, body, tag, { forceShow = false } = {}) {
    try {
      // Jika pengguna sedang aktif di dalam website dan bukan simulasi paksa, cukup pakai pop-up + getar
      if (!forceShow && isUserInsideWebsite()) {
        return false;
      }
      if (
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        new Notification(title, {
          body,
          tag,
          requireInteraction: true,
        });
        return true;
      }
    } catch { }
    return false;
  }

  function formatDateId(val) {
    if (!val) return 'Jadwal menyusul';
    try {
      return new Date(val).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return String(val);
    }
  }

  export default function PesertaView({ activeTab = 'dashboard', onSelectTab }) {
    const [profileData, setProfileData] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [selectedRegId, setSelectedRegId] = useState(() => {
      try {
        return sessionStorage.getItem(SESSION_SELECTED_REG_KEY) || '';
      } catch {
        return '';
      }
    });
    const [loadingPortal, setLoadingPortal] = useState(true);
    const [authRequired, setAuthRequired] = useState(false);

    // Modal Daftar Event
    const [registerModalEvent, setRegisterModalEvent] = useState(null);

    // Live DP 1–4 Tracker & Notifikasi Panggilan DP 1
    const [dpStatus, setDpStatus] = useState(null);
    const [dp1CallModal, setDp1CallModal] = useState(null);
    const [dpToast, setDpToast] = useState(null);
    const [notificationPermission, setNotificationPermission] = useState(getInitialNotificationPermission);
    const [pushSubscribed, setPushSubscribed] = useState(false);
    const [pushBusy, setPushBusy] = useState(false);
    const [pushFeedback, setPushFeedback] = useState(null); // { type: 'info' | 'success' | 'error', text }
    const lastTrackedPosRef = useRef({ participantId: null, pos: undefined });
    const toastTimerRef = useRef(null);

    const fetchPortalData = useCallback(async () => {
      try {
        const [profRes, regRes] = await Promise.all([
          fetch('/api/peserta/profile', { credentials: 'include' }),
          fetch('/api/peserta/registrations', { credentials: 'include' }),
        ]);

        if (profRes.status === 401 || regRes.status === 401) {
          setAuthRequired(true);
          setLoadingPortal(false);
          return;
        }

        setAuthRequired(false);
        const [profJson, regJson] = await Promise.all([profRes.json(), regRes.json()]);

        if (profRes.ok && profJson.success) {
          setProfileData(profJson);
        }
        if (regRes.ok && regJson.success) {
          const list = Array.isArray(regJson.registrations) ? regJson.registrations : [];
          setRegistrations(list);
          setSelectedRegId((prev) => {
            if (prev && list.some((r) => r.id === prev)) return prev;
            return list[0]?.id || '';
          });
        }
      } catch (err) {
        console.error('Error loading Peserta portal data:', err);
      } finally {
        setLoadingPortal(false);
      }
    }, []);

    useEffect(() => {
      fetchPortalData();
    }, [fetchPortalData]);

    useEffect(() => {
      try {
        if (selectedRegId) sessionStorage.setItem(SESSION_SELECTED_REG_KEY, selectedRegId);
      } catch { }
    }, [selectedRegId]);

    const activeRegistration =
      registrations.find((r) => r.id === selectedRegId) || registrations[0] || null;

    const handleRequestNotificationPermission = useCallback(async () => {
      setPushBusy(true);
      setPushFeedback(null);
      try {
          const res = await subscribeDeviceToWebPush({ requestPermission: true });
          if (res.permission) {
            setNotificationPermission(res.permission);
          } else {
            setNotificationPermission(getInitialNotificationPermission());
          }
          if (res.ok) {
            setPushSubscribed(true);
            setPushFeedback({
              type: 'success',
              text: res.message,
            });
          } else {
            setPushFeedback({
              type: res.reason === 'INSECURE_CONTEXT' ? 'info' : 'error',
              text: res.message,
            });
          }
          return res;
        } catch (err) {
          setPushFeedback({
            type: 'error',
            text: err?.message || 'Gagal mengaktifkan Web Push pada perangkat ini.',
          });
          return { ok: false };
        } finally {
          setPushBusy(false);
        }
      }, []);

    // Sinkronkan langganan Web Push secara diam-diam saat halaman dibuka jika izin sudah 'granted'
    useEffect(() => {
      if (authRequired) return;
      if (!isWebPushSupported() || !isSecureContextForPush()) return;
      if (Notification.permission === 'granted') {
        subscribeDeviceToWebPush({ requestPermission: false })
          .then((res) => {
            if (res?.ok) setPushSubscribed(true);
          })
          .catch(() => { });
      }
    }, [authRequired]);

    // Dengarkan sinyal instan dari Service Worker saat Web Push masuk ketika tab sedang terbuka
    useEffect(() => {
      if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
      const handleSwMessage = (event) => {
        const msg = event.data;
        if (msg?.type !== 'KOMPAS_DP_PUSH' || !msg.payload) return;
        const p = msg.payload;
        if (p.dpOrder === 1 && isUserInsideWebsite() && !p.forceShow) {
          triggerPhoneVibration([280, 120, 280, 120, 320]);
          setDp1CallModal({
            callEventKey: p.tag || `sw-dp1-${Date.now()}`,
            teamName: p.teamName || activeRegistration?.teamName || 'Pasukan Anda',
            schoolName: p.schoolName || activeRegistration?.schoolName || '',
            eventName: p.eventName || activeRegistration?.eventName || '',
            queueNumber: p.queueNumber ?? activeRegistration?.queueNumber ?? null,
            enteredAt: p.sentAt || new Date().toISOString(),
            isSimulation: false,
          });
        }
      };
      navigator.serviceWorker.addEventListener('message', handleSwMessage);
      return () => navigator.serviceWorker.removeEventListener('message', handleSwMessage);
    }, [activeRegistration?.teamName, activeRegistration?.schoolName, activeRegistration?.eventName, activeRegistration?.queueNumber]);

    const handleSimulatePopup = useCallback(() => {
      triggerPhoneVibration([280, 120, 280, 120, 320]);
      setDp1CallModal({
        callEventKey: `sim-popup-${Date.now()}`,
        teamName: activeRegistration?.teamName || 'TIM CONTOH PASUKAN',
        schoolName: activeRegistration?.schoolName || profileData?.profile?.schoolName || 'Kontingen Peserta',
        eventName: activeRegistration?.eventName || 'Simulasi Lomba KOMPAS',
        queueNumber: activeRegistration?.queueNumber ?? 1,
        enteredAt: new Date().toISOString(),
        isSimulation: true,
      });
    }, [activeRegistration, profileData]);

    const handleSimulateTopPush = useCallback(
      async (delaySeconds = 0) => {
        setPushBusy(true);
        setPushFeedback(null);
        try {
          // Pastikan Web Push aktif terlebih dahulu
          if (!pushSubscribed) {
            const subRes = await subscribeDeviceToWebPush({ requestPermission: true });
            if (subRes.permission) setNotificationPermission(subRes.permission);
            if (!subRes.ok) {
              // Fallback local Notification jika izin granted tetapi SW/VAPID tidak tersedia
              if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && delaySeconds === 0) {
                sendNativeTopNotification(
                  `[Simulasi] Panggilan Masuk Pos DP 1 — ${activeRegistration?.teamName || 'Tim Anda'}`,
                  'Segera menuju Pos DP 1 (Pengecekan Dokumen) bersama danton & berkas fisik.',
                  `sim-local-${Date.now()}`,
                  { forceShow: true }
                );
                setPushFeedback({
                  type: 'info',
                  text: 'Notifikasi browser lokal ditampilkan. Untuk push saat layar mati, pastikan akses via HTTPS/localhost.',
                });
              } else {
                setPushFeedback({
                  type: subRes.reason === 'INSECURE_CONTEXT' ? 'info' : 'error',
                  text: subRes.message,
                });
              }
              return;
            }
            setPushSubscribed(true);
          }

          const res = await fetch('/api/peserta/push/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              teamName: activeRegistration?.teamName || 'Tim Anda',
              schoolName: activeRegistration?.schoolName || '',
              delaySeconds,
              forceShow: true,
            }),
          });
          const json = await res.json();
          if (res.ok && json.success) {
            setPushFeedback({
              type: 'success',
              text: json.message,
            });
          } else {
            setPushFeedback({
              type: 'error',
              text: json.message || 'Simulasi notifikasi atas HP gagal dikirim.',
            });
          }
        } catch (err) {
          setPushFeedback({
            type: 'error',
            text: err?.message || 'Gagal menghubungi server Web Push.',
          });
        } finally {
          setPushBusy(false);
        }
      },
      [pushSubscribed, activeRegistration]
    );

    const showSubtleToast = useCallback((title, detail) => {
      setDpToast({ title, detail });
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => {
        setDpToast(null);
      }, 7500);
    }, []);

    // Polling status posisi DP 1–4 setiap 3.5 detik untuk tim aktif
    useEffect(() => {
      if (authRequired || !activeRegistration?.id) {
        setDpStatus(null);
        return;
      }

      let cancelled = false;
      const participantId = activeRegistration.id;

      // Reset tracker ketika berpindah tim/event
      if (lastTrackedPosRef.current.participantId !== participantId) {
        lastTrackedPosRef.current = { participantId, pos: undefined };
        setDpStatus(null);
      }

      const fetchDpStatus = async () => {
        try {
          const res = await fetch(
            `/api/peserta/dp-status?participantId=${encodeURIComponent(participantId)}`,
            { credentials: 'include' }
          );
          if (!res.ok) return;
          const json = await res.json();
          if (cancelled || !json.success || !json.dpStatus) return;

          const next = json.dpStatus;
          setDpStatus(next);

          const prevPos = lastTrackedPosRef.current.pos;
          const nextPos = next.currentPos;

          // 1. Pop-up RINGKAS + Getar + Notifikasi Atas HP HANYA saat dipanggil masuk DP 1
          if (nextPos === 1 && next.callEventKey) {
            const ackedKeys = readAckDp1Keys();
            if (!ackedKeys.includes(next.callEventKey)) {
              setDp1CallModal((current) => {
                if (current?.callEventKey === next.callEventKey) return current;
                triggerPhoneVibration([280, 120, 280, 120, 320]);
                sendNativeTopNotification(
                  `Panggilan Masuk DP 1 — ${next.teamName}`,
                  'Segera menuju Pos DP 1 (Pengecekan Dokumen) bersama danton & berkas fisik.',
                  next.callEventKey
                );
                return {
                  callEventKey: next.callEventKey,
                  teamName: next.teamName,
                  schoolName: next.schoolName,
                  eventName: next.eventName,
                  queueNumber: next.queueNumber,
                  enteredAt: next.activeDp?.enteredAt || null,
                };
              });
            }
          } else if (prevPos !== undefined && prevPos !== nextPos) {
            // 2. Transisi DP 2 -> DP 3 -> DP 4 -> Selesai: toast halus + getar singkat (tanpa pop-up modal)
            if (nextPos === 2 || nextPos === 3 || nextPos === 4) {
              const label = next.activeDp?.name || `Pos DP ${nextPos}`;
              const detail = next.activeDp?.instruction || 'Ikuti arahan panitia di lokasi.';
              triggerPhoneVibration(150);
              showSubtleToast(`Pasukan Masuk ${label}`, detail);
              sendNativeTopNotification(
                `${next.teamName} — ${label}`,
                detail,
                next.callEventKey || `dp-${nextPos}`
              );
            } else if (nextPos === 'FINISHED') {
              triggerPhoneVibration([120, 80, 120]);
              showSubtleToast(
                'Penampilan Selesai (DP 4)',
                'Pasukan telah menyelesaikan seluruh pos lomba. Hasil nilai akan tampil setelah dipublikasikan.'
              );
              sendNativeTopNotification(
                `${next.teamName} — Penampilan Selesai`,
                'Pasukan telah menyelesaikan seluruh tahapan DP 1–4.',
                `${participantId}-finished`
              );
            }
          }

          lastTrackedPosRef.current = { participantId, pos: nextPos };
        } catch {
          // Abaikan error polling sementara agar tidak mengganggu tampilan peserta
        }
      };

      fetchDpStatus();
      const interval = setInterval(fetchDpStatus, 3500);
      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }, [authRequired, activeRegistration?.id, showSubtleToast]);

    useEffect(() => {
      return () => {
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      };
    }, []);

    const handleAcknowledgeDp1Call = (goToDashboard = false) => {
        if (dp1CallModal?.callEventKey && !dp1CallModal?.isSimulation) {
          saveAckDp1Key(dp1CallModal.callEventKey);
        }
        try {
          if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
            navigator.vibrate(0);
          }
        } catch { }
        setDp1CallModal(null);
        if (goToDashboard && onSelectTab) {
          onSelectTab('dashboard');
        }
      };

      // Overlay Global: Pop-up Ringkas Khusus Panggilan DP 1 + Toast Halus DP 2–4
      const renderLiveDpOverlays = () => (
        <>
          {dpToast && (
            <div
              style={{
                position: 'fixed',
                top: '1rem',
                right: '1rem',
                zIndex: 1100,
                maxWidth: '340px',
                width: 'calc(100vw - 2rem)',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderLeft: '4px solid #C94B3C',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                boxShadow: '0 14px 32px rgba(15, 23, 42, 0.16)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '0.65rem',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>{dpToast.title}</div>
                <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '0.2rem', lineHeight: 1.45 }}>
                  {dpToast.detail}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDpToast(null)}
                aria-label="Tutup notifikasi"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '2px',
                  flexShrink: 0,
                }}
              >
                <X size={15} />
              </button>
            </div>
          )}

          {dp1CallModal && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1200,
                backgroundColor: 'rgba(15, 23, 42, 0.45)',
                backdropFilter: 'blur(3px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '370px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  borderTop: '5px solid #C94B3C',
                  boxShadow: '0 22px 50px rgba(15, 23, 42, 0.24)',
                  padding: '1.25rem 1.35rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.7rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: '#C94B3C',
                      backgroundColor: 'rgba(201, 75, 60, 0.1)',
                      padding: '0.24rem 0.6rem',
                      borderRadius: '999px',
                    }}
                  >
                    <Bell size={12} />
                    <span>{dp1CallModal.isSimulation ? 'Simulasi Panggilan Pos DP 1' : 'Panggilan Masuk Pos DP 1'}</span>
                  </span>
                  {dp1CallModal.queueNumber != null && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#475569' }}>
                      No. #{String(dp1CallModal.queueNumber).padStart(2, '0')}
                    </span>
                  )}
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
                  {dp1CallModal.teamName}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '0.8rem' }}>
                  {dp1CallModal.schoolName}
                  {dp1CallModal.eventName ? ` · ${dp1CallModal.eventName}` : ''}
                </div>

                <div
                  style={{
                    padding: '0.75rem 0.85rem',
                    borderRadius: '10px',
                    backgroundColor: '#FFF5F4',
                    border: '1px solid #F5C6C0',
                    fontSize: '0.81rem',
                    color: '#7F1D1D',
                    lineHeight: 1.5,
                    marginBottom: '1rem',
                  }}
                >
                  Panitia memanggil pasukan Anda masuk ke <strong>Pos DP 1 (Pengecekan Dokumen)</strong>. Mohon segera merapat bersama danton dan berkas fisik.
                </div>

                <div style={{ display: 'flex', gap: '0.55rem', justifyContent: 'flex-end' }}>
                  {activeTab !== 'dashboard' && (
                    <button
                      type="button"
                      onClick={() => handleAcknowledgeDp1Call(true)}
                      style={{
                        padding: '0.55rem 0.85rem',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        color: '#334155',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Lihat Pos DP
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleAcknowledgeDp1Call(false)}
                    style={{
                      flex: activeTab === 'dashboard' ? 1 : undefined,
                      padding: '0.6rem 1.15rem',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: '#C94B3C',
                      color: '#FFFFFF',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Mengerti
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      );

      const handleRegistrationUpdated = (updatedReg) => {
        if (!updatedReg?.id) {
          fetchPortalData();
          return;
        }
        setRegistrations((prev) => {
          const exists = prev.some((r) => r.id === updatedReg.id);
          if (exists) return prev.map((r) => (r.id === updatedReg.id ? updatedReg : r));
          return [updatedReg, ...prev];
        });
      };

      const handleEventRegistered = (newReg) => {
        setRegisterModalEvent(null);
        if (newReg?.id) {
          setRegistrations((prev) => [newReg, ...prev]);
          setSelectedRegId(newReg.id);
        } else {
          fetchPortalData();
        }
        onSelectTab && onSelectTab('registration');
      };

      const handleOpenRegistrationFromCatalog = (regId) => {
        setSelectedRegId(regId);
        onSelectTab && onSelectTab('registration');
      };

      // Switcher Event & Tim (muncul di tab berbasis event agar peserta mudah berpindah antar lomba)
      const renderEventSwitcher = () => {
        if (authRequired) return null;
        return (
          <div
            style={{
              maxWidth: activeTab === 'registration' ? '1080px' : '1000px',
              margin: '0 auto 1.25rem auto',
              backgroundColor: 'var(--pub-surface)',
              border: '1px solid var(--pub-line)',
              borderRadius: '14px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: '1 1 320px', minWidth: 0 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--pub-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Event & Tim Aktif ({registrations.length} Pendaftaran)
                </div>
                {registrations.length > 0 ? (
                  <select
                    value={activeRegistration?.id || ''}
                    onChange={(e) => setSelectedRegId(e.target.value)}
                    style={{
                      marginTop: '0.15rem',
                      width: '100%',
                      maxWidth: '460px',
                      padding: '0.35rem 0.6rem',
                      borderRadius: '8px',
                      border: '1px solid var(--pub-line)',
                      backgroundColor: 'var(--pub-canvas)',
                      color: 'var(--pub-ink)',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {registrations.map((reg) => (
                      <option key={reg.id} value={reg.id}>
                        {reg.eventName} — {reg.teamName} ({reg.status})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B', marginTop: '0.1rem' }}>
                    Belum terdaftar pada event mana pun
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectTab && onSelectTab('events')}
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: '9px',
                border: '1px solid var(--pub-coral)',
                backgroundColor: 'rgba(201, 75, 60, 0.08)',
                color: 'var(--pub-coral)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Cari / Daftar Event
            </button>
          </div>
        );
      };

      if (loadingPortal) {
        return (
          <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--pub-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '0.85rem' }}>Memuat portal kontingen peserta...</span>
          </div>
        );
      }

      // Banner login jika membuka tab profil/daftar dalam mode demo belum login
      const renderAuthBanner = () =>
        authRequired ? (
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto 1.25rem auto',
              padding: '0.85rem 1.15rem',
              borderRadius: '12px',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              color: '#92400E',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
            }}
          >
            <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0 }} />
            <span>
              Anda sedang melihat mode pratinjau. <strong>Silakan login dengan akun Peserta</strong> terlebih dahulu agar Profil Kontingen, Pas Foto, dan Pendaftaran Event tersimpan ke database.
            </span>
          </div>
        ) : null;

      // Tab: Katalog Seluruh Event
      if (activeTab === 'events') {
        return (
          <>
            {renderLiveDpOverlays()}
            {renderAuthBanner()}
            <PesertaEventCatalog
              registrations={registrations}
              profileMembersCount={profileData?.members?.length || 0}
              onSelectRegisterEvent={(ev) => {
                if (authRequired) {
                  alert('Silakan login terlebih dahulu untuk mendaftar event.');
                  return;
                }
                setRegisterModalEvent(ev);
              }}
              onOpenRegistration={handleOpenRegistrationFromCatalog}
              onGoToProfile={() => onSelectTab && onSelectTab('profile')}
            />
            {registerModalEvent && (
              <PesertaRegisterEventModal
                event={registerModalEvent}
                profileData={profileData}
                existingRegsForEvent={registrations.filter((r) => r.eventId === registerModalEvent.id)}
                onClose={() => setRegisterModalEvent(null)}
                onRegistered={handleEventRegistered}
                onProfileMemberAdded={fetchPortalData}
              />
            )}
          </>
        );
      }

      // Tab: Profil Kontingen & Bank Anggota
      if (activeTab === 'profile') {
        return (
          <>
            {renderLiveDpOverlays()}
            {renderAuthBanner()}
            <PesertaProfilKontingen
              profileData={profileData}
              onProfileUpdated={fetchPortalData}
            />
          </>
        );
      }

      // Tab: Data Tim & Berkas Event Aktif
      if (activeTab === 'registration') {
        return (
          <>
            {renderLiveDpOverlays()}
            {renderAuthBanner()}
            {renderEventSwitcher()}
            <PesertaDataTimBerkas
              activeRegistration={activeRegistration}
              profileData={profileData}
              onRegistrationUpdated={handleRegistrationUpdated}
              onGoToEvents={() => onSelectTab && onSelectTab('events')}
              onGoToProfile={() => onSelectTab && onSelectTab('profile')}
            />
          </>
        );
      }

      if (activeTab === 'schedule') {
        return (
          <>
            {renderLiveDpOverlays()}
            {renderAuthBanner()}
            {renderEventSwitcher()}
            <PesertaScheduleView
              activeRegistration={activeRegistration}
              onGoToEvents={() => onSelectTab && onSelectTab('events')}
            />
          </>
        );
      }

      if (activeTab === 'results') {
        return (
          <>
            {renderLiveDpOverlays()}
            {renderAuthBanner()}
            {renderEventSwitcher()}
            <PesertaResultsView
              activeRegistration={activeRegistration}
              onGoToEvents={() => onSelectTab && onSelectTab('events')}
            />
          </>
        );
      }

      // Default Tab: Dashboard Ringkasan Event Aktif
      const docSummaryItems = activeRegistration?.documents
        ? activeRegistration.documents.map((d) => ({
          name: d.title,
          status: d.status === 'REJECTED' ? 'REVISION' : d.status,
          size: d.fileSize || 'Belum diunggah',
          note: d.rejectionNote || '',
        }))
        : [];

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
          {renderLiveDpOverlays()}
          {renderAuthBanner()}
          {renderEventSwitcher()}

          {/* 1. Header Event Aktif Pasukan */}
          <PesertaHero
            eventName={activeRegistration?.eventName || 'Belum Ada Event Aktif'}
            regCode={activeRegistration?.registrationNumber || 'BELUM TERDAFTAR'}
            location={activeRegistration?.eventLocation || 'Pilih event pada menu Event di sidebar'}
            date={activeRegistration ? formatDateId(activeRegistration.eventDate) : '-'}
            category={activeRegistration?.category || profileData?.profile?.category || 'SMA/SMK/MA'}
            status={activeRegistration?.status || 'DRAFT'}
            onOpenSchedule={() =>
              onSelectTab && onSelectTab(activeRegistration ? 'schedule' : 'events')
            }
          />

          {/* 2. Metrics 3 Kolom Status & Pasukan */}
          <PesertaMetrics
            statusDocs={
              activeRegistration
                ? activeRegistration.status === 'VALIDATED' || activeRegistration.status === 'SCHEDULED'
                  ? 'TERVERIFIKASI'
                  : `${activeRegistration.docsSummary?.uploaded || 0}/${activeRegistration.docsSummary?.total || 0} BERKAS`
                : 'BELUM DAFTAR'
            }
            orderNumber={
              activeRegistration?.queueNumber
                ? `#${String(activeRegistration.queueNumber).padStart(2, '0')}`
                : 'Menunggu TM'
            }
            orderSlot={
              activeRegistration?.performanceTime
                ? new Date(activeRegistration.performanceTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
                : 'Menunggu penetapan jadwal panitia'
            }
            school={activeRegistration?.schoolName || profileData?.profile?.schoolName || 'Belum diisi'}
            teamName={activeRegistration?.teamName || profileData?.profile?.defaultTeamName || 'Lengkapi Profil Kontingen'}
          />

          {/* 3. Pelacak Live Posisi Pos DP 1–4 */}
          <PesertaLiveDPTracker
            activeRegistration={activeRegistration}
            dpStatus={dpStatus}
            notificationPermission={notificationPermission}
            pushSubscribed={pushSubscribed}
            pushBusy={pushBusy}
            pushFeedback={pushFeedback}
            onRequestNotificationPermission={handleRequestNotificationPermission}
            onSimulatePopup={handleSimulatePopup}
            onSimulateTopPush={handleSimulateTopPush}
          />

          {/* 4. Timeline Perjalanan Lomba Dinamis dari Admin Panitia */}
          <PesertaTimeline activeRegistration={activeRegistration} />

          {/* 4. Grid Dokumen Berkas & Agenda Kegiatan */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            <PesertaDocuments documents={docSummaryItems} />
            <PesertaAgenda
              activeRegistration={activeRegistration}
              onOpenSchedule={() => onSelectTab && onSelectTab('schedule')}
            />
          </div>
        </div>
      );
    }
