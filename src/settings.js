const STORAGE_KEY = "saizeriya_gacha";

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function openSettings() {
  const settings = loadSettings() || { name: "", excludedCodes: [] };
  nameInput.value = settings.name;
  excludedCodes = new Set(settings.excludedCodes);
  renderExcludedTags();
  overlay.style.display = "flex";
  itemSearch.value = "";
  searchResults.classList.remove("show");
  searchResults.innerHTML = "";
}

function closeSettings() {
  overlay.style.display = "none";
}

function renderExcludedTags() {
  const items = menu.filter(m => excludedCodes.has(m.code));
  if (items.length === 0) {
    excludedTags.innerHTML = '<span style="color:#aaa;font-size:13px">まだ追加されていません</span>';
    return;
  }
  excludedTags.innerHTML = items.map(item => `
    <span class="tag tag-excluded">
      ${item.name}
      <button class="tag-del" data-code="${item.code}">&times;</button>
    </span>
  `).join("");
  excludedTags.querySelectorAll(".tag-del").forEach(btn => {
    btn.addEventListener("click", () => {
      excludedCodes.delete(btn.dataset.code);
      renderExcludedTags();
    });
  });
}

function updateSearchResults(query) {
  if (!query.trim()) {
    searchResults.classList.remove("show");
    return;
  }
  const q = query.trim().toLowerCase();
  const matches = menu.filter(item =>
    item.name.toLowerCase().includes(q) && !excludedCodes.has(item.code)
  );
  if (matches.length === 0) {
    searchResults.innerHTML = '<div class="sr-empty">該当するメニューがありません</div>';
    searchResults.classList.add("show");
    return;
  }
  searchResults.innerHTML = matches.map(item => `
    <div class="sr-item" data-code="${item.code}">
      <span>${item.name}</span>
      <span class="sr-code">${item.cat} ¥${item.price}</span>
    </div>
  `).join("");
  searchResults.classList.add("show");
  searchResults.querySelectorAll(".sr-item").forEach(el => {
    el.addEventListener("click", () => {
      excludedCodes.add(el.dataset.code);
      renderExcludedTags();
      itemSearch.value = "";
      searchResults.classList.remove("show");
      searchResults.innerHTML = "";
    });
  });
}

function renderUserInfo(settings) {
  if (!settings || !settings.name) {
    userInfo.style.display = "none";
    return;
  }
  userInfo.style.display = "flex";
  userNameDisplay.textContent = settings.name + " さん";
  const count = (settings.excludedCodes || []).length;
  excludedBadge.textContent = count > 0 ? "除外中 " + count + "品" : "";
}
