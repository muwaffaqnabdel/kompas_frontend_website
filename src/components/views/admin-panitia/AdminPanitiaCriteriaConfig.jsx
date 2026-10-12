import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Save,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Shield,
  Check,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Smartphone,
  Sliders,
  RotateCcw,
  Info,
  Award,
  Layers,
  UserCheck,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  STORAGE_KEY_JUDGES,
  DEFAULT_JUDGES,
  getStoredJudges,
} from './AdminPanitiaJudgesConfig';

export const STORAGE_KEY_CRITERIA = 'kompas_scoring_criteria';
export const STORAGE_KEY_SCORING_LOCKED = 'kompas_scoring_locked';

export const DEFAULT_CRITERIA = [
  {
    id: 'c1',
    name: '1. Sikap Sempurna & Berhimpun',
    category: 'PBB Murni',
    orderIndex: 1,
    minScore: 70,
    maxScore: 100,
    intervalStep: 5,
    weight: 1.0,
    isMandatory: true,
    options: [70, 75, 80, 85, 90, 95, 100],
    assignedJudges: ['juri-1', 'juri-2', 'juri-3'],
    description: 'Kerapihan tumit merapat, sudut kaki 45 derajat, dada membusung, tangan menggenggam.',
  },
  {
    id: 'c2',
    name: '2. Penghormatan (Hormat Umum/Pembina)',
    category: 'PBB Murni',
    orderIndex: 2,
    minScore: 70,
    maxScore: 100,
    intervalStep: 5,
    weight: 1.0,
    isMandatory: true,
    options: [70, 75, 80, 85, 90, 95, 100],
    assignedJudges: ['juri-1', 'juri-2', 'juri-3'],
    description: 'Ketepatan sudut 15 derajat, telapak tangan lurus, jari manis menempel pelipis/tutup kepala.',
  },
  {
    id: 'c3',
    name: '3. Lencang Kanan & Setengah Lengan',
    category: 'PBB Murni',
    orderIndex: 3,
    minScore: 70,
    maxScore: 100,
    intervalStep: 5,
    weight: 1.0,
    isMandatory: true,
    options: [70, 75, 80, 85, 90, 95, 100],
    assignedJudges: ['juri-1', 'juri-2', 'juri-3'],
    description: 'Kelurusan saf, banjar, kerapihan kepala menengok serempak 45 derajat.',
  },
  {
    id: 'c4',
    name: '4. Berhitung Saf & Banjar',
    category: 'PBB Murni',
    orderIndex: 4,
    minScore: 70,
    maxScore: 100,
    intervalStep: 5,
    weight: 1.0,
    isMandatory: true,
    options: [70, 75, 80, 85, 90, 95, 100],
    assignedJudges: ['juri-1', 'juri-2', 'juri-3'],
    description: 'Kenyaringan suara, ketepatan memalingkan muka, kesigapan saf terdepan.',
  },
  {
    id: 'c5',
    name: '5. Hadap Kanan & Hadap Kiri',
    category: 'PBB Murni',
    orderIndex: 5,
    minScore: 70,
    maxScore: 100,
    intervalStep: 5,
    weight: 1.0,
    isMandatory: true,
    options: [70, 75, 80, 85, 90, 95, 100],
    assignedJudges: ['juri-1', 'juri-2', 'juri-3'],
    description: 'Ketepatan kaki tumpu, poros tumit, hentakan kaki penutup yang tegas.',
  },
  {
    id: 'c6',
    name: '6. Hadap Serong Kanan & Kiri',
    category: 'PBB Murni',
    orderIndex: 6,
    minScore: 70,
    maxScore: 100,
    intervalStep: 5,
    weight: 1.0,
    isMandatory: true,
    options: [70, 75, 80, 85, 90, 95, 100],
    assignedJudges: ['juri-1', 'juri-2', 'juri-3'],
    description: 'Sudut putaran 45 derajat, ketahanan postur dada tetap tegak.',
  },
  {
    id: 'c7',
    name: '7. Balik Kanan & Balik Kanan Jalan di Tempat',
    category: 'PBB Murni',
    orderIndex: 7,
    minScore: 70,
    maxScore: 100,
    intervalStep: 5,
    weight: 1.0,
    isMandatory: true,
    options: [70, 75, 80, 85, 90, 95, 100],
    assignedJudges: ['juri-1', 'juri-2', 'juri-3'],
    description: 'Putaran 180 derajat, keseimbangan tubuh pasukan, keseragaman penutupan kaki.',
  },
  {
    id: 'c8',
    name: '8. Langkah Tegap & Hormat Kanan',
    category: 'PBB Murni',
    orderIndex: 8,
    minScore: 70,
    maxScore: 100,
    intervalStep: 5,
    weight: 1.0,
    isMandatory: true,
    options: [70, 75, 80, 85, 90, 95, 100],
    assignedJudges: ['juri-1', 'juri-2', 'juri-3'],
    description: 'Tempo 120 langkah/menit, panjang langkah 65cm, ayunan tangan 90 derajat.',
  },
  {
    id: 'c9',
    name: '9. Variasi Formasi Bentuk Simetris',
    category: 'Formasi & Variasi',
    orderIndex: 9,
    minScore: 70,
    maxScore: 100,
    intervalStep: 5,
    weight: 1.0,
    isMandatory: true,
    options: [70, 75, 80, 85, 90, 95, 100],
    assignedJudges: ['juri-4', 'juri-5'],
    description: 'Tingkat kesulitan transisi gerakan, estetika bentuk formasi, kekompakan pasukan.',
  },
  {
    id: 'c10',
    name: '10. Variasi Formasi Dinamis & Yel-Yel',
    category: 'Formasi & Variasi',
    orderIndex: 10,
    minScore: 70,
    maxScore: 100,
    intervalStep: 5,
    weight: 1.0,
    isMandatory: true,
    options: [70, 75, 80, 85, 90, 95, 100],
    assignedJudges: ['juri-4', 'juri-5'],
    description: 'Harmonisasi suara, koreografi gerak bebas, ketepatan batas waktu panggung.',
  },
  {
    id: 'c11',
    name: '11. Artikulasi & Intonasi Danton',
    category: 'Komandan Peleton',
    orderIndex: 11,
    minScore: 70,
    maxScore: 100,
    intervalStep: 5,
    weight: 1.0,
    isMandatory: true,
    options: [70, 75, 80, 85, 90, 95, 100],
    assignedJudges: ['juri-1'],
    description: 'Kejelasan vokal petunjuk & peringatan, ketegasan sikap komando di kotak danton.',
  },
];

