import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Save,
  Plus,
  Trash2,
  UserPlus,
  Check,
  Shield,
  Edit2,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';

const STORAGE_KEY_DPS = 'kompas_dp_flow_items';
const STORAGE_KEY_STAFF = 'kompas_dp_staff_accounts';
const STORAGE_KEY_CUSTOM_NAMES = 'kompas_dp_custom_names';

// 4 Opsi Standar Sesuai Arahan
const STANDARD_DP_OPTIONS = [
  {
    name: 'Pengecekan Dokumen dan Berkas',
    code: 'DOC_CHECK',
    defaultSop: 'Verifikasi berkas fisik kontingen, surat mandat, kartu tanda pelajar sah, dan pemeriksaan kelengkapan berkas pendaftaran peleton.',
  },
  {
    name: 'Photoshoot Pasukan',
    code: 'PHOTOSHOOT',
    defaultSop: 'Sesi dokumentasi foto resmi peleton lengkap di backdrop resmi dan pemeriksaan kesesuaian nomor dada/atribut.',
  },
  {
    name: 'Daerah Persiapan dan Pemanasan',
    code: 'FINAL_PREP',
    defaultSop: 'Peregangan, pemanasan langkah perlahan, sinkronisasi aba-aba komandan peleton, dan persiapan memasuki panggung.',
  },
  {
    name: 'Panggung Utama',
    code: 'STAGE_PERFORMANCE',
    defaultSop: 'Peleton tampil di arena pertandingan dinilai langsung oleh Dewan Juri secara real-time.',
  },
];

const DEFAULT_DPS = [
  {
    id: 1,
    name: 'DP 1 — Pengecekan Dokumen dan Berkas',
    code: 'DOC_CHECK',
    sop: 'Verifikasi berkas fisik kontingen, surat mandat, kartu tanda pelajar sah, dan pemeriksaan kelengkapan berkas pendaftaran peleton.',
  },
  {
    id: 2,
    name: 'DP 2 — Photoshoot Pasukan',
    code: 'PHOTOSHOOT',
    sop: 'Sesi dokumentasi foto resmi peleton lengkap di backdrop resmi dan pemeriksaan kesesuaian nomor dada/atribut.',
  },
  {
    id: 3,
    name: 'DP 3 — Daerah Persiapan dan Pemanasan',
    code: 'FINAL_PREP',
    sop: 'Peregangan, pemanasan langkah perlahan, sinkronisasi aba-aba komandan peleton, dan persiapan memasuki panggung.',
  },
  {
    id: 4,
    name: 'DP 4 — Panggung Utama',
    code: 'STAGE_PERFORMANCE',
    sop: 'Peleton tampil di arena pertandingan dinilai langsung oleh Dewan Juri secara real-time.',
  },
];

const DEFAULT_STAFF = [
  {
    id: 'staff-1',
    name: 'Budi Santoso',
    email: 'panitia.dp1@kompas.id',
    assignedDpId: 1,
    status: 'AKTIF',
  },
  {
    id: 'staff-2',
    name: 'Rian Firmansyah',
    email: 'panitia.dp2@kompas.id',
    assignedDpId: 2,
    status: 'AKTIF',
  },
  {
    id: 'staff-3',
    name: 'Dewi Anggraini',
    email: 'panitia.dp3@kompas.id',
    assignedDpId: 3,
    status: 'AKTIF',
  },
  {
    id: 'staff-4',
    name: 'Ahmad Fauzi',
    email: 'panitia.dp4@kompas.id',
    assignedDpId: 4,
    status: 'AKTIF',
  },
];

// Helper untuk mengekstrak nama murni tanpa prefix "DP X — "
function extractBaseName(fullName) {
  if (!fullName) return '';
  if (fullName.includes('—')) {
    return fullName.split('—')[1]?.trim() || fullName;
  }
  if (fullName.includes('-')) {
    return fullName.split('-')[1]?.trim() || fullName;
  }
  return fullName.trim();
}

// Helper untuk mencari Pos DP yang ditugaskan ke staf secara akurat (mendukung ID string/UUID maupun order index)
export function findAssignedDp(staffAssignedDpId, dps) {
  if (
    staffAssignedDpId === undefined ||
    staffAssignedDpId === null ||
    String(staffAssignedDpId) === 'NaN' ||
    !Array.isArray(dps) ||
    dps.length === 0
  ) {
    return null;
  }
  // 1. Exact match ID (String comparison)
  const byId = dps.find((d) => String(d.id) === String(staffAssignedDpId));
  if (byId) return byId;

  // 2. Index match (1-based: jika angka 2 maka cocok dengan dps[1])
  const num = Number(staffAssignedDpId);
  if (!isNaN(num) && num >= 1 && num <= dps.length) {
    return dps[num - 1];
  }

  // 3. Match by orderIndex property
  if (!isNaN(num)) {
    const byOrder = dps.find((d) => Number(d.orderIndex) === num);
    if (byOrder) return byOrder;
  }

  return null;
}

// Helper untuk format nomor pos 2 digit (misal: '01', '02')
export function getAssignedPosNumber(staffAssignedDpId, dps) {
  const target = findAssignedDp(staffAssignedDpId, dps);
  if (!target) {
    const num = Number(staffAssignedDpId);
    return !isNaN(num) && num > 0 ? String(num).padStart(2, '0') : '01';
  }
  const idx = dps.findIndex((d) => String(d.id) === String(target.id));
  return String(idx !== -1 ? idx + 1 : 1).padStart(2, '0');
}

