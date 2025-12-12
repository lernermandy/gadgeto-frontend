window.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id"));
  const container = document.getElementById("product");
  if (!id) { container.innerHTML = "Product not found"; return; }
  const res = await api.get(`/products/${id}`);
  const p = await res.json();
  const isPhone = p.category && (p.category.toLowerCase().includes("smartphone") || p.category.toLowerCase().includes("phone"));
  let battery = p.battery_capacity || null;
  let camera = p.primary_camera || null;
  let os = null;

  if (isPhone && p.description && !battery) {
    const d = p.description;
    const m1 = /Battery\s*Capacity\s*:\s*([^;]+)/i.exec(d); if (m1) battery = m1[1].trim();
  }
  if (isPhone && p.description && !camera) {
    const d = p.description;
    const m2 = /Primary\s*Camera\s*:\s*([^;]+)/i.exec(d); if (m2) camera = m2[1].trim();
  }
  container.innerHTML = `
    ${p.image_url ? `<img src="${p.image_url}" alt="${p.name}" style="width:100%; max-width:520px; height:320px; object-fit:cover; margin-bottom:12px"/>` : ''}
    <h2>${p.name}</h2>
    <div>Category: ${p.category}</div>
    ${isPhone ? (battery ? `<div>Battery: ${battery}</div>` : "") : (p.capacity_litres ? `<div>Capacity: ${p.capacity_litres} L</div>` : "")}
    ${isPhone ? (camera ? `<div>Camera: ${camera}</div>` : "") : (p.temperature_range ? `<div>Temperature: ${p.temperature_range}</div>` : "")}
    ${isPhone ? (os ? `<div>OS: ${os}</div>` : "") : (p.humidity_range ? `<div>Humidity: ${p.humidity_range}</div>` : "")}
    <div>Price: ₹${p.price.toLocaleString()}</div>
    <div style="margin-top:20px; display:flex; gap:10px;">
      <button id="add" style="padding:10px 20px; background:#f0c14b; border:1px solid #a88734; cursor:pointer;">Add to Cart</button>
      <button id="buy" style="padding:10px 20px; background:#fa8900; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">Buy Now</button>
    </div>
  `;

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const idx = cart.findIndex(i => i.product_id === p.id);
    if (idx >= 0) cart[idx].quantity += 1; else cart.push({ product_id: p.id, name: p.name, price: p.price, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  document.getElementById("add").addEventListener("click", () => {
    addToCart();
    location.href = "cart.html";
  });

  document.getElementById("buy").addEventListener("click", () => {
    addToCart();
    location.href = "checkout.html";
  });
});
