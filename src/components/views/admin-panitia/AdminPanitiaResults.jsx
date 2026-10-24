import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  Printer,
  Eye,
  FileText,
  Download,
  CheckCircle2,
  Search,
  Filter,
  Sparkles,
  Trophy,
  Medal,
  Clock,
  Shield,
  UserCheck,
  ChevronRight,
  X,
  Volume2,
  Mic,
  Share2,
  Check,
  Layers,
} from 'lucide-react';

const STORAGE_KEY_OFFICIAL_RESULTS = 'kompas_official_results_data';

// Data Template 30 Aba-Aba Resmi Lembar Penilaian Juri Sesuai Screenshot
export const OFFICIAL_RUBRIC_ITEMS = [
  { id: 1, name: 'Sikap Sempurna', options: [8, 9, 10, 11, 12, 13, 14, 15] },
  { id: 2, name: 'Penghormatan', options: [8, 9, 10, 11, 12, 13, 14, 15] },
  { id: 3, name: 'Lencang Kanan', options: [8, 9, 10, 11, 12, 13, 14, 15] },
  { id: 4, name: 'Berhitung Saf & Banjar', options: [6, 8, 10, 12, 14, 16, 18, 20] },
  { id: 5, name: 'Hadap Kanan & Hadap Kiri', options: [6, 8, 10, 12, 14, 16, 18, 20] },
  { id: 6, name: 'Lari ke Langkah Biasa', options: [8, 10, 12, 14, 16, 18, 20, 22] },
  { id: 7, name: 'Ganti Langkah', options: [6, 8, 10, 12, 14, 16, 18, 20] },
  { id: 8, name: 'Balik Kanan Maju', options: [8, 10, 12, 14, 16, 18, 20, 22] },
  { id: 9, name: 'Langkah Biasa ke Langkah Perlahan', options: [8, 10, 12, 14, 16, 18, 20, 22] },
  { id: 10, name: 'Langkah Perlahan ke Langkah Biasa', options: [8, 10, 12, 14, 16, 18, 20, 22] },
  { id: 11, name: 'Dua Kali Belok Kiri', options: [10, 12, 14, 16, 18, 20, 22, 24] },
  { id: 12, name: 'Langkah Biasa ke Langkah Tegap', options: [8, 10, 12, 14, 16, 18, 20, 22] },
  { id: 13, name: 'Hormat Kanan', options: [8, 10, 12, 14, 16, 18, 20, 22] },
  { id: 14, name: 'Langkah Tegap ke Langkah Biasa', options: [8, 10, 12, 14, 16, 18, 20, 22] },
  { id: 15, name: 'Tiap Tiap Banjar Dua Kali Belok Kanan', options: [8, 10, 12, 14, 16, 18, 20, 22] },
  { id: 16, name: 'Melintang Kanan Maju', options: [12, 15, 18, 21, 24, 27, 30, 33] },
  { id: 17, name: 'Balik Kanan Maju', options: [8, 10, 12, 14, 16, 18, 20, 22] },
  { id: 18, name: 'Haluan Kanan', options: [5, 7, 9, 11, 13, 15, 17, 19] },
  { id: 19, name: 'Hadap Serong Kanan', options: [6, 8, 10, 12, 14, 16, 18, 20] },
  { id: 20, name: 'Hormat', options: [8, 9, 10, 11, 12, 13, 14, 15] },
  { id: 21, name: 'Istirahat Ditempat', options: [8, 9, 10, 11, 12, 13, 14, 15] },
  { id: 22, name: 'Parade Periksa Kerapian', options: [5, 8, 11, 14, 17, 20, 23, 26] },
  { id: 23, name: '3 Langkah ke Kanan', options: [6, 8, 10, 12, 14, 16, 18, 20] },
  { id: 24, name: '3 Langkah ke Depan', options: [6, 8, 10, 12, 14, 16, 18, 20] },
  { id: 25, name: 'Hadap Serong Kiri', options: [6, 8, 10, 12, 14, 16, 18, 20] },
  { id: 26, name: 'Lencang Kanan', options: [8, 9, 10, 11, 12, 13, 14, 15] },
  { id: 27, name: 'Bubar', options: [12, 15, 18, 21, 24, 27, 30, 33] },
  { id: 28, name: 'Variasi Formasi', options: [] },
  { id: 29, name: 'Bubar', options: [] },
];

// Helper untuk menghasilkan rincian aba-aba per tim sesuai total skor
export const getTeamScoreSheetRows = (teamRank = 1) => {
  return OFFICIAL_RUBRIC_ITEMS.map((item, idx) => {
    // Untuk Variasi Formasi (baris 28) & Bubar (baris 29) yang di lembar fisik kolom opsinya kosong
    if (!item.options || item.options.length === 0) {
      let selectedScore = 0;
      if (item.id === 28) {
        selectedScore = teamRank === 1 ? 25 : teamRank === 2 ? 26 : teamRank === 3 ? 20 : teamRank === 4 ? 18 : 15;
      } else if (item.id === 29) {
        selectedScore = teamRank === 1 ? 12 : teamRank === 2 ? 14 : teamRank === 3 ? 10 : teamRank === 4 ? 8 : 6;
      }
      return {
        ...item,
        selectedScore,
      };
    }

    // Pilih nilai berdasarkan peringkat (tim rank 1 mendapat opsi tertinggi)
    let selectedOptionIndex;
    if (teamRank === 1) {
      selectedOptionIndex = item.options.length - 1;
    } else if (teamRank === 2) {
      selectedOptionIndex = idx % 3 === 0 ? item.options.length - 2 : item.options.length - 1;
    } else if (teamRank === 3) {
      selectedOptionIndex = idx % 2 === 0 ? item.options.length - 2 : item.options.length - 3;
    } else if (teamRank === 4) {
      selectedOptionIndex = item.options.length - 3;
    } else {
      selectedOptionIndex = Math.max(0, item.options.length - 4 - (teamRank - 5));
    }

    const selectedScore = item.options[Math.min(selectedOptionIndex, item.options.length - 1)];

    return {
      ...item,
      selectedScore,
    };
  });
};

