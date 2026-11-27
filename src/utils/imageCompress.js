/**
 * Utilitas kompresi pas foto otomatis di sisi browser sebelum diunggah ke Supabase Storage.
 * - Mengubah ukuran gambar agar pas rasio pas foto (maks 600x800 px, tidak memperbesar gambar kecil)
 * - Mengonversi ke format WebP (atau JPEG fallback) dengan target ukuran <= 80 KB
 * - Menjaga kualitas tajam untuk tampilan kotak pas foto & cetak daftar kontingen sambil menghemat kuota Storage
 */
export async function compressPasFoto(
  file,
  { maxWidth = 600, maxHeight = 800, initialQuality = 0.82, maxTargetBytes = 95 * 1024 } = {}
) {
  if (!file) throw new Error('File gambar tidak ditemukan.');

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('File gambar tidak dapat dibaca. Gunakan JPG, PNG, atau WebP.'));
      el.src = objectUrl;
    });

    let targetW = img.naturalWidth || img.width;
    let targetH = img.naturalHeight || img.height;

    const ratio = Math.min(maxWidth / targetW, maxHeight / targetH, 1);
    targetW = Math.max(1, Math.round(targetW * ratio));
    targetH = Math.max(1, Math.round(targetH * ratio));

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Browser tidak mendukung kompresi gambar Canvas.');
    }

    // Latar belakang putih agar PNG transparan tidak menjadi hitam saat dikonversi
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);
    ctx.drawImage(img, 0, 0, targetW, targetH);

    const encode = (mime, q) =>
      new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), mime, q);
      });

    // Uji dukungan WebP; fallback ke JPEG jika browser tidak mendukung WebP
    let mimeType = 'image/webp';
    let blob = await encode('image/webp', initialQuality);
    if (!blob || blob.type !== 'image/webp') {
      mimeType = 'image/jpeg';
      blob = await encode('image/jpeg', initialQuality);
    }

    // Jika masih lebih besar dari target (~95 KB), turunkan kualitas perlahan agar tetap tajam
    let quality = initialQuality;
    while (blob && blob.size > maxTargetBytes && quality > 0.45) {
      quality = Number((quality - 0.1).toFixed(2));
      const nextBlob = await encode(mimeType, quality);
      if (nextBlob) blob = nextBlob;
      else break;
    }

    if (!blob) {
      throw new Error('Gagal mengompresi gambar.');
    }

    const ext = mimeType === 'image/webp' ? 'webp' : 'jpg';
    const baseName = String(file.name || 'pas-foto').replace(/\.[^.]+$/, '');
    const compressedFile = new File([blob], `${baseName}.${ext}`, { type: mimeType });

    return {
      file: compressedFile,
      blob,
      mimeType,
      width: targetW,
      height: targetH,
      sizeBytes: blob.size,
      sizeKb: Math.max(1, Math.round(blob.size / 1024)),
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

