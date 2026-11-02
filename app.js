/**
 * 線上訂單系統前端腳本 (app.js)
 */

// ==========================================
// 預設資料 (Fallback Data)
// 當以 file:// 本地開啟無法進行 fetch CSV 時自動啟用
// ==========================================
const DEFAULT_MENU_DATA = [
  { category: "季節限定", name: "荔荔茉莉", priceM: null, priceL: 50 },
  { category: "季節限定", name: "荔荔蜜桃椰果", priceM: null, priceL: 65 },
  { category: "季節限定", name: "荔多鮮奶果昔", priceM: 60, priceL: null },
  { category: "季節限定", name: "蜜桃烏龍", priceM: null, priceL: 70 },
  { category: "季節限定", name: "蜜桃茉莉", priceM: null, priceL: 70 },
  { category: "季節限定", name: "夏嶼果茶", priceM: null, priceL: 65 },
  { category: "季節限定", name: "海鹽芒果綠", priceM: null, priceL: 65 },
  { category: "季節限定", name: "蔗杯紅柚凍飲", priceM: null, priceL: 75 },
  { category: "醇萃茶", name: "娜杯紅茶", priceM: null, priceL: 45 },
  { category: "醇萃茶", name: "英倫伯爵紅茶", priceM: null, priceL: 40 },
  { category: "醇萃茶", name: "大正醇香紅茶", priceM: null, priceL: 40 },
  { category: "醇萃茶", name: "原片初露青茶", priceM: null, priceL: 40 },
  { category: "醇萃茶", name: "茉莉原萃綠茶", priceM: null, priceL: 40 },
  { category: "醇萃茶", name: "琥珀高峰烏龍", priceM: null, priceL: 40 },
  { category: "鮮調果茶", name: "桂香原片青", priceM: null, priceL: 50 },
  { category: "鮮調果茶", name: "桂香青檸蜂蜜粉條", priceM: null, priceL: 65 },
  { category: "鮮調果茶", name: "柳丁綠茶/青茶", priceM: null, priceL: 70 },
  { category: "鮮調果茶", name: "白甘蔗青茶", priceM: null, priceL: 75 },
  { category: "鮮調果茶", name: "青檸香茶", priceM: null, priceL: 70 },
  { category: "鮮調果茶", name: "蜂蜜檸檬晶凍", priceM: null, priceL: 60 },
  { category: "鮮調果茶", name: "香柚綠茶", priceM: null, priceL: 60 },
  { category: "鮮調果茶", name: "養樂多綠", priceM: null, priceL: 55 },
  { category: "鮮調果茶", name: "冬瓜青茶", priceM: null, priceL: 55 },
  { category: "鮮調果茶", name: "冰萃柳丁/檸檬", priceM: null, priceL: 65 },
  { category: "醇濃鮮奶茶", name: "娜杯紅茶拿鐵", priceM: 60, priceL: 70 },
  { category: "醇濃鮮奶茶", name: "伯爵紅茶拿鐵", priceM: 55, priceL: 65 },
  { category: "醇濃鮮奶茶", name: "大正紅茶拿鐵", priceM: 55, priceL: 65 },
  { category: "醇濃鮮奶茶", name: "琥珀烏龍拿鐵", priceM: 55, priceL: 65 },
  { category: "醇濃鮮奶茶", name: "茉香綠茶拿鐵", priceM: 55, priceL: 65 },
  { category: "醇濃鮮奶茶", name: "原片青茶拿鐵", priceM: 55, priceL: 65 },
  { category: "醇濃鮮奶茶", name: "珍珠紅茶拿鐵 (伯爵/大正)", priceM: 65, priceL: 75 },
  { category: "醇濃鮮奶茶", name: "珍珠娜杯紅茶拿鐵", priceM: 70, priceL: 80 },
  { category: "無咖啡因", name: "桂香輕蕎麥", priceM: null, priceL: 55 },
  { category: "無咖啡因", name: "輕纖蕎麥茶", priceM: null, priceL: 45 },
  { category: "無咖啡因", name: "輕纖蕎麥拿鐵", priceM: 65, priceL: 75 },
  { category: "無咖啡因", name: "焙香決明大麥", priceM: null, priceL: 35 },
  { category: "無咖啡因", name: "焙香大麥拿鐵", priceM: 55, priceL: 65 },
  { category: "無咖啡因", name: "原鄉冬瓜茶", priceM: null, priceL: 40 },
  { category: "無咖啡因", name: "冬瓜檸檬/麥茶", priceM: null, priceL: 55 },
  { category: "醇濃綠光鮮奶", name: "芋頭鮮奶", priceM: 70, priceL: 90 },
  { category: "醇濃綠光鮮奶", name: "珍珠鮮奶", priceM: 70, priceL: 90 },
  { category: "醇濃綠光鮮奶", name: "手炒黑糖鮮奶", priceM: 65, priceL: 85 },
  { category: "醇濃綠光鮮奶", name: "嫩仙草凍奶", priceM: 65, priceL: 85 },
  { category: "醇濃綠光鮮奶", name: "綠光純鮮奶家庭號", priceM: null, priceL: 169 }
];

