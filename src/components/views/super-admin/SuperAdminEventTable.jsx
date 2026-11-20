import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  UserPlus,
  UserCheck,
  Sliders,
  MapPin,
  AlertCircle,
  ShieldAlert,
  CheckCircle2,
  Lock,
} from 'lucide-react';

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
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.action-dropdown-menu-container')) {
        setOpenDropdownId(null);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'REGISTRATION_OPEN':
        return { bg: 'var(--pub-teal-light)', color: 'var(--pub-teal)', label: 'Pendaftaran Dibuka' };
      case 'DRAFT_SETUP':
        return { bg: '#FEF3C7', color: 'var(--pub-amber)', label: 'Draft Setup' };
      case 'VALIDATION':
        return { bg: '#E0F2FE', color: '#0369A1', label: 'Verifikasi Berkas' };
      case 'TECHNICAL_MEETING':
        return { bg: '#F3E8FF', color: '#7E22CE', label: 'Technical Meeting' };
      case 'LIVE':
        return { bg: 'var(--pub-coral-pale)', color: 'var(--pub-coral)', label: 'Hari H (Live)' };
      case 'SCORING_REVIEW':
        return { bg: '#FFEDD5', color: '#C2410C', label: 'Review Penilaian' };
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

  const getInitials = (name) => {
    if (!name) return 'PIC';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
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

      {/* Table Content with generous min-width & anti-cramping styling */}
      <div style={{ overflowX: 'auto', minHeight: '340px' }}>
        <table
          style={{
            width: '100%',
            minWidth: '1050px',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.85rem',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: 'var(--pub-canvas)', borderBottom: '1px solid var(--pub-line)' }}>
              <th
                style={{
                  width: '27%',
                  minWidth: '250px',
                  padding: '0.95rem 1.15rem',
                  fontWeight: 700,
                  color: 'var(--pub-ink)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Event & Lokasi
              </th>
              <th
                style={{
                  width: '14%',
                  minWidth: '145px',
                  padding: '0.95rem 0.75rem',
                  fontWeight: 700,
                  color: 'var(--pub-ink)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Status
              </th>
              <th
                style={{
                  width: '20%',
                  minWidth: '190px',
                  padding: '0.95rem 0.75rem',
                  fontWeight: 700,
                  color: 'var(--pub-ink)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Admin Panitia (PIC)
              </th>
              <th
                style={{
                  width: '10%',
                  minWidth: '105px',
                  padding: '0.95rem 0.75rem',
                  fontWeight: 700,
                  color: 'var(--pub-ink)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Peserta
              </th>
              <th
                style={{
                  width: '11%',
                  minWidth: '115px',
                  padding: '0.95rem 0.75rem',
                  fontWeight: 700,
                  color: 'var(--pub-ink)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Kesiapan
              </th>
              <th
                style={{
                  width: '12%',
                  minWidth: '125px',
                  padding: '0.95rem 0.75rem',
                  fontWeight: 700,
                  color: 'var(--pub-ink)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Hari H
              </th>
              <th
                style={{
                  width: '10%',
                  minWidth: '110px',
                  padding: '0.95rem 0.75rem',
                  fontWeight: 700,
                  color: 'var(--pub-ink)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Alert
              </th>
              <th
                style={{
                  width: '6%',
                  minWidth: '90px',
                  padding: '0.95rem 1.15rem',
                  fontWeight: 700,
                  color: 'var(--pub-ink)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  textAlign: 'right',
                }}
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: '3rem 1.5rem',
                    textAlign: 'center',
                    color: 'var(--pub-muted)',
                    fontSize: '0.875rem',
                  }}
                >
                  Tidak ada event yang sesuai dengan filter atau kriteria pencarian.
                </td>
              </tr>
            ) : (
              filteredEvents.map((evt, index) => {
                const badge = getStatusBadge(evt.status);
                const hasAdmin = !!evt.adminPanitia;
                const readiness = evt.readinessScore !== undefined ? evt.readinessScore : (hasAdmin ? 75 : 50);
                const validatedCount = evt.validatedParticipantsCount !== undefined ? evt.validatedParticipantsCount : 1;
                const totalCount = evt.totalParticipantsCount !== undefined ? evt.totalParticipantsCount : (evt._count?.participants || 4);
                const isBottomRow = index >= filteredEvents.length - 1 && filteredEvents.length >= 2;

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
                    <td style={{ padding: '0.95rem 1.15rem', verticalAlign: 'middle' }}>
                      <div
                        style={{
                          fontWeight: 700,
                          color: 'var(--pub-ink)',
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.925rem',
                          lineHeight: 1.35,
                        }}
                      >
                        {evt.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            color: 'var(--pub-muted)',
                            backgroundColor: 'var(--pub-canvas)',
                            padding: '0.12rem 0.38rem',
                            borderRadius: '4px',
                            border: '1px solid var(--pub-line)',
                          }}
                        >
                          {evt.slug}
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            color: 'var(--pub-ink-soft)',
                          }}
                        >
                          <MapPin size={12} color="var(--pub-muted)" />
                          <span>{evt.location || 'Lokasi Belum Diatur'}</span>
                        </span>
                      </div>
                    </td>

                    {/* 2. Status */}
                    <td style={{ padding: '0.95rem 0.75rem', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          backgroundColor: badge.bg,
                          color: badge.color,
                          padding: '0.28rem 0.65rem',
                          borderRadius: 'var(--pub-radius-pill)',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: badge.color,
                            display: 'inline-block',
                          }}
                        />
                        {badge.label}
                      </span>
                    </td>

                    {/* 3. Admin Panitia (PIC) */}
                    <td style={{ padding: '0.95rem 0.75rem', verticalAlign: 'middle' }}>
                      {hasAdmin ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--pub-navy)',
                              color: '#FFFFFF',
                              fontSize: '0.725rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {getInitials(evt.adminPanitia.fullName)}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontWeight: 700,
                                color: 'var(--pub-ink)',
                                fontSize: '0.85rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {evt.adminPanitia.fullName}
                            </div>
                            <div
                              style={{
                                fontSize: '0.725rem',
                                color: 'var(--pub-muted)',
                                marginTop: '0.1rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {evt.adminPanitia.email}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span
                          style={{
                            backgroundColor: '#FEF3C7',
                            color: 'var(--pub-amber)',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '6px',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <AlertCircle size={13} />
                          Belum Ditugaskan
                        </span>
                      )}
                    </td>

                    {/* 4. Peserta */}
                    <td style={{ padding: '0.95rem 0.75rem', verticalAlign: 'middle' }}>
                      <div className="tabular-nums" style={{ fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.875rem' }}>
                        {totalCount} Tim
                      </div>
                      <div
                        style={{
                          fontSize: '0.725rem',
                          color: 'var(--pub-teal)',
                          fontWeight: 600,
                          marginTop: '0.15rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <CheckCircle2 size={12} />
                        <span>{validatedCount} Valid</span>
                      </div>
                    </td>

                    {/* 5. Kesiapan */}
                    <td style={{ padding: '0.95rem 0.75rem', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span className="tabular-nums" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
                          {readiness}%
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--pub-muted)' }}>
                          {readiness === 100 ? 'Siap' : 'Setting'}
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
                    <td style={{ padding: '0.95rem 0.75rem', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pub-ink)' }}>
                        {new Date(evt.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="tabular-nums" style={{ fontSize: '0.725rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>
                        {getCountdownText(evt.eventDate)}
                      </div>
                    </td>

                    {/* 7. Alert */}
                    <td style={{ padding: '0.95rem 0.75rem', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      {!hasAdmin ? (
                        <span
                          style={{
                            backgroundColor: 'var(--pub-coral-pale)',
                            color: 'var(--pub-coral)',
                            padding: '0.22rem 0.55rem',
                            borderRadius: '6px',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <ShieldAlert size={12} />
                          Tanpa PIC
                        </span>
                      ) : !evt.dpFlowLocked && evt.status === 'LIVE' ? (
                        <span
                          style={{
                            backgroundColor: '#FEF3C7',
                            color: 'var(--pub-amber)',
                            padding: '0.22rem 0.55rem',
                            borderRadius: '6px',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <AlertCircle size={12} />
                          Flow Terbuka
                        </span>
                      ) : (
                        <span
                          style={{
                            backgroundColor: 'var(--pub-teal-light)',
                            color: 'var(--pub-teal)',
                            padding: '0.22rem 0.55rem',
                            borderRadius: '6px',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <CheckCircle2 size={12} />
                          Normal
                        </span>
                      )}
                    </td>

                    {/* 8. Aksi Kontrol (Dropdown Popover) */}
                    <td style={{ padding: '0.95rem 1.15rem', textAlign: 'right', verticalAlign: 'middle' }}>
                      <div
                        className="action-dropdown-menu-container"
                        style={{ position: 'relative', display: 'inline-block' }}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenDropdownId(openDropdownId === evt.id ? null : evt.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.42rem 0.75rem',
                            borderRadius: '8px',
                            fontSize: '0.785rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: openDropdownId === evt.id ? '1px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                            backgroundColor: openDropdownId === evt.id ? 'var(--pub-coral-pale)' : 'var(--pub-canvas)',
                            color: openDropdownId === evt.id ? 'var(--pub-coral)' : 'var(--pub-ink)',
                            boxShadow: openDropdownId === evt.id ? '0 0 0 2px rgba(201, 75, 60, 0.15)' : 'none',
                            transition: 'all 0.15s ease',
                          }}
                          title="Pilihan Aksi Event"
                          aria-haspopup="true"
                          aria-expanded={openDropdownId === evt.id}
                        >
                          <span>Aksi</span>
                          <ChevronDown
                            size={14}
                            style={{
                              transform: openDropdownId === evt.id ? 'rotate(180deg)' : 'none',
                              transition: 'transform 0.15s ease',
                            }}
                          />
                        </button>

                        {openDropdownId === evt.id && (
                          <div
                            style={{
                              position: 'absolute',
                              right: 0,
                              ...(isBottomRow ? { bottom: 'calc(100% + 6px)' } : { top: 'calc(100% + 6px)' }),
                              zIndex: 60,
                              minWidth: '155px',
                              backgroundColor: 'var(--pub-surface)',
                              borderRadius: '10px',
                              border: '1px solid var(--pub-line)',
                              boxShadow: '0 10px 25px -4px rgba(23, 32, 51, 0.14), 0 4px 8px -2px rgba(23, 32, 51, 0.06)',
                              padding: '0.35rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.2rem',
                            }}
                          >
                            {/* Pilihan 1: Admin */}
                            <button
                              type="button"
                              disabled={hasAdmin}
                              onClick={() => {
                                if (hasAdmin) return;
                                setOpenDropdownId(null);
                                onOpenAssignModal(evt);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.6rem',
                                width: '100%',
                                padding: '0.55rem 0.75rem',
                                borderRadius: '6px',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                color: hasAdmin ? 'var(--pub-muted)' : 'var(--pub-ink)',
                                border: 'none',
                                backgroundColor: 'transparent',
                                textAlign: 'left',
                                cursor: hasAdmin ? 'not-allowed' : 'pointer',
                                opacity: hasAdmin ? 0.6 : 1,
                                transition: 'background-color 0.15s ease, color 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                if (!hasAdmin) {
                                  e.currentTarget.style.backgroundColor = 'var(--pub-canvas)';
                                  e.currentTarget.style.color = 'var(--pub-coral)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!hasAdmin) {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.color = 'var(--pub-ink)';
                                }
                              }}
                              title={hasAdmin ? 'Admin Panitia sudah ditugaskan (Terkunci)' : `Tugaskan Admin Panitia untuk ${evt.name}`}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                                {hasAdmin ? (
                                  <Lock size={15} color="var(--pub-muted)" />
                                ) : (
                                  <UserPlus size={15} color="var(--pub-coral)" />
                                )}
                                <span>Admin</span>
                              </div>
                              {hasAdmin && (
                                <span
                                  style={{
                                    fontSize: '0.625rem',
                                    fontWeight: 700,
                                    backgroundColor: 'var(--pub-line)',
                                    color: 'var(--pub-muted)',
                                    padding: '0.1rem 0.35rem',
                                    borderRadius: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                  }}
                                >
                                  Terkunci
                                </span>
                              )}
                            </button>

                            <div style={{ height: '1px', backgroundColor: 'var(--pub-line-subtle)', margin: '0.1rem 0' }} />

                            {/* Pilihan 2: Kontrol */}
                            <button
                              type="button"
                              onClick={() => {
                                setOpenDropdownId(null);
                                onOpenControlModal(evt);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                width: '100%',
                                padding: '0.55rem 0.75rem',
                                borderRadius: '6px',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                color: 'var(--pub-ink)',
                                border: 'none',
                                backgroundColor: 'transparent',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'background-color 0.15s ease, color 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--pub-canvas)';
                                e.currentTarget.style.color = 'var(--pub-teal)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = 'var(--pub-ink)';
                              }}
                            >
                              <Sliders size={15} color="var(--pub-teal)" />
                              <span>Kontrol</span>
                            </button>
                          </div>
                        )}
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
