import React, { useState } from 'react';
import PanitiaDPHeader from './panitia-dp/PanitiaDPHeader';
import PanitiaDPWorkstation from './panitia-dp/PanitiaDPWorkstation';
import PanitiaDPQueue from './panitia-dp/PanitiaDPQueue';

export default function PanitiaDPView() {
  const [dpStatus, setDpStatus] = useState('IN_PROGRESS'); // WAITING, IN_PROGRESS, COMPLETED, BLOCKED
  const [targetDpCapacity, setTargetDpCapacity] = useState('AVAILABLE'); // AVAILABLE or FULL
  const [notification, setNotification] = useState(null);

  const handleFinishDP = () => {
    if (targetDpCapacity === 'FULL') {
      setDpStatus('BLOCKED');
      setNotification({
        type: 'danger',
        msg: 'PERINGATAN ATOMIC LOCK: DP 2 (Photoshoot) sedang terisi 1 tim! Tim PASKIBRA GARUDA SAKTI tertahan di ruang tunggu DP 1 sampai slot DP 2 bebas.',
      });
    } else {
      setDpStatus('COMPLETED');
      setNotification({
        type: 'success',
        msg: 'SUKSES: DP 2 tersedia! Tim PASKIBRA GARUDA SAKTI otomatis dipindahkan ke DP 2 (Photoshoot Resmi). Slot DP 1 kini siap menerima tim berikutnya.',
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      {/* 1. Header Workstation Pos DP */}
      <PanitiaDPHeader
        targetDpCapacity={targetDpCapacity}
        onToggleTargetCapacity={() => setTargetDpCapacity(targetDpCapacity === 'AVAILABLE' ? 'FULL' : 'AVAILABLE')}
      />

      {/* 2. Kartu Workstation Tim Aktif & Atomic Lock */}
      <PanitiaDPWorkstation
        notification={notification}
        dpStatus={dpStatus}
        onFinishDP={handleFinishDP}
      />

      {/* 3. Antrean Tim Berikutnya */}
      <PanitiaDPQueue />
    </div>
  );
}
