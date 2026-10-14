// Mapa vivo do topo (home v5, 13/10/2026). Cidade 3D feita em código, no estilo do
// Apple Maps: quadras claras, prédios, parques, carros andando. Seis negócios fictícios
// recebem mensagem e respondem sozinhos ("Tem horário amanhã?" → "✓ Marcado").
// Segue o tema do site (claro/escuro). Para quando sai da tela. Com animação reduzida,
// desenha 1 quadro parado com os balões já respondidos.
import * as THREE from "three";

const raiz = document.getElementById("mapa-hero");
const canvas = document.getElementById("mapa-canvas");
const camadaPins = document.getElementById("mapa-pins");
const card = document.getElementById("mapa-card");
const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

const PALETA = {
  claro: { fundo: "#fffdf8", rua: "#fbfaf6", quadra: "#ebe7dd", predio: [0xf6f3ec, 0xe9e4d8], parque: "#d5e6c2", arvore: "#9fc58a", topo: "#e0c050", carro: [0x4a6fa5, 0xc94f3d, 0x3d3a34, 0xe8e4da, 0x6b8f71] },
  escuro: { fundo: "#141310", rua: "#100f0d", quadra: "#26241f", predio: [0x4a463d, 0x3a3730], parque: "#20301e", arvore: "#3d6a38", topo: "#d4b23a", carro: [0x8fb3ff, 0xff8f7a, 0xf1ece1, 0xd4b23a, 0x9ad3a5] },
};

const NEGOCIOS = [
  { nome: "Barbearia Navalha", tipo: "Barbearia", ico: "✂️", cor: "#e0c050", pede: "Tem horário amanhã?", ok: "✓ Marcado · amanhã 15h" },
  { nome: "Pizzaria Forno Velho", tipo: "Pizzaria", ico: "🍕", cor: "#f08a4b", pede: "Ainda dá pra pedir?", ok: "✓ Pedido anotado · 40 min" },
  { nome: "Clínica Sorriso", tipo: "Clínica odontológica", ico: "🦷", cor: "#6fb7e8", pede: "Tem avaliação essa semana?", ok: "✓ Marcado · quinta 14h" },
  { nome: "Studio Bella", tipo: "Salão de beleza", ico: "💇", cor: "#e58fb5", pede: "Faz escova sábado?", ok: "✓ Marcado · sábado 9h" },
  { nome: "Pet Amigo", tipo: "Pet shop", ico: "🐾", cor: "#8cc98a", pede: "Banho pro Thor amanhã?", ok: "✓ Marcado · amanhã 10h" },
  { nome: "Silva Advocacia", tipo: "Escritório", ico: "⚖️", cor: "#a99be8", pede: "Consigo falar com o doutor?", ok: "✓ Retorno marcado · 16h" },
];

function temaAtual() {
  const t = document.documentElement.getAttribute("data-tema");
  if (t === "claro" || t === "escuro") return t;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro";
}

// Aleatório com semente: a cidade sai igual em toda visita.
let semente = 7;
const rnd = () => ((semente = (semente * 16807) % 2147483647) - 1) / 2147483646;

const celular = () => innerWidth < 980;
const N = celular() ? 7 : 11; // quadras por lado
const P = 13; // passo da quadra: 10 de quadra + 3 de rua
const META = (N * P) / 2;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "low-power" });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
const cena = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 1, 600);

cena.add(new THREE.HemisphereLight(0xffffff, 0xb9b2a2, 1.6));
const sol = new THREE.DirectionalLight(0xffffff, 1.5);
sol.position.set(-40, 80, 30);
cena.add(sol);

const mat = {
  rua: new THREE.MeshLambertMaterial(),
  quadra: new THREE.MeshLambertMaterial(),
  parque: new THREE.MeshLambertMaterial(),
  predio: new THREE.MeshLambertMaterial(),
  arvore: new THREE.MeshLambertMaterial(),
  topo: new THREE.MeshLambertMaterial(),
  carro: new THREE.MeshLambertMaterial(),
};

const chao = new THREE.Mesh(new THREE.PlaneGeometry(N * P * 3, N * P * 3), mat.rua);
chao.rotation.x = -Math.PI / 2;
cena.add(chao);

// Quadras, parques e lotes.
const placa = new THREE.BoxGeometry(10, 0.3, 10);
const lotes = [];
const parques = [];
for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
  const x = (i - (N - 1) / 2) * P, z = (j - (N - 1) / 2) * P;
  const ehParque = rnd() < 0.11;
  const m = new THREE.Mesh(placa, ehParque ? mat.parque : mat.quadra);
  m.position.set(x, 0.15, z);
  cena.add(m);
  if (ehParque) { parques.push([x, z]); continue; }
  for (const [dx, dz] of [[-2.5, -2.5], [2.5, -2.5], [-2.5, 2.5], [2.5, 2.5]]) {
    if (rnd() < 0.12) continue;
    const dist = Math.hypot(x, z) / META;
    const alto = 1.5 + rnd() * 3.5 + Math.max(0, 1 - dist) ** 2 * rnd() * 11;
    lotes.push({ x: x + dx, z: z + dz, w: 3.6 + rnd() * 0.8, d: 3.6 + rnd() * 0.8, h: alto, tom: rnd() });
  }
}

