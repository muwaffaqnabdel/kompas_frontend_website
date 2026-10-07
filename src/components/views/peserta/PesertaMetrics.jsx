import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PesertaMetrics({
  statusDocs = 'TERVERIFIKASI',
  orderNumber = '#01',
  orderSlot = 'Slot Pagi (08:30 WIB)',
  school = 'SMAN 1 Jakarta',
  teamName = 'PASKIBRA GARUDA SAKTI',
  members = '16 Pasukan',
  composition = '1 Danton + 15 Pasukan',
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
      {/* 1. Status Berkas */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          padding: '1.35rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          borderLeft: '5px solid var(--pub-teal)',
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
          Status Berkas
        </div>
        <div
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--pub-teal)',
            marginTop: '0.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <ShieldCheck size={20} />
          <span>{statusDocs}</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.25rem' }}>
          Semua dokumen disetujui
        </div>
      </div>

      {/* 2. Nomor Urut Tampil */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          padding: '1.35rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          borderLeft: '5px solid var(--pub-coral)',
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
          Nomor Urut Tampil
        </div>
        <div
          className="tabular-nums"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.85rem',
            fontWeight: 800,
            color: 'var(--pub-ink)',
            marginTop: '0.2rem',
          }}
        >
          {orderNumber}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>
          {orderSlot}
        </div>
      </div>

      {/* 3. Asal Sekolah */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          padding: '1.35rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          borderLeft: '5px solid var(--pub-amber)',
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
          Asal Sekolah
        </div>
        <div
          style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            color: 'var(--pub-ink)',
            marginTop: '0.4rem',
          }}
        >
          {school}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.2rem' }}>
          {teamName}
        </div>
      </div>

      {/* 4. Jumlah Anggota */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          padding: '1.35rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          borderLeft: '5px solid var(--pub-navy)',
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
          Jumlah Anggota Tim
        </div>
        <div
          className="tabular-nums"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.85rem',
            fontWeight: 800,
            color: 'var(--pub-ink)',
            marginTop: '0.2rem',
          }}
        >
          {members}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>
          {composition}
        </div>
      </div>
    </div>
  );
}
