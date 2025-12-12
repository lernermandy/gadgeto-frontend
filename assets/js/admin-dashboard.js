window.addEventListener("DOMContentLoaded", async () => {
  const logoutBtn = document.getElementById("logout");
  logoutBtn.addEventListener("click", () => { localStorage.removeItem("token"); location.href = "admin-login.html"; });

  async function requireAdmin() {
    const res = await api.get("/admin/ping");
    if (!res.ok) { location.href = "admin-login.html"; return false; }
    return true;
  }
  if (!(await requireAdmin())) return;

  const summaryEl = document.getElementById("summary");
  const invEl = document.getElementById("inventory");
  const custEl = document.getElementById("customers");

  const resSummary = await api.get("/admin/orders");
  const summary = await resSummary.json();
  summaryEl.textContent = `Orders: ${summary.count} | Total Sales: ₹${(summary.total_sales||0).toLocaleString()}`;

  const resInv = await api.get("/admin/inventory");
  const inventory = await resInv.json();
  invEl.innerHTML = inventory.map(p => `<div>${p.sku} - ${p.name} | Stock: ${p.stock} | ₹${p.price}</div>`).join("");

  const resCust = await api.get("/admin/customers");
  const customers = await resCust.json();
  custEl.textContent = `Customers: ${customers.count}`;

  const form = document.getElementById("createProduct");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      sku: form.sku.value,
      name: form.name.value,
      category: form.category.value,
      price: Number(form.price.value),
      capacity_litres: form.capacity.value ? Number(form.capacity.value) : null,
      temperature_range: form.temperature.value || null,
      humidity_range: form.humidity.value || null,
      stock: form.stock.value ? Number(form.stock.value) : 0,
      image_url: form.image_url.value || null,
      description: form.description.value || null
    };
    const res = await api.post("/products/", payload);
    if (res.ok) {
      alert("Product created");
      const r = await api.get("/admin/inventory");
      const inv = await r.json();
      invEl.innerHTML = inv.map(p => `<div>${p.sku} - ${p.name} | Stock: ${p.stock} | ₹${p.price}</div>`).join("");
      form.reset();
    } else {
      alert("Create failed");
    }
  });
});
