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
  KeyRound,
  LogOut,
  Loader2,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import JuriStepScoring from './juri/JuriStepScoring';
import JuriVoiceNoteStep from './juri/JuriVoiceNoteStep';

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

export default function JuriView() {
  const { user, activeEvent, loading: authLoading, refreshSession } = useAuth();

  // State Sesi & Otorisasi Dewan Juri (Integrasi #1: /api/juri/session + AuthContext)
  const [selectedEventId, setSelectedEventId] = useState('');
  const [juriSession, setJuriSession] = useState(null);
  const [sessionState, setSessionState] = useState('LOADING'); // 'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'FORBIDDEN'
  const [sessionError, setSessionError] = useState('');

  // State Form Verifikasi PIN Tablet Juri
  const [availableEvents, setAvailableEvents] = useState([]);
  const [pinEventId, setPinEventId] = useState('evt-lkbb-2026');
  const [pinInput, setPinInput] = useState('');
  const [pinSubmitting, setPinSubmitting] = useState(false);
  const [pinError, setPinError] = useState('');

  const activeJudge = juriSession?.judge || null;
  const activeJuriEvent = juriSession?.event || null;
  const assignedJuriEvents = juriSession?.assignedEvents || [];

  // Sinkronisasi sesi Dewan Juri dari backend (/api/juri/session)
  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    const verifyJuriSession = async () => {
      setSessionState('LOADING');
      setSessionError('');

      const userJuriEventId =
        selectedEventId ||
        (activeEvent?.role === 'JURI' ? activeEvent.eventId : null) ||
        user?.assignedEvents?.find((e) => e.role === 'JURI')?.eventId ||
        '';

      const query = userJuriEventId
        ? `?eventId=${encodeURIComponent(userJuriEventId)}`
        : '';

      try {
        const res = await fetch(`/api/juri/session${query}`, {
          credentials: 'include',
        });
        const data = await res.json();

        if (cancelled) return;

        if (res.ok && data.success && data.judge) {
          setJuriSession({
            judge: data.judge,
            event: data.event,
            assignedEvents: data.assignedEvents || [],
            isSuperAdmin: Boolean(data.isSuperAdmin),
          });
          setSessionState('AUTHENTICATED');
          setSessionError('');
        } else if (res.status === 403) {
          setJuriSession(null);
          setSessionState('FORBIDDEN');
          setSessionError(
            data.message || 'Akun Anda belum memiliki penugasan aktif sebagai Dewan Juri.'
          );
        } else {
          setJuriSession(null);
          setSessionState('UNAUTHENTICATED');
          setSessionError(
            data.message || 'Silakan login sebagai Dewan Juri atau masukkan PIN Juri.'
          );
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to verify juri session:', err);
        setJuriSession(null);
        setSessionState('UNAUTHENTICATED');
        setSessionError('Gagal terhubung ke server untuk memverifikasi sesi Dewan Juri.');
      }
    };

    verifyJuriSession();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user?.id, activeEvent?.eventId, selectedEventId]);

  // Muat daftar event lomba untuk pilihan verifikasi PIN saat belum terautentikasi
  useEffect(() => {
    if (sessionState !== 'UNAUTHENTICATED' && sessionState !== 'FORBIDDEN') return;

    let cancelled = false;
    const loadEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        if (!cancelled && data.success && Array.isArray(data.events) && data.events.length > 0) {
          setAvailableEvents(data.events);
          setPinEventId((prev) =>
            data.events.some((ev) => ev.id === prev || ev.slug === prev)
              ? prev
              : data.events[0].id
          );
        }
      } catch (err) {
        console.warn('Failed to fetch events for PIN login:', err);
      }
    };

    loadEvents();
    return () => {
      cancelled = true;
    };
  }, [sessionState]);

  const handlePinLogin = async (e) => {
    e.preventDefault();
    setPinError('');

    const cleanPin = pinInput.replace(/\D/g, '').trim();
    if (!/^\d{4}$/.test(cleanPin)) {
      setPinError('PIN Dewan Juri wajib terdiri dari tepat 4 digit angka.');
      return;
    }

    setPinSubmitting(true);
    try {
      const res = await fetch('/api/juri/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          eventId: pinEventId || 'evt-lkbb-2026',
          pin: cleanPin,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setPinError(data.message || 'PIN Dewan Juri tidak valid.');
        return;
      }

      setJuriSession({
        judge: data.judge,
        event: data.event,
        assignedEvents: [
          {
            eventId: data.event?.id || pinEventId,
            eventName: data.event?.name || 'Event Lomba',
            eventSlug: data.event?.slug || '',
            eventStatus: data.event?.status || '',
            role: 'JURI',
          },
        ],
        isSuperAdmin: false,
      });
      setSelectedEventId(data.event?.id || pinEventId);
      setSessionState('AUTHENTICATED');
      setSessionError('');
      setPinInput('');
      showToast(`✓ Sesi Dewan Juri aktif: ${data.judge.name}`);

      // Sinkronkan AuthContext agar Topbar & sesi global ikut terbarui
      await refreshSession();
    } catch (err) {
      setPinError('Terjadi kesalahan saat memverifikasi PIN ke server.');
    } finally {
      setPinSubmitting(false);
    }
  };

  const handleEndJuriSession = async () => {
    try {
      await fetch('/api/juri/session', {
        method: 'DELETE',
        credentials: 'include',
      });
    } finally {
      setJuriSession(null);
      setSelectedEventId('');
      setSessionState('UNAUTHENTICATED');
      setViewStep('LIST');
      setSelectedTeam(null);
      await refreshSession();
    }
  };

  // State Utama Alur Juri:
  // 'LIST' (Tampilan Awal Daftar Peserta + Filter Jenjang)
  // 'SCORING' (Step-by-Step Per Aba-Aba)
  // 'VOICE_FEEDBACK' (AI Voice Note Feedback & Submit Final)
  const [viewStep, setViewStep] = useState('LIST');

  // Filter Kategori Jenjang (Dinamis dari data peserta event di backend)
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [availableCategories, setAvailableCategories] = useState([]);

  // Data Peserta riil dari Backend (Integrasi #2: GET /api/juri/participants)
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [participantsError, setParticipantsError] = useState('');

  const fetchJuriParticipants = async (targetEventId, showRefreshToast = false) => {
    if (!targetEventId) return;
    setParticipantsLoading(true);
    setParticipantsError('');
    try {
      const res = await fetch(
        `/api/juri/participants?eventId=${encodeURIComponent(targetEventId)}`,
        { credentials: 'include' }
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        setParticipants([]);
        setAvailableCategories([]);
        setParticipantsError(data.message || 'Gagal memuat daftar peserta event.');
        return;
      }

      setParticipants(Array.isArray(data.participants) ? data.participants : []);
      setAvailableCategories(Array.isArray(data.categories) ? data.categories : []);
      if (showRefreshToast) {
        showToast(`✓ Daftar peserta diperbarui (${data.total ?? 0} pasukan terdaftar).`);
      }
    } catch (err) {
      console.error('Failed to fetch juri participants:', err);
      setParticipants([]);
      setAvailableCategories([]);
      setParticipantsError('Gagal terhubung ke server saat memuat daftar peserta.');
    } finally {
      setParticipantsLoading(false);
    }
  };

  // Data Kriteria / Aba-Aba Penilaian Dinamis sesuai Kategori Juri (Integrasi #3: GET /api/juri/criteria)
  const [juriCriteria, setJuriCriteria] = useState([]);
  const [assignedCategories, setAssignedCategories] = useState([]);
  const [isRubricLocked, setIsRubricLocked] = useState(false);
  const [criteriaLoading, setCriteriaLoading] = useState(false);
  const [criteriaError, setCriteriaError] = useState('');

  const fetchJuriCriteria = async (targetEventId) => {
    if (!targetEventId) return;
    setCriteriaLoading(true);
    setCriteriaError('');
    try {
      const res = await fetch(
        `/api/juri/criteria?eventId=${encodeURIComponent(targetEventId)}`,
        { credentials: 'include' }
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        setJuriCriteria([]);
        setCriteriaError(data.message || 'Gagal memuat kriteria penilaian Dewan Juri.');
        return;
      }

      setJuriCriteria(Array.isArray(data.criteria) ? data.criteria : []);
      setAssignedCategories(Array.isArray(data.assignedCategories) ? data.assignedCategories : []);
      setIsRubricLocked(Boolean(data.scoringLocked));
    } catch (err) {
      console.error('Failed to fetch juri criteria:', err);
      setJuriCriteria([]);
      setCriteriaError('Gagal terhubung ke server saat memuat rubrik penilaian.');
    } finally {
      setCriteriaLoading(false);
    }
  };

  useEffect(() => {
    if (sessionState !== 'AUTHENTICATED' || !activeJuriEvent?.id) {
      setParticipants([]);
      setAvailableCategories([]);
      setJuriCriteria([]);
      setAssignedCategories([]);
      return;
    }
    setSelectedLevel('ALL');
    fetchJuriParticipants(activeJuriEvent.id);
    fetchJuriCriteria(activeJuriEvent.id);
  }, [sessionState, activeJuriEvent?.id, activeJudge?.userId]);

  // Pasukan yang sedang aktif dinilai saat ini
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Nilai sementara aba-aba untuk pasukan yang dipilih
  const [currentScores, setCurrentScores] = useState({});

  // Feedback tersimpan untuk pasukan yang dipilih
  const [savedFeedback, setSavedFeedback] = useState('');

  // Toast pemberitahuan ringkas
  const [toastMessage, setToastMessage] = useState('');

  // Status Kunci Penilaian dari Pos DP 04 (Arena Utama)
  const [isDp4ScoringOpen, setIsDp4ScoringOpen] = useState(() => {
    try {
      return localStorage.getItem('kompas_dp4_scoring_opened') === 'true';
    } catch {
      return false;
    }
  });

  const [, setTick] = useState(0);

  useEffect(() => {
    const handleScoringChange = () => {
      try {
        setIsDp4ScoringOpen(localStorage.getItem('kompas_dp4_scoring_opened') === 'true');
      } catch {
        setIsDp4ScoringOpen(false);
      }
      setTick((t) => t + 1);
    };
    window.addEventListener('kompas_dp4_scoring_changed', handleScoringChange);
    window.addEventListener('kompas_dp_flow_updated', handleScoringChange);
    window.addEventListener('storage', handleScoringChange);
    return () => {
      window.removeEventListener('kompas_dp4_scoring_changed', handleScoringChange);
      window.removeEventListener('kompas_dp_flow_updated', handleScoringChange);
      window.removeEventListener('storage', handleScoringChange);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // Sinkronisasi posisi peserta dengan alur Pos DP lokal (akan dimigrasikan ke realtime backend di Nomor 4)
  const resolvedParticipants = participants.map((p) => {
    if (activeJuriEvent?.id) {
      try {
        const saved = localStorage.getItem(`kompas_dp_flow_state_${activeJuriEvent.id}`);
        if (saved) {
          const fs = JSON.parse(saved);
          if (fs.pos4?.id === p.id) {
            return { ...p, currentPos: 'POS 04', posLabel: 'Pos 04 — Arena Tampil Utama' };
          } else if (fs.pos3?.id === p.id) {
            return { ...p, currentPos: 'POS 03', posLabel: 'Pos 03 — Ruang Warm Up' };
          } else if (fs.pos2?.id === p.id) {
            return { ...p, currentPos: 'POS 02', posLabel: 'Pos 02 — Sesi Photoshoot' };
          } else if (fs.pos1?.id === p.id) {
            return { ...p, currentPos: 'POS 01', posLabel: 'Pos 01 — Verifikasi Berkas' };
          } else if (fs.completedTeamIds?.includes(p.id)) {
            return { ...p, currentPos: 'SELESAI', posLabel: 'Selesai Tampil di Arena' };
          }
        }
      } catch (e) {}
    }
    return p;
  });

  // Filter peserta berdasarkan Kategori / Jenjang yang dipilih di Dropdown
  const filteredParticipants =
    selectedLevel === 'ALL'
      ? resolvedParticipants
      : resolvedParticipants.filter((p) => (p.category || p.level) === selectedLevel);
  const currentEventSubtitle = activeJuriEvent?.name
    ? `${activeJuriEvent.name} (${activeJuriEvent.status || 'AKTIF'})`
    : 'Event Penugasan Aktif';

  // 1. KLIK TOMBOL "MULAI PENILAIAN" (HANYA BISA DIKLIK JIKA DI POS 04 DAN DIBUKA OLEH DP 4)
  const handleStartScoring = (team) => {
    if (team.currentPos !== 'POS 04') {
      showToast(`⚠️ Pasukan ${team.school} belum masuk ke Arena Lapangan (Masih di ${team.posLabel})!`);
      return;
    }
    const isOpened = localStorage.getItem('kompas_dp4_scoring_opened') === 'true';
    if (!isOpened) {
      showToast(`⚠️ Penilaian Juri belum dibuka oleh Petugas Pos 04 Lapangan! Silakan tunggu petugas DP 04 membuka penilaian.`);
      return;
    }
    if (criteriaLoading) {
      showToast('⏳ Sedang memuat daftar aba-aba penilaian Anda. Mohon tunggu sebentar...');
      return;
    }
    if (juriCriteria.length === 0) {
      showToast(`⚠️ Belum ada butir aba-aba penilaian untuk kategori (${assignedCategories.join(', ') || activeJudge?.category || 'Anda'}) pada event ini.`);
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
    try {
      localStorage.setItem('kompas_dp4_scoring_opened', 'true');
      window.dispatchEvent(new Event('kompas_dp4_scoring_changed'));
    } catch (e) {}
    const targetTeam = participants.find((p) => p.id === teamId);
    showToast(`⚡ Pasukan ${targetTeam?.school || ''} telah didorong masuk ke POS 04 (Arena Lapangan)! Status Penilaian Terbuka.`);
  };

  // Muat ulang data peserta & kriteria terbaru dari server
  const handleRefreshParticipants = () => {
    if (activeJuriEvent?.id) {
      fetchJuriParticipants(activeJuriEvent.id, true);
      fetchJuriCriteria(activeJuriEvent.id);
    }
  };

  // ==========================================
  // GERBANG AUTENTIKASI & OTORISASI DEWAN JURI
  // ==========================================
  if (sessionState === 'LOADING') {
    return (
      <div
        style={{
          maxWidth: '560px',
          margin: '3rem auto',
          backgroundColor: 'var(--pub-surface)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          textAlign: 'center',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <Loader2
          size={32}
          style={{
            color: 'var(--pub-coral)',
            margin: '0 auto 0.85rem',
            animation: 'spin 1s linear infinite',
          }}
        />
        <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--pub-ink)' }}>
          Memverifikasi Sesi Dewan Juri...
        </h3>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--pub-muted)' }}>
          Memeriksa hak akses dan penugasan event aktif Anda.
        </p>
      </div>
    );
  }

  if (sessionState !== 'AUTHENTICATED' || !activeJudge) {
    return (
      <div
        style={{
          maxWidth: '540px',
          margin: '2rem auto',
          backgroundColor: 'var(--pub-surface)',
          borderRadius: '18px',
          padding: '2rem',
          border: '1px solid var(--pub-line)',
          borderTop: '4px solid var(--pub-coral)',
          boxShadow: 'var(--pub-shadow-card)',
          fontFamily: 'var(--font-sans)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: sessionState === 'FORBIDDEN' ? '#FEF2F2' : '#FFF1F2',
              color: 'var(--pub-coral)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {sessionState === 'FORBIDDEN' ? <ShieldAlert size={22} /> : <KeyRound size={22} />}
          </div>
          <div>
            <div style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--pub-coral)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Otorisasi Tablet Dewan Juri
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0.15rem 0 0 0' }}>
              {sessionState === 'FORBIDDEN' ? 'Penugasan Juri Tidak Ditemukan' : 'Verifikasi Sesi Dewan Juri'}
            </h2>
          </div>
        </div>

        {sessionError && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              backgroundColor: sessionState === 'FORBIDDEN' ? '#FEF2F2' : '#F8FAFC',
              border: sessionState === 'FORBIDDEN' ? '1px solid #FECACA' : '1px solid #E2E8F0',
              color: sessionState === 'FORBIDDEN' ? '#991B1B' : '#334155',
              fontSize: '0.825rem',
              lineHeight: 1.5,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
            }}
          >
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px', color: sessionState === 'FORBIDDEN' ? '#DC2626' : '#64748B' }} />
            <span>{sessionError}</span>
          </div>
        )}

        <form onSubmit={handlePinLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
              Pilih Event Penugasan
            </label>
            <select
              value={pinEventId}
              onChange={(e) => setPinEventId(e.target.value)}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid var(--pub-line)',
                backgroundColor: 'var(--pub-canvas)',
                color: 'var(--pub-ink)',
                fontSize: '0.875rem',
                fontWeight: 600,
                outline: 'none',
              }}
            >
              {availableEvents.length > 0 ? (
                availableEvents.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name}
                  </option>
                ))
              ) : (
                <option value="evt-lkbb-2026">LKBB Nasional Paskibra 2026</option>
              )}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
              PIN Akses Dewan Juri (4 Digit)
            </label>
            <input
              type="password"
              inputMode="numeric"
              pattern="\d{4}"
              minLength={4}
              maxLength={4}
              required
              placeholder="Masukkan 4 digit PIN (contoh: 8821)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1.5px solid var(--pub-line)',
                backgroundColor: '#FFFFFF',
                color: 'var(--pub-ink)',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                outline: 'none',
              }}
            />
          </div>

          {pinError && (
            <div
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#B91C1C',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              {pinError}
            </div>
          )}

          <button
            type="submit"
            disabled={pinSubmitting}
            className="pub-btn-coral"
            style={{
              width: '100%',
              padding: '0.8rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: pinSubmitting ? 0.7 : 1,
            }}
          >
            <KeyRound size={17} />
            <span>{pinSubmitting ? 'Memverifikasi PIN...' : 'Verifikasi PIN & Masuk Tablet Juri'}</span>
          </button>
        </form>

        <div
          style={{
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--pub-line)',
            fontSize: '0.775rem',
            color: 'var(--pub-muted)',
            lineHeight: 1.5,
          }}
        >
          Atau login menggunakan akun email & kata sandi Dewan Juri (misal <code style={{ fontWeight: 700 }}>juri1@kompas.id</code>) melalui tombol <strong>Masuk</strong> di bilah atas.
        </div>
      </div>
    );
  }

  // ==========================================
  // JIKA SEDANG DI STEP 2: PENILAIAN PER ABA-ABA
  // ==========================================
  if (viewStep === 'SCORING' && selectedTeam) {
    return (
      <JuriStepScoring
        team={selectedTeam}
        judge={activeJudge}
        abaAbaList={juriCriteria}
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
        abaAbaList={juriCriteria}
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

      {/* 1. Header Toolbar Tablet Juri: Identitas Juri Terautentikasi & Event Penugasan */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: '14px',
          padding: '0.95rem 1.25rem',
          border: '1px solid var(--pub-line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#FFF1F2',
              color: 'var(--pub-coral)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <UserCheck size={19} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.925rem', fontWeight: 800, color: 'var(--pub-ink)' }}>
                {activeJudge.name}
              </span>
              <span
                style={{
                  backgroundColor: '#ECFDF5',
                  color: '#047857',
                  border: '1px solid #A7F3D0',
                  padding: '0.12rem 0.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                {activeJudge.role || 'Dewan Juri'}
              </span>
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.15rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, color: 'var(--pub-ink)' }}>
                <Calendar size={12} style={{ color: 'var(--pub-coral)' }} />
                {assignedJuriEvents.length > 1 ? (
                  <select
                    value={activeJuriEvent?.id || selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    style={{
                      padding: '0.15rem 0.45rem',
                      fontSize: '0.775rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                      border: '1px solid var(--pub-line)',
                      backgroundColor: 'var(--pub-canvas)',
                      color: 'var(--pub-ink)',
                      cursor: 'pointer',
                    }}
                  >
                    {assignedJuriEvents.map((ev) => (
                      <option key={ev.eventId} value={ev.eventId}>
                        {ev.eventName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{activeJuriEvent?.name || 'Event Penugasan Aktif'}</span>
                )}
              </span>
              {activeJudge.institution && (
                <>
                  <span>•</span>
                  <span>{activeJudge.institution}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(assignedCategories.length > 0 ? assignedCategories : [activeJudge.category || 'PBB']).map((cat) => (
            <span
              key={cat}
              style={{
                backgroundColor: '#E0F2FE',
                color: '#0369A1',
                padding: '0.28rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                border: '1px solid #BAE6FD',
              }}
            >
              {cat}
            </span>
          ))}
          <span
            style={{
              backgroundColor: isRubricLocked ? '#ECFDF5' : '#FEF3C7',
              color: isRubricLocked ? '#047857' : '#B45309',
              padding: '0.28rem 0.6rem',
              borderRadius: '6px',
              fontSize: '0.725rem',
              fontWeight: 700,
              border: isRubricLocked ? '1px solid #A7F3D0' : '1px solid #FDE68A',
            }}
            title={
              isRubricLocked
                ? 'Rubrik penilaian resmi telah dikunci oleh Admin Panitia'
                : 'Rubrik penilaian masih berstatus draft di Admin Panitia'
            }
          >
            {criteriaLoading
              ? 'Memuat Aba-Aba...'
              : `${juriCriteria.length} Aba-Aba • ${isRubricLocked ? 'Terkunci ✓' : 'Draft'}`}
          </span>
          <button
            type="button"
            onClick={handleRefreshParticipants}
            disabled={participantsLoading}
            className="pub-btn-outline"
            style={{ fontSize: '0.75rem', padding: '0.28rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            title="Muat ulang daftar peserta dari server"
          >
            <RotateCcw size={12} />
            <span>{participantsLoading ? 'Memuat...' : 'Muat Ulang'}</span>
          </button>
          <button
            type="button"
            onClick={handleEndJuriSession}
            className="pub-btn-outline"
            style={{
              fontSize: '0.75rem',
              padding: '0.28rem 0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#B91C1C',
              borderColor: '#FECACA',
            }}
            title="Akhiri sesi Juri pada tablet ini"
          >
            <LogOut size={12} />
            <span>Keluar Sesi</span>
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
              Event penugasan: <strong style={{ color: 'var(--pub-ink)' }}>{currentEventSubtitle}</strong>
            </p>
          </div>

          {/* Large Dropdown Selector Kategori / Jenjang Dinamis */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
              Kategori:
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
              <option value="ALL">
                Semua Kategori ({participants.length} Pasukan)
              </option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
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
              <strong>Aturan Locking Flow Penjurian:</strong> Penilaian dewan juri hanya dapat dimulai saat pasukan telah berada di <strong>POS 04 (Arena Lapangan)</strong> dan petugas DP 04 telah mengklik tombol <strong>"Buka Penilaian Juri"</strong>.
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
              {participantsLoading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--pub-muted)' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                      <Loader2 size={18} style={{ color: 'var(--pub-coral)', animation: 'spin 1s linear infinite' }} />
                      <span>Memuat daftar peserta dari server...</span>
                    </div>
                  </td>
                </tr>
              ) : participantsError ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                    <div style={{ color: '#B91C1C', fontWeight: 700, marginBottom: '0.5rem' }}>
                      {participantsError}
                    </div>
                    <button
                      type="button"
                      onClick={handleRefreshParticipants}
                      className="pub-btn-outline"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
                    >
                      Coba Muat Ulang
                    </button>
                  </td>
                </tr>
              ) : filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--pub-muted)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.25rem' }}>
                      Belum ada peserta terdaftar pada kategori ini
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>
                      Pastikan Admin Panitia telah memvalidasi peserta pada event {activeJuriEvent?.name || 'ini'}.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredParticipants.map((p) => {
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
                        isDp4ScoringOpen ? (
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
                              backgroundColor: '#FEF3C7',
                              color: '#B45309',
                              border: '1.5px solid #FDE68A',
                              padding: '0.35rem 0.75rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                            }}
                          >
                            <Lock size={12} />
                            <span>Menunggu Buka DP 04</span>
                          </span>
                        )
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
                        isDp4ScoringOpen ? (
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
                            onClick={() => handleStartScoring(p)}
                            style={{
                              fontSize: '0.8rem',
                              padding: '0.5rem 0.95rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              backgroundColor: '#FEF3C7',
                              color: '#B45309',
                              border: '1px solid #F59E0B',
                              borderRadius: '8px',
                              cursor: 'pointer',
                            }}
                            title="Menunggu Petugas Pos 04 Lapangan mengklik tombol Buka Penilaian Juri"
                          >
                            <Lock size={13} />
                            <span>Menunggu Buka DP 04</span>
                          </button>
                        )
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
              }))}
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
