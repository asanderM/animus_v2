// Mapa vivo do topo (home v5, 13/10/2026), no estilo do Apple Maps 3D (referência:
// Downloads/download (1).jpg). Cidade feita em código:
// - prédios com recuo, em X e em L, escurecendo na base;
// - praça central, parques, árvores de rua e carros estilo Tesla;
// - nomes de rua, pins de referência (P, farmácia, escola) e bússola.
// Seis negócios fictícios mostram o sistema de cada um trabalhando: o balão chega
// ("Interessado no apê do Centro") e vira resolvido ("✓ Visita marcada").
// Segue o tema do site, para fora da tela e, com animação reduzida, fica num quadro parado.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const raiz = document.getElementById("mapa-hero");
const canvas = document.getElementById("mapa-canvas");
const camadaPins = document.getElementById("mapa-pins");
const card = document.getElementById("mapa-card");
const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

const PALETA = {
  claro: { fundo: "#f5f3ef", rua: "#ffffff", quadra: "#e9e6e0", predio: [0xf3f1ed, 0xe4e1db], praca: "#e4dccb", parque: "#cfe5bd", arvore: "#9cc98a", tronco: "#b8a98f", vidro: "#3a4452", detalhe: "#d9d4ca", telhado: ["#7da7d9", "#9fd08c"], topo: "#e0c050", carro: [0xf4f4f2, 0x2f3338, 0xc8ccd2, 0xb33a32, 0x3b5f8f] },
  escuro: { fundo: "#141310", rua: "#0f0e0c", quadra: "#211f1b", predio: [0x4d4a43, 0x34322d], praca: "#2a2620", parque: "#1f301d", arvore: "#3f6b3a", tronco: "#4a4034", vidro: "#0b0d10", detalhe: "#57534a", telhado: ["#35557a", "#3e6a37"], topo: "#d4b23a", carro: [0xe8e8e4, 0x9aa3ad, 0x6d747c, 0xff7a6a, 0x8fb3ff] },
};

// O que cada sistema resolve sozinho (exemplos, não são clientes).
const NEGOCIOS = [
  { nome: "Imobiliária Horizonte", tipo: "Imobiliária", ico: "🏠", cor: "#3f8fd8", pede: "Interessado no apê do Centro", ok: "✓ Visita marcada · sáb 10h" },
  { nome: "Barbearia Navalha", tipo: "Barbearia", ico: "✂️", cor: "#d9a521", pede: "Tem horário amanhã?", ok: "✓ Marcado · amanhã 15h" },
  { nome: "Silva Advocacia", tipo: "Escritório de advocacia", ico: "⚖️", cor: "#8a6fd6", pede: "Petição nova pra revisar", ok: "✓ Analisada · 3 pontos a ajustar" },
  { nome: "Pizzaria Forno Velho", tipo: "Pizzaria", ico: "🍕", cor: "#e8743b", pede: "Pedido pelo site", ok: "✓ Pago no Pix · saiu pra entrega" },
  { nome: "Clínica Sorriso", tipo: "Clínica odontológica", ico: "🦷", cor: "#2fa7a0", pede: "Paciente sem voltar há 6 meses", ok: "✓ Lembrete de retorno enviado" },
  { nome: "Ponto Certo", tipo: "Loja", ico: "🛍️", cor: "#d6548a", pede: "Orçamento pedido às 22h", ok: "✓ Orçamento enviado" },
];
// Pins de referência (só cenário, como no Apple Maps).
const REFERENCIAS = [
  { nome: "Estacionamento", ico: "P", cor: "#2f6fe0" },
  { nome: "Farmácia", ico: "✚", cor: "#e0443b" },
  { nome: "Escola Municipal", ico: "🎓", cor: "#9a6b3f" },
  { nome: "Café da Esquina", ico: "☕", cor: "#e08a2c" },
];
const RUAS = ["Av. Central", "Rua das Flores", "Rua XV de Novembro", "Rua do Comércio"];

function temaAtual() {
  const t = document.documentElement.getAttribute("data-tema");
  if (t === "claro" || t === "escuro") return t;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro";
}

