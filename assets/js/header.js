window.addEventListener("DOMContentLoaded", () => {
  const hash = location.hash || "";
  if (hash.includes("token=")) {
    const m = /token=([^&]+)/.exec(hash);
    if (m && m[1]) {
      localStorage.setItem('token', decodeURIComponent(m[1]));
      history.replaceState(null, '', location.pathname + location.search);
    }
  }
  const container = document.getElementById("site-header") || (() => {
    const h = document.createElement("div"); h.id = "site-header"; document.body.prepend(h); return h;
  })();
  const user = utils.currentUser();
  const isLoggedIn = !!user;
  const accountLabel = isLoggedIn ? "Account" : "Account";
  container.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; padding:12px; border-bottom:1px solid #eee;">
      <a href="index.html" style="font-weight:700; color:#1971c2; text-decoration:none">Gadgeto</a>
      <div style="flex:1; display:flex; gap:8px;">
        <input id="globalSearch" placeholder="Search for Products, Brands and More" style="flex:1; padding:8px 10px; border:1px solid #ddd; border-radius:8px" />
        <button id="globalSearchBtn" style="padding:8px 12px">Search</button>
      </div>
      <div style="position:relative">
        <button id="accountBtn" style="padding:8px 12px">${accountLabel}</button>
        <div id="accountMenu" style="position:absolute; right:0; top:36px; background:#fff; border:1px solid #ddd; box-shadow:0 2px 8px rgba(0,0,0,.08); display:none; min-width:180px;">
          <div style="padding:8px 12px; font-weight:600">Help & Settings</div>
          <a href="${user ? (user.is_admin ? 'admin-dashboard.html' : 'user-dashboard.html') : 'signup.html'}" style="display:block; padding:6px 12px; text-decoration:none; color:#111">Your Account</a>
          <a href="#" style="display:block; padding:6px 12px; text-decoration:none; color:#111">Customer Service</a>
          ${isLoggedIn ? '<a id="logoutLink" href="#" style="display:block; padding:6px 12px; text-decoration:none; color:#111">Logout</a>' : '<a href="login.html" style="display:block; padding:6px 12px; text-decoration:none; color:#111">Sign in</a>'}
          <div style="padding:8px 12px; font-weight:600">Trending</div>
          <a href="index.html?q=Chamber" style="display:block; padding:6px 12px; text-decoration:none; color:#111">Bestsellers</a>
          <a href="index.html?q=New" style="display:block; padding:6px 12px; text-decoration:none; color:#111">New Releases</a>
        </div>
      </div>
      <a href="cart.html" style="padding:8px 12px; text-decoration:none;">Cart</a>
    </div>
  `;
  const menu = document.getElementById("accountMenu");
  document.getElementById("accountBtn").addEventListener("click", () => {
    menu.style.display = menu.style.display === "none" || menu.style.display === "" ? "block" : "none";
  });
  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) menu.style.display = "none";
  });
  const searchBtn = document.getElementById("globalSearchBtn");
  const searchInput = document.getElementById("globalSearch");
  searchBtn.addEventListener("click", () => {
    const q = encodeURIComponent(searchInput.value.trim());
    if (location.pathname.endsWith("index.html")) {
      const evt = new CustomEvent('global-search', { detail: { q } });
      window.dispatchEvent(evt);
    } else {
      location.href = `index.html?q=${q}`;
    }
  });
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      alert('Logged out');
      location.href = 'index.html';
    });
  }
});
