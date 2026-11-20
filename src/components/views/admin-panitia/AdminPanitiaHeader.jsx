import React from 'react';
import { Radio, Calendar, MapPin, Trophy, ShieldCheck, ChevronDown } from 'lucide-react';

export default function AdminPanitiaHeader({
  currentEvent,
  events = [],
  selectedEventId,
  onSelectEvent,
  activeSection = 'settings',
  onSelectSection,
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'REGISTRATION_OPEN':
        return { bg: 'var(--pub-teal-light)', color: 'var(--pub-teal)', label: 'Pendaftaran Dibuka' };
      case 'DRAFT_SETUP':
        return { bg: '#FEF3C7', color: 'var(--pub-amber)', label: 'Draft Setup' };
      case 'VALIDATION':
        return { bg: '#E0F2FE', color: '#0369A1', label: 'Verifikasi Berkas' };
      case 'TECHNICAL_MEETING':
        return { bg: '#F3E8FF', color: '#7E22CE', label: 'Technical Meeting' };
      case 'LIVE':
        return { bg: 'var(--pub-coral-pale)', color: 'var(--pub-coral)', label: 'Hari H (Live)' };
      case 'SCORING_REVIEW':
        return { bg: '#FFEDD5', color: '#C2410C', label: 'Review Penilaian' };
      case 'PUBLISHED':
        return { bg: '#E0E7FF', color: '#4338CA', label: 'Hasil Dipublikasi' };
      case 'ARCHIVED':
      default:
        return { bg: 'var(--pub-sand)', color: 'var(--pub-muted)', label: 'Arsip' };
    }
  };

  const badge = getStatusBadge(currentEvent?.status);
  const eventName = currentEvent?.name || currentEvent?.title || 'Memuat Lomba...';
  const eventSlug = currentEvent?.slug || 'kompas-event';
  const eventLocation = currentEvent?.location || 'Lokasi Belum Diatur';
  const eventDateStr = currentEvent?.eventDate
    ? new Date(currentEvent.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : currentEvent?.date || 'Tanggal Belum Diatur';

  return (
    <div
      style={{
        backgroundColor: 'var(--pub-surface)',
        borderRadius: 'var(--pub-radius-card)',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem',
        border: '1px solid var(--pub-line)',
        boxShadow: 'var(--pub-shadow-card)',
      }}
    >
      {/* Kiri: Identitas Event & Event Selector */}
      <div style={{ flex: 1, minWidth: '320px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
          <span
            style={{
              backgroundColor: badge.bg,
              color: badge.color,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--pub-radius-pill)',
              fontSize: '0.72rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: badge.color }} />
            {badge.label}
          </span>

          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--pub-muted)',
              fontFamily: 'var(--font-mono)',
              backgroundColor: 'var(--pub-canvas)',
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              border: '1px solid var(--pub-line)',
            }}
          >
            #{eventSlug}
          </span>

          {/* Event Selector jika memiliki hak akses lebih dari 1 event atau demo */}
          {events && events.length > 1 && onSelectEvent && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--pub-muted)', fontWeight: 600 }}>Ganti Lomba:</span>
              <select
                value={selectedEventId || currentEvent?.id || ''}
                onChange={(e) => onSelectEvent(e.target.value)}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--pub-ink)',
                  backgroundColor: 'var(--pub-canvas)',
                  border: '1px solid var(--pub-coral)',
                  borderRadius: '6px',
                  padding: '0.2rem 0.5rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '0 0 0.35rem 0',
            color: 'var(--pub-ink)',
          }}
        >
          {eventName}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.825rem', color: 'var(--pub-muted)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={13} color="var(--pub-coral)" />
            <span>{eventLocation}</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={13} color="var(--pub-teal)" />
            <span>{eventDateStr}</span>
          </span>
          {currentEvent?.adminPanitia && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--pub-teal)', fontWeight: 600 }}>
              <ShieldCheck size={13} />
              <span>PIC: {currentEvent.adminPanitia.fullName}</span>
            </span>
          )}
        </div>
      </div>

      {/* Kanan: Navigasi Sub-Tab & Aksi Hari H */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {onSelectSection && (
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--pub-canvas)',
              padding: '0.25rem',
              borderRadius: 'var(--pub-radius-pill)',
              border: '1px solid var(--pub-line)',
            }}
          >
            <button
              onClick={() => onSelectSection('settings')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--pub-radius-pill)',
                border: 'none',
                backgroundColor: activeSection === 'settings' ? 'var(--pub-coral)' : 'transparent',
                color: activeSection === 'settings' ? '#FFFFFF' : 'var(--pub-ink)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Pengaturan Lomba & Detail
            </button>
            <button
              onClick={() => onSelectSection('operations')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--pub-radius-pill)',
                border: 'none',
                backgroundColor: activeSection === 'operations' ? 'var(--pub-coral)' : 'transparent',
                color: activeSection === 'operations' ? '#FFFFFF' : 'var(--pub-ink)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Kesiapan Hari H & Pos DP
            </button>
          </div>
        )}

        <button
          className="pub-btn-coral"
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.825rem' }}
          onClick={() => {
            if (onSelectSection) onSelectSection('operations');
          }}
          title="Pantau operasional live 4 Pos DP"
        >
          <Radio size={14} />
          <span>Status Pos Hari H</span>
        </button>
      </div>
    </div>
  );
}