// Aleatório com semente: a cidade sai igual em toda visita.
let semente = 11;
const rnd = () => ((semente = (semente * 16807) % 2147483647) - 1) / 2147483646;

const celular = () => innerWidth < 980;
const N = celular() ? 7 : 11; // quadras por lado
const P = 13; // passo: 10 de quadra + 3 de rua
const META = (N * P) / 2;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "low-power" });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
const cena = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, 1, 700);
const ceu = new THREE.HemisphereLight(0xffffff, 0xc9c2b2, 1.7);
const sol = new THREE.DirectionalLight(0xffffff, 1.3);
sol.position.set(-50, 90, 40);
cena.add(ceu, sol);

const mat = {};
for (const k of ["rua", "quadra", "praca", "parque", "arvore", "tronco", "vidro", "detalhe", "topo", "telhadoA", "telhadoB"]) mat[k] = new THREE.MeshLambertMaterial();
mat.predio = new THREE.MeshLambertMaterial({ vertexColors: true });
mat.carro = new THREE.MeshLambertMaterial();

// Caixa com "sombra de contato": vértices de baixo mais escuros, como o Apple Maps.
function caixaAO(escuroBase = 0.74) {
  const g = new THREE.BoxGeometry(1, 1, 1);
  g.translate(0, 0.5, 0);
  const pos = g.attributes.position, cores = [];
  for (let i = 0; i < pos.count; i++) { const c = escuroBase + (1 - escuroBase) * pos.getY(i); cores.push(c, c, c); }
  g.setAttribute("color", new THREE.Float32BufferAttribute(cores, 3));
  return g;
}
const caixa = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
const tmp = new THREE.Object3D();
function matriz(x, y, z, sx, sy, sz, ry = 0) {
  tmp.position.set(x, y, z); tmp.scale.set(sx, sy, sz); tmp.rotation.set(0, ry, 0); tmp.updateMatrix();
  return tmp.matrix.clone();
}
function instanciar(geo, material, lista) {
  const m = new THREE.InstancedMesh(geo, material, Math.max(1, lista.length));
  lista.forEach((mt, k) => m.setMatrixAt(k, mt));
  m.count = lista.length;
  cena.add(m);
  return m;
}

const chao = new THREE.Mesh(new THREE.PlaneGeometry(N * P * 4, N * P * 4), mat.rua);
chao.rotation.x = -Math.PI / 2;
cena.add(chao);

// ------------------------------------------------------------- a cidade
const placas = { quadra: [], parque: [], praca: [] };
const blocos = []; // prédios: { m: matriz, tom }
const detalhes = [], arvores = [], troncos = [], telhadosA = [], telhadosB = [];
const lotesLivres = [];
const centro = [Math.floor(N / 2), Math.floor(N / 2) - 1]; // quadra da praça

function predio(x, z, w, d, h) {
  const tipo = rnd();
  const tom = rnd();
  if (h > 9 && tipo < 0.5) { // torre com recuo
    const base = 2 + rnd() * 2;
    blocos.push({ m: matriz(x, 0.3, z, w, base, d), tom });
    blocos.push({ m: matriz(x, 0.3 + base, z, w * 0.72, h - base, d * 0.72), tom });
    blocos.push({ m: matriz(x, 0.3 + h, z, w * 0.42, 1.2 + rnd() * 2, d * 0.42), tom });
  } else if (tipo < 0.62) { // em X, como os da imagem
    blocos.push({ m: matriz(x, 0.3, z, w, h, d * 0.4), tom });
    blocos.push({ m: matriz(x, 0.3, z, w * 0.4, h, d), tom });
  } else if (tipo < 0.78) { // em L
    blocos.push({ m: matriz(x - w * 0.18, 0.3, z, w * 0.64, h, d), tom });
    blocos.push({ m: matriz(x + w * 0.18, 0.3, z - d * 0.22, w * 0.64, h * 0.7, d * 0.56), tom });
  } else {
    blocos.push({ m: matriz(x, 0.3, z, w, h, d), tom });
  }
  // máquinas no telhado
  if (rnd() < 0.55) detalhes.push(matriz(x + (rnd() - 0.5) * w * 0.4, 0.3 + h, z + (rnd() - 0.5) * d * 0.3, 0.7, 0.35, 0.5));
}

