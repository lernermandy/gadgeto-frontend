window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const full_name = form.full_name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    try {
      const res = await authApi.register(email, password, full_name);
      if (!res.ok) {
        const data = await res.json().catch(() => ({ detail: "Signup failed" }));
        if (data.detail && /email already registered/i.test(data.detail)) {
          alert("Email already registered. Please login.");
          location.href = "admin-login.html";
          return;
        }
        alert(data.detail || "Signup failed");
        submitBtn.disabled = false;
        return;
      }
      const loginRes = await authApi.login(email, password);
      if (!loginRes || !loginRes.access_token) {
        alert("Login failed after signup");
        submitBtn.disabled = false;
        return;
      }
      alert("Account created. Logged in.");
      location.href = "index.html";
    } catch (err) {
      alert("Network error. Please try again.");
      submitBtn.disabled = false;
    }
  });
});
