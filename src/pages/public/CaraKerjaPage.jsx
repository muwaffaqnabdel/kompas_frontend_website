import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Clock,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Camera,
  Activity,
  Trophy,
  Sparkles,
  Layers,
  ChevronDown,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// DATA MASTER 3 FASE & 11 LANGKAH (KONTEN TETAP & SESUAI ALUR OPERASIONAL)
// ---------------------------------------------------------------------------
const PHASES = [
  {
    id: 'phase-1',
    number: '01',
    label: 'FASE 1: PRA-EVENT',
    period: 'H-60 sampai H-1 Pelaksanaan',
    title: 'Persiapan, Pendaftaran & Penguncian Aturan',
    badge: 'KONFIGURASI LOMBA',
    color: 'var(--pub-navy)', // Dark Navy
    colorHex: '#172A46',
    bgLight: 'rgba(23, 42, 70, 0.05)',
    borderAccent: 'rgba(23, 42, 70, 0.18)',
    icon: Calendar,
    steps: [
      {
        num: 1,
        title: 'Pembuatan Event & Kuota Pangkalan',
        desc: 'Penyelenggara menentukan kategori (SMP/SMA), biaya, persyaratan dokumen, dan batasan kuota kontingen peserta.',
        icon: Layers,
      },
      {
        num: 2,
        title: 'Pendaftaran Mandiri & Unggah Berkas',
        desc: 'Sekolah mengunggah susunan 16 pasukan, surat tugas kepala sekolah, surat keterangan sehat, dan bukti administrasi.',
        icon: ShieldCheck,
      },
      {
        num: 3,
        title: 'Verifikasi Berkas & Technical Meeting (TM)',
        desc: 'Admin Panitia memverifikasi keabsahan dokumen dan mengundi nomor urut tampil secara transparan.',
        icon: CheckCircle2,
      },
      {
        num: 4,
        title: 'Penguncian Kriteria Nilai & Flow DP',
        desc: 'Sebelum hari H dimulai, konfigurasi rubrik nilai dan flow 4 pos DP wajib dikunci (Locked) agar tidak bisa diubah sepihak.',
        icon: Lock,
      },
    ],
  },
  {
    id: 'phase-2',
    number: '02',
    label: 'FASE 2: HARI H PELAKSANAAN',
    period: 'Hari H (06:00 – Selesai)',
    title: 'Eksekusi Lapangan dengan Atomic Lock & Penjurian Digital',
    badge: 'OPERASIONAL HARI H',
    color: 'var(--pub-coral)', // Coral / Red
    colorHex: '#C94B3C',
    bgLight: 'rgba(201, 75, 60, 0.05)',
    borderAccent: 'rgba(201, 75, 60, 0.22)',
    icon: Clock,
    steps: [
      {
        num: 1,
        title: 'Pos DP 1: Pengecekan Dokumen & ID Card',
        desc: 'Tim hadir di ruang transit awal. Petugas memeriksa identitas fisik pasukan sebelum tim diarahkan ke pos berikutnya.',
        icon: ShieldCheck,
      },
      {
        num: 2,
        title: 'Pos DP 2: Photoshoot Tim Resmi',
        desc: 'Tim menjalani sesi foto resmi kontingen. Sistem memastikan pos hanya di tahap 1 tim agar sesi foto tidak terburu-buru.',
        icon: Camera,
      },
      {
        num: 3,
        title: 'Pos DP 3: Persiapan & Pemanasan Akhir',
        desc: 'Area konsentrasi dan pemanasan fisik sebelum memasuki lapangan utama perlombaan.',
        icon: Activity,
      },
      {
        num: 4,
        title: 'Pos DP 4: Panggung Penampilan & Penjurian',
        desc: 'Tim tampil di lapangan. Dewan Juri menginput nilai gerakan dan mendiktekan evaluasi suara yang diolah oleh AI.',
        icon: Sparkles,
      },
    ],
  },
  {
    id: 'phase-3',
    number: '03',
    label: 'FASE 3: PASCA-EVENT',
    period: 'Setelah Seluruh Tim Tampil',
    title: 'Rekapitulasi Otomatis & Transparansi Hasil',
    badge: 'PENGUMUMAN JUARA',
    color: 'var(--pub-teal)', // Teal
    colorHex: '#1F8A78',
    bgLight: 'rgba(31, 138, 120, 0.05)',
    borderAccent: 'rgba(31, 138, 120, 0.22)',
    icon: Trophy,
    steps: [
      {
        num: 1,
        title: 'Kalkulasi Otomatis Tanpa Hitung Manual',
        desc: 'Sistem langsung menggabungkan nilai seluruh juri, menghitung penalti waktu, dan menyusun peringkat secara objektif.',
        icon: Activity,
      },
      {
        num: 2,
        title: 'Penerbitan Lembar Evaluasi & Feedback AI',
        desc: 'Setiap kontingen dapat langsung mengunduh lembar catatan evaluasi juri untuk bahan evaluasi pembinaan di sekolah.',
        icon: Sparkles,
      },
      {
        num: 3,
        title: 'Pengumuman Juara Terbuka & E-Sertifikat',
        desc: 'Hasil resmi dipublikasikan di web publik, dan piagam digital dapat langsung diunduh oleh peserta.',
        icon: Trophy,
      },
    ],
  },
];

