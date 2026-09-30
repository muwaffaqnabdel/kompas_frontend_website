import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronDown,
  ArrowRight,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { PUBLIC_EVENTS } from '../../data/publicEvents';

export default function EventDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('about');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Find event by id or slug (default to lkbb-nasional-2026 if not found)
  const event = PUBLIC_EVENTS.find((e) => e.slug === id || e.id === id) || PUBLIC_EVENTS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Breadcrumb & Navigation */}
      <section style={{ backgroundColor: 'var(--pub-canvas)', padding: '1.25rem 0', borderBottom: '1px solid var(--pub-line)' }}>
        <div className="pub-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--pub-muted)' }}>
            <Link to="/" style={{ color: 'var(--pub-muted)', textDecoration: 'none' }}>Beranda</Link>
            <span>/</span>
            <Link to="/event" style={{ color: 'var(--pub-muted)', textDecoration: 'none' }}>Event</Link>
            <span>/</span>
            <span style={{ color: 'var(--pub-ink)', fontWeight: 600 }}>{event.title}</span>
          </div>
        </div>
      </section>

      {/* Event Hero Header */}
      <section style={{ padding: '3.5rem 0', backgroundColor: 'var(--pub-surface)', borderBottom: '1px solid var(--pub-line)' }}>
        <div className="pub-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                <span
                  className={
                    event.status === 'OPEN'
                      ? 'pub-badge-open'
                      : event.status === 'SOON'
                      ? 'pub-badge-soon'
                      : 'pub-badge-closed'
                  }
                >
                  {event.status === 'OPEN'
                    ? '● PENDAFTARAN DIBUKA'
                    : event.status === 'SOON'
                    ? '● SEGERA DIBUKA'
                    : '● ARSIP / SELESAI'}
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--pub-coral)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {event.category}
                </span>
              </div>

              <h1 className="pub-heading" style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', color: 'var(--pub-ink)', lineHeight: 1.2, marginBottom: '0.75rem' }}>
                {event.title}
              </h1>

              <div style={{ fontSize: '0.9375rem', color: 'var(--pub-ink-soft)', marginBottom: '1.5rem' }}>
                Diselenggarakan oleh: <strong>{event.organizer}</strong>
              </div>

              {/* Event Metadata Strip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1rem',
                  padding: '1.25rem',
                  backgroundColor: 'var(--pub-canvas)',
                  borderRadius: '12px',
                  border: '1px solid var(--pub-line)',
                  marginBottom: '2rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--pub-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Tanggal Lomba</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--pub-ink)', marginTop: '0.15rem' }}>{event.date}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--pub-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Batas Berkas</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--pub-coral)', marginTop: '0.15rem' }}>{event.registrationDeadline}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--pub-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Lokasi / Venue</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--pub-ink)', marginTop: '0.15rem' }}>{event.location}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--pub-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Kuota & Biaya</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--pub-teal)', marginTop: '0.15rem' }}>{event.fee} ({event.quota})</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                <Link to="/login" className="pub-btn-coral" style={{ padding: '0.75rem 1.6rem' }}>
                  <span>Daftarkan Kontingen Tim</span>
                  <ArrowRight size={16} />
                </Link>
                <a href="#dokumen-resmi" className="pub-btn-outline" style={{ padding: '0.75rem 1.4rem' }}>
                  <Download size={15} />
                  <span>Unduh Juknis Resmi</span>
                </a>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div>
              <div
                className="pub-card"
                style={{
                  backgroundColor: 'var(--pub-canvas)',
                  border: '1px solid var(--pub-line)',
                  padding: '2rem',
                }}
              >
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.75rem' }}>
                  Progres Pendaftaran Kontingen
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--pub-ink-soft)', marginBottom: '1.25rem' }}>
                  {event.registeredCount} dari 32 kuota tim pangkalan telah terverifikasi oleh panitia.
                </div>

                {/* Progress bar */}
                <div style={{ height: '8px', backgroundColor: 'var(--pub-sand)', borderRadius: '999px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(event.registeredCount / 32) * 100}%`,
                      backgroundColor: 'var(--pub-coral)',
                      borderRadius: '999px',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--pub-muted)' }}>Nomor Registrasi:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>EVT-LKBB-2026</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--pub-muted)' }}>Sistem Penjurian:</span>
                    <strong style={{ color: 'var(--pub-teal)' }}>Digital Real-Time + AI Voice</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--pub-muted)' }}>Flow Lapangan:</span>
                    <strong>4 Pos DP (Atomic Lock)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section style={{ backgroundColor: 'var(--pub-canvas)', padding: '4rem 0 6rem' }}>
        <div className="pub-container" style={{ maxWidth: '960px' }}>
          {/* Segmented Tab Headers */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '2rem',
              borderBottom: '1px solid var(--pub-line)',
              paddingBottom: '0.75rem',
            }}
          >
            {[
              { id: 'about', label: 'Tentang & Deskripsi' },
              { id: 'requirements', label: 'Persyaratan & Berkas' },
              { id: 'documents', label: 'Dokumen & Juknis' },
              { id: 'timeline', label: 'Linimasa & TM' },
              { id: 'faq', label: 'FAQ Event' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  padding: '0.6rem 1.25rem',
                  borderRadius: 'var(--pub-radius-pill)',
                  border: activeTab === tab.id ? '1px solid var(--pub-coral)' : '1px solid transparent',
                  backgroundColor: activeTab === tab.id ? 'var(--pub-surface)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--pub-coral)' : 'var(--pub-ink-soft)',
                  cursor: 'pointer',
                  boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: About */}
          {activeTab === 'about' && (
            <div className="pub-card pub-animate-fade" style={{ backgroundColor: 'var(--pub-surface)', padding: '2.5rem' }}>
              <h3 className="pub-heading" style={{ fontSize: '1.4rem', color: 'var(--pub-ink)', marginBottom: '1rem' }}>
                Deskripsi Lengkap Lomba
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--pub-ink-soft)', lineHeight: 1.7, marginBottom: '2rem' }}>
                {event.fullDesc}
              </p>

              <h4 className="pub-heading" style={{ fontSize: '1.15rem', color: 'var(--pub-ink)', marginBottom: '0.75rem' }}>
                Lokasi & Petunjuk Kedatangan
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--pub-ink-soft)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {event.address}
              </p>

              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--pub-canvas)',
                  borderRadius: '8px',
                  border: '1px solid var(--pub-line)',
                  fontSize: '0.875rem',
                  color: 'var(--pub-ink)',
                }}
              >
                <strong>Catatan Kedatangan Kontingen:</strong> Setiap pangkalan wajib melakukan registrasi ulang di <strong>Pos DP 1</strong> paling lambat 45 menit sebelum nomor urut tampil yang telah diundi pada saat Technical Meeting.
              </div>
            </div>
          )}

          {/* Tab 2: Requirements */}
          {activeTab === 'requirements' && (
            <div className="pub-card pub-animate-fade" style={{ backgroundColor: 'var(--pub-surface)', padding: '2.5rem' }}>
              <h3 className="pub-heading" style={{ fontSize: '1.4rem', color: 'var(--pub-ink)', marginBottom: '1rem' }}>
                Ketentuan & Syarat Kontingen
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                {event.requirements.map((req, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--pub-ink)' }}>
                    <CheckCircle2 size={18} color="var(--pub-coral)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{req}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--pub-sand)',
                  borderRadius: '8px',
                  border: '1px solid #D6CEC3',
                  fontSize: '0.875rem',
                  color: 'var(--pub-ink)',
                }}
              >
                <strong>Ketentuan Berkas Digital:</strong> Seluruh dokumen wajib diunggah dalam format PDF atau JPG jelas (maksimal 5 MB per berkas) melalui portal pendaftaran KOMPAS sebelum batas penutupan registrasi.
              </div>
            </div>
          )}

          {/* Tab 3: Documents */}
          {activeTab === 'documents' && (
            <div id="dokumen-resmi" className="pub-card pub-animate-fade" style={{ backgroundColor: 'var(--pub-surface)', padding: '2.5rem' }}>
              <h3 className="pub-heading" style={{ fontSize: '1.4rem', color: 'var(--pub-ink)', marginBottom: '0.5rem' }}>
                Berkas Resmi & Panduan Teknis
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--pub-muted)', marginBottom: '1.75rem' }}>
                Unduh dokumen juknis, format surat tugas, dan lembar rubrik penilaian resmi di bawah ini:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {event.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1.25rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--pub-canvas)',
                      border: '1px solid var(--pub-line)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--pub-coral-pale)',
                          color: 'var(--pub-coral-dark)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <FileText size={18} />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
                          {doc.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>
                          Ukuran: {doc.size} · Format: {doc.type}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Mengunduh berkas: ${doc.name}`)}
                      className="pub-btn-outline"
                      style={{ fontSize: '0.8125rem', padding: '0.45rem 1rem' }}
                    >
                      <Download size={14} />
                      <span>Unduh</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Timeline */}
          {activeTab === 'timeline' && (
            <div className="pub-card pub-animate-fade" style={{ backgroundColor: 'var(--pub-surface)', padding: '2.5rem' }}>
              <h3 className="pub-heading" style={{ fontSize: '1.4rem', color: 'var(--pub-ink)', marginBottom: '1.5rem' }}>
                Agenda & Linimasa Kompetisi
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {event.timeline.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1.25rem' }}>
                    <div
                      className="pub-mono"
                      style={{
                        width: '130px',
                        flexShrink: 0,
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: 'var(--pub-coral)',
                        paddingTop: '2px',
                      }}
                    >
                      {item.date}
                    </div>
                    <div style={{ borderLeft: '2px solid var(--pub-line)', paddingLeft: '1.25rem', paddingBottom: '0.5rem' }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--pub-ink-soft)', marginTop: '0.2rem' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: FAQ */}
          {activeTab === 'faq' && (
            <div className="pub-card pub-animate-fade" style={{ backgroundColor: 'var(--pub-surface)', padding: '2.5rem' }}>
              <h3 className="pub-heading" style={{ fontSize: '1.4rem', color: 'var(--pub-ink)', marginBottom: '1.5rem' }}>
                Pertanyaan Seputar Event Ini
              </h3>

              {event.faqs && event.faqs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {event.faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: 'var(--pub-canvas)',
                          borderRadius: '10px',
                          border: '1px solid var(--pub-line)',
                          padding: '1.25rem',
                          cursor: 'pointer',
                        }}
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--pub-ink)' }}>
                            {faq.q}
                          </div>
                          <ChevronDown size={18} color="var(--pub-coral)" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
                        </div>
                        {isOpen && (
                          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--pub-line)', fontSize: '0.875rem', color: 'var(--pub-ink-soft)', lineHeight: 1.6 }}>
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: 'var(--pub-muted)', fontSize: '0.9rem' }}>
                  Belum ada FAQ spesifik untuk event ini. Hubungi kontak panitia pelaksana.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
