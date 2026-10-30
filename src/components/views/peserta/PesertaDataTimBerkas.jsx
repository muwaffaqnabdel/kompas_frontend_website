import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  Plus,
  Camera,
  Download,
  Save,
  Send,
  FileCheck,
  User,
  ShieldCheck,
} from 'lucide-react';

export default function PesertaDataTimBerkas() {
  // ---------------------------------------------------------------------------
  // 1. STATE BERKAS PERSYARATAN (DITETAPKAN OLEH ADMIN PANITIA)
  // ---------------------------------------------------------------------------
  const [documents, setDocuments] = useState([
    {
      id: 'doc-kartu-pelajar',
      title: 'File Kartu Pelajar (Kolektif Anggota)',
      description: 'Scan kartu pelajar resmi dari seluruh 16 anggota pasukan dalam 1 file PDF atau Word.',
      required: true,
      allowedFormats: 'PDF, DOC, DOCX (Maks. 10MB)',
      fileName: 'Kartu_Pelajar_Kolektif_SMAN1_16Anggota.pdf',
      fileSize: '3.4 MB',
      uploadedAt: '26 Okt 2026, 14:20 WIB',
      status: 'VERIFIED', // 'VERIFIED' | 'PENDING' | 'EMPTY'
    },
    {
      id: 'doc-surat-rekomendasi',
      title: 'File Surat Rekomendasi / Pengantar Sekolah',
      description: 'Surat tugas dan rekomendasi resmi dari Kepala Sekolah berstempel basah.',
      required: true,
      allowedFormats: 'PDF, DOC, DOCX (Maks. 10MB)',
      fileName: 'Surat_Rekomendasi_Kepsek_SMAN1_Jakarta.pdf',
      fileSize: '1.2 MB',
      uploadedAt: '26 Okt 2026, 14:25 WIB',
      status: 'VERIFIED',
    },
    {
      id: 'doc-formulir',
      title: 'Formulir Pendaftaran & Pakta Integritas Kontingen',
      description: 'Formulir biodata kontingen lengkap dan pakta integritas bermeterai 10.000.',
      required: true,
      allowedFormats: 'PDF, DOC, DOCX (Maks. 10MB)',
      fileName: 'Formulir_Pendaftaran_Kontingen_Paskibra_2026.docx',
      fileSize: '840 KB',
      uploadedAt: '27 Okt 2026, 09:15 WIB',
      status: 'PENDING',
      hasTemplate: true,
    },
  ]);

  // ---------------------------------------------------------------------------
  // 2. STATE DATA ANGGOTA TIM (16 KOTAK PAS FOTO + NAMA + TTL)
  // ---------------------------------------------------------------------------
  const initialMembers = [
    { id: 1, name: 'Fayzah Aghniah', ttl: 'Jakarta, 12 Januari 2008', role: 'Pasukan 1', photo: null },
    { id: 2, name: 'Fiki Aunillah', ttl: 'Bandung, 18 Maret 2008', role: 'Pasukan 2', photo: null },
    { id: 3, name: 'Anum Rismawati', ttl: 'Surabaya, 05 Mei 2008', role: 'Pasukan 3', photo: null },
    { id: 4, name: 'Dimas Aditya', ttl: 'Jakarta, 01 Oktober 2007', role: 'Danton', photo: null }, // Danton di Kolom 4 (Paling Kanan)
    { id: 5, name: 'Siti Khumairoh', ttl: 'Bekasi, 14 September 2008', role: 'Pasukan 4', photo: null },
    { id: 6, name: 'Siska Nur Aisah', ttl: 'Tangerang, 30 Oktober 2008', role: 'Pasukan 5', photo: null },
    { id: 7, name: 'Sarah Aqilah', ttl: 'Bogor, 08 Februari 2008', role: 'Pasukan 6', photo: null },
    { id: 8, name: 'Martyaloka Prabaswari W.', ttl: 'Depok, 17 April 2008', role: 'Pasukan 7', photo: null },
    { id: 9, name: 'Salsa Filla Silsila', ttl: 'Jakarta, 25 Juni 2008', role: 'Pasukan 8', photo: null },
    { id: 10, name: 'Ronadia Mingka', ttl: 'Bandung, 11 November 2008', role: 'Pasukan 9', photo: null },
    { id: 11, name: 'Dwi Lestari', ttl: 'Surabaya, 03 Desember 2008', role: 'Pasukan 10', photo: null },
    { id: 12, name: 'Aulia Rahma', ttl: 'Yogyakarta, 19 Januari 2008', role: 'Pasukan 11', photo: null },
    { id: 13, name: 'Nabila Putri', ttl: 'Malang, 27 Februari 2008', role: 'Pasukan 12', photo: null },
    { id: 14, name: 'Tiara Maharani', ttl: 'Solo, 09 Mei 2008', role: 'Pasukan 13', photo: null },
    { id: 15, name: 'Zahra Safitri', ttl: 'Cirebon, 16 Agustus 2008', role: 'Pasukan 14', photo: null },
    { id: 16, name: 'Najwa Amirahtus Solikha', ttl: 'Semarang, 22 Juli 2008', role: 'Pasukan 15', photo: null },
  ];

  const [members, setMembers] = useState(initialMembers);
  const [toastMessage, setToastMessage] = useState(null);
  const fileInputRefs = useRef({});

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handler Upload Dokumen
  const handleDocUpload = (docId, file) => {
    if (!file) return;
    const sizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              fileName: file.name,
              fileSize: sizeStr,
              uploadedAt: 'Baru saja diunggah',
              status: 'PENDING',
            }
          : doc
      )
    );
    showToast(`Dokumen "${file.name}" berhasil diunggah.`);
  };

  // Handler Hapus Dokumen
  const handleDocRemove = (docId) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              fileName: null,
              fileSize: null,
              uploadedAt: null,
              status: 'EMPTY',
            }
          : doc
      )
    );
    showToast('Dokumen telah dihapus.');
  };

  // Handler Update Data Anggota
  const handleMemberChange = (id, field, value) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  // Handler Upload Pas Foto Anggota
  const handlePhotoUpload = (id, file) => {
    if (!file) return;
    const photoUrl = URL.createObjectURL(file);
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, photo: photoUrl } : m))
    );
    showToast('Pas foto berhasil diperbarui.');
  };

  // Handler Tambah Anggota
  const handleAddMember = () => {
    const newId = members.length > 0 ? Math.max(...members.map((m) => m.id)) + 1 : 1;
    const newMember = {
      id: newId,
      name: '',
      ttl: '',
      role: `Pasukan ${newId}`,
      photo: null,
    };
    setMembers([...members, newMember]);
    showToast(`Slot anggota #${newId} berhasil ditambahkan.`);
  };

  // Handler Hapus Anggota
  const handleRemoveMember = (id) => {
    if (members.length <= 1) {
      alert('Minimal harus ada 1 anggota dalam kontingen.');
      return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== id));
    showToast('Anggota berhasil dihapus.');
  };

  // Handler Simpan Draft
  const handleSaveDraft = () => {
    showToast('Draft kelengkapan berkas dan data tim berhasil disimpan.');
  };

  // Handler Kirim Pendaftaran
  const handleSubmitAll = () => {
    const emptyNames = members.filter((m) => !m.name.trim());
    if (emptyNames.length > 0) {
      alert(`Mohon lengkapi nama untuk ${emptyNames.length} anggota sebelum mengajukan.`);
      return;
    }
    showToast('Semua berkas dan data kontingen berhasil diajukan ke panitia!');
  };

  // Render individual Member Card (Ukuran Pas & Compact, Pas Foto Merah + Field Nama & TTL)
  const renderMemberCard = (member, idx, isStartOfRow) => {
    const isDanton = member.role === 'Danton' || idx === 3;

    return (
      <div
        key={member.id}
        className="pasfoto-card"
        style={{
          border: isDanton ? '2px solid var(--pub-coral)' : '1px solid var(--pub-line)',
          borderRadius: '10px',
          backgroundColor: '#FFFFFF',
          padding: '0.65rem 0.55rem',
          boxShadow: isDanton ? '0 4px 12px rgba(201, 75, 60, 0.15)' : '0 2px 6px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          transition: 'all 0.15s ease',
          boxSizing: 'border-box',
          gridColumnStart: isStartOfRow ? 1 : 'auto',
        }}
      >
        {/* Header Nomor Urut & Tombol Hapus */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.45rem',
          }}
        >
          <span
            style={{
              fontSize: '0.625rem',
              fontWeight: 800,
              backgroundColor: isDanton ? 'var(--pub-coral)' : 'var(--pub-navy)',
              color: '#FFFFFF',
              padding: '1px 6px',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.02em',
            }}
          >
            {isDanton ? '★ DANTON' : `#${idx >= 3 ? idx : idx + 1}`}
          </span>

          <button
            type="button"
            onClick={() => handleRemoveMember(member.id)}
            title={`Hapus anggota #${idx + 1}`}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '1px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* KOTAK PAS FOTO DENGAN BACKGROUND MERAH (3:4 RATIO - UKURAN COMPACT) */}
        <div
          style={{
            width: '82px',
            height: '108px',
            backgroundColor: '#B91C1C',
            borderRadius: '5px',
            border: '1.5px solid #000000',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: '0.45rem',
            cursor: 'pointer',
          }}
          onClick={() => document.getElementById(`photo-input-${member.id}`).click()}
          title="Klik untuk upload/ganti pas foto"
        >
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name || `Anggota #${idx + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                backgroundColor: '#B91C1C',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid rgba(0, 0, 0, 0.2)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  marginBottom: '-5px',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B91C1C',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                }}
              >
                {member.name ? member.name.charAt(0) : idx + 1}
              </div>

              <div
                style={{
                  width: '60px',
                  height: '38px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px 24px 0 0',
                  border: '1.5px solid rgba(0, 0, 0, 0.15)',
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '22px',
                    backgroundColor: '#2563EB',
                    borderRadius: '0 0 3px 3px',
                    marginTop: '3px',
                  }}
                />
              </div>

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.45)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
              >
                <Camera size={16} />
                <span style={{ fontSize: '0.55rem', fontWeight: 700, marginTop: '2px' }}>
                  Upload
                </span>
              </div>
            </div>
          )}

          <input
            id={`photo-input-${member.id}`}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handlePhotoUpload(member.id, e.target.files[0]);
              }
            }}
          />
        </div>

        {/* Tombol Kamera Cepat */}
        <button
          type="button"
          onClick={() => document.getElementById(`photo-input-${member.id}`).click()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.625rem',
            color: 'var(--pub-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '0.45rem',
            padding: '1px 4px',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pub-coral)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pub-muted)')}
        >
          <Camera size={11} />
          <span>{member.photo ? 'Ganti Foto' : 'Unggah Foto'}</span>
        </button>

        {/* FIELD 1: NAMA ANGGOTA */}
        <div style={{ width: '100%', marginBottom: '0.35rem' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.625rem',
              fontWeight: 800,
              color: 'var(--pub-ink)',
              textTransform: 'uppercase',
              marginBottom: '0.15rem',
            }}
          >
            Nama Lengkap
          </label>
          <input
            type="text"
            value={member.name}
            onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
            placeholder="Nama anggota"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '0.28rem 0.45rem',
              fontSize: '0.725rem',
              fontWeight: 700,
              color: 'var(--pub-ink)',
              backgroundColor: 'var(--pub-canvas)',
              border: '1px solid var(--pub-line)',
              borderRadius: '5px',
              outline: 'none',
              height: '27px',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pub-coral)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pub-line)')}
          />
        </div>

        {/* FIELD 2: TTL */}
        <div style={{ width: '100%' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.625rem',
              fontWeight: 700,
              color: 'var(--pub-muted)',
              textTransform: 'uppercase',
              marginBottom: '0.15rem',
            }}
          >
            TTL
          </label>
          <input
            type="text"
            value={member.ttl}
            onChange={(e) => handleMemberChange(member.id, 'ttl', e.target.value)}
            placeholder="Jakarta, 12 Mei 2008"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '0.28rem 0.45rem',
              fontSize: '0.6875rem',
              color: 'var(--pub-muted)',
              backgroundColor: 'var(--pub-canvas)',
              border: '1px solid var(--pub-line)',
              borderRadius: '5px',
              outline: 'none',
              height: '27px',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pub-coral)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pub-line)')}
          />
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1100px', margin: '0 auto', fontFamily: 'var(--font-sans)', paddingBottom: '3rem' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0F172A',
            color: '#F8FAFC',
            padding: '0.85rem 1.4rem',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            zIndex: 9999,
            borderLeft: '4px solid var(--pub-teal)',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} color="var(--pub-teal)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner Halaman */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.75rem 2rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span
              style={{
                backgroundColor: 'rgba(201, 75, 60, 0.12)',
                color: 'var(--pub-coral)',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.725rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              FORMULIR KONTINGEN
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', fontFamily: 'var(--font-mono)' }}>
              LKBB NASIONAL 2026
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.65rem',
              fontWeight: 800,
              color: 'var(--pub-ink)',
              margin: '0 0 0.35rem 0',
            }}
          >
            Data Tim & Kelengkapan Berkas
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--pub-muted)', margin: 0, maxWidth: '650px' }}>
            Lengkapi 3 berkas wajib yang ditentukan oleh Admin Panitia dan lengkapi data biodata 16 anggota pasukan beserta pas foto resmi.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handleSaveDraft}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1.15rem',
              backgroundColor: 'var(--pub-canvas)',
              color: 'var(--pub-ink)',
              border: '1px solid var(--pub-line)',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Save size={16} />
            <span>Simpan Draft</span>
          </button>
          <button
            onClick={handleSubmitAll}
            className="pub-btn-coral"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.35rem',
              fontSize: '0.85rem',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Send size={16} />
            <span>Submit Berkas Tim</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* BAGIAN ATAS: DOKUMEN PERSYARATAN (3 FILE DUMMY SESUAI SETTING ADMIN)   */}
      {/* ===================================================================== */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.75rem 2rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--pub-line)', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={20} color="var(--pub-coral)" />
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: 'var(--pub-ink)',
                  margin: 0,
                }}
              >
                1. Dokumen Persyaratan Lomba
              </h2>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', margin: '0.25rem 0 0 1.75rem' }}>
              Daftar dokumen yang disyaratkan oleh Admin Panitia. Format berkas yang didukung: <strong>PDF</strong> atau <strong>Word (.doc, .docx)</strong>.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              backgroundColor: 'rgba(5, 150, 105, 0.1)',
              color: 'var(--pub-teal)',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontWeight: 700,
            }}
          >
            <ShieldCheck size={14} />
            <span>3 Berkas Wajib Diunggah</span>
          </div>
        </div>

        {/* List 3 Dokumen */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {documents.map((doc, idx) => {
            const hasFile = doc.fileName && doc.status !== 'EMPTY';

            return (
              <div
                key={doc.id}
                style={{
                  border: '1px solid var(--pub-line)',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                  backgroundColor: hasFile ? 'var(--pub-canvas)' : '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  transition: 'border-color 0.2s',
                }}
              >
                {/* Info Dokumen */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1, minWidth: '280px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: hasFile ? 'rgba(5, 150, 105, 0.12)' : 'rgba(201, 75, 60, 0.1)',
                      color: hasFile ? 'var(--pub-teal)' : 'var(--pub-coral)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '0.15rem',
                    }}
                  >
                    <FileText size={22} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--pub-muted)', fontFamily: 'var(--font-mono)' }}>
                        #{idx + 1}
                      </span>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                        {doc.title}
                      </h3>
                      {doc.required && (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            color: '#DC2626',
                            backgroundColor: '#FEE2E2',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                          }}
                        >
                          Wajib
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: '0.25rem 0 0.5rem 0' }}>
                      {doc.description}
                    </p>

                    {/* Metadata File Terunggah atau Format Didukung */}
                    {hasFile ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
                        <span style={{ color: 'var(--pub-ink)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          📄 {doc.fileName}
                        </span>
                        <span style={{ color: 'var(--pub-muted)' }}>· {doc.fileSize}</span>
                        <span style={{ color: 'var(--pub-muted)' }}>· Diunggah: {doc.uploadedAt}</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.725rem', color: 'var(--pub-muted)' }}>
                        Format diterima: <span style={{ fontWeight: 600, color: 'var(--pub-ink)' }}>{doc.allowedFormats}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badge & Aksi Unggah */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {/* Status Badge */}
                  {doc.status === 'VERIFIED' && (
                    <span
                      style={{
                        backgroundColor: 'var(--pub-teal-light)',
                        color: 'var(--pub-teal)',
                        padding: '0.3rem 0.75rem',
                        borderRadius: 'var(--pub-radius-pill)',
                        fontSize: '0.725rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <CheckCircle2 size={13} />
                      TERVERIFIKASI
                    </span>
                  )}
                  {doc.status === 'PENDING' && (
                    <span
                      style={{
                        backgroundColor: 'rgba(217, 119, 6, 0.15)',
                        color: '#B45309',
                        padding: '0.3rem 0.75rem',
                        borderRadius: 'var(--pub-radius-pill)',
                        fontSize: '0.725rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      MENUNGGU VALIDASI
                    </span>
                  )}
                  {doc.status === 'EMPTY' && (
                    <span
                      style={{
                        backgroundColor: '#F1F5F9',
                        color: '#64748B',
                        padding: '0.3rem 0.75rem',
                        borderRadius: 'var(--pub-radius-pill)',
                        fontSize: '0.725rem',
                        fontWeight: 700,
                      }}
                    >
                      BELUM DIUNGGAH
                    </span>
                  )}

                  {/* Tombol Unduh Template jika ada */}
                  {doc.hasTemplate && (
                    <button
                      type="button"
                      onClick={() => showToast('Mengunduh template formulir pendaftaran (.DOCX)...')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.75rem',
                        padding: '0.4rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid var(--pub-line)',
                        backgroundColor: '#FFFFFF',
                        color: 'var(--pub-ink)',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      <Download size={13} />
                      <span>Template</span>
                    </button>
                  )}

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={(el) => (fileInputRefs.current[doc.id] = el)}
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleDocUpload(doc.id, e.target.files[0]);
                      }
                    }}
                  />

                  {/* Upload / Ganti File Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[doc.id]?.click()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.775rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      border: '1px solid var(--pub-coral)',
                      backgroundColor: hasFile ? '#FFFFFF' : 'var(--pub-coral)',
                      color: hasFile ? 'var(--pub-coral)' : '#FFFFFF',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    <Upload size={14} />
                    <span>{hasFile ? 'Ganti File' : 'Unggah Berkas'}</span>
                  </button>

                  {/* Hapus File jika ada */}
                  {hasFile && (
                    <button
                      type="button"
                      onClick={() => handleDocRemove(doc.id)}
                      title="Hapus berkas ini"
                      style={{
                        padding: '0.45rem',
                        borderRadius: '6px',
                        border: '1px solid #FECACA',
                        backgroundColor: '#FEF2F2',
                        color: '#EF4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* BAGIAN BAWAH: DATA TIM (16 KOTAK PAS FOTO MERAH + FIELD NAMA & TTL)    */}
      {/* ===================================================================== */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.75rem 2rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        {/* Header Bagian Data Tim */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--pub-line)', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} color="var(--pub-coral)" />
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: 'var(--pub-ink)',
                  margin: 0,
                }}
              >
                2. Data Pasukan Kontingen (Pas Foto & Biodata)
              </h2>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', margin: '0.25rem 0 0 1.75rem' }}>
              Susun daftar 16 anggota pasukan kontingen (1 Danton + 15 Pasukan). Unggah pas foto resmi <strong>berlatar belakang merah</strong>, dan lengkapi nama serta Tempat & Tanggal Lahir (TTL).
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: 'var(--pub-coral)',
                backgroundColor: 'rgba(201, 75, 60, 0.1)',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {members.length} Anggota Terdaftar
            </span>

            {/* Tombol Tambah Anggota */}
            <button
              type="button"
              onClick={handleAddMember}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                backgroundColor: 'var(--pub-teal)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)',
              }}
            >
              <Plus size={15} />
              <span>Tambah Anggota</span>
            </button>
          </div>
        </div>

        {/* Style tag untuk layout formasi pas foto: Kolom 1-4 sejajar, ukuran compact */}
        <style>{`
          .pasfoto-formation-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 155px));
            gap: 0.85rem;
            max-width: 680px;
            margin: 0 auto;
            justify-content: center;
          }
          @media (max-width: 720px) {
            .pasfoto-formation-grid {
              grid-template-columns: repeat(2, minmax(0, 160px));
              justify-content: center;
            }
            .pasfoto-card {
              grid-column-start: auto !important;
            }
          }
          @media (max-width: 380px) {
            .pasfoto-formation-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>

        {/* Grid Pas Foto Formasi Sesuai Gambar: Baris 1 (4 kotak), Baris 2 s.d. 5 (3 kotak sejajar kolom 1, 2, 3) */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '0.5rem 0' }}>
          <div className="pasfoto-formation-grid">
            {members.map((member, idx) => {
              // Baris 1: idx 0, 1, 2, 3 (4 kotak mengisi col 1, 2, 3, 4)
              // Baris 2 s.d. 5: idx 4, 7, 10, 13 mulai di kolom 1, menyisakan kolom ke-4 kosong
              const isStartOfThreeRow = idx >= 4 && (idx - 4) % 3 === 0;
              return renderMemberCard(member, idx, isStartOfThreeRow);
            })}
          </div>
        </div>

        {/* Footer Aksi Bawah */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--pub-line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--pub-muted)' }}>
            Total <strong>{members.length}</strong> anggota terdaftar. Pasukan standar lomba LKBB adalah 16 orang.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleAddMember}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                padding: '0.6rem 1.15rem',
                borderRadius: '8px',
                backgroundColor: 'var(--pub-canvas)',
                color: 'var(--pub-ink)',
                border: '1px solid var(--pub-line)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              <span>Tambah Kotak Anggota</span>
            </button>
            <button
              type="button"
              onClick={handleSubmitAll}
              className="pub-btn-coral"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                padding: '0.6rem 1.4rem',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Send size={16} />
              <span>Kirim Data Tim & Berkas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

