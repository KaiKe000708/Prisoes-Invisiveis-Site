/* =======================================================
   TRANSIÇÃO PADRÃO DE PÁGINA (entrada e saída)
   Inclua este arquivo em TODAS as páginas, sempre depois
   do <body>. Ele cuida sozinho da animação de saída ao
   clicar em qualquer link interno do site.
======================================================= */
(function () {
  var DURATION = 500; // precisa bater com --page-transition-duration (em ms)

  document.querySelectorAll("a[href]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = this.getAttribute("href");

      // Ignora âncoras (#), links vazios, links externos e novas abas
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        this.target === "_blank"
      ) {
        return;
      }

      e.preventDefault();
      document.body.classList.add("page-exit");

      setTimeout(function () {
        window.location.href = href;
      }, DURATION);
    });
  });

  // Se o usuário voltar pelo histórico do navegador (bfcache),
  // garante que a página não fique "presa" na animação de saída.
  window.addEventListener("pageshow", function () {
    document.body.classList.remove("page-exit");
  });

  // Destaca o link do menu correspondente à página atual
  var here = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu a[href]").forEach(function (link) {
    var linkFile = link.getAttribute("href").split("/").pop();
    if (linkFile === here) {
      link.classList.add("active");
    }
  });

  // Barra de progresso de leitura no topo da página
  var progressBar = document.createElement("div");
  progressBar.id = "scroll-progress";
  document.body.appendChild(progressBar);
  window.addEventListener("scroll", function () {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
  }, { passive: true });

  // 🎴 Efeito 3D sutil nos cards ao mover o mouse por cima (tilt)
  var tiltCards = document.querySelectorAll(".info-card, .topic-card, .stat-card, .feature-card, .dep-card, .dep-help-item, .vic-chip, .vic-cycle-step, .vic-cost-card");
  tiltCards.forEach(function (card) {
    card.style.transformStyle = "preserve-3d";
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = "perspective(700px) rotateX(" + (-py * 8) + "deg) rotateY(" + (px * 8) + "deg) scale(1.02)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });

  // ✨ Entrada escalonada dos cards ao rolarem para a tela (um pouco depois do outro)
  var cardGroups = document.querySelectorAll(".info-cards, .stats-grid, .topics-grid, .timeline, .feature-grid, .dep-cards, .dep-numbers-grid, .dep-help-box, .vic-chips, .vic-cycle, .vic-cost-grid");
  cardGroups.forEach(function (group) {
    var cards = group.children;
    Array.prototype.forEach.call(cards, function (card, i) {
      card.style.opacity = "0";
      card.style.transform = (card.style.transform || "") + " translateY(24px)";
      card.style.transition = "opacity 0.6s ease " + (i * 0.1) + "s, transform 0.6s ease " + (i * 0.1) + "s";
    });
    var groupObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          Array.prototype.forEach.call(entry.target.children, function (card) {
            card.style.opacity = "1";
            card.style.transform = card.style.transform.replace("translateY(24px)", "translateY(0)");
          });
          groupObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    groupObserver.observe(group);
  });
  // 🎬 Revela os títulos de seção com efeito de cortina ao rolar
  var headings = document.querySelectorAll(".page-content h2, .dep-page h2, main h2");
  if (headings.length) {
    headings.forEach(function (h) { h.classList.add("reveal-heading"); });
    var headingObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          headingObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    headings.forEach(function (h) { headingObserver.observe(h); });
  }
})();
