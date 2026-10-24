import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  CheckCircle,
  ArrowLeft,
  FileText,
  AlertCircle,
  Radio,
  X,
} from 'lucide-react';

export default function JuriVoiceNoteStep({
  team,
  judge,
  scores = {},
  abaAbaList = [],
  onBackToScoring,
  onFinishFeedback,
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [aiDraft, setAiDraft] = useState('');
  const [countdown, setCountdown] = useState(null);
  const [isSent, setIsSent] = useState(false);

  const totalScore = Object.values(scores).reduce((sum, v) => sum + (Number(v) || 0), 0);
  const maxPossibleScore = abaAbaList.length * 22;

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setAiDraft('');
    } else {
      setIsRecording(false);
      setIsProcessingAi(true);

      setTimeout(() => {
        setIsProcessingAi(false);
        const sampleFeedback = `Catatan Dewan Juri untuk ${team?.school || 'SMAN 1 Jakarta'} (Pasukan ${team?.teamName || 'Garuda Sakti'}):
Secara umum penampilan sangat memukau dengan penguasaan lapangan yang solid. Kerapihan saf dan banjar pada langkah tegap sangat sinkron dan selaras dengan ketukan tempo.
Catatan evaluasi khusus: Pada transisi gerakan hadap serong kanan, hentakan kaki penutup banjar kedua sedikit mendahului komando danton. Artikulasi danton prima, tempo hentakan stabil.`;
        setAiDraft(sampleFeedback);
      }, 900);
    }
  };

  const handleInstantDemo = () => {
    setIsProcessingAi(true);
    setTimeout(() => {
      setIsProcessingAi(false);
      setAiDraft(
        `Catatan Evaluasi Resmi Dewan Juri untuk ${team?.school || 'SMAN 1 Jakarta'}:
1. Kerapihan & Sikap: Tumit merapat konsisten, dada membusung tegap, keseragaman sudut pandang 100% terjaga.
2. Kekompakan Gerak: Gerakan PBB dasar sangat rapi dan berwibawa. Pada aba-aba penghormatan, sudut tangan presisi di pelipis.
3. Rekomendasi: Perhatikan hentakan penutup banjar kiri pada langkah tegap ke langkah biasa agar ketukan tidak terburu-buru.`
      );
    }, 400);
  };

  const handleStartSend = () => {
    setCountdown(3);
  };

  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsSent(true);
      setCountdown(null);
      setTimeout(() => {
        onFinishFeedback(aiDraft || 'Penilaian selesai dengan catatan evaluasi standar dewan juri.');
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown, aiDraft, onFinishFeedback]);

  const handleSendImmediately = () => {
    setIsSent(true);
    setCountdown(null);
    setTimeout(() => {
      onFinishFeedback(aiDraft || 'Penilaian selesai dengan catatan evaluasi standar dewan juri.');
    }, 700);
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
        overflowY: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* 1. Header Minimal */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '850px',
          margin: '0 auto',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '0.85rem',
        }}
      >
        <button
          type="button"
          onClick={onBackToScoring}
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
          }}
        >
          <ArrowLeft size={18} />
          <span>Kembali ke Nilai</span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
            {team?.school || 'SMAN 1 Jakarta'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Total Skor: <strong style={{ color: '#0D9488' }}>{totalScore}</strong> / {maxPossibleScore} Pts
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7C3AED' }}>
          AI Voice Note
        </div>
      </div>

      {/* 2. AREA TENGAH: VOICE RECORDING & AI DRAFT */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '750px',
          margin: '0 auto',
          padding: '1.5rem 0',
          gap: '1.5rem',
        }}
      >
        {/* Tombol Rekam Suara Besar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
          <button
            type="button"
            onClick={handleToggleRecord}
            disabled={isProcessingAi || isSent}
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              backgroundColor: isRecording ? '#DC2626' : '#7C3AED',
              color: '#FFFFFF',
              border: isRecording ? '5px solid #FCA5A5' : 'none',
              cursor: isProcessingAi || isSent ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isRecording
                ? '0 0 0 12px rgba(220, 38, 38, 0.2)'
                : '0 8px 24px rgba(124, 58, 237, 0.35)',
              transition: 'all 0.15s ease',
              transform: isRecording ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {isRecording ? <MicOff size={38} /> : <Mic size={38} />}
          </button>

          {isRecording ? (
            <div style={{ color: '#DC2626', fontWeight: 800, fontSize: '1rem' }}>
              SEDANG MEREKAM... ({formatTimer(recordSeconds)})
            </div>
          ) : isProcessingAi ? (
            <div style={{ color: '#7C3AED', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} />
              <span>Memproses Transkripsi AI...</span>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                Sentuh Mic untuk Rekam Evaluasi Suara
              </div>
              <button
                type="button"
                onClick={handleInstantDemo}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#7C3AED',
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginTop: '0.35rem',
                }}
              >
                ⚡ Isi Otomatis Contoh Evaluasi AI (Demo Cepat)
              </button>
            </div>
          )}
        </div>

        {/* Hasil Transkripsi AI */}
        {aiDraft && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6D28D9' }}>
              Hasil Evaluasi AI (Dapat Dikoreksi Juri):
            </div>
            <textarea
              value={aiDraft}
              onChange={(e) => setAiDraft(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                border: '1.5px solid #C4B5FD',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.925rem',
                lineHeight: 1.5,
                color: '#0F172A',
                backgroundColor: '#FAF5FF',
                resize: 'none',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>
        )}

        {isSent && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: '#ECFDF5',
              border: '1.5px solid #059669',
              color: '#065F46',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <CheckCircle size={20} color="#059669" />
            <span>Nilai & Evaluasi Berhasil Dikirim! Mengalihkan ke halaman awal...</span>
          </div>
        )}
      </div>

      {/* 3. Bottom Action: Kirim & Selesai */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '850px',
          margin: '0 auto',
          paddingTop: '1rem',
          borderTop: '1px solid #E2E8F0',
        }}
      >
        <button
          type="button"
          onClick={onBackToScoring}
          disabled={isSent}
          style={{
            padding: '0.75rem 1.4rem',
            borderRadius: '10px',
            border: '1.5px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            color: '#64748B',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ← Nilai Aba-Aba
        </button>

        {countdown !== null ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#C94B3C' }}>
              Mengirim dalam {countdown}s...
            </span>
            <button
              type="button"
              onClick={handleSendImmediately}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#C94B3C',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.85rem',
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
            disabled={isSent}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.85rem 2.2rem',
              borderRadius: '12px',
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: isSent ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
            }}
          >
            <Send size={18} />
            <span>Kirim & Selesai ✓</span>
          </button>
        )}
      </div>
    </div>
  );
}
