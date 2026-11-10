import React, { useState } from 'react';
import {
  Eye,
  CheckCircle,
  AlertCircle,
  Save,
  Download,
  X,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

const STORAGE_KEY_PARTICIPANTS = 'kompas_panitia_participants_data';
const STORAGE_KEY_ASSIGNED_SCHEDULE = 'kompas_assigned_schedule';

// Data Default 2 Tim: Tim 1 (Lengkap & Tervalidasi), Tim 2 (DUMMY BELUM LENGKAP)
const INITIAL_PARTICIPANTS = [
  {
    id: 'part-1',
    teamNumber: '01 / LKBB-2026-001',
    teamName: 'PASKIBRA GARUDA SAKTI',
    school: 'SMAN 1 Jakarta',
    members: 16,
    category: 'SMA/SMK Putra-Putri',
    orderNumber: '#01',
    orderSlot: 'Slot Pagi (08:30 WIB)',
    status: 'VALIDATED', // 'VALIDATED' | 'REVISION_REQUIRED' | 'SUBMITTED'
    docsSummary: '3/3 Berkas Lengkap',
    isComplete: true,
    documents: [
      {
        id: 'doc-1',
        title: 'Surat Tugas & Rekomendasi Kepala Sekolah',
        fileName: 'Surat_Rekomendasi_Kepsek_SMAN1_Jakarta.pdf',
        ext: 'pdf',
        size: '1.2 MB',
        uploadedAt: '24 Okt 2026, 08:30 WIB',
        status: 'VERIFIED',
        note: null,
      },
      {
        id: 'doc-2',
        title: 'Scan Kartu Pelajar Kolektif (16 Anggota)',
        fileName: 'Kartu_Pelajar_Kolektif_16Anggota.pdf',
        ext: 'pdf',
        size: '3.4 MB',
        uploadedAt: '24 Okt 2026, 08:35 WIB',
        status: 'VERIFIED',
        note: null,
      },
      {
        id: 'doc-3',
        title: 'Formulir Pendaftaran & Pakta Integritas Kontingen',
        fileName: 'Formulir_Pendaftaran_Kontingen_Paskibra_2026.docx',
        ext: 'docx',
        size: '840 KB',
        uploadedAt: '24 Okt 2026, 08:40 WIB',
        status: 'VERIFIED',
        note: null,
      },
    ],
  },
  {
    id: 'part-2',
    teamNumber: '02 / LKBB-2026-002',
    teamName: 'SATRIA BHAYANGKARA',
    school: 'SMAN 3 Bandung',
    members: 16,
    category: 'SMA/SMK Putra-Putri',
    orderNumber: '',
    orderSlot: '',
    status: 'REVISION_REQUIRED', // Belum Lengkap / Perlu Revisi
    docsSummary: '1/3 Diunggah (2 Belum Lengkap)',
    isComplete: false,
    documents: [
      {
        id: 'doc-1',
        title: 'Surat Tugas & Rekomendasi Kepala Sekolah',
        fileName: 'Surat_Tugas_SMAN3_Bdg.pdf',
        ext: 'pdf',
        size: '980 KB',
        uploadedAt: '25 Okt 2026, 11:20 WIB',
        status: 'VERIFIED',
        note: null,
      },
      {
        id: 'doc-2',
        title: 'Scan Kartu Pelajar Kolektif (16 Anggota)',
        fileName: null,
        ext: null,
        size: null,
        uploadedAt: null,
        status: 'MISSING',
        note: 'Belum diunggah sama sekali oleh pendaftar.',
      },
      {
        id: 'doc-3',
        title: 'Formulir Pendaftaran & Pakta Integritas Kontingen',
        fileName: 'Formulir_Pendaftaran_Draft_SMAN3.docx',
        ext: 'docx',
        size: '620 KB',
        uploadedAt: '25 Okt 2026, 11:35 WIB',
        status: 'REVISION',
        note: 'Belum dilengkapi materai 10.000 dan cap basah tanda tangan Kepala Sekolah.',
      },
    ],
  },
];

export default function AdminPanitiaParticipantTable({ participants: propParticipants }) {
  const [participants, setParticipants] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PARTICIPANTS);
      return saved ? JSON.parse(saved) : (propParticipants && propParticipants.length > 0 ? propParticipants : INITIAL_PARTICIPANTS);
    } catch {
      return INITIAL_PARTICIPANTS;
    }
  });

  // State Modal Detail Berkas
  const [selectedParticipantForDocs, setSelectedParticipantForDocs] = useState(null);

  // State Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Simpan data partisipan ke LocalStorage & Sync ke Peserta Dashboard
  const saveParticipantsToStorage = (updated) => {
    setParticipants(updated);
    try {
      localStorage.setItem(STORAGE_KEY_PARTICIPANTS, JSON.stringify(updated));

      // Jika tim pertama (Paskibra Garuda Sakti) diubah nomor urut & jam tampilnya,
      // otomatis sinkronkan ke dashboard peserta melalui key STORAGE_KEY_ASSIGNED_SCHEDULE
      const mainTeam = updated.find((p) => p.id === 'part-1') || updated[0];
      if (mainTeam) {
        localStorage.setItem(
          STORAGE_KEY_ASSIGNED_SCHEDULE,
          JSON.stringify({
            orderNumber: mainTeam.orderNumber || '#01',
            orderSlot: mainTeam.orderSlot || 'Slot Pagi (08:30 WIB)',
            statusDocs: mainTeam.isComplete ? 'TERVERIFIKASI' : 'PERLU REVISI',
          })
        );
      }
    } catch (e) {
      console.error('Failed to save participants:', e);
    }
  };

  // Handler update field Nomor Urut
  const handleOrderNumberChange = (id, newOrderNumber) => {
    const updated = participants.map((p) =>
      p.id === id ? { ...p, orderNumber: newOrderNumber } : p
    );
    saveParticipantsToStorage(updated);
  };

  // Handler update field Estimasi Waktu Tampil
  const handleOrderSlotChange = (id, newOrderSlot) => {
    const updated = participants.map((p) =>
      p.id === id ? { ...p, orderSlot: newOrderSlot } : p
    );
    saveParticipantsToStorage(updated);
  };

  // Handler Simpan Cepat per Baris
  const handleSaveRow = (participant) => {
    saveParticipantsToStorage(participants);
    showToast(
      `Nomor urut "${participant.orderNumber || '-'}" & waktu "${participant.orderSlot || '-'}" untuk ${participant.teamName} berhasil disimpan & disinkronkan ke Dashboard Peserta!`
    );
  };

  // Handler Verifikasi Dokumen dalam Modal
  const handleToggleDocStatus = (docId, newStatus) => {
    if (!selectedParticipantForDocs) return;

    const updatedParticipants = participants.map((p) => {
      if (p.id !== selectedParticipantForDocs.id) return p;

      const updatedDocs = p.documents.map((d) =>
        d.id === docId ? { ...d, status: newStatus } : d
      );

      const allVerified = updatedDocs.every((d) => d.status === 'VERIFIED');
      const verifiedCount = updatedDocs.filter((d) => d.status === 'VERIFIED').length;

      return {
        ...p,
        documents: updatedDocs,
        isComplete: allVerified,
        status: allVerified ? 'VALIDATED' : 'REVISION_REQUIRED',
        docsSummary: allVerified
          ? `${updatedDocs.length}/${updatedDocs.length} Berkas Lengkap`
          : `${verifiedCount}/${updatedDocs.length} Diunggah (${updatedDocs.length - verifiedCount} Belum Lengkap)`,
      };
    });

    saveParticipantsToStorage(updatedParticipants);

    // Update modal state juga
    const refreshed = updatedParticipants.find((p) => p.id === selectedParticipantForDocs.id);
    setSelectedParticipantForDocs(refreshed);

    showToast(`Status dokumen berhasil diperbarui menjadi ${newStatus}.`);
  };

  // Handler Reset ke Data Awal Demo
  const handleResetDemoData = () => {
    saveParticipantsToStorage(INITIAL_PARTICIPANTS);
    showToast('Data peserta berhasil direset ke contoh awal.');
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
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0F172A',
            color: '#F8FAFC',
            padding: '0.85rem 1.4rem',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            zIndex: 9999,
            borderLeft: '4px solid var(--pub-teal)',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle size={18} color="var(--pub-teal)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bagian Tabel */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--pub-line)',
          paddingBottom: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                backgroundColor: 'rgba(201, 75, 60, 0.12)',
                color: 'var(--pub-coral)',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.725rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              ADMIN PANITIA · PESERTA & BERKAS
            </span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0 0 0.25rem 0' }}>
            Verifikasi Berkas & Penjadwalan Nomor Urut Tampil
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: 0, maxWidth: '720px' }}>
            Periksa kelengkapan dokumen persyaratan kontingen dan tetapkan <strong>Nomor Urut</strong> serta <strong>Estimasi Jam Tampil</strong> yang akan otomatis tayang di Dashboard Peserta.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleResetDemoData}
            title="Kembalikan data ke contoh awal demo"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.8rem',
              borderRadius: '6px',
              border: '1px solid var(--pub-line)',
              backgroundColor: 'var(--pub-canvas)',
              color: 'var(--pub-muted)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={13} />
            <span>Reset Demo</span>
          </button>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--pub-ink)',
              backgroundColor: 'var(--pub-canvas)',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--pub-line)',
            }}
          >
            Total: <strong>{participants.length}</strong> Kontingen Terdaftar
          </span>
        </div>
      </div>

      {/* Tabel Utama Peserta */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--pub-canvas)', borderBottom: '1px solid var(--pub-line)' }}>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', width: '160px', whiteSpace: 'nowrap' }}>
                Kode Tim
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pasukan & Asal Sekolah
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', width: '220px', whiteSpace: 'nowrap' }}>
                Dokumen Persyaratan
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--pub-coral)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', width: '290px', whiteSpace: 'nowrap' }}>
                Nomor Urut & Waktu Tampil
              </th>
            </tr>
          </thead>
          <tbody>
            {participants.map((pt) => {
              const numPart = pt.teamNumber?.includes('/') ? pt.teamNumber.split('/')[0].trim() : '01';
              const codePart = pt.teamNumber?.includes('/') ? pt.teamNumber.split('/')[1].trim() : pt.teamNumber;

              return (
                <tr
                  key={pt.id}
                  style={{
                    borderBottom: '1px solid var(--pub-line)',
                    backgroundColor: pt.isComplete ? 'transparent' : 'rgba(239, 68, 68, 0.02)',
                    transition: 'background-color 0.2s',
                  }}
                >
                  {/* Kolom 1: Kode Tim (Horizontal & Rapi, Tidak Patah) */}
                  <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          color: 'var(--pub-ink)',
                          backgroundColor: 'var(--pub-canvas)',
                          border: '1px solid var(--pub-line)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {numPart}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.785rem', color: 'var(--pub-ink)' }}>
                          {codePart}
                        </div>
                        <span style={{ fontSize: '0.675rem', color: 'var(--pub-muted)', fontFamily: 'var(--font-mono)' }}>
                          ID: {pt.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Kolom 2: Pasukan & Asal Sekolah + Kategori */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 800, color: 'var(--pub-ink)', fontSize: '0.925rem', letterSpacing: '-0.01em' }}>
                      {pt.teamName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem' }}>
                      <span>{pt.school}</span>
                      <span style={{ color: 'var(--pub-line)' }}>•</span>
                      <span>{pt.category}</span>
                      <span style={{ color: 'var(--pub-line)' }}>•</span>
                      <span style={{ color: 'var(--pub-ink-soft)', fontWeight: 600 }}>{pt.members} Anggota</span>
                    </div>
                  </td>

                  {/* Kolom 3: Dokumen Persyaratan (Status Badge + Tombol View Sejajar) */}
                  <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {pt.isComplete ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            backgroundColor: 'var(--pub-teal-light)',
                            color: 'var(--pub-teal)',
                            padding: '0.25rem 0.6rem',
                            borderRadius: 'var(--pub-radius-pill)',
                            fontSize: '0.725rem',
                            fontWeight: 800,
                          }}
                        >
                          <CheckCircle size={12} />
                          <span>3/3 Valid</span>
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#DC2626',
                            padding: '0.25rem 0.6rem',
                            borderRadius: 'var(--pub-radius-pill)',
                            fontSize: '0.725rem',
                            fontWeight: 800,
                          }}
                        >
                          <AlertTriangle size={12} />
                          <span>1/3 Perlu Revisi</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedParticipantForDocs(pt)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          backgroundColor: '#FFFFFF',
                          border: pt.isComplete ? '1px solid var(--pub-line)' : '1px solid #FCA5A5',
                          color: pt.isComplete ? 'var(--pub-ink)' : '#DC2626',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = pt.isComplete ? 'var(--pub-canvas)' : '#FEF2F2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                        }}
                      >
                        <Eye size={12} color={pt.isComplete ? 'var(--pub-coral)' : '#DC2626'} />
                        <span>Lihat Berkas</span>
                      </button>
                    </div>
                  </td>

                  {/* Kolom 4: Nomor Urut & Waktu Tampil (Inline Horizontal Ramping) */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <input
                        type="text"
                        value={pt.orderNumber}
                        onChange={(e) => handleOrderNumberChange(pt.id, e.target.value)}
                        placeholder="#01"
                        title="Nomor Urut Tampil"
                        style={{
                          width: '64px',
                          padding: '0.35rem 0.45rem',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          textAlign: 'center',
                          color: 'var(--pub-ink)',
                          backgroundColor: 'var(--pub-canvas)',
                          border: '1px solid var(--pub-line)',
                          borderRadius: '6px',
                          fontFamily: 'var(--font-heading)',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pub-coral)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pub-line)')}
                      />

                      <input
                        type="text"
                        value={pt.orderSlot}
                        onChange={(e) => handleOrderSlotChange(pt.id, e.target.value)}
                        placeholder="Contoh: 08:30 WIB"
                        title="Estimasi Jam Tampil"
                        style={{
                          width: '140px',
                          padding: '0.35rem 0.55rem',
                          fontSize: '0.775rem',
                          fontWeight: 600,
                          color: 'var(--pub-ink)',
                          backgroundColor: 'var(--pub-canvas)',
                          border: '1px solid var(--pub-line)',
                          borderRadius: '6px',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pub-coral)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pub-line)')}
                      />

                      <button
                        type="button"
                        onClick={() => handleSaveRow(pt)}
                        title="Simpan & Sinkronkan ke Peserta"
                        className="pub-btn-coral"
                        style={{
                          padding: '0.35rem 0.65rem',
                          fontSize: '0.725rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          borderRadius: '6px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        <Save size={12} />
                        <span>Simpan</span>
                      </button>
                    </div>

                    <div style={{ fontSize: '0.675rem', color: pt.isComplete ? 'var(--pub-teal)' : '#DC2626', marginTop: '0.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {pt.isComplete ? '✓ Terhubung ke Peserta' : '⚠️ Masih ada berkas revisi'}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ============================================================== */}
      {/* MODAL ELEGAN: DETAIL BERKAS PERSYARATAN KONTINGEN               */}
      {/* ============================================================== */}
      {selectedParticipantForDocs && (
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
          onClick={() => setSelectedParticipantForDocs(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--pub-line)',
              padding: '1.75rem',
              position: 'relative',
              fontFamily: 'var(--font-sans)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '1px solid var(--pub-line)',
                paddingBottom: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      backgroundColor: selectedParticipantForDocs.isComplete ? 'var(--pub-teal-light)' : '#FEE2E2',
                      color: selectedParticipantForDocs.isComplete ? 'var(--pub-teal)' : '#DC2626',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {selectedParticipantForDocs.teamNumber}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', fontWeight: 600 }}>
                    {selectedParticipantForDocs.category}
                  </span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                  {selectedParticipantForDocs.teamName}
                </h2>
                <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: '0.15rem 0 0 0' }}>
                  {selectedParticipantForDocs.school} · 16 Pasukan Terdaftar
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedParticipantForDocs(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '0.4rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Status Card Ringkasan Modal */}
            <div
              style={{
                backgroundColor: selectedParticipantForDocs.isComplete ? 'rgba(5, 150, 105, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: selectedParticipantForDocs.isComplete ? '1px solid rgba(5, 150, 105, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {selectedParticipantForDocs.isComplete ? (
                  <CheckCircle size={18} color="var(--pub-teal)" />
                ) : (
                  <AlertTriangle size={18} color="#DC2626" />
                )}
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: selectedParticipantForDocs.isComplete ? 'var(--pub-teal)' : '#DC2626' }}>
                  {selectedParticipantForDocs.docsSummary}
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.725rem',
                  fontWeight: 800,
                  backgroundColor: '#FFFFFF',
                  color: selectedParticipantForDocs.isComplete ? 'var(--pub-teal)' : '#DC2626',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  border: '1px solid currentColor',
                }}
              >
                STATUS TIM: {selectedParticipantForDocs.status}
              </span>
            </div>

            {/* List 3 Berkas Dokumen Persyaratan */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {selectedParticipantForDocs.documents.map((doc, idx) => {
                const isVerified = doc.status === 'VERIFIED';
                const isMissing = doc.status === 'MISSING';
                const isRevision = doc.status === 'REVISION';
                const isPdf = doc.ext === 'pdf';

                return (
                  <div
                    key={doc.id}
                    style={{
                      border: isMissing ? '1.5px dashed #FCA5A5' : isRevision ? '1.5px solid #FCD34D' : '1px solid var(--pub-line)',
                      backgroundColor: isMissing ? '#FEF2F2' : isRevision ? '#FFFBEB' : 'var(--pub-canvas)',
                      borderRadius: '10px',
                      padding: '1rem 1.15rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
                        {/* Format Icon Badge */}
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: isMissing ? '#FEE2E2' : isPdf ? '#FEE2E2' : '#E0F2FE',
                            color: isMissing ? '#DC2626' : isPdf ? '#DC2626' : '#0369A1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.7rem',
                            flexShrink: 0,
                          }}
                        >
                          {isMissing ? '!' : isPdf ? 'PDF' : 'DOC'}
                        </div>

                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--pub-muted)' }}>
                            DOKUMEN #{idx + 1}
                          </div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--pub-ink)' }}>
                            {doc.title}
                          </div>

                          {doc.fileName ? (
                            <div style={{ fontSize: '0.775rem', color: 'var(--pub-ink)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                              <span>📄 {doc.fileName}</span>
                              <span style={{ color: 'var(--pub-muted)' }}>· {doc.size}</span>
                              <span style={{ color: 'var(--pub-muted)' }}>· Diunggah: {doc.uploadedAt}</span>
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.775rem', color: '#DC2626', fontWeight: 700, marginTop: '0.2rem' }}>
                              ⚠️ Berkas belum diunggah oleh pendaftar
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Badge Dokumen */}
                      <div>
                        {isVerified && (
                          <span
                            style={{
                              backgroundColor: 'var(--pub-teal-light)',
                              color: 'var(--pub-teal)',
                              padding: '0.25rem 0.65rem',
                              borderRadius: 'var(--pub-radius-pill)',
                              fontSize: '0.725rem',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <CheckCircle size={12} />
                            TERVERIFIKASI
                          </span>
                        )}
                        {isRevision && (
                          <span
                            style={{
                              backgroundColor: 'rgba(217, 119, 6, 0.15)',
                              color: '#B45309',
                              padding: '0.25rem 0.65rem',
                              borderRadius: 'var(--pub-radius-pill)',
                              fontSize: '0.725rem',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <AlertCircle size={12} />
                            PERLU REVISI
                          </span>
                        )}
                        {isMissing && (
                          <span
                            style={{
                              backgroundColor: '#FEE2E2',
                              color: '#DC2626',
                              padding: '0.25rem 0.65rem',
                              borderRadius: 'var(--pub-radius-pill)',
                              fontSize: '0.725rem',
                              fontWeight: 800,
                            }}
                          >
                            BELUM DIUNGGAH
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Catatan Khusus Revisi jika ada */}
                    {doc.note && (
                      <div
                        style={{
                          marginTop: '0.75rem',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          backgroundColor: isMissing ? 'rgba(239, 68, 68, 0.08)' : 'rgba(217, 119, 6, 0.12)',
                          color: isMissing ? '#991B1B' : '#92400E',
                          fontSize: '0.75rem',
                          lineHeight: 1.4,
                        }}
                      >
                        <strong>Catatan Panitia:</strong> {doc.note}
                      </div>
                    )}

                    {/* Tombol Aksi Verifikasi per Berkas */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem' }}>
                      {doc.fileName && (
                        <button
                          type="button"
                          onClick={() => showToast(`Mengunduh berkas ${doc.fileName}...`)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '5px',
                            border: '1px solid var(--pub-line)',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--pub-ink)',
                            cursor: 'pointer',
                          }}
                        >
                          <Download size={13} />
                          <span>Unduh File</span>
                        </button>
                      )}

                      {!isMissing && (
                        <>
                          {isVerified ? (
                            <button
                              type="button"
                              onClick={() => handleToggleDocStatus(doc.id, 'REVISION')}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '5px',
                                border: '1px solid #FCD34D',
                                backgroundColor: '#FEF3C7',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: '#92400E',
                                cursor: 'pointer',
                              }}
                            >
                              <AlertCircle size={13} />
                              <span>Minta Revisi</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleDocStatus(doc.id, 'VERIFIED')}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '5px',
                                border: 'none',
                                backgroundColor: 'var(--pub-teal)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: '#FFFFFF',
                                cursor: 'pointer',
                              }}
                            >
                              <CheckCircle size={13} />
                              <span>Setujui Berkas</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Modal */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--pub-line)', paddingTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setSelectedParticipantForDocs(null)}
                className="pub-btn-coral"
                style={{ padding: '0.6rem 1.35rem', fontSize: '0.85rem' }}
              >
                Selesai Memeriksa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
