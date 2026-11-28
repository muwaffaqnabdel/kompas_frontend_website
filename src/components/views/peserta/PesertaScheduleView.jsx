import React, { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, Download, Loader2 } from 'lucide-react';

function formatDateLong(val) {
  if (!val) return '-';
  try {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return String(val);
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return String(val);
  }
}

function formatTimeHHMM(val) {
  if (!val) return '';
  try {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return '';
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} WIB`;
  } catch {
    return '';
  }
}

export default function PesertaScheduleView({ activeRegistration = null, onGoToEvents }) {
  const activeEventId = activeRegistration?.eventId || '';

  const [loading, setLoading] = useState(true);
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [summaryNotes, setSummaryNotes] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchTM = async () => {
      if (!activeEventId) {
        setMeetingInfo(null);
        setDocuments([]);
        setSummaryNotes('');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/peserta/technical-meeting?eventId=${encodeURIComponent(activeEventId)}`,
          { credentials: 'include' }
        );
        const data = await res.json();
        if (!cancelled && data.success) {
          setMeetingInfo(data.isPublished ? data.meetingInfo : null);
          setDocuments(Array.isArray(data.documents) ? data.documents : []);
          setSummaryNotes(data.isPublished ? data.summaryNotes || '' : '');
        }
      } catch (err) {
        console.warn('Gagal memuat Technical Meeting:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTM();
    return () => {
      cancelled = true;
    };
  }, [activeEventId]);

  const handleCopyLink = () => {
    if (!meetingInfo?.zoomUrl) return;
    navigator.clipboard.writeText(meetingInfo.zoomUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  if (!activeRegistration) {
    return (
      <div
        style={{
          maxWidth: '760px',
          margin: '1.5rem auto',
          backgroundColor: 'var(--pub-surface)',
          borderRadius: '18px',
          border: '1px solid var(--pub-line)',
          padding: '2.5rem 1.75rem',
          textAlign: 'center',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0 0 0.45rem 0' }}>
          Belum Ada Jadwal Event Aktif
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--pub-muted)', maxWidth: '460px', margin: '0 auto 1.25rem auto', lineHeight: 1.55 }}>
          Silakan daftar ke event lomba terlebih dahulu untuk melihat nomor urut tampil, jadwal Technical Meeting, dan dokumen notulensi resmi.
        </p>
        {onGoToEvents && (
          <button
            type="button"
            onClick={onGoToEvents}
            className="pub-btn-coral"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Cari & Daftar Event
          </button>
        )}
      </div>
    );
  }

  const queueLabel = activeRegistration.queueNumber
    ? `#${String(activeRegistration.queueNumber).padStart(2, '0')}`
    : 'Belum Ditetapkan';
  const perfTimeLabel = formatTimeHHMM(activeRegistration.performanceTime) || 'Menunggu penetapan panitia';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      {/* 1. Kartu Jadwal & Nomor Urut Tampil Tim Anda */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.5rem 1.7rem',
          border: '1px solid var(--pub-line)',
          borderLeft: '5px solid var(--pub-coral)',
          boxShadow: 'var(--pub-shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--pub-coral)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              JADWAL TAMPIL & NOMOR URUT RESMI
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.42rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0.2rem 0 0.2rem 0' }}>
              {activeRegistration.eventName}
            </h1>
            <p style={{ fontSize: '0.83rem', color: 'var(--pub-muted)', margin: 0 }}>
              {activeRegistration.schoolName} — <strong>{activeRegistration.teamName}</strong>
            </p>
          </div>
          <span
            style={{
              backgroundColor: activeRegistration.queueNumber ? 'var(--pub-teal-light)' : '#F1F5F9',
              color: activeRegistration.queueNumber ? 'var(--pub-teal)' : '#64748B',
              padding: '0.25rem 0.7rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 800,
            }}
          >
            STATUS: {activeRegistration.status}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
          <div style={{ backgroundColor: 'var(--pub-canvas)', border: '1px solid var(--pub-line)', borderRadius: '12px', padding: '0.95rem 1.1rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
              Nomor Urut Undian
            </div>
            <div className="tabular-nums" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.55rem', fontWeight: 900, color: activeRegistration.queueNumber ? 'var(--pub-coral)' : '#94A3B8', marginTop: '0.2rem' }}>
              {queueLabel}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--pub-canvas)', border: '1px solid var(--pub-line)', borderRadius: '12px', padding: '0.95rem 1.1rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
              Jam Tampil Pasukan
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--pub-ink)', marginTop: '0.35rem' }}>
              {perfTimeLabel}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--pub-canvas)', border: '1px solid var(--pub-line)', borderRadius: '12px', padding: '0.95rem 1.1rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
              Hari H & Lokasi Arena
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--pub-ink)', marginTop: '0.3rem' }}>
              {formatDateLong(activeRegistration.eventDate)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.12rem' }}>
              {activeRegistration.eventLocation || 'Lokasi menyusul'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Informasi Technical Meeting */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.5rem 1.7rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--pub-teal)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            TECHNICAL MEETING (TM)
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.18rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0.2rem 0 0 0' }}>
            Agenda & Tautan Pertemuan Teknis
          </h2>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--pub-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '0.83rem' }}>Memuat jadwal Technical Meeting...</span>
          </div>
        ) : !meetingInfo ? (
          <div
            style={{
              padding: '1.75rem 1.25rem',
              borderRadius: '12px',
              backgroundColor: 'var(--pub-canvas)',
              border: '1px dashed var(--pub-line)',
              textAlign: 'center',
              color: 'var(--pub-muted)',
              fontSize: '0.85rem',
              lineHeight: 1.55,
            }}
          >
            Jadwal, tautan rapat, dan dokumen Technical Meeting untuk event{' '}
            <strong style={{ color: 'var(--pub-ink)' }}>{activeRegistration.eventName}</strong> belum dipublikasikan oleh Admin Panitia. Silakan cek kembali secara berkala.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
              <div style={{ padding: '0.9rem 1rem', borderRadius: '10px', backgroundColor: 'var(--pub-canvas)', border: '1px solid var(--pub-line)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
                  Platform
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--pub-ink)', marginTop: '0.2rem' }}>
                  {meetingInfo.platform || 'Zoom Meeting'}
                </div>
              </div>

              <div style={{ padding: '0.9rem 1rem', borderRadius: '10px', backgroundColor: 'var(--pub-canvas)', border: '1px solid var(--pub-line)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
                  Waktu Pelaksanaan
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--pub-ink)', marginTop: '0.2rem' }}>
                  {meetingInfo.date ? formatDateLong(meetingInfo.date) : 'Menyusul'}
                </div>
                {meetingInfo.time && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--pub-coral)', fontWeight: 700, marginTop: '0.1rem' }}>
                    Pukul {meetingInfo.time} {meetingInfo.timezone || 'WIB'}
                  </div>
                )}
              </div>

              {(meetingInfo.meetingId || meetingInfo.passcode) && (
                <div style={{ padding: '0.9rem 1rem', borderRadius: '10px', backgroundColor: 'var(--pub-canvas)', border: '1px solid var(--pub-line)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
                    Akses Ruang Virtual
                  </div>
                  {meetingInfo.meetingId && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--pub-ink)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
                      ID: <strong>{meetingInfo.meetingId}</strong>
                    </div>
                  )}
                  {meetingInfo.passcode && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--pub-ink)', marginTop: '0.1rem', fontFamily: 'var(--font-mono)' }}>
                      Passcode: <strong>{meetingInfo.passcode}</strong>
                    </div>
                  )}
                </div>
              )}
            </div>

            {meetingInfo.zoomUrl && (
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <a
                  href={meetingInfo.zoomUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pub-btn-coral"
                  style={{
                    padding: '0.6rem 1.15rem',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    textDecoration: 'none',
                  }}
                >
                  <span>Buka Tautan Rapat</span>
                  <ExternalLink size={14} />
                </a>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--pub-ink)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                  }}
                >
                  {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                  <span>{copied ? 'Tautan Disalin' : 'Salin Tautan'}</span>
                </button>
              </div>
            )}

            {meetingInfo.instructions && (
              <div
                style={{
                  padding: '0.9rem 1.05rem',
                  borderRadius: '10px',
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  fontSize: '0.82rem',
                  color: '#92400E',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-line',
                }}
              >
                <strong>Ketentuan & Instruksi Peserta:</strong>
                <div style={{ marginTop: '0.25rem' }}>{meetingInfo.instructions}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Notulensi & Lampiran Dokumen TM */}
      {(summaryNotes || documents.length > 0) && (
        <div
          style={{
            backgroundColor: 'var(--pub-surface)',
            borderRadius: 'var(--pub-radius-card)',
            padding: '1.5rem 1.7rem',
            border: '1px solid var(--pub-line)',
            boxShadow: 'var(--pub-shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.12rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
            Notulensi & Dokumen Resmi Technical Meeting
          </h2>

          {summaryNotes && (
            <div
              style={{
                padding: '1rem 1.15rem',
                borderRadius: '12px',
                backgroundColor: 'var(--pub-canvas)',
                border: '1px solid var(--pub-line)',
                fontSize: '0.85rem',
                color: '#1E293B',
                lineHeight: 1.65,
                whiteSpace: 'pre-line',
              }}
            >
              {summaryNotes}
            </div>
          )}

          {documents.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.6rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
                      {doc.name}
                    </div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>
                      {doc.size ? `${doc.size} · ` : ''}
                      {doc.uploadedAt || 'Dokumen Panitia'}
                    </div>
                  </div>

                  {doc.fileUrl ? (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      download
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid var(--pub-teal)',
                        backgroundColor: 'var(--pub-teal-light)',
                        color: 'var(--pub-teal)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      <Download size={14} />
                      <span>Unduh / Lihat</span>
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 600 }}>
                      Tautan belum tersedia
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
