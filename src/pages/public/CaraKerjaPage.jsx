import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  FileCheck,
  GitCommit,
  Award,
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  Users,
} from 'lucide-react';

export default function CaraKerjaPage() {
  const phases = [
    {
      phase: 'FASE 1: PRA-EVENT',
      timeframe: 'H-60 sampai H-1 Pelaksanaan',
      title: 'Persiapan, Pendaftaran & Penguncian Aturan',
      badge: 'KONFIGURASI LOMBA',
      color: 'var(--pub-ink)',
      steps: [
        {
          title: 'Pembuatan Event & Kuota Pangkalan',
          desc: 'Penyelenggara menentukan kategori (SMP/SMA), biaya, persyaratan dokumen, dan batasan kuota kontingen peserta.',
        },
        {
          title: 'Pendaftaran Mandiri & Unggah Berkas',
          desc: 'Sekolah mengunggah susunan 16 pasukan, surat tugas kepala sekolah, surat keterangan sehat, dan bukti administrasi.',
        },
        {
          title: 'Verifikasi Berkas & Technical Meeting (TM)',
          desc: 'Admin Panitia memverifikasi keabsahan dokumen dan mengundi nomor urut tampil secara transparan.',
        },
        {
          title: 'Penguncian Kriteria Nilai & Flow DP',
          desc: 'Sebelum hari H dimulai, konfigurasi rubrik nilai dan flow 4 pos DP wajib dikunci (Locked) agar tidak bisa diubah sepihak.',
        },
      ],
    },
    {
      phase: 'FASE 2: HARI H PELAKSANAAN',
      timeframe: 'Hari H (06:00 – Selesai)',
      title: 'Eksekusi Lapangan dengan Atomic Lock & Penjurian Digital',
      badge: 'OPERASIONAL HARI H',
      color: 'var(--pub-coral)',
      steps: [
        {
          title: 'Pos DP 1: Pengecekan Dokumen & ID Card',
          desc: 'Tim hadir di ruang transit awal. Petugas memeriksa identitas fisik pasukan sebelum tim dialirkan ke pos berikutnya.',
        },
        {
          title: 'Pos DP 2: Photoshoot Tim Resmi',
          desc: 'Tim menjalani sesi foto resmi kontingen. Sistem memastikan pos hanya diisi tepat 1 tim agar sesi foto tidak terburu-buru.',
        },
        {
          title: 'Pos DP 3: Persiapan & Pemanasan Akhir',
          desc: 'Area konsentrasi dan pemanasan fisik sebelum memasuki lapangan utama perlombaan.',
        },
        {
          title: 'Pos DP 4: Panggung Penampilan & Penjurian',
          desc: 'Tim tampil di lapangan. Dewan Juri menginput nilai gerakan dan mendiktekan evaluasi suara yang diolah oleh AI.',
        },
      ],
    },
    {
      phase: 'FASE 3: PASCA-EVENT',
      timeframe: 'Setelah Seluruh Tim Tampil',
      title: 'Rekapitulasi Otomatis & Transparansi Hasil',
      badge: 'PENGUMUMAN JUARA',
      color: 'var(--pub-teal)',
      steps: [
        {
          title: 'Kalkulasi Otomatis Tanpa Hitung Manual',
          desc: 'Sistem langsung menggabungkan nilai seluruh juri, menghitung penalti waktu, dan menyusun peringkat secara objektif.',
        },
        {
          title: 'Penerbitan Lembar Evaluasi & Feedback AI',
          desc: 'Setiap kontingen dapat langsung mengunduh lembar catatan evaluasi juri untuk bahan evaluasi pembinaan di sekolah.',
        },
        {
          title: 'Pengumuman Juara Terbuka & E-Sertifikat',
          desc: 'Hasil resmi dipublikasikan di web publik, dan piagam digital dapat langsung diunduh oleh peserta.',
        },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <section style={{ padding: '4.5rem 0 3.5rem', backgroundColor: 'var(--pub-surface)', borderBottom: '1px solid var(--pub-line)' }}>
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
            PANDUAN OPERASIONAL END-TO-END
          </div>
          <h1 className="pub-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--pub-ink)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Bagaimana KOMPAS Bekerja
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--pub-ink-soft)', lineHeight: 1.65 }}>
            Satu alur terstruktur yang memandu peserta, panitia, dan dewan juri dari awal persiapan hingga pengumuman pemenang di atas podium.
          </p>
        </div>
      </section>

      {/* 3 Phases Detailed Timeline */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--pub-canvas)' }}>
        <div className="pub-container" style={{ maxWidth: '940px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {phases.map((ph, idx) => (
              <div
                key={idx}
                className="pub-card"
                style={{
                  backgroundColor: 'var(--pub-surface)',
                  padding: '2.5rem',
                  border: '1px solid var(--pub-line)',
                  borderLeft: `5px solid ${ph.color}`,
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.5rem' }}>
                  <span className="pub-mono" style={{ fontSize: '0.8125rem', fontWeight: 700, color: ph.color, letterSpacing: '0.05em' }}>
                    {ph.phase}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', fontFamily: 'var(--font-mono)' }}>
                    {ph.timeframe}
                  </span>
                </div>

                <h2 className="pub-heading" style={{ fontSize: '1.5rem', color: 'var(--pub-ink)', marginBottom: '1.75rem' }}>
                  {ph.title}
                </h2>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.25rem',
                  }}
                >
                  {ph.steps.map((st, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        backgroundColor: 'var(--pub-canvas)',
                        padding: '1.25rem',
                        borderRadius: '10px',
                        border: '1px solid var(--pub-line)',
                      }}
                    >
                      <div className="pub-mono" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-coral)', marginBottom: '0.4rem' }}>
                        Langkah {sIdx + 1}
                      </div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                        {st.title}
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--pub-ink-soft)', lineHeight: 1.55 }}>
                        {st.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer CTAs */}
          <div
            style={{
              marginTop: '4rem',
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
      </section>
    </div>
  );
}
