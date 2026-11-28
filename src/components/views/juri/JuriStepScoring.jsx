import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Mic,
  Pause,
  Play,
  Square,
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
  const [missingItemsModal, setMissingItemsModal] = useState(null);
  const [confirmSubmitModal, setConfirmSubmitModal] = useState(false);

  // State Rekaman Suara Evaluasi (STANDBY + Pause/Resume + Timestamp Marker per Aba-Aba)
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
  const autoAdvanceTimerRef = useRef(null);

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
  const progressPct =
    abaAbaList.length > 0 ? Math.round((filledCount / abaAbaList.length) * 100) : 0;

  const clearAutoAdvance = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

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

  useEffect(() => {
    if (recStatus !== 'RECORDING') return;
    const interval = setInterval(() => {
      activeSecondsRef.current += 1;
      setRecSeconds(activeSecondsRef.current);
    }, 1000);
    return () => clearInterval(interval);
  }, [recStatus]);

  useEffect(() => {
    return () => {
      clearAutoAdvance();
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
      setRecError('Browser tidak mendukung mikrofon.');
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
        audioBitsPerSecond: 32000,
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
      recorder.start(1000);
      setRecStatus('RECORDING');
      recordMarkerForCurrent(currentAbaAba);
    } catch (err) {
      console.error('Failed starting judge mic:', err);
      setRecError('Izin mikrofon ditolak atau mic tidak terdeteksi.');
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

  // Klik nilai langsung otomatis lanjut ke aba-aba berikutnya (dengan jeda umpan balik visual 180ms)
  const handleSelectScore = (val) => {
    setScores((prev) => ({
      ...prev,
      [currentAbaAba.id]: val,
    }));

    clearAutoAdvance();
    if (currentIndex < abaAbaList.length - 1) {
      autoAdvanceTimerRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev < abaAbaList.length - 1 ? prev + 1 : prev));
        autoAdvanceTimerRef.current = null;
      }, 180);
    }
  };

  const handlePrev = () => {
    clearAutoAdvance();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    clearAutoAdvance();
    if (currentIndex < abaAbaList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleFinalSubmit = () => {
    clearAutoAdvance();
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
    <div className="juri-android-shell">
      {/* Thin Top Progress Bar */}
      <div style={{ width: '100%', height: '4px', backgroundColor: '#F1F5F9', flexShrink: 0 }}>
        <div
          style={{
            width: `${progressPct}%`,
            height: '100%',
            backgroundColor: progressPct === 100 ? '#059669' : '#DC2626',
            transition: 'width 0.2s ease',
          }}
        />
      </div>

      {/* 1. Compact Header (Android-First) */}
      <header className="juri-android-header">
        <button
          type="button"
          onClick={onCancel}
          className="juri-back-btn"
          title="Keluar dari lembar penilaian"
        >
          <X size={18} />
          <span className="juri-hide-xs">Kembali</span>
        </button>

        <div style={{ textAlign: 'center', flex: 1, minWidth: 0, padding: '0 0.5rem' }}>
          <div
            style={{
              fontSize: 'clamp(0.88rem, 3.6vw, 1.02rem)',
              fontWeight: 800,
              color: '#0F172A',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {team?.school || 'Kontingen Peserta'}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.1rem' }} className="tabular-nums">
            Urut {team?.orderNumber || '01'} · No. {currentIndex + 1}/{abaAbaList.length} ·{' '}
            <strong style={{ color: filledCount === abaAbaList.length ? '#059669' : '#B45309' }}>
              Terisi {filledCount}/{abaAbaList.length}
            </strong>
          </div>
        </div>

        <div
          style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            color: '#B91C1C',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            padding: '0.22rem 0.55rem',
            borderRadius: '9999px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {currentAbaAba.category || judge?.category || 'PBB'}
        </div>
      </header>

      {/* 1B. Compact Red Voice Note Bar (Standby / Recording / Paused / Stopped) */}
      <div className="juri-android-voice-wrap">
        <div
          className="juri-android-voice-bar"
          style={{
            backgroundColor:
              recStatus === 'RECORDING'
                ? '#FEF2F2'
                : recStatus === 'PAUSED'
                ? '#FFFBEB'
                : recStatus === 'STOPPED'
                ? '#ECFDF5'
                : '#FFF5F5',
            borderColor:
              recStatus === 'RECORDING'
                ? '#FCA5A5'
                : recStatus === 'PAUSED'
                ? '#FDE68A'
                : recStatus === 'STOPPED'
                ? '#A7F3D0'
                : '#FECACA',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
            {recStatus === 'RECORDING' ? (
              <>
                <span
                  style={{
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: '#DC2626',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#B91C1C' }} className="tabular-nums">
                  MEREKAM {formatTimer(recSeconds)}
                </span>
              </>
            ) : recStatus === 'PAUSED' ? (
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#B45309' }} className="tabular-nums">
                DIJEDA ({formatTimer(recSeconds)})
              </span>
            ) : recStatus === 'STOPPED' ? (
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#047857' }} className="tabular-nums">
                Rekaman siap ({formatTimer(recSeconds)}) — otomatis diringkas AI
              </span>
            ) : (
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#7F1D1D' }}>
                Voice Note Juri (Standby)
              </span>
            )}
            {recError && (
              <span style={{ fontSize: '0.72rem', color: '#DC2626', fontWeight: 600 }}>
                · {recError}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            {recStatus === 'STANDBY' && (
              <button
                type="button"
                onClick={handleStartRecording}
                className="juri-voice-red-btn"
              >
                <Mic size={14} />
                <span>Rekam</span>
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
                    gap: '0.28rem',
                    minHeight: '36px',
                    padding: '0.35rem 0.7rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A',
                    fontSize: '0.76rem',
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
                  className="juri-voice-red-btn"
                  style={{ borderRadius: '8px' }}
                >
                  <Square size={12} fill="#FFFFFF" />
                  <span>Stop</span>
                </button>
              </>
            )}

            {recStatus === 'STOPPED' && (
              <button
                type="button"
                onClick={handleStartRecording}
                style={{
                  minHeight: '34px',
                  padding: '0.32rem 0.7rem',
                  borderRadius: '8px',
                  border: '1px solid #FECACA',
                  backgroundColor: '#FFFFFF',
                  color: '#DC2626',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Rekam Ulang
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Scoring Stage (Centered, Scroll-Safe on Android) */}
      <main className="juri-android-stage">
        <div className="juri-android-stage-inner">
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#64748B',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.35rem',
            }}
            className="tabular-nums"
          >
            ABA-ABA {String(currentIndex + 1).padStart(2, '0')} DARI {String(abaAbaList.length).padStart(2, '0')}
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.38rem, 5.2vw, 2.05rem)',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 0.45rem 0',
              lineHeight: 1.22,
            }}
          >
            {currentAbaAba.name}
          </h1>

          {(currentAbaAba.desc || currentAbaAba.description) && (
            <p
              style={{
                fontSize: 'clamp(0.8rem, 3vw, 0.92rem)',
                color: '#64748B',
                margin: '0 auto 1.35rem auto',
                maxWidth: '600px',
                lineHeight: 1.45,
              }}
            >
              {currentAbaAba.desc || currentAbaAba.description}
            </p>
          )}

          {/* Score Tiles Grid (Android-friendly big touch targets) */}
          <div style={{ width: '100%', maxWidth: '820px', marginTop: (currentAbaAba.desc || currentAbaAba.description) ? 0 : '1.15rem' }}>
            <div
              className="juri-fullscreen-score-grid"
              style={{
                '--cols-desktop': Math.min(Math.max(options.length, 4), 8),
              }}
            >
              {options.map((val) => {
                const isSelected = currentScore === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSelectScore(val)}
                    className={`juri-score-tile tabular-nums ${isSelected ? 'is-selected' : ''}`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: '0.85rem', fontSize: '0.73rem', color: '#94A3B8', fontWeight: 500 }}>
              {isLastAbaAba
                ? 'Aba-aba terakhir — pilih nilai lalu tekan Submit & Kunci Nilai di bawah.'
                : 'Ketuk angka untuk langsung lanjut otomatis ke aba-aba berikutnya.'}
            </div>
          </div>
        </div>
      </main>

      {/* 3. Sticky Thumb-Friendly Bottom Navigation */}
      <footer className="juri-android-footer">
        <div className="juri-android-footer-inner">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="juri-nav-btn juri-nav-prev"
          >
            <ChevronLeft size={19} />
            <span>Sebelumnya</span>
          </button>

          {!isLastAbaAba ? (
            <button
              type="button"
              onClick={handleNext}
              className="juri-nav-btn juri-nav-next"
            >
              <span>Selanjutnya</span>
              <ChevronRight size={19} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="juri-nav-btn juri-nav-submit"
            >
              <span>{isSubmitting ? 'Menyimpan...' : 'Submit & Kunci Nilai'}</span>
            </button>
          )}
        </div>
      </footer>

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
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '1.35rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
              borderTop: '4px solid #DC2626',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
              Belum Semua Penilaian Terisi
            </h3>
            <p style={{ margin: '0.25rem 0 0.9rem 0', fontSize: '0.82rem', color: '#64748B' }}>
              Masih ada <strong>{missingItemsModal.length} aba-aba</strong> yang terlewat dan wajib diisi sebelum submit.
            </p>

            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '10px',
                padding: '0.8rem 0.95rem',
                maxHeight: '210px',
                overflowY: 'auto',
                marginBottom: '1.1rem',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Daftar Nomor Aba-Aba yang Kosong:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.83rem', color: '#7F1D1D', fontWeight: 600 }}>
                {missingItemsModal.map((m) => (
                  <li key={m.id}>
                    <strong>No. {m.number}</strong> — {m.name}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.55rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setMissingItemsModal(null)}
                style={{
                  minHeight: '44px',
                  padding: '0.6rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontSize: '0.84rem',
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
                  minHeight: '44px',
                  padding: '0.6rem 1.15rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Lompat ke No. {missingItemsModal[0].number}
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
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              padding: '1.35rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
              borderTop: '4px solid #0D9488',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800, color: '#0F172A' }}>
              Konfirmasi Submit & Kunci Nilai
            </h3>
            <p style={{ margin: '0.2rem 0 0.9rem 0', fontSize: '0.82rem', color: '#64748B' }}>
              {team?.school} ({team?.teamName})
            </p>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                marginBottom: '0.85rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '0.83rem', color: '#475569', fontWeight: 600 }}>
                Total Skor ({filledCount}/{abaAbaList.length} Aba-Aba):
              </span>
              <span className="tabular-nums" style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0D9488' }}>
                {totalScorePreview} Pts
              </span>
            </div>

            <div
              style={{
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '10px',
                padding: '0.7rem 0.9rem',
                fontSize: '0.78rem',
                color: '#92400E',
                lineHeight: 1.5,
                marginBottom: '1rem',
              }}
            >
              <strong>Perhatian Integritas Penilaian:</strong> Setelah disubmit, nilai langsung <strong>terkunci permanen</strong> di database dan tidak dapat diubah oleh Juri. Jika ada kesalahan input, silakan konfirmasi lisan kepada <strong>Admin Panitia</strong>.
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
                  marginBottom: '0.9rem',
                }}
              >
                {submitError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.55rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setConfirmSubmitModal(false)}
                style={{
                  minHeight: '44px',
                  padding: '0.6rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontSize: '0.84rem',
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
                  minHeight: '44px',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#0D9488',
                  color: '#FFFFFF',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  opacity: isSubmitting ? 0.75 : 1,
                }}
              >
                {isSubmitting && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
                <span>{isSubmitting ? 'Menyimpan...' : 'Ya, Submit & Kunci'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .juri-android-shell {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          background-color: #FFFFFF;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          font-family: var(--font-sans);
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
        }
        .juri-android-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid #E2E8F0;
          flex-shrink: 0;
          box-sizing: border-box;
        }
        .juri-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: transparent;
          border: none;
          color: #64748B;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0.4rem 0.5rem;
          min-height: 40px;
          border-radius: 8px;
          flex-shrink: 0;
        }
        .juri-android-voice-wrap {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 0.6rem 1.25rem 0 1.25rem;
          flex-shrink: 0;
          box-sizing: border-box;
        }
        .juri-android-voice-bar {
          padding: 0.5rem 0.85rem;
          border-radius: 12px;
          border: 1px solid #FECACA;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.55rem;
          flex-wrap: wrap;
        }
        .juri-voice-red-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          min-height: 36px;
          padding: 0.38rem 0.9rem;
          border-radius: 9999px;
          border: none;
          background-color: #DC2626;
          color: #FFFFFF;
          font-size: 0.78rem;
          font-weight: 800;
          cursor: pointer;
          touch-action: manipulation;
        }
        .juri-voice-red-btn:active {
          background-color: #B91C1C;
          transform: scale(0.97);
        }
        .juri-android-stage {
          flex: 1;
          overflow-y: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 1.25rem;
          box-sizing: border-box;
        }
        .juri-android-stage-inner {
          width: 100%;
          max-width: 850px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: auto 0;
        }
        .juri-fullscreen-score-grid {
          display: grid;
          gap: 0.85rem;
          grid-template-columns: repeat(var(--cols-desktop, 8), 1fr);
        }
        .juri-score-tile {
          min-height: 78px;
          border-radius: 14px;
          border: 2px solid #0F172A;
          background-color: #FFFFFF;
          color: #0F172A;
          font-family: var(--font-sans);
          font-size: 1.65rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.1s ease, background-color 0.1s ease, color 0.1s ease;
          user-select: none;
          touch-action: manipulation;
        }
        .juri-score-tile:active {
          transform: scale(0.95);
        }
        .juri-score-tile.is-selected {
          background-color: #0F172A;
          color: #FFFFFF;
          transform: scale(1.03);
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.28);
        }
        .juri-android-footer {
          flex-shrink: 0;
          border-top: 1px solid #E2E8F0;
          background-color: #FFFFFF;
          padding: 0.8rem 1.25rem calc(0.85rem + env(safe-area-inset-bottom, 0px)) 1.25rem;
          box-sizing: border-box;
        }
        .juri-android-footer-inner {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
        }
        .juri-nav-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          min-height: 50px;
          padding: 0.75rem 1.45rem;
          border-radius: 12px;
          font-size: 0.92rem;
          font-weight: 800;
          cursor: pointer;
          touch-action: manipulation;
        }
        .juri-nav-prev {
          border: 1.5px solid #CBD5E1;
          background-color: #FFFFFF;
          color: #0F172A;
        }
        .juri-nav-prev:disabled {
          background-color: #F8FAFC;
          color: #94A3B8;
          cursor: not-allowed;
          opacity: 0.55;
        }
        .juri-nav-next {
          border: none;
          background-color: #C94B3C;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(201, 75, 60, 0.28);
        }
        .juri-nav-submit {
          border: none;
          background-color: #0D9488;
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(13, 148, 136, 0.32);
        }
        @media (max-width: 640px) {
          .juri-android-header {
            padding: 0.65rem 0.85rem;
          }
          .juri-hide-xs {
            display: none;
          }
          .juri-android-voice-wrap {
            padding: 0.5rem 0.85rem 0 0.85rem;
          }
          .juri-android-stage {
            padding: 0.85rem 0.9rem;
          }
          .juri-fullscreen-score-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 0.65rem;
          }
          .juri-score-tile {
            min-height: 66px;
            font-size: 1.45rem;
            border-radius: 12px;
          }
          .juri-android-footer {
            padding: 0.7rem 0.85rem calc(0.85rem + env(safe-area-inset-bottom, 0px)) 0.85rem;
          }
          .juri-nav-btn {
            flex: 1;
            min-height: 52px;
            padding: 0.75rem 0.9rem;
            font-size: 0.88rem;
          }
        }
        @media (max-width: 380px) {
          .juri-fullscreen-score-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
