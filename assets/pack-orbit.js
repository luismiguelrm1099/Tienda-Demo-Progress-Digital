import {
  WebGLRenderer, Scene, OrthographicCamera, Points, BufferAttribute,
  BufferGeometry, ShaderMaterial, Color
} from './vendor/three-motion-0.187.0.min.js';

export function createPackOrbit(canvas) {
  const context = canvas.getContext('webgl2', { alpha: true, antialias: false });
  if (!context) return null;
  const renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: false });
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, .1, 20);
  camera.position.set(0, 1.25, 6);
  camera.lookAt(0, 0, 0);

  const count = 132;
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute('trail', new BufferAttribute(
    Float32Array.from({ length: count }, (_, index) => index / (count - 1)), 1
  ));

  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      progress: { value: 0 },
      density: { value: 1 },
      gold: { value: new Color('#F4C430') }
    },
    vertexShader: `
      attribute float trail;
      uniform float progress;
      uniform float density;
      varying float brightness;

      void main() {
        float phase = progress * 6.28318 - trail * 3.2 - 0.6;
        float offset = sin(trail * 98.0);
        float radius = 1.0 + offset * 0.055;
        vec3 point = vec3(cos(phase) * radius,
          -0.70 + progress * 1.56 - trail * 0.19 + offset * 0.014,
          sin(phase) * radius);
        float front = smoothstep(-1.0, 0.7, point.z);
        float fade = smoothstep(0.0, 0.16, progress) * (1.0 - smoothstep(0.68, 1.0, progress));
        brightness = fade * mix(0.27, 0.95, front) * (1.0 - trail);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(point, 1.0);
        gl_PointSize = mix(1.15, 4.45, pow(1.0 - trail, 2.0)) * density;
      }
    `,
    fragmentShader: `
      uniform vec3 gold;
      varying float brightness;

      void main() {
        float distanceFromCenter = length(gl_PointCoord - 0.5) * 2.0;
        float edge = 1.0 - smoothstep(0.18, 1.0, distanceFromCenter);
        gl_FragColor = vec4(mix(gold, vec3(1.0, 0.89, 0.54), brightness * 0.45), edge * brightness);
        #include <colorspace_fragment>
      }
    `
  });
  const points = new Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    const density = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(density);
    renderer.setSize(width, height, false);
    material.uniforms.density.value = density;
    const ratio = width / height;
    const halfHeight = Math.max(1.05, 1.18 / ratio);
    camera.left = -halfHeight * ratio;
    camera.right = halfHeight * ratio;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
  }

  new ResizeObserver(resize).observe(canvas);
  return {
    resize,
    draw(progress) {
      material.uniforms.progress.value = progress;
      renderer.render(scene, camera);
    }
  };
}
