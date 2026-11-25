import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import PanitiaDPHeader from './panitia-dp/PanitiaDPHeader';
import PanitiaDPWorkstation from './panitia-dp/PanitiaDPWorkstation';
import PanitiaDPQueue from './panitia-dp/PanitiaDPQueue';
import PanitiaDPTransitionLogs from './panitia-dp/PanitiaDPTransitionLogs';

const STORAGE_KEY_PARTICIPANTS = 'kompas_panitia_participants_data';
const STORAGE_KEY_TRANSITION_LOGS = 'kompas_dp_transition_logs';

const FORDA_EVENT_ID = '0b85acba-5fc6-4861-b0ce-e35a3bf4cc19';
const LKBB_EVENT_ID = '08007fe4-8f16-4324-b815-2cb8ead844af';

// Data Pasukan Resmi FORDA Jawa Tengah 2026
const DEFAULT_FORDA_PARTICIPANTS = [
  {
    id: 'part-forda-1',
    queueNumber: '01',
    teamName: 'PASKIBRA GARUDA PANDANARAN',
    schoolName: 'SMAN 1 Semarang',
    status: 'VALIDATED',
    docsCount: '3/3 Lengkap',
    documents: [
      { id: 'doc-1', title: 'File Kartu Pelajar (16 Anggota)', fileName: '16_Kartu_Pelajar_Pasukan_Semarang.pdf', status: 'VERIFIED', size: '3.4 MB' },
      { id: 'doc-2', title: 'Surat Tugas & Rekomendasi Kepala Sekolah', fileName: 'Surat_Tugas_Kepsek_SMAN1_Semarang.pdf', status: 'VERIFIED', size: '1.2 MB' },
      { id: 'doc-3', title: 'Formulir Pendaftaran & Pakta Integritas', fileName: 'Pakta_Integritas_Forda_Semarang.pdf', status: 'VERIFIED', size: '850 KB' },
    ],
  },
  {
    id: 'part-forda-2',
    queueNumber: '02',
    teamName: 'KARTIKA CANDRADIMUKA',
    schoolName: 'SMA Taruna Nusantara Magelang',
    status: 'VALIDATED',
    docsCount: '3/3 Lengkap',
    documents: [
      { id: 'doc-1', title: 'File Kartu Pelajar (16 Anggota)', fileName: '16_Kartu_Pelajar_Taruna.pdf', status: 'VERIFIED', size: '3.6 MB' },
      { id: 'doc-2', title: 'Surat Tugas & Rekomendasi Kepala Sekolah', fileName: 'Surat_Tugas_Kepsek_Taruna.pdf', status: 'VERIFIED', size: '1.4 MB' },
      { id: 'doc-3', title: 'Formulir Pendaftaran & Pakta Integritas', fileName: 'Pakta_Integritas_Forda_Taruna.pdf', status: 'VERIFIED', size: '890 KB' },
    ],
  },
  {
    id: 'part-forda-3',
    queueNumber: '03',
    teamName: 'SURYA KUSUMA',
    schoolName: 'SMAN 1 Surakarta',
    status: 'VALIDATED',
    docsCount: '3/3 Lengkap',
    documents: [
      { id: 'doc-1', title: 'File Kartu Pelajar (16 Anggota)', fileName: '16_Kartu_Pelajar_Surakarta.pdf', status: 'VERIFIED', size: '3.1 MB' },
      { id: 'doc-2', title: 'Surat Tugas & Rekomendasi Kepala Sekolah', fileName: 'Surat_Tugas_Kepsek_Surakarta.pdf', status: 'VERIFIED', size: '1.1 MB' },
      { id: 'doc-3', title: 'Formulir Pendaftaran & Pakta Integritas', fileName: 'Pakta_Integritas_Forda_Surakarta.pdf', status: 'VERIFIED', size: '820 KB' },
    ],
  },
  {
    id: 'part-forda-4',
    queueNumber: '04',
    teamName: 'LASKAR MENARA',
    schoolName: 'SMKN 2 Kudus',
    status: 'VALIDATED',
    docsCount: '3/3 Lengkap',
    documents: [
      { id: 'doc-1', title: 'File Kartu Pelajar (16 Anggota)', fileName: '16_Kartu_Pelajar_Kudus.pdf', status: 'VERIFIED', size: '3.2 MB' },
      { id: 'doc-2', title: 'Surat Tugas & Rekomendasi Kepala Sekolah', fileName: 'Surat_Tugas_Kepsek_Kudus.pdf', status: 'VERIFIED', size: '1.3 MB' },
      { id: 'doc-3', title: 'Formulir Pendaftaran & Pakta Integritas', fileName: 'Pakta_Integritas_Forda_Kudus.pdf', status: 'VERIFIED', size: '840 KB' },
    ],
  },
];

