import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Save,
  Plus,
  Trash2,
  UserPlus,
  Check,
  Shield,
} from 'lucide-react';

const STORAGE_KEY_DPS = 'kompas_dp_flow_items';
const STORAGE_KEY_STAFF = 'kompas_dp_staff_accounts';

const DEFAULT_DPS = [
  {
    id: 1,
    name: 'DP 1 — Pengecekan Dokumen & Berkas',
    sop: 'Verifikasi berkas fisik kontingen, surat mandat, kartu tanda pelajar sah, dan pemeriksaan daftar nama anggota peleton.',
  },
  {
    id: 2,
    name: 'DP 2 — Photoshoot Pasukan Resmi',
    sop: 'Sesi dokumentasi foto resmi peleton lengkap di backdrop resmi dan pemeriksaan kesesuaian nomor dada/atribut.',
  },
  {
    id: 3,
    name: 'DP 3 — Daerah Persiapan & Pemanasan',
    sop: 'Peregangan, pemanasan langkah perlahan, sinkronisasi aba-aba komandan peleton, dan persiapan memasuki panggung.',
  },
  {
    id: 4,
    name: 'DP 4 — Panggung Arena Utama',
    sop: 'Peleton tampil di arena pertandingan dinilai langsung oleh Dewan Juri secara real-time.',
  },
];

const DEFAULT_STAFF = [
  {
    id: 'staff-1',
    name: 'Budi Santoso',
    email: 'panitia.dp1@kompas.id',
    assignedDpId: 1,
    status: 'AKTIF',
  },
  {
    id: 'staff-2',
    name: 'Rian Firmansyah',
    email: 'panitia.dp2@kompas.id',
    assignedDpId: 2,
    status: 'AKTIF',
  },
  {
    id: 'staff-3',
    name: 'Dewi Anggraini',
    email: 'panitia.dp3@kompas.id',
    assignedDpId: 3,
    status: 'AKTIF',
  },
  {
    id: 'staff-4',
    name: 'Ahmad Fauzi',
    email: 'panitia.dp4@kompas.id',
    assignedDpId: 4,
    status: 'AKTIF',
  },
];