function arvore(x, z, s) {
  troncos.push(matriz(x, 0.3, z, 0.18, 0.9 * s, 0.18));
  arvores.push(matriz(x, 0.3 + 1.25 * s, z, 0.85 * s, 0.95 * s, 0.85 * s));
}

for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
  const x = (i - (N - 1) / 2) * P, z = (j - (N - 1) / 2) * P;
  if (i === centro[0] && j === centro[1]) { // praça com 2 prédios baixos de telhado colorido
    placas.praca.push(matriz(x, 0, z, 10, 0.32, 10));
    blocos.push({ m: matriz(x + 2.4, 0.3, z - 1.2, 4.2, 2.6, 6.5), tom: 0.2 });
    telhadosA.push(matriz(x + 2.4, 2.92, z - 1.2, 3.8, 0.12, 6.1));
    blocos.push({ m: matriz(x - 2.6, 0.3, z + 2.6, 4, 2, 4), tom: 0.3 });
    telhadosB.push(matriz(x - 2.6, 2.32, z + 2.6, 3.6, 0.12, 3.6));
    placas.parque.push(matriz(x - 2.6, 0.02, z - 2.8, 3.8, 0.33, 3));
    for (let k = 0; k < 4; k++) arvore(x - 4 + k * 1.1, z - 4.4, 0.6);
    continue;
  }
  if (rnd() < 0.1) { // parque
    placas.parque.push(matriz(x, 0, z, 10, 0.32, 10));
    for (let k = 0; k < 10; k++) arvore(x - 4 + rnd() * 8, z - 4 + rnd() * 8, 0.8 + rnd() * 0.6);
    continue;
  }
  placas.quadra.push(matriz(x, 0, z, 10, 0.3, 10));
  for (const [dx, dz] of [[-2.5, -2.5], [2.5, -2.5], [-2.5, 2.5], [2.5, 2.5]]) {
    if (rnd() < 0.08) continue;
    const dist = Math.hypot(x, z) / META;
    const h = 2 + rnd() * 4 + Math.max(0, 1 - dist) ** 1.5 * rnd() * 17;
    lotesLivres.push({ x: x + dx, z: z + dz, w: 3.8 + rnd() * 0.6, d: 3.8 + rnd() * 0.6, h });
  }
  // árvores de calçada
  if (rnd() < 0.45) { const lado = rnd() < 0.5 ? -5.6 : 5.6; for (let k = -1; k <= 1; k++) arvore(x + k * 3.2, z + lado, 0.55); }
  if (rnd() < 0.3) { const lado = rnd() < 0.5 ? -5.6 : 5.6; for (let k = -1; k <= 1; k++) arvore(x + lado, z + k * 3.2, 0.55); }
}

// Negócios e referências: lotes perto do centro, espalhados.
const perto = lotesLivres.filter((l) => Math.hypot(l.x, l.z) < META * 0.6).sort(() => rnd() - 0.5);
const escolhidos = [], refs = [];
for (const l of perto) {
  const longe = (lista, dmin) => lista.every((e) => Math.hypot(e.x - l.x, e.z - l.z) > dmin);
  if (escolhidos.length < NEGOCIOS.length && longe(escolhidos, P * 1.3)) { l.h = 2.4 + rnd() * 1.2; l.negocio = true; escolhidos.push(l); }
  else if (refs.length < REFERENCIAS.length && longe(escolhidos, P * 0.8) && longe(refs, P * 1.5)) { l.h = Math.min(l.h, 4); refs.push(l); }
}
for (const l of lotesLivres) {
  if (l.negocio) blocos.push({ m: matriz(l.x, 0.3, l.z, l.w, l.h, l.d), tom: 0.1 });
  else predio(l.x, l.z, l.w, l.d, l.h);
}

