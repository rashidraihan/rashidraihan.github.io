const CACHE_NAME = 'raihan-portfolio-v3.0';
const OFFLINE_URL = '/offline.html';

// Files to cache - include ALL pages
const urlsToCache = [
  '/',
  '/index.html',
  '/column.html', 
  '/experiments.html',
  '/styles.css',
  '/script.js',
  '/offline.html',
  '/images/wraihan.png',
  '/tabphoto.ico',
  '/doc/rashid+raihan+resume.pdf'
];

// Install event - optimized for mobile
self.addEventListener('install', (event) => {
  console.log('Service Worker installing v3.0');
  
  // Force activation immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      // Delete all old caches first
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Now open new cache and add files
      return caches.open(CACHE_NAME);
    }).then((cache) => {
      console.log('New cache opened:', CACHE_NAME);
      return cache.addAll(urlsToCache);
    }).catch((error) => {
      console.log('Cache installation failed:', error);
    })
  );
});

// Activate event - aggressive cleanup
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating v3.0');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache during activation:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - mobile optimized
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and cross-origin requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Special handling for PDF files
  if (event.request.url.includes('.pdf')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          
          return fetch(event.request)
            .then((fetchResponse) => {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
              return fetchResponse;
            })
            .catch((error) => {
              console.log('PDF fetch failed:', error);
              return new Response(
                'Resume not available offline. Please connect to the internet to download it.',
                { 
                  status: 408,
                  statusText: 'Offline',
                  headers: new Headers({ 'Content-Type': 'text/plain' })
                }
              );
            });
        })
    );
    return;
  }
  
  // For all other requests
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.warn('Could not cache response:', error);
              });
            
            return response;
          })
          .catch((error) => {
            console.log('Fetch failed:', error);
            
            if (event.request.destination === 'document' || 
                event.request.headers.get('accept').includes('text/html')) {
              return caches.match(OFFLINE_URL);
            }
            
            return Response.error();
          });
      })
  );
});

// Message event handler
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});