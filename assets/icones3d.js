// Ícones 3D da home (ouro, grafite e creme), feitos com Three.js.
// Um único renderer WebGL desenha cada ícone e copia o quadro pro <canvas data-ico> dele,
// então são N ícones com 1 contexto WebGL só. Só anima o que está na tela.
// Hover no card = giro de 360°. Animação reduzida = quadro parado.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const alvos = [...document.querySelectorAll("canvas[data-ico]")];
if (alvos.length) iniciar();

function iniciar() {
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAM = 220, DPR = Math.min(devicePixelRatio || 1, 2);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(DPR);
  renderer.setSize(TAM, TAM, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const env = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;

  const M = {
    ouro: new THREE.MeshPhysicalMaterial({ color: 0xd9b54a, metalness: 0.9, roughness: 0.26, clearcoat: 0.4 }),
    grafite: new THREE.MeshPhysicalMaterial({ color: 0x2a2620, metalness: 0.25, roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.2 }),
    creme: new THREE.MeshPhysicalMaterial({ color: 0xf4ecd6, metalness: 0, roughness: 0.45, clearcoat: 0.3 }),
    verde: new THREE.MeshPhysicalMaterial({ color: 0x25d366, metalness: 0.1, roughness: 0.35, clearcoat: 0.5 }),
    vermelho: new THREE.MeshPhysicalMaterial({ color: 0xc64545, metalness: 0.1, roughness: 0.35, clearcoat: 0.6 }),
  };
  const caixa = (w, h, d, m, r = 0.06) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2, h / 2, d / 2)), m);
  const cil = (rt, rb, h, m, s = 40) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, s), m);
  const esf = (r, m) => new THREE.Mesh(new THREE.SphereGeometry(r, 32, 20), m);
  const at = (o, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => { o.position.set(x, y, z); o.rotation.set(rx, ry, rz); return o; };
  const grupo = (...f) => { const g = new THREE.Group(); f.forEach((o) => g.add(o)); return g; };

  // ---------- modelos ----------
  const MODELOS = {
    relogio() { // 23h12
      const aro = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.11, 24, 64), M.ouro);
      const corpo = at(cil(0.8, 0.8, 0.22, M.grafite, 64), 0, 0, -0.04, Math.PI / 2);
      const face = at(cil(0.7, 0.7, 0.04, M.creme, 64), 0, 0, 0.09, Math.PI / 2);
      const h = at(caixa(0.07, 0.38, 0.05, M.ouro, 0.02), -0.09, 0.15, 0.14, 0, 0, 0.55);
      const m = at(caixa(0.05, 0.55, 0.05, M.ouro, 0.02), 0.05, 0.25, 0.15, 0, 0, -0.2);
      const c = at(esf(0.07, M.ouro), 0, 0, 0.16);
      const pinos = [0, 1, 2, 3].map((k) => at(caixa(0.06, 0.14, 0.04, M.grafite, 0.02), Math.sin(k * Math.PI / 2) * 0.58, Math.cos(k * Math.PI / 2) * 0.58, 0.12, 0, 0, -k * Math.PI / 2));
      return grupo(aro, corpo, face, h, m, c, ...pinos);
    },
    placa() { // foi pra outro lugar
      const poste = at(cil(0.06, 0.07, 1.9, M.grafite), 0, -0.1, 0);
      const base = at(cil(0.42, 0.48, 0.12, M.creme, 48), 0, -1.05, 0);
      const seta = (y, dir, mat) => {
        const s = new THREE.Shape();
        s.moveTo(-0.6, -0.17); s.lineTo(0.42, -0.17); s.lineTo(0.66, 0); s.lineTo(0.42, 0.17); s.lineTo(-0.6, 0.17); s.lineTo(-0.6, -0.17);
        const g = new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3 });
        g.center();
        const me = new THREE.Mesh(g, mat);
        me.position.set(dir * 0.32, y, 0); me.rotation.y = dir < 0 ? Math.PI : 0;
        return me;
      };
      return grupo(poste, base, seta(0.45, 1, M.ouro), seta(0.0, -1, M.creme));
    },
    caderno() { // anotado onde mesmo?
      const capa = at(caixa(1.15, 1.45, 0.14, M.grafite, 0.07), -0.08, 0, -0.05, 0, 0, 0.06);
      const folhas = at(caixa(1.05, 1.36, 0.1, M.creme, 0.04), -0.04, 0.02, 0.06, 0, 0, 0.06);
      const linhas = [0.35, 0.12, -0.11, -0.34].map((y, k) => at(caixa(0.7 - k * 0.08, 0.05, 0.02, M.grafite, 0.01), -0.06, y, 0.13, 0, 0, 0.06));
      const lapis = at(grupo(at(cil(0.07, 0.07, 1.2, M.ouro, 6), 0, 0, 0), at(cil(0.0, 0.07, 0.22, M.creme, 6), 0, -0.71, 0), at(cil(0.072, 0.072, 0.12, M.vermelho, 12), 0, 0.64, 0)), 0.55, -0.05, 0.25, 0, 0, 0.55);
      return grupo(capa, folhas, ...linhas, lapis);
    },
    conversas() { // dez conversas abertas
      const b1 = at(caixa(1.2, 0.72, 0.22, M.creme, 0.22), -0.18, 0.2, 0);
      const r1 = at(cil(0, 0.14, 0.26, M.creme, 4), -0.5, -0.2, 0, 0, 0, 0.6);
      const b2 = at(caixa(1.0, 0.6, 0.2, M.grafite, 0.2), 0.32, -0.42, 0.22);
      const pts = [-0.42, -0.18, 0.06].map((x) => at(esf(0.075, M.ouro), x, 0.2, 0.13));
      const badge = at(esf(0.2, M.vermelho), 0.5, 0.58, 0.08);
      return grupo(b1, r1, b2, ...pts, badge);
    },
    site() { // 01 site
      const janela = caixa(1.6, 1.15, 0.12, M.creme, 0.08);
      const barra = at(caixa(1.6, 0.2, 0.14, M.grafite, 0.06), 0, 0.48, 0.01);
      const bolas = [-0.66, -0.54, -0.42].map((x) => at(esf(0.035, M.ouro), x, 0.48, 0.09));
      const titulo = at(caixa(0.9, 0.12, 0.04, M.grafite, 0.03), -0.25, 0.18, 0.07);
      const sub = at(caixa(0.6, 0.07, 0.03, M.grafite, 0.02), -0.4, 0.0, 0.07);
      const botao = at(caixa(0.6, 0.18, 0.08, M.verde, 0.09), -0.35, -0.25, 0.08);
      const cel = at(grupo(caixa(0.42, 0.8, 0.08, M.grafite, 0.08), at(caixa(0.34, 0.66, 0.02, M.creme, 0.04), 0, 0, 0.05), at(caixa(0.24, 0.08, 0.02, M.verde, 0.03), 0, -0.2, 0.065)), 0.7, -0.35, 0.3, 0, -0.25, 0);
      return grupo(janela, barra, ...bolas, titulo, sub, botao, cel);
    },
    atendimento() { // 02 whatsapp
      const balao = caixa(1.35, 0.95, 0.26, M.verde, 0.3);
      const rabo = at(cil(0, 0.18, 0.3, M.verde, 4), -0.45, -0.52, 0, 0, 0, 0.5);
      const c1 = at(caixa(0.12, 0.34, 0.1, M.creme, 0.05), -0.16, -0.02, 0.15, 0, 0, 0.75);
      const c2 = at(caixa(0.12, 0.62, 0.1, M.creme, 0.05), 0.12, 0.08, 0.15, 0, 0, -0.65);
      const agenda = at(grupo(caixa(0.6, 0.52, 0.1, M.creme, 0.06), at(caixa(0.6, 0.14, 0.12, M.ouro, 0.05), 0, 0.2, 0.01), at(caixa(0.14, 0.12, 0.04, M.grafite, 0.02), -0.1, -0.06, 0.06)), 0.62, 0.5, 0.25, 0, -0.3, 0.12);
      return grupo(balao, rabo, c1, c2, agenda);
    },
    sistema() { // 03 sistema de gestão
      const base = at(caixa(1.7, 0.12, 1.0, M.creme, 0.05), 0, -0.6, 0);
      const alturas = [0.45, 0.7, 0.95, 1.3];
      const barras = alturas.map((h, k) => at(caixa(0.26, h, 0.26, k === 3 ? M.ouro : M.grafite, 0.05), -0.54 + k * 0.36, -0.54 + h / 2, 0));
      const curva = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.75, 0.0, 0.25), new THREE.Vector3(-0.2, 0.2, 0.25), new THREE.Vector3(0.2, 0.45, 0.25), new THREE.Vector3(0.7, 0.95, 0.25)]);
      const linha = new THREE.Mesh(new THREE.TubeGeometry(curva, 40, 0.035, 10), M.ouro);
      const ponta = at(cil(0, 0.1, 0.2, M.ouro, 16), 0.76, 1.05, 0.25, 0, 0, -0.6);
      return grupo(base, ...barras, linha, ponta);
    },
    engrenagem() { // 04 rotinas que rodam sozinhas
      const s = new THREE.Shape(), n = 10, R = 0.82, r = 0.64;
      for (let k = 0; k < n * 4; k++) {
        const a = (k / (n * 4)) * Math.PI * 2, raio = (k % 4 === 1 || k % 4 === 2) ? R : r;
        k ? s.lineTo(Math.cos(a) * raio, Math.sin(a) * raio) : s.moveTo(Math.cos(a) * raio, Math.sin(a) * raio);
      }
      const furo = new THREE.Path(); furo.absarc(0, 0, 0.26, 0, Math.PI * 2, true); s.holes.push(furo);
      const g = new THREE.ExtrudeGeometry(s, { depth: 0.22, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.04, bevelSegments: 3, curveSegments: 24 });
      g.center();
      const roda = new THREE.Mesh(g, M.ouro); roda.name = "gira";
      const eixo = at(cil(0.2, 0.2, 0.34, M.grafite, 32), 0, 0, 0, Math.PI / 2);
      const seta = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.045, 12, 64, Math.PI * 1.4), M.grafite);
      seta.rotation.z = 0.5;
      const pontaSeta = at(cil(0, 0.11, 0.22, M.grafite, 16), Math.cos(0.5 + Math.PI * 1.4) * 1.0, Math.sin(0.5 + Math.PI * 1.4) * 1.0, 0, 0, 0, 0.5 + Math.PI * 1.4);
      return grupo(roda, eixo, seta, pontaSeta);
    },
  };

  // ---------- uma cena por ícone ----------
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  cam.position.set(0, 0.2, 5.0); cam.lookAt(0, -0.15, 0);
  const itens = alvos.map((cv, i) => {
    const cena = new THREE.Scene();
    cena.environment = env;
    const luz = new THREE.DirectionalLight(0xfff4dc, 2.2); luz.position.set(3, 4, 5); cena.add(luz);
    cena.add(new THREE.AmbientLight(0xffffff, 0.35));
    const modelo = (MODELOS[cv.dataset.ico] || MODELOS.relogio)();
    const pivo = new THREE.Group(); pivo.add(modelo); cena.add(pivo);
    // sombra suave no "chão"
    const sombra = new THREE.Mesh(new THREE.CircleGeometry(0.95, 48), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.14 }));
    sombra.rotation.x = -Math.PI / 2; sombra.position.y = -1.25; sombra.scale.set(1, 0.55, 1); cena.add(sombra);
    cv.width = TAM * DPR; cv.height = TAM * DPR;
    const item = { cv, ctx: cv.getContext("2d"), cena, pivo, sombra, fase: i * 0.9, giro: 0, giroIni: -1, visivel: false, gira: modelo.getObjectByName("gira") };
    const card = cv.closest(".q, .painel");
    card?.addEventListener("pointerenter", () => { if (!reduz) item.giroIni = performance.now(); });
    return item;
  });

  const desenhar = (it, t) => {
    const y = reduz ? 0 : Math.sin(t * 1.3 + it.fase) * 0.08;
    let ry = reduz ? -0.35 : Math.sin(t * 0.6 + it.fase) * 0.38 - 0.1;
    if (it.giroIni >= 0) {
      const p = Math.max(0, Math.min(1, (performance.now() - it.giroIni) / 1300));
      ry += (1 - Math.pow(1 - p, 3)) * Math.PI * 2;
      if (p >= 1) it.giroIni = -1;
    }
    it.pivo.position.y = y; it.pivo.rotation.y = ry; it.pivo.rotation.x = 0.12;
    it.sombra.scale.set(1 - y * 0.6, 0.55 - y * 0.3, 1);
    if (it.gira && !reduz) it.gira.rotation.z = -t * 0.8;
    renderer.render(it.cena, cam);
    it.ctx.clearRect(0, 0, it.cv.width, it.cv.height);
    it.ctx.drawImage(renderer.domElement, 0, 0);
  };

  // 1a vez que aparece na tela: gira 360° (no celular não tem hover)
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const it = itens.find((x) => x.cv === e.target); if (!it) return;
    it.visivel = e.isIntersecting;
    if (e.isIntersecting && !it.jaGirou && !reduz && e.intersectionRatio > 0.6) { it.jaGirou = true; it.giroIni = performance.now() + 250; }
  }), { threshold: [0, 0.6] });
  itens.forEach((it) => io.observe(it.cv));

  if (reduz) { itens.forEach((it) => desenhar(it, 0)); return; }
  let ultimo = 0;
  const loop = (ms) => {
    requestAnimationFrame(loop);
    if (ms - ultimo < 1000 / 40) return; // 40 fps basta
    ultimo = ms;
    const t = ms / 1000;
    for (const it of itens) if (it.visivel) desenhar(it, t);
  };
  requestAnimationFrame(loop);
}
