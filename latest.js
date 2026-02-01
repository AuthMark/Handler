//          Copyright © AuthMark 2026-Present under GNU GPLv3 LICENSE
// ==================== AuthMark Official auth.js Script ====================
//                         https://authmark.github.io
//                                v1.1.2

window.AuthMark = (() => {
  const COOKIE_NAME = 'accid';
  const COOKIE_CHECK_URL = 'https://authmark.github.io/CheckCookie/';

  // ---------- Handle accid from URL (STEP 6 → 7) ----------
  (function handleAccidFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const accid = params.get('accid');
    if (!accid) return;

    // Store cookie on WEBSITE domain
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie =
      `${COOKIE_NAME}=${accid}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;

    // Remove accid from URL
    params.delete('accid');
    const cleanUrl =
      window.location.pathname +
      (params.toString() ? '?' + params.toString() : '') +
      window.location.hash;

    window.history.replaceState({}, document.title, cleanUrl);
  })();

  // ---------- Helpers ----------
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function deleteCookie(name) {
    document.cookie =
      `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  function getCurrentUrlEncoded() {
    return encodeURIComponent(window.location.href.split('?')[0]);
  }

  function createButton(text, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.addEventListener('click', onClick);
    return btn;
  }

  // ---------- UI ----------
  function renderLogout() {
    const el = document.getElementById('authmark-ctrl_logout');
    if (!el) return;
    el.innerHTML = '';
    el.appendChild(createButton('Logout', () => {
      deleteCookie(COOKIE_NAME);
      renderAll();
    }));
  }

  function renderLoginButtons() {
    document.querySelectorAll('[id^="authmark-ctrl_login_"]').forEach(div => {
      const provider = div.id.replace('authmark-ctrl_login_', '');
      div.innerHTML = '';
      div.appendChild(
        createButton(
          provider.charAt(0).toUpperCase() + provider.slice(1),
          () => login(provider)
        )
      );
    });
  }

  function renderProviderChooser() {
    const el = document.getElementById('authmark-ctrl_chooser');
    if (!el) return;
    el.innerHTML = '';
    el.appendChild(createButton('AuthMark Provider Chooser', () => {
      window.location.href =
        `${COOKIE_CHECK_URL}?fwacc=${getCurrentUrlEncoded()}`;
    }));
  }

  // ---------- Auth ----------
  function login(provider) {
    window.location.href =
      `${COOKIE_CHECK_URL}?fwacc=${getCurrentUrlEncoded()}&provider=${provider}`;
  }

  // ---------- Render ----------
  function renderAll() {
    if (getCookie(COOKIE_NAME)) {
      renderLogout();
    } else {
      renderLoginButtons();
    }
    renderProviderChooser();
  }

  function init() {
    renderAll();
    setInterval(renderAll, 30000);
  }

  return { init };
})();
