import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle,
  Eye,
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  ArrowUpRight,
  Upload,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { getStoredPublicEvents, saveStoredPublicEvent, DEFAULT_PUBLIC_EVENTS } from '../../../data/publicEvents';

const DEFAULT_BANNER_FALLBACK = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80';

export default function AdminPanitiaEventSettings({ eventId = 'lkbb-nasional-2026' }) {
  const events = getStoredPublicEvents();
  const currentEvent = events.find((e) => e.id === eventId || e.slug === eventId) || events[0] || DEFAULT_PUBLIC_EVENTS[0];

  // Local Form State
  const [formData, setFormData] = useState({
    title: currentEvent.title || '',
    category: currentEvent.category || 'SMA/SMK Sederajat',
    organizer: currentEvent.organizer || '',
    date: currentEvent.date || '',
    registrationDeadline: currentEvent.registrationDeadline || '',
    location: currentEvent.location || '',
    address: currentEvent.address || '',
    quota: currentEvent.quota || '32 Tim',
    fee: currentEvent.fee || 'Rp 650.000 / Tim',
    status: currentEvent.status || 'OPEN',
    shortDesc: currentEvent.shortDesc || '',
    fullDesc: currentEvent.fullDesc || '',
    bannerUrl: currentEvent.bannerUrl || DEFAULT_BANNER_FALLBACK,
    judges: currentEvent.judges || [
      {
        id: 'juri-1',
        name: 'Kolonel (Purn) Bambang S., M.Pd',
        role: 'Ketua Dewan Juri / PBB Murni',
        institution: 'Purna Paskibra Indonesia (PPI Pusat)',
        verified: true,
      },
      {
        id: 'juri-2',
        name: 'Mayor Aris Setiawan',
        role: 'Anggota Juri / Formasi & Variasi',
        institution: 'Dispora & Kodam Jaya',
        verified: true,
      },
      {
        id: 'juri-3',
        name: 'Dra. Endang Lestari',
        role: 'Anggota Juri / Danton & Artikulasi',
        institution: 'Instruktur Protokoler & Kepemudaan Nasional',
        verified: true,
      },
    ],
  });

  // State untuk Tambah Juri Baru
  const [newJudge, setNewJudge] = useState({
    name: '',
    role: 'Juri Penilaian Baris-Berbaris',
    institution: '',
  });
  const [isAddingJudge, setIsAddingJudge] = useState(false);

  // Status Feedback
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', 'error'
  const [previewTab, setPreviewTab] = useState('card'); // 'card' or 'hero'

  // Update formData when event changes
  useEffect(() => {
    if (currentEvent) {
      setFormData({
        title: currentEvent.title || '',
        category: currentEvent.category || 'SMA/SMK Sederajat',
        organizer: currentEvent.organizer || '',
        date: currentEvent.date || '',
        registrationDeadline: currentEvent.registrationDeadline || '',
        location: currentEvent.location || '',
        address: currentEvent.address || '',
        quota: currentEvent.quota || '32 Tim',
        fee: currentEvent.fee || 'Rp 650.000 / Tim',
        status: currentEvent.status || 'OPEN',
        shortDesc: currentEvent.shortDesc || '',
        fullDesc: currentEvent.fullDesc || '',
        bannerUrl: currentEvent.bannerUrl || DEFAULT_BANNER_FALLBACK,
        judges: currentEvent.judges || [],
      });
    }
  }, [eventId]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Upload gambar lokal simulator (convert to data URL)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleInputChange('bannerUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Tambah Dewan Juri
  const handleAddJudge = () => {
    if (!newJudge.name.trim()) return;
    const judgeObj = {
      id: `juri-${Date.now()}`,
      name: newJudge.name.trim(),
      role: newJudge.role.trim() || 'Dewan Juri Lomba',
      institution: newJudge.institution.trim() || 'Lembaga Independen',
      verified: true,
    };
    setFormData((prev) => ({
      ...prev,
      judges: [...prev.judges, judgeObj],
    }));
    setNewJudge({ name: '', role: 'Juri Penilaian Baris-Berbaris', institution: '' });
    setIsAddingJudge(false);
  };

  // Hapus Juri
  const handleDeleteJudge = (judgeId) => {
    setFormData((prev) => ({
      ...prev,
      judges: prev.judges.filter((j) => j.id !== judgeId),
    }));
  };

  // Simpan Perubahan
  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // 1. Simpan ke local stored public events
      saveStoredPublicEvent(currentEvent.slug || currentEvent.id, formData);

      // 2. Sync ke backend endpoint (jika server aktif)
      try {
        await fetch(`/api/events/${currentEvent.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.title,
            description: formData.shortDesc,
            location: formData.location,
            status: formData.status === 'OPEN' ? 'REGISTRATION_OPEN' : formData.status === 'SOON' ? 'DRAFT_SETUP' : 'COMPLETED',
            bannerUrl: formData.bannerUrl,
            judges: formData.judges,
          }),
        });
      } catch (apiErr) {
        console.warn('Backend API sync fallback to local state:', apiErr);
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 3500);
    } catch (err) {
      console.error('Error saving event details:', err);
      setSaveStatus('error');
    }
  };

  // Reset ke Default
  const handleReset = () => {
    const defaultEv = DEFAULT_PUBLIC_EVENTS.find((e) => e.id === currentEvent.id) || DEFAULT_PUBLIC_EVENTS[0];
    setFormData({
      title: defaultEv.title,
      category: defaultEv.category,
      organizer: defaultEv.organizer,
      date: defaultEv.date,
      registrationDeadline: defaultEv.registrationDeadline,
      location: defaultEv.location,
      address: defaultEv.address,
      quota: defaultEv.quota,
      fee: defaultEv.fee,
      status: defaultEv.status,
      shortDesc: defaultEv.shortDesc,
      fullDesc: defaultEv.fullDesc,
      bannerUrl: defaultEv.bannerUrl,
      judges: defaultEv.judges,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'var(--font-sans)' }}>
      {/* Top Banner Header & Notification */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.5rem 1.75rem',
          border: '1px solid var(--pub-line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <span
              style={{
                backgroundColor: 'rgba(201, 75, 60, 0.1)',
                color: 'var(--pub-coral)',
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--pub-radius-pill)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                fontFamily: 'var(--font-mono)',
              }}
            >
              PENGATURAN PUBLIK
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--pub-muted)', fontFamily: 'var(--font-mono)' }}>
              {currentEvent.slug}
            </span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.45rem',
              fontWeight: 800,
              color: 'var(--pub-ink)',
              margin: '0 0 0.25rem 0',
            }}
          >
            Pengaturan Detail Lomba & Banner Card Publik
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--pub-muted)', margin: 0 }}>
            Kelola banner card publik, deskripsi lomba, dewan juri, dan lihat live preview sebelum tampil ke calon peserta.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--pub-line)',
              backgroundColor: 'transparent',
              color: 'var(--pub-ink-soft)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Reset ke nilai default"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          <a
            href={`/event/${currentEvent.slug}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--pub-line)',
              backgroundColor: 'var(--pub-canvas)',
              color: 'var(--pub-ink)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            title="Buka tampilan web publik di tab baru"
          >
            <ExternalLink size={14} />
            <span>Katalog Publik</span>
          </a>

          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="pub-btn-coral"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              opacity: saveStatus === 'saving' ? 0.7 : 1,
            }}
          >
            <Save size={15} />
            <span>{saveStatus === 'saving' ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveStatus === 'saved' && (
        <div
          style={{
            backgroundColor: 'var(--pub-teal-light)',
            color: 'var(--pub-teal)',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--pub-teal)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle size={18} />
          <span>Pengaturan detail lomba dan banner publik berhasil disimpan! Perubahan telah aktif di halaman publik.</span>
        </div>
      )}

      {/* Main Split Layout: Left Form (58%) & Right Sticky Live Preview (42%) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.45fr) minmax(360px, 1fr)',
          gap: '1.75rem',
          alignItems: 'start',
        }}
      >
        {/* ================================================================ */}
        {/* LEFT COLUMN: PENGATURAN DETAIL LOMBA                             */}
        {/* ================================================================ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* 1. SEKSI BANNER CARD PUBLIK */}
          <div
            style={{
              backgroundColor: 'var(--pub-surface)',
              borderRadius: 'var(--pub-radius-card)',
              padding: '1.5rem',
              border: '1px solid var(--pub-line)',
              boxShadow: 'var(--pub-shadow-card)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(201, 75, 60, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--pub-coral)',
                  }}
                >
                  <ImageIcon size={17} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                    Banner Card Web Publik
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--pub-muted)', margin: 0 }}>
                    Gambar banner utama yang dipajang di card katalog dan banner halaman lomba.
                  </p>
                </div>
              </div>
            </div>

            {/* Input URL Gambar & Upload */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.4rem' }}>
                URL Gambar Banner (Online / CDN):
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={formData.bannerUrl}
                  onChange={(e) => handleInputChange('bannerUrl', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  style={{
                    flex: 1,
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: 'var(--pub-canvas)',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--pub-ink)',
                    outline: 'none',
                  }}
                />
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.6rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: 'var(--pub-surface)',
                    color: 'var(--pub-ink)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                  title="Upload gambar dari komputer lokal"
                >
                  <Upload size={14} />
                  <span>Upload File</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--pub-muted)', marginTop: '0.35rem' }}>
                Rekomendasi rasio aspek 16:9 atau lebar minimal 800px untuk ketajaman optimal pada card publik.
              </div>
            </div>
          </div>

          {/* 2. SEKSI DETAIL & DESKRIPSI LOMBA */}
          <div
            style={{
              backgroundColor: 'var(--pub-surface)',
              borderRadius: 'var(--pub-radius-card)',
              padding: '1.5rem',
              border: '1px solid var(--pub-line)',
              boxShadow: 'var(--pub-shadow-card)',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0 0 1rem 0' }}>
              Informasi & Deskripsi Lomba
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              {/* Nama Event */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Nama / Judul Kompetisi:
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: 'var(--pub-canvas)',
                    fontSize: '0.875rem',
                    color: 'var(--pub-ink)',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Kategori Lomba */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Tingkat / Kategori:
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: 'var(--pub-canvas)',
                    fontSize: '0.85rem',
                    color: 'var(--pub-ink)',
                    outline: 'none',
                  }}
                >
                  <option value="SMA/SMK Sederajat">SMA/SMK Sederajat</option>
                  <option value="SMP & SMA/SMK Sederajat">SMP & SMA/SMK Sederajat</option>
                  <option value="SMP/MTs Sederajat">SMP/MTs Sederajat</option>
                  <option value="Purna Paskibra & Umum">Purna Paskibra & Umum</option>
                  <option value="Terbuka Nasional">Terbuka Nasional</option>
                </select>
              </div>

              {/* Status Pendaftaran */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Status Pendaftaran:
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: 'var(--pub-canvas)',
                    fontSize: '0.85rem',
                    color: 'var(--pub-ink)',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                >
                  <option value="OPEN">🟢 OPEN (Pendaftaran Dibuka)</option>
                  <option value="SOON">🟡 SOON (Segera Dibuka)</option>
                  <option value="CLOSED">⚪ CLOSED (Selesai / Ditutup)</option>
                </select>
              </div>

              {/* Penyelenggara */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Lembaga Penyelenggara / Organizer:
                </label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={(e) => handleInputChange('organizer', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: 'var(--pub-canvas)',
                    fontSize: '0.85rem',
                    color: 'var(--pub-ink)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Tanggal Pelaksanaan */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Tanggal Pelaksanaan (Hari H):
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  placeholder="Contoh: 15 November 2026"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: 'var(--pub-canvas)',
                    fontSize: '0.85rem',
                    color: 'var(--pub-ink)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Batas Akhir Pendaftaran */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Batas Akhir Pendaftaran:
                </label>
                <input
                  type="text"
                  value={formData.registrationDeadline}
                  onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                  placeholder="Contoh: 01 November 2026"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: 'var(--pub-canvas)',
                    fontSize: '0.85rem',
                    color: 'var(--pub-ink)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Lokasi / Venue */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Lokasi / Venue Utama:
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Contoh: GOR Remaja Jakarta Timur"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: 'var(--pub-canvas)',
                    fontSize: '0.85rem',
                    color: 'var(--pub-ink)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Kuota & Biaya */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Kuota Peserta:
                </label>
                <input
                  type="text"
                  value={formData.quota}
                  onChange={(e) => handleInputChange('quota', e.target.value)}
                  placeholder="Contoh: 32 Tim"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: 'var(--pub-canvas)',
                    fontSize: '0.85rem',
                    color: 'var(--pub-ink)',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Biaya Kontingen:
                </label>
                <input
                  type="text"
                  value={formData.fee}
                  onChange={(e) => handleInputChange('fee', e.target.value)}
                  placeholder="Contoh: Rp 650.000 / Tim"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: 'var(--pub-canvas)',
                    fontSize: '0.85rem',
                    color: 'var(--pub-ink)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Deskripsi Singkat untuk Card Publik */}
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
                    Deskripsi Singkat (Tampil di Card Web Publik):
                  </label>
                  <span style={{ fontSize: '0.72rem', color: formData.shortDesc.length > 200 ? 'var(--pub-coral)' : 'var(--pub-muted)', fontFamily: 'var(--font-mono)' }}>
                    {formData.shortDesc.length}/220 Karakter
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={formData.shortDesc}
                  onChange={(e) => handleInputChange('shortDesc', e.target.value)}
                  placeholder="Tuliskan ringkasan 2-3 kalimat menarik mengenai lomba ini untuk calon peserta..."
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: 'var(--pub-canvas)',
                    fontSize: '0.85rem',
                    color: 'var(--pub-ink)',
                    lineHeight: 1.5,
                    resize: 'vertical',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Deskripsi Lengkap Petunjuk Teknis */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Deskripsi Lengkap / Penjelasan Juknis (Halaman Detail):
                </label>
                <textarea
                  rows={4}
                  value={formData.fullDesc}
                  onChange={(e) => handleInputChange('fullDesc', e.target.value)}
                  placeholder="Jelaskan gambaran umum teknis lomba, piala bergilir, dan sistem penilaian..."
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: 'var(--pub-canvas)',
                    fontSize: '0.85rem',
                    color: 'var(--pub-ink)',
                    lineHeight: 1.5,
                    resize: 'vertical',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* 3. SEKSI DEWAN JURI RESMI */}
          <div
            style={{
              backgroundColor: 'var(--pub-surface)',
              borderRadius: 'var(--pub-radius-card)',
              padding: '1.5rem',
              border: '1px solid var(--pub-line)',
              boxShadow: 'var(--pub-shadow-card)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                  Dewan Juri Resmi (Siapa Saja Jurinya)
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
                  Nama dan institusi juri ditampilkan di card web publik untuk menjamin transparansi & kredibilitas ajang.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingJudge(!isAddingJudge)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 0.95rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(201, 75, 60, 0.1)',
                  color: 'var(--pub-coral)',
                  border: '1px solid rgba(201, 75, 60, 0.3)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Plus size={15} />
                <span>Tambah Juri</span>
              </button>
            </div>

            {/* Form Tambah Juri Expandable */}
            {isAddingJudge && (
              <div
                style={{
                  backgroundColor: 'var(--pub-canvas)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  border: '1px solid var(--pub-line)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.75rem' }}>
                  Formulir Penugasan Juri Baru
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--pub-muted)', marginBottom: '0.25rem' }}>
                      Nama Lengkap & Gelar Juri:
                    </label>
                    <input
                      type="text"
                      value={newJudge.name}
                      onChange={(e) => setNewJudge({ ...newJudge, name: e.target.value })}
                      placeholder="Contoh: Mayor (Inf) Hendra Gunawan, S.H"
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid var(--pub-line)',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.825rem',
                        color: 'var(--pub-ink)',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--pub-muted)', marginBottom: '0.25rem' }}>
                      Asal Lembaga / Instansi:
                    </label>
                    <input
                      type="text"
                      value={newJudge.institution}
                      onChange={(e) => setNewJudge({ ...newJudge, institution: e.target.value })}
                      placeholder="Contoh: Dispora DKI / Kodam Jaya"
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid var(--pub-line)',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.825rem',
                        color: 'var(--pub-ink)',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--pub-muted)', marginBottom: '0.25rem' }}>
                      Bidang / Aspek Penilaian:
                    </label>
                    <input
                      type="text"
                      value={newJudge.role}
                      onChange={(e) => setNewJudge({ ...newJudge, role: e.target.value })}
                      placeholder="Contoh: PBB Murni / Formasi Variasi / Danton"
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid var(--pub-line)',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.825rem',
                        color: 'var(--pub-ink)',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddingJudge(false)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      border: '1px solid var(--pub-line)',
                      backgroundColor: 'transparent',
                      color: 'var(--pub-muted)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleAddJudge}
                    className="pub-btn-coral"
                    style={{
                      padding: '0.45rem 1rem',
                      fontSize: '0.775rem',
                      fontWeight: 700,
                    }}
                  >
                    Tambahkan ke Daftar
                  </button>
                </div>
              </div>
            )}

            {/* List Dewan Juri Terdaftar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {formData.judges && formData.judges.length > 0 ? (
                formData.judges.map((judge, idx) => (
                  <div
                    key={judge.id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--pub-canvas)',
                      border: '1px solid var(--pub-line)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--pub-navy)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          flexShrink: 0,
                          fontFamily: 'var(--font-heading)',
                        }}
                      >
                        {judge.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
                          {judge.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.1rem' }}>
                          <span style={{ color: 'var(--pub-coral)', fontWeight: 600 }}>{judge.role}</span>
                          <span>·</span>
                          <span>{judge.institution}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span
                        style={{
                          backgroundColor: 'var(--pub-teal-light)',
                          color: 'var(--pub-teal)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--pub-radius-pill)',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                        }}
                      >
                        Terverifikasi
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteJudge(judge.id)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#EF4444',
                          cursor: 'pointer',
                          padding: '0.35rem',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="Hapus Juri"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--pub-muted)', fontSize: '0.85rem' }}>
                  Belum ada dewan juri yang ditugaskan. Klik tombol "Tambah Juri" di atas.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* RIGHT COLUMN: STICKY REAL-TIME PUBLIC CARD PREVIEW               */}
        {/* ================================================================ */}
        <div style={{ position: 'sticky', top: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Preview Header & Controls */}
          <div
            style={{
              backgroundColor: 'var(--pub-navy)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '0.85rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 10px #10B981',
                }}
              />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.04em', fontFamily: 'var(--font-heading)' }}>
                LIVE PREVIEW WEB PUBLIK
              </span>
            </div>

            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
              Real-time Sync
            </span>
          </div>

          {/* CARD PREVIEW CONTAINER (EXACT MATCH TO PUBLIC CATALOG CARD - IMAGE 2) */}
          <div
            className="pub-card"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid var(--pub-line)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxShadow: '0 8px 30px -4px rgba(23, 32, 51, 0.12)',
              transition: 'all 0.2s ease',
            }}
          >
            {/* 1. Header Board Tag */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                className="pub-mono"
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  color: 'var(--pub-coral)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                EVENT BOARD / 01
              </span>
            </div>

            {/* 2. Banner Inner Container with Title & Category */}
            <div
              style={{
                borderRadius: '16px',
                height: '175px',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'var(--pub-navy)',
                padding: '1.35rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {formData.bannerUrl && (
                <img
                  src={formData.bannerUrl}
                  alt={formData.title}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_BANNER_FALLBACK;
                  }}
                />
              )}

              {/* Warm cinematic gradient overlay matching Image 2 */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(201, 75, 60, 0.82) 0%, rgba(23, 32, 51, 0.88) 100%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Category Top Label inside Banner */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span
                  className="pub-mono"
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'rgba(255, 255, 255, 0.92)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  {formData.category ? formData.category.toUpperCase() : 'KOMPETISI PASKIBRA'}
                </span>
              </div>

              {/* Large Bold Event Title inside Banner */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2
                  className="pub-heading"
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    lineHeight: 1.25,
                    margin: 0,
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {formData.title || 'Judul Lomba Paskibra'}
                </h2>
              </div>
            </div>

            {/* 3. Information Section (Hanya Nama Event [di banner], Tanggal, dan Oleh) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                padding: '0.25rem 0.25rem',
              }}
            >
              {/* Tanggal Event */}
              <div>
                <div
                  className="pub-mono"
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: 'var(--pub-muted)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.3rem',
                  }}
                >
                  TANGGAL
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: 'var(--pub-ink)',
                    lineHeight: 1.3,
                  }}
                >
                  {formData.date || 'TBA'}
                </div>
              </div>

              {/* Oleh / Penyelenggara */}
              <div>
                <div
                  className="pub-mono"
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: 'var(--pub-muted)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.3rem',
                  }}
                >
                  PENYELENGGARA
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: 'var(--pub-ink)',
                    lineHeight: 1.3,
                  }}
                >
                  {formData.organizer || 'Panitia Pelaksana'}
                </div>
              </div>
            </div>

            {/* 4. Bottom Divider + Link Info + Circular Arrow Button */}
            <div
              style={{
                borderTop: '1px solid var(--pub-line-subtle)',
                paddingTop: '1rem',
                marginTop: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: 'var(--pub-muted)',
                }}
              >
                {formData.quota ? `Kuota: ${formData.quota}` : 'Lihat Detail & Juknis'}
              </div>

              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--pub-navy)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.18)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <ArrowUpRight size={20} />
              </div>
            </div>
          </div>

          {/* Hint info callout */}
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(31, 138, 120, 0.08)',
              border: '1px solid rgba(31, 138, 120, 0.2)',
              color: 'var(--pub-teal)',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              lineHeight: 1.5,
            }}
          >
            <CheckCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Pratinjau Akurat:</strong> Tampilan di atas adalah representasi visual 1:1 bagaimana pengunjung dan kontingen sekolah melihat event Anda di katalog resmi KOMPAS.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
