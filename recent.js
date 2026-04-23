// recent completed trades fetcher
// requires a public view `public_recent_trades` with anon select granted.

const COIN_LABEL = {
  ltc: "LTC", btc: "BTC", eth: "ETH", bnb: "BNB", pol: "POL", sol: "SOL",
  usdt_trc20: "USDT", usdc_eth: "USDC", usdt_eth: "USDT",
  usdc_bnb: "USDC", usdt_bnb: "USDT", usdc_pol: "USDC", usdt_pol: "USDT",
  usdc_sol: "USDC", usdt_sol: "USDT",
};

const COIN_ICON = {
  ltc: "cryptocurrency-color:ltc", btc: "cryptocurrency-color:btc",
  eth: "cryptocurrency-color:eth", bnb: "cryptocurrency-color:bnb",
  pol: "cryptocurrency-color:matic", sol: "cryptocurrency-color:sol",
  usdt_trc20: "cryptocurrency-color:usdt", usdc_eth: "cryptocurrency-color:usdc",
  usdt_eth: "cryptocurrency-color:usdt", usdc_bnb: "cryptocurrency-color:usdc",
  usdt_bnb: "cryptocurrency-color:usdt", usdc_pol: "cryptocurrency-color:usdc",
  usdt_pol: "cryptocurrency-color:usdt", usdc_sol: "cryptocurrency-color:usdc",
  usdt_sol: "cryptocurrency-color:usdt",
};

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

async function loadRecent() {
  const host = document.getElementById("recent-trades");
  if (!host) return;
  const { supabaseUrl, supabaseAnonKey } = window.SwapSafe;
  if (!supabaseAnonKey || supabaseAnonKey.startsWith("PASTE_")) {
    host.innerHTML = `<div class="text-xs text-zinc-600 text-center py-4">(not valid)</div>`;
    return;
  }

  const url = `${supabaseUrl}/rest/v1/public_recent_trades?order=created_at.desc&limit=8`;
  let rows = [];
  try {
    const res = await fetch(url, { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` } });
    rows = await res.json();
    if (!Array.isArray(rows)) rows = [];
  } catch { rows = []; }

  if (!rows.length) {
    host.innerHTML = `<div class="text-xs text-zinc-600 text-center py-4">no recent trades yet</div>`;
    return;
  }

  host.innerHTML = rows.map((t) => {
    const label = COIN_LABEL[t.coin] ?? t.coin.toUpperCase();
    const icon = COIN_ICON[t.coin] ?? "cryptocurrency-color:generic";
    const amt = Number(t.received_amount).toLocaleString(undefined, { maximumFractionDigits: 8 });
    return `
      <div class="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-[#111]/50 border border-white/[0.04]">
        <div class="flex items-center gap-3 min-w-0">
          <iconify-icon icon="${icon}" class="text-2xl flex-shrink-0"></iconify-icon>
          <div class="min-w-0">
            <div class="text-sm text-white font-medium truncate">${amt} ${label}</div>
            <div class="text-[11px] text-zinc-500">Trade #${t.id} - released</div>
          </div>
        </div>
        <div class="flex items-center gap-2 text-[11px] text-zinc-500 flex-shrink-0">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          ${timeAgo(t.created_at)}
        </div>
      </div>
    `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", loadRecent);
setInterval(loadRecent, 30_000);
