importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");
importScripts('https://www.gstatic.com/firebasejs/6.2.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.2.3/firebase-messaging.js');

workbox.clientsClaim();
workbox.skipWaiting();

workbox.precaching.precacheAndRoute([
  // 要快取的檔案
]);

// firebase config
var firebaseConfig = {
            apiKey: "AIzaSyAC9W3ylTajaeYqBST42yWUjxHZHzhXd9s",
            authDomain: "learn-firebase-86b18.firebaseapp.com",
            databaseURL: "https://learn-firebase-86b18.firebaseio.com",
            projectId: "learn-firebase-86b18",
            storageBucket: "learn-firebase-86b18.appspot.com",
            messagingSenderId: "623688412760",
            appId: "1:623688412760:web:3a206c5b4d4fa904"
        };
        firebase.initializeApp(firebaseConfig);
    
        var messaging = firebase.messaging();
        messaging.usePublicVapidKey("BJsg3eRGRgrH4gKpi5qtA-4cnOOXdeOc_Kmkzkw5zPqx_-Ei-Mcn2SvgEPXbEh0d_Zo6cEfYkrOpEsVhUTfaXuc");