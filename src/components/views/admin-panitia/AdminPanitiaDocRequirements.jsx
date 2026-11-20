import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileCheck,
  X,
  Save,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
} from 'lucide-react';

const STORAGE_KEY_REQUIREMENTS = 'kompas_panitia_doc_requirements';

const DEFAULT_REQUIREMENTS = [
  {
    id: 'req-doc-1',
    eventId: 'evt-lkbb-2026',
    title: 'File Kartu Pelajar (Kolektif Anggota)',
    description: 'Scan kartu pelajar resmi dari seluruh 16 anggota pasukan dalam 1 file PDF atau Word.',
    isRequired: true,
    allowedFormats: 'PDF, DOC, DOCX',
    maxSizeMb: 10,
    templateUrl: null,
    templateName: null,
    orderIndex: 1,
  },
  {
    id: 'req-doc-2',
    eventId: 'evt-lkbb-2026',
    title: 'File Surat Rekomendasi / Pengantar Sekolah',
    description: 'Surat tugas dan rekomendasi resmi dari Kepala Sekolah berstempel basah.',
    isRequired: true,
    allowedFormats: 'PDF, DOC, DOCX',
    maxSizeMb: 10,
    templateUrl: null,
    templateName: null,
    orderIndex: 2,
  },
  {
    id: 'req-doc-3',
    eventId: 'evt-lkbb-2026',
    title: 'Formulir Pendaftaran & Pakta Integritas Kontingen',
    description: 'Formulir biodata kontingen lengkap dan pakta integritas bermeterai 10.000.',
    isRequired: true,
    allowedFormats: 'PDF, DOC, DOCX',
    maxSizeMb: 10,
    templateUrl: '/templates/Formulir_Pendaftaran_Pakta_Integritas_2026.docx',
    templateName: 'Formulir_Pendaftaran_Pakta_Integritas_2026.docx',
    orderIndex: 3,
  },
];