const DEFAULT_CUSTOM_DATA = {
  sugars: ["正常糖", "少糖", "半糖", "微糖", "無糖"],
  ices: ["正常冰", "少冰", "微冰", "去冰", "溫", "熱"],
  toppings: [
    { name: "珍珠", price: 10 },
    { name: "仙草凍", price: 10 },
    { name: "綠茶凍", price: 10 },
    { name: "蜂蜜黑糖粉粿", price: 15 },
    { name: "荔枝椰果", price: 15 }
  ]
};

// ==========================================
// 應用程式狀態 (State)
// ==========================================
const INITIAL_CATEGORIES = Array.from(new Set(DEFAULT_MENU_DATA.map(item => item.category)));

const state = {
  menu: [...DEFAULT_MENU_DATA],
  customOptions: DEFAULT_CUSTOM_DATA,
  categories: INITIAL_CATEGORIES,
  activeCategory: "ALL",
  searchKeyword: "",
  cart: [],
  currentModalDrink: null,
  selectedSize: "L", // 'M' or 'L'
  selectedSugar: "微糖",
  selectedIce: "微冰",
  selectedToppings: [],
  currentQty: 1,
  scriptUrl: "https://script.google.com/macros/s/AKfycbxakwajA3vM2_SKyABSOvUIeikTDPtJcjgcWY_7_9biK-Whqck7dysjeDVNXp1gN92B/exec"
};

// ==========================================
// DOM 元素快取
// ==========================================
const DOM = {
  customerName: document.getElementById("customerName"),
  customerPhone: document.getElementById("customerPhone"),
  orderNote: document.getElementById("orderNote"),
  categoryTabs: document.getElementById("categoryTabs"),
  searchInput: document.getElementById("searchInput"),
  drinksGrid: document.getElementById("drinksGrid"),
  menuCountBadge: document.getElementById("menuCountBadge"),
  cartItemsContainer: document.getElementById("cartItemsContainer"),
  cartEmptyState: document.getElementById("cartEmptyState"),
  totalCupsText: document.getElementById("totalCupsText"),
  totalPriceText: document.getElementById("totalPriceText"),
  btnSubmitOrder: document.getElementById("btnSubmitOrder"),
  btnClearCart: document.getElementById("btnClearCart"),
  // Custom Modal
  customModal: document.getElementById("customModal"),
  btnCloseCustomModal: document.getElementById("btnCloseCustomModal"),
  modalDrinkTitle: document.getElementById("modalDrinkTitle"),
  sizeOptionsContainer: document.getElementById("sizeOptionsContainer"),
  sugarOptionsContainer: document.getElementById("sugarOptionsContainer"),
  iceOptionsContainer: document.getElementById("iceOptionsContainer"),
  toppingOptionsContainer: document.getElementById("toppingOptionsContainer"),
  inputItemQty: document.getElementById("inputItemQty"),
  btnQtyMinus: document.getElementById("btnQtyMinus"),
  btnQtyPlus: document.getElementById("btnQtyPlus"),
  modalSubtotalPrice: document.getElementById("modalSubtotalPrice"),
  btnConfirmAddToCart: document.getElementById("btnConfirmAddToCart"),
  // Success Modal
  successModal: document.getElementById("successModal"),
  btnCloseSuccessModal: document.getElementById("btnCloseSuccessModal"),
  btnResetOrder: document.getElementById("btnResetOrder"),
  successOrderId: document.getElementById("successOrderId"),
  successTimestamp: document.getElementById("successTimestamp"),
  successCustomerName: document.getElementById("successCustomerName"),
  successCustomerPhone: document.getElementById("successCustomerPhone"),
  successTotalPrice: document.getElementById("successTotalPrice"),
  successOrderItems: document.getElementById("successOrderItems"),
  toastContainer: document.getElementById("toastContainer")
};

