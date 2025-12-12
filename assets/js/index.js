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

      const isPhone = p.category && p.category.toLowerCase().includes("mobile");
      let specs = "";

      if (isPhone) {
        // Show compact specs for phones
        specs = `
            <div style="font-size:0.85rem; color:var(--text-gray); margin-bottom:4px;">
                ${p.battery_capacity ? `<span>🔋 ${p.battery_capacity}</span>` : ''} 
                ${p.primary_camera ? `<span style="margin-left:8px">📷 ${p.primary_camera}</span>` : ''}
            </div>
         `;
      } else {
        // Show capacity or temp for other items
        specs = `
            <div style="font-size:0.85rem; color:var(--text-gray); margin-bottom:4px;">
               ${p.capacity_litres ? `<span>Use: ${p.capacity_litres}L</span>` : `<span>${p.category}</span>`}
            </div>
         `;
      }

      card.innerHTML = `
        <div class="product-image" style="background-image: url('${p.image_url || 'assets/images/placeholder.png'}'); background-size: contain; background-repeat: no-repeat; background-position: center; height: 180px; background-color: #fff; border-bottom: 1px solid #eee;"></div>
        <div class="product-info" style="padding: 12px; display: flex; flex-direction: column; flex: 1;">
          <h3 class="product-title" style="font-size: 1rem; margin-bottom: 0.5rem; line-height: 1.3; height: 2.6rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${p.name}</h3>
          
          ${specs}

          <div class="product-price" style="margin-top: auto; font-size: 1.1rem; margin-bottom: 10px;">₹${p.price.toLocaleString()}</div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <a href="product.html?id=${p.id}" class="btn btn-secondary" style="font-size: 0.9rem; padding: 8px;">View</a>
            <button class="btn" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" style="font-size: 0.9rem; padding: 8px;">Add</button>
          </div>
        </div>
      `;
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
