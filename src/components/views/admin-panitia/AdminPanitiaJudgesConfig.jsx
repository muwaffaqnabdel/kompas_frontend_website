import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Trash2,
  Edit2,
  Check,
  CheckCircle,
  Shield,
  Key,
  RotateCcw,
  Award,
  Sparkles,
  ExternalLink,
  Layers,
  Info,
} from 'lucide-react';
import { STORAGE_KEY_CRITERIA } from './AdminPanitiaCriteriaConfig';

export const STORAGE_KEY_JUDGES = 'kompas_event_judges';

export const DEFAULT_JUDGES = [
  {
    id: 'juri-1',
    name: 'Kolonel (Purn) Bambang S., M.Pd',
    role: 'Ketua Dewan Juri (Juri 1)',
    category: 'PBB Murni',
    specialties: ['PBB Murni', 'Komandan Peleton'],
    institution: 'Purna Paskibra Indonesia (PPI Pusat)',
    pin: '8821',
    status: 'AKTIF',
  },
  {
    id: 'juri-2',
    name: 'Mayor Aris Setiawan',
    role: 'Anggota Dewan Juri (Juri 2)',
    category: 'PBB Murni',
    specialties: ['PBB Murni'],
    institution: 'Dispora & Kodam Jaya',
    pin: '4412',
    status: 'AKTIF',
  },
  {
    id: 'juri-3',
    name: 'Kapten Kav. Hendra Gunawan',
    role: 'Anggota Dewan Juri (Juri 3)',
    category: 'PBB Murni',
    specialties: ['PBB Murni'],
    institution: 'Pusdiklat Paskibraka Nasional',
    pin: '9120',
    status: 'AKTIF',
  },
  {
    id: 'juri-4',
    name: 'Dra. Endang Lestari',
    role: 'Anggota Dewan Juri (Juri 4)',
    category: 'Formasi & Variasi',
    specialties: ['Formasi & Variasi'],
    institution: 'Instruktur Koreografi & Tari Nasional',
    pin: '3318',
    status: 'AKTIF',
  },
  {
    id: 'juri-5',
    name: 'Rian Syahputra, S.Sn',
    role: 'Anggota Dewan Juri (Juri 5)',
    category: 'Formasi & Variasi',
    specialties: ['Formasi & Variasi', 'Kerapihan & Kostum'],
    institution: 'Akademi Seni & Budaya Indonesia',
    pin: '7729',
    status: 'AKTIF',
  },
];

export function getStoredJudges() {
  if (typeof window === 'undefined') return DEFAULT_JUDGES;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_JUDGES);
    return saved ? JSON.parse(saved) : DEFAULT_JUDGES;
  } catch {
    return DEFAULT_JUDGES;
  }
}

