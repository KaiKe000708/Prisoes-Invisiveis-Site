# Prisões Invisíveis: A Escravidão do Século XXI

Site interativo desenvolvido como atividade curricular da faculdade, com o objetivo de refletir sobre os impactos da pressão profissional e acadêmica na saúde mental de jovens, abordando temas como ansiedade, burnout, depressão, vícios e rotina de sobrecarga.

🔗 **[Acessar o site](https://kaike000708.github.io/prisoes-invisiveis-site/)**

---

## 📖 Sobre o projeto

O projeto nasceu como trabalho acadêmico, mas também serve como ambiente de prática de **HTML, CSS e JavaScript puros** (sem frameworks), explorando efeitos visuais, animações, interatividade e transições entre páginas para criar uma experiência imersiva em torno de um tema sério.

## ✨ Funcionalidades e efeitos

**Experiência visual**

- 🌧️ Animação de chuva em `<canvas>` (com profundidade, vento e respingos) na página inicial e na página 404
- ⌨️ Efeito de texto digitado (typing effect) com frases rotativas
- 🎞️ Transições animadas de entrada e saída entre páginas
- 📜 Marquee (texto em rolagem contínua) com os temas do site
- ✨ Efeitos ao rolar a página: fade-in, entrada escalonada dos cards e títulos revelados com efeito de cortina
- 🎴 Efeito 3D sutil (tilt) nos cards ao passar o mouse
- 🔢 Números que contam de 0 até o valor final ao entrar na tela (estatísticas e custos)

**Interatividade por página**

- 🎬 **Depressão:** vídeo de abertura que desacelera e congela em um quadro específico, com poeira flutuando em `<canvas>` e gráfico "então x agora" animado
- 🫁 **Ansiedade:** exercício de respiração quadrada guiado (4 segundos por fase), ativado ao clicar no círculo
- 💸 **Vícios:** cards de estatísticas e cálculo de quanto custa fumar por mês e por ano
- 📊 **Tabela:** dados carregados de um arquivo JSON via `fetch`, com busca por texto, filtro por nível de atenção e ordenação por coluna (inclusive via teclado)
- 🖼️ **Fotos:** galeria com lightbox (clique para ampliar, `Esc` para fechar)
- 📬 **Contato:** formulário funcional com envio via [Formspree](https://formspree.io/) e proteção anti-spam com [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)

**Acessibilidade e responsividade**

- 📱 Layout responsivo com menu hambúrguer no celular
- ♿ Submenu "Causas" navegável por teclado (Tab + Enter), com `aria-expanded` sincronizado para leitores de tela
- 🎚️ Animações reduzidas para quem usa `prefers-reduced-motion`
- 🧭 Página 404 personalizada

**SEO e métricas**

- 🔎 Meta tags de descrição, Open Graph e Twitter Card para pré-visualização ao compartilhar o link
- 🗺️ `robots.txt` e `sitemap.xml` para indexação
- 📈 Google Tag Manager para análise de acessos

## 🗺️ Páginas do site

| Página | Tema |
|---|---|
| `index.html` | Página inicial / abertura do site |
| `paginas/causas.html` | Causas da escravidão moderna (pobreza, desigualdade, corrupção, falta de educação e leis fracas) |
| `paginas/ansiedade.html` | Ansiedade: causas, sintomas, impactos nos jovens e exercício de respiração |
| `paginas/burnout.html` | Burnout: o estresse que destrói os jovens, sua escalada e prevenção |
| `paginas/depressao.html` | Depressão e trabalho: a prisão moderna |
| `paginas/vicios.html` | Vícios: a fuga que aprisiona (álcool e cigarro) |
| `paginas/rotina.html` | Rotina de sobrecarga |
| `paginas/impacto.html` | Impactos da saúde mental na vida |
| `paginas/solucoes.html` | Soluções para as "prisões invisíveis" |
| `paginas/reflexao.html` | Reflexão final |
| `paginas/tabela.html` | Tabela interativa com causas, sinais e prevalência de cada condição |
| `paginas/fotos.html` | Galeria de imagens utilizadas no site |
| `paginas/links.html` | Links úteis sobre saúde mental |
| `paginas/contato.html` | Contato |
| `404.html` | Página de erro personalizada |

## 📁 Estrutura do repositório

```
Prisoes-Invisiveis-Site/
├── css/                  # Estilos (globais, transições e um arquivo por página)
├── js/                   # Scripts (chuva, transições, tabela, formulário, galeria etc.)
├── json/                 # Dados consumidos pela tabela (dados.json)
├── imagens/              # Imagens organizadas por tema (WebP) e favicons
├── videos/               # Vídeo usado na página de depressão
├── paginas/              # Páginas internas (HTML)
├── index.html            # Página inicial
├── 404.html              # Página de erro personalizada
├── robots.txt
└── sitemap.xml
```

## 🛠️ Tecnologias

<p>
<img src="https://img.shields.io/badge/HTML5-000000?style=for-the-badge&logo=html5&logoColor=ffffff"/>
<img src="https://img.shields.io/badge/CSS3-000000?style=for-the-badge&logo=css3&logoColor=ffffff"/>
<img src="https://img.shields.io/badge/JavaScript-000000?style=for-the-badge&logo=javascript&logoColor=ffffff"/>
</p>

Serviços externos utilizados: **Formspree** (envio do formulário), **Cloudflare Turnstile** (anti-spam) e **Google Tag Manager** (métricas).

## 🚀 Rodando localmente

Como o site usa `fetch` para carregar o `json/dados.json` (página da tabela), abrir o `index.html` direto no navegador (`file://`) não é suficiente: o navegador bloqueia essa requisição. Sirva a pasta com qualquer servidor local, por exemplo:

```bash
# Python
python -m http.server 8000
```

Depois acesse `http://localhost:8000` no navegador.

## 🌐 Deploy

O site está publicado via **GitHub Pages** diretamente a partir deste repositório.

---

## ✏️ Notas

Projeto desenvolvido para fins educacionais, como atividade curricular. Fica aqui também como espaço de prática e experimentação com efeitos visuais e interações em JavaScript puro.
