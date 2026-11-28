/* KOMPAS Web Push Service Worker — ringan & aktif hanya saat ada push masuk */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let payload = {
    title: 'Panggilan Masuk Pos DP 1',
    body: 'Segera menuju Pos DP 1 (Pengecekan Dokumen) bersama danton dan berkas fisik.',
    tag: 'kompas-dp1-call',
    url: '/dashboard',
    dpOrder: 1,
    forceShow: false,
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      payload = { ...payload, ...parsed };
    } catch {
      const text = event.data.text();
      if (text) payload.body = text;
    }
  }

  event.waitUntil(
    (async () => {
      const windowClients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });

      const hasVisibleFocusedClient = windowClients.some(
        (client) => client.visibilityState === 'visible' && client.focused
      );

      // Kirim sinyal instan ke tab yang terbuka agar pop-up dalam website langsung muncul tanpa menunggu polling
      for (const client of windowClients) {
        try {
          client.postMessage({
            type: 'KOMPAS_DP_PUSH',
            payload,
          });
        } catch {}
      }

      // Sesuai aturan: jika pengguna sedang di dalam website (fokus & terlihat) dan bukan simulasi paksa,
      // jangan tampilkan notifikasi bilah atas dobel — biarkan pop-up & getar di dalam website yang menangani.
      if (hasVisibleFocusedClient && !payload.forceShow) {
        return;
      }

      const options = {
        body: payload.body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: payload.tag || 'kompas-dp-push',
        renotify: true,
        requireInteraction: payload.dpOrder === 1 || Boolean(payload.requireInteraction),
        vibrate:
          payload.dpOrder === 1
            ? [280, 120, 280, 120, 320]
            : [160, 80, 160],
        data: {
          url: payload.url || '/dashboard',
          dpOrder: payload.dpOrder || null,
          participantId: payload.participantId || null,
        },
      };

      await self.registration.showNotification(payload.title, options);
    })()
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification?.data?.url || '/dashboard';

  event.waitUntil(
    (async () => {
      const windowClients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });

      for (const client of windowClients) {
        if ('focus' in client) {
          await client.focus();
          return;
        }
      }

      if (self.clients.openWindow) {
        await self.clients.openWindow(targetUrl);
      }
    })()
  );
});

