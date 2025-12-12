window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cart");
  const totalEl = document.getElementById("total");
  function render() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    container.innerHTML = "";
    let total = 0;
    cart.forEach((item, idx) => {
      total += item.price * item.quantity;
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.gap = "8px";
      row.style.alignItems = "center";
      row.innerHTML = `
        <div style="flex:1">${item.name}</div>
        <div>₹${item.price.toLocaleString()}</div>
        <input type="number" min="1" value="${item.quantity}" style="width:60px" />
        <button>Remove</button>
      `;
      const qtyInput = row.querySelector("input");
      qtyInput.addEventListener("change", (e) => {
        item.quantity = Number(e.target.value) || 1;
        cart[idx] = item;
        localStorage.setItem("cart", JSON.stringify(cart));
        render();
      });
      row.querySelector("button").addEventListener("click", () => {
        cart.splice(idx, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        render();
      });
      container.appendChild(row);
    });
    totalEl.textContent = `Total: ₹${total.toLocaleString()}`;
  }
  render();
});
