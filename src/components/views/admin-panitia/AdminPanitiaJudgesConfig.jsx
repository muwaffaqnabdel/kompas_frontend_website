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
import {
  STORAGE_KEY_CRITERIA,
  CATEGORY_OPTIONS,
  normalizeCategory,
  getCategoryBadgeStyle,
} from './AdminPanitiaCriteriaConfig';

const JUDGE_CATEGORY_CHOICES = [
  { id: 'PBB', label: 'PBB Murni', desc: 'Gerakan dasar & berjalan' },
  { id: 'DANTON', label: 'Danton', desc: 'Komandan peleton & vokal' },
  { id: 'VARIASI & FORMASI', label: 'Variasi & Formasi', desc: 'Koreografi & estetika' },
  { id: 'MAKE UP / KOSTUM', label: 'Make Up / Kostum', desc: 'Seragam & kerapihan' },
];

const getJudgeSpecialties = (judge) => {
  if (Array.isArray(judge?.specialties) && judge.specialties.length > 0) {
    return Array.from(new Set(judge.specialties.map((s) => normalizeCategory(s))));
  }
  if (judge?.category) {
    const parts = String(judge.category)
      .split(/[&,+]/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      return Array.from(new Set(parts.map((p) => normalizeCategory(p))));
    }
  }
  return ['PBB'];
};

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

export function getStoredJudges(eventId = 'evt-lkbb-2026') {
  if (typeof window === 'undefined') return DEFAULT_JUDGES;
  try {
    const eventSaved = localStorage.getItem(`${STORAGE_KEY_JUDGES}_${eventId}`);
    if (eventSaved) return JSON.parse(eventSaved);
    const saved = localStorage.getItem(STORAGE_KEY_JUDGES);
    return saved ? JSON.parse(saved) : DEFAULT_JUDGES;
  } catch {
    return DEFAULT_JUDGES;
  }
}

