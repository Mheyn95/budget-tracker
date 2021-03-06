const APP_PREFIX = "BudgetTracker-";
const VERSION = "version_05";
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
  "./index.html",
  "./js/idb.js",
  "./js/index.js",
  "./css/styles.css",
  "./manifest.json",
];

// Cache resources
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache : " + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Delete outdated caches
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create keeplist
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      // add current cache name to keeplist
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log("deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

// pull from cache first and fall back on network if cache does not exist
// TODO: cache is registered and then created but will not load onto page when offline, seems like cache doesn't exist
self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (request) {
      return request || fetch(e.request);
    })
  );
});
