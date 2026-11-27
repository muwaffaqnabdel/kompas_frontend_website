import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Save,
  Plus,
  Camera,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { compressPasFoto } from '../../../utils/imageCompress';

const ROLE_OPTIONS = [
  { value: 'DANTON', label: 'Danton', bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
  { value: 'PASUKAN', label: 'Pasukan', bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' },
  { value: 'CADANGAN', label: 'Cadangan', bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
  { value: 'OFFICIAL', label: 'Official / Pelatih', bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' },
];

const CATEGORY_OPTIONS = ['SMP/MTs', 'SMA/SMK/MA', 'SD/MI', 'Umum / Purna'];

function getRoleStyle(role) {
  return ROLE_OPTIONS.find((r) => r.value === String(role || '').toUpperCase()) || ROLE_OPTIONS[1];
}

export default function PesertaProfilKontingen({ profileData, onProfileUpdated }) {
  const [schoolName, setSchoolName] = useState(profileData?.profile?.schoolName || '');
  const [defaultTeamName, setDefaultTeamName] = useState(profileData?.profile?.defaultTeamName || '');
  const [category, setCategory] = useState(profileData?.profile?.category || 'SMA/SMK/MA');
  const [coachName, setCoachName] = useState(profileData?.profile?.coachName || '');
  const [officialPhone, setOfficialPhone] = useState(profileData?.profile?.officialPhone || '');

  const [savingProfile, setSavingProfile] = useState(false);
  const [members, setMembers] = useState(profileData?.members || []);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text }

  // Form tambah / edit anggota
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [mFullName, setMFullName] = useState('');
  const [mTtl, setMTtl] = useState('');
  const [mNisn, setMNisn] = useState('');
  const [mRole, setMRole] = useState('PASUKAN');
  const [mPhotoFile, setMPhotoFile] = useState(null);
  const [mPhotoPreview, setMPhotoPreview] = useState(null);
  const [mPhotoInfo, setMPhotoInfo] = useState('');
  const [submittingMember, setSubmittingMember] = useState(false);
  const [uploadingMemberPhotoId, setUploadingMemberPhotoId] = useState(null);
  const quickPhotoInputRefs = useRef({});

  useEffect(() => {
    if (profileData?.profile) {
      setSchoolName(profileData.profile.schoolName || '');
      setDefaultTeamName(profileData.profile.defaultTeamName || '');
      setCategory(profileData.profile.category || 'SMA/SMK/MA');
      setCoachName(profileData.profile.coachName || '');
      setOfficialPhone(profileData.profile.officialPhone || '');
    }
    if (Array.isArray(profileData?.members)) {
      setMembers(profileData.members);
    }
  }, [profileData]);

  const showToast = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const resetMemberForm = () => {
    setEditingMemberId(null);
    setMFullName('');
    setMTtl('');
    setMNisn('');
    setMRole('PASUKAN');
    setMPhotoFile(null);
    if (mPhotoPreview && mPhotoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(mPhotoPreview);
    }
    setMPhotoPreview(null);
    setMPhotoInfo('');
    setShowAddForm(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!schoolName.trim()) {
      showToast('error', 'Nama sekolah / instansi wajib diisi.');
      return;
    }
    setSavingProfile(true);
    try {
      const res = await fetch('/api/peserta/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          schoolName: schoolName.trim(),
          defaultTeamName: defaultTeamName.trim(),
          category,
          coachName: coachName.trim(),
          officialPhone: officialPhone.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menyimpan profil kontingen.');
      }
      showToast('success', 'Identitas Profil Kontingen berhasil disimpan.');
      onProfileUpdated && onProfileUpdated();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePickFormPhoto = async (e) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;
    try {
      const compressed = await compressPasFoto(rawFile);
      setMPhotoFile(compressed.file);
      if (mPhotoPreview && mPhotoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(mPhotoPreview);
      }
      setMPhotoPreview(URL.createObjectURL(compressed.blob));
      setMPhotoInfo(`Terkompresi: ${compressed.sizeKb} KB (${compressed.width}×${compressed.height}px)`);
    } catch (err) {
      showToast('error', err.message || 'Gagal memproses gambar pas foto.');
    }
  };

  const handleSubmitMember = async (e) => {
    e.preventDefault();
    if (!mFullName.trim()) {
      showToast('error', 'Nama lengkap anggota wajib diisi.');
      return;
    }

    setSubmittingMember(true);
    try {
      const formData = new FormData();
      formData.append('fullName', mFullName.trim());
      formData.append('ttl', mTtl.trim());
      formData.append('nisn', mNisn.trim());
      formData.append('defaultRole', mRole);
      if (schoolName.trim()) formData.append('schoolName', schoolName.trim());
      if (mPhotoFile) formData.append('photo', mPhotoFile);

      const url = editingMemberId
        ? `/api/peserta/profile/members/${encodeURIComponent(editingMemberId)}`
        : '/api/peserta/profile/members';
      const method = editingMemberId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menyimpan anggota.');
      }

      if (editingMemberId) {
        setMembers((prev) => prev.map((m) => (m.id === editingMemberId ? data.member : m)));
        showToast('success', `Data "${data.member.fullName}" berhasil diperbarui.`);
      } else {
        setMembers((prev) => [...prev, data.member]);
        showToast('success', data.warning || `Anggota "${data.member.fullName}" ditambahkan ke Bank Anggota.`);
      }

      resetMemberForm();
      onProfileUpdated && onProfileUpdated();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSubmittingMember(false);
    }
  };

  const handleQuickPhotoChange = async (memberId, rawFile) => {
    if (!rawFile) return;
    setUploadingMemberPhotoId(memberId);
    try {
      const compressed = await compressPasFoto(rawFile);
      const formData = new FormData();
      formData.append('photo', compressed.file);

      const res = await fetch(`/api/peserta/profile/members/${encodeURIComponent(memberId)}`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal memperbarui pas foto.');
      }
      setMembers((prev) => prev.map((m) => (m.id === memberId ? data.member : m)));
      showToast('success', `Pas foto berhasil diperbarui (${compressed.sizeKb} KB).`);
      onProfileUpdated && onProfileUpdated();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setUploadingMemberPhotoId(null);
    }
  };

  const handleStartEdit = (member) => {
    setEditingMemberId(member.id);
    setMFullName(member.fullName || '');
    setMTtl(member.ttl || '');
    setMNisn(member.nisn || '');
    setMRole(member.defaultRole || 'PASUKAN');
    setMPhotoFile(null);
    setMPhotoPreview(member.photoUrl || null);
    setMPhotoInfo(member.photoUrl ? 'Pas foto tersimpan (pilih file baru untuk mengganti)' : '');
    setShowAddForm(true);
  };

  const handleDeleteMember = async (member) => {
    if (!window.confirm(`Hapus "${member.fullName}" dari Bank Anggota Profil?\n(Riwayat pendaftaran event sebelumnya tetap aman.)`)) {
      return;
    }
    try {
      const res = await fetch(`/api/peserta/profile/members/${encodeURIComponent(member.id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menghapus anggota.');
      }
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      showToast('success', `Anggota "${member.fullName}" dihapus dari Profil.`);
      onProfileUpdated && onProfileUpdated();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const membersWithPhoto = members.filter((m) => Boolean(m.photoUrl)).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1080px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      {/* Toast Feedback */}
      {feedback && (
        <div
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
            backgroundColor: feedback.type === 'error' ? '#FEF2F2' : '#ECFDF5',
            border: `1px solid ${feedback.type === 'error' ? '#FCA5A5' : '#6EE7B7'}`,
            color: feedback.type === 'error' ? '#991B1B' : '#065F46',
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
          {feedback.type === 'error' ? <AlertCircle size={17} /> : <CheckCircle2 size={17} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.5rem 1.75rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--pub-teal)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Master Profil Kontingen (Lintas Event)
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.55rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0.2rem 0 0.35rem 0' }}>
          Profil Kontingen & Bank Anggota Pasukan
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--pub-muted)', margin: 0, lineHeight: 1.5 }}>
          Simpan identitas sekolah dan seluruh pas foto anggota pasukan Anda di sini sekali saja. Saat mendaftar event baru, Anda tinggal mencentang anggota yang ikut tanpa perlu mengunggah pas foto berulang kali.
        </p>
      </div>

      {/* Section 1: Identitas Sekolah / Kontingen */}
      <form
        onSubmit={handleSaveProfile}
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
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
              1. Identitas Kontingen (Auto-Fill Pendaftaran)
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
              Data ini otomatis mengisi formulir saat Anda mendaftar event baru (tetap bisa diubah khusus per tim/event).
            </p>
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="pub-btn-coral"
            style={{
              padding: '0.55rem 1.1rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: savingProfile ? 'wait' : 'pointer',
              opacity: savingProfile ? 0.7 : 1,
            }}
          >
            {savingProfile ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
            <span>{savingProfile ? 'Menyimpan...' : 'Simpan Identitas'}</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.9rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Nama Sekolah / Instansi *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: SMKN 2 Kudus"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '9px', border: '1px solid var(--pub-line)', fontSize: '0.85rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Nama Satuan / Tim Default
            </label>
            <input
              type="text"
              placeholder="Contoh: Paskibra Garuda Sakti"
              value={defaultTeamName}
              onChange={(e) => setDefaultTeamName(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '9px', border: '1px solid var(--pub-line)', fontSize: '0.85rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Jenjang / Kategori Default
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '9px', border: '1px solid var(--pub-line)', fontSize: '0.85rem', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Nama Pembina / Pelatih Official
            </label>
            <input
              type="text"
              placeholder="Nama pembina / pelatih"
              value={coachName}
              onChange={(e) => setCoachName(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '9px', border: '1px solid var(--pub-line)', fontSize: '0.85rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              No. WhatsApp Official
            </label>
            <input
              type="text"
              placeholder="08xxxxxxxxxx"
              value={officialPhone}
              onChange={(e) => setOfficialPhone(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '9px', border: '1px solid var(--pub-line)', fontSize: '0.85rem', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </form>

      {/* Section 2: Bank Anggota & Pas Foto */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.15rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Users size={18} color="var(--pub-coral)" />
              <span>2. Bank Anggota & Pas Foto ({members.length} Anggota)</span>
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--pub-muted)', margin: '0.25rem 0 0 0' }}>
              {membersWithPhoto}/{members.length} anggota memiliki pas foto · Otomatis dikompresi ≤ 80 KB sebelum masuk Supabase Storage.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetMemberForm();
              setShowAddForm(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: 'var(--pub-navy)',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            <span>Tambah Anggota</span>
          </button>
        </div>

        {/* Form Tambah / Edit Anggota */}
        {showAddForm && (
          <form
            onSubmit={handleSubmitMember}
            style={{
              backgroundColor: '#F8FAFC',
              border: '1.5px solid #CBD5E1',
              borderRadius: '14px',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '0.88rem', color: '#0F172A' }}>
                {editingMemberId ? 'Edit Data Anggota Profil' : 'Tambah Anggota Baru ke Bank Profil'}
              </strong>
              <button
                type="button"
                onClick={resetMemberForm}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '1.15rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {/* Upload Pas Foto Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', width: '115px', flexShrink: 0 }}>
                <label
                  style={{
                    width: '105px',
                    height: '135px',
                    borderRadius: '10px',
                    border: '2px dashed #94A3B8',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {mPhotoPreview ? (
                    <img src={mPhotoPreview} alt="Preview Pas Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <Camera size={22} color="#64748B" />
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', marginTop: '0.3rem', textAlign: 'center', padding: '0 0.25rem' }}>
                        Upload Pas Foto
                      </span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handlePickFormPhoto} style={{ display: 'none' }} />
                </label>
                {mPhotoInfo && (
                  <span style={{ fontSize: '0.65rem', color: '#047857', textAlign: 'center', fontWeight: 600 }}>
                    {mPhotoInfo}
                  </span>
                )}
              </div>

              {/* Fields */}
              <div style={{ flex: 1, minWidth: '220px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap siswa"
                    value={mFullName}
                    onChange={(e) => setMFullName(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    Tempat, Tanggal Lahir (TTL)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kudus, 12 Mei 2008"
                    value={mTtl}
                    onChange={(e) => setMTtl(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    NISN / NIS
                  </label>
                  <input
                    type="text"
                    placeholder="Opsional"
                    value={mNisn}
                    onChange={(e) => setMNisn(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    Peran Default
                  </label>
                  <select
                    value={mRole}
                    onChange={(e) => setMRole(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.84rem', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={resetMemberForm}
                style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submittingMember}
                className="pub-btn-coral"
                style={{ padding: '0.5rem 1.05rem', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
              >
                {submittingMember ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
                <span>{submittingMember ? 'Menyimpan...' : editingMemberId ? 'Simpan Perubahan' : 'Simpan ke Bank Anggota'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Daftar Kartu Anggota */}
        {members.length === 0 ? (
          <div style={{ padding: '2.5rem 1.25rem', textAlign: 'center', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px dashed #CBD5E1', color: '#64748B' }}>
            <Sparkles size={26} color="var(--pub-coral)" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.92rem' }}>Bank Anggota Masih Kosong</div>
            <p style={{ fontSize: '0.8rem', margin: '0.3rem auto 0.9rem auto', maxWidth: '460px' }}>
              Tambahkan seluruh anggota Paskibra sekolah Anda beserta pas fotonya di sini (bisa lebih dari 16 orang termasuk cadangan).
            </p>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="pub-btn-coral"
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
            >
              + Tambah Anggota Pertama
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))', gap: '0.9rem' }}>
            {members.map((member) => {
              const roleStyle = getRoleStyle(member.defaultRole);
              const isUploading = uploadingMemberPhotoId === member.id;
              return (
                <div
                  key={member.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    padding: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
                    {/* Pas Foto 3:4 */}
                    <div
                      onClick={() => !isUploading && quickPhotoInputRefs.current[member.id]?.click()}
                      title="Klik untuk unggah / ganti pas foto"
                      style={{
                        width: '62px',
                        height: '80px',
                        borderRadius: '8px',
                        backgroundColor: '#F1F5F9',
                        border: member.photoUrl ? '1px solid #CBD5E1' : '1.5px dashed #94A3B8',
                        overflow: 'hidden',
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                    >
                      {isUploading ? (
                        <Loader2 size={18} color="var(--pub-coral)" style={{ animation: 'spin 1s linear infinite' }} />
                      ) : member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <>
                          <User size={20} color="#94A3B8" />
                          <span style={{ fontSize: '0.58rem', color: '#64748B', fontWeight: 700, marginTop: '0.15rem' }}>Foto</span>
                        </>
                      )}
                      <input
                        ref={(el) => {
                          quickPhotoInputRefs.current[member.id] = el;
                        }}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleQuickPhotoChange(member.id, f);
                          e.target.value = '';
                        }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          backgroundColor: roleStyle.bg,
                          color: roleStyle.color,
                          border: `1px solid ${roleStyle.border}`,
                          padding: '0.1rem 0.45rem',
                          borderRadius: '9999px',
                          fontSize: '0.64rem',
                          fontWeight: 800,
                          marginBottom: '0.25rem',
                        }}
                      >
                        {roleStyle.label}
                      </span>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A', wordBreak: 'break-word', lineHeight: 1.25 }}>
                        {member.fullName}
                      </div>
                      {member.ttl && (
                        <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.2rem' }}>{member.ttl}</div>
                      )}
                      {member.nisn && (
                        <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                          NISN: {member.nisn}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem', paddingTop: '0.45rem', borderTop: '1px solid #F1F5F9' }}>
                    <button
                      type="button"
                      onClick={() => quickPhotoInputRefs.current[member.id]?.click()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.28rem 0.5rem',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#F8FAFC',
                        color: '#334155',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Camera size={12} />
                      <span>Foto</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(member)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.28rem 0.5rem',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#F8FAFC',
                        color: '#334155',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Edit3 size={12} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMember(member)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.28rem 0.45rem',
                        borderRadius: '6px',
                        border: '1px solid #FECACA',
                        backgroundColor: '#FEF2F2',
                        color: '#DC2626',
                        cursor: 'pointer',
                      }}
                      title="Hapus anggota"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

