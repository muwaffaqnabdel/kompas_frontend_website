import React from 'react';
import { CheckCircle, Clock, FileText, Calendar, Bell, ChevronRight, ShieldCheck } from 'lucide-react';

export default function PesertaView() {
  const steps = [
    { title: 'Pendaftaran Tim', status: 'COMPLETED' },
    { title: 'Validasi Berkas', status: 'COMPLETED' },
    { title: 'Technical Meeting', status: 'CURRENT' },
    { title: 'Jadwal Tampil', status: 'UPCOMING' },
    { title: 'Penampilan Hari H', status: 'UPCOMING' },
    { title: 'Hasil & Evaluasi Juri', status: 'UPCOMING' },
  ];

  const documents = [
    { name: 'Surat Tugas Kepala Sekolah', status: 'VERIFIED', size: '1.2 MB' },
    { name: 'Bukti Pembayaran Registrasi', status: 'VERIFIED', size: '450 KB' },
    { name: 'Foto Resmi Pasukan (16 Orang)', status: 'VERIFIED', size: '3.8 MB' },
    { name: 'Surat Keterangan Sehat Anggota', status: 'VERIFIED', size: '920 KB' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Active Event Hero (Deep Slate) */}
      <div
        style={{
          backgroundColor: 'var(--deep-slate)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-validated">STATUS: VALIDATED</span>
            <span style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>REG-LKBB-2026-001</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: '#FFFFFF' }}>
            LKBB Nasional Paskibra 2026
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#CBD5E1' }}>
            GOR Remaja Jakarta Timur · Tanggal: 15 November 2026 · Kategori: SMA/SMK Putra-Putri
          </p>
        </div>

        <button className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
          Lihat Notulensi TM
        </button>
      </div>

      {/* Metrics Cards 4 Kolom */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-slate)', textTransform: 'uppercase' }}>Status Berkas</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--emerald)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={20} />
            <span>TERVERIFIKASI</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-slate)', marginTop: '0.2rem' }}>Semua dokumen disetujui</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-slate)', textTransform: 'uppercase' }}>Nomor Urut Tampil</div>
          <div className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--deep-slate)', marginTop: '0.1rem' }}>
            #01
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-slate)' }}>Slot Pagi (08:30 WIB)</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-slate)', textTransform: 'uppercase' }}>Asal Sekolah</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--deep-slate)', marginTop: '0.35rem' }}>
            SMAN 1 Jakarta
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-slate)', marginTop: '0.2rem' }}>PASKIBRA GARUDA SAKTI</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-slate)', textTransform: 'uppercase' }}>Jumlah Anggota Tim</div>
          <div className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--deep-slate)', marginTop: '0.1rem' }}>
            16 Pasukan
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-slate)' }}>1 Danton + 15 Pasukan</div>
        </div>
      </div>

      {/* Timeline Progres Pendaftaran */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--deep-slate)', marginBottom: '1.25rem' }}>
          Tahapan Perjalanan Lomba Pasukan
        </h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflowX: 'auto', padding: '0.5rem 0' }}>
          {steps.map((st, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minWidth: '130px', position: 'relative' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: st.status === 'COMPLETED' ? 'var(--emerald)' : st.status === 'CURRENT' ? 'var(--crimson)' : '#E2E8F0',
                  color: st.status === 'UPCOMING' ? 'var(--muted-slate)' : '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  marginBottom: '0.5rem',
                }}
              >
                {st.status === 'COMPLETED' ? '✓' : idx + 1}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: st.status === 'CURRENT' ? 700 : 500, color: st.status === 'CURRENT' ? 'var(--crimson)' : 'var(--deep-slate)' }}>
                {st.title}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--muted-slate)', marginTop: '0.15rem' }}>
                {st.status === 'COMPLETED' ? 'Selesai' : st.status === 'CURRENT' ? 'Tahap Aktif' : 'Menunggu'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Dokumen Tim & Agenda */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Dokumen Tim Card */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--deep-slate)', marginBottom: '0.75rem' }}>
            Dokumen Persyaratan Tim
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {documents.map((doc, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--deep-slate)' }}>{doc.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted-slate)' }}>Ukuran file: {doc.size}</div>
                </div>
                <span className="badge badge-validated" style={{ fontSize: '0.65rem' }}>TERVERIFIKASI</span>
              </div>
            ))}
          </div>
        </div>

        {/* Agenda Terdekat Card */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--deep-slate)', marginBottom: '0.75rem' }}>
            Agenda & Technical Meeting
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: '#F8FAFC', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--crimson)', fontWeight: 600, fontSize: '0.75rem' }}>
                <Calendar size={14} />
                <span>AGENDA BERIKUTNYA</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--deep-slate)', margin: '0.2rem 0' }}>
                Technical Meeting Daring (Zoom)
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted-slate)' }}>
                Sabtu, 08 November 2026 · 13:00 WIB · Link Zoom akan dipancarkan di sini.
              </p>
            </div>

            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: '#F8FAFC', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--emerald)', fontWeight: 600, fontSize: '0.75rem' }}>
                <Clock size={14} />
                <span>HARI H PELAKSANAAN</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--deep-slate)', margin: '0.2rem 0' }}>
                Check-in Pos 1 Pengecekan Dokumen
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted-slate)' }}>
                Minggu, 15 November 2026 · 07:30 WIB · GOR Remaja Jakarta Timur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
