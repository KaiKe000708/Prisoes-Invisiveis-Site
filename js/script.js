// 🌧️ Chuva animada no canvas (com profundidade, vento e respingo)
const canvas = document.getElementById("rain-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const WIND = 0.35; // inclinação sutil da chuva (vento)

function makeDrop() {
  const depth = Math.random(); // 0 = longe (fundo), 1 = perto (frente)
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    depth,
    length: 6 + depth * 16,
    speed: 1 + depth * 2.6,
    width: 0.5 + depth * 1,
    opacity: 0.05 + depth * 0.2,
  };
}

const drops = Array.from({ length: 110 }, makeDrop);
const splashes = [];

function drawRain() {
  // Em vez de limpar tudo, deixa um rastro sutil (motion blur), mais realista
  ctx.fillStyle = "rgba(8, 8, 10, 0.28)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const drop of drops) {
    ctx.strokeStyle = `rgba(210, 225, 255, ${drop.opacity})`;
    ctx.lineWidth = drop.width;
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x + WIND * drop.depth * 4, drop.y + drop.length);
    ctx.stroke();
  }

  for (let i = splashes.length - 1; i >= 0; i--) {
    const s = splashes[i];
    ctx.strokeStyle = `rgba(210, 225, 255, ${s.life * 0.35})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(s.x, s.y, s.radius, s.radius * 0.35, 0, 0, Math.PI * 2);
    ctx.stroke();
    s.radius += 0.6;
    s.life -= 0.06;
    if (s.life <= 0) splashes.splice(i, 1);
  }
}

function updateRain() {
  for (const drop of drops) {
    drop.x += WIND * drop.depth * 0.5;
    drop.y += drop.speed;

    if (drop.y > canvas.height) {
      // Respingo ocasional só para as gotas mais próximas (mais visíveis)
      if (drop.depth > 0.6 && Math.random() < 0.3) {
        splashes.push({ x: drop.x, y: canvas.height - 2, radius: 1, life: 1 });
      }
      Object.assign(drop, makeDrop(), { y: Math.random() * -40, x: Math.random() * canvas.width });
    }
    if (drop.x > canvas.width) drop.x = 0;
  }
}

function animateRain() {
  drawRain();
  updateRain();
  requestAnimationFrame(animateRain);
}
animateRain();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// 🌫️ Efeito fade-in ao rolar
const faders = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.1 });

faders.forEach(el => observer.observe(el));

// 🔢 Contagem animada dos números da seção "Brasil em números"
const countEls = document.querySelectorAll(".stat-count");
if (countEls.length) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
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
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out
        const value = (target * eased).toFixed(decimals).replace(".", ",");
        el.textContent = `${prefix}${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.4 });

  countEls.forEach(el => countObserver.observe(el));
}


// ⌨️ Frases digitadas
const frasesDigitadas = [
  "Às vezes, estar em silêncio é o único jeito de gritar.",
  "O vazio grita mais alto que mil vozes.",
  "Ser forte é não desistir, mesmo quando não se quer continuar.",
  "A alma cansa antes do corpo.",
  "O tempo não cura tudo, só ensina a conviver com a dor.",
  "Às vezes, ser forte é só continuar respirando.",
  "Nem todo mundo que sorri está vivo por dentro.",
  "A alma grita o que a boca cala.",
  "A esperança dói mais quando ela não morre.",
  "Liberdade é poder sentir tudo, até o que machuca."
];

let textoIndex = 0;
let letraIndex = 0;
let typingTimeout;

function digitarFrase() {
  const textoEl = document.getElementById("texto-digitando");
  if (!textoEl) return;

  const frase = frasesDigitadas[textoIndex];

  if (letraIndex === 0) textoEl.textContent = "";

  if (letraIndex < frase.length) {
    textoEl.textContent += frase.charAt(letraIndex);
    letraIndex++;
    typingTimeout = setTimeout(digitarFrase, 80);
  } else {
    setTimeout(() => {
      letraIndex = 0;
      textoIndex = (textoIndex + 1) % frasesDigitadas.length;
      digitarFrase();
    }, 4000);
  }
}
digitarFrase();

// ♿ Acessibilidade do submenu "Causas": abre também com Tab + Enter,
// não só com mouse, e mantém aria-expanded sincronizado pra leitores de tela.
const causasToggle = document.getElementById("causas-toggle");
const causasItem = causasToggle ? causasToggle.closest(".has-submenu") : null;

if (causasToggle && causasItem) {
  function abrirSubmenu(estado) {
    const aberto = estado !== undefined ? estado : !causasItem.classList.contains("open");
    causasItem.classList.toggle("open", aberto);
    causasToggle.setAttribute("aria-expanded", String(aberto));
  }

  causasToggle.addEventListener("click", (e) => {
    e.preventDefault();
    abrirSubmenu();
  });

  causasToggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrirSubmenu();
    }
    if (e.key === "Escape") {
      abrirSubmenu(false);
      causasToggle.blur();
    }
  });

  // Fecha se o foco/clique sair do menu de "Causas"
  document.addEventListener("click", (e) => {
    if (!causasItem.contains(e.target)) abrirSubmenu(false);
  });

  causasItem.addEventListener("focusout", (e) => {
    if (!causasItem.contains(e.relatedTarget)) abrirSubmenu(false);
  });
}

// ✨ Spotlight que segue o mouse no bloco de destaque (CTA)
const ctaSection = document.querySelector(".cta-section");
if (ctaSection) {
  ctaSection.addEventListener("mousemove", (e) => {
    const rect = ctaSection.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ctaSection.style.setProperty("--x", `${x}%`);
    ctaSection.style.setProperty("--y", `${y}%`);
  });
}
