import React, { useState } from 'react';
import {
  Eye,
  CheckCircle,
  AlertCircle,
  Save,
  Download,
  X,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Send,
  Edit3,
  FileText,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
} from 'lucide-react';

const STORAGE_KEY_PARTICIPANTS = 'kompas_panitia_participants_data';
const STORAGE_KEY_ASSIGNED_SCHEDULE = 'kompas_assigned_schedule';

// Helper Generator Konten Dokumen Resmi untuk Pratinjau & Buka di Tab Baru
function renderDocBodyHtml(doc, participant) {
  const schoolName = participant?.school || 'SMAN 1 Jakarta';
  const teamName = participant?.teamName || 'PASKIBRA GARUDA SAKTI';
  const category = participant?.category || 'SMA/SMK Sederajat';
  const docTitle = doc?.title || 'Dokumen Persyaratan';

  // 1. SURAT TUGAS & REKOMENDASI KEPALA SEKOLAH
  if (docTitle.toLowerCase().includes('surat tugas') || docTitle.toLowerCase().includes('rekomendasi')) {
    return `
      <div class="kop" style="display: flex; align-items: center; gap: 16px; border-bottom: 3px double #0F172A; padding-bottom: 12px; margin-bottom: 20px; text-align: center;">
        <div style="width: 68px; height: 68px; border-radius: 50%; background: #F1F5F9; border: 2px solid #0F172A; display: flex; align-items: center; justify-content: center; font-size: 26px; flex-shrink: 0;">
          🦅
        </div>
        <div class="kop-text" style="flex: 1;">
          <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">PEMERINTAH DAERAH PROVINSI DAERAH KHUSUS JAKARTA</div>
          <div style="font-size: 12px; font-weight: 600;">DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
          <div style="font-size: 17px; font-weight: 800; text-transform: uppercase; margin: 3px 0; color: #0F172A;">${schoolName.toUpperCase()}</div>
          <div style="font-size: 11px; color: #475569; line-height: 1.4;">Jalan Budi Utomo No. 7, Pasar Baru, Kec. Sawah Besar, Kota Jakarta Pusat 10710<br>Telepon: (021) 3865001 | Faksimile: (021) 3865002 | Laman Resmi: https://sman1jkt.sch.id</div>
        </div>
      </div>

      <div class="doc-title" style="text-align: center; margin: 18px 0 16px;">
        <h1 style="font-size: 15px; font-weight: 800; text-decoration: underline; text-transform: uppercase; letter-spacing: 0.5px; color: #0F172A; margin: 0;">SURAT TUGAS & REKOMENDASI KEPALA SEKOLAH</h1>
        <div style="font-size: 12px; color: #334155; margin-top: 4px; font-family: monospace; font-weight: 700;">Nomor: 421.3 / 184 / SMAN1 / TGS-PASKIBRA / X / 2026</div>
      </div>

      <div class="doc-body" style="font-size: 13px; line-height: 1.65; color: #1E293B;">
        <p style="margin-bottom: 12px;">Yang bertanda tangan di bawah ini Kepala ${schoolName}, memberikan tugas dan rekomendasi resmi kepada kontingen Pasukan Pengibar Bendera (Paskibra) pangkalan sekolah kami:</p>

        <table style="width: 100%; margin-bottom: 14px; font-size: 13px; border-collapse: collapse;">
          <tr>
            <td style="width: 180px; font-weight: 700; padding: 3px 0;">Nama Kontingen / Tim</td>
            <td style="width: 15px;">:</td>
            <td style="font-weight: 800; color: #0F172A;">${teamName}</td>
          </tr>
          <tr>
            <td style="font-weight: 700; padding: 3px 0;">Pangkalan Sekolah</td>
            <td>:</td>
            <td>${schoolName}</td>
          </tr>
          <tr>
            <td style="font-weight: 700; padding: 3px 0;">Kategori Lomba</td>
            <td>:</td>
            <td>${category}</td>
          </tr>
          <tr>
            <td style="font-weight: 700; padding: 3px 0;">Jumlah Personel</td>
            <td>:</td>
            <td>16 Orang Pasukan (1 Danton + 15 Pasukan) + 2 Guru Pembina</td>
          </tr>
        </table>

        <p style="margin-bottom: 12px;">Untuk mengikuti dan berkompetisi secara sportif pada kejuaraan <strong>Lomba Kreasi Baris Berbaris (LKBB) Nasional Paskibra 2026</strong> yang diselenggarakan oleh KOMPAS.</p>

        <p style="margin-top: 14px; margin-bottom: 8px; font-weight: 700; color: #0F172A;">Daftar Personel Pasukan yang Ditugaskan:</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11.5px;">
          <thead>
            <tr style="background: #F1F5F9;">
              <th style="border: 1px solid #CBD5E1; padding: 6px 8px; width: 36px; text-align: center;">No</th>
              <th style="border: 1px solid #CBD5E1; padding: 6px 8px; text-align: left;">Nama Lengkap Siswa</th>
              <th style="border: 1px solid #CBD5E1; padding: 6px 8px; width: 100px; text-align: left;">NISN</th>
              <th style="border: 1px solid #CBD5E1; padding: 6px 8px; width: 85px; text-align: left;">Kelas</th>
              <th style="border: 1px solid #CBD5E1; padding: 6px 8px; text-align: left;">Posisi dalam Pasukan</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="border: 1px solid #CBD5E1; padding: 5px 8px; text-align: center;">1</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px; font-weight: 800;">Dimas Aditya</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px; font-family: monospace;">0078923412</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">XII MIPA 1</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px; font-weight: 700; color: #DC2626;">Komandan Peleton (Danton)</td></tr>
            <tr><td style="border: 1px solid #CBD5E1; padding: 5px 8px; text-align: center;">2</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">Fayzah Aghniah</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px; font-family: monospace;">0081234561</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">XI IPS 2</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">Pasukan Saf 1 Kiri</td></tr>
            <tr><td style="border: 1px solid #CBD5E1; padding: 5px 8px; text-align: center;">3</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">Fiki Aunillah</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px; font-family: monospace;">0081234562</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">XI MIPA 3</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">Pasukan Saf 1 Tengah</td></tr>
            <tr><td style="border: 1px solid #CBD5E1; padding: 5px 8px; text-align: center;">4</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">Anum Rismawati</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px; font-family: monospace;">0081234563</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">XI MIPA 4</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">Pasukan Saf 1 Kanan</td></tr>
            <tr><td style="border: 1px solid #CBD5E1; padding: 5px 8px; text-align: center;">5</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">Siti Khumairoh</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px; font-family: monospace;">0081234564</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">XI IPS 1</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">Pasukan Saf 2 Kiri</td></tr>
            <tr><td style="border: 1px solid #CBD5E1; padding: 5px 8px; text-align: center;">6</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">Siska Nur Aisah</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px; font-family: monospace;">0081234565</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">X-A</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">Pasukan Saf 2 Tengah</td></tr>
            <tr><td style="border: 1px solid #CBD5E1; padding: 5px 8px; text-align: center;">7</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">Sarah Aqilah</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px; font-family: monospace;">0081234566</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">X-C</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">Pasukan Saf 2 Kanan</td></tr>
            <tr><td style="border: 1px solid #CBD5E1; padding: 5px 8px; text-align: center;">8</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">Martyaloka Prabaswari W.</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px; font-family: monospace;">0081234567</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">XI MIPA 2</td><td style="border: 1px solid #CBD5E1; padding: 5px 8px;">Pasukan Saf 3 Kiri</td></tr>
          </tbody>
        </table>

        <p style="margin-bottom: 12px;">Demikian surat tugas dan rekomendasi ini diterbitkan untuk dipergunakan sebagaimana mestinya dengan penuh tanggung jawab serta menjunjung tinggi sportivitas dan kehormatan almamater.</p>

        <div style="margin-top: 32px; display: flex; justify-content: flex-end; text-align: center;">
          <div style="width: 250px; font-size: 12.5px;">
            <div>Jakarta, 24 Oktober 2026</div>
            <div style="font-weight: 700; margin-top: 4px;">Kepala ${schoolName}</div>
            <div style="position: relative; height: 75px; display: flex; align-items: center; justify-content: center; margin: 4px 0;">
              <div style="font-size: 24px; font-style: italic; color: #0F172A; transform: rotate(-5deg); font-weight: 800;">Bambang S.</div>
              <div style="position: absolute; width: 78px; height: 78px; border: 2.5px solid #2563EB; border-radius: 50%; color: #2563EB; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 7.5px; font-weight: 800; text-transform: uppercase; transform: rotate(-12deg); opacity: 0.85; left: 24px;">
                DINAS PENDIDIKAN<br>${schoolName}<br>TERAKREDITASI A
              </div>
            </div>
            <div style="font-weight: 800; text-decoration: underline; color: #0F172A;">Dr. H. Bambang Sujarwo, M.Pd</div>
            <div style="font-size: 11px; color: #475569; font-family: monospace;">NIP. 19740512 199903 1 004</div>
          </div>
        </div>
      </div>
    `;
  }

  // 2. SCAN KARTU PELAJAR KOLEKTIF
  if (docTitle.toLowerCase().includes('kartu pelajar')) {
    return `
      <div class="kop" style="display: flex; align-items: center; gap: 16px; border-bottom: 2px solid #0F172A; padding-bottom: 12px; margin-bottom: 18px;">
        <div style="width: 58px; height: 58px; border-radius: 8px; background: #E0F2FE; border: 1.5px solid #0284C7; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #0284C7; flex-shrink: 0;">
          🪪
        </div>
        <div class="kop-text" style="flex: 1;">
          <div style="font-size: 16px; font-weight: 800; text-transform: uppercase; color: #0F172A;">${schoolName.toUpperCase()}</div>
          <div style="font-size: 12.5px; font-weight: 700; color: #0284C7; letter-spacing: 0.5px;">LAMPIRAN SCAN KARTU TANDA PELAJAR RESMI (KOLEKTIF)</div>
          <div style="font-size: 11px; color: #475569;">Kontingen: <strong>${teamName}</strong> · Kategori: ${category} · Total: 16 Siswa Aktif Terverifikasi</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 14px;">
        ${[
          { no: 1, name: 'Dimas Aditya', role: 'Danton', nisn: '0078923412', ttl: 'Jakarta, 01 Okt 2007', kls: 'XII MIPA 1' },
          { no: 2, name: 'Fayzah Aghniah', role: 'Pasukan 1', nisn: '0081234561', ttl: 'Jakarta, 12 Jan 2008', kls: 'XI IPS 2' },
          { no: 3, name: 'Fiki Aunillah', role: 'Pasukan 2', nisn: '0081234562', ttl: 'Bandung, 18 Mar 2008', kls: 'XI MIPA 3' },
          { no: 4, name: 'Anum Rismawati', role: 'Pasukan 3', nisn: '0081234563', ttl: 'Surabaya, 05 Mei 2008', kls: 'XI MIPA 4' },
          { no: 5, name: 'Siti Khumairoh', role: 'Pasukan 4', nisn: '0081234564', ttl: 'Bekasi, 14 Sep 2008', kls: 'XI IPS 1' },
          { no: 6, name: 'Siska Nur Aisah', role: 'Pasukan 5', nisn: '0081234565', ttl: 'Tangerang, 30 Okt 2008', kls: 'X-A' },
          { no: 7, name: 'Sarah Aqilah', role: 'Pasukan 6', nisn: '0081234566', ttl: 'Bogor, 08 Feb 2008', kls: 'X-C' },
          { no: 8, name: 'Martyaloka Prabaswari', role: 'Pasukan 7', nisn: '0081234567', ttl: 'Depok, 17 Apr 2008', kls: 'XI MIPA 2' },
        ].map(s => `
          <div style="border: 1.5px solid #CBD5E1; border-radius: 8px; padding: 10px 12px; background: #F8FAFC; display: flex; gap: 10px; align-items: center;">
            <div style="width: 48px; height: 60px; border-radius: 4px; background: #E2E8F0; border: 1px solid #94A3B8; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 8px; color: #64748B; font-weight: 800; flex-shrink: 0;">
              <span>FOTO</span>
              <span style="font-size: 7px; color: #94A3B8;">#${s.no}</span>
            </div>
            <div style="flex: 1; font-size: 11px; line-height: 1.4;">
              <div style="font-weight: 800; font-size: 12px; color: #0F172A;">${s.name} <span style="font-size: 9px; font-weight: 700; color: #2563EB; background: #DBEAFE; padding: 1px 4px; border-radius: 3px;">${s.role}</span></div>
              <div style="color: #475569; font-family: monospace;">NISN: ${s.nisn}</div>
              <div style="color: #475569;">TTL: ${s.ttl}</div>
              <div style="color: #059669; font-weight: 700;">Status: Siswa Aktif (${s.kls})</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 14px; text-align: center; font-size: 11px; color: #64748B; font-style: italic;">
        (Menampilkan 8 dari 16 kartu pelajar pasukan resmi - Terverifikasi oleh pangkalan kesiswaan sekolah)
      </div>

      <div style="margin-top: 24px; display: flex; justify-content: flex-end; text-align: center;">
        <div style="width: 220px; font-size: 12px;">
          <div>Mengesahkan Keabsahan,</div>
          <div style="font-weight: 700;">Kepala ${schoolName}</div>
          <div style="height: 60px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; font-style: italic; color: #0F172A;">
            Bambang S.
          </div>
          <div style="font-weight: 800; text-decoration: underline;">Dr. H. Bambang Sujarwo, M.Pd</div>
        </div>
      </div>
    `;
  }

  // 3. FORMULIR PENDAFTARAN & PAKTA INTEGRITAS
  return `
    <div class="kop" style="display: flex; align-items: center; gap: 16px; border-bottom: 2px solid #0F172A; padding-bottom: 12px; margin-bottom: 18px;">
      <div style="width: 58px; height: 58px; border-radius: 8px; background: #FEF3C7; border: 1.5px solid #D97706; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #D97706; flex-shrink: 0;">
        📜
      </div>
      <div class="kop-text" style="flex: 1;">
        <div style="font-size: 12px; font-weight: 700; color: #D97706; letter-spacing: 0.5px;">KOMPETISI PASKIBRA TERPADU (KOMPAS 2026)</div>
        <div style="font-size: 16px; font-weight: 800; text-transform: uppercase; color: #0F172A;">FORMULIR PENDAFTARAN & PAKTA INTEGRITAS RESMI</div>
        <div style="font-size: 11px; color: #475569;">Kejuaraan Kreasi Baris-Berbaris Tingkat Pelajar se-Indonesia</div>
      </div>
    </div>

    <div class="doc-title" style="text-align: center; margin: 14px 0 16px;">
      <h1 style="font-size: 14.5px; font-weight: 800; text-decoration: underline; text-transform: uppercase; color: #0F172A; margin: 0;">SURAT PERNYATAAN PAKTA INTEGRITAS KONTINGEN</h1>
      <div style="font-size: 11.5px; color: #475569; margin-top: 4px; font-family: monospace; font-weight: 700;">No. Registrasi: ${participant?.teamNumber || 'REG-LKBB26-001'}</div>
    </div>

    <div class="doc-body" style="font-size: 12.5px; line-height: 1.65; color: #1E293B;">
      <p style="margin-bottom: 10px;">Kami yang bertanda tangan di bawah ini Pembina, Pelatih, dan Komandan Peleton bertindak atas nama pangkalan kontingen <strong>${teamName} (${schoolName})</strong>, dengan ini menyatakan dengan sungguh-sungguh bahwa:</p>

      <ol style="margin-left: 18px; margin-bottom: 16px; line-height: 1.7; font-size: 12.5px;">
        <li>Seluruh data identitas siswa, usia, dan dokumen persyaratan yang kami serahkan adalah benar, sah, dan sesuai dengan data induk kesiswaan resmi di sekolah.</li>
        <li>Pasukan kami siap mematuhi seluruh Anggaran Dasar, Petunjuk Teknis (Juknis), Alur 4 Pos DP (Decision Point), serta menghormati keputusan Dewan Juri yang bersifat mutlak dan tidak dapat diganggu gugat.</li>
        <li>Menjunjung tinggi sportivitas, etika kehormatan Paskibra, dan menolak keras segala bentuk kecurangan maupun tindakan kekerasan fisik/verbal.</li>
        <li>Menerima hasil keputusan penilaian dengan lapang dada demi pembinaan karakter kepemudaan nasional.</li>
      </ol>

      <div style="margin-top: 28px; display: flex; justify-content: space-between; gap: 20px;">
        <div style="text-align: center; width: 200px;">
          <div style="font-size: 12px;">Komandan Peleton,</div>
          <div style="height: 65px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-style: italic; color: #0F172A; font-weight: 800;">
            Dimas A.
          </div>
          <div style="font-weight: 800; text-decoration: underline;">Dimas Aditya</div>
          <div style="font-size: 10.5px; color: #64748B;">NISN. 0078923412</div>
        </div>

        <div style="text-align: center; width: 230px; border: 1.5px dashed #D97706; padding: 8px 12px; border-radius: 8px; background: #FFFBEB;">
          <div style="font-size: 9.5px; color: #92400E; font-weight: 800; margin-bottom: 4px;">METERAI TEMPEL 10.000</div>
          <div style="width: 75px; height: 44px; background: #FEF3C7; border: 1px solid #D97706; margin: 0 auto 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 8px; font-weight: 800; color: #92400E;">
            <span>METERAI</span>
            <span>10.000</span>
          </div>
          <div style="font-weight: 800; text-decoration: underline;">Drs. H. Mulyadi, M.Pd</div>
          <div style="font-size: 10.5px; color: #64748B;">Guru Pembina Paskibra</div>
        </div>
      </div>
    </div>
  `;
}

// Buka Dokumen di Tab Baru (Standalone High-Res Printable Tab)
function openDocInNewTab(doc, participant) {
  const newWin = window.open('', '_blank');
  if (!newWin) {
    alert('Pop-up browser terblokir. Harap izinkan pop-up pada peramban Anda untuk melihat dokumen di tab baru.');
    return;
  }

  const bodyHtml = renderDocBodyHtml(doc, participant);

  newWin.document.write(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${doc.title} - ${participant.teamName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0B132B; color: #1E293B; padding: 24px 16px; min-height: 100vh; display: flex; flex-direction: column; align-items: center; }
    .top-nav { width: 100%; max-width: 820px; background: #1E293B; color: #F8FAFC; padding: 12px 20px; border-radius: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .top-nav .info { display: flex; flex-direction: column; gap: 2px; }
    .top-nav .info .title { font-weight: 800; font-size: 14px; color: #F8FAFC; }
    .top-nav .info .sub { font-size: 11px; color: #94A3B8; }
    .top-nav .actions { display: flex; gap: 8px; }
    .btn { background: #334155; color: #FFF; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
    .btn:hover { background: #475569; }
    .btn-print { background: #059669; }
    .btn-print:hover { background: #047857; }
    .paper-sheet { background: #FFFFFF; width: 100%; max-width: 820px; min-height: 1080px; padding: 56px 52px; border-radius: 4px; box-shadow: 0 20px 45px rgba(0,0,0,0.45); }
    @media print {
      body { background: #FFF; padding: 0; }
      .top-nav { display: none; }
      .paper-sheet { margin-top: 0; box-shadow: none; padding: 24px 32px; }
    }
  </style>
</head>
<body>
  <div class="top-nav">
    <div class="info">
      <div class="title">📄 ${doc.title}</div>
      <div class="sub">${participant.teamName} (${participant.school}) · Status Dokumen: ${doc.status}</div>
    </div>
    <div class="actions">
      <button class="btn btn-print" onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
      <button class="btn" onclick="window.close()">✖ Tutup Tab</button>
    </div>
  </div>
  <div class="paper-sheet">
    ${bodyHtml}
  </div>
</body>
</html>`);
  newWin.document.close();
}

