function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function drawGacha(allowAlcohol, excludedCodeSet) {
  const budget = 1000;
  let pool = menu.filter(item => {
    if (item.price > budget) return false;
    if (excludedCodeSet && excludedCodeSet.has(item.code)) return false;
    if (!allowAlcohol && item.alcohol) return false;
    return true;
  });

  if (pool.length === 0) return { selected: [], total: 0 };

  const selected = [];
  const usedCodes = new Set();
  let remaining = budget;
  let available = shuffle([...pool]);

  const maxMain = 2 + Math.floor(Math.random() * 4);
  for (let i = 0; i < maxMain && available.length > 0; i++) {
    const affordable = available.filter(item => item.price <= remaining && !usedCodes.has(item.code));
    if (affordable.length === 0) break;
    const item = affordable[Math.floor(Math.random() * affordable.length)];
    selected.push(item);
    usedCodes.add(item.code);
    remaining -= item.price;
    available = available.filter(it => it.code !== item.code);
  }

  if (remaining >= 91) {
    const affordableFill = pool.filter(item => item.price <= Math.min(remaining, 200) && !usedCodes.has(item.code));
    const maxFill = Math.min(affordableFill.length, Math.floor(Math.random() * 3) + 1);
    for (let i = 0; i < maxFill && remaining >= 91; i++) {
      const candidates = affordableFill.filter(item => item.price <= remaining && !usedCodes.has(item.code));
      if (candidates.length === 0) break;
      if (Math.random() < 0.35) break;
      const item = candidates[Math.floor(Math.random() * candidates.length)];
      selected.push(item);
      usedCodes.add(item.code);
      remaining -= item.price;
    }
  }

  return { selected, total: budget - remaining };
}
