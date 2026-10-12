import React, { useState, useEffect } from 'react';
import JuriPerformingHero from './juri/JuriPerformingHero';
import JuriScoreSheet from './juri/JuriScoreSheet';
import JuriVoiceFeedback from './juri/JuriVoiceFeedback';
import { getStoredJudges } from './admin-panitia/AdminPanitiaJudgesConfig';
import { Shield, UserCheck } from 'lucide-react';

export default function JuriView() {
  const judges = getStoredJudges();
  const [activeJudgeId, setActiveJudgeId] = useState(() => judges[0]?.id || 'juri-1');

  const activeJudge = judges.find((j) => j.id === activeJudgeId) || judges[0] || {
    id: 'juri-1',
    name: 'Kolonel (Purn) Bambang S., M.Pd',
    category: 'PBB Murni',
    role: 'Ketua Dewan Juri',
  };

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

  // Kriteria nilai dinamis per PRD & konfigurasi Admin Panitia
  const allCriteria = (() => {
    try {
      const saved = localStorage.getItem('kompas_scoring_criteria');
      return saved ? JSON.parse(saved) : [
        { id: 'c1', name: '1. Langkah Tegap & Hormat Kanan', options: [70, 75, 80, 85, 90, 95, 100], assignedJudges: ['juri-1', 'juri-2', 'juri-3'] },
        { id: 'c2', name: '2. Kerapihan Saf, Banjar & Pasukan', options: [70, 75, 80, 85, 90, 95, 100], assignedJudges: ['juri-1', 'juri-2', 'juri-3'] },
        { id: 'c3', name: '3. Variasi Formasi & Kekompakan', options: [70, 75, 80, 85, 90, 95, 100], assignedJudges: ['juri-4', 'juri-5'] },
        { id: 'c4', name: '4. Artikulasi & Intonasi Danton', options: [70, 75, 80, 85, 90, 95, 100], assignedJudges: ['juri-1'] },
      ];
    } catch {
      return [
        { id: 'c1', name: '1. Langkah Tegap & Hormat Kanan', options: [70, 75, 80, 85, 90, 95, 100], assignedJudges: ['juri-1', 'juri-2', 'juri-3'] },
        { id: 'c2', name: '2. Kerapihan Saf, Banjar & Pasukan', options: [70, 75, 80, 85, 90, 95, 100], assignedJudges: ['juri-1', 'juri-2', 'juri-3'] },
        { id: 'c3', name: '3. Variasi Formasi & Kekompakan', options: [70, 75, 80, 85, 90, 95, 100], assignedJudges: ['juri-4', 'juri-5'] },
        { id: 'c4', name: '4. Artikulasi & Intonasi Danton', options: [70, 75, 80, 85, 90, 95, 100], assignedJudges: ['juri-1'] },
      ];
    }
  })();

  // Filter kriteria hanya yang dicentang untuk juri yang sedang aktif
  const criteria = allCriteria.filter(
    (c) => !c.assignedJudges || c.assignedJudges.length === 0 || c.assignedJudges.includes(activeJudgeId)
  );

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
      {/* 0. Tablet Active Judge Switcher (Simulator Demo Bar) */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: '12px',
          padding: '0.85rem 1.25rem',
          border: '1px solid var(--pub-line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserCheck size={16} style={{ color: 'var(--pub-coral)' }} />
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--pub-muted)' }}>
            Login Tablet Lapangan:
          </span>
          <select
            value={activeJudgeId}
            onChange={(e) => setActiveJudgeId(e.target.value)}
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.825rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: '1px solid var(--pub-line)',
              backgroundColor: 'var(--pub-canvas)',
              color: 'var(--pub-ink)',
              cursor: 'pointer',
            }}
          >
            {judges.map((j, idx) => (
              <option key={j.id} value={j.id}>
                Juri {idx + 1}: {j.name} ({j.category})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              backgroundColor: activeJudge.category === 'PBB Murni' ? '#E0F2FE' : '#FEF3C7',
              color: activeJudge.category === 'PBB Murni' ? '#0369A1' : '#B45309',
              padding: '0.2rem 0.55rem',
              borderRadius: '4px',
              fontSize: '0.725rem',
              fontWeight: 700,
            }}
          >
            {activeJudge.category}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>
            Menilai {criteria.length} Kriteria
          </span>
        </div>
      </div>

      {/* 1. Tim Sedang Tampil di Lapangan */}
      <JuriPerformingHero
        teamName="PASKIBRA GARUDA SAKTI — SMAN 1 Jakarta"
        teamOrder="01"
        judgeName={activeJudge.name}
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
