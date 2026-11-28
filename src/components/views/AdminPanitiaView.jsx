import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, X, Users, FileText } from 'lucide-react';
import AdminPanitiaHeader from './admin-panitia/AdminPanitiaHeader';
import AdminPanitiaEventSettings from './admin-panitia/AdminPanitiaEventSettings';
import AdminPanitiaTimelineConfig from './admin-panitia/AdminPanitiaTimelineConfig';
import AdminPanitiaReadiness from './admin-panitia/AdminPanitiaReadiness';
import AdminPanitiaDPConfig from './admin-panitia/AdminPanitiaDPConfig';
import AdminPanitiaJudgesConfig from './admin-panitia/AdminPanitiaJudgesConfig';
import AdminPanitiaCriteriaConfig, { STORAGE_KEY_SCORING_LOCKED } from './admin-panitia/AdminPanitiaCriteriaConfig';
import AdminPanitiaDPMonitoring from './admin-panitia/AdminPanitiaDPMonitoring';
import AdminPanitiaParticipantTable from './admin-panitia/AdminPanitiaParticipantTable';
import AdminPanitiaDocRequirements from './admin-panitia/AdminPanitiaDocRequirements';
import AdminPanitiaTechnicalMeeting from './admin-panitia/AdminPanitiaTechnicalMeeting';
import AdminPanitiaResults from './admin-panitia/AdminPanitiaResults';
import { getStoredBanner, saveStoredBanner } from '../../data/publicEvents';

