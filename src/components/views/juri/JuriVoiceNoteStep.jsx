import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  ArrowLeft,
  Loader2,
  Pause,
  Play,
  ChevronDown,
  ChevronUp,
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

export default function JuriVoiceNoteStep({
  eventId,
  team,
  judge,
  scores = {},
  abaAbaList = [],
  scoresLocked = true,
  recordedAudio = null,
  onBackToScoring,
  onFinishFeedback,
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiWarning, setAiWarning] = useState('');
  const [usedMarkers, setUsedMarkers] = useState(false);

  const [feedbackId, setFeedbackId] = useState(null);
  const [rawTranscript, setRawTranscript] = useState('');
  const [showRawTranscript, setShowRawTranscript] = useState(false);
  const [aiDraft, setAiDraft] = useState('');

  const [localAudioUrl, setLocalAudioUrl] = useState(null);
  const [audioStorageUrl, setAudioStorageUrl] = useState(null);
  const [audioDurationSec, setAudioDurationSec] = useState(recordedAudio?.durationSec || 0);

  const [countdown, setCountdown] = useState(null);
  const [isSendingFinal, setIsSendingFinal] = useState(false);
  const [sendError, setSendError] = useState('');
  const [isSent, setIsSent] = useState(false);

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const chunksRef = useRef([]);
  const hasAutoProcessedRef = useRef(false);
  const latestBlobRef = useRef(recordedAudio?.blob || null);
  const latestMimeRef = useRef(recordedAudio?.mimeType || 'audio/webm');
  const latestMarkersRef = useRef(recordedAudio?.markers || []);

  const totalScore = Object.values(scores).reduce((sum, v) => sum + (Number(v) || 0), 0);
  const maxPossibleScore = abaAbaList.reduce((sum, item) => {
    const maxOpt =
      Array.isArray(item.options) && item.options.length > 0
        ? Math.max(...item.options.map((v) => Number(v) || 0))
        : Number(item.maxScore) || 100;
    return sum + maxOpt;
  }, 0);

  const processAudioWithGroq = async (blob, mimeType = 'audio/webm', markers = []) => {
    if (!blob || blob.size === 0) return;

    latestBlobRef.current = blob;
    latestMimeRef.current = mimeType;
    latestMarkersRef.current = markers;

    setLocalAudioUrl((prevUrl) => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return URL.createObjectURL(blob);
    });

    setIsProcessingAi(true);
    setAiError('');
    setAiWarning('');

    try {
      const formData = new FormData();
      const ext = mimeType.includes('ogg')
        ? 'ogg'
        : mimeType.includes('mp4')
        ? 'm4a'
        : 'webm';
      formData.append('file', blob, `juri-voice.${ext}`);
      formData.append('eventId', eventId || team?.eventId || '');
      formData.append('participantId', team?.id || '');
      formData.append('teamName', team?.teamName || '');
      formData.append('schoolName', team?.school || '');
      formData.append('judgeCategory', judge?.category || '');
      if (Array.isArray(markers) && markers.length > 0) {
        formData.append('abaAbaMarkers', JSON.stringify(markers));
      }
      if (Array.isArray(abaAbaList) && abaAbaList.length > 0) {
        const names = abaAbaList
          .map((item) => item?.title || item?.name || '')
          .filter(Boolean);
        if (names.length > 0) {
          formData.append('abaAbaNames', JSON.stringify(names));
        }
      }

      const res = await fetch('/api/ai/voice-feedback', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();

      if (data.audioStorageUrl) setAudioStorageUrl(data.audioStorageUrl);
      if (data.feedbackId) setFeedbackId(data.feedbackId);

      if (!res.ok || !data.success) {
        setAiError(
          data.message ||
            'Gagal memproses audio melalui AI Groq. Anda dapat mencoba ulang, merekam ulang, atau mengetik catatan manual.'
        );
        return;
      }

      setRawTranscript(data.rawTranscript || '');
      setAiDraft(data.refinedText || data.rawTranscript || '');
      setUsedMarkers(Boolean(data.usedMarkers));
      if (data.aiWarning) setAiWarning(data.aiWarning);
      if (data.audioUploadError) {
        setAiWarning((prev) =>
          prev
            ? `${prev} (Catatan penyimpanan audio: ${data.audioUploadError})`
            : `Audio berhasil ditranskrip, namun gagal diunggah ke storage: ${data.audioUploadError}`
        );
      }
    } catch (err) {
      console.error('Error processing voice feedback:', err);
      setAiError(
        'Terjadi kendala koneksi saat memproses suara ke server AI. Silakan coba proses ulang atau ketik catatan secara manual.'
      );
    } finally {
      setIsProcessingAi(false);
    }
  };

  useEffect(() => {
    if (recordedAudio?.blob && !hasAutoProcessedRef.current) {
      hasAutoProcessedRef.current = true;
      setAudioDurationSec(recordedAudio.durationSec || 0);
      processAudioWithGroq(
        recordedAudio.blob,
        recordedAudio.mimeType || 'audio/webm',
        recordedAudio.markers || []
      );
    }
  }, [recordedAudio]);

  useEffect(() => {
    if (!isRecording || isPaused) return;
    const interval = setInterval(() => {
      setRecordSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

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

  const handleStartRecordHere = async () => {
    setAiError('');
    setAiWarning('');
    setSendError('');
    setCountdown(null);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setAiError('Browser tidak mendukung perekaman mikrofon.');
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
      setRecordSeconds(0);
      setIsPaused(false);

      const mimeType = pickSupportedAudioMimeType();
      const recorder = new MediaRecorder(stream, {
        ...(mimeType ? { mimeType } : {}),
        audioBitsPerSecond: 32000,
      });
      const actualMime = recorder.mimeType || mimeType || 'audio/webm';

      recorder.ondataavailable = (evt) => {
        if (evt.data && evt.data.size > 0) chunksRef.current.push(evt.data);
      };

      recorder.onstop = () => {
        const finalBlob =
          chunksRef.current.length > 0
            ? new Blob(chunksRef.current, { type: actualMime })
            : null;
        try {
          mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
        } catch {}
        mediaStreamRef.current = null;
        setIsRecording(false);
        setIsPaused(false);
        if (finalBlob) {
          setAudioDurationSec(recordSeconds);
          processAudioWithGroq(finalBlob, actualMime, []);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000);
      setIsRecording(true);
    } catch (err) {
      console.error('Mic error:', err);
      setAiError('Izin mikrofon ditolak atau perangkat mikrofon tidak ditemukan.');
    }
  };

  const handleStopRecordHere = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleTogglePauseHere = () => {
    const rec = mediaRecorderRef.current;
    if (!rec) return;
    if (rec.state === 'recording') {
      rec.pause();
      setIsPaused(true);
    } else if (rec.state === 'paused') {
      rec.resume();
      setIsPaused(false);
    }
  };

  const executeFinalSend = async () => {
    const finalText = aiDraft.trim();
    if (!finalText) {
      setSendError('Teks evaluasi belum diisi. Rekam suara atau ketik catatan terlebih dahulu.');
      setCountdown(null);
      return;
    }

    setIsSendingFinal(true);
    setSendError('');
    setCountdown(null);

    try {
      let res;
      if (feedbackId) {
        res = await fetch(`/api/ai/voice-feedback/${encodeURIComponent(feedbackId)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            eventId: eventId || team?.eventId,
            participantId: team?.id,
            refinedText: finalText,
            rawTranscript,
            audioStorageUrl,
          }),
        });
      } else {
        res = await fetch('/api/ai/voice-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            eventId: eventId || team?.eventId,
            participantId: team?.id,
            refinedText: finalText,
            rawTranscript: rawTranscript || finalText,
            confirmSend: true,
          }),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        setSendError(data.message || 'Gagal mengirim evaluasi ke server.');
        setIsSendingFinal(false);
        return;
      }

      setIsSent(true);
      setTimeout(() => {
        onFinishFeedback({
          feedbackId: data.feedback?.id || data.feedbackId || feedbackId,
          feedbackText: finalText,
          audioStorageUrl: data.feedback?.audioStorageUrl || data.audioStorageUrl || audioStorageUrl,
          status: 'SENT',
        });
      }, 900);
    } catch (err) {
      console.error('Send feedback error:', err);
      setSendError('Gagal terhubung ke server saat mengirim evaluasi.');
      setIsSendingFinal(false);
    }
  };

  const handleStartSend = () => {
    setSendError('');
    if (!aiDraft.trim()) {
      setSendError('Teks evaluasi masih kosong. Rekam suara atau ketik catatan evaluasi terlebih dahulu.');
      return;
    }
    setCountdown(5);
  };

  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (countdown === 0 && !isSendingFinal && !isSent) {
      executeFinalSend();
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const activePlayerSrc = audioStorageUrl || localAudioUrl;

  return (
    <div className="juri-voice-shell">
      {/* 1. Compact Header */}
      <header className="juri-voice-header">
        {scoresLocked ? (
          <span
            style={{
              color: '#047857',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              padding: '0.25rem 0.6rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              whiteSpace: 'nowrap',
            }}
          >
            Nilai Terkunci
          </span>
        ) : (
          <button
            type="button"
            onClick={onBackToScoring}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: 'transparent',
              border: 'none',
              color: '#64748B',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={17} />
            <span>Kembali</span>
          </button>
        )}

        <div style={{ textAlign: 'center', flex: 1, minWidth: 0, padding: '0 0.5rem' }}>
          <div style={{ fontSize: 'clamp(0.9rem, 3.6vw, 1.05rem)', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {team?.school || 'Kontingen Peserta'}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#64748B' }} className="tabular-nums">
            Total Skor: <strong style={{ color: '#0D9488' }}>{totalScore}</strong> / {maxPossibleScore} Pts
          </div>
        </div>

        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#DC2626', textAlign: 'right', whiteSpace: 'nowrap' }}>
          Voice Note
        </div>
      </header>

      {/* 2. Scrollable Body */}
      <main className="juri-voice-body">
        <div style={{ width: '100%', maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Audio Card */}
          <div
            style={{
              width: '100%',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.65rem' }}>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F172A' }}>
                  Rekaman Suara Evaluasi Dewan Juri
                </div>
                <div style={{ fontSize: '0.73rem', color: '#64748B', marginTop: '0.1rem' }}>
                  Groq Whisper v3 + AI Paskibra · Audio asli disimpan untuk peserta
                </div>
              </div>

              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecordHere}
                  disabled={isProcessingAi || isSent || isSendingFinal}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    minHeight: '42px',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '9999px',
                    border: 'none',
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: isProcessingAi || isSent ? 'not-allowed' : 'pointer',
                    opacity: isProcessingAi || isSent ? 0.65 : 1,
                    touchAction: 'manipulation',
                  }}
                >
                  <Mic size={15} />
                  <span>{activePlayerSrc ? 'Rekam Ulang Suara' : 'Mulai Rekam Suara'}</span>
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#DC2626' }} className="tabular-nums">
                    ● {formatTimer(recordSeconds)}
                  </span>
                  <button
                    type="button"
                    onClick={handleTogglePauseHere}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      minHeight: '38px',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      color: '#0F172A',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {isPaused ? <Play size={13} /> : <Pause size={13} />}
                    <span>{isPaused ? 'Lanjut' : 'Jeda'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleStopRecordHere}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      minHeight: '38px',
                      padding: '0.42rem 0.9rem',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    <MicOff size={14} />
                    <span>Stop & Proses AI</span>
                  </button>
                </div>
              )}
            </div>

            {activePlayerSrc && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <audio controls src={activePlayerSrc} style={{ width: '100%', height: '38px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B' }}>
                  <span>
                    {audioStorageUrl
                      ? 'Audio asli tersimpan di Supabase Storage'
                      : isProcessingAi
                      ? 'Mengunggah audio ke Supabase Storage...'
                      : 'Preview audio lokal'}
                  </span>
                  {audioDurationSec > 0 && <span className="tabular-nums">Durasi: {formatTimer(audioDurationSec)}</span>}
                </div>
              </div>
            )}

            {isProcessingAi && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.68rem 0.9rem',
                  borderRadius: '10px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#B91C1C',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                <Loader2 size={15} style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                <span>Memproses transkripsi Groq Whisper v3 & merapikan catatan Paskibra...</span>
              </div>
            )}

            {aiError && (
              <div
                style={{
                  padding: '0.72rem 0.9rem',
                  borderRadius: '10px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#991B1B',
                  fontSize: '0.79rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <span>{aiError}</span>
                {latestBlobRef.current && (
                  <button
                    type="button"
                    onClick={() =>
                      processAudioWithGroq(
                        latestBlobRef.current,
                        latestMimeRef.current,
                        latestMarkersRef.current
                      )
                    }
                    style={{
                      padding: '0.35rem 0.7rem',
                      borderRadius: '7px',
                      border: '1px solid #FCA5A5',
                      backgroundColor: '#FFFFFF',
                      color: '#991B1B',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Coba Proses Ulang
                  </button>
                )}
              </div>
            )}

            {aiWarning && (
              <div
                style={{
                  padding: '0.62rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  color: '#92400E',
                  fontSize: '0.77rem',
                }}
              >
                {aiWarning}
              </div>
            )}
          </div>

          {/* Review & Edit Draft AI */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#991B1B' }}>
                Ringkasan Evaluasi Dewan Juri (Dapat Diedit)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {usedMarkers && (
                  <span
                    style={{
                      backgroundColor: '#ECFDF5',
                      color: '#047857',
                      border: '1px solid #A7F3D0',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                    }}
                  >
                    Per Aba-Aba
                  </span>
                )}
                <span
                  style={{
                    backgroundColor: isSent ? '#ECFDF5' : '#FEF2F2',
                    color: isSent ? '#047857' : '#B91C1C',
                    border: `1px solid ${isSent ? '#A7F3D0' : '#FECACA'}`,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                  }}
                >
                  {isSent ? 'TERKIRIM' : 'DRAFT AI'}
                </span>
              </div>
            </div>

            <textarea
              value={aiDraft}
              onChange={(e) => {
                setAiDraft(e.target.value);
                if (countdown !== null) setCountdown(null);
              }}
              disabled={isProcessingAi || isSent || isSendingFinal}
              rows={6}
              placeholder="Rekam suara di atas agar AI merangkum otomatis, atau ketik catatan evaluasi resmi untuk tim peserta di sini..."
              style={{
                width: '100%',
                padding: '0.85rem 0.95rem',
                borderRadius: '12px',
                border: '1.5px solid #FCA5A5',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                lineHeight: 1.55,
                color: '#0F172A',
                backgroundColor: '#FFFBFB',
                resize: 'vertical',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />

            {rawTranscript && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowRawTranscript((v) => !v)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#64748B',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  {showRawTranscript ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  <span>{showRawTranscript ? 'Sembunyikan Transkrip Mentah' : 'Lihat Transkrip Mentah'}</span>
                </button>
                {showRawTranscript && (
                  <div
                    style={{
                      marginTop: '0.4rem',
                      padding: '0.7rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.78rem',
                      color: '#475569',
                      lineHeight: 1.5,
                    }}
                  >
                    "{rawTranscript}"
                  </div>
                )}
              </div>
            )}
          </div>

          {sendError && (
            <div
              style={{
                padding: '0.7rem 0.95rem',
                borderRadius: '10px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#B91C1C',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              {sendError}
            </div>
          )}

          {isSent && (
            <div
              style={{
                padding: '0.85rem 1.1rem',
                borderRadius: '10px',
                backgroundColor: '#ECFDF5',
                border: '1.5px solid #059669',
                color: '#065F46',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              Evaluasi & rekaman suara resmi terkirim! Kembali ke daftar pasukan...
            </div>
          )}
        </div>
      </main>

      {/* 3. Sticky Bottom Actions (Android-Friendly) */}
      <footer className="juri-voice-footer">
        <div className="juri-voice-footer-inner">
          {scoresLocked ? (
            <button
              type="button"
              onClick={() =>
                onFinishFeedback({
                  feedbackId,
                  feedbackText: '',
                  audioStorageUrl,
                  status: 'SKIPPED',
                })
              }
              disabled={isSent || isSendingFinal}
              className="juri-voice-secondary-btn"
            >
              Lewati & Kembali
            </button>
          ) : (
            <button
              type="button"
              onClick={onBackToScoring}
              disabled={isSent || isSendingFinal}
              className="juri-voice-secondary-btn"
            >
              Kembali ke Nilai
            </button>
          )}

          {countdown !== null ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <div
                className="tabular-nums"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                }}
              >
                {countdown}
              </div>
              <button
                type="button"
                onClick={() => setCountdown(null)}
                style={{
                  minHeight: '44px',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '9px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeFinalSend}
                disabled={isSendingFinal}
                style={{
                  minHeight: '44px',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Kirim Sekarang
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleStartSend}
              disabled={isSent || isProcessingAi || isSendingFinal || isRecording}
              className="juri-voice-primary-btn"
            >
              {isSendingFinal && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              <span>{isSendingFinal ? 'Mengirim...' : 'Setujui & Kirim Feedback (5s)'}</span>
            </button>
          )}
        </div>
      </footer>

      <style>{`
        .juri-voice-shell {
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
        }
        .juri-voice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 850px;
          margin: 0 auto;
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid #E2E8F0;
          flex-shrink: 0;
          box-sizing: border-box;
        }
        .juri-voice-body {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 1.25rem;
          box-sizing: border-box;
        }
        .juri-voice-footer {
          flex-shrink: 0;
          border-top: 1px solid #E2E8F0;
          background-color: #FFFFFF;
          padding: 0.8rem 1.25rem calc(0.85rem + env(safe-area-inset-bottom, 0px)) 1.25rem;
          box-sizing: border-box;
        }
        .juri-voice-footer-inner {
          width: 100%;
          max-width: 850px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
        }
        .juri-voice-secondary-btn {
          min-height: 48px;
          padding: 0.7rem 1.25rem;
          border-radius: 10px;
          border: 1.5px solid #E2E8F0;
          background-color: #FFFFFF;
          color: #64748B;
          font-size: 0.86rem;
          font-weight: 700;
          cursor: pointer;
          touch-action: manipulation;
        }
        .juri-voice-primary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          min-height: 48px;
          padding: 0.75rem 1.75rem;
          border-radius: 12px;
          background-color: #DC2626;
          color: #FFFFFF;
          border: none;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.3);
          touch-action: manipulation;
        }
        .juri-voice-primary-btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        @media (max-width: 640px) {
          .juri-voice-header,
          .juri-voice-body {
            padding-left: 0.85rem;
            padding-right: 0.85rem;
          }
          .juri-voice-footer {
            padding: 0.75rem 0.85rem calc(0.85rem + env(safe-area-inset-bottom, 0px)) 0.85rem;
          }
          .juri-voice-footer-inner {
            flex-direction: column-reverse;
            align-items: stretch;
          }
          .juri-voice-primary-btn,
          .juri-voice-secondary-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
