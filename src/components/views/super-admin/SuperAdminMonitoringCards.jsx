import React, { useState } from 'react';
import {
  Search,
  ChevronRight,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Sliders,
  ExternalLink,
  FileText,
  Clock,
  Eye,
  X,
  Lock,
  Unlock,
} from 'lucide-react';

export default function SuperAdminMonitoringCards({ events = [], onOpenControlModal }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [selectedDocsEvent, setSelectedDocsEvent] = useState(null);

  // Toggle independent card expansion
  const toggleExpand = (eventId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  };

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

  // Filter events by query and status
  const filteredEvents = events.filter((evt) => {
    const adminName = evt.adminPanitia?.fullName || '';
    const query = searchQuery.toLowerCase();

    const matchSearch =
      evt.name.toLowerCase().includes(query) ||
      evt.slug.toLowerCase().includes(query) ||
      (evt.location && evt.location.toLowerCase().includes(query)) ||
      adminName.toLowerCase().includes(query);

    const matchStatus = statusFilter === 'ALL' || evt.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'var(--font-sans)' }}>
      {/* 1. Header Toolbar (Tanpa Overview Charts, langsung fokus ke kartu operasional) */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          padding: '1.25rem 1.75rem',
          borderRadius: 'var(--pub-radius-card)',
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
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--pub-ink)',
              margin: 0,
            }}
          >
            Monitoring Lapangan & Kesiapan Lomba
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
            Pantau status operasional berkas peserta, kelengkapan pos Decision Point, dan kontrol lomba per event.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--pub-canvas)',
              padding: '0.5rem 0.95rem',
              borderRadius: '10px',
              border: '1px solid var(--pub-line)',
            }}
          >
            <Search size={15} color="var(--pub-muted)" />
            <input
              type="text"
              placeholder="Cari event / lokasi / PIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.825rem',
                color: 'var(--pub-ink)',
                width: '190px',
              }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.95rem',
              borderRadius: '10px',
              border: '1px solid var(--pub-line)',
              backgroundColor: 'var(--pub-canvas)',
              fontSize: '0.825rem',
              color: 'var(--pub-ink)',
              outline: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            <option value="ALL">Semua Status Lomba</option>
            <option value="LIVE">Hari H (Live)</option>
            <option value="REGISTRATION_OPEN">Pendaftaran Dibuka</option>
            <option value="DRAFT_SETUP">Draft Setup</option>
            <option value="PUBLISHED">Hasil Diumumkan</option>
          </select>
        </div>
      </div>

      {/* 2. Operational Event Cards Grid */}
      {filteredEvents.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--pub-surface)',
            padding: '3.5rem 2rem',
            borderRadius: 'var(--pub-radius-card)',
            border: '1px solid var(--pub-line)',
            textAlign: 'center',
            color: 'var(--pub-muted)',
            boxShadow: 'var(--pub-shadow-card)',
          }}
        >
          <AlertCircle size={36} color="var(--pub-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--pub-ink)', margin: 0 }}>
            Tidak ada event yang ditemukan
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--pub-muted)', marginTop: '0.35rem' }}>
            Sesuaikan kata kunci pencarian atau ganti filter status untuk melihat lomba lainnya.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          {filteredEvents.map((evt, index) => {
            const isExpanded = expandedIds.has(evt.id);
            const badge = getStatusBadge(evt.status);
            const hasAdmin = !!evt.adminPanitia;
            const readiness = evt.readinessScore !== undefined ? evt.readinessScore : (hasAdmin ? 75 : 50);
            const totalCount = evt.totalParticipantsCount !== undefined ? evt.totalParticipantsCount : (evt._count?.participants || 4);
            const validatedCount = evt.validatedParticipantsCount !== undefined ? evt.validatedParticipantsCount : (totalCount > 1 ? 1 : 0);
            const pendingCount = evt.pendingParticipantsCount !== undefined ? evt.pendingParticipantsCount : Math.max(0, totalCount - validatedCount);
            const boardNum = String(index + 1).padStart(2, '0');

            // Pos DP Standar
            const dps = evt.decisionPoints?.length > 0 ? evt.decisionPoints : [
              { orderIndex: 1, name: 'DP 1 - Pengecekan Berkas' },
              { orderIndex: 2, name: 'DP 2 - Photoshoot Pasukan' },
              { orderIndex: 3, name: 'DP 3 - Persiapan & Pemanasan' },
              { orderIndex: 4, name: 'DP 4 - Lapangan Utama' },
            ];

            return (
              <div
                key={evt.id}
                style={{
                  backgroundColor: 'var(--pub-surface)',
                  borderRadius: '24px',
                  border: isExpanded ? '1px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                  boxShadow: isExpanded
                    ? '0 12px 28px -4px rgba(201, 75, 60, 0.12), 0 4px 12px rgba(23, 32, 51, 0.04)'
                    : 'var(--pub-shadow-card)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Bagian Utama Card (Selalu Tampil) */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  {/* Top Board Tag & Status Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      className="tabular-nums"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.785rem',
                        fontWeight: 800,
                        color: 'var(--pub-coral)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      EVENT BOARD / {boardNum}
                    </span>

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
                        whiteSpace: 'nowrap',
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
                  </div>

                  {/* Banner Visual Modern Card (Gaya Web Utama) */}
                  <div
                    style={{
                      height: '135px',
                      borderRadius: '16px',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: 'var(--pub-navy)',
                      padding: '1.2rem 1.35rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {/* Background Overlay Gradient */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, rgba(201, 75, 60, 0.8) 0%, rgba(23, 42, 70, 0.94) 100%)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Banner Top Tags */}
                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(4px)',
                          color: '#FFFFFF',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.675rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                        }}
                      >
                        #{evt.slug}
                      </span>
                      <span
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          backdropFilter: 'blur(4px)',
                          color: '#FFFFFF',
                          fontSize: '0.675rem',
                          fontWeight: 600,
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--pub-radius-pill)',
                        }}
                      >
                        {evt.category || 'Paskibra Pelajar'}
                      </span>
                    </div>

                    {/* Banner Headline Title */}
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.185rem',
                          fontWeight: 800,
                          color: '#FFFFFF',
                          margin: 0,
                          lineHeight: 1.3,
                          textShadow: '0 2px 4px rgba(0,0,0,0.25)',
                        }}
                      >
                        {evt.name}
                      </h3>
                    </div>
                  </div>

                  {/* Info Lokasi & Tanggal */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--pub-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                        Lokasi Lomba
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--pub-ink)', marginTop: '0.1rem', lineHeight: 1.25 }}>
                        {evt.location || 'Lokasi Belum Diatur'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--pub-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                        Hari H
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--pub-ink)', marginTop: '0.1rem' }}>
                        {new Date(evt.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="tabular-nums" style={{ fontSize: '0.7rem', color: 'var(--pub-muted)', marginTop: '0.05rem' }}>
                        {getCountdownText(evt.eventDate)}
                      </div>
                    </div>
                  </div>

                  {/* Admin Panitia (PIC) Bar */}
                  <div
                    style={{
                      padding: '0.75rem 0.95rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--pub-canvas)',
                      border: '1px solid var(--pub-line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          backgroundColor: hasAdmin ? 'var(--pub-navy)' : '#FEF3C7',
                          color: hasAdmin ? '#FFFFFF' : 'var(--pub-amber)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {hasAdmin ? getInitials(evt.adminPanitia.fullName) : '!'}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.675rem', textTransform: 'uppercase', color: 'var(--pub-muted)', fontWeight: 700 }}>
                          Admin Panitia (PIC)
                        </div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {hasAdmin ? evt.adminPanitia.fullName : 'Belum Ditugaskan'}
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px',
                        backgroundColor: hasAdmin ? 'var(--pub-teal-light)' : 'var(--pub-coral-pale)',
                        color: hasAdmin ? 'var(--pub-teal)' : 'var(--pub-coral)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {hasAdmin ? 'PIC Terhubung' : 'Tanpa PIC'}
                    </span>
                  </div>

                  {/* Quick Metrics Bar: Peserta & Kesiapan */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', paddingTop: '0.25rem' }}>
                    <div style={{ padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: 'var(--pub-canvas)', border: '1px solid var(--pub-line)' }}>
                      <div style={{ fontSize: '0.675rem', color: 'var(--pub-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                        Total Peserta
                      </div>
                      <div className="tabular-nums" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--pub-ink)', marginTop: '0.1rem' }}>
                        {totalCount} Tim
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--pub-teal)', fontWeight: 600, marginTop: '0.1rem' }}>
                        {validatedCount} Tervalidasi
                      </div>
                    </div>

                    <div style={{ padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: 'var(--pub-canvas)', border: '1px solid var(--pub-line)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.675rem', color: 'var(--pub-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                          Kesiapan
                        </span>
                        <span className="tabular-nums" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--pub-ink)' }}>
                          {readiness}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: '5px',
                          borderRadius: '999px',
                          backgroundColor: 'var(--pub-line)',
                          overflow: 'hidden',
                          marginTop: '0.4rem',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${readiness}%`,
                            backgroundColor: readiness >= 75 ? 'var(--pub-teal)' : 'var(--pub-amber)',
                            borderRadius: '999px',
                          }}
                        />
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--pub-muted)', marginTop: '0.3rem' }}>
                        {evt.dpFlowLocked ? 'Alur DP Terkunci' : 'Alur DP Terbuka'}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Area: Status Ringkas & Tombol Expand ( > ) */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '0.6rem',
                      borderTop: '1px solid var(--pub-line-subtle)',
                      marginTop: '0.2rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: evt.status === 'LIVE' ? 'var(--pub-coral)' : 'var(--pub-teal)',
                          boxShadow: evt.status === 'LIVE' ? '0 0 0 3px rgba(201, 75, 60, 0.2)' : 'none',
                        }}
                      />
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--pub-ink)' }}>
                        {evt.status === 'LIVE' ? 'Operasi Hari H Berjalan' : 'Status Operasi Terpantau'}
                      </span>
                    </div>

                    {/* Tombol Interaktif Expand ( > ) */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(evt.id)}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: isExpanded ? 'var(--pub-coral)' : 'var(--pub-canvas)',
                        color: isExpanded ? '#FFFFFF' : 'var(--pub-ink)',
                        border: isExpanded ? '1px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: isExpanded ? '0 4px 14px rgba(201, 75, 60, 0.35)' : 'none',
                      }}
                      title={isExpanded ? 'Tutup informasi lomba' : 'Buka informasi lengkap & berkas'}
                      aria-expanded={isExpanded}
                    >
                      <ChevronRight
                        size={19}
                        style={{
                          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                    </button>
                  </div>
                </div>

                {/* Panel Detail Terbuka (Expandable Drawer) */}
                {isExpanded && (
                  <div
                    style={{
                      backgroundColor: 'var(--pub-canvas)',
                      borderTop: '1px solid var(--pub-line)',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.25rem',
                      animation: 'fadeIn 0.2s ease',
                    }}
                  >
                    {/* Header Panel Expand */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--pub-ink)', fontFamily: 'var(--font-heading)' }}>
                        Detail Operasional & Kelengkapan Berkas
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: 'var(--pub-teal)',
                          backgroundColor: 'var(--pub-teal-light)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                        }}
                      >
                        Live Monitoring
                      </span>
                    </div>

                    {/* 1. Ringkasan Status Berkas Peserta */}
                    <div>
                      <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                        Kelengkapan Berkas Peserta
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.55rem' }}>
                        <div style={{ padding: '0.65rem', borderRadius: '10px', backgroundColor: 'var(--pub-surface)', border: '1px solid var(--pub-line)' }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--pub-muted)', fontWeight: 700 }}>BERKAS LENGKAP</div>
                          <div className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--pub-teal)', marginTop: '0.15rem' }}>
                            {validatedCount} Tim
                          </div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--pub-teal)', marginTop: '0.1rem' }}>Tervalidasi</div>
                        </div>

                        <div style={{ padding: '0.65rem', borderRadius: '10px', backgroundColor: 'var(--pub-surface)', border: '1px solid var(--pub-line)' }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--pub-muted)', fontWeight: 700 }}>PENDING REVIEW</div>
                          <div className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--pub-amber)', marginTop: '0.15rem' }}>
                            {pendingCount} Tim
                          </div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--pub-amber)', marginTop: '0.1rem' }}>Menunggu Dicek</div>
                        </div>

                        <div style={{ padding: '0.65rem', borderRadius: '10px', backgroundColor: 'var(--pub-surface)', border: '1px solid var(--pub-line)' }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--pub-muted)', fontWeight: 700 }}>BELUM LENGKAP</div>
                          <div className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--pub-coral)', marginTop: '0.15rem' }}>
                            {Math.max(0, totalCount - (validatedCount + pendingCount))} Tim
                          </div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--pub-coral)', marginTop: '0.1rem' }}>Perlu Upload</div>
                        </div>
                      </div>
                    </div>

                    {/* 2. Status 4 Pos Decision Point (DP 1 s.d DP 4) */}
                    <div>
                      <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                        Alur Pos Decision Point (DP)
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                        {dps.slice(0, 4).map((dp, i) => (
                          <div
                            key={i}
                            style={{
                              padding: '0.55rem 0.75rem',
                              borderRadius: '8px',
                              backgroundColor: 'var(--pub-surface)',
                              border: '1px solid var(--pub-line)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '0.75rem',
                            }}
                          >
                            <span style={{ fontWeight: 600, color: 'var(--pub-ink)' }}>{dp.name}</span>
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: evt.dpFlowLocked ? 'var(--pub-teal)' : 'var(--pub-amber)',
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3. Status Kontrol & Penguncian Sistem */}
                    <div
                      style={{
                        padding: '0.75rem 0.95rem',
                        borderRadius: '12px',
                        backgroundColor: 'var(--pub-surface)',
                        border: '1px solid var(--pub-line)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {evt.dpFlowLocked ? <Lock size={15} color="var(--pub-teal)" /> : <Unlock size={15} color="var(--pub-amber)" />}
                        <div>
                          <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
                            {evt.dpFlowLocked ? 'Alur DP Terkunci' : 'Alur DP Masih Terbuka'}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--pub-muted)' }}>
                            Penilaian: {evt.scoringLocked ? 'Terkunci' : 'Buka'} | Hasil: {evt.resultsPublished ? 'Terbit' : 'Draft'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4. Aksi Operasional yang Dibutuhkan */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedDocsEvent(evt)}
                        style={{
                          flex: 1,
                          padding: '0.55rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid var(--pub-line)',
                          backgroundColor: 'var(--pub-surface)',
                          color: 'var(--pub-ink)',
                          fontSize: '0.775rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        Lihat Berkas Peserta
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenControlModal(evt)}
                        className="pub-btn-coral"
                        style={{
                          padding: '0.55rem 0.95rem',
                          fontSize: '0.775rem',
                          fontWeight: 700,
                        }}
                      >
                        Kontrol Status
                      </button>

                      <a
                        href={`/event/${evt.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: '0.55rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid var(--pub-line)',
                          backgroundColor: 'var(--pub-surface)',
                          color: 'var(--pub-ink)',
                          fontSize: '0.775rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          textDecoration: 'none',
                        }}
                        title="Buka halaman publik lomba di tab baru"
                      >
                        Halaman Publik
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL LIHAT BERKAS PESERTA UNTUK SUPER ADMIN */}
      {selectedDocsEvent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(23, 42, 70, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--pub-surface)',
              width: '100%',
              maxWidth: '680px',
              borderRadius: '20px',
              border: '1px solid var(--pub-line)',
              boxShadow: 'var(--pub-shadow-hover)',
              padding: '2rem',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                  Monitoring Berkas Kontingen
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
                  Lomba: <strong style={{ color: 'var(--pub-ink)' }}>{selectedDocsEvent.name}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDocsEvent(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pub-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* List Berkas Peserta */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {selectedDocsEvent.participants && selectedDocsEvent.participants.length > 0 ? (
                selectedDocsEvent.participants.map((pt, i) => (
                  <div
                    key={pt.id || i}
                    style={{
                      padding: '1rem 1.15rem',
                      borderRadius: '14px',
                      backgroundColor: 'var(--pub-canvas)',
                      border: '1px solid var(--pub-line)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--pub-ink)', fontSize: '0.925rem' }}>
                          {pt.teamName || `Tim Paskibra ${i + 1}`}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.1rem' }}>
                          {pt.schoolName || 'Asal Sekolah'} • {pt.category || 'Tingkat Pelajar'}
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--pub-radius-pill)',
                          backgroundColor: pt.status === 'VALIDATED' ? 'var(--pub-teal-light)' : '#FEF3C7',
                          color: pt.status === 'VALIDATED' ? 'var(--pub-teal)' : 'var(--pub-amber)',
                        }}
                      >
                        {pt.status === 'VALIDATED' ? 'Tervalidasi' : pt.status || 'Draft'}
                      </span>
                    </div>

                    {/* Rincian Berkas Standar */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', paddingTop: '0.35rem' }}>
                      <div style={{ padding: '0.45rem 0.65rem', borderRadius: '8px', backgroundColor: 'var(--pub-surface)', border: '1px solid var(--pub-line)', fontSize: '0.725rem' }}>
                        <div style={{ color: 'var(--pub-muted)', fontSize: '0.65rem' }}>Surat Tugas</div>
                        <div style={{ fontWeight: 700, color: 'var(--pub-teal)', marginTop: '0.1rem' }}>✓ Lengkap</div>
                      </div>
                      <div style={{ padding: '0.45rem 0.65rem', borderRadius: '8px', backgroundColor: 'var(--pub-surface)', border: '1px solid var(--pub-line)', fontSize: '0.725rem' }}>
                        <div style={{ color: 'var(--pub-muted)', fontSize: '0.65rem' }}>Kartu Pelajar</div>
                        <div style={{ fontWeight: 700, color: pt.status === 'VALIDATED' ? 'var(--pub-teal)' : 'var(--pub-amber)', marginTop: '0.1rem' }}>
                          {pt.status === 'VALIDATED' ? '✓ Lengkap' : '⏳ Review'}
                        </div>
                      </div>
                      <div style={{ padding: '0.45rem 0.65rem', borderRadius: '8px', backgroundColor: 'var(--pub-surface)', border: '1px solid var(--pub-line)', fontSize: '0.725rem' }}>
                        <div style={{ color: 'var(--pub-muted)', fontSize: '0.65rem' }}>Surat Kesehatan</div>
                        <div style={{ fontWeight: 700, color: pt.status === 'VALIDATED' ? 'var(--pub-teal)' : 'var(--pub-coral)', marginTop: '0.1rem' }}>
                          {pt.status === 'VALIDATED' ? '✓ Lengkap' : '⚠️ Perlu Update'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--pub-muted)', fontSize: '0.85rem' }}>
                  Belum ada peserta yang mendaftar pada event ini.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--pub-line)' }}>
              <button
                type="button"
                onClick={() => setSelectedDocsEvent(null)}
                className="pub-btn-coral"
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.825rem' }}
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

