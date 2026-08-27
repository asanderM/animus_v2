---
name: Animus AI Studio
description: Landing page institucional em terminal-noir dourado sobre carbono, pra atendimento automático e organização de clientes de pequenos negócios locais.
colors:
  preto: "#0a0a0a"
  preto-rodape: "#050505"
  carbono: "#141414"
  ouro-escuro: "#b8960c"
  ouro-queimado: "#8a6f0a"
  gelo-sujo: "#e8e4dc"
  cinza-neutro: "#9e9a94"
  contorno-sutil: "#2e2b26"
  whatsapp-verde: "#25D366"
typography:
  headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.1
  title:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.625rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.2em"
rounded:
  none: "0px"
spacing:
  mobile-margin: "24px"
  desktop-margin: "80px"
  section-padding: "140px"
  container-max: "1200px"
components:
  button-primary:
    backgroundColor: "{colors.ouro-escuro}"
    textColor: "{colors.preto}"
    rounded: "{rounded.none}"
    padding: "16px 40px"
  button-primary-hover:
    backgroundColor: "{colors.ouro-queimado}"
  card:
    backgroundColor: "{colors.carbono}"
    textColor: "{colors.gelo-sujo}"
    rounded: "{rounded.none}"
    padding: "32px"
---

# Design System: Animus AI Studio

## Overview

**Creative North Star: "The Gilded Ledger"**

Um livro-razão em carbono e couro escuro, escriturado a tinta dourada — preciso, restrito, sem enfeite. É a estética de uma consultoria técnica que documenta cada linha com rigor, não a de um produto de consumo tentando parecer divertido. O fundo é quase preto absoluto (`#0a0a0a`), os blocos de conteúdo flutuam em carbono (`#141414`) com bordas douradas quase invisíveis em repouso, e o ouro só aparece pra marcar o que importa: números de etapa, rótulos, o CTA. Um grão de ruído sutil (film-noise, 4.5% de opacidade) cobre a página inteira, dando textura análoga a um material físico em vez de tela plana.

O vocabulário tipográfico reforça o mesmo espírito: Space Grotesk carrega toda leitura (títulos e corpo), enquanto JetBrains Mono é reservado só pra "carimbos" — rótulos em caixa alta, colchetes `[ ]`, o prompt `>_`, o cursor piscando. Cantos são sempre cortados (`clip-path`), nunca arredondados — geometria angular, não macia. Nada tem sombra em repouso; o brilho dourado e o leve levante só acontecem como resposta a interação, nunca como decoração parada.

Rejeições confirmadas: sem gradientes vistosos fora do glow radial de fundo, sem ilustração figurativa na página (só o mascote pinguim em dois pontos pontuais), sem cantos arredondados em lugar nenhum, sem depoimento ou prova social fabricada.

**Key Characteristics:**
- Fundo quase-preto + acentos em carbono, nunca branco puro
- Ouro (`#b8960c`) raro e intencional — nunca preenchimento de fundo grande
- Cantos sempre cortados via `clip-path`, zero `border-radius`
- Mono reservado a rótulos/chrome; Space Grotesk carrega toda leitura
- Grão de ruído sutil cobrindo toda a página
- Flat em repouso; glow + levante só no hover

## Colors

Paleta quase-monocromática (preto/carbono/gelo) com um único acento dourado que carrega toda a hierarquia de destaque.

### Primary
- **Ouro Escuro** (`#b8960c`): cor de destaque única — CTAs, números de etapa, títulos parciais (`<span class="text-primary">`), ícones de rótulo, bordas de foco. Usada em texto e fundo de botão, nunca como fundo de seção inteira.
- **Ouro Queimado** (`#8a6f0a`): tom mais escuro do mesmo ouro, reservado a hover states e sublinhados/detalhes decorativos — nunca usado como cor de repouso.

### Neutral
- **Preto** (`#0a0a0a`): fundo de página, todas as seções.
- **Preto do Rodapé** (`#050505`): tom ainda mais escuro que o preto de página, usado só no `<footer>` pra separar visualmente o encerramento do resto do fluxo.
- **Carbono** (`#141414`): fundo de cards, modal, boxes de destaque — a camada "elevada" acima do preto de página.
- **Gelo Sujo** (`#e8e4dc`): texto de corpo primário e títulos — off-white deliberado, nunca branco puro (`#fff`).
- **Cinza Neutro** (`#9e9a94`): texto secundário/legendas (`on-surface-variant`) — sub-headlines, descrições de card, texto de rodapé.
- **Contorno Sutil** (`#2e2b26`): bordas de divisão discretas (nav, divisores) — sempre em opacidade baixa (`/20`), nunca como linha sólida chapada.

