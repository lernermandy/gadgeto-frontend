window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetForm");
  const msgEl = document.getElementById("msg");
  const saved = localStorage.getItem("reset_token");
  if (saved) form.token.value = saved;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = form.token.value.trim();
    const new_password = form.password.value;
    const res = await api.post("/auth/reset", { token, new_password });
    if (res.ok) {
      msgEl.textContent = "Password reset. Please login.";
      setTimeout(() => location.href = "admin-login.html", 1200);
    } else {
      const data = await res.json().catch(()=>({detail:"Error"}));
      msgEl.textContent = data.detail || "Reset failed";
    }
  });
});

