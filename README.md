# Classmate Hub – Secure Messaging System

### CS Lab 1 (Part B) | Group 18

---
#Video Link
  https://drive.google.com/drive/folders/1cS-Bh-6KfKuWmkqAovXTKOSgyH7I2Z_8

---

## Demo

**Project Demonstration:**
*Add your Google Drive video link here.*

---

# Project Description

Classmate Hub is a web application developed using **Node.js**, **Express.js**, and **SQLite** that enables students to maintain a personal profile with a secure message.

For **Part B**, the application has been upgraded with **end-to-end client-side encryption** using the browser's Web Crypto API. Messages are encrypted before leaving the user's browser, ensuring that sensitive information is never transmitted or stored in plaintext.

---

# Key Features

* Secure login system
* Personal message management
* AES-GCM encryption performed entirely in the browser
* Password-derived encryption key using SHA-256
* Random Initialization Vector (IV) generated for every encryption
* Zero plaintext storage inside the database
* Client-side decryption without contacting the server

---

# Project Structure

```text
.
├── public/
│   └── crypto.js
├── routes/
│   ├── account.js
│   ├── message.js
│   ├── login.js
│   └── password.js
├── db.js
├── server.js
└── classmates.db
```

---

# Installation

### Clone Repository

```bash
git clone https://github.com/CS-July-Dec-2026/assignment-1-group-18.git
```

### Enter Project Directory

```bash
cd assignment-1-group-18
```

### Install Dependencies

```bash
npm install
```

### Start Application

```bash
npm start
```

Open your browser and visit:

```
http://localhost:3000
```

---

# Implementation Summary

The application follows a **client-first encryption model**.

### Message Encryption

* User enters message and password.
* Password is hashed using SHA-256.
* Hash becomes the AES-256 encryption key.
* Browser generates a random IV.
* Plaintext is encrypted using AES-GCM.
* Only encrypted data and IV are sent to the server.

### Message Decryption

* Encrypted message is loaded from the database.
* User provides password.
* Browser derives the encryption key again.
* Decryption occurs locally using the stored IV.
* Correct password reveals the original message instantly.

---

# Files Updated

| File              | Purpose                                     |
| ----------------- | ------------------------------------------- |
| db.js             | Database schema updated to store IV.        |
| routes/message.js | Encrypts messages before submission.        |
| routes/account.js | Implements browser-side message decryption. |

---

# New Component Added

| File             | Responsibility                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| public/crypto.js | Handles password hashing, AES key generation, encryption, decryption, Base64 encoding and decoding. |

---

# Files Preserved

The following files remained unchanged as required:

* server.js
* views.js
* routes/login.js
* routes/password.js

---

# Security Workflow

```
Message
   │
   ▼
Password
   │
   ▼
SHA-256
   │
   ▼
AES-256 Key
   │
   ▼
AES-GCM Encryption
   │
   ▼
Ciphertext + IV
   │
   ▼
SQLite Database
```

To read the message:

```
Ciphertext
      │
      ▼
Password
      │
      ▼
AES Key
      │
      ▼
Client-side Decryption
      │
      ▼
Original Message
```

---

# Verification Performed

✔ Browser never sends plaintext.

✔ Password never reaches the server.

✔ Database stores encrypted content only.

✔ Unlock operation performs no HTTP requests.

✔ Wrong passwords fail authentication automatically through AES-GCM.

---

# Technologies Used

* Node.js
* Express.js
* SQLite
* JavaScript
* HTML5
* CSS3
* Web Crypto API
* AES-GCM
* SHA-256

---

# Conclusion

This project demonstrates a secure browser-based encryption workflow where sensitive information remains confidential throughout its lifecycle. By combining password-derived encryption keys with authenticated AES-GCM encryption, the application ensures that only authorized users can access stored messages while the server remains unaware of the original plaintext.
## Team Members

| Name              | Roll No.   |
| ----------------- | ---------- |
| Amelia Rubey      | IIT2024206 |
| Princi Kannaujiya | IIT2024186 |
| Banshika Aggarwal | IIT2024184 |
| Surbhi Kumari     | IIT2024141 |
| Fatima Hussain    | IIT2024188 |

--