export default function AdminPanitiaCriteriaConfig({
  scoringLocked = false,
  setScoringLocked,
}) {
  // 1. Registered Judges State (from localStorage / shared)
  const [judges, setJudges] = useState(() => getStoredJudges());

  // Listen to external judge changes
  useEffect(() => {
    const handleJudgesUpdate = (e) => {
      if (e.detail) setJudges(e.detail);
    };
    window.addEventListener('kompas_judges_updated', handleJudgesUpdate);
    return () => window.removeEventListener('kompas_judges_updated', handleJudgesUpdate);
  }, []);

  // 2. Criteria List State
  const [criteria, setCriteria] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CRITERIA);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((c, i) => ({
          ...c,
          assignedJudges: c.assignedJudges || DEFAULT_CRITERIA[i]?.assignedJudges || ['juri-1', 'juri-2', 'juri-3'],
        }));
      }
      return DEFAULT_CRITERIA;
    } catch {
      return DEFAULT_CRITERIA;
    }
  });

  // 3. Active Editing or Adding Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'PBB Murni',
    minScore: 70,
    maxScore: 100,
    intervalStep: 5,
    weight: 1.0,
    isMandatory: true,
    description: '',
    options: [70, 75, 80, 85, 90, 95, 100],
    assignedJudges: ['juri-1', 'juri-2', 'juri-3'], // default 3 juri PBB
  });

  // Custom score input for manual override
  const [customScoreInput, setCustomScoreInput] = useState('');

  // 4. Pagination State (10 items per page as requested)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(criteria.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCriteria = criteria.slice(startIndex, startIndex + itemsPerPage);

  // 5. Simulator State
  const [simulatedScores, setSimulatedScores] = useState({});

  // 6. Critical Lock Confirmation Modal State
  const [showLockModal, setShowLockModal] = useState(false);

  // 7. Toast Feedback State
  const [saveFeedback, setSaveFeedback] = useState(null);

  // Helper to generate score options from min, max, interval
  const generateScoreOptions = (min, max, step) => {
    const minVal = parseFloat(min) || 0;
    const maxVal = parseFloat(max) || 0;
    const stepVal = parseFloat(step) || 1;

    if (stepVal <= 0 || minVal > maxVal) return [minVal];

    const result = [];
    for (let v = minVal; v <= maxVal + 0.0001; v += stepVal) {
      result.push(Math.round(v * 100) / 100);
    }
    return result;
  };

  // Sync simulator initial scores when criteria change
  useEffect(() => {
    const initialSim = {};
    criteria.forEach((c) => {
      if (c.options && c.options.length > 0) {
        const midIdx = Math.floor(c.options.length / 2);
        initialSim[c.id] = c.options[midIdx] ?? c.options[0];
      }
    });
    setSimulatedScores(initialSim);
  }, [criteria]);

  // Handle Form Min/Max/Interval Change with automatic options update
  const handleRangeChange = (field, value) => {
    const updatedForm = { ...formData, [field]: value };
    const newOptions = generateScoreOptions(
      field === 'minScore' ? value : updatedForm.minScore,
      field === 'maxScore' ? value : updatedForm.maxScore,
      field === 'intervalStep' ? value : updatedForm.intervalStep
    );
    updatedForm.options = newOptions;
    setFormData(updatedForm);
  };

  // Manual Override: Remove an option
  const handleRemoveOption = (valToRemove) => {
    if (formData.options.length <= 1) {
      alert('Kriteria harus memiliki minimal 1 pilihan nilai.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((v) => v !== valToRemove),
    }));
  };

  // Manual Override: Add custom score
  const handleAddCustomScore = () => {
    const val = parseFloat(customScoreInput);
    if (isNaN(val)) return;
    if (formData.options.includes(val)) {
      alert('Nilai tersebut sudah ada dalam daftar opsi.');
      return;
    }
    const newOpts = [...formData.options, val].sort((a, b) => a - b);
    setFormData((prev) => ({ ...prev, options: newOpts }));
    setCustomScoreInput('');
  };

  // Toggle judge assignment in checkbox
  const handleToggleJudge = (judgeId) => {
    setFormData((prev) => {
      const current = prev.assignedJudges || [];
      const updated = current.includes(judgeId)
        ? current.filter((id) => id !== judgeId)
        : [...current, judgeId];
      return { ...prev, assignedJudges: updated };
    });
  };

  // Quick preset shortcuts for judge selection
  const handleSelectAllJudges = () => {
    setFormData((prev) => ({
      ...prev,
      assignedJudges: judges.map((j) => j.id),
    }));
  };

  const handleSelectPbbJudges = () => {
    const pbbIds = judges.filter((j) => j.category === 'PBB Murni').map((j) => j.id);
    setFormData((prev) => ({
      ...prev,
      assignedJudges: pbbIds,
    }));
  };

  const handleSelectVariasiJudges = () => {
    const varIds = judges.filter((j) => j.category === 'Formasi & Variasi').map((j) => j.id);
    setFormData((prev) => ({
      ...prev,
      assignedJudges: varIds,
    }));
  };

  const handleClearJudges = () => {
    setFormData((prev) => ({
      ...prev,
      assignedJudges: [],
    }));
  };

  // Auto-suggest judges when category dropdown changes
  const handleCategoryChange = (newCat) => {
    let suggested = [];
    if (newCat === 'PBB Murni') {
      suggested = judges.filter((j) => j.category === 'PBB Murni').map((j) => j.id);
    } else if (newCat === 'Formasi & Variasi') {
      suggested = judges.filter((j) => j.category === 'Formasi & Variasi').map((j) => j.id);
    } else if (newCat === 'Komandan Peleton') {
      suggested = [judges[0]?.id || 'juri-1'];
    } else {
      suggested = judges.map((j) => j.id);
    }

    setFormData((prev) => ({
      ...prev,
      category: newCat,
      assignedJudges: suggested.length > 0 ? suggested : prev.assignedJudges,
    }));
  };

  // Save criteria to localStorage
  const handleSaveAll = () => {
    try {
      localStorage.setItem(STORAGE_KEY_CRITERIA, JSON.stringify(criteria));
      setSaveFeedback('Konfigurasi kriteria, daftar nilai, dan penugasan juri berhasil disimpan.');
      setTimeout(() => setSaveFeedback(null), 3500);
    } catch (err) {
      console.error('Error saving criteria config', err);
    }
  };

  // Submit / Add / Update Criteria
  const handleSubmitCriteria = (e) => {
    e.preventDefault();
    if (scoringLocked) return;
    if (!formData.name.trim()) {
      alert('Nama kriteria / aba-aba wajib diisi.');
      return;
    }
    if (formData.options.length === 0) {
      alert('Daftar nilai kriteria tidak boleh kosong.');
      return;
    }

    if (editingId) {
      const updated = criteria.map((c) =>
        c.id === editingId
          ? {
              ...c,
              ...formData,
              options: [...formData.options],
              assignedJudges: [...(formData.assignedJudges || [])],
            }
          : c
      );
      setCriteria(updated);
      localStorage.setItem(STORAGE_KEY_CRITERIA, JSON.stringify(updated));
      setEditingId(null);
      setSaveFeedback(`Aba-aba "${formData.name}" berhasil diperbarui.`);
    } else {
      const newCrit = {
        id: `c-${Date.now()}`,
        ...formData,
        orderIndex: criteria.length + 1,
        options: [...formData.options],
        assignedJudges: [...(formData.assignedJudges || [])],
      };
      const updated = [...criteria, newCrit];
      setCriteria(updated);
      localStorage.setItem(STORAGE_KEY_CRITERIA, JSON.stringify(updated));
      setSaveFeedback(`Aba-aba "${newCrit.name}" berhasil ditambahkan.`);
      
      // Auto switch to last page if new item created
      const newTotal = Math.ceil(updated.length / itemsPerPage);
      setCurrentPage(newTotal);
    }

    // Reset Form
    setFormData({
      name: '',
      category: 'PBB Murni',
      minScore: 70,
      maxScore: 100,
      intervalStep: 5,
      weight: 1.0,
      isMandatory: true,
      description: '',
      options: [70, 75, 80, 85, 90, 95, 100],
      assignedJudges: judges.filter((j) => j.category === 'PBB Murni').map((j) => j.id),
    });
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  // Start Editing Criteria
  const handleStartEdit = (crit) => {
    if (scoringLocked) return;
    setEditingId(crit.id);
    setFormData({
      name: crit.name,
      category: crit.category || 'PBB Murni',
      minScore: crit.minScore,
      maxScore: crit.maxScore,
      intervalStep: crit.intervalStep,
      weight: crit.weight || 1.0,
      isMandatory: crit.isMandatory !== false,
      description: crit.description || '',
      options: [...(crit.options || [])],
      assignedJudges: [...(crit.assignedJudges || [])],
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'PBB Murni',
      minScore: 70,
      maxScore: 100,
      intervalStep: 5,
      weight: 1.0,
      isMandatory: true,
      description: '',
      options: [70, 75, 80, 85, 90, 95, 100],
      assignedJudges: judges.filter((j) => j.category === 'PBB Murni').map((j) => j.id),
    });
  };

  // Delete Criteria
  const handleDeleteCriteria = (id) => {
    if (scoringLocked) return;
    if (criteria.length <= 1) {
      alert('Event kompetisi minimal membutuhkan 1 kriteria penilaian aktif.');
      return;
    }
    const item = criteria.find((c) => c.id === id);
    if (!window.confirm(`Yakin ingin menghapus aba-aba "${item?.name}"?`)) return;

    const updated = criteria
      .filter((c) => c.id !== id)
      .map((c, idx) => ({ ...c, orderIndex: idx + 1 }));
    setCriteria(updated);
    localStorage.setItem(STORAGE_KEY_CRITERIA, JSON.stringify(updated));
    if (editingId === id) handleCancelEdit();

    const newTotalPages = Math.ceil(updated.length / itemsPerPage) || 1;
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }

    setSaveFeedback(`Aba-aba berhasil dihapus.`);
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  // Reorder Criteria using Global Index
  const handleMoveOrder = (globalIdx, direction) => {
    if (scoringLocked) return;
    const targetIdx = direction === 'up' ? globalIdx - 1 : globalIdx + 1;
    if (targetIdx < 0 || targetIdx >= criteria.length) return;

    const newArr = [...criteria];
    const temp = newArr[globalIdx];
    newArr[globalIdx] = newArr[targetIdx];
    newArr[targetIdx] = temp;

    const reordered = newArr.map((c, i) => ({ ...c, orderIndex: i + 1 }));
    setCriteria(reordered);
    localStorage.setItem(STORAGE_KEY_CRITERIA, JSON.stringify(reordered));
  };

  // Reset to default LKBB criteria template
  const handleResetDefaults = () => {
    if (scoringLocked) return;
    if (!window.confirm('Muat rubrik standar LKBB (11 aba-aba resmi PBB, Variasi, & Danton)?')) return;

    setCriteria(DEFAULT_CRITERIA);
    localStorage.setItem(STORAGE_KEY_CRITERIA, JSON.stringify(DEFAULT_CRITERIA));
    setCurrentPage(1);
    handleCancelEdit();
    setSaveFeedback('Rubrik standar LKBB berhasil dimuat.');
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  // Critical Action: Lock toggle
  const handleToggleLockConfirm = () => {
    if (scoringLocked) {
      if (setScoringLocked) setScoringLocked(false);
      localStorage.setItem(STORAGE_KEY_SCORING_LOCKED, 'false');
      setSaveFeedback('Kunci kriteria dibuka. Konfigurasi kini dapat disunting kembali.');
    } else {
      if (setScoringLocked) setScoringLocked(true);
      localStorage.setItem(STORAGE_KEY_SCORING_LOCKED, 'true');
      handleSaveAll();
      setSaveFeedback('Kriteria & daftar nilai resmi berhasil dikunci (Locked V1.0).');
    }
    setShowLockModal(false);
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  // Total and average simulator score
  const totalSimulatedScore = criteria.reduce((acc, c) => {
    return acc + (parseFloat(simulatedScores[c.id]) || 0);
  }, 0);

  const avgSimulatedScore =
    criteria.length > 0 ? (totalSimulatedScore / criteria.length).toFixed(1) : 0;

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
                backgroundColor: scoringLocked ? 'var(--emerald-light)' : 'var(--amber-light)',
                color: scoringLocked ? 'var(--emerald-text)' : 'var(--amber-text)',
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
              {scoringLocked ? <Lock size={12} /> : <Unlock size={12} />}
              {scoringLocked ? 'KRITERIA TERKUNCI (VERSI 1.0)' : 'MODE DRAFT (DAPAT DIEDIT)'}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-slate)' }}>
              Total: {criteria.length} Aba-Aba Terkonfigurasi
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
            Setup Rubrik Aba-Aba & Kriteria Nilai
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: 0, maxWidth: '680px' }}>
            Kelola daftar aba-aba perlombaan dengan tampilan tabel ringkas berhalaman (10 aba-aba per halaman),
            atur rentang skor, dan centang dewan juri penilai sebelum hari H.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {!scoringLocked && (
            <>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="pub-btn-outline"
                style={{
                  fontSize: '0.8125rem',
                  padding: '0.55rem 0.95rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 500,
                }}
                title="Gunakan template resmi LKBB Paskibra"
              >
                <RotateCcw size={13} />
                <span>Preset Standar LKBB</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAll}
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
                <span>Simpan Draft</span>
              </button>
            </>
          )}

          {/* Critical Lock Button */}
          <button
            type="button"
            onClick={() => setShowLockModal(true)}
            className={scoringLocked ? 'pub-btn-outline' : 'pub-btn-coral'}
            style={{
              fontSize: '0.8125rem',
              padding: '0.55rem 1.15rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 600,
            }}
          >
            {scoringLocked ? <Unlock size={14} /> : <Lock size={14} />}
            <span>{scoringLocked ? 'Buka Kunci Kriteria' : 'Kunci Kriteria Penilaian'}</span>
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
      {scoringLocked && (
        <div
          style={{
            backgroundColor: '#F1F5F9',
            border: '1px solid #CBD5E1',
            borderRadius: '10px',
            padding: '0.85rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.8125rem',
            color: 'var(--slate-text)',
          }}
        >
          <Shield size={18} style={{ color: 'var(--pub-navy)', flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: 600 }}>Konfigurasi & Penugasan Juri Telah Dikunci.</span> Sesuai regulasi integritas kompetisi KOMPAS,
            dewan juri di lapangan hanya dapat menilai kriteria dan opsi nilai yang telah ditugaskan.
            Form penambahan dan penyuntingan kriteria dinonaktifkan hingga kunci dibuka kembali.
          </div>
        </div>
      )}

      {/* Main Two-Column Layout: Form & Table (Left) vs Jury Live Simulator (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(340px, 0.9fr)',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* ======================================================== */}
        {/* KOLOM KIRI: Form Builder & Tabel Kriteria Ringkas        */}
        {/* ======================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* A. Form Builder Kriteria (Hanya aktif jika Belum Dikunci) */}
          {!scoringLocked && (
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sliders size={18} style={{ color: 'var(--pub-coral)' }} />
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--pub-ink)', margin: 0 }}>
                    {editingId ? 'Edit Aba-Aba / Kriteria' : 'Tambah Aba-Aba / Kriteria Baru'}
                  </h3>
                </div>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--pub-muted)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitCriteria} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* 1. Input Nama & Kategori */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-text)', marginBottom: '0.35rem' }}>
                      Nama Aba-Aba / Kriteria <span style={{ color: 'var(--crimson)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Langkah Tegap & Hormat Kanan"
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
                      Kategori Penilaian
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
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
                      <option value="PBB Murni">PBB Murni (3 Juri PBB)</option>
                      <option value="Formasi & Variasi">Formasi & Variasi (2 Juri Variasi)</option>
                      <option value="Komandan Peleton">Komandan Peleton (Juri Danton / Rangkap)</option>
                      <option value="Kerapihan & Kostum">Kerapihan & Kostum Pasukan</option>
                      <option value="Waktu & Kedisiplinan">Waktu & Kedisiplinan</option>
                    </select>
                  </div>
                </div>

                {/* 2. Deskripsi Rubrik Singkat */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-text)', marginBottom: '0.35rem' }}>
                    Deskripsi Rubrik Panduan Juri
                  </label>
                  <input
                    type="text"
                    placeholder="Panduan bagi dewan juri mengenai aspek yang diobservasi..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.825rem',
                      borderRadius: '8px',
                      border: '1px solid var(--pub-line)',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--pub-ink)',
                    }}
                  />
                </div>

                {/* 3. Generator Rentang Nilai (Min, Max, Step) */}
                <div
                  style={{
                    backgroundColor: 'var(--pub-canvas)',
                    borderRadius: '10px',
                    padding: '0.9rem 1rem',
                    border: '1px solid var(--pub-line)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pub-navy)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Sparkles size={14} style={{ color: 'var(--pub-coral)' }} />
                      Generator Rentang Nilai Dinamis (FR-04)
                    </span>
                    <span style={{ fontSize: '0.725rem', color: 'var(--pub-muted)' }}>
                      Menghasilkan {formData.options.length} pilihan nilai
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.65rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.725rem', color: 'var(--muted-slate)', marginBottom: '0.2rem' }}>
                        Min Score
                      </label>
                      <input
                        type="number"
                        value={formData.minScore}
                        onChange={(e) => handleRangeChange('minScore', e.target.value)}
                        className="tabular-nums"
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.6rem',
                          fontSize: '0.85rem',
                          borderRadius: '6px',
                          border: '1px solid var(--pub-line)',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.725rem', color: 'var(--muted-slate)', marginBottom: '0.2rem' }}>
                        Max Score
                      </label>
                      <input
                        type="number"
                        value={formData.maxScore}
                        onChange={(e) => handleRangeChange('maxScore', e.target.value)}
                        className="tabular-nums"
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.6rem',
                          fontSize: '0.85rem',
                          borderRadius: '6px',
                          border: '1px solid var(--pub-line)',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.725rem', color: 'var(--muted-slate)', marginBottom: '0.2rem' }}>
                        Interval / Step
                      </label>
                      <input
                        type="number"
                        value={formData.intervalStep}
                        onChange={(e) => handleRangeChange('intervalStep', e.target.value)}
                        className="tabular-nums"
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.6rem',
                          fontSize: '0.85rem',
                          borderRadius: '6px',
                          border: '1px solid var(--pub-line)',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.725rem', color: 'var(--muted-slate)', marginBottom: '0.2rem' }}>
                        Bobot (Weight)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 1 })}
                        className="tabular-nums"
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.6rem',
                          fontSize: '0.85rem',
                          borderRadius: '6px',
                          border: '1px solid var(--pub-line)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Preview Daftar Nilai Chips & Manual Override */}
                  <div style={{ marginTop: '0.85rem' }}>
                    <div style={{ fontSize: '0.725rem', color: 'var(--muted-slate)', marginBottom: '0.35rem' }}>
                      Opsi Nilai yang Disediakan ke Juri:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
                      {formData.options.map((val) => (
                        <span
                          key={val}
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid var(--pub-line)',
                            padding: '0.25rem 0.55rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: 'var(--pub-ink)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                          className="tabular-nums"
                        >
                          {val}
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(val)}
                            title="Hapus opsi nilai ini (Manual Override)"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--crimson)',
                              cursor: 'pointer',
                              padding: 0,
                              fontSize: '0.75rem',
                              lineHeight: 1,
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      {/* Add Custom Score Input */}
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginLeft: '0.25rem' }}>
                        <input
                          type="number"
                          placeholder="+ Nilai"
                          value={customScoreInput}
                          onChange={(e) => setCustomScoreInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomScore();
                            }
                          }}
                          style={{
                            width: '65px',
                            padding: '0.25rem 0.45rem',
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            border: '1px dashed var(--pub-muted)',
                            backgroundColor: '#FFFFFF',
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomScore}
                          className="pub-btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Checkbox Penugasan Dewan Juri */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '1rem',
                    border: '1.5px solid var(--pub-line)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <UserCheck size={16} style={{ color: 'var(--pub-coral)' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
                          Penugasan Dewan Juri Penilai
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', margin: '0.15rem 0 0 0' }}>
                        Centang dewan juri yang di tabletnya akan muncul aba-aba ini:
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={handleSelectAllJudges}
                        className="pub-btn-outline"
                        style={{ padding: '0.25rem 0.55rem', fontSize: '0.725rem' }}
                      >
                        Centang Semua
                      </button>
                      <button
                        type="button"
                        onClick={handleSelectPbbJudges}
                        className="pub-btn-outline"
                        style={{ padding: '0.25rem 0.55rem', fontSize: '0.725rem' }}
                      >
                        Juri PBB
                      </button>
                      <button
                        type="button"
                        onClick={handleSelectVariasiJudges}
                        className="pub-btn-outline"
                        style={{ padding: '0.25rem 0.55rem', fontSize: '0.725rem' }}
                      >
                        Juri Variasi
                      </button>
                      <button
                        type="button"
                        onClick={handleClearJudges}
                        className="pub-btn-outline"
                        style={{ padding: '0.25rem 0.45rem', fontSize: '0.725rem', color: 'var(--pub-muted)' }}
                      >
                        Kosongkan
                      </button>
                    </div>
                  </div>

                  {/* Grid Checkbox Dewan Juri */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: '0.5rem',
                      marginTop: '0.65rem',
                    }}
                  >
                    {judges.map((j, idx) => {
                      const isChecked = (formData.assignedJudges || []).includes(j.id);
                      const isPbb = j.category === 'PBB Murni';

                      return (
                        <label
                          key={j.id}
                          onClick={(e) => {
                            e.preventDefault();
                            handleToggleJudge(j.id);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.55rem',
                            padding: '0.55rem 0.65rem',
                            borderRadius: '8px',
                            border: isChecked ? '1.5px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                            backgroundColor: isChecked ? 'var(--pub-coral-pale)' : 'var(--pub-canvas)',
                            cursor: 'pointer',
                            userSelect: 'none',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            style={{
                              width: '15px',
                              height: '15px',
                              accentColor: 'var(--pub-coral)',
                              cursor: 'pointer',
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pub-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {j.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.1rem' }}>
                              <span
                                style={{
                                  fontSize: '0.625rem',
                                  fontWeight: 600,
                                  backgroundColor: isPbb ? '#E0F2FE' : '#FEF3C7',
                                  color: isPbb ? '#0369A1' : '#B45309',
                                  padding: '0.08rem 0.3rem',
                                  borderRadius: '3px',
                                }}
                              >
                                {j.category}
                              </span>
                              <span style={{ fontSize: '0.675rem', color: 'var(--pub-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                Juri {idx + 1}
                              </span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Action */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.25rem' }}>
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
                    {editingId ? <Save size={14} /> : <Plus size={14} />}
                    <span>{editingId ? 'Simpan Perubahan Aba-Aba' : 'Tambahkan Aba-Aba'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* B. TABEL RUBRIK ABA-ABA RINGKAS (10 PER HALAMAN)         */}
          {/* Sesuai permintaan user: tabel simpel, per page 10 item   */}
          {/* ======================================================== */}
          <div
            style={{
              backgroundColor: 'var(--pub-surface)',
              borderRadius: 'var(--pub-radius-card)',
              border: '1px solid var(--pub-line)',
              boxShadow: 'var(--pub-shadow-card)',
              overflow: 'hidden',
            }}
          >
            {/* Header Kontrol Tabel */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--pub-line)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--pub-ink)', margin: 0 }}>
                  Daftar Rubrik Aba-Aba ({criteria.length} Komponen)
                </h3>
                <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: '0.15rem 0 0 0' }}>
                  Tabel ringkas aba-aba lomba, status kategori, rentang skor, dan penugasan juri.
                </p>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--pub-navy)',
                  backgroundColor: 'var(--pub-sand)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                }}
              >
                Halaman {currentPage} dari {totalPages}
              </span>
            </div>

            {/* Tabel Ringkas */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: 'var(--pub-canvas)',
                      borderBottom: '1.5px solid var(--pub-line)',
                      color: 'var(--muted-slate)',
                      textTransform: 'uppercase',
                      fontSize: '0.7rem',
                      letterSpacing: '0.05em',
                      fontWeight: 700,
                    }}
                  >
                    <th style={{ padding: '0.75rem 1rem', width: '50px', textAlign: 'center' }}>No</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Aba-Aba & Rentang Nilai</th>
                    <th style={{ padding: '0.75rem 1rem', width: '160px' }}>Dewan Juri</th>
                    {!scoringLocked && (
                      <th style={{ padding: '0.75rem 1rem', width: '130px', textAlign: 'right' }}>Aksi</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedCriteria.map((crit, localIdx) => {
                    const globalIdx = startIndex + localIdx;
                    const assignedList = (crit.assignedJudges || [])
                      .map((id) => judges.find((j) => j.id === id))
                      .filter(Boolean);
                    const isEditing = editingId === crit.id;

                    return (
                      <tr
                        key={crit.id}
                        style={{
                          borderBottom: '1px solid var(--pub-line)',
                          backgroundColor: isEditing ? 'var(--pub-coral-pale)' : localIdx % 2 === 0 ? '#FFFFFF' : '#FBFBFA',
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        {/* No */}
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 700, color: 'var(--pub-navy)' }}>
                          {globalIdx + 1}
                        </td>

                        {/* Aba-Aba & Rentang Nilai */}
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--pub-ink)' }}>
                              {crit.name}
                            </span>
                            <span
                              style={{
                                fontSize: '0.675rem',
                                fontWeight: 600,
                                backgroundColor: crit.category === 'PBB Murni' ? '#E0F2FE' : '#FEF3C7',
                                color: crit.category === 'PBB Murni' ? '#0369A1' : '#B45309',
                                padding: '0.12rem 0.45rem',
                                borderRadius: '4px',
                              }}
                            >
                              {crit.category || 'PBB'}
                            </span>
                            {crit.isMandatory && (
                              <span
                                style={{
                                  fontSize: '0.65rem',
                                  fontWeight: 600,
                                  backgroundColor: 'var(--pub-teal-light)',
                                  color: 'var(--pub-teal)',
                                  padding: '0.12rem 0.4rem',
                                  borderRadius: '4px',
                                }}
                              >
                                Wajib
                              </span>
                            )}
                          </div>

                          {/* Subtitle Ringkas: Rentang Nilai */}
                          <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                            <span>
                              Rentang Nilai: <strong style={{ color: 'var(--pub-ink)' }} className="tabular-nums">{crit.minScore ?? 70} – {crit.maxScore ?? 100}</strong> (Step {crit.intervalStep ?? 5})
                            </span>
                            <span>•</span>
                            <span>Bobot: {crit.weight ?? 1.0}</span>
                          </div>
                        </td>

                        {/* Dewan Juri */}
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <UserCheck size={13} style={{ color: 'var(--pub-coral)', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--pub-ink)' }}>
                              {assignedList.length} Juri Penilai
                            </span>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--pub-muted)', marginTop: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                            {assignedList.length > 0
                              ? assignedList.map((j) => j.name.split(',')[0]).join(', ')
                              : '(Belum dicentang)'}
                          </div>
                        </td>

                        {/* Aksi */}
                        {!scoringLocked && (
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <button
                                type="button"
                                onClick={() => handleMoveOrder(globalIdx, 'up')}
                                disabled={globalIdx === 0}
                                className="pub-btn-outline"
                                style={{
                                  padding: '0.25rem',
                                  opacity: globalIdx === 0 ? 0.3 : 1,
                                  cursor: globalIdx === 0 ? 'not-allowed' : 'pointer',
                                }}
                                title="Geser Naik"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveOrder(globalIdx, 'down')}
                                disabled={globalIdx === criteria.length - 1}
                                className="pub-btn-outline"
                                style={{
                                  padding: '0.25rem',
                                  opacity: globalIdx === criteria.length - 1 ? 0.3 : 1,
                                  cursor: globalIdx === criteria.length - 1 ? 'not-allowed' : 'pointer',
                                }}
                                title="Geser Turun"
                              >
                                <ArrowDown size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStartEdit(crit)}
                                className="pub-btn-outline"
                                style={{ padding: '0.25rem 0.45rem', fontSize: '0.725rem' }}
                                title="Edit Aba-Aba"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCriteria(crit.id)}
                                className="pub-btn-outline"
                                style={{ padding: '0.25rem 0.45rem', color: 'var(--crimson)' }}
                                title="Hapus"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            {totalPages > 1 && (
              <div
                style={{
                  padding: '0.85rem 1.5rem',
                  backgroundColor: 'var(--pub-canvas)',
                  borderTop: '1px solid var(--pub-line)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  fontSize: '0.775rem',
                }}
              >
                <div style={{ color: 'var(--muted-slate)' }}>
                  Menampilkan <strong>{startIndex + 1}–{Math.min(startIndex + itemsPerPage, criteria.length)}</strong> dari <strong>{criteria.length}</strong> aba-aba
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="pub-btn-outline"
                    style={{
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.75rem',
                      opacity: currentPage === 1 ? 0.4 : 1,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    &larr; Sebelumnya
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        border: currentPage === pageNum ? '1px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                        backgroundColor: currentPage === pageNum ? 'var(--pub-coral)' : '#FFFFFF',
                        color: currentPage === pageNum ? '#FFFFFF' : 'var(--pub-ink)',
                        cursor: 'pointer',
                        minWidth: '32px',
                      }}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="pub-btn-outline"
                    style={{
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.75rem',
                      opacity: currentPage === totalPages ? 0.4 : 1,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Berikutnya &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* KOLOM KANAN: Live Simulator / Preview Tampilan Juri     */}
        {/* (Box dropdown filter telah dihapus sesuai instruksi user)*/}
        {/* ======================================================== */}
        <div
          style={{
            position: 'sticky',
            top: '1.5rem',
            backgroundColor: 'var(--pub-surface)',
            borderRadius: 'var(--pub-radius-card)',
            padding: '1.5rem',
            border: '1px solid var(--pub-line)',
            boxShadow: 'var(--pub-shadow-card)',
          }}
        >
          {/* Simulator Tablet Header Frame */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              paddingBottom: '0.85rem',
              borderBottom: '1px solid var(--pub-line)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Smartphone size={18} style={{ color: 'var(--pub-coral)' }} />
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.975rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                  Simulasi Live Lembar Juri
                </h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--pub-muted)' }}>
                  Preview responsif tablet dewan juri di lapangan
                </span>
              </div>
            </div>
            <span
              style={{
                backgroundColor: 'var(--pub-coral-pale)',
                color: 'var(--pub-coral-dark)',
                fontSize: '0.675rem',
                fontWeight: 700,
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
              }}
            >
              INTERAKTIF
            </span>
          </div>

          <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: '0 0 1rem 0', lineHeight: 1.45 }}>
            Klik salah satu tombol nilai di bawah ini untuk menguji kepraktisan pemilihan angka dan perhitungan skor peleton:
          </p>

          {/* Simulated Juri Score Sheet Content */}
          <div
            style={{
              backgroundColor: 'var(--pub-canvas)',
              borderRadius: '12px',
              padding: '1.15rem',
              border: '1px solid var(--pub-line)',
              maxHeight: '440px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {criteria.map((c) => (
              <div key={c.id} style={{ borderBottom: '1px solid var(--pub-line)', paddingBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.825rem', color: 'var(--pub-ink)' }}>
                      {c.name}
                    </span>
                    <span style={{ fontSize: '0.675rem', color: 'var(--pub-muted)', display: 'block' }}>
                      {c.category}
                    </span>
                  </div>
                  <span
                    className="tabular-nums"
                    style={{
                      fontWeight: 800,
                      color: 'var(--pub-coral)',
                      fontSize: '0.85rem',
                      backgroundColor: '#FFFFFF',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '4px',
                      border: '1px solid var(--pub-line)',
                    }}
                  >
                    {simulatedScores[c.id] ?? '-'}
                  </span>
                </div>

                {/* Simulated Touch Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {c.options.map((val) => {
                    const isSelected = simulatedScores[c.id] === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setSimulatedScores((prev) => ({ ...prev, [c.id]: val }))}
                        style={{
                          padding: '0.4rem 0.65rem',
                          fontSize: '0.825rem',
                          fontWeight: 700,
                          borderRadius: '8px',
                          border: isSelected ? '2px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                          backgroundColor: isSelected ? 'var(--pub-coral)' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : 'var(--pub-ink)',
                          cursor: 'pointer',
                          transition: 'all 0.1s ease',
                          minWidth: '42px',
                        }}
                        className="tabular-nums"
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Simulator Result Tally */}
          <div
            style={{
              marginTop: '1.15rem',
              padding: '1rem',
              backgroundColor: 'var(--pub-navy)',
              borderRadius: '12px',
              color: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>Total Nilai Simulasi:</span>
              <span className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FCD34D' }}>
                {totalSimulatedScore} Poin
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              <span>Rata-Rata Komponen:</span>
              <span className="tabular-nums" style={{ fontWeight: 600 }}>{avgSimulatedScore} / 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MODAL KONFIRMASI AKSI KRITIS (PRD UI/UX 8.6)          */}
      {/* ======================================================== */}
      {showLockModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              border: '1px solid var(--pub-line)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: scoringLocked ? 'var(--pub-teal-light)' : 'var(--crimson-light)',
                  color: scoringLocked ? 'var(--pub-teal)' : 'var(--crimson)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {scoringLocked ? <Unlock size={22} /> : <AlertTriangle size={22} />}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                  {scoringLocked ? 'Konfirmasi Buka Kunci Kriteria' : 'Kunci Kriteria Penilaian (Aksi Kritis)'}
                </h3>
                <span style={{ fontSize: '0.775rem', color: 'var(--pub-muted)' }}>
                  Regulasi Integritas & Kepatuhan Lomba LKBB
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--slate-text)', lineHeight: 1.5, marginBottom: '1rem' }}>
              {scoringLocked ? (
                <>
                  Membuka kunci kriteria akan mengembalikan konfigurasi ke mode draft. Pastikan dewan juri belum
                  memulai sesi penilaian peleton di lapangan agar integritas data penilaian tetap terjaga.
                </>
              ) : (
                <>
                  Apakah Anda yakin ingin <strong>mengunci seluruh kriteria penilaian</strong>?
                  <br /><br />
                  <strong>Dampak Aksi:</strong>
                  <ul style={{ paddingLeft: '1.25rem', marginTop: '0.35rem', fontSize: '0.825rem' }}>
                    <li>Formulir penilaian di tablet {judges.length} Juri akan disinkronkan ke <strong>{criteria.length} kriteria</strong> ini.</li>
                    <li>Jobdesk penilaian masing-masing juri (PBB, Variasi, Danton) dibekukan dan tidak dapat diubah di tengah lomba.</li>
                    <li>Sistem mencatat riwayat penguncian (Locked V1.0) demi asas transparansi dan keadilan lomba.</li>
                  </ul>
                </>
              )}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowLockModal(false)}
                className="pub-btn-outline"
                style={{ fontSize: '0.85rem' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleToggleLockConfirm}
                className={scoringLocked ? 'pub-btn-outline' : 'pub-btn-coral'}
                style={{ fontSize: '0.85rem', fontWeight: 700 }}
              >
                {scoringLocked ? 'Ya, Buka Kunci' : 'Ya, Kunci Kriteria Penilaian'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
