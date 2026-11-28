import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Download } from 'lucide-react';

function formatDateTimeId(val) {
  if (!val) return '';
  try {
    return new Date(val).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';
  } catch {
    return String(val);
  }
}

export default function PesertaResultsView({ activeRegistration = null, onGoToEvents }) {
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('summary'); // 'summary' | 'breakdown' | 'leaderboard'
  const [leaderboardCategory, setLeaderboardCategory] = useState('ALL');

  const participantId = activeRegistration?.id || '';

  useEffect(() => {
    let cancelled = false;
    const loadResults = async () => {
      if (!participantId) {
        setResultData(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await fetch(
          `/api/peserta/results?participantId=${encodeURIComponent(participantId)}`,
          { credentials: 'include' }
        );
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Gagal memuat hasil penilaian.');
        }
        if (!cancelled) {
          setResultData(data.result || null);
          setLeaderboardCategory('ALL');
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Terjadi kendala koneksi saat memuat hasil.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadResults();
    return () => {
      cancelled = true;
    };
  }, [participantId]);

  // Klasemen yang terurut sesuai filter kategori
  const filteredLeaderboard = useMemo(() => {
    const list = Array.isArray(resultData?.leaderboard) ? resultData.leaderboard : [];
    if (leaderboardCategory === 'ALL') return list;
    return [...list]
      .sort(
        (a, b) =>
          (b.categoryScores?.[leaderboardCategory] || 0) -
          (a.categoryScores?.[leaderboardCategory] || 0)
      )
      .map((item, idx) => ({
        ...item,
        displayRank: idx + 1,
        displayScore: item.categoryScores?.[leaderboardCategory] ?? 0,
      }));
  }, [resultData?.leaderboard, leaderboardCategory]);

  // Grup rincian aba-aba per kategori
  const groupedDetailedScores = useMemo(() => {
    const list = Array.isArray(resultData?.detailedScores) ? resultData.detailedScores : [];
    const map = new Map();
    for (const item of list) {
      const cat = item.category || 'PBB';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat).push(item);
    }
    return [...map.entries()];
  }, [resultData?.detailedScores]);

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
          Belum Ada Event yang Diikuti
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--pub-muted)', maxWidth: '460px', margin: '0 auto 1.25rem auto', lineHeight: 1.55 }}>
          Daftar ke event lomba terlebih dahulu untuk melihat hasil penilaian, klasemen resmi, dan rekaman suara evaluasi Dewan Juri.
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

  if (loading) {
    return (
      <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--pub-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.85rem' }}>Memuat hasil penilaian & evaluasi Dewan Juri...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem 1.25rem', borderRadius: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '0.85rem', fontWeight: 600 }}>
        {error}
      </div>
    );
  }

  const eventInfo = resultData?.event || {};
  const participant = resultData?.participant || {};
  const isPublished = Boolean(resultData?.isPublished);
  const isScored = Boolean(resultData?.isScored);
  const feedbacks = Array.isArray(resultData?.feedbacks) ? resultData.feedbacks : [];
  const summary = resultData?.summary || null;
  const categories = Array.isArray(resultData?.categories) ? resultData.categories : [];

  const renderFeedbackSection = () => (
    <div
      style={{
        backgroundColor: 'var(--pub-surface)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid var(--pub-line)',
        boxShadow: 'var(--pub-shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            EVALUASI & REKAMAN SUARA ASLI DEWAN JURI
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.12rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0.2rem 0 0 0' }}>
            Catatan Pembinaan Pasukan ({feedbacks.length} Evaluasi)
          </h2>
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <div
          style={{
            padding: '1.65rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: 'var(--pub-canvas)',
            border: '1px dashed var(--pub-line)',
            textAlign: 'center',
            color: 'var(--pub-muted)',
            fontSize: '0.84rem',
            lineHeight: 1.55,
          }}
        >
          Belum ada catatan evaluasi atau rekaman suara resmi yang dikirimkan oleh Dewan Juri untuk tim{' '}
          <strong style={{ color: 'var(--pub-ink)' }}>{participant.teamName}</strong>. Setelah Juri menyetujui evaluasi suara (countdown 5 detik), rekaman asli dan ringkasan AI akan otomatis muncul di sini.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              style={{
                backgroundColor: '#FFFBFB',
                border: '1px solid #FECACA',
                borderLeft: '4px solid #DC2626',
                borderRadius: '12px',
                padding: '1.15rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                    {fb.judgeName}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '0.1rem' }}>
                    {fb.judgeRole}
                    {fb.judgeInstitution ? ` · ${fb.judgeInstitution}` : ''}
                  </div>
                </div>
                {fb.sentAt && (
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                    Dikirim: {formatDateTimeId(fb.sentAt)}
                  </span>
                )}
              </div>

              {/* Pemutar Audio Asli Rekaman Juri */}
              {fb.audioStorageUrl && (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '0.75rem 0.9rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#B91C1C' }}>
                      Rekaman Suara Asli Dewan Juri
                    </span>
                    <a
                      href={fb.audioStorageUrl}
                      target="_blank"
                      rel="noreferrer"
                      download
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#475569',
                        textDecoration: 'none',
                      }}
                    >
                      <Download size={12} />
                      <span>Unduh Audio</span>
                    </a>
                  </div>
                  <audio controls src={fb.audioStorageUrl} style={{ width: '100%', height: '38px' }} />
                </div>
              )}

              {/* Ringkasan Evaluasi Resmi (AI + Ditinjau Juri) */}
              {fb.refinedText && (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #F1F5F9',
                    borderRadius: '10px',
                    padding: '0.9rem 1rem',
                    fontSize: '0.86rem',
                    lineHeight: 1.65,
                    color: '#1E293B',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {fb.refinedText}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      {/* 1. Header Banner */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.45rem 1.7rem',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
            <span
              style={{
                backgroundColor: isPublished ? 'var(--pub-teal-light)' : '#FEF3C7',
                color: isPublished ? 'var(--pub-teal)' : '#B45309',
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
              }}
            >
              {isPublished ? 'HASIL RESMI DIPUBLIKASIKAN' : 'MENUNGGU PUBLIKASI HASIL'}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--pub-muted)', fontWeight: 600 }}>
              {eventInfo.name}
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0 0 0.2rem 0' }}>
            Nilai & Evaluasi Dewan Juri
          </h1>
          <p style={{ fontSize: '0.83rem', color: 'var(--pub-muted)', margin: 0 }}>
            Kontingen: <strong style={{ color: 'var(--pub-ink)' }}>{participant.schoolName}</strong> · Tim:{' '}
            <strong style={{ color: 'var(--pub-ink)' }}>{participant.teamName}</strong>
          </p>
        </div>

        {isPublished && (
          <button
            type="button"
            onClick={() => window.print()}
            className="pub-btn-outline"
            style={{ padding: '0.5rem 0.95rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Cetak / Simpan PDF
          </button>
        )}
      </div>

      {/* 2. Jika Hasil Akhir Belum Dipublikasikan oleh Admin Panitia */}
      {!isPublished ? (
        <>
          <div
            style={{
              backgroundColor: 'var(--pub-surface)',
              borderRadius: '16px',
              padding: '1.5rem 1.75rem',
              border: '1px solid var(--pub-line)',
              borderLeft: '5px solid var(--pub-amber)',
              boxShadow: 'var(--pub-shadow-card)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Status Pengumuman Skor & Klasemen
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.12rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0.3rem 0 0.45rem 0' }}>
              {isScored
                ? `Penilaian dari ${resultData.judgesCountScored} Dewan Juri Sudah Masuk`
                : 'Hasil & Peringkat Resmi Belum Dipublikasikan'}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--pub-muted)', margin: 0, lineHeight: 1.6 }}>
              {isScored
                ? 'Nilai tim Anda sudah tercatat dan terkunci oleh Dewan Juri. Total skor akhir, rincian nilai per aba-aba, dan klasemen resmi akan terbuka otomatis begitu Admin Panitia mengaktifkan publikasi hasil lomba.'
                : 'Rincian nilai, gelar kejuaraan, dan klasemen resmi akan tampil otomatis di halaman ini setelah seluruh pasukan selesai tampil dan Admin Panitia mempublikasikan hasil resmi.'}
            </p>
          </div>

          {/* Evaluasi suara yang sudah SENT oleh Juri tetap dapat didengarkan & dibaca peserta */}
          {renderFeedbackSection()}
        </>
      ) : (
        <>
          {/* 3. Hasil Sudah Dipublikasikan: Sub-Tab Navigasi */}
          <div
            style={{
              display: 'flex',
              gap: '0.4rem',
              backgroundColor: 'var(--pub-surface)',
              padding: '0.4rem',
              borderRadius: '12px',
              border: '1px solid var(--pub-line)',
              width: 'fit-content',
              flexWrap: 'wrap',
            }}
          >
            {[
              { id: 'summary', label: 'Ringkasan & Evaluasi Juri' },
              { id: 'breakdown', label: 'Rincian Nilai Aba-Aba' },
              { id: 'leaderboard', label: `Klasemen Resmi (${resultData?.leaderboard?.length || 0} Tim)` },
            ].map((tab) => {
              const active = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSubTab(tab.id)}
                  style={{
                    padding: '0.52rem 1.05rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: active ? 'var(--pub-coral)' : 'transparent',
                    color: active ? '#FFFFFF' : 'var(--pub-muted)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* SUB-TAB 1: RINGKASAN, RAIHAN & EVALUASI AUDIO JURI */}
          {activeSubTab === 'summary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Kartu Peringkat & Total Skor */}
              <div
                style={{
                  backgroundColor: 'var(--pub-navy)',
                  color: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '1.65rem 1.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--pub-sand)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    PERINGKAT RESMI KONTINGEN
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                    <span className="tabular-nums" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>
                      {summary?.rank ? `#${summary.rank}` : '-'}
                    </span>
                    <span style={{ fontSize: '0.88rem', color: '#CBD5E1' }}>
                      {summary?.totalRankedTeams
                        ? `dari ${summary.totalRankedTeams} tim yang dinilai`
                        : 'Belum ada nilai masuk'}
                    </span>
                  </div>

                  {summary?.achievements?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginTop: '0.85rem' }}>
                      {summary.achievements.map((gelar) => (
                        <span
                          key={gelar}
                          style={{
                            backgroundColor: 'rgba(201, 75, 60, 0.25)',
                            border: '1px solid rgba(254, 202, 202, 0.45)',
                            color: '#FEE2E2',
                            padding: '0.24rem 0.7rem',
                            borderRadius: '9999px',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                          }}
                        >
                          {gelar}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--pub-sand)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    TOTAL SKOR AKHIR
                  </div>
                  <div className="tabular-nums" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.3rem', fontWeight: 900, color: '#34D399', lineHeight: 1.1, marginTop: '0.25rem' }}>
                    {summary?.totalScore ?? 0}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginTop: '0.15rem' }}>
                    Dinilai oleh {resultData.judgesCountScored} Dewan Juri
                  </div>
                </div>
              </div>

              {/* Grid Skor Per Kategori */}
              {summary?.categoryBreakdown?.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.9rem' }}>
                  {summary.categoryBreakdown.map((cat) => (
                    <div
                      key={cat.category}
                      style={{
                        backgroundColor: 'var(--pub-surface)',
                        borderRadius: '14px',
                        padding: '1.15rem 1.25rem',
                        border: '1px solid var(--pub-line)',
                        boxShadow: 'var(--pub-shadow-card)',
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
                        {cat.category}
                      </div>
                      <div className="tabular-nums" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.55rem', fontWeight: 800, color: 'var(--pub-ink)', marginTop: '0.3rem' }}>
                        {cat.score} Pts
                      </div>
                      <div style={{ fontSize: '0.74rem', color: cat.rank === 1 ? 'var(--pub-teal)' : 'var(--pub-muted)', fontWeight: 700, marginTop: '0.2rem' }}>
                        {cat.rank ? `Peringkat #${cat.rank} dari ${cat.totalTeamsInCategory} tim` : 'Belum ada skor'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Evaluasi & Pemutar Audio Asli Dewan Juri */}
              {renderFeedbackSection()}
            </div>
          )}

          {/* SUB-TAB 2: RINCIAN NILAI PER ABA-ABA */}
          {activeSubTab === 'breakdown' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {groupedDetailedScores.length === 0 ? (
                <div style={{ backgroundColor: 'var(--pub-surface)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--pub-line)', textAlign: 'center', color: 'var(--pub-muted)', fontSize: '0.85rem' }}>
                  Belum ada rincian nilai aba-aba yang tercatat untuk tim ini.
                </div>
              ) : (
                groupedDetailedScores.map(([categoryName, rows]) => {
                  const catSubtotal = rows.reduce((sum, r) => sum + (Number(r.subtotal) || 0), 0);
                  return (
                    <div
                      key={categoryName}
                      style={{
                        backgroundColor: 'var(--pub-surface)',
                        borderRadius: '16px',
                        border: '1px solid var(--pub-line)',
                        boxShadow: 'var(--pub-shadow-card)',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--pub-canvas)', borderBottom: '1px solid var(--pub-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.92rem', color: 'var(--pub-ink)' }}>
                          Kategori: {categoryName}
                        </strong>
                        <span className="tabular-nums" style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--pub-teal)' }}>
                          Total: {Number(catSubtotal.toFixed(2))} Pts
                        </span>
                      </div>

                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--pub-line)', color: 'var(--pub-muted)', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                              <th style={{ padding: '0.7rem 1rem', width: '52px' }}>No</th>
                              <th style={{ padding: '0.7rem 1rem' }}>Aba-Aba / Kriteria</th>
                              <th style={{ padding: '0.7rem 1rem' }}>Nilai Per Juri</th>
                              <th style={{ padding: '0.7rem 1rem', textAlign: 'right' }}>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row, idx) => (
                              <tr key={row.criterionId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td className="tabular-nums" style={{ padding: '0.7rem 1rem', color: 'var(--pub-muted)', fontWeight: 700 }}>
                                  {idx + 1}
                                </td>
                                <td style={{ padding: '0.7rem 1rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
                                  {row.name}
                                  {row.weight !== 1 && (
                                    <span style={{ fontSize: '0.72rem', color: 'var(--pub-muted)', marginLeft: '0.4rem' }}>
                                      (Bobot ×{row.weight})
                                    </span>
                                  )}
                                </td>
                                <td style={{ padding: '0.7rem 1rem' }}>
                                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                    {row.judgeScores.map((js) => (
                                      <span
                                        key={js.judgeId}
                                        className="tabular-nums"
                                        style={{
                                          fontSize: '0.74rem',
                                          fontWeight: 700,
                                          backgroundColor: '#F8FAFC',
                                          border: '1px solid #E2E8F0',
                                          borderRadius: '6px',
                                          padding: '0.15rem 0.45rem',
                                          color: '#334155',
                                        }}
                                      >
                                        {js.judgeName}: <strong>{js.scoreValue}</strong>
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="tabular-nums" style={{ padding: '0.7rem 1rem', textAlign: 'right', fontWeight: 800, color: 'var(--pub-ink)' }}>
                                  {row.subtotal}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* SUB-TAB 3: KLASEMEN RESMI (LEADERBOARD) */}
          {activeSubTab === 'leaderboard' && (
            <div
              style={{
                backgroundColor: 'var(--pub-surface)',
                borderRadius: '16px',
                padding: '1.35rem',
                border: '1px solid var(--pub-line)',
                boxShadow: 'var(--pub-shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
                <strong style={{ fontSize: '0.95rem', color: 'var(--pub-ink)' }}>
                  Klasemen Resmi — {eventInfo.name}
                </strong>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setLeaderboardCategory('ALL')}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '9999px',
                      border: leaderboardCategory === 'ALL' ? '1px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                      backgroundColor: leaderboardCategory === 'ALL' ? 'var(--pub-coral)' : 'var(--pub-canvas)',
                      color: leaderboardCategory === 'ALL' ? '#FFFFFF' : 'var(--pub-ink)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Juara Umum
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setLeaderboardCategory(cat)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '9999px',
                        border: leaderboardCategory === cat ? '1px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                        backgroundColor: leaderboardCategory === cat ? 'var(--pub-coral)' : 'var(--pub-canvas)',
                        color: leaderboardCategory === cat ? '#FFFFFF' : 'var(--pub-ink)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {filteredLeaderboard.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--pub-muted)', fontSize: '0.84rem' }}>
                  Belum ada tim dengan skor masuk pada event ini.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--pub-canvas)', borderBottom: '2px solid var(--pub-line)', fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--pub-muted)' }}>
                        <th style={{ padding: '0.75rem 0.9rem', width: '70px' }}>Peringkat</th>
                        <th style={{ padding: '0.75rem 0.9rem' }}>Kontingen & Pasukan</th>
                        <th style={{ padding: '0.75rem 0.9rem' }}>Jenjang</th>
                        <th style={{ padding: '0.75rem 0.9rem', textAlign: 'right' }}>
                          {leaderboardCategory === 'ALL' ? 'Total Skor' : `Skor ${leaderboardCategory}`}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeaderboard.map((row) => {
                        const rankNum = leaderboardCategory === 'ALL' ? row.rank : row.displayRank;
                        const scoreVal = leaderboardCategory === 'ALL' ? row.totalScore : row.displayScore;
                        return (
                          <tr
                            key={row.participantId}
                            style={{
                              borderBottom: '1px solid #F1F5F9',
                              backgroundColor: row.isCurrentTeam ? 'rgba(201, 75, 60, 0.08)' : 'transparent',
                            }}
                          >
                            <td className="tabular-nums" style={{ padding: '0.8rem 0.9rem', fontWeight: 900, color: rankNum <= 3 ? 'var(--pub-coral)' : 'var(--pub-ink)' }}>
                              #{rankNum}
                            </td>
                            <td style={{ padding: '0.8rem 0.9rem' }}>
                              <div style={{ fontWeight: 800, color: 'var(--pub-ink)', display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                                <span>{row.schoolName}</span>
                                {row.isCurrentTeam && (
                                  <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: 'var(--pub-coral)', color: '#FFFFFF', padding: '0.1rem 0.45rem', borderRadius: '9999px' }}>
                                    Tim Anda
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>{row.teamName}</div>
                            </td>
                            <td style={{ padding: '0.8rem 0.9rem', fontSize: '0.8rem', color: '#475569' }}>
                              {row.category}
                            </td>
                            <td className="tabular-nums" style={{ padding: '0.8rem 0.9rem', textAlign: 'right', fontWeight: 900, fontSize: '0.95rem', color: 'var(--pub-teal)' }}>
                              {scoreVal} Pts
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
