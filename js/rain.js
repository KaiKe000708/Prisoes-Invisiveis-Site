// 🌧️ Chuva animada no canvas (com profundidade, vento e respingo)
// Extraído de script.js para ser reaproveitado em outras páginas (ex: 404).
(function () {
  const canvas = document.getElementById("rain-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const WIND = 0.35;

  function makeDrop() {
    const depth = Math.random();
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
})();
