/* ============================================================
   The AI Fluency Playbook — landing hero backdrop

   A quiet WebGL layer behind the sales page: soft particles, three
   thin orbits and a barely-there frame, plus a small pointer tilt on
   the lesson card. It has to stay cheap: no lights, no shadows, no
   post-processing, and nothing renders while the hero is off screen.
   ============================================================ */
const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";

const canvas = document.querySelector("#lpScene");
const art = document.querySelector(".lp-hero-art");
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let tiltX = 0;
let tiltY = 0;

/* the card tilt works even if WebGL is unavailable */
if (art && window.matchMedia("(pointer:fine)").matches && !reduced()) {
  window.addEventListener("pointermove", (e) => {
    tiltY = ((e.clientX / window.innerWidth) * 2 - 1) * 3.4;
    tiltX = -((e.clientY / window.innerHeight) * 2 - 1) * 2.6;
    art.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
    art.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
  }, { passive: true });
}

async function start() {
  if (!canvas) return;
  let THREE;
  try {
    THREE = await import(THREE_URL);
  } catch (e) {
    canvas.remove();
    return;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  } catch (e) {
    canvas.remove();
    return;
  }

  const small = window.matchMedia("(max-width: 900px)").matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const group = new THREE.Group();
  scene.add(group);

  /* one soft dot, reused for every particle */
  const dot = document.createElement("canvas");
  dot.width = dot.height = 64;
  const dctx = dot.getContext("2d");
  const grad = dctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.4, "rgba(255,255,255,.5)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  dctx.fillStyle = grad;
  dctx.fillRect(0, 0, 64, 64);
  const dotTex = new THREE.CanvasTexture(dot);
  dotTex.colorSpace = THREE.SRGBColorSpace;

  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: dotTex, color: 0x5ce1ff, transparent: true, opacity: 0.16,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  halo.scale.setScalar(9.5);
  halo.position.z = -2;
  group.add(halo);

  /* the same shell the course's 3D lesson builds, kept almost invisible */
  group.add(new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(3.15, 1)),
    new THREE.LineBasicMaterial({ color: 0xc8ff4d, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false })
  ));

  const rings = [];
  [[3.5, 0x5ce1ff, 0.16, Math.PI / 2.3, 0.3], [4.35, 0xa78bfa, 0.1, Math.PI / 1.8, -0.6]]
    .forEach(([r, color, opacity, tilt, turn]) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.006, 6, 220),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      ring.rotation.x = tilt;
      ring.rotation.z = turn;
      group.add(ring);
      rings.push(ring);
    });

  const count = small ? 320 : 720;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 2.6 + Math.random() * 8;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.cos(ph) * 0.7;
    pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const points = new THREE.Points(geo, new THREE.PointsMaterial({
    color: 0xd8e4f7, size: 0.055, map: dotTex, transparent: true, opacity: 0.4,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  }));
  scene.add(points);

  function resize() {
    const host = canvas.parentElement;
    const w = host.clientWidth || window.innerWidth;
    const h = host.clientHeight || 620;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const wide = w > 900;
    group.position.set(wide ? 2.7 : 0, wide ? 0.1 : 1.1, 0);
    group.scale.setScalar(wide ? 0.92 : 0.72);
    halo.material.opacity = wide ? 0.16 : 0.1;
  }
  window.addEventListener("resize", resize);
  resize();

  if (reduced()) {
    group.rotation.set(0.16, 0.4, 0);
    renderer.render(scene, camera);
    window.addEventListener("resize", () => renderer.render(scene, camera));
    return;
  }

  let onScreen = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }, { threshold: 0 }).observe(canvas);
  }

  let mx = 0, my = 0;
  window.addEventListener("pointermove", (e) => {
    mx = (e.clientX / window.innerWidth) * 2 - 1;
    my = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  const clock = new THREE.Clock();
  let t = 0;
  (function frame() {
    requestAnimationFrame(frame);
    if (!onScreen || document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    t += dt;
    const scroll = window.scrollY * 0.0009;
    group.rotation.y += (0.18 + mx * 0.16 + scroll * 0.5 + Math.sin(t * 0.16) * 0.08 - group.rotation.y) * 0.03;
    group.rotation.x += (my * 0.1 + Math.cos(t * 0.13) * 0.04 - group.rotation.x) * 0.03;
    rings.forEach((ring, i) => { ring.rotation.z += dt * (i ? -0.035 : 0.045); });
    points.rotation.y += dt * 0.008;
    renderer.render(scene, camera);
  })();
}

start();
