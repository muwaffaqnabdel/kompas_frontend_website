import React, { useState, useEffect } from 'react';
import {
  GitCommit,
  CheckCircle2,
  Clock,
  Users,
  Shield,
  ArrowDown,
  Activity,
  Play,
  RotateCcw,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  Flame,
  Camera,
  FileCheck2,
  Tv,
} from 'lucide-react';

const STORAGE_KEY_LIVE_DP = 'kompas_live_dp_monitoring_teams_v2';

// Helper Icon resolver berdasarkan ID Pos (Aman dari serialisasi JSON)
const getPosIcon = (posId) => {
  switch (posId) {
    case 1:
      return FileCheck2;
    case 2:
      return Camera;
    case 3:
      return Flame;
    case 4:
    default:
      return Tv;
  }
};

// Data Awal Skenario Pasukan di Hari H (Nama Sekolah & Peleton Riil)
const INITIAL_DP_BANJAR_DATA = [
  {
    id: 1,
    posCode: 'POS 01',
    name: 'Pengecekan Dokumen & Fisik',
    shortDesc: 'Verifikasi kesesuaian berkas identitas, surat sehat dokter, dan kelengkapan atribut seragam peleton.',
    operator: 'Budi Santoso (Panitia DP 1)',
    status: 'IN_PROGRESS',
    statusLabel: 'SEDANG DIVERIFIKASI',
    badgeColor: { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' },
    activeTeam: {
      orderNumber: '03',
      school: 'SMKN 2 Bogor',
      teamName: 'PASKIBRA KSATRIA PANDAWA',
      danton: 'M. Rizky Pratama',
      members: 16,
      entryTime: '08:35 WIB',
      elapsedTime: '06 Menit',
      notes: 'Pemeriksaan berkas SP / SK Kepala Sekolah & cek fisik atribut lengkap.',
    },
    queueTeams: [
      {
        orderNumber: '04',
        school: 'SMAN 5 Depok',
        teamName: 'Paskibra Satya Bhakti',
        status: 'Menunggu di Tenda Registrasi',
      },
      {
        orderNumber: '05',
        school: 'SMA Labschool Kebayoran',
        teamName: 'Paskibra Taruna Sakti',
        status: 'Siap Mengantre',
      },
    ],
  },
  {
    id: 2,
    posCode: 'POS 02',
    name: 'Photoshoot Resmi Pasukan',
    shortDesc: 'Sesi dokumentasi foto resmi booklet kompetisi, kartu tanda peserta, dan arsip dewan juri.',
    operator: 'Siti Rahmawati (Panitia DP 2)',
    status: 'IN_PROGRESS',
    statusLabel: 'SESI FOTO BERLANGSUNG',
    badgeColor: { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' },
    activeTeam: {
      orderNumber: '02',
      school: 'SMAN 3 Bandung',
      teamName: 'PASKIBRA DWI WARNA',
      danton: 'Ahmad Faisal',
      members: 16,
      entryTime: '08:30 WIB',
      elapsedTime: '11 Menit',
      notes: 'Foto formasi saf depan & close-up danton untuk tayangan layar videotron panggung.',
    },
    queueTeams: [
      {
        orderNumber: '03',
        school: 'SMKN 2 Bogor',
        teamName: 'Paskibra Ksatria Pandawa',
        status: 'Menunggu Lolos dari Pos 01',
      },
    ],
  },
  {
    id: 3,
    posCode: 'POS 03',
    name: 'Persiapan Terakhir & Pemanasan (Warm-Up Zone)',
    shortDesc: 'Area isolasi steril sebelum memasuki panggung. Penyesuaian tempo langkah dan ketukan yel-yel.',
    operator: 'Agus Hermawan (Panitia DP 3)',
    status: 'EMPTY',
    statusLabel: 'KORIDOR STERIL / SIAP TERIMA',
    badgeColor: { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' },
    activeTeam: null,
    lastTeam: {
      orderNumber: '01',
      school: 'SMAN 1 Jakarta',
      time: 'Keluar pukul 08:28 WIB (Maju ke Panggung)',
    },
    queueTeams: [
      {
        orderNumber: '02',
        school: 'SMAN 3 Bandung',
        teamName: 'Paskibra Dwi Warna',
        status: 'Akan masuk setelah selesai Pos 02',
      },
    ],
  },
  {
    id: 4,
    posCode: 'POS 04',
    name: 'Panggung Penampilan Utama (Arena Lomba)',
    shortDesc: 'Arena unjuk kebolehan PBB Murni, Variasi Formasi, Komandan Peleton, dan Kostum di hadapan Dewan Juri.',
    operator: 'Kapten Kav. Hendra Wijaya (Pimpinan Lapangan)',
    status: 'PERFORMING',
    statusLabel: 'SEDANG TAMPIL DI LAPANGAN',
    badgeColor: { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' },
    activeTeam: {
      orderNumber: '01',
      school: 'SMAN 1 Jakarta',
      teamName: 'PASKIBRA GARUDA SAKTI',
      danton: 'Fakhri Pratama Yudha',
      members: 16,
      entryTime: '08:30 WIB',
      elapsedTime: '07:15 / 10:00 Menit',
      notes: 'Sedang memperagakan Formasi Variasi 2 (Transisi Bintang Melingkar). 5 Juri aktif menilai.',
    },
    queueTeams: [],
  },
];

export default function AdminPanitiaDPMonitoring() {
  const [dpData, setDpData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LIVE_DP);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].posCode) {
          return parsed;
        }
      }
      return INITIAL_DP_BANJAR_DATA;
    } catch {
      return INITIAL_DP_BANJAR_DATA;
    }
  });

  const [simulationToast, setSimulationToast] = useState(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LIVE_DP, JSON.stringify(dpData));
    } catch (e) {
      console.error(e);
    }
  }, [dpData]);

  const showToast = (msg) => {
    setSimulationToast(msg);
    setTimeout(() => setSimulationToast(null), 3500);
  };

  // Simulasi Majukan Pasukan 1 Langkah
  const handleSimulateAdvance = () => {
    setDpData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));

      // POS 2 -> POS 3
      if (updated[1].activeTeam && !updated[2].activeTeam) {
        updated[2].activeTeam = {
          ...updated[1].activeTeam,
          entryTime: '08:42 WIB',
          elapsedTime: '01 Menit',
          notes: 'Mulai pemanasan langkah tegap dan peregangan danton.',
        };
        updated[2].status = 'IN_PROGRESS';
        updated[2].statusLabel = 'SEDANG PEMANASAN';
        updated[2].badgeColor = { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };

        // POS 1 -> POS 2
        if (updated[0].activeTeam) {
          updated[1].activeTeam = {
            ...updated[0].activeTeam,
            entryTime: '08:42 WIB',
            elapsedTime: '01 Menit',
            notes: 'Mulai sesi foto formasi dan danton.',
          };
          updated[1].status = 'IN_PROGRESS';
          updated[1].statusLabel = 'SESI FOTO BERLANGSUNG';
        }

        // Antrean POS 1 masuk ke POS 1
        if (updated[0].queueTeams && updated[0].queueTeams.length > 0) {
          const nextInQueue = updated[0].queueTeams.shift();
          updated[0].activeTeam = {
            orderNumber: nextInQueue.orderNumber,
            school: nextInQueue.school,
            teamName: nextInQueue.teamName.toUpperCase(),
            danton: 'Danton Peleton',
            members: 16,
            entryTime: '08:42 WIB',
            elapsedTime: '01 Menit',
            notes: 'Verifikasi kelengkapan berkas fisik & absen peleton.',
          };
        } else {
          updated[0].activeTeam = null;
          updated[0].status = 'EMPTY';
        }
      }

      showToast('Simulasi Alur DP Berhasil! Pasukan bergerak maju ke pos berikutnya.');
      return updated;
    });
  };

  const handleResetSimulation = () => {
    setDpData(INITIAL_DP_BANJAR_DATA);
    localStorage.setItem(STORAGE_KEY_LIVE_DP, JSON.stringify(INITIAL_DP_BANJAR_DATA));
    showToast('Alur simulasi berhasil direset ke susunan awal.');
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--pub-surface)',
        borderRadius: 'var(--pub-radius-card)',
        padding: '1.75rem',
        border: '1px solid var(--pub-line)',
        boxShadow: 'var(--pub-shadow-card)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Header Monitoring */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--pub-line)',
          paddingBottom: '1.15rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                backgroundColor: 'var(--pub-teal-light)',
                color: 'var(--pub-teal)',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.725rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Activity size={13} />
              LIVE MONITORING HARI H
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-slate)' }}>
              Format Banjar Operasional (Pos 01 &rarr; Pos 04)
            </span>
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.015em',
              color: 'var(--pub-ink)',
              margin: '0 0 0.25rem 0',
            }}
          >
            Monitoring Alur Pos DP (Decision Points) Hari H
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: 0, maxWidth: '720px' }}>
            Pantau pergerakan nama sekolah dan tim yang sedang berada di setiap pos persiapan secara berurutan (banjar), lengkap dengan kapasitas atomic lock dan antrean peleton.
          </p>
        </div>

        {/* Demo Controls: Simulasi Majukan Tim */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleResetSimulation}
            className="pub-btn-outline"
            style={{
              fontSize: '0.775rem',
              padding: '0.45rem 0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontWeight: 600,
            }}
            title="Kembalikan posisi simulasi pasukan ke awal"
          >
            <RotateCcw size={13} />
            <span>Reset Pos</span>
          </button>

          <button
            type="button"
            onClick={handleSimulateAdvance}
            className="pub-btn-coral"
            style={{
              fontSize: '0.775rem',
              padding: '0.45rem 1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 700,
              boxShadow: '0 2px 4px rgba(201, 75, 60, 0.2)',
            }}
            title="Simulasikan tim maju ke pos berikutnya"
          >
            <Play size={13} fill="currentColor" />
            <span>Simulasikan Pasukan Maju Pos</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {simulationToast && (
        <div
          style={{
            backgroundColor: 'var(--emerald-light)',
            color: 'var(--emerald-text)',
            border: '1px solid var(--emerald)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontSize: '0.825rem',
            fontWeight: 600,
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{simulationToast}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAMPILAN BERBANJAR (VERTIKAL: POS 1 -> POS 2 -> POS 3 -> POS 4) */}
      {/* ======================================================== */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {dpData.map((dp, index) => {
          const Icon = getPosIcon(dp.id);
          const isLast = index === dpData.length - 1;
          const hasActiveTeam = !!dp.activeTeam;
          const badgeBg = dp.badgeColor?.bg || '#FEF3C7';
          const badgeText = dp.badgeColor?.text || '#B45309';
          const badgeBorder = dp.badgeColor?.border || '#FDE68A';
          const queueTeamsList = dp.queueTeams || [];

          return (
            <React.Fragment key={dp.id || index}>
              {/* CARD POS (BANJAR ROW) */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: hasActiveTeam ? '1.5px solid var(--pub-line)' : '1px dashed var(--pub-line)',
                  borderLeft: `5px solid ${
                    dp.status === 'PERFORMING'
                      ? 'var(--crimson)'
                      : hasActiveTeam
                      ? 'var(--pub-coral)'
                      : 'var(--emerald)'
                  }`,
                  boxShadow: hasActiveTeam
                    ? '0 4px 12px -2px rgba(15, 23, 42, 0.05)'
                    : 'none',
                  padding: '1.35rem 1.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(220px, 1.1fr) minmax(280px, 1.8fr) minmax(220px, 1.1fr)',
                  gap: '1.5rem',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* KOLOM 1: IDENTITAS POS & OPERATOR */}
                <div style={{ borderRight: '1px solid var(--pub-line)', paddingRight: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        backgroundColor:
                          dp.status === 'PERFORMING'
                            ? '#FEE2E2'
                            : hasActiveTeam
                            ? 'var(--pub-coral-pale)'
                            : '#ECFDF5',
                        color:
                          dp.status === 'PERFORMING'
                            ? 'var(--crimson)'
                            : hasActiveTeam
                            ? 'var(--pub-coral-dark)'
                            : 'var(--emerald)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} />
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          color: 'var(--pub-coral)',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {dp.posCode}
                      </div>
                      <h4
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.975rem',
                          fontWeight: 800,
                          color: 'var(--pub-ink)',
                          margin: 0,
                          lineHeight: 1.25,
                        }}
                      >
                        {dp.name}
                      </h4>
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--pub-muted)',
                      margin: '0.35rem 0 0.65rem 0',
                      lineHeight: 1.4,
                    }}
                  >
                    {dp.shortDesc}
                  </p>

                  {/* Operator & Kapasitas Proteksi */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.725rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-text)' }}>
                      <UserCheck size={13} style={{ color: 'var(--pub-coral)' }} />
                      <span>{dp.operator}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--pub-muted)' }}>
                      <Shield size={13} style={{ color: 'var(--emerald)' }} />
                      <span>Kapasitas Proteksi: <strong>Maks. 1 Tim</strong></span>
                    </div>
                  </div>
                </div>

                {/* KOLOM 2: TIM YANG SEDANG AKTIF DI POS INI (NAMA SEKOLAH JELAS) */}
                <div style={{ paddingRight: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: hasActiveTeam ? 'var(--pub-navy)' : 'var(--pub-muted)',
                      }}
                    >
                      TIM AKTIF DI POS INI:
                    </span>

                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        backgroundColor: badgeBg,
                        color: badgeText,
                        border: `1px solid ${badgeBorder}`,
                        padding: '0.15rem 0.55rem',
                        borderRadius: '6px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      {dp.status === 'PERFORMING' && (
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--crimson)',
                            display: 'inline-block',
                          }}
                        />
                      )}
                      {dp.statusLabel}
                    </span>
                  </div>

                  {hasActiveTeam && dp.activeTeam ? (
                    <div
                      style={{
                        backgroundColor: 'var(--pub-canvas)',
                        borderRadius: '10px',
                        padding: '0.85rem 1rem',
                        border: '1px solid var(--pub-line)',
                      }}
                    >
                      {/* Nama Sekolah & Pasukan Utama */}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span
                          className="tabular-nums"
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            backgroundColor: 'var(--pub-navy)',
                            color: '#FFFFFF',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                          }}
                        >
                          NO. {dp.activeTeam.orderNumber}
                        </span>
                        <span
                          style={{
                            fontSize: '1.05rem',
                            fontWeight: 800,
                            color: 'var(--pub-ink)',
                            fontFamily: 'var(--font-heading)',
                          }}
                        >
                          {dp.activeTeam.school}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--pub-coral)' }}>
                          ({dp.activeTeam.teamName})
                        </span>
                      </div>

                      {/* Detail Personel, Waktu Masuk, Danton */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          fontSize: '0.75rem',
                          color: 'var(--slate-text)',
                          marginTop: '0.45rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span>
                          Danton: <strong>{dp.activeTeam.danton}</strong>
                        </span>
                        <span>•</span>
                        <span>{dp.activeTeam.members} Personel</span>
                        <span>•</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--pub-muted)' }}>
                          <Clock size={12} />
                          Masuk: <strong>{dp.activeTeam.entryTime}</strong> ({dp.activeTeam.elapsedTime})
                        </span>
                      </div>

                      {/* Catatan Progres Pos */}
                      <div
                        style={{
                          fontSize: '0.725rem',
                          color: 'var(--pub-muted)',
                          marginTop: '0.35rem',
                          fontStyle: 'italic',
                          borderTop: '1px dashed var(--pub-line)',
                          paddingTop: '0.35rem',
                        }}
                      >
                        {dp.activeTeam.notes}
                      </div>
                    </div>
                  ) : (
                    /* Kondisi Pos Sedang Kosong / Tersedia */
                    <div
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                        padding: '1rem',
                        border: '1px dashed #CBD5E1',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--emerald)' }}>
                        ✓ Pos Kosong — Siap Menerima Pasukan Berikutnya
                      </div>
                      {dp.lastTeam && (
                        <div style={{ fontSize: '0.725rem', color: 'var(--pub-muted)', marginTop: '0.25rem' }}>
                          Terakhir diproses: <strong>{dp.lastTeam.school} (No. {dp.lastTeam.orderNumber})</strong> — {dp.lastTeam.time}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* KOLOM 3: ANTREAN MENUNGGU DI LUAR POS INI */}
                <div style={{ borderLeft: '1px solid var(--pub-line)', paddingLeft: '1.25rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--pub-muted)', marginBottom: '0.45rem', letterSpacing: '0.06em' }}>
                    ANTREAN PASUKAN ({queueTeamsList.length} TIM):
                  </div>

                  {queueTeamsList.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      {queueTeamsList.map((qt, qIdx) => (
                        <div
                          key={qIdx}
                          style={{
                            backgroundColor: 'var(--pub-canvas)',
                            padding: '0.5rem 0.65rem',
                            borderRadius: '8px',
                            border: '1px solid var(--pub-line)',
                            fontSize: '0.75rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span
                              className="tabular-nums"
                              style={{
                                fontSize: '0.675rem',
                                fontWeight: 700,
                                backgroundColor: 'var(--pub-sand)',
                                color: 'var(--pub-navy)',
                                padding: '0.1rem 0.35rem',
                                borderRadius: '3px',
                              }}
                            >
                              #{qt.orderNumber}
                            </span>
                            <span style={{ fontWeight: 700, color: 'var(--pub-ink)' }}>
                              {qt.school}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.675rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>
                            {qt.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: '0.65rem 0.75rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.75rem',
                        color: 'var(--pub-muted)',
                        textAlign: 'center',
                      }}
                    >
                      Tidak ada antrean menunggu
                    </div>
                  )}
                </div>
              </div>

              {/* VERTICAL FLOW CONNECTOR (TANDA ALUR BERBANJAR DARI POS SEBELUMNYA KE POS BERIKUTNYA) */}
              {!isLast && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.5rem 0',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      backgroundColor: 'var(--pub-surface)',
                      border: '1px solid var(--pub-line)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'var(--pub-coral)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                      zIndex: 2,
                    }}
                  >
                    <ArrowDown size={13} style={{ color: 'var(--pub-coral)' }} />
                    <span>Lolos Verifikasi & Maju ke Pos Berikutnya</span>
                    <ArrowDown size={13} style={{ color: 'var(--pub-coral)' }} />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
