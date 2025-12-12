window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forgotForm");
  const tokenEl = document.getElementById("token");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const res = await api.post("/auth/forgot", { email });
    const data = await res.json();
    if (data.token) {
      tokenEl.textContent = `Reset token (dev): ${data.token}`;
      localStorage.setItem("reset_token", data.token);
    } else {
      tokenEl.textContent = "If the email exists, a reset link was sent.";
    }
  });
});

