import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  Send,
  Sparkles,
  Users,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function UntukPenyelenggaraPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    eventName: '',
    estimatedTeams: '32',
    targetDate: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Hero Header */}
      <section style={{ padding: '4.5rem 0 3.5rem', backgroundColor: 'var(--pub-surface)', borderBottom: '1px solid var(--pub-line)' }}>
        <div className="pub-container" style={{ maxWidth: '840px', textAlign: 'center' }}>
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
            SOLUSI OPERASIONAL KOMPETISI
          </div>
          <h1 className="pub-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--pub-ink)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Selenggarakan Lomba Paskibra dengan Standar Tertinggi
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--pub-ink-soft)', lineHeight: 1.65 }}>
            Beralih dari sistem manual yang melelahkan ke sistem terpadu KOMPAS. Hindari antrean bentrok, percepat penjurian, dan hadirkan transparansi yang dihargai seluruh kontingen.
          </p>
        </div>
      </section>

      {/* Main Grid: Benefits + Contact Form */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--pub-canvas)' }}>
        <div className="pub-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'start',
            }}
          >
            {/* Left: Value Props */}
            <div>
              <h2 className="pub-heading" style={{ fontSize: '1.85rem', color: 'var(--pub-ink)', marginBottom: '1.5rem' }}>
                Mengapa Penyelenggara Memilih KOMPAS?
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {[
                  {
                    title: 'Bebas Antrean Liar di Pos DP (Atomic Lock)',
                    desc: 'Petugas lapangan tidak lagi berdebat dengan official tim. Sistem gerbang pintu air memastikan perpindahan tim hanya terjadi jika pos berikutnya kosong.',
                  },
                  {
                    title: 'Hasil Penilaian Instan & Tanpa Debat Rekap',
                    desc: 'Rekapitulasi otomatis menghapus risiko salah hitung matematika atau kecurigaan manipulasi lembar penilaian kertas.',
                  },
                  {
                    title: 'Feedback Edukatif Bertenaga AI untuk Peserta',
                    desc: 'Dewan juri cukup mendiktekan suara di lapangan. AI merapikan catatan evaluasi sehingga kontingen pulang membawa bahan evaluasi latihan yang berharga.',
                  },
                  {
                    title: 'Multi-Role Permissions yang Aman',
                    desc: 'Super Admin, Panitia Berkas, Operator Pos DP, dan Dewan Juri hanya memiliki wewenang pada domainnya masing-masing dengan audit trail lengkap.',
                  },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--pub-coral-pale)',
                        color: 'var(--pub-coral-dark)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <h3 className="pub-heading" style={{ fontSize: '1.05rem', color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--pub-ink-soft)', lineHeight: 1.6 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Registration / Consultation Form */}
            <div>
              <div
                className="pub-card"
                style={{
                  backgroundColor: 'var(--pub-surface)',
                  padding: '2.5rem',
                  border: '1px solid var(--pub-line)',
                }}
              >
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--pub-teal-light)',
                        color: 'var(--pub-teal)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="pub-heading" style={{ fontSize: '1.5rem', color: 'var(--pub-ink)', marginBottom: '0.5rem' }}>
                      Permintaan Konsultasi Diterima!
                    </h3>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--pub-ink-soft)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      Terima kasih atas kepercayaan Anda. Tim operasional KOMPAS akan segera menghubungi nomor WhatsApp <strong>{formData.phone}</strong> untuk pembahasan konfigurasi event dan demonstrasi teknis.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="pub-btn-outline"
                      style={{ fontSize: '0.875rem' }}
                    >
                      Kirim Pertanyaan Lain
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div
                        className="pub-mono"
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: 'var(--pub-coral)',
                          textTransform: 'uppercase',
                          marginBottom: '0.25rem',
                        }}
                      >
                        FORMULIR KERJASAMA
                      </div>
                      <h3 className="pub-heading" style={{ fontSize: '1.35rem', color: 'var(--pub-ink)' }}>
                        Diskusikan Kebutuhan Event Anda
                      </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                          Nama Lengkap Penyelenggara / PIC *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Contoh: Rian Pratama, S.Pd"
                          className="form-input"
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                            Email Resmi *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="panitia@sekolah.sch.id"
                            className="form-input"
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                            Nomor WhatsApp *
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="0812-XXXX-XXXX"
                            className="form-input"
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                          Organisasi / Instansi / Pangkalan Sekolah *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.organization}
                          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                          placeholder="Contoh: PPI Kota Jakarta Timur / SMAN 1"
                          className="form-input"
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                            Target Tanggal Lomba
                          </label>
                          <input
                            type="text"
                            value={formData.targetDate}
                            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                            placeholder="Bulan / Tahun"
                            className="form-input"
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                            Estimasi Jumlah Tim
                          </label>
                          <select
                            value={formData.estimatedTeams}
                            onChange={(e) => setFormData({ ...formData, estimatedTeams: e.target.value })}
                            className="form-input"
                            style={{ width: '100%' }}
                          >
                            <option value="16">16 - 24 Tim</option>
                            <option value="32">25 - 40 Tim</option>
                            <option value="60">40+ Tim (Skala Besar)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                          Catatan / Rencana Lomba
                        </label>
                        <textarea
                          rows={3}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Jelaskan kebutuhan khusus lomba Anda (jumlah pos, lokasi, kategori peserta)..."
                          className="form-input"
                          style={{ width: '100%', resize: 'vertical' }}
                        />
                      </div>

                      <button type="submit" className="pub-btn-coral" style={{ width: '100%', marginTop: '0.5rem' }}>
                        <span>Kirim Permintaan Konsultasi</span>
                        <Send size={15} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