// ==========================================
// CSV 解析模組
// ==========================================
async function loadCSVData() {
  try {
    // 嘗試透過 HTTP / HTTPS fetch 載入兩份 CSV (在 GitHub Pages 等環境)
    const [menuRes, customRes] = await Promise.all([
      fetch("menu_data.csv"),
      fetch("cutomize.csv")
    ]);

    if (menuRes.ok && customRes.ok) {
      let menuText = await menuRes.text();
      let customText = await customRes.text();

      // 去除 UTF-8 BOM 避免解析首行標頭欄位出錯
      if (menuText.charCodeAt(0) === 0xFEFF) menuText = menuText.slice(1);
      if (customText.charCodeAt(0) === 0xFEFF) customText = customText.slice(1);

      const parsedMenu = parseMenuCSV(menuText);
      const parsedCustom = parseCustomizeCSV(customText);

      if (parsedMenu && parsedMenu.length > 0) {
        state.menu = parsedMenu;
        const catSet = new Set();
        state.menu.forEach(item => {
          if (item.category) catSet.add(item.category);
        });
        state.categories = Array.from(catSet);
      }
      if (parsedCustom) {
        state.customOptions = parsedCustom;
      }

      // 以最新 CSV 更新畫面
      renderCategoryTabs();
      renderDrinks();
    }
  } catch (err) {
    console.info("使用預設飲料資料庫運行：", err.message);
  }
}

function parseMenuCSV(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  const items = [];
  // 第一行為標題: 類別,品名,中杯(M),大杯(L)
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",").map(p => p.trim());
    if (parts.length >= 2 && parts[1]) {
      const category = parts[0];
      const name = parts[1];
      const priceM = parts[2] ? parseInt(parts[2], 10) : null;
      const priceL = parts[3] ? parseInt(parts[3], 10) : null;
      items.push({ category, name, priceM, priceL });
    }
  }
  return items.length > 0 ? items : DEFAULT_MENU_DATA;
}

function parseCustomizeCSV(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  const result = {
    sugars: [],
    ices: [],
    toppings: []
  };

  lines.forEach(line => {
    const cols = line.split(",").map(c => c.trim()).filter(c => c.length > 0);
    if (cols.length === 0) return;
    const type = cols[0];
    const items = cols.slice(1);

    if (type.includes("糖")) {
      result.sugars = items;
    } else if (type.includes("冰")) {
      result.ices = items;
    } else if (type.includes("10元")) {
      items.forEach(topName => {
        result.toppings.push({ name: topName, price: 10 });
      });
    } else if (type.includes("15元")) {
      items.forEach(topName => {
        result.toppings.push({ name: topName, price: 15 });
      });
    }
  });

  return (result.sugars.length && result.ices.length) ? result : DEFAULT_CUSTOM_DATA;
}

// ==========================================
// 飲品清單與分類渲染
// ==========================================
function renderCategoryTabs() {
  DOM.categoryTabs.innerHTML = `
    <button class="tab-btn ${state.activeCategory === 'ALL' ? 'active' : ''}" data-category="ALL">全部飲品</button>
  `;
  state.categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = `tab-btn ${state.activeCategory === cat ? 'active' : ''}`;
    btn.setAttribute("data-category", cat);
    btn.textContent = cat;
    DOM.categoryTabs.appendChild(btn);
  });
}

