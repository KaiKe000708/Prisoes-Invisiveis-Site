document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("foto-lightbox");
  const lightboxImg = document.getElementById("foto-lightbox-img");
  const closeBtn = document.getElementById("foto-lightbox-close");
  const frames = document.querySelectorAll(".foto-frame img");

  if (!lightbox || !lightboxImg || !frames.length) return;

  function abrir(img) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function fechar() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  }

  frames.forEach((img) => {
    img.addEventListener("click", () => abrir(img));
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target === lightboxImg) fechar();
  });

  closeBtn.addEventListener("click", fechar);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fechar();
  });
});
