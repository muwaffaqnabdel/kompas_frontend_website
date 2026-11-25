import React, { useState } from 'react';
import {
  CheckCircle2,
  FileText,
  Eye,
  ExternalLink,
  ShieldCheck,
  Search,
  X,
  Printer,
  ZoomIn,
  ZoomOut,
  AlertCircle,
  FileCheck,
  Users,
  Camera,
  Clock,
  Award,
  Unlock,
  Lock,
  ArrowRight,
  Sparkles,
  Shield,
  Volume2,
} from 'lucide-react';

// Helper generator pratinjau dokumen untuk Operator DP 1 Dokumen
function renderDocHtml(docTitle, teamName, schoolName) {
  if (docTitle.toLowerCase().includes('surat') || docTitle.toLowerCase().includes('rekomendasi')) {
    return `
      <div style="text-align: center; border-bottom: 2px solid #0F172A; padding-bottom: 12px; margin-bottom: 18px;">
        <div style="font-size: 13px; font-weight: 700; text-transform: uppercase;">PEMERINTAH DAERAH PROVINSI KHUSUS JAKARTA</div>
        <div style="font-size: 16px; font-weight: 800; text-transform: uppercase; color: #0F172A;">${schoolName.toUpperCase()}</div>
        <div style="font-size: 11px; color: #475569;">Jalan Budi Utomo No. 7, Sawah Besar, Jakarta Pusat</div>
      </div>
      <div style="text-align: center; margin-bottom: 16px;">
        <h2 style="font-size: 14px; font-weight: 800; text-decoration: underline; margin: 0;">SURAT TUGAS & REKOMENDASI KEPALA SEKOLAH</h2>
        <div style="font-size: 11px; font-family: monospace; font-weight: 700; color: #334155;">No: 421.3 / 184 / SMAN1 / TGS-PASKIBRA / 2026</div>
      </div>
      <p style="font-size: 12.5px; line-height: 1.6; color: #1E293B;">
        Kepala Sekolah dengan ini menugaskan kontingen <strong>${teamName}</strong> beranggotakan 16 Personel Pasukan Utama untuk berkompetisi sportif pada gelaran LKBB Resmi.
      </p>
      <div style="margin-top: 24px; display: flex; justify-content: flex-end; text-align: center;">
        <div style="width: 220px;">
          <div style="font-size: 12px; color: #334155;">Kepala Sekolah,</div>
          <div style="margin: 8px 0; color: #059669; font-weight: 800; font-size: 12px; border: 1.5px dashed #059669; padding: 4px 8px; border-radius: 4px;">[STEMPEL BASAH & TTD SAH]</div>
          <div style="font-weight: 800; font-size: 12px; text-decoration: underline;">Dr. H. Bambang Sutrisno, M.Pd.</div>
          <div style="font-size: 11px; font-family: monospace; color: #64748B;">NIP. 19740512 199903 1 004</div>
        </div>
      </div>
    `;
  }
  return `
    <div style="text-align: center; border-bottom: 2px solid #0F172A; padding-bottom: 12px; margin-bottom: 16px;">
      <h2 style="font-size: 15px; font-weight: 800; text-transform: uppercase;">${docTitle}</h2>
      <div style="font-size: 12px; color: #475569;">Kontingen: ${teamName} (${schoolName})</div>
    </div>
    <div style="padding: 16px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 12px; line-height: 1.6;">
      <div style="font-weight: 800; color: #0F172A; margin-bottom: 8px;">VERIFIKASI BERKAS RESMI DI POS DP 1</div>
      <div>• Status Berkas: <strong>TERVERIFIKASI SAH</strong></div>
      <div>• Pemeriksaan Fisik: Sesuai petunjuk teknis pendaftaran resmi.</div>
    </div>
  `;
}

