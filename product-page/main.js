const product = {
  id: "p1",
  title: "Classic Sneaker",
  desc: "A simple product demo — variant selector + persistent cart.",
  variants: [
    { id: "v1", name: "White / Size 8", price: 2599, img: "assets/shoe.jpg" },
    { id: "v2", name: "Black / Size 8", price: 2799, img: "assets/main-image.jpg" },
    { id: "v3", name: "Navy / Size 9", price: 2699, img: "assets/blue.jpg" }
  ]
};

let cart = [];
const CART_KEY = "ulancer_demo_cart";

// DOM refs
const thumbsEl = document.getElementById("thumbs");
const mainImage = document.getElementById("mainImage");
const variantSelect = document.getElementById("variantSelect");
const priceEl = document.getElementById("price");
const addToCartBtn = document.getElementById("addToCart");
const cartCountEl = document.getElementById("cartCount");

const openCartBtn = document.getElementById("openCartBtn");
const cartModal = document.getElementById("cartModal");
const closeCartBtn = document.getElementById("closeCart");
const cartListEl = document.getElementById("cartList");
const cartTotalEl = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCart");
const checkoutBtn = document.getElementById("checkout");

// Save/load
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function loadCart() {
  const raw = localStorage.getItem(CART_KEY);
  if (raw) {
    try { cart = JSON.parse(raw); } catch (e) { cart = []; }
  } else { cart = []; }
}

// Render product UI (variants + thumbs)
function renderProduct() {
  variantSelect.innerHTML = "";
  thumbsEl.innerHTML = "";

  for (let i = 0; i < product.variants.length; i++) {
    const v = product.variants[i];

    // option
    const opt = document.createElement("option");
    opt.value = v.id;
    opt.textContent = v.name + " — ₹" + v.price;
    variantSelect.appendChild(opt);

    // thumb (same image file used)
    const img = document.createElement("img");
    img.src = v.img;
    img.alt = v.name;
    img.dataset.vid = v.id;
    img.addEventListener("click", function () {
      variantSelect.value = this.dataset.vid;
      onVariantChange();
    });
    thumbsEl.appendChild(img);
  }

  // initial
  variantSelect.value = product.variants[0].id;
  onVariantChange();
}

function onVariantChange() {
  const vid = variantSelect.value;
  const v = product.variants.find(x => x.id === vid);
  if (v) {
    mainImage.src = v.img;
    priceEl.textContent = "₹" + v.price;
    // highlight thumb
    const imgs = thumbsEl.querySelectorAll("img");
    imgs.forEach(img => {
      img.classList.toggle("selected", img.dataset.vid === vid);
    });
  }
}

// Cart operations
function addToCart() {
  const vid = variantSelect.value;
  const variant = product.variants.find(v => v.id === vid);
  if (!variant) return;

  const existing = cart.find(it => it.variantId === vid);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      productId: product.id,
      variantId: variant.id,
      title: product.title + " — " + variant.name,
      price: variant.price,
      qty: 1,
      img: variant.img
    });
  }
  saveCart();
  renderCart();
  flashCartCount();
}

function updateQty(variantId, delta) {
  const it = cart.find(i => i.variantId === variantId);
  if (!it) return;
  it.qty += delta;
  if (it.qty < 1) cart = cart.filter(i => i.variantId !== variantId);
  saveCart();
  renderCart();
}
function removeItem(variantId) {
  cart = cart.filter(i => i.variantId !== variantId);
  saveCart();
  renderCart();
}
function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

// Render cart
function renderCart() {
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  cartCountEl.textContent = totalQty;

  cartListEl.innerHTML = "";
  if (cart.length === 0) {
    cartListEl.innerHTML = "<p class='small-muted'>Your cart is empty.</p>";
    cartTotalEl.textContent = "₹0";
    return;
  }

  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    const it = cart[i];
    total += it.price * it.qty;

    const row = document.createElement("div");
    row.className = "cart-item";

    const img = document.createElement("img");
    img.src = it.img;
    img.alt = it.title;

    const meta = document.createElement("div");
    meta.className = "meta";

    const title = document.createElement("div");
    title.textContent = it.title;

    const price = document.createElement("div");
    price.textContent = "₹" + it.price + " × " + it.qty;

    const qty = document.createElement("div");
    qty.className = "qty-controls";

    const minus = document.createElement("button");
    minus.textContent = "-";
    minus.addEventListener("click", function () { updateQty(it.variantId, -1); });

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.addEventListener("click", function () { updateQty(it.variantId, +1); });

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.addEventListener("click", function () { removeItem(it.variantId); });

    qty.appendChild(minus);
    qty.appendChild(plus);
    qty.appendChild(del);

    meta.appendChild(title);
    meta.appendChild(price);
    meta.appendChild(qty);

    row.appendChild(img);
    row.appendChild(meta);
    cartListEl.appendChild(row);
  }

  cartTotalEl.textContent = "₹" + total;
}

// visual feedback
function flashCartCount() {
  cartCountEl.classList.add("flash");
  setTimeout(() => cartCountEl.classList.remove("flash"), 350);
}

// cart panel
function openCart() {
  cartModal.classList.add("open");
  cartModal.setAttribute("aria-hidden", "false");
  renderCart();
}
function closeCart() {
  cartModal.classList.remove("open");
  cartModal.setAttribute("aria-hidden", "true");
}

// init
function init() {
  loadCart();
  renderProduct();
  renderCart();

  variantSelect.addEventListener("change", onVariantChange);

  addToCartBtn.addEventListener("click", function () {
    addToCart();
    addToCartBtn.classList.add("pulse");
    setTimeout(() => addToCartBtn.classList.remove("pulse"), 220);
  });

  openCartBtn.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCart);
  clearCartBtn.addEventListener("click", function () {
    if (confirm("Clear cart?")) clearCart();
  });
  checkoutBtn.addEventListener("click", function () {
    alert("Demo checkout — no payment is processed.");
  });

  cartModal.addEventListener("click", function (e) {
    if (e.target === cartModal) closeCart();
  });
}

init();
