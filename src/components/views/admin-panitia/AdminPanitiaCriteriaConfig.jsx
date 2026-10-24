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
  Filter,
} from 'lucide-react';
import {
  STORAGE_KEY_JUDGES,
  DEFAULT_JUDGES,
  getStoredJudges,
} from './AdminPanitiaJudgesConfig';

export const STORAGE_KEY_CRITERIA = 'kompas_scoring_criteria';
export const STORAGE_KEY_SCORING_LOCKED = 'kompas_scoring_locked';

// 4 Kategori Resmi LKBB Paskibra sesuai permintaan
export const CATEGORY_OPTIONS = [
  'PBB',
  'VARIASI & FORMASI',
  'DANTON',
  'MAKE UP / KOSTUM',
];

// Normalisasi kategori lama/variasi teks agar selalu seragam ke 4 kategori resmi
export const normalizeCategory = (cat) => {
  if (!cat) return 'PBB';
  const upper = String(cat).toUpperCase().trim();
  if (upper === 'PBB' || upper.includes('PBB')) return 'PBB';
  if (upper.includes('VARIASI') || upper.includes('FORMASI')) return 'VARIASI & FORMASI';
  if (upper.includes('DANTON') || upper.includes('PELETON') || upper.includes('KOMANDAN')) return 'DANTON';
  if (upper.includes('KOSTUM') || upper.includes('MAKE UP') || upper.includes('MAKEUP') || upper.includes('KERAPIHAN')) return 'MAKE UP / KOSTUM';
  return 'PBB';
};

// Warna badge kategori yang harmonis dan elegan
export const getCategoryBadgeStyle = (cat) => {
  const norm = normalizeCategory(cat);
  switch (norm) {
    case 'PBB':
      return { backgroundColor: '#E0F2FE', color: '#0369A1', border: '1px solid #BAE6FD' };
    case 'VARIASI & FORMASI':
      return { backgroundColor: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A' };
    case 'DANTON':
      return { backgroundColor: '#EDE9FE', color: '#6D28D9', border: '1px solid #DDD6FE' };
    case 'MAKE UP / KOSTUM':
      return { backgroundColor: '#FCE7F3', color: '#BE185D', border: '1px solid #FBCFE8' };
    default:
      return { backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0' };
  }
};

export const DEFAULT_CRITERIA = [
  // 1. KATEGORI PBB (8 Aba-Aba Gerakan Baku)
  {
    id: 'c1',
    name: '1. Sikap Sempurna & Berhimpun',
    category: 'PBB',
    orderIndex: 1,
    minScore: 70,
    maxScore: 100,
    intervalStep: 5,
    weight: 1.0,
    isMandatory: true,
    options: [70, 75, 80, 85, 90, 95, 100],
    assignedJudges: ['juri-1', 'juri-2', 'juri-3'],
    description: 'Kerapihan tumit merapat, sudut kaki 45 derajat, dada membusung, pandangan lurus ke depan.',
  },
  {
    id: 'c2',
    name: '2. Penghormatan (Hormat Umum/Pembina)',
    category: 'PBB',
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
    category: 'PBB',
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
    category: 'PBB',
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
    category: 'PBB',
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
    category: 'PBB',
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
    name: '7. Balik Kanan & Jalan di Tempat',
    category: 'PBB',
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
    category: 'PBB',
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

  // 2. KATEGORI VARIASI & FORMASI (3 Rubrik)
  {
    id: 'c9',
    name: '9. Variasi Formasi Bentuk Simetris',
    category: 'VARIASI & FORMASI',
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
    name: '10. Variasi Dinamis & Harmonisasi Yel-Yel',
    category: 'VARIASI & FORMASI',
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
    name: '11. Tingkat Kesulitan & Kreativitas Gerakan',
    category: 'VARIASI & FORMASI',
    orderIndex: 11,
    minScore: 70,
    maxScore: 100,
    intervalStep: 5,
    weight: 1.0,
    isMandatory: true,
    options: [70, 75, 80, 85, 90, 95, 100],
    assignedJudges: ['juri-4', 'juri-5'],
    description: 'Kecepatan perpindahan pola lantai, keselarasan ketukan irama, dan orisinalitas ide.',
  },

  // 3. KATEGORI DANTON (2 Rubrik)
  {
    id: 'c12',
    name: '12. Artikulasi & Intonasi Danton',
    category: 'DANTON',
    orderIndex: 12,
    minScore: 70,
    maxScore: 100,
    intervalStep: 5,
    weight: 1.0,
    isMandatory: true,
    options: [70, 75, 80, 85, 90, 95, 100],
    assignedJudges: ['juri-1'],
    description: 'Kejelasan vokal petunjuk & peringatan, ketegasan sikap komando di kotak danton.',
  },
  {
    id: 'c13',
    name: '13. Sikap Komando & Penguasaan Lapangan',
    category: 'DANTON',
    orderIndex: 13,
    minScore: 70,
    maxScore: 100,
    intervalStep: 5,
    weight: 1.0,
    isMandatory: true,
    options: [70, 75, 80, 85, 90, 95, 100],
    assignedJudges: ['juri-1'],
    description: 'Ketenangan saat memimpin, pandangan mata tegak, presisi aba-aba peringatan dan pelaksanaan.',
  },

  // 4. KATEGORI MAKE UP / KOSTUM (2 Rubrik)
  {
    id: 'c14',
    name: '14. Kerapihan Seragam, Atribut & Tutup Kepala',
    category: 'MAKE UP / KOSTUM',
    orderIndex: 14,
    minScore: 70,
    maxScore: 100,
    intervalStep: 5,
    weight: 1.0,
    isMandatory: true,
    options: [70, 75, 80, 85, 90, 95, 100],
    assignedJudges: ['juri-5'],
    description: 'Kesesuaian pemakaian pet/baret, kelurusan dasi/scarf, pin lencana, sabuk gesper, dan tali peluit.',
  },
  {
    id: 'c15',
    name: '15. Estetika Tata Rias Wajah & Keserasian Pasukan',
    category: 'MAKE UP / KOSTUM',
    orderIndex: 15,
    minScore: 70,
    maxScore: 100,
    intervalStep: 5,
    weight: 1.0,
    isMandatory: true,
    options: [70, 75, 80, 85, 90, 95, 100],
    assignedJudges: ['juri-5'],
    description: 'Keserasian make up panggung, ketahanan rias dari keringat, kebersihan sepatu, dan kerapihan rambut/jilbab.',
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

  // 2. Criteria List State with category normalization
  const [criteria, setCriteria] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CRITERIA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize existing items
          const normalized = parsed.map((c, i) => ({
            ...c,
            category: normalizeCategory(c.category),
            assignedJudges: c.assignedJudges || ['juri-1', 'juri-2', 'juri-3'],
          }));

          // Pastikan kategori MAKE UP / KOSTUM memiliki data default jika sebelumnya belum ada
          const hasMakeup = normalized.some((c) => normalizeCategory(c.category) === 'MAKE UP / KOSTUM');
          if (!hasMakeup) {
            const makeupDefaults = DEFAULT_CRITERIA.filter((c) => c.category === 'MAKE UP / KOSTUM');
            return [...normalized, ...makeupDefaults];
          }
          return normalized;
        }
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
    category: 'PBB', // Default kategori aktif
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

  // 4. Filter Kategori Aktif: Didorong langsung oleh pilihan dropdown form (formData.category)
  const activeCategory = normalizeCategory(formData.category || 'PBB');

  // Filter daftar rubrik dan preview simulasi lembar juri sesuai dropdown kategori yang dipilih
  const filteredCriteria = criteria.filter(
    (c) => normalizeCategory(c.category) === activeCategory
  );

  // 5. Pagination State (10 items per page untuk kategori aktif)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredCriteria.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCriteria = filteredCriteria.slice(startIndex, startIndex + itemsPerPage);

  // 6. Simulator Scores State
  const [simulatedScores, setSimulatedScores] = useState({});

  // 7. Critical Lock Confirmation Modal State
  const [showLockModal, setShowLockModal] = useState(false);

  // 8. Toast Feedback State
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
    const pbbIds = judges.filter((j) => normalizeCategory(j.category) === 'PBB').map((j) => j.id);
    setFormData((prev) => ({
      ...prev,
      assignedJudges: pbbIds.length > 0 ? pbbIds : ['juri-1', 'juri-2', 'juri-3'],
    }));
  };

  const handleSelectVariasiJudges = () => {
    const varIds = judges.filter((j) => normalizeCategory(j.category) === 'VARIASI & FORMASI').map((j) => j.id);
    setFormData((prev) => ({
      ...prev,
      assignedJudges: varIds.length > 0 ? varIds : ['juri-4', 'juri-5'],
    }));
  };

  const handleClearJudges = () => {
    setFormData((prev) => ({
      ...prev,
      assignedJudges: [],
    }));
  };

  // Auto-suggest judges and update view when category dropdown changes
  const handleCategoryChange = (newCatRaw) => {
    const newCat = normalizeCategory(newCatRaw);
    let suggested = [];

    if (newCat === 'PBB') {
      suggested = judges.filter((j) => normalizeCategory(j.category) === 'PBB').map((j) => j.id);
      if (suggested.length === 0) suggested = ['juri-1', 'juri-2', 'juri-3'];
    } else if (newCat === 'VARIASI & FORMASI') {
      suggested = judges.filter((j) => normalizeCategory(j.category) === 'VARIASI & FORMASI').map((j) => j.id);
      if (suggested.length === 0) suggested = ['juri-4', 'juri-5'];
    } else if (newCat === 'DANTON') {
      suggested = [judges[0]?.id || 'juri-1'];
    } else if (newCat === 'MAKE UP / KOSTUM') {
      suggested = judges.filter((j) => (j.specialties || []).some(s => s.toLowerCase().includes('kostum')) || j.id === 'juri-5').map((j) => j.id);
      if (suggested.length === 0) suggested = ['juri-5'];
    } else {
      suggested = judges.map((j) => j.id);
    }

    setFormData((prev) => ({
      ...prev,
      category: newCat,
      assignedJudges: suggested.length > 0 ? suggested : prev.assignedJudges,
    }));

    // Reset pagination ke halaman 1 agar daftar rubrik langsung tampil rapi
    setCurrentPage(1);
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

    const targetCategory = normalizeCategory(formData.category);

    if (editingId) {
      const updated = criteria.map((c) =>
        c.id === editingId
          ? {
              ...c,
              ...formData,
              category: targetCategory,
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
        category: targetCategory,
        orderIndex: criteria.length + 1,
        options: [...formData.options],
        assignedJudges: [...(formData.assignedJudges || [])],
      };
      const updated = [...criteria, newCrit];
      setCriteria(updated);
      localStorage.setItem(STORAGE_KEY_CRITERIA, JSON.stringify(updated));
      setSaveFeedback(`Aba-aba "${newCrit.name}" berhasil ditambahkan ke kategori ${targetCategory}.`);
    }

    // Reset Form namun pertahankan kategori aktif
    setFormData((prev) => ({
      name: '',
      category: targetCategory,
      minScore: 70,
      maxScore: 100,
      intervalStep: 5,
      weight: 1.0,
      isMandatory: true,
      description: '',
      options: [70, 75, 80, 85, 90, 95, 100],
      assignedJudges: prev.assignedJudges,
    }));
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  // Start Editing Criteria
  const handleStartEdit = (crit) => {
    if (scoringLocked) return;
    const critCat = normalizeCategory(crit.category);
    setEditingId(crit.id);
    setFormData({
      name: crit.name,
      category: critCat,
      minScore: crit.minScore,
      maxScore: crit.maxScore,
      intervalStep: crit.intervalStep || 5,
      weight: crit.weight || 1.0,
      isMandatory: crit.isMandatory !== false,
      description: crit.description || '',
      options: [...(crit.options || [70, 75, 80, 85, 90, 95, 100])],
      assignedJudges: [...(crit.assignedJudges || ['juri-1'])],
    });
    setCurrentPage(1);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData((prev) => ({
      name: '',
      category: prev.category,
      minScore: 70,
      maxScore: 100,
      intervalStep: 5,
      weight: 1.0,
      isMandatory: true,
      description: '',
      options: [70, 75, 80, 85, 90, 95, 100],
      assignedJudges: prev.assignedJudges,
    }));
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

    // Recalculate pagination for active category
    const remainingInCat = updated.filter(
      (c) => normalizeCategory(c.category) === activeCategory
    );
    const newTotalPages = Math.ceil(remainingInCat.length / itemsPerPage) || 1;
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }

    setSaveFeedback(`Aba-aba berhasil dihapus.`);
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  // Reorder Criteria within Active Category
  const handleMoveOrder = (critId, direction) => {
    if (scoringLocked) return;
    const catItems = criteria.filter((c) => normalizeCategory(c.category) === activeCategory);
    const currCatIdx = catItems.findIndex((c) => c.id === critId);
    if (currCatIdx === -1) return;

    const targetCatIdx = direction === 'up' ? currCatIdx - 1 : currCatIdx + 1;
    if (targetCatIdx < 0 || targetCatIdx >= catItems.length) return;

    const targetId = catItems[targetCatIdx].id;

    const globalIdx1 = criteria.findIndex((c) => c.id === critId);
    const globalIdx2 = criteria.findIndex((c) => c.id === targetId);

    const newArr = [...criteria];
    const temp = newArr[globalIdx1];
    newArr[globalIdx1] = newArr[globalIdx2];
    newArr[globalIdx2] = temp;

    const reordered = newArr.map((c, i) => ({ ...c, orderIndex: i + 1 }));
    setCriteria(reordered);
    localStorage.setItem(STORAGE_KEY_CRITERIA, JSON.stringify(reordered));
  };

  // Reset to default LKBB criteria template
  const handleResetDefaults = () => {
    if (scoringLocked) return;
    if (!window.confirm('Muat rubrik standar resmi LKBB (15 aba-aba lengkap: PBB, Variasi & Formasi, Danton, Make Up / Kostum)?')) return;

    setCriteria(DEFAULT_CRITERIA);
    localStorage.setItem(STORAGE_KEY_CRITERIA, JSON.stringify(DEFAULT_CRITERIA));
    setCurrentPage(1);
    handleCancelEdit();
    setSaveFeedback('Rubrik standar resmi LKBB berhasil dimuat.');
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

  // Total and average score for the active category simulator
  const totalSimulatedScore = filteredCriteria.reduce((acc, c) => {
    return acc + (parseFloat(simulatedScores[c.id]) || 0);
  }, 0);

  const avgSimulatedScore =
    filteredCriteria.length > 0 ? (totalSimulatedScore / filteredCriteria.length).toFixed(1) : 0;

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
              Total: {criteria.length} Komponen Terkonfigurasi ({filteredCriteria.length} di Kategori {activeCategory})
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
            Pilih kategori penilaian pada form untuk mengelola daftar rubrik dan preview lembar juri secara real-time.
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
                title="Gunakan template resmi LKBB Paskibra lengkap 4 kategori"
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

      {/* Category Quick Filter Pill Tabs (Sinkron dengan Dropdown Form & Tampilan) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          backgroundColor: 'var(--pub-surface)',
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          border: '1px solid var(--pub-line)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--pub-muted)', marginRight: '0.25rem' }}>
          <Filter size={14} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Kategori Penilaian:
          </span>
        </div>

        {CATEGORY_OPTIONS.map((cat) => {
          const isSelected = activeCategory === cat;
          const count = criteria.filter((c) => normalizeCategory(c.category) === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: isSelected ? 800 : 600,
                border: isSelected ? '1.5px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                backgroundColor: isSelected ? 'var(--pub-coral)' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : 'var(--pub-ink)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{cat}</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.45rem',
                  borderRadius: '12px',
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : 'var(--pub-sand)',
                  color: isSelected ? '#FFFFFF' : 'var(--pub-navy)',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

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
                {/* 1. Input Nama & Kategori Dropdown (HANYA 4 OPSI SESUAI PERMINTAAN USER) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.1fr', gap: '0.75rem' }}>
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
                      Kategori Penilaian <span style={{ color: 'var(--pub-coral)', fontSize: '0.7rem' }}>● Mengubah Tampilan</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.85rem',
                        borderRadius: '8px',
                        border: '1.5px solid var(--pub-coral)',
                        backgroundColor: '#FFFFFF',
                        color: 'var(--pub-ink)',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <option value="PBB">PBB</option>
                      <option value="VARIASI & FORMASI">VARIASI & FORMASI</option>
                      <option value="DANTON">DANTON</option>
                      <option value="MAKE UP / KOSTUM">MAKE UP / KOSTUM</option>
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
                      Generator Rentang Nilai Dinamis
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
                        Centang dewan juri yang di tabletnya akan muncul aba-aba kategori <strong>{activeCategory}</strong> ini:
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
                      const isPbb = normalizeCategory(j.category) === 'PBB';

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
                    <span>{editingId ? 'Simpan Perubahan Aba-Aba' : `Tambahkan Aba-Aba ke ${activeCategory}`}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* B. TABEL RUBRIK ABA-ABA TERFILTER SESUAI DROPDOWN KATEGORI */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--pub-ink)', margin: 0 }}>
                    Daftar Rubrik Aba-Aba ({filteredCriteria.length} Komponen)
                  </h3>
                  <span
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.55rem',
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      ...getCategoryBadgeStyle(activeCategory),
                    }}
                  >
                    {activeCategory}
                  </span>
                </div>
                <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: 0 }}>
                  Menampilkan daftar rubrik untuk kategori <strong>{activeCategory}</strong> (sinkron dengan pilihan dropdown form).
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
                  {paginatedCriteria.length > 0 ? (
                    paginatedCriteria.map((crit, localIdx) => {
                      const displayNo = startIndex + localIdx + 1;
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
                            {displayNo}
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
                                  fontWeight: 700,
                                  padding: '0.12rem 0.45rem',
                                  borderRadius: '4px',
                                  ...getCategoryBadgeStyle(crit.category),
                                }}
                              >
                                {normalizeCategory(crit.category)}
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
                              {crit.description && (
                                <>
                                  <span>•</span>
                                  <span style={{ fontStyle: 'italic', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {crit.description}
                                  </span>
                                </>
                              )}
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
                                  onClick={() => handleMoveOrder(crit.id, 'up')}
                                  disabled={localIdx === 0 && currentPage === 1}
                                  className="pub-btn-outline"
                                  style={{
                                    padding: '0.25rem',
                                    opacity: localIdx === 0 && currentPage === 1 ? 0.3 : 1,
                                    cursor: localIdx === 0 && currentPage === 1 ? 'not-allowed' : 'pointer',
                                  }}
                                  title="Geser Naik dalam Kategori"
                                >
                                  <ArrowUp size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveOrder(crit.id, 'down')}
                                  disabled={localIdx === paginatedCriteria.length - 1 && currentPage === totalPages}
                                  className="pub-btn-outline"
                                  style={{
                                    padding: '0.25rem',
                                    opacity: localIdx === paginatedCriteria.length - 1 && currentPage === totalPages ? 0.3 : 1,
                                    cursor: localIdx === paginatedCriteria.length - 1 && currentPage === totalPages ? 'not-allowed' : 'pointer',
                                  }}
                                  title="Geser Turun dalam Kategori"
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
                    })
                  ) : (
                    <tr>
                      <td colSpan={scoringLocked ? 3 : 4} style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--pub-muted)' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                          Belum ada aba-aba untuk kategori {activeCategory}
                        </div>
                        <div style={{ fontSize: '0.8rem' }}>
                          Gunakan form di atas untuk menambahkan aba-aba baru ke kategori <strong>{activeCategory}</strong> atau klik Preset Standar LKBB.
                        </div>
                      </td>
                    </tr>
                  )}
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
                  Menampilkan <strong>{startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredCriteria.length)}</strong> dari <strong>{filteredCriteria.length}</strong> aba-aba ({activeCategory})
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
                      className="pub-btn-outline"
                      style={{
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.75rem',
                        fontWeight: currentPage === pageNum ? 700 : 500,
                        backgroundColor: currentPage === pageNum ? 'var(--pub-coral)' : '#FFFFFF',
                        color: currentPage === pageNum ? '#FFFFFF' : 'var(--pub-ink)',
                        borderColor: currentPage === pageNum ? 'var(--pub-coral)' : 'var(--pub-line)',
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
        {/* TERFILTER SESUAI DROPDOWN KATEGORI YANG SEDANG DIPILIH   */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.975rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                    Simulasi Live Lembar Juri
                  </h3>
                  <span
                    style={{
                      fontSize: '0.675rem',
                      fontWeight: 700,
                      padding: '0.12rem 0.45rem',
                      borderRadius: '4px',
                      ...getCategoryBadgeStyle(activeCategory),
                    }}
                  >
                    {activeCategory}
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--pub-muted)' }}>
                  Preview lembar nilai juri untuk kategori {activeCategory} ({filteredCriteria.length} item)
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
            Klik salah satu tombol nilai di bawah ini untuk menguji kepraktisan pemilihan angka juri pada kategori <strong>{activeCategory}</strong>:
          </p>

          {/* Simulated Juri Score Sheet Content (Hanya menampilkan kategori yang dipilih) */}
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
            {filteredCriteria.length > 0 ? (
              filteredCriteria.map((c) => (
                <div key={c.id} style={{ borderBottom: '1px solid var(--pub-line)', paddingBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.825rem', color: 'var(--pub-ink)' }}>
                        {c.name}
                      </span>
                      <span style={{ fontSize: '0.675rem', color: 'var(--pub-muted)', display: 'block', marginTop: '0.1rem' }}>
                        {c.category} · {c.assignedJudges?.length || 0} Juri Ditugaskan
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
              ))
            ) : (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--pub-muted)' }}>
                <p style={{ fontSize: '0.825rem', margin: 0 }}>
                  Belum ada kriteria nilai untuk kategori <strong>{activeCategory}</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Simulator Result Tally (Dihitung khusus kategori yang sedang aktif) */}
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
              <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Total Nilai Simulasi ({activeCategory}):
              </span>
              <span className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FCD34D' }}>
                {totalSimulatedScore} Poin
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              <span>Rata-Rata Komponen ({activeCategory}):</span>
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
                    <li>Jobdesk penilaian masing-masing juri (PBB, Variasi & Formasi, Danton, Make Up / Kostum) dibekukan dan tidak dapat diubah di tengah lomba.</li>
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