// Data Default 2 Tim: Tim 1 (Lengkap & Tervalidasi), Tim 2 (DUMMY BELUM LENGKAP)
const INITIAL_PARTICIPANTS = [
  {
    id: 'part-1',
    teamNumber: '01 / LKBB-2026-001',
    teamName: 'PASKIBRA GARUDA SAKTI',
    school: 'SMAN 1 Jakarta',
    members: 16,
    category: 'SMA/SMK Putra-Putri',
    orderNumber: '#01',
    orderSlot: 'Slot Pagi (08:30 WIB)',
    status: 'VALIDATED', // 'VALIDATED' | 'REVISION_REQUIRED' | 'SUBMITTED'
    docsSummary: '3/3 Berkas Lengkap',
    isComplete: true,
    documents: [
      {
        id: 'doc-1',
        title: 'Surat Tugas & Rekomendasi Kepala Sekolah',
        fileName: 'Surat_Rekomendasi_Kepsek_SMAN1_Jakarta.pdf',
        ext: 'pdf',
        size: '1.2 MB',
        uploadedAt: '24 Okt 2026, 08:30 WIB',
        status: 'VERIFIED',
        note: null,
      },
      {
        id: 'doc-2',
        title: 'Scan Kartu Pelajar Kolektif (16 Anggota)',
        fileName: 'Kartu_Pelajar_Kolektif_16Anggota.pdf',
        ext: 'pdf',
        size: '3.4 MB',
        uploadedAt: '24 Okt 2026, 08:35 WIB',
        status: 'VERIFIED',
        note: null,
      },
      {
        id: 'doc-3',
        title: 'Formulir Pendaftaran & Pakta Integritas Kontingen',
        fileName: 'Formulir_Pendaftaran_Kontingen_Paskibra_2026.docx',
        ext: 'docx',
        size: '840 KB',
        uploadedAt: '24 Okt 2026, 08:40 WIB',
        status: 'VERIFIED',
        note: null,
      },
    ],
  },
  {
    id: 'part-2',
    teamNumber: '02 / LKBB-2026-002',
    teamName: 'SATRIA BHAYANGKARA',
    school: 'SMAN 3 Bandung',
    members: 16,
    category: 'SMA/SMK Putra-Putri',
    orderNumber: '',
    orderSlot: '',
    status: 'REVISION_REQUIRED', // Belum Lengkap / Perlu Revisi
    docsSummary: '1/3 Diunggah (2 Belum Lengkap)',
    isComplete: false,
    documents: [
      {
        id: 'doc-1',
        title: 'Surat Tugas & Rekomendasi Kepala Sekolah',
        fileName: 'Surat_Tugas_SMAN3_Bdg.pdf',
        ext: 'pdf',
        size: '980 KB',
        uploadedAt: '25 Okt 2026, 11:20 WIB',
        status: 'VERIFIED',
        note: null,
      },
      {
        id: 'doc-2',
        title: 'Scan Kartu Pelajar Kolektif (16 Anggota)',
        fileName: null,
        ext: null,
        size: null,
        uploadedAt: null,
        status: 'MISSING',
        note: 'Belum diunggah sama sekali oleh pendaftar.',
      },
      {
        id: 'doc-3',
        title: 'Formulir Pendaftaran & Pakta Integritas Kontingen',
        fileName: 'Formulir_Pendaftaran_Draft_SMAN3.docx',
        ext: 'docx',
        size: '620 KB',
        uploadedAt: '25 Okt 2026, 11:35 WIB',
        status: 'REVISION',
        note: 'Belum dilengkapi materai 10.000 dan cap basah tanda tangan Kepala Sekolah.',
      },
    ],
  },
];

