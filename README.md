# PrivateChatApp

**PrivateChatApp** is a security-first chat application built to prioritize user privacy and security. Inspired by the likes of Telegram, it aims to provide an ultra-private, user-friendly messaging platform with robust protection against data leaks and unauthorized access.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Instruction](#instruction)

---

## Features

- **User Authentication**: Strong password hashing for enhanced security.
- **Contact Management**: Add, remove, and verify contacts with identity checks for trusted conversations.
- **1v1 Chat System**: Exchange private messages with anyone, in the dedicated chat functionality 
- **Secure Infrastructure**: All communication is encrypted via TLS 1.3, ensuring data remains private in transit.

---

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Django with Django Channels (Python), PostgreSQL for database management
- **Security**: HTTPS/TLS 1.3 for secure transport, password hashing and 

## Instruction
- backend requires active Postgres server with database 'private_chat_app' available at port 5432. User should be defined and specified in .env file. After installing requirements daphne server should be ran on localhost port 8000.
- frontend should be started with npm start from frontend folder.
