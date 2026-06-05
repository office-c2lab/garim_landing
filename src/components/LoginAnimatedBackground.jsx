import { useEffect, useRef } from 'react';
import './LoginAnimatedBackground.css';

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = 0.5 * (a_position + 1.0);
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  varying vec2 v_uv;
  uniform float u_time;
  uniform float u_ratio;
  uniform vec2 u_pointer_position;
  uniform float u_scroll_progress;
  uniform float u_minimum_glow;

  vec2 rotate(vec2 uv, float th) {
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
  }

  float neuro_shape(vec2 uv, float t, float p) {
    vec2 sine_acc = vec2(0.0);
    vec2 res = vec2(0.0);
    float scale = 8.0;

    for (int j = 0; j < 15; j++) {
      uv = rotate(uv, 1.0);
      sine_acc = rotate(sine_acc, 1.0);

      vec2 layer = uv * scale + float(j) + sine_acc - t;

      sine_acc += sin(layer) + 2.15 * p;
      res += (0.5 + 0.5 * cos(layer)) / scale;

      scale *= 1.2;
    }

    return res.x + res.y;
  }

  void main() {
    vec2 uv = 0.42 * v_uv;
    uv.x *= u_ratio;

    vec2 pointer = v_uv - u_pointer_position;
    pointer.x *= u_ratio;

    float p = clamp(length(pointer), 0.0, 1.0);
    p = 0.5 * pow(1.0 - p, 2.0);

    // 기존보다 살짝 느리게 해서 물결처럼 보이게
    float t = 0.00072 * u_time;

    float noise = neuro_shape(uv, t, p);

    noise = 1.12 * pow(noise, 2.9);
    noise += pow(noise, 7.4);
    noise = max(0.0, noise - 0.39);

    float distanceFromCenter = length(v_uv - 0.5);
    float centerFade = 1.0 - smoothstep(0.06, 1.16, distanceFromCenter);

    // 화면 위쪽에서 은은하게 내려오는 수면빛
    float surfaceLight = smoothstep(0.15, 1.0, v_uv.y);

    float pointerGlow = p * 0.24;
    float glow = noise * (0.99 + pointerGlow) * centerFade;
    glow = max(glow, u_minimum_glow);

    float pulse = 0.88 + 0.12 * sin(u_time * 0.00032 + u_scroll_progress * 6.28318);

    // 검정 바탕 위로 흐르는 GARIM 보라 쉐이더
    vec3 deepNavy = vec3(0.004, 0.004, 0.012);
    vec3 oceanBlue = vec3(0.035, 0.025, 0.075);
    vec3 aquaGlow = vec3(0.416, 0.353, 0.878);
    vec3 surfaceCyan = vec3(0.720, 0.650, 1.000);

    vec3 color = mix(deepNavy, oceanBlue, surfaceLight * 0.78);
    color = mix(color, aquaGlow, clamp(glow * 1.4 + pointerGlow, 0.0, 1.0));

    // 위쪽에만 아주 약한 라벤더 빛 추가
    color += surfaceCyan * pow(surfaceLight, 3.0) * 0.032;

    vec3 finalColor = color * glow * pulse;
    finalColor += aquaGlow * pow(glow, 2.0) * 0.24;

    float alpha = clamp(glow * 1.0, 0.0, 0.92);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(message || 'Failed to compile shader.');
  }

  return shader;
}

function createProgram(gl) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(message || 'Failed to link shader program.');
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

export default function LoginAnimatedBackground({ className = '', minimumGlow = 0 }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) {
      return undefined;
    }

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) {
      return undefined;
    }

    const program = createProgram(gl);
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const ratioLocation = gl.getUniformLocation(program, 'u_ratio');
    const pointerLocation = gl.getUniformLocation(program, 'u_pointer_position');
    const scrollLocation = gl.getUniformLocation(program, 'u_scroll_progress');
    const minimumGlowLocation = gl.getUniformLocation(program, 'u_minimum_glow');
    const vertexBuffer = gl.createBuffer();

    if (
      positionLocation < 0 ||
      !timeLocation ||
      !ratioLocation ||
      !pointerLocation ||
      !scrollLocation ||
      !minimumGlowLocation ||
      !vertexBuffer
    ) {
      gl.deleteProgram(program);
      return undefined;
    }

    const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);

      canvas.width = Math.max(1, Math.floor(width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(height * pixelRatio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(ratioLocation, canvas.width / canvas.height);
    };

    const updatePointer = (x, y) => {
      const rect = container.getBoundingClientRect();
      const localX = (x - rect.left) / Math.max(rect.width, 1);
      const localY = 1 - (y - rect.top) / Math.max(rect.height, 1);

      pointer.targetX = Math.max(0, Math.min(1, localX));
      pointer.targetY = Math.max(0, Math.min(1, localY));
    };

    const handlePointerMove = event => {
      updatePointer(event.clientX, event.clientY);
    };

    const handleTouchMove = event => {
      const touch = event.targetTouches[0];
      if (!touch) {
        return;
      }

      updatePointer(touch.clientX, touch.clientY);
    };

    const render = now => {
      pointer.x += (pointer.targetX - pointer.x) * 0.08;
      pointer.y += (pointer.targetY - pointer.y) * 0.08;

      gl.uniform1f(timeLocation, now);
      gl.uniform2f(pointerLocation, pointer.x, pointer.y);
      gl.uniform1f(scrollLocation, 0.18 + 0.12 * Math.sin(now * 0.0002));
      gl.uniform1f(minimumGlowLocation, minimumGlow);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!prefersReducedMotion) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;

    resize();
    resizeObserver?.observe(container);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    if (prefersReducedMotion) {
      render(0);
    } else {
      rafId = window.requestAnimationFrame(render);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteProgram(program);
    };
  }, [minimumGlow]);

  return (
    <div
      ref={containerRef}
      className={['login-animated-background', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="login-animated-background__canvas" />
      <div className="login-animated-background__veil" />
      <div className="login-animated-background__grain" />
    </div>
  );
}