// 4 Aspek Penilaian Lengkap LKBB Paskibra: PBB, Variasi & Formasi, Danton, Make Up / Kostum
export const ASPECT_DEFINITIONS = [
  {
    key: 'pbb',
    title: 'A. LEMBAR PENILAIAN PBB MURNI & GERAKAN BAKU',
    shortTitle: 'PBB Murni',
    badgeText: '29 Gerakan Baku',
    badgeColor: { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' },
    maxScore: 600,
    items: OFFICIAL_RUBRIC_ITEMS,
  },
  {
    key: 'variasi',
    title: 'B. LEMBAR PENILAIAN VARIASI & FORMASI',
    shortTitle: 'Variasi & Formasi',
    badgeText: '3 Kriteria Rubrik',
    badgeColor: { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' },
    maxScore: 300,
    items: [
      { id: 'v1', name: 'Variasi Formasi Bentuk Simetris & Pola Lantai', options: [65, 70, 75, 80, 85, 90, 95, 100] },
      { id: 'v2', name: 'Variasi Dinamis & Koreografi Gerak Bebas', options: [65, 70, 75, 80, 85, 90, 95, 100] },
      { id: 'v3', name: 'Harmonisasi Suara, Yel-Yel & Musikalitas', options: [65, 70, 75, 80, 85, 90, 95, 100] },
    ],
  },
  {
    key: 'danton',
    title: 'C. LEMBAR PENILAIAN KOMANDAN PELETON (DANTON)',
    shortTitle: 'Komandan Peleton',
    badgeText: '2 Kriteria Rubrik',
    badgeColor: { bg: '#EDE9FE', text: '#6D28D9', border: '#DDD6FE' },
    maxScore: 200,
    items: [
      { id: 'd1', name: 'Artikulasi, Vokal & Intonasi Aba-Aba', options: [65, 70, 75, 80, 85, 90, 95, 100] },
      { id: 'd2', name: 'Sikap Komando & Penguasaan Peleton', options: [65, 70, 75, 80, 85, 90, 95, 100] },
    ],
  },
  {
    key: 'kostum',
    title: 'D. LEMBAR PENILAIAN MAKE UP & KOSTUM (KERAPIHAN)',
    shortTitle: 'Make Up & Kostum',
    badgeText: '2 Kriteria Rubrik',
    badgeColor: { bg: '#FCE7F3', text: '#BE185D', border: '#FBCFE8' },
    maxScore: 200,
    items: [
      { id: 'k1', name: 'Kerapihan Seragam, Atribut & Tutup Kepala', options: [65, 70, 75, 80, 85, 90, 95, 100] },
      { id: 'k2', name: 'Estetika Tata Rias Wajah & Keserasian Pasukan', options: [65, 70, 75, 80, 85, 90, 95, 100] },
    ],
  },
];

// Helper mengambil data rincian rubrik per aspek untuk tim tertentu
export const getAspectScoreRows = (aspectKey, team) => {
  if (!team) return [];
  const rank = team.rank;

  if (aspectKey === 'pbb') {
    return getTeamScoreSheetRows(rank);
  }

  if (aspectKey === 'variasi') {
    let scores = [95, 95, 95];
    if (rank === 2) scores = [95, 100, 95];
    else if (rank === 3) scores = [90, 95, 90];
    else if (rank === 4) scores = [90, 90, 90];
    else if (rank === 5) scores = [90, 85, 90];
    else if (rank === 6) scores = [85, 90, 85];
    else if (rank >= 7) scores = [85, 85, 85];

    const def = ASPECT_DEFINITIONS.find((a) => a.key === 'variasi');
    return def.items.map((item, idx) => ({
      ...item,
      selectedScore: scores[idx] || 90,
    }));
  }

  if (aspectKey === 'danton') {
    let scores = [95, 95];
    if (rank === 2) scores = [95, 90];
    else if (rank === 3) scores = [100, 95];
    else if (rank === 4) scores = [90, 90];
    else if (rank === 5) scores = [90, 85];
    else if (rank === 6) scores = [90, 90];
    else if (rank >= 7) scores = [85, 90];

    const def = ASPECT_DEFINITIONS.find((a) => a.key === 'danton');
    return def.items.map((item, idx) => ({
      ...item,
      selectedScore: scores[idx] || 90,
    }));
  }

  if (aspectKey === 'kostum') {
    let scores = [95, 90];
    if (rank === 2) scores = [95, 95];
    else if (rank === 3) scores = [90, 90];
    else if (rank === 4) scores = [100, 95];
    else if (rank === 5) scores = [95, 90];
    else if (rank === 6) scores = [90, 90];
    else if (rank >= 7) scores = [85, 90];

    const def = ASPECT_DEFINITIONS.find((a) => a.key === 'kostum');
    return def.items.map((item, idx) => ({
      ...item,
      selectedScore: scores[idx] || 90,
    }));
  }

  return [];
};

// Data Hasil Resmi 7 Tim Simulasi LKBB Paskibra
export const DEFAULT_OFFICIAL_RESULTS = [
  {
    rank: 1,
    teamId: 'team-01',
    orderNumber: '01',
    regCode: 'LKBB-2026-001',
    school: 'SMAN 1 Jakarta',
    teamName: 'PASKIBRA GARUDA SAKTI',
    danton: 'Fakhri Pratama Yudha',
    category: 'SMA/SMK Sederajat',
    performanceTime: '08:30 – 08:39 WIB',
    duration: '09:15 Menit',
    totalScore: 1035,
    rubricTotal: 600, // Total skor lembar rubrik sesuai screenshot
    averageScore: 86.25,
    trophyTitle: 'JUARA UTAMA 1',
    badgeColor: { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' },
    status: 'TERVALIDASI DEWAN JURI',
    categoryScores: {
      pbb: { name: 'PBB Murni (8 Gerakan)', score: 375, max: 400 },
      variasi: { name: 'Variasi & Formasi (3 Rubrik)', score: 285, max: 300 },
      danton: { name: 'Komandan Peleton (2 Rubrik)', score: 190, max: 200 },
      kostum: { name: 'Make Up & Kostum (2 Rubrik)', score: 185, max: 200 },
    },
    penalty: 0,
    judgeScores: [
      { judgeId: 'juri-1', name: 'Kolonel (Purn) Bambang S., M.Pd', role: 'Ketua Dewan Juri / PBB', score: 280 },
      { judgeId: 'juri-2', name: 'Mayor Aris Setiawan', role: 'Juri 2 / PBB', score: 275 },
      { judgeId: 'juri-3', name: 'Kapten Kav. Hendra Gunawan', role: 'Juri 3 / PBB', score: 285 },
      { judgeId: 'juri-4', name: 'Dra. Endang Lestari', role: 'Juri 4 / Variasi & Formasi', score: 195 },
      { judgeId: 'juri-5', name: 'Rian Syahputra, S.Sn', role: 'Juri 5 / Variasi & Kostum', score: 190 },
    ],
    aiFeedback: {
      rawVoiceText: 'sikap sempurna mantap langkah tegap hormat kanan sudut presisi variasi rapi saf tiga tempo ayunan tangan agak mendahului ketukan peluit',
      refinedFeedback: 'Sikap sempurna dan langkah tegap peleton sangat kokoh dan bertenaga. Kerapihan sudut hormat kanan 15 derajat sangat presisi. Catatan evaluasi dewan juri: tempo ayunan tangan pada saf ketiga sedikit mendahului ketukan peluit, pertahankan kekompakan hentakan kaki saat transisi variasi.',
      recordedAt: '08:40 WIB',
    },
  },
  {
    rank: 2,
    teamId: 'team-02',
    orderNumber: '02',
    regCode: 'LKBB-2026-002',
    school: 'SMAN 3 Bandung',
    teamName: 'PASKIBRA DWI WARNA',
    danton: 'Ahmad Faisal',
    category: 'SMA/SMK Sederajat',
    performanceTime: '08:45 – 08:54 WIB',
    duration: '09:40 Menit',
    totalScore: 1030,
    rubricTotal: 585,
    averageScore: 85.83,
    trophyTitle: 'JUARA UTAMA 2',
    badgeColor: { bg: '#E2E8F0', text: '#334155', border: '#CBD5E1' },
    status: 'TERVALIDASI DEWAN JURI',
    categoryScores: {
      pbb: { name: 'PBB Murni (8 Gerakan)', score: 365, max: 400 },
      variasi: { name: 'Variasi & Formasi (3 Rubrik)', score: 290, max: 300 },
      danton: { name: 'Komandan Peleton (2 Rubrik)', score: 185, max: 200 },
      kostum: { name: 'Make Up & Kostum (2 Rubrik)', score: 190, max: 200 },
    },
    penalty: 0,
    judgeScores: [
      { judgeId: 'juri-1', name: 'Kolonel (Purn) Bambang S., M.Pd', role: 'Ketua Dewan Juri / PBB', score: 275 },
      { judgeId: 'juri-2', name: 'Mayor Aris Setiawan', role: 'Juri 2 / PBB', score: 270 },
      { judgeId: 'juri-3', name: 'Kapten Kav. Hendra Gunawan', role: 'Juri 3 / PBB', score: 275 },
      { judgeId: 'juri-4', name: 'Dra. Endang Lestari', role: 'Juri 4 / Variasi & Formasi', score: 198 },
      { judgeId: 'juri-5', name: 'Rian Syahputra, S.Sn', role: 'Juri 5 / Variasi & Kostum', score: 192 },
    ],
    aiFeedback: {
      rawVoiceText: 'variasi formasi luar biasa dinamis estetika panggung hidup yel yel lantang pbb murni stabil putaran balik kanan tegas',
      refinedFeedback: 'Variasi formasi sangat dinamis dan memukau dewan juri seni panggung. Harmonisasi yel-yel lantang dan serempak. PBB murni cukup stabil dengan poros tumit balik kanan yang tegas dan tidak goyang.',
      recordedAt: '08:55 WIB',
    },
  },
  {
    rank: 3,
    teamId: 'team-03',
    orderNumber: '03',
    regCode: 'LKBB-2026-003',
    school: 'SMKN 2 Bogor',
    teamName: 'PASKIBRA KSATRIA PANDAWA',
    danton: 'M. Rizky Pratama',
    category: 'SMA/SMK Sederajat',
    performanceTime: '09:00 – 09:09 WIB',
    duration: '09:30 Menit',
    totalScore: 1010,
    rubricTotal: 568,
    averageScore: 84.16,
    trophyTitle: 'JUARA UTAMA 3',
    badgeColor: { bg: '#FFEDD5', text: '#C2410C', border: '#FED7AA' },
    status: 'TERVALIDASI DEWAN JURI',
    categoryScores: {
      pbb: { name: 'PBB Murni (8 Gerakan)', score: 360, max: 400 },
      variasi: { name: 'Variasi & Formasi (3 Rubrik)', score: 275, max: 300 },
      danton: { name: 'Komandan Peleton (2 Rubrik)', score: 195, max: 200 },
      kostum: { name: 'Make Up & Kostum (2 Rubrik)', score: 180, max: 200 },
    },
    penalty: 0,
    judgeScores: [
      { judgeId: 'juri-1', name: 'Kolonel (Purn) Bambang S., M.Pd', role: 'Ketua Dewan Juri / PBB', score: 270 },
      { judgeId: 'juri-2', name: 'Mayor Aris Setiawan', role: 'Juri 2 / PBB', score: 265 },
      { judgeId: 'juri-3', name: 'Kapten Kav. Hendra Gunawan', role: 'Juri 3 / PBB', score: 270 },
      { judgeId: 'juri-4', name: 'Dra. Endang Lestari', role: 'Juri 4 / Variasi & Formasi', score: 185 },
      { judgeId: 'juri-5', name: 'Rian Syahputra, S.Sn', role: 'Juri 5 / Variasi & Kostum', score: 180 },
    ],
    aiFeedback: {
      rawVoiceText: 'danton sangat prima suara menggelegar aba aba jelas postur gagah formasi tengah sedikit kurang rapat',
      refinedFeedback: 'Artikulasi dan intonasi komandan peleton sangat prima. Aba-aba petunjuk dan peringatan terdengar sangat jelas di seluruh penjuru tribun. Catatan: kerapihan jarak banjar pada saat variasi tengah perlu diperkecil agar tidak renggang.',
      recordedAt: '09:10 WIB',
    },
  },
  {
    rank: 4,
    teamId: 'team-04',
    orderNumber: '04',
    regCode: 'LKBB-2026-004',
    school: 'SMAN 5 Depok',
    teamName: 'PASKIBRA SATYA BHAKTI',
    danton: 'Bagas Aditya',
    category: 'SMA/SMK Sederajat',
    performanceTime: '09:15 – 09:24 WIB',
    duration: '09:20 Menit',
    totalScore: 995,
    rubricTotal: 552,
    averageScore: 82.91,
    trophyTitle: 'JUARA HARAPAN 1',
    badgeColor: { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' },
    status: 'TERVALIDASI DEWAN JURI',
    categoryScores: {
      pbb: { name: 'PBB Murni (8 Gerakan)', score: 350, max: 400 },
      variasi: { name: 'Variasi & Formasi (3 Rubrik)', score: 270, max: 300 },
      danton: { name: 'Komandan Peleton (2 Rubrik)', score: 180, max: 200 },
      kostum: { name: 'Make Up & Kostum (2 Rubrik)', score: 195, max: 200 },
    },
    penalty: 0,
    judgeScores: [
      { judgeId: 'juri-1', name: 'Kolonel (Purn) Bambang S., M.Pd', role: 'Ketua Dewan Juri / PBB', score: 265 },
      { judgeId: 'juri-2', name: 'Mayor Aris Setiawan', role: 'Juri 2 / PBB', score: 260 },
      { judgeId: 'juri-3', name: 'Kapten Kav. Hendra Gunawan', role: 'Juri 3 / PBB', score: 265 },
      { judgeId: 'juri-4', name: 'Dra. Endang Lestari', role: 'Juri 4 / Variasi & Formasi', score: 180 },
      { judgeId: 'juri-5', name: 'Rian Syahputra, S.Sn', role: 'Juri 5 / Variasi & Kostum', score: 195 },
    ],
    aiFeedback: {
      rawVoiceText: 'kostum sangat rapi riasan wajah serasi lencana atribut lurus kerapihan seragam sempurna',
      refinedFeedback: 'Kerapihan seragam, kelurusan tali peluit, dasi, dan estetika tata rias wajah sangat istimewa dan serasi dengan tema pasukan. PBB murni cukup solid, tingkatkan ketegasan hentakan langkah tegap.',
      recordedAt: '09:25 WIB',
    },
  },
  {
    rank: 5,
    teamId: 'team-05',
    orderNumber: '05',
    regCode: 'LKBB-2026-005',
    school: 'SMA Labschool Kebayoran',
    teamName: 'PASKIBRA TARUNA SAKTI',
    danton: 'Dion Permana',
    category: 'SMA/SMK Sederajat',
    performanceTime: '09:30 – 09:40 WIB',
    duration: '09:55 Menit',
    totalScore: 975,
    rubricTotal: 538,
    averageScore: 81.25,
    trophyTitle: 'JUARA HARAPAN 2',
    badgeColor: { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' },
    status: 'TERVALIDASI DEWAN JURI',
    categoryScores: {
      pbb: { name: 'PBB Murni (8 Gerakan)', score: 355, max: 400 },
      variasi: { name: 'Variasi & Formasi (3 Rubrik)', score: 265, max: 300 },
      danton: { name: 'Komandan Peleton (2 Rubrik)', score: 175, max: 200 },
      kostum: { name: 'Make Up & Kostum (2 Rubrik)', score: 185, max: 200 },
    },
    penalty: -5,
    judgeScores: [
      { judgeId: 'juri-1', name: 'Kolonel (Purn) Bambang S., M.Pd', role: 'Ketua Dewan Juri / PBB', score: 260 },
      { judgeId: 'juri-2', name: 'Mayor Aris Setiawan', role: 'Juri 2 / PBB', score: 255 },
      { judgeId: 'juri-3', name: 'Kapten Kav. Hendra Gunawan', role: 'Juri 3 / PBB', score: 260 },
      { judgeId: 'juri-4', name: 'Dra. Endang Lestari', role: 'Juri 4 / Variasi & Formasi', score: 175 },
      { judgeId: 'juri-5', name: 'Rian Syahputra, S.Sn', role: 'Juri 5 / Variasi & Kostum', score: 180 },
    ],
    aiFeedback: {
      rawVoiceText: 'pbb bagus berhimpun rapi ada penalti minus lima kena garis batas kiri panggung',
      refinedFeedback: 'Kekompakan berhimpun dan lencang kanan sangat baik. Dikenakan penalti minor (-5 poin) akibat sentuhan ujung kaki pasukan pada garis pembatas batas kiri panggung.',
      recordedAt: '09:41 WIB',
    },
  },
  {
    rank: 6,
    teamId: 'team-06',
    orderNumber: '06',
    regCode: 'LKBB-2026-006',
    school: 'MAN 1 Kota Bekasi',
    teamName: 'PASKIBRA BINTANG SEMBILAN',
    danton: 'Irfan Hakim',
    category: 'SMA/SMK Sederajat',
    performanceTime: '09:45 – 09:55 WIB',
    duration: '10:00 Menit',
    totalScore: 965,
    rubricTotal: 520,
    averageScore: 80.41,
    trophyTitle: 'JUARA HARAPAN 3',
    badgeColor: { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' },
    status: 'TERVALIDASI DEWAN JURI',
    categoryScores: {
      pbb: { name: 'PBB Murni (8 Gerakan)', score: 345, max: 400 },
      variasi: { name: 'Variasi & Formasi (3 Rubrik)', score: 260, max: 300 },
      danton: { name: 'Komandan Peleton (2 Rubrik)', score: 180, max: 200 },
      kostum: { name: 'Make Up & Kostum (2 Rubrik)', score: 180, max: 200 },
    },
    penalty: 0,
    judgeScores: [
      { judgeId: 'juri-1', name: 'Kolonel (Purn) Bambang S., M.Pd', role: 'Ketua Dewan Juri / PBB', score: 255 },
      { judgeId: 'juri-2', name: 'Mayor Aris Setiawan', role: 'Juri 2 / PBB', score: 250 },
      { judgeId: 'juri-3', name: 'Kapten Kav. Hendra Gunawan', role: 'Juri 3 / PBB', score: 255 },
      { judgeId: 'juri-4', name: 'Dra. Endang Lestari', role: 'Juri 4 / Variasi & Formasi', score: 175 },
      { judgeId: 'juri-5', name: 'Rian Syahputra, S.Sn', role: 'Juri 5 / Variasi & Kostum', score: 175 },
    ],
    aiFeedback: {
      rawVoiceText: 'semangat tinggi tempo jalan di tempat stabil transisi balik kanan perlu dipertajam',
      refinedFeedback: 'Semangat dan artikulasi pasukan sangat baik. Tempo jalan di tempat teratur. Perlu peningkatan sinkronisasi hentakan kaki penutup saat transisi balik kanan.',
      recordedAt: '09:56 WIB',
    },
  },
  {
    rank: 7,
    teamId: 'team-07',
    orderNumber: '07',
    regCode: 'LKBB-2026-007',
    school: 'SMAN 8 Tangerang',
    teamName: 'PASKIBRA TRI DHARMA',
    danton: 'Yoga Pratama',
    category: 'SMA/SMK Sederajat',
    performanceTime: '10:00 – 10:10 WIB',
    duration: '09:45 Menit',
    totalScore: 950,
    rubricTotal: 505,
    averageScore: 79.16,
    trophyTitle: 'PERINGKAT 7',
    badgeColor: { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' },
    status: 'TERVALIDASI DEWAN JURI',
    categoryScores: {
      pbb: { name: 'PBB Murni (8 Gerakan)', score: 340, max: 400 },
      variasi: { name: 'Variasi & Formasi (3 Rubrik)', score: 255, max: 300 },
      danton: { name: 'Komandan Peleton (2 Rubrik)', score: 175, max: 200 },
      kostum: { name: 'Make Up & Kostum (2 Rubrik)', score: 180, max: 200 },
    },
    penalty: 0,
    judgeScores: [
      { judgeId: 'juri-1', name: 'Kolonel (Purn) Bambang S., M.Pd', role: 'Ketua Dewan Juri / PBB', score: 250 },
      { judgeId: 'juri-2', name: 'Mayor Aris Setiawan', role: 'Juri 2 / PBB', score: 250 },
      { judgeId: 'juri-3', name: 'Kapten Kav. Hendra Gunawan', role: 'Juri 3 / PBB', score: 250 },
      { judgeId: 'juri-4', name: 'Dra. Endang Lestari', role: 'Juri 4 / Variasi & Formasi', score: 170 },
      { judgeId: 'juri-5', name: 'Rian Syahputra, S.Sn', role: 'Juri 5 / Variasi & Kostum', score: 175 },
    ],
    aiFeedback: {
      rawVoiceText: 'formasi awal rapi perhatikan hentakan penutup hadap serong kanan',
      refinedFeedback: 'Formasi awal simetris dan rapi. Perlu peningkatan sinkronisasi hentakan kaki penutup hadap serong kanan serta kestabilan bahu saat penghormatan umum.',
      recordedAt: '10:11 WIB',
    },
  },
];

export default function AdminPanitiaResults() {
  const [results, setResults] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OFFICIAL_RESULTS);
      return saved ? JSON.parse(saved) : DEFAULT_OFFICIAL_RESULTS;
    } catch {
      return DEFAULT_OFFICIAL_RESULTS;
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null); // Modal view lembar cek nilai per aba-aba
  const [activeAspectTab, setActiveAspectTab] = useState('all'); // 'all', 'pbb', 'variasi', 'danton', 'kostum'
  const [showCheckMarks, setShowCheckMarks] = useState(true); // Toggle mode cek (lingkaran merah nilai dewan juri)
  const [toastMessage, setToastMessage] = useState(null);
  const scrollContainerRef = useRef(null);

  // Reset scroll ke atas saat tim atau tab aspek diganti
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [selectedTeam, activeAspectTab]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter Search
  const filteredResults = results.filter(
    (r) =>
      r.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.orderNumber.includes(searchTerm)
  );

  // Trigger Print / Cetak PDF Hasil Akhir Resmi (Sesuai Aspek & Kop Resmi yang Sudah Benar)
  const handlePrintScorecard = (team) => {
    showToast(`Membuka jendela cetak PDF resmi untuk ${team.school}...`);

    const printWindow = window.open('', '_blank', 'width=900,height=750');
    if (!printWindow) {
      alert('Pop-up browser diblokir. Harap izinkan pop-up untuk mencetak PDF.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>LEMBAR HASIL PENILAIAN RESMI - ${team.school}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0F172A; padding: 40px; margin: 0; }
          .header { text-align: center; border-bottom: 3px double #0F172A; padding-bottom: 15px; margin-bottom: 25px; }
          .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; }
          .header h2 { margin: 5px 0; font-size: 15px; color: #475569; }
          .header p { margin: 0; font-size: 12px; color: #64748B; }
          .info-table { width: 100%; margin-bottom: 25px; border-collapse: collapse; }
          .info-table td { padding: 6px 10px; font-size: 13px; border: 1px solid #E2E8F0; }
          .info-table .label { font-weight: bold; background-color: #F8FAFC; width: 25%; }
          .score-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          .score-table th, .score-table td { border: 1px solid #0F172A; padding: 8px 10px; font-size: 13px; text-align: left; }
          .score-table th { background-color: #F1F5F9; font-weight: bold; text-transform: uppercase; }
          .total-row { font-weight: bold; font-size: 15px; background-color: #FEF3C7; }
          .feedback-box { border: 1px solid #CBD5E1; background-color: #F8FAFC; padding: 15px; border-radius: 6px; margin-bottom: 30px; }
          .feedback-box h4 { margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #991B1B; }
          .feedback-box p { margin: 0; font-size: 12px; line-height: 1.6; }
          .signature-section { display: flex; justify-content: space-between; margin-top: 40px; }
          .sig-box { width: 45%; text-align: center; font-size: 12px; }
          .sig-line { margin-top: 60px; border-top: 1px solid #0F172A; font-weight: bold; }
          @media print {
            body { padding: 20px; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PANITIA PELAKSANA LKBB NASIONAL PASKIBRA 2026</h1>
          <h2>LEMBAR REKAPITULASI HASIL PENILAIAN & EVALUASI DEWAN JURI</h2>
          <p>Sistem Pengendalian Alur & Penilaian Terpadu KOMPAS (Ref: ${team.regCode})</p>
        </div>

        <table class="info-table">
          <tr>
            <td class="label">Nama Kontingen / Sekolah</td>
            <td><strong>${team.school}</strong> (${team.teamName})</td>
            <td class="label">Nomor Urut Tampil</td>
            <td><strong>NO. ${team.orderNumber}</strong></td>
          </tr>
          <tr>
            <td class="label">Komandan Peleton (Danton)</td>
            <td>${team.danton}</td>
            <td class="label">Waktu & Durasi Tampil</td>
            <td>${team.performanceTime} (${team.duration})</td>
          </tr>
          <tr>
            <td class="label">Peringkat Akhir</td>
            <td><strong style="color: #991B1B; font-size: 14px;">${team.trophyTitle}</strong></td>
            <td class="label">Status Verifikasi</td>
            <td>✓ ${team.status}</td>
          </tr>
        </table>

        <table class="score-table">
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">No</th>
              <th>Komponen Kategori Penilaian</th>
              <th style="width: 120px; text-align: center;">Skor Maksimal</th>
              <th style="width: 120px; text-align: center;">Nilai Perolehan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center;">1</td>
              <td>${team.categoryScores.pbb.name}</td>
              <td style="text-align: center;">${team.categoryScores.pbb.max}</td>
              <td style="text-align: center; font-weight: bold;">${team.categoryScores.pbb.score}</td>
            </tr>
            <tr>
              <td style="text-align: center;">2</td>
              <td>${team.categoryScores.variasi.name}</td>
              <td style="text-align: center;">${team.categoryScores.variasi.max}</td>
              <td style="text-align: center; font-weight: bold;">${team.categoryScores.variasi.score}</td>
            </tr>
            <tr>
              <td style="text-align: center;">3</td>
              <td>${team.categoryScores.danton.name}</td>
              <td style="text-align: center;">${team.categoryScores.danton.max}</td>
              <td style="text-align: center; font-weight: bold;">${team.categoryScores.danton.score}</td>
            </tr>
            <tr>
              <td style="text-align: center;">4</td>
              <td>${team.categoryScores.kostum.name}</td>
              <td style="text-align: center;">${team.categoryScores.kostum.max}</td>
              <td style="text-align: center; font-weight: bold;">${team.categoryScores.kostum.score}</td>
            </tr>
            <tr>
              <td style="text-align: center;">5</td>
              <td>Pengurangan Nilai / Penalti Pelanggaran</td>
              <td style="text-align: center;">-</td>
              <td style="text-align: center; color: ${team.penalty < 0 ? '#DC2626' : '#059669'}; font-weight: bold;">${team.penalty} Poin</td>
            </tr>
            <tr class="total-row">
              <td colspan="3" style="text-align: right; padding-right: 15px;">TOTAL NILAI AKHIR:</td>
              <td style="text-align: center; font-size: 16px;">${team.totalScore} Poin</td>
            </tr>
          </tbody>
        </table>

        <div class="feedback-box">
          <h4>Catatan Evaluasi Resmi Dewan Juri (Voice AI Transcript):</h4>
          <p>"${team.aiFeedback.refinedFeedback}"</p>
        </div>

        <div class="signature-section">
          <div class="sig-box">
            Mengetahui,<br><strong>Ketua Panitia Pelaksana</strong>
            <div class="sig-line">Rian Pratama, S.Pd</div>
          </div>
          <div class="sig-box">
            Ditetapkan di Jakarta, 24 Oktober 2026<br><strong>Ketua Dewan Juri</strong>
            <div class="sig-line">Kolonel (Purn) Bambang S., M.Pd</div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <button onclick="window.print()" style="padding: 10px 20px; font-weight: bold; background-color: #0F172A; color: #FFF; border: none; border-radius: 6px; cursor: pointer;">
            🖨️ Cetak Dokumen PDF Ini
          </button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
  };

  // Cetak Seluruh Rekapitulasi Juara LKBB
  const handlePrintFullRecap = () => {
    showToast('Menyiapkan rekapitulasi lengkap seluruh kontingen juara...');
    const printWindow = window.open('', '_blank', 'width=950,height=800');
    if (!printWindow) return;

    const rows = results
      .map(
        (r) => `
        <tr>
          <td style="text-align: center; font-weight: bold;">${r.rank}</td>
          <td><strong>${r.school}</strong><br><span style="color: #64748B; font-size: 11px;">${r.teamName} (No. ${r.orderNumber})</span></td>
          <td style="text-align: center;">${r.performanceTime}</td>
          <td style="text-align: center;">${r.categoryScores.pbb.score}</td>
          <td style="text-align: center;">${r.categoryScores.variasi.score}</td>
          <td style="text-align: center;">${r.categoryScores.danton.score}</td>
          <td style="text-align: center;">${r.categoryScores.kostum.score}</td>
          <td style="text-align: center; font-weight: bold; font-size: 14px;">${r.totalScore}</td>
          <td style="text-align: center; font-weight: bold; color: #991B1B;">${r.trophyTitle}</td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>REKAPITULASI RESMI JUARA LKBB NASIONAL 2026</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0F172A; padding: 30px; }
          .header { text-align: center; border-bottom: 3px double #0F172A; padding-bottom: 12px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 25px; }
          th, td { border: 1px solid #0F172A; padding: 7px 8px; }
          th { background-color: #F1F5F9; text-transform: uppercase; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h2 style="margin:0;">REKAPITULASI HASIL RESMI PERLOMBAAN LKBB 2026</h2>
          <p style="margin:4px 0 0 0; color:#475569; font-size:12px;">Daftar Nilai Lengkap Seluruh Peserta Berdasarkan Keputusan Dewan Juri</p>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width:35px;">Rank</th>
              <th>Sekolah & Pasukan</th>
              <th style="width:130px;">Waktu Tampil</th>
              <th style="width:55px;">PBB</th>
              <th style="width:55px;">Variasi</th>
              <th style="width:55px;">Danton</th>
              <th style="width:55px;">Kostum</th>
              <th style="width:75px;">Total</th>
              <th style="width:120px;">Predikat</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <div style="text-align: right; margin-top: 30px; font-size: 12px;">
          Jakarta, 24 Oktober 2026<br>
          <strong>Ketua Dewan Juri</strong><br><br><br><br>
          <strong>( Kolonel (Purn) Bambang S., M.Pd )</strong>
        </div>
        <div style="text-align:center; margin-top:20px;">
          <button onclick="window.print()" style="padding:8px 16px; font-weight:bold; background:#0F172A; color:#FFF; border:none; border-radius:4px; cursor:pointer;">
            🖨️ Cetak Lembar Rekap Ini
          </button>
        </div>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Ambil list baris lembar nilai untuk tim yang sedang dibuka di modal View
  const scoreSheetRows = selectedTeam ? getTeamScoreSheetRows(selectedTeam.rank) : [];
  const scoreSheetTotal = scoreSheetRows.reduce((acc, row) => acc + row.selectedScore, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', fontFamily: 'var(--font-sans)' }}>
      {/* 1. Header Banner Hasil & Publikasi */}
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
                backgroundColor: 'var(--emerald-light)',
                color: 'var(--emerald-text)',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.725rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Trophy size={13} />
              HASIL AKHIR RESMI LKBB
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-slate)' }}>
              {results.length} Tim Selesai Tampil & Dinilai Dewan Juri
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
            Daftar Nilai Akhir & Publikasi Hasil Lomba
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: 0, maxWidth: '680px' }}>
            Rekapitulasi nilai terpadu seluruh peserta. Klik <strong>View</strong> untuk mengecek lembar nilai per aba-aba yang tersusun rapi atau tombol <strong>Cetak PDF</strong> untuk dokumen hasil akhir resmi.
          </p>
        </div>

        {/* Global Print & Publish Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handlePrintFullRecap}
            className="pub-btn-outline"
            style={{
              fontSize: '0.8125rem',
              padding: '0.55rem 1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 600,
            }}
            title="Cetak Rekapitulasi Lengkap Seluruh Juara"
          >
            <Printer size={14} />
            <span>Cetak Rekapitulasi (PDF)</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Hasil resmi berhasil dipublikasikan ke portal peserta & pengumuman publik!')}
            className="pub-btn-coral"
            style={{
              fontSize: '0.8125rem',
              padding: '0.55rem 1.15rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 700,
              boxShadow: '0 2px 4px rgba(201, 75, 60, 0.2)',
            }}
          >
            <Share2 size={14} />
            <span>Publikasikan ke Peserta</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div
          style={{
            backgroundColor: 'var(--emerald-light)',
            color: 'var(--emerald-text)',
            border: '1px solid var(--emerald)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontSize: '0.825rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. TABEL HASIL AKHIR SESUAI PERMINTAAN USER */}
      {/* Kolom: no | sekolah | waktu tampil | button view | tombol cepat cetak pdf */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          overflow: 'hidden',
        }}
      >
        {/* Search & Filter Header Bar */}
        <div
          style={{
            padding: '1.15rem 1.5rem',
            borderBottom: '1px solid var(--pub-line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
              Tabel Rekapitulasi Nilai Akhir Pasukan
            </h3>
            <span
              style={{
                fontSize: '0.725rem',
                fontWeight: 700,
                backgroundColor: 'var(--pub-sand)',
                color: 'var(--pub-navy)',
                padding: '0.15rem 0.55rem',
                borderRadius: '6px',
              }}
            >
              {filteredResults.length} Peserta
            </span>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--pub-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Cari sekolah, peleton, no urut..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                fontSize: '0.8125rem',
                borderRadius: '8px',
                border: '1px solid var(--pub-line)',
                backgroundColor: 'var(--pub-canvas)',
              }}
            />
          </div>
        </div>

        {/* Tabel Rekapitulasi */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--pub-canvas)',
                  borderBottom: '1.5px solid var(--pub-line)',
                  color: 'var(--muted-slate)',
                  textTransform: 'uppercase',
                  fontSize: '0.7rem',
                  letterSpacing: '0.05em',
                  fontWeight: 700,
                }}
              >
                <th style={{ padding: '0.85rem 1rem', width: '60px', textAlign: 'center' }}>No</th>
                <th style={{ padding: '0.85rem 1rem' }}>Sekolah & Pasukan</th>
                <th style={{ padding: '0.85rem 1rem', width: '180px' }}>Waktu Tampil</th>
                <th style={{ padding: '0.85rem 1rem', width: '140px', textAlign: 'center' }}>Total Nilai</th>
                <th style={{ padding: '0.85rem 1rem', width: '220px', textAlign: 'right' }}>Aksi / Cetak</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((team, idx) => {
                const isTop3 = team.rank <= 3;
                return (
                  <tr
                    key={team.teamId}
                    style={{
                      borderBottom: '1px solid var(--pub-line)',
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FBFBFA',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {/* 1. NO (PERINGKAT JUARA) */}
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span
                          className="tabular-nums"
                          style={{
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            color: isTop3 ? 'var(--pub-coral)' : 'var(--pub-navy)',
                          }}
                        >
                          {team.rank}
                        </span>
                        {team.rank === 1 && (
                          <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#B45309' }}>🥇</span>
                        )}
                        {team.rank === 2 && (
                          <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#475569' }}>🥈</span>
                        )}
                        {team.rank === 3 && (
                          <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#C2410C' }}>🥉</span>
                        )}
                      </div>
                    </td>

                    {/* 2. SEKOLAH & PASUKAN */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span
                          className="tabular-nums"
                          style={{
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            backgroundColor: 'var(--pub-navy)',
                            color: '#FFFFFF',
                            padding: '0.12rem 0.4rem',
                            borderRadius: '4px',
                          }}
                        >
                          NO. {team.orderNumber}
                        </span>
                        <span style={{ fontWeight: 800, fontSize: '0.925rem', color: 'var(--pub-ink)', fontFamily: 'var(--font-heading)' }}>
                          {team.school}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--pub-coral)' }}>
                          ({team.teamName})
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--pub-muted)', flexWrap: 'wrap' }}>
                        <span>Danton: <strong style={{ color: 'var(--slate-text)' }}>{team.danton}</strong></span>
                        <span>•</span>
                        <span
                          style={{
                            fontWeight: 700,
                            backgroundColor: team.badgeColor.bg,
                            color: team.badgeColor.text,
                            padding: '0.08rem 0.4rem',
                            borderRadius: '4px',
                            fontSize: '0.675rem',
                          }}
                        >
                          {team.trophyTitle}
                        </span>
                      </div>
                    </td>

                    {/* 3. WAKTU TAMPIL */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--pub-ink)', fontWeight: 600, fontSize: '0.825rem' }}>
                        <Clock size={13} style={{ color: 'var(--pub-coral)', flexShrink: 0 }} />
                        <span>{team.performanceTime}</span>
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>
                        Durasi Panggung: <strong className="tabular-nums" style={{ color: 'var(--slate-text)' }}>{team.duration}</strong>
                      </div>
                    </td>

                    {/* 4. TOTAL NILAI */}
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div
                        className="tabular-nums"
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          color: 'var(--pub-navy)',
                        }}
                      >
                        {team.totalScore}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--pub-muted)', marginTop: '0.1rem' }}>
                        Rata-Rata: <strong className="tabular-nums">{team.averageScore}</strong>
                      </div>
                    </td>

                    {/* 5. AKSI: VIEW NILAI KESELURUHAN & TOMBOL CEPAT CETAK PDF */}
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                        {/* BUTTON VIEW (LIHAT NILAI KESELURUHAN SEPERTI DI SCREENSHOT) */}
                        <button
                          type="button"
                          onClick={() => setSelectedTeam(team)}
                          className="pub-btn-outline"
                          style={{
                            fontSize: '0.775rem',
                            padding: '0.45rem 0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontWeight: 600,
                          }}
                          title="Lihat Lembar Cek Nilai Per Aba-Aba"
                        >
                          <Eye size={13} style={{ color: 'var(--pub-coral)' }} />
                          <span>View</span>
                        </button>

                        {/* TOMBOL CEPAT CETAK PDF (HASIL AKHIR ASPEK SESUAI KEBUTUHAN) */}
                        <button
                          type="button"
                          onClick={() => handlePrintScorecard(team)}
                          className="pub-btn-coral"
                          style={{
                            fontSize: '0.775rem',
                            padding: '0.45rem 0.85rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontWeight: 700,
                          }}
                          title="Cetak Cepat Lembar Nilai PDF Resmi"
                        >
                          <Printer size={13} />
                          <span>Cetak PDF</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MODAL LEMBAR PENILAIAN JURI (PERSIS SESUAI SCREENSHOT) */}
      {/* "tampilannya modelnya jadi kaya di ss an gitu, jadi kaya udah kesusun rapi gitu, jadi buat cek aja" */}
      {/* ======================================================== */}
      {selectedTeam && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              maxWidth: '960px',
              width: '100%',
              maxHeight: '94vh',
              overflowY: 'auto',
              padding: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              border: '1.5px solid #000000',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '2px solid #000000',
                paddingBottom: '0.85rem',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                    }}
                  >
                    NO. {selectedTeam.orderNumber}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: selectedTeam.badgeColor.bg,
                      color: selectedTeam.badgeColor.text,
                      padding: '0.15rem 0.55rem',
                      borderRadius: '4px',
                      border: `1px solid ${selectedTeam.badgeColor.border}`,
                    }}
                  >
                    {selectedTeam.trophyTitle}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                    ✓ {selectedTeam.status}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: 0,
                  }}
                >
                  LEMBAR PENILAIAN JURI — {selectedTeam.school}
                </h3>
                <div style={{ fontSize: '0.825rem', color: '#475569', marginTop: '0.2rem' }}>
                  Pasukan: <strong style={{ color: '#0F172A' }}>{selectedTeam.teamName}</strong> · Danton: <strong style={{ color: '#0F172A' }}>{selectedTeam.danton}</strong> · Waktu Tampil: <strong style={{ color: '#0F172A' }}>{selectedTeam.performanceTime}</strong> ({selectedTeam.duration})
                </div>
              </div>

              {/* Aksi Cepat & Tutup */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCheckMarks(!showCheckMarks)}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.4rem 0.75rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    backgroundColor: showCheckMarks ? '#EFF6FF' : '#F8FAFC',
                    color: showCheckMarks ? '#1D4ED8' : '#475569',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                  title="Beralih antara Mode Cek Nilai Juri vs Blanko Lembar Polos"
                >
                  {showCheckMarks ? '✓ Mode Cek Aktif' : 'Lembar Polos'}
                </button>

                <button
                  type="button"
                  onClick={() => handlePrintScorecard(selectedTeam)}
                  className="pub-btn-coral"
                  style={{ fontSize: '0.775rem', padding: '0.45rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
                  title="Cetak PDF Rekapitulasi Hasil Akhir Aspek"
                >
                  <Printer size={13} />
                  <span>Cetak PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTeam(null)}
                  style={{
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    color: '#0F172A',
                    cursor: 'pointer',
                    padding: '0.45rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Tutup Modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Aspect Tabs Navigator (Pilihan Aspek: Semua Aspek, PBB, Variasi, Danton, Kostum) */}
            <div
              style={{
                display: 'flex',
                gap: '0.45rem',
                borderBottom: '1px solid #CBD5E1',
                paddingBottom: '0.55rem',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveAspectTab('all')}
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.775rem',
                  fontWeight: activeAspectTab === 'all' ? 800 : 600,
                  borderRadius: '6px',
                  border: activeAspectTab === 'all' ? '1.5px solid #0F172A' : '1px solid #CBD5E1',
                  backgroundColor: activeAspectTab === 'all' ? '#0F172A' : '#FFFFFF',
                  color: activeAspectTab === 'all' ? '#FFFFFF' : '#475569',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  whiteSpace: 'nowrap',
                }}
              >
                <Layers size={13} />
                <span>Semua Aspek (4 Tabel)</span>
              </button>

              {ASPECT_DEFINITIONS.map((asp) => {
                const isActive = activeAspectTab === asp.key;
                const rows = getAspectScoreRows(asp.key, selectedTeam);
                const subtotal = rows.reduce((acc, r) => acc + (r.selectedScore || 0), 0);

                return (
                  <button
                    key={asp.key}
                    type="button"
                    onClick={() => setActiveAspectTab(asp.key)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.775rem',
                      fontWeight: isActive ? 800 : 600,
                      borderRadius: '6px',
                      border: isActive ? `1.5px solid ${asp.badgeColor.text}` : '1px solid #CBD5E1',
                      backgroundColor: isActive ? asp.badgeColor.bg : '#FFFFFF',
                      color: isActive ? asp.badgeColor.text : '#475569',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span>{asp.shortTitle}</span>
                    <span
                      style={{
                        fontSize: '0.675rem',
                        padding: '0.1rem 0.35rem',
                        borderRadius: '4px',
                        backgroundColor: isActive ? '#FFFFFF' : '#F1F5F9',
                        fontWeight: 700,
                      }}
                    >
                      {showCheckMarks ? `${subtotal} Pts` : `${asp.maxScore} Pts`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sub-Header Notice untuk Pengecekan */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                padding: '0.6rem 0.85rem',
                fontSize: '0.775rem',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div>
                📋 <strong>Mode Pengecekan Nilai Resmi (Cross-Check):</strong> Format tabel di bawah ini merefleksikan lembar penilaian fisik dewan juri lapangan untuk setiap aspek (PBB, Variasi & Formasi, Danton, Make Up/Kostum). {showCheckMarks ? 'Angka yang dilingkari merah adalah nilai yang dicentang oleh dewan juri di lapangan.' : 'Menampilkan format blanko fisik standar.'}
              </div>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.85rem' }}>
                Total Skor Akhir: <span className="tabular-nums" style={{ color: '#DC2626', fontSize: '0.95rem' }}>{selectedTeam.totalScore} Poin</span>
              </div>
            </div>

            {/* CONTAINER TABEL-TABEL PENILAIAN JURI PERSIS FORMAT SCREENSHOT */}
            <div
              ref={scrollContainerRef}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                maxHeight: '62vh',
                overflowY: 'auto',
                paddingRight: '0.25rem',
              }}
            >
              {ASPECT_DEFINITIONS.filter(
                (asp) => activeAspectTab === 'all' || activeAspectTab === asp.key
              ).map((asp) => {
                const rows = getAspectScoreRows(asp.key, selectedTeam);
                const subtotal = rows.reduce((acc, r) => acc + (r.selectedScore || 0), 0);

                return (
                  <div key={asp.key} style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Header Banner Aspek */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #000000',
                        borderBottom: 'none',
                        padding: '0.45rem 0.75rem',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: '0.825rem',
                            color: '#0F172A',
                            fontFamily: 'Arial, Helvetica, sans-serif',
                          }}
                        >
                          {asp.title}
                        </span>
                        <span
                          style={{
                            fontSize: '0.675rem',
                            fontWeight: 700,
                            backgroundColor: asp.badgeColor.bg,
                            color: asp.badgeColor.text,
                            border: `1px solid ${asp.badgeColor.border}`,
                            padding: '0.08rem 0.4rem',
                            borderRadius: '4px',
                          }}
                        >
                          {asp.badgeText}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#334155' }}>
                        Subtotal {asp.shortTitle}:{' '}
                        <span style={{ color: '#DC2626', fontWeight: 800 }}>
                          {showCheckMarks ? `${subtotal} Poin` : `${asp.maxScore} Poin (Maks)`}
                        </span>
                      </div>
                    </div>

                    {/* Grid Tabel Aspek Persis Screenshot */}
                    <div style={{ overflowX: 'auto', border: '1.5px solid #000000', backgroundColor: '#FFFFFF' }}>
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          fontSize: '0.8125rem',
                          fontFamily: 'Arial, Helvetica, sans-serif',
                          color: '#000000',
                          textAlign: 'center',
                        }}
                      >
                        <tbody>
                          {rows.map((row, idx) => {
                            const rowNumber = idx + 1;
                            const hasOptions = row.options && row.options.length > 0;

                            return (
                              <tr
                                key={row.id || idx}
                                style={{
                                  borderBottom: '1px solid #000000',
                                  backgroundColor: '#FFFFFF',
                                }}
                              >
                                {/* Kolom 1: No */}
                                <td
                                  className="tabular-nums"
                                  style={{
                                    width: '38px',
                                    padding: '4px 2px',
                                    borderRight: '1px solid #000000',
                                    fontWeight: 700,
                                    textAlign: 'center',
                                  }}
                                >
                                  {rowNumber}
                                </td>

                                {/* Kolom 2: Nama Gerakan / Kriteria */}
                                <td
                                  style={{
                                    minWidth: '240px',
                                    padding: '4px 8px',
                                    borderRight: '1px solid #000000',
                                    textAlign: 'left',
                                    fontWeight: 500,
                                    color: '#000000',
                                  }}
                                >
                                  {row.name}
                                </td>

                                {/* Kolom 3 s/d 10: 8 Kolom Skala Nilai Opsi */}
                                {Array.from({ length: 8 }).map((_, optIdx) => {
                                  const optValue = hasOptions ? row.options[optIdx] : undefined;
                                  const isSelected = hasOptions && optValue !== undefined && optValue === row.selectedScore;

                                  return (
                                    <td
                                      key={optIdx}
                                      className="tabular-nums"
                                      style={{
                                        width: '38px',
                                        padding: '3px 1px',
                                        borderRight: '1px solid #000000',
                                        textAlign: 'center',
                                        verticalAlign: 'middle',
                                        fontSize: '0.825rem',
                                      }}
                                    >
                                      {optValue !== undefined ? (
                                        showCheckMarks && isSelected ? (
                                          <span
                                            style={{
                                              display: 'inline-flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              minWidth: '24px',
                                              height: '22px',
                                              borderRadius: '9999px',
                                              border: '1.5px solid #DC2626',
                                              backgroundColor: 'rgba(220, 38, 38, 0.08)',
                                              color: '#DC2626',
                                              fontWeight: 800,
                                              fontSize: '0.8rem',
                                              padding: '0 2px',
                                            }}
                                          >
                                            {optValue}
                                          </span>
                                        ) : (
                                          <span>{optValue}</span>
                                        )
                                      ) : null}
                                    </td>
                                  );
                                })}

                                {/* Kolom 11: Kolom Nilai Perolehan / Cek */}
                                <td
                                  className="tabular-nums"
                                  style={{
                                    width: '55px',
                                    padding: '4px 4px',
                                    fontWeight: 800,
                                    fontSize: '0.85rem',
                                    textAlign: 'center',
                                  }}
                                >
                                  {showCheckMarks ? row.selectedScore : ''}
                                </td>
                              </tr>
                            );
                          })}

                          {/* BARIS TOTAL PER TABEL */}
                          <tr
                            style={{
                              borderTop: '2px solid #000000',
                              backgroundColor: '#FFFFFF',
                              fontWeight: 900,
                              fontSize: '0.9rem',
                            }}
                          >
                            <td
                              colSpan={10}
                              style={{
                                padding: '7px 12px',
                                textAlign: 'center',
                                letterSpacing: '0.08em',
                                borderRight: '1px solid #000000',
                                fontWeight: 900,
                                fontSize: '0.925rem',
                                backgroundColor: '#FFFFFF',
                              }}
                            >
                              TOTAL {asp.shortTitle.toUpperCase()}
                            </td>
                            <td
                              className="tabular-nums"
                              style={{
                                padding: '7px 4px',
                                textAlign: 'center',
                                fontWeight: 900,
                                fontSize: '1rem',
                                color: '#000000',
                                backgroundColor: '#FFFFFF',
                              }}
                            >
                              {showCheckMarks ? subtotal : asp.maxScore}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}

              {/* REKAPITULASI TOTAL SELURUH ASPEK (GRAND TOTAL AKHIR) */}
              <div
                style={{
                  border: '2px solid #000000',
                  backgroundColor: '#FEF3C7',
                  padding: '0.85rem 1.15rem',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.725rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#92400E', fontWeight: 800 }}>
                    Rekapitulasi Total Akumulasi Seluruh 4 Aspek:
                  </div>
                  <div style={{ fontSize: '0.825rem', color: '#78350F', marginTop: '0.15rem' }}>
                    PBB Murni: <strong>{selectedTeam.categoryScores.pbb.score}</strong> · Variasi & Formasi: <strong>{selectedTeam.categoryScores.variasi.score}</strong> · Danton: <strong>{selectedTeam.categoryScores.danton.score}</strong> · Kostum: <strong>{selectedTeam.categoryScores.kostum.score}</strong> {selectedTeam.penalty !== 0 && `· Penalti: ${selectedTeam.penalty}`}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: '#92400E', fontWeight: 700 }}>TOTAL NILAI AKHIR</div>
                    <div className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A' }}>
                      {selectedTeam.totalScore} Poin
                    </div>
                  </div>
                  <span
                    style={{
                      backgroundColor: selectedTeam.badgeColor.bg,
                      color: selectedTeam.badgeColor.text,
                      border: `1px solid ${selectedTeam.badgeColor.border}`,
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                    }}
                  >
                    {selectedTeam.trophyTitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--pub-line)',
                paddingTop: '0.85rem',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>
                * Format tabel di atas telah disesuaikan dengan lembar penilaian resmi dewan juri Paskibra untuk kebutuhan pengecekan panitia.
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedTeam(null)}
                  className="pub-btn-outline"
                  style={{ fontSize: '0.825rem', padding: '0.5rem 1rem' }}
                >
                  Tutup Pengecekan
                </button>
                <button
                  type="button"
                  onClick={() => handlePrintScorecard(selectedTeam)}
                  className="pub-btn-coral"
                  style={{
                    fontSize: '0.825rem',
                    padding: '0.5rem 1.15rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontWeight: 700,
                  }}
                  title="Cetak PDF Hasil Akhir Aspek Resmi"
                >
                  <Printer size={14} />
                  <span>Cetak PDF Hasil Akhir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