// Negócios: lotes baixos, perto do centro e espalhados.
const perto = lotes.filter((l) => Math.hypot(l.x, l.z) < META * 0.55).sort(() => rnd() - 0.5);
const escolhidos = [];
for (const l of perto) {
  if (escolhidos.length === NEGOCIOS.length) break;
  if (escolhidos.every((e) => Math.hypot(e.x - l.x, e.z - l.z) > P * 1.4)) { l.h = 2.6 + rnd(); l.negocio = true; escolhidos.push(l); }
}

const caixa = new THREE.BoxGeometry(1, 1, 1);
caixa.translate(0, 0.5, 0);
const predios = new THREE.InstancedMesh(caixa, mat.predio, lotes.length);
const tmp = new THREE.Object3D();
lotes.forEach((l, k) => {
  tmp.position.set(l.x, 0.3, l.z);
  tmp.scale.set(l.w, l.h, l.d);
  tmp.updateMatrix();
  predios.setMatrixAt(k, tmp.matrix);
});
cena.add(predios);

// Telhado dourado nos negócios.
const telhados = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.25, 1), mat.topo, escolhidos.length);
escolhidos.forEach((l, k) => {
  tmp.position.set(l.x, 0.3 + l.h + 0.12, l.z);
  tmp.scale.set(l.w * 0.98, 1, l.d * 0.98);
  tmp.updateMatrix();
  telhados.setMatrixAt(k, tmp.matrix);
});
cena.add(telhados);

// Árvores nos parques.
const copa = new THREE.IcosahedronGeometry(1, 0);
const nArv = parques.length * 9;
const arvores = new THREE.InstancedMesh(copa, mat.arvore, Math.max(1, nArv));
let a = 0;
for (const [x, z] of parques) for (let k = 0; k < 9; k++) {
  const s = 0.9 + rnd() * 0.7;
  tmp.position.set(x - 3.5 + (k % 3) * 3.5 + rnd() - 0.5, 0.3 + s, z - 3.5 + Math.floor(k / 3) * 3.5 + rnd() - 0.5);
  tmp.scale.set(s, s * 1.1, s);
  tmp.rotation.set(rnd(), rnd(), 0);
  tmp.updateMatrix();
  arvores.setMatrixAt(a++, tmp.matrix);
}
tmp.rotation.set(0, 0, 0);
arvores.count = a;
cena.add(arvores);

// Carros: andam nas ruas (entre as quadras) e dão a volta.
const nCarros = celular() ? 12 : 26;
const carros = new THREE.InstancedMesh(new THREE.BoxGeometry(1.5, 0.7, 0.8), mat.carro, nCarros);
const corCarro = new THREE.Color();
const rotas = Array.from({ length: nCarros }, () => {
  const linha = (Math.floor(rnd() * N) - (N - 1) / 2) * P + P / 2 * (rnd() < 0.5 ? 1 : -1);
  return { eixoX: rnd() < 0.5, linha: linha + (rnd() < 0.5 ? 0.7 : -0.7), t: rnd() * 2 * META - META, v: (4 + rnd() * 4) * (rnd() < 0.5 ? 1 : -1), cor: Math.floor(rnd() * 5) };
});
cena.add(carros);

function posicionarCarros() {
  rotas.forEach((r, k) => {
    if (r.eixoX) { tmp.position.set(r.t, 0.65, r.linha); tmp.rotation.y = 0; } else { tmp.position.set(r.linha, 0.65, r.t); tmp.rotation.y = Math.PI / 2; }
    tmp.scale.set(1, 1, 1);
    tmp.updateMatrix();
    carros.setMatrixAt(k, tmp.matrix);
  });
  carros.instanceMatrix.needsUpdate = true;
}

function aplicarTema() {
  const p = PALETA[temaAtual()];
  const fundo = new THREE.Color(p.fundo);
  renderer.setClearColor(fundo);
  cena.fog = new THREE.Fog(fundo, 130, celular() ? 230 : 300);
  mat.rua.color.set(p.rua);
  mat.quadra.color.set(p.quadra);
  mat.parque.color.set(p.parque);
  mat.arvore.color.set(p.arvore);
  mat.topo.color.set(p.topo);
  mat.topo.emissive.set(temaAtual() === "escuro" ? p.topo : 0x000000);
  mat.topo.emissiveIntensity = 0.35;
  const c0 = new THREE.Color(p.predio[0]), c1 = new THREE.Color(p.predio[1]);
  lotes.forEach((l, k) => predios.setColorAt(k, corCarro.copy(c0).lerp(c1, l.tom)));
  predios.instanceColor.needsUpdate = true;
  rotas.forEach((r, k) => carros.setColorAt(k, corCarro.set(p.carro[r.cor])));
  carros.instanceColor.needsUpdate = true;
  const escuro = temaAtual() === "escuro";
  cena.children.filter((c) => c.isHemisphereLight)[0].intensity = escuro ? 1.3 : 1.6;
  sol.intensity = escuro ? 1.2 : 1.5;
  desenhar();
}

