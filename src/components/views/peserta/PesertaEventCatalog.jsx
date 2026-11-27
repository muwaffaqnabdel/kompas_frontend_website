import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  Search,
  CheckCircle2,
  PlusCircle,
  Users,
  Sparkles,
  Loader2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { getStoredBanner, getStoredPublicEvents } from '../../../data/publicEvents';

function resolveEventBanner(ev, publicEventsCache = []) {
  if (!ev) return null;
  if (ev.bannerUrl) return ev.bannerUrl;
  const bySlug = ev.slug ? getStoredBanner(ev.slug) : null;
  if (bySlug) return bySlug;
  const byId = ev.id ? getStoredBanner(ev.id) : null;
  if (byId) return byId;

  const matchedPub = publicEventsCache.find(
    (p) =>
      (ev.slug && p.slug === ev.slug) ||
      (ev.id && p.id === ev.id) ||
      (ev.name && (p.title || p.name)?.toLowerCase() === ev.name.toLowerCase())
  );
  return matchedPub?.bannerUrl || null;
}

const STATUS_BADGE = {
  REGISTRATION_OPEN: { label: 'Pendaftaran Dibuka', bg: '#ECFDF5', color: '#047857', border: '#A7F3D0', canRegister: true },
  DRAFT_SETUP: { label: 'Persiapan / Dibuka', bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE', canRegister: true },
  VALIDATION: { label: 'Tahap Validasi', bg: '#FFFBEB', color: '#B45309', border: '#FDE68A', canRegister: true },
  TECHNICAL_MEETING: { label: 'Technical Meeting', bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE', canRegister: true },
  SCHEDULING: { label: 'Penjadwalan', bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE', canRegister: true },
  LIVE: { label: 'Sedang Berlangsung', bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', canRegister: false },
  SCORING_REVIEW: { label: 'Rekap Penilaian', bg: '#FFFBEB', color: '#B45309', border: '#FDE68A', canRegister: false },
  PUBLISHED: { label: 'Hasil Dipublikasi', bg: '#F1F5F9', color: '#475569', border: '#CBD5E1', canRegister: false },
  ARCHIVED: { label: 'Selesai / Arsip', bg: '#F1F5F9', color: '#64748B', border: '#E2E8F0', canRegister: false },
};

function formatEventDate(dateVal) {
  if (!dateVal) return 'Jadwal menyusul';
  try {
    return new Date(dateVal).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return String(dateVal);
  }
}

export default function PesertaEventCatalog({
  registrations = [],
  profileMembersCount = 0,
  onSelectRegisterEvent,
  onOpenRegistration,
  onGoToProfile,
}) {
  const [events, setEvents] = useState([]);
  const [publicEventsCache, setPublicEventsCache] = useState(() => getStoredPublicEvents());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const syncPublicCache = () => setPublicEventsCache(getStoredPublicEvents());
    window.addEventListener('kompas_event_updated', syncPublicCache);
    return () => window.removeEventListener('kompas_event_updated', syncPublicCache);
  }, []);

  useEffect(() => {
    let active = true;
    const loadEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/events', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Gagal memuat daftar event.');
        }
        if (active) {
          setEvents(Array.isArray(data.events) ? data.events : []);
        }
      } catch (err) {
        if (active) setError(err.message || 'Terjadi kesalahan saat mengambil daftar lomba.');
      } finally {
        if (active) setLoading(false);
      }
    };
    loadEvents();
    return () => {
      active = false;
    };
  }, []);

  const regsByEventId = useMemo(() => {
    const map = new Map();
    for (const r of registrations) {
      if (!map.has(r.eventId)) map.set(r.eventId, []);
      map.get(r.eventId).push(r);
    }
    return map;
  }, [registrations]);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (statusFilter === 'OPEN') {
        const meta = STATUS_BADGE[ev.status];
        if (!meta?.canRegister) return false;
      } else if (statusFilter === 'REGISTERED') {
        if (!regsByEventId.has(ev.id)) return false;
      } else if (statusFilter === 'LIVE') {
        if (ev.status !== 'LIVE') return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = String(ev.name || '').toLowerCase().includes(q);
        const matchLoc = String(ev.location || '').toLowerCase().includes(q);
        const matchDesc = String(ev.description || '').toLowerCase().includes(q);
        if (!matchName && !matchLoc && !matchDesc) return false;
      }
      return true;
    });
  }, [events, statusFilter, searchQuery, regsByEventId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', maxWidth: '1080px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.5rem 1.75rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--pub-coral)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Katalog Lomba KOMPAS
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.55rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0.2rem 0 0.3rem 0' }}>
            Daftar Seluruh Event LKBB
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--pub-muted)', margin: 0 }}>
            Cari dan daftar lomba langsung dari portal peserta. Pas foto & data pasukan otomatis diambil dari Profil Kontingen Anda.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToProfile}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1rem',
            borderRadius: '10px',
            border: '1px solid var(--pub-line)',
            backgroundColor: 'var(--pub-canvas)',
            color: 'var(--pub-ink)',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Users size={16} color="var(--pub-teal)" />
          <span>Profil Kontingen ({profileMembersCount} Anggota)</span>
        </button>
      </div>

      {/* Tips Banner jika Bank Anggota Profil masih kosong */}
      {profileMembersCount === 0 && (
        <div
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '12px',
            padding: '0.9rem 1.15rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#92400E', fontSize: '0.83rem' }}>
            <Sparkles size={18} color="#D97706" style={{ flexShrink: 0 }} />
            <span>
              <strong>Tips Praktis:</strong> Isi dulu <strong>Profil Kontingen & Pas Foto Anggota</strong> sekali saja agar saat daftar event tinggal centang pasukan tanpa upload ulang!
            </span>
          </div>
          <button
            type="button"
            onClick={onGoToProfile}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#D97706',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>Lengkapi Profil Dulu</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
          <Search size={16} color="var(--pub-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Cari nama lomba atau lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.9rem 0.65rem 2.35rem',
              borderRadius: '10px',
              border: '1px solid var(--pub-line)',
              backgroundColor: 'var(--pub-surface)',
              fontSize: '0.85rem',
              color: 'var(--pub-ink)',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: `Semua (${events.length})` },
            { id: 'OPEN', label: 'Bisa Didaftar' },
            { id: 'REGISTERED', label: `Sudah Diikuti (${regsByEventId.size})` },
            { id: 'LIVE', label: 'Sedang Live' },
          ].map((f) => {
            const active = statusFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '9999px',
                  border: active ? '1px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                  backgroundColor: active ? 'var(--pub-coral)' : 'var(--pub-surface)',
                  color: active ? '#FFFFFF' : 'var(--pub-ink)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--pub-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '0.85rem' }}>Memuat daftar seluruh event KOMPAS...</span>
        </div>
      ) : error ? (
        <div style={{ padding: '1rem 1.25rem', borderRadius: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div style={{ padding: '3rem 1.5rem', textAlign: 'center', backgroundColor: 'var(--pub-surface)', borderRadius: '16px', border: '1px solid var(--pub-line)', color: 'var(--pub-muted)' }}>
          Tidak ada event yang cocok dengan pencarian Anda.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredEvents.map((ev, index) => {
            const meta = STATUS_BADGE[ev.status] || {
              label: ev.status || 'Terjadwal',
              bg: '#F1F5F9',
              color: '#475569',
              border: '#CBD5E1',
              canRegister: true,
            };
            const myRegs = regsByEventId.get(ev.id) || [];
            const bannerUrl = resolveEventBanner(ev, publicEventsCache);
            const boardNumber = String(index + 1).padStart(2, '0');

            return (
              <div
                key={ev.id}
                style={{
                  backgroundColor: 'var(--pub-surface)',
                  borderRadius: '20px',
                  border: myRegs.length > 0 ? '1.5px solid var(--pub-teal)' : '1px solid var(--pub-line)',
                  boxShadow: 'var(--pub-shadow-card)',
                  padding: '1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.95rem',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {/* Top Row: Event Board Label + Registered Pill */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span
                      className="pub-mono"
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: 'var(--pub-coral)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      EVENT BOARD / {boardNumber}
                    </span>
                    {myRegs.length > 0 && (
                      <span
                        style={{
                          backgroundColor: '#ECFDF5',
                          color: '#047857',
                          border: '1px solid #A7F3D0',
                          padding: '0.18rem 0.55rem',
                          borderRadius: '9999px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <CheckCircle2 size={12} />
                        {myRegs.length} Tim Terdaftar
                      </span>
                    )}
                  </div>

                  {/* Event Banner Container (selaras dengan Website Utama) */}
                  <div
                    style={{
                      borderRadius: '14px',
                      height: '165px',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: 'var(--pub-navy)',
                      padding: '1rem 1.15rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    {bannerUrl && (
                      <img
                        src={bannerUrl}
                        alt={ev.name}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(23, 32, 51, 0.25) 0%, rgba(23, 32, 51, 0.82) 100%)',
                        pointerEvents: 'none',
                      }}
                    />

                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.4rem' }}>
                      <span
                        style={{
                          backgroundColor: meta.bg,
                          color: meta.color,
                          border: `1px solid ${meta.border}`,
                          padding: '0.18rem 0.58rem',
                          borderRadius: '9999px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                        }}
                      >
                        {meta.label}
                      </span>
                    </div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.18rem',
                          fontWeight: 800,
                          color: '#FFFFFF',
                          margin: 0,
                          lineHeight: 1.25,
                          textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                        }}
                      >
                        {ev.name}
                      </h3>
                    </div>
                  </div>

                  {ev.description && (
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--pub-muted)',
                        margin: 0,
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {ev.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Calendar size={14} color="var(--pub-coral)" />
                      <span>{formatEventDate(ev.eventDate)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <MapPin size={14} color="var(--pub-teal)" />
                      <span>{ev.location || 'Lokasi menyusul'}</span>
                    </div>
                  </div>

                  {myRegs.length > 0 && (
                    <div style={{ marginTop: '0.2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {myRegs.map((reg) => (
                        <button
                          key={reg.id}
                          type="button"
                          onClick={() => onOpenRegistration && onOpenRegistration(reg.id)}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.45rem 0.65rem',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1',
                            backgroundColor: '#F8FAFC',
                            color: '#0F172A',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <span>
                            {reg.teamName} ({reg.membersCount} org)
                          </span>
                          <span style={{ color: 'var(--pub-teal)', fontSize: '0.72rem' }}>Kelola Berkas →</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ paddingTop: '0.65rem', borderTop: '1px solid var(--pub-line)' }}>
                  {meta.canRegister ? (
                    <button
                      type="button"
                      onClick={() => onSelectRegisterEvent && onSelectRegisterEvent({ ...ev, bannerUrl })}
                      className="pub-btn-coral"
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem',
                        fontSize: '0.83rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        cursor: 'pointer',
                      }}
                    >
                      <PlusCircle size={15} />
                      <span>{myRegs.length > 0 ? 'Daftar Tim Tambahan (Tim B / Lainnya)' : 'Daftar Event Ini'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      style={{
                        width: '100%',
                        padding: '0.6rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid var(--pub-line)',
                        backgroundColor: '#F1F5F9',
                        color: '#94A3B8',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'not-allowed',
                      }}
                    >
                      Pendaftaran Ditutup
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

