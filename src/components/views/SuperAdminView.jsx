import React from 'react';
import { Calendar, Users, AlertTriangle, CheckCircle, Plus, Eye, ShieldAlert } from 'lucide-react';

export default function SuperAdminView() {
  const kpis = [
    { label: 'Total Event Lomba', val: '3', note: '2 Aktif · 1 Selesai', color: 'var(--midnight-navy)' },
    { label: 'Event Berjalan (Hari H)', val: '1', note: 'LKBB Nasional 2026', color: 'var(--emerald)' },
    { label: 'Event Setup / Draft', val: '1', note: 'Piala Walikota 2026', color: 'var(--amber)' },
    { label: 'Perlu Perhatian', val: '1', note: '1 Event belum kunci flow', color: 'var(--crimson)' },
    { label: 'Admin Panitia Aktif', val: '4', note: 'Tersebar di 2 event', color: 'var(--slate-text)' },
  ];

  const events = [
    {
      id: 'EVT-001',
      name: 'LKBB Nasional Paskibra 2026',
      date: '15 Nov 2026',
      admin: 'Rian Pratama',
      participants: '32 / 32 Validated',
      readiness: 95,
      status: 'REGISTRATION_OPEN',
      alert: 'Semua flow DP & kriteria siap',
      alertType: 'good',
    },
    {
      id: 'EVT-002',
      name: 'Piala Walikota Paskibra 2026',
      date: '28 Des 2026',
      admin: 'Belum Ditugaskan',
      participants: '0 Peserta',
      readiness: 40,
      status: 'DRAFT_SETUP',
      alert: 'Belum ada Admin Panitia!',
      alertType: 'warning',
    },
    {
      id: 'EVT-003',
      name: 'Festival Baris Berbaris 2025',
      date: '10 Des 2025',
      admin: 'Dimas Wicaksono',
      participants: '24 Peserta',
      readiness: 100,
      status: 'ARCHIVED',
      alert: 'Tersimpan di arsip',
      alertType: 'neutral',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Intro Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--crimson)' }}>
            COMMAND CENTER LINTAS EVENT
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--deep-slate)', margin: '0.2rem 0' }}>
            Overview Operasional Global
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-slate)' }}>
            Pemantauan kesehatan, penugasan Admin Panitia, dan status seluruh penyelenggaraan lomba Paskibra.
          </p>
        </div>

        <button className="btn btn-primary">
          <Plus size={16} />
          <span>Daftarkan Lomba Baru</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {kpis.map((kpi, idx) => (
          <div key={idx} className="card" style={{ borderLeft: `4px solid ${kpi.color}` }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-slate)', textTransform: 'uppercase' }}>
              {kpi.label}
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--deep-slate)', margin: '0.25rem 0' }}>
              {kpi.val}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-text)' }}>{kpi.note}</div>
          </div>
        ))}
      </div>

      {/* Escalation Alerts Banner */}
      <div
        style={{
          backgroundColor: 'var(--crimson-light)',
          border: '1px solid rgba(153, 27, 27, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldAlert color="var(--crimson)" size={22} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--crimson)' }}>
              1 Event Memerlukan Tindakan Segera
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--slate-text)' }}>
              Event <strong>Piala Walikota Paskibra 2026</strong> belum memiliki Admin Panitia yang ditugaskan.
            </div>
          </div>
        </div>

        <button className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
          Tugaskan Admin Panitia
        </button>
      </div>

      {/* Event Health Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--deep-slate)' }}>Matriks Kesehatan Seluruh Event</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted-slate)' }}>Status konfigurasi, kesiapan, dan penugasan per event</p>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted-slate)' }}>Menampilkan 3 Event</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 600, color: 'var(--slate-text)' }}>Nama Event & ID</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--slate-text)' }}>Tanggal</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--slate-text)' }}>Admin Panitia</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--slate-text)' }}>Peserta</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--slate-text)' }}>Kesiapan</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--slate-text)' }}>Status</th>
                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 600, color: 'var(--slate-text)' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr key={evt.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.15s' }}>
                  <td style={{ padding: '0.875rem 1.25rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--deep-slate)' }}>{evt.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-slate)' }}>{evt.id}</div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--slate-text)' }}>{evt.date}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ fontWeight: evt.admin.includes('Belum') ? 400 : 600, color: evt.admin.includes('Belum') ? 'var(--crimson)' : 'var(--deep-slate)' }}>
                      {evt.admin}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--slate-text)' }}>{evt.participants}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '80px', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${evt.readiness}%`, height: '100%', backgroundColor: evt.readiness > 80 ? 'var(--emerald)' : 'var(--amber)' }} />
                      </div>
                      <span className="tabular-nums" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{evt.readiness}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span className={`badge ${evt.status === 'REGISTRATION_OPEN' ? 'badge-validated' : evt.status === 'DRAFT_SETUP' ? 'badge-pending' : 'badge-neutral'}`}>
                      {evt.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1.25rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                      <Eye size={13} />
                      <span>Monitor</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