### Utility (fora da paleta de marca)
- **WhatsApp Verde** (`#25D366`): cor de marca de terceiro, usada só no botão flutuante de WhatsApp — nunca reaproveitada em outro componente, pra não competir com o ouro como acento.

### Named Rules
**The Restrained Gold Rule.** Ouro aparece em ≤10% de qualquer viewport — CTA, um número, um rótulo. Se duas coisas na mesma tela competem por atenção em ouro, uma delas está errada.

## Typography

**Headline/Body Font:** Space Grotesk (fallback `sans-serif`)
**Label/Mono Font:** JetBrains Mono (fallback `monospace`)

**Character:** Space Grotesk é geométrica mas humana — carrega toda leitura, de H1 a parágrafo. JetBrains Mono nunca aparece em texto corrido; é reservada a fragmentos curtos que remetem a interface técnica (rótulo, tag, prompt).

### Hierarchy
- **Headline / H1** (700, `clamp(2.25rem, 5vw, 3.75rem)`, leading tight): headline principal da Hero e do CTA Final — a única linha que recebe destaque parcial em ouro via `<span>`.
- **Headline / H2** (700, `text-3xl` → `text-5xl` responsivo, leading tight): título de cada seção.
- **Title / H3** (700, `text-base`–`text-lg`): título de card individual (dor, oferta, etapa).
- **Body** (400, `text-sm`–`text-xl` conforme contexto, leading relaxed): parágrafos de apoio, sempre em Cinza Neutro, nunca em Gelo Sujo puro (Gelo Sujo é reservado a texto de maior peso/ênfase).
- **Label** (500–600, `tracking-widest` a `tracking-[0.3em]`, caixa alta): rótulos tipo "Incluído", "Garantia", tagline do nav/rodapé, texto de apoio mono — sempre em JetBrains Mono, sempre em ouro ou cinza neutro. Dois passos apenas, sem tamanho intermediário: `10px` é o padrão (tagline, legenda, rótulo de card); `12px` (`text-xs`) é reservado a mono inline com um pouco mais de presença — números de eyebrow de card (`01`–`04`) e o rótulo "WhatsApp" no rodapé.

### Named Rules
**The Two-Voice Rule.** Se o texto é pra ser lido em frase, é Space Grotesk. Se o texto é um rótulo, tag, número solto ou fragmento de "interface" (colchetes, prompt, cursor), é JetBrains Mono. As duas fontes nunca se misturam dentro do mesmo bloco de texto corrido.

## Layout

Container central com `max-width: 1200px`, margem lateral `24px` no mobile e `80px` no desktop. Seções usam `padding-block: 140px` (exceto Hero, que é `min-h-screen` sem esse padding). Grid de conteúdo é `1 coluna` no mobile, expandindo pra `2` (dores, oferta) ou `4` (etapas) no desktop via `md:grid-cols-*`. Conteúdo abaixo da dobra usa `content-visibility: auto` (classe `.below-fold`) pra performance de renderização. Sem sidebar, sem densidade alta — respiro generoso é parte deliberada do tom "consultoria", não "app".

## Elevation & Depth

Sistema é flat por padrão — nenhum componente tem sombra em repouso. Profundidade só aparece como resposta a interação: hover em card ou botão adiciona um glow radial dourado difuso (`box-shadow` com `rgba(184,150,12,…)`) e um leve levante (`translateY(-4px)` em cards, `scale(1.03)` em botões). Um grão de ruído (film-noise SVG, opacity `0.045`) cobre a página inteira como textura de material, não como profundidade de camada.

### Shadow Vocabulary
- **Card hover glow** (`box-shadow: 0 0 40px rgba(184,150,12,0.08)`): halo difuso ao redor do card quando o mouse passa por cima.
- **Button hover glow** (`box-shadow: 0 0 40px rgba(184,150,12,0.3)`): mesmo princípio, mais intenso, nos CTAs primários.
- **WhatsApp float shadow** (`box-shadow: 0 4px 20px rgba(37,211,102,0.4)`): sombra de cor própria, isolada do sistema dourado — reforça que é elemento de terceiro (WhatsApp), não da marca.

### Named Rules
**The Flat-Until-Interaction Rule.** Nenhuma superfície tem sombra ou glow em repouso. Se algo brilha ou levanta, é porque o usuário acabou de interagir com ele — nunca decoração parada.

## Shapes

