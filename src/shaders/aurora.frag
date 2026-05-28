precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  vec2 m = uMouse - 0.5;

  float wave = sin((p.x + uTime * 0.08) * 8.0) * 0.08;
  float glow = smoothstep(0.72, 0.08, length(p - vec2(m.x, m.y + wave)));
  float ribbon = smoothstep(0.42, 0.0, abs(p.y + wave));

  vec3 graphite = vec3(0.035, 0.036, 0.038);
  vec3 champagne = vec3(0.78, 0.62, 0.36);
  vec3 clay = vec3(0.58, 0.39, 0.28);

  vec3 color = graphite + champagne * glow * 0.22 + clay * ribbon * 0.12;

  gl_FragColor = vec4(color, 0.97);
}
