import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

const STORAGE_KEY_ASSIGNED_SCHEDULE = 'kompas_assigned_schedule';

export default function PesertaMetrics({
  statusDocs: propStatusDocs,
  orderNumber: propOrderNumber,
  orderSlot: propOrderSlot,
  school = 'SMAN 1 Jakarta',
  teamName = 'PASKIBRA GARUDA SAKTI',
}) {
  // Baca nomor urut & jam tampil dinamis dari konfigurasi Admin Panitia di localStorage
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ASSIGNED_SCHEDULE);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          orderNumber: parsed.orderNumber || propOrderNumber || '#01',
          orderSlot: parsed.orderSlot || propOrderSlot || 'Slot Pagi (08:30 WIB)',
          statusDocs: parsed.statusDocs || propStatusDocs || 'TERVERIFIKASI',
        };
      }
    } catch (e) {
      console.error(e);
    }
    return {
      orderNumber: propOrderNumber || '#01',
      orderSlot: propOrderSlot || 'Slot Pagi (08:30 WIB)',
      statusDocs: propStatusDocs || 'TERVERIFIKASI',
    };
  });

  // Sinkronisasi otomatis saat ada perubahan di tab Admin Panitia
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_ASSIGNED_SCHEDULE);
        if (saved) {
          const parsed = JSON.parse(saved);
          setData({
            orderNumber: parsed.orderNumber || '#01',
            orderSlot: parsed.orderSlot || 'Slot Pagi (08:30 WIB)',
            statusDocs: parsed.statusDocs || 'TERVERIFIKASI',
          });
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  const isVerified = data.statusDocs === 'TERVERIFIKASI';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
      {/* 1. Status Berkas */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          padding: '1.35rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          borderLeft: isVerified ? '5px solid var(--pub-teal)' : '5px solid var(--pub-amber)',
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
          Status Berkas
        </div>
        <div
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: isVerified ? 'var(--pub-teal)' : 'var(--pub-amber)',
            marginTop: '0.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          {isVerified ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
          <span>{data.statusDocs}</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.25rem' }}>
          {isVerified ? 'Semua dokumen disetujui panitia' : 'Menunggu perbaikan dokumen'}
        </div>
      </div>

      {/* 2. Nomor Urut Tampil (Dinamis dari Input Admin Panitia) */}
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
          {data.orderNumber || 'Belum Ditetapkan'}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>
          {data.orderSlot || 'Menunggu penetapan jadwal dari panitia'}
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
    </div>
  );
}
