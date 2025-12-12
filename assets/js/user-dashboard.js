window.addEventListener("DOMContentLoaded", async () => {
  const user = utils.currentUser();
  if (!user) { location.href = "admin-login.html"; return; }
  const userInfo = document.getElementById("userInfo");
  const ordersEl = document.getElementById("orders");
  const wishlistEl = document.getElementById("wishlist");

  const rUser = await api.get(`/users/${user.id}`);
  const u = await rUser.json();
  userInfo.textContent = `${u.full_name || u.email} (${u.email})`;

  const rOrders = await api.get(`/orders/${user.id}`);
  const orders = await rOrders.json();
  ordersEl.innerHTML = orders.map(o => `<div>Order #${o.id} • ${o.status} • ₹${(o.total_amount||0).toLocaleString()}</div>`).join("") || "No orders";

  const rWish = await api.get(`/wishlist/${user.id}`);
  const wishlist = await rWish.json();
  wishlistEl.innerHTML = wishlist.map(w => `<div>Product #${w.product_id}</div>`).join("") || "No wishlist items";
});

