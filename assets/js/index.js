window.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("products");
  const searchInput = document.getElementById("search");
  const searchBtn = document.getElementById("searchBtn");

  async function loadProducts(q = "") {
    const res = await api.get(`/products/?q=${encodeURIComponent(q)}`);
    const products = await res.json();
    container.innerHTML = "";
    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";
      if (p.image_url) card.style.backgroundImage = `url(${p.image_url})`;
      const content = document.createElement("div");
      content.className = "content";
      const isPhone = p.category && p.category.toLowerCase().includes("smartphone");
      let battery = null, camera = null, os = null;
      if (isPhone && p.description) {
        const d = p.description;
        const m1 = /Battery\s*Capacity\s*:\s*([^;]+)/i.exec(d); if (m1) battery = m1[1].trim();
        const m2 = /Primary\s*Camera\s*:\s*([^;]+)/i.exec(d); if (m2) camera = m2[1].trim();
        const m3 = /Operating\s*System\s*:\s*([^;]+)/i.exec(d); if (m3) os = m3[1].trim();
      }
      content.innerHTML = `
        <h3 style="margin:0 0 8px">${p.name}</h3>
        <div>Category: ${p.category}</div>
        ${isPhone ? (battery ? `<div>Battery: ${battery}</div>` : "") : `<div>Capacity: ${p.capacity_litres || "-"} L</div>`}
        ${isPhone ? (camera ? `<div>Camera: ${camera}</div>` : "") : (p.temperature_range ? `<div>Temperature: ${p.temperature_range}</div>` : "")}
        ${isPhone ? (os ? `<div>OS: ${os}</div>` : "") : (p.humidity_range ? `<div>Humidity: ${p.humidity_range}</div>` : "")}
        <div>Price: ₹${p.price.toLocaleString()}</div>
        <div style="margin-top:8px">
          <a href="product.html?id=${p.id}" style="margin-right:8px">View</a>
          <button data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">Add to Cart</button>
        </div>
      `;
      card.appendChild(content);
      container.appendChild(card);
    });

    container.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        const name = btn.dataset.name;
        const price = Number(btn.dataset.price);
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const idx = cart.findIndex(i => i.product_id === id);
        if (idx >= 0) cart[idx].quantity += 1; else cart.push({ product_id: id, name, price, quantity: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Added to cart");
      });
    });
  }

  searchBtn.addEventListener("click", () => loadProducts(searchInput.value));
  const params = new URLSearchParams(location.search);
  const initialQ = params.get('q') || '';
  if (initialQ) searchInput.value = initialQ;
  await loadProducts(initialQ);

  window.addEventListener('global-search', (e) => {
    const q = e.detail.q || '';
    searchInput.value = q;
    loadProducts(q);
  });
});
