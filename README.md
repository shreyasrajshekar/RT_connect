📱 RT_Connect

A real-time messaging application built with React Native (Expo) and Firebase.
This project is part of the GDG Tech second round submission and demonstrates:

Real-time chat using Firestore

Push notifications using Firebase Cloud Messaging (FCM)

Offline handling (popup when disconnected, auto-dismiss on reconnect)

Modular, clean code structure

🚀 Features

✅ User enters their name before joining the chat
✅ Real-time messaging with Firestore
✅ Push notifications for new messages (via FCM)
✅ Works offline with a connection loss popup
✅ Simple & clean UI with separate screens

📂 Project Structure
Lets_Connect/
├── App.js              # Entry point (navigates between screens)
├── firebaseConfig.js   # Firebase setup
├── screens/
│   ├── AddName.js      # Enter username before chat
│   ├── ChatScreen.js   # Real-time chat UI
│   └── Notification.js # Push notifications setup
└── README.md

⚡ Tech Stack

React Native (Expo) – for building the mobile UI

Firebase Firestore – for real-time chat messages

Firebase Cloud Messaging (FCM) – for push notifications

NetInfo – for offline/online status detection
