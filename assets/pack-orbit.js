export function createPackOrbit(canvas) {
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, depth: false });
  if (!gl) return null;

  const vsSource = `#version 300 es
    precision highp float;
    in float aTrail;
    uniform float uProgress;
    uniform float uDensity;
    uniform vec2 uInvHalf;
    out float vBrightness;

    void main() {
      float phase = uProgress * 6.28318 - aTrail * 3.2 - 0.6;
      float offset = sin(aTrail * 98.0);
      float radius = 1.0 + offset * 0.055;
      vec3 point = vec3(
        cos(phase) * radius,
        -0.70 + uProgress * 1.56 - aTrail * 0.19 + offset * 0.014,
        sin(phase) * radius
      );
      float front = smoothstep(-1.0, 0.7, point.z);
      float fade = smoothstep(0.0, 0.16, uProgress) * (1.0 - smoothstep(0.68, 1.0, uProgress));
      vBrightness = fade * mix(0.27, 0.95, front) * (1.0 - aTrail);

      // Orthographic camera at (0, 1.25, 6) looking at (0, 0, 0), near=0.1, far=20
      const float zy = 0.20395425;
      const float zz = 0.97898042;
      const float eyeDist = 6.12882534;
      float vx = point.x;
      float vy = zz * point.y - zy * point.z;
      float vz = zy * point.y + zz * point.z - eyeDist;
      float cz = (-2.0 * vz - 20.1) / 19.9;

      gl_Position = vec4(vx * uInvHalf.x, vy * uInvHalf.y, cz, 1.0);
      gl_PointSize = mix(1.15, 4.45, pow(1.0 - aTrail, 2.0)) * uDensity;
    }
  `;

  const fsSource = `#version 300 es
    precision highp float;
    in float vBrightness;
    out vec4 outColor;

    void main() {
      float distanceFromCenter = length(gl_PointCoord - 0.5) * 2.0;
      float edge = 1.0 - smoothstep(0.18, 1.0, distanceFromCenter);
      vec3 lin = mix(vec3(0.904661, 0.552011, 0.029557), vec3(1.0, 0.89, 0.54), vBrightness * 0.45);
      vec3 srgb = mix(
        lin * 12.92,
        1.055 * pow(max(lin, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055,
        step(vec3(0.0031308), lin)
      );
      outColor = vec4(srgb, edge * vBrightness);
    }
  `;

  const compile = (type, src) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return shader;
  };

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vsSource));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(program);

  const count = 132;
  const trails = Float32Array.from({ length: count }, (_, index) => index / (count - 1));
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, trails, gl.STATIC_DRAW);
  const aTrail = gl.getAttribLocation(program, 'aTrail');
  gl.enableVertexAttribArray(aTrail);
  gl.vertexAttribPointer(aTrail, 1, gl.FLOAT, false, 0, 0);

  const uProgress = gl.getUniformLocation(program, 'uProgress');
  const uDensity = gl.getUniformLocation(program, 'uDensity');
  const uInvHalf = gl.getUniformLocation(program, 'uInvHalf');

  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.useProgram(program);
  gl.uniform1f(uDensity, 1);
  gl.uniform2f(uInvHalf, 1, 1);

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    const density = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * density);
    canvas.height = Math.round(height * density);
    gl.viewport(0, 0, canvas.width, canvas.height);
    const ratio = width / height;
    const halfHeight = Math.max(1.05, 1.18 / ratio);
    gl.useProgram(program);
    gl.uniform1f(uDensity, density);
    gl.uniform2f(uInvHalf, 1 / (halfHeight * ratio), 1 / halfHeight);
  }

  new ResizeObserver(resize).observe(canvas);
  return {
    resize,
    draw(progress) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform1f(uProgress, progress);
      gl.drawArrays(gl.POINTS, 0, count);
    }
  };
}
