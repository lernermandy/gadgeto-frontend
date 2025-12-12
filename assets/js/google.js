window.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("googleBtn");
  if (!container) return;

  // Hardcoded Client ID for reliability
  const clientId = "95703734000-5g9099b15uh4md9hav06ppe6mvj8apvd.apps.googleusercontent.com";

  // Function to handle the Google response
  window.handleGoogleCredentialResponse = async (response) => {
    console.log("Google Sign-In callback triggered");
    if (!response.credential) {
      alert("Google Sign-In failed. Please try again.");
      return;
    }

    try {
      const res = await fetch(`${window.API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: response.credential })
      });

      const data = await res.json();
      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
        window.location.href = "index.html";
      } else {
        alert("Google Sign-In failed: " + (data.detail || "Unknown error"));
      }
    } catch (e) {
      console.error("Network error:", e);
      alert("Network error. Please try again.");
    }
  };

  // Check if Google SDK is loaded
  const initializeGoogle = () => {
    if (window.google && window.google.accounts) {
      console.log("Initializing Google Sign-In with JS API...");

      google.accounts.id.initialize({
        client_id: clientId,
        callback: window.handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      google.accounts.id.renderButton(
        container,
        {
          theme: "outline",
          size: "large",
          width: "100%", // Responsive width
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left"
        }
      );

      console.log("Google button rendered via JS API");
    } else {
      console.log("Google SDK not ready, retrying...");
      setTimeout(initializeGoogle, 500);
    }
  };

  initializeGoogle();
});