export default function AdminPanitiaView({ activeTab = 'dashboard' }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [currentEvent, setCurrentEvent] = useState(null);
  const [notification, setNotification] = useState(null);
  const [dashboardSubTab, setDashboardSubTab] = useState('settings'); // 'settings' | 'timeline'
  const [participantSubTab, setParticipantSubTab] = useState('list'); // 'list' | 'requirements'

  const [dpFlowLocked, setDpFlowLocked] = useState(false);
  const [scoringLocked, setScoringLocked] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SCORING_LOCKED) === 'true';
    } catch {
      return false;
    }
  });

  // 1. Ambil daftar event yang dapat diakses oleh Admin Panitia ini
  useEffect(() => {
    fetchEventsList();
  }, [user]);

  const fetchEventsList = async () => {
    try {
      const res = await fetch('/api/panitia/events', { credentials: 'include' });
      const data = await res.json();
      if (data.success && data.events?.length > 0) {
        setEvents(data.events);
        // Prioritaskan event yang sudah dipilih sebelumnya, atau event pertama
        setSelectedEventId((prev) => prev || data.events[0].id);
      }
    } catch (err) {
      console.error('[PANITIA VIEW] Error fetching events list:', err);
    }
  };

  // 2. Ambil detail event yang sedang aktif dipilih
  useEffect(() => {
    if (!selectedEventId) return;
    fetchEventDetail(selectedEventId);
  }, [selectedEventId]);

  const fetchEventDetail = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/panitia/event?eventId=${id}`, { credentials: 'include' });
      const data = await res.json();
      if (data.success && data.event) {
        // Amankan banner dari Supabase atau cache persistensi lokal
        const storedBanner = getStoredBanner(data.event.id) || getStoredBanner(data.event.slug) || getStoredBanner(id);
        const resolvedEvent = {
          ...data.event,
          bannerUrl: data.event.bannerUrl || storedBanner || undefined,
        };
        setCurrentEvent(resolvedEvent);
        setDpFlowLocked(!!data.event.dpFlowLocked);
        setScoringLocked(!!data.event.scoringLocked);
      }
    } catch (err) {
      console.error('[PANITIA VIEW] Error fetching event detail:', err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Simpan perubahan konfigurasi event dari Admin Panitia
  const handleUpdateEvent = async (updatePayload) => {
    if (updatePayload.bannerUrl) {
      saveStoredBanner(selectedEventId, updatePayload.bannerUrl);
      if (currentEvent?.id) saveStoredBanner(currentEvent.id, updatePayload.bannerUrl);
      if (currentEvent?.slug) saveStoredBanner(currentEvent.slug, updatePayload.bannerUrl);
    }

    // Optimistic local state update agar tampilan banner & preview seketika terupdate
    setCurrentEvent((prev) => ({
      ...prev,
      ...updatePayload,
      ...(updatePayload.bannerUrl ? { bannerUrl: updatePayload.bannerUrl } : {}),
    }));

    try {
      const res = await fetch('/api/panitia/event', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatePayload),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: 'success',
          text: `Pengaturan lomba "${updatePayload.name || currentEvent?.name}" berhasil disimpan ke Supabase!`,
        });
        await fetchEventDetail(selectedEventId);
      } else {
        alert(data.message || 'Gagal menyimpan pengaturan.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    }
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', fontFamily: 'var(--font-sans)', position: 'relative' }}>
      {/* Floating Notification */}
      {notification && (
        <div
          role="status"
          style={{
            position: 'fixed',
            top: '24px',
            right: '28px',
            zIndex: 99999,
            minWidth: '320px',
            maxWidth: '420px',
            backgroundColor: 'var(--pub-surface)',
            borderRadius: '14px',
            border: '1px solid var(--pub-teal)',
            boxShadow: '0 14px 36px -6px rgba(23, 42, 70, 0.22)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <CheckCircle2 size={18} color="var(--pub-teal)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--pub-ink)' }}>
              {notification.text}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pub-muted)' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 1. Dynamic Header Banner dengan Event Real Supabase & Switcher */}
      <AdminPanitiaHeader
        currentEvent={currentEvent}
        events={events}
        selectedEventId={selectedEventId}
        onSelectEvent={setSelectedEventId}
      />

      {/* 2. Content View Based on activeTab */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Sub-Tab Navigation: Detail & Banner Lomba vs Timeline Tahapan Lomba */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'var(--pub-surface)',
              padding: '0.4rem',
              borderRadius: '12px',
              border: '1px solid var(--pub-line)',
              width: 'fit-content',
              boxShadow: 'var(--pub-shadow-card)',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => setDashboardSubTab('settings')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: dashboardSubTab === 'settings' ? 'var(--pub-coral)' : 'transparent',
                color: dashboardSubTab === 'settings' ? '#FFFFFF' : 'var(--pub-muted)',
                fontSize: '0.825rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Detail & Banner Lomba
            </button>

            <button
              type="button"
              onClick={() => setDashboardSubTab('timeline')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: dashboardSubTab === 'timeline' ? 'var(--pub-coral)' : 'transparent',
                color: dashboardSubTab === 'timeline' ? '#FFFFFF' : 'var(--pub-muted)',
                fontSize: '0.825rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Timeline Tahapan Lomba
            </button>
          </div>

          {dashboardSubTab === 'settings' ? (
            <AdminPanitiaEventSettings
              currentEvent={currentEvent}
              onUpdateEvent={handleUpdateEvent}
              eventId={selectedEventId}
            />
          ) : (
            <AdminPanitiaTimelineConfig
              currentEvent={currentEvent}
              onUpdateEvent={handleUpdateEvent}
              eventId={selectedEventId}
            />
          )}
        </div>
      )}

      {activeTab === 'participants' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Sub-Tab Navigation: Daftar Peserta vs Konfigurasi Berkas */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'var(--pub-surface)',
              padding: '0.4rem',
              borderRadius: '12px',
              border: '1px solid var(--pub-line)',
              width: 'fit-content',
              boxShadow: 'var(--pub-shadow-card)',
            }}
          >
            <button
              type="button"
              onClick={() => setParticipantSubTab('list')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.15rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: participantSubTab === 'list' ? 'var(--pub-coral)' : 'transparent',
                color: participantSubTab === 'list' ? '#FFFFFF' : 'var(--pub-muted)',
                fontSize: '0.825rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Users size={15} />
              <span>Daftar Kontingen & Verifikasi</span>
            </button>

            <button
              type="button"
              onClick={() => setParticipantSubTab('requirements')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.15rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: participantSubTab === 'requirements' ? 'var(--pub-coral)' : 'transparent',
                color: participantSubTab === 'requirements' ? '#FFFFFF' : 'var(--pub-muted)',
                fontSize: '0.825rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <FileText size={15} />
              <span>Konfigurasi Berkas Persyaratan</span>
            </button>
          </div>

          {/* Konten Berdasarkan Sub-Tab Terpilih */}
          {participantSubTab === 'list' ? (
            <AdminPanitiaParticipantTable
              eventId={selectedEventId}
              currentEvent={currentEvent}
            />
          ) : (
            <AdminPanitiaDocRequirements
              eventId={selectedEventId || currentEvent?.id || 'evt-lkbb-2026'}
            />
          )}
        </div>
      )}

      {activeTab === 'flow-dp' && (
        <>
          <AdminPanitiaReadiness
            currentEvent={currentEvent}
            dpFlowLocked={dpFlowLocked}
            setDpFlowLocked={setDpFlowLocked}
            scoringLocked={scoringLocked}
            setScoringLocked={setScoringLocked}
          />
          <AdminPanitiaDPConfig
            currentEvent={currentEvent}
            dpFlowLocked={dpFlowLocked}
            setDpFlowLocked={setDpFlowLocked}
          />
        </>
      )}

      {activeTab === 'live-dp' && (
        <AdminPanitiaDPMonitoring
          currentEvent={currentEvent}
        />
      )}

      {(activeTab === 'judges' || activeTab === 'staff') && (
        <AdminPanitiaJudgesConfig
          currentEvent={currentEvent}
        />
      )}

      {activeTab === 'criteria' && (
        <>
          <AdminPanitiaReadiness
            currentEvent={currentEvent}
            dpFlowLocked={dpFlowLocked}
            setDpFlowLocked={setDpFlowLocked}
            scoringLocked={scoringLocked}
            setScoringLocked={setScoringLocked}
          />
          <AdminPanitiaCriteriaConfig
            currentEvent={currentEvent}
            scoringLocked={scoringLocked}
            setScoringLocked={setScoringLocked}
          />
        </>
      )}

      {activeTab === 'schedule' && (
        <AdminPanitiaTechnicalMeeting
          currentEvent={currentEvent}
        />
      )}

      {activeTab === 'results' && (
        <AdminPanitiaResults
          currentEvent={currentEvent}
        />
      )}
    </div>
  );
}
