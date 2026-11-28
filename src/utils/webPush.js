/**
 * Helper Web Push (Service Worker + PushManager) untuk Role Peserta KOMPAS.
 */

export function isWebPushSupported() {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export function isSecureContextForPush() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.isSecureContext);
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function getServiceWorkerRegistration() {
  if (!isWebPushSupported()) return null;
  const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  await navigator.serviceWorker.ready;
  return registration;
}

/**
 * Meminta izin notifikasi (jika belum), mendaftarkan Service Worker,
 * membuat PushSubscription dengan VAPID key dari backend, dan menyimpannya ke DB.
 */
export async function subscribeDeviceToWebPush({ requestPermission = true } = {}) {
  if (!isWebPushSupported()) {
    return {
      ok: false,
      reason: 'UNSUPPORTED',
      message: 'Browser/perangkat ini belum mendukung Web Push.',
    };
  }

  if (!isSecureContextForPush()) {
    return {
      ok: false,
      reason: 'INSECURE_CONTEXT',
      message:
        'Notifikasi bilah atas HP butuh akses HTTPS (atau localhost). Mode pop-up & getar dalam web tetap aktif.',
    };
  }

  let permission = Notification.permission;
  if (permission === 'default' && requestPermission) {
    permission = await Notification.requestPermission();
  }

  if (permission !== 'granted') {
    return {
      ok: false,
      reason: permission === 'denied' ? 'DENIED' : 'DISMISSED',
      permission,
      message:
        permission === 'denied'
          ? 'Izin notifikasi diblokir di pengaturan browser. Aktifkan izin notifikasi untuk situs ini di pengaturan Chrome/Safari.'
          : 'Izin notifikasi belum disetujui.',
    };
  }

  const keyRes = await fetch('/api/peserta/push/public-key', { credentials: 'include' });
  const keyJson = await keyRes.json();
  if (!keyRes.ok || !keyJson.success || !keyJson.configured || !keyJson.publicKey) {
    return {
      ok: false,
      reason: 'VAPID_NOT_CONFIGURED',
      permission,
      message: 'Kunci Web Push di server belum dikonfigurasi.',
    };
  }

  const registration = await getServiceWorkerRegistration();
  if (!registration) {
    return {
      ok: false,
      reason: 'SW_FAILED',
      permission,
      message: 'Service Worker gagal terdaftar.',
    };
  }

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(keyJson.publicKey),
    });
  }

  const subRes = await fetch('/api/peserta/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ subscription: subscription.toJSON() }),
  });
  const subJson = await subRes.json();
  if (!subRes.ok || !subJson.success) {
    return {
      ok: false,
      reason: 'SAVE_FAILED',
      permission,
      message: subJson.message || 'Gagal menyimpan perangkat ke server push.',
    };
  }

  return {
    ok: true,
    permission,
    subscriptionCount: subJson.subscriptionCount || 1,
    message: 'Notifikasi Web Push HP aktif. Notifikasi akan tetap masuk walau keluar web / layar mati.',
  };
}

