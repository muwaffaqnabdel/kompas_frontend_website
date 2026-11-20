import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Plus,
  CheckCircle2,
  X,
  Sliders,
  Lock,
  Unlock,
  UserCheck,
} from 'lucide-react';
import SuperAdminStats from './super-admin/SuperAdminStats';
import SuperAdminOverviewCharts from './super-admin/SuperAdminOverviewCharts';
import SuperAdminEventTable from './super-admin/SuperAdminEventTable';
import SuperAdminPanitiaTable from './super-admin/SuperAdminPanitiaTable';
import SuperAdminMonitoringCards from './super-admin/SuperAdminMonitoringCards';
import SuperAdminAuditLog from './super-admin/SuperAdminAuditLog';
import CreateEventModal from './super-admin/modals/CreateEventModal';
import AssignAdminModal from './super-admin/modals/AssignAdminModal';
import ControlEventModal from './super-admin/modals/ControlEventModal';

export default function SuperAdminView({ activeTab = 'overview' }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 2,
    totalUsers: 10,
    totalParticipants: 4,
    systemStatus: 'ONLINE_ACTIVE',
  });
  const [events, setEvents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [notification, setNotification] = useState(null);

  // Modal States
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [controlModalOpen, setControlModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [targetAssignEvent, setTargetAssignEvent] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form States
  const [newEventForm, setNewEventForm] = useState({
    name: '',
    location: '',
    eventDate: '2026-11-20',
    description: '',
    status: 'REGISTRATION_OPEN',
  });

  const [assignForm, setAssignForm] = useState({
    eventId: '',
    username: '',
    email: '',
    password: '',
  });

  const [controlForm, setControlForm] = useState({
    status: 'REGISTRATION_OPEN',
    dpFlowLocked: false,
    scoringLocked: false,
    resultsPublished: false,
  });

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

  // Auto-dismiss floating toast notification setelah 5 detik
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification]);

  const fetchSuperAdminData = async () => {
    setLoading(true);
    try {
      const [overviewRes, eventsRes] = await Promise.all([
        fetch('/api/super-admin/overview', { credentials: 'include' }),
        fetch('/api/events', { credentials: 'include' }),
      ]);

      const overviewData = await overviewRes.json();
      const eventsData = await eventsRes.json();

      if (overviewData.success) {
        setStats(overviewData.stats);
        setAuditLogs(overviewData.auditLogs || []);
      }

      if (eventsData.success) {
        setEvents(eventsData.events || []);
      }
    } catch (err) {
      console.error('Error fetching super admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newEventForm),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: 'success',
          category: 'CREATE_EVENT',
          title: 'Event Berhasil Didaftarkan',
          eventName: data.event.name,
          text: `Event "${data.event.name}" berhasil didaftarkan ke Supabase dan siap dikonfigurasi.`,
        });
        setCreateModalOpen(false);
        setNewEventForm({ name: '', location: '', eventDate: '2026-11-20', description: '', status: 'REGISTRATION_OPEN' });
        await fetchSuperAdminData();
      } else {
        alert(data.message || 'Gagal membuat event.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    }
  };

  const handleOpenAssignModal = (evt) => {
    setTargetAssignEvent(evt);
    setAssignForm({
      eventId: evt.id,
      username: '',
      email: '',
      password: '',
    });
    setShowPassword(false);
    setAssignModalOpen(true);
  };

  const handleAssignAdmin = async (e) => {
    e.preventDefault();
    if (!assignForm.eventId) return;

    try {
      const res = await fetch(`/api/events/${assignForm.eventId}/assign-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: assignForm.email,
          username: assignForm.username,
          fullName: assignForm.username,
          password: assignForm.password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: 'success',
          category: 'ASSIGN_ADMIN',
          title: 'Admin Panitia Berhasil Ditugaskan',
          eventName: targetAssignEvent?.name || 'Event',
          text: `Akun Admin "${assignForm.username}" (${assignForm.email}) berhasil dibuat dan ditugaskan ke "${targetAssignEvent?.name || 'Event'}".`,
        });
        setAssignModalOpen(false);
        setAssignForm({ eventId: '', username: '', email: '', password: '' });
        await fetchSuperAdminData();
      } else {
        alert(data.message || 'Gagal membuat akun admin.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    }
  };

  const handleOpenControlModal = (evt) => {
    setSelectedEvent(evt);
    setControlForm({
      status: evt.status || 'REGISTRATION_OPEN',
      dpFlowLocked: !!evt.dpFlowLocked,
      scoringLocked: !!evt.scoringLocked,
      resultsPublished: !!evt.resultsPublished,
    });
    setControlModalOpen(true);
  };

  const handleUpdateEventControl = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const res = await fetch(`/api/events/${selectedEvent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(controlForm),
      });
      const data = await res.json();
      if (data.success) {
        const STATUS_LABEL_MAP = {
          DRAFT_SETUP: 'Draft Setup',
          REGISTRATION_OPEN: 'Pendaftaran Dibuka',
          VALIDATION: 'Verifikasi Berkas',
          TECHNICAL_MEETING: 'Technical Meeting',
          LIVE: 'Hari H (Live)',
          SCORING_REVIEW: 'Review Penilaian',
          PUBLISHED: 'Hasil Dipublikasi',
          ARCHIVED: 'Arsip',
        };
        const statusLabel = STATUS_LABEL_MAP[controlForm.status] || controlForm.status;

        setNotification({
          type: 'success',
          category: 'KONTROL_STATUS',
          title: 'Status & Kontrol Berhasil Diperbarui',
          eventName: selectedEvent.name,
          statusLabel,
          statusKey: controlForm.status,
          dpFlowLocked: controlForm.dpFlowLocked,
          scoringLocked: controlForm.scoringLocked,
          resultsPublished: controlForm.resultsPublished,
          text: `Status tahapan event "${selectedEvent.name}" berhasil diubah menjadi "${statusLabel}".`,
        });
        setControlModalOpen(false);
        // Update state lokal secara instan (optimistic UI) agar tabel dan kartu langsung ter-update
        setEvents((prev) =>
          prev.map((e) =>
            e.id === selectedEvent.id
              ? {
                  ...e,
                  ...controlForm,
                  status: controlForm.status,
                  dpFlowLocked: controlForm.dpFlowLocked,
                  scoringLocked: controlForm.scoringLocked,
                  resultsPublished: controlForm.resultsPublished,
                  ...(data.event || {}),
                }
              : e
          )
        );
        await fetchSuperAdminData();
      } else {
        alert(data.message || 'Gagal mengubah status event.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', fontFamily: 'var(--font-sans)', position: 'relative' }}>
      {/* FLOATING TOAST NOTIFICATION (Pojok Kanan Atas - Sangat Jelas & Eye-Catching) */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: '24px',
            right: '28px',
            zIndex: 99999,
            minWidth: '340px',
            maxWidth: '440px',
            backgroundColor: 'var(--pub-surface)',
            borderRadius: '16px',
            border: notification.category === 'KONTROL_STATUS' ? '1px solid var(--pub-teal)' : '1px solid var(--pub-line)',
            boxShadow: '0 16px 40px -8px rgba(23, 42, 70, 0.22), 0 4px 14px rgba(23, 42, 70, 0.08)',
            padding: '1.15rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            fontFamily: 'var(--font-sans)',
            overflow: 'hidden',
          }}
        >
          <style>{`
            @keyframes toastSlideIn {
              from { transform: translateY(-16px) scale(0.96); opacity: 0; }
              to { transform: translateY(0) scale(1); opacity: 1; }
            }
            @keyframes toastProgress {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>

          {/* Toast Top Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: notification.type === 'success' ? 'var(--pub-teal-light)' : 'var(--pub-coral-pale)',
                  color: notification.type === 'success' ? 'var(--pub-teal)' : 'var(--pub-coral)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {notification.category === 'KONTROL_STATUS' ? (
                  <Sliders size={18} />
                ) : notification.category === 'ASSIGN_ADMIN' ? (
                  <UserCheck size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
              </div>
              <div>
                <div
                  style={{
                    fontSize: '0.6875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: notification.type === 'success' ? 'var(--pub-teal)' : 'var(--pub-coral)',
                    fontWeight: 800,
                  }}
                >
                  {notification.category === 'KONTROL_STATUS'
                    ? 'KONTROL STATUS'
                    : notification.category === 'ASSIGN_ADMIN'
                    ? 'PENUGASAN PIC'
                    : 'EVENT MANAGEMENT'}
                </div>
                <div style={{ fontWeight: 800, color: 'var(--pub-ink)', fontSize: '0.925rem', fontFamily: 'var(--font-heading)' }}>
                  {notification.title || 'Operasi Berhasil'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setNotification(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--pub-muted)',
                padding: '0.2rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.15s ease',
              }}
              title="Tutup notifikasi"
            >
              <X size={16} />
            </button>
          </div>

          {/* Toast Message Body */}
          <div style={{ fontSize: '0.825rem', color: 'var(--pub-ink)', lineHeight: 1.45 }}>
            {notification.text}
          </div>

          {/* Detail Khusus Aksi Kontrol (Badge Status & Status Kunci Alur) */}
          {notification.category === 'KONTROL_STATUS' && (
            <div
              style={{
                backgroundColor: 'var(--pub-canvas)',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--pub-line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
                fontSize: '0.75rem',
                marginTop: '0.1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ color: 'var(--pub-muted)', fontWeight: 600 }}>Status:</span>
                <span
                  style={{
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    backgroundColor: 'var(--pub-teal-light)',
                    color: 'var(--pub-teal)',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--pub-teal)' }} />
                  {notification.statusLabel}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.7rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    color: notification.dpFlowLocked ? 'var(--pub-teal)' : 'var(--pub-muted)',
                    fontWeight: 600,
                  }}
                >
                  {notification.dpFlowLocked ? <Lock size={11} /> : <Unlock size={11} />}
                  <span>{notification.dpFlowLocked ? 'Alur DP Kunci' : 'Alur DP Buka'}</span>
                </span>
              </div>
            </div>
          )}

          {/* Animated Countdown Progress Bar (5s Auto-Dismiss) */}
          <div
            style={{
              height: '3px',
              backgroundColor: 'var(--pub-line-subtle)',
              borderRadius: '999px',
              overflow: 'hidden',
              marginTop: '0.2rem',
            }}
          >
            <div
              style={{
                height: '100%',
                backgroundColor: notification.type === 'success' ? 'var(--pub-teal)' : 'var(--pub-coral)',
                animation: 'toastProgress 5s linear forwards',
              }}
            />
          </div>
        </div>
      )}

      {/* Header Command Center */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: 'var(--pub-surface)',
          padding: '1.75rem 2rem',
          borderRadius: 'var(--pub-radius-card)',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--pub-coral)',
              marginBottom: '0.35rem',
            }}
          >
            <span>
              {activeTab === 'events'
                ? 'MANAJEMEN EVENT NASIONAL'
                : activeTab === 'admins'
                ? 'PENGELOLA OPERASIONAL LOMBA'
                : activeTab === 'audit'
                ? 'SECURITY & AUDIT TRAIL'
                : activeTab === 'monitoring'
                ? 'MONITORING LAPANGAN & VALIDASI BERKAS'
                : 'KONTROL & MONITORING GLOBAL'}
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.85rem',
              fontWeight: 800,
              color: 'var(--pub-ink)',
              margin: '0.15rem 0 0.4rem 0',
              letterSpacing: '-0.02em',
            }}
          >
            {activeTab === 'events'
              ? 'Daftar Seluruh Event & Kontrol'
              : activeTab === 'admins'
              ? 'Manajemen Akun Admin Panitia'
              : activeTab === 'audit'
              ? 'Jejak Audit & Log Operasional'
              : activeTab === 'monitoring'
              ? 'Monitoring Lapangan & Berkas Kontingen'
              : 'Overview Operasional & Kontrol Event'}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--pub-muted)', margin: 0, maxWidth: '720px' }}>
            {activeTab === 'events'
              ? 'Tabel matriks kontrol dan pemantauan kesehatan seluruh event perlombaan Paskibra se-Indonesia.'
              : activeTab === 'admins'
              ? 'Daftar akun pengelola operasional yang memiliki hak akses pengelolaan event lomba Paskibra.'
              : activeTab === 'audit'
              ? 'Catatan rekaman aksi seluruh pengguna, perubahan status lomba, dan mutasi data secara kronologis.'
              : activeTab === 'monitoring'
              ? 'Pantau progres kesiapan lapangan, status pos Decision Point (DP 1-4), dan kelengkapan dokumen kontingen secara interaktif.'
              : 'Pusat kendali Super Admin: daftarkan lomba baru, atur status alur persiapan, delegasikan Admin Panitia, dan pantau seluruh perlombaan Paskibra se-Indonesia.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={fetchSuperAdminData}
            className="pub-btn-outline"
            style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}
            title="Muat ulang data"
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="pub-btn-coral"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
          >
            <Plus size={16} />
            <span>Daftarkan Lomba Baru</span>
          </button>
        </div>
      </div>

      {/* TAB: GLOBAL OVERVIEW (Statistik & Visual Charts Analytics) */}
      {activeTab === 'overview' && (
        <>
          <SuperAdminStats stats={stats} events={events} />
          <SuperAdminOverviewCharts events={events} stats={stats} />
          <SuperAdminAuditLog auditLogs={auditLogs} />
        </>
      )}

      {/* TAB: DAFTAR SELURUH EVENT (Tabel Matriks Kontrol & Operasional) */}
      {activeTab === 'events' && (
        <SuperAdminEventTable
          events={events}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onOpenAssignModal={handleOpenAssignModal}
          onOpenControlModal={handleOpenControlModal}
        />
      )}

      {/* TAB: ADMIN PANITIA (Daftar Akun Pengelola & Penugasan Event) */}
      {activeTab === 'admins' && (
        <SuperAdminPanitiaTable
          events={events}
          onOpenAssignModal={handleOpenAssignModal}
        />
      )}

      {/* TAB: MONITORING LAPANGAN (Visual Operational Cards) */}
      {activeTab === 'monitoring' && (
        <SuperAdminMonitoringCards
          events={events}
          onOpenControlModal={handleOpenControlModal}
        />
      )}

      {/* TAB: AUDIT TRAIL & LOG */}
      {activeTab === 'audit' && (
        <SuperAdminAuditLog auditLogs={auditLogs} />
      )}

      {/* 4. Modals */}
      <CreateEventModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
        newEventForm={newEventForm}
        setNewEventForm={setNewEventForm}
      />

      <AssignAdminModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        onSubmit={handleAssignAdmin}
        targetEvent={targetAssignEvent}
        assignForm={assignForm}
        setAssignForm={setAssignForm}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <ControlEventModal
        isOpen={controlModalOpen}
        onClose={() => setControlModalOpen(false)}
        onSubmit={handleUpdateEventControl}
        selectedEvent={selectedEvent}
        controlForm={controlForm}
        setControlForm={setControlForm}
      />
    </div>
  );
}
