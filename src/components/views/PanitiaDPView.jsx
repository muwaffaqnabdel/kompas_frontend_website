import React, { useState, useEffect } from 'react';
import PanitiaDPHeader from './panitia-dp/PanitiaDPHeader';
import PanitiaDPWorkstation from './panitia-dp/PanitiaDPWorkstation';
import PanitiaDPQueue from './panitia-dp/PanitiaDPQueue';

const STORAGE_KEY_PARTICIPANTS = 'kompas_panitia_participants_data';

export default function PanitiaDPView({ activeTab = 'workstation' }) {
  const [dpStatus, setDpStatus] = useState('IN_PROGRESS'); // WAITING, IN_PROGRESS, COMPLETED, BLOCKED
  const [targetDpCapacity, setTargetDpCapacity] = useState('AVAILABLE'); // AVAILABLE or FULL
  const [notification, setNotification] = useState(null);
  const [participants, setParticipants] = useState([]);

  // Ambil data peserta event untuk Pos DP Pengecekan Dokumen
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await fetch('/api/dp/doc-check/participants?eventId=evt-lkbb-2026');
        const data = await res.json();
        if (data.success && Array.isArray(data.participants) && data.participants.length > 0) {
          setParticipants(data.participants);
          return;
        }
      } catch (err) {
        console.warn('API Doc Check offline, cek localStorage:', err);
      }

      // Fallback ke localStorage
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
  }, []);

  const activeTeam = participants[0] || {
    teamName: 'PASKIBRA GARUDA SAKTI',
    schoolName: 'SMAN 1 Jakarta',
    queueNumber: '01',
    members: 16,
  };

  const queueTeams = participants.slice(1).map((p) => ({
    order: p.queueNumber || '02',
    teamName: p.teamName,
    school: p.schoolName,
    members: 16,
    status: 'WAITING',
  }));

  const handleFinishDP = () => {
    if (targetDpCapacity === 'FULL') {
      setDpStatus('BLOCKED');
      setNotification({
        type: 'danger',
        msg: `PERINGATAN ATOMIC LOCK: DP 2 (Photoshoot Pasukan) sedang terisi 1 tim! Tim ${activeTeam.teamName} tertahan di ruang tunggu DP 1 sampai slot DP 2 bebas.`,
      });
    } else {
      setDpStatus('COMPLETED');
      setNotification({
        type: 'success',
        msg: `SUKSES: DP 2 tersedia! Tim ${activeTeam.teamName} berhasil diverifikasi berkasnya dan otomatis dipindahkan ke DP 2 (Photoshoot Pasukan). Slot DP 1 kini siap menerima tim berikutnya.`,
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '960px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      {/* 1. Header Workstation Pos DP */}
      <PanitiaDPHeader
        dpName="DP 1 — Pengecekan Dokumen dan Berkas"
        dpPosNumber="01"
        eventName="LKBB Nasional 2026"
        operatorName="Budi Santoso (Petugas Dokumen)"
        targetDpCapacity={targetDpCapacity}
        onToggleTargetCapacity={() => setTargetDpCapacity(targetDpCapacity === 'AVAILABLE' ? 'FULL' : 'AVAILABLE')}
      />

      {/* 2. Kartu Workstation Tim Aktif, Atomic Lock, & Pemeriksaan Berkas */}
      <PanitiaDPWorkstation
        notification={notification}
        dpStatus={dpStatus}
        onFinishDP={handleFinishDP}
        teamName={activeTeam.teamName}
        school={activeTeam.schoolName}
        orderNumber={activeTeam.queueNumber}
        members={16}
        entryTime="08:15 WIB"
        isDocCheckPos={true}
        allParticipants={participants}
      />

      {/* 3. Antrean Tim Berikutnya Menunggu ke DP 1 */}
      <PanitiaDPQueue queueItems={queueTeams} />
    </div>
  );
}
