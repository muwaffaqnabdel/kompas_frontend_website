import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Search,
  HelpCircle,
  ArrowRight,
  Shield,
  FileCheck,
  Award,
} from 'lucide-react';

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState('');

  const faqData = [
    {
      category: 'REGISTRATION',
      q: 'Apa saja berkas wajib yang harus diunggah kontingen saat mendaftar?',
      a: 'Berkas wajib standar mencakup: (1) Surat Tugas resmi Kepala Sekolah, (2) Daftar susunan 16 pasukan inti + maksimal 2 cadangan, (3) Salinan Kartu Pelajar sah seluruh anggota, (4) Surat Keterangan Sehat dari dokter/puskesmas, dan (5) Bukti transfer biaya registrasi.',
    },
    {
      category: 'REGISTRATION',
      q: 'Bagaimana jika ada berkas yang ditolak oleh panitia verifikator?',
      a: 'Panitia akan memberikan catatan spesifik (misal: "Foto Kartu Pelajar buram"). Pembina sekolah akan menerima notifikasi di portal tim dan dapat mengunggah revisi dokumen sebelum batas waktu penutupan pendaftaran berakhir.',
    },
    {
      category: 'HARI_H',
      q: 'Apa yang dimaksud dengan sistem Atomic Lock pada 4 Pos DP?',
      a: 'Atomic Lock adalah aturan ketat kapasitas pada pos daerah persiapan (Pos DP 1 Dokumen, Pos DP 2 Photoshoot, Pos DP 3 Pemanasan, Pos DP 4 Panggung). Tim di Pos DP 1 tidak dapat berpindah ke Pos DP 2 apabila di Pos DP 2 masih ada tim yang sedang beraktivitas. Ini menjamin alur tertib tanpa antrean bentrok.',
    },
    {
      category: 'HARI_H',
      q: 'Berapa menit batas waktu yang diberikan kepada setiap tim di panggung utama?',
      a: 'Durasi standar umumnya 9 menit (tergantung ketentuan Juknis masing-masing event). Timer penjurian digital KOMPAS akan otomatis mencatat durasi tepat sejak danton memberi aba-aba hormat dan menerapkan pengurangan penalti jika melebihi batas waktu.',
    },
    {
      category: 'JURI',
      q: 'Bagaimana cara juri memberikan nilai pada saat lomba berlangsung?',
      a: 'Setiap juri memegang tablet atau smartphone yang terhubung ke jaringan lokal/cloud KOMPAS. Juri tinggal memilih nilai angka (70–100) per kriteria teknis Paskibra secara instan tanpa perlu coret-coret di atas kertas.',
    },
    {
      category: 'JURI',
      q: 'Apakah suara evaluasi juri langsung terdengar oleh peserta?',
      a: 'Tidak. Suara rekaman juri diproses secara privat oleh AI (Groq Whisper + Llama 3) untuk dirapikan menjadi dokumen catatan evaluasi teks yang santun dan konstruktif, lalu diterbitkan di lembar hasil akhir kontingen setelah lomba selesai.',
    },
    {
      category: 'PENYELENGGARA',
      q: 'Apakah penyelenggara bisa mengubah kriteria penilaian di tengah lomba?',
      a: 'Demi integritas dan asas keadilan lomba, sistem KOMPAS mewajibkan Admin Panitia untuk "Mengunci (Lock)" kriteria penilaian dan flow DP sebelum hari H dimulai. Perubahan kriteria di tengah lomba dilarang secara sistem.',
    },
    {
      category: 'PENYELENGGARA',
      q: 'Bagaimana jika koneksi internet di venue GOR / Stadion kurang stabil?',
      a: 'Sistem scoring KOMPAS memiliki mekanisme penampungan data lokal (Local Caching). Nilai yang diinput oleh dewan juri tersimpan di perangkat lokal dan akan otomatis tersinkronisasi ke server pusat saat sinyal kembali pulih.',
    },
  ];

  const filteredFaqs = faqData.filter((item) => {
    const matchesCat = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch =
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
            PUSAT BANTUAN & INFORMASI
          </div>
          <h1 className="pub-heading" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--pub-ink)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Pertanyaan yang Sering Diajukan
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--pub-ink-soft)', lineHeight: 1.6 }}>
            Temukan jawaban lengkap seputar registrasi kontingen, alur pos transit, sistem penjurian digital, dan operasional platform KOMPAS.
          </p>
        </div>
      </section>

      {/* FAQ Controls & List */}
      <section style={{ padding: '4rem 0 6rem', backgroundColor: 'var(--pub-canvas)' }}>
        <div className="pub-container" style={{ maxWidth: '850px' }}>
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              backgroundColor: 'var(--pub-surface)',
              border: '1px solid var(--pub-line)',
              borderRadius: 'var(--pub-radius-pill)',
              padding: '0.75rem 1.25rem',
              marginBottom: '1.75rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Search size={18} color="var(--pub-muted)" />
            <input
              type="text"
              placeholder="Ketik kata kunci (misal: Atomic Lock, berkas, juri)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.925rem',
                color: 'var(--pub-ink)',
                outline: 'none',
                width: '100%',
              }}
            />
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
            {[
              { id: 'ALL', label: 'Semua Pertanyaan' },
              { id: 'REGISTRATION', label: 'Pendaftaran & Berkas' },
              { id: 'HARI_H', label: 'Alur 4 Pos DP' },
              { id: 'JURI', label: 'Penjurian & AI' },
              { id: 'PENYELENGGARA', label: 'Penyelenggara Lomba' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  padding: '0.5rem 1.1rem',
                  borderRadius: 'var(--pub-radius-pill)',
                  border: activeCategory === cat.id ? '1px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                  backgroundColor: activeCategory === cat.id ? 'var(--pub-coral)' : 'var(--pub-surface)',
                  color: activeCategory === cat.id ? '#FFFFFF' : 'var(--pub-ink)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className="pub-card"
                    style={{
                      padding: '1.25rem 1.5rem',
                      backgroundColor: 'var(--pub-surface)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--pub-ink)', margin: 0, paddingRight: '1rem' }}>
                        {faq.q}
                      </h3>
                      <ChevronDown
                        size={20}
                        color="var(--pub-coral)"
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s ease',
                          flexShrink: 0,
                        }}
                      />
                    </div>

                    {isOpen && (
                      <p style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--pub-line)', fontSize: '0.9rem', color: 'var(--pub-ink-soft)', lineHeight: 1.65 }}>
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="pub-card" style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--pub-surface)' }}>
                <p style={{ color: 'var(--pub-muted)', fontSize: '0.95rem' }}>
                  Tidak ada pertanyaan yang sesuai dengan kata kunci Anda.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
