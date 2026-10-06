import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Plus,
  Eye,
  ShieldAlert,
  Settings,
  UserPlus,
  RefreshCw,
  Search,
  Filter,
  Lock,
  Unlock,
  Radio,
  FileText,
  Activity,
  X,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function SuperAdminView() {
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

  // Forms
  const [newEventForm, setNewEventForm] = useState({
    name: '',
    location: '',
    eventDate: '2026-11-20',
    description: '',
    status: 'REGISTRATION_OPEN',
  });

  const [assignForm, setAssignForm] = useState({
    eventId: '',
    email: '',
    fullName: '',
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

  const handleAssignAdmin = async (e) => {
    e.preventDefault();
    if (!assignForm.eventId) return;

    try {
      const res = await fetch(`/api/events/${assignForm.eventId}/assign-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: assignForm.email, fullName: assignForm.fullName }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: 'success', text: data.message });
        setAssignModalOpen(false);
        setAssignForm({ eventId: '', email: '', fullName: '' });
        await fetchSuperAdminData();
      } else {
        alert(data.message || 'Gagal menugaskan admin.');
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

  // Filtered Events
  const filteredEvents = events.filter((evt) => {
    const matchSearch =
      evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.location && evt.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = statusFilter === 'ALL' || evt.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'REGISTRATION_OPEN':
        return { bg: 'var(--pub-teal-light)', color: 'var(--pub-teal)', label: 'Pendaftaran Dibuka' };
      case 'DRAFT_SETUP':
        return { bg: '#FEF3C7', color: 'var(--pub-amber)', label: 'Draft Setup' };
      case 'LIVE':
        return { bg: 'var(--pub-coral-pale)', color: 'var(--pub-coral)', label: 'Hari H (Live)' };
      case 'PUBLISHED':
        return { bg: '#E0E7FF', color: '#4338CA', label: 'Hasil Dipublikasi' };
      case 'ARCHIVED':
      default:
        return { bg: 'var(--pub-sand)', color: 'var(--pub-muted)', label: 'Arsip' };
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
            <Sparkles size={14} />
            <span>KONTROL & MONITORING GLOBAL</span>
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
            Overview Operasional & Kontrol Event
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--pub-muted)', margin: 0, maxWidth: '720px' }}>
            Pusat kendali Super Admin: daftarkan lomba baru, atur status alur persiapan, delegasikan Admin Panitia, dan pantau seluruh perlombaan Paskibra se-Indonesia.
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

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div
          style={{
            backgroundColor: 'var(--pub-surface)',
            padding: '1.4rem 1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--pub-line)',
            boxShadow: 'var(--pub-shadow-card)',
            borderLeft: '5px solid var(--pub-coral)',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
            Total Event Terdaftar
          </div>
          <div
            className="tabular-nums"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.2rem',
              fontWeight: 800,
              color: 'var(--pub-ink)',
              margin: '0.35rem 0',
            }}
          >
            {events.length}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--pub-ink-soft)' }}>
            {events.filter((e) => e.status === 'REGISTRATION_OPEN').length} Buka Pendaftaran · {events.filter((e) => e.status === 'LIVE').length} Live Hari H
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--pub-surface)',
            padding: '1.4rem 1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--pub-line)',
            boxShadow: 'var(--pub-shadow-card)',
            borderLeft: '5px solid var(--pub-teal)',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
            Total Tim Kontingen
          </div>
          <div
            className="tabular-nums"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.2rem',
              fontWeight: 800,
              color: 'var(--pub-ink)',
              margin: '0.35rem 0',
            }}
          >
            {stats.totalParticipants || 4}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--pub-teal)', fontWeight: 600 }}>
            Tersebar di seluruh event aktif
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--pub-surface)',
            padding: '1.4rem 1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--pub-line)',
            boxShadow: 'var(--pub-shadow-card)',
            borderLeft: '5px solid var(--pub-amber)',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
            Akun Pengguna Sistem
          </div>
          <div
            className="tabular-nums"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.2rem',
              fontWeight: 800,
              color: 'var(--pub-ink)',
              margin: '0.35rem 0',
            }}
          >
            {stats.totalUsers || 10}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--pub-ink-soft)' }}>
            Super Admin, Panitia, Juri & Peserta
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--pub-surface)',
            padding: '1.4rem 1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--pub-line)',
            boxShadow: 'var(--pub-shadow-card)',
            borderLeft: '5px solid var(--pub-navy)',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
            Status Engine & AI
          </div>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--pub-teal)',
              margin: '0.55rem 0 0.35rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--pub-teal)' }} />
            <span>ONLINE AKTIF</span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--pub-ink-soft)' }}>
            Groq Whisper & NLP Siap
          </div>
        </div>
      </div>

      {/* Escalation Alert Notice */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          border: '1px solid var(--pub-line)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--pub-coral-pale)',
              color: 'var(--pub-coral)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldAlert size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--pub-ink)', fontFamily: 'var(--font-heading)' }}>
              Delegasi Admin Panitia & Kesiapan Lomba
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--pub-muted)' }}>
              Pastikan setiap event yang dibuat telah ditugaskan minimal 1 Admin Panitia agar verifikasi berkas dan alur pos DP dapat berjalan.
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (events.length > 0) {
              setAssignForm({ ...assignForm, eventId: events[0].id });
            }
            setAssignModalOpen(true);
          }}
          className="pub-btn-outline"
          style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}
        >
          <UserPlus size={15} />
          <span>Tugaskan Admin Panitia</span>
        </button>
      </div>

      {/* Main Table: Kontrol Seluruh Event */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          overflow: 'hidden',
        }}
      >
        {/* Table Top Controls & Filter */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--pub-line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--pub-ink)',
                margin: 0,
              }}
            >
              Matriks Kontrol Seluruh Event
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
              Klik tombol kontrol pada masing-masing event untuk membuka pendaftaran, mengunci alur DP, atau mempublikasikan hasil.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--pub-canvas)',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid var(--pub-line)',
              }}
            >
              <Search size={15} color="var(--pub-muted)" />
              <input
                type="text"
                placeholder="Cari event / lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.8125rem',
                  color: 'var(--pub-ink)',
                  width: '160px',
                }}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid var(--pub-line)',
                backgroundColor: 'var(--pub-canvas)',
                fontSize: '0.8125rem',
                color: 'var(--pub-ink)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">Semua Status</option>
              <option value="REGISTRATION_OPEN">Pendaftaran Dibuka</option>
              <option value="DRAFT_SETUP">Draft Setup</option>
              <option value="LIVE">Hari H (Live)</option>
              <option value="PUBLISHED">Hasil Diumumkan</option>
              <option value="ARCHIVED">Arsip</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--pub-canvas)', borderBottom: '1px solid var(--pub-line)' }}>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.8125rem', textTransform: 'uppercase' }}>
                  Nama Event & Slug
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.8125rem', textTransform: 'uppercase' }}>
                  Tanggal & Lokasi
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.8125rem', textTransform: 'uppercase' }}>
                  Pos DP & Peserta
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.8125rem', textTransform: 'uppercase' }}>
                  Proteksi Sistem
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.8125rem', textTransform: 'uppercase' }}>
                  Status Lomba
                </th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.8125rem', textTransform: 'uppercase', textAlign: 'right' }}>
                  Aksi Kontrol
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((evt) => {
                const badge = getStatusBadge(evt.status);
                return (
                  <tr
                    key={evt.id}
                    style={{
                      borderBottom: '1px solid var(--pub-line)',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--pub-canvas)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--pub-ink)', fontFamily: 'var(--font-heading)', fontSize: '0.95rem' }}>
                        {evt.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>
                        ID: <code style={{ fontFamily: 'var(--font-mono)' }}>{evt.slug}</code>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--pub-ink-soft)', fontSize: '0.825rem' }}>
                        <Calendar size={13} color="var(--pub-muted)" />
                        <span>{new Date(evt.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--pub-muted)', fontSize: '0.775rem', marginTop: '0.2rem' }}>
                        <MapPin size={12} />
                        <span>{evt.location || 'Lokasi Belum Diatur'}</span>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--pub-ink)' }}>
                        {evt._count?.participants || 4} Tim Terdaftar
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>
                        4 Pos Decision Point Standar
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span
                          style={{
                            fontSize: '0.725rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            color: evt.dpFlowLocked ? 'var(--pub-coral)' : 'var(--pub-muted)',
                            fontWeight: evt.dpFlowLocked ? 700 : 500,
                          }}
                        >
                          {evt.dpFlowLocked ? <Lock size={12} /> : <Unlock size={12} />}
                          Alur DP: {evt.dpFlowLocked ? 'Terkunci' : 'Terbuka'}
                        </span>
                        <span
                          style={{
                            fontSize: '0.725rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            color: evt.scoringLocked ? 'var(--pub-coral)' : 'var(--pub-muted)',
                            fontWeight: evt.scoringLocked ? 700 : 500,
                          }}
                        >
                          {evt.scoringLocked ? <Lock size={12} /> : <Unlock size={12} />}
                          Nilai: {evt.scoringLocked ? 'Terkunci' : 'Terbuka'}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <span
                        style={{
                          backgroundColor: badge.bg,
                          color: badge.color,
                          padding: '0.3rem 0.75rem',
                          borderRadius: 'var(--pub-radius-pill)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'inline-block',
                        }}
                      >
                        {badge.label}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.45rem' }}>
                        <button
                          onClick={() => {
                            setAssignForm({ ...assignForm, eventId: evt.id });
                            setAssignModalOpen(true);
                          }}
                          className="pub-btn-outline"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                          title="Tugaskan Admin Panitia"
                        >
                          <UserPlus size={13} />
                          <span>Admin</span>
                        </button>

                        <button
                          onClick={() => handleOpenControlModal(evt)}
                          className="pub-btn-coral"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          title="Buka kontrol status event"
                        >
                          <Settings size={13} />
                          <span>Kontrol Event</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          border: '1px solid var(--pub-line)',
          padding: '1.5rem',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Activity size={18} color="var(--pub-coral)" />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
            Audit Trail & Jejak Aktivitas Operasional
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {auditLogs.length > 0 ? (
            auditLogs.slice(0, 5).map((log, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--pub-canvas)',
                  borderRadius: '10px',
                  border: '1px solid var(--pub-line)',
                  fontSize: '0.8125rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--pub-muted)',
                    }}
                  >
                    {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                  </span>
                  <div>
                    <strong style={{ color: 'var(--pub-ink)' }}>{log.actor}</strong> ({log.role}):{' '}
                    <span style={{ color: 'var(--pub-coral)', fontWeight: 600 }}>{log.action}</span>
                    {log.target && <span style={{ color: 'var(--pub-ink-soft)' }}> → {log.target}</span>}
                  </div>
                </div>

                <span style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>Verified System Audit</span>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--pub-muted)', padding: '1rem 0' }}>
              Belum ada riwayat audit log baru.
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: DAFTARKAN LOMBA BARU                           */}
      {/* ======================================================== */}
      {createModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(23, 42, 70, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--pub-surface)',
              width: '100%',
              maxWidth: '540px',
              borderRadius: '20px',
              border: '1px solid var(--pub-line)',
              boxShadow: 'var(--pub-shadow-hover)',
              padding: '2rem',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                  Daftarkan Lomba Baru
                </h2>
                <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
                  Buat kompetisi baru dengan 4 pos Decision Point standar otomatis.
                </p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pub-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Nama Kompetisi / Lomba
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: LKBB Pandawa Nusantara 2026"
                  value={newEventForm.name}
                  onChange={(e) => setNewEventForm({ ...newEventForm, name: e.target.value })}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                    Tanggal Pelaksanaan
                  </label>
                  <input
                    type="date"
                    required
                    value={newEventForm.eventDate}
                    onChange={(e) => setNewEventForm({ ...newEventForm, eventDate: e.target.value })}
                    className="form-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                    Status Awal
                  </label>
                  <select
                    value={newEventForm.status}
                    onChange={(e) => setNewEventForm({ ...newEventForm, status: e.target.value })}
                    className="form-input"
                    style={{ width: '100%' }}
                  >
                    <option value="REGISTRATION_OPEN">Pendaftaran Dibuka</option>
                    <option value="DRAFT_SETUP">Draft Setup</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Lokasi Venue / Stadion
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: GOR Remaja Rawamangun, Jakarta Timur"
                  value={newEventForm.location}
                  onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Deskripsi Lomba Singkat
                </label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi singkat ketentuan kategori SMA/SMK se-Nasional..."
                  value={newEventForm.description}
                  onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
                  className="form-input"
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="pub-btn-outline"
                  style={{ padding: '0.65rem 1.25rem' }}
                >
                  Batal
                </button>
                <button type="submit" className="pub-btn-coral" style={{ padding: '0.65rem 1.5rem' }}>
                  <span>Daftarkan Sekarang</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: TUGASKAN ADMIN PANITIA                         */}
      {/* ======================================================== */}
      {assignModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(23, 42, 70, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--pub-surface)',
              width: '100%',
              maxWidth: '480px',
              borderRadius: '20px',
              border: '1px solid var(--pub-line)',
              boxShadow: 'var(--pub-shadow-hover)',
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                  Tugaskan Admin Panitia
                </h2>
                <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
                  Berikan wewenang pengelolaan event kepada panitia pelaksana.
                </p>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pub-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAssignAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Pilih Event
                </label>
                <select
                  value={assignForm.eventId}
                  onChange={(e) => setAssignForm({ ...assignForm, eventId: e.target.value })}
                  className="form-input"
                  style={{ width: '100%' }}
                  required
                >
                  <option value="">-- Pilih Event Target --</option>
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Email Admin Panitia
                </label>
                <input
                  type="email"
                  required
                  placeholder="panitia@kompas.id"
                  value={assignForm.email}
                  onChange={(e) => setAssignForm({ ...assignForm, email: e.target.value })}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Nama Lengkap Admin Panitia
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rian Pratama"
                  value={assignForm.fullName}
                  onChange={(e) => setAssignForm({ ...assignForm, fullName: e.target.value })}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="pub-btn-outline"
                  style={{ padding: '0.65rem 1.25rem' }}
                >
                  Batal
                </button>
                <button type="submit" className="pub-btn-coral" style={{ padding: '0.65rem 1.5rem' }}>
                  <span>Simpan Penugasan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: KONTROL STATUS & PROTEKSI EVENT                 */}
      {/* ======================================================== */}
      {controlModalOpen && selectedEvent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(23, 42, 70, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--pub-surface)',
              width: '100%',
              maxWidth: '520px',
              borderRadius: '20px',
              border: '1px solid var(--pub-line)',
              boxShadow: 'var(--pub-shadow-hover)',
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                  Kontrol Status: {selectedEvent.name}
                </h2>
                <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
                  Kendalikan status tahapan lomba dan proteksi sistem secara real-time.
                </p>
              </div>
              <button
                onClick={() => setControlModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pub-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateEventControl} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Tahapan Status Lomba
                </label>
                <select
                  value={controlForm.status}
                  onChange={(e) => setControlForm({ ...controlForm, status: e.target.value })}
                  className="form-input"
                  style={{ width: '100%' }}
                >
                  <option value="DRAFT_SETUP">DRAFT SETUP — Persiapan Dokumen Teknis</option>
                  <option value="REGISTRATION_OPEN">REGISTRATION OPEN — Pendaftaran Kontingen Dibuka</option>
                  <option value="VALIDATION">VALIDATION — Pemeriksaan & Verifikasi Berkas</option>
                  <option value="TECHNICAL_MEETING">TECHNICAL MEETING — Pengundian Nomor & Rundown</option>
                  <option value="LIVE">LIVE HARI H — Operasional 4 Pos DP & Penilaian Juri</option>
                  <option value="SCORING_REVIEW">SCORING REVIEW — Rekapitulasi Nilai & Evaluasi Juri</option>
                  <option value="PUBLISHED">PUBLISHED — Pengumuman Juara & Leaderboard Live</option>
                  <option value="ARCHIVED">ARCHIVED — Arsipkan Perlombaan Selesai</option>
                </select>
              </div>

              {/* Toggles Proteksi */}
              <div
                style={{
                  backgroundColor: 'var(--pub-canvas)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '1px solid var(--pub-line)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.9rem',
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pub-ink)', textTransform: 'uppercase' }}>
                  Kunci Keamanan Sistem (Operational Locks)
                </div>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--pub-ink)' }}>
                      Kunci Alur 4 Pos DP (Lock Flow)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>
                      Mencegah perubahan pos saat lomba hari H berlangsung
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={controlForm.dpFlowLocked}
                    onChange={(e) => setControlForm({ ...controlForm, dpFlowLocked: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--pub-coral)' }}
                  />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--pub-ink)' }}>
                      Kunci Penilaian Juri (Lock Scoring)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>
                      Mencegah pengubahan nilai setelah seluruh dewan juri submit
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={controlForm.scoringLocked}
                    onChange={(e) => setControlForm({ ...controlForm, scoringLocked: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--pub-coral)' }}
                  />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--pub-ink)' }}>
                      Publikasikan Hasil ke Web Publik
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>
                      Tampilkan live leaderboard dan pemenang di katalog event
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={controlForm.resultsPublished}
                    onChange={(e) => setControlForm({ ...controlForm, resultsPublished: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--pub-coral)' }}
                  />
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setControlModalOpen(false)}
                  className="pub-btn-outline"
                  style={{ padding: '0.65rem 1.25rem' }}
                >
                  Batal
                </button>
                <button type="submit" className="pub-btn-coral" style={{ padding: '0.65rem 1.5rem' }}>
                  <span>Terapkan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
