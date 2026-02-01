//          Copyright © AuthMark 2026-Present under GNU GPLv3 LICENSE
// ==================== AuthMark Official auth.js Script ====================
//                         https://authmark.github.io
//                              Version: 1.1.1

window.AuthMark = (() => {
  const COOKIE_NAME = 'accid';
  const COOKIE_CHECK_URL = 'https://authmark.github.io/CheckCookie/';

  // ---------- URL accid Handler (fwacc only) ----------
  (function handleAccidFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const accid = params.get(COOKIE_NAME);

    if (!accid) return;

    // Save accid cookie on fwacc domain
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    document.cookie =
      `${COOKIE_NAME}=${accid}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;

    // Remove accid from URL for security
    params.delete(COOKIE_NAME);
    const cleanUrl =
      window.location.pathname +
      (params.toString() ? '?' + params.toString() : '') +
      window.location.hash;

    window.history.replaceState({}, document.title, cleanUrl);
  })();

  // ---------- Helper Functions ----------
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function setCookie(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie =
      `${name}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
  }

  function deleteCookie(name) {
    document.cookie =
      `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  function getCurrentUrlEncoded() {
    return encodeURIComponent(window.location.href.split('?')[0]);
  }

  function createButton(text, onClick, customClass = 'authmark-btn') {
    const btn = document.createElement('button');
    btn.className = customClass;
    btn.textContent = text;
    btn.addEventListener('click', onClick);
    return btn;
  }

  // ---------- UI Rendering ----------
  function renderLogout() {
    const container = document.getElementById('authmark-ctrl_logout');
    if (!container) return;
    container.innerHTML = '';
    const btn = createButton('Logout', () => {
      deleteCookie(COOKIE_NAME);
      renderAll();
    });
    container.appendChild(btn);
  }

  function renderLoginButtons() {
    const loginDivs = document.querySelectorAll('[id^="authmark-ctrl_login_"]');
    loginDivs.forEach(div => {
      const provider = div.id.replace('authmark-ctrl_login_', '');
      div.innerHTML = '';
      const btn = createButton(
        provider.charAt(0).toUpperCase() + provider.slice(1),
        () => login(provider)
      );
      div.appendChild(btn);
    });
  }

  function renderProviderChooser() {
    const container = document.getElementById('authmark-ctrl_chooser');
    if (!container) return;
    container.innerHTML = '';
    const btn = createButton('AuthMark Provider Chooser', () => {
      const url = `${COOKIE_CHECK_URL}?fwacc=${getCurrentUrlEncoded()}`;
      window.location.href = url;
    });
    container.appendChild(btn);
  }

  // ---------- Auth Functions ----------
  function login(provider) {
    const url =
      `${COOKIE_CHECK_URL}?fwacc=${getCurrentUrlEncoded()}&provider=${provider}`;
    window.location.href = url;
  }

  // ---------- Render All ----------
  function renderAll() {
    if (getCookie(COOKIE_NAME)) {
      // logged in → show logout
      renderLogout();
    } else {
      // logged out → show login buttons
      renderLoginButtons();
    }
    renderProviderChooser();
  }

  // ---------- Init ----------
  function init() {
    renderAll();
    // Periodic refresh to update buttons if cookie changes
    setInterval(renderAll, 30000);
  }

  console.log('AuthMark Initialised!');
  return { init, getCookie, setCookie, deleteCookie };
})();
