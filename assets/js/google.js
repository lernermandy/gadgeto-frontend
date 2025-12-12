window.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("googleBtn");
  if (!container) {
    console.log("No googleBtn container found");
    return;
  }

  console.log("Initializing Google Sign-In...");

  // Fetch Google Client ID from backend
  let clientId = "";

  try {
    console.log("Fetching Google Client ID from backend...");
    const res = await fetch(`${window.API_BASE}/auth/google-client-id`);

    if (res.ok) {
      const data = await res.json();
      clientId = data.client_id;
      console.log("✅ Google Client ID fetched successfully");
    } else {
      console.error("❌ Failed to fetch Google Client ID");
      clientId = "95703734000-5g9099b15uh4md9hav06ppe6mvj8apvd.apps.googleusercontent.com";
    }
  } catch (e) {
    console.error("❌ Error fetching Google Client ID:", e);
    clientId = "95703734000-5g9099b15uh4md9hav06ppe6mvj8apvd.apps.googleusercontent.com";
  }

  // Fallback to localStorage
  if (!clientId) {
    clientId = localStorage.getItem("GOOGLE_CLIENT_ID") || "";
  }

  console.log("Client ID status:", clientId ? "✅ Available" : "❌ Not available");

  // If no client ID, show a styled message
  if (!clientId) {
    container.innerHTML = `
      <div style="
        padding: 15px;
        background: #f8f9fa;
        border: 2px dashed #dee2e6;
        border-radius: 8px;
        text-align: center;
        color: #6c757d;
        font-size: 14px;
      ">
        <p style="margin: 0; font-weight: 600;">🔐 Google Sign-In</p>
        <p style="margin: 8px 0 0 0; font-size: 13px;">Currently unavailable</p>
      </div>
    `;
    console.log("Google Sign-In unavailable - no client ID");
    return;
  }

  // Create Google Sign-In button HTML
  container.innerHTML = `
    <div id="g_id_onload"
         data-client_id="${clientId}"
         data-context="signin"
         data-ux_mode="popup"
         data-callback="handleGoogleCredentialResponse"
         data-auto_prompt="false">
    </div>
    <div id="g_id_signin" 
         data-type="standard"
         data-shape="rectangular"
         data-theme="outline"
         data-text="continue_with"
         data-size="large"
         data-logo_alignment="left"
         data-width="100%">
    </div>
    <div id="manualGoogleBtn" style="display: none;">
      <button type="button" style="
        width: 100%;
        padding: 12px 24px;
        background: white;
        border: 2px solid #dadce0;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 600;
        color: #3c4043;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        transition: all 0.3s;
      " onmouseover="this.style.backgroundColor='#f8f9fa'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'" 
         onmouseout="this.style.backgroundColor='white'; this.style.boxShadow='none'">
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
          <path fill="none" d="M0 0h48v48H0z"></path>
        </svg>
        Continue with Google
      </button>
    </div>
  `;

  // Define global callback for Google Sign-In
  window.handleGoogleCredentialResponse = async (response) => {
    console.log("Google Sign-In callback triggered");

    if (!response.credential) {
      console.error("No credential in Google response");
      alert("Google Sign-In failed. Please try again.");
      return;
    }

    try {
      console.log("Sending credential to backend...");
      const res = await fetch(`${window.API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: response.credential })
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        console.log("✅ Google Sign-In successful!");
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
        window.location.href = "index.html";
      } else {
        console.error("❌ Backend rejected Google token");
        alert("Google Sign-In failed: " + (data.detail || "Unknown error"));
      }
    } catch (e) {
      console.error("❌ Network error during Google Sign-In:", e);
      alert("Network error. Please try again.");
    }
  };

  // Wait for Google Identity Services to load
  let attempts = 0;
  const maxAttempts = 50; // 5 seconds

  const checkGoogleLoaded = setInterval(() => {
    attempts++;

    if (window.google && window.google.accounts) {
      console.log("✅ Google Identity Services loaded!");
      clearInterval(checkGoogleLoaded);

      // Google SDK will automatically render the button
      setTimeout(() => {
        // Check if button was rendered
        const gButton = document.querySelector('#g_id_signin iframe');
        if (!gButton) {
          console.log("⚠️ Google button didn't render, showing manual button");
          document.getElementById('g_id_signin').style.display = 'none';
          document.getElementById('manualGoogleBtn').style.display = 'block';
        } else {
          console.log("✅ Google button rendered successfully");
        }
      }, 1000);

    } else if (attempts >= maxAttempts) {
      console.log("⚠️ Google SDK didn't load, showing manual button");
      clearInterval(checkGoogleLoaded);
      document.getElementById('g_id_signin').style.display = 'none';
      document.getElementById('manualGoogleBtn').style.display = 'block';

      // Add click handler for manual button
      const manualBtn = document.querySelector('#manualGoogleBtn button');
      if (manualBtn) {
        manualBtn.onclick = () => {
          alert("Google Sign-In is currently unavailable. Please use email/password signup instead.");
        };
      }
    }
  }, 100);
});