const geoAO = caixaAO();
const predios = instanciar(geoAO, mat.predio, blocos.map((b) => b.m));
instanciar(caixa, mat.quadra, placas.quadra);
instanciar(caixa, mat.parque, placas.parque);
instanciar(caixa, mat.praca, placas.praca);
instanciar(caixa, mat.detalhe, detalhes);
instanciar(caixa, mat.telhadoA, telhadosA);
instanciar(caixa, mat.telhadoB, telhadosB);
instanciar(new THREE.CylinderGeometry(1, 1, 1, 5).translate(0, 0.5, 0), mat.tronco, troncos);
instanciar(new THREE.IcosahedronGeometry(1, 1), mat.arvore, arvores);
instanciar(caixa, mat.topo, escolhidos.map((l) => matriz(l.x, 0.3 + l.h, l.z, l.w * 0.98, 0.22, l.d * 0.98)));

// ------------------------------------------------------------- carros estilo Tesla
const nCarros = celular() ? 14 : 30;
const rotas = Array.from({ length: nCarros }, () => {
  const linha = (Math.floor(rnd() * N) - (N - 1) / 2) * P + (P / 2) * (rnd() < 0.5 ? 1 : -1);
  const v = (3.5 + rnd() * 4) * (rnd() < 0.5 ? 1 : -1);
  // mão certa: cada sentido na sua faixa
  return { eixoX: rnd() < 0.5, linha: linha + (v > 0 ? 0.65 : -0.65), t: rnd() * 2 * META - META, v, cor: Math.floor(rnd() * 5) };
});
const geoCarro = new RoundedBoxGeometry(1.9, 0.5, 0.92, 3, 0.2).translate(0, 0.5, 0);
const geoCabine = new RoundedBoxGeometry(1.08, 0.42, 0.8, 3, 0.18).translate(-0.12, 0.88, 0);
const geoRoda = new THREE.CylinderGeometry(0.2, 0.2, 0.16, 10).rotateX(Math.PI / 2);
const geoFarol = new THREE.BoxGeometry(0.06, 0.1, 0.22);
const carros = new THREE.InstancedMesh(geoCarro, mat.carro, nCarros);
const cabines = new THREE.InstancedMesh(geoCabine, mat.vidro, nCarros);
const rodas = new THREE.InstancedMesh(geoRoda, mat.pneu = new THREE.MeshLambertMaterial({ color: 0x1d1d1f }), nCarros * 4);
const farois = new THREE.InstancedMesh(geoFarol, mat.farol = new THREE.MeshLambertMaterial(), nCarros * 2);
cena.add(carros, cabines, rodas, farois);
const RODAS = [[0.58, 0.25, 0.42], [0.58, 0.25, -0.42], [-0.58, 0.25, 0.42], [-0.58, 0.25, -0.42]];
const FAROIS = [[0.95, 0.55, 0.28], [0.95, 0.55, -0.28]];
const local = new THREE.Matrix4();
function posicionarCarros() {
  rotas.forEach((r, k) => {
    const ry = r.eixoX ? (r.v > 0 ? 0 : Math.PI) : (r.v > 0 ? -Math.PI / 2 : Math.PI / 2);
    const m = r.eixoX ? matriz(r.t, 0.3, r.linha, 1, 1, 1, ry) : matriz(r.linha, 0.3, r.t, 1, 1, 1, ry);
    carros.setMatrixAt(k, m);
    cabines.setMatrixAt(k, m);
    RODAS.forEach(([x, y, z], i) => rodas.setMatrixAt(k * 4 + i, local.makeTranslation(x, y, z).premultiply(m)));
    FAROIS.forEach(([x, y, z], i) => farois.setMatrixAt(k * 2 + i, local.makeTranslation(x, y, z).premultiply(m)));
  });
  carros.instanceMatrix.needsUpdate = cabines.instanceMatrix.needsUpdate = rodas.instanceMatrix.needsUpdate = farois.instanceMatrix.needsUpdate = true;
}

