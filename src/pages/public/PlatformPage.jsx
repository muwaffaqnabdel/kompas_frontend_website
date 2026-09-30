import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Layers,
  GitCommit,
  Award,
  Mic,
  Activity,
  CheckCircle2,
  Lock,
  ArrowRight,
  Database,
  Cpu,
} from 'lucide-react';

export default function PlatformPage() {
  const modules = [
    {
      num: '01',
      title: 'Engine Registrasi & Validasi Berkas Terpadu',
      badge: 'MODUL PRA-EVENT',
      desc: 'Mengakhiri pengumpulan berkas tercecer di grup percakapan. Pangkalan sekolah mendaftarkan 16 anggota pasukan, mengunggah surat tugas kepala sekolah, surat dokter, dan bukti bayar dalam satu folder kontingen terenkripsi.',
      features: [
        'Pemeriksaan validasi berkas per status (Verified, Revision Needed, Pending).',
        'Generator nomor urut tampil otomatis setelah berkas dinyatakan lengkap.',
        'Pencegahan duplikasi NIK / Kartu Pelajar siswa di peleton berbeda.',
      ],
    },
    {
      num: '02',
      title: 'Atomic Lock Flow 4 Pos DP (Pintu Air)',
      badge: 'MODUL HARI H (OPERASIONAL)',
      desc: 'Inovasi utama KOMPAS untuk mengeliminasi bentrok dan penumpukan tim di area transit. Mengatur sirkulasi tim tepat 1 tim per pos (DP 1 Dokumen → DP 2 Photoshoot → DP 3 Pemanasan → DP 4 Panggung).',
      features: [
        'Atomic Lock: Pos tujuan harus kosong sebelum tim di pos saat ini diizinkan melangkah maju.',
        'Notifikasi ruang tunggu otomatis ketika slot pos DP 1 telah siap.',
        'Monitoring durasi tinggal di tiap pos untuk mencegah kemacetan jadwal.',
      ],
    },
    {
      num: '03',
      title: 'Scoring Engine & AI Voice Feedback Dewan Juri',
      badge: 'MODUL PENJURIAN DIGITAL',
      desc: 'Menggantikan formulir kertas dan kalkulator manual. Dewan juri memberikan nilai pada kriteria baku Paskibra secara instan melalui tablet/smartphone di pinggir lapangan.',
      features: [
        'Input nilai cepat dengan skala angka terstandardisasi.',
        'Dikte suara evaluasi langsung diolah oleh Groq AI menjadi catatan konstruktif.',
        'Buffer jeda koreksi 5 detik (Undo) sebelum penilaian dikunci ke server pusat.',
      ],
    },
    {
      num: '04',
      title: 'Realtime Live Sync & Rekapitulasi Otomatis',
      badge: 'MODUL SINKRONISASI SERVER',
      desc: 'Seluruh pergerakan tim di pos DP dan input nilai dari seluruh juri disinkronkan secara langsung menggunakan WebSocket / Supabase Realtime, menjamin transparansi tanpa latensi.',
      features: [
        'Kalkulasi otomatis bobot nilai, pengurangan penalti, dan peringkat tim.',
        'Data tersimpan offline jika sinyal lapangan sementara tidak stabil.',
        'Publikasi hasil transparan yang dapat diakses kontingen segera setelah lomba ditutup.',
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header Banner */}
      <section style={{ padding: '4.5rem 0 3.5rem', borderBottom: '1px solid var(--pub-line)', backgroundColor: 'var(--pub-surface)' }}>
        <div className="pub-container" style={{ maxWidth: '820px', textAlign: 'center' }}>
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
            ARSITEKTUR & FITUR PLATFORM
          </div>
          <h1 className="pub-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--pub-ink)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Teknologi yang dirancang untuk kesempurnaan operasional lomba.
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--pub-ink-soft)', lineHeight: 1.65 }}>
            KOMPAS menggabungkan arsitektur data multi-event, sistem antrean berbasis aturan ketat, dan kecerdasan buatan untuk menghadirkan pengalaman kompetisi Paskibra yang bermartabat.
          </p>
        </div>
      </section>

      {/* Modules List */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--pub-canvas)' }}>
        <div className="pub-container" style={{ maxWidth: '960px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {modules.map((mod, idx) => (
              <div
                key={idx}
                className="pub-card"
                style={{
                  backgroundColor: 'var(--pub-surface)',
                  padding: '2.5rem',
                  border: '1px solid var(--pub-line)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="pub-badge-open">{mod.badge}</span>
                  <span className="pub-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pub-coral)' }}>
                    MODUL {mod.num}
                  </span>
                </div>

                <h2 className="pub-heading" style={{ fontSize: '1.65rem', color: 'var(--pub-ink)', marginBottom: '0.85rem' }}>
                  {mod.title}
                </h2>

                <p style={{ fontSize: '0.95rem', color: 'var(--pub-ink-soft)', lineHeight: 1.65, marginBottom: '1.75rem' }}>
                  {mod.desc}
                </p>

                <div
                  style={{
                    backgroundColor: 'var(--pub-canvas)',
                    borderRadius: '12px',
                    padding: '1.25rem 1.5rem',
                    border: '1px solid var(--pub-line)',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-ink)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                    Kapabilitas Utama:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {mod.features.map((feat, fIdx) => (
                      <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--pub-ink)' }}>
                        <CheckCircle2 size={16} color="var(--pub-coral)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div
            className="pub-card"
            style={{
              marginTop: '4rem',
              backgroundColor: 'var(--pub-navy)',
              color: '#FFFFFF',
              textAlign: 'center',
              padding: '3rem 2rem',
              border: 'none',
            }}
          >
            <h3 className="pub-heading" style={{ fontSize: '1.75rem', color: '#FFFFFF', marginBottom: '0.75rem' }}>
              Ingin menguji langsung fitur-fitur ini?
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#CBD5E1', maxWidth: '560px', margin: '0 auto 1.75rem' }}>
              Jelajahi simulasi interaktif seluruh peran (Super Admin, Panitia, Pos DP, dan Dewan Juri) di Dashboard KOMPAS.
            </p>
            <Link to="/dashboard" className="pub-btn-coral" style={{ padding: '0.75rem 1.75rem' }}>
              <span>Buka Demo Dashboard</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
