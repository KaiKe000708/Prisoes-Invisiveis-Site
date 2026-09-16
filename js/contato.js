const FORMSPREE_ENDPOINT = "https://formspree.io/f/mppwagqo";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-contato");
  const status = document.getElementById("form-status");
  if (!form) return;

  const botao = form.querySelector("button[type=submit]");
  const textoOriginalBotao = botao ? botao.textContent : "";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    status.classList.remove("show", "form-status-erro");
    status.textContent = "Enviando sua mensagem...";
    status.classList.add("show");

    if (botao) {
      botao.disabled = true;
      botao.textContent = "Enviando...";
    }

    try {
      const resposta = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (resposta.ok) {
        status.textContent = "Mensagem enviada! Obrigado por entrar em contato, vamos responder em breve.";
        form.reset();
      } else {
        const dados = await resposta.json().catch(() => null);
        console.error("[contato] Formspree recusou o envio:", resposta.status, dados);
        throw new Error("Falha no envio (status " + resposta.status + ")");
      }
    } catch (erro) {
      console.error("[contato] erro ao enviar formulário:", erro);
      status.textContent = "Não foi possível enviar agora. Tente novamente em instantes, ou volte mais tarde.";
      status.classList.add("form-status-erro");
    } finally {
      if (botao) {
        botao.disabled = false;
        botao.textContent = textoOriginalBotao;
      }
    }
  });
});