function renderDrinks() {
  const filtered = state.menu.filter(drink => {
    const matchCat = (state.activeCategory === "ALL" || drink.category === state.activeCategory);
    const matchSearch = (!state.searchKeyword || drink.name.toLowerCase().includes(state.searchKeyword.toLowerCase()));
    return matchCat && matchSearch;
  });

  DOM.menuCountBadge.textContent = `共 ${filtered.length} 款飲品`;
  DOM.drinksGrid.innerHTML = "";

  if (filtered.length === 0) {
    DOM.drinksGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <p style="font-size: 2rem; margin-bottom: 0.5rem;">🍃</p>
        <p>沒有找到符合條件的飲品</p>
      </div>
    `;
    return;
  }

  filtered.forEach(drink => {
    const card = document.createElement("div");
    card.className = "drink-card";

    let priceHtml = "";
    if (drink.priceM !== null && drink.priceL !== null) {
      priceHtml = `
        <div class="price-item"><span class="tag">中</span><span class="num">$${drink.priceM}</span></div>
        <div class="price-item"><span class="tag">大</span><span class="num">$${drink.priceL}</span></div>
      `;
    } else if (drink.priceM !== null) {
      priceHtml = `<div class="price-item"><span class="tag">中</span><span class="num">$${drink.priceM}</span></div>`;
    } else if (drink.priceL !== null) {
      priceHtml = `<div class="price-item"><span class="tag">大</span><span class="num">$${drink.priceL}</span></div>`;
    }

    card.innerHTML = `
      <div class="drink-header">
        <span class="drink-category-badge">${escapeHtml(drink.category)}</span>
        <h3 class="drink-name">${escapeHtml(drink.name)}</h3>
      </div>
      <div class="drink-footer">
        <div class="drink-prices" style="margin-bottom: 0.75rem;">
          ${priceHtml}
        </div>
        <button class="btn-select-drink" type="button">
          <span>客製規格</span>
          <span>＋</span>
        </button>
      </div>
    `;

    // 點擊卡片任何地方或按鈕均可開啟客製化選單
    card.addEventListener("click", () => {
      openCustomModal(drink);
    });

    DOM.drinksGrid.appendChild(card);
  });
}

// ==========================================
// 客製化視窗 (Modal) 控制與即時計算
// ==========================================
function openCustomModal(drink) {
  state.currentModalDrink = drink;
  state.currentQty = 1;
  DOM.inputItemQty.value = 1;
  state.selectedToppings = [];

  DOM.modalDrinkTitle.textContent = `${drink.name} - 客製規格`;

  // 1. 決定預設尺寸
  if (drink.priceL !== null) {
    state.selectedSize = "L";
  } else if (drink.priceM !== null) {
    state.selectedSize = "M";
  }

  // 渲染尺寸選項
  DOM.sizeOptionsContainer.innerHTML = "";
  const sizes = [
    { key: "M", label: "中杯 (M)", price: drink.priceM },
    { key: "L", label: "大杯 (L)", price: drink.priceL }
  ];

  sizes.forEach(s => {
    const hasSize = (s.price !== null);
    const label = document.createElement("label");
    label.className = "chip-label";
    label.innerHTML = `
      <input type="radio" name="modal_size" value="${s.key}" ${!hasSize ? "disabled" : ""} ${hasSize && state.selectedSize === s.key ? "checked" : ""}>
      <span class="chip-btn">
        ${s.label} ${hasSize ? `<span class="chip-price-badge">$${s.price}</span>` : `<span style="font-size: 0.75rem;">(無提供)</span>`}
      </span>
    `;
    label.querySelector("input").addEventListener("change", (e) => {
      if (e.target.checked) {
        state.selectedSize = s.key;
        updateModalPrice();
      }
    });
    DOM.sizeOptionsContainer.appendChild(label);
  });

  // 2. 渲染甜度選項
  state.selectedSugar = "微糖"; // 預設微糖
  DOM.sugarOptionsContainer.innerHTML = "";
  state.customOptions.sugars.forEach(sugar => {
    const label = document.createElement("label");
    label.className = "chip-label";
    label.innerHTML = `
      <input type="radio" name="modal_sugar" value="${sugar}" ${sugar === state.selectedSugar ? "checked" : ""}>
      <span class="chip-btn">${sugar}</span>
    `;
    label.querySelector("input").addEventListener("change", (e) => {
      if (e.target.checked) state.selectedSugar = sugar;
    });
    DOM.sugarOptionsContainer.appendChild(label);
  });

  // 3. 渲染冰量選項
  state.selectedIce = "微冰"; // 預設微冰
  DOM.iceOptionsContainer.innerHTML = "";
  state.customOptions.ices.forEach(ice => {
    const label = document.createElement("label");
    label.className = "chip-label";
    label.innerHTML = `
      <input type="radio" name="modal_ice" value="${ice}" ${ice === state.selectedIce ? "checked" : ""}>
      <span class="chip-btn">${ice}</span>
    `;
    label.querySelector("input").addEventListener("change", (e) => {
      if (e.target.checked) state.selectedIce = ice;
    });
    DOM.iceOptionsContainer.appendChild(label);
  });

  // 4. 渲染加料選項 (Checkbox 複選)
  DOM.toppingOptionsContainer.innerHTML = "";
  state.customOptions.toppings.forEach(top => {
    const label = document.createElement("label");
    label.className = "chip-label";
    label.innerHTML = `
      <input type="checkbox" name="modal_toppings" value="${top.name}">
      <span class="chip-btn">
        ${top.name} <span class="chip-price-badge">+${top.price}元</span>
      </span>
    `;
    label.querySelector("input").addEventListener("change", (e) => {
      if (e.target.checked) {
        state.selectedToppings.push(top);
      } else {
        state.selectedToppings = state.selectedToppings.filter(t => t.name !== top.name);
      }
      updateModalPrice();
    });
    DOM.toppingOptionsContainer.appendChild(label);
  });

  updateModalPrice();
  DOM.customModal.classList.add("active");
}

function closeCustomModal() {
  DOM.customModal.classList.remove("active");
  state.currentModalDrink = null;
}

function getBasePrice(drink, size) {
  if (size === "M" && drink.priceM !== null) return drink.priceM;
  if (size === "L" && drink.priceL !== null) return drink.priceL;
  return drink.priceL || drink.priceM || 0;
}

function updateModalPrice() {
  if (!state.currentModalDrink) return;
  const basePrice = getBasePrice(state.currentModalDrink, state.selectedSize);
  const toppingsPrice = state.selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const singleCupPrice = basePrice + toppingsPrice;
  const subtotal = singleCupPrice * state.currentQty;

  DOM.modalSubtotalPrice.textContent = `$${subtotal} (${singleCupPrice}元 / 杯)`;
}

// ==========================================
// 購物車清單管理
// ==========================================
function addToCart() {
  if (!state.currentModalDrink) return;

  const drink = state.currentModalDrink;
  const basePrice = getBasePrice(drink, state.selectedSize);
  const toppingsPrice = state.selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const unitPrice = basePrice + toppingsPrice;
  const subtotal = unitPrice * state.currentQty;
  const sizeName = state.selectedSize === "M" ? "中杯" : "大杯";

  const cartItem = {
    id: "item_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    name: drink.name,
    category: drink.category,
    size: sizeName,
    unitPrice: unitPrice,
    sugar: state.selectedSugar,
    ice: state.selectedIce,
    toppings: [...state.selectedToppings],
    quantity: state.currentQty,
    subtotal: subtotal
  };

  state.cart.push(cartItem);
  closeCustomModal();
  renderCart();
  showToast(`已將「${drink.name}」加入訂單！`, "success");
}

function removeFromCart(itemId) {
  state.cart = state.cart.filter(item => item.id !== itemId);
  renderCart();
}

function changeCartItemQty(itemId, delta) {
  const item = state.cart.find(i => i.id === itemId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(itemId);
  } else {
    item.subtotal = item.unitPrice * item.quantity;
    renderCart();
  }
}

function clearCart() {
  if (state.cart.length === 0) return;
  if (confirm("確定要清空目前訂單中的所有飲料嗎？")) {
    state.cart = [];
    renderCart();
    showToast("購物車已清空", "info");
  }
}

function renderCart() {
  if (state.cart.length === 0) {
    DOM.cartEmptyState.style.display = "block";
    DOM.cartItemsContainer.querySelectorAll(".cart-item").forEach(el => el.remove());
    DOM.totalCupsText.textContent = "0 杯";
    DOM.totalPriceText.textContent = "$0";
    DOM.btnSubmitOrder.disabled = true;
    DOM.btnClearCart.style.display = "none";
    return;
  }

  DOM.cartEmptyState.style.display = "none";
  DOM.btnClearCart.style.display = "block";

  let totalCups = 0;
  let totalPrice = 0;

  // 清除舊項目並重繪
  DOM.cartItemsContainer.querySelectorAll(".cart-item").forEach(el => el.remove());

  state.cart.forEach(item => {
    totalCups += item.quantity;
    totalPrice += item.subtotal;

    const toppingsText = item.toppings.length > 0
      ? `加料: ${item.toppings.map(t => `${t.name}(+${t.price})`).join("、")}`
      : "無加料";

    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <div class="cart-item-header">
        <div>
          <span class="cart-item-title">${escapeHtml(item.name)}</span>
          <span class="cart-item-size">${item.size}</span>
        </div>
        <button class="btn-remove-item" title="移除此品項">&times;</button>
      </div>
      <div class="cart-item-options">
        ${item.sugar} / ${item.ice} / ${toppingsText}
      </div>
      <div class="cart-item-footer">
        <div class="cart-item-qty">
          <button class="btn-qty-mini btn-minus" type="button">-</button>
          <span class="cart-qty-text">${item.quantity}</span>
          <button class="btn-qty-mini btn-plus" type="button">+</button>
        </div>
        <div class="cart-item-price">$${item.subtotal}</div>
      </div>
    `;

    itemEl.querySelector(".btn-remove-item").addEventListener("click", () => removeFromCart(item.id));
    itemEl.querySelector(".btn-minus").addEventListener("click", () => changeCartItemQty(item.id, -1));
    itemEl.querySelector(".btn-plus").addEventListener("click", () => changeCartItemQty(item.id, 1));

    DOM.cartItemsContainer.appendChild(itemEl);
  });

  DOM.totalCupsText.textContent = `${totalCups} 杯`;
  DOM.totalPriceText.textContent = `$${totalPrice}`;
  DOM.btnSubmitOrder.disabled = false;
}