Corte de canto (`clip-path`) substitui `border-radius` em todo o sistema — zero cantos arredondados. Dois tamanhos de corte: `clip-corner` (22px, corta canto superior-direito e inferior-esquerdo) pra CTAs e cards grandes/destacados; `clip-corner-sm` (12px, mesmo padrão) pra botões de contexto menor, modal e nav. Bordas, quando existem, são finas (`1px`) e sempre em ouro de baixa opacidade (`rgba(184,150,12,0.12–0.4)`), nunca sólidas chapadas.

## Components

### Buttons
- **Shape:** `clip-corner` (CTAs grandes: Hero, CTA intermediário, CTA Final) ou `clip-corner-sm` (nav, modal) — nunca `border-radius`.
- **Primary:** fundo Ouro Escuro, texto Preto, `font-bold`, padding `12px–20px` vertical × `24px–48px` horizontal conforme contexto.
- **Hover:** `scale(1.03)` + glow dourado (`0 0 40px rgba(184,150,12,0.3)`); barra de "scan" branca com brilho dourado varre da esquerda pra direita em `0.45s` (`.cta-scan-bar`); texto do botão faz crossfade via `clip-path` pra uma variante alternativa prefixada com `>` em mono ("Vamos conversar →") — a técnica `.cta-swap` usa `display: inline-grid` com os dois textos na mesma célula de grid, então o botão nunca muda de largura ao trocar de texto.
- **Active:** `scale(0.96)`.
- **Redução de movimento:** a barra de scan é removida e a transição de texto vira instantânea sob `prefers-reduced-motion: reduce`.

### Cards
- **Corner Style:** `clip-corner-sm` (12px).
- **Background:** Carbono (`#141414`).
- **Border:** `1px solid rgba(184,150,12,0.12)` em repouso, clareia pra `0.4` no hover.
- **Shadow Strategy:** ver Elevation & Depth — glow só no hover.
- **Internal Padding:** `32px` (mobile) a `48px` (desktop, nos cards de destaque maiores).
- **Hover:** levanta `translateY(-4px)` junto com o glow e o clareamento de borda.

### Modal (Qualificação do CTA Final)
- **Shape:** `clip-corner-sm`, largura máxima `420px`.
- **Background:** Carbono, borda `1px solid rgba(184,150,12,0.3)`.
- **Behavior:** overlay escuro (`rgba(0,0,0,0.75)`) com fade+scale de entrada (`0.2s`); campos de checkbox usam `accent-color` dourado; textarea com borda sutil que clareia no foco.
- **Redução de movimento:** entrada/saída do modal vira instantânea (sem fade/scale) sob `prefers-reduced-motion: reduce`.

### Navigation
- **Style:** fixa no topo, fundo `bg-background/80` com `backdrop-blur-xl`, borda inferior sutil (`outline-variant/20`).
- **Typography:** nome da marca em Space Grotesk bold; tagline abaixo em mono, caixa alta, tracking largo, entre colchetes.
- **States:** links de navegação em Cinza Neutro, viram Ouro Escuro no hover (`transition-colors`).
- **Mobile:** colapsa pra menu hamburguer (ícone em ouro), painel dropdown com blur igual ao nav.

### Signature: Terminal Chrome
Vocabulário recorrente que assina a marca sem depender de logo: colchetes `[ ]` envolvendo rótulos/tags (`[ SITES E AUTOMAÇÕES INTELIGENTES ]`, `[ Foco • Código • Evolução ]`), prompt `>_` como prefixo de destaque, e um cursor piscando (`_` com `@keyframes blink`, `step-start infinite`, puro CSS) ao lado do nome da marca na Hero. Esse motivo é o que torna o sistema reconhecível como "terminal" mesmo sem nenhum componente de código real na tela.

## Do's and Don'ts

### Do:
- **Do** cortar cantos com `clip-path` (`clip-corner` / `clip-corner-sm`) em qualquer superfície nova — nunca `border-radius`.
- **Do** manter todo texto de rótulo/tag/número em JetBrains Mono, caixa alta, tracking largo.
- **Do** deixar toda superfície flat em repouso; glow e levante só entram como resposta a hover/focus.
- **Do** respeitar `prefers-reduced-motion` em qualquer animação nova (scan bar, scroll-reveal, modal, cursor piscando).

### Don't:
- **Don't** usar `border-radius` em nenhum componente — quebra a identidade geométrica cortada do sistema.
- **Don't** usar Gelo Sujo (`#e8e4dc`) puro pra texto de corpo longo — reservar pro peso maior; corpo de apoio é Cinza Neutro.
- **Don't** aplicar o Ouro Escuro como fundo de bloco grande (seção inteira, card cheio) — é acento raro, não cor de preenchimento.
- **Don't** reaproveitar o verde do WhatsApp (`#25D366`) em nenhum outro componente da marca — é cor de terceiro, isolada de propósito.