// Helper untuk memeriksa apakah staf ditugaskan ke pos tertentu
export function isStaffAssignedToDp(staff, dp, dpIndex) {
  if (!staff || !dp) return false;
  // Match by id
  if (String(staff.assignedDpId) === String(dp.id)) return true;
  // Match by 1-based index (misal assignedDpId == 2 dan pos index 1 -> Pos 2)
  const num = Number(staff.assignedDpId);
  if (!isNaN(num) && num === dpIndex + 1) return true;
  if (!isNaN(num) && dp.orderIndex && num === Number(dp.orderIndex)) return true;
  return false;
}

export default function AdminPanitiaDPConfig({
  currentEvent,
  dpFlowLocked = false,
  setDpFlowLocked,
}) {
  const eventId = currentEvent?.id || currentEvent?.slug || 'evt-lkbb-2026';

  // 1. Pos DP State (Loaded from localStorage or fallback)
  const [dps, setDps] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_DPS}_${eventId}`);
      if (saved) return JSON.parse(saved);
      const generalSaved = localStorage.getItem(STORAGE_KEY_DPS);
      return generalSaved ? JSON.parse(generalSaved) : DEFAULT_DPS;
    } catch {
      return DEFAULT_DPS;
    }
  });

  // 2. Custom DP Names State (Menampung nama pos kustom tambahan dari tombol +)
  const [customDpNames, setCustomDpNames] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_NAMES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 3. Staff Panitia DP State (dengan auto-healing jika ada assignedDpId yang korup/NaN)
  const [staffList, setStaffList] = useState(() => {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY_STAFF}_${eventId}`) || localStorage.getItem(STORAGE_KEY_STAFF);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s, idx) => {
            const isInvalid =
              s.assignedDpId === null ||
              s.assignedDpId === undefined ||
              String(s.assignedDpId) === 'NaN' ||
              Number.isNaN(Number(s.assignedDpId)) && typeof s.assignedDpId === 'number';
            return isInvalid ? { ...s, assignedDpId: idx + 1 } : s;
          });
        }
      }
      return DEFAULT_STAFF;
    } catch {
      return DEFAULT_STAFF;
    }
  });

  // 4. Modal States
  const [showAddDpModal, setShowAddDpModal] = useState(false);
  const [newDpSelectedType, setNewDpSelectedType] = useState('Daerah Persiapan dan Pemanasan');
  const [newDpCustomName, setNewDpCustomName] = useState('');
  const [newDpSop, setNewDpSop] = useState(
    'Peregangan, pemanasan langkah perlahan, sinkronisasi aba-aba komandan peleton, dan persiapan memasuki panggung.'
  );

  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [showAddCustomNameModal, setShowAddCustomNameModal] = useState(false);
  const [targetDpIdForCustom, setTargetDpIdForCustom] = useState(null);
  const [customNameInput, setCustomNameInput] = useState('');
  const [customSopInput, setCustomSopInput] = useState('');

  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    assignedDpId: 1,
  });

  // 5. Feedback Alert State
  const [saveFeedback, setSaveFeedback] = useState(null);

  const showToast = (msg) => {
    setSaveFeedback(msg);
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  // Sinkronkan ke API backend saat pertama kali
  useEffect(() => {
    const fetchDpConfig = async () => {
      try {
        const [resDp, resStaff] = await Promise.all([
          fetch(`/api/panitia/dp?eventId=${eventId}`, { credentials: 'include' }),
          fetch(`/api/panitia/dp/staff?eventId=${eventId}`, { credentials: 'include' }),
        ]);
        const dataDp = await resDp.json();
        const dataStaff = await resStaff.json();

        if (dataDp.success && Array.isArray(dataDp.decisionPoints) && dataDp.decisionPoints.length > 0) {
          setDps(dataDp.decisionPoints);
          localStorage.setItem(`${STORAGE_KEY_DPS}_${eventId}`, JSON.stringify(dataDp.decisionPoints));
        }

        if (dataStaff.success && Array.isArray(dataStaff.staff) && dataStaff.staff.length > 0) {
          setStaffList(dataStaff.staff);
          localStorage.setItem(`${STORAGE_KEY_STAFF}_${eventId}`, JSON.stringify(dataStaff.staff));
        }
      } catch (err) {
        console.warn('Backend DP API offline, menggunakan persistensi lokal:', err);
      }
    };

    fetchDpConfig();
  }, [eventId]);

  // Simpan seluruh flow DP & Staff
  const handleSaveFlow = async () => {
    try {
      localStorage.setItem(`${STORAGE_KEY_DPS}_${eventId}`, JSON.stringify(dps));
      localStorage.setItem(STORAGE_KEY_DPS, JSON.stringify(dps));
      localStorage.setItem(`${STORAGE_KEY_STAFF}_${eventId}`, JSON.stringify(staffList));
      localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(staffList));
      localStorage.setItem(STORAGE_KEY_CUSTOM_NAMES, JSON.stringify(customDpNames));

      // Kirim ke backend
      await fetch('/api/panitia/dp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ eventId, decisionPoints: dps }),
      });

      window.dispatchEvent(new CustomEvent('kompas_dp_flow_updated', { detail: { dps, staffList } }));
      showToast('Konfigurasi Alur Pos DP & Petugas berhasil disimpan ke server!');
    } catch (err) {
      console.warn('Gagal sync backend, disimpan lokal:', err);
      showToast('Konfigurasi Alur Pos DP berhasil disimpan di lokal.');
    }
  };

  // Handler memilih nama dari dropdown
  const handleSelectDpName = (dpId, selectedBaseName, index) => {
    if (dpFlowLocked) return;

    // Cari apakah opsi standar dipilih untuk otomatis isi defaultSop
    const stdOption = STANDARD_DP_OPTIONS.find((opt) => opt.name === selectedBaseName);
    const newFullName = `DP ${index + 1} — ${selectedBaseName}`;

    setDps((prev) =>
      prev.map((dp) => {
        if (dp.id === dpId) {
          return {
            ...dp,
            name: newFullName,
            code: stdOption?.code || 'CUSTOM_POS',
            sop: stdOption ? stdOption.defaultSop : dp.sop,
          };
        }
        return dp;
      })
    );
  };

  // Buka modal untuk tambah nama pos kustom
  const handleOpenAddCustomNameModal = (dpId) => {
    if (dpFlowLocked) return;
    setTargetDpIdForCustom(dpId);
    setCustomNameInput('');
    setCustomSopInput('');
    setShowAddCustomNameModal(true);
  };

  // Simpan nama pos kustom baru
  const handleSaveCustomName = (e) => {
    e.preventDefault();
    if (!customNameInput.trim()) return;

    const trimmedName = customNameInput.trim();

    // Tambah ke customDpNames jika belum ada
    if (!customDpNames.includes(trimmedName) && !STANDARD_DP_OPTIONS.some((o) => o.name === trimmedName)) {
      const updatedCustomNames = [...customDpNames, trimmedName];
      setCustomDpNames(updatedCustomNames);
      localStorage.setItem(STORAGE_KEY_CUSTOM_NAMES, JSON.stringify(updatedCustomNames));
    }

    // Jika targetDpIdForCustom ditentukan, langsung terapkan ke DP tersebut
    if (targetDpIdForCustom !== null) {
      setDps((prev) =>
        prev.map((dp, idx) => {
          if (dp.id === targetDpIdForCustom) {
            return {
              ...dp,
              name: `DP ${idx + 1} — ${trimmedName}`,
              code: 'CUSTOM_POS',
              sop: customSopInput.trim() || dp.sop || 'Instruksi dan SOP operasional di pos persiapan ini.',
            };
          }
          return dp;
        })
      );
    }

    setShowAddCustomNameModal(false);
    showToast(`Nama pos kustom "${trimmedName}" berhasil ditambahkan.`);
  };

  const handleDpChange = (id, field, value) => {
    if (dpFlowLocked) return;
    setDps((prev) =>
      prev.map((dp) => (dp.id === id ? { ...dp, [field]: value } : dp))
    );
  };

  // Buka Pop-up Modal Tambah Pos DP Baru
  const handleOpenAddDpModal = () => {
    if (dpFlowLocked) return;
    const defaultOpt = STANDARD_DP_OPTIONS[2] || STANDARD_DP_OPTIONS[0];
    setNewDpSelectedType(defaultOpt.name);
    setNewDpCustomName('');
    setNewDpSop(defaultOpt.defaultSop);
    setShowAddDpModal(true);
  };

  // Ubah tipe/nama pos di dalam modal
  const handleNewDpTypeChange = (e) => {
    const val = e.target.value;
    setNewDpSelectedType(val);
    if (val === '__CUSTOM__') {
      if (!newDpSop) {
        setNewDpSop('Instruksi dan SOP operasional pos persiapan ini.');
      }
    } else {
      const std = STANDARD_DP_OPTIONS.find((opt) => opt.name === val);
      if (std) {
        setNewDpSop(std.defaultSop);
      }
    }
  };

  // Simpan Pos DP Baru dari Pop-up Modal
  const handleSaveNewDpModal = async (e) => {
    e.preventDefault();
    if (dpFlowLocked) return;

    let finalBaseName = '';
    let finalCode = 'CUSTOM_POS';

    if (newDpSelectedType === '__CUSTOM__') {
      if (!newDpCustomName.trim()) {
        alert('Silakan masukkan nama pos DP kustom Anda.');
        return;
      }
      finalBaseName = newDpCustomName.trim();
      finalCode = 'CUSTOM_POS';

      if (!customDpNames.includes(finalBaseName) && !STANDARD_DP_OPTIONS.some((o) => o.name === finalBaseName)) {
        const updatedCustomNames = [...customDpNames, finalBaseName];
        setCustomDpNames(updatedCustomNames);
        localStorage.setItem(STORAGE_KEY_CUSTOM_NAMES, JSON.stringify(updatedCustomNames));
      }
    } else {
      finalBaseName = newDpSelectedType;
      const std = STANDARD_DP_OPTIONS.find((opt) => opt.name === finalBaseName);
      if (std) {
        finalCode = std.code;
      }
    }

    const nextOrder = dps.length + 1;
    const nextId = dps.length > 0 ? Math.max(...dps.map((d) => Number(d.id) || 0)) + 1 : 1;
    const finalSop = newDpSop.trim() || 'Instruksi dan SOP operasional pos persiapan ini.';

    const newDpItem = {
      id: nextId,
      name: `DP ${nextOrder} — ${finalBaseName}`,
      code: finalCode,
      sop: finalSop,
    };

    const updatedDps = [...dps, newDpItem];
    setDps(updatedDps);

    // Persistensi langsung ke localStorage
    try {
      localStorage.setItem(`${STORAGE_KEY_DPS}_${eventId}`, JSON.stringify(updatedDps));
      localStorage.setItem(STORAGE_KEY_DPS, JSON.stringify(updatedDps));
    } catch (err) {
      console.warn('Storage save failed:', err);
    }

    // Kirim pembaruan ke backend
    try {
      await fetch('/api/panitia/dp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ eventId, decisionPoints: updatedDps }),
      });
    } catch (err) {
      console.warn('Backend sync add failed:', err);
    }

    window.dispatchEvent(new CustomEvent('kompas_dp_flow_updated', { detail: { dps: updatedDps, staffList } }));
    setShowAddDpModal(false);
    showToast(`Pos DP ${nextOrder} ("${finalBaseName}") berhasil ditambahkan ke alur lomba.`);
  };

  // Hapus Pos DP dengan konfirmasi & sinkronisasi menyeluruh
  const handleDeleteDp = async (id) => {
    if (dpFlowLocked) return;
    if (dps.length <= 1) {
      alert('Alur kompetisi minimal membutuhkan setidaknya 1 Pos DP.');
      return;
    }
    const target = dps.find((d) => String(d.id) === String(id));
    const confirmMsg = target
      ? `Apakah Anda yakin ingin menghapus "${target.name}" dari rangkaian pos persiapan lomba?`
      : 'Apakah Anda yakin ingin menghapus Pos DP ini?';

    if (!window.confirm(confirmMsg)) return;

    const remaining = dps.filter((d) => String(d.id) !== String(id));
    // Re-index nomor urutan DP (DP 1, DP 2, DP 3, dst.)
    const reindexed = remaining.map((d, idx) => {
      const baseName = extractBaseName(d.name);
      return {
        ...d,
        name: `DP ${idx + 1} — ${baseName}`,
      };
    });

    setDps(reindexed);

    // Re-assign petugas yang pos penugasannya terhapus ke pos pertama yang valid
    const remainingIds = new Set(reindexed.map((d) => d.id));
    const updatedStaff = staffList.map((s) => {
      if (String(s.assignedDpId) === String(id) || !remainingIds.has(s.assignedDpId)) {
        return { ...s, assignedDpId: reindexed[0]?.id || 1 };
      }
      return s;
    });
    setStaffList(updatedStaff);

    // Simpan ke localStorage
    try {
      localStorage.setItem(`${STORAGE_KEY_DPS}_${eventId}`, JSON.stringify(reindexed));
      localStorage.setItem(STORAGE_KEY_DPS, JSON.stringify(reindexed));
      localStorage.setItem(`${STORAGE_KEY_STAFF}_${eventId}`, JSON.stringify(updatedStaff));
      localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(updatedStaff));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }

    // Kirim sinkronisasi ke backend
    try {
      await fetch('/api/panitia/dp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ eventId, decisionPoints: reindexed }),
      });
    } catch (err) {
      console.warn('Backend sync delete failed:', err);
    }

    window.dispatchEvent(
      new CustomEvent('kompas_dp_flow_updated', {
        detail: { dps: reindexed, staffList: updatedStaff },
      })
    );
    showToast(`Pos "${target?.name || 'DP'}" telah berhasil dihapus dari rangkaian.`);
  };

  // Handler Tambah Staf Baru
  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.email.trim()) return;

    // Pastikan ID Pos valid dan konsisten
    const targetDp = findAssignedDp(newStaff.assignedDpId, dps) || dps[0];
    const cleanAssignedId = targetDp ? targetDp.id : (dps[0]?.id || 1);

    const newStaffItem = {
      id: `staff-${Date.now()}`,
      name: newStaff.name.trim(),
      email: newStaff.email.trim(),
      assignedDpId: cleanAssignedId,
      status: 'AKTIF',
    };

    const updated = [...staffList, newStaffItem];
    setStaffList(updated);
    localStorage.setItem(`${STORAGE_KEY_STAFF}_${eventId}`, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(updated));

    try {
      await fetch('/api/panitia/dp/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          eventId,
          name: newStaffItem.name,
          email: newStaffItem.email,
          assignedDpId: newStaffItem.assignedDpId,
        }),
      });
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }

    setNewStaff({
      name: '',
      email: '',
      password: '',
      assignedDpId: dps[0]?.id || 1,
    });
    setShowAddStaffModal(false);
    showToast(`Akun petugas ${newStaffItem.name} berhasil dibuat.`);
  };

  // Handler Buka Edit Staf
  const handleOpenEditStaff = (staff) => {
    if (dpFlowLocked) return;
    const matchedDp = findAssignedDp(staff.assignedDpId, dps);
    setEditingStaff({
      ...staff,
      assignedDpId: matchedDp ? matchedDp.id : staff.assignedDpId,
    });
    setShowEditStaffModal(true);
  };

  // Handler Simpan Edit Staf
  const handleSaveEditStaff = async (e) => {
    e.preventDefault();
    if (!editingStaff || !editingStaff.name.trim() || !editingStaff.email.trim()) return;

    // Pastikan assignedDpId cocok dengan id DP yang valid dan tidak menghasilkan NaN
    const matchedDp = findAssignedDp(editingStaff.assignedDpId, dps);
    const cleanAssignedId = matchedDp ? matchedDp.id : (dps[0]?.id || 1);

    const updatedStaffMember = {
      ...editingStaff,
      assignedDpId: cleanAssignedId,
    };

    const updated = staffList.map((s) => (s.id === editingStaff.id ? updatedStaffMember : s));
    setStaffList(updated);
    localStorage.setItem(`${STORAGE_KEY_STAFF}_${eventId}`, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(updated));

    try {
      await fetch(`/api/panitia/dp/staff/${editingStaff.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          eventId,
          name: updatedStaffMember.name,
          email: updatedStaffMember.email,
          assignedDpId: updatedStaffMember.assignedDpId,
          status: updatedStaffMember.status,
        }),
      });
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }

    window.dispatchEvent(new CustomEvent('kompas_dp_flow_updated', { detail: { dps, staffList: updated } }));
    setShowEditStaffModal(false);
    setEditingStaff(null);
    showToast(`Data penugasan petugas ${updatedStaffMember.name} berhasil diperbarui.`);
  };

  // Handler Hapus Staf
  const handleDeleteStaff = async (staffId) => {
    if (dpFlowLocked) return;
    const staff = staffList.find((s) => s.id === staffId);
    if (!window.confirm(`Hapus akun petugas "${staff?.name || 'ini'}"?`)) return;

    const updated = staffList.filter((s) => s.id !== staffId);
    setStaffList(updated);
    localStorage.setItem(`${STORAGE_KEY_STAFF}_${eventId}`, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(updated));

    try {
      await fetch(`/api/panitia/dp/staff/${staffId}?eventId=${eventId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (err) {
      console.warn('Backend delete sync failed, saved locally:', err);
    }

    showToast('Akun petugas berhasil dihapus.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'var(--font-sans)' }}>
      {/* 1. Header Banner & Status Bar */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                backgroundColor: dpFlowLocked ? 'var(--pub-teal-light)' : 'rgba(217, 119, 6, 0.15)',
                color: dpFlowLocked ? 'var(--pub-teal)' : '#B45309',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                fontSize: '0.725rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              {dpFlowLocked ? <Lock size={12} /> : <Unlock size={12} />}
              {dpFlowLocked ? 'FLOW TERKUNCI' : 'MODE DRAFT (DAPAT DIEDIT)'}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--pub-muted)' }}>
              Kapasitas: Tepat 1 Tim per Pos (Atomic Lock)
            </span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.015em',
              color: 'var(--pub-ink)',
              margin: '0 0 0.25rem 0',
            }}
          >
            Konfigurasi Alur Pos DP (Decision Point)
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: 0, maxWidth: '640px', lineHeight: 1.45 }}>
            Atur urutan pos persiapan dengan pilihan nama standar maupun kustom, definisikan SOP, dan tugaskan panitia operator
            sebelum hari H pelaksanaan lomba.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {!dpFlowLocked && (
            <button
              type="button"
              onClick={handleSaveFlow}
              className="pub-btn-outline"
              style={{
                fontSize: '0.8125rem',
                padding: '0.55rem 1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Save size={14} />
              <span>Simpan Perubahan</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (setDpFlowLocked) {
                const nextState = !dpFlowLocked;
                setDpFlowLocked(nextState);
                if (nextState) {
                  handleSaveFlow();
                }
              }
            }}
            className={dpFlowLocked ? 'pub-btn-outline' : 'pub-btn-coral'}
            style={{
              fontSize: '0.8125rem',
              padding: '0.55rem 1.15rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {dpFlowLocked ? <Unlock size={14} /> : <Lock size={14} />}
            <span>{dpFlowLocked ? 'Buka Kunci Flow' : 'Kunci Flow DP'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast Notification */}
      {saveFeedback && (
        <div
          style={{
            backgroundColor: 'var(--pub-teal-light)',
            color: 'var(--pub-teal)',
            border: '1px solid var(--pub-teal)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontSize: '0.825rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Check size={16} />
          <span>{saveFeedback}</span>
        </div>
      )}

      {/* Info Notice when Locked */}
      {dpFlowLocked && (
        <div
          style={{
            backgroundColor: '#F1F5F9',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '0.85rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.8125rem',
            color: 'var(--pub-ink)',
          }}
        >
          <Shield size={16} style={{ color: 'var(--pub-navy)', flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: 700 }}>Alur Pos DP telah dibekukan.</span> Demi kepatuhan regulasi dan asas keadilan lomba,
            konfigurasi pos dan penugasan tidak dapat disunting selama flow terkunci. Buka kunci jika perlu melakukan perubahan khusus.
          </div>
        </div>
      )}

      {/* 2. Visual Pos DP Editor (Rangkaian Pos Persiapan) */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.5rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--pub-line)',
            paddingBottom: '0.85rem',
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.05rem',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                color: 'var(--pub-ink)',
                margin: 0,
              }}
            >
              Rangkaian Pos Persiapan ({dps.length} Pos Aktif)
            </h3>
            <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
              Setiap tim akan bergerak secara berurutan dari Pos 01 hingga pos panggung arena utama.
            </p>
          </div>

          {!dpFlowLocked && (
            <button
              type="button"
              onClick={handleOpenAddDpModal}
              className="pub-btn-coral"
              style={{
                fontSize: '0.775rem',
                padding: '0.48rem 0.95rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(201, 75, 60, 0.25)',
              }}
            >
              <Plus size={15} />
              <span>Tambah Pos DP</span>
            </button>
          )}
        </div>

        {/* Pos Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {dps.map((dp, index) => {
            const assignedStaff = staffList.filter((s) => isStaffAssignedToDp(s, dp, index));
            const currentBaseName = extractBaseName(dp.name);

            // Cek apakah pos ini adalah Pos Pengecekan Dokumen
            const isDocCheckPos =
              dp.code === 'DOC_CHECK' ||
              currentBaseName.toLowerCase().includes('dokumen') ||
              index === 0;

            return (
              <div
                key={dp.id}
                style={{
                  backgroundColor: 'var(--pub-canvas)',
                  border: isDocCheckPos ? '1.5px solid var(--pub-teal)' : '1px solid var(--pub-line)',
                  borderRadius: '12px',
                  padding: '1.15rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  position: 'relative',
                }}
              >
                {/* Pos Header & Action */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        backgroundColor: 'var(--pub-navy)',
                        color: '#FFFFFF',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                      }}
                    >
                      URUTAN {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      style={{
                        fontSize: '0.725rem',
                        color: 'var(--pub-muted)',
                        fontWeight: 600,
                      }}
                    >
                      Kapasitas Terkunci: 1 Tim
                    </span>
                    {isDocCheckPos && (
                      <span
                        style={{
                          backgroundColor: 'var(--pub-teal-light)',
                          color: 'var(--pub-teal)',
                          fontSize: '0.675rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <FileText size={11} />
                        VERIFIKASI BERKAS AKTIF
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {assignedStaff.length > 0 ? (
                      <span
                        style={{
                          fontSize: '0.725rem',
                          color: '#065F46',
                          backgroundColor: '#D1FAE5',
                          border: '1px solid #A7F3D0',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        Petugas: {assignedStaff.map((s) => s.name).join(', ')}
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.725rem',
                          color: '#B45309',
                          backgroundColor: 'rgba(217, 119, 6, 0.15)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          fontWeight: 700,
                        }}
                      >
                        Belum ada petugas ditugaskan
                      </span>
                    )}

                    {!dpFlowLocked && dps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteDp(dp.id)}
                        title="Hapus Pos Ini dari Rangkaian"
                        style={{
                          backgroundColor: '#FEF2F2',
                          border: '1px solid #FECACA',
                          color: '#DC2626',
                          cursor: 'pointer',
                          padding: '0.3rem 0.6rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          borderRadius: '6px',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Trash2 size={13} />
                        <span>Hapus Pos</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Fields: Pos Name Dropdown & SOP */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                  {/* Dropdown Nama Pos DP + Tombol + */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--pub-ink)',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Pilih Nama Pos DP
                    </label>

                    <select
                      disabled={dpFlowLocked}
                      value={currentBaseName}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '__ADD_NEW__') {
                          handleOpenAddCustomNameModal(dp.id);
                        } else {
                          handleSelectDpName(dp.id, val, index);
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.8125rem',
                        border: '1px solid var(--pub-line)',
                        borderRadius: '6px',
                        backgroundColor: dpFlowLocked ? '#F1F5F9' : '#FFFFFF',
                        color: 'var(--pub-ink)',
                        fontWeight: 600,
                        cursor: dpFlowLocked ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {/* Jika nama saat ini belum ada di standar maupun kustom, tampilkan sebagai opsi aktif */}
                      {!STANDARD_DP_OPTIONS.some((o) => o.name === currentBaseName) &&
                        !customDpNames.includes(currentBaseName) && (
                          <option value={currentBaseName}>{currentBaseName}</option>
                        )}

                      <optgroup label="Pilihan Nama Pos Standar">
                        {STANDARD_DP_OPTIONS.map((opt) => (
                          <option key={opt.code} value={opt.name}>
                            {opt.name}
                          </option>
                        ))}
                      </optgroup>

                      {customDpNames.length > 0 && (
                        <optgroup label="Nama Pos Kustom Tambahan">
                          {customDpNames.map((cName, idx) => (
                            <option key={`custom-${idx}`} value={cName}>
                              {cName}
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {!dpFlowLocked && (
                        <optgroup label="Tambah Nama Baru">
                          <option value="__ADD_NEW__">+ Tambah Nama Pos Kustom...</option>
                        </optgroup>
                      )}
                    </select>
                  </div>

                  {/* Pos SOP Text Input */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--pub-ink)',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Aktivitas & Instruksi SOP Pos
                    </label>
                    <input
                      type="text"
                      disabled={dpFlowLocked}
                      value={dp.sop}
                      onChange={(e) => handleDpChange(dp.id, 'sop', e.target.value)}
                      placeholder="Ringkasan tugas petugas di pos ini..."
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.8125rem',
                        border: '1px solid var(--pub-line)',
                        borderRadius: '6px',
                        backgroundColor: dpFlowLocked ? '#F1F5F9' : '#FFFFFF',
                        color: 'var(--pub-ink)',
                        fontWeight: 400,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Manajemen & Penugasan Akun Panitia DP */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.5rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--pub-line)',
            paddingBottom: '0.85rem',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.05rem',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                color: 'var(--pub-ink)',
                margin: 0,
              }}
            >
              Penugasan Petugas Operator Pos DP
            </h3>
            <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
              Kelola akun staf operasional lapangan yang bertugas mengoperasikan workstation masing-masing Pos DP.
            </p>
          </div>

          {!dpFlowLocked && (
            <button
              type="button"
              onClick={() => setShowAddStaffModal(true)}
              className="pub-btn-outline"
              style={{
                fontSize: '0.775rem',
                padding: '0.45rem 0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <UserPlus size={14} />
              <span>Tambah Akun Petugas DP</span>
            </button>
          )}
        </div>

        {/* Staff Table */}
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.8125rem',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--pub-canvas)',
                  borderBottom: '1px solid var(--pub-line)',
                  color: 'var(--pub-ink)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <th style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>Nama Petugas</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>Email Akun</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>Pos Penugasan</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>Status Akses</th>
                {!dpFlowLocked && <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 800 }}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => {
                const targetDp = findAssignedDp(staff.assignedDpId, dps);
                const posNumber = getAssignedPosNumber(staff.assignedDpId, dps);
                const isDocCheck =
                  targetDp?.code === 'DOC_CHECK' ||
                  targetDp?.name?.toLowerCase().includes('dokumen') ||
                  posNumber === '01';

                return (
                  <tr
                    key={staff.id}
                    style={{
                      borderBottom: '1px solid var(--pub-line)',
                      color: 'var(--pub-ink)',
                    }}
                  >
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{staff.name}</td>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.775rem', color: 'var(--pub-muted)' }}>
                      {staff.email}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          backgroundColor: isDocCheck ? 'var(--pub-teal)' : 'var(--pub-navy)',
                          color: '#FFFFFF',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        Pos {posNumber}
                      </span>{' '}
                      <span style={{ fontSize: '0.775rem', color: 'var(--pub-ink)', marginLeft: '0.35rem', fontWeight: 600 }}>
                        {targetDp ? extractBaseName(targetDp.name) : `DP ${posNumber}`}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          backgroundColor: staff.status === 'AKTIF' ? 'var(--pub-teal-light)' : '#F1F5F9',
                          color: staff.status === 'AKTIF' ? 'var(--pub-teal)' : '#64748B',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                        }}
                      >
                        {staff.status}
                      </span>
                    </td>
                    {!dpFlowLocked && (
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          {/* Tombol Edit Staf (Icon Samping Tombol Sampah) */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditStaff(staff)}
                            title="Edit Penugasan Petugas"
                            style={{
                              background: 'none',
                              border: '1px solid var(--pub-line)',
                              color: 'var(--pub-ink)',
                              cursor: 'pointer',
                              padding: '0.35rem 0.5rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              borderRadius: '6px',
                              backgroundColor: '#FFFFFF',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            }}
                          >
                            <Edit2 size={13} />
                          </button>

                          {/* Tombol Hapus Staf */}
                          <button
                            type="button"
                            onClick={() => handleDeleteStaff(staff.id)}
                            title="Hapus Akun Petugas"
                            style={{
                              background: 'none',
                              border: '1px solid #FECACA',
                              color: '#DC2626',
                              cursor: 'pointer',
                              padding: '0.35rem 0.5rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              borderRadius: '6px',
                              backgroundColor: '#FEF2F2',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. MODAL TAMBAH POS DP BARU (POP-UP NAMA POS & SOP)            */}
      {/* ============================================================== */}
      {showAddDpModal && (
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
          onClick={() => setShowAddDpModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '520px',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--pub-line)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.25rem',
                borderBottom: '1px solid var(--pub-line)',
                paddingBottom: '0.85rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span
                    style={{
                      backgroundColor: 'var(--pub-navy)',
                      color: '#FFFFFF',
                      fontSize: '0.675rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                    }}
                  >
                    POS KE-{dps.length + 1}
                  </span>
                  <span style={{ fontSize: '0.725rem', color: 'var(--pub-muted)', fontWeight: 600 }}>
                    Alur Lomba Berurutan
                  </span>
                </div>
                <h4
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: 'var(--pub-ink)',
                    margin: 0,
                  }}
                >
                  Tambah Pos DP Baru
                </h4>
                <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: '0.25rem 0 0 0' }}>
                  Pilih nama pos dan tentukan instruksi SOP yang wajib dipatuhi sebelum pos dimasukkan ke alur.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDpModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--pub-muted)',
                  padding: '0.25rem',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveNewDpModal} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* 1. Pilih Nama Pos */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.775rem',
                    fontWeight: 800,
                    color: 'var(--pub-ink)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Nama Pos DP <span style={{ color: 'var(--pub-coral)' }}>*</span>
                </label>
                <select
                  value={newDpSelectedType}
                  onChange={handleNewDpTypeChange}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.85rem',
                    border: '1.5px solid var(--pub-line)',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--pub-ink)',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <optgroup label="Pilihan Nama Pos Standar">
                    {STANDARD_DP_OPTIONS.map((opt) => (
                      <option key={opt.code} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </optgroup>

                  {customDpNames.length > 0 && (
                    <optgroup label="Nama Pos Kustom Sebelumnya">
                      {customDpNames.map((cName, idx) => (
                        <option key={`c-${idx}`} value={cName}>
                          {cName}
                        </option>
                      ))}
                    </optgroup>
                  )}

                  <optgroup label="Kustom / Tulis Sendiri">
                    <option value="__CUSTOM__">+ Tulis Nama Pos Kustom Mandiri...</option>
                  </optgroup>
                </select>
              </div>

              {/* 1b. Jika Opsi Kustom Dipilih: Input Teks Nama */}
              {newDpSelectedType === '__CUSTOM__' && (
                <div
                  style={{
                    backgroundColor: 'var(--pub-canvas)',
                    padding: '0.85rem',
                    borderRadius: '8px',
                    border: '1px dashed var(--pub-line)',
                  }}
                >
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: 'var(--pub-ink)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Tulis Nama Pos Kustom <span style={{ color: 'var(--pub-coral)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newDpCustomName}
                    onChange={(e) => setNewDpCustomName(e.target.value)}
                    placeholder="Contoh: Ruang Karantina Pasukan & Medis"
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      fontSize: '0.825rem',
                      border: '1px solid var(--pub-line)',
                      borderRadius: '6px',
                      fontWeight: 600,
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                  <p style={{ fontSize: '0.7rem', color: 'var(--pub-muted)', margin: '0.35rem 0 0 0' }}>
                    Nama ini akan disimpan ke daftar opsi kustom agar dapat digunakan kembali nanti.
                  </p>
                </div>
              )}

              {/* 2. Aktivitas & SOP */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.775rem',
                    fontWeight: 800,
                    color: 'var(--pub-ink)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Aktivitas & Instruksi SOP Pos <span style={{ color: 'var(--pub-coral)' }}>*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={newDpSop}
                  onChange={(e) => setNewDpSop(e.target.value)}
                  placeholder="Definisikan tugas operator, hal yang diperiksa, dan instruksi peleton di pos ini..."
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.8125rem',
                    border: '1.5px solid var(--pub-line)',
                    borderRadius: '8px',
                    fontWeight: 400,
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    fontFamily: 'inherit',
                    lineHeight: 1.5,
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--pub-muted)', display: 'block', marginTop: '0.25rem' }}>
                  Instruksi ini akan tampil di workstation operator pos pada hari H pelaksanaan.
                </span>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.65rem',
                  marginTop: '0.5rem',
                  borderTop: '1px solid var(--pub-line)',
                  paddingTop: '0.85rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddDpModal(false)}
                  style={{
                    padding: '0.6rem 1.15rem',
                    borderRadius: '8px',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--pub-ink)',
                    fontSize: '0.8125rem',
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
                    padding: '0.6rem 1.35rem',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <Plus size={15} />
                  <span>Tambahkan Pos DP</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. MODAL TAMBAH NAMA POS DP KUSTOM                             */}
      {/* ============================================================== */}
      {showAddCustomNameModal && (
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
          onClick={() => setShowAddCustomNameModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '460px',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--pub-line)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                  Tambah Nama Pos DP Kustom
                </h4>
                <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
                  Buat nama pos khusus baru di luar 4 pos standar lomba.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCustomNameModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pub-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCustomName} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Nama Pos Baru <span style={{ color: 'var(--pub-coral)' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customNameInput}
                  onChange={(e) => setCustomNameInput(e.target.value)}
                  placeholder="Contoh: Ruang Karantina & Cek Medis"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    fontSize: '0.8125rem',
                    border: '1px solid var(--pub-line)',
                    borderRadius: '8px',
                    fontWeight: 600,
                    outline: 'none',
                    backgroundColor: 'var(--pub-canvas)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Aktivitas & Instruksi SOP Pos (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={customSopInput}
                  onChange={(e) => setCustomSopInput(e.target.value)}
                  placeholder="Contoh: Pemeriksaan suhu tubuh, tensi darah, dan absensi komandan peleton sebelum masuk ke area steril."
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    fontSize: '0.8125rem',
                    border: '1px solid var(--pub-line)',
                    borderRadius: '8px',
                    fontWeight: 400,
                    outline: 'none',
                    backgroundColor: 'var(--pub-canvas)',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddCustomNameModal(false)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--pub-ink)',
                    fontSize: '0.8125rem',
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
                    padding: '0.55rem 1.25rem',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Simpan & Terapkan Nama Pos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. MODAL TAMBAH AKUN PETUGAS DP                                */}
      {/* ============================================================== */}
      {showAddStaffModal && (
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
          onClick={() => setShowAddStaffModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '460px',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--pub-line)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                  Tambah Petugas Pos DP
                </h4>
                <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
                  Buat akun akses workstation untuk operator pos lapangan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pub-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStaff} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Nama Lengkap Petugas
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="Contoh: Hendra Wijaya"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    border: '1px solid var(--pub-line)',
                    borderRadius: '6px',
                    fontWeight: 600,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Alamat Email (Login)
                </label>
                <input
                  type="email"
                  required
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="hendra.dp@kompas.id"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    border: '1px solid var(--pub-line)',
                    borderRadius: '6px',
                    fontWeight: 600,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Password Akses Awal
                </label>
                <input
                  type="password"
                  required
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    border: '1px solid var(--pub-line)',
                    borderRadius: '6px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Penugasan Pos DP
                </label>
                <select
                  value={findAssignedDp(newStaff.assignedDpId, dps)?.id || newStaff.assignedDpId || (dps[0]?.id || 1)}
                  onChange={(e) => setNewStaff({ ...newStaff, assignedDpId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    border: '1px solid var(--pub-line)',
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF',
                    fontWeight: 600,
                  }}
                >
                  {dps.map((d, idx) => (
                    <option key={d.id} value={d.id}>
                      Pos {String(idx + 1).padStart(2, '0')} — {extractBaseName(d.name)}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: '#FFFFFF',
                    fontSize: '0.8125rem',
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
                    padding: '0.55rem 1.25rem',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Simpan Petugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. MODAL EDIT AKUN PETUGAS DP                                  */}
      {/* ============================================================== */}
      {showEditStaffModal && editingStaff && (
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
          onClick={() => setShowEditStaffModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '460px',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--pub-line)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                  Edit Penugasan Petugas Pos DP
                </h4>
                <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
                  Perbarui nama, pos penugasan, atau status aktif operator.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditStaffModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pub-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditStaff} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Nama Lengkap Petugas
                </label>
                <input
                  type="text"
                  required
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    border: '1px solid var(--pub-line)',
                    borderRadius: '6px',
                    fontWeight: 600,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Alamat Email (Login)
                </label>
                <input
                  type="email"
                  required
                  value={editingStaff.email}
                  onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    border: '1px solid var(--pub-line)',
                    borderRadius: '6px',
                    fontWeight: 600,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Pos Penugasan
                </label>
                <select
                  value={findAssignedDp(editingStaff.assignedDpId, dps)?.id || editingStaff.assignedDpId || (dps[0]?.id || 1)}
                  onChange={(e) => setEditingStaff({ ...editingStaff, assignedDpId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    border: '1px solid var(--pub-line)',
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF',
                    fontWeight: 600,
                  }}
                >
                  {dps.map((d, idx) => (
                    <option key={d.id} value={d.id}>
                      Pos {String(idx + 1).padStart(2, '0')} — {extractBaseName(d.name)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Status Akses
                </label>
                <select
                  value={editingStaff.status}
                  onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    border: '1px solid var(--pub-line)',
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF',
                    fontWeight: 600,
                  }}
                >
                  <option value="AKTIF">AKTIF</option>
                  <option value="NONAKTIF">NONAKTIF</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowEditStaffModal(false)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: '#FFFFFF',
                    fontSize: '0.8125rem',
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
                    padding: '0.55rem 1.25rem',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
