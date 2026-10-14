// Terminal da IA (home v5, 13/10/2026). Referência do Alex: painel tipo "TERMINAL · I/O".
// A IA é um anel no centro; fios curvos levam o fluxo até as colunas de cada parte do
// negócio (os "bancos"), e as linhas acendem quando a IA resolve algo ali. O conteúdo
// muda por negócio (imobiliária, advocacia, clínica, indústria): nada vem de catálogo.
// No celular o desenho vira vertical (anel em cima, colunas 2×2 embaixo).
(function () {
  const svg = document.getElementById("planta");
  if (!svg) return;
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";

  // Cada coluna: [título, [[item, estado], …]]; estado: "" normal, "ok" resolvido, "alerta" pede decisão.
  const NEGOCIOS = [
    { nome: "Imobiliária", cols: [
      ["CAPTAÇÃO", [["Apê Centro", "ok"], ["Casa Aspen", ""], ["Terreno Carniel", ""], ["Cobertura", "ok"], ["Sala comercial", ""]]],
      ["VISITAS", [["Sáb 10h", "ok"], ["Sáb 11h", ""], ["Dom 15h", "ok"], ["Seg 18h", ""], ["Ter 9h", ""]]],
      ["INTERESSADOS", [["Alta · apê", "ok"], ["Média · casa", ""], ["Alta · terreno", "alerta"], ["Baixa · sala", ""], ["Alta · cobertura", "ok"]]],
      ["PROPOSTAS", [["Enviada", "ok"], ["Assinada", "ok"], ["Em análise", ""], ["Contraproposta", "alerta"], ["Rascunho", ""]]] ] },
    { nome: "Advocacia", cols: [
      ["PRAZOS", [["Proc. 0123 · 5d", ""], ["Proc. 0456 · 2d", "alerta"], ["Proc. 0789 · 9d", ""], ["Proc. 1011 · 12d", "ok"], ["Proc. 1213 · 3d", ""]]],
      ["PETIÇÕES", [["Inicial · Silva", "ok"], ["3 ajustes", "alerta"], ["Revisada", "ok"], ["Nova", ""], ["Analisada", "ok"]]],
      ["CLIENTES", [["Novo caso", ""], ["Retorno", "ok"], ["Documentos", ""], ["Audiência 14/11", "alerta"], ["Contrato", "ok"]]] ] },
    { nome: "Clínica", cols: [
      ["AGENDA", [["Seg 9h", "ok"], ["Seg 10h", ""], ["Ter 14h", "ok"], ["Qua 8h", ""], ["Qui 16h", "ok"]]],
      ["CONFIRMAÇÃO", [["Confirmado", "ok"], ["Sem resposta", "alerta"], ["Confirmado", "ok"], ["Remarcar", ""], ["Confirmado", "ok"]]],
      ["RETORNOS", [["6 meses · Ana", "ok"], ["1 ano · João", ""], ["6 meses · Bia", ""], ["3 meses · Leo", "ok"], ["1 ano · Rui", ""]]],
      ["FINANCEIRO", [["Pago", "ok"], ["Pendente", "alerta"], ["Pago", "ok"], ["Parcelado", ""], ["Pago", "ok"]]] ] },
    { nome: "Indústria", cols: [
      ["PEDIDOS", [["#312 · 40 un", "ok"], ["#313 · 12 un", ""], ["#314 · 90 un", "ok"], ["#315 · 8 un", ""], ["#316 · 25 un", ""]]],
      ["ORÇAMENTOS", [["Loja Sul", "ok"], ["Rede Norte", "alerta"], ["Atacado RS", ""], ["Rev. Centro", "ok"], ["Distrib. SC", ""]]],
      ["ESTOQUE", [["Item A · ok", "ok"], ["Item B · baixo", "alerta"], ["Item C · ok", "ok"], ["Item D · ok", ""], ["Item E · repor", ""]]],
      ["REPRESENT.", [["Zona 1", "ok"], ["Zona 2", ""], ["Zona 3", "ok"], ["Zona 4", ""], ["Zona 5", ""]]] ] },
  ];

  const el = (tag, attrs, pai, txt) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (txt != null) n.textContent = txt; pai.append(n); return n; };
  const polar = (cx, cy, r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  function arco(cx, cy, r, a0, a1) {
    const [x0, y0] = polar(cx, cy, r, a0), [x1, y1] = polar(cx, cy, r, a1);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }

  function desenhar(idx) {
    const n = NEGOCIOS[idx];
    const vertical = innerWidth < 560; // mesmo corte do CSS (aspect-ratio), pra não pular layout
    const W = vertical ? 360 : 640, H = vertical ? 520 : 360;
    const cols = vertical ? n.cols.slice(0, 2) : n.cols; // no celular, 2 colunas legíveis em vez de 4 miúdas
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.innerHTML = "";
    // moldura de terminal
    el("path", { d: `M8 22 V8 H40 M${W - 40} 8 H${W - 8} V22 M8 ${H - 22} V${H - 8} H40 M${W - 40} ${H - 8} H${W - 8} V${H - 22}`, class: "tm-canto" }, svg);
    el("text", { x: 18, y: 28, class: "tm-tit" }, svg, `TERMINAL · ${n.nome.toUpperCase()}`);
    el("text", { x: 18, y: 40, class: "tm-sub" }, svg, "IA NO CENTRO · SOB MEDIDA");

    // anel da IA
    const cx = vertical ? W / 2 : 160, cy = vertical ? 168 : H / 2 + 8, R = vertical ? 112 : 122;
    const anel = el("g", { class: "tm-anel" }, svg);
    el("circle", { cx, cy, r: R, class: "tm-ra tm-pont" }, anel);
    const gira1 = el("g", { class: "tm-gira", style: `transform-origin:${cx}px ${cy}px` }, anel);
    for (let k = 0; k < 60; k++) { const a = (k / 60) * Math.PI * 2, [x0, y0] = polar(cx, cy, R - 8, a), [x1, y1] = polar(cx, cy, R - (k % 5 ? 12 : 16), a); el("line", { x1: x0, y1: y0, x2: x1, y2: y1, class: "tm-tick" }, gira1); }
    const gira2 = el("g", { class: "tm-gira tm-rev", style: `transform-origin:${cx}px ${cy}px` }, anel);
    const nSeg = cols.length * 2;
    for (let k = 0; k < nSeg; k++) {
      const a0 = (k / nSeg) * Math.PI * 2 + 0.05, a1 = ((k + 1) / nSeg) * Math.PI * 2 - 0.05;
      el("path", { d: arco(cx, cy, R * 0.66, a0, a1), class: "tm-seg" }, gira2);
      const [mx, my] = polar(cx, cy, R * 0.66, (a0 + a1) / 2);
      el("circle", { cx: mx, cy: my, r: 3.4, class: k % 3 === 0 ? "tm-led a" : k % 3 === 1 ? "tm-led b" : "tm-led" }, gira2);
    }
    el("circle", { cx, cy, r: R * 0.42, class: "tm-ra" }, anel);
    el("circle", { cx, cy, r: R * 0.3, class: "tm-nucleo" }, anel);
    el("text", { x: cx, y: cy + 5, "text-anchor": "middle", class: "tm-ia" }, anel, "IA");

    // colunas (bancos)
    const nc = cols.length;
    const colW = vertical ? 150 : nc === 3 ? 92 : 70, rowH = vertical ? 22 : 24, gap = vertical ? 16 : 10;
    const x0 = vertical ? (W - (2 * colW + gap)) / 2 : 330 + (nc === 3 ? 14 : 0);
    const y0 = vertical ? 316 : 100;
    const fios = el("g", { class: "tm-fios" }, svg);
    cols.forEach(([tit, linhas], c) => {
      const cxCol = vertical ? x0 + (c % 2) * (colW + gap) : x0 + c * (colW + gap);
      const yCol = vertical ? y0 + Math.floor(c / 2) * (rowH * 6 + 22) : y0 + (c % 2) * 26;
      const g = el("g", { class: "tm-col", style: `--d:${0.2 + c * 0.25}s` }, svg);
      el("rect", { x: cxCol, y: yCol, width: colW, height: 14, class: "tm-cab" }, g);
      el("text", { x: cxCol + 6, y: yCol + 10, class: "tm-cab-t" }, g, tit);
      linhas.forEach(([t, est], k) => {
        const y = yCol + 18 + k * rowH;
        const gl = el("g", { class: `tm-lin ${est}`, style: `--d:${0.6 + c * 0.25 + k * 0.12}s; --p:${(c * 1.3 + k * 0.9) % 6}s` }, g);
        el("rect", { x: cxCol, y, width: colW, height: rowH - 6, class: "tm-cel" }, gl);
        el("text", { x: cxCol + 6, y: y + (rowH - 6) / 2 + 0.5, class: "tm-cel-t" }, gl, t);
      });
      // fio curvo do anel até o topo da coluna
      const a = vertical ? Math.PI / 2 + (c - (nc - 1) / 2) * 0.32 : -0.95 + c * 0.16; // no desktop os fios saem do alto do anel, rumo ao barramento
      const [sx, sy] = polar(cx, cy, R, a);
      const tx = cxCol + colW / 2, ty = yCol;
      const d = vertical
        ? `M${sx.toFixed(1)} ${sy.toFixed(1)} C${sx.toFixed(1)} ${(sy + 40).toFixed(1)} ${tx} ${ty - 40} ${tx} ${ty}`
        : (() => {
            // barramento: cada fio sobe pra sua faixa acima das colunas e desce no cabeçalho
            const faixa = 84 - c * 9, mx = sx + 46 + c * 6;
            return `M${sx.toFixed(1)} ${sy.toFixed(1)} C${(sx + 30).toFixed(1)} ${sy.toFixed(1)} ${mx - 16} ${faixa} ${mx} ${faixa} L${tx - 10} ${faixa} Q${tx} ${faixa} ${tx} ${faixa + 10} L${tx} ${ty}`;
          })();
      el("path", { d, class: "tm-fio" }, fios);
      el("path", { d, class: "tm-fluxo", style: `--d:${c * 0.4}s` }, fios);
    });
    // régua no rodapé, como na referência
    const ry = H - 26, rx = vertical ? 18 : 340;
    el("text", { x: rx, y: ry - 8, class: "tm-sub" }, svg, "RESOLVIDO SEM VOCÊ PARAR");
    const reg = el("g", { class: "tm-regua" }, svg);
    for (let k = 0; k < 24; k++) el("rect", { x: rx + k * 11, y: ry, width: 7, height: 4, style: `--d:${k * 0.08}s` }, reg);
  }

  let idx = 0;
  desenhar(0);
  if (reduz) { svg.classList.add("pronto"); return; }
  let rodando = false;
  const ciclo = () => setTimeout(() => {
    if (!rodando) return ciclo();
    svg.classList.add("saindo");
    setTimeout(() => { svg.classList.remove("saindo"); idx = (idx + 1) % NEGOCIOS.length; desenhar(idx); ciclo(); }, 450);
  }, 7000);
  new IntersectionObserver((es) => (rodando = es[0].isIntersecting)).observe(svg);
  let estreito = innerWidth < 560;
  new ResizeObserver(() => { const e = innerWidth < 560; if (e !== estreito) { estreito = e; desenhar(idx); } }).observe(svg.parentElement);
  ciclo();
})();