// ==========================================
// 訂單送出 (Google Apps Script Web App 整合)
// ==========================================
async function submitOrder() {
  const name = DOM.customerName.value.trim();
  const phone = DOM.customerPhone.value.trim();
  const note = DOM.orderNote.value.trim();

  // 驗證基本欄位
  if (!name) {
    showToast("請填寫訂購人姓名！", "error");
    DOM.customerName.focus();
    return;
  }

  if (!phone) {
    showToast("請填寫聯絡電話！", "error");
    DOM.customerPhone.focus();
    return;
  }

  // 簡易電話格式檢查 (台灣市話或手機)
  const phoneRegex = /^0\d{8,10}$/;
  if (!phoneRegex.test(phone.replace(/[-\s]/g, ""))) {
    showToast("請輸入有效的手機或電話號碼 (例如: 0912345678)！", "error");
    DOM.customerPhone.focus();
    return;
  }

  if (state.cart.length === 0) {
    showToast("購物車內尚未加入任何飲品！", "error");
    return;
  }

  const totalPrice = state.cart.reduce((sum, i) => sum + i.subtotal, 0);

  // 格式化訂購內容摘要 (多行文字)
  const itemsSummary = state.cart.map((item, idx) => {
    const toppingsStr = item.toppings.length > 0
      ? ` + ${item.toppings.map(t => `${t.name}`).join("、")}`
      : "無加料";
    return `${idx + 1}. ${item.name}(${item.size}) / ${item.sugar} / ${item.ice} / ${toppingsStr} | $${item.unitPrice} x ${item.quantity}杯 = $${item.subtotal}元`;
  }).join("\n");

  const orderPayload = {
    name: name,
    phone: phone,
    note: note || "無",
    items: state.cart,
    itemsSummary: itemsSummary,
    totalPrice: totalPrice
  };

  // 進入送出狀態
  setSubmitLoading(true);

  try {
    /**
     * 注意：發送給 Google Apps Script Web App 時，
     * 使用 'text/plain;charset=utf-8' 能避免瀏覽器發出 CORS preflight OPTIONS 請求
     * 而 Apps Script 的 doPost(e) 會從 e.postData.contents 完整取得 JSON 字串！
     */
    const response = await fetch(state.scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(orderPayload)
    });

    const result = await response.json();

    if (result.status === "success") {
      openSuccessModal(result.orderId, result.timestamp, name, phone, totalPrice, itemsSummary);
      // 清空購物車與備註
      state.cart = [];
      DOM.orderNote.value = "";
      renderCart();
    } else {
      throw new Error(result.message || "試算表寫入失敗");
    }

  } catch (err) {
    console.error("訂單送出錯誤：", err);
    showToast(`傳送至 Google 試算表時發生錯誤：${err.message}`, "error");
  } finally {
    setSubmitLoading(false);
  }
}

