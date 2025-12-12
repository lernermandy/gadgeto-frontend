window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const orderId = Number(params.get("orderId") || localStorage.getItem("orderId"));
  const amount = Number(localStorage.getItem("orderAmount") || 0);
  const info = document.getElementById("info");
  const upiBox = document.getElementById("upi");
  const upiLinkWrap = document.getElementById("upiLinkWrap");
  const qrWrap = document.getElementById("qrWrap");
  const confirmBtn = document.getElementById("confirmOnline");
  const payOnlineBtn = document.getElementById("payOnlineBtn");

  info.textContent = `Order #${orderId} Amount ₹${amount.toLocaleString()}`;

  const upiLink = localStorage.getItem("upiLink");

  if (upiLink) {
    // If we have a pre-generated UPI link from checkout
    document.getElementById("payment-options").style.display = "none";
    document.getElementById("online-section").style.display = "block";

    // Hide Pay Now button, show QR immediately
    payOnlineBtn.style.display = "none";

    upiLinkWrap.innerHTML = `<a href="${upiLink}" style="word-break:break-all">${upiLink}</a>`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiLink)}`;
    qrWrap.innerHTML = `<img alt="UPI QR" src="${qrUrl}" width="240" height="240"/>`;
    upiBox.style.display = "block";

    confirmBtn.onclick = () => {
      localStorage.removeItem("upiLink");
      localStorage.removeItem("cart");
      location.href = `success.html?orderId=${orderId}`;
    };
  } else {
    // Fallback: show Pay Now button
    payOnlineBtn.addEventListener("click", async () => {
      payOnlineBtn.disabled = true;
      try {
        const res = await api.post("/payments/create-session", { order_id: orderId, amount });
        if (!res.ok) {
          alert("Payment session create failed");
          payOnlineBtn.disabled = false;
          return;
        }
        const p = await res.json();
        const generatedUpiLink = p.upi_link || (() => {
          const pa = 'jmandar0707@okhdfcbank';
          const pn = encodeURIComponent('mandar jadhav');
          const tr = encodeURIComponent(p.reference_id || p.session_id);
          return `upi://pay?pa=${pa}&pn=${pn}&am=${amount.toFixed(2)}&cu=INR&tn=Order%20${orderId}&tr=${tr}`;
        })();

        upiLinkWrap.innerHTML = `<a href="${generatedUpiLink}" style="word-break:break-all">${generatedUpiLink}</a>`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(generatedUpiLink)}`;
        qrWrap.innerHTML = `<img alt="UPI QR" src="${qrUrl}" width="240" height="240"/>`;
        upiBox.style.display = "block";
        payOnlineBtn.style.display = "none";

        confirmBtn.onclick = async () => {
          confirmBtn.disabled = true;
          const resW = await api.post("/payments/webhook", { reference_id: p.reference_id || p.session_id, order_id: orderId });
          if (!resW.ok) {
            alert("Payment confirmation failed");
            confirmBtn.disabled = false;
            return;
          }
          localStorage.removeItem("upiLink");
          localStorage.removeItem("cart");
          location.href = `success.html?orderId=${orderId}`;
        };
      } catch (e) {
        alert("Network error during payment");
        payOnlineBtn.disabled = false;
      }
    });
  }
});
