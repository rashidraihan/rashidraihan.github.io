const CACHE_NAME = 'raihan-portfolio-v4';
const OFFLINE_URL = '/offline.html';
const RESUME_URL = '/doc/rashid+raihan+resume.pdf';

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/offline.html',
  '/wraihan.png',
  '/tabphoto.ico',
  '/column.html',
  '/experiments.html',
  RESUME_URL
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        
        // Add each URL individually with error handling
        return Promise.all(
          urlsToCache.map((url) => {
            return cache.add(url).catch((error) => {
              console.log(`Failed to cache ${url}:`, error);
            });
          })
        );
      })
      .then(() => {
        console.log('All resources cached successfully');
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    // Take control of all clients immediately
    .then(() => self.clients.claim())
  );
});

// Fetch event - simplified for cross-browser compatibility
self.addEventListener('fetch', (event) => {
  // Only handle requests from the same origin
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) {
    return;
  }
  
  // For non-GET requests, use the network only
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Otherwise, get from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch((error) => {
            console.log('Fetch failed; returning offline page instead.', error);
            
            // If the request is for a page, return the offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match(OFFLINE_URL);
            }
            
            // For PDF requests, provide a helpful error
            if (event.request.url.includes('.pdf')) {
              return new Response(
                'PDF not available offline. Please connect to the internet to access this resource.',
                { 
                  status: 408,
                  statusText: 'Offline',
                  headers: new Headers({ 'Content-Type': 'text/plain' })
                }
              );
            }
          });
      })
  );
});