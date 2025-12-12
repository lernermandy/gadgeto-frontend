window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    const res = await authApi.login(email, password);
    if (res && res.access_token) {
      const payload = utils.parseJwt(res.access_token);
      if (payload && payload.is_admin) {
        location.href = "admin-dashboard.html";
      } else {
        location.href = "index.html";
      }
    } else {
      alert("Login failed");
    }
  });
});

