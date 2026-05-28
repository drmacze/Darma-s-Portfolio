precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i + vec2(0.0, 0.0));
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;

  mat2 rotate = mat2(
    cos(0.45), -sin(0.45),
    sin(0.45),  cos(0.45)
  );

  for (int i = 0; i < 6; i++) {
    value += amplitude * noise(p);
    p = rotate * p * 2.03 + 0.17;
    amplitude *= 0.52;
  }

  return value;
}

float softCircle(vec2 uv, vec2 position, float radius, float blur) {
  float distanceToCenter = distance(uv, position);
  return smoothstep(radius, radius - blur, distanceToCenter);
}

void main() {
  vec2 uv = vUv;
  vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
  vec2 p = (uv - 0.5) * aspect;
  vec2 mouse = (uMouse - 0.5) * aspect;

  float time = uTime * 0.11;

  vec2 flowA = p * 2.2 + vec2(time, -time * 0.72);
  vec2 flowB = p * 3.8 + vec2(-time * 0.55, time * 0.42);

  float fieldA = fbm(flowA);
  float fieldB = fbm(flowB);

  float aurora = smoothstep(0.18, 0.98, fieldA + fieldB * 0.48);
  float ribbon = smoothstep(
    0.34,
    0.0,
    abs(p.y + sin(p.x * 3.4 + uTime * 0.32) * 0.14 + fieldA * 0.22)
  );

  float cursorGlow = softCircle(p, mouse, 0.72, 0.48);
  float pulse = 0.5 + 0.5 * sin(uTime * 0.85 + fieldA * 6.2831);

  vec3 graphite = vec3(0.035, 0.036, 0.038);
  vec3 deep = vec3(0.012, 0.013, 0.015);
  vec3 champagne = vec3(0.78, 0.62, 0.36);
  vec3 clay = vec3(0.58, 0.39, 0.28);
  vec3 ivory = vec3(0.93, 0.89, 0.79);

  vec3 color = mix(deep, graphite, 0.82);

  color += champagne * aurora * 0.18;
  color += clay * ribbon * 0.18;
  color += ivory * cursorGlow * (0.045 + pulse * 0.035);

  float lens = softCircle(p, vec2(-0.32, 0.22), 0.82, 0.62);
  color += champagne * lens * 0.055;

  float vignette = smoothstep(1.12, 0.18, length(p));
  color *= 0.72 + vignette * 0.48;

  float grain = hash(uv * uResolution.xy + uTime) * 0.028;
  color += grain;

  gl_FragColor = vec4(color, 0.97);
}