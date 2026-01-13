"use client";

import { useEffect, useRef } from "react";

interface LiquidBackgroundProps {
  className?: string;
}

export function LiquidBackground({ className = "" }: LiquidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader with liquid distortion effect
    const fragmentShaderSource = `
      precision mediump float;
      varying vec2 v_uv;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec2 u_resolution;

      // Simplex noise function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                          -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                        + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                                dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = v_uv;
        vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);

        // Distance from mouse
        vec2 mousePos = u_mouse;
        float dist = distance(uv * aspect, mousePos * aspect);

        // Liquid distortion around cursor
        float distortionRadius = 0.35;
        float distortionStrength = 0.08;

        if (dist < distortionRadius) {
          float factor = 1.0 - (dist / distortionRadius);
          factor = pow(factor, 2.0);

          // Create swirling liquid effect
          float angle = atan(uv.y - mousePos.y, uv.x - mousePos.x);
          float noise1 = snoise(vec2(angle * 2.0 + u_time * 0.5, dist * 10.0));
          float noise2 = snoise(vec2(u_time * 0.3, dist * 8.0 - u_time * 0.2));

          uv.x += cos(angle + noise1 * 3.14159) * factor * distortionStrength * (1.0 + noise2 * 0.5);
          uv.y += sin(angle + noise1 * 3.14159) * factor * distortionStrength * (1.0 + noise2 * 0.5);
        }

        // Background liquid noise
        float time = u_time * 0.15;
        float noise = snoise(uv * 3.0 + time) * 0.5 + 0.5;
        float noise2 = snoise(uv * 5.0 - time * 0.7) * 0.5 + 0.5;
        float noise3 = snoise(uv * 2.0 + vec2(time * 0.5, -time * 0.3)) * 0.5 + 0.5;

        float combined = noise * 0.4 + noise2 * 0.35 + noise3 * 0.25;

        // Neon green color (oklch 0.65 0.35 140 approximated in RGB)
        vec3 neonGreen = vec3(0.0, 0.85, 0.35);
        vec3 darkGreen = vec3(0.0, 0.3, 0.15);
        vec3 black = vec3(0.02, 0.02, 0.02);

        // Create subtle color variations
        vec3 color = mix(black, darkGreen, combined * 0.15);

        // Add glow near cursor
        float glowIntensity = 1.0 - smoothstep(0.0, 0.5, dist);
        glowIntensity = pow(glowIntensity, 3.0);
        color += neonGreen * glowIntensity * 0.08;

        // Add subtle flowing highlights
        float highlight = pow(combined, 3.0) * 0.06;
        color += neonGreen * highlight;

        // Very subtle overall tint
        color += neonGreen * 0.015;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Store gl context in a const that TypeScript knows is non-null
    const glContext = gl;

    // Compile shader
    function compileShader(source: string, type: number) {
      const shader = glContext.createShader(type);
      if (!shader) return null;
      glContext.shaderSource(shader, source);
      glContext.compileShader(shader);
      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.error("Shader compile error:", glContext.getShaderInfoLog(shader));
        glContext.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(vertexShaderSource, glContext.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, glContext.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = glContext.createProgram();
    if (!program) return;
    glContext.attachShader(program, vertexShader);
    glContext.attachShader(program, fragmentShader);
    glContext.linkProgram(program);

    if (!glContext.getProgramParameter(program, glContext.LINK_STATUS)) {
      console.error("Program link error:", glContext.getProgramInfoLog(program));
      return;
    }

    glContext.useProgram(program);

    // Create buffer for full-screen quad
    const positionBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);
    glContext.bufferData(
      glContext.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      glContext.STATIC_DRAW
    );

    const positionLocation = glContext.getAttribLocation(program, "a_position");
    glContext.enableVertexAttribArray(positionLocation);
    glContext.vertexAttribPointer(positionLocation, 2, glContext.FLOAT, false, 0, 0);

    // Get uniform locations
    const timeLocation = glContext.getUniformLocation(program, "u_time");
    const mouseLocation = glContext.getUniformLocation(program, "u_mouse");
    const resolutionLocation = glContext.getUniformLocation(program, "u_resolution");

    // Handle resize
    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const width = canvas.clientWidth * dpr;
      const height = canvas.clientHeight * dpr;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        glContext.viewport(0, 0, width, height);
      }
    }

    // Handle mouse move
    function handleMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1.0 - (e.clientY - rect.top) / rect.height,
      };
    }

    // Smooth mouse interpolation
    const smoothMouse = { x: 0.5, y: 0.5 };

    // Animation loop
    const startTime = Date.now();
    function render() {
      resize();

      // Smooth mouse movement
      smoothMouse.x += (mouseRef.current.x - smoothMouse.x) * 0.08;
      smoothMouse.y += (mouseRef.current.y - smoothMouse.y) * 0.08;

      const time = (Date.now() - startTime) / 1000;
      glContext.uniform1f(timeLocation, time);
      glContext.uniform2f(mouseLocation, smoothMouse.x, smoothMouse.y);
      glContext.uniform2f(resolutionLocation, canvas!.width, canvas!.height);

      glContext.drawArrays(glContext.TRIANGLE_STRIP, 0, 4);
      animationRef.current = requestAnimationFrame(render);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", resize);
    resize();
    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ opacity: 0.7 }}
    />
  );
}
