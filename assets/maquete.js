// Maquete da personalização (home v5, 13/10/2026). Uma base com a IA girando no meio;
// as peças do sistema descem e encaixam num arranjo diferente para cada tipo de negócio
// (imobiliária, advocacia, clínica, indústria). A ideia: nada vem de catálogo, cada
// negócio tem o seu encaixe. Segue o tema, para fora da tela e, com animação reduzida,
// fica parada no primeiro arranjo.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const canvas = document.getElementById("maquete-canvas");
const palco = canvas?.parentElement;
const camadaRot = document.getElementById("maquete-rotulos");
const placaNome = document.querySelector("#maquete-negocio b");
const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

// x, z = posição na base (grade de -6 a 6); w, d = tamanho; h = altura; c = cor (0 ouro, 1 tinta, 2 verde, 3 azul)
const NEGOCIOS = [
  { nome: "Imobiliária", pecas: [
    { t: "Captação de imóveis", x: -4, z: -3.5, w: 4, d: 3, h: 1.6, c: 0 },
    { t: "Visitas na agenda", x: 4, z: -3.5, w: 4, d: 3, h: 1.1, c: 2 },
    { t: "Interessado qualificado", x: -4, z: 3.5, w: 4, d: 3, h: 2.2, c: 1 },
    { t: "Proposta em PDF", x: 4, z: 3.5, w: 4, d: 3, h: 1.4, c: 3 } ] },
  { nome: "Advocacia", pecas: [
    { t: "Prazos dos processos", x: -4.5, z: 0, w: 3, d: 9, h: 1.3, c: 1 },
    { t: "Análise de petição", x: 3.5, z: -3.5, w: 5, d: 3, h: 2.4, c: 0 },
    { t: "Clientes e casos", x: 3.5, z: 3.5, w: 5, d: 3, h: 1.2, c: 3 } ] },
  { nome: "Clínica", pecas: [
    { t: "Agenda", x: 0, z: -4.5, w: 9, d: 2.6, h: 1.2, c: 2 },
    { t: "Confirmação", x: -4.5, z: 2, w: 3, d: 4, h: 1.7, c: 0 },
    { t: "Retorno de pacientes", x: 4.5, z: 2, w: 3, d: 4, h: 2.3, c: 1 },
    { t: "Financeiro", x: 0, z: 5, w: 3.4, d: 2, h: 0.9, c: 3 } ] },
  { nome: "Indústria", pecas: [
    { t: "Pedidos", x: -4, z: -4, w: 4, d: 3, h: 2, c: 0 },
    { t: "Orçamentos", x: 4, z: -4, w: 4, d: 3, h: 1.3, c: 3 },
    { t: "Representantes", x: -4.5, z: 3.5, w: 3, d: 4, h: 1.1, c: 2 },
    { t: "Estoque", x: 3.5, z: 4, w: 5, d: 2.6, h: 2.6, c: 1 } ] },
];

const CORES = {
  claro: { base: 0xfffdf8, borda: 0xe4ded1, pecas: [0xd9b13a, 0x2b2822, 0x7fb98a, 0x7fa6d6], ia: 0xe0c050 },
  escuro: { base: 0x221f19, borda: 0x37332b, pecas: [0xe0c050, 0xefe9dc, 0x6fae7c, 0x7fa6e0], ia: 0xf0d36a },
};
const tema = () => {
  const t = document.documentElement.getAttribute("data-tema");
  return t === "claro" || t === "escuro" ? t : matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro";
};

if (canvas) iniciar();

