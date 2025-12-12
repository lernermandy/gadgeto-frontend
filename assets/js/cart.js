window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cart-container");

  function render() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    container.innerHTML = "";

    // Header
    const header = document.createElement("h2");
    header.textContent = "Shopping Cart";
    header.style.marginBottom = "1.5rem";
    container.appendChild(header);

    if (cart.length === 0) {
      container.innerHTML += `
        <div class="cart-empty">
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <a href="index.html" class="btn" style="margin-top:1rem; display:inline-block">Continue Shopping</a>
        </div>`;
      return;
    }

    const layout = document.createElement("div");
    layout.className = "cart-layout";

    // Left: Items
    const itemsList = document.createElement("div");
    itemsList.className = "cart-items";

    let total = 0;

    cart.forEach((item, idx) => {
      total += item.price * item.quantity;

      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML = `
        <img src="${item.image || 'assets/images/placeholder.svg'}" alt="${item.name}" class="cart-item-image" onerror="this.src='assets/images/placeholder.svg'">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
        </div>
        <div class="cart-item-actions">
           <div class="qty-control">
             <button class="qty-btn" data-action="dec">-</button>
             <input type="number" class="qty-input" value="${item.quantity}" min="1" readonly>
             <button class="qty-btn" data-action="inc">+</button>
           </div>
           <button class="remove-btn">
             <span>🗑️</span> Remove
           </button>
        </div>
      `;

      // Events
      el.querySelector("button[data-action='dec']").addEventListener("click", () => {
        if (item.quantity > 1) {
          item.quantity--;
          saveAndRender();
        } else {
          // Optional: Confirm remove if quantity goes to 0? For now just stop at 1.
        }
      });

      el.querySelector("button[data-action='inc']").addEventListener("click", () => {
        item.quantity++;
        saveAndRender();
      });

      el.querySelector(".remove-btn").addEventListener("click", () => {
        cart.splice(idx, 1);
        saveAndRender();
      });

      itemsList.appendChild(el);
    });

    layout.appendChild(itemsList);

    // Right: Summary
    const summary = document.createElement("div");
    summary.className = "cart-summary";
    summary.innerHTML = `
      <h3>Order Summary</h3>
      <div class="summary-row">
        <span>Subtotal</span>
        <span>₹${total.toLocaleString()}</span>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span style="color:var(--success)">Free</span>
      </div>
      <div class="summary-row">
        <span>Tax</span>
        <span>Included</span>
      </div>
      <div class="summary-total">
        <span>Total</span>
        <span>₹${total.toLocaleString()}</span>
      </div>
      <a href="checkout.html" class="btn checkout-btn">Proceed to Checkout</a>
    `;

    layout.appendChild(summary);
    container.appendChild(layout);

    function saveAndRender() {
      localStorage.setItem("cart", JSON.stringify(cart));
      render();
    }
  }

  render();
});
