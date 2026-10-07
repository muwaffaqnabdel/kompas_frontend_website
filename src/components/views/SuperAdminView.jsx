import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus, CheckCircle, X } from 'lucide-react';
import SuperAdminStats from './super-admin/SuperAdminStats';
import SuperAdminOverviewCharts from './super-admin/SuperAdminOverviewCharts';
import SuperAdminEventTable from './super-admin/SuperAdminEventTable';
import SuperAdminPanitiaTable from './super-admin/SuperAdminPanitiaTable';
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

  const fetchSuperAdminData = async () => {
    setLoading(true);
    try {
      const [overviewRes, eventsRes] = await Promise.all([
        fetch('/api/super-admin/overview'),
        fetch('/api/events'),
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
        body: JSON.stringify(newEventForm),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: 'success', text: `Event "${data.event.name}" berhasil didaftarkan!` });
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
          text: `Akun Admin "${assignForm.username}" (${assignForm.email}) berhasil dibuat dan ditugaskan ke "${targetAssignEvent?.name || 'Event'}"!`,
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
        body: JSON.stringify(controlForm),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: 'success', text: `Konfigurasi lomba "${selectedEvent.name}" berhasil diperbarui!` });
        setControlModalOpen(false);
        await fetchSuperAdminData();
      } else {
        alert(data.message || 'Gagal mengubah status event.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', fontFamily: 'var(--font-sans)' }}>
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            backgroundColor: notification.type === 'success' ? 'var(--pub-teal-light)' : 'var(--pub-coral-pale)',
            border: `1px solid ${notification.type === 'success' ? 'var(--pub-teal)' : 'var(--pub-coral)'}`,
            color: notification.type === 'success' ? 'var(--pub-teal)' : 'var(--pub-coral)',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'var(--pub-shadow-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <CheckCircle size={18} />
            <span>{notification.text}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            <X size={16} />
          </button>
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
              : 'Overview Operasional & Kontrol Event'}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--pub-muted)', margin: 0, maxWidth: '720px' }}>
            {activeTab === 'events'
              ? 'Tabel matriks kontrol dan pemantauan kesehatan seluruh event perlombaan Paskibra se-Indonesia.'
              : activeTab === 'admins'
              ? 'Daftar akun pengelola operasional yang memiliki hak akses pengelolaan event lomba Paskibra.'
              : activeTab === 'audit'
              ? 'Catatan rekaman aksi seluruh pengguna, perubahan status lomba, dan mutasi data secara kronologis.'
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

      {/* TAB: MONITORING LAPANGAN */}
      {activeTab === 'monitoring' && (
        <>
          <SuperAdminOverviewCharts events={events} stats={stats} />
          <SuperAdminEventTable
            events={events}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onOpenAssignModal={handleOpenAssignModal}
            onOpenControlModal={handleOpenControlModal}
          />
        </>
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