// Pins em HTML por cima do canvas (texto nítido e clicável).
const pins = escolhidos.map((l, k) => {
  const n = NEGOCIOS[k];
  const b = document.createElement("button");
  b.type = "button";
  b.className = "pin";
  b.style.setProperty("--c", n.cor);
  b.setAttribute("aria-label", `${n.nome}, exemplo de negócio`);
  b.innerHTML = `<span class="ico">${n.ico}</span><span class="nome">${n.nome}</span><span class="balao"></span>`;
  camadaPins.append(b);
  const estado = { el: b, balao: b.querySelector(".balao"), negocio: n, alvo: new THREE.Vector3(l.x, 0.3 + l.h + 0.4, l.z), respondidas: 2 + Math.floor(rnd() * 4) };
  b.addEventListener("pointerenter", () => mostrarCard(estado));
  b.addEventListener("focus", () => mostrarCard(estado));
  b.addEventListener("click", () => mostrarCard(estado));
  b.addEventListener("pointerleave", () => esconderCard());
  return estado;
});

let cardTimer;
function mostrarCard(s) {
  clearTimeout(cardTimer);
  pins.forEach((p) => p.el.classList.toggle("ativo", p === s));
  card.innerHTML = `<b>${s.negocio.nome}</b><small>${s.negocio.tipo} · exemplo</small><p>${s.respondidas} conversas fora do horário · <em>todas respondidas</em></p>`;
  card.classList.add("on");
  cardTimer = setTimeout(esconderCard, 4500);
}
function esconderCard() {
  pins.forEach((p) => p.el.classList.remove("ativo"));
  card.classList.remove("on");
}

const v = new THREE.Vector3();
function posicionarPins() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  for (const p of pins) {
    v.copy(p.alvo).project(camera);
    const x = (v.x * 0.5 + 0.5) * w, y = (-v.y * 0.5 + 0.5) * h;
    const fora = v.z > 1 || x < (celular() ? 20 : w * 0.46) || x > w - 20 || y < 40 || y > h - 10;
    p.el.style.visibility = fora ? "hidden" : "visible";
    p.el.classList.toggle("direita", x > w * 0.6); // balão abre pra esquerda perto da borda
    p.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-15px, -100%)`;
  }
}

// Câmera inclinada, girando devagar em volta do centro.
let angulo = 0.6;
function posicionarCamera() {
  const cel = celular();
  const r = cel ? 92 : 118, alt = cel ? 96 : 112;
  camera.position.set(Math.sin(angulo) * r, alt, Math.cos(angulo) * r);
  camera.lookAt(0, 0, 0);
}

function redimensionar() {
  const w = raiz.clientWidth, h = raiz.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  // No desktop o texto fica à esquerda: empurra a cidade pra direita.
  if (!celular()) camera.setViewOffset(w, h, -w * 0.24, h * 0.04, w, h); else camera.clearViewOffset();
  camera.updateProjectionMatrix();
  desenhar();
}

function desenhar() {
  posicionarCamera();
  posicionarCarros();
  renderer.render(cena, camera);
  posicionarPins();
}

// Mensagens: um negócio por vez recebe e responde.
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let rodando = false;
async function cicloMensagens() {
  for (let k = 0; ; k = (k + 1) % pins.length) {
    while (!rodando) await espera(400);
    const p = pins[k];
    p.balao.textContent = p.negocio.pede;
    p.balao.classList.remove("ok");
    p.balao.classList.add("on");
    await espera(1700);
    p.balao.textContent = p.negocio.ok;
    p.balao.classList.add("ok");
    p.respondidas++;
    await espera(2200);
    p.balao.classList.remove("on");
    await espera(500);
  }
}

let ultimo = performance.now();
function quadro(agora) {
  const dt = Math.min(0.05, (agora - ultimo) / 1000);
  ultimo = agora;
  if (rodando) {
    angulo += dt * 0.035;
    for (const r of rotas) {
      r.t += r.v * dt;
      if (r.t > META) r.t = -META; else if (r.t < -META) r.t = META;
    }
    desenhar();
  }
  requestAnimationFrame(quadro);
}

aplicarTema();
new ResizeObserver(redimensionar).observe(raiz);
new MutationObserver(aplicarTema).observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", aplicarTema);

if (reduz) {
  // Quadro parado: cada negócio mostra a resposta já dada.
  redimensionar();
  pins.slice(0, 3).forEach((p) => { p.balao.textContent = p.negocio.ok; p.balao.classList.add("on", "ok"); });
} else {
  new IntersectionObserver((es) => (rodando = es[0].isIntersecting && !document.hidden)).observe(raiz);
  document.addEventListener("visibilitychange", () => (rodando = !document.hidden && raiz.getBoundingClientRect().bottom > 0));
  requestAnimationFrame(quadro);
  cicloMensagens();
}
