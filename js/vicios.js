document.addEventListener("DOMContentLoaded", () => {
  // 🔢 Conta os números dos chips e da calculadora de gastos quando entram na tela
  const countEls = document.querySelectorAll(".vic-chip-value[data-count-to], .vic-cost-value[data-count-to]");
  if (countEls.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.countTo);
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        const duration = 1400;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = (target * eased).toLocaleString("pt-BR", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          });
          el.textContent = `${prefix}${value}${suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    countEls.forEach((el) => countObserver.observe(el));
  }
});
