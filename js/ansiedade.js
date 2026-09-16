document.addEventListener("DOMContentLoaded", () => {
  const circle = document.getElementById("breath-circle");
  const text = document.getElementById("breath-text");
  if (!circle || !text) return;

  let running = false;
  let timeoutId = null;
  const STEP_MS = 4000; // cada fase da respiração quadrada dura 4 segundos

  const steps = [
    { label: "Inspire...", cls: "inhale" },
    { label: "Segure...", cls: "inhale" },
    { label: "Expire...", cls: "exhale" },
    { label: "Segure...", cls: "exhale" },
  ];
  let stepIndex = 0;

  function runStep() {
    if (!running) return;
    const step = steps[stepIndex % steps.length];
    text.textContent = step.label;
    circle.classList.remove("inhale", "exhale");
    // força o navegador a "perceber" a remoção antes de reaplicar a classe,
    // garantindo que a transição rode toda vez, mesmo repetindo a mesma fase
    void circle.offsetWidth;
    circle.classList.add(step.cls);
    stepIndex++;
    timeoutId = setTimeout(runStep, STEP_MS);
  }

  function start() {
    running = true;
    stepIndex = 0;
    runStep();
  }

  function stop() {
    running = false;
    clearTimeout(timeoutId);
    circle.classList.remove("inhale", "exhale");
    text.textContent = "Toque para começar";
  }

  circle.addEventListener("click", () => {
    if (running) {
      stop();
    } else {
      start();
    }
  });
});
