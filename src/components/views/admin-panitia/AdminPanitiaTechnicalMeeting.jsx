import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  FileText,
  Link,
  Copy,
  ExternalLink,
  Upload,
  Trash2,
  Download,
  Check,
  AlertCircle,
  Calendar,
  Clock,
  Shield,
  FileCheck,
  FileType,
  Sparkles,
  Eye,
  Info,
} from 'lucide-react';

const STORAGE_KEY_TM_INFO = 'kompas_tm_meeting_info';
const STORAGE_KEY_TM_DOCS = 'kompas_tm_documents';
const STORAGE_KEY_TM_NOTES = 'kompas_tm_summary_notes';

// Initial Mock Data untuk TM
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

export default function AdminPanitiaTechnicalMeeting() {
  // State Card 1: Zoom Info
  const [meetingInfo, setMeetingInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TM_INFO);
      return saved ? JSON.parse(saved) : DEFAULT_TM_INFO;
    } catch {
      return DEFAULT_TM_INFO;
    }
  });

  // State Card 2: Documents (PDF & Word)
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TM_DOCS);
      return saved ? JSON.parse(saved) : DEFAULT_DOCUMENTS;
    } catch {
      return DEFAULT_DOCUMENTS;
    }
  });

  // State Card 2: Summary Notes
  const [summaryNotes, setSummaryNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TM_NOTES);
      return saved ? saved : DEFAULT_SUMMARY_NOTES;
    } catch {
      return DEFAULT_SUMMARY_NOTES;
    }
  });

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Handlers Card 1 (Zoom Meeting)
  const handleSaveMeetingInfo = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY_TM_INFO, JSON.stringify(meetingInfo));
      showToast('Informasi & Tautan Zoom Technical Meeting berhasil disimpan dan disinkronkan ke peserta!');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan ke penyimpanan lokal.');
    }
  };

  const handleCopyInvitation = () => {
    const text = `*UNDANGAN RESMI TECHNICAL MEETING LKBB 2026*
Platform: ${meetingInfo.platform}
Tautan: ${meetingInfo.zoomUrl}
Meeting ID: ${meetingInfo.meetingId}
Passcode: ${meetingInfo.passcode}
Waktu: ${meetingInfo.date} pukul ${meetingInfo.time} ${meetingInfo.timezone}

*Ketentuan Akun Peserta:*
${meetingInfo.instructions}

_Panitia Pelaksana LKBB Paskibra 2026_`;

    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      showToast('Teks undangan lengkap berhasil disalin ke clipboard! Siap dibagikan ke WhatsApp grup.');
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  const handleTestLink = () => {
    if (!meetingInfo.zoomUrl) {
      alert('Tautan Zoom belum diisi.');
      return;
    }
    window.open(meetingInfo.zoomUrl, '_blank', 'noopener,noreferrer');
  };

  // 2. Handlers Card 2 (Documents Upload & Notes)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const newDocs = [];

    for (const file of files) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        alert(`File "${file.name}" tidak didukung. Harap upload file berformat PDF (.pdf) atau Word (.docx / .doc).`);
        continue;
      }

      // Hitung ukuran readable
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
      const sizeStr = file.size > 1024 * 1024 ? `${sizeInMb} MB` : `${Math.round(file.size / 1024)} KB`;

      newDocs.push({
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: file.name,
        ext: ext,
        size: sizeStr,
        uploadedAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }) + ' WIB',
        uploader: 'Admin Panitia',
        isPublished: true,
      });
    }

    if (newDocs.length > 0) {
      const updated = [...documents, ...newDocs];
      setDocuments(updated);
      localStorage.setItem(STORAGE_KEY_TM_DOCS, JSON.stringify(updated));
      showToast(`${newDocs.length} dokumen hasil TM berhasil ditambahkan!`);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteDocument = (id, name) => {
    if (!window.confirm(`Hapus dokumen notulensi "${name}"?`)) return;
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    localStorage.setItem(STORAGE_KEY_TM_DOCS, JSON.stringify(updated));
    showToast(`Dokumen "${name}" berhasil dihapus.`);
  };

  const handleSaveNotes = () => {
    try {
      localStorage.setItem(STORAGE_KEY_TM_NOTES, summaryNotes);
      showToast('Poin-poin kesepakatan dan notulensi TM berhasil disimpan!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateDownload = (doc) => {
    showToast(`Mengunduh dokumen: ${doc.name} (${doc.size})`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', fontFamily: 'var(--font-sans)' }}>
      {/* 1. Header Banner */}
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
                backgroundColor: meetingInfo.zoomUrl ? 'var(--emerald-light)' : 'var(--amber-light)',
                color: meetingInfo.zoomUrl ? 'var(--emerald-text)' : 'var(--amber-text)',
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
              <Video size={12} />
              {meetingInfo.zoomUrl ? 'LINK TM TERHUBUNG' : 'LINK BELUM DIKONFIGURASI'}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-slate)' }}>
              {documents.length} Dokumen Notulensi Terlampir (PDF/Word)
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
            Technical Meeting (TM) & Publikasi Hasil
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: 0, maxWidth: '680px' }}>
            Atur tautan video conference Zoom resmi untuk pertemuan teknis kontingen, dan unggah berkas berita acara hasil kesepakatan lomba (PDF & Word).
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={handleCopyInvitation}
            className="pub-btn-outline"
            style={{
              fontSize: '0.8125rem',
              padding: '0.55rem 1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 600,
            }}
          >
            {isCopied ? <Check size={14} style={{ color: 'var(--emerald)' }} /> : <Copy size={14} />}
            <span>{isCopied ? 'Tersalin!' : 'Salin Undangan WA'}</span>
          </button>

          {meetingInfo.zoomUrl && (
            <button
              type="button"
              onClick={handleTestLink}
              className="pub-btn-coral"
              style={{
                fontSize: '0.8125rem',
                padding: '0.55rem 1.15rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 600,
              }}
            >
              <ExternalLink size={14} />
              <span>Buka Room Zoom</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div
          style={{
            backgroundColor: 'var(--emerald-light)',
            color: 'var(--emerald-text)',
            border: '1px solid var(--emerald)',
            borderRadius: '8px',
            padding: '0.75rem 1.15rem',
            fontSize: '0.825rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          }}
        >
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* CARD 1 (ATAS): TAUTAN & JADWAL ZOOM TECHNICAL MEETING   */}
      {/* ======================================================== */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          padding: '1.75rem',
        }}
      >
        {/* Card Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--pub-line)',
            paddingBottom: '1rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--pub-coral-pale)',
                color: 'var(--pub-coral-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Video size={20} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                1. Tautan & Ruang Pertemuan Virtual (Zoom Meeting)
              </h3>
              <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: '0.15rem 0 0 0' }}>
                Letakkan link Zoom untuk dibagikan secara otomatis ke portal dashboard seluruh peserta lomba.
              </p>
            </div>
          </div>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: 'var(--pub-sand)',
              color: 'var(--pub-navy)',
              padding: '0.25rem 0.65rem',
              borderRadius: '6px',
            }}
          >
            Otomatis Muncul di Akun Peserta
          </span>
        </div>

        {/* Card Form */}
        <form onSubmit={handleSaveMeetingInfo} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Input Kolom Link Zoom Utama */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--slate-text)', marginBottom: '0.4rem' }}>
              URL Tautan Zoom Meeting Resmi <span style={{ color: 'var(--crimson)' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--pub-muted)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Link size={16} />
                </span>
                <input
                  type="url"
                  placeholder="https://zoom.us/j/1234567890?pwd=xxxx"
                  value={meetingInfo.zoomUrl}
                  onChange={(e) => setMeetingInfo({ ...meetingInfo, zoomUrl: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.5rem',
                    fontSize: '0.875rem',
                    borderRadius: '8px',
                    border: '1.5px solid var(--pub-coral)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--pub-ink)',
                    fontFamily: 'monospace',
                  }}
                />
              </div>

              {meetingInfo.zoomUrl && (
                <button
                  type="button"
                  onClick={handleTestLink}
                  className="pub-btn-outline"
                  style={{ padding: '0 1rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
                >
                  <ExternalLink size={14} />
                  <span>Uji Link</span>
                </button>
              )}
            </div>
            <span style={{ fontSize: '0.725rem', color: 'var(--pub-muted)', marginTop: '0.3rem', display: 'block' }}>
              Pastikan tautan menyertakan sandi (embedded passcode) agar peserta dapat langsung bergabung dengan 1 klik.
            </span>
          </div>

          {/* Grid Detail Tambahan (Meeting ID, Passcode, Tanggal, Jam) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, color: 'var(--slate-text)', marginBottom: '0.3rem' }}>
                Platform Provider
              </label>
              <select
                value={meetingInfo.platform}
                onChange={(e) => setMeetingInfo({ ...meetingInfo, platform: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.825rem',
                  borderRadius: '6px',
                  border: '1px solid var(--pub-line)',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="Zoom Meeting">Zoom Meeting (Disarankan)</option>
                <option value="Google Meet">Google Meet</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, color: 'var(--slate-text)', marginBottom: '0.3rem' }}>
                Meeting ID
              </label>
              <input
                type="text"
                placeholder="Contoh: 892 4110 9928"
                value={meetingInfo.meetingId}
                onChange={(e) => setMeetingInfo({ ...meetingInfo, meetingId: e.target.value })}
                className="tabular-nums"
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.825rem',
                  borderRadius: '6px',
                  border: '1px solid var(--pub-line)',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, color: 'var(--slate-text)', marginBottom: '0.3rem' }}>
                Passcode / Kata Sandi
              </label>
              <input
                type="text"
                placeholder="Contoh: LKBB2026"
                value={meetingInfo.passcode}
                onChange={(e) => setMeetingInfo({ ...meetingInfo, passcode: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.825rem',
                  borderRadius: '6px',
                  border: '1px solid var(--pub-line)',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'monospace',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, color: 'var(--slate-text)', marginBottom: '0.3rem' }}>
                Tanggal Pelaksanaan
              </label>
              <input
                type="date"
                value={meetingInfo.date}
                onChange={(e) => setMeetingInfo({ ...meetingInfo, date: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.825rem',
                  borderRadius: '6px',
                  border: '1px solid var(--pub-line)',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, color: 'var(--slate-text)', marginBottom: '0.3rem' }}>
                Jam Mulai (WIB)
              </label>
              <input
                type="time"
                value={meetingInfo.time}
                onChange={(e) => setMeetingInfo({ ...meetingInfo, time: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.825rem',
                  borderRadius: '6px',
                  border: '1px solid var(--pub-line)',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>
          </div>

          {/* Instruksi Khusus Masuk Zoom */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, color: 'var(--slate-text)', marginBottom: '0.3rem' }}>
              Catatan & Format Nama Akun untuk Kontingen Peserta
            </label>
            <textarea
              rows={2}
              value={meetingInfo.instructions}
              onChange={(e) => setMeetingInfo({ ...meetingInfo, instructions: e.target.value })}
              placeholder="Petunjuk format nama display akun Zoom, toleransi keterlambatan, kuota delegasi..."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                fontSize: '0.825rem',
                borderRadius: '8px',
                border: '1px solid var(--pub-line)',
                backgroundColor: '#FFFFFF',
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <button
              type="submit"
              className="pub-btn-coral"
              style={{
                fontSize: '0.85rem',
                padding: '0.6rem 1.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 700,
              }}
            >
              <Check size={16} />
              <span>Simpan Pengaturan Link TM</span>
            </button>
          </div>
        </form>
      </div>

      {/* ======================================================== */}
      {/* CARD 2 (BAWAH): HASIL TM & NOTULENSI (SUPPORT PDF & WORD) */}
      {/* ======================================================== */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          padding: '1.75rem',
        }}
      >
        {/* Card Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--pub-line)',
            paddingBottom: '1rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#FEF3C7',
                color: '#B45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                2. Berkas Notulensi & Hasil Kesepakatan TM
              </h3>
              <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: '0.15rem 0 0 0' }}>
                Unggah berkas berita acara hasil undian urutan tampil dan notulensi resmi lomba (Mendukung file <strong>PDF</strong> dan <strong>Word .docx / .doc</strong>).
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span
              style={{
                fontSize: '0.725rem',
                fontWeight: 700,
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
              }}
            >
              PDF
            </span>
            <span
              style={{
                fontSize: '0.725rem',
                fontWeight: 700,
                backgroundColor: '#E0F2FE',
                color: '#0369A1',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
              }}
            >
              WORD (.DOCX)
            </span>
          </div>
        </div>

        {/* Interactive Dropzone Area */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            style={{ display: 'none' }}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed var(--pub-coral)',
              backgroundColor: 'var(--pub-canvas)',
              borderRadius: '12px',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--pub-coral-pale)',
                color: 'var(--pub-coral-dark)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem',
              }}
            >
              <Upload size={22} />
            </div>
            <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
              Klik untuk memilih dokumen notulensi, atau seret & lepas file ke sini
            </div>
            <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: '0.35rem 0 0 0' }}>
              Mendukung berkas <strong>PDF (.pdf)</strong> dan <strong>Microsoft Word (.docx, .doc)</strong> hingga 25 MB per dokumen.
            </p>
          </div>
        </div>

        {/* Daftar Dokumen yang Telah Diupload */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-text)' }}>
              Dokumen Notulensi Terlampir ({documents.length} Berkas)
            </span>
            <span style={{ fontSize: '0.725rem', color: 'var(--pub-muted)' }}>
              Status: Terpublikasi ke Dashboard Peserta
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {documents.length > 0 ? (
              documents.map((doc) => {
                const isPdf = doc.ext === 'pdf';
                return (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid var(--pub-line)',
                      backgroundColor: '#FFFFFF',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
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
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pub-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {doc.name}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--pub-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                          <span>Ukuran: <strong style={{ color: 'var(--pub-ink)' }}>{doc.size}</strong></span>
                          <span>•</span>
                          <span>Diunggah: {doc.uploadedAt}</span>
                          <span>•</span>
                          <span>Oleh: {doc.uploader}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <button
                        type="button"
                        onClick={() => handleSimulateDownload(doc)}
                        className="pub-btn-outline"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        title="Unduh Berkas"
                      >
                        <Download size={13} />
                        <span>Unduh</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(doc.id, doc.name)}
                        className="pub-btn-outline"
                        style={{ padding: '0.35rem 0.55rem', color: 'var(--crimson)' }}
                        title="Hapus Dokumen"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', backgroundColor: 'var(--pub-canvas)', borderRadius: '10px', color: 'var(--pub-muted)', fontSize: '0.825rem' }}>
                Belum ada berkas notulensi yang diunggah. Silakan upload file PDF atau Word di atas.
              </div>
            )}
          </div>
        </div>

        {/* Textarea Poin-Poin Notulensi Cepat */}
        <div style={{ borderTop: '1px solid var(--pub-line)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--slate-text)' }}>
              Ringkasan Poin-Poin Utama Notulensi TM (Quick Notes)
            </label>
            <span style={{ fontSize: '0.725rem', color: 'var(--pub-muted)' }}>
              Tampil langsung sebagai ringkasan di halaman jadwal peserta
            </span>
          </div>
          <textarea
            rows={5}
            value={summaryNotes}
            onChange={(e) => setSummaryNotes(e.target.value)}
            placeholder="Tuliskan butir-butir kesepakatan TM seperti durasi waktu panggung, toleransi apel pembukaan, aturan danton..."
            style={{
              width: '100%',
              padding: '0.75rem 0.85rem',
              fontSize: '0.825rem',
              borderRadius: '8px',
              border: '1px solid var(--pub-line)',
              backgroundColor: '#FFFFFF',
              lineHeight: 1.6,
              fontFamily: 'monospace',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={handleSaveNotes}
              className="pub-btn-coral"
              style={{
                fontSize: '0.85rem',
                padding: '0.6rem 1.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 700,
              }}
            >
              <Check size={16} />
              <span>Simpan & Publikasikan Notulensi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
