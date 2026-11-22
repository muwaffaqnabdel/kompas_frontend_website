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
} from 'lucide-react';

// Helper generator pratinjau dokumen untuk Operator DP Dokumen
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
        Kepala Sekolah dengan ini menugaskan kontingen <strong>${teamName}</strong> beranggotakan 16 Personel Pasukan Utama untuk berkompetisi sportif pada LKBB Nasional 2026.
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
      <div>• Tanggal Unggah: 26 Oktober 2026</div>
      <div>• Pemeriksaan Fisik: Sesuai juknis dan format pendaftaran resmi.</div>
    </div>
  `;
}

export default function PanitiaDPWorkstation({
  notification,
  dpStatus,
  onFinishDP,
  teamName = 'PASKIBRA GARUDA SAKTI',
  school = 'SMAN 1 Jakarta',
  orderNumber = '01',
  members = 16,
  entryTime = '08:15 WIB',
  isDocCheckPos = true, // Khusus Pos Pengecekan Dokumen
  allParticipants = [],
}) {
  const [doc1Checked, setDoc1Checked] = useState(true);
  const [doc2Checked, setDoc2Checked] = useState(true);
  const [doc3Checked, setDoc3Checked] = useState(true);

  // State Modal Preview Dokumen
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewZoom, setPreviewZoom] = useState(1);

  // State Modal Semua Dokumen Peserta Event
  const [showAllDocsModal, setShowAllDocsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Default sample data jika allParticipants kosong
  const participantsList =
    allParticipants.length > 0
      ? allParticipants
      : [
          {
            id: 'part-1',
            queueNumber: '01',
            teamName: 'PASKIBRA GARUDA SAKTI',
            schoolName: 'SMAN 1 Jakarta',
            status: 'VALIDATED',
            docsCount: '3/3 Lengkap',
            documents: [
              { id: 'd1', title: 'File Surat Rekomendasi / Pengantar Sekolah', fileName: 'Surat_Rekomendasi_Kepsek_SMAN1.pdf', status: 'VERIFIED', size: '1.2 MB' },
              { id: 'd2', title: 'File Kartu Pelajar (Kolektif Anggota)', fileName: 'Kartu_Pelajar_16_Anggota.pdf', status: 'VERIFIED', size: '3.4 MB' },
              { id: 'd3', title: 'Formulir Pendaftaran & Pakta Integritas', fileName: 'Formulir_Pakta_Integritas_2026.docx', status: 'VERIFIED', size: '840 KB' },
            ],
          },
          {
            id: 'part-2',
            queueNumber: '02',
            teamName: 'PASKIBRA WIJAYA KUSUMA',
            schoolName: 'SMAN 28 Jakarta',
            status: 'VALIDATED',
            docsCount: '3/3 Lengkap',
            documents: [
              { id: 'd1', title: 'File Surat Rekomendasi / Pengantar Sekolah', fileName: 'Surat_Tugas_SMAN28.pdf', status: 'VERIFIED', size: '1.1 MB' },
              { id: 'd2', title: 'File Kartu Pelajar (Kolektif Anggota)', fileName: 'Kartu_Pelajar_SMAN28.pdf', status: 'VERIFIED', size: '2.8 MB' },
              { id: 'd3', title: 'Formulir Pendaftaran & Pakta Integritas', fileName: 'Pakta_Integritas_SMAN28.pdf', status: 'VERIFIED', size: '920 KB' },
            ],
          },
          {
            id: 'part-3',
            queueNumber: '03',
            teamName: 'PASKIBRA PATRIOT 70',
            schoolName: 'SMAN 70 Jakarta',
            status: 'REVISION_REQUIRED',
            docsCount: '2/3 Lengkap (1 Revisi)',
            documents: [
              { id: 'd1', title: 'File Surat Rekomendasi / Pengantar Sekolah', fileName: 'Surat_Tugas_SMAN70.pdf', status: 'VERIFIED', size: '1.4 MB' },
              { id: 'd2', title: 'File Kartu Pelajar (Kolektif Anggota)', fileName: 'Kartu_Pelajar_Scan.pdf', status: 'REVISION', size: '2.1 MB', note: 'Scan kartu pelajar buram' },
              { id: 'd3', title: 'Formulir Pendaftaran & Pakta Integritas', fileName: 'Pakta_Integritas_SMAN70.pdf', status: 'VERIFIED', size: '880 KB' },
            ],
          },
        ];

  const filteredParticipants = participantsList.filter(
    (p) =>
      p.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(p.queueNumber).includes(searchQuery)
  );

  // Helper buka di tab baru
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

      {/* Active Team Workstation Card */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.75rem',
          border: '1px solid var(--pub-line)',
          borderTop: '5px solid var(--pub-coral)',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--pub-coral)', letterSpacing: '0.08em' }}>
                TIM SEDANG DI POS INI
              </span>
              {isDocCheckPos && (
                <span
                  style={{
                    backgroundColor: 'var(--pub-teal-light)',
                    color: 'var(--pub-teal)',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.55rem',
                    borderRadius: 'var(--pub-radius-pill)',
                  }}
                >
                  POS DOKUMEN & BERKAS
                </span>
              )}
            </div>

            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0.2rem 0' }}>
              {teamName}
            </h2>
            <div style={{ fontSize: '0.875rem', color: 'var(--pub-muted)' }}>
              {school} · Nomor Urut Tampil: <strong className="tabular-nums" style={{ color: 'var(--pub-ink)' }}>{orderNumber}</strong> · {members} Anggota
            </div>
          </div>

          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.45rem' }}>
            <span
              style={{
                backgroundColor: dpStatus === 'COMPLETED' ? 'var(--pub-teal-light)' : dpStatus === 'BLOCKED' ? 'var(--pub-coral-pale)' : '#FEF3C7',
                color: dpStatus === 'COMPLETED' ? 'var(--pub-teal)' : dpStatus === 'BLOCKED' ? 'var(--pub-coral)' : '#B45309',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--pub-radius-pill)',
                fontSize: '0.75rem',
                fontWeight: 800,
              }}
            >
              STATUS: {dpStatus}
            </span>
            <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>
              Waktu Masuk Pos: <strong style={{ color: 'var(--pub-ink)' }}>{entryTime}</strong>
            </div>

            {/* Tombol Akses Khusus Petugas Pos Dokumen: Buka Semua Berkas Peserta Event */}
            {isDocCheckPos && (
              <button
                type="button"
                onClick={() => setShowAllDocsModal(true)}
                className="pub-btn-outline"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontWeight: 700,
                  color: 'var(--pub-teal)',
                  borderColor: 'var(--pub-teal)',
                  marginTop: '0.25rem',
                  cursor: 'pointer',
                }}
              >
                <Users size={13} />
                <span>Lihat Seluruh Dokumen Peserta Event</span>
              </button>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* KHUSUS POS DOKUMEN: DAFTAR BERKAS TIM AKTIF                    */}
        {/* ============================================================== */}
        {isDocCheckPos && (
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
                  Pemeriksaan Berkas Fisik Kontingen ({teamName})
                </h3>
              </div>
              <span style={{ fontSize: '0.725rem', color: 'var(--pub-teal)', fontWeight: 700 }}>
                ✓ Wajib divalidasi sebelum transisi ke DP 2
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
                      📄 Surat_Rekomendasi_Kepsek_SMAN1_Jakarta.pdf · 1.2 MB
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span
                    style={{
                      backgroundColor: 'var(--pub-teal-light)',
                      color: 'var(--pub-teal)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--pub-radius-pill)',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                    }}
                  >
                    TERVERIFIKASI
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setPreviewZoom(1);
                      setPreviewDoc({
                        title: 'Surat Tugas & Rekomendasi Kepala Sekolah',
                        teamName,
                        school,
                      });
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid var(--pub-coral)',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--pub-coral)',
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Eye size={12} />
                    <span>Lihat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openInNewTab('Surat Tugas & Rekomendasi Kepala Sekolah', teamName, school)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid var(--pub-line)',
                      backgroundColor: 'var(--pub-canvas)',
                      color: 'var(--pub-ink)',
                      fontSize: '0.725rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
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
                      📄 Kartu_Pelajar_Kolektif_SMAN1_16Anggota.pdf · 3.4 MB
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span
                    style={{
                      backgroundColor: 'var(--pub-teal-light)',
                      color: 'var(--pub-teal)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--pub-radius-pill)',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                    }}
                  >
                    TERVERIFIKASI
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setPreviewZoom(1);
                      setPreviewDoc({
                        title: 'Scan Kartu Pelajar Kolektif 16 Anggota',
                        teamName,
                        school,
                      });
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid var(--pub-coral)',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--pub-coral)',
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Eye size={12} />
                    <span>Lihat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openInNewTab('Scan Kartu Pelajar Kolektif 16 Anggota', teamName, school)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid var(--pub-line)',
                      backgroundColor: 'var(--pub-canvas)',
                      color: 'var(--pub-ink)',
                      fontSize: '0.725rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <ExternalLink size={12} />
                    <span>Tab Baru</span>
                  </button>
                </div>
              </div>

              {/* Berkas 3: Formulir & Pakta Integritas */}
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
                      📄 Formulir_Pendaftaran_Kontingen_Paskibra_2026.docx · 840 KB
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span
                    style={{
                      backgroundColor: 'var(--pub-teal-light)',
                      color: 'var(--pub-teal)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--pub-radius-pill)',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                    }}
                  >
                    TERVERIFIKASI
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setPreviewZoom(1);
                      setPreviewDoc({
                        title: 'Formulir Pendaftaran & Pakta Integritas Bermeterai',
                        teamName,
                        school,
                      });
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid var(--pub-coral)',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--pub-coral)',
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Eye size={12} />
                    <span>Lihat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openInNewTab('Formulir Pendaftaran & Pakta Integritas Bermeterai', teamName, school)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid var(--pub-line)',
                      backgroundColor: 'var(--pub-canvas)',
                      color: 'var(--pub-ink)',
                      fontSize: '0.725rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <ExternalLink size={12} />
                    <span>Tab Baru</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls for Operator DP */}
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
              Pemeriksaan Berkas Fisik & Kehadiran Anggota Selesai?
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
              {isDocCheckPos
                ? 'Pastikan berkas telah dicek fisik sebelum memindahkan pasukan ke Pos 02 (Photoshoot Pasukan).'
                : 'Sistem akan memvalidasi ketersediaan pos DP tujuan secara atomik (1 tim per pos).'}
            </p>
          </div>

          <button
            type="button"
            onClick={onFinishDP}
            disabled={dpStatus === 'COMPLETED'}
            className="pub-btn-coral"
            style={{
              padding: '0.7rem 1.4rem',
              fontSize: '0.925rem',
              opacity: dpStatus === 'COMPLETED' ? 0.6 : 1,
              cursor: dpStatus === 'COMPLETED' ? 'not-allowed' : 'pointer',
              fontWeight: 800,
            }}
          >
            <CheckCircle2 size={18} />
            <span>Selesai DP & Cek Tujuan</span>
          </button>
        </div>
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
              borderRadius: '16px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--pub-line)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div
              style={{
                backgroundColor: '#0F172A',
                color: '#F8FAFC',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '0.725rem', color: '#94A3B8', fontWeight: 600 }}>
                  Pratinjau Berkas Fisik Kontingen
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F8FAFC' }}>
                  {previewDoc.title}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setPreviewZoom((z) => Math.max(0.7, z - 0.1))}
                  style={{ background: '#334155', border: 'none', color: '#FFF', padding: '0.35rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#CBD5E1' }}>
                  {Math.round(previewZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewZoom((z) => Math.min(1.4, z + 0.1))}
                  style={{ background: '#334155', border: 'none', color: '#FFF', padding: '0.35rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => openInNewTab(previewDoc.title, previewDoc.teamName, previewDoc.school)}
                  style={{ background: '#059669', border: 'none', color: '#FFF', padding: '0.35rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  Tab Baru
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.35rem' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Document Paper Sheet */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '2rem',
                backgroundColor: '#F1F5F9',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  width: '100%',
                  maxWidth: '720px',
                  minHeight: '600px',
                  padding: '2.5rem',
                  borderRadius: '4px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
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
      {/* MODAL 2: SEMUA DOKUMEN PESERTA EVENT (KHUSUS OPERATOR DP 1)    */}
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
            padding: '1rem',
          }}
          onClick={() => setShowAllDocsModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '960px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              border: '1px solid var(--pub-line)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                  <span
                    style={{
                      backgroundColor: 'var(--pub-teal-light)',
                      color: 'var(--pub-teal)',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.55rem',
                      borderRadius: 'var(--pub-radius-pill)',
                    }}
                  >
                    HAK AKSES OPERATOR POS DOKUMEN
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                  Database Seluruh Dokumen Peserta Event
                </h3>
                <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: '0.15rem 0 0 0' }}>
                  Petugas Pos Pengecekan Dokumen dapat melihat dan memeriksa kelengkapan berkas seluruh kontingen pendaftar.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAllDocsModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pub-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Bar */}
            <div style={{ padding: '1rem 1.75rem', borderBottom: '1px solid var(--pub-line)', backgroundColor: 'var(--pub-canvas)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '0.55rem 0.85rem',
                  border: '1px solid var(--pub-line)',
                }}
              >
                <Search size={16} color="var(--pub-muted)" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan nama kontingen, asal sekolah, atau nomor urut..."
                  style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.825rem' }}
                />
              </div>
            </div>

            {/* Table of Participants */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.75rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pub-line)', color: 'var(--pub-muted)', textTransform: 'uppercase', fontSize: '0.725rem' }}>
                    <th style={{ padding: '0.65rem 0.75rem', width: '70px' }}>No. Urut</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Kontingen & Sekolah</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Status Berkas</th>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>Aksi Periksa</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--pub-line)' }}>
                      <td style={{ padding: '0.85rem 0.75rem', fontWeight: 800, fontFamily: 'monospace' }}>
                        {p.queueNumber}
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>
                        <div style={{ fontWeight: 800, color: 'var(--pub-ink)' }}>{p.teamName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>{p.schoolName}</div>
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>
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
                          {p.docsCount || (p.status === 'VALIDATED' ? '3/3 Lengkap' : 'Perlu Revisi')}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewZoom(1);
                            setPreviewDoc({
                              title: 'Surat Tugas & Rekomendasi Kepala Sekolah',
                              teamName: p.teamName,
                              school: p.schoolName,
                            });
                          }}
                          className="pub-btn-outline"
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            cursor: 'pointer',
                          }}
                        >
                          <Eye size={12} />
                          <span>Periksa Berkas</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1rem 1.75rem', borderTop: '1px solid var(--pub-line)', textAlign: 'right', backgroundColor: 'var(--pub-surface)' }}>
              <button
                type="button"
                onClick={() => setShowAllDocsModal(false)}
                className="pub-btn-coral"
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.825rem', fontWeight: 800, cursor: 'pointer' }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
