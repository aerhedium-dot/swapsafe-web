// Shared constants for all TRXST pages.
window.TRXST = {
  discordInvite: "https://discord.gg/SBhJwyuedn",
  currentYear: new Date().getFullYear(),
};

// Highlight the active nav link based on the page's data-page attribute.
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((el) => {
    if (el.dataset.nav === page) {
      el.classList.remove("text-zinc-500", "hover:text-zinc-300");
      el.classList.add("text-white");
    } else {
      el.classList.remove("text-white");
      el.classList.add("text-zinc-500", "hover:text-zinc-300");
    }
  });

  // Wire up any element with [data-discord] to open the invite.
  document.querySelectorAll("[data-discord]").forEach((el) => {
    el.setAttribute("href", window.TRXST.discordInvite);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });

  const yr = document.getElementById("year");
  if (yr) yr.textContent = window.TRXST.currentYear;
});