export default function AdminPanitiaDPConfig({
  dpFlowLocked = false,
  setDpFlowLocked,
}) {
  // 1. Pos DP State (Loaded from localStorage or fallback)
  const [dps, setDps] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DPS);
      return saved ? JSON.parse(saved) : DEFAULT_DPS;
    } catch {
      return DEFAULT_DPS;
    }
  });

  // 2. Staff Panitia DP State
  const [staffList, setStaffList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STAFF);
      return saved ? JSON.parse(saved) : DEFAULT_STAFF;
    } catch {
      return DEFAULT_STAFF;
    }
  });

  // 3. Form Add Staff State
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    assignedDpId: 1,
  });

  // 4. Feedback Alert State
  const [saveFeedback, setSaveFeedback] = useState(null);

  // Save to localStorage when modified
  const handleSaveFlow = () => {
    try {
      localStorage.setItem(STORAGE_KEY_DPS, JSON.stringify(dps));
      localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(staffList));
      setSaveFeedback('Konfigurasi Alur Pos DP & Petugas berhasil disimpan.');
      setTimeout(() => setSaveFeedback(null), 3500);
    } catch (err) {
      console.error('Error saving DP config', err);
    }
  };

  const handleDpChange = (id, field, value) => {
    if (dpFlowLocked) return;
    setDps((prev) =>
      prev.map((dp) => (dp.id === id ? { ...dp, [field]: value } : dp))
    );
  };

  const handleAddDp = () => {
    if (dpFlowLocked) return;
    const nextId = dps.length > 0 ? Math.max(...dps.map((d) => d.id)) + 1 : 1;
    const newDpItem = {
      id: nextId,
      name: `DP ${nextId} — Pos Operasional Tambahan`,
      sop: 'Deskripsi SOP pos dan instruksi pemeriksaan peleton sebelum transisi.',
    };
    const updated = [...dps, newDpItem];
    setDps(updated);
  };

  const handleDeleteDp = (id) => {
    if (dpFlowLocked) return;
    if (dps.length <= 2) {
      alert('Alur kompetisi minimal membutuhkan 2 Pos DP.');
      return;
    }
    const updated = dps.filter((d) => d.id !== id);
    setDps(updated);
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.email.trim()) return;

    const newStaffItem = {
      id: `staff-${Date.now()}`,
      name: newStaff.name.trim(),
      email: newStaff.email.trim(),
      assignedDpId: Number(newStaff.assignedDpId),
      status: 'AKTIF',
    };

    const updated = [...staffList, newStaffItem];
    setStaffList(updated);
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(updated));

    setNewStaff({
      name: '',
      email: '',
      password: '',
      assignedDpId: dps[0]?.id || 1,
    });
    setShowAddStaffModal(false);

    setSaveFeedback(`Akun petugas ${newStaffItem.name} berhasil dibuat.`);
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  const handleDeleteStaff = (staffId) => {
    if (dpFlowLocked) return;
    const updated = staffList.filter((s) => s.id !== staffId);
    setStaffList(updated);
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(updated));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'var(--font-sans)' }}>
      {/* 1. Header Banner & Status Bar */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                backgroundColor: dpFlowLocked ? 'var(--emerald-light)' : 'var(--amber-light)',
                color: dpFlowLocked ? 'var(--emerald-text)' : 'var(--amber-text)',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                fontSize: '0.725rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              {dpFlowLocked ? <Lock size={12} /> : <Unlock size={12} />}
              {dpFlowLocked ? 'FLOW TERKUNCI' : 'MODE DRAFT (DAPAT DIEDIT)'}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-slate)' }}>
              Kapasitas: Tepat 1 Tim per Pos (Atomic Lock)
            </span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 600,
              letterSpacing: '-0.015em',
              color: 'var(--pub-ink)',
              margin: '0 0 0.25rem 0',
            }}
          >
            Konfigurasi Alur Pos DP (Decision Point)
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: 0, maxWidth: '640px' }}>
            Atur urutan pos persiapan, definisikan SOP masing-masing pos, dan tugaskan panitia operator
            sebelum hari H pelaksanaan lomba.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {!dpFlowLocked && (
            <button
              onClick={handleSaveFlow}
              className="pub-btn-outline"
              style={{
                fontSize: '0.8125rem',
                padding: '0.55rem 1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 500,
              }}
            >
              <Save size={14} />
              <span>Simpan Perubahan</span>
            </button>
          )}

          <button
            onClick={() => {
              if (setDpFlowLocked) {
                const nextState = !dpFlowLocked;
                setDpFlowLocked(nextState);
                if (nextState) {
                  handleSaveFlow();
                }
              }
            }}
            className={dpFlowLocked ? 'pub-btn-outline' : 'pub-btn-coral'}
            style={{
              fontSize: '0.8125rem',
              padding: '0.55rem 1.15rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 600,
            }}
          >
            {dpFlowLocked ? <Unlock size={14} /> : <Lock size={14} />}
            <span>{dpFlowLocked ? 'Buka Kunci Flow' : 'Kunci Flow DP'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast Notification */}
      {saveFeedback && (
        <div
          style={{
            backgroundColor: 'var(--emerald-light)',
            color: 'var(--emerald-text)',
            border: '1px solid var(--emerald)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontSize: '0.825rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Check size={16} />
          <span>{saveFeedback}</span>
        </div>
      )}

      {/* Info Notice when Locked */}
      {dpFlowLocked && (
        <div
          style={{
            backgroundColor: '#F1F5F9',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '0.85rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.8125rem',
            color: 'var(--slate-text)',
          }}
        >
          <Shield size={16} style={{ color: 'var(--pub-navy)', flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: 600 }}>Alur Pos DP telah dibekukan.</span> Demi kepatuhan regulasi dan asas keadilan lomba,
            konfigurasi pos dan penugasan tidak dapat disunting selama flow terkunci. Buka kunci jika perlu melakukan perubahan khusus.
          </div>
        </div>
      )}

      {/* 2. Visual Pos DP Editor (Sequence List) */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.5rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--pub-line)',
            paddingBottom: '0.85rem',
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.05rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: 'var(--pub-ink)',
                margin: 0,
              }}
            >
              Rangkaian Pos Persiapan ({dps.length} Pos Aktif)
            </h3>
            <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
              Setiap tim akan bergerak secara berurutan dari Pos 01 hingga pos panggung arena utama.
            </p>
          </div>

          {!dpFlowLocked && (
            <button
              onClick={handleAddDp}
              className="pub-btn-outline"
              style={{
                fontSize: '0.775rem',
                padding: '0.4rem 0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 500,
              }}
            >
              <Plus size={14} />
              <span>Tambah Pos DP</span>
            </button>
          )}
        </div>

        {/* Pos Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {dps.map((dp, index) => {
            const assignedStaff = staffList.filter((s) => s.assignedDpId === dp.id);

            return (
              <div
                key={dp.id}
                style={{
                  backgroundColor: 'var(--canvas)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '1.15rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  position: 'relative',
                }}
              >
                {/* Pos Header & Action */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        backgroundColor: 'var(--midnight-navy)',
                        color: '#FFFFFF',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        fontFamily: 'var(--font-mono)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                      }}
                    >
                      URUTAN {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      style={{
                        fontSize: '0.725rem',
                        color: 'var(--muted-slate)',
                        fontWeight: 500,
                      }}
                    >
                      Kapasitas Terkunci: 1 Tim
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {assignedStaff.length > 0 ? (
                      <span
                        style={{
                          fontSize: '0.725rem',
                          color: 'var(--slate-text)',
                          backgroundColor: '#E2E8F0',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          fontWeight: 500,
                        }}
                      >
                        Petugas: {assignedStaff.map((s) => s.name).join(', ')}
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.725rem',
                          color: 'var(--amber-text)',
                          backgroundColor: 'var(--amber-light)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          fontWeight: 500,
                        }}
                      >
                        Belum ada petugas ditugaskan
                      </span>
                    )}

                    {!dpFlowLocked && dps.length > 2 && (
                      <button
                        onClick={() => handleDeleteDp(dp.id)}
                        title="Hapus Pos Ini"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--ruby)',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '4px',
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Fields: Pos Name & SOP */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                  {/* Pos Name Input */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: 'var(--pub-ink)',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Nama Pos DP
                    </label>
                    <input
                      type="text"
                      disabled={dpFlowLocked}
                      value={dp.name}
                      onChange={(e) => handleDpChange(dp.id, 'name', e.target.value)}
                      placeholder="Contoh: DP 1 — Pengecekan Dokumen"
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.8125rem',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        backgroundColor: dpFlowLocked ? '#F1F5F9' : '#FFFFFF',
                        color: 'var(--pub-ink)',
                        fontWeight: 500,
                      }}
                    />
                  </div>

                  {/* Pos SOP Text Input */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: 'var(--pub-ink)',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Aktivitas & Instruksi SOP Pos
                    </label>
                    <input
                      type="text"
                      disabled={dpFlowLocked}
                      value={dp.sop}
                      onChange={(e) => handleDpChange(dp.id, 'sop', e.target.value)}
                      placeholder="Ringkasan tugas petugas di pos ini..."
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.8125rem',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        backgroundColor: dpFlowLocked ? '#F1F5F9' : '#FFFFFF',
                        color: 'var(--slate-text)',
                        fontWeight: 400,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Manajemen & Penugasan Akun Panitia DP */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.5rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--pub-line)',
            paddingBottom: '0.85rem',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.05rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: 'var(--pub-ink)',
                margin: 0,
              }}
            >
              Penugasan Petugas Operator Pos DP
            </h3>
            <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
              Kelola akun staf operasional lapangan yang bertugas mengoperasikan workstation masing-masing Pos DP.
            </p>
          </div>

          {!dpFlowLocked && (
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="pub-btn-outline"
              style={{
                fontSize: '0.775rem',
                padding: '0.45rem 0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 500,
              }}
            >
              <UserPlus size={14} />
              <span>Tambah Akun Petugas DP</span>
            </button>
          )}
        </div>

        {/* Staff Table */}
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.8125rem',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--canvas)',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--muted-slate)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Nama Petugas</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Email Akun</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Pos Penugasan</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status Akses</th>
                {!dpFlowLocked && <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600 }}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => {
                const targetDp = dps.find((d) => d.id === staff.assignedDpId);

                return (
                  <tr
                    key={staff.id}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      color: 'var(--pub-ink)',
                    }}
                  >
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 500 }}>{staff.name}</td>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.775rem', color: 'var(--muted-slate)' }}>
                      {staff.email}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          backgroundColor: 'var(--midnight-navy)',
                          color: '#FFFFFF',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          fontSize: '0.725rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        Pos {String(staff.assignedDpId).padStart(2, '0')}
                      </span>{' '}
                      <span style={{ fontSize: '0.775rem', color: 'var(--slate-text)', marginLeft: '0.35rem' }}>
                        {targetDp ? targetDp.name.split('—')[1]?.trim() || targetDp.name : `DP ${staff.assignedDpId}`}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          backgroundColor: 'var(--emerald-light)',
                          color: 'var(--emerald-text)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                        }}
                      >
                        {staff.status}
                      </span>
                    </td>
                    {!dpFlowLocked && (
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteStaff(staff.id)}
                          title="Hapus Akun Petugas"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--ruby)',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal Tambah Akun Petugas DP */}
      {showAddStaffModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '460px',
              padding: '1.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--pub-ink)', margin: 0 }}>
                  Tambah Petugas Pos DP
                </h4>
                <p style={{ fontSize: '0.775rem', color: 'var(--muted-slate)', margin: '0.2rem 0 0 0' }}>
                  Buat akun akses workstation untuk operator pos lapangan.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddStaff} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Nama Lengkap Petugas
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="Contoh: Hendra Wijaya"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontWeight: 400,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Alamat Email (Login)
                </label>
                <input
                  type="email"
                  required
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="hendra.dp@kompas.id"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontWeight: 400,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Password Akses Awal
                </label>
                <input
                  type="password"
                  required
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontWeight: 400,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Penugasan Pos DP
                </label>
                <select
                  value={newStaff.assignedDpId}
                  onChange={(e) => setNewStaff({ ...newStaff, assignedDpId: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF',
                    fontWeight: 400,
                  }}
                >
                  {dps.map((d) => (
                    <option key={d.id} value={d.id}>
                      Pos 0{d.id} — {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="pub-btn-outline"
                  style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem', fontWeight: 500 }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="pub-btn-coral"
                  style={{ fontSize: '0.8125rem', padding: '0.5rem 1.15rem', fontWeight: 600 }}
                >
                  Simpan Petugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