function setSubmitLoading(isLoading) {
  if (isLoading) {
    DOM.btnSubmitOrder.disabled = true;
    DOM.btnSubmitOrder.innerHTML = `<span class="spinner"></span> <span>訂單寫入中...</span>`;
  } else {
    DOM.btnSubmitOrder.disabled = (state.cart.length === 0);
    DOM.btnSubmitOrder.innerHTML = `<span>確認送出訂單</span>`;
  }
}

// ==========================================
// 成功彈跳視窗
// ==========================================
function openSuccessModal(orderId, timestamp, name, phone, totalPrice, itemsSummary) {
  DOM.successOrderId.textContent = orderId || "ORD-0001";
  DOM.successTimestamp.textContent = timestamp || new Date().toLocaleString("zh-TW");
  DOM.successCustomerName.textContent = name;
  DOM.successCustomerPhone.textContent = phone;
  DOM.successTotalPrice.textContent = `$${totalPrice}`;
  DOM.successOrderItems.textContent = itemsSummary;

  DOM.successModal.classList.add("active");
}

function closeSuccessModal() {
  DOM.successModal.classList.remove("active");
}

// ==========================================
// 訊息提示 (Toast)
// ==========================================
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================
// 事件綁定 (Event Listeners)
// ==========================================
function bindEvents() {
  // 分類標籤點擊切換
  DOM.categoryTabs.addEventListener("click", (e) => {
    const tabBtn = e.target.closest(".tab-btn");
    if (!tabBtn) return;
    DOM.categoryTabs.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    tabBtn.classList.add("active");
    state.activeCategory = tabBtn.getAttribute("data-category");
    renderDrinks();
  });

  // 搜尋飲品即時過濾
  DOM.searchInput.addEventListener("input", (e) => {
    state.searchKeyword = e.target.value.trim();
    renderDrinks();
  });

  // 客製化視窗數量增減
  DOM.btnQtyMinus.addEventListener("click", () => {
    if (state.currentQty > 1) {
      state.currentQty--;
      DOM.inputItemQty.value = state.currentQty;
      updateModalPrice();
    }
  });

  DOM.btnQtyPlus.addEventListener("click", () => {
    state.currentQty++;
    DOM.inputItemQty.value = state.currentQty;
    updateModalPrice();
  });

  // 加入購物車按鈕
  DOM.btnConfirmAddToCart.addEventListener("click", addToCart);

  // 關閉客製化視窗
  DOM.btnCloseCustomModal.addEventListener("click", closeCustomModal);
  DOM.customModal.addEventListener("click", (e) => {
    if (e.target === DOM.customModal) closeCustomModal();
  });

  // 清空購物車
  DOM.btnClearCart.addEventListener("click", clearCart);

  // 送出訂單
  DOM.btnSubmitOrder.addEventListener("click", submitOrder);

  // 成功視窗關閉 / 再點一單
  DOM.btnCloseSuccessModal.addEventListener("click", closeSuccessModal);
  DOM.btnResetOrder.addEventListener("click", closeSuccessModal);
  DOM.successModal.addEventListener("click", (e) => {
    if (e.target === DOM.successModal) closeSuccessModal();
  });

  // ESC 鍵關閉所有開啟的彈窗
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCustomModal();
      closeSuccessModal();
    }
  });
}

// ==========================================
// 初始化應用
// ==========================================
function init() {
  bindEvents();
  renderCategoryTabs();
  renderDrinks();
  renderCart();
  loadCSVData();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