// ------------------------------------------------------------- tema
const cor = new THREE.Color();
function aplicarTema() {
  const tema = temaAtual(), p = PALETA[tema], escuro = tema === "escuro";
  const fundo = new THREE.Color(p.fundo);
  renderer.setClearColor(fundo);
  cena.fog = new THREE.Fog(fundo, 70, celular() ? 170 : 210);
  for (const k of ["rua", "quadra", "praca", "parque", "arvore", "tronco", "vidro", "detalhe", "topo"]) mat[k].color.set(p[k]);
  mat.telhadoA.color.set(p.telhado[0]);
  mat.telhadoB.color.set(p.telhado[1]);
  mat.topo.emissive.set(escuro ? p.topo : 0x000000);
  mat.topo.emissiveIntensity = 0.35;
  const c0 = new THREE.Color(p.predio[0]), c1 = new THREE.Color(p.predio[1]);
  blocos.forEach((b, k) => predios.setColorAt(k, cor.copy(c0).lerp(c1, b.tom)));
  predios.instanceColor.needsUpdate = true;
  rotas.forEach((r, k) => carros.setColorAt(k, cor.set(p.carro[r.cor])));
  carros.instanceColor.needsUpdate = true;
  mat.farol.color.set(escuro ? 0xfff2c4 : 0xf4f4f4);
  mat.farol.emissive.set(escuro ? 0xffe9a0 : 0x000000);
  ceu.intensity = escuro ? 1.25 : 1.7;
  sol.intensity = escuro ? 1.1 : 1.3;
  desenhar();
}

// ------------------------------------------------------------- camada HTML (pins, ruas, bússola)
function criarPin(info, l, ativo) {
  const b = document.createElement(ativo ? "button" : "span");
  b.className = ativo ? "pin" : "pin pin-ref";
  b.style.setProperty("--c", info.cor);
  if (ativo) { b.type = "button"; b.setAttribute("aria-label", `${info.nome}, exemplo`); }
  b.innerHTML = `<span class="ico">${info.ico}</span><span class="nome">${info.nome}</span>${ativo ? '<span class="balao"></span>' : ""}`;
  camadaPins.append(b);
  return { el: b, balao: b.querySelector(".balao"), info, alvo: new THREE.Vector3(l.x, 0.3 + l.h + 0.5, l.z), feitas: 3 + Math.floor(rnd() * 6) };
}
const pins = escolhidos.map((l, k) => criarPin(NEGOCIOS[k], l, true));
const pinsRef = refs.map((l, k) => criarPin(REFERENCIAS[k], l, false));
for (const p of pins) {
  p.el.addEventListener("pointerenter", () => mostrarCard(p));
  p.el.addEventListener("focus", () => mostrarCard(p));
  p.el.addEventListener("click", () => mostrarCard(p));
  p.el.addEventListener("pointerleave", esconderCard);
}

// Nomes de rua: ficam deitados no sentido da rua.
const ruas = RUAS.map((nome, k) => {
  const el = document.createElement("span");
  el.className = "rua-nome";
  el.textContent = nome;
  camadaPins.append(el);
  const linha = ((k % 2 ? 1 : -1) * (Math.floor(k / 2) + 0.5)) * P;
  const eixoX = k % 2 === 0;
  const a = eixoX ? new THREE.Vector3(-P * 0.9, 0.3, linha) : new THREE.Vector3(linha, 0.3, -P * 0.9);
  const b = eixoX ? new THREE.Vector3(P * 0.9, 0.3, linha) : new THREE.Vector3(linha, 0.3, P * 0.9);
  return { el, a, b };
});

const bussola = document.createElement("div");
bussola.className = "mapa-bussola";
bussola.innerHTML = '<span class="agulha"><b>N</b></span>';
raiz.append(bussola);
const agulha = bussola.firstChild;

