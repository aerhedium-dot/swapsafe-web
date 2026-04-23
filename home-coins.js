// compact coin row for the homepage - live coins only
const HOME_COINS = [
  { id: 'btc', cg: 'bitcoin', label: 'BTC', icon: 'cryptocurrency-color:btc' },
  { id: 'ltc', cg: 'litecoin', label: 'LTC', icon: 'cryptocurrency-color:ltc' },
  { id: 'eth', cg: 'ethereum', label: 'ETH', icon: 'cryptocurrency-color:eth' },
  { id: 'bnb', cg: 'binancecoin', label: 'BNB', icon: 'cryptocurrency-color:bnb' },
  { id: 'pol', cg: 'matic-network', label: 'POL', icon: 'cryptocurrency-color:matic' },
  { id: 'sol', cg: 'solana', label: 'SOL', icon: 'cryptocurrency-color:sol' },
];

const fmt = n => n >= 1 ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : n.toFixed(4);

async function fetchPrices() {
  const ids = HOME_COINS.map(c => c.cg).join(',');
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
    return res.ok ? await res.json() : {};
  } catch {
    return {};
  }
}

function render(prices) {
  const grid = document.getElementById('home-coins');
  if (!grid) return;
  grid.innerHTML = HOME_COINS.map(c => {
    const p = prices[c.cg];
    const price = p?.usd;
    const change = p?.usd_24h_change;
    const changeCls = change == null ? 'text-zinc-500' : change >= 0 ? 'text-emerald-400' : 'text-rose-400';
    const changeStr = change == null ? '' : `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;

    return `
      <a href="coins.html" class="p-4 rounded-xl border border-white/[0.06] bg-[#111]/50 hover:bg-[#111] hover:border-[#4f46e5]/40 transition-colors flex flex-col gap-2">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <iconify-icon icon="${c.icon}" class="text-xl flex-shrink-0"></iconify-icon>
            <span class="text-white font-medium text-sm truncate">${c.label}</span>
          </div>
          <span class="text-[11px] ${changeCls} flex-shrink-0">${changeStr}</span>
        </div>
        <span class="text-xs text-zinc-400">${price != null ? '$' + fmt(price) : '-'}</span>
      </a>
    `;
  }).join('');
}

(async () => {
  render({});
  const prices = await fetchPrices();
  render(prices);
  setInterval(async () => render(await fetchPrices()), 60_000);
})();