export default function PanitiaDPWorkstation({
  posIndex = 1,
  notification,
  dpStatus,
  onFinishDP,
  teamName,
  school,
  orderNumber,
  members = 16,
  entryTime = '08:15 WIB',
  allParticipants = [],
  isJuriScoringOpen = false,
  onOpenJuriScoring,
}) {
  // State untuk Pos 1 Dokumen
  const [doc1Checked, setDoc1Checked] = useState(true);
  const [doc2Checked, setDoc2Checked] = useState(true);
  const [doc3Checked, setDoc3Checked] = useState(true);
  const [docVerificationNote, setDocVerificationNote] = useState('Berkas fisik lengkap dan sesuai stempel basah kepala sekolah.');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [showAllDocsModal, setShowAllDocsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isDocCheckPos = posIndex === 1;

  // Filter participants untuk modal dokumen
  const filteredParticipants = allParticipants.filter(
    (p) =>
      p.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(p.queueNumber).includes(searchQuery)
  );

  const openInNewTab = (title, tName, sName) => {
    const win = window.open('', '_blank');
    if (!win) return;
    const content = renderDocHtml(title, tName, sName);
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - ${tName}</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; background: #0F172A; color: #1E293B; }
          .sheet { max-width: 800px; margin: 0 auto; background: #FFF; padding: 48px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
          .btn-print { background: #059669; color: #FFF; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 700; cursor: pointer; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div style="max-width: 800px; margin: 0 auto; text-align: right;">
          <button class="btn-print" onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
        </div>
        <div class="sheet">${content}</div>
      </body>
      </html>
    `);
    win.document.close();
  };

  // Cek apakah pos ini memiliki tim aktif
  const hasActiveTeam = !!teamName;

  const getEmptyPosInfo = () => {
    switch (posIndex) {
      case 2:
        return {
          icon: Camera,
          color: '#0284c7',
          title: 'Pos 02 (Photoshoot) Siap & Steril',
          desc: 'Belum ada pasukan aktif di studio foto. Pasukan akan otomatis masuk ke Pos 02 setelah diverifikasi sah dan dialirkan dari Pos 01 (Dokumen).',
        };
      case 3:
        return {
          icon: Clock,
          color: '#d97706',
          title: 'Pos 03 (Daerah Persiapan & Pemanasan) Siap & Steril',
          desc: 'Belum ada pasukan di ruang pemanasan. Pasukan akan otomatis masuk ke Pos 03 setelah sesi foto di Pos 02 selesai dan dialirkan.',
        };
      case 4:
        return {
          icon: Award,
          color: '#dc2626',
          title: 'Pos 04 (Arena Panggung Utama) Siap & Steril',
          desc: 'Belum ada pasukan yang tampil di lapangan utama. Pasukan akan otomatis masuk ke arena Pos 04 setelah persiapan di Pos 03 tuntas.',
        };
      case 1:
      default:
        return {
          icon: FileCheck,
          color: 'var(--pub-teal)',
          title: 'Pos 01 Siap — Belum Ada Pasukan di Ruang Pemeriksaan',
          desc: 'Seluruh peserta sedang berada di sekitar area lomba. Silakan klik tombol "📢 Panggil Masuk DP 1" pada daftar antrean di bawah untuk memanggil pasukan masuk ke verifikasi berkas.',
        };
    }
  };

  const emptyInfo = getEmptyPosInfo();
  const EmptyIcon = emptyInfo.icon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'var(--font-sans)' }}>
      {/* Notification Banner */}
      {notification && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: notification.type === 'danger' ? 'var(--pub-coral-pale)' : 'var(--pub-teal-light)',
            color: notification.type === 'danger' ? 'var(--pub-coral)' : 'var(--pub-teal)',
            border: `1px solid ${notification.type === 'danger' ? 'var(--pub-coral)' : 'var(--pub-teal)'}`,
            fontWeight: 700,
            fontSize: '0.875rem',
            lineHeight: 1.5,
          }}
        >
          {notification.msg}
        </div>
      )}

      {/* Main Workstation Card */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.75rem',
          border: '1px solid var(--pub-line)',
          borderTop:
            posIndex === 1
              ? '5px solid var(--pub-teal)'
              : posIndex === 2
              ? '5px solid #0284c7'
              : posIndex === 3
              ? '5px solid #d97706'
              : '5px solid #dc2626',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        {/* Placeholder jika Pos belum ada tim aktif */}
        {!hasActiveTeam ? (
          <div
            style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--pub-canvas)',
              borderRadius: '12px',
              border: '2px dashed var(--pub-line)',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'var(--pub-surface)',
                color: emptyInfo.color,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.85rem',
                border: '1px solid var(--pub-line)',
                boxShadow: 'var(--pub-shadow-card)',
              }}
            >
              <EmptyIcon size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0 0 0.45rem 0' }}>
              {emptyInfo.title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--pub-muted)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
              {emptyInfo.desc}
            </p>
          </div>
        ) : (
          <>
            {/* Top Header Tim Aktif */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color:
                        posIndex === 1
                          ? 'var(--pub-teal)'
                          : posIndex === 2
                          ? '#0284c7'
                          : posIndex === 3
                          ? '#d97706'
                          : '#dc2626',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {posIndex === 4 ? 'PASUKAN SEDANG TAMPIL DI ARENA' : 'PASUKAN AKTIF DI POS INI'}
                  </span>
                  <span
                    style={{
                      backgroundColor:
                        posIndex === 1
                          ? 'var(--pub-teal-light)'
                          : posIndex === 2
                          ? '#e0f2fe'
                          : posIndex === 3
                          ? '#fef3c7'
                          : '#fee2e2',
                      color:
                        posIndex === 1
                          ? 'var(--pub-teal)'
                          : posIndex === 2
                          ? '#0369a1'
                          : posIndex === 3
                          ? '#b45309'
                          : '#dc2626',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.55rem',
                      borderRadius: 'var(--pub-radius-pill)',
                    }}
                  >
                    {posIndex === 1
                      ? 'VERIFIKASI BERKAS RESMI'
                      : posIndex === 2
                      ? 'SESI PHOTOSHOOT STUDIO'
                      : posIndex === 3
                      ? 'ZONA STERIL & PEMANASAN'
                      : 'ARENA UTAMA (LIVE)'}
                  </span>
                </div>

                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0.2rem 0' }}>
                  {teamName}
                </h2>
                <div style={{ fontSize: '0.875rem', color: 'var(--pub-muted)' }}>
                  {school} · Nomor Urut: <strong className="tabular-nums" style={{ color: 'var(--pub-ink)' }}>{orderNumber}</strong> · {members} Personel
                </div>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                <span
                  style={{
                    backgroundColor:
                      dpStatus === 'COMPLETED'
                        ? 'var(--pub-teal-light)'
                        : dpStatus === 'BLOCKED'
                        ? 'var(--pub-coral-pale)'
                        : '#FEF3C7',
                    color:
                      dpStatus === 'COMPLETED'
                        ? 'var(--pub-teal)'
                        : dpStatus === 'BLOCKED'
                        ? 'var(--pub-coral)'
                        : '#B45309',
                    padding: '0.25rem 0.7rem',
                    borderRadius: 'var(--pub-radius-pill)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  {dpStatus === 'BLOCKED' ? (
                    <>
                      <Lock size={12} />
                      <span>TERTAHAN ATOMIC LOCK</span>
                    </>
                  ) : dpStatus === 'COMPLETED' ? (
                    <>
                      <CheckCircle2 size={12} />
                      <span>SELESAI DIALIRKAN</span>
                    </>
                  ) : (
                    <span>SEDANG BERLANGSUNG</span>
                  )}
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>
                  Waktu Masuk: <strong style={{ color: 'var(--pub-ink)' }}>{entryTime}</strong>
                </div>

                {isDocCheckPos && (
                  <button
                    type="button"
                    onClick={() => setShowAllDocsModal(true)}
                    className="pub-btn-outline"
                    style={{
                      fontSize: '0.725rem',
                      padding: '0.3rem 0.65rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontWeight: 700,
                      color: 'var(--pub-teal)',
                      borderColor: 'var(--pub-teal)',
                      marginTop: '0.2rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Users size={12} />
                    <span>Lihat Seluruh Berkas Peserta</span>
                  </button>
                )}
              </div>
            </div>

            {/* ============================================================== */}
            {/* VARIANT 1: POS 1 - PENGECEKAN DOKUMEN & BERKAS                 */}
            {/* ============================================================== */}
            {posIndex === 1 && (
              <div
                style={{
                  backgroundColor: 'var(--pub-canvas)',
                  border: '1.5px solid var(--pub-teal)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <FileCheck size={18} color="var(--pub-teal)" />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                      Pemeriksaan Berkas yang Diunggah Kontingen ({teamName})
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--pub-teal)', fontWeight: 700 }}>
                    ✓ Wajib divalidasi sebelum tim dialirkan ke Pos 02
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {/* Berkas 1: Surat Tugas */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      border: '1px solid var(--pub-line)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <input
                        type="checkbox"
                        id="doc1Check"
                        checked={doc1Checked}
                        onChange={(e) => setDoc1Checked(e.target.checked)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--pub-teal)' }}
                      />
                      <div>
                        <label htmlFor="doc1Check" style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--pub-ink)', cursor: 'pointer' }}>
                          Surat Tugas & Rekomendasi Kepala Sekolah
                        </label>
                        <div style={{ fontSize: '0.725rem', color: 'var(--pub-muted)', marginTop: '0.1rem' }}>
                          📄 Surat_Rekomendasi_Kepsek.pdf · 1.2 MB · Stempel Basah Sah
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ backgroundColor: 'var(--pub-teal-light)', color: 'var(--pub-teal)', padding: '0.2rem 0.55rem', borderRadius: 'var(--pub-radius-pill)', fontSize: '0.7rem', fontWeight: 800 }}>
                        TERVERIFIKASI
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewZoom(1);
                          setPreviewDoc({ title: 'Surat Tugas & Rekomendasi Kepala Sekolah', teamName, school });
                        }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid var(--pub-coral)', backgroundColor: '#FFFFFF', color: 'var(--pub-coral)', fontSize: '0.725rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        <Eye size={12} />
                        <span>Lihat</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openInNewTab('Surat Tugas & Rekomendasi Kepala Sekolah', teamName, school)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid var(--pub-line)', backgroundColor: 'var(--pub-canvas)', color: 'var(--pub-ink)', fontSize: '0.725rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        <ExternalLink size={12} />
                        <span>Tab Baru</span>
                      </button>
                    </div>
                  </div>

                  {/* Berkas 2: Kartu Pelajar Kolektif */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      border: '1px solid var(--pub-line)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <input
                        type="checkbox"
                        id="doc2Check"
                        checked={doc2Checked}
                        onChange={(e) => setDoc2Checked(e.target.checked)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--pub-teal)' }}
                      />
                      <div>
                        <label htmlFor="doc2Check" style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--pub-ink)', cursor: 'pointer' }}>
                          Scan Kartu Pelajar Kolektif (16 Anggota)
                        </label>
                        <div style={{ fontSize: '0.725rem', color: 'var(--pub-muted)', marginTop: '0.1rem' }}>
                          📄 Kartu_Pelajar_Kolektif_16Anggota.pdf · 3.4 MB · NISN Aktif
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ backgroundColor: 'var(--pub-teal-light)', color: 'var(--pub-teal)', padding: '0.2rem 0.55rem', borderRadius: 'var(--pub-radius-pill)', fontSize: '0.7rem', fontWeight: 800 }}>
                        TERVERIFIKASI
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewZoom(1);
                          setPreviewDoc({ title: 'Scan Kartu Pelajar Kolektif 16 Anggota', teamName, school });
                        }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid var(--pub-coral)', backgroundColor: '#FFFFFF', color: 'var(--pub-coral)', fontSize: '0.725rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        <Eye size={12} />
                        <span>Lihat</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openInNewTab('Scan Kartu Pelajar Kolektif 16 Anggota', teamName, school)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid var(--pub-line)', backgroundColor: 'var(--pub-canvas)', color: 'var(--pub-ink)', fontSize: '0.725rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        <ExternalLink size={12} />
                        <span>Tab Baru</span>
                      </button>
                    </div>
                  </div>

                  {/* Berkas 3: Formulir Pendaftaran */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      border: '1px solid var(--pub-line)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <input
                        type="checkbox"
                        id="doc3Check"
                        checked={doc3Checked}
                        onChange={(e) => setDoc3Checked(e.target.checked)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--pub-teal)' }}
                      />
                      <div>
                        <label htmlFor="doc3Check" style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--pub-ink)', cursor: 'pointer' }}>
                          Formulir Pendaftaran & Pakta Integritas Kontingen
                        </label>
                        <div style={{ fontSize: '0.725rem', color: 'var(--pub-muted)', marginTop: '0.1rem' }}>
                          📄 Formulir_Pakta_Integritas_Meterai.pdf · 840 KB
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ backgroundColor: 'var(--pub-teal-light)', color: 'var(--pub-teal)', padding: '0.2rem 0.55rem', borderRadius: 'var(--pub-radius-pill)', fontSize: '0.7rem', fontWeight: 800 }}>
                        TERVERIFIKASI
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewZoom(1);
                          setPreviewDoc({ title: 'Formulir Pendaftaran & Pakta Integritas Bermeterai', teamName, school });
                        }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid var(--pub-coral)', backgroundColor: '#FFFFFF', color: 'var(--pub-coral)', fontSize: '0.725rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        <Eye size={12} />
                        <span>Lihat</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openInNewTab('Formulir Pendaftaran & Pakta Integritas Bermeterai', teamName, school)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid var(--pub-line)', backgroundColor: 'var(--pub-canvas)', color: 'var(--pub-ink)', fontSize: '0.725rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        <ExternalLink size={12} />
                        <span>Tab Baru</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Catatan Verifikator */}
                <div style={{ marginTop: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.25rem' }}>
                    Catatan Petugas Dokumen:
                  </label>
                  <input
                    type="text"
                    value={docVerificationNote}
                    onChange={(e) => setDocVerificationNote(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', fontSize: '0.8125rem' }}
                  />
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* VARIANT 2: POS 2 - PHOTOSHOOT (SIMPEL: 3 KOTAK ALUR PER POS) */}
            {/* ============================================================== */}
            {posIndex === 2 && (
              <div
                style={{
                  backgroundColor: 'var(--pub-canvas)',
                  border: '1.5px solid #0284c7',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  marginBottom: '1.25rem',
                }}
              >
                {/* 3 Kotak Alur Per Pos Sederhana */}
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                  ALUR PERGERAKAN PER POS:
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.85rem',
                    marginBottom: '1rem',
                  }}
                >
                  {/* Pos Sebelumnya */}
                  <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '10px', border: '1px solid var(--pub-line)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--pub-teal)', textTransform: 'uppercase' }}>
                      POS SEBELUMNYA:
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--pub-ink)', marginTop: '0.2rem' }}>
                      Pos 01 — Dokumen
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pub-teal)', marginTop: '0.35rem', fontWeight: 700 }}>
                      ✓ Berkas Fisik Sah & Lolos
                    </div>
                  </div>

                  {/* Pos Sekarang */}
                  <div style={{ backgroundColor: '#e0f2fe', padding: '1rem', borderRadius: '10px', border: '2px solid #0284c7', boxShadow: '0 2px 8px rgba(2, 132, 199, 0.15)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                      POS SEKARANG (AKTIF):
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0369a1', marginTop: '0.2rem' }}>
                      Pos 02 — Photoshoot
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#0284c7', marginTop: '0.35rem', fontWeight: 700 }}>
                      📸 Sedang Sesi Pemotretan Studio
                    </div>
                  </div>

                  {/* Pos Tujuan */}
                  <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '10px', border: '1px solid var(--pub-line)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
                      POS TUJUAN:
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--pub-ink)', marginTop: '0.2rem' }}>
                      Pos 03 — Persiapan
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.35rem' }}>
                      Zona Isolasi & Pemanasan
                    </div>
                  </div>
                </div>

                {/* Deskripsi Pengawasan Sederhana */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--pub-line)', fontSize: '0.825rem', color: 'var(--pub-ink)' }}>
                  Petugas mengawasi jalannya sesi pemotretan kontingen <strong>{teamName}</strong> (foto pasukan lengkap & foto danton) di studio foto sebelum diberangkatkan ke Pos 03.
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* VARIANT 3: POS 3 - PERSIAPAN (SIMPEL: 3 KOTAK ALUR PER POS)    */}
            {/* ============================================================== */}
            {posIndex === 3 && (
              <div
                style={{
                  backgroundColor: 'var(--pub-canvas)',
                  border: '1.5px solid #d97706',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  marginBottom: '1.25rem',
                }}
              >
                {/* 3 Kotak Alur Per Pos Sederhana */}
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                  ALUR PERGERAKAN PER POS:
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.85rem',
                    marginBottom: '1rem',
                  }}
                >
                  {/* Pos Sebelumnya */}
                  <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '10px', border: '1px solid var(--pub-line)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                      POS SEBELUMNYA:
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--pub-ink)', marginTop: '0.2rem' }}>
                      Pos 02 — Photoshoot
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#0284c7', marginTop: '0.35rem', fontWeight: 700 }}>
                      ✓ Sesi Foto Studio Selesai
                    </div>
                  </div>

                  {/* Pos Sekarang */}
                  <div style={{ backgroundColor: '#fef3c7', padding: '1rem', borderRadius: '10px', border: '2px solid #d97706', boxShadow: '0 2px 8px rgba(217, 119, 6, 0.15)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase' }}>
                      POS SEKARANG (AKTIF):
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#b45309', marginTop: '0.2rem' }}>
                      Pos 03 — Daerah Persiapan
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '0.35rem', fontWeight: 700 }}>
                      ⏱️ Pasukan Siap di Holding Bay
                    </div>
                  </div>

                  {/* Pos Tujuan */}
                  <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '10px', border: '1px solid var(--pub-line)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
                      POS TUJUAN:
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--pub-ink)', marginTop: '0.2rem' }}>
                      Pos 04 — Panggung Utama
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.35rem' }}>
                      Arena Tampil & Live Scoring
                    </div>
                  </div>
                </div>

                {/* Deskripsi Pengawasan Sederhana */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--pub-line)', fontSize: '0.825rem', color: 'var(--pub-ink)' }}>
                  Petugas mengawasi zona isolasi steril & persiapan pasukan <strong>{teamName}</strong> sebelum dipanggil memasuki lorong panggung lapangan utama.
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* VARIANT 4: POS 4 - PANGGUNG UTAMA & KONTROL PENILAIAN JURI      */}
            {/* ============================================================== */}
            {posIndex === 4 && (
              <div
                style={{
                  backgroundColor: 'var(--pub-canvas)',
                  border: '1.5px solid #dc2626',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={22} color="#dc2626" />
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                        Monitoring Arena Lapangan & Kontrol Penilaian Dewan Juri
                      </h3>
                      <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>
                        Pasukan sedang tampil di panggung utama. Penilaian juri dikontrol langsung oleh Petugas Pos 04.
                      </div>
                    </div>
                  </div>

                  {/* Tombol Utama: Buka Penilaian Juri */}
                  <div>
                    {!isJuriScoringOpen ? (
                      <button
                        type="button"
                        onClick={onOpenJuriScoring}
                        className="pub-btn-coral"
                        style={{
                          backgroundColor: '#059669',
                          borderColor: '#059669',
                          color: '#FFFFFF',
                          padding: '0.55rem 1.15rem',
                          fontSize: '0.825rem',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                          cursor: 'pointer',
                        }}
                      >
                        <Unlock size={16} />
                        <span>🔓 Buka Penilaian Juri</span>
                      </button>
                    ) : (
                      <div
                        style={{
                          backgroundColor: '#ECFDF5',
                          color: '#059669',
                          border: '1.5px solid #059669',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                        }}
                      >
                        <CheckCircle2 size={16} color="#059669" />
                        <span>✓ Penilaian Juri Telah Terbuka</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Box Penilaian Juri */}
                <div
                  style={{
                    backgroundColor: isJuriScoringOpen ? '#ECFDF5' : '#FFFBEB',
                    border: isJuriScoringOpen ? '1px solid #A7F3D0' : '1px solid #FDE68A',
                    borderRadius: '8px',
                    padding: '0.85rem 1.15rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                  }}
                >
                  {isJuriScoringOpen ? (
                    <ShieldCheck size={20} color="#059669" />
                  ) : (
                    <Lock size={20} color="#D97706" />
                  )}
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: isJuriScoringOpen ? '#047857' : '#B45309' }}>
                      {isJuriScoringOpen
                        ? '🟢 Penilaian Dewan Juri Resmi Aktif'
                        : '🔒 Penilaian Dewan Juri Masih Terkunci'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: isJuriScoringOpen ? '#065F46' : '#92400E', marginTop: '0.1rem' }}>
                      {isJuriScoringOpen
                        ? 'Seluruh Dewan Juri saat ini dapat mengisi lembar nilai secara langsung di perangkat mereka.'
                        : 'Lembar penilaian juri terkunci otomatis dan tidak dapat diisi sampai Petugas Pos 04 mengklik "Buka Penilaian Juri".'}
                    </div>
                  </div>
                </div>

                {/* Posisi Pasukan Tetap di Pos 4 */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--pub-line)', fontSize: '0.825rem', color: 'var(--pub-ink)' }}>
                  Kontingen <strong>{teamName}</strong> sedang berada di tengah gelanggang arena utama. Pasukan tetap berada di Pos 04 sampai seluruh aba-aba peragaan selesai ditampilkan.
                </div>
              </div>
            )}

            {/* Action Controls for Operator */}
            <div
              style={{
                backgroundColor: 'var(--pub-canvas)',
                border: '1px solid var(--pub-line)',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--pub-ink)' }}>
                  {posIndex === 1 && 'Pemeriksaan Berkas Fisik & Kehadiran Anggota Selesai?'}
                  {posIndex === 2 && 'Sesi Pemotretan Kontingen & Danton Selesai?'}
                  {posIndex === 3 && 'Persiapan Pasukan Tuntas & Siap Masuk Panggung?'}
                  {posIndex === 4 && 'Penampilan di Lapangan Selesai?'}
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
                  {posIndex === 1 && 'Pastikan berkas telah dicek fisik sebelum memindahkan pasukan ke Pos 02 (Photoshoot).'}
                  {posIndex === 2 && 'Petugas memastikan sesi foto selesai sebelum mengalirkan kontingen ke Pos 03 (Persiapan).'}
                  {posIndex === 3 && 'Petugas mengalirkan pasukan dari Pos 03 menuju Pos 04 (Panggung Utama).'}
                  {posIndex === 4 && 'Klik "Pasukan Selesai Tampil" untuk menyelesaikan sesi dan membubarkan pasukan keluar arena.'}
                </p>
              </div>

              <button
                type="button"
                onClick={onFinishDP}
                disabled={dpStatus === 'COMPLETED'}
                className={dpStatus === 'BLOCKED' ? '' : 'pub-btn-coral'}
                style={{
                  padding: '0.7rem 1.4rem',
                  fontSize: '0.925rem',
                  opacity: dpStatus === 'COMPLETED' ? 0.6 : 1,
                  cursor: dpStatus === 'COMPLETED' ? 'not-allowed' : 'pointer',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: dpStatus === 'BLOCKED' ? '#FEF2F2' : undefined,
                  color: dpStatus === 'BLOCKED' ? '#DC2626' : undefined,
                  border: dpStatus === 'BLOCKED' ? '2px solid #EF4444' : undefined,
                  borderRadius: '10px',
                  boxShadow: dpStatus === 'BLOCKED' ? '0 2px 8px rgba(239, 68, 68, 0.2)' : undefined,
                  transition: 'all 0.15s ease',
                }}
              >
                {dpStatus === 'BLOCKED' ? <Lock size={18} /> : <CheckCircle2 size={18} />}
                <span>
                  {dpStatus === 'BLOCKED'
                    ? posIndex === 1
                      ? '🔒 Tertahan (Pos 02 Sedang Penuh)'
                      : posIndex === 2
                      ? '🔒 Tertahan (Pos 03 Sedang Penuh)'
                      : posIndex === 3
                      ? '🔒 Tertahan (Pos 04 Masih Tampil)'
                      : '🔒 Tertahan'
                    : posIndex === 1
                    ? 'Selesai Verifikasi & Alirkan ke Pos DP 2'
                    : posIndex === 2
                    ? 'Selesai di Pos 2 & Alirkan ke Pos 03 (Persiapan) ->'
                    : posIndex === 3
                    ? 'Selesai di Pos 3 & Alirkan ke Pos 04 (Panggung) ->'
                    : 'Pasukan Selesai Tampil'}
                </span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: PRATINJAU DOKUMEN HIGH-RESOLUTION                     */}
      {/* ============================================================== */}
      {previewDoc && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem',
          }}
          onClick={() => setPreviewDoc(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '820px',
              maxHeight: '92vh',
              borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid var(--pub-line)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--pub-line)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--pub-surface)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.725rem', color: 'var(--pub-coral)', fontWeight: 800, textTransform: 'uppercase' }}>
                  Pratinjau Berkas Resmi · Pos DP 1
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0.15rem 0 0 0' }}>
                  {previewDoc.title}
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>
                  Kontingen: {previewDoc.teamName} ({previewDoc.school})
                </div>
              </div>

              {/* Controls Toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <button
                  type="button"
                  onClick={() => setPreviewZoom((z) => Math.min(z + 0.15, 1.6))}
                  title="Perbesar"
                  style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid var(--pub-line)', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewZoom((z) => Math.max(z - 0.15, 0.7))}
                  title="Perkecil"
                  style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid var(--pub-line)', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => openInNewTab(previewDoc.title, previewDoc.teamName, previewDoc.school)}
                  title="Buka Lembar Penuh & Cetak"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid var(--pub-line)', backgroundColor: 'var(--pub-canvas)', color: 'var(--pub-ink)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  <Printer size={13} />
                  <span>Cetak / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--pub-muted)', cursor: 'pointer', padding: '0.35rem', marginLeft: '0.5rem' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content Preview */}
            <div style={{ padding: '2rem', overflowY: 'auto', backgroundColor: '#0F172A', display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  width: '100%',
                  maxWidth: '680px',
                  padding: '2.5rem',
                  borderRadius: '6px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                  transform: `scale(${previewZoom})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease',
                }}
                dangerouslySetInnerHTML={{
                  __html: renderDocHtml(previewDoc.title, previewDoc.teamName, previewDoc.school),
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: SEMUA DOKUMEN PESERTA EVENT (VERIFIKASI POS DOKUMEN) */}
      {/* ============================================================== */}
      {showAllDocsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1.5rem',
          }}
          onClick={() => setShowAllDocsModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '960px',
              maxHeight: '90vh',
              borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid var(--pub-line)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.75rem',
                borderBottom: '1px solid var(--pub-line)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--pub-surface)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.725rem', color: 'var(--pub-teal)', fontWeight: 800, textTransform: 'uppercase' }}>
                  Akses Khusus Operator Dokumen · Pos DP 1
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0.2rem 0 0 0' }}>
                  Seluruh Berkas Pendaftaran Peserta Lomba
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
                  Verifikasi silang berkas administratif seluruh kontingen peserta.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAllDocsModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--pub-muted)', cursor: 'pointer', padding: '0.5rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Bar */}
            <div style={{ padding: '0.85rem 1.75rem', backgroundColor: 'var(--pub-canvas)', borderBottom: '1px solid var(--pub-line)' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--pub-muted)' }} />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama tim, sekolah, atau nomor urut..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.25rem', fontSize: '0.825rem' }}
                />
              </div>
            </div>

            {/* Table of All Participants' Documents */}
            <div style={{ padding: '1.25rem 1.75rem', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--pub-line)', textAlign: 'left' }}>
                    <th style={{ padding: '0.65rem 0.75rem', color: 'var(--pub-muted)', fontWeight: 700 }}>NO</th>
                    <th style={{ padding: '0.65rem 0.75rem', color: 'var(--pub-muted)', fontWeight: 700 }}>KONTINGEN & SEKOLAH</th>
                    <th style={{ padding: '0.65rem 0.75rem', color: 'var(--pub-muted)', fontWeight: 700 }}>STATUS BERKAS</th>
                    <th style={{ padding: '0.65rem 0.75rem', color: 'var(--pub-muted)', fontWeight: 700 }}>DAFTAR DOKUMEN</th>
                    <th style={{ padding: '0.65rem 0.75rem', color: 'var(--pub-muted)', fontWeight: 700, textAlign: 'center' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.map((p, idx) => (
                    <tr key={p.id || idx} style={{ borderBottom: '1px solid var(--pub-line)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{p.queueNumber || `0${idx + 1}`}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: 800, color: 'var(--pub-ink)' }}>{p.teamName}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--pub-muted)' }}>{p.schoolName}</div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span
                          style={{
                            backgroundColor: p.status === 'VALIDATED' ? 'var(--pub-teal-light)' : '#FEF3C7',
                            color: p.status === 'VALIDATED' ? 'var(--pub-teal)' : '#B45309',
                            padding: '0.2rem 0.55rem',
                            borderRadius: 'var(--pub-radius-pill)',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                          }}
                        >
                          {p.status === 'VALIDATED' ? 'LENGKAP & SAH' : 'PERLU REVISI'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span style={{ fontSize: '0.725rem', color: 'var(--pub-ink)' }}>✓ Surat Rekomendasi Kepsek</span>
                          <span style={{ fontSize: '0.725rem', color: 'var(--pub-ink)' }}>✓ Scan Kartu Pelajar 16 Anggota</span>
                          <span style={{ fontSize: '0.725rem', color: 'var(--pub-ink)' }}>✓ Formulir & Pakta Integritas</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAllDocsModal(false);
                            setPreviewZoom(1);
                            setPreviewDoc({
                              title: 'Surat Tugas & Berkas Pendaftaran',
                              teamName: p.teamName,
                              school: p.schoolName,
                            });
                          }}
                          className="pub-btn-outline"
                          style={{ fontSize: '0.725rem', padding: '0.3rem 0.6rem', fontWeight: 700 }}
                        >
                          Buka Berkas
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
