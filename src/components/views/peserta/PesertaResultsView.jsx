import React, { useState, useEffect } from 'react';
import {
  Download,
  Trophy,
  Award,
  Medal,
  Clock,
  Mic,
  Sparkles,
  ChevronRight,
  Shield,
  Layers,
  UserCheck,
} from 'lucide-react';
import {
  DEFAULT_OFFICIAL_RESULTS,
  getInitialOfficialResults,
  computeCategoryStandings,
  getTeamAchievements,
} from '../admin-panitia/AdminPanitiaResults';

export default function PesertaResultsView() {
  const [results, setResults] = useState(() => getInitialOfficialResults());
  const [selectedTeamId, setSelectedTeamId] = useState(() => results[0]?.teamId || 'part-1');
  const [activeMainTab, setActiveMainTab] = useState('summary'); // 'summary' | 'leaderboard'
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('overall'); // 'overall', 'pbb', 'variasi', 'danton', 'kostum'

  // Sinkronkan data hasil peserta secara real-time bila ada update data panitia
  useEffect(() => {
    const handleSync = () => setResults(getInitialOfficialResults());
    window.addEventListener('kompas_participants_updated', handleSync);
    return () => window.removeEventListener('kompas_participants_updated', handleSync);
  }, []);

  // Data tim yang sedang aktif dilihat
  const currentTeam = results.find((t) => t.teamId === selectedTeamId) || results[0] || DEFAULT_OFFICIAL_RESULTS[0];

  // Hitung raihan gelar dan klasemen
  const achievements = getTeamAchievements(currentTeam.teamId, results);
  const standings = computeCategoryStandings(results);
  const activeLeaderboardList = standings[activeCategoryFilter] || standings.overall;
  const currentTeamOverall = standings.overall.find((t) => t.teamId === currentTeam.teamId) || currentTeam;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '1020px',
        margin: '0 auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* 1. Header Banner & Selector Tim (Untuk Kemudahan Testing Demo) */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.5rem 1.75rem',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                backgroundColor: 'rgba(217, 119, 6, 0.12)',
                color: '#B45309',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.725rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              PENGUMUMAN HASIL RESMI
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>
              LKBB Nasional Paskibra 2026
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--pub-ink)',
              margin: '0 0 0.2rem 0',
              letterSpacing: '-0.015em',
            }}
          >
            Hasil & Raihan Kejuaraan Kontingen
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: 0 }}>
            Rekapitulasi resmi dewan juri mencakup Juara Umum serta gelar Best Category per aspek lomba.
          </p>
        </div>

        {/* Quick Team Selector & Download PDF */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            style={{
              fontSize: '0.775rem',
              fontWeight: 600,
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--pub-line)',
              backgroundColor: 'var(--pub-canvas)',
              color: 'var(--pub-ink)',
              cursor: 'pointer',
            }}
            title="Pilih tim untuk melihat raihan hasil"
          >
            {results.map((t) => (
              <option key={t.teamId} value={t.teamId}>
                {t.school} ({t.teamName})
              </option>
            ))}
          </select>

          <button
            className="pub-btn-coral"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1.15rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
            }}
            onClick={() => alert(`Mengunduh lembar rekapitulasi resmi PDF untuk ${currentTeam.school}...`)}
          >
            <Download size={14} />
            <span>Unduh Rekap PDF</span>
          </button>
        </div>
      </div>

      {/* 2. HERO TROPHY CARD: PENCAPAIAN JUARA TIM KONTINGEN (TO THE POINT) */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid var(--pub-line)',
          borderTop: '5px solid var(--pub-coral)',
          padding: '1.5rem 1.75rem',
          boxShadow: 'var(--pub-shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* Identitas Pasukan */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span
                style={{
                  backgroundColor: 'var(--pub-navy)',
                  color: '#FFFFFF',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  fontSize: '0.725rem',
                  fontWeight: 800,
                }}
              >
                NO. {currentTeam.orderNumber}
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--pub-ink)',
                  margin: 0,
                }}
              >
                {currentTeam.school}
              </h2>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--pub-coral)' }}>
                ({currentTeam.teamName})
              </span>
            </div>

            <div style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <span>Komandan Peleton: <strong style={{ color: 'var(--slate-text)' }}>{currentTeam.danton}</strong></span>
              <span>•</span>
              <span>Waktu Tampil: <strong style={{ color: 'var(--slate-text)' }}>{currentTeam.performanceTime}</strong></span>
              <span>•</span>
              <span>Durasi: <strong style={{ color: 'var(--slate-text)' }}>{currentTeam.duration}</strong></span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: currentTeamOverall.badgeColor?.bg || '#FEF3C7',
              color: currentTeamOverall.badgeColor?.text || '#92400E',
              border: `1px solid ${currentTeamOverall.badgeColor?.border || '#FDE68A'}`,
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.675rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              KLASEMEN AKUMULASI
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '0.1rem' }}>
              {currentTeamOverall.trophyTitle}
            </div>
          </div>
        </div>

        {/* 3 Box Ringkasan Skor Utama */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
          <div
            style={{
              backgroundColor: 'var(--pub-canvas)',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              border: '1px solid var(--pub-line)',
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
              Peringkat Akumulasi Umum
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--pub-coral)', marginTop: '0.2rem' }}>
              #{currentTeam.rank}{' '}
              <span style={{ fontSize: '0.85rem', color: 'var(--pub-muted)', fontWeight: 600 }}>
                dari {results.length} Tim
              </span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--pub-canvas)',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              border: '1px solid var(--pub-line)',
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
              Total Skor Keseluruhan
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--pub-navy)', marginTop: '0.2rem' }}>
              {currentTeam.totalScore}{' '}
              <span style={{ fontSize: '0.85rem', color: 'var(--pub-muted)', fontWeight: 600 }}>
                / 1200 Poin
              </span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--pub-canvas)',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              border: '1px solid var(--pub-line)',
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
              Penalti Waktu / Batas
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: currentTeam.penalty < 0 ? '#DC2626' : 'var(--emerald)', marginTop: '0.2rem' }}>
              {currentTeam.penalty}{' '}
              <span style={{ fontSize: '0.85rem', color: 'var(--pub-muted)', fontWeight: 600 }}>
                Poin
              </span>
            </div>
          </div>
        </div>

        {/* KOLEKSI GELAR JUARA KATEGORI (BEST CATEGORY AWARDS) */}
        <div style={{ borderTop: '1px solid var(--pub-line)', paddingTop: '1.15rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
            <Trophy size={16} style={{ color: '#D97706' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
              Koleksi Raihan Gelar Juara Kategori (Best Category)
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.75rem' }}>
            {achievements.categories.map((cat) => {
              const isWinner = cat.rank <= 3;
              return (
                <div
                  key={cat.key}
                  style={{
                    backgroundColor: isWinner ? '#FEFBF3' : '#F8FAFC',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    border: isWinner ? '1.5px solid #FDE68A' : '1px solid var(--pub-line)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)' }}>
                      {cat.label}
                    </span>
                    {cat.medal ? (
                      <span style={{ fontSize: '1rem' }}>{cat.medal}</span>
                    ) : (
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--pub-muted)' }}>
                        Rank #{cat.rank}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.1rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: isWinner ? '#92400E' : 'var(--pub-ink)' }}>
                      {cat.title}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.725rem', color: isWinner ? '#B45309' : 'var(--pub-muted)', fontWeight: 600 }}>
                    Skor: <strong className="tabular-nums">{cat.score}</strong> / {cat.max} Poin
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. SWITCHER TAB: RINCIAN NILAI TIM VS KLASEMEN SEMUA PESERTA */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          overflow: 'hidden',
        }}
      >
        {/* Main Tab Switcher Bar */}
        <div
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--pub-canvas)',
            borderBottom: '1px solid var(--pub-line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setActiveMainTab('summary')}
              style={{
                fontSize: '0.825rem',
                fontWeight: activeMainTab === 'summary' ? 800 : 600,
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                border: activeMainTab === 'summary' ? '1px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                backgroundColor: activeMainTab === 'summary' ? 'var(--pub-coral)' : '#FFFFFF',
                color: activeMainTab === 'summary' ? '#FFFFFF' : 'var(--pub-ink)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>📋 Rincian Nilai & Evaluasi Juri</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('leaderboard')}
              style={{
                fontSize: '0.825rem',
                fontWeight: activeMainTab === 'leaderboard' ? 800 : 600,
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                border: activeMainTab === 'leaderboard' ? '1px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                backgroundColor: activeMainTab === 'leaderboard' ? 'var(--pub-coral)' : '#FFFFFF',
                color: activeMainTab === 'leaderboard' ? '#FFFFFF' : 'var(--pub-ink)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>🏆 Klasemen Seluruh Peserta</span>
            </button>
          </div>
        </div>

        {/* TAB 1: RINCIAN NILAI & CATATAN EVALUASI JURI TIM KONTINGEN */}
        {activeMainTab === 'summary' && (
          <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0 0 0.25rem 0' }}>
                Rincian Perolehan Nilai Berdasarkan 4 Aspek Lomba
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--pub-muted)', margin: 0 }}>
                Detail skor perolehan dari penilaian dewan juri bersertifikasi untuk kontingen {currentTeam.school}.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              {[
                { key: 'pbb', num: '1', title: 'PBB Murni', score: currentTeam.categoryScores.pbb.score, max: 400 },
                { key: 'variasi', num: '2', title: 'Variasi & Formasi', score: currentTeam.categoryScores.variasi.score, max: 300 },
                { key: 'danton', num: '3', title: 'Komandan Peleton (Danton)', score: currentTeam.categoryScores.danton.score, max: 200 },
                { key: 'kostum', num: '4', title: 'Make Up & Kostum', score: currentTeam.categoryScores.kostum.score, max: 200 },
              ].map((item) => {
                const ach = achievements.categories.find((c) => c.key === item.key);
                return (
                  <div
                    key={item.key}
                    style={{
                      padding: '1.15rem',
                      borderRadius: '10px',
                      border: '1px solid var(--pub-line)',
                      backgroundColor: 'var(--pub-canvas)',
                      borderLeft: '4px solid var(--pub-teal)',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)' }}>
                      {item.num}. {item.title}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--pub-navy)', marginTop: '0.2rem' }}>
                      {item.score}{' '}
                      <span style={{ fontSize: '0.8rem', color: 'var(--pub-muted)', fontWeight: 600 }}>/ {item.max}</span>
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--pub-teal)', fontWeight: 700, marginTop: '0.25rem' }}>
                      {ach?.title} ({ach?.medal || `#${ach?.rank}`})
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Catatan Evaluasi Resmi Dewan Juri */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                border: '1px solid #CBD5E1',
                borderLeft: '4px solid #0F172A',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Mic size={15} style={{ color: 'var(--pub-coral)' }} />
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                  Catatan Evaluasi Resmi Dewan Juri (Voice AI Transcript):
                </h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-text)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                "{currentTeam.aiFeedback?.refinedFeedback || 'Penampilan peleton sangat solid dan rapi secara keseluruhan.'}"
              </p>
              <div style={{ fontSize: '0.725rem', color: 'var(--pub-muted)' }}>
                Terekam pada: {currentTeam.aiFeedback?.recordedAt || currentTeam.performanceTime} • Divalidasi oleh Ketua Dewan Juri
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KLASEMEN SELURUH PESERTA & JUARA KATEGORI */}
        {activeMainTab === 'leaderboard' && (
          <div>
            {/* Header Filter Klasemen dengan Dropdown Kategori */}
            <div
              style={{
                padding: '0.85rem 1.5rem',
                backgroundColor: 'var(--pub-canvas)',
                borderBottom: '1px solid var(--pub-line)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--pub-ink)' }}>
                  {activeCategoryFilter === 'overall' && '🏆 Klasemen Juara Umum (Akumulasi Nilai)'}
                  {activeCategoryFilter === 'pbb' && '🎖️ Klasemen Best PBB Murni'}
                  {activeCategoryFilter === 'variasi' && '🎭 Klasemen Best Variasi & Formasi'}
                  {activeCategoryFilter === 'danton' && '🗣️ Klasemen Best Komandan Peleton (Danton)'}
                  {activeCategoryFilter === 'kostum' && '👔 Klasemen Best Make Up & Kostum'}
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    backgroundColor: 'var(--pub-sand)',
                    color: 'var(--pub-navy)',
                    padding: '0.12rem 0.45rem',
                    borderRadius: '4px',
                  }}
                >
                  {activeLeaderboardList.length} Peserta
                </span>
              </div>

              {/* Dropdown Kategori Klasemen */}
              <div style={{ position: 'relative' }}>
                <select
                  value={activeCategoryFilter}
                  onChange={(e) => setActiveCategoryFilter(e.target.value)}
                  style={{
                    padding: '0.45rem 2rem 0.45rem 0.85rem',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--pub-ink)',
                    cursor: 'pointer',
                    outline: 'none',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.65rem center',
                  }}
                  title="Pilih Kategori Klasemen"
                >
                  <option value="overall">🏆 Juara Umum / Akumulasi</option>
                  <option value="pbb">🎖️ Best PBB Murni</option>
                  <option value="variasi">🎭 Best Variasi & Formasi</option>
                  <option value="danton">🗣️ Best Danton</option>
                  <option value="kostum">👔 Best Kostum</option>
                </select>
              </div>
            </div>

            {/* Tabel Klasemen */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: 'var(--pub-canvas)',
                      borderBottom: '1.5px solid var(--pub-line)',
                      color: 'var(--muted-slate)',
                      textTransform: 'uppercase',
                      fontSize: '0.7rem',
                      letterSpacing: '0.05em',
                      fontWeight: 700,
                    }}
                  >
                    <th style={{ padding: '0.85rem 1rem', width: '60px', textAlign: 'center' }}>Rank</th>
                    <th style={{ padding: '0.85rem 1rem' }}>
                      {activeCategoryFilter === 'danton' ? 'Komandan Peleton (Danton) & Sekolah' : 'Sekolah & Pasukan'}
                    </th>
                    <th style={{ padding: '0.85rem 1rem', width: '140px', textAlign: 'center' }}>
                      {activeCategoryFilter === 'overall' ? 'Total Nilai' : `Nilai ${activeCategoryFilter.toUpperCase()}`}
                    </th>
                    <th style={{ padding: '0.85rem 1rem', width: '170px', textAlign: 'center' }}>
                      Predikat Gelar
                    </th>
                    {activeCategoryFilter !== 'overall' && (
                      <th style={{ padding: '0.85rem 1rem', width: '130px', textAlign: 'center' }}>
                        Total Akumulasi
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {activeLeaderboardList.map((team, idx) => {
                    const isSelected = team.teamId === currentTeam.teamId;
                    const isTop3 = team.categoryRank <= 3;
                    return (
                      <tr
                        key={team.teamId}
                        style={{
                          borderBottom: '1px solid var(--pub-line)',
                          backgroundColor: isSelected
                            ? '#FEF3C7'
                            : idx % 2 === 0
                            ? '#FFFFFF'
                            : '#FBFBFA',
                          fontWeight: isSelected ? 700 : 400,
                        }}
                      >
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span className="tabular-nums" style={{ fontWeight: 800, color: isTop3 ? 'var(--pub-coral)' : 'var(--pub-navy)' }}>
                              {team.categoryRank}
                            </span>
                            {team.categoryMedal && <span style={{ fontSize: '0.75rem' }}>{team.categoryMedal}</span>}
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                backgroundColor: isSelected ? 'var(--pub-coral)' : 'var(--pub-navy)',
                                color: '#FFFFFF',
                                padding: '0.1rem 0.35rem',
                                borderRadius: '4px',
                              }}
                            >
                              NO. {team.orderNumber}
                            </span>
                            <span style={{ fontWeight: 800, color: 'var(--pub-ink)' }}>
                              {activeCategoryFilter === 'danton' ? team.danton : team.school}
                            </span>
                            <span style={{ fontSize: '0.775rem', color: isSelected ? '#92400E' : 'var(--pub-muted)' }}>
                              {activeCategoryFilter === 'danton' ? `(${team.school})` : `(${team.teamName})`}
                            </span>
                            {isSelected && (
                              <span style={{ fontSize: '0.675rem', fontWeight: 800, color: '#92400E', backgroundColor: '#FDE68A', padding: '0.05rem 0.35rem', borderRadius: '4px' }}>
                                TIM ANDA
                              </span>
                            )}
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                          <span className="tabular-nums" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--pub-navy)' }}>
                            {team.categoryScore}
                          </span>
                        </td>

                        <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                          <span
                            style={{
                              fontSize: '0.725rem',
                              fontWeight: 800,
                              backgroundColor: team.badgeColor?.bg || '#F1F5F9',
                              color: team.badgeColor?.text || '#64748B',
                              border: `1px solid ${team.badgeColor?.border || '#E2E8F0'}`,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            {team.categoryMedal && <span>{team.categoryMedal}</span>}
                            <span>{team.categoryTitle}</span>
                          </span>
                        </td>

                        {activeCategoryFilter !== 'overall' && (
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                            <span className="tabular-nums" style={{ fontWeight: 700, color: 'var(--pub-ink)' }}>
                              {team.totalScore}
                            </span>
                            <div style={{ fontSize: '0.675rem', color: 'var(--pub-muted)' }}>
                              #{team.rank} Umum
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
