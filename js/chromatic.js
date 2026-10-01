(() => {
  'use strict';

  const hosts = [...document.querySelectorAll('.chromatic-field')];
  if (!hosts.length) return;

  const root = document.documentElement;
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const fields = [];
  const pointer = { x: 0, y: 0 };
  let reduced = motionPreference.matches || root.classList.contains('motion-reduced');
  let dialogOpen = Boolean(document.querySelector('dialog[open]'));
  let frame = 0;
  let framesLeft = 0;
  let dimensionsDirty = true;

  const vertexSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentSource = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
    #else
      precision mediump float;
    #endif
    varying vec2 v_uv;
    uniform vec2 u_size;
    uniform vec3 u_motion;
    uniform float u_palette;
    uniform float u_seed;
    uniform vec3 u_blue;
    uniform vec3 u_violet;
    uniform vec3 u_amber;

    // Shared palette: cream #f7f7f2, ink #111210, ultramarine #2934f5,
    // violet #903be8, amber #f3a33b, lavender #c9bbf2.
    const vec3 CREAM = vec3(0.96863, 0.96863, 0.94902);
    const vec3 INK = vec3(0.06667, 0.07059, 0.06275);
    const vec3 LAVENDER = vec3(0.78824, 0.73333, 0.94902);

    float hash(vec2 p) {
      vec3 q = fract(vec3(p.xyx) * 0.1031);
      q += dot(q, q.yzx + 33.33);
      return fract((q.x + q.y) * q.z);
    }
    float noise(vec2 p) {
      vec2 cell = floor(p);
      vec2 f = fract(p);
      vec2 w = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(cell), hash(cell + vec2(1.0, 0.0)), w.x),
        mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0)), w.x), w.y);
    }
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.55;
      mat2 turn = mat2(0.80, 0.60, -0.60, 0.80);
      for (int i = 0; i < 3; i++) {
        value += amplitude * noise(p);
        p = turn * p * 2.03 + vec2(3.8, 8.1);
        amplitude *= 0.48;
      }
      return value;
    }
    float band(float value, float from, float to, float edge) {
      return smoothstep(from - edge, from + edge, value)
        * (1.0 - smoothstep(to - edge, to + edge, value));
    }
    void main() {
      vec2 uv = vec2(v_uv.x, 1.0 - v_uv.y);
      float aspect = u_size.x / max(1.0, u_size.y);
      vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 2.8;
      p += vec2(u_seed * 1.13, u_seed * -0.71);
      p += u_motion.xy * vec2(0.13, 0.09);
      float phase = u_motion.z;
      p += vec2(phase * 0.16, -phase * 0.13);

      vec2 warp = vec2(fbm(p + vec2(1.7, 5.1)),
        fbm(p + vec2(8.3, 2.8))) - 0.46;
      float fold = fbm(p * 0.78 + warp * 2.8 + vec2(phase * 0.09, 4.3));
      float flow = p.y * 0.64 - p.x * 0.32 + warp.x * 1.55
        + warp.y * 0.75 + fold * 1.45;
      float ribbon = 0.5 + 0.5 * sin(flow * 6.3);
      float edge = 0.007 + 2.0 / max(320.0, u_size.y);

      vec3 color = mix(u_blue, u_violet, smoothstep(0.25, 0.77, ribbon));
      color = mix(color, u_amber, band(ribbon, 0.66, 0.80, edge));
      color = mix(color, CREAM, band(ribbon, 0.84, 0.91, edge));
      color = mix(color, INK, band(ribbon, 0.93, 1.04, edge));
      float vein = band(ribbon, 0.36, 0.374, edge * 0.6);
      color = mix(color, CREAM, vein * 0.75);
      color = mix(color, INK, band(ribbon, 0.44, 0.452, edge * 0.7) * 0.64);

      if (u_palette < 0.5) {
        // A wide unpainted surface protects the entrance typography.
        float shore = uv.x * 0.66 + uv.y * 0.37 + warp.x * 0.15;
        float pigment = smoothstep(0.61, 0.635, shore);
        color = mix(CREAM, color, pigment);
      } else if (u_palette < 1.5) {
        float pigment = band(ribbon, 0.20, 0.88, edge * 1.4);
        float reach = smoothstep(0.05, 0.42, uv.x + uv.y * 0.30 + warp.x * 0.25);
        color = mix(INK, color, pigment * reach);
      } else {
        // Memory keeps an open, quieter surface around the photographs.
        vec3 memory = mix(LAVENDER, u_amber, smoothstep(0.56, 0.84, ribbon));
        memory = mix(memory, CREAM, band(ribbon, 0.28, 0.55, edge));
        float pigment = smoothstep(0.39, 0.78, uv.x * 0.5 + uv.y * 0.48 + warp.x * 0.35);
        color = mix(CREAM, memory, pigment * 0.76);
        color = mix(color, u_violet, vein * pigment * 0.24);
      }
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function compile(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createField(host) {
    const canvas = document.createElement('canvas');
    canvas.className = 'chromatic-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'display:block;width:100%;height:100%;opacity:0;pointer-events:none';
    let gl;
    try {
      gl = canvas.getContext('webgl', {
        alpha: false, antialias: false, depth: false, stencil: false,
        preserveDrawingBuffer: false, powerPreference: 'low-power'
      });
    } catch { return; }
    if (!gl) return;
    const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      return;
    }
    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertex); gl.deleteShader(fragment);
      return;
    }
    gl.attachShader(program, vertex); gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex); gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }
    const buffer = gl.createBuffer();
    if (!buffer) { gl.deleteProgram(program); return; }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const rect = host.getBoundingClientRect();
    const field = {
      host, canvas, gl, program, buffer,
      size: gl.getUniformLocation(program, 'u_size'),
      motion: gl.getUniformLocation(program, 'u_motion'),
      palette: gl.getUniformLocation(program, 'u_palette'),
      seed: gl.getUniformLocation(program, 'u_seed'),
      seedValue: Number(host.dataset.seed) || 0,
      colors: ['u_blue', 'u_violet', 'u_amber'].map(name => gl.getUniformLocation(program, name)),
      tones: ({
        blue: [[41,52,245],[103,76,233],[243,163,59]],
        purple: [[52,33,184],[144,59,232],[223,180,122]],
        amber: [[169,73,21],[88,42,138],[243,163,59]],
        mono: [[51,55,64],[118,126,132],[217,210,193]]
      }[host.dataset.tone] || [[41,52,245],[144,59,232],[243,163,59]]).map(rgb => rgb.map(n => n / 255)),
      paletteValue: host.dataset.palette === 'dark' ? 1 : host.dataset.palette === 'memory' ? 2 : 0,
      visible: rect.bottom > 0 && rect.top < innerHeight,
      lost: false, firstPaint: true, dirty: true,
      x: 0, y: 0, phase: 0
    };
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      field.lost = true;
      host.classList.remove('is-rendered');
      canvas.remove();
      // The CSS composition is still present beneath the canvas.
      if (!fields.some(item => item.visible && !item.lost)) stop();
    });
    host.append(canvas);
    fields.push(field);
  }

  function resize(field) {
    const rect = field.host.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    const cap = innerWidth <= 600 ? 600 : 1000;
    const ratio = Math.min(1.5, devicePixelRatio || 1) * 0.6;
    const scale = Math.min(ratio, cap / width, 1400 / height, Math.sqrt(850000 / (width * height)));
    const renderWidth = Math.max(1, Math.round(width * scale));
    const renderHeight = Math.max(1, Math.round(height * scale));
    if (field.canvas.width !== renderWidth || field.canvas.height !== renderHeight) {
      field.canvas.width = renderWidth; field.canvas.height = renderHeight;
      field.dirty = true;
    }
  }

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; framesLeft = 0;
  }

  function schedule() {
    if (document.hidden || dialogOpen || !fields.some(field => field.visible && !field.lost)) return;
    framesLeft = reduced ? 1 : 45;
    if (!frame) frame = requestAnimationFrame(paint);
  }

  function paint() {
    frame = 0;
    if (document.hidden || dialogOpen) { framesLeft = 0; return; }
    let settling = false;
    fields.forEach(field => {
      if (field.lost || !field.visible) return;
      if (dimensionsDirty || field.dirty) resize(field);
      const rect = field.host.getBoundingClientRect();
      const targetPhase = reduced ? 0 : Math.max(-1, Math.min(3, (innerHeight * 0.5 - rect.top) / Math.max(innerHeight, rect.height)));
      const targetX = reduced ? 0 : pointer.x;
      const targetY = reduced ? 0 : pointer.y;
      const difference = Math.abs(targetPhase - field.phase) + Math.abs(targetX - field.x) + Math.abs(targetY - field.y);
      const snap = reduced || field.firstPaint || framesLeft <= 1 || difference < 0.001;
      const easing = snap ? 1 : 0.15;
      field.phase += (targetPhase - field.phase) * easing;
      field.x += (targetX - field.x) * easing;
      field.y += (targetY - field.y) * easing;
      if (!snap) settling = true;
      if (!field.dirty && !field.firstPaint && difference < 0.0001) return;
      const gl = field.gl;
      gl.viewport(0, 0, field.canvas.width, field.canvas.height);
      gl.useProgram(field.program);
      gl.uniform2f(field.size, field.canvas.width, field.canvas.height);
      gl.uniform3f(field.motion, field.x, field.y, field.phase);
      gl.uniform1f(field.palette, field.paletteValue);
      gl.uniform1f(field.seed, field.seedValue);
      field.colors.forEach((location, index) => gl.uniform3fv(location, field.tones[index]));
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (field.firstPaint) {
        if (gl.isContextLost() || gl.getError() !== gl.NO_ERROR) {
          field.lost = true;
          gl.deleteBuffer(field.buffer); gl.deleteProgram(field.program);
          field.canvas.remove();
          return;
        }
        field.canvas.style.opacity = '1';
        field.host.classList.add('is-rendered');
        field.firstPaint = false;
      }
      field.dirty = false;
    });
    dimensionsDirty = false;
    framesLeft -= 1;
    if (settling && framesLeft > 0 && !reduced) frame = requestAnimationFrame(paint);
  }

  function syncMotion() {
    const next = motionPreference.matches || root.classList.contains('motion-reduced');
    if (next === reduced) return;
    reduced = next;
    fields.forEach(field => { field.dirty = true; });
    stop(); schedule();
  }

  hosts.forEach(createField);
  if (!fields.length) return;
  const byHost = new Map(fields.map(field => [field.host, field]));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const field = byHost.get(entry.target);
        field.visible = entry.isIntersecting;
        if (field.visible) field.dirty = true;
      });
      if (fields.some(field => field.visible && !field.lost)) schedule();
      else stop();
    }, { rootMargin: '80px 0px' });
    fields.forEach(field => observer.observe(field.host));
  } else {
    // Browsers without intersection observation still retain the visual.
    fields.forEach(field => { field.visible = true; });
  }
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => { byHost.get(entry.target).dirty = true; });
      schedule();
    });
    fields.forEach(field => resizeObserver.observe(field.host));
  }
  window.addEventListener('scroll', () => { if (!reduced) schedule(); }, { passive: true });
  window.addEventListener('pointermove', event => {
    if (reduced || event.pointerType === 'touch') return;
    pointer.x = event.clientX / Math.max(1, innerWidth) * 2 - 1;
    pointer.y = event.clientY / Math.max(1, innerHeight) * 2 - 1;
    schedule();
  }, { passive: true });
  window.addEventListener('resize', () => { dimensionsDirty = true; schedule(); }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else { fields.forEach(field => { field.dirty = true; }); schedule(); }
  });
  new MutationObserver(syncMotion).observe(root, { attributes: true, attributeFilter: ['class'] });
  motionPreference.addEventListener('change', syncMotion);
  new MutationObserver(() => {
    const next = Boolean(document.querySelector('dialog[open]'));
    if (next === dialogOpen) return;
    dialogOpen = next;
    if (dialogOpen) stop();
    else { fields.forEach(field => { field.dirty = true; }); schedule(); }
  }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
  schedule();
})();
