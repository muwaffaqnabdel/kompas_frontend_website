import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';

function buildDefaultTimeline(eventDate) {
  let dayStr = 'Sesuai tanggal lomba';
  if (eventDate) {
    try {
      const d = new Date(eventDate);
      if (!Number.isNaN(d.getTime())) {
        dayStr = d.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
    } catch {}
  }

  return [
    {
      id: 'step-1',
      title: 'Pendaftaran Tim',
      date: 'Pendaftaran Dibuka',
      description: 'Registrasi kontingen dan pengisian anggota pasukan.',
      status: 'AUTO',
    },
    {
      id: 'step-2',
      title: 'Validasi Berkas',
      date: 'H-7 sebelum TM',
      description: 'Pemeriksaan kelengkapan berkas oleh panitia.',
      status: 'AUTO',
    },
    {
      id: 'step-3',
      title: 'Technical Meeting',
      date: 'Menyusul',
      description: 'Penjelasan juknis & pengundian nomor urut tampil.',
      status: 'AUTO',
    },
    {
      id: 'step-4',
      title: 'Jadwal Tampil',
      date: 'Setelah TM',
      description: 'Penetapan nomor urut dan jam tampil pasukan.',
      status: 'AUTO',
    },
    {
      id: 'step-5',
      title: 'Penampilan Hari H',
      date: dayStr,
      description: 'Pelaksanaan lomba di lokasi arena utama.',
      status: 'AUTO',
    },
    {
      id: 'step-6',
      title: 'Hasil & Evaluasi Juri',
      date: dayStr,
      description: 'Publikasi nilai resmi, audio, dan evaluasi Dewan Juri.',
      status: 'AUTO',
    },
  ];
}

const STATUS_OPTIONS = [
  { value: 'AUTO', label: 'Otomatis (Ikuti Status Tim/Event)' },
  { value: 'COMPLETED', label: 'Selesai (Centang)' },
  { value: 'CURRENT', label: 'Sedang Berjalan (Aktif)' },
  { value: 'UPCOMING', label: 'Mendatang' },
];

export default function AdminPanitiaTimelineConfig({ currentEvent, onUpdateEvent, eventId }) {
  const [steps, setSteps] = useState(() =>
    Array.isArray(currentEvent?.timeline) && currentEvent.timeline.length > 0
      ? currentEvent.timeline
      : buildDefaultTimeline(currentEvent?.eventDate)
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentEvent) return;
    if (Array.isArray(currentEvent.timeline) && currentEvent.timeline.length > 0) {
      setSteps(currentEvent.timeline);
    } else {
      setSteps(buildDefaultTimeline(currentEvent.eventDate));
    }
  }, [currentEvent?.id, JSON.stringify(currentEvent?.timeline || null)]);

  const handleStepChange = (idx, field, value) => {
    setSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const handleAddStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        id: `step-${Date.now()}`,
        title: `Tahapan ${prev.length + 1}`,
        date: '',
        description: '',
        status: 'UPCOMING',
      },
    ]);
  };

  const handleRemoveStep = (idx) => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMoveStep = (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= steps.length) return;
    setSteps((prev) => {
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[target];
      next[target] = temp;
      return next;
    });
  };

  const handleResetDefault = () => {
    setSteps(buildDefaultTimeline(currentEvent?.eventDate));
  };

  const handleSave = async () => {
    const validSteps = steps
      .map((s, idx) => ({
        id: s.id || `step-${idx + 1}`,
        title: String(s.title || '').trim(),
        date: String(s.date || '').trim(),
        description: String(s.description || '').trim(),
        status: s.status || 'AUTO',
      }))
      .filter((s) => s.title.length > 0);

    if (validSteps.length === 0) {
      alert('Minimal harus ada 1 tahapan timeline dengan judul.');
      return;
    }

    setSaving(true);
    try {
      const targetId = currentEvent?.id || eventId;
      if (onUpdateEvent) {
        await onUpdateEvent({
          eventId: targetId,
          timeline: validSteps,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', fontFamily: 'var(--font-sans)' }}>
      {/* Header Card */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.35rem 1.65rem',
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
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--pub-coral)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            TIMELINE TAHAPAN LOMBA
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0.2rem 0 0.25rem 0' }}>
            Atur Timeline Event — {currentEvent?.name || 'Event Aktif'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--pub-muted)', margin: 0 }}>
            Tahapan dan tanggal di sini akan langsung tampil pada Dashboard Peserta untuk event ini.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleResetDefault}
            className="pub-btn-outline"
            style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem' }}
          >
            Reset Bawaan (6 Tahap)
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="pub-btn-coral"
            style={{
              fontSize: '0.82rem',
              padding: '0.52rem 1.15rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: saving ? 'wait' : 'pointer',
            }}
          >
            {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
            <span>{saving ? 'Menyimpan...' : 'Simpan Timeline'}</span>
          </button>
        </div>
      </div>

      {/* Live Preview Mini Timeline */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--pub-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.9rem' }}>
          Pratinjau di Dashboard Peserta
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', overflowX: 'auto', padding: '0.45rem 0' }}>
          {(() => {
            const currIdx = steps.findIndex((s) => s.status === 'CURRENT');
            const highestIdx =
              currIdx >= 0
                ? currIdx
                : steps.reduce((acc, s, i) => (s.status === 'COMPLETED' ? i : acc), -1);

            return steps.map((st, idx) => {
              const isDone = st.status === 'COMPLETED';
              const isCurr = st.status === 'CURRENT';
              const isReached = isDone || isCurr || idx <= highestIdx;
              const leftActive = idx > 0 && isReached;
              const rightActive = idx < steps.length - 1 && idx < highestIdx;

              return (
                <div
                  key={st.id || idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    minWidth: '125px',
                    flex: '1 1 0px',
                    padding: '0 0.25rem',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.4rem' }}>
                    {idx > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: '50%',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          height: leftActive ? '3.5px' : '2px',
                          backgroundColor: leftActive ? '#C94B3C' : 'var(--pub-line)',
                        }}
                      />
                    )}
                    {idx < steps.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '50%',
                          right: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          height: rightActive ? '3.5px' : '2px',
                          backgroundColor: rightActive ? '#C94B3C' : 'var(--pub-line)',
                        }}
                      />
                    )}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        width: isCurr ? '36px' : '32px',
                        height: isCurr ? '36px' : '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isDone || isCurr ? '#C94B3C' : 'var(--pub-surface)',
                        border: isCurr ? '3px solid #FFFFFF' : isDone ? 'none' : '2px solid var(--pub-line)',
                        color: isDone || isCurr ? '#FFFFFF' : 'var(--pub-muted)',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        boxShadow: isCurr ? '0 0 0 3px rgba(201, 75, 60, 0.25)' : 'none',
                      }}
                    >
                      {isDone ? '✓' : idx + 1}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: isCurr ? 800 : 700, color: isCurr ? '#C94B3C' : 'var(--pub-ink)' }}>
                    {st.title || `Tahap ${idx + 1}`}
                  </div>
                  {st.date && (
                    <div style={{ fontSize: '0.68rem', color: isCurr ? '#C94B3C' : 'var(--pub-muted)', marginTop: '0.15rem' }}>
                      {st.date}
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Editor List */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.35rem 1.5rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.9rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <strong style={{ fontSize: '0.92rem', color: 'var(--pub-ink)' }}>
            Daftar Tahapan ({steps.length} Tahap)
          </strong>
          <button
            type="button"
            onClick={handleAddStep}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--pub-navy)',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Plus size={14} />
            <span>Tambah Tahapan</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {steps.map((step, idx) => (
            <div
              key={step.id || idx}
              style={{
                border: '1px solid var(--pub-line)',
                borderRadius: '12px',
                padding: '0.95rem 1.05rem',
                backgroundColor: 'var(--pub-canvas)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.7rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--pub-coral)' }}>
                  TAHAP {String(idx + 1).padStart(2, '0')}
                </span>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveStep(idx, -1)}
                    style={{
                      padding: '0.28rem 0.45rem',
                      borderRadius: '6px',
                      border: '1px solid var(--pub-line)',
                      backgroundColor: '#FFFFFF',
                      color: idx === 0 ? '#CBD5E1' : '#334155',
                      cursor: idx === 0 ? 'not-allowed' : 'pointer',
                    }}
                    title="Geser ke atas"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === steps.length - 1}
                    onClick={() => handleMoveStep(idx, 1)}
                    style={{
                      padding: '0.28rem 0.45rem',
                      borderRadius: '6px',
                      border: '1px solid var(--pub-line)',
                      backgroundColor: '#FFFFFF',
                      color: idx === steps.length - 1 ? '#CBD5E1' : '#334155',
                      cursor: idx === steps.length - 1 ? 'not-allowed' : 'pointer',
                    }}
                    title="Geser ke bawah"
                  >
                    <ArrowDown size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={steps.length <= 1}
                    onClick={() => handleRemoveStep(idx)}
                    style={{
                      padding: '0.28rem 0.45rem',
                      borderRadius: '6px',
                      border: '1px solid #FECACA',
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      cursor: steps.length <= 1 ? 'not-allowed' : 'pointer',
                      opacity: steps.length <= 1 ? 0.5 : 1,
                    }}
                    title="Hapus tahapan"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.7rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    Judul Tahapan *
                  </label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                    placeholder="Contoh: Technical Meeting"
                    style={{ width: '100%', padding: '0.52rem 0.7rem', borderRadius: '8px', border: '1px solid var(--pub-line)', backgroundColor: '#FFFFFF', fontSize: '0.84rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    Tanggal / Rentang Waktu
                  </label>
                  <input
                    type="text"
                    value={step.date}
                    onChange={(e) => handleStepChange(idx, 'date', e.target.value)}
                    placeholder="Contoh: 10 - 15 Nov 2026"
                    style={{ width: '100%', padding: '0.52rem 0.7rem', borderRadius: '8px', border: '1px solid var(--pub-line)', backgroundColor: '#FFFFFF', fontSize: '0.84rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    Mode Status Tahap
                  </label>
                  <select
                    value={step.status || 'AUTO'}
                    onChange={(e) => handleStepChange(idx, 'status', e.target.value)}
                    style={{ width: '100%', padding: '0.52rem 0.7rem', borderRadius: '8px', border: '1px solid var(--pub-line)', backgroundColor: '#FFFFFF', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Keterangan Singkat (Opsional)
                </label>
                <input
                  type="text"
                  value={step.description || ''}
                  onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                  placeholder="Penjelasan singkat kegiatan pada tahapan ini..."
                  style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: '8px', border: '1px solid var(--pub-line)', backgroundColor: '#FFFFFF', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

