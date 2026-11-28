import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, ExternalLink, Loader2, User } from 'lucide-react';

const STATUS_META = {
  DRAFT: { label: 'Draft', bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' },
  SUBMITTED: { label: 'Menunggu Verifikasi', bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' },
  REVISION_REQUIRED: { label: 'Perlu Revisi', bg: '#FEE2E2', color: '#B91C1C', border: '#FECACA' },
  VALIDATED: { label: 'Tervalidasi', bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' },
  SCHEDULED: { label: 'Terjadwal', bg: '#E0F2FE', color: '#0369A1', border: '#BAE6FD' },
  SCORED: { label: 'Sudah Dinilai', bg: '#EDE9FE', color: '#6D28D9', border: '#DDD6FE' },
  FEEDBACK_GENERATED: { label: 'Evaluasi Selesai', bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' },
  FINALIZED: { label: 'Final', bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' },
};

function formatTimeHHMM(dateVal) {
  if (!dateVal) return '';
  try {
    const d = new Date(dateVal);
    if (Number.isNaN(d.getTime())) return '';
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  } catch {
    return '';
  }
}

export default function AdminPanitiaParticipantTable({ eventId, currentEvent }) {
  const activeEventId = currentEvent?.id || eventId || '';

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toast, setToast] = useState(null);

  // Modal Inspect Berkas & Pasukan
  const [inspectTeam, setInspectTeam] = useState(null);
  const [inspectTab, setInspectTab] = useState('docs'); // 'docs' | 'members'
  const [docDrafts, setDocDrafts] = useState({}); // { [documentId]: { status, rejectionNote } }
  const [generalRevisionNote, setGeneralRevisionNote] = useState('');
  const [savingVerify, setSavingVerify] = useState(false);

  // Modal Atur Nomor Urut & Jam Tampil
  const [scheduleTeam, setScheduleTeam] = useState(null);
  const [queueInput, setQueueInput] = useState('');
  const [timeInput, setTimeInput] = useState('08:30');
  const [savingSchedule, setSavingSchedule] = useState(false);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchParticipants = async (targetId) => {
    if (!targetId) {
      setParticipants([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `/api/panitia/participants?eventId=${encodeURIComponent(targetId)}`,
        { credentials: 'include' }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal memuat daftar kontingen.');
      }
      setParticipants(Array.isArray(data.participants) ? data.participants : []);
    } catch (err) {
      setError(err.message || 'Terjadi kendala saat mengambil data peserta dari server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants(activeEventId);
  }, [activeEventId]);

  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      if (statusFilter === 'VALIDATED_ALL') {
        if (!['VALIDATED', 'SCHEDULED', 'SCORED', 'FEEDBACK_GENERATED', 'FINALIZED'].includes(p.status)) {
          return false;
        }
      } else if (statusFilter !== 'ALL' && p.status !== statusFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hit =
          String(p.schoolName || '').toLowerCase().includes(q) ||
          String(p.teamName || '').toLowerCase().includes(q) ||
          String(p.registrationNumber || '').toLowerCase().includes(q) ||
          String(p.category || '').toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
  }, [participants, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = participants.length;
    const validated = participants.filter((p) =>
      ['VALIDATED', 'SCHEDULED', 'SCORED', 'FEEDBACK_GENERATED', 'FINALIZED'].includes(p.status)
    ).length;
    const submitted = participants.filter((p) => p.status === 'SUBMITTED').length;
    const needsAction = participants.filter((p) =>
      ['DRAFT', 'REVISION_REQUIRED'].includes(p.status)
    ).length;
    return { total, validated, submitted, needsAction };
  }, [participants]);

  const openInspectModal = (team) => {
    setInspectTeam(team);
    setInspectTab('docs');
    setGeneralRevisionNote(team.revisionNotes || '');
    const initialDrafts = {};
    for (const d of team.documents || []) {
      if (d.documentId) {
        initialDrafts[d.documentId] = {
          status: d.status === 'VERIFIED' ? 'APPROVED' : d.status === 'REJECTED' ? 'REJECTED' : 'PENDING',
          rejectionNote: d.rejectionNote || '',
        };
      }
    }
    setDocDrafts(initialDrafts);
  };

  const updateDocDraft = (documentId, patch) => {
    setDocDrafts((prev) => ({
      ...prev,
      [documentId]: {
        ...(prev[documentId] || { status: 'PENDING', rejectionNote: '' }),
        ...patch,
      },
    }));
  };

  const handleSaveVerification = async (targetStatus) => {
    if (!inspectTeam) return;
    setSavingVerify(true);
    try {
      const documentUpdates = Object.entries(docDrafts).map(([documentId, val]) => ({
        documentId,
        status: targetStatus === 'VALIDATED' && val.status === 'PENDING' ? 'APPROVED' : val.status,
        rejectionNote: val.rejectionNote || '',
      }));

      const res = await fetch(`/api/panitia/participants/${encodeURIComponent(inspectTeam.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          eventId: activeEventId,
          status: targetStatus,
          revisionNotes: targetStatus === 'REVISION_REQUIRED' ? generalRevisionNote : '',
          documentUpdates,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menyimpan verifikasi.');
      }

      if (data.participant) {
        setParticipants((prev) =>
          prev.map((p) => (p.id === data.participant.id ? data.participant : p))
        );
      } else {
        await fetchParticipants(activeEventId);
      }
      setInspectTeam(null);
      showToast(
        'success',
        targetStatus === 'VALIDATED'
          ? `Kontingen "${inspectTeam.teamName}" resmi divalidasi!`
          : `Permintaan revisi dikirim ke "${inspectTeam.teamName}".`
      );
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSavingVerify(false);
    }
  };

  const openScheduleModal = (team) => {
    setScheduleTeam(team);
    setQueueInput(team.queueNumber != null ? String(team.queueNumber) : '');
    setTimeInput(formatTimeHHMM(team.performanceTime) || '08:30');
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    if (!scheduleTeam) return;
    setSavingSchedule(true);
    try {
      const res = await fetch(`/api/panitia/participants/${encodeURIComponent(scheduleTeam.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          eventId: activeEventId,
          queueNumber: queueInput.trim() === '' ? null : Number(queueInput),
          performanceTime: timeInput.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menyimpan nomor urut tampil.');
      }
      if (data.participant) {
        setParticipants((prev) =>
          prev.map((p) => (p.id === data.participant.id ? data.participant : p))
        );
      } else {
        await fetchParticipants(activeEventId);
      }
      setScheduleTeam(null);
      showToast('success', `Nomor urut & jam tampil "${scheduleTeam.teamName}" tersimpan ke database.`);
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSavingSchedule(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'var(--font-sans)' }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 99999,
            backgroundColor: toast.type === 'error' ? '#FEF2F2' : '#ECFDF5',
            border: `1px solid ${toast.type === 'error' ? '#FCA5A5' : '#6EE7B7'}`,
            color: toast.type === 'error' ? '#991B1B' : '#065F46',
            padding: '0.8rem 1.1rem',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.14)',
            fontSize: '0.84rem',
            fontWeight: 700,
          }}
        >
          {toast.text}
        </div>
      )}

      {/* 1. Ringkasan Statistik Pendaftar Real DB */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.9rem' }}>
        {[
          { label: 'Total Kontingen', value: stats.total, color: 'var(--pub-ink)' },
          { label: 'Tervalidasi / Terjadwal', value: stats.validated, color: 'var(--pub-teal)' },
          { label: 'Menunggu Verifikasi', value: stats.submitted, color: '#B45309' },
          { label: 'Draft / Perlu Revisi', value: stats.needsAction, color: 'var(--pub-coral)' },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              backgroundColor: 'var(--pub-surface)',
              borderRadius: '14px',
              padding: '1rem 1.2rem',
              border: '1px solid var(--pub-line)',
              boxShadow: 'var(--pub-shadow-card)',
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
              {card.label}
            </div>
            <div className="tabular-nums" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.65rem', fontWeight: 800, color: card.color, marginTop: '0.2rem' }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Kartu Tabel Peserta */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.4rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
              Daftar Kontingen Terdaftar — {currentEvent?.name || 'Event Aktif'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
              Data langsung dari database Supabase. Verifikasi berkas, cek pas foto pasukan, dan tetapkan nomor urut tampil.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchParticipants(activeEventId)}
            disabled={loading}
            className="pub-btn-outline"
            style={{ fontSize: '0.78rem', padding: '0.45rem 0.9rem', cursor: 'pointer' }}
          >
            {loading ? 'Memuat...' : 'Segarkan Data'}
          </button>
        </div>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
            <Search size={15} color="var(--pub-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Cari sekolah, nama tim, atau no. registrasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem 0.55rem 2.2rem',
                borderRadius: '9px',
                border: '1px solid var(--pub-line)',
                backgroundColor: 'var(--pub-canvas)',
                fontSize: '0.83rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: `Semua (${participants.length})` },
              { id: 'SUBMITTED', label: `Diajukan (${stats.submitted})` },
              { id: 'VALIDATED_ALL', label: `Tervalidasi (${stats.validated})` },
              { id: 'REVISION_REQUIRED', label: 'Revisi' },
              { id: 'DRAFT', label: 'Draft' },
            ].map((f) => {
              const active = statusFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id)}
                  style={{
                    padding: '0.38rem 0.78rem',
                    borderRadius: '9999px',
                    border: active ? '1px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                    backgroundColor: active ? 'var(--pub-coral)' : 'var(--pub-canvas)',
                    color: active ? '#FFFFFF' : 'var(--pub-ink)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--pub-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '0.84rem' }}>Memuat data pendaftar dari Supabase...</span>
          </div>
        ) : error ? (
          <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '0.84rem' }}>
            {error}
          </div>
        ) : filteredParticipants.length === 0 ? (
          <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--pub-muted)', backgroundColor: 'var(--pub-canvas)', borderRadius: '12px', border: '1px dashed var(--pub-line)', fontSize: '0.85rem' }}>
            {participants.length === 0
              ? `Belum ada kontingen yang mendaftar pada event ${currentEvent?.name || 'ini'}.`
              : 'Tidak ada kontingen yang sesuai dengan filter pencarian.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--pub-canvas)', borderBottom: '2px solid var(--pub-line)', fontSize: '0.73rem', textTransform: 'uppercase', color: 'var(--pub-muted)' }}>
                  <th style={{ padding: '0.75rem 0.85rem' }}>No. Urut</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Sekolah & Nama Pasukan</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Pasukan</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Kelengkapan Berkas</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.85rem', textAlign: 'right' }}>Aksi Panitia</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((p) => {
                  const meta = STATUS_META[p.status] || STATUS_META.DRAFT;
                  const timeStr = formatTimeHHMM(p.performanceTime);
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td className="tabular-nums" style={{ padding: '0.85rem' }}>
                        <div style={{ fontWeight: 800, color: p.queueNumber ? 'var(--pub-coral)' : '#94A3B8', fontSize: '0.92rem' }}>
                          {p.queueNumber ? `#${String(p.queueNumber).padStart(2, '0')}` : 'Belum'}
                        </div>
                        {timeStr && (
                          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{timeStr} WIB</div>
                        )}
                      </td>

                      <td style={{ padding: '0.85rem' }}>
                        <div style={{ fontWeight: 800, color: 'var(--pub-ink)', fontSize: '0.88rem' }}>
                          {p.schoolName}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--pub-muted)', marginTop: '0.1rem' }}>
                          {p.teamName} · <span style={{ fontFamily: 'var(--font-mono)' }}>{p.registrationNumber}</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.1rem' }}>
                          Official: {p.official?.name} {p.official?.phone ? `(${p.official.phone})` : ''}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--pub-ink)' }}>{p.membersCount} Orang</div>
                        <div style={{ fontSize: '0.73rem', color: 'var(--pub-muted)' }}>{p.category}</div>
                      </td>

                      <td style={{ padding: '0.85rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--pub-ink)' }} className="tabular-nums">
                          {p.docsSummary.uploaded}/{p.docsSummary.total} Diunggah
                        </div>
                        <div style={{ fontSize: '0.73rem', color: p.docsSummary.rejected > 0 ? '#DC2626' : 'var(--pub-teal)', fontWeight: 600 }}>
                          {p.docsSummary.verified} Terverifikasi
                          {p.docsSummary.rejected > 0 ? ` · ${p.docsSummary.rejected} Revisi` : ''}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem' }}>
                        <span
                          style={{
                            backgroundColor: meta.bg,
                            color: meta.color,
                            border: `1px solid ${meta.border}`,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {meta.label}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => openInspectModal(p)}
                            className="pub-btn-coral"
                            style={{ padding: '0.42rem 0.8rem', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Periksa Berkas
                          </button>
                          <button
                            type="button"
                            onClick={() => openScheduleModal(p)}
                            style={{
                              padding: '0.42rem 0.75rem',
                              borderRadius: '8px',
                              border: '1px solid var(--pub-line)',
                              backgroundColor: '#FFFFFF',
                              color: 'var(--pub-ink)',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            No. Urut
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: PERIKSA BERKAS ASLI & PAS FOTO PASUKAN */}
      {inspectTeam && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '820px',
              maxHeight: '92vh',
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(15, 23, 42, 0.28)',
            }}
          >
            {/* Header */}
            <div style={{ padding: '1.15rem 1.4rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--pub-coral)', textTransform: 'uppercase' }}>
                  Verifikasi Kontingen
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0.15rem 0 0 0' }}>
                  {inspectTeam.schoolName} — {inspectTeam.teamName}
                </h3>
              </div>
              <button type="button" onClick={() => setInspectTeam(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            {/* Sub-tab Modal */}
            <div style={{ padding: '0.75rem 1.4rem 0', display: 'flex', gap: '0.5rem', borderBottom: '1px solid #E2E8F0' }}>
              {[
                { id: 'docs', label: `Berkas Persyaratan (${inspectTeam.docsSummary.uploaded}/${inspectTeam.docsSummary.total})` },
                { id: 'members', label: `Pasukan & Pas Foto (${inspectTeam.membersCount} Orang)` },
              ].map((t) => {
                const active = inspectTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setInspectTab(t.id)}
                    style={{
                      padding: '0.55rem 0.9rem',
                      background: 'none',
                      border: 'none',
                      borderBottom: active ? '2.5px solid var(--pub-coral)' : '2.5px solid transparent',
                      color: active ? 'var(--pub-coral)' : '#64748B',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Body */}
            <div style={{ padding: '1.25rem 1.4rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {inspectTab === 'docs' ? (
                <>
                  {(inspectTeam.documents || []).map((doc) => {
                    const draft = doc.documentId ? docDrafts[doc.documentId] : null;
                    return (
                      <div
                        key={doc.requirementId}
                        style={{
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          padding: '0.95rem 1.05rem',
                          backgroundColor: '#F8FAFC',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.6rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.6rem' }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0F172A' }}>
                              {doc.title}
                            </div>
                            {doc.fileName ? (
                              <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                                <span>{doc.fileName}</span>
                                {doc.fileSize && <span style={{ color: '#64748B' }}>({doc.fileSize})</span>}
                                {doc.fileUrl && (
                                  <a
                                    href={doc.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: 'var(--pub-teal)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}
                                  >
                                    <span>Buka File</span>
                                    <ExternalLink size={12} />
                                  </a>
                                )}
                              </div>
                            ) : (
                              <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                                Belum diunggah oleh peserta
                              </div>
                            )}
                          </div>

                          {doc.documentId && draft && (
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              <button
                                type="button"
                                onClick={() => updateDocDraft(doc.documentId, { status: 'APPROVED', rejectionNote: '' })}
                                style={{
                                  padding: '0.35rem 0.7rem',
                                  borderRadius: '7px',
                                  border: draft.status === 'APPROVED' ? '1.5px solid #059669' : '1px solid #CBD5E1',
                                  backgroundColor: draft.status === 'APPROVED' ? '#ECFDF5' : '#FFFFFF',
                                  color: draft.status === 'APPROVED' ? '#047857' : '#475569',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                Setujui
                              </button>
                              <button
                                type="button"
                                onClick={() => updateDocDraft(doc.documentId, { status: 'REJECTED' })}
                                style={{
                                  padding: '0.35rem 0.7rem',
                                  borderRadius: '7px',
                                  border: draft.status === 'REJECTED' ? '1.5px solid #DC2626' : '1px solid #CBD5E1',
                                  backgroundColor: draft.status === 'REJECTED' ? '#FEF2F2' : '#FFFFFF',
                                  color: draft.status === 'REJECTED' ? '#B91C1C' : '#475569',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                Minta Revisi
                              </button>
                            </div>
                          )}
                        </div>

                        {doc.documentId && draft?.status === 'REJECTED' && (
                          <input
                            type="text"
                            placeholder="Tulis catatan revisi untuk berkas ini (tampil di akun Peserta)..."
                            value={draft.rejectionNote || ''}
                            onChange={(e) => updateDocDraft(doc.documentId, { rejectionNote: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.7rem',
                              borderRadius: '8px',
                              border: '1px solid #FCA5A5',
                              backgroundColor: '#FFFFFF',
                              fontSize: '0.8rem',
                              boxSizing: 'border-box',
                            }}
                          />
                        )}
                      </div>
                    );
                  })}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                      Catatan Umum Revisi Kontingen (Opsional)
                    </label>
                    <textarea
                      rows={2}
                      value={generalRevisionNote}
                      onChange={(e) => setGeneralRevisionNote(e.target.value)}
                      placeholder="Tambahkan catatan umum jika meminta revisi kepada kontingen..."
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '9px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.82rem',
                        fontFamily: 'var(--font-sans)',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </>
              ) : inspectTeam.members.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B', fontSize: '0.84rem' }}>
                  Kontingen belum menambahkan daftar anggota pasukan.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.75rem' }}>
                  {inspectTeam.members.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        border: m.roleInTeam === 'DANTON' ? '1.5px solid var(--pub-coral)' : '1px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '0.7rem',
                        display: 'flex',
                        gap: '0.65rem',
                        alignItems: 'center',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <div
                        style={{
                          width: '54px',
                          height: '70px',
                          borderRadius: '7px',
                          backgroundColor: '#F1F5F9',
                          overflow: 'hidden',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {m.photoUrl ? (
                          <img src={m.photoUrl} alt={m.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <User size={18} color="#94A3B8" />
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <span style={{ fontSize: '0.64rem', fontWeight: 800, color: m.roleInTeam === 'DANTON' ? '#DC2626' : '#047857', textTransform: 'uppercase' }}>
                          {m.roleInTeam}
                        </span>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', wordBreak: 'break-word' }}>
                          {m.fullName}
                        </div>
                        {m.ttl && <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{m.ttl}</div>}
                        {m.nisn && <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>NISN: {m.nisn}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Aksi */}
            <div style={{ padding: '1rem 1.4rem', borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
              <button
                type="button"
                disabled={savingVerify}
                onClick={() => handleSaveVerification('REVISION_REQUIRED')}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '9px',
                  border: '1px solid #FCA5A5',
                  backgroundColor: '#FEF2F2',
                  color: '#B91C1C',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Kirim Permintaan Revisi
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  disabled={savingVerify}
                  onClick={() => setInspectTeam(null)}
                  style={{ padding: '0.55rem 1rem', borderRadius: '9px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Tutup
                </button>
                <button
                  type="button"
                  disabled={savingVerify}
                  onClick={() => handleSaveVerification('VALIDATED')}
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '9px',
                    border: 'none',
                    backgroundColor: '#0D9488',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {savingVerify ? 'Menyimpan...' : 'Validasi & Loloskan Kontingen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ATUR NOMOR URUT & JAM TAMPIL */}
      {scheduleTeam && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <form
            onSubmit={handleSaveSchedule}
            style={{
              width: '100%',
              maxWidth: '440px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.35rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 24px 60px rgba(15, 23, 42, 0.28)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.08rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Atur Nomor Urut & Jam Tampil
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.15rem' }}>
                  {scheduleTeam.schoolName} — {scheduleTeam.teamName}
                </div>
              </div>
              <button type="button" onClick={() => setScheduleTeam(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Nomor Urut Undian
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="Contoh: 1"
                  value={queueInput}
                  onChange={(e) => setQueueInput(e.target.value)}
                  style={{ width: '100%', padding: '0.58rem 0.75rem', borderRadius: '9px', border: '1px solid #CBD5E1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Jam Tampil (WIB)
                </label>
                <input
                  type="time"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  style={{ width: '100%', padding: '0.58rem 0.75rem', borderRadius: '9px', border: '1px solid #CBD5E1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setScheduleTeam(null)}
                style={{ padding: '0.52rem 0.95rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={savingSchedule}
                className="pub-btn-coral"
                style={{ padding: '0.52rem 1.15rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
              >
                {savingSchedule ? 'Menyimpan...' : 'Simpan Nomor Urut'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