export default function AdminPanitiaParticipantTable({ participants: propParticipants }) {
  const [participants, setParticipants] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PARTICIPANTS);
      return saved ? JSON.parse(saved) : (propParticipants && propParticipants.length > 0 ? propParticipants : INITIAL_PARTICIPANTS);
    } catch {
      return INITIAL_PARTICIPANTS;
    }
  });

  // State Modal Detail Berkas
  const [selectedParticipantForDocs, setSelectedParticipantForDocs] = useState(null);

  // State Modal Pratinjau Dokumen
  const [previewDoc, setPreviewDoc] = useState(null); // { doc, participant }
  const [previewZoom, setPreviewZoom] = useState(1);

  // State Form Catatan Masukan Revisi per Dokumen
  const [activeRevisionDocId, setActiveRevisionDocId] = useState(null);
  const [revisionNoteInput, setRevisionNoteInput] = useState('');

  // State Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Simpan data partisipan ke LocalStorage & Sync ke Peserta Dashboard
  const saveParticipantsToStorage = (updated) => {
    setParticipants(updated);
    try {
      localStorage.setItem(STORAGE_KEY_PARTICIPANTS, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('kompas_participants_updated', { detail: updated }));

      // Jika tim pertama (Paskibra Garuda Sakti) diubah nomor urut & jam tampilnya,
      // otomatis sinkronkan ke dashboard peserta melalui key STORAGE_KEY_ASSIGNED_SCHEDULE
      const mainTeam = updated.find((p) => p.id === 'part-1') || updated[0];
      if (mainTeam) {
        localStorage.setItem(
          STORAGE_KEY_ASSIGNED_SCHEDULE,
          JSON.stringify({
            orderNumber: mainTeam.orderNumber || '#01',
            orderSlot: mainTeam.orderSlot || 'Slot Pagi (08:30 WIB)',
            statusDocs: mainTeam.isComplete ? 'TERVERIFIKASI' : 'PERLU REVISI',
          })
        );
      }
    } catch (e) {
      console.error('Failed to save participants:', e);
    }
  };

  // Handler update field Nomor Urut
  const handleOrderNumberChange = (id, newOrderNumber) => {
    const updated = participants.map((p) =>
      p.id === id ? { ...p, orderNumber: newOrderNumber } : p
    );
    saveParticipantsToStorage(updated);
  };

  // Handler update field Estimasi Waktu Tampil
  const handleOrderSlotChange = (id, newOrderSlot) => {
    const updated = participants.map((p) =>
      p.id === id ? { ...p, orderSlot: newOrderSlot } : p
    );
    saveParticipantsToStorage(updated);
  };

  // Handler Simpan Cepat per Baris
  const handleSaveRow = (participant) => {
    saveParticipantsToStorage(participants);
    showToast(
      `Nomor urut "${participant.orderNumber || '-'}" & waktu "${participant.orderSlot || '-'}" untuk ${participant.teamName} berhasil disimpan & disinkronkan ke Dashboard Peserta!`
    );
  };

  // Mulai Masukkan Revisi untuk Dokumen Tertentu
  const handleStartRevision = (doc) => {
    setActiveRevisionDocId(doc.id);
    setRevisionNoteInput(doc.note || '');
  };

  // Batalkan Edit Revisi
  const handleCancelRevision = () => {
    setActiveRevisionDocId(null);
    setRevisionNoteInput('');
  };

  // Simpan Catatan Masukan Revisi & Ubah Status ke REVISION
  const handleSaveRevisionNote = (docId) => {
    if (!selectedParticipantForDocs) return;
    const finalNote = revisionNoteInput.trim() || 'Terdapat bagian berkas yang perlu diperbaiki sesuai petunjuk teknis.';

    const updatedParticipants = participants.map((p) => {
      if (p.id !== selectedParticipantForDocs.id) return p;

      const updatedDocs = p.documents.map((d) =>
        d.id === docId ? { ...d, status: 'REVISION', note: finalNote } : d
      );

      const verifiedCount = updatedDocs.filter((d) => d.status === 'VERIFIED').length;
      return {
        ...p,
        documents: updatedDocs,
        isComplete: false,
        status: 'REVISION_REQUIRED',
        docsSummary: `${verifiedCount}/${updatedDocs.length} Diunggah (${updatedDocs.length - verifiedCount} Belum Lengkap)`,
      };
    });

    saveParticipantsToStorage(updatedParticipants);
    const refreshed = updatedParticipants.find((p) => p.id === selectedParticipantForDocs.id);
    setSelectedParticipantForDocs(refreshed);

    if (previewDoc && previewDoc.doc.id === docId) {
      setPreviewDoc((prev) => ({
        ...prev,
        doc: { ...prev.doc, status: 'REVISION', note: finalNote },
      }));
    }

    setActiveRevisionDocId(null);
    setRevisionNoteInput('');
    showToast(`Catatan revisi berhasil disimpan & dikirim ke peserta!`);
  };

  // Setujui Dokumen
  const handleApproveDoc = (docId) => {
    if (!selectedParticipantForDocs) return;

    const updatedParticipants = participants.map((p) => {
      if (p.id !== selectedParticipantForDocs.id) return p;

      const updatedDocs = p.documents.map((d) =>
        d.id === docId ? { ...d, status: 'VERIFIED', note: null } : d
      );

      const allVerified = updatedDocs.every((d) => d.status === 'VERIFIED');
      const verifiedCount = updatedDocs.filter((d) => d.status === 'VERIFIED').length;

      return {
        ...p,
        documents: updatedDocs,
        isComplete: allVerified,
        status: allVerified ? 'VALIDATED' : 'REVISION_REQUIRED',
        docsSummary: allVerified
          ? `${updatedDocs.length}/${updatedDocs.length} Berkas Lengkap`
          : `${verifiedCount}/${updatedDocs.length} Diunggah (${updatedDocs.length - verifiedCount} Belum Lengkap)`,
      };
    });

    saveParticipantsToStorage(updatedParticipants);
    const refreshed = updatedParticipants.find((p) => p.id === selectedParticipantForDocs.id);
    setSelectedParticipantForDocs(refreshed);

    if (previewDoc && previewDoc.doc.id === docId) {
      setPreviewDoc((prev) => ({
        ...prev,
        doc: { ...prev.doc, status: 'VERIFIED', note: null },
      }));
    }

    if (activeRevisionDocId === docId) {
      setActiveRevisionDocId(null);
      setRevisionNoteInput('');
    }

    showToast(`Dokumen berhasil disetujui & diverifikasi valid!`);
  };

  // Handler Verifikasi Dokumen dalam Modal
  const handleToggleDocStatus = (docId, newStatus) => {
    if (newStatus === 'REVISION') {
      const targetDoc = selectedParticipantForDocs?.documents.find((d) => d.id === docId);
      if (targetDoc) handleStartRevision(targetDoc);
    } else {
      handleApproveDoc(docId);
    }
  };

  // Handler Reset ke Data Awal Demo
  const handleResetDemoData = () => {
    saveParticipantsToStorage(INITIAL_PARTICIPANTS);
    showToast('Data peserta berhasil direset ke contoh awal.');
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--pub-surface)',
        borderRadius: 'var(--pub-radius-card)',
        padding: '1.75rem',
        border: '1px solid var(--pub-line)',
        boxShadow: 'var(--pub-shadow-card)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Toast Feedback */}
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
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle size={18} color="var(--pub-teal)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bagian Tabel */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--pub-line)',
          paddingBottom: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                backgroundColor: 'rgba(201, 75, 60, 0.12)',
                color: 'var(--pub-coral)',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.725rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              ADMIN PANITIA · PESERTA & BERKAS
            </span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0 0 0.25rem 0' }}>
            Verifikasi Berkas & Penjadwalan Nomor Urut Tampil
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: 0, maxWidth: '720px' }}>
            Periksa kelengkapan dokumen persyaratan kontingen dan tetapkan <strong>Nomor Urut</strong> serta <strong>Estimasi Jam Tampil</strong> yang akan otomatis tayang di Dashboard Peserta.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleResetDemoData}
            title="Kembalikan data ke contoh awal demo"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.8rem',
              borderRadius: '6px',
              border: '1px solid var(--pub-line)',
              backgroundColor: 'var(--pub-canvas)',
              color: 'var(--pub-muted)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={13} />
            <span>Reset Demo</span>
          </button>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--pub-ink)',
              backgroundColor: 'var(--pub-canvas)',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--pub-line)',
            }}
          >
            Total: <strong>{participants.length}</strong> Kontingen Terdaftar
          </span>
        </div>
      </div>

      {/* Tabel Utama Peserta */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--pub-canvas)', borderBottom: '1px solid var(--pub-line)' }}>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', width: '160px', whiteSpace: 'nowrap' }}>
                Kode Tim
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pasukan & Asal Sekolah
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', width: '220px', whiteSpace: 'nowrap' }}>
                Dokumen Persyaratan
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--pub-coral)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', width: '290px', whiteSpace: 'nowrap' }}>
                Nomor Urut & Waktu Tampil
              </th>
            </tr>
          </thead>
          <tbody>
            {participants.map((pt) => {
              const numPart = pt.teamNumber?.includes('/') ? pt.teamNumber.split('/')[0].trim() : '01';
              const codePart = pt.teamNumber?.includes('/') ? pt.teamNumber.split('/')[1].trim() : pt.teamNumber;

              return (
                <tr
                  key={pt.id}
                  style={{
                    borderBottom: '1px solid var(--pub-line)',
                    backgroundColor: pt.isComplete ? 'transparent' : 'rgba(239, 68, 68, 0.02)',
                    transition: 'background-color 0.2s',
                  }}
                >
                  {/* Kolom 1: Kode Tim (Horizontal & Rapi, Tidak Patah) */}
                  <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          color: 'var(--pub-ink)',
                          backgroundColor: 'var(--pub-canvas)',
                          border: '1px solid var(--pub-line)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {numPart}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.785rem', color: 'var(--pub-ink)' }}>
                          {codePart}
                        </div>
                        <span style={{ fontSize: '0.675rem', color: 'var(--pub-muted)', fontFamily: 'var(--font-mono)' }}>
                          ID: {pt.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Kolom 2: Pasukan & Asal Sekolah + Kategori */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 800, color: 'var(--pub-ink)', fontSize: '0.925rem', letterSpacing: '-0.01em' }}>
                      {pt.teamName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem' }}>
                      <span>{pt.school}</span>
                      <span style={{ color: 'var(--pub-line)' }}>•</span>
                      <span>{pt.category}</span>
                      <span style={{ color: 'var(--pub-line)' }}>•</span>
                      <span style={{ color: 'var(--pub-ink-soft)', fontWeight: 600 }}>{pt.members} Anggota</span>
                    </div>
                  </td>

                  {/* Kolom 3: Dokumen Persyaratan (Status Badge + Tombol View Sejajar) */}
                  <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {pt.isComplete ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            backgroundColor: 'var(--pub-teal-light)',
                            color: 'var(--pub-teal)',
                            padding: '0.25rem 0.6rem',
                            borderRadius: 'var(--pub-radius-pill)',
                            fontSize: '0.725rem',
                            fontWeight: 800,
                          }}
                        >
                          <CheckCircle size={12} />
                          <span>3/3 Valid</span>
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#DC2626',
                            padding: '0.25rem 0.6rem',
                            borderRadius: 'var(--pub-radius-pill)',
                            fontSize: '0.725rem',
                            fontWeight: 800,
                          }}
                        >
                          <AlertTriangle size={12} />
                          <span>1/3 Perlu Revisi</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedParticipantForDocs(pt)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          backgroundColor: '#FFFFFF',
                          border: pt.isComplete ? '1px solid var(--pub-line)' : '1px solid #FCA5A5',
                          color: pt.isComplete ? 'var(--pub-ink)' : '#DC2626',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = pt.isComplete ? 'var(--pub-canvas)' : '#FEF2F2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                        }}
                      >
                        <Eye size={12} color={pt.isComplete ? 'var(--pub-coral)' : '#DC2626'} />
                        <span>Lihat Berkas</span>
                      </button>
                    </div>
                  </td>

                  {/* Kolom 4: Nomor Urut & Waktu Tampil (Inline Horizontal Ramping) */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <input
                        type="text"
                        value={pt.orderNumber}
                        onChange={(e) => handleOrderNumberChange(pt.id, e.target.value)}
                        placeholder="#01"
                        title="Nomor Urut Tampil"
                        style={{
                          width: '64px',
                          padding: '0.35rem 0.45rem',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          textAlign: 'center',
                          color: 'var(--pub-ink)',
                          backgroundColor: 'var(--pub-canvas)',
                          border: '1px solid var(--pub-line)',
                          borderRadius: '6px',
                          fontFamily: 'var(--font-heading)',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pub-coral)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pub-line)')}
                      />

                      <input
                        type="text"
                        value={pt.orderSlot}
                        onChange={(e) => handleOrderSlotChange(pt.id, e.target.value)}
                        placeholder="Contoh: 08:30 WIB"
                        title="Estimasi Jam Tampil"
                        style={{
                          width: '140px',
                          padding: '0.35rem 0.55rem',
                          fontSize: '0.775rem',
                          fontWeight: 600,
                          color: 'var(--pub-ink)',
                          backgroundColor: 'var(--pub-canvas)',
                          border: '1px solid var(--pub-line)',
                          borderRadius: '6px',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pub-coral)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pub-line)')}
                      />

                      <button
                        type="button"
                        onClick={() => handleSaveRow(pt)}
                        title="Simpan & Sinkronkan ke Peserta"
                        className="pub-btn-coral"
                        style={{
                          padding: '0.35rem 0.65rem',
                          fontSize: '0.725rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          borderRadius: '6px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        <Save size={12} />
                        <span>Simpan</span>
                      </button>
                    </div>

                    <div style={{ fontSize: '0.675rem', color: pt.isComplete ? 'var(--pub-teal)' : '#DC2626', marginTop: '0.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {pt.isComplete ? '✓ Terhubung ke Peserta' : '⚠️ Masih ada berkas revisi'}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ============================================================== */}
      {/* MODAL ELEGAN: DETAIL BERKAS PERSYARATAN KONTINGEN               */}
      {/* ============================================================== */}
      {selectedParticipantForDocs && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={() => setSelectedParticipantForDocs(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--pub-line)',
              padding: '1.75rem',
              position: 'relative',
              fontFamily: 'var(--font-sans)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '1px solid var(--pub-line)',
                paddingBottom: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      backgroundColor: selectedParticipantForDocs.isComplete ? 'var(--pub-teal-light)' : '#FEE2E2',
                      color: selectedParticipantForDocs.isComplete ? 'var(--pub-teal)' : '#DC2626',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {selectedParticipantForDocs.teamNumber}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', fontWeight: 600 }}>
                    {selectedParticipantForDocs.category}
                  </span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
                  {selectedParticipantForDocs.teamName}
                </h2>
                <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: '0.15rem 0 0 0' }}>
                  {selectedParticipantForDocs.school} · 16 Pasukan Terdaftar
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedParticipantForDocs(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '0.4rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Status Card Ringkasan Modal */}
            <div
              style={{
                backgroundColor: selectedParticipantForDocs.isComplete ? 'rgba(5, 150, 105, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: selectedParticipantForDocs.isComplete ? '1px solid rgba(5, 150, 105, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {selectedParticipantForDocs.isComplete ? (
                  <CheckCircle size={18} color="var(--pub-teal)" />
                ) : (
                  <AlertTriangle size={18} color="#DC2626" />
                )}
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: selectedParticipantForDocs.isComplete ? 'var(--pub-teal)' : '#DC2626' }}>
                  {selectedParticipantForDocs.docsSummary}
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.725rem',
                  fontWeight: 800,
                  backgroundColor: '#FFFFFF',
                  color: selectedParticipantForDocs.isComplete ? 'var(--pub-teal)' : '#DC2626',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  border: '1px solid currentColor',
                }}
              >
                STATUS TIM: {selectedParticipantForDocs.status}
              </span>
            </div>

            {/* List 3 Berkas Dokumen Persyaratan */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {selectedParticipantForDocs.documents.map((doc, idx) => {
                const isVerified = doc.status === 'VERIFIED';
                const isMissing = doc.status === 'MISSING';
                const isRevision = doc.status === 'REVISION';
                const isPdf = doc.ext === 'pdf';

                return (
                  <div
                    key={doc.id}
                    style={{
                      border: isMissing ? '1.5px dashed #FCA5A5' : isRevision ? '1.5px solid #FCD34D' : '1px solid var(--pub-line)',
                      backgroundColor: isMissing ? '#FEF2F2' : isRevision ? '#FFFBEB' : 'var(--pub-canvas)',
                      borderRadius: '10px',
                      padding: '1rem 1.15rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
                        {/* Format Icon Badge */}
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: isMissing ? '#FEE2E2' : isPdf ? '#FEE2E2' : '#E0F2FE',
                            color: isMissing ? '#DC2626' : isPdf ? '#DC2626' : '#0369A1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.7rem',
                            flexShrink: 0,
                          }}
                        >
                          {isMissing ? '!' : isPdf ? 'PDF' : 'DOC'}
                        </div>

                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--pub-muted)' }}>
                            DOKUMEN #{idx + 1}
                          </div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--pub-ink)' }}>
                            {doc.title}
                          </div>

                          {doc.fileName ? (
                            <div style={{ fontSize: '0.775rem', color: 'var(--pub-ink)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                              <span>📄 {doc.fileName}</span>
                              <span style={{ color: 'var(--pub-muted)' }}>· {doc.size}</span>
                              <span style={{ color: 'var(--pub-muted)' }}>· Diunggah: {doc.uploadedAt}</span>
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.775rem', color: '#DC2626', fontWeight: 700, marginTop: '0.2rem' }}>
                              ⚠️ Berkas belum diunggah oleh pendaftar
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Badge Dokumen */}
                      <div>
                        {isVerified && (
                          <span
                            style={{
                              backgroundColor: 'var(--pub-teal-light)',
                              color: 'var(--pub-teal)',
                              padding: '0.25rem 0.65rem',
                              borderRadius: 'var(--pub-radius-pill)',
                              fontSize: '0.725rem',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <CheckCircle size={12} />
                            TERVERIFIKASI
                          </span>
                        )}
                        {isRevision && (
                          <span
                            style={{
                              backgroundColor: 'rgba(217, 119, 6, 0.15)',
                              color: '#B45309',
                              padding: '0.25rem 0.65rem',
                              borderRadius: 'var(--pub-radius-pill)',
                              fontSize: '0.725rem',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <AlertCircle size={12} />
                            PERLU REVISI
                          </span>
                        )}
                        {isMissing && (
                          <span
                            style={{
                              backgroundColor: '#FEE2E2',
                              color: '#DC2626',
                              padding: '0.25rem 0.65rem',
                              borderRadius: 'var(--pub-radius-pill)',
                              fontSize: '0.725rem',
                              fontWeight: 800,
                            }}
                          >
                            BELUM DIUNGGAH
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Catatan Khusus Revisi jika ada dan tidak sedang dalam mode edit */}
                    {doc.note && activeRevisionDocId !== doc.id && (
                      <div
                        style={{
                          marginTop: '0.75rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          backgroundColor: isMissing ? 'rgba(239, 68, 68, 0.08)' : 'rgba(217, 119, 6, 0.12)',
                          border: isMissing ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(217, 119, 6, 0.3)',
                          color: isMissing ? '#991B1B' : '#92400E',
                          fontSize: '0.775rem',
                          lineHeight: 1.45,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <div>
                          <strong>Catatan Revisi Panitia:</strong> {doc.note}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleStartRevision(doc)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#B45309',
                            fontWeight: 700,
                            fontSize: '0.725rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            flexShrink: 0,
                          }}
                          title="Klik untuk mengubah catatan revisi"
                        >
                          <Edit3 size={12} />
                          <span>Ubah Catatan</span>
                        </button>
                      </div>
                    )}

                    {/* Tombol Aksi Verifikasi & Buka Berkas */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.45rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
                      {/* Tombol 1: Lihat Dokumen (Pratinjau Langsung di Layar) */}
                      {doc.fileName && (
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewZoom(1);
                            setPreviewDoc({ doc, participant: selectedParticipantForDocs });
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            border: '1px solid var(--pub-coral)',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'var(--pub-coral)',
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            transition: 'all 0.15s ease',
                          }}
                          title="Buka pratinjau dokumen di layar ini"
                        >
                          <Eye size={13} />
                          <span>Lihat Dokumen</span>
                        </button>
                      )}

                      {/* Tombol 2: Buka Dokumen di Tab Baru */}
                      {doc.fileName && (
                        <button
                          type="button"
                          onClick={() => openDocInNewTab(doc, selectedParticipantForDocs)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            border: '1px solid var(--pub-line)',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'var(--pub-ink)',
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            transition: 'all 0.15s ease',
                          }}
                          title="Buka dokumen di tab baru browser untuk diperiksa terpisah atau dicetak"
                        >
                          <ExternalLink size={13} />
                          <span>Buka di Tab Baru</span>
                        </button>
                      )}

                      {/* Tombol 3: Unduh File */}
                      {doc.fileName && (
                        <button
                          type="button"
                          onClick={() => showToast(`Mengunduh berkas ${doc.fileName}...`)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '6px',
                            border: '1px solid var(--pub-line)',
                            backgroundColor: 'var(--pub-canvas)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--pub-ink-soft)',
                            cursor: 'pointer',
                          }}
                        >
                          <Download size={13} />
                          <span>Unduh</span>
                        </button>
                      )}

                      {/* Tombol Verifikasi / Minta Revisi */}
                      {!isMissing && (
                        <>
                          {isVerified ? (
                            <button
                              type="button"
                              onClick={() => handleStartRevision(doc)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: '0.35rem 0.8rem',
                                borderRadius: '6px',
                                border: '1px solid #FCD34D',
                                backgroundColor: '#FEF3C7',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: '#92400E',
                                cursor: 'pointer',
                              }}
                            >
                              <AlertCircle size={13} />
                              <span>Minta Revisi</span>
                            </button>
                          ) : isRevision ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartRevision(doc)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  padding: '0.35rem 0.8rem',
                                  borderRadius: '6px',
                                  border: '1px solid #FCD34D',
                                  backgroundColor: '#FEF3C7',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  color: '#92400E',
                                  cursor: 'pointer',
                                }}
                              >
                                <Edit3 size={13} />
                                <span>Ubah Catatan</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleApproveDoc(doc.id)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  padding: '0.35rem 0.85rem',
                                  borderRadius: '6px',
                                  border: 'none',
                                  backgroundColor: 'var(--pub-teal)',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  color: '#FFFFFF',
                                  cursor: 'pointer',
                                }}
                              >
                                <CheckCircle size={13} />
                                <span>Setujui Berkas</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartRevision(doc)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  padding: '0.35rem 0.8rem',
                                  borderRadius: '6px',
                                  border: '1px solid #FCD34D',
                                  backgroundColor: '#FEF3C7',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  color: '#92400E',
                                  cursor: 'pointer',
                                }}
                              >
                                <AlertCircle size={13} />
                                <span>Minta Revisi</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleApproveDoc(doc.id)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  padding: '0.35rem 0.85rem',
                                  borderRadius: '6px',
                                  border: 'none',
                                  backgroundColor: 'var(--pub-teal)',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  color: '#FFFFFF',
                                  cursor: 'pointer',
                                }}
                              >
                                <CheckCircle size={13} />
                                <span>Setujui Berkas</span>
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>

                    {/* FIELD MASUKAN REVISI INLINE MUNCUL DI BAWAH DOKUMEN TERKAIT */}
                    {activeRevisionDocId === doc.id && (
                      <div
                        style={{
                          marginTop: '1rem',
                          padding: '1.15rem',
                          borderRadius: '10px',
                          backgroundColor: '#FFFBEB',
                          border: '1.5px solid #FCD34D',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem',
                          animation: 'fadeIn 0.2s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#92400E', fontWeight: 800, fontSize: '0.875rem' }}>
                          <AlertCircle size={16} color="#D97706" />
                          <span>Form Masukan Revisi: {doc.title}</span>
                        </div>

                        <p style={{ margin: 0, fontSize: '0.775rem', color: '#B45309', lineHeight: 1.45 }}>
                          Tuliskan instruksi spesifik kepada peserta mengenai bagian yang harus diperbaiki. Catatan ini akan ditampilkan secara langsung di dashboard peserta.
                        </p>

                        {/* Rekomendasi Catatan Cepat (Quick Chips) */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#92400E' }}>Template Cepat:</span>
                          {[
                            'Tanda tangan kepala sekolah belum berstempel basah.',
                            'Foto scan kartu pelajar buram / tidak terbaca.',
                            'Format berkas belum lengkap sesuai ketentuan juknis.',
                            'Meterai tempel 10.000 belum ada / belum ditandatangani.',
                            'Daftar 16 anggota belum sesuai biodata pendaftaran.',
                          ].map((preset, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => setRevisionNoteInput((prev) => (prev ? `${prev} ${preset}` : preset))}
                              style={{
                                fontSize: '0.685rem',
                                padding: '0.25rem 0.55rem',
                                borderRadius: '4px',
                                backgroundColor: '#FEF3C7',
                                border: '1px solid #FCD34D',
                                color: '#92400E',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'background-color 0.15s',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FDE68A')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FEF3C7')}
                            >
                              + {preset}
                            </button>
                          ))}
                        </div>

                        {/* Input Area Catatan Revisi */}
                        <textarea
                          rows={3}
                          value={revisionNoteInput}
                          onChange={(e) => setRevisionNoteInput(e.target.value)}
                          placeholder="Tuliskan catatan perbaikan untuk peserta di sini... (contoh: Mohon unggah ulang berkas yang sudah dilengkapi cap stempel dinas Kepala Sekolah)"
                          autoFocus
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '6px',
                            border: '1.5px solid #FCD34D',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.825rem',
                            fontFamily: 'inherit',
                            color: '#1E293B',
                            lineHeight: 1.5,
                            outline: 'none',
                          }}
                        />

                        {/* Tombol Simpan Masukan Revisi & Batal */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.55rem' }}>
                          <button
                            type="button"
                            onClick={handleCancelRevision}
                            style={{
                              padding: '0.45rem 0.95rem',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              backgroundColor: '#FFFFFF',
                              color: '#64748B',
                              fontSize: '0.775rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Batal
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSaveRevisionNote(doc.id)}
                            style={{
                              padding: '0.45rem 1.1rem',
                              borderRadius: '6px',
                              border: 'none',
                              backgroundColor: '#D97706',
                              color: '#FFFFFF',
                              fontSize: '0.775rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              boxShadow: '0 1px 3px rgba(217, 119, 6, 0.4)',
                            }}
                          >
                            <Send size={13} />
                            <span>Kirim Masukan Revisi</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Modal */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--pub-line)', paddingTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setSelectedParticipantForDocs(null)}
                className="pub-btn-coral"
                style={{ padding: '0.6rem 1.35rem', fontSize: '0.85rem' }}
              >
                Selesai Memeriksa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PRATINJAU DOKUMEN HIGH-RESOLUTION DENGAN ZOOM & CETAK */}
      {/* ========================================================================= */}
      {previewDoc && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 19, 43, 0.88)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10001,
            padding: '1rem',
            overflow: 'hidden',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewDoc(null);
          }}
        >
          {/* Top Control Bar */}
          <div
            style={{
              width: '100%',
              maxWidth: '900px',
              backgroundColor: '#1E293B',
              color: '#F8FAFC',
              borderRadius: '12px',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              border: '1px solid #334155',
              marginBottom: '0.75rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--pub-coral)',
                }}
              >
                <FileText size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#F8FAFC' }}>
                  {previewDoc.doc.title}
                </div>
                <div style={{ fontSize: '0.725rem', color: '#94A3B8' }}>
                  {previewDoc.participant.teamName} · {previewDoc.participant.school}
                </div>
              </div>
            </div>

            {/* Controls Zoom, Tab Baru, Cetak & Tutup */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {/* Zoom Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0F172A', borderRadius: '6px', padding: '2px 4px', border: '1px solid #334155' }}>
                <button
                  type="button"
                  onClick={() => setPreviewZoom((z) => Math.max(0.7, Number((z - 0.1).toFixed(1))))}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                  title="Perkecil Tampilan"
                >
                  <ZoomOut size={14} />
                </button>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#F8FAFC', minWidth: '40px', textAlign: 'center' }}>
                  {Math.round(previewZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewZoom((z) => Math.min(1.4, Number((z + 0.1).toFixed(1))))}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                  title="Perbesar Tampilan"
                >
                  <ZoomIn size={14} />
                </button>
              </div>

              {/* Buka di Tab Baru */}
              <button
                type="button"
                onClick={() => openDocInNewTab(previewDoc.doc, previewDoc.participant)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid #475569',
                  backgroundColor: '#334155',
                  color: '#F8FAFC',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                title="Buka dokumen di tab browser baru"
              >
                <ExternalLink size={13} />
                <span>Buka di Tab Baru</span>
              </button>

              {/* Tutup Pratinjau */}
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '0.4rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Tutup Pratinjau"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Document Sheet Area */}
          <div
            style={{
              flex: 1,
              width: '100%',
              maxWidth: '900px',
              overflowY: 'auto',
              display: 'flex',
              justifyContent: 'center',
              padding: '1rem 0 2rem',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '820px',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.45)',
                padding: '48px 52px',
                color: '#1E293B',
                transform: `scale(${previewZoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease',
              }}
              dangerouslySetInnerHTML={{
                __html: renderDocBodyHtml(previewDoc.doc, previewDoc.participant),
              }}
            />
          </div>

          {/* Bottom Verification Quick Bar */}
          <div
            style={{
              width: '100%',
              maxWidth: '900px',
              backgroundColor: '#1E293B',
              borderRadius: '12px',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 -5px 20px rgba(0,0,0,0.3)',
              border: '1px solid #334155',
              marginTop: '0.5rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.775rem', color: '#94A3B8' }}>Status Berkas Saat Ini:</span>
              <span
                style={{
                  fontSize: '0.725rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  backgroundColor: previewDoc.doc.status === 'VERIFIED' ? 'rgba(5, 150, 105, 0.2)' : 'rgba(217, 119, 6, 0.2)',
                  color: previewDoc.doc.status === 'VERIFIED' ? '#34D399' : '#FBBF24',
                }}
              >
                {previewDoc.doc.status === 'VERIFIED' ? 'TERVERIFIKASI SAH' : 'PERLU REVISI'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => {
                  handleStartRevision(previewDoc.doc);
                  setPreviewDoc(null);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #FCD34D',
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <AlertCircle size={14} />
                <span>Minta / Ubah Revisi</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleApproveDoc(previewDoc.doc.id);
                  setPreviewDoc(null);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 1.15rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'var(--pub-teal)',
                  color: '#FFFFFF',
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 5px rgba(5, 150, 105, 0.4)',
                }}
              >
                <CheckCircle size={14} />
                <span>Setujui Berkas Sah</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
