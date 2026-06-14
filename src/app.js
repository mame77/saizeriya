const userInfo = document.getElementById("userInfo");
const userNameDisplay = document.getElementById("userNameDisplay");
const excludedBadge = document.getElementById("excludedBadge");
const editSettingsBtn = document.getElementById("editSettingsBtn");
const overlay = document.getElementById("settingsOverlay");
const nameInput = document.getElementById("nameInput");
const itemSearch = document.getElementById("itemSearch");
const searchResults = document.getElementById("searchResults");
const excludedTags = document.getElementById("excludedTags");
const saveBtn = document.getElementById("saveSettingsBtn");
const gachaBtn = document.getElementById("gachaBtn");
const gachaMachine = document.getElementById("gachaMachine");
const resultEl = document.getElementById("result");
const resultItems = document.getElementById("resultItems");
const totalDisplay = document.getElementById("totalDisplay");
const summaryText = document.getElementById("summaryText");

let alcoholOn = false;
let currentSettings = loadSettings();
let excludedCodes = new Set(currentSettings ? currentSettings.excludedCodes : []);

itemSearch.addEventListener("input", () => updateSearchResults(itemSearch.value));
itemSearch.addEventListener("blur", () => setTimeout(() => searchResults.classList.remove("show"), 200));
itemSearch.addEventListener("focus", () => { if (itemSearch.value.trim()) updateSearchResults(itemSearch.value); });

saveBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (!name) { nameInput.focus(); return; }
  const settings = { name, excludedCodes: Array.from(excludedCodes) };
  saveSettings(settings);
  currentSettings = settings;
  closeSettings();
  renderUserInfo(settings);
});

editSettingsBtn.addEventListener("click", openSettings);

document.getElementById("noAlcohol").addEventListener("click", () => {
  alcoholOn = false;
  document.getElementById("noAlcohol").classList.add("active");
  document.getElementById("yesAlcohol").classList.remove("active");
});

document.getElementById("yesAlcohol").addEventListener("click", () => {
  alcoholOn = true;
  document.getElementById("yesAlcohol").classList.add("active");
  document.getElementById("noAlcohol").classList.remove("active");
});

gachaBtn.addEventListener("click", () => {
  gachaBtn.disabled = true;
  gachaMachine.classList.add("spinning");
  resultEl.classList.remove("show");

  setTimeout(() => {
    const excludedSet = currentSettings ? new Set(currentSettings.excludedCodes) : new Set();
    const { selected, total } = drawGacha(alcoholOn, excludedSet);

    gachaMachine.classList.remove("spinning");
    gachaBtn.disabled = false;

    resultItems.innerHTML = "";
    totalDisplay.textContent = "\u00a5" + total;

    if (selected.length === 0) {
      resultItems.innerHTML = '<div class="item-empty">該当するメニューがありません<br>除外設定を見直してください</div>';
      summaryText.textContent = "";
    } else {
      selected.forEach((item, i) => {
        const div = document.createElement("div");
        div.className = "result-item";
        div.innerHTML = `
          <span class="item-code">${item.code}</span>
          <span class="item-cat">${item.cat}</span>
          <span class="item-name">${item.name}</span>
          <span class="item-price">\u00a5${item.price}</span>
        `;
        resultItems.appendChild(div);
        setTimeout(() => div.classList.add("show"), i * 100);
      });

      const leftover = 1000 - total;
      if (leftover > 0) {
        summaryText.textContent = leftover + "円お釣りです。サイゼリヤでお得にランチ\u266a";
      } else {
        summaryText.textContent = "ピッタリ1000円！完璧な組み合わせ！";
      }
    }

    resultEl.classList.add("show");
  }, 1800);
});

if (currentSettings && currentSettings.name) {
  renderUserInfo(currentSettings);
} else {
  openSettings();
}