export default function AdminPanitiaJudgesConfig({ onNavigateToCriteria }) {
  // 1. Judges List State
  const [judges, setJudges] = useState(() => getStoredJudges());

  // 2. Criteria list state (to see what criteria each judge grades)
  const [criteria, setCriteria] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CRITERIA);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 3. Form Add/Edit Judge State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Anggota Dewan Juri',
    category: 'PBB Murni',
    institution: '',
    pin: '',
    status: 'AKTIF',
  });

  // 4. Feedback Alert State
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CRITERIA);
      if (saved) setCriteria(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const saveJudgesToStorage = (updated) => {
    setJudges(updated);
    try {
      localStorage.setItem(STORAGE_KEY_JUDGES, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('kompas_judges_updated', { detail: updated }));
    } catch (err) {
      console.error('Failed saving judges', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nama Dewan Juri wajib diisi.');
      return;
    }

    if (editingId) {
      const updated = judges.map((j) =>
        j.id === editingId
          ? {
              ...j,
              ...formData,
              name: formData.name.trim(),
            }
          : j
      );
      saveJudgesToStorage(updated);
      setEditingId(null);
      setFeedback(`Data juri "${formData.name}" berhasil diperbarui.`);
    } else {
      const nextNum = judges.length + 1;
      const newJudge = {
        id: `juri-${Date.now()}`,
        ...formData,
        name: formData.name.trim(),
        role: formData.role || `Anggota Dewan Juri (Juri ${nextNum})`,
        pin: formData.pin || String(Math.floor(1000 + Math.random() * 9000)),
      };
      const updated = [...judges, newJudge];
      saveJudgesToStorage(updated);
      setFeedback(`Dewan Juri "${newJudge.name}" berhasil didaftarkan.`);
    }

    setFormData({
      name: '',
      role: 'Anggota Dewan Juri',
      category: 'PBB Murni',
      institution: '',
      pin: '',
      status: 'AKTIF',
    });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleStartEdit = (judge) => {
    setEditingId(judge.id);
    setFormData({
      name: judge.name,
      role: judge.role,
      category: judge.category || 'PBB Murni',
      institution: judge.institution || '',
      pin: judge.pin || '1234',
      status: judge.status || 'AKTIF',
    });
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      role: 'Anggota Dewan Juri',
      category: 'PBB Murni',
      institution: '',
      pin: '',
      status: 'AKTIF',
    });
  };

  const handleDelete = (id) => {
    if (judges.length <= 1) {
      alert('Event minimal membutuhkan 1 Dewan Juri.');
      return;
    }
    const item = judges.find((j) => j.id === id);
    if (!window.confirm(`Yakin ingin menghapus Dewan Juri "${item?.name}"?`)) return;

    const updated = judges.filter((j) => j.id !== id);
    saveJudgesToStorage(updated);
    if (editingId === id) handleCancelEdit();
    setFeedback(`Dewan Juri berhasil dihapus.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleResetStandard5 = () => {
    if (!window.confirm('Reset daftar juri ke format standar 5 Dewan Juri LKBB (3 PBB + 2 Variasi & Formasi)?')) return;
    saveJudgesToStorage(DEFAULT_JUDGES);
    handleCancelEdit();
    setFeedback('Format standar 5 Dewan Juri LKBB berhasil dimuat.');
    setTimeout(() => setFeedback(null), 3500);
  };

  // Helper to count how many criteria are assigned to each judge
  const getAssignedCriteriaForJudge = (judgeId) => {
    return criteria.filter((c) => c.assignedJudges && c.assignedJudges.includes(judgeId));
  };

  const pbbCount = judges.filter((j) => j.category === 'PBB Murni').length;
  const variasiCount = judges.filter((j) => j.category === 'Formasi & Variasi').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'var(--font-sans)' }}>
      {/* 1. Header Banner */}
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
                backgroundColor: 'var(--pub-teal-light)',
                color: 'var(--pub-teal)',
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
              <Shield size={12} />
              PANEL RESMI PENJURIAN
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-slate)' }}>
              Komposisi: {pbbCount} Juri PBB Murni · {variasiCount} Juri Variasi & Formasi
            </span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '-0.015em',
              color: 'var(--pub-ink)',
              margin: '0 0 0.25rem 0',
            }}
          >
            Manajemen Dewan Juri LKBB
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: 0, maxWidth: '680px' }}>
            Daftarkan akun dan data dewan juri lapangan. Setelah juri terdaftar, Anda dapat mengatur pembagian
            jobdesk penilaian per kriteria (PBB, Variasi, Danton) pada menu <strong>Kriteria & Nilai</strong>.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={handleResetStandard5}
            className="pub-btn-outline"
            style={{
              fontSize: '0.8125rem',
              padding: '0.55rem 0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 500,
            }}
            title="Reset ke format standar 5 dewan juri"
          >
            <RotateCcw size={13} />
            <span>Preset 5 Juri LKBB</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
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
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Grid: Form Add/Edit (Left) vs Judges Cards (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1fr) minmax(0, 1.6fr)',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* A. Form Tambah / Edit Juri */}
        <div
          style={{
            backgroundColor: 'var(--pub-surface)',
            borderRadius: 'var(--pub-radius-card)',
            padding: '1.5rem',
            border: '1px solid var(--pub-line)',
            boxShadow: 'var(--pub-shadow-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <UserPlus size={18} style={{ color: 'var(--pub-coral)' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--pub-ink)', margin: 0 }}>
              {editingId ? 'Edit Data Dewan Juri' : 'Daftarkan Dewan Juri Baru'}
            </h3>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-text)', marginBottom: '0.35rem' }}>
                Nama Lengkap & Gelar <span style={{ color: 'var(--crimson)' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Mayor Aris Setiawan, S.Pd"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid var(--pub-line)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--pub-ink)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-text)', marginBottom: '0.35rem' }}>
                Peran Penjurian (Jobdesk Utama)
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid var(--pub-line)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--pub-ink)',
                }}
              >
                <option value="PBB Murni">PBB Murni (Gerakan Dasar & Berjalan)</option>
                <option value="Formasi & Variasi">Formasi & Variasi (Estetika & Kekompakan)</option>
                <option value="Komandan Peleton">Komandan Peleton / Danton</option>
                <option value="Kerapihan & Kostum">Kerapihan & Kostum Pasukan</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-text)', marginBottom: '0.35rem' }}>
                Jabatan / Label Penugasan
              </label>
              <input
                type="text"
                placeholder="Contoh: Juri 2 / Anggota PBB Murni"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid var(--pub-line)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--pub-ink)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-text)', marginBottom: '0.35rem' }}>
                Instansi / Asal Lembaga
              </label>
              <input
                type="text"
                placeholder="Contoh: Dispora DKI / PPI Pusat / Kodam Jaya"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid var(--pub-line)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--pub-ink)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-text)', marginBottom: '0.35rem' }}>
                PIN Akses Tablet (4 Digit)
              </label>
              <input
                type="text"
                placeholder="Contoh: 4412"
                maxLength={4}
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid var(--pub-line)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--pub-ink)',
                  fontFamily: 'monospace',
                  letterSpacing: '0.15em',
                }}
              />
              <span style={{ fontSize: '0.725rem', color: 'var(--pub-muted)', display: 'block', marginTop: '0.2rem' }}>
                Digunakan dewan juri untuk otorisasi login cepat pada tablet lapangan.
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="pub-btn-outline"
                  style={{ fontSize: '0.8125rem' }}
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                className="pub-btn-coral"
                style={{ fontSize: '0.8125rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {editingId ? <Check size={14} /> : <UserPlus size={14} />}
                <span>{editingId ? 'Simpan Perubahan' : 'Tambahkan Dewan Juri'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* B. Daftar Dewan Juri Terdaftar */}
        <div
          style={{
            backgroundColor: 'var(--pub-surface)',
            borderRadius: 'var(--pub-radius-card)',
            padding: '1.5rem',
            border: '1px solid var(--pub-line)',
            boxShadow: 'var(--pub-shadow-card)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--pub-ink)', margin: 0 }}>
                Dewan Juri Terverifikasi ({judges.length} Juri)
              </h3>
              <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: '0.15rem 0 0 0' }}>
                Akun juri ini akan dapat dipilih pada checkbox kriteria penilaian.
              </p>
            </div>
            <span
              style={{
                fontSize: '0.725rem',
                fontWeight: 600,
                color: 'var(--pub-teal)',
                backgroundColor: 'var(--pub-teal-light)',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
              }}
            >
              SEMUA AKTIF
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {judges.map((judge, idx) => {
              const assignedCrits = getAssignedCriteriaForJudge(judge.id);
              const isPbb = judge.category === 'PBB Murni';

              return (
                <div
                  key={judge.id}
                  style={{
                    backgroundColor: editingId === judge.id ? 'var(--pub-coral-pale)' : 'var(--pub-canvas)',
                    border: editingId === judge.id ? '1.5px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                    borderRadius: '12px',
                    padding: '1rem 1.15rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: isPbb ? 'var(--pub-navy)' : 'var(--pub-coral)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        J{idx + 1}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--pub-ink)' }}>
                            {judge.name}
                          </span>
                          <span
                            style={{
                              fontSize: '0.675rem',
                              fontWeight: 600,
                              backgroundColor: isPbb ? '#E0F2FE' : '#FEF3C7',
                              color: isPbb ? '#0369A1' : '#B45309',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px',
                            }}
                          >
                            {judge.category}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--slate-text)', marginTop: '0.15rem' }}>
                          {judge.role} {judge.institution ? `• ${judge.institution}` : ''}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(judge)}
                        className="pub-btn-outline"
                        style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
                        title="Edit Data Juri"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(judge.id)}
                        className="pub-btn-outline"
                        style={{ padding: '0.35rem 0.55rem', color: 'var(--crimson)' }}
                        title="Hapus Juri"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Criteria Assignment info */}
                  <div
                    style={{
                      paddingTop: '0.5rem',
                      borderTop: '1px dashed var(--pub-line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--muted-slate)' }}>
                      <Award size={13} style={{ color: 'var(--pub-coral)' }} />
                      <span>
                        Menilai <strong>{assignedCrits.length}</strong> Kriteria Penilaian:
                      </span>
                      {assignedCrits.length > 0 ? (
                        <span style={{ color: 'var(--pub-ink)', fontWeight: 600 }}>
                          {assignedCrits.map((c) => c.name.split('.')[1] || c.name).join(', ')}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--pub-amber)', fontStyle: 'italic' }}>
                          (Belum dicentang di Kriteria & Nilai)
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.725rem', color: 'var(--pub-muted)' }}>
                      <Key size={12} />
                      <span>PIN: <strong style={{ fontFamily: 'monospace' }}>{judge.pin || '1234'}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
