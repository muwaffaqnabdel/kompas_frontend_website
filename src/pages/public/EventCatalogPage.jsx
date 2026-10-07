import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ArrowUpRight,
} from 'lucide-react';
import { getStoredPublicEvents } from '../../data/publicEvents';

export default function EventCatalogPage() {
  const [events, setEvents] = useState(getStoredPublicEvents());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const handleUpdate = () => {
      setEvents(getStoredPublicEvents());
    };
    window.addEventListener('kompas_event_updated', handleUpdate);
    return () => window.removeEventListener('kompas_event_updated', handleUpdate);
  }, []);

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.organizer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' ||
      evt.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header Banner */}
      <section style={{ padding: '4.5rem 0 3rem', backgroundColor: 'var(--pub-surface)', borderBottom: '1px solid var(--pub-line)' }}>
        <div className="pub-container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <div
            className="pub-mono"
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--pub-coral)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.75rem',
            }}
          >
            KATALOG RESMI KOMPAS
          </div>
          <h1 className="pub-heading" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--pub-ink)', lineHeight: 1.2, marginBottom: '1rem' }}>
            Temukan Kompetisi Paskibra
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--pub-ink-soft)', lineHeight: 1.6 }}>
            Daftarkan pangkalan sekolah Anda ke ajang baris berbaris bergengsi dengan kepastian alur, transparansi penilaian, dan petunjuk teknis resmi.
          </p>
        </div>
      </section>

      {/* Catalog & Filter Controls */}
      <section style={{ padding: '3.5rem 0 5.5rem', backgroundColor: 'var(--pub-canvas)' }}>
        <div className="pub-container">
          {/* Filter Bar */}
          <div
            className="pub-card"
            style={{
              marginBottom: '2.5rem',
              backgroundColor: 'var(--pub-surface)',
              border: '1px solid var(--pub-line)',
              padding: '1.25rem 1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Search Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  backgroundColor: 'var(--pub-canvas)',
                  border: '1px solid var(--pub-line)',
                  borderRadius: 'var(--pub-radius-pill)',
                  padding: '0.55rem 1rem',
                  flex: '1 1 300px',
                  maxWidth: '450px',
                }}
              >
                <Search size={18} color="var(--pub-muted)" />
                <input
                  type="text"
                  placeholder="Cari nama lomba, kota, atau penyelenggara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    color: 'var(--pub-ink)',
                    outline: 'none',
                    width: '100%',
                  }}
                />
              </div>

              {/* Category Filter Tabs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {[
                  { id: 'ALL', label: 'Semua Kategori' },
                  { id: 'SMA', label: 'SMA/SMK Sederajat' },
                  { id: 'SMP', label: 'SMP/MTs Sederajat' },
                  { id: 'Purna', label: 'Purna / Umum' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      padding: '0.45rem 0.9rem',
                      borderRadius: 'var(--pub-radius-pill)',
                      border: selectedCategory === cat.id ? '1px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                      backgroundColor: selectedCategory === cat.id ? 'var(--pub-coral)' : 'transparent',
                      color: selectedCategory === cat.id ? '#FFFFFF' : 'var(--pub-ink)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Event Cards Grid */}
          {filteredEvents.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '2rem',
              }}
            >
              {filteredEvents.map((evt, index) => {
                const boardNumber = String(index + 1).padStart(2, '0');
                return (
                  <Link
                    key={evt.id}
                    to={`/event/${evt.slug}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'block',
                    }}
                  >
                    <div
                      className="pub-card pub-card-hover"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '24px',
                        border: '1px solid var(--pub-line)',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.25rem',
                        boxShadow: '0 4px 20px -2px rgba(23, 32, 51, 0.06)',
                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                        cursor: 'pointer',
                      }}
                    >
                      {/* 1. Header Board Tag */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span
                          className="pub-mono"
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: 800,
                            color: 'var(--pub-coral)',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                          }}
                        >
                          EVENT BOARD / {boardNumber}
                        </span>
                      </div>

                      {/* 2. Banner Inner Container with Title & Category */}
                      <div
                        style={{
                          borderRadius: '16px',
                          height: '175px',
                          position: 'relative',
                          overflow: 'hidden',
                          backgroundColor: 'var(--pub-navy)',
                          padding: '1.35rem 1.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        {evt.bannerUrl && (
                          <img
                            src={evt.bannerUrl}
                            alt={evt.title}
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}

                        {/* Warm cinematic gradient overlay matching Image 2 */}
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(135deg, rgba(201, 75, 60, 0.82) 0%, rgba(23, 32, 51, 0.88) 100%)',
                            pointerEvents: 'none',
                          }}
                        />

                        {/* Category Top Label inside Banner */}
                        <div style={{ position: 'relative', zIndex: 1 }}>
                          <span
                            className="pub-mono"
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: 'rgba(255, 255, 255, 0.92)',
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
                            }}
                          >
                            {evt.category ? evt.category.toUpperCase() : 'KOMPETISI PASKIBRA'}
                          </span>
                        </div>

                        {/* Large Bold Event Title inside Banner */}
                        <div style={{ position: 'relative', zIndex: 1 }}>
                          <h2
                            className="pub-heading"
                            style={{
                              fontSize: '1.45rem',
                              fontWeight: 800,
                              color: '#FFFFFF',
                              lineHeight: 1.25,
                              margin: 0,
                              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                            }}
                          >
                            {evt.title}
                          </h2>
                        </div>
                      </div>

                      {/* 3. Information Section (Hanya Nama Event [di banner], Oleh, dan Tanggal) */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '1rem',
                          padding: '0.25rem 0.25rem',
                        }}
                      >
                        {/* Tanggal Event */}
                        <div>
                          <div
                            className="pub-mono"
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              color: 'var(--pub-muted)',
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              marginBottom: '0.3rem',
                            }}
                          >
                            TANGGAL
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: '1.05rem',
                              fontWeight: 800,
                              color: 'var(--pub-ink)',
                              lineHeight: 1.3,
                            }}
                          >
                            {evt.date}
                          </div>
                        </div>

                        {/* Oleh / Penyelenggara */}
                        <div>
                          <div
                            className="pub-mono"
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              color: 'var(--pub-muted)',
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              marginBottom: '0.3rem',
                            }}
                          >
                            PENYELENGGARA
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: '0.95rem',
                              fontWeight: 700,
                              color: 'var(--pub-ink)',
                              lineHeight: 1.3,
                            }}
                          >
                            {evt.organizer}
                          </div>
                        </div>
                      </div>

                      {/* 4. Bottom Divider + Link Info + Circular Arrow Button */}
                      <div
                        style={{
                          borderTop: '1px solid var(--pub-line-subtle)',
                          paddingTop: '1rem',
                          marginTop: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            color: 'var(--pub-muted)',
                          }}
                        >
                          {evt.registeredCount ? `${evt.registeredCount} tim terdaftar` : 'Lihat Detail & Juknis'}
                        </div>

                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--pub-navy)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.18)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <ArrowUpRight size={20} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div
              className="pub-card"
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: 'var(--pub-surface)',
              }}
            >
              <h3 className="pub-heading" style={{ fontSize: '1.35rem', color: 'var(--pub-ink)', marginBottom: '0.5rem' }}>
                Tidak ada event yang sesuai pencarian
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--pub-muted)', marginBottom: '1.5rem' }}>
                Coba sesuaikan kata kunci pencarian atau ubah filter kategori di atas.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className="pub-btn-outline"
                style={{ fontSize: '0.875rem' }}
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