export default function AdminPanitiaJudgesConfig({ onNavigateToCriteria, currentEvent }) {
  const eventId = currentEvent?.id || currentEvent?.slug || 'evt-lkbb-2026';

  // 1. Judges List State
  const [judges, setJudges] = useState(() => getStoredJudges(eventId));

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
    category: 'PBB',
    specialties: ['PBB'],
    institution: '',
    pin: '',
    status: 'AKTIF',
  });

  // 4. Feedback Alert State
  const [feedback, setFeedback] = useState(null);

  // Ambil daftar dewan juri & kriteria event dari backend saat halaman dimuat
  useEffect(() => {
    const fetchJudgesData = async () => {
      try {
        const res = await fetch(`/api/panitia/judges?eventId=${eventId}`, { credentials: 'include' });
        const data = await res.json();
        if (data.success && Array.isArray(data.judges) && data.judges.length > 0) {
          const normalizedJudges = data.judges.map((j) => {
            const specs = getJudgeSpecialties(j);
            return { ...j, specialties: specs, category: specs.join(' & ') };
          });
          setJudges(normalizedJudges);
          localStorage.setItem(`${STORAGE_KEY_JUDGES}_${eventId}`, JSON.stringify(normalizedJudges));
          localStorage.setItem(STORAGE_KEY_JUDGES, JSON.stringify(normalizedJudges));
        }
      } catch (err) {
        console.warn('Backend judges API offline, menggunakan penyimpanan lokal:', err);
      }
    };

    const fetchCriteriaData = async () => {
      try {
        const res = await fetch(`/api/panitia/criteria?eventId=${eventId}`, { credentials: 'include' });
        const data = await res.json();
        if (data.success && Array.isArray(data.criteria) && data.criteria.length > 0) {
          setCriteria(data.criteria);
          localStorage.setItem(`${STORAGE_KEY_CRITERIA}_${eventId}`, JSON.stringify(data.criteria));
          localStorage.setItem(STORAGE_KEY_CRITERIA, JSON.stringify(data.criteria));
        }
      } catch (err) {
        console.warn('Backend criteria API offline, menggunakan penyimpanan lokal:', err);
      }
    };

    fetchJudgesData();
    fetchCriteriaData();
  }, [eventId]);

  useEffect(() => {
    const handleCriteriaUpdated = (e) => {
      if (Array.isArray(e.detail)) setCriteria(e.detail);
    };
    try {
      const saved =
        localStorage.getItem(`${STORAGE_KEY_CRITERIA}_${eventId}`) ||
        localStorage.getItem(STORAGE_KEY_CRITERIA);
      if (saved) setCriteria(JSON.parse(saved));
    } catch {
      // ignore
    }
    window.addEventListener('kompas_criteria_updated', handleCriteriaUpdated);
    return () => window.removeEventListener('kompas_criteria_updated', handleCriteriaUpdated);
  }, [eventId]);

  const saveJudgesToStorage = (updated) => {
    setJudges(updated);
    try {
      localStorage.setItem(`${STORAGE_KEY_JUDGES}_${eventId}`, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEY_JUDGES, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('kompas_judges_updated', { detail: updated }));
    } catch (err) {
      console.error('Failed saving judges', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nama Dewan Juri wajib diisi.');
      return;
    }

    const cleanPin = String(formData.pin || '').replace(/\D/g, '').trim();
    if (!/^\d{4}$/.test(cleanPin)) {
      alert('PIN Akses Tablet wajib terdiri dari tepat 4 digit angka (contoh: 4412).');
      return;
    }

    const selectedSpecialties =
      Array.isArray(formData.specialties) && formData.specialties.length > 0
        ? Array.from(new Set(formData.specialties.map((s) => normalizeCategory(s))))
        : [];
    if (selectedSpecialties.length === 0) {
      alert('Pilih minimal 1 kategori penilaian yang menjadi tugas Dewan Juri.');
      return;
    }
    const displayCategory = selectedSpecialties.join(' & ');

    if (editingId) {
      const updated = judges.map((j) =>
        j.id === editingId
          ? {
              ...j,
              ...formData,
              name: formData.name.trim(),
              category: displayCategory,
              specialties: selectedSpecialties,
              pin: cleanPin,
            }
          : j
      );
      saveJudgesToStorage(updated);
      setEditingId(null);
      setFeedback(`Data juri "${formData.name}" berhasil diperbarui.`);

      // Sinkronkan pembaruan ke backend
      try {
        await fetch(`/api/panitia/judges/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            eventId,
            ...formData,
            name: formData.name.trim(),
            category: displayCategory,
            specialties: selectedSpecialties,
            pin: cleanPin,
          }),
        });
      } catch (err) {
        console.warn('Backend sync failed, saved locally:', err);
      }
    } else {
      const nextNum = judges.length + 1;
      const newJudge = {
        id: `juri-${Date.now()}`,
        ...formData,
        name: formData.name.trim(),
        role: formData.role || `Anggota Dewan Juri (Juri ${nextNum})`,
        category: displayCategory,
        specialties: selectedSpecialties,
        pin: cleanPin,
      };
      const updated = [...judges, newJudge];
      saveJudgesToStorage(updated);
      setFeedback(`Dewan Juri "${newJudge.name}" berhasil didaftarkan.`);

      // Kirim juri baru ke backend
      try {
        const res = await fetch('/api/panitia/judges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            eventId,
            name: newJudge.name,
            role: newJudge.role,
            category: newJudge.category,
            specialties: newJudge.specialties,
            institution: newJudge.institution,
            pin: newJudge.pin,
            status: newJudge.status,
          }),
        });
        const data = await res.json();
        if (data.success && data.judge) {
          // Ganti ID lokal sementara dengan ID dari database jika ada
          const synced = updated.map((j) =>
            j.id === newJudge.id ? { ...j, ...data.judge, id: data.judge.id } : j
          );
          saveJudgesToStorage(synced);
        }
      } catch (err) {
        console.warn('Backend sync failed, saved locally:', err);
      }
    }

    setFormData({
      name: '',
      role: 'Anggota Dewan Juri',
      category: 'PBB',
      specialties: ['PBB'],
      institution: '',
      pin: '',
      status: 'AKTIF',
    });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleToggleSpecialty = (categoryId) => {
    setFormData((prev) => {
      const current = Array.isArray(prev.specialties) ? prev.specialties : [];
      const exists = current.includes(categoryId);
      const next = exists
        ? current.filter((c) => c !== categoryId)
        : [...current, categoryId];
      return {
        ...prev,
        specialties: next,
        category: next.join(' & '),
      };
    });
  };

  const handleStartEdit = (judge) => {
    const specs = getJudgeSpecialties(judge);
    setEditingId(judge.id);
    setFormData({
      name: judge.name,
      role: judge.role,
      category: specs.join(' & '),
      specialties: specs,
      institution: judge.institution || '',
      pin: String(judge.pin || '').replace(/\D/g, '').slice(0, 4),
      status: judge.status || 'AKTIF',
    });
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      role: 'Anggota Dewan Juri',
      category: 'PBB',
      specialties: ['PBB'],
      institution: '',
      pin: '',
      status: 'AKTIF',
    });
  };

  const handleDelete = async (id) => {
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

    // Hapus di backend
    try {
      await fetch(`/api/panitia/judges/${id}?eventId=${eventId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (err) {
      console.warn('Backend delete sync failed, saved locally:', err);
    }
  };

  const handleResetStandard5 = async () => {
    if (!window.confirm('Reset daftar juri ke format standar 5 Dewan Juri LKBB (3 PBB + 2 Variasi & Formasi)?')) return;
    saveJudgesToStorage(DEFAULT_JUDGES);
    handleCancelEdit();
    setFeedback('Format standar 5 Dewan Juri LKBB berhasil dimuat.');
    setTimeout(() => setFeedback(null), 3500);

    // Sinkronkan reset ke backend
    try {
      const res = await fetch('/api/panitia/judges/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.judges)) {
        saveJudgesToStorage(data.judges);
      }
    } catch (err) {
      console.warn('Backend reset sync failed, saved locally:', err);
    }
  };

  // Helper untuk menghitung kriteria yang menjadi tugas masing-masing Juri berdasarkan kategori yang dicentang
  const getAssignedCriteriaForJudge = (judge) => {
    const judgeCats = getJudgeSpecialties(judge);
    return criteria.filter((c) => {
      const critCat = normalizeCategory(c.category);
      if (judgeCats.includes(critCat)) return true;
      return Array.isArray(c.assignedJudges) && c.assignedJudges.includes(judge.id);
    });
  };

  const pbbCount = judges.filter((j) => getJudgeSpecialties(j).includes('PBB')).length;
  const variasiCount = judges.filter((j) => getJudgeSpecialties(j).includes('VARIASI & FORMASI')).length;

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
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-text)', marginBottom: '0.45rem' }}>
                Kategori Penilaian yang Ditugaskan <span style={{ color: 'var(--crimson)' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {JUDGE_CATEGORY_CHOICES.map((choice) => {
                  const isChecked = (formData.specialties || []).includes(choice.id);
                  const badgeStyle = getCategoryBadgeStyle(choice.id);
                  return (
                    <label
                      key={choice.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        padding: '0.55rem 0.65rem',
                        borderRadius: '8px',
                        border: isChecked ? '1.5px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                        backgroundColor: isChecked ? '#FFF7ED' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.12s ease',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleSpecialty(choice.id)}
                        style={{ marginTop: '2px', accentColor: 'var(--pub-coral)', cursor: 'pointer' }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '0.775rem',
                            fontWeight: 700,
                            color: isChecked ? badgeStyle.color : 'var(--pub-ink)',
                            lineHeight: 1.2,
                          }}
                        >
                          {choice.label}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--pub-muted)', marginTop: '0.1rem' }}>
                          {choice.desc}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--pub-muted)', display: 'block', marginTop: '0.3rem' }}>
                Bisa pilih lebih dari 1 kategori (mis. PBB + Danton). Tablet juri otomatis hanya menampilkan aba-aba dari kategori yang dicentang.
              </span>
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
                PIN Akses Tablet (Wajib 4 Digit Angka) <span style={{ color: 'var(--crimson)' }}>*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{4}"
                minLength={4}
                maxLength={4}
                required
                placeholder="Contoh: 4412"
                value={formData.pin}
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setFormData({ ...formData, pin: digitsOnly });
                }}
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
                Wajib tepat 4 digit angka (0–9). Digunakan dewan juri untuk login cepat pada tablet lapangan.
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
              const judgeSpecs = getJudgeSpecialties(judge);
              const assignedCrits = getAssignedCriteriaForJudge(judge);
              const isPbb = judgeSpecs.includes('PBB');

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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--pub-ink)' }}>
                            {judge.name}
                          </span>
                          {judgeSpecs.map((spec) => {
                            const badgeStyle = getCategoryBadgeStyle(spec);
                            return (
                              <span
                                key={spec}
                                style={{
                                  fontSize: '0.675rem',
                                  fontWeight: 700,
                                  ...badgeStyle,
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: '4px',
                                }}
                              >
                                {spec}
                              </span>
                            );
                          })}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--muted-slate)', flexWrap: 'wrap' }}>
                      <Award size={13} style={{ color: 'var(--pub-coral)', flexShrink: 0 }} />
                      <span>
                        Menilai <strong>{assignedCrits.length}</strong> Aba-Aba ({judgeSpecs.join(', ')}):
                      </span>
                      {assignedCrits.length > 0 ? (
                        <span style={{ color: 'var(--pub-ink)', fontWeight: 600 }}>
                          {assignedCrits
                            .slice(0, 4)
                            .map((c) => c.name.replace(/^\d+\.\s*/, ''))
                            .join(', ')}
                          {assignedCrits.length > 4 ? ` (+${assignedCrits.length - 4} lainnya)` : ''}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--pub-amber)', fontStyle: 'italic' }}>
                          (Belum ada butir aba-aba pada kategori {judgeSpecs.join(', ')} di menu Kriteria & Nilai)
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
