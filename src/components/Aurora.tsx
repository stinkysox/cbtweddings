"use client";

import { useEffect, useRef, useState } from "react";

export interface AuroraProps {
  colorA?: [number, number, number];
  colorB?: [number, number, number];
  speed?: number;
  intensity?: number;
  blur?: number;
  renderScale?: number;
  className?: string;
}

const VERTEX_SRC = `
  attribute vec2 aPosition;
  uniform float uTime;

  varying vec2 vCenterA;
  varying vec2 vCenterB;
  varying float vPulseA;
  varying float vPulseB;

  void main() {
    float t = uTime * 0.15;

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

const FRAGMENT_SRC = `
  precision mediump float;

  uniform vec2 uResolution;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uIntensity;
  uniform float uSoftness;

  varying vec2 vCenterA;
  varying vec2 vCenterB;
  varying float vPulseA;
  varying float vPulseB;

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;

    float distA = length((uv - vCenterA) * vec2(1.0, 1.55));
    float distB = length((uv - vCenterB) * vec2(1.0, 1.55));

    float glowA = smoothstep(0.9 + vPulseA + uSoftness, -uSoftness, distA);
    float glowB = smoothstep(0.9 + vPulseB + uSoftness, -uSoftness, distB);

    vec3 col = uColorA * glowA + uColorB * glowB;
    float alpha = clamp(glowA + glowB, 0.0, 1.0) * uIntensity;

    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
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

function isIOSSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iP(ad|hone|od)/.test(ua) ||
    (ua.includes("Macintosh") && navigator.maxTouchPoints > 1)
  );
}

export default function Aurora({
  colorA = [0.05, 0.3, 0.2],
  colorB = [0.2, 0.05, 0.4],
  intensity = 1,
  speed = 2,
  blur = 60,
  renderScale = 0.25,
  className = "",
}: AuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webGLActive, setWebGLActive] = useState(false);

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

  const iOS = typeof window !== "undefined" && isIOSSafari();
  const effectiveBlur = iOS ? Math.min(blur, 18) : blur;
  const softness = iOS ? 0.22 : 0.12;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (reducedMotionQuery.matches) return;

    const glOptions = {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "low-power" as WebGLPowerPreference,
    };

    const gl = (canvas.getContext("webgl", glOptions) ||
      canvas.getContext(
        "experimental-webgl",
        glOptions,
      )) as WebGLRenderingContext | null;

    if (!gl) return;
    setWebGLActive(true);

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
      gl.STATIC_DRAW,
    );

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uColorA = gl.getUniformLocation(program, "uColorA");
    const uColorB = gl.getUniformLocation(program, "uColorB");
    const uIntensity = gl.getUniformLocation(program, "uIntensity");
    const uSoftness = gl.getUniformLocation(program, "uSoftness");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    let rafId = 0;
    let running = false;
    let accumTime = 0;
    let isIntersecting = true;
    let resizeTimeout: NodeJS.Timeout;

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

    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    };

    function drawFrame() {
      gl!.uniform3f(
        uColorA,
        colorARef.current[0],
        colorARef.current[1],
        colorARef.current[2],
      );
      gl!.uniform3f(
        uColorB,
        colorBRef.current[0],
        colorBRef.current[1],
        colorBRef.current[2],
      );
      gl!.uniform1f(uIntensity, intensityRef.current);
      gl!.uniform1f(uSoftness, softness);
      gl!.uniform1f(uTime, accumTime);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    function loop(now: number) {
      accumTime = now * 0.001 * speedRef.current;
      drawFrame();
      if (running) rafId = requestAnimationFrame(loop);
    }

    function start() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (!isIntersecting || document.hidden) {
          stop();
        } else {
          start();
        }
      },
      { threshold: 0 },
    );

    intersectionObserver.observe(canvas);

    function onVisibilityChange() {
      if (document.hidden) stop();
      else if (isIntersecting) start();
    }

    document.addEventListener("visibilitychange", onVisibilityChange);

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

    const resizeObserver = new ResizeObserver(debouncedResize);
    resizeObserver.observe(container);
    resize();
    start();

    return () => {
      stop();
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener(
        "webglcontextlost",
        onContextLost as EventListener,
      );
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [softness]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute top-0 left-0 w-full h-full overflow-hidden ${className}`}
      style={{ isolation: "isolate", contain: "strict" }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{
          filter: `blur(${effectiveBlur}px)`,
          WebkitFilter: `blur(${effectiveBlur}px)`,
          transform: "translateZ(0)",
          opacity: webGLActive ? 1 : 0,
          transition: "opacity 0.5s ease-in",
        }}
      />

      {!webGLActive && (
        <>
          <div
            className="aurora-fallback absolute inset-0 -z-10 opacity-90"
            style={{
              background:
                "radial-gradient(45% 55% at 16% -5%, rgba(166,200,255,0.4), rgba(0,0,0,0) 70%), radial-gradient(45% 55% at 84% -5%, rgba(224,187,228,0.4), rgba(0,0,0,0) 70%)",
              filter: "blur(50px)",
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
        </>
      )}
    </div>
  );
}
