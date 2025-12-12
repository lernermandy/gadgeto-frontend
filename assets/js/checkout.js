window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkoutForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) { alert("Cart is empty"); return; }
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;

    try {
      await authApi.login("demo@example.com", "demo123");
    } catch (e) {
      console.warn("Login failed", e);
    }
    const token = localStorage.getItem("token");
    if (!token) { alert("Login failed"); return; }

    const userId = 1;
    const billing = {
      line1: form.b_line1.value,
      city: form.b_city.value,
      state: form.b_state.value,
      postal_code: form.b_postal.value,
      country: form.b_country.value,
    };
    const shipping = {
      line1: form.s_line1.value,
      city: form.s_city.value,
      state: form.s_state.value,
      postal_code: form.s_postal.value,
      country: form.s_country.value,
    };

    const paymentMethod = form.querySelector("input[name='payment_method']:checked").value;

    try {
      const resCart = await api.get(`/cart/${userId}`);
      if (!resCart.ok) { alert("Failed to load cart"); submitBtn.disabled = false; return; }
      for (const item of cart) {
        const r = await api.post(`/cart/${userId}/items`, { product_id: item.product_id, quantity: item.quantity });
        if (!r.ok) { alert("Failed to add item to cart"); submitBtn.disabled = false; return; }
      }
      const resOrder = await api.post(`/orders/${userId}`, {
        billing_address: billing,
        shipping_address: shipping,
        payment_method: paymentMethod
      });
      if (!resOrder.ok) { alert("Failed to create order"); submitBtn.disabled = false; return; }
      const order = await resOrder.json();
      localStorage.setItem("orderId", order.id);
      localStorage.setItem("orderAmount", order.total_amount);
      if (order.upi_payment_link) {
        localStorage.setItem("upiLink", order.upi_payment_link);
      }

      if (paymentMethod === "online") {
        location.href = `payment.html?orderId=${order.id}`;
      } else {
        location.href = `success.html?orderId=${order.id}`;
      }
    } catch (err) {
      alert("Network error. Please try again.");
      submitBtn.disabled = false;
    }
  });
});
