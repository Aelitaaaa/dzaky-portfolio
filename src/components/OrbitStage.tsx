import { useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";

export default function OrbitStage({ enabled }: { enabled: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const impulse = useRef(0);

  useEffect(() => {
    const container = host.current;
    if (!container || !enabled) return;
    let cancelled = false;
    let dispose = () => {};

    void import("three").then((THREE) => {
      if (cancelled) return;
      const canvas = document.createElement("canvas");
      // Keep the typographic fallback when WebGL is unavailable.
      if (!canvas.getContext("webgl2", { alpha: true, antialias: true })) return;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);
      dispose = () => {
        renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
        delete container.dataset.rendered;
      };
      container.dataset.rendered = "true";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
      camera.position.set(0, 0.2, 7);
      const group = new THREE.Group();
      group.position.set(0.35, -0.65, 0);
      scene.add(group);

      const geometry = new THREE.IcosahedronGeometry(0.95, 0);
      const material = new THREE.MeshStandardMaterial({ color: "#b42b24", roughness: 0.72, metalness: 0.08, flatShading: true });
      const shape = new THREE.Mesh(geometry, material);
      const edges = new THREE.EdgesGeometry(geometry);
      const edgeMaterial = new THREE.LineBasicMaterial({ color: "#faf8f1", transparent: true, opacity: 0.8 });
      shape.add(new THREE.LineSegments(edges, edgeMaterial));
      group.add(shape);

      const orbitGeometry = new THREE.TorusGeometry(1.48, 0.008, 4, 100);
      const orbitMaterial = new THREE.MeshBasicMaterial({ color: "#847d74" });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.set(1.05, 0.25, -0.2);
      group.add(orbit);

      const satelliteGeometry = new THREE.SphereGeometry(0.055, 8, 8);
      const satelliteMaterial = new THREE.MeshBasicMaterial({ color: "#b42b24" });
      const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
      orbit.add(satellite);
      scene.add(new THREE.HemisphereLight("#ffffff", "#625b53", 2.8));
      const light = new THREE.DirectionalLight("#fff5e8", 3);
      light.position.set(2, 4, 5);
      scene.add(light);

      let frame = 0;
      let visible = false;
      let previous = 0;
      let elapsed = 0;
      let pointerX = 0;
      let pointerY = 0;
      let contextLost = false;
      const draw = (time: number) => {
        frame = 0;
        if (!visible || document.hidden || contextLost) return;
        const delta = Math.min((time - (previous || time)) / 1000, 0.05);
        previous = time;
        elapsed += delta;
        shape.rotation.y += delta * (0.22 + impulse.current);
        shape.rotation.x = Math.sin(elapsed * 0.3) * 0.16;
        impulse.current *= Math.exp(-delta * 2.5);
        group.rotation.y += (pointerX * 0.2 - group.rotation.y) * Math.min(1, delta * 5);
        group.rotation.x += (pointerY * 0.12 - group.rotation.x) * Math.min(1, delta * 5);
        satellite.position.set(Math.cos(elapsed * 0.5) * 1.48, Math.sin(elapsed * 0.5) * 1.48, 0);
        renderer.render(scene, camera);
        frame = requestAnimationFrame(draw);
      };
      const resume = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
        if (visible && !document.hidden && !contextLost) frame = requestAnimationFrame(draw);
      };
      const resize = () => {
        const { width, height } = container.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        if (!contextLost) renderer.render(scene, camera);
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const box = container.getBoundingClientRect();
        pointerX = (event.clientX - box.left) / box.width - 0.5;
        pointerY = (event.clientY - box.top) / box.height - 0.5;
      };
      const leave = () => { pointerX = 0; pointerY = 0; };
      const lost = (event: Event) => {
        event.preventDefault();
        contextLost = true;
        delete container.dataset.rendered;
        resume();
      };
      const restored = () => { contextLost = false; container.dataset.rendered = "true"; resize(); resume(); };
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
      const resizer = new ResizeObserver(resize);
      observer.observe(container);
      resizer.observe(container);
      container.addEventListener("pointermove", move);
      container.addEventListener("pointerleave", leave);
      canvas.addEventListener("webglcontextlost", lost);
      canvas.addEventListener("webglcontextrestored", restored);
      document.addEventListener("visibilitychange", resume);
      dispose = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        resizer.disconnect();
        container.removeEventListener("pointermove", move);
        container.removeEventListener("pointerleave", leave);
        canvas.removeEventListener("webglcontextlost", lost);
        canvas.removeEventListener("webglcontextrestored", restored);
        document.removeEventListener("visibilitychange", resume);
        geometry.dispose(); edges.dispose(); material.dispose(); edgeMaterial.dispose();
        orbitGeometry.dispose(); orbitMaterial.dispose(); satelliteGeometry.dispose(); satelliteMaterial.dispose();
        renderer.dispose(); renderer.forceContextLoss();
        canvas.remove();
        delete container.dataset.rendered;
      };
      resize();
    }).catch(() => { dispose(); });

    return () => { cancelled = true; dispose(); };
  }, [enabled]);

  return <>
    <div ref={host} className="orbit-canvas" aria-hidden="true"><span className="orbit-fallback">✦</span></div>
    <button className="orbit-control" disabled={!enabled} onClick={() => { impulse.current = 3; }}>
      <RotateCcw size={14} /> {enabled ? "Putar idenya" : "Mode tenang"}
    </button>
  </>;
}
