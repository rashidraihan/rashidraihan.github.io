const CACHE_NAME = 'raihan-portfolio-mobile-v2';
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
  '/wraihan.png',
  '/tabphoto.ico',
  '/doc/rashid+raihan+resume.pdf'
];

// Install event - optimized for mobile
self.addEventListener('install', (event) => {
  console.log('Service Worker installing for mobile.');
  
  // Force activation immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Mobile cache opened');
        
        // Use Promise.allSettled to handle failures gracefully
        return Promise.allSettled(
          urlsToCache.map((url) => {
            return fetch(url, { cache: 'no-cache' })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Failed to fetch ${url}: ${response.status}`);
                }
                return cache.put(url, response);
              })
              .catch((error) => {
                console.warn(`Could not cache ${url}:`, error);
                return Promise.resolve(); // Don't fail the entire install
              });
          })
        );
      })
  );
});

// Activate event - aggressive cleanup for mobile
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating for mobile.');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete any old caches (mobile devices have limited storage)
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old mobile cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    // Take immediate control (critical for mobile)
    .then(() => self.clients.claim())
  );
});

// Fetch event - mobile optimized
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and cross-origin requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Special handling for PDF files (including your resume)
  if (event.request.url.includes('.pdf')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached PDF if available
          if (response) {
            return response;
          }
          
          // Otherwise, try to fetch from network
          return fetch(event.request)
            .then((fetchResponse) => {
              // Cache the PDF for future offline use
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
        
        // For mobile, try to cache as we go
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response for caching
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
            console.log('Fetch failed on mobile:', error);
            
            // Special handling for HTML pages on mobile
            if (event.request.destination === 'document' || 
                event.request.headers.get('accept').includes('text/html')) {
              return caches.match(OFFLINE_URL);
            }
            
            // For other resources, return a generic error
            return Response.error();
          });
      })
  );
});

// Message event handler for mobile
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});