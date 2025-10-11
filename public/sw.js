// Service Worker for CIVIKA PWA
const CACHE_NAME = "civika-v1.0.0";
const RUNTIME_CACHE = "civika-runtime-v1.0.0";

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
    "/",
    "/index.html",
    "/manifest.json",
    "/favicon.png",
    "/barangay-background.png",
    "/assets/city-background.png",
    "/barangaymap-collisions.json",
    // Add your critical game assets here
];

// Install event - cache critical assets
self.addEventListener("install", (event) => {
    console.log("🎮 CIVIKA Service Worker installing...");

    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                console.log("📦 Caching app shell and critical assets");
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => {
                console.log("✅ Service Worker installed successfully");
                return self.skipWaiting(); // Activate immediately
            })
            .catch((error) => {
                console.error("❌ Service Worker installation failed:", error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
    console.log("🎮 CIVIKA Service Worker activating...");

    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            // Delete old caches
                            return (
                                cacheName.startsWith("civika-") &&
                                cacheName !== CACHE_NAME &&
                                cacheName !== RUNTIME_CACHE
                            );
                        })
                        .map((cacheName) => {
                            console.log("🗑️ Deleting old cache:", cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log("✅ Service Worker activated");
                return self.clients.claim(); // Take control immediately
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
    // Skip non-GET requests
    if (event.request.method !== "GET") return;

    // Skip chrome extensions and other protocols
    if (!event.request.url.startsWith("http")) return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Return cached version
                console.log("📦 Serving from cache:", event.request.url);
                return cachedResponse;
            }

            // Not in cache, fetch from network
            return fetch(event.request)
                .then((response) => {
                    // Don't cache non-successful responses
                    if (
                        !response ||
                        response.status !== 200 ||
                        response.type === "error"
                    ) {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    // Cache the new resource
                    caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    console.log("🌐 Fetched from network:", event.request.url);
                    return response;
                })
                .catch((error) => {
                    console.error("❌ Fetch failed:", error);

                    // Return a custom offline page if available
                    return caches
                        .match("/offline.html")
                        .then((offlineResponse) => {
                            return (
                                offlineResponse ||
                                new Response(
                                    "Offline - Please check your connection"
                                )
                            );
                        });
                });
        })
    );
});

// Listen for skip waiting message
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        console.log("⏭️ Skipping waiting...");
        self.skipWaiting();
    }
});

// Periodic sync for background updates (if supported)
self.addEventListener("sync", (event) => {
    console.log("🔄 Background sync triggered:", event.tag);

    if (event.tag === "sync-game-data") {
        event.waitUntil(
            // Sync game data with server if needed
            Promise.resolve()
        );
    }
});
