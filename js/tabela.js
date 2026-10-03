document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("tabela-corpo");
  const searchInput = document.getElementById("tabela-busca");
  const contador = document.getElementById("tabela-contador");
  const headers = document.querySelectorAll(".tabela-causas thead th");
  const chips = document.querySelectorAll(".tabela-filtro-chip");
  if (!tbody) return;

  let filtroNivel = "todos";

  // ------------------------------------------------------------------
  // 1) Busca os dados da tabela num JSON local (fetch real, sem servidor)
  // ------------------------------------------------------------------
  fetch("../json/dados.json")
    .then((res) => {
      if (!res.ok) throw new Error("Resposta não OK: " + res.status);
      return res.json();
    })
    .then((dados) => {
      renderRows(dados);
      atualizarContador(dados.length, dados.length);
      initSearch();
      initFiltroChips();
      initSort();
    })
    .catch((err) => {
      console.error("[tabela] erro ao carregar dados.json:", err);
      tbody.innerHTML = `<tr><td colspan="5">Não foi possível carregar os dados agora. Tente recarregar a página.</td></tr>`;
    });

  function renderRows(dados) {
    tbody.innerHTML = "";
    dados.forEach((item) => {
      const tr = document.createElement("tr");
      tr.dataset.nivel = item.nivelClasse;
      tr.innerHTML = `
        <td data-label="Condição"><strong>${item.condicao}</strong></td>
        <td data-label="Principais Causas">${item.causas}</td>
        <td data-label="Sinais de Alerta">${item.sinais}</td>
        <td data-label="Prevalência no Brasil">${item.prevalencia}</td>
        <td data-label="Nível de Atenção"><span class="nivel nivel-${item.nivelClasse}">${item.nivel}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function atualizarContador(visiveis, total) {
    if (!contador) return;
    contador.textContent =
      visiveis === total
        ? `Mostrando todas as ${total} condições.`
        : `Mostrando ${visiveis} de ${total} condições.`;
  }

  // ------------------------------------------------------------------
  // 2) Filtro combinado: busca por texto + chip de nível de atenção.
  //    Os dois trabalham juntos (uma linha só aparece se bater nos dois).
  // ------------------------------------------------------------------
  function aplicarFiltros() {
    const termo = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const linhas = tbody.querySelectorAll("tr:not(.tabela-vazia)");
    const total = linhas.length;
    let visiveis = 0;

    linhas.forEach((linha) => {
      const bateTexto = linha.textContent.toLowerCase().includes(termo);
      const bateNivel = filtroNivel === "todos" || linha.dataset.nivel === filtroNivel;
      const bate = bateTexto && bateNivel;
      linha.style.display = bate ? "" : "none";
      if (bate) visiveis++;
    });

    toggleEmptyState(visiveis === 0 && total > 0);
    atualizarContador(visiveis, total);
  }

  function initSearch() {
    if (!searchInput) return;
    searchInput.addEventListener("input", aplicarFiltros);
  }

  function initFiltroChips() {
    if (!chips.length) return;
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        filtroNivel = chip.dataset.filtro;
        aplicarFiltros();
      });
    });
  }

  function toggleEmptyState(vazio) {
    let linhaVazia = tbody.querySelector(".tabela-vazia");
    if (vazio) {
      if (!linhaVazia) {
        linhaVazia = document.createElement("tr");
        linhaVazia.className = "tabela-vazia";
        linhaVazia.innerHTML = `<td colspan="5">Nenhum resultado encontrado para esse filtro.</td>`;
        tbody.appendChild(linhaVazia);
      }
    } else if (linhaVazia) {
      linhaVazia.remove();
    }
  }

  // ------------------------------------------------------------------
  // 3) Ordenar clicando no cabeçalho da coluna (com indicador visual e
  //    suporte a teclado, já que os <th> viram "botões" navegáveis)
  // ------------------------------------------------------------------
  function initSort() {
    let estado = { indice: -1, crescente: true };

    headers.forEach((th, indice) => {
      th.setAttribute("tabindex", "0");
      th.setAttribute("role", "button");
      th.setAttribute("aria-sort", "none");

      function ordenar() {
        const crescente = estado.indice === indice ? !estado.crescente : true;
        estado = { indice, crescente };

        const linhas = Array.from(tbody.querySelectorAll("tr:not(.tabela-vazia)"));
        linhas.sort((a, b) => {
          const textoA = a.children[indice].textContent.trim().toLowerCase();
          const textoB = b.children[indice].textContent.trim().toLowerCase();
          return crescente
            ? textoA.localeCompare(textoB, "pt-BR")
            : textoB.localeCompare(textoA, "pt-BR");
        });

        linhas.forEach((linha) => tbody.appendChild(linha));

        headers.forEach((h, i) => {
          const ativo = i === indice;
          h.setAttribute("aria-sort", ativo ? (crescente ? "ascending" : "descending") : "none");
          h.classList.toggle("th-sorted-asc", ativo && crescente);
          h.classList.toggle("th-sorted-desc", ativo && !crescente);
        });
      }

      th.addEventListener("click", ordenar);
      th.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          ordenar();
        }
      });
    });
  }
});
