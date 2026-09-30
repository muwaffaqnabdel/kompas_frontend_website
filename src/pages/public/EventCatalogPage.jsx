import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PUBLIC_EVENTS } from '../../data/publicEvents';

export default function EventCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredEvents = PUBLIC_EVENTS.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.organizer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || evt.status === selectedStatus;
    const matchesCategory =
      selectedCategory === 'ALL' || evt.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesStatus && matchesCategory;
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

              {/* Status Tabs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {[
                  { id: 'ALL', label: 'Semua Status' },
                  { id: 'OPEN', label: '🟢 Buka' },
                  { id: 'SOON', label: '🟡 Segera' },
                  { id: 'CLOSED', label: '⚪ Selesai' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStatus(st.id)}
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      padding: '0.45rem 0.9rem',
                      borderRadius: 'var(--pub-radius-pill)',
                      border: selectedStatus === st.id ? '1px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                      backgroundColor: selectedStatus === st.id ? 'var(--pub-coral)' : 'transparent',
                      color: selectedStatus === st.id ? '#FFFFFF' : 'var(--pub-ink)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {st.label}
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
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="pub-card pub-card-hover"
                  style={{
                    backgroundColor: 'var(--pub-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Status & Category */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span
                        className={
                          evt.status === 'OPEN'
                            ? 'pub-badge-open'
                            : evt.status === 'SOON'
                            ? 'pub-badge-soon'
                            : 'pub-badge-closed'
                        }
                      >
                        {evt.status === 'OPEN'
                          ? '● PENDAFTARAN DIBUKA'
                          : evt.status === 'SOON'
                          ? '● SEGERA DIBUKA'
                          : '● ARSIP / SELESAI'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', fontFamily: 'var(--font-mono)' }}>
                        {evt.category}
                      </span>
                    </div>

                    <h2 className="pub-heading" style={{ fontSize: '1.35rem', color: 'var(--pub-ink)', marginBottom: '0.4rem' }}>
                      {evt.title}
                    </h2>

                    <div style={{ fontSize: '0.8125rem', color: 'var(--pub-coral)', fontWeight: 600, marginBottom: '0.85rem' }}>
                      Oleh: {evt.organizer}
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--pub-ink-soft)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      {evt.shortDesc}
                    </p>

                    {/* Metadata details */}
                    <div
                      style={{
                        backgroundColor: 'var(--pub-canvas)',
                        padding: '0.85rem 1rem',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.45rem',
                        fontSize: '0.8125rem',
                        color: 'var(--pub-ink)',
                        marginBottom: '1.5rem',
                        border: '1px solid var(--pub-line)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={15} color="var(--pub-coral)" />
                        <span>Pelaksanaan: <strong>{evt.date}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={15} color="var(--pub-coral)" />
                        <span>Batas Pendaftaran: <strong>{evt.registrationDeadline}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={15} color="var(--pub-coral)" />
                        <span>{evt.location}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={15} color="var(--pub-coral)" />
                        <span>Kuota: <strong>{evt.quota}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--pub-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>Biaya Kontingen</div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800, color: 'var(--pub-ink)' }}>
                        {evt.fee}
                      </div>
                    </div>

                    <Link to={`/event/${evt.slug}`} className="pub-btn-coral" style={{ fontSize: '0.875rem', padding: '0.55rem 1.15rem' }}>
                      <span>Lihat Detail & Daftar</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ))}
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
                Coba sesuaikan kata kunci pencarian atau ubah filter status di atas.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('ALL');
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