export default function CaraKerjaPage() {
  const [activePhase, setActivePhase] = useState('phase-1');
  const phaseRefs = useRef({});

  // ---------------------------------------------------------------------------
  // INTERSECTION OBSERVER / SCROLL SPY UNTUK PHASE NAVIGATION
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220; // Offset penyesuaian header sticky
      for (const ph of PHASES) {
        const el = phaseRefs.current[ph.id];
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActivePhase(ph.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ---------------------------------------------------------------------------
  // SMOOTH SCROLL KE FASE TERPILIH
  // ---------------------------------------------------------------------------
  const handleScrollToPhase = (phaseId) => {
    setActivePhase(phaseId);
    const targetEl = phaseRefs.current[phaseId];
    if (targetEl) {
      // Offset 140px untuk navbar global (76px) + sticky stepper (~64px)
      const yOffset = -140;
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--pub-canvas)' }}>
      {/* ===================================================================== */}
      {/* CSS KHUSUS HALAMAN CARA KERJA: TIMELINE, STEPPER & RESPONSIVE RULES */}
      {/* ===================================================================== */}
      <style>{`
        /* Stepper Nav Container */
        .ck-stepper-wrapper {
          position: sticky;
          top: 76px;
          z-index: 40;
          background-color: rgba(247, 245, 240, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--pub-line);
          transition: all 0.2s ease;
        }

        .ck-stepper-list {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.75rem 0;
          list-style: none;
          margin: 0;
        }

        @media (max-width: 820px) {
          .ck-stepper-list {
            overflow-x: auto;
            white-space: nowrap;
            justify-content: flex-start;
            padding: 0.65rem 0.25rem 0.75rem;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }
          .ck-stepper-list::-webkit-scrollbar {
            display: none;
          }
        }

        .ck-stepper-item {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.65rem 1rem;
          border-radius: 12px;
          background-color: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
        }

        @media (max-width: 820px) {
          .ck-stepper-item {
            flex: 0 0 auto;
            min-width: 220px;
          }
        }

        .ck-stepper-item:hover {
          background-color: rgba(255, 255, 255, 0.7);
        }

        /* Responsive 2-Kolom Container Fase */
        .ck-phase-container {
          background-color: var(--pub-surface);
          border-radius: var(--pub-radius-card);
          border: 1px solid var(--pub-line);
          box-shadow: var(--pub-shadow-card);
          padding: 2.5rem;
          position: relative;
        }

        @media (max-width: 640px) {
          .ck-phase-container {
            padding: 1.5rem 1.25rem;
            border-radius: 16px;
          }
        }

        .ck-phase-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.25rem;
        }

        @media (min-width: 960px) {
          .ck-phase-layout {
            grid-template-columns: 320px 1fr;
            gap: 3.5rem;
          }
        }

        /* Sticky Left Column di Desktop */
        .ck-phase-sidebar {
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 960px) {
          .ck-phase-sidebar {
            position: sticky;
            top: 175px;
            align-self: start;
          }
        }

        /* Timeline Items & Cards */
        .ck-timeline-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .ck-timeline-line {
          position: absolute;
          left: 21px;
          top: 24px;
          bottom: 24px;
          width: 2px;
          background-color: var(--pub-line);
          z-index: 1;
        }

        @media (max-width: 640px) {
          .ck-timeline-line {
            left: 17px;
          }
        }

        .ck-timeline-step {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          margin-bottom: 1.75rem;
        }

        .ck-timeline-step:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 640px) {
          .ck-timeline-step {
            gap: 0.85rem;
          }
        }

        .ck-step-badge {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 800;
          font-size: 0.95rem;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s ease;
        }

        @media (max-width: 640px) {
          .ck-step-badge {
            width: 36px;
            height: 36px;
            font-size: 0.85rem;
          }
        }

        .ck-step-card {
          flex: 1;
          background-color: var(--pub-canvas);
          border: 1px solid var(--pub-line);
          border-radius: 14px;
          padding: 1.35rem 1.5rem;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
        }

        @media (hover: hover) and (pointer: fine) {
          .ck-step-card:hover {
            transform: translateX(4px);
            box-shadow: 0 6px 18px -2px rgba(23, 32, 51, 0.07);
            border-color: #D3CBC0;
          }
        }

        @media (max-width: 640px) {
          .ck-step-card {
            padding: 1.15rem 1.15rem;
            border-radius: 12px;
          }
        }

        /* Accessibility: Prefers Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* ===================================================================== */}
      {/* SECTION 1 — HERO                                                      */}
      {/* ===================================================================== */}
      <section
        style={{
          padding: '4rem 0 3rem',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--pub-line)',
        }}
      >
        <div className="pub-container" style={{ maxWidth: '840px', textAlign: 'center' }}>
          {/* Label Hero */}
          <div
            className="pub-mono"
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--pub-coral)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(201, 75, 60, 0.08)',
              padding: '0.3rem 0.85rem',
              borderRadius: '9999px',
            }}
          >
            <Sparkles size={13} />
            <span>PANDUAN OPERASIONAL END-TO-END</span>
          </div>

          {/* Headline Hero */}
          <h1
            className="pub-heading"
            style={{
              fontSize: 'clamp(2.15rem, 4.5vw, 3.25rem)',
              color: 'var(--pub-ink)',
              lineHeight: 1.15,
              marginBottom: '1.15rem',
              letterSpacing: '-0.03em',
            }}
          >
            Bagaimana KOMPAS Bekerja
          </h1>

          {/* Deskripsi Hero */}
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.125rem)',
              color: 'var(--pub-ink-soft)',
              lineHeight: 1.65,
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Satu alur terstruktur yang memandu peserta, panitia, dan dewan juri dari awal persiapan hingga pengumuman pemenang di atas podium.
          </p>

          {/* Ringkasan Tahapan */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem',
              marginTop: '1.75rem',
              fontSize: '0.8125rem',
              color: 'var(--pub-muted)',
              fontFamily: 'var(--font-mono)',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--pub-navy)' }} />
              Fase 1: Pra-Event
            </span>
            <span style={{ color: 'var(--pub-line)' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--pub-coral)' }} />
              Fase 2: Hari H
            </span>
            <span style={{ color: 'var(--pub-line)' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--pub-teal)' }} />
              Fase 3: Pasca-Event
            </span>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 2 — PHASE NAVIGATION (HORIZONTAL STEPPER SEGMENTED)          */}
      {/* ===================================================================== */}
      <nav className="ck-stepper-wrapper" aria-label="Navigasi Fase Operasional">
        <div className="pub-container" style={{ maxWidth: '1040px' }}>
          <div className="ck-stepper-list" role="tablist">
            {PHASES.map((ph) => {
              const isActive = activePhase === ph.id;

              return (
                <button
                  key={ph.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleScrollToPhase(ph.id)}
                  className="ck-stepper-item"
                  style={{
                    backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                    borderColor: isActive ? ph.borderAccent : 'transparent',
                    boxShadow: isActive ? '0 4px 14px rgba(0, 0, 0, 0.05)' : 'none',
                  }}
                >
                  {/* Badge Nomor Stepper */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      backgroundColor: isActive ? ph.color : 'rgba(23, 32, 51, 0.06)',
                      color: isActive ? '#FFFFFF' : 'var(--pub-muted)',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {ph.number}
                  </div>

                  {/* Informasi Stepper */}
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 800 : 600,
                        color: isActive ? ph.color : 'var(--pub-ink-soft)',
                        whiteSpace: 'nowrap',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {ph.label.replace(/^FASE \d+:\s*/, '')}
                    </div>
                    <span
                      style={{
                        fontSize: '0.725rem',
                        color: 'var(--pub-muted)',
                        fontFamily: 'var(--font-mono)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {ph.period}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ===================================================================== */}
      {/* SECTION 3 — OPERATIONAL TIMELINE (MAIN REDESIGN)                     */}
      {/* ===================================================================== */}
      <section style={{ padding: '3.5rem 0 5rem' }}>
        <div className="pub-container" style={{ maxWidth: '1040px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
            {PHASES.map((ph, pIdx) => (
              <div key={ph.id}>
                {/* Container Fase dengan 2 Kolom (Desktop) / 1 Kolom (Mobile) */}
                <div
                  ref={(el) => (phaseRefs.current[ph.id] = el)}
                  id={ph.id}
                  className="ck-phase-container"
                  style={{
                    borderLeft: `5px solid ${ph.color}`,
                  }}
                >
                  <div className="ck-phase-layout">
                    {/* --------------------------------------------------------- */}
                    {/* KOLOM KIRI (DESKTOP): IDENTITAS FASE (STICKY ON DESKTOP) */}
                    {/* --------------------------------------------------------- */}
                    <div className="ck-phase-sidebar">
                      {/* Watermark Nomor Fase */}
                      <div
                        className="pub-mono"
                        style={{
                          fontSize: '3.5rem',
                          fontWeight: 900,
                          color: ph.color,
                          opacity: 0.15,
                          lineHeight: 1,
                          marginBottom: '0.35rem',
                          letterSpacing: '-0.04em',
                        }}
                      >
                        {ph.number}
                      </div>

                      {/* Label Fase */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                        <span
                          className="pub-mono"
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            color: ph.color,
                            backgroundColor: ph.bgLight,
                            padding: '0.25rem 0.65rem',
                            borderRadius: '6px',
                            border: `1px solid ${ph.borderAccent}`,
                            letterSpacing: '0.04em',
                          }}
                        >
                          {ph.label}
                        </span>
                      </div>

                      {/* Periode Pelaksanaan */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.8rem',
                          color: 'var(--pub-muted)',
                          fontFamily: 'var(--font-mono)',
                          marginBottom: '1rem',
                        }}
                      >
                        <Clock size={14} color={ph.color} />
                        <span>{ph.period}</span>
                      </div>

                      {/* Judul Utama Fase */}
                      <h2
                        className="pub-heading"
                        style={{
                          fontSize: '1.45rem',
                          color: 'var(--pub-ink)',
                          lineHeight: 1.3,
                          marginBottom: '1.25rem',
                          fontWeight: 800,
                        }}
                      >
                        {ph.title}
                      </h2>

                      {/* Meta Ringkasan Langkah */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: 'var(--pub-ink-soft)',
                          backgroundColor: 'var(--pub-canvas)',
                          padding: '0.45rem 0.75rem',
                          borderRadius: '8px',
                          border: '1px solid var(--pub-line)',
                          width: 'fit-content',
                        }}
                      >
                        <CheckCircle2 size={14} color={ph.color} />
                        <span>{ph.steps.length} Langkah Berurutan</span>
                      </div>
                    </div>

                    {/* --------------------------------------------------------- */}
                    {/* KOLOM KANAN: TIMELINE VERTIKAL DENGAN GARIS PENGHUBUNG   */}
                    {/* --------------------------------------------------------- */}
                    <div className="ck-timeline-wrapper">
                      {/* Garis Penghubung Vertikal */}
                      <div
                        className="ck-timeline-line"
                        style={{
                          background: `linear-gradient(to bottom, ${ph.color} 0%, var(--pub-line) 15%, var(--pub-line) 85%, ${ph.color} 100%)`,
                        }}
                      />

                      {/* Daftar Langkah Berurutan */}
                      {ph.steps.map((st) => (
                        <div key={st.num} className="ck-timeline-step">
                          {/* Lingkaran / Node Nomor Langkah */}
                          <div
                            className="ck-step-badge"
                            style={{
                              backgroundColor: '#FFFFFF',
                              color: ph.color,
                              border: `2px solid ${ph.color}`,
                            }}
                          >
                            {st.num}
                          </div>

                          {/* Kartu Langkah */}
                          <div className="ck-step-card">
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '0.4rem',
                                gap: '0.5rem',
                              }}
                            >
                              <span
                                className="pub-mono"
                                style={{
                                  fontSize: '0.725rem',
                                  fontWeight: 800,
                                  color: ph.color,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em',
                                }}
                              >
                                Langkah {st.num}
                              </span>
                            </div>

                            {/* Judul Langkah */}
                            <h3
                              style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.05rem',
                                fontWeight: 800,
                                color: 'var(--pub-ink)',
                                marginBottom: '0.45rem',
                                lineHeight: 1.35,
                              }}
                            >
                              {st.title}
                            </h3>

                            {/* Deskripsi Langkah */}
                            <p
                              style={{
                                fontSize: '0.875rem',
                                color: 'var(--pub-ink-soft)',
                                lineHeight: 1.65,
                                margin: 0,
                              }}
                            >
                              {st.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Indikator Alur Antar-Fase (Kecuali setelah fase terakhir) */}
                {pIdx < PHASES.length - 1 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '1.5rem 0',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--pub-muted)',
                        backgroundColor: '#FFFFFF',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '9999px',
                        border: '1px solid var(--pub-line)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      }}
                    >
                      <ChevronDown size={14} color="var(--pub-coral)" />
                      <span>Alur Berlanjut ke Fase {pIdx + 2}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ===================================================================== */}
          {/* SECTION 4 — CTA PENUTUP                                               */}
          {/* ===================================================================== */}
          <div
            style={{
              marginTop: '4.5rem',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--pub-radius-card)',
              padding: 'clamp(2rem, 4vw, 3rem)',
              border: '1px solid var(--pub-line)',
              boxShadow: 'var(--pub-shadow-card)',
              textAlign: 'center',
            }}
          >
            <div
              className="pub-mono"
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--pub-coral)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.65rem',
              }}
            >
              MULAI SEKARANG
            </div>

            <h2
              className="pub-heading"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.15rem)',
                color: 'var(--pub-ink)',
                lineHeight: 1.25,
                marginBottom: '0.75rem',
              }}
            >
              Siap Menjalankan Kompetisi Paskibra Standar Nasional?
            </h2>

            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--pub-ink-soft)',
                maxWidth: '620px',
                margin: '0 auto 2rem',
                lineHeight: 1.6,
              }}
            >
              Daftarkan kontingen sekolah Anda ke event yang sedang dibuka, atau konsultasikan penyelenggaraan kompetisi dengan sistem digital KOMPAS.
            </p>

            {/* Dua Tombol CTA Sesuai Ketentuan */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '1rem',
              }}
            >
              <Link to="/event" className="pub-btn-coral">
                <span>Cari & Daftar Lomba</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/untuk-penyelenggara" className="pub-btn-outline">
                <span>Konsultasi untuk Penyelenggara</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