let cardTimer;
function mostrarCard(s) {
  clearTimeout(cardTimer);
  pins.forEach((p) => p.el.classList.toggle("ativo", p === s));
  card.innerHTML = `<b>${s.info.nome}</b><small>${s.info.tipo} · exemplo</small><p>${s.feitas} pedidos resolvidos hoje · <em>sem parar o atendimento</em></p>`;
  card.classList.add("on");
  cardTimer = setTimeout(esconderCard, 4500);
}
function esconderCard() {
  pins.forEach((p) => p.el.classList.remove("ativo"));
  card.classList.remove("on");
}

const v = new THREE.Vector3(), v2 = new THREE.Vector3();
function tela(vec) {
  v.copy(vec).project(camera);
  return { x: (v.x * 0.5 + 0.5) * canvas.clientWidth, y: (-v.y * 0.5 + 0.5) * canvas.clientHeight, atras: v.z > 1 };
}
function posicionarCamadas() {
  const w = canvas.clientWidth, h = canvas.clientHeight, minX = celular() ? 16 : w * 0.46;
  for (const p of [...pins, ...pinsRef]) {
    const s = tela(p.alvo);
    const fora = s.atras || s.x < minX || s.x > w - 16 || s.y < 40 || s.y > h - 10;
    p.el.style.visibility = fora ? "hidden" : "visible";
    p.el.classList.toggle("direita", s.x > w * 0.6);
    p.el.style.transform = `translate(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px) translate(-15px, -100%)`;
  }
  for (const r of ruas) {
    const a = tela(r.a), b = tela(r.b);
    let ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    if (ang > 90) ang -= 180; else if (ang < -90) ang += 180;
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const fora = a.atras || b.atras || mx < minX + 30 || mx > w - 30 || my < 30 || my > h - 20;
    r.el.style.visibility = fora ? "hidden" : "visible";
    r.el.style.transform = `translate(${mx.toFixed(1)}px, ${my.toFixed(1)}px) translate(-50%, -50%) rotate(${ang.toFixed(1)}deg)`;
  }
  agulha.style.transform = `rotate(${(angulo * 180 / Math.PI).toFixed(1)}deg)`;
}

// ------------------------------------------------------------- câmera e quadro
let angulo = 0.55;
function posicionarCamera() {
  const cel = celular();
  const r = cel ? 74 : 82, alt = cel ? 70 : 66;
  camera.position.set(Math.sin(angulo) * r, alt, Math.cos(angulo) * r);
  camera.lookAt(0, 0, 0);
}
function redimensionar() {
  const w = raiz.clientWidth, h = raiz.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  // No desktop o texto fica à esquerda: a cidade vai pra direita.
  if (!celular()) camera.setViewOffset(w, h, -w * 0.24, h * 0.04, w, h); else camera.clearViewOffset();
  camera.updateProjectionMatrix();
  desenhar();
}
function desenhar() {
  posicionarCamera();
  posicionarCarros();
  renderer.render(cena, camera);
  posicionarCamadas();
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let rodando = false;
async function cicloBaloes() {
  for (let k = 0; ; k = (k + 1) % pins.length) {
    while (!rodando) await espera(400);
    const p = pins[k];
    p.balao.textContent = p.info.pede;
    p.balao.classList.remove("ok");
    p.balao.classList.add("on");
    await espera(1800);
    p.balao.textContent = p.info.ok;
    p.balao.classList.add("ok");
    p.feitas++;
    await espera(2300);
    p.balao.classList.remove("on");
    await espera(450);
  }
}

let ultimo = performance.now();
function quadro(agora) {
  const dt = Math.min(0.05, (agora - ultimo) / 1000);
  ultimo = agora;
  if (rodando) {
    angulo += dt * 0.03;
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
  redimensionar();
  pins.slice(0, 3).forEach((p) => { p.balao.textContent = p.info.ok; p.balao.classList.add("on", "ok"); });
} else {
  new IntersectionObserver((es) => (rodando = es[0].isIntersecting && !document.hidden)).observe(raiz);
  document.addEventListener("visibilitychange", () => (rodando = !document.hidden && raiz.getBoundingClientRect().bottom > 0));
  requestAnimationFrame(quadro);
  cicloBaloes();
}
