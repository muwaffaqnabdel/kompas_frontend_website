import React, { useState, useEffect } from 'react';
import JuriPerformingHero from './juri/JuriPerformingHero';
import JuriScoreSheet from './juri/JuriScoreSheet';
import JuriVoiceFeedback from './juri/JuriVoiceFeedback';

export default function JuriView() {
  const [scores, setScores] = useState({
    c1: 85,
    c2: 90,
    c3: 80,
    c4: 95,
  });

  const [isRecording, setIsRecording] = useState(false);
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
    } else {
      setIsRecording(false);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      {/* 1. Tim Sedang Tampil di Lapangan */}
      <JuriPerformingHero
        teamName="PASKIBRA GARUDA SAKTI — SMAN 1 Jakarta"
        teamOrder="01"
        judgeName="Mayor TNI (Purn) Hendra Wijaya"
        totalScore={totalScore}
      />

      {/* 2. Lembar Nilai Aba-Aba Diskrit */}
      <JuriScoreSheet
        criteria={criteria}
        scores={scores}
        onSelectScore={handleSelectScore}
        scoreSubmitted={scoreSubmitted}
        onSubmitScore={() => setScoreSubmitted(true)}
      />

      {/* 3. AI Voice Note Feedback */}
      <JuriVoiceFeedback
        isRecording={isRecording}
        toggleRecording={toggleRecording}
        aiDraft={aiDraft}
        setAiDraft={setAiDraft}
        countdown={countdown}
        setCountdown={setCountdown}
        feedbackSent={feedbackSent}
        handleStartSendFeedback={handleStartSendFeedback}
      />
    </div>
  );
}
