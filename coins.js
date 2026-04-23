// supported coins shown on the site - keep in sync with src/coins/index.js
const COINS = [
  { id: 'btc', cg: 'bitcoin', label: 'BTC', network: 'Bitcoin', icon: 'cryptocurrency-color:btc', live: true },
  { id: 'ltc', cg: 'litecoin', label: 'LTC', network: 'Litecoin', icon: 'cryptocurrency-color:ltc', live: true },
  { id: 'sol', cg: 'solana', label: 'SOL', network: 'Solana', icon: 'cryptocurrency-color:sol', live: false },
  { id: 'eth', cg: 'ethereum', label: 'ETH', network: 'Ethereum', icon: 'cryptocurrency-color:eth', live: true },
  { id: 'bnb', cg: 'binancecoin', label: 'BNB', network: 'BNB Smart Chain', icon: 'cryptocurrency-color:bnb', live: true },
  { id: 'pol', cg: 'matic-network', label: 'POL', network: 'Polygon', icon: 'cryptocurrency-color:matic', live: true },
  { id: 'usdc', cg: 'usd-coin', label: 'USDC', network: 'Ethereum (ERC20)', icon: 'cryptocurrency-color:usdc', live: false },
  { id: 'usdt_trc20', cg: 'tether', label: 'USDT', network: 'Tron (TRC20)', icon: 'cryptocurrency-color:usdt', live: false },
  { id: 'usdt_eth', cg: 'tether', label: 'USDT', network: 'Ethereum (ERC20)', icon: 'cryptocurrency-color:usdt', live: false },
  { id: 'usdc_sol', cg: 'usd-coin', label: 'USDC', network: 'Solana', icon: 'cryptocurrency-color:usdc', live: false },
  { id: 'usdt_sol', cg: 'tether', label: 'USDT', network: 'Solana', icon: 'cryptocurrency-color:usdt', live: false },
  { id: 'usdc_bnb', cg: 'usd-coin', label: 'USDC', network: 'BNB Smart Chain', icon: 'cryptocurrency-color:usdc', live: false },
  { id: 'usdt_bnb', cg: 'tether', label: 'USDT', network: 'BNB Smart Chain', icon: 'cryptocurrency-color:usdt', live: false },
  { id: 'usdc_pol', cg: 'usd-coin', label: 'USDC', network: 'Polygon', icon: 'cryptocurrency-color:usdc', live: false },
  { id: 'usdt_pol', cg: 'tether', label: 'USDT', network: 'Polygon', icon: 'cryptocurrency-color:usdt', live: false },
];

const fmt = n => n >= 1 ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : n.toFixed(4);

async function fetchPrices() {
  const ids = [...new Set(COINS.map(c => c.cg))].join(',');
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
    return res.ok ? await res.json() : {};
  } catch {
    return {};
  }
}

function render(prices) {
  const grid = document.getElementById('coins');
  grid.innerHTML = COINS.map(c => {
    const p = prices[c.cg];
    const price = p?.usd;
    const change = p?.usd_24h_change;
    const changeCls = change == null ? 'text-zinc-500' : change >= 0 ? 'text-emerald-400' : 'text-rose-400';
    const changeStr = change == null ? '' : `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
    const badge = c.live
      ? '<span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">live</span>'
      : '<span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">soon</span>';

    return `
      <div class="rounded-xl border border-white/[0.06] bg-[#111]/50 p-4 flex flex-col gap-3 hover:bg-[#111] transition-colors">
        <div class="flex items-center justify-between">
          <iconify-icon icon="${c.icon}" class="text-3xl"></iconify-icon>
          ${badge}
        </div>
        <div>
          <div class="text-white font-medium text-sm">${c.label}</div>
          <div class="text-xs text-zinc-500">${c.network}</div>
        </div>
        <div class="flex items-baseline justify-between border-t border-white/[0.06] pt-3">
          <span class="text-white font-semibold text-sm">${price != null ? '$' + fmt(price) : '-'}</span>
          <span class="text-[11px] ${changeCls}">${changeStr}</span>
        </div>
      </div>
    `;
  }).join('');
}

(async () => {
  render({});
  const prices = await fetchPrices();
  render(prices);
  setInterval(async () => render(await fetchPrices()), 60_000);
})();
