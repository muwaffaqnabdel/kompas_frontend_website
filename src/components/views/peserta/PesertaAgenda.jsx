import React from 'react';

function formatDateLong(val) {
  if (!val) return null;
  try {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return null;
  }
}

export default function PesertaAgenda({ activeRegistration = null, onOpenSchedule }) {
  const tm = activeRegistration?.eventTechnicalMeeting;
  const tmDateStr = formatDateLong(tm?.meetingDate);
  const eventDateStr = formatDateLong(activeRegistration?.eventDate);
  const eventLocation = activeRegistration?.eventLocation || 'Lokasi menyusul dari Panitia';

  return (
    <div
      style={{
        backgroundColor: 'var(--pub-surface)',
        borderRadius: 'var(--pub-radius-card)',
        padding: '1.5rem',
        border: '1px solid var(--pub-line)',
        boxShadow: 'var(--pub-shadow-card)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
          Agenda & Technical Meeting
        </h3>
        {onOpenSchedule && (
          <button
            type="button"
            onClick={onOpenSchedule}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--pub-coral)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Buka Jadwal →
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--pub-canvas)', border: '1px solid var(--pub-line)' }}>
          <div style={{ color: 'var(--pub-coral)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            TECHNICAL MEETING
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--pub-ink)', margin: '0.25rem 0' }}>
            {tm?.isPublished ? 'Technical Meeting Daring / Luring' : 'Jadwal Technical Meeting'}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--pub-muted)', margin: 0, lineHeight: 1.45 }}>
            {tmDateStr
              ? `${tmDateStr}${tm?.zoomUrl ? ' · Tautan rapat tersedia di menu Jadwal & Agenda TM.' : ''}`
              : 'Menunggu publikasi jadwal Technical Meeting dari Admin Panitia event ini.'}
          </p>
        </div>

        <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--pub-canvas)', border: '1px solid var(--pub-line)' }}>
          <div style={{ color: 'var(--pub-teal)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            HARI H PELAKSANAAN
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--pub-ink)', margin: '0.25rem 0' }}>
            {activeRegistration?.eventName || 'Check-in Pos 1 Pengecekan Dokumen'}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--pub-muted)', margin: 0, lineHeight: 1.45 }}>
            {eventDateStr ? `${eventDateStr} · ${eventLocation}` : 'Pilih atau daftar event terlebih dahulu untuk melihat jadwal pelaksanaan.'}
          </p>
        </div>
      </div>
    </div>
  );
}
