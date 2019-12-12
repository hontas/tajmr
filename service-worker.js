/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/tajmr/app.165607de80a6a75850f2.css","a4519d9345eaddb55422c151a0499b4a"],["/tajmr/app.165607de80a6a75850f2.js","59b8f7965465d67f815d670d40b97c14"],["/tajmr/app.165607de80a6a75850f2.js.LICENSE","447e1cdc901897d7f404dfe93a9ff402"],["/tajmr/icons/android-chrome-144x144.png","9b4fd137eb84a4fc0c8120533143931e"],["/tajmr/icons/android-chrome-192x192.png","84e040ddb8c76aa56ef8a74e7dc90dcd"],["/tajmr/icons/android-chrome-256x256.png","5a8ebedb3560d8ee8657522667153336"],["/tajmr/icons/android-chrome-36x36.png","95131163509a09603ef3d90a684eb003"],["/tajmr/icons/android-chrome-384x384.png","f0bc893602e617c97656434f27524e6c"],["/tajmr/icons/android-chrome-48x48.png","e198d0d3b74a2c79c570b082eb716841"],["/tajmr/icons/android-chrome-512x512.png","26516f4524f05b9ec79ac86e5708b58b"],["/tajmr/icons/android-chrome-72x72.png","a17f934f28c3515f1f09bb827b6682ab"],["/tajmr/icons/android-chrome-96x96.png","c003312c3354d49d7b7688ef9d0c3476"],["/tajmr/icons/apple-touch-icon-1024x1024.png","572ada4bc5c3f28431f17ce15ffc4c8a"],["/tajmr/icons/apple-touch-icon-114x114.png","2b482c7df00e3d6b3ec210ef1bed0220"],["/tajmr/icons/apple-touch-icon-120x120.png","ef1dc3e37d51eae1bc934a5b8b170ea2"],["/tajmr/icons/apple-touch-icon-144x144.png","ecaebf7fccd78aa2ee9f45373610f993"],["/tajmr/icons/apple-touch-icon-152x152.png","a2f65e5fb40de74f7a1a67c9705e8512"],["/tajmr/icons/apple-touch-icon-167x167.png","ad240ebeefdd89b776d7bea77901a586"],["/tajmr/icons/apple-touch-icon-180x180.png","e5ba46eb7506e1b09cb9dbe87d08c53b"],["/tajmr/icons/apple-touch-icon-57x57.png","388d858308e6cfdba0cffeb010052245"],["/tajmr/icons/apple-touch-icon-60x60.png","3f066256beaff2beb04c3b829fd27b9e"],["/tajmr/icons/apple-touch-icon-72x72.png","d936fc968f35909515529cbf73cb61fc"],["/tajmr/icons/apple-touch-icon-76x76.png","2071d02c6d6eec9854b5e2923988bca6"],["/tajmr/icons/apple-touch-icon-precomposed.png","e5ba46eb7506e1b09cb9dbe87d08c53b"],["/tajmr/icons/apple-touch-icon.png","e5ba46eb7506e1b09cb9dbe87d08c53b"],["/tajmr/icons/apple-touch-startup-image-1182x2208.png","483cab0f50c4baf975415a26b8b730ec"],["/tajmr/icons/apple-touch-startup-image-1242x2148.png","1a1e3b14a25441decbdbf2d5037c7053"],["/tajmr/icons/apple-touch-startup-image-1496x2048.png","29acc82d9692a4f2ff3027fb1d441322"],["/tajmr/icons/apple-touch-startup-image-1536x2008.png","ad5378c97d53f401442a08b43e773b0b"],["/tajmr/icons/apple-touch-startup-image-320x460.png","7f2606f1bc8328d56991995e8f9c05c9"],["/tajmr/icons/apple-touch-startup-image-640x1096.png","79559b05b17557b71fb59469c61e685b"],["/tajmr/icons/apple-touch-startup-image-640x920.png","b23e8d5a58754370a9f756c82725da46"],["/tajmr/icons/apple-touch-startup-image-748x1024.png","c8ab6c53049462aff189198764a1ee59"],["/tajmr/icons/apple-touch-startup-image-750x1294.png","f62dc2e83ec9453c459f80c20fd1e1dc"],["/tajmr/icons/apple-touch-startup-image-768x1004.png","4d8d63e0217cdd3099c1ffefb4b17894"],["/tajmr/icons/browserconfig.xml","f3274f1132990b2874dc463530eb50df"],["/tajmr/icons/coast-228x228.png","371038ed8e27ad80abfec473314b3279"],["/tajmr/icons/favicon-16x16.png","aaa993c0174cef29dc7d806d1efde147"],["/tajmr/icons/favicon-32x32.png","7896a59d6989e3e79006a0da68184830"],["/tajmr/icons/favicon.ico","6238ba40bfa756d0da992d248fe10248"],["/tajmr/icons/firefox_app_128x128.png","b2a640d4efd5f5debf07d50d41db11ee"],["/tajmr/icons/firefox_app_512x512.png","a4042f209f43f3388b23b6ff483f2216"],["/tajmr/icons/firefox_app_60x60.png","1d2c73aea94e0e712a503542f267900b"],["/tajmr/icons/ios/icon_192x192.4c24ac87220b2d66249889b8c40c1fe6.png","4c24ac87220b2d66249889b8c40c1fe6"],["/tajmr/icons/ios/icon_512x512.77f615991f23e7524e722951c6fae5ab.png","77f615991f23e7524e722951c6fae5ab"],["/tajmr/icons/manifest.json","932cda151ba0700ae682992b7b54edec"],["/tajmr/icons/manifest.webapp","f96d3a9cbd749a11bb5b444b76aae9b9"],["/tajmr/icons/mstile-144x144.png","9b4fd137eb84a4fc0c8120533143931e"],["/tajmr/icons/mstile-150x150.png","5a7d3dc58677b5a32de4ec6811f4818b"],["/tajmr/icons/mstile-310x150.png","7a659d00a8bf33e8aab8b0e767d9434d"],["/tajmr/icons/mstile-310x310.png","f07b2cafcbc26f961fd3585cab451275"],["/tajmr/icons/mstile-70x70.png","e9537b42999db25e6cff22556f4c992a"],["/tajmr/icons/yandex-browser-50x50.png","70b35d35daa39665605a674b29624421"],["/tajmr/icons/yandex-browser-manifest.json","146c9da56c318850ffd29f86cc5b95c1"],["/tajmr/index.html","38da83377a0fe05367456b86a28679c5"],["/tajmr/manifest.f44f6478f0daf9286b68e60fd834e9a1.json","f44f6478f0daf9286b68e60fd834e9a1"]];
var cacheName = 'sw-precache-v3-tajmr-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