const OPERATORS_MAP = {
  // LKBB
  [LKBB_EVENT_ID]: {
    1: 'Budi Santoso (Petugas Dokumen)',
    2: 'Siti Rahma (Petugas Photoshoot)',
    3: 'Agus Wijaya (Petugas Persiapan & Warm Up)',
    4: 'Hendro Kusuma (Pimpinan Arena Utama)',
  },
  // FORDA
  [FORDA_EVENT_ID]: {
    1: 'Ahmad Fauzi (Petugas Dokumen FORDA)',
    2: 'Rian Firmansyah (Petugas Photoshoot FORDA)',
    3: 'Dewi Anggraini (Petugas Persiapan FORDA)',
    4: 'Kapten Joko (Pimpinan Lapangan FORDA)',
  },
};

const getFlowStorageKey = (eventId) => `kompas_dp_flow_state_${eventId || 'default'}`;

const getInitialFlowState = () => ({
  pos1: null,
  pos2: null,
  pos3: null,
  pos4: null,
  calledTeamIds: [],
  transferredToPos2TeamIds: [],
  completedTeamIds: [],
  isJuriScoringOpen: false,
});

// Setup BroadcastChannel untuk sinkronisasi instan antar-tab/antar-window tanpa delay
let flowBroadcastChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    flowBroadcastChannel = new BroadcastChannel('kompas_dp_flow_channel');
  }
} catch (e) {
  console.warn('BroadcastChannel not supported:', e);
}

export default function PanitiaDPView({ activeTab = 'workstation' }) {
  const { user } = useAuth();

  // Deteksi Event & Pos dari akun login jika tersedia
  const userAssignedEvent = user?.assignedEvents?.[0];
  const initialEventId = userAssignedEvent?.eventId || FORDA_EVENT_ID;
  const initialPosIndex = userAssignedEvent?.assignedDp?.orderIndex || 1;

  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [posIndex, setPosIndex] = useState(initialPosIndex);
  const [dpStatus, setDpStatus] = useState('IN_PROGRESS'); // WAITING, IN_PROGRESS, COMPLETED, BLOCKED
  const [targetDpCapacity, setTargetDpCapacity] = useState('AVAILABLE'); // AVAILABLE or FULL
  const [notification, setNotification] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(() => new Date().toLocaleTimeString('id-ID') + ' WIB');
  const [participants, setParticipants] = useState(
    selectedEventId === FORDA_EVENT_ID ? DEFAULT_FORDA_PARTICIPANTS : []
  );

  // Synchronized Flow State across Pos 1 -> 2 -> 3 -> 4 & Juri
  const [flowState, setFlowState] = useState(() => {
    try {
      const saved = localStorage.getItem(getFlowStorageKey(selectedEventId));
      return saved ? JSON.parse(saved) : getInitialFlowState();
    } catch {
      return getInitialFlowState();
    }
  });

  const saveFlowState = (newState) => {
    setFlowState(newState);
    try {
      localStorage.setItem(getFlowStorageKey(selectedEventId), JSON.stringify(newState));
      window.dispatchEvent(
        new CustomEvent('kompas_dp_flow_updated', { detail: { eventId: selectedEventId, data: newState } })
      );
      flowBroadcastChannel?.postMessage({
        type: 'FLOW_UPDATED',
        eventId: selectedEventId,
        data: newState,
      });
      setLastSyncTime(new Date().toLocaleTimeString('id-ID') + ' WIB');
    } catch (e) {
      console.warn('Failed to save flow state:', e);
    }
  };

  // State Riwayat Transisi
  const [transitionLogs, setTransitionLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRANSITION_LOGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sinkronisasi logs ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRANSITION_LOGS, JSON.stringify(transitionLogs));
    } catch (e) {
      console.warn('Failed to save transition logs:', e);
    }
  }, [transitionLogs]);

  // Perbarui saat profil login berganti
  useEffect(() => {
    if (userAssignedEvent?.eventId) {
      setSelectedEventId(userAssignedEvent.eventId);
    }
    if (userAssignedEvent?.assignedDp?.orderIndex) {
      setPosIndex(userAssignedEvent.assignedDp.orderIndex);
    }
  }, [user]);

  // Helper cek dan auto-unblock jika pos tujuan yang sebelumnya penuh kini sudah kosong
  const checkAutoUnblock = (newFlow) => {
    if (posIndex === 1 && !newFlow.pos2) {
      setDpStatus((prev) => {
        if (prev === 'BLOCKED') {
          setNotification({
            type: 'success',
            msg: '🟢 Pos 02 (Photoshoot) kini telah STERIL & KOSONG! Anda dapat mengklik tombol "Selesai Verifikasi & Alirkan ke Pos DP 2" sekarang.',
          });
          return 'IN_PROGRESS';
        }
        return prev;
      });
    } else if (posIndex === 2 && !newFlow.pos3) {
      setDpStatus((prev) => {
        if (prev === 'BLOCKED') {
          setNotification({
            type: 'success',
            msg: '🟢 Pos 03 (Persiapan) kini telah STERIL & KOSONG! Anda dapat mengklik tombol alirkan sekarang untuk memasukkan pasukan.',
          });
          return 'IN_PROGRESS';
        }
        return prev;
      });
    } else if (posIndex === 3 && !newFlow.pos4) {
      setDpStatus((prev) => {
        if (prev === 'BLOCKED') {
          setNotification({
            type: 'success',
            msg: '🟢 Pos 04 (Panggung Utama) kini telah STERIL & BEBAS! Anda dapat mengklik tombol alirkan sekarang untuk memasukkan pasukan ke arena.',
          });
          return 'IN_PROGRESS';
        }
        return prev;
      });
    }
  };

  // Muat state flow saat event berubah & dengarkan event storage / BroadcastChannel antar-tab
  useEffect(() => {
    const loadState = () => {
      try {
        const saved = localStorage.getItem(getFlowStorageKey(selectedEventId));
        if (saved) {
          const parsed = JSON.parse(saved);
          setFlowState(parsed);
          checkAutoUnblock(parsed);
        } else {
          setFlowState(getInitialFlowState());
        }
      } catch (e) {
        setFlowState(getInitialFlowState());
      }
      setLastSyncTime(new Date().toLocaleTimeString('id-ID') + ' WIB');
    };

    loadState();

    const handleFlowUpdate = (e) => {
      if (!e.detail || e.detail.eventId === selectedEventId) {
        loadState();
      }
    };

    const handleChannelMsg = (msg) => {
      if (msg.data?.type === 'FLOW_UPDATED' && msg.data?.eventId === selectedEventId) {
        setFlowState(msg.data.data);
        checkAutoUnblock(msg.data.data);
        setLastSyncTime(new Date().toLocaleTimeString('id-ID') + ' WIB');
      }
    };

    window.addEventListener('kompas_dp_flow_updated', handleFlowUpdate);
    window.addEventListener('storage', loadState);
    flowBroadcastChannel?.addEventListener('message', handleChannelMsg);

    return () => {
      window.removeEventListener('kompas_dp_flow_updated', handleFlowUpdate);
      window.removeEventListener('storage', loadState);
      flowBroadcastChannel?.removeEventListener('message', handleChannelMsg);
    };
  }, [selectedEventId, posIndex]);

  // Background auto-polling heartbeat (setiap 2.5 detik) untuk sinkronisasi multi-device di lapangan
  const handleRefreshData = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const saved = localStorage.getItem(getFlowStorageKey(selectedEventId));
      if (saved) {
        const parsed = JSON.parse(saved);
        setFlowState(parsed);
        checkAutoUnblock(parsed);
      }
      setLastSyncTime(new Date().toLocaleTimeString('id-ID') + ' WIB');
    } catch (e) {
      console.warn('Sync refresh error:', e);
    } finally {
      if (isManual) {
        setTimeout(() => {
          setIsRefreshing(false);
          setNotification({
            type: 'success',
            msg: '✓ Data posisi dan alur antrean seluruh pos berhasil disegarkan.',
          });
        }, 250);
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleRefreshData(false);
    }, 2500);
    return () => clearInterval(timer);
  }, [selectedEventId, posIndex]);

  // Ambil data peserta event untuk Pos DP Pengecekan Dokumen
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await fetch(`/api/dp/doc-check/participants?eventId=${selectedEventId}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.participants) && data.participants.length > 0) {
          setParticipants(data.participants);
          return;
        }
      } catch (err) {
        console.warn('API Doc Check offline, cek fallback:', err);
      }

      // Fallback ke data FORDA atau localStorage
      if (selectedEventId === FORDA_EVENT_ID) {
        setParticipants(DEFAULT_FORDA_PARTICIPANTS);
        return;
      }

      try {
        const saved = localStorage.getItem(STORAGE_KEY_PARTICIPANTS);
        if (saved) {
          const list = JSON.parse(saved);
          setParticipants(
            list.map((p) => ({
              id: p.id,
              queueNumber: p.teamNumber?.includes('/') ? p.teamNumber.split('/')[0].trim() : '01',
              teamName: p.teamName,
              schoolName: p.school,
              status: p.isComplete ? 'VALIDATED' : 'REVISION_REQUIRED',
              docsCount: p.docsSummary || '3/3 Lengkap',
              documents: p.documents || [],
            }))
          );
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchParticipants();

    window.addEventListener('kompas_participants_updated', fetchParticipants);
    return () => window.removeEventListener('kompas_participants_updated', fetchParticipants);
  }, [selectedEventId]);

  // Reset status alert saat sengaja ganti pos
  useEffect(() => {
    setNotification(null);
  }, [posIndex, selectedEventId]);

  // Helper catat log transisi baru
  const addTransitionLog = (action, actionType, team) => {
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const newLog = {
      id: `log-${Date.now()}`,
      time: timeStr,
      orderNumber: team?.queueNumber || team?.orderNumber || '01',
      teamName: team?.teamName || 'PASKIBRA',
      school: team?.schoolName || team?.school || 'Sekolah',
      action,
      actionType,
      operator: operatorName,
      status: 'SUKSES',
    };
    setTransitionLogs((prev) => [newLog, ...prev]);
  };

  // Nama Event
  const eventName =
    selectedEventId === FORDA_EVENT_ID
      ? 'FORDA Jawa Tengah 2026'
      : 'LKBB Nasional 2026';

  // Nama Operator
  const operatorName =
    user?.fullName ||
    OPERATORS_MAP[selectedEventId]?.[posIndex] ||
    'Ahmad Fauzi (Petugas Pos DP FORDA)';

  // Tim aktif di pos saat ini sesuai sinkronisasi alur
  const currentActiveTeam =
    posIndex === 1
      ? flowState.pos1
      : posIndex === 2
      ? flowState.pos2
      : posIndex === 3
      ? flowState.pos3
      : flowState.pos4;

  // Tim antrean untuk Pos 2, 3, 4 (Memberikan visibilitas posisi setiap pasukan secara real-time)
  const queueTeams = participants.map((p) => {
    let statusText = 'Area Tunggu Registrasi';
    if (flowState.completedTeamIds?.includes(p.id)) {
      statusText = '✓ Selesai Tampil (Keluar Arena)';
    } else if (flowState.pos4?.id === p.id) {
      statusText = '🏟️ Sedang Tampil di Pos 04 (Arena)';
    } else if (flowState.pos3?.id === p.id) {
      statusText = '🔥 Sedang Persiapan di Pos 03';
    } else if (flowState.pos2?.id === p.id) {
      statusText = '📸 Sedang Photoshoot di Pos 02';
    } else if (flowState.pos1?.id === p.id) {
      statusText = '📄 Sedang Verifikasi di Pos 01';
    } else if (flowState.transferredToPos2TeamIds?.includes(p.id)) {
      statusText = 'Lolos dari Pos 01';
    }

    return {
      order: p.queueNumber || '01',
      teamName: p.teamName,
      school: p.schoolName || p.school,
      members: 16,
      status: statusText,
      isCurrentActive: currentActiveTeam?.id === p.id,
    };
  });

  // ==============================================================
  // AKSI 1: PANGGIL PESERTA KE POS 1 (DOKUMEN)
  // ==============================================================
  const handleCallParticipant = (team) => {
    if (flowState.pos1) {
      setNotification({
        type: 'danger',
        msg: `PERINGATAN: Pos 01 sedang memverifikasi ${flowState.pos1.teamName}. Selesaikan verifikasi atau alirkan tim aktif terlebih dahulu.`,
      });
      return;
    }

    const nextState = {
      ...flowState,
      pos1: team,
      calledTeamIds: Array.from(new Set([...(flowState.calledTeamIds || []), team.id])),
    };
    saveFlowState(nextState);
    setDpStatus('IN_PROGRESS');
    setNotification({
      type: 'success',
      msg: `📢 Notifikasi Terkirim: Pasukan ${team.teamName} (${team.schoolName || team.school}) berhasil dipanggil masuk ke Pos 01 untuk verifikasi berkas fisik.`,
    });
    addTransitionLog(
      `📢 Notifikasi Panggilan Masuk ke Pos 01 (Dokumen)`,
      'CALL_POS1',
      team
    );
  };

  // ==============================================================
  // AKSI 2: BUKA PENILAIAN JURI (KHUSUS POS 4)
  // ==============================================================
  const handleOpenJuriScoring = () => {
    if (!currentActiveTeam) return;

    const nextState = {
      ...flowState,
      isJuriScoringOpen: true,
    };
    saveFlowState(nextState);
    try {
      localStorage.setItem('kompas_dp4_scoring_opened', 'true');
      window.dispatchEvent(new Event('kompas_dp4_scoring_changed'));
    } catch (e) {
      console.warn('Failed to set juri scoring open:', e);
    }

    setNotification({
      type: 'success',
      msg: `🔓 SUKSES: Penilaian Dewan Juri resmi dibuka! Seluruh dewan juri kini dapat menginput nilai untuk ${currentActiveTeam.teamName}.`,
    });

    addTransitionLog(
      `🔓 Buka Penilaian Juri (Pos 04 Lapangan)`,
      'JURI_OPEN',
      currentActiveTeam
    );
  };

  // ==============================================================
  // AKSI 3: SELESAI POS DP & ALIRKAN PASUKAN DENGAN ATOMIC LOCK
  // ==============================================================
  const handleFinishDP = async () => {
    if (!currentActiveTeam) return;

    if (posIndex === 1) {
      // Pengecekan Atomic Lock: Cek apakah Pos 2 sedang terisi
      if (flowState.pos2) {
        setDpStatus('BLOCKED');
        setNotification({
          type: 'danger',
          msg: `⛔ PERINGATAN ATOMIC LOCK: Pos 02 (Photoshoot) sedang terisi pasukan "${flowState.pos2.teamName}"! Pasukan "${currentActiveTeam.teamName}" tertahan di Pos 01 sampai Pos 02 mengalirkan timnya ke Pos 03.`,
        });
        return;
      }

      const nextState = {
        ...flowState,
        pos1: null, // Pos 1 kembali steril & siap memanggil tim berikutnya
        pos2: currentActiveTeam, // Tim masuk aktif ke Pos 2
        transferredToPos2TeamIds: Array.from(
          new Set([...(flowState.transferredToPos2TeamIds || []), currentActiveTeam.id])
        ),
      };
      saveFlowState(nextState);

      try {
        await fetch('/api/dp/move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: selectedEventId,
            participantId: currentActiveTeam.id,
            toDpIndex: 2,
            operatorName,
          }),
        });
      } catch (err) {}

      setDpStatus('COMPLETED');
      setNotification({
        type: 'success',
        msg: `SUKSES: Berkas kontingen ${currentActiveTeam.teamName} diverifikasi sah! Pasukan dialirkan ke Pos 02 (Photoshoot). Silakan panggil tim berikutnya pada antrean Pos 01 atau buka Pos 02.`,
      });
      addTransitionLog(
        `➡️ Transisi dari Pos 01 ke Pos 02 (Photoshoot)`,
        'MOVE_POS2',
        currentActiveTeam
      );
    } else if (posIndex === 2) {
      // Pengecekan Atomic Lock: Cek apakah Pos 3 sedang terisi
      if (flowState.pos3) {
        setDpStatus('BLOCKED');
        setNotification({
          type: 'danger',
          msg: `⛔ PERINGATAN ATOMIC LOCK: Pos 03 (Persiapan) sedang terisi pasukan "${flowState.pos3.teamName}"! Pasukan "${currentActiveTeam.teamName}" tertahan di Pos 02 sampai Pos 03 mengalirkan timnya ke Pos 04.`,
        });
        return;
      }

      const nextState = {
        ...flowState,
        pos2: null, // Pos 2 steril
        pos3: currentActiveTeam, // Tim masuk aktif ke Pos 3
      };
      saveFlowState(nextState);

      try {
        await fetch('/api/dp/move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: selectedEventId,
            participantId: currentActiveTeam.id,
            toDpIndex: 3,
            operatorName,
          }),
        });
      } catch (err) {}

      setDpStatus('COMPLETED');
      setNotification({
        type: 'success',
        msg: `SUKSES: Sesi foto selesai! Pasukan ${currentActiveTeam.teamName} dialirkan ke Pos 03 (Daerah Persiapan & Pemanasan). Pos 02 kini steril untuk tim berikutnya.`,
      });
      addTransitionLog(
        `➡️ Transisi dari Pos 02 ke Pos 03 (Persiapan)`,
        'MOVE_POS3',
        currentActiveTeam
      );
    } else if (posIndex === 3) {
      // Pengecekan Atomic Lock: Cek apakah Pos 4 sedang terisi
      if (flowState.pos4) {
        setDpStatus('BLOCKED');
        setNotification({
          type: 'danger',
          msg: `⛔ PERINGATAN ATOMIC LOCK: Pos 04 (Panggung Utama) sedang terisi pasukan "${flowState.pos4.teamName}" yang sedang tampil di arena! Pasukan "${currentActiveTeam.teamName}" tertahan di Pos 03 sampai arena utama selesai.`,
        });
        return;
      }

      const nextState = {
        ...flowState,
        pos3: null, // Pos 3 steril
        pos4: currentActiveTeam, // Tim masuk ke Pos 4
        isJuriScoringOpen: false, // Terkunci sampai operator DP 4 menekan "Buka Penilaian Juri"
      };
      saveFlowState(nextState);
      try {
        localStorage.removeItem('kompas_dp4_scoring_opened');
        window.dispatchEvent(new Event('kompas_dp4_scoring_changed'));
      } catch (e) {}

      try {
        await fetch('/api/dp/move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: selectedEventId,
            participantId: currentActiveTeam.id,
            toDpIndex: 4,
            operatorName,
          }),
        });
      } catch (err) {}

      setDpStatus('COMPLETED');
      setNotification({
        type: 'success',
        msg: `SUKSES: Persiapan tuntas! Pasukan ${currentActiveTeam.teamName} didorong masuk ke Pos 04 (Panggung Utama). Holding bay Pos 03 siap menerima tim berikutnya.`,
      });
      addTransitionLog(
        `➡️ Transisi dari Pos 03 ke Pos 04 (Panggung Utama)`,
        'MOVE_POS4',
        currentActiveTeam
      );
    } else if (posIndex === 4) {
      // Pos 4: Pasukan Selesai Tampil di Arena
      const nextState = {
        ...flowState,
        pos4: null, // Arena kembali steril
        isJuriScoringOpen: false,
        completedTeamIds: Array.from(
          new Set([...(flowState.completedTeamIds || []), currentActiveTeam.id])
        ),
      };
      saveFlowState(nextState);
      try {
        localStorage.removeItem('kompas_dp4_scoring_opened');
        window.dispatchEvent(new Event('kompas_dp4_scoring_changed'));
      } catch (e) {}

      try {
        await fetch('/api/dp/move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: selectedEventId,
            participantId: currentActiveTeam.id,
            toDpIndex: 5,
            operatorName,
          }),
        });
      } catch (err) {}

      setDpStatus('COMPLETED');
      setNotification({
        type: 'success',
        msg: `SUKSES: Pasukan ${currentActiveTeam.teamName} telah selesai tampil dan dibubarkan keluar arena! Lapangan utama steril dan siap untuk nomor urut berikutnya.`,
      });
      addTransitionLog(
        `🏁 Pasukan Selesai Tampil & Dibubarkan Keluar Arena`,
        'FINISH_PERFORMANCE',
        currentActiveTeam
      );
    }
  };

  // ==============================================================
  // AKSI 4: RESET ALUR SIMULASI UNTUK UJI COBA ULANG
  // ==============================================================
  const handleResetFlow = () => {
    const initial = getInitialFlowState();
    saveFlowState(initial);
    try {
      localStorage.removeItem('kompas_dp4_scoring_opened');
      window.dispatchEvent(new Event('kompas_dp4_scoring_changed'));
    } catch (e) {}
    setDpStatus('IN_PROGRESS');
    setNotification({
      type: 'success',
      msg: `✓ Alur simulasi ${eventName} berhasil direset! Seluruh pos kini steril dan siap diuji coba kembali dari awal Pos 01.`,
    });
  };

  // ==============================================================
  // JIKA SEDANG DI TAB: RIWAYAT TRANSISI
  // ==============================================================
  if (activeTab === 'logs') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
        <PanitiaDPTransitionLogs
          logs={transitionLogs}
          eventName={eventName}
          onClearLogs={() => {
            setTransitionLogs([]);
            localStorage.removeItem(STORAGE_KEY_TRANSITION_LOGS);
          }}
        />
      </div>
    );
  }

  // ==============================================================
  // RENDER TAB: WORKSTATION / ANTREAN PASUKAN
  // ==============================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      {/* 1. Header Workstation Pos DP dengan Pos Switcher, Event Selector & Live Sync Control */}
      <PanitiaDPHeader
        posIndex={posIndex}
        onSelectPos={(idx) => setPosIndex(idx)}
        eventId={selectedEventId}
        onSelectEvent={(eId) => setSelectedEventId(eId)}
        eventName={eventName}
        operatorName={operatorName}
        targetDpCapacity={targetDpCapacity}
        onToggleTargetCapacity={() => setTargetDpCapacity(targetDpCapacity === 'AVAILABLE' ? 'FULL' : 'AVAILABLE')}
        onResetFlow={handleResetFlow}
        onRefresh={() => handleRefreshData(true)}
        isRefreshing={isRefreshing}
        lastSyncTime={lastSyncTime}
      />

      {/* 2. Kartu Workstation Spesifik (Pos 1 Dokumen vs Pos 2 Photoshoot vs Pos 3 Persiapan vs Pos 4 Panggung) */}
      <PanitiaDPWorkstation
        posIndex={posIndex}
        notification={notification}
        dpStatus={dpStatus}
        onFinishDP={handleFinishDP}
        teamName={currentActiveTeam?.teamName}
        school={currentActiveTeam?.schoolName || currentActiveTeam?.school}
        orderNumber={currentActiveTeam?.queueNumber || currentActiveTeam?.orderNumber}
        members={16}
        entryTime={posIndex === 4 ? 'Sedang Tampil' : '08:15 WIB'}
        allParticipants={participants}
        isJuriScoringOpen={flowState.isJuriScoringOpen}
        onOpenJuriScoring={handleOpenJuriScoring}
      />

      {/* 3. Antrean Tim: Seluruh Peserta di Pos 1 vs Status Alur Real-time di Pos 2, 3, 4 */}
      <PanitiaDPQueue
        posIndex={posIndex}
        title={`Antrean Tim Menunggu Masuk ke Pos 0${posIndex}`}
        queueItems={queueTeams}
        allParticipants={participants}
        activeTeamId={currentActiveTeam?.id}
        calledTeamIds={flowState.calledTeamIds || []}
        transferredTeamIds={flowState.transferredToPos2TeamIds || []}
        onCallParticipant={handleCallParticipant}
      />
    </div>
  );
}
