import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SuperAdminEventTable({
  events = [],
  searchQuery = '',
  setSearchQuery,
  statusFilter = 'ALL',
  setStatusFilter,
  onOpenAssignModal,
  onOpenControlModal,
}) {
  const [onlyNeedsAction, setOnlyNeedsAction] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'REGISTRATION_OPEN':
        return { bg: 'var(--pub-teal-light)', color: 'var(--pub-teal)', label: 'Pendaftaran Dibuka' };
      case 'DRAFT_SETUP':
        return { bg: '#FEF3C7', color: 'var(--pub-amber)', label: 'Draft Setup' };
      case 'LIVE':
        return { bg: 'var(--pub-coral-pale)', color: 'var(--pub-coral)', label: 'Hari H (Live)' };
      case 'PUBLISHED':
        return { bg: '#E0E7FF', color: '#4338CA', label: 'Hasil Dipublikasi' };
      case 'ARCHIVED':
      default:
        return { bg: 'var(--pub-sand)', color: 'var(--pub-muted)', label: 'Arsip' };
    }
  };

  const getCountdownText = (dateStr) => {
    if (!dateStr) return '-';
    const target = new Date(dateStr);
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return `H-${diffDays} hari`;
    if (diffDays === 0) return 'Hari H (Hari ini)';
    return `Selesai (${Math.abs(diffDays)} hari lalu)`;
  };

  const filteredEvents = events.filter((evt) => {
    const adminName = evt.adminPanitia?.fullName || '';
    const adminEmail = evt.adminPanitia?.email || '';
    const query = searchQuery.toLowerCase();

    const matchSearch =
      evt.name.toLowerCase().includes(query) ||
      evt.slug.toLowerCase().includes(query) ||
      (evt.location && evt.location.toLowerCase().includes(query)) ||
      adminName.toLowerCase().includes(query) ||
      adminEmail.toLowerCase().includes(query);

    const matchStatus = statusFilter === 'ALL' || evt.status === statusFilter;
    const matchAction = !onlyNeedsAction || evt.alertStatus !== 'NORMAL' || !evt.adminPanitia;

    return matchSearch && matchStatus && matchAction;
  });

  return (
    <div
      style={{
        backgroundColor: 'var(--pub-surface)',
        borderRadius: 'var(--pub-radius-card)',
        border: '1px solid var(--pub-line)',
        boxShadow: 'var(--pub-shadow-card)',
        overflow: 'hidden',
      }}
    >
      {/* Table Top Controls & Filter Toolbar */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--pub-line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.2rem',
              fontWeight: 800,
              color: 'var(--pub-ink)',
              margin: 0,
            }}
          >
            Daftar Seluruh Event & Monitoring Operasional
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
            Pantau status siklus lomba, kelengkapan Admin Panitia, kesiapan konfigurasi, dan kesehatan sistem lintas event.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Quick Filter: Butuh Tindakan */}
          <button
            type="button"
            onClick={() => setOnlyNeedsAction(!onlyNeedsAction)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: onlyNeedsAction ? '1px solid var(--pub-coral)' : '1px solid var(--pub-line)',
              backgroundColor: onlyNeedsAction ? 'var(--pub-coral-pale)' : 'var(--pub-canvas)',
              color: onlyNeedsAction ? 'var(--pub-coral)' : 'var(--pub-ink)',
              transition: 'all 0.15s ease',
            }}
          >
            {onlyNeedsAction ? 'Tampilkan Semua' : 'Hanya Butuh Tindakan'}
          </button>

          {/* Search Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--pub-canvas)',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--pub-line)',
            }}
          >
            <Search size={14} color="var(--pub-muted)" />
            <input
              type="text"
              placeholder="Cari event / admin / ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.8125rem',
                color: 'var(--pub-ink)',
                width: '180px',
              }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--pub-line)',
              backgroundColor: 'var(--pub-canvas)',
              fontSize: '0.8125rem',
              color: 'var(--pub-ink)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">Semua Status</option>
            <option value="REGISTRATION_OPEN">Pendaftaran Dibuka</option>
            <option value="DRAFT_SETUP">Draft Setup</option>
            <option value="LIVE">Hari H (Live)</option>
            <option value="PUBLISHED">Hasil Diumumkan</option>
            <option value="ARCHIVED">Arsip</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--pub-canvas)', borderBottom: '1px solid var(--pub-line)' }}>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Event & Lokasi
              </th>
              <th style={{ padding: '0.85rem 0.65rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Status
              </th>
              <th style={{ padding: '0.85rem 0.65rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Admin Panitia (PIC)
              </th>
              <th style={{ padding: '0.85rem 0.65rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Peserta
              </th>
              <th style={{ padding: '0.85rem 0.65rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Kesiapan
              </th>
              <th style={{ padding: '0.85rem 0.65rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Hari H
              </th>
              <th style={{ padding: '0.85rem 0.65rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Alert
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>
                Aksi Kontrol
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: 'var(--pub-muted)', fontSize: '0.875rem' }}>
                  Tidak ada event yang sesuai dengan filter atau kriteria pencarian.
                </td>
              </tr>
            ) : (
              filteredEvents.map((evt) => {
                const badge = getStatusBadge(evt.status);
                const hasAdmin = !!evt.adminPanitia;
                const readiness = evt.readinessScore !== undefined ? evt.readinessScore : (hasAdmin ? 75 : 50);
                const validatedCount = evt.validatedParticipantsCount !== undefined ? evt.validatedParticipantsCount : 1;
                const totalCount = evt.totalParticipantsCount !== undefined ? evt.totalParticipantsCount : (evt._count?.participants || 4);

                return (
                  <tr
                    key={evt.id}
                    style={{
                      borderBottom: '1px solid var(--pub-line)',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--pub-canvas)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* 1. Event & Lokasi */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--pub-ink)', fontFamily: 'var(--font-heading)', fontSize: '0.925rem' }}>
                        {evt.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.2rem' }}>
                        ID: <code style={{ fontFamily: 'var(--font-mono)' }}>{evt.slug}</code>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--pub-ink-soft)', marginTop: '0.15rem' }}>
                        {evt.location || 'Lokasi Belum Diatur'}
                      </div>
                    </td>

                    {/* 2. Status */}
                    <td style={{ padding: '0.85rem 0.65rem' }}>
                      <span
                        style={{
                          backgroundColor: badge.bg,
                          color: badge.color,
                          padding: '0.25rem 0.65rem',
                          borderRadius: 'var(--pub-radius-pill)',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {badge.label}
                      </span>
                    </td>

                    {/* 3. Admin Panitia (PIC) */}
                    <td style={{ padding: '0.85rem 0.65rem' }}>
                      {hasAdmin ? (
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.85rem' }}>
                            {evt.adminPanitia.fullName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>
                            {evt.adminPanitia.email}
                          </div>
                        </div>
                      ) : (
                        <span
                          style={{
                            backgroundColor: '#FEF3C7',
                            color: 'var(--pub-amber)',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            display: 'inline-block',
                          }}
                        >
                          Belum Ditugaskan
                        </span>
                      )}
                    </td>

                    {/* 4. Peserta */}
                    <td style={{ padding: '0.85rem 0.65rem' }}>
                      <div className="tabular-nums" style={{ fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.875rem' }}>
                        {totalCount} Tim
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--pub-teal)', fontWeight: 600, marginTop: '0.15rem' }}>
                        {validatedCount} Tervalidasi
                      </div>
                    </td>

                    {/* 5. Kesiapan */}
                    <td style={{ padding: '0.85rem 0.65rem', minWidth: '105px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <span className="tabular-nums" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
                          {readiness}%
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--pub-muted)' }}>
                          {readiness === 100 ? 'Siap Hari H' : 'Konfigurasi'}
                        </span>
                      </div>
                      <div
                        style={{
                          height: '6px',
                          borderRadius: '999px',
                          backgroundColor: 'var(--pub-line)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${readiness}%`,
                            backgroundColor: readiness >= 75 ? 'var(--pub-teal)' : 'var(--pub-amber)',
                            borderRadius: '999px',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </td>

                    {/* 6. Hari H */}
                    <td style={{ padding: '0.85rem 0.65rem', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--pub-ink)' }}>
                        {new Date(evt.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="tabular-nums" style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>
                        {getCountdownText(evt.eventDate)}
                      </div>
                    </td>

                    {/* 7. Alert */}
                    <td style={{ padding: '0.85rem 0.65rem' }}>
                      {!hasAdmin ? (
                        <span
                          style={{
                            backgroundColor: 'var(--pub-coral-pale)',
                            color: 'var(--pub-coral)',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Tanpa Pengelola
                        </span>
                      ) : !evt.dpFlowLocked && evt.status === 'LIVE' ? (
                        <span
                          style={{
                            backgroundColor: '#FEF3C7',
                            color: 'var(--pub-amber)',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Flow Belum Dikunci
                        </span>
                      ) : (
                        <span
                          style={{
                            backgroundColor: 'var(--pub-teal-light)',
                            color: 'var(--pub-teal)',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            display: 'inline-block',
                          }}
                        >
                          Normal
                        </span>
                      )}
                    </td>

                    {/* 8. Aksi Kontrol */}
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.45rem' }}>
                        <button
                          type="button"
                          onClick={() => onOpenAssignModal(evt)}
                          className="pub-btn-outline"
                          style={{
                            padding: '0.4rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--pub-coral)',
                          }}
                          title={`Buat Akun Admin Panitia untuk ${evt.name}`}
                        >
                          Admin
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenControlModal(evt)}
                          className="pub-btn-coral"
                          style={{
                            padding: '0.4rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                          title="Buka kontrol status event"
                        >
                          Kontrol
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