export default function AdminPanitiaDocRequirements({ eventId = 'evt-lkbb-2026' }) {
  const [requirements, setRequirements] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_REQUIREMENTS}_${eventId}`);
      if (saved) return JSON.parse(saved);
      const generalSaved = localStorage.getItem(STORAGE_KEY_REQUIREMENTS);
      return generalSaved ? JSON.parse(generalSaved) : DEFAULT_REQUIREMENTS;
    } catch {
      return DEFAULT_REQUIREMENTS;
    }
  });

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIsRequired, setFormIsRequired] = useState(true);
  const [formAllowedFormats, setFormAllowedFormats] = useState('PDF, DOC, DOCX');
  const [formMaxSizeMb, setFormMaxSizeMb] = useState(10);
  const [formTemplateName, setFormTemplateName] = useState('');
  const [formTemplateUrl, setFormTemplateUrl] = useState('');
  const templateFileInputRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch dari Backend API saat pertama kali atau eventId berubah
  useEffect(() => {
    const fetchRequirements = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/panitia/document-requirements?eventId=${eventId}`, { credentials: 'include' });
        const data = await res.json();
        if (data.success && Array.isArray(data.requirements) && data.requirements.length > 0) {
          setRequirements(data.requirements);
          localStorage.setItem(`${STORAGE_KEY_REQUIREMENTS}_${eventId}`, JSON.stringify(data.requirements));
          localStorage.setItem(STORAGE_KEY_REQUIREMENTS, JSON.stringify(data.requirements));
        }
      } catch (err) {
        console.warn('Menggunakan fallback data lokal requirements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, [eventId]);

  // Simpan data ke localStorage dan broadcast custom event
  const persistRequirements = (updatedList) => {
    setRequirements(updatedList);
    try {
      localStorage.setItem(`${STORAGE_KEY_REQUIREMENTS}_${eventId}`, JSON.stringify(updatedList));
      localStorage.setItem(STORAGE_KEY_REQUIREMENTS, JSON.stringify(updatedList));
      window.dispatchEvent(
        new CustomEvent('kompas_document_requirements_updated', {
          detail: { eventId, requirements: updatedList },
        })
      );
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  };

  // Buka Modal Tambah
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormDescription('');
    setFormIsRequired(true);
    setFormAllowedFormats('PDF, DOC, DOCX');
    setFormMaxSizeMb(10);
    setFormTemplateName('');
    setFormTemplateUrl('');
    setIsModalOpen(true);
  };

  // Buka Modal Edit
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormDescription(item.description || '');
    setFormIsRequired(item.isRequired);
    setFormAllowedFormats(item.allowedFormats || 'PDF, DOC, DOCX');
    setFormMaxSizeMb(item.maxSizeMb || 10);
    setFormTemplateName(item.templateName || '');
    setFormTemplateUrl(item.templateUrl || '');
    setIsModalOpen(true);
  };

  // Upload file template via form
  const handleTemplateFileUpload = (file) => {
    if (!file) return;
    const fakeUrl = `/templates/${file.name}`;
    setFormTemplateName(file.name);
    setFormTemplateUrl(fakeUrl);
    showToast(`Template "${file.name}" siap dilampirkan.`);
  };

  // Simpan Form (Tambah / Edit)
  const handleSaveForm = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Judul persyaratan dokumen wajib diisi!');
      return;
    }

    const payload = {
      eventId,
      title: formTitle.trim(),
      description: formDescription.trim(),
      isRequired: formIsRequired,
      allowedFormats: formAllowedFormats.trim(),
      maxSizeMb: Number(formMaxSizeMb) || 10,
      templateName: formTemplateName || null,
      templateUrl: formTemplateUrl || null,
    };

    if (editingItem) {
      // Edit mode
      const updatedList = requirements.map((item) =>
        item.id === editingItem.id ? { ...item, ...payload, updatedAt: new Date().toISOString() } : item
      );
      persistRequirements(updatedList);

      // Async panggil backend
      try {
        await fetch(`/api/panitia/document-requirements/${editingItem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.warn('Backend sync failed, state preserved locally:', err);
      }

      showToast(`Persyaratan "${payload.title}" berhasil diperbarui.`);
    } else {
      // Add mode
      const newId = `req-doc-${Date.now()}`;
      const newItem = {
        id: newId,
        ...payload,
        orderIndex: requirements.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedList = [...requirements, newItem];
      persistRequirements(updatedList);

      // Async panggil backend
      try {
        await fetch('/api/panitia/document-requirements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.warn('Backend sync failed, state preserved locally:', err);
      }

      showToast(`Persyaratan "${payload.title}" berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
  };

  // Hapus Persyaratan
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus persyaratan berkas "${title}"? Peserta tidak akan diminta mengunggah berkas ini lagi.`)) {
      return;
    }

    const updatedList = requirements.filter((item) => item.id !== id);
    persistRequirements(updatedList);

    try {
      await fetch(`/api/panitia/document-requirements/${id}?eventId=${eventId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (err) {
      console.warn('Backend delete sync failed, state preserved locally:', err);
    }

    showToast(`Persyaratan berkas "${title}" telah dihapus.`);
  };

  // Hitung Metrik
  const totalReqs = requirements.length;
  const totalRequired = requirements.filter((r) => r.isRequired).length;
  const totalTemplates = requirements.filter((r) => r.templateUrl || r.templateName).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'var(--font-sans)' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0F172A',
            color: '#F8FAFC',
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            zIndex: 99999,
          }}
        >
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Seksi & Tombol Tambah */}
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
                backgroundColor: 'rgba(201, 75, 60, 0.1)',
                color: 'var(--pub-coral)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--pub-radius-pill)',
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Ketentuan Pendaftaran Lomba
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>· Event ID: {eventId}</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
            Konfigurasi Berkas Persyaratan Kontingen
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: '0.25rem 0 0 0', maxWidth: '680px', lineHeight: 1.5 }}>
            Tentukan dokumen apa saja yang wajib maupun opsional diunggah oleh setiap kontingen pendaftar.
            Dokumen yang diatur di sini akan otomatis tampil pada formulir unggah berkas portal peserta.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="pub-btn-coral"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.65rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(201, 75, 60, 0.25)',
          }}
        >
          <Plus size={16} />
          <span>Tambah Dokumen Persyaratan</span>
        </button>
      </div>

      {/* 3 Metric Card Ringkasan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div
          style={{
            backgroundColor: 'var(--pub-surface)',
            borderRadius: '12px',
            padding: '1.15rem 1.35rem',
            border: '1px solid var(--pub-line)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: 'rgba(13, 92, 117, 0.1)',
              color: 'var(--pub-teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
            }}
          >
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
              Total Persyaratan
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--pub-ink)', marginTop: '0.1rem' }}>
              {totalReqs} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--pub-muted)' }}>Berkas</span>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--pub-surface)',
            borderRadius: '12px',
            padding: '1.15rem 1.35rem',
            border: '1px solid var(--pub-line)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: 'rgba(201, 75, 60, 0.1)',
              color: 'var(--pub-coral)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
            }}
          >
            <AlertCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
              Berkas Wajib
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--pub-coral)', marginTop: '0.1rem' }}>
              {totalRequired} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--pub-muted)' }}>Dokumen</span>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--pub-surface)',
            borderRadius: '12px',
            padding: '1.15rem 1.35rem',
            border: '1px solid var(--pub-line)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: 'rgba(5, 150, 105, 0.1)',
              color: 'var(--pub-teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
            }}
          >
            <Download size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
              Template Blanko
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--pub-ink)', marginTop: '0.1rem' }}>
              {totalTemplates} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--pub-muted)' }}>Tersedia</span>
            </div>
          </div>
        </div>
      </div>

      {/* List Kartu Persyaratan Berkas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {requirements.length === 0 ? (
          <div
            style={{
              backgroundColor: 'var(--pub-surface)',
              borderRadius: '12px',
              padding: '3rem 2rem',
              textAlign: 'center',
              border: '2px dashed var(--pub-line)',
            }}
          >
            <FileText size={42} style={{ color: 'var(--pub-muted)', margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
              Belum Ada Persyaratan Berkas
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: '0.35rem 0 1.25rem 0' }}>
              Silakan klik tombol di bawah untuk menentukan berkas apa saja yang wajib dikirimkan oleh peserta.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="pub-btn-coral"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.6rem 1.15rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              <span>Tambah Dokumen Pertama</span>
            </button>
          </div>
        ) : (
          requirements.map((req, idx) => (
            <div
              key={req.id || idx}
              style={{
                backgroundColor: 'var(--pub-surface)',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                border: '1px solid var(--pub-line)',
                boxShadow: 'var(--pub-shadow-card)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1, minWidth: '280px' }}>
                {/* Badge Nomor Urut */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--pub-canvas)',
                    border: '1px solid var(--pub-line)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.825rem',
                    color: 'var(--pub-ink)',
                    flexShrink: 0,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  #{idx + 1}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                      {req.title}
                    </h3>

                    {/* Status Badge: Wajib / Opsional */}
                    {req.isRequired ? (
                      <span
                        style={{
                          backgroundColor: 'rgba(201, 75, 60, 0.12)',
                          color: 'var(--pub-coral)',
                          padding: '0.15rem 0.55rem',
                          borderRadius: 'var(--pub-radius-pill)',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                        }}
                      >
                        WAJIB
                      </span>
                    ) : (
                      <span
                        style={{
                          backgroundColor: '#F1F5F9',
                          color: '#64748B',
                          padding: '0.15rem 0.55rem',
                          borderRadius: 'var(--pub-radius-pill)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                        }}
                      >
                        OPSIONAL
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--pub-muted)', margin: 0, lineHeight: 1.45 }}>
                    {req.description || 'Tidak ada petunjuk khusus.'}
                  </p>

                  {/* Format & Ukuran Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', marginTop: '0.65rem', fontSize: '0.725rem', color: 'var(--pub-ink-soft)' }}>
                    <span>
                      Format Diterima: <strong style={{ color: 'var(--pub-ink)' }}>{req.allowedFormats}</strong>
                    </span>
                    <span style={{ color: 'var(--pub-line)' }}>•</span>
                    <span>
                      Batas Ukuran: <strong style={{ color: 'var(--pub-ink)' }}>Maks. {req.maxSizeMb} MB</strong>
                    </span>
                  </div>

                  {/* Template Lampiran jika ada */}
                  {req.templateName && (
                    <div
                      style={{
                        marginTop: '0.75rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid var(--pub-line)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        fontSize: '0.75rem',
                      }}
                    >
                      <span style={{ color: 'var(--pub-teal)', fontWeight: 700 }}>📄 Template Disediakan:</span>
                      <span style={{ color: 'var(--pub-ink)', fontWeight: 600 }}>{req.templateName}</span>
                      <button
                        type="button"
                        onClick={() => showToast(`Mengunduh berkas template "${req.templateName}"...`)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--pub-teal)',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.725rem',
                          textDecoration: 'underline',
                          padding: 0,
                        }}
                      >
                        Unduh
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tombol Aksi: Edit & Hapus */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(req)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--pub-ink)',
                    cursor: 'pointer',
                  }}
                  title="Edit ketentuan dokumen ini"
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(req.id, req.title)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.4rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid #FECACA',
                    backgroundColor: '#FEF2F2',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#DC2626',
                    cursor: 'pointer',
                  }}
                  title="Hapus dokumen persyaratan ini"
                >
                  <Trash2 size={13} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL FORM: TAMBAH / EDIT PERSYARATAN BERKAS                   */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem',
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--pub-line)',
              padding: '1.75rem',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--pub-line)',
                paddingBottom: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                  {editingItem ? 'Edit Dokumen Persyaratan' : 'Tambah Dokumen Persyaratan Baru'}
                </h3>
                <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: '0.15rem 0 0 0' }}>
                  Atur spesifikasi berkas pendaftaran yang wajib diunggah oleh peserta.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '0.4rem',
                  borderRadius: '6px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSaveForm} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Field 1: Judul Berkas */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Nama / Judul Berkas <span style={{ color: 'var(--pub-coral)' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Bukti Pembayaran Registrasi / Slip Transfer"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    fontSize: '0.825rem',
                    borderRadius: '8px',
                    border: '1px solid var(--pub-line)',
                    outline: 'none',
                    backgroundColor: 'var(--pub-canvas)',
                  }}
                />
              </div>

              {/* Field 2: Deskripsi & Instruksi */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Deskripsi / Petunjuk Pengisian untuk Peserta
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Contoh: Bukti transfer pembayaran biaya registrasi resmi ke rekening panitia. Pastikan tanggal dan nominal terbaca jelas."
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    fontSize: '0.825rem',
                    borderRadius: '8px',
                    border: '1px solid var(--pub-line)',
                    outline: 'none',
                    backgroundColor: 'var(--pub-canvas)',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Field 3: Status Kewajiban (Wajib vs Opsional) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.45rem' }}>
                  Sifat Kewajiban Berkas
                </label>
                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <label
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      border: formIsRequired ? '1.5px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                      backgroundColor: formIsRequired ? 'rgba(201, 75, 60, 0.05)' : '#FFFFFF',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="isRequired"
                      checked={formIsRequired}
                      onChange={() => setFormIsRequired(true)}
                    />
                    <div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: formIsRequired ? 'var(--pub-coral)' : 'var(--pub-ink)' }}>
                        Wajib Diunggah
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--pub-muted)' }}>
                        Harus lengkap agar lolos validasi
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      border: !formIsRequired ? '1.5px solid var(--pub-teal)' : '1px solid var(--pub-line)',
                      backgroundColor: !formIsRequired ? 'rgba(13, 92, 117, 0.05)' : '#FFFFFF',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="isRequired"
                      checked={!formIsRequired}
                      onChange={() => setFormIsRequired(false)}
                    />
                    <div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: !formIsRequired ? 'var(--pub-teal)' : 'var(--pub-ink)' }}>
                        Opsional
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--pub-muted)' }}>
                        Sebagai dokumen pelengkap
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Field 4 & 5: Format & Batas Ukuran */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                    Format Diizinkan
                  </label>
                  <input
                    type="text"
                    value={formAllowedFormats}
                    onChange={(e) => setFormAllowedFormats(e.target.value)}
                    placeholder="Contoh: PDF, DOC, DOCX"
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      fontSize: '0.825rem',
                      borderRadius: '8px',
                      border: '1px solid var(--pub-line)',
                      outline: 'none',
                      backgroundColor: 'var(--pub-canvas)',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                    Ukuran Maksimal
                  </label>
                  <select
                    value={formMaxSizeMb}
                    onChange={(e) => setFormMaxSizeMb(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      fontSize: '0.825rem',
                      borderRadius: '8px',
                      border: '1px solid var(--pub-line)',
                      outline: 'none',
                      backgroundColor: 'var(--pub-canvas)',
                      cursor: 'pointer',
                    }}
                  >
                    <option value={5}>5 Megabyte (MB)</option>
                    <option value={10}>10 Megabyte (MB)</option>
                    <option value={15}>15 Megabyte (MB)</option>
                    <option value={20}>20 Megabyte (MB)</option>
                  </select>
                </div>
              </div>

              {/* Field 6: Upload Template Unduhan (Opsional) */}
              <div
                style={{
                  border: '1px dashed var(--pub-line)',
                  borderRadius: '10px',
                  padding: '1rem',
                  backgroundColor: '#F8FAFC',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
                    Lampiran Template Blanko (Opsional)
                  </label>
                  {formTemplateName && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormTemplateName('');
                        setFormTemplateUrl('');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#DC2626',
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Hapus Template
                    </button>
                  )}
                </div>

                <p style={{ fontSize: '0.725rem', color: 'var(--pub-muted)', margin: '0 0 0.75rem 0' }}>
                  Jika panitia memiliki format template baku (misal: format formulir pendaftaran Word / PDF), lampirkan di sini agar peserta dapat mengunduh langsung.
                </p>

                {formTemplateName ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--pub-line)',
                    }}
                  >
                    <FileCheck size={18} color="var(--pub-teal)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pub-ink)', flex: 1 }}>
                      {formTemplateName}
                    </span>
                    <button
                      type="button"
                      onClick={() => templateFileInputRef.current?.click()}
                      style={{
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        color: 'var(--pub-coral)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Ganti
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => templateFileInputRef.current?.click()}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      border: '1px dashed var(--pub-line)',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--pub-ink-soft)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                    }}
                  >
                    <Upload size={14} />
                    <span>Pilih Berkas Template (.DOCX / .PDF)</span>
                  </button>
                )}

                <input
                  type="file"
                  ref={templateFileInputRef}
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleTemplateFileUpload(e.target.files[0]);
                    }
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.55rem 1.15rem',
                    borderRadius: '8px',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--pub-ink)',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="pub-btn-coral"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 1.35rem',
                    borderRadius: '8px',
                    fontSize: '0.825rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  <Save size={14} />
                  <span>{editingItem ? 'Simpan Perubahan' : 'Tambahkan Persyaratan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

