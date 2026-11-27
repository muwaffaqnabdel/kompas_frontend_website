import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  X,
  AlertTriangle,
  Lock,
  Loader2,
  Mic,
  MicOff,
  Pause,
  Play,
  Square,
  RotateCcw,
} from 'lucide-react';

function pickSupportedAudioMimeType() {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') return '';
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
  ];
  return candidates.find((m) => MediaRecorder.isTypeSupported(m)) || '';
}

export default function JuriStepScoring({
  team,
  judge,
  abaAbaList = [],
  initialScores = {},
  isSubmitting = false,
  submitError = '',
  onSubmitScores,
  onCancel,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState(initialScores);
  const [missingItemsModal, setMissingItemsModal] = useState(null); // array of { index, number, name }
  const [confirmSubmitModal, setConfirmSubmitModal] = useState(false);

  // State Rekaman Suara Evaluasi (Mulai dalam kondisi STANDBY + Pause/Resume + Timestamp Marker per Aba-Aba)
  const [recStatus, setRecStatus] = useState('STANDBY'); // 'STANDBY' | 'RECORDING' | 'PAUSED' | 'STOPPED'
  const [recSeconds, setRecSeconds] = useState(0);
  const [recError, setRecError] = useState('');
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordedMimeType, setRecordedMimeType] = useState('audio/webm');

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const chunksRef = useRef([]);
  const activeSecondsRef = useRef(0);
  const markersRef = useRef([]);
  const stopPromiseResolveRef = useRef(null);

  const currentAbaAba = abaAbaList[currentIndex] || {
    id: `aba-${currentIndex + 1}`,
    orderIndex: currentIndex + 1,
    name: `Aba-aba ${currentIndex + 1}`,
    options: [8, 10, 12, 14, 16, 18, 20, 22],
  };

  const options = currentAbaAba.options || [8, 10, 12, 14, 16, 18, 20, 22];
  const currentScore = scores[currentAbaAba.id];

  const filledCount = abaAbaList.filter(
    (item) => scores[item.id] !== undefined && scores[item.id] !== null
  ).length;
  const totalScorePreview = abaAbaList.reduce(
    (sum, item) => sum + (Number(scores[item.id]) || 0),
    0
  );

  // Catat marker aba-aba di detik rekaman aktif setiap kali juri membuka aba-aba baru saat merekam
  const recordMarkerForCurrent = (abaItem) => {
    if (!abaItem) return;
    const prev = markersRef.current[markersRef.current.length - 1];
    if (prev && prev.abaAbaId === abaItem.id) return;
    markersRef.current.push({
      abaAbaId: abaItem.id,
      abaAbaName: abaItem.name,
      category: abaItem.category || '',
      startSec: activeSecondsRef.current,
    });
  };

  useEffect(() => {
    if (recStatus === 'RECORDING') {
      recordMarkerForCurrent(currentAbaAba);
    }
  }, [currentIndex, recStatus]);

  // Timer rekaman aktif (otomatis jeda saat PAUSED sehingga timestamp marker tetap presisi)
  useEffect(() => {
    if (recStatus !== 'RECORDING') return;
    const interval = setInterval(() => {
      activeSecondsRef.current += 1;
      setRecSeconds(activeSecondsRef.current);
    }, 1000);
    return () => clearInterval(interval);
  }, [recStatus]);

  // Pastikan mikrofon dilepas bersih saat komponen unmount
  useEffect(() => {
    return () => {
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      } catch {}
      try {
        mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      } catch {}
    };
  }, []);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const releaseMicStream = () => {
    try {
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    } catch {}
    mediaStreamRef.current = null;
  };

  const handleStartRecording = async () => {
    setRecError('');
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setRecError('Browser tidak mendukung perekaman mikrofon.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });
      mediaStreamRef.current = stream;
      chunksRef.current = [];
      activeSecondsRef.current = 0;
      markersRef.current = [];
      setRecSeconds(0);
      setRecordedBlob(null);

      const mimeType = pickSupportedAudioMimeType();
      const recorderOptions = {
        ...(mimeType ? { mimeType } : {}),
        audioBitsPerSecond: 32000, // ~32 kbps Opus: 5 menit ≈ 1,2 MB (sangat ringan & jernih)
      };

      const recorder = new MediaRecorder(stream, recorderOptions);
      const actualMime = recorder.mimeType || mimeType || 'audio/webm';
      setRecordedMimeType(actualMime);

      recorder.ondataavailable = (evt) => {
        if (evt.data && evt.data.size > 0) {
          chunksRef.current.push(evt.data);
        }
      };

      recorder.onstop = () => {
        const finalBlob =
          chunksRef.current.length > 0
            ? new Blob(chunksRef.current, { type: actualMime })
            : null;
        setRecordedBlob(finalBlob);
        setRecStatus(finalBlob ? 'STOPPED' : 'STANDBY');
        releaseMicStream();
        if (stopPromiseResolveRef.current) {
          stopPromiseResolveRef.current({
            blob: finalBlob,
            mimeType: actualMime,
            durationSec: activeSecondsRef.current,
            markers: [...markersRef.current],
          });
          stopPromiseResolveRef.current = null;
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000); // flush chunk tiap 1 detik
      setRecStatus('RECORDING');
      recordMarkerForCurrent(currentAbaAba);
    } catch (err) {
      console.error('Failed starting judge mic:', err);
      setRecError('Izin mikrofon ditolak atau perangkat mic tidak terdeteksi.');
      releaseMicStream();
    }
  };

  const handleTogglePause = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    if (recorder.state === 'recording') {
      recorder.pause();
      setRecStatus('PAUSED');
    } else if (recorder.state === 'paused') {
      recorder.resume();
      setRecStatus('RECORDING');
      recordMarkerForCurrent(currentAbaAba);
    }
  };

  const stopRecordingAndGetAudio = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && (recorder.state === 'recording' || recorder.state === 'paused')) {
      return new Promise((resolve) => {
        stopPromiseResolveRef.current = resolve;
        recorder.stop();
      });
    }
    if (recordedBlob) {
      return Promise.resolve({
        blob: recordedBlob,
        mimeType: recordedMimeType,
        durationSec: activeSecondsRef.current,
        markers: [...markersRef.current],
      });
    }
    return Promise.resolve(null);
  };

  const handleStopRecordingManual = async () => {
    await stopRecordingAndGetAudio();
  };

  const handleSelectScore = (val) => {
    setScores((prev) => ({
      ...prev,
      [currentAbaAba.id]: val,
    }));
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < abaAbaList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Validasi ketat kelengkapan semua aba-aba sebelum submit & kunci nilai
  const handleFinalSubmit = () => {
    const missing = abaAbaList
      .map((item, idx) => ({
        index: idx,
        number: idx + 1,
        id: item.id,
        name: item.name,
      }))
      .filter((item) => scores[item.id] === undefined || scores[item.id] === null);

    if (missing.length > 0) {
      setMissingItemsModal(missing);
      return;
    }

    setConfirmSubmitModal(true);
  };

  const handleConfirmLockSubmit = async () => {
    const capturedAudio = await stopRecordingAndGetAudio();
    await onSubmitScores(scores, capturedAudio);
  };

  const isLastAbaAba = currentIndex === abaAbaList.length - 1;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#FFFFFF',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 2rem',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* 1. Minimal Header (Nama Tim & Progres Saja) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '0.85rem',
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'transparent',
            border: 'none',
            color: '#64748B',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.35rem 0.6rem',
            borderRadius: '6px',
          }}
          title="Keluar dari lembar penilaian"
        >
          <X size={18} />
          <span>Kembali</span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
            {team?.school || 'SMAN 1 Jakarta'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
            No. Urut {team?.orderNumber || '01'} • Aba-Aba {currentIndex + 1} dari {abaAbaList.length} •{' '}
            <strong style={{ color: filledCount === abaAbaList.length ? '#059669' : '#B45309' }}>
              Terisi {filledCount}/{abaAbaList.length}
            </strong>
          </div>
        </div>

        <div style={{ minWidth: '100px', textAlign: 'right', fontSize: '0.78rem', fontWeight: 800, color: '#DC2626' }}>
          {currentAbaAba.category || judge?.category || 'PBB'}
        </div>
      </div>

      {/* 1B. BAR REKAMAN SUARA EVALUASI (STANDBY + PAUSE/RESUME + TIMESTAMP MARKER) */}
      <div
        style={{
          width: '100%',
          maxWidth: '900px',
          margin: '0.75rem auto 0',
          padding: '0.55rem 0.9rem',
          borderRadius: '10px',
          backgroundColor:
            recStatus === 'RECORDING'
              ? '#FEF2F2'
              : recStatus === 'PAUSED'
              ? '#FFFBEB'
              : recStatus === 'STOPPED'
              ? '#ECFDF5'
              : '#F8FAFC',
          border:
            recStatus === 'RECORDING'
              ? '1px solid #FECACA'
              : recStatus === 'PAUSED'
              ? '1px solid #FDE68A'
              : recStatus === 'STOPPED'
              ? '1px solid #A7F3D0'
              : '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.6rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
          {recStatus === 'RECORDING' ? (
            <>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#DC2626',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#B91C1C' }} className="tabular-nums">
                MEREKAM EVALUASI ({formatTimer(recSeconds)})
              </span>
              <span style={{ fontSize: '0.725rem', color: '#7F1D1D' }}>
                • Penanda aba-aba aktif otomatis
              </span>
            </>
          ) : recStatus === 'PAUSED' ? (
            <>
              <Pause size={15} color="#B45309" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#B45309' }} className="tabular-nums">
                REKAMAN DIJEDA ({formatTimer(recSeconds)})
              </span>
            </>
          ) : recStatus === 'STOPPED' ? (
            <>
              <CheckCircle size={15} color="#059669" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#047857' }} className="tabular-nums">
                Rekaman Evaluasi Siap ({formatTimer(recSeconds)}) — otomatis diringkas AI setelah submit nilai
              </span>
            </>
          ) : (
            <>
              <Mic size={15} color="#7C3AED" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                Rekaman Suara Evaluasi (Standby):
              </span>
              <span style={{ fontSize: '0.725rem', color: '#64748B' }}>
                Aktifkan kapan saja untuk merekam koreksi sambil menilai.
              </span>
            </>
          )}
          {recError && (
            <span style={{ fontSize: '0.725rem', color: '#DC2626', fontWeight: 600 }}>
              • {recError}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          {recStatus === 'STANDBY' && (
            <button
              type="button"
              onClick={handleStartRecording}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.38rem 0.85rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: '#7C3AED',
                color: '#FFFFFF',
                fontSize: '0.775rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Mic size={14} />
              <span>Mulai Rekam</span>
            </button>
          )}

          {(recStatus === 'RECORDING' || recStatus === 'PAUSED') && (
            <>
              <button
                type="button"
                onClick={handleTogglePause}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {recStatus === 'RECORDING' ? <Pause size={13} /> : <Play size={13} />}
                <span>{recStatus === 'RECORDING' ? 'Jeda' : 'Lanjut'}</span>
              </button>
              <button
                type="button"
                onClick={handleStopRecordingManual}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Square size={12} fill="#FFFFFF" />
                <span>Selesai Rekam</span>
              </button>
            </>
          )}

          {recStatus === 'STOPPED' && (
            <button
              type="button"
              onClick={handleStartRecording}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.32rem 0.7rem',
                borderRadius: '8px',
                border: '1px solid #A7F3D0',
                backgroundColor: '#FFFFFF',
                color: '#047857',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={12} />
              <span>Rekam Ulang</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. AREA UTAMA: HANYA NAMA ABA-ABA & BARIS NILAI (SESUAI REVISI USER) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '850px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '1rem 0',
        }}
      >
        {currentAbaAba.category && (
          <span
            style={{
              backgroundColor: '#FFF1F2',
              color: '#BE123C',
              border: '1px solid #FECDD3',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.75rem',
            }}
          >
            Kategori: {currentAbaAba.category}
          </span>
        )}

        {/* Nama Aba-Aba */}
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 0.75rem 0',
            lineHeight: 1.25,
          }}
        >
          {currentAbaAba.name}
        </h1>

        {(currentAbaAba.desc || currentAbaAba.description) && (
          <p
            style={{
              fontSize: '0.9rem',
              color: '#64748B',
              margin: '0 0 2rem 0',
              maxWidth: '640px',
              lineHeight: 1.5,
            }}
          >
            {currentAbaAba.desc || currentAbaAba.description}
          </p>
        )}

        {/* Baris Kotak Opsi Nilai Dinamis sesuai konfigurasi Admin Panitia */}
        <div style={{ width: '100%', maxWidth: '820px' }}>
          <div
            className="juri-fullscreen-score-grid"
            style={{
              gridTemplateColumns: `repeat(${Math.min(Math.max(options.length, 4), 8)}, 1fr)`,
            }}
          >
            {options.map((val) => {
              const isSelected = currentScore === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleSelectScore(val)}
                  style={{
                    height: '82px',
                    borderRadius: '14px',
                    border: '2.5px solid #0F172A',
                    backgroundColor: isSelected ? '#0F172A' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#0F172A',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.12s ease',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isSelected
                      ? '0 8px 20px rgba(15, 23, 42, 0.35)'
                      : '0 2px 6px rgba(0, 0, 0, 0.04)',
                    userSelect: 'none',
                  }}
                  className="tabular-nums"
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Minimal Bottom Navigation: Sebelumnya & Selanjutnya */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          paddingTop: '1rem',
          borderTop: '1px solid #E2E8F0',
        }}
      >
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.6rem',
            borderRadius: '12px',
            border: '2px solid #E2E8F0',
            backgroundColor: currentIndex === 0 ? '#F8FAFC' : '#FFFFFF',
            color: currentIndex === 0 ? '#94A3B8' : '#0F172A',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            opacity: currentIndex === 0 ? 0.5 : 1,
          }}
        >
          <ChevronLeft size={20} />
          <span>Sebelumnya</span>
        </button>

        {!isLastAbaAba ? (
          <button
            type="button"
            onClick={handleNext}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 2rem',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#C94B3C',
              color: '#FFFFFF',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(201, 75, 60, 0.3)',
            }}
          >
            <span>Selanjutnya</span>
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.9rem 2.2rem',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#0D9488',
              color: '#FFFFFF',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              boxShadow: '0 4px 16px rgba(13, 148, 136, 0.35)',
            }}
          >
            <CheckCircle size={20} />
            <span>Submit & Kunci Nilai →</span>
          </button>
        )}
      </div>

      {/* POP-UP ALERT: ADA ABA-ABA YANG BELUM TERISI */}
      {missingItemsModal && missingItemsModal.length > 0 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
              borderTop: '5px solid #DC2626',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                  Belum Semua Penilaian Terisi!
                </h3>
                <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.825rem', color: '#64748B' }}>
                  Masih ada <strong>{missingItemsModal.length} aba-aba</strong> yang terlewat dan wajib diisi sebelum submit.
                </p>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                maxHeight: '220px',
                overflowY: 'auto',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                Daftar Nomor Aba-Aba yang Kosong:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#7F1D1D', fontWeight: 600 }}>
                {missingItemsModal.map((m) => (
                  <li key={m.id}>
                    <strong>Aba-Aba No. {m.number}</strong> — {m.name}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setMissingItemsModal(null)}
                style={{
                  padding: '0.65rem 1.1rem',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  const firstIdx = missingItemsModal[0].index;
                  setMissingItemsModal(null);
                  setCurrentIndex(firstIdx);
                }}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Lompat ke Aba-Aba No. {missingItemsModal[0].number} →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POP-UP KONFIRMASI SUBMIT & KUNCI NILAI */}
      {confirmSubmitModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
              borderTop: '5px solid #0D9488',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#ECFDF5',
                  color: '#0D9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Lock size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                  Konfirmasi Submit & Kunci Nilai
                </h3>
                <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.825rem', color: '#64748B' }}>
                  {team?.school} ({team?.teamName})
                </p>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '0.9rem 1rem',
                marginBottom: '0.9rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                Total Skor ({filledCount}/{abaAbaList.length} Aba-Aba Terisi):
              </span>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0D9488' }}>
                {totalScorePreview} Pts
              </span>
            </div>

            <div
              style={{
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '10px',
                padding: '0.75rem 0.95rem',
                fontSize: '0.8rem',
                color: '#92400E',
                lineHeight: 1.5,
                marginBottom: '1.1rem',
              }}
            >
              <strong>Perhatian Integritas Penilaian:</strong> Setelah disubmit, nilai langsung <strong>terkunci permanen</strong> di database dan tidak dapat diubah oleh Juri. Jika ada kesalahan input/human error, silakan konfirmasi secara lisan kepada <strong>Admin Panitia</strong> untuk melakukan koreksi.
            </div>

            {submitError && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.8rem',
                  color: '#B91C1C',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                {submitError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setConfirmSubmitModal(false)}
                style={{
                  padding: '0.65rem 1.1rem',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                Periksa Ulang
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmLockSubmit}
                style={{
                  padding: '0.65rem 1.35rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#0D9488',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  opacity: isSubmitting ? 0.75 : 1,
                }}
              >
                {isSubmitting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={16} />}
                <span>{isSubmitting ? 'Menyimpan ke Server...' : 'Ya, Submit & Kunci Nilai'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive CSS Grid:
          - Screen >= 640px (Tablet/Desktop): 1 baris menyamping 8 kolom
          - Screen < 640px (Mobile): 2 baris x 4 kolom */}
      <style>{`
        .juri-fullscreen-score-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(8, 1fr);
        }
        @media (max-width: 640px) {
          .juri-fullscreen-score-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
