window.SwapSafe = {
  discordInvite: "https://discord.gg/SBhJwyuedn",
  currentYear: new Date().getFullYear(),
  supabaseUrl: "https://dxqjwrepjxjmygsdsyvy.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cWp3cmVwanhqbXlnc2RzeXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzQyMjksImV4cCI6MjA5MjQ1MDIyOX0.s4PKpWoqv3AYy01z34b0WhNVCRY8XKAmIvCKFQojLRs",
};

// highlight
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

  // wire up any element with [data-discord]
  document.querySelectorAll("[data-discord]").forEach((el) => {
    el.setAttribute("href", window.SwapSafe.discordInvite);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });

  const yr = document.getElementById("year");
  if (yr) yr.textContent = window.SwapSafe.currentYear;

  // fade-in on scroll for anything marked [data-reveal]
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("reveal-in");
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });
  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
});
