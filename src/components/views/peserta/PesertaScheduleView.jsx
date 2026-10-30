import React, { useState, useEffect } from 'react';
import {
  Video,
  FileText,
  Link as LinkIcon,
  Copy,
  ExternalLink,
  Download,
  Check,
  Clock,
  Info,
  FileCheck,
} from 'lucide-react';

const STORAGE_KEY_TM_INFO = 'kompas_tm_meeting_info';
const STORAGE_KEY_TM_DOCS = 'kompas_tm_documents';
const STORAGE_KEY_TM_NOTES = 'kompas_tm_summary_notes';

const DEFAULT_TM_INFO = {
  platform: 'Zoom Meeting',
  zoomUrl: 'https://zoom.us/j/89241109928?pwd=kompasLKBB2026official',
  meetingId: '892 4110 9928',
  passcode: 'LKBB2026',
  date: '2026-11-14',
  time: '13:30',
  timezone: 'WIB',
  instructions: 'Format nama akun Zoom: [No Urut] - [Nama Sekolah] - [Nama Official/Danton]. Harap memasuki ruang virtual 15 menit sebelum acara dimulai. Setiap kontingen maksimal mengirimkan 2 akun delegasi.',
  isPublished: true,
};

const DEFAULT_DOCUMENTS = [
  {
    id: 'doc-1',
    name: 'Berita_Acara_Hasil_Pengundian_Nomor_Urut_TM.pdf',
    ext: 'pdf',
    size: '2.4 MB',
    uploadedAt: '24 Okt 2026, 09:15 WIB',
    uploader: 'Sekretariat Panitia',
    isPublished: true,
  },
  {
    id: 'doc-2',
    name: 'Tata_Tertib_dan_Petunjuk_Teknis_Final_LKBB.docx',
    ext: 'docx',
    size: '1.2 MB',
    uploadedAt: '24 Okt 2026, 09:30 WIB',
    uploader: 'Sie Perlombaan',
    isPublished: true,
  },
];

const DEFAULT_SUMMARY_NOTES = `1. Batas waktu tampil peleton maksimal 10 menit (Peluit 1: Mulai panggung, Peluit 2: Peringatan sisa 2 menit, Peluit 3: Waktu habis).
2. Toleransi keterlambatan kehadiran di DP 1 (Cek Dokumen & Fisik) maksimal 5 menit dari jadwal tampil.
3. Seluruh nomor urut undian tampil bersifat final dan mengikat sesuai Berita Acara terlampir.
4. Musik pengiring variasi & formasi wajib diserahkan ke meja operator sound paling lambat saat gladi kotor H-1.
5. Kostum Danton wajib mengenakan PDH resmi pangkalan satuan masing-masing.`;

export default function PesertaScheduleView() {
  // Ambil data TM yang diatur oleh Admin Panitia di localStorage
  const [meetingInfo, setMeetingInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TM_INFO);
      return saved ? JSON.parse(saved) : DEFAULT_TM_INFO;
    } catch {
      return DEFAULT_TM_INFO;
    }
  });

  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TM_DOCS);
      return saved ? JSON.parse(saved) : DEFAULT_DOCUMENTS;
    } catch {
      return DEFAULT_DOCUMENTS;
    }
  });

  const [summaryNotes, setSummaryNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TM_NOTES);
      return saved !== null ? saved : DEFAULT_SUMMARY_NOTES;
    } catch {
      return DEFAULT_SUMMARY_NOTES;
    }
  });

  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync dengan perubahan yang dilakukan admin jika ada event storage
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedInfo = localStorage.getItem(STORAGE_KEY_TM_INFO);
        if (savedInfo) setMeetingInfo(JSON.parse(savedInfo));

        const savedDocs = localStorage.getItem(STORAGE_KEY_TM_DOCS);
        if (savedDocs) setDocuments(JSON.parse(savedDocs));

        const savedNotes = localStorage.getItem(STORAGE_KEY_TM_NOTES);
        if (savedNotes !== null) setSummaryNotes(savedNotes);
      } catch (err) {
        console.error('Failed to sync TM storage:', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = () => {
    if (!meetingInfo?.zoomUrl) return;
    navigator.clipboard.writeText(meetingInfo.zoomUrl).then(() => {
      setCopied(true);
      showToast('Tautan Zoom berhasil disalin ke clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = (doc) => {
    showToast(`Mengunduh berkas: ${doc.name} (${doc.size})`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-sans)', paddingBottom: '3rem' }}>
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
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <Check size={18} color="var(--pub-teal)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.75rem 2rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
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
          AGENDA & TECHNICAL MEETING
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.65rem',
            fontWeight: 800,
            color: 'var(--pub-ink)',
            margin: '0.4rem 0 0.35rem 0',
          }}
        >
          Jadwal & Agenda TM
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--pub-muted)', margin: 0, maxWidth: '700px' }}>
          Akses tautan resmi pertemuan teknis virtual (Zoom) dan unduh dokumen hasil notulensi serta berita acara pengundian nomor urut lomba yang diterbitkan oleh panitia.
        </p>
      </div>

      {/* ================================================================= */}
      {/* 1. BAGIAN LINK ZOOM MEETING (FIELD TAUTAN & RUANG PERTEMUAN)      */}
      {/* ================================================================= */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.75rem 2rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(201, 75, 60, 0.12)',
                color: 'var(--pub-coral)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Video size={22} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                Tautan Zoom Technical Meeting
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--pub-muted)' }}>
                Ditetapkan resmi oleh Admin Panitia Pelaksana
              </div>
            </div>
          </div>

          <span
            style={{
              backgroundColor: meetingInfo?.zoomUrl ? 'var(--pub-teal-light)' : 'rgba(217, 119, 6, 0.15)',
              color: meetingInfo?.zoomUrl ? 'var(--pub-teal)' : '#B45309',
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: meetingInfo?.zoomUrl ? 'var(--pub-teal)' : '#B45309',
              }}
            />
            {meetingInfo?.zoomUrl ? 'LINK TM TERSEDIA' : 'MENUNGGU LINK PANITIA'}
          </span>
        </div>

        {/* Field Berisi Link Zoom (Simpel & Praktis Sesuai Request) */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--pub-ink)',
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
            }}
          >
            Link / URL Zoom Meeting
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: '260px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                backgroundColor: 'var(--pub-canvas)',
                border: '1.5px solid var(--pub-line)',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem',
              }}
            >
              <LinkIcon size={16} color="var(--pub-coral)" style={{ flexShrink: 0 }} />
              <input
                type="text"
                readOnly
                value={meetingInfo?.zoomUrl || 'Belum ada link Zoom yang diset oleh panitia.'}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: meetingInfo?.zoomUrl ? 'var(--pub-ink)' : 'var(--pub-muted)',
                  fontFamily: 'monospace',
                }}
              />
            </div>

            {/* Tombol Salin */}
            <button
              type="button"
              onClick={handleCopyLink}
              disabled={!meetingInfo?.zoomUrl}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'var(--pub-canvas)',
                border: '1px solid var(--pub-line)',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--pub-ink)',
                cursor: meetingInfo?.zoomUrl ? 'pointer' : 'not-allowed',
                opacity: meetingInfo?.zoomUrl ? 1 : 0.6,
              }}
            >
              {copied ? <Check size={14} color="var(--pub-teal)" /> : <Copy size={14} />}
              <span>{copied ? 'Tersalin' : 'Salin Link'}</span>
            </button>

            {/* Tombol Buka Ruang Zoom */}
            {meetingInfo?.zoomUrl && (
              <a
                href={meetingInfo.zoomUrl}
                target="_blank"
                rel="noreferrer"
                className="pub-btn-coral"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  borderRadius: '8px',
                }}
              >
                <span>Buka Room Zoom</span>
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Detail Pelaksanaan TM (Tanggal, Jam, ID, Passcode) */}
        <div
          style={{
            backgroundColor: 'var(--pub-canvas)',
            borderRadius: '10px',
            border: '1px solid var(--pub-line)',
            padding: '1rem 1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: meetingInfo?.instructions ? '1rem' : 0,
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
              Waktu Pertemuan
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--pub-ink)', marginTop: '0.15rem' }}>
              {meetingInfo?.date ? new Date(meetingInfo.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Sabtu, 14 November 2026'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pub-coral)', fontWeight: 700, marginTop: '0.1rem' }}>
              {meetingInfo?.time || '13:30'} {meetingInfo?.timezone || 'WIB'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
              Meeting ID
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--pub-ink)', marginTop: '0.15rem', fontFamily: 'monospace' }}>
              {meetingInfo?.meetingId || '892 4110 9928'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
              Passcode
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--pub-ink)', marginTop: '0.15rem', fontFamily: 'monospace' }}>
              {meetingInfo?.passcode || 'LKBB2026'}
            </div>
          </div>
        </div>

        {/* Petunjuk Format Akun Peserta jika ada */}
        {meetingInfo?.instructions && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(217, 119, 6, 0.08)',
              border: '1px solid rgba(217, 119, 6, 0.25)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
            }}
          >
            <Info size={16} color="#B45309" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.775rem', color: '#92400E', lineHeight: 1.45 }}>
              <strong>Petunjuk Delegasi:</strong> {meetingInfo.instructions}
            </div>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* 2. BAGIAN HASIL TM & NOTULENSI (FILE PDF/WORD & RINGKASAN POIN)   */}
      {/* ================================================================= */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.75rem 2rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--pub-line)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(5, 150, 105, 0.12)',
                color: 'var(--pub-teal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileCheck size={22} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                Hasil & Notulensi Technical Meeting
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--pub-muted)' }}>
                Dokumen berita acara dan kesepakatan juknis resmi lomba
              </div>
            </div>
          </div>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              backgroundColor: documents.length > 0 ? 'var(--pub-teal-light)' : '#F1F5F9',
              color: documents.length > 0 ? 'var(--pub-teal)' : '#64748B',
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
            }}
          >
            {documents.length > 0 ? `${documents.length} Dokumen Tersedia` : 'Belum Ada Dokumen'}
          </span>
        </div>

        {/* List Dokumen Notulensi (PDF / Word) */}
        <div style={{ marginBottom: summaryNotes ? '1.5rem' : 0 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--pub-ink)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Berkas Unduhan Resmi
          </div>

          {documents.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {documents.map((doc) => {
                const isPdf = doc.ext?.toLowerCase() === 'pdf' || doc.name?.endsWith('.pdf');

                return (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.9rem 1.15rem',
                      borderRadius: '10px',
                      border: '1px solid var(--pub-line)',
                      backgroundColor: 'var(--pub-canvas)',
                      flexWrap: 'wrap',
                      gap: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          backgroundColor: isPdf ? '#FEE2E2' : '#E0F2FE',
                          color: isPdf ? '#DC2626' : '#0369A1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.7rem',
                          flexShrink: 0,
                        }}
                      >
                        {isPdf ? 'PDF' : 'DOC'}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--pub-ink)', wordBreak: 'break-word' }}>
                          {doc.name}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--pub-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                          <span>Ukuran: <strong style={{ color: 'var(--pub-ink)' }}>{doc.size}</strong></span>
                          <span>•</span>
                          <span>Diunggah: {doc.uploadedAt}</span>
                          <span>•</span>
                          <span>Oleh: {doc.uploader || 'Panitia'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tombol Unduh */}
                    <button
                      type="button"
                      onClick={() => handleDownload(doc)}
                      className="pub-btn-coral"
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.8rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Download size={14} />
                      <span>Unduh Berkas</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                padding: '2rem 1.5rem',
                textAlign: 'center',
                backgroundColor: 'var(--pub-canvas)',
                borderRadius: '10px',
                border: '1px dashed var(--pub-line)',
                color: 'var(--pub-muted)',
              }}
            >
              <FileText size={32} color="#94A3B8" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
                Belum ada berkas notulensi yang diterbitkan
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: '0.25rem 0 0 0' }}>
                Panitia akan mengunggah Berita Acara pengundian nomor urut dan Petunjuk Teknis final setelah sesi Technical Meeting selesai.
              </p>
            </div>
          )}
        </div>

        {/* Ringkasan Poin-Poin Notulensi TM jika tersedia */}
        {summaryNotes && (
          <div style={{ borderTop: '1px solid var(--pub-line)', paddingTop: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--pub-ink)', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
              Poin-Poin Ringkasan Hasil TM
            </div>
            <div
              style={{
                backgroundColor: 'var(--pub-canvas)',
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--pub-line)',
                fontSize: '0.825rem',
                color: 'var(--pub-ink)',
                lineHeight: 1.65,
                whiteSpace: 'pre-wrap',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {summaryNotes}
            </div>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* 3. JADWAL TAMPIL HARI H PELAKSANAAN LOMBA                         */}
      {/* ================================================================= */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.75rem 2rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(5, 150, 105, 0.12)',
              color: 'var(--pub-teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
              Jadwal Tampil Hari H Lomba
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--pub-muted)' }}>
              Minggu, 15 November 2026 · GOR Remaja Jakarta Timur
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { pos: 'Pos 1: Pemeriksaan Berkas & Administrasi', time: '07:30 WIB', status: 'Wajib Hadir Tepat Waktu' },
            { pos: 'Pos 2: Ruang Ganti & Kerapian Pasukan', time: '08:00 WIB', status: 'Siap Seragam Lengkap' },
            { pos: 'Pos 3: Daerah Persiapan Akhir (DP 3)', time: '08:15 WIB', status: 'Peregangan & Cek Formasi' },
            { pos: 'Pos 4 (Arena Lomba Utama): Waktu Tampil', time: '08:30 WIB', status: 'Nomor Urut Tampil #01' },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.25rem',
                borderRadius: '10px',
                border: '1px solid var(--pub-line)',
                backgroundColor: idx === 3 ? 'rgba(201, 75, 60, 0.05)' : 'var(--pub-canvas)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--pub-ink)' }}>{item.pos}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>{item.status}</div>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: idx === 3 ? 'var(--pub-coral)' : 'var(--pub-ink)',
                }}
              >
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
