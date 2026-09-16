console.log("Página depressão carregada.");

function initTransition() {
  const video = document.getElementById('intro-video');
  const content = document.getElementById('main-content');
  const overlay = document.getElementById('background-overlay');
  const scrollCue = document.querySelector('.dep-scroll-cue');

  // Botão de voltar (criado dinamicamente)
  const backButton = document.createElement('a');
  backButton.href = "../index.html";
  backButton.classList.add('btn-voltar');
  backButton.textContent = "Voltar para o Início";
  document.body.appendChild(backButton);

  // Usa a mesma animação de saída padrão do site (css/transitions.css)
  backButton.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(() => {
      window.location.href = backButton.href;
    }, 500);
  });

  // ===================================================
  // 🔘 Navegação lateral: destaca a bolinha da seção visível
  // ===================================================
  const chapterLinks = document.querySelectorAll('.dep-chapter-nav a');
  const chapterSections = Array.from(chapterLinks).map((link) =>
    document.querySelector(link.getAttribute('href'))
  );
  if (chapterLinks.length) {
    const chapterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = chapterSections.indexOf(entry.target);
        chapterLinks.forEach((l) => l.classList.remove('active'));
        if (index >= 0) chapterLinks[index].classList.add('active');
      });
    }, { threshold: 0.4 });
    chapterSections.forEach((section) => {
      if (section) chapterObserver.observe(section);
    });
  }

  // ===================================================
  // 📊 Gráfico "então x agora": cresce e conta ao entrar na tela
  // ===================================================
  const chartWrap = document.querySelector('.dep-chart-wrap');
  if (chartWrap) {
    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('grown');

        entry.target.querySelectorAll('.dep-bar-value').forEach((el) => {
          const target = parseInt(el.dataset.countTo, 10);
          const duration = 1600;
          const start = performance.now();
          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased).toLocaleString('pt-BR');
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });

        chartObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    chartObserver.observe(chartWrap);
  }

  // ===================================================
  // 🌫️ Poeira flutuando bem devagar sobre o vídeo
  // ===================================================
  const dustCanvas = document.getElementById('dust-canvas');
  if (dustCanvas) {
    const dctx = dustCanvas.getContext('2d');
    function resizeDust() {
      dustCanvas.width = window.innerWidth;
      dustCanvas.height = window.innerHeight;
    }
    resizeDust();
    window.addEventListener('resize', resizeDust);

    const dustParticles = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 0.5 + Math.random() * 1.6,
      speedY: 0.05 + Math.random() * 0.12,
      driftX: (Math.random() - 0.5) * 0.06,
      opacity: 0.08 + Math.random() * 0.18
    }));

    function drawDust() {
      dctx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
      dustParticles.forEach(p => {
        dctx.beginPath();
        dctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        dctx.fillStyle = `rgba(220, 220, 225, ${p.opacity})`;
        dctx.fill();
        p.y -= p.speedY;
        p.x += p.driftX;
        if (p.y < -10) { p.y = dustCanvas.height + 10; p.x = Math.random() * dustCanvas.width; }
      });
      requestAnimationFrame(drawDust);
    }
    drawDust();
  }

  if (!video) return;

  // IMPORTANTE: o arquivo de vídeo desaparece em preto sozinho a partir de
  // ~5.2s (bem antes do fim técnico do arquivo, em 8.5s). Por isso o
  // congelamento usa um ponto FIXO no tempo (e não "duração - margem"),
  // escolhido visualmente por ser onde os estilhaços aparecem bem visíveis,
  // iluminados, e ainda antes do fade para preto começar.
  const FREEZE_AT = 4.3;
  // Quantos segundos antes do congelamento a câmera lenta começa
  const SLOWDOWN_WINDOW = 1.5;
  // Velocidade mínima logo antes de congelar (não chega a zero, fica um "quase parado")
  const MIN_RATE = 0.12;

  const slowStart = Math.max(FREEZE_AT - SLOWDOWN_WINDOW, 0);
  let frozen = false;

  function freezeNow(reason) {
    if (frozen) return;
    frozen = true;
    video.playbackRate = 1;
    video.pause();
    try { video.currentTime = FREEZE_AT; } catch (err) { /* navegador pode bloquear antes do vídeo carregar totalmente */ }
    console.log("[depressão] vídeo congelado (" + reason + ") em", video.currentTime);

    // Mostra a dica de rolar a página
    if (scrollCue) scrollCue.classList.add('show');
  }

  // Texto e atmosfera entram junto com o zoom de entrada do vídeo (3s)
  setTimeout(() => {
    if (content) content.classList.add('show');
    if (overlay) overlay.classList.add('show');
  }, 100);

  // Acompanha o vídeo quadro a quadro (mais preciso que "timeupdate")
  function tick() {
    if (frozen) return;

    if (video.currentTime >= FREEZE_AT) {
      freezeNow("requestAnimationFrame");
      return;
    }

    if (video.currentTime >= slowStart) {
      const progress = (video.currentTime - slowStart) / (FREEZE_AT - slowStart);
      const eased = progress * progress;
      video.playbackRate = Math.max(1 - eased * (1 - MIN_RATE), MIN_RATE);
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Rede de segurança: garante o congelamento mesmo se o requestAnimationFrame
  // for pausado pelo navegador (ex: aba em segundo plano) ou o vídeo, por
  // qualquer motivo, ultrapassar o ponto de congelamento.
  video.addEventListener('ended', () => freezeNow("evento ended"));
  setTimeout(() => freezeNow("cronômetro de segurança"), (FREEZE_AT + SLOWDOWN_WINDOW + 1) * 1000);

  video.play().catch((err) => {
    console.warn("[depressão] o navegador bloqueou o autoplay:", err);
  });
}

window.addEventListener('DOMContentLoaded', initTransition);
