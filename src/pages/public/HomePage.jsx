import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Shield,
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  GitCommit,
  Award,
  Layers,
  Clock,
  ExternalLink,
  FileText,
  ClipboardCheck,
} from 'lucide-react';

export default function HomePage() {
  const [activeRole, setActiveRole] = useState('penyelenggara');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [openStepIndex, setOpenStepIndex] = useState(0);

  // Stacked Event Card Data in Hero
  const [heroCardIndex, setHeroCardIndex] = useState(0);
  const heroStackedCards = [
    {
      num: '01',
      category: 'INOVASI & TEKNOLOGI',
      title: 'Nusantara Young Innovators',
      date: '12–14 Sep 2025',
      location: 'Jakarta & daring',
      registered: '312 tim terdaftar',
      statusText: 'PENDAFTARAN DIBUKA',
      statusBg: '#DDF4EC',
      statusColor: '#176F5B',
      statusBorder: '#BCE8DB',
      link: '/event/lkbb-nasional-2026',
      gradient: 'linear-gradient(115deg, #DE7E5D 0%, #D88967 32%, #5E4E5C 70%, #202737 100%)',
      backColor: '#1E695A',
    },
    {
      num: '02',
      category: 'BARIS BERBARIS & PASKIBRA',
      title: 'LKBB Nasional Paskibra 2026',
      date: '15 Nov 2026',
      location: 'GOR Remaja Jakarta Timur',
      registered: '32 tim terdaftar',
      statusText: 'PENDAFTARAN DIBUKA',
      statusBg: '#DDF4EC',
      statusColor: '#176F5B',
      statusBorder: '#BCE8DB',
      link: '/event/lkbb-nasional-2026',
      gradient: 'linear-gradient(115deg, #2D6A4F 0%, #205942 35%, #183F30 70%, #0D261C 100%)',
      backColor: '#8C3026',
    },
    {
      num: '03',
      category: 'VARIASI FORMASI PELAJAR',
      title: 'Piala Walikota Paskibra 2026',
      date: '28 Des 2026',
      location: 'Stadion Patriot, Bekasi',
      registered: '40 kuota pangkalan',
      statusText: 'SEGERA DIBUKA',
      statusBg: '#FEF3C7',
      statusColor: '#B46A1A',
      statusBorder: '#FDE68A',
      link: '/event/piala-walikota-2026',
      gradient: 'linear-gradient(115deg, #C94B3C 0%, #B84335 35%, #593333 70%, #1A212E 100%)',
      backColor: '#1A2F4C',
    },
  ];

  const currentHeroCard = heroStackedCards[heroCardIndex];

  // Role showcase data
  const roleShowcase = {
    penyelenggara: {
      num: '01',
      title: 'Lihat gambaran besarnya.',
      desc: 'Pantau semua event dalam satu layar. Tahu persis event mana yang butuh perhatian, mana yang siap jalan, dan riwayat audit lengkap tanpa sengketa.',
      tags: ['Status event real-time', 'Jejak audit lengkap', 'Konfigurasi fleksibel'],
      badgeColor: 'var(--pub-teal)',
      badgeBg: 'var(--pub-teal-light)',
    },
    admin: {
      num: '02',
      title: 'Alur kerja yang teratur dan terukur.',
      desc: 'Verifikasi berkas peserta tanpa kebingungan, kunci kriteria nilai sebelum lomba dimulai, dan kelola kapasitas 4 pos DP secara terpusat.',
      tags: ['Validasi berkas instan', 'Kunci kriteria nilai', 'Kontrol 4 Pos DP'],
      badgeColor: 'var(--pub-coral)',
      badgeBg: 'var(--pub-coral-pale)',
    },
    juri: {
      num: '03',
      title: 'Fokus pada substansi penilaian.',
      desc: 'Lembar penilaian digital di genggaman Anda. Rekam catatan suara evaluasi secara langsung tanpa terdistraksi kalkulasi hitung manual.',
      tags: ['Skor instan per kriteria', 'AI Voice Note transkrip', 'Buffer koreksi 5 detik'],
      badgeColor: 'var(--pub-amber)',
      badgeBg: '#FEF3C7',
    },
    peserta: {
      num: '04',
      title: 'Kejelasan di setiap langkah kompetisi.',
      desc: 'Peserta tahu persis jadwal tampil, status kelengkapan berkas, nomor urut panggilan pos DP, hingga evaluasi juri secara transparan.',
      tags: ['Portal mandiri kontingen', 'Notifikasi jadwal tampil', 'Transparansi nilai akhir'],
      badgeColor: '#2563EB',
      badgeBg: '#DBEAFE',
    },
  };

  const currentRole = roleShowcase[activeRole];

  // Process / Timeline Steps
  const processSteps = [
    {
      num: '01',
      title: 'Daftar',
      desc: 'Pendaftaran tim sekolah, pengunggahan berkas digital (surat tugas, kartu pelajar, surat dokter), dan verifikasi panitia terpusat.',
    },
    {
      num: '02',
      title: 'Kirim',
      desc: 'Pengumpulan kelengkapan teknis, penentuan nomor urut tampil saat Technical Meeting, dan konfirmasi gladi bersih.',
    },
    {
      num: '03',
      title: 'Nilai',
      desc: 'Pelaksanaan lomba di lapangan dengan alur 4 Pos DP (Atomic Lock), penilaian cepat digital juri, dan perekaman evaluasi suara AI.',
    },
    {
      num: '04',
      title: 'Bagikan',
      desc: 'Rekapitulasi otomatis tanpa kalkulator manual, publikasi hasil transparan, dan pengunduhan lembar evaluasi resmi.',
    },
  ];

  // FAQ List
  const faqs = [
    {
      q: 'Apakah peserta perlu membuat akun untuk mendaftar?',
      a: 'Ya, perwakilan atau pembina kontingen sekolah cukup membuat satu akun tim untuk mengunggah dokumen, memantau verifikasi berkas, dan menerima nomor urut tampil resmi.',
    },
    {
      q: 'Apakah alur lomba bisa disesuaikan dengan kebutuhan kami?',
      a: 'Bisa. Penyelenggara dapat menyesuaikan kriteria penilaian, jumlah anggota pasukan, serta konfigurasi pos daerah persiapan (DP) sesuai petunjuk teknis masing-masing lomba.',
    },
    {
      q: 'Bagaimana cara kerja penilaian dewan juri?',
      a: 'Dewan juri menginput nilai melalui tablet/smartphone secara langsung di pinggir lapangan. Skor dikalkulasi otomatis dan catatan suara evaluasi dirapikan oleh AI.',
    },
    {
      q: 'Apakah data dan dokumen peserta tersimpan aman?',
      a: 'Seluruh data kontingen, kartu pelajar, surat tugas, dan riwayat penilaian tersimpan dengan enkripsi aman di cloud dengan jejak audit yang tidak bisa dimanipulasi.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* ============================================================ */}
      {/* 1. HERO SECTION (Split: Left Big Headline + Right Stacked)  */}
      {/* ============================================================ */}
      <section style={{ paddingTop: '3.5rem', paddingBottom: '4.5rem', backgroundColor: 'var(--pub-canvas)' }}>
        <div className="pub-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Headlines & Actions */}
            <div>
              {/* Eyebrow */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--pub-coral)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '1rem',
                }}
              >
                SATU ALUR UNTUK SEMUA
              </div>

              {/* Main Headline */}
              <h1
                className="pub-heading"
                style={{
                  fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)',
                  lineHeight: 1.12,
                  color: 'var(--pub-ink)',
                  marginBottom: '1.25rem',
                  letterSpacing: '-0.03em',
                }}
              >
                Satu alur untuk<br />
                <span style={{ color: 'var(--pub-coral)' }}>kompetisi</span> yang<br />
                lebih jelas.
              </h1>

              {/* Subheadline */}
              <p
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--pub-ink-soft)',
                  lineHeight: 1.65,
                  marginBottom: '2.25rem',
                  maxWidth: '500px',
                }}
              >
                Peserta tahu harus ke mana. Panitia tahu apa yang harus dilakukan. Dari pendaftaran sampai hasil akhir, setiap tahap punya jejak yang jelas.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
                <Link to="/event" className="pub-btn-coral" style={{ padding: '0.8rem 1.6rem' }}>
                  <span>Mulai jelajahi event</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to="/cara-kerja" className="pub-btn-outline" style={{ padding: '0.8rem 1.4rem' }}>
                  <span>Pelajari cara kerjanya</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Column: THE STACKED EVENT CARDS (Persis Screenshot) */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  maxWidth: '520px',
                  margin: '0 auto',
                  cursor: 'pointer',
                }}
                onClick={() => setHeroCardIndex((prev) => (prev + 1) % heroStackedCards.length)}
                title="Klik untuk melihat event berikutnya dalam tumpukan kartu"
              >
                {/* Green Card in the Back (Tilted) */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-14px',
                    right: '-14px',
                    left: '16px',
                    bottom: '-12px',
                    backgroundColor: currentHeroCard.backColor,
                    borderRadius: '28px',
                    transform: 'rotate(2.8deg)',
                    zIndex: 1,
                    boxShadow: '0 16px 36px -10px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease',
                  }}
                />

                {/* Mustard Sticker (Top Right): RAPI TERARAH SIAP */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-24px',
                    right: '-20px',
                    zIndex: 10,
                    backgroundColor: '#E5A849',
                    borderRadius: '16px',
                    padding: '14px 16px',
                    boxShadow: '0 8px 20px -2px rgba(0, 0, 0, 0.2)',
                    transform: 'rotate(11deg)',
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      lineHeight: 1.25,
                      color: '#172033',
                      textAlign: 'center',
                      letterSpacing: '0.04em',
                    }}
                  >
                    RAPI<br />TERARAH<br />SIAP
                  </div>
                </div>

                {/* Front White/Cream Card */}
                <div
                  className="pub-animate-fade"
                  key={heroCardIndex}
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '28px',
                    padding: '1.75rem 2rem',
                    border: '1px solid rgba(228, 222, 212, 0.85)',
                    boxShadow: '0 20px 40px -12px rgba(23, 32, 51, 0.08)',
                  }}
                >
                  {/* Top Row: EVENT BOARD / 01 & Status Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--pub-coral)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      EVENT BOARD / {currentHeroCard.num}
                    </div>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        backgroundColor: currentHeroCard.statusBg,
                        color: currentHeroCard.statusColor,
                        border: `1px solid ${currentHeroCard.statusBorder}`,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {currentHeroCard.statusText}
                    </span>
                  </div>

                  {/* Gradient Banner Box */}
                  <div
                    style={{
                      marginTop: '1.25rem',
                      marginBottom: '1.5rem',
                      background: currentHeroCard.gradient,
                      borderRadius: '18px',
                      padding: '1.75rem 1.85rem',
                      color: '#FFFFFF',
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: 'rgba(255, 255, 255, 0.85)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '0.65rem',
                      }}
                    >
                      {currentHeroCard.category}
                    </div>

                    <h3
                      className="pub-heading"
                      style={{
                        fontSize: 'clamp(1.4rem, 2.8vw, 1.85rem)',
                        fontWeight: 800,
                        color: '#FFFFFF',
                        lineHeight: 1.15,
                        margin: 0,
                      }}
                    >
                      {currentHeroCard.title}
                    </h3>
                  </div>

                  {/* Metadata Row: TANGGAL & LOKASI */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '1rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '0.6875rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--pub-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: '0.2rem',
                          fontWeight: 600,
                        }}
                      >
                        TANGGAL
                      </div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--pub-ink)' }}>
                        {currentHeroCard.date}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: '0.6875rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--pub-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: '0.2rem',
                          fontWeight: 600,
                        }}
                      >
                        LOKASI
                      </div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--pub-ink)' }}>
                        {currentHeroCard.location}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: '1px', backgroundColor: '#EFEAE2', marginBottom: '1.25rem' }} />

                  {/* Bottom Row: Registered & Circle Arrow */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 500 }}>
                      {currentHeroCard.registered}
                    </div>

                    <Link
                      to={currentHeroCard.link}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: '#172033',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                      }}
                      title="Lihat Detail Event"
                    >
                      <ArrowUpRight size={19} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. STATS / TRUST BAR (3 Columns Clean Beige Strip)           */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: 'var(--pub-surface)', borderTop: '1px solid var(--pub-line)', borderBottom: '1px solid var(--pub-line)', padding: '2rem 0' }}>
        <div className="pub-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            {[
              { stat: '312 tim terdaftar', note: 'dari 48 kota di Indonesia', dotColor: 'var(--pub-coral)' },
              { stat: '14 event aktif', note: 'sedang berjalan di platform', dotColor: 'var(--pub-teal)' },
              { stat: '99.4% tepat waktu', note: 'alur berjalan sesuai linimasa', dotColor: 'var(--pub-amber)' },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: item.dotColor,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
                    {item.stat}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)' }}>
                    {item.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. PROBLEM SECTION ("Kompetisi besar tidak harus berantakan") */}
      {/* ============================================================ */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--pub-canvas)', borderBottom: '1px solid var(--pub-line)' }}>
        <div className="pub-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'start',
            }}
          >
            {/* Left Big Title */}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--pub-coral)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '0.75rem',
                }}
              >
                MENGAPA KOMPAS
              </div>
              <h2
                className="pub-heading"
                style={{
                  fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                  lineHeight: 1.15,
                  color: 'var(--pub-ink)',
                }}
              >
                Kompetisi besar<br />
                tidak harus terasa<br />
                berantakan.
              </h2>
            </div>

            {/* Right 3 Problem Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {[
                {
                  dot: 'var(--pub-coral)',
                  title: 'Data tercecer',
                  desc: 'Informasi pendaftaran, berkas peserta, dan revisi tersebar di berbagai kanal tanpa riwayat yang jelas.',
                },
                {
                  dot: 'var(--pub-teal)',
                  title: 'Alur tidak pasti',
                  desc: 'Peserta bingung harus ke mana berikutnya; panitia lelah menjawab pertanyaan teknis yang berulang.',
                },
                {
                  dot: '#2563EB',
                  title: 'Penilaian tertutup',
                  desc: 'Juri bekerja dengan format kertas berbeda, rekapitulasi lambat hingga larut malam, dan transparansi diragukan.',
                },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: item.dot,
                      marginTop: '6px',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <h3 className="pub-heading" style={{ fontSize: '1.1rem', color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--pub-ink-soft)', lineHeight: 1.6, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. DARK NAVY SECTION ("Struktur yang membantu orang bergerak") */}
      {/* ============================================================ */}
      <section style={{ padding: '5.5rem 0', backgroundColor: '#141E2E', color: '#FFFFFF' }}>
        <div className="pub-container">
          <div style={{ maxWidth: '960px', margin: '0 auto 2.5rem' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--pub-coral-pale)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '0.75rem',
              }}
            >
              BAGAIMANA KAMI MEMBANTU
            </div>
            <h2
              className="pub-heading"
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                color: '#FFFFFF',
                lineHeight: 1.2,
              }}
            >
              Struktur yang membantu<br />
              orang bergerak.
            </h2>
          </div>

          {/* Unified 2x2 Dark Quadrant Card (Strict 1 2 / 3 4 Layout, Centered) */}
          <div
            style={{
              maxWidth: '960px',
              margin: '0 auto',
              backgroundColor: '#1E2D42',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '26px',
              overflow: 'hidden',
              boxShadow: '0 20px 48px -12px rgba(0, 0, 0, 0.35)',
            }}
          >
            <div className="pub-quadrant-grid">
              {/* Quadrant 01: Registrasi lebih siap */}
              <div
                style={{
                  padding: '2.75rem 3rem',
                  borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <FileText size={26} color="#E07153" strokeWidth={1.8} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>
                    01
                  </span>
                </div>
                <h3 className="pub-heading" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                  Registrasi lebih siap
                </h3>
                <p style={{ fontSize: '0.9375rem', color: '#94A3B8', lineHeight: 1.65, margin: 0, maxWidth: '380px' }}>
                  Formulir, persyaratan, dan status pendaftaran berada di tempat yang peserta pahami.
                </p>
              </div>

              {/* Quadrant 02: Alur yang terlihat */}
              <div
                style={{
                  padding: '2.75rem 3rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <Layers size={26} color="#2DD4BF" strokeWidth={1.8} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>
                    02
                  </span>
                </div>
                <h3 className="pub-heading" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                  Alur yang terlihat
                </h3>
                <p style={{ fontSize: '0.9375rem', color: '#94A3B8', lineHeight: 1.65, margin: 0, maxWidth: '380px' }}>
                  Setiap fase punya konteks, tenggat, dan langkah yang mudah diikuti.
                </p>
              </div>

              {/* Quadrant 03: Penilaian terarah */}
              <div
                style={{
                  padding: '2.75rem 3rem',
                  borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <ClipboardCheck size={26} color="#FBBF24" strokeWidth={1.8} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>
                    03
                  </span>
                </div>
                <h3 className="pub-heading" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                  Penilaian terarah
                </h3>
                <p style={{ fontSize: '0.9375rem', color: '#94A3B8', lineHeight: 1.65, margin: 0, maxWidth: '380px' }}>
                  Juri fokus menilai. Panitia mendapat ringkasan yang siap dipakai.
                </p>
              </div>

              {/* Quadrant 04: Komunikasi tidak hilang */}
              <div
                style={{
                  padding: '2.75rem 3rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <Users size={26} color="#E07153" strokeWidth={1.8} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>
                    04
                  </span>
                </div>
                <h3 className="pub-heading" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                  Komunikasi tidak hilang
                </h3>
                <p style={{ fontSize: '0.9375rem', color: '#94A3B8', lineHeight: 1.65, margin: 0, maxWidth: '380px' }}>
                  Peserta tahu siapa yang bisa dihubungi dan kapan harus bertindak.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. PROCESS SECTION ("Satu garis besar, banyak langkah ringan") */}
      {/* ============================================================ */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--pub-canvas)', borderBottom: '1px solid var(--pub-line)' }}>
        <div className="pub-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'start',
            }}
          >
            {/* Left Headline */}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--pub-coral)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '0.75rem',
                }}
              >
                TAHAPAN LOMBA
              </div>
              <h2
                className="pub-heading"
                style={{
                  fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                  lineHeight: 1.2,
                  color: 'var(--pub-ink)',
                }}
              >
                Satu garis besar,<br />
                banyak langkah<br />
                yang lebih ringan.
              </h2>
            </div>

            {/* Right Process Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {processSteps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1.25rem 1.5rem',
                    backgroundColor: 'var(--pub-surface)',
                    border: '1px solid var(--pub-line)',
                    borderRadius: '14px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: 'var(--pub-coral)',
                      }}
                    >
                      {step.num}
                    </span>
                    <h3 className="pub-heading" style={{ fontSize: '1.1rem', color: 'var(--pub-ink)', margin: 0 }}>
                      {step.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--pub-ink-soft)', lineHeight: 1.6, margin: 0, paddingLeft: '1.75rem' }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. ROLE SHOWCASE ("Semua orang punya konteks")               */}
      {/* ============================================================ */}
      <section style={{ padding: '5.5rem 0', backgroundColor: '#EDE7DC', borderBottom: '1px solid var(--pub-line)' }}>
        <div className="pub-container" style={{ maxWidth: '980px' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--pub-coral)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '0.75rem',
              }}
            >
              UNTUK SETIAP PERAN
            </div>
            <h2
              className="pub-heading"
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                lineHeight: 1.2,
                color: 'var(--pub-ink)',
                marginBottom: '1.75rem',
              }}
            >
              Semua orang punya konteks.<br />
              Semua orang perlu kejelasan.
            </h2>

            {/* Segmented control tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {[
                { id: 'penyelenggara', label: 'Penyelenggara' },
                { id: 'admin', label: 'Admin Panitia' },
                { id: 'juri', label: 'Juri' },
                { id: 'peserta', label: 'Peserta' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveRole(tab.id)}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    padding: '0.55rem 1.25rem',
                    borderRadius: 'var(--pub-radius-pill)',
                    border: 'none',
                    backgroundColor: activeRole === tab.id ? '#172033' : 'rgba(255, 255, 255, 0.6)',
                    color: activeRole === tab.id ? '#FFFFFF' : 'var(--pub-ink)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Role Card */}
          <div
            className="pub-animate-fade"
            key={activeRole}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '2.75rem',
              boxShadow: '0 12px 32px -8px rgba(23, 32, 51, 0.08)',
              border: '1px solid rgba(228, 222, 212, 0.8)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--pub-coral)',
                }}
              >
                {currentRole.num}
              </span>
              <h3 className="pub-heading" style={{ fontSize: '1.65rem', color: 'var(--pub-ink)', margin: 0 }}>
                {currentRole.title}
              </h3>
            </div>

            <p style={{ fontSize: '1rem', color: 'var(--pub-ink-soft)', lineHeight: 1.65, marginBottom: '2rem', maxWidth: '720px' }}>
              {currentRole.desc}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '2rem' }}>
              {currentRole.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    backgroundColor: 'var(--pub-canvas)',
                    color: 'var(--pub-ink)',
                    padding: '0.45rem 0.95rem',
                    borderRadius: '8px',
                    border: '1px solid var(--pub-line)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <Link
              to="/dashboard"
              className="pub-btn-coral"
              style={{ fontSize: '0.875rem', padding: '0.65rem 1.4rem' }}
            >
              <span>Coba Workspace Role Ini di Dashboard</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. FEATURED EVENTS ("Temukan ruang untuk mulai")             */}
      {/* ============================================================ */}
      <section style={{ padding: '5.5rem 0', backgroundColor: 'var(--pub-canvas)', borderBottom: '1px solid var(--pub-line)' }}>
        <div className="pub-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--pub-coral)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '0.5rem',
                }}
              >
                EVENT AKTIF
              </div>
              <h2 className="pub-heading" style={{ fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', color: 'var(--pub-ink)' }}>
                Temukan ruang untuk mulai.
              </h2>
            </div>

            <Link
              to="/event"
              style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--pub-ink)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>Lihat semua event</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Asymmetric 3-Card Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Card 1 (Prominent Hero Event) */}
            <div
              className="pub-card pub-card-hover"
              style={{
                backgroundColor: 'var(--pub-surface)',
                borderRadius: '24px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    background: 'linear-gradient(115deg, #DE7E5D 0%, #D88967 32%, #5E4E5C 70%, #202737 100%)',
                    borderRadius: '18px',
                    padding: '1.75rem',
                    color: '#FFFFFF',
                    marginBottom: '1.5rem',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85 }}>
                      INOVASI & TEKNOLOGI
                    </span>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                      }}
                    >
                      01
                    </span>
                  </div>

                  <h3 className="pub-heading" style={{ fontSize: '1.65rem', color: '#FFFFFF', margin: '0 0 1.25rem 0' }}>
                    Nusantara Young Innovators
                  </h3>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FFFFFF', color: '#172033', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span className="pub-badge-open">PENDAFTARAN DIBUKA</span>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--pub-ink-soft)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Kompetisi inovasi teknologi dan kreasi formasi untuk pelajar se-Indonesia.
                </p>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--pub-line)', fontSize: '0.8125rem', color: 'var(--pub-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>📅 12–14 Sep 2025</span>
                <span>312 tim terdaftar</span>
              </div>
            </div>

            {/* Right Column Stack (Card 2 & Card 3) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Card 2 */}
              <div
                className="pub-card pub-card-hover"
                style={{
                  backgroundColor: 'var(--pub-surface)',
                  borderRadius: '24px',
                  padding: '1.5rem',
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(115deg, #2D6A4F 0%, #205942 35%, #183F30 70%, #0D261C 100%)',
                    borderRadius: '16px',
                    padding: '1.25rem 1.5rem',
                    color: '#FFFFFF',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.1em', opacity: 0.85 }}>
                      BARIS BERBARIS
                    </span>
                    <span style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                      02
                    </span>
                  </div>
                  <h4 className="pub-heading" style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>
                    Festival Baris Berbaris Nusantara
                  </h4>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="pub-badge-soon">SEGERA DIBUKA</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)' }}>📍 Bandung</span>
                </div>
              </div>

              {/* Card 3 */}
              <div
                className="pub-card pub-card-hover"
                style={{
                  backgroundColor: 'var(--pub-surface)',
                  borderRadius: '24px',
                  padding: '1.5rem',
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(115deg, #D49A3D 0%, #C7832F 35%, #593333 70%, #1A212E 100%)',
                    borderRadius: '16px',
                    padding: '1.25rem 1.5rem',
                    color: '#FFFFFF',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.1em', opacity: 0.85 }}>
                      VARIASI & FORMASI
                    </span>
                    <span style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                      03
                    </span>
                  </div>
                  <h4 className="pub-heading" style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>
                    Piala Walikota Paskibra 2026
                  </h4>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="pub-badge-open">PENDAFTARAN DIBUKA</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)' }}>📍 Bekasi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. CORAL CTA BANNER ("Event Anda layak punya alur")          */}
      {/* ============================================================ */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--pub-canvas)' }}>
        <div className="pub-container" style={{ maxWidth: '1020px' }}>
          <div
            style={{
              backgroundColor: 'var(--pub-coral)',
              borderRadius: '28px',
              padding: '4rem 3.5rem',
              color: '#FFFFFF',
              boxShadow: '0 20px 48px -10px rgba(201, 75, 60, 0.35)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.85)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1rem',
              }}
            >
              MULAI SEKARANG
            </div>

            <h2
              className="pub-heading"
              style={{
                fontSize: 'clamp(2rem, 4.2vw, 3.2rem)',
                color: '#FFFFFF',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
                letterSpacing: '-0.02em',
              }}
            >
              Event Anda layak punya alur<br />
              yang sebaik idenya.
            </h2>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.65,
                maxWidth: '600px',
                marginBottom: '2.5rem',
              }}
            >
              Kurangi beban koordinasi manual. Beri pengalaman yang lebih baik untuk peserta, juri, dan tim kepanitiaan Anda.
            </p>

            <Link
              to="/untuk-penyelenggara"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: 700,
                backgroundColor: '#141E2E',
                color: '#FFFFFF',
                padding: '0.85rem 1.85rem',
                borderRadius: 'var(--pub-radius-pill)',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(20, 30, 46, 0.3)',
              }}
            >
              <span>Mulai kelola event</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. FAQ SECTION ("Hal yang mungkin ingin Anda tahu")          */}
      {/* ============================================================ */}
      <section style={{ padding: '5rem 0 6.5rem', backgroundColor: 'var(--pub-canvas)' }}>
        <div className="pub-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'start',
            }}
          >
            {/* Left Headline */}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--pub-coral)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '0.75rem',
                }}
              >
                PERTANYAAN UMUM
              </div>
              <h2
                className="pub-heading"
                style={{
                  fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                  lineHeight: 1.2,
                  color: 'var(--pub-ink)',
                  marginBottom: '1.25rem',
                }}
              >
                Hal yang mungkin<br />
                ingin Anda tahu.
              </h2>
              <Link
                to="/faq"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--pub-coral)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>Punya pertanyaan lain? Hubungi tim kami</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right Accordion List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    style={{
                      padding: '1.25rem 1.5rem',
                      backgroundColor: 'var(--pub-surface)',
                      borderRadius: '14px',
                      border: '1px solid var(--pub-line)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.98rem', fontWeight: 700, color: 'var(--pub-ink)', margin: 0, paddingRight: '1rem' }}>
                        {faq.q}
                      </h4>
                      <ChevronDown
                        size={18}
                        color="var(--pub-coral)"
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s ease',
                          flexShrink: 0,
                        }}
                      />
                    </div>

                    {isOpen && (
                      <p style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--pub-line)', fontSize: '0.875rem', color: 'var(--pub-ink-soft)', lineHeight: 1.65, margin: 0 }}>
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