function iniciar() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  const cena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 200);
  camera.position.set(22, 22, 22);
  camera.lookAt(0, 0, 0);
  const ceu = new THREE.HemisphereLight(0xffffff, 0xbdb6a5, 1.8);
  const sol = new THREE.DirectionalLight(0xffffff, 1.4);
  sol.position.set(-10, 20, 8);
  cena.add(ceu, sol);

  const grupo = new THREE.Group();
  cena.add(grupo);
  const matBase = new THREE.MeshLambertMaterial();
  const base = new THREE.Mesh(new RoundedBoxGeometry(16, 0.8, 16, 4, 0.35), matBase);
  base.position.y = -0.4;
  grupo.add(base);
  // Ranhuras da base: a planta do negócio desenhada no chão.
  const matLinha = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.5 });
  const pts = [];
  for (let k = -6; k <= 6; k += 3) pts.push(new THREE.Vector3(k, 0.02, -7), new THREE.Vector3(k, 0.02, 7), new THREE.Vector3(-7, 0.02, k), new THREE.Vector3(7, 0.02, k));
  grupo.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), matLinha));

  // IA no centro: núcleo dourado girando com um anel.
  const matIA = new THREE.MeshStandardMaterial({ metalness: 0.55, roughness: 0.3, emissiveIntensity: 0.25 });
  const nucleo = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), matIA);
  nucleo.position.y = 2.2;
  const anel = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.07, 8, 48), matIA);
  anel.position.y = 2.2;
  anel.rotation.x = Math.PI / 2.4;
  grupo.add(nucleo, anel);
  const rotIA = document.createElement("span");
  rotIA.className = "mq-rot on";
  rotIA.textContent = "IA no meio";
  camadaRot.append(rotIA);

  const matsPeca = [0, 1, 2, 3].map(() => new THREE.MeshLambertMaterial());
  let pecas = []; // { mesh, alvoY, y, v, rot }

  function aplicarTema() {
    const c = CORES[tema()];
    matBase.color.set(c.base);
    matLinha.color.set(c.borda);
    matsPeca.forEach((m, k) => m.color.set(c.pecas[k]));
    matIA.color.set(c.ia);
    matIA.emissive.set(c.ia);
  }

  function montar(idx, instantaneo) {
    const n = NEGOCIOS[idx];
    placaNome.textContent = n.nome;
    for (const p of pecas) { grupo.remove(p.mesh); p.rot.remove(); }
    pecas = n.pecas.map((d, k) => {
      const mesh = new THREE.Mesh(new RoundedBoxGeometry(d.w - 0.3, d.h, d.d - 0.3, 3, 0.18), matsPeca[d.c]);
      const y0 = instantaneo ? d.h / 2 : 9 + k * 2.2;
      mesh.position.set(d.x, y0, d.z);
      grupo.add(mesh);
      const rot = document.createElement("span");
      rot.className = "mq-rot";
      rot.textContent = d.t;
      camadaRot.append(rot);
      return { mesh, alvoY: d.h / 2, y: y0, v: 0, rot, topo: d.h, pousou: instantaneo };
    });
  }

  const v = new THREE.Vector3();
  function rotulos() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const pos = (x, y, z, el) => {
      v.set(x, y, z).applyMatrix4(grupo.matrixWorld).project(camera);
      el.style.transform = `translate(${((v.x * 0.5 + 0.5) * w).toFixed(1)}px, ${((-v.y * 0.5 + 0.5) * h).toFixed(1)}px) translate(-50%, -130%)`;
    };
    for (const p of pecas) { pos(p.mesh.position.x, p.mesh.position.y + p.topo / 2, p.mesh.position.z, p.rot); p.rot.classList.toggle("on", p.pousou); }
    pos(0, 5.2, 0, rotIA);
  }

  function redimensionar() {
    const w = palco.clientWidth, h = palco.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  let idx = 0, rodando = false, ultimo = performance.now(), desde = 0;
  function quadro(agora) {
    const dt = Math.min(0.05, (agora - ultimo) / 1000);
    ultimo = agora;
    if (rodando) {
      desde += dt;
      grupo.rotation.y += dt * 0.12;
      nucleo.rotation.y += dt * 0.8;
      nucleo.rotation.x += dt * 0.3;
      anel.rotation.z += dt * 0.6;
      // queda com mola: desce, quica de leve e assenta
      for (const p of pecas) {
        if (p.pousou) continue;
        p.v -= 38 * dt;
        p.y += p.v * dt;
        if (p.y <= p.alvoY) { p.y = p.alvoY; p.v = Math.abs(p.v) > 3 ? -p.v * 0.28 : 0; if (!p.v) p.pousou = true; }
        p.mesh.position.y = p.y;
      }
      if (desde > 5.2) { desde = 0; idx = (idx + 1) % NEGOCIOS.length; montar(idx, false); }
      renderer.render(cena, camera);
      rotulos();
    }
    requestAnimationFrame(quadro);
  }

  aplicarTema();
  new MutationObserver(aplicarTema).observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });
  new ResizeObserver(() => { redimensionar(); renderer.render(cena, camera); rotulos(); }).observe(palco);
  montar(0, reduz);
  redimensionar();
  if (reduz) {
    grupo.rotation.y = 0.4;
    renderer.render(cena, camera);
    rotulos();
    new MutationObserver(() => { renderer.render(cena, camera); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });
  } else {
    new IntersectionObserver((es) => (rodando = es[0].isIntersecting)).observe(palco);
    requestAnimationFrame(quadro);
  }
}
