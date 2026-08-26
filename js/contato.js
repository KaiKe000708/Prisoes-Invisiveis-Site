// ====================================================================
// FORMULÁRIO DE CONTATO
//
// Este site é só HTML/CSS/JS (sem servidor), então ele sozinho NÃO
// consegue enviar e-mails de verdade: alguém precisa "receber" a
// mensagem em algum lugar. A solução mais simples, sem precisar
// criar conta em nada, é abrir o e-mail do visitante já preenchido
// (mailto:), pronto pra ele clicar em enviar.
//
// >>> TROQUE O E-MAIL ABAIXO PELO SEU: <<<
const EMAIL_DESTINO = "seuemail@exemplo.com";
//
// Se um dia você quiser que a mensagem chegue direto na sua caixa de
// entrada sem o visitante precisar ter um programa de e-mail aberto,
// dá pra usar um serviço gratuito como o Formspree (formspree.io):
// você cria uma conta grátis, cola o link que ele te dá no lugar do
// "EMAIL_DESTINO" acima, e troca a função de envio abaixo por um
// simples fetch(). Aviso quando você quiser fazer essa troca.
// ====================================================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-contato");
  const status = document.getElementById("form-status");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    const assunto = encodeURIComponent(`Contato pelo site - ${nome}`);
    const corpo = encodeURIComponent(
      `Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${mensagem}`
    );

    window.location.href = `mailto:${EMAIL_DESTINO}?subject=${assunto}&body=${corpo}`;

    status.textContent = "Abrindo seu aplicativo de e-mail para enviar a mensagem...";
    status.classList.add("show");
  });
});
