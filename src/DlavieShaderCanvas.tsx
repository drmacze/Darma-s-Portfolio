import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function DlavieShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const target = new THREE.Vector2(0.5, 0.5);

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }",
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uResolution;

        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float noise(vec2 p){
          vec2 i=floor(p); vec2 f=fract(p);
          vec2 u=f*f*(3.0-2.0*f);
          return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), u.x), mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
        }
        float fbm(vec2 p){
          float v=0.0; float a=0.5;
          for(int i=0;i<4;i++){ v += a*noise(p); p*=2.03; a*=0.52; }
          return v;
        }
        void main(){
          vec2 uv=vUv;
          vec2 aspect=vec2(uResolution.x/max(uResolution.y,1.0),1.0);
          vec2 p=(uv-.5)*aspect;
          vec2 m=(uMouse-.5)*aspect;
          float field=fbm(uv*2.2+vec2(uTime*.032,-uTime*.024));
          float wave=sin((uv.x+uv.y+field*.55)*6.0+uTime*.32)*.5+.5;
          float cursor=smoothstep(.62,.02,length(p-m*.62));
          float horizon=smoothstep(.98,.22,length(p+vec2(.05,.02)));
          float aura=(horizon*.34+cursor*.18+wave*.11);
          vec3 graphite=vec3(.025,.026,.03);
          vec3 pearl=vec3(.86,.88,.92);
          vec3 cobalt=vec3(.20,.31,.55);
          vec3 color=mix(graphite,cobalt,aura);
          color=mix(color,pearl,pow(wave,8.0)*.12+cursor*.08);
          float alpha=clamp(aura*.36 + pow(wave,9.0)*.08,0.0,.46);
          gl_FragColor=vec4(color,alpha);
        }
      `,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      renderer.setPixelRatio(dpr);
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      material.uniforms.uResolution.value.set(window.innerWidth * dpr, window.innerHeight * dpr);
    };

    const move = (event: PointerEvent) => {
      target.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
    };

    let raf = 0;
    const tick = () => {
      material.uniforms.uTime.value += 0.016;
      material.uniforms.uMouse.value.lerp(target, 0.065);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas className="ds-webgl" ref={canvasRef} aria-hidden="true" />;
}
