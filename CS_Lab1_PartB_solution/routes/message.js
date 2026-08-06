const express = require("express");
const router = express.Router();
const db = require("../db");
const { page } = require("../views");

router.get("/set-message", (req, res) => {
  if (!req.cookies.username) {
    return res.redirect("/");
  }

  res.send(page("Set My Message", `
    <h1>✏️ Set My Message</h1>
    <p class="subtitle">This will show up on your page (encrypted).</p>
    <form id="message-form" method="POST" action="/set-message">
      <label>Your message</label>
      <input type="text" id="plaintext" name="plaintext" placeholder="Say something fun!" required autofocus>
      <label>Your password (to encrypt)</label>
      <input type="password" id="password" placeholder="Same password you use to log in" required>
      <!-- Hidden fields that will hold the encrypted payload -->
      <input type="hidden" name="ciphertext" id="ciphertext">
      <input type="hidden" name="iv" id="iv">
      <button type="submit" class="btn btn-yellow">Save Message 💾</button>
    </form>
    <p id="status" class="subtitle" style="display:none; color:#e0554f;"></p>
    <a href="/account" class="btn btn-pink" style="margin-top: 14px; display:inline-block;">Back</a>
    <script src="/public/crypto.js"></script>
    <script>
      document.getElementById("message-form").addEventListener("submit", async function (e) {
        e.preventDefault();
        const status = document.getElementById("status");
        status.style.display = "none";

        const plaintext = document.getElementById("plaintext").value;
        const password = document.getElementById("password").value;

        try {
          // Encrypt client-side before anything leaves the browser
          const { ciphertext, iv } = await CryptoHelper.encrypt(plaintext, password);
          document.getElementById("ciphertext").value = ciphertext;
          document.getElementById("iv").value = iv;
          // Remove plaintext so it never appears in the form body
          document.getElementById("plaintext").removeAttribute("name");
          this.submit();
        } catch (err) {
          status.textContent = "Encryption failed: " + err.message;
          status.style.display = "block";
        }
      });
    </script>
  `));
});

router.post("/set-message", (req, res) => {
  if (!req.cookies.username) {
    return res.redirect("/");
  }

  // Only ciphertext + IV ever reach the server
  const ciphertext = req.body.ciphertext;
  const iv = req.body.iv;

  if (!ciphertext || !iv) {
    return res.redirect("/set-message");
  }

  db.prepare(
    "UPDATE accounts SET message = ?, message_iv = ? WHERE username = ?"
  ).run(ciphertext, iv, req.cookies.username);

  res.redirect("/account");
});

module.exports = router;
