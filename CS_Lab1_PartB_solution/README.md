# CS_Lab_1 — Part B: Client-Side Encrypted Messages

A simple class portal where students can log in, set a fun personal
message on their page, and update their password.

**Part B addition:** personal messages are encrypted client-side with
AES-GCM (Web Crypto API) before they ever leave the browser. Only
ciphertext + IV are stored on the server. Decryption happens entirely
in the browser with zero network requests.

## Features

- Log in with a username and password
- View your own page with a welcome message
- Set a short personal message that is **encrypted before submission**
- Unlock / decrypt the message on the account page using your password
  (client-side only)
- Change your password any time

## Tech Stack

- [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) for storage
- Plain HTML/CSS + browser Web Crypto API (`crypto.subtle`)
- **No** front-end frameworks, bundlers, or external crypto libraries

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Open your browser to [http://localhost:3000](http://localhost:3000)

Sample accounts (username / password):

| Username | Password        |
|----------|-----------------|
| arjun    | Football123     |
| meera    | SummerFun2024   |
| kabir    | ChessMaster9    |
| zara     | RainbowUnicorn  |

If you have an old `classmates.db`, the app will automatically add the
`message_iv` column on first run. To start completely fresh, delete
`classmates.db` and restart.

## How encryption works (Part B)

1. **Hash** the user's password with SHA-256 (`crypto.subtle.digest`).
   The 32-byte digest is used directly as the AES-256 key
   (no salt / PBKDF2 — per assignment).

2. **Encrypt** the message client-side with AES-GCM
   (`crypto.subtle.encrypt`). A fresh random 12-byte IV is generated
   each time (`crypto.getRandomValues`).

3. Only the **ciphertext + IV** (base64-encoded) are sent to the server
   and stored in the database (`message` and `message_iv` columns).

4. On the account page the ciphertext and IV are already present in the
   HTML. The user enters their password and clicks **Unlock**.
   Decryption runs entirely in the browser — **no network request**.

All crypto helpers live in a single file:

```
public/crypto.js
```

which is a thin wrapper around `crypto.subtle` (`digest`, `importKey`,
`encrypt`, `decrypt`).

## Project Structure

```
CS_Lab1/
├── server.js              # app entry point (untouched)
├── db.js                  # database setup (+ message_iv migration)
├── views.js               # shared page template (untouched)
├── routes/
│   ├── login.js           # login page (untouched)
│   ├── account.js         # account page — locked / unlock UI
│   ├── message.js         # set-message page — client-side encrypt
│   └── password.js        # change password (untouched)
└── public/
    ├── style.css
    └── crypto.js          # ← single new client-side crypto wrapper
```

## Files intentionally left untouched

- `routes/login.js`
- `routes/password.js`
- `server.js`
- `views.js`

## Configuration

By default the app runs on port `3000`. To use a different port:

```bash
PORT=8080 npm start
```
