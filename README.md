# PrivateChatApp

**PrivateChatApp** is a high-security, end-to-end encrypted chat application built to prioritize user privacy and security. Inspired by the likes of Telegram but with enhanced security features, it aims to provide an ultra-private, user-friendly messaging platform with robust protection against data leaks and unauthorized access.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)

---

## Features

### High-Priority
- **User Authentication with Multi-Factor Authentication (MFA)**: Strong password hashing and optional passwordless login with MFA for enhanced security.
- **End-to-End Encrypted Messaging**: Client-side encryption to ensure only sender and recipient can read messages.
- **Contact Management**: Add, remove, and verify contacts with identity checks for trusted conversations.
- **Secure Infrastructure**: All communication is encrypted via TLS 1.3, ensuring data remains private in transit.
- **Ephemeral Messaging**: Message expiration options with self-destruct timers and burn-on-read.

### Medium-Priority
- **Group Messaging**: Secure group chats with dynamic key management.
- **Encrypted File Sharing**: Share files securely with end-to-end encryption.
- **Offline Mode with Local Encryption**: Access recent chats securely, even when offline.
- **Push Notifications**: Privacy-focused encrypted notifications that show minimal information.
  
### Low-Priority
- **User Presence and Status**: Online indicators, typing notifications, and custom status messages.
- **Customizable Security Settings**: Users can adjust encryption levels and message expiration settings.
- **Message Search and Organization**: Encrypted message search and organization with folders and starred messages.
- **Profile Customization**: Set profile pictures and themes while keeping metadata private.

---

## Tech Stack

- **Frontend**: React with TypeScript, Web Crypto API for client-side encryption
- **Backend**: Django with Django Channels (Python), PostgreSQL for secure database management
- **Security**: Libsodium, PyNaCl for encryption, HTTPS/TLS 1.3 for secure transport
- **Infrastructure**: tbd
- **Push Notifications**: tbd
