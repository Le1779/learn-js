importScripts('https://www.gstatic.com/firebasejs/6.2.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.2.3/firebase-messaging.js');

var firebaseConfig = {
    messagingSenderId: "623688412760"
};
firebase.initializeApp(firebaseConfig);
messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    var notificationTitle = 'Background Message Title';
    var notificationOptions = {
      body: 'Background Message body.',
      icon: 'firebase-logo.png'
    };
    
    return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
// [END background_handler]
