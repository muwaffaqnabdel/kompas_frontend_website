import React, { useState, useEffect } from 'react';
import {
  Award,
  Filter,
  CheckCircle,
  Clock,
  Lock,
  Unlock,
  Play,
  RotateCcw,
  Sparkles,
  Users,
  Eye,
  UserCheck,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import JuriStepScoring from './juri/JuriStepScoring';
import JuriVoiceNoteStep from './juri/JuriVoiceNoteStep';
import { getStoredJudges } from './admin-panitia/AdminPanitiaJudgesConfig';

// 4 Jenjang Resmi Perlombaan LKBB (SD, SMP, SMA, PURNA)
export const JENJANG_OPTIONS = [
  { id: 'SD', label: 'Tingkat SD / MI', schedule: 'Hari Jumat (Sesi Pagi & Siang)' },
  { id: 'SMP', label: 'Tingkat SMP / MTs', schedule: 'Hari Sabtu (Sesi Pagi)' },
  { id: 'SMA', label: 'Tingkat SMA / SMK / MA', schedule: 'Hari Sabtu (Sesi Siang & Sore)' },
  { id: 'PURNA', label: 'Tingkat Purna / Umum', schedule: 'Hari Minggu (Sesi Puncak)' },
];

// Data Awal Peserta Lengkap untuk 4 Jenjang
const INITIAL_PARTICIPANTS_BY_LEVEL = [
  // 1. TINGKAT SD / MI (Jumat)
  {
    id: 'sd-01',
    level: 'SD',
    orderNumber: '01',
    school: 'SDN Menteng 01 Jakarta',
    teamName: 'Paskibra Cilik Nusantara',
    danton: 'Bagas Pratama',
    members: 16,
    currentPos: 'POS 04',
    posLabel: 'Pos 04 — Arena Tampil Utama',
    isScored: false,
    scoreData: null,
    totalScore: null,
  },
  {
    id: 'sd-02',
    level: 'SD',
    orderNumber: '02',
    school: 'SDI Al-Azhar Kelapa Gading',
    teamName: 'Pasukan Bintang Cilik',
    danton: 'Rafka Arkananta',
    members: 16,
    currentPos: 'POS 03',
    posLabel: 'Pos 03 — Ruang Warm Up',
    isScored: false,
    scoreData: null,
    totalScore: null,
  },
  {
    id: 'sd-03',
    level: 'SD',
    orderNumber: '03',
    school: 'SDN Sukasari 1 Bogor',
    teamName: 'Paskibra Tunas Bangsa',
    danton: 'Alvaro Putra',
    members: 16,
    currentPos: 'POS 02',
    posLabel: 'Pos 02 — Sesi Photoshoot',
    isScored: false,
    scoreData: null,
    totalScore: null,
  },
  {
    id: 'sd-04',
    level: 'SD',
    orderNumber: '04',
    school: 'SDIT Nurul Fikri Depok',
    teamName: 'Laskar Cilik Merah Putih',
    danton: 'Zahra Amelia',
    members: 16,
    currentPos: 'POS 01',
    posLabel: 'Pos 01 — Verifikasi Berkas',
    isScored: false,
    scoreData: null,
    totalScore: null,
  },

  // 2. TINGKAT SMP / MTs (Sabtu Pagi)
  {
    id: 'smp-01',
    level: 'SMP',
    orderNumber: '01',
    school: 'SMPN 1 Bogor',
    teamName: 'Paskibra Satria Muda',
    danton: 'Dimas Aditya',
    members: 16,
    currentPos: 'POS 04',
    posLabel: 'Pos 04 — Arena Tampil Utama',
    isScored: false,
    scoreData: null,
    totalScore: null,
  },
  {
    id: 'smp-02',
    level: 'SMP',
    orderNumber: '02',
    school: 'SMPN 115 Jakarta',
    teamName: 'Brigade Ksatria 115',
    danton: 'Gilang Ramadhan',
    members: 16,
    currentPos: 'POS 03',
    posLabel: 'Pos 03 — Ruang Warm Up',
    isScored: false,
    scoreData: null,
    totalScore: null,
  },
  {
    id: 'smp-03',
    level: 'SMP',
    orderNumber: '03',
    school: 'MTsN 1 Tangerang Selatan',
    teamName: 'Pasukan Gema Islam',
    danton: 'Faisal Akbar',
    members: 16,
    currentPos: 'POS 02',
    posLabel: 'Pos 02 — Sesi Photoshoot',
    isScored: false,
    scoreData: null,
    totalScore: null,
  },
  {
    id: 'smp-04',
    level: 'SMP',
    orderNumber: '04',
    school: 'SMP Labschool Rawamangun',
    teamName: 'Paskibra Taruna Muda',
    danton: 'Rizky Fadillah',
    members: 16,
    currentPos: 'POS 01',
    posLabel: 'Pos 01 — Verifikasi Berkas',
    isScored: false,
    scoreData: null,
    totalScore: null,
  },

  // 3. TINGKAT SMA / SMK / MA (Sabtu Siang - Demo Default Utama)
  {
    id: 'sma-01',
    level: 'SMA',
    orderNumber: '01',
    school: 'SMAN 1 Jakarta',
    teamName: 'PASKIBRA GARUDA SAKTI',
    danton: 'Fakhri Pratama Yudha',
    members: 16,
    currentPos: 'POS 04',
    posLabel: 'Pos 04 — Arena Tampil Utama',
    isScored: false,
    scoreData: null,
    totalScore: null,
  },
  {
    id: 'sma-02',
    level: 'SMA',
    orderNumber: '02',
    school: 'SMAN 3 Bandung',
    teamName: 'PASKIBRA DWI WARNA',
    danton: 'Ahmad Faisal',
    members: 16,
    currentPos: 'POS 03',
    posLabel: 'Pos 03 — Ruang Warm Up',
    isScored: false,
    scoreData: null,
    totalScore: null,
  },
  {
    id: 'sma-03',
    level: 'SMA',
    orderNumber: '03',
    school: 'SMKN 2 Bogor',
    teamName: 'PASKIBRA KSATRIA PANDAWA',
    danton: 'M. Rizky Pratama',
    members: 16,
    currentPos: 'POS 02',
    posLabel: 'Pos 02 — Sesi Photoshoot',
    isScored: false,
    scoreData: null,
    totalScore: null,
  },
  {
    id: 'sma-04',
    level: 'SMA',
    orderNumber: '04',
    school: 'SMAN 5 Depok',
    teamName: 'PASKIBRA SATYA BHAKTI',
    danton: 'Bramantyo Wicaksono',
    members: 16,
    currentPos: 'POS 01',
    posLabel: 'Pos 01 — Verifikasi Berkas',
    isScored: false,
    scoreData: null,
    totalScore: null,
  },
  {
    id: 'sma-05',
    level: 'SMA',
    orderNumber: '05',
    school: 'SMAN 1 Slawi',
    teamName: 'PASKIBRA WIJAYA KUSUMA',
    danton: 'Arya Putra Dewa',
    members: 16,
    currentPos: 'POS 01',
    posLabel: 'Pos 01 — Verifikasi Berkas',
    isScored: false,
    scoreData: null,
    totalScore: null,
  },

  // 4. TINGKAT PURNA / UMUM (Minggu)
  {
    id: 'purna-01',
    level: 'PURNA',
    orderNumber: '01',
    school: 'PPI Kota Bandung',
    teamName: 'Purna Bhakti Kencana',
    danton: 'Kapten Aris Budiman',
    members: 16,
    currentPos: 'POS 04',
    posLabel: 'Pos 04 — Arena Tampil Utama',
    isScored: false,
    scoreData: null,
    totalScore: null,
  },
  {
    id: 'purna-02',
    level: 'PURNA',
    orderNumber: '02',
    school: 'PPI Jakarta Pusat',
    teamName: 'Satria Ganesha',
    danton: 'Heru Kurniawan',
    members: 16,
    currentPos: 'POS 03',
    posLabel: 'Pos 03 — Ruang Warm Up',
    isScored: false,
    scoreData: null,
    totalScore: null,
  },
  {
    id: 'purna-03',
    level: 'PURNA',
    orderNumber: '03',
    school: 'Resimen Mahasiswa UI',
    teamName: 'Garuda Mahardika',
    danton: 'Dwi Cahyono',
    members: 16,
    currentPos: 'POS 02',
    posLabel: 'Pos 02 — Sesi Photoshoot',
    isScored: false,
    scoreData: null,
    totalScore: null,
  },
];

// 10 Aba-Aba Baku Standar LKBB Paskibra dengan opsi nilai 8-22 (sesuai gambar user)
export const DEFAULT_ABA_ABA_LIST = [
  {
    id: 'aba-1',
    orderIndex: 1,
    name: '01. Sikap Sempurna & Kerapihan Saf',
    desc: 'Tumit merapat, sudut kaki 45 derajat, dada membusung tegap, pandangan lurus.',
    options: [8, 10, 12, 14, 16, 18, 20, 22],
  },
  {
    id: 'aba-2',
    orderIndex: 2,
    name: '02. Penghormatan Umum / Pembina',
    desc: 'Sudut tangan 15 derajat, telapak lurus, ujung jari manis tepat di pelipis atau sudut pet.',
    options: [8, 10, 12, 14, 16, 18, 20, 22],
  },
  {
    id: 'aba-3',
    orderIndex: 3,
    name: '03. Lencang Kanan & Setengah Lengan',
    desc: 'Kelurusan saf, ketepatan jarak kepalan tangan di pinggang kawan, pandangan menengok 45° serempak.',
    options: [8, 10, 12, 14, 16, 18, 20, 22],
  },
  {
    id: 'aba-4',
    orderIndex: 4,
    name: '04. Berhitung Saf & Banjar',
    desc: 'Kenyaringan suara angka, kesigapan menoleh serentak, kesigapan saf terdepan dan banjar kanan.',
    options: [8, 10, 12, 14, 16, 18, 20, 22],
  },
  {
    id: 'aba-5',
    orderIndex: 5,
    name: '05. Hadap Kanan & Hadap Kiri',
    desc: 'Poros tumit kokoh, ketepatan sudut putar 90 derajat, hentakan penutup kaki tegas tanpa goyang.',
    options: [8, 10, 12, 14, 16, 18, 20, 22],
  },
  {
    id: 'aba-6',
    orderIndex: 6,
    name: '06. Hadap Serong Kanan & Serong Kiri',
    desc: 'Ketepatan sudut 45 derajat, kestabilan badan tegak, kerapihan tangan tetap lurus menempel paha.',
    options: [8, 10, 12, 14, 16, 18, 20, 22],
  },
  {
    id: 'aba-7',
    orderIndex: 7,
    name: '07. Balik Kanan & Kerapihan Kaki',
    desc: 'Putaran 180 derajat sempurna melalui kanan, keseimbangan tubuh pasukan, keseragaman penutupan tumit.',
    options: [8, 10, 12, 14, 16, 18, 20, 22],
  },
  {
    id: 'aba-8',
    orderIndex: 8,
    name: '08. Jalan di Tempat',
    desc: 'Paha terangkat rata-rata air (90 derajat), ujung kaki condong ke bawah, tempo ketukan seragam.',
    options: [8, 10, 12, 14, 16, 18, 20, 22],
  },
  {
    id: 'aba-9',
    orderIndex: 9,
    name: '09. Langkah Tegap & Hormat Kanan',
    desc: 'Tempo langkah 120 bpm, panjang langkah 65cm, ayunan tangan depan 90° dan belakang 30°, hentakan berwibawa.',
    options: [8, 10, 12, 14, 16, 18, 20, 22],
  },
  {
    id: 'aba-10',
    orderIndex: 10,
    name: '10. Langkah Biasa ke Langkah Perlahan',
    desc: 'Harmonisasi transisi ketukan langkah lambat, kelurusan banjar saat tempo diperlambat.',
    options: [8, 10, 12, 14, 16, 18, 20, 22],
  },
];

const STORAGE_KEY_JURI_PARTICIPANTS = 'kompas_juri_participants_flow_v1';

export default function JuriView() {
  const judges = getStoredJudges();
  const [activeJudgeId, setActiveJudgeId] = useState(() => judges[0]?.id || 'juri-1');

  const activeJudge = judges.find((j) => j.id === activeJudgeId) || judges[0] || {
    id: 'juri-1',
    name: 'Kolonel (Purn) Bambang S., M.Pd',
    category: 'PBB Murni',
    role: 'Ketua Dewan Juri',
  };

  // State Utama Alur Juri:
  // 'LIST' (Tampilan Awal Daftar Peserta + Filter Jenjang)
  // 'SCORING' (Step-by-Step Per Aba-Aba)
  // 'VOICE_FEEDBACK' (AI Voice Note Feedback & Submit Final)
  const [viewStep, setViewStep] = useState('LIST');

  // Filter Kategori Jenjang (SD / SMP / SMA / PURNA)
  const [selectedLevel, setSelectedLevel] = useState('SMA');

  // Data Peserta (Disimpan di state & localStorage agar progres demo persisten)
  const [participants, setParticipants] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_JURI_PARTICIPANTS);
      return saved ? JSON.parse(saved) : INITIAL_PARTICIPANTS_BY_LEVEL;
    } catch {
      return INITIAL_PARTICIPANTS_BY_LEVEL;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_JURI_PARTICIPANTS, JSON.stringify(participants));
    } catch (e) {
      console.warn('Failed to save juri participants:', e);
    }
  }, [participants]);

  // Pasukan yang sedang aktif dinilai saat ini
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Nilai sementara aba-aba untuk pasukan yang dipilih
  const [currentScores, setCurrentScores] = useState({});

  // Feedback tersimpan untuk pasukan yang dipilih
  const [savedFeedback, setSavedFeedback] = useState('');

  // Toast pemberitahuan ringkas
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // Filter peserta berdasarkan Jenjang yang dipilih di Dropdown
  const filteredParticipants = participants.filter((p) => p.level === selectedLevel);
  const currentSchedule = JENJANG_OPTIONS.find((j) => j.id === selectedLevel)?.schedule || '';

  // 1. KLIK TOMBOL "MULAI PENILAIAN" (HANYA BISA DIKLIK JIKA DI POS 04)
  const handleStartScoring = (team) => {
    if (team.currentPos !== 'POS 04') {
      showToast(`⚠️ Pasukan ${team.school} belum masuk ke Arena Lapangan (Masih di ${team.posLabel})!`);
      return;
    }
    setSelectedTeam(team);
    setCurrentScores(team.scoreData?.scores || {});
    setViewStep('SCORING');
  };

  // 2. SUBMIT NILAI DARI STEP SCORING -> MASUK KE STEP VOICE FEEDBACK
  const handleAbaAbaScoresSubmitted = (scoresObj) => {
    setCurrentScores(scoresObj);
    setViewStep('VOICE_FEEDBACK');
  };

  // 3. SELESAI KIRIM AI FEEDBACK -> SIMPAN & OTOMATIS KEMBALI KE TAMPILAN AWAL
  const handleVoiceFeedbackFinished = (finalFeedbackText) => {
    if (!selectedTeam) return;

    const totalCalculated = Object.values(currentScores).reduce((sum, v) => sum + (Number(v) || 0), 0);

    // Update status peserta menjadi 'SELESAI DINILAI'
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === selectedTeam.id) {
          return {
            ...p,
            isScored: true,
            totalScore: totalCalculated,
            scoreData: {
              scores: currentScores,
              feedback: finalFeedbackText,
              scoredAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              judgeName: activeJudge.name,
            },
          };
        }
        return p;
      })
    );

    showToast(`✓ Berhasil! Nilai & AI Feedback untuk ${selectedTeam.school} telah resmi tersimpan.`);
    setViewStep('LIST');
    setSelectedTeam(null);
    setCurrentScores({});
  };

  // 4. SIMULATOR LAPANGAN: Geser Tim ke POS 04 untuk membuka kunci penilaian saat demo
  const handleSimulateMoveToPos4 = (teamId) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === teamId) {
          return {
            ...p,
            currentPos: 'POS 04',
            posLabel: 'Pos 04 — Arena Tampil Utama',
            isScored: false,
          };
        }
        return p;
      })
    );
    const targetTeam = participants.find((p) => p.id === teamId);
    showToast(`⚡ Pasukan ${targetTeam?.school || ''} telah didorong masuk ke POS 04 (Arena Lapangan)! Status Penilaian Terbuka.`);
  };

  // Reset demo data jika panitia ingin refresh ulang
  const handleResetData = () => {
    setParticipants(INITIAL_PARTICIPANTS_BY_LEVEL);
    showToast('Data demo juri telah direset ke kondisi awal.');
  };

  // ==========================================
  // JIKA SEDANG DI STEP 2: PENILAIAN PER ABA-ABA
  // ==========================================
  if (viewStep === 'SCORING' && selectedTeam) {
    return (
      <JuriStepScoring
        team={selectedTeam}
        judge={activeJudge}
        abaAbaList={DEFAULT_ABA_ABA_LIST}
        initialScores={currentScores}
        onSubmitScores={handleAbaAbaScoresSubmitted}
        onCancel={() => setViewStep('LIST')}
      />
    );
  }

  // ==========================================
  // JIKA SEDANG DI STEP 3: AI VOICE NOTE FEEDBACK
  // ==========================================
  if (viewStep === 'VOICE_FEEDBACK' && selectedTeam) {
    return (
      <JuriVoiceNoteStep
        team={selectedTeam}
        judge={activeJudge}
        scores={currentScores}
        abaAbaList={DEFAULT_ABA_ABA_LIST}
        onBackToScoring={() => setViewStep('SCORING')}
        onFinishFeedback={handleVoiceFeedbackFinished}
      />
    );
  }

  // ==========================================
  // VIEW UTAMA (STEP 1): DAFTAR PESERTA & FILTER JENJANG
  // ==========================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      {/* Toast Notifikasi */}
      {toastMessage && (
        <div
          style={{
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            borderLeft: '4px solid var(--pub-teal)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <CheckCircle size={18} color="var(--pub-teal)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Toolbar Tablet Juri: Profil Juri & Kategori */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: '14px',
          padding: '0.9rem 1.25rem',
          border: '1px solid var(--pub-line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <UserCheck size={18} style={{ color: 'var(--pub-coral)' }} />
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--pub-muted)' }}>
            Tablet Dewan Juri:
          </span>
          <select
            value={activeJudgeId}
            onChange={(e) => setActiveJudgeId(e.target.value)}
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.825rem',
              fontWeight: 700,
              borderRadius: '8px',
              border: '1px solid var(--pub-line)',
              backgroundColor: 'var(--pub-canvas)',
              color: 'var(--pub-ink)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {judges.map((j, idx) => (
              <option key={j.id} value={j.id}>
                Juri {idx + 1}: {j.name} ({j.category})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              backgroundColor: '#E0F2FE',
              color: '#0369A1',
              padding: '0.25rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 800,
              border: '1px solid #BAE6FD',
            }}
          >
            {activeJudge.category}
          </span>
          <button
            type="button"
            onClick={handleResetData}
            className="pub-btn-outline"
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            title="Reset ulang status penilaian dummy"
          >
            <RotateCcw size={12} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* 2. CARD UTAMA: FILTER JENJANG & DAFTAR PESERTA */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: '16px',
          padding: '1.75rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* DROPDOWN KATEGORI JENJANG (SD / SMP / SMA / PURNA) - SESUAI ARAHAN USER */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--pub-line)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--pub-coral)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <Filter size={14} />
              <span>PILIH TINGKATAN / JENJANG PERLOMBAAN HARI INI</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0.25rem 0 0.15rem 0' }}>
              Daftar Pasukan & Status Penilaian Lapangan
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: 0 }}>
              Jadwal pelaksanaan: <strong style={{ color: 'var(--pub-ink)' }}>{currentSchedule}</strong>
            </p>
          </div>

          {/* Large Dropdown Selector Jenjang */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
              Jenjang:
            </span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{
                padding: '0.65rem 1.15rem',
                fontSize: '0.925rem',
                fontWeight: 800,
                borderRadius: '10px',
                border: '2px solid var(--pub-coral)',
                backgroundColor: 'var(--pub-surface)',
                color: 'var(--pub-ink)',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(201, 75, 60, 0.15)',
              }}
            >
              {JENJANG_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label} — {opt.schedule.split('(')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Info Banner Alur Locking (Aturan Masuk DP 4) */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            fontSize: '0.8rem',
            color: 'var(--pub-ink)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={15} color="var(--pub-coral)" />
            <span>
              <strong>Aturan Locking Flow Penjurian:</strong> Tombol <strong>"Mulai Penilaian"</strong> hanya akan aktif otomatis saat pasukan telah berada di <strong>POS 04 (Arena Lapangan)</strong>.
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', fontWeight: 600 }}>
            Total: {filteredParticipants.length} Pasukan Terdaftar
          </span>
        </div>

        {/* TABEL DATA PESERTA & STATUS PENILAIAN */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--pub-canvas)', borderBottom: '2px solid var(--pub-line)' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--pub-ink)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  No. Urut
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--pub-ink)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  Asal Sekolah & Nama Pasukan
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--pub-ink)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  Komandan Peleton
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--pub-ink)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  Posisi Alur DP
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--pub-ink)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  Status Penilaian
                </th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--pub-ink)', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'center' }}>
                  Aksi Juri
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((p) => {
                const isAtPos4 = p.currentPos === 'POS 04';
                const isFinished = p.isScored;

                return (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid var(--pub-line)',
                      backgroundColor: isAtPos4 && !isFinished ? '#FFF7ED' : 'transparent',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {/* No Urut */}
                    <td style={{ padding: '1rem', fontWeight: 800 }} className="tabular-nums">
                      <span
                        style={{
                          backgroundColor: isAtPos4 && !isFinished ? 'var(--pub-coral)' : 'var(--pub-canvas)',
                          color: isAtPos4 && !isFinished ? '#FFFFFF' : 'var(--pub-ink)',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '8px',
                          border: '1px solid var(--pub-line)',
                          fontSize: '0.9rem',
                        }}
                      >
                        {p.orderNumber}
                      </span>
                    </td>

                    {/* Sekolah & Pasukan */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 800, color: 'var(--pub-ink)', fontSize: '0.95rem' }}>
                        {p.school}
                      </div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>
                        {p.teamName} • {p.members} Pasukan
                      </div>
                    </td>

                    {/* Danton */}
                    <td style={{ padding: '1rem', color: 'var(--pub-ink)' }}>
                      <div style={{ fontWeight: 600 }}>{p.danton}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--pub-muted)' }}>Komandan Peleton</div>
                    </td>

                    {/* Posisi DP */}
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          backgroundColor:
                            p.currentPos === 'POS 04'
                              ? '#FEE2E2'
                              : p.currentPos === 'POS 03'
                              ? '#FEF3C7'
                              : '#F1F5F9',
                          color:
                            p.currentPos === 'POS 04'
                              ? '#DC2626'
                              : p.currentPos === 'POS 03'
                              ? '#B45309'
                              : '#475569',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {p.currentPos === 'POS 04' && <Play size={11} fill="#DC2626" />}
                        {p.posLabel}
                      </span>
                    </td>

                    {/* Status Penilaian (Locking Flow) */}
                    <td style={{ padding: '1rem' }}>
                      {isFinished ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span
                            style={{
                              backgroundColor: '#ECFDF5',
                              color: '#047857',
                              padding: '0.3rem 0.65rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              border: '1px solid #A7F3D0',
                              width: 'fit-content',
                            }}
                          >
                            <CheckCircle size={13} />
                            <span>Selesai Dinilai ✓</span>
                          </span>
                          <span style={{ fontSize: '0.725rem', color: 'var(--pub-muted)', fontWeight: 600 }}>
                            Skor: <strong style={{ color: 'var(--pub-teal)' }}>{p.totalScore} Pts</strong> ({p.scoreData?.scoredAt || ''})
                          </span>
                        </div>
                      ) : isAtPos4 ? (
                        <span
                          style={{
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            border: '1.5px solid #FECACA',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.775rem',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.15)',
                          }}
                        >
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: '#DC2626',
                              animation: 'pulse 1s infinite',
                            }}
                          />
                          <span>MULAI PENILAIAN</span>
                        </span>
                      ) : (
                        <span
                          style={{
                            backgroundColor: '#F1F5F9',
                            color: '#64748B',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <Lock size={12} />
                          <span>Terkunci ({p.currentPos})</span>
                        </span>
                      )}
                    </td>

                    {/* Aksi Juri */}
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {isFinished ? (
                        <button
                          type="button"
                          onClick={() => handleStartScoring(p)}
                          className="pub-btn-outline"
                          style={{ fontSize: '0.775rem', padding: '0.4rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <Eye size={13} />
                          <span>Lihat / Revisi Nilai</span>
                        </button>
                      ) : isAtPos4 ? (
                        <button
                          type="button"
                          onClick={() => handleStartScoring(p)}
                          className="pub-btn-coral"
                          style={{
                            fontSize: '0.825rem',
                            padding: '0.55rem 1.15rem',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            boxShadow: '0 4px 12px rgba(201, 75, 60, 0.3)',
                          }}
                        >
                          <span>Mulai Penilaian</span>
                          <ChevronRight size={15} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          style={{
                            fontSize: '0.775rem',
                            padding: '0.45rem 0.85rem',
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            backgroundColor: '#F8FAFC',
                            color: '#94A3B8',
                            cursor: 'not-allowed',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                          title="Pasukan belum masuk DP 04 (Arena Lapangan)"
                        >
                          <Lock size={12} />
                          <span>Terkunci</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 3. SIMULATOR TOOLBAR UNTUK PITCHING KE PANITIA LOMBA */}
        <div
          style={{
            marginTop: '0.5rem',
            backgroundColor: '#FAF5FF',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            border: '1px solid #E9D5FF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="#7C3AED" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6D28D9', textTransform: 'uppercase' }}>
              Simulasi Lapangan (Demo Presentasi Panitia):
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.775rem', color: '#6D28D9', fontWeight: 600 }}>
              Dorong Pasukan ke DP 04:
            </span>
            {filteredParticipants
              .filter((p) => p.currentPos !== 'POS 04')
              .slice(0, 3)
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSimulateMoveToPos4(p.id)}
                  style={{
                    backgroundColor: '#EDE9FE',
                    color: '#6D28D9',
                    border: '1px solid #C4B5FD',
                    borderRadius: '6px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  title={`Klik untuk simulasi ${p.school} masuk ke panggung arena POS 04`}
                >
                  ⚡ Masukkan {p.school.split(' ')[0]} {p.school.split(' ')[1] || ''}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
