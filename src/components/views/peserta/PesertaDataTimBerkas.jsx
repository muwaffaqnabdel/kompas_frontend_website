import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  Plus,
  Download,
  Save,
  Send,
  User,
  AlertCircle,
  Loader2,
  Users,
  ExternalLink,
  CheckSquare,
  Square,
  Calendar,
  X,
} from 'lucide-react';

const ROLE_OPTIONS = ['DANTON', 'PASUKAN', 'CADANGAN', 'OFFICIAL'];

export default function PesertaDataTimBerkas({
  activeRegistration,
  profileData,
  onRegistrationUpdated,
  onGoToEvents,
  onGoToProfile,
}) {
  const [members, setMembers] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [uploadingReqId, setUploadingReqId] = useState(null);
  const [savingTeam, setSavingTeam] = useState(false);
  const [submittingAll, setSubmittingAll] = useState(false);
  const [toast, setToast] = useState(null);
  const [showProfilePicker, setShowProfilePicker] = useState(false);
  const [pickerSelectedIds, setPickerSelectedIds] = useState(new Set());
  const fileInputRefs = useRef({});

  useEffect(() => {
    if (activeRegistration) {
      setTeamName(activeRegistration.teamName || '');
      setSchoolName(activeRegistration.schoolName || '');
      setMembers(
        (activeRegistration.members || []).map((m, idx) => ({
          id: m.id || `m-${idx}`,
          sourceMemberId: m.sourceMemberId || null,
          fullName: m.fullName || '',
          ttl: m.ttl || '',
          nisn: m.nisn || '',
          roleInTeam: m.roleInTeam || 'PASUKAN',
          photoUrl: m.photoUrl || null,
        }))
      );
    }
  }, [activeRegistration]);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  if (!activeRegistration) {
    return (
      <div
        style={{
          maxWidth: '760px',
          margin: '2rem auto',
          backgroundColor: 'var(--pub-surface)',
          borderRadius: '18px',
          border: '1px solid var(--pub-line)',
          padding: '2.5rem 1.75rem',
          textAlign: 'center',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <Calendar size={34} color="var(--pub-coral)" style={{ marginBottom: '0.75rem' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0 0 0.45rem 0' }}>
          Belum Ada Event yang Didaftarkan
        </h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--pub-muted)', maxWidth: '480px', margin: '0 auto 1.35rem auto', lineHeight: 1.55 }}>
          Silakan pilih event pada menu <strong>Event</strong> untuk mendaftarkan tim Anda. Lengkapi <strong>Profil Kontingen</strong> terlebih dahulu agar pas foto anggota otomatis terisi.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onGoToProfile}
            style={{
              padding: '0.65rem 1.15rem',
              borderRadius: '10px',
              border: '1px solid var(--pub-line)',
              backgroundColor: 'var(--pub-canvas)',
              color: 'var(--pub-ink)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Lengkapi Profil Kontingen
          </button>
          <button
            type="button"
            onClick={onGoToEvents}
            className="pub-btn-coral"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Cari & Daftar Event →
          </button>
        </div>
      </div>
    );
  }

  const documents = Array.isArray(activeRegistration.documents) ? activeRegistration.documents : [];
  const profileMembers = Array.isArray(profileData?.members) ? profileData.members : [];

  const handleDocUpload = async (docReq, file) => {
    if (!file) return;
    setUploadingReqId(docReq.requirementId);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('requirementId', docReq.requirementId);
      fd.append('docType', docReq.title);

      const res = await fetch(
        `/api/peserta/registrations/${encodeURIComponent(activeRegistration.id)}/documents`,
        {
          method: 'POST',
          credentials: 'include',
          body: fd,
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal mengunggah berkas.');
      }
      showToast('success', `Berkas "${file.name}" berhasil diunggah.`);
      onRegistrationUpdated && onRegistrationUpdated(data.registration);
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setUploadingReqId(null);
    }
  };

  const handleDocDelete = async (docReq) => {
    if (!docReq.documentId) return;
    if (!window.confirm(`Hapus berkas "${docReq.fileName}"?`)) return;
    setUploadingReqId(docReq.requirementId);
    try {
      const res = await fetch(
        `/api/peserta/registrations/${encodeURIComponent(activeRegistration.id)}/documents?documentId=${encodeURIComponent(docReq.documentId)}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menghapus berkas.');
      }
      showToast('success', 'Berkas telah dihapus.');
      onRegistrationUpdated && onRegistrationUpdated(data.registration);
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setUploadingReqId(null);
    }
  };

  const handleMemberFieldChange = (idx, field, val) => {
    setMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, [field]: val } : m)));
  };

  const handleRemoveMember = (idx) => {
    setMembers((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddManualMember = () => {
    setMembers((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        sourceMemberId: null,
        fullName: '',
        ttl: '',
        nisn: '',
        roleInTeam: 'PASUKAN',
        photoUrl: null,
      },
    ]);
  };

  const openProfilePicker = () => {
    const existingSourceIds = new Set(members.map((m) => m.sourceMemberId).filter(Boolean));
    setPickerSelectedIds(existingSourceIds);
    setShowProfilePicker(true);
  };

  const togglePickerMember = (memberId) => {
    setPickerSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) next.delete(memberId);
      else next.add(memberId);
      return next;
    });
  };

  const applyProfilePicker = () => {
    // Pertahankan anggota manual (tanpa sourceMemberId) + anggota terpilih dari Bank Profil
    const manualMembers = members.filter((m) => !m.sourceMemberId);
    const existingBySource = new Map(
      members.filter((m) => m.sourceMemberId).map((m) => [m.sourceMemberId, m])
    );

    const syncedFromProfile = profileMembers
      .filter((pm) => pickerSelectedIds.has(pm.id))
      .map((pm) => {
        const prev = existingBySource.get(pm.id);
        return {
          id: prev?.id || `prof-${pm.id}`,
          sourceMemberId: pm.id,
          fullName: pm.fullName,
          ttl: pm.ttl || '',
          nisn: pm.nisn || '',
          roleInTeam: prev?.roleInTeam || pm.defaultRole || 'PASUKAN',
          photoUrl: pm.photoUrl || null,
        };
      });

    setMembers([...syncedFromProfile, ...manualMembers]);
    setShowProfilePicker(false);
    showToast('success', `${syncedFromProfile.length} anggota dari Profil Kontingen disinkronkan. Jangan lupa klik Simpan.`);
  };

  const saveTeamChanges = async (targetStatus = null) => {
    const validMembers = members.filter((m) => String(m.fullName || '').trim() !== '');
    if (targetStatus === 'SUBMITTED' && validMembers.length === 0) {
      showToast('error', 'Tambahkan minimal 1 anggota pasukan sebelum mengajukan pendaftaran.');
      return;
    }

    if (targetStatus === 'SUBMITTED') setSubmittingAll(true);
    else setSavingTeam(true);

    try {
      const res = await fetch(`/api/peserta/registrations/${encodeURIComponent(activeRegistration.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          teamName: teamName.trim(),
          schoolName: schoolName.trim(),
          ...(targetStatus ? { status: targetStatus } : {}),
          members: validMembers.map((m) => ({
            sourceMemberId: m.sourceMemberId,
            fullName: m.fullName.trim(),
            ttl: m.ttl,
            nisn: m.nisn,
            roleInTeam: m.roleInTeam,
            photoUrl: m.photoUrl,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menyimpan perubahan tim.');
      }
      showToast('success', data.message);
      onRegistrationUpdated && onRegistrationUpdated(data.registration);
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSavingTeam(false);
      setSubmittingAll(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1080px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
            backgroundColor: toast.type === 'error' ? '#FEF2F2' : '#ECFDF5',
            border: `1px solid ${toast.type === 'error' ? '#FCA5A5' : '#6EE7B7'}`,
            color: toast.type === 'error' ? '#991B1B' : '#065F46',
            padding: '0.8rem 1.1rem',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.14)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.84rem',
            fontWeight: 700,
          }}
        >
          {toast.type === 'error' ? <AlertCircle size={17} /> : <CheckCircle2 size={17} />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Section 1: Berkas Persyaratan Khusus Event */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <FileText size={18} color="var(--pub-coral)" />
              <span>1. Berkas Persyaratan Event — {activeRegistration.eventName}</span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
              Unggah berkas khusus yang diminta oleh panitia event ini (Surat Tugas, Formulir Event, Bukti Transfer, dll.).
            </p>
          </div>
          <span
            style={{
              backgroundColor: activeRegistration.status === 'VALIDATED' ? '#ECFDF5' : '#EFF6FF',
              color: activeRegistration.status === 'VALIDATED' ? '#047857' : '#1D4ED8',
              border: `1px solid ${activeRegistration.status === 'VALIDATED' ? '#A7F3D0' : '#BFDBFE'}`,
              padding: '0.25rem 0.7rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 800,
            }}
          >
            STATUS TIM: {activeRegistration.status}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {documents.map((doc) => {
            const isUploading = uploadingReqId === doc.requirementId;
            return (
              <div
                key={doc.requirementId}
                style={{
                  border: doc.status === 'REJECTED' ? '1.5px solid #FCA5A5' : '1px solid var(--pub-line)',
                  backgroundColor: doc.status === 'REJECTED' ? '#FEF2F2' : 'var(--pub-canvas)',
                  borderRadius: '12px',
                  padding: '1rem 1.15rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.85rem',
                }}
              >
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--pub-ink)' }}>{doc.title}</strong>
                    {doc.isRequired && (
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#DC2626', backgroundColor: '#FEE2E2', padding: '0.1rem 0.45rem', borderRadius: '9999px' }}>
                        Wajib
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.12rem 0.5rem',
                        borderRadius: '9999px',
                        backgroundColor:
                          doc.status === 'VERIFIED'
                            ? '#ECFDF5'
                            : doc.status === 'REJECTED'
                            ? '#FEE2E2'
                            : doc.status === 'PENDING'
                            ? '#FEF3C7'
                            : '#F1F5F9',
                        color:
                          doc.status === 'VERIFIED'
                            ? '#047857'
                            : doc.status === 'REJECTED'
                            ? '#B91C1C'
                            : doc.status === 'PENDING'
                            ? '#B45309'
                            : '#64748B',
                      }}
                    >
                      {doc.status === 'VERIFIED'
                        ? 'TERVERIFIKASI'
                        : doc.status === 'REJECTED'
                        ? 'PERLU REVISI'
                        : doc.status === 'PENDING'
                        ? 'MENUNGGU VALIDASI'
                        : 'BELUM DIUNGGAH'}
                    </span>
                  </div>
                  {doc.description && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--pub-muted)', margin: '0.25rem 0 0 0' }}>
                      {doc.description}
                    </p>
                  )}
                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.25rem' }}>
                    Format: {doc.allowedFormats}
                  </div>
                  {doc.fileName && (
                    <div style={{ marginTop: '0.45rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: '#0F172A', fontWeight: 600 }}>
                      <span>📎 {doc.fileName}</span>
                      {doc.fileSize && <span style={{ color: '#64748B' }}>({doc.fileSize})</span>}
                      {doc.fileUrl && (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: 'var(--pub-teal)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}
                        >
                          <span>Lihat</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  )}
                  {doc.rejectionNote && (
                    <div style={{ marginTop: '0.4rem', fontSize: '0.76rem', color: '#991B1B', fontWeight: 600 }}>
                      Catatan Panitia: {doc.rejectionNote}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {doc.templateUrl && (
                    <a
                      href={doc.templateUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.45rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        color: '#334155',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      <Download size={14} />
                      <span>Template</span>
                    </a>
                  )}

                  <input
                    ref={(el) => {
                      fileInputRefs.current[doc.requirementId] = el;
                    }}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleDocUpload(doc, f);
                      e.target.value = '';
                    }}
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRefs.current[doc.requirementId]?.click()}
                    className="pub-btn-coral"
                    style={{
                      padding: '0.48rem 0.85rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      cursor: isUploading ? 'wait' : 'pointer',
                    }}
                  >
                    {isUploading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={14} />}
                    <span>{isUploading ? 'Mengunggah...' : doc.fileName ? 'Ganti File' : 'Unggah Berkas'}</span>
                  </button>

                  {doc.documentId && (
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => handleDocDelete(doc)}
                      style={{
                        padding: '0.48rem 0.55rem',
                        borderRadius: '8px',
                        border: '1px solid #FECACA',
                        backgroundColor: '#FEF2F2',
                        color: '#DC2626',
                        cursor: 'pointer',
                      }}
                      title="Hapus berkas"
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

      {/* Section 2: Roster Anggota & Pas Foto Event Ini */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Users size={18} color="var(--pub-teal)" />
              <span>2. Pasukan & Pas Foto Event Ini ({members.length} Anggota)</span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
              Pas foto diambil otomatis dari Profil Kontingen. Perubahan pasukan di sini hanya berlaku untuk tim ini (tidak merusak event lain).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={openProfilePicker}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '9px',
                border: '1px solid var(--pub-teal)',
                backgroundColor: '#ECFDF5',
                color: '#047857',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Users size={15} />
              <span>Ambil / Crosscheck dari Profil ({profileMembers.length})</span>
            </button>
            <button
              type="button"
              onClick={handleAddManualMember}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 0.85rem',
                borderRadius: '9px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#334155',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Plus size={15} />
              <span>Tambah Slot</span>
            </button>
          </div>
        </div>

        {/* Nama Tim & Sekolah */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
              Nama Pasukan / Tim di Event Ini
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '9px', border: '1px solid var(--pub-line)', fontSize: '0.85rem', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
              Asal Sekolah / Kontingen
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '9px', border: '1px solid var(--pub-line)', fontSize: '0.85rem', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Drawer Picker dari Bank Profil */}
        {showProfilePicker && (
          <div style={{ backgroundColor: '#F8FAFC', border: '1.5px solid var(--pub-teal)', borderRadius: '14px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '0.86rem', color: '#0F172A' }}>
                Pilih Anggota dari Bank Profil Kontingen ({pickerSelectedIds.size} dipilih)
              </strong>
              <button type="button" onClick={() => setShowProfilePicker(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            {profileMembers.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Bank Anggota di Profil Kontingen masih kosong.{' '}
                <button type="button" onClick={onGoToProfile} style={{ background: 'none', border: 'none', color: 'var(--pub-coral)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
                  Isi Profil Kontingen sekarang
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: '0.55rem', maxHeight: '240px', overflowY: 'auto' }}>
                {profileMembers.map((pm) => {
                  const checked = pickerSelectedIds.has(pm.id);
                  return (
                    <div
                      key={pm.id}
                      onClick={() => togglePickerMember(pm.id)}
                      style={{
                        backgroundColor: checked ? '#ECFDF5' : '#FFFFFF',
                        border: checked ? '1.5px solid #10B981' : '1px solid #E2E8F0',
                        borderRadius: '9px',
                        padding: '0.5rem 0.6rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ color: checked ? '#059669' : '#94A3B8', flexShrink: 0 }}>
                        {checked ? <CheckSquare size={16} /> : <Square size={16} />}
                      </div>
                      <div style={{ width: '32px', height: '42px', borderRadius: '5px', backgroundColor: '#F1F5F9', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {pm.photoUrl ? (
                          <img src={pm.photoUrl} alt={pm.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <User size={14} color="#94A3B8" />
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {pm.fullName}
                        </div>
                        <div style={{ fontSize: '0.67rem', color: '#64748B' }}>{pm.defaultRole}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowProfilePicker(false)}
                style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '0.78rem', fontWeight: 700, color: '#475569', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={applyProfilePicker}
                style={{ padding: '0.45rem 0.95rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--pub-teal)', color: '#FFFFFF', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Terapkan ke Pasukan Event Ini
              </button>
            </div>
          </div>
        )}

        {/* Grid Anggota Event Ini */}
        {members.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px dashed #CBD5E1', color: '#64748B', fontSize: '0.84rem' }}>
            Belum ada anggota pada tim ini. Klik <strong>Ambil / Crosscheck dari Profil</strong> untuk memasukkan pasukan secara instan.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(235px, 1fr))', gap: '0.85rem' }}>
            {members.map((m, idx) => (
              <div
                key={m.id || idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: m.roleInTeam === 'DANTON' ? '1.5px solid var(--pub-coral)' : '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '0.8rem',
                  display: 'flex',
                  gap: '0.7rem',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '58px',
                    height: '76px',
                    borderRadius: '8px',
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {m.photoUrl ? (
                    <img src={m.photoUrl} alt={m.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={20} color="#94A3B8" />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.25rem' }}>
                    <select
                      value={m.roleInTeam}
                      onChange={(e) => handleMemberFieldChange(idx, 'roleInTeam', e.target.value)}
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.35rem',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: m.roleInTeam === 'DANTON' ? '#FEF2F2' : '#F8FAFC',
                        color: m.roleInTeam === 'DANTON' ? '#DC2626' : '#334155',
                      }}
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(idx)}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.15rem' }}
                      title="Keluarkan dari event ini"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={m.fullName}
                    onChange={(e) => handleMemberFieldChange(idx, 'fullName', e.target.value)}
                    style={{ width: '100%', padding: '0.32rem 0.45rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.78rem', fontWeight: 700, boxSizing: 'border-box' }}
                  />
                  <input
                    type="text"
                    placeholder="TTL"
                    value={m.ttl}
                    onChange={(e) => handleMemberFieldChange(idx, 'ttl', e.target.value)}
                    style={{ width: '100%', padding: '0.28rem 0.45rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.72rem', color: '#475569', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--pub-line)' }}>
          <button
            type="button"
            disabled={savingTeam || submittingAll}
            onClick={() => saveTeamChanges(null)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 1.1rem',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontSize: '0.83rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {savingTeam ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
            <span>{savingTeam ? 'Menyimpan...' : 'Simpan Draft Tim'}</span>
          </button>

          <button
            type="button"
            disabled={savingTeam || submittingAll}
            onClick={() => saveTeamChanges('SUBMITTED')}
            className="pub-btn-coral"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.25rem',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {submittingAll ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={15} />}
            <span>{submittingAll ? 'Mengajukan...' : 'Ajukan ke Panitia'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
