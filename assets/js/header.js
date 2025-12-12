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
    <nav>
      <h1><a href="index.html">Gadgeto</a></h1>
      
      <div style="flex:1; max-width:500px; display:flex; gap:10px; margin:0 20px;">
        <input id="globalSearch" placeholder="Search for products..." />
        <button id="globalSearchBtn">Search</button>
      </div>

      <ul>
        <li><a href="cart.html">Cart</a></li>
        <li style="position:relative">
          <button id="accountBtn" class="btn-outline" style="padding:0.5rem 1rem;">${accountLabel}</button>
          <div id="accountMenu" style="position:absolute; right:0; top:110%; background:#fff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.15); display:none; min-width:200px; z-index:1000; overflow:hidden;">
            <div style="padding:12px; border-bottom:1px solid #eee; background:#f8f9fa; font-weight:600; color:#667eea">My Account</div>
            <div style="padding:8px 0;">
                <a href="${user ? (user.is_admin ? 'admin-dashboard.html' : 'user-dashboard.html') : 'signup.html'}" style="display:block; padding:8px 16px; text-decoration:none; color:#333; transition:bg 0.2s">Dashboard</a>
                <a href="#" style="display:block; padding:8px 16px; text-decoration:none; color:#333">Orders</a>
                <a href="#" style="display:block; padding:8px 16px; text-decoration:none; color:#333">Help Center</a>
                ${isLoggedIn ?
      '<div style="border-top:1px solid #eee; margin-top:8px;"></div><a id="logoutLink" href="#" style="display:block; padding:8px 16px; text-decoration:none; color:#e74c3c">Logout</a>' :
      '<div style="border-top:1px solid #eee; margin-top:8px;"></div><a href="login.html" style="display:block; padding:8px 16px; text-decoration:none; color:#667eea; font-weight:600;">Sign In</a>'
    }
            </div>
          </div>
        </li>
      </ul>
    </nav>
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
