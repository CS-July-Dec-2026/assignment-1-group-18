const express = require("express");
const router = express.Router();
const db = require("../db");
const { page } = require("../views");

router.get("/account", (req, res) => {
  if (!req.cookies.username) {
    return res.redirect("/");
  }

  const me = db.prepare("SELECT * FROM accounts WHERE username = ?").get(req.cookies.username);
  if (!me) {
    res.clearCookie("username");
    return res.redirect("/");
  }

  let messageBlock;
  if (me.message && me.message_iv) {
    // Locked state — ciphertext + IV are embedded so decryption needs zero network requests
    messageBlock = `
      <div class="message-box" id="locked-box">
        🔒 <strong>${me.display_name}'s message is locked</strong><br>
        <p style="margin:10px 0 6px; font-size:0.9em;">Enter your password to unlock</p>
        <input type="password" id="unlock-password" placeholder="Your password" style="width:100%; padding:10px; border:2px solid #e6dcff; border-radius:10px; margin-bottom:8px;">
        <button type="button" id="unlock-btn" class="btn btn-yellow" style="margin-top:4px;">🔓 Unlock</button>
        <p id="unlock-error" style="color:#e0554f; font-size:0.9em; display:none; margin-top:8px;"></p>
      </div>
      <div class="message-box" id="unlocked-box" style="display:none;">
        💬 <strong>${me.display_name}'s message:</strong><br>
        <span id="decrypted-message"></span>
      </div>
      <script src="/public/crypto.js"></script>
      <script>
        (function () {
          // Ciphertext and IV are already present on the page — no fetch needed
          const ciphertext = ${JSON.stringify(me.message)};
          const iv = ${JSON.stringify(me.message_iv)};

          document.getElementById("unlock-btn").addEventListener("click", async function () {
            const password = document.getElementById("unlock-password").value;
            const errEl = document.getElementById("unlock-error");
            errEl.style.display = "none";

            try {
              const plaintext = await CryptoHelper.decrypt(ciphertext, iv, password);
              document.getElementById("decrypted-message").textContent = plaintext;
              document.getElementById("locked-box").style.display = "none";
              document.getElementById("unlocked-box").style.display = "block";
            } catch (err) {
              errEl.textContent = "Wrong password or corrupted message.";
              errEl.style.display = "block";
            }
          });
        })();
      </script>
    `;
  } else {
    messageBlock = `<div class="message-box empty">💬 No message set yet.</div>`;
  }

  res.send(page("My Page", `
    <h1>👋 Hi, ${me.display_name}!</h1>
    ${messageBlock}
    <div class="button-row">
      <a href="/set-message" class="btn btn-yellow">✏️ Set My Message</a>
      <a href="/change-password" class="btn btn-green">🔑 Change Password</a>
    </div>
    <a href="/logout" class="btn btn-pink" style="margin-top: 14px; display:inline-block;">Log Out</a>
  `));
});

router.get("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/");
});

module.exports = router;
