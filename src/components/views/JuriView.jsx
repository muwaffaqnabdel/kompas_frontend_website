import React, { useState, useEffect } from 'react';
import { Award, Mic, MicOff, Send, RotateCcw, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';

export default function JuriView() {
  const [scores, setScores] = useState({
    c1: 85,
    c2: 90,
    c3: 80,
    c4: 95,
  });

  // State untuk Voice Note & AI Pipeline
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [aiDraft, setAiDraft] = useState('');
  const [countdown, setCountdown] = useState(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  // Kriteria nilai dinamis per PRD
  const criteria = [
    { id: 'c1', name: '1. Langkah Tegap & Hormat Kanan', options: [70, 75, 80, 85, 90, 95, 100] },
    { id: 'c2', name: '2. Kerapihan Saf, Banjar & Pasukan', options: [70, 75, 80, 85, 90, 95, 100] },
    { id: 'c3', name: '3. Variasi Formasi & Kekompakan', options: [70, 75, 80, 85, 90, 95, 100] },
    { id: 'c4', name: '4. Artikulasi & Intonasi Danton', options: [70, 75, 80, 85, 90, 95, 100] },
  ];

  const handleSelectScore = (critId, val) => {
    setScores((prev) => ({ ...prev, [critId]: val }));
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
    } else {
      setIsRecording(false);
      // Simulasi Groq AI Whisper STT + Llama 3 Refinement
      setAiDraft(
        'Catatan Dewan Juri (AI Refined): Kerapihan saf dan banjar pasukan terlihat solid dan terkoordinasi dengan baik. Catatan evaluasi utama: tempo langkah tegap saat hormat kanan perlu diperhatikan agar selaras dengan aba-aba komandan peleton.'
      );
    }
  };

  const handleStartSendFeedback = () => {
    setCountdown(5);
  };

  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setFeedbackSent(true);
      setCountdown(null);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px', margin: '0 auto' }}>
      {/* Active Performing Team Hero */}
      <div
        style={{
          backgroundColor: 'var(--midnight-navy)',
          color: '#FFFFFF',
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-validated">SEDANG TAMPIL DI LAPANGAN</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--muted-slate)' }}>Nomor Urut 01</span>
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.2rem 0', color: '#FFFFFF' }}>
            PASKIBRA GARUDA SAKTI — SMAN 1 Jakarta
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>
            Juri Penilai: <strong>Mayor TNI (Purn) Hendra Wijaya</strong>
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-slate)', textTransform: 'uppercase' }}>Total Nilai Sementara</div>
          <div className="tabular-nums" style={{ fontSize: '2rem', fontWeight: 800, color: '#38BDF8' }}>
            {totalScore}
          </div>
        </div>
      </div>

      {/* Discrete Score Selection Grid (Mobile-First Touch Target) */}
      <div className="card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--deep-slate)', marginBottom: '0.25rem' }}>
          Lembar Input Nilai Aba-Aba Dinamis
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--muted-slate)', marginBottom: '1.25rem' }}>
          Sentuh angka nilai yang sesuai. Konfigurasi kriteria telah dikunci oleh panitia.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {criteria.map((c) => (
            <div key={c.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--deep-slate)' }}>{c.name}</span>
                <span className="tabular-nums" style={{ fontWeight: 700, color: 'var(--crimson)' }}>
                  Nilai: {scores[c.id]}
                </span>
              </div>

              {/* Large Touch Target Score Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {c.options.map((val) => {
                  const isSelected = scores[c.id] === val;
                  return (
                    <button
                      key={val}
                      onClick={() => handleSelectScore(c.id, val)}
                      style={{
                        padding: '0.5rem 0.85rem',
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--crimson)' : '1px solid var(--border)',
                        backgroundColor: isSelected ? 'var(--crimson)' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : 'var(--deep-slate)',
                        cursor: 'pointer',
                        transition: 'all 0.1s ease',
                        minWidth: '48px',
                      }}
                      className="tabular-nums"
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Scoring Button */}
        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={() => setScoreSubmitted(true)}
            disabled={scoreSubmitted}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.5rem', fontSize: '0.9375rem' }}
          >
            <CheckCircle size={17} />
            <span>{scoreSubmitted ? 'Nilai Berhasil Disimpan ✓' : 'Submit & Kunci Nilai Pasukan'}</span>
          </button>
        </div>
      </div>

      {/* Voice Note & Groq AI Feedback Section */}
      <div className="card" style={{ borderTop: '4px solid #8B5CF6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#7C3AED', fontWeight: 700, fontSize: '0.8125rem' }}>
              <Sparkles size={16} />
              <span>AI VOICE NOTE FEEDBACK (GROQ WHISPER + LLAMA 3)</span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--deep-slate)', margin: '0.2rem 0' }}>
              Rekam Suara Evaluasi Juri di Lapangan
            </h3>
          </div>
          <span className="badge badge-info">AI PIPELINE READY</span>
        </div>

        <p style={{ fontSize: '0.8125rem', color: 'var(--muted-slate)', marginBottom: '1rem' }}>
          Tekan tombol mic untuk merekam suara evaluasi. AI Groq akan mentranskrip bising lapangan (Whisper) dan menyusunnya menjadi bahasa baku Paskibra yang profesional (Llama 3).
        </p>

        {/* Record Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={toggleRecording}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '9999px',
              backgroundColor: isRecording ? 'var(--ruby)' : '#7C3AED',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              animation: isRecording ? 'pulse 1.5s infinite' : 'none',
            }}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            <span>{isRecording ? 'Hentikan & Proses AI...' : 'Mulai Rekam Suara Komentar'}</span>
          </button>

          {isRecording && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--ruby)', fontWeight: 600, fontSize: '0.875rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--ruby)' }} />
              <span>Merekam Audio Juri...</span>
            </div>
          )}
        </div>

        {/* AI Draft Result & 5s Countdown */}
        {aiDraft && !feedbackSent && (
          <div
            style={{
              backgroundColor: '#F5F3FF',
              border: '1px solid #DDD6FE',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginTop: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6D28D9' }}>DRAFT AI SIAP DITINJAU JURI:</span>
              <span className="badge badge-pending">STATUS: DRAFT AI</span>
            </div>

            <textarea
              value={aiDraft}
              onChange={(e) => setAiDraft(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #C4B5FD',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem',
                lineHeight: 1.5,
              }}
            />

            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {countdown !== null ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    className="tabular-nums"
                    style={{
                      backgroundColor: 'var(--crimson)',
                      color: '#FFFFFF',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                    }}
                  >
                    {countdown}
                  </div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--deep-slate)' }}>
                    Mengirim ke peserta dalam {countdown} detik...
                  </span>
                  <button
                    onClick={() => setCountdown(null)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  >
                    Batalkan
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                  <button
                    onClick={handleStartSendFeedback}
                    className="btn btn-primary"
                    style={{ backgroundColor: '#7C3AED', padding: '0.45rem 1rem' }}
                  >
                    <Send size={15} />
                    <span>Setujui & Kirim Feedback (5s Countdown)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {feedbackSent && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--emerald-light)',
              color: 'var(--emerald-text)',
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
            }}
          >
            <CheckCircle size={18} />
            <span>Feedback resmi berhasil dipancarkan ke Dashboard Peserta via Supabase Realtime!</span>
          </div>
        )}
      </div>
    </div>
  );
}
