import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  ChevronRight,
  GitCommit,
  Radio,
} from 'lucide-react';

export default function AdminPanitiaView() {
  const [dpFlowLocked, setDpFlowLocked] = useState(false);
  const [scoringLocked, setScoringLocked] = useState(false);

  // 4 Pos DP Standar sesuai PRD Addendum 1.2
  const dps = [
    { id: 1, name: 'DP 1 - Pengecekan Dokumen', activeCount: 1, queueCount: 2, status: 'RUNNING' },
    { id: 2, name: 'DP 2 - Photoshoot Resmi', activeCount: 1, queueCount: 1, status: 'RUNNING' },
    { id: 3, name: 'DP 3 - Persiapan & Pemanasan', activeCount: 1, queueCount: 0, status: 'AVAILABLE' },
    { id: 4, name: 'DP 4 - Panggung Penampilan', activeCount: 1, queueCount: 0, status: 'PERFORMING' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Event Header & Phase Hero */}
      <div
        style={{
          backgroundColor: 'var(--deep-slate)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-validated">FASE: REGISTRASI & SETUP</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--muted-slate)' }}>LKBB-2026-NASIONAL</span>
          </div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 700, margin: '0 0 0.4rem 0', color: '#FFFFFF' }}>
            LKBB Nasional Paskibra 2026
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>
            GOR Remaja Jakarta Timur · 15 November 2026 · Kapasitas Pos: 1 Tim per Pos
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary">
            <Radio size={15} />
            <span>Mulai Live Hari H</span>
          </button>
        </div>
      </div>

      {/* Setup Readiness Checklist Panel */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--deep-slate)' }}>Kesiapan Konfigurasi Operasional</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted-slate)' }}>
              Flow DP dan Kriteria Nilai wajib dikunci sebelum hari H dimulai.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Status Kesiapan:</span>
            <span className="badge badge-pending">85% SIAP</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
          {/* Flow DP Locking */}
          <div style={{ padding: '0.85rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: '#F8FAFC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Flow 4 DP Standar</div>
              <span className={`badge ${dpFlowLocked ? 'badge-validated' : 'badge-pending'}`}>
                {dpFlowLocked ? 'DIKUNCI' : 'BELUM DIKUNCI'}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted-slate)', marginBottom: '0.75rem' }}>
              Dokumen → Photoshoot → Persiapan → Tampil
            </p>
            <button
              onClick={() => setDpFlowLocked(!dpFlowLocked)}
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.75rem', padding: '0.35rem' }}
            >
              {dpFlowLocked ? <Unlock size={13} /> : <Lock size={13} />}
              <span>{dpFlowLocked ? 'Buka Kunci Flow' : 'Kunci Flow DP'}</span>
            </button>
          </div>

          {/* Scoring Locking */}
          <div style={{ padding: '0.85rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: '#F8FAFC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Kriteria & Nilai Dinamis</div>
              <span className={`badge ${scoringLocked ? 'badge-validated' : 'badge-pending'}`}>
                {scoringLocked ? 'DIKUNCI' : 'BELUM DIKUNCI'}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted-slate)', marginBottom: '0.75rem' }}>
              4 Aba-aba / Kriteria Terkonfigurasi
            </p>
            <button
              onClick={() => setScoringLocked(!scoringLocked)}
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.75rem', padding: '0.35rem' }}
            >
              {scoringLocked ? <Unlock size={13} /> : <Lock size={13} />}
              <span>{scoringLocked ? 'Buka Kunci Nilai' : 'Kunci Kriteria Penilaian'}</span>
            </button>
          </div>

          {/* Juri & Panitia DP Assignment */}
          <div style={{ padding: '0.85rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: '#F8FAFC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Penugasan Petugas</div>
              <span className="badge badge-validated">LENGKAP</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted-slate)', marginBottom: '0.75rem' }}>
              4 Operator DP & 3 Juri Resmi Ditugaskan
            </p>
            <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.75rem', padding: '0.35rem' }}>
              <Users size={13} />
              <span>Kelola Akun Lapangan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Monitoring Lintas Pos DP (Hari H Preview) */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--deep-slate)' }}>Monitoring Alur Pos DP Hari H</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted-slate)' }}>
              Perpindahan otomatis dengan proteksi kapasitas: Maksimal 1 tim aktif per pos.
            </p>
          </div>
          <span className="badge badge-validated">LIVE MONITORING</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
          {dps.map((dp, idx) => (
            <div
              key={dp.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border)',
                borderTop: `4px solid ${dp.activeCount >= 1 ? 'var(--amber)' : 'var(--emerald)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--deep-slate)' }}>POS 0{dp.id}</span>
                <span className="badge badge-validated" style={{ fontSize: '0.65rem' }}>
                  KAPASITAS: 1 TIM
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--deep-slate)', margin: '0.4rem 0' }}>
                {dp.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border)' }}>
                <span style={{ color: 'var(--muted-slate)' }}>Aktif di Pos:</span>
                <span className="tabular-nums" style={{ fontWeight: 700, color: 'var(--deep-slate)' }}>{dp.activeCount} Tim</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                <span style={{ color: 'var(--muted-slate)' }}>Antrean Menunggu:</span>
                <span className="tabular-nums" style={{ fontWeight: 600, color: dp.queueCount > 0 ? 'var(--amber)' : 'var(--muted-slate)' }}>
                  {dp.queueCount} Tim
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Participant Validation Funnel */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--deep-slate)' }}>Verifikasi Berkas Pasukan Peserta</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted-slate)' }}>Pemeriksaan kelengkapan dokumen tim dan penerbitan nomor urut tampil.</p>
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--muted-slate)' }}>Total: 1 Pendaftar Terverifikasi</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Nomor Tim</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Nama Pasukan & Sekolah</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Kategori</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Kelengkapan Berkas</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Keputusan Panitia</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.875rem 1rem', fontWeight: 700 }} className="tabular-nums">01 / LKBB-2026-001</td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--deep-slate)' }}>PASKIBRA GARUDA SAKTI</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-slate)' }}>SMAN 1 Jakarta · 16 Anggota</div>
                </td>
                <td style={{ padding: '0.875rem 1rem', color: 'var(--slate-text)' }}>SMA/SMK Putra-Putri</td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span style={{ color: 'var(--emerald)', fontWeight: 600, fontSize: '0.8125rem' }}>✓ 4 Dokumen Lengkap</span>
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span className="badge badge-validated">VALIDATED</span>
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                      Beri Jadwal Tampil
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
