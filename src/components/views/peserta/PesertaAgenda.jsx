import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function PesertaAgenda() {
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
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0 0 1rem 0' }}>
        Agenda & Technical Meeting
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--pub-canvas)', border: '1px solid var(--pub-line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--pub-coral)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
            <Calendar size={14} />
            <span>AGENDA BERIKUTNYA</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.925rem', color: 'var(--pub-ink)', margin: '0.25rem 0' }}>
            Technical Meeting Daring (Zoom)
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: 0 }}>
            Sabtu, 08 November 2026 · 13:00 WIB · Link Zoom akan dipancarkan di sini.
          </p>
        </div>

        <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--pub-canvas)', border: '1px solid var(--pub-line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--pub-teal)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
            <Clock size={14} />
            <span>HARI H PELAKSANAAN</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.925rem', color: 'var(--pub-ink)', margin: '0.25rem 0' }}>
            Check-in Pos 1 Pengecekan Dokumen
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: 0 }}>
            Minggu, 15 November 2026 · 07:30 WIB · GOR Remaja Jakarta Timur.
          </p>
        </div>
      </div>
    </div>
  );
}
