import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function DlavieShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const target = new THREE.Vector2(0.5, 0.5);
    const scroll = { value: 0 };

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uScroll: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform float uScroll;
        uniform vec2 uMouse;
        uniform vec2 uResolution;

        mat2 rot(float a){ float s=sin(a), c=cos(a); return mat2(c,-s,s,c); }
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
        float noise(vec2 p){
          vec2 i=floor(p); vec2 f=fract(p);
          vec2 u=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);
        }
        float fbm(vec2 p){
          float v=0.0; float a=.52;
          for(int i=0;i<6;i++){
            v += a * noise(p);
            p = rot(.52) * p * 2.04 + 1.7;
            a *= .52;
          }
          return v;
        }
        float ring(vec2 p, float r, float w){
          return smoothstep(w, 0.0, abs(length(p)-r));
        }
        void main(){
          vec2 uv = vUv;
          vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
          vec2 p = (uv - .5) * aspect;
          vec2 mouse = (uMouse - .5) * aspect;
          float t = uTime;

          vec2 flow = p;
          flow += .18 * vec2(
            fbm(p * 2.8 + vec2(t * .06, -t * .03)),
            fbm(p * 2.8 + vec2(-t * .04, t * .05))
          );
          flow = rot(sin(t * .08) * .25 + uScroll * .18) * flow;

          float n1 = fbm(flow * 2.4 + t * .05);
          float n2 = fbm(flow * 5.2 - t * .08 + n1);
          float marble = sin((flow.x * 2.4 + flow.y * 1.6 + n1 * 2.6 + t * .12) * 3.14159) * .5 + .5;

          float mouseGlow = smoothstep(.55, .02, length(p - mouse * .72));
          float orbital = ring(flow + mouse * .22, .42 + .08 * sin(t * .35), .035);
          float deepOrb = smoothstep(1.12, .08, length(flow + vec2(.14, -.04)));
          float horizon = smoothstep(.98, .12, length(flow - vec2(.12, .02)));
          float grain = hash(uv * uResolution.xy + fract(t) * 113.1);

          float light = deepOrb * .28 + horizon * .18 + pow(marble, 7.0) * .26 + n2 * .16 + mouseGlow * .36 + orbital * .32;

          vec3 black = vec3(.006,.007,.009);
          vec3 graphite = vec3(.035,.036,.041);
          vec3 pearl = vec3(.88,.90,.94);
          vec3 cobalt = vec3(.18,.29,.54);
          vec3 emerald = vec3(.22,.54,.42);
          vec3 silver = vec3(.62,.68,.76);

          vec3 color = mix(black, graphite, .55 + n1 * .25);
          color = mix(color, cobalt, clamp(light * .78 + uScroll * .08, 0.0, 1.0));
          color = mix(color, emerald, mouseGlow * .32 + orbital * .26);
          color = mix(color, pearl, pow(marble, 13.0) * .24 + mouseGlow * .1);
          color += silver * pow(light, 2.4) * .42;

          // PostFX-style treatment: bloom lift, chromatic aura, vignette, film grain.
          float vignette = smoothstep(1.35, .22, length(p));
          float bloom = pow(light, 2.0) * .72;
          vec3 chroma = vec3(bloom * .14, bloom * .09, bloom * .22);
          color += chroma;
          color *= vignette;
          color += (grain - .5) * .045;

          float alpha = clamp(.22 + light * .45 + bloom * .22, 0.0, .86) * vignette;
          alpha *= smoothstep(1.32, .12, length(p - vec2(.02,.0)));
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.15 : 1.55);
      renderer.setPixelRatio(dpr);
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      material.uniforms.uResolution.value.set(window.innerWidth * dpr, window.innerHeight * dpr);
    };

    const move = (event: PointerEvent) => {
      target.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
    };

    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scroll.value = window.scrollY / max;
    };

    let raf = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.033);
      material.uniforms.uTime.value += dt;
      material.uniforms.uMouse.value.lerp(target, 0.075);
      material.uniforms.uScroll.value += (scroll.value - material.uniforms.uScroll.value) * 0.045;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    resize();
    onScroll();
    tick();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas className="ds-webgl" ref={canvasRef} aria-hidden="true" />;
}
