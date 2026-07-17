"use client";

import { useEffect, useRef } from "react";

export interface AuroraProps {
  /** Left-side glow color, as an [R, G, B] triplet in 0-1 range. */
  colorA?: [number, number, number];
  /** Right-side glow color, as an [R, G, B] triplet in 0-1 range. */
  colorB?: [number, number, number];
  /** How fast the glows drift. 1 = default speed. */
  speed?: number;
  /** Overall brightness/opacity multiplier, roughly 0-2. */
  intensity?: number;
  blur?: number;
  renderScale?: number;
  className?: string;
}

// OPTIMIZATION 1: The Vertex Shader now handles all the heavy lifting.
// It calculates the movement and pulsing only 4 times per frame, 
// then passes the results (vCenterA, vPulseA, etc.) to the fragment shader.
const VERTEX_SRC = `
  attribute vec2 aPosition;
  uniform float uTime;

  varying vec2 vCenterA;
  varying vec2 vCenterB;
  varying float vPulseA;
  varying float vPulseB;

  void main() {
    float t = uTime * 0.15;

    // OPTIMIZATION 2: Replaced expensive 2D noise with cheap Sine/Cosine waves.
    // This creates a smoother, continuous orbital drift.
    float driftAx = sin(t * 1.3) * 0.36 - 0.18;
    float driftAy = cos(t * 0.9) * 0.14 - 0.07;
    float driftBx = sin(t * 1.1 + 2.0) * 0.36 - 0.18;
    float driftBy = cos(t * 1.4 + 1.0) * 0.14 - 0.07;

    vCenterA = vec2(0.16 + driftAx, 1.0 + driftAy);
    vCenterB = vec2(0.84 + driftBx, 1.0 + driftBy);

    vPulseA = sin(t * 1.3) * 0.12;
    vPulseB = sin(t * 1.1 + 2.4) * 0.12;

    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

// OPTIMIZATION 3: The Fragment Shader is now extremely lightweight.
// It only calculates the distance falloff for the pixels.
const FRAGMENT_SRC = `
  precision mediump float;

  uniform vec2 uResolution;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uIntensity;

  varying vec2 vCenterA;
  varying vec2 vCenterB;
  varying float vPulseA;
  varying float vPulseB;

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;

    float distA = length((uv - vCenterA) * vec2(1.0, 1.55));
    float distB = length((uv - vCenterB) * vec2(1.0, 1.55));

    float glowA = smoothstep(0.9 + vPulseA, 0.0, distA);
    float glowB = smoothstep(0.9 + vPulseB, 0.0, distB);

    vec3 col = uColorA * glowA + uColorB * glowB;
    float alpha = clamp(glowA + glowB, 0.0, 1.0) * uIntensity;

    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function Aurora({
  colorA = [0.05, 0.3, 0.2], // Darker, richer green
  colorB = [0.2, 0.05, 0.4], // Darker, richer violet
  intensity = 1,           // Lo  wer intensity reduces the white "blown out" center
  speed = 2,
  blur = 60,
  renderScale = 0.25, // Lowered from 0.35. Less pixels to draw, visually identical due to blur.
  className = "",
}: AuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colorARef = useRef(colorA);
  const colorBRef = useRef(colorB);
  const speedRef = useRef(speed);
  const intensityRef = useRef(intensity);
  const renderScaleRef = useRef(renderScale);
  
  colorARef.current = colorA;
  colorBRef.current = colorB;
  speedRef.current = speed;
  intensityRef.current = intensity;
  renderScaleRef.current = renderScale;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    // Added low-power preference to prevent waking up dedicated GPUs unnecessarily
    const glOptions = {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "low-power", 
    };

    const gl = (canvas.getContext("webgl", glOptions) ||
      canvas.getContext("experimental-webgl", glOptions)) as WebGLRenderingContext | null;

    if (!gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uColorA = gl.getUniformLocation(program, "uColorA");
    const uColorB = gl.getUniformLocation(program, "uColorB");
    const uIntensity = gl.getUniformLocation(program, "uIntensity");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let rafId = 0;
    let running = false;
    let lastFrameTime = performance.now();
    let accumTime = 0;
    let isIntersecting = true;

    function resize() {
      if (!canvas || !container || !gl) return;
      const scale = Math.min(Math.max(renderScaleRef.current, 0.05), 1);
      const width = Math.max(1, Math.floor(container.clientWidth * scale));
      const height = Math.max(1, Math.floor(container.clientHeight * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        gl.uniform2f(uResolution, width, height);
      }
    }

    function drawFrame() {
      gl!.uniform3f(uColorA, colorARef.current[0], colorARef.current[1], colorARef.current[2]);
      gl!.uniform3f(uColorB, colorBRef.current[0], colorBRef.current[1], colorBRef.current[2]);
      gl!.uniform1f(uIntensity, intensityRef.current);
      gl!.uniform1f(uTime, accumTime);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    function loop(now: number) {
      const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
      lastFrameTime = now;
      accumTime += dt * speedRef.current;
      drawFrame();
      if (running) rafId = requestAnimationFrame(loop);
    }

    function start() {
      if (running) return;
      running = true;
      lastFrameTime = performance.now();
      rafId = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    function applyMotionPreference() {
      if (reducedMotionQuery.matches) {
        stop();
        drawFrame();
      } else if (isIntersecting && !document.hidden) {
        start();
      }
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (!isIntersecting || document.hidden || reducedMotionQuery.matches) {
          stop();
        } else {
          start();
        }
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    function onVisibilityChange() {
      if (document.hidden) {
        stop();
      } else if (isIntersecting && !reducedMotionQuery.matches) {
        start();
      }
    }
    
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotionQuery.addEventListener("change", applyMotionPreference);

    function onContextLost(e: Event) {
      e.preventDefault();
      stop();
    }
    function onContextRestored() {
      resize();
      start();
    }
    canvas.addEventListener("webglcontextlost", onContextLost as EventListener);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    applyMotionPreference();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotionQuery.removeEventListener("change", applyMotionPreference);
      canvas.removeEventListener("webglcontextlost", onContextLost as EventListener);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ filter: `blur(${blur}px)`, willChange: "transform" }}
      />

      <div
        className="aurora-fallback absolute inset-0 -z-10 opacity-90"
        style={{
          background:
            "radial-gradient(45% 55% at 16% -5%, rgba(166,200,255,0.4), transparent 70%), radial-gradient(45% 55% at 84% -5%, rgba(224,187,228,0.4), transparent 70%)",
          filter: "blur(50px)",
          willChange: "transform",
        }}
      />
      <style>{`
        .aurora-fallback {
          animation: aurora-drift 14s ease-in-out infinite alternate;
        }
        @keyframes aurora-drift {
          0%   { transform: translate3d(-2%, 0, 0) scale(1); }
          100% { transform: translate3d(2%, 2%, 0) scale(1.05); }
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora-fallback { animation: none; }
        }
      `}</style>
    </div>
  );
}