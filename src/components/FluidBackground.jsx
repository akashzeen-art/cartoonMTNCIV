import React, { useEffect, useRef } from 'react';

const FluidBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const config = {
      SIM_RESOLUTION:       128,
      DYE_RESOLUTION:       1440,
      CAPTURE_RESOLUTION:   512,
      DENSITY_DISSIPATION:  0.5,
      VELOCITY_DISSIPATION: 0.3,
      PRESSURE:             0.1,
      PRESSURE_ITERATIONS:  20,
      CURL:                 40,
      SPLAT_RADIUS:         0.4,
      SPLAT_FORCE:          8000,
      SHADING:              true,
      COLOR_UPDATE_SPEED:   10,
      BACK_COLOR:           { r: 0, g: 0, b: 0 },
      TRANSPARENT:          true,
    };

    // ── WebGL context ──────────────────────────────────────────
    function getWebGLContext(canvas) {
      const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
      let gl = canvas.getContext('webgl2', params);
      const isWebGL2 = !!gl;
      if (!isWebGL2) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);

      let halfFloat, supportLinearFiltering;
      if (isWebGL2) {
        gl.getExtension('EXT_color_buffer_float');
        supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
      } else {
        halfFloat = gl.getExtension('OES_texture_half_float');
        supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
      }
      gl.clearColor(0, 0, 0, 1);

      const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : (halfFloat ? halfFloat.HALF_FLOAT_OES : gl.UNSIGNED_BYTE);

      function getSupportedFormat(internalFormat, format, type) {
        if (!supportRenderTextureFormat(internalFormat, format, type)) {
          if (internalFormat === gl.R16F)  return getSupportedFormat(gl.RG16F,   gl.RG,   type);
          if (internalFormat === gl.RG16F) return getSupportedFormat(gl.RGBA16F, gl.RGBA, type);
          return null;
        }
        return { internalFormat, format };
      }

      function supportRenderTextureFormat(internalFormat, format, type) {
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      }

      let formatRGBA, formatRG, formatR;
      if (isWebGL2) {
        formatRGBA = getSupportedFormat(gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT);
        formatRG   = getSupportedFormat(gl.RG16F,   gl.RG,   gl.HALF_FLOAT);
        formatR    = getSupportedFormat(gl.R16F,    gl.RED,  gl.HALF_FLOAT);
      } else {
        formatRGBA = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
        formatRG   = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
        formatR    = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
      }

      return { gl, ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering } };
    }

    // ── Shaders ────────────────────────────────────────────────
    const baseVert = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform vec2 texelSize;
      void main(){
        vUv = aPosition * .5 + .5;
        vL = vUv - vec2(texelSize.x, 0.);
        vR = vUv + vec2(texelSize.x, 0.);
        vT = vUv + vec2(0., texelSize.y);
        vB = vUv - vec2(0., texelSize.y);
        gl_Position = vec4(aPosition, 0., 1.);
      }`;

    const clearFrag = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main(){ gl_FragColor = value * texture2D(uTexture, vUv); }`;

    const displayFrag = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main(){
        vec3 C = texture2D(uTexture, vUv).rgb;
        float a = max(C.r, max(C.g, C.b));
        gl_FragColor = vec4(C, a);
      }`;

    const displayShadingFrag = `
      precision highp float;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      void main(){
        float L = texture2D(uTexture, vL).r;
        float R = texture2D(uTexture, vR).r;
        float T = texture2D(uTexture, vT).r;
        float B = texture2D(uTexture, vB).r;
        vec3 normal = normalize(vec3(L - R, B - T, 1.0));
        vec3 light  = vec3(0.3, 0.8, 0.6);
        float diffuse = clamp(dot(normal, light), 0.5, 1.0);
        vec3 C = texture2D(uTexture, vUv).rgb;
        gl_FragColor = vec4(C * diffuse, max(C.r, max(C.g, C.b)));
      }`;

    const splatFrag = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main(){
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p,p) / radius) * color;
        vec3 base  = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }`;

    const advectionFrag = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp(sampler2D sam, vec2 uv, vec2 tsize){
        vec2 st = uv / tsize - .5;
        vec2 iuv = floor(st); vec2 fuv = fract(st);
        vec4 a = texture2D(sam,(iuv+vec2(.5,.5))*tsize);
        vec4 b = texture2D(sam,(iuv+vec2(1.5,.5))*tsize);
        vec4 c = texture2D(sam,(iuv+vec2(.5,1.5))*tsize);
        vec4 d = texture2D(sam,(iuv+vec2(1.5,1.5))*tsize);
        return mix(mix(a,b,fuv.x),mix(c,d,fuv.x),fuv.y);
      }
      void main(){
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        vec4 result = bilerp(uSource, coord, dyeTexelSize);
        float decay = 1. + dissipation * dt;
        gl_FragColor = result / decay;
      }`;

    const divergenceFrag = `
      precision mediump float;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity;
      void main(){
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        float div = .5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0., 0., 1.);
      }`;

    const curlFrag = `
      precision mediump float;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity;
      void main(){
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        gl_FragColor = vec4(.5 * (R - L - T + B), 0., 0., 1.);
      }`;

    const vorticityFrag = `
      precision highp float;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main(){
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = .5 * vec2(abs(T)-abs(B), abs(R)-abs(L));
        float len = max(length(force), 0.0001);
        force = force / len * curl * C;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0., 1.);
      }`;

    const pressureFrag = `
      precision mediump float;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main(){
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + T + B - divergence) * .25;
        gl_FragColor = vec4(pressure, 0., 0., 1.);
      }`;

    const gradSubtractFrag = `
      precision mediump float;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main(){
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vel -= vec2(R-L, T-B) * .5;
        gl_FragColor = vec4(vel, 0., 1.);
      }`;

    // ── GL helpers ─────────────────────────────────────────────
    const { gl, ext } = getWebGLContext(canvas);

    function compileShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    function createProgram(vertSrc, fragSrc) {
      const prog = gl.createProgram();
      gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vertSrc));
      gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fragSrc));
      gl.linkProgram(prog);
      const uniforms = {};
      const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) {
        const info = gl.getActiveUniform(prog, i);
        uniforms[info.name] = gl.getUniformLocation(prog, info.name);
      }
      return { prog, uniforms, bind() { gl.useProgram(prog); } };
    }

    // ── Programs ───────────────────────────────────────────────
    const clearProg      = createProgram(baseVert, clearFrag);
    const displayProg    = createProgram(baseVert, config.SHADING ? displayShadingFrag : displayFrag);
    const splatProg      = createProgram(baseVert, splatFrag);
    const advectionProg  = createProgram(baseVert, advectionFrag);
    const divergenceProg = createProgram(baseVert, divergenceFrag);
    const curlProg       = createProgram(baseVert, curlFrag);
    const vorticityProg  = createProgram(baseVert, vorticityFrag);
    const pressureProg   = createProgram(baseVert, pressureFrag);
    const gradSubProg    = createProgram(baseVert, gradSubtractFrag);

    // ── Quad ───────────────────────────────────────────────────
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,-1,1,1,1,1,-1]), gl.STATIC_DRAW);
    const idxBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW);

    function blit(target) {
      if (target == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    // ── FBO ────────────────────────────────────────────────────
    function createFBO(w, h, internalFormat, format, type, filter) {
      gl.activeTexture(gl.TEXTURE0);
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { tex, fbo, width: w, height: h,
        texelSizeX: 1 / w, texelSizeY: 1 / h,
        attach(id) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, tex); return id; }
      };
    }

    function createDoubleFBO(w, h, internalFormat, format, type, filter) {
      let fbo1 = createFBO(w, h, internalFormat, format, type, filter);
      let fbo2 = createFBO(w, h, internalFormat, format, type, filter);
      return {
        width: w, height: h, texelSizeX: fbo1.texelSizeX, texelSizeY: fbo1.texelSizeY,
        get read()  { return fbo1; },
        get write() { return fbo2; },
        swap() { [fbo1, fbo2] = [fbo2, fbo1]; }
      };
    }

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width  = Math.round(canvas.clientWidth  * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
    }

    function getResolution(res) {
      let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1 / aspectRatio;
      const min = Math.round(res);
      const max = Math.round(res * aspectRatio);
      return gl.drawingBufferWidth > gl.drawingBufferHeight
        ? { width: max, height: min }
        : { width: min, height: max };
    }

    resizeCanvas();
    const simRes = getResolution(config.SIM_RESOLUTION);
    const dyeRes = getResolution(config.DYE_RESOLUTION);

    const filter = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    let velocity   = createDoubleFBO(simRes.width, simRes.height, ext.formatRG.internalFormat,   ext.formatRG.format,   ext.halfFloatTexType, filter);
    let dye        = createDoubleFBO(dyeRes.width,  dyeRes.height,  ext.formatRGBA.internalFormat, ext.formatRGBA.format, ext.halfFloatTexType, filter);
    let pressure   = createDoubleFBO(simRes.width, simRes.height, ext.formatR.internalFormat,    ext.formatR.format,    ext.halfFloatTexType, gl.NEAREST);
    let divergence = createFBO(simRes.width, simRes.height, ext.formatR.internalFormat, ext.formatR.format, ext.halfFloatTexType, gl.NEAREST);
    let curl       = createFBO(simRes.width, simRes.height, ext.formatR.internalFormat, ext.formatR.format, ext.halfFloatTexType, gl.NEAREST);

    // ── Color helpers ──────────────────────────────────────────
    function HSVtoRGB(h, s, v) {
      let r, g, b;
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0: r=v; g=t; b=p; break; case 1: r=q; g=v; b=p; break;
        case 2: r=p; g=v; b=t; break; case 3: r=p; g=q; b=v; break;
        case 4: r=t; g=p; b=v; break; case 5: r=v; g=p; b=q; break;
        default: r=g=b=0;
      }
      return { r, g, b };
    }

    function generateColor() {
      const c = HSVtoRGB(Math.random(), 1, 1);
      c.r *= 0.15; c.g *= 0.15; c.b *= 0.15;
      return c;
    }

    // ── Splat ──────────────────────────────────────────────────
    function splat(x, y, dx, dy, color) {
      splatProg.bind();
      gl.uniform1i(splatProg.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProg.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProg.uniforms.point, x / canvas.width, 1 - y / canvas.height);
      gl.uniform3f(splatProg.uniforms.color, dx, -dy, 0);
      gl.uniform1f(splatProg.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100));
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatProg.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProg.uniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    }

    function correctRadius(radius) {
      const ar = canvas.width / canvas.height;
      return ar > 1 ? radius * ar : radius;
    }

    function multipleSplats(count) {
      for (let i = 0; i < count; i++) {
        const color = generateColor();
        color.r *= 10; color.g *= 10; color.b *= 10;
        splat(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          1000 * (Math.random() - 0.5),
          1000 * (Math.random() - 0.5),
          color
        );
      }
    }

    // ── Simulation step ────────────────────────────────────────
    let lastTime = Date.now();

    function step(dt) {
      gl.disable(gl.BLEND);

      // Curl
      curlProg.bind();
      gl.uniform2f(curlProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      // Vorticity
      vorticityProg.bind();
      gl.uniform2f(vorticityProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vorticityProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProg.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(vorticityProg.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProg.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      // Divergence
      divergenceProg.bind();
      gl.uniform2f(divergenceProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divergenceProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      // Clear pressure
      clearProg.bind();
      gl.uniform1i(clearProg.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearProg.uniforms.value, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      // Pressure solve
      pressureProg.bind();
      gl.uniform2f(pressureProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(pressureProg.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProg.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      // Gradient subtract
      gradSubProg.bind();
      gl.uniform2f(gradSubProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradSubProg.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradSubProg.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      // Advect velocity
      advectionProg.bind();
      gl.uniform2f(advectionProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform2f(advectionProg.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(advectionProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProg.uniforms.uSource,   velocity.read.attach(0));
      gl.uniform1f(advectionProg.uniforms.dt, dt);
      gl.uniform1f(advectionProg.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      // Advect dye
      gl.uniform2f(advectionProg.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      gl.uniform1i(advectionProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProg.uniforms.uSource,   dye.read.attach(1));
      gl.uniform1f(advectionProg.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    }

    // ── Render ─────────────────────────────────────────────────
    function render() {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      drawDisplay(null);
    }

    function drawDisplay(target) {
      const w = target ? target.width  : gl.drawingBufferWidth;
      const h = target ? target.height : gl.drawingBufferHeight;
      displayProg.bind();
      if (config.SHADING) gl.uniform2f(displayProg.uniforms.texelSize, 1 / w, 1 / h);
      gl.uniform1i(displayProg.uniforms.uTexture, dye.read.attach(0));
      blit(target);
    }

    // ── Initial burst ──────────────────────────────────────────
    multipleSplats(6);

    // ── Virtual cursors — move in sine-wave paths forever ──────
    const NUM_CURSORS = 5;
    const cursors = Array.from({ length: NUM_CURSORS }, (_, i) => ({
      x:      canvas.width  * (0.15 + i * 0.18),
      y:      canvas.height * (0.3  + (i % 2) * 0.4),
      vx:     0,
      vy:     0,
      phase:  (Math.PI * 2 * i) / NUM_CURSORS,   // stagger phases
      speed:  0.4 + Math.random() * 0.4,
      radius: 0.08 + Math.random() * 0.12,
      color:  (() => { const c = generateColor(); c.r *= 30; c.g *= 30; c.b *= 30; return c; })(),
    }));

    let elapsed = 0;

    // ── Animation loop ─────────────────────────────────────────
    let rafId;
    function update() {
      resizeCanvas();
      const now = Date.now();
      const dt  = Math.min((now - lastTime) / 1000, 0.016);
      lastTime  = now;
      elapsed  += dt;

      // Move each virtual cursor along a Lissajous-style path and splat
      cursors.forEach((cur, i) => {
        const t = elapsed * cur.speed + cur.phase;

        // New position: smooth figure-8 / sine path across full canvas
        const nx = canvas.width  * (0.5 + 0.45 * Math.sin(t));
        const ny = canvas.height * (0.5 + 0.45 * Math.sin(t * 1.3 + cur.phase));

        cur.vx = nx - cur.x;
        cur.vy = ny - cur.y;
        cur.x  = nx;
        cur.y  = ny;

        // Refresh color slowly
        if (Math.floor(elapsed * 0.3 + i * 0.7) !== Math.floor((elapsed - dt) * 0.3 + i * 0.7)) {
          const c = generateColor();
          cur.color = { r: c.r * 30, g: c.g * 30, b: c.b * 30 };
        }

        splat(cur.x, cur.y, cur.vx * 80, cur.vy * 80, cur.color);
      });

      step(dt);
      render();
      rafId = requestAnimationFrame(update);
    }

    // ── Real pointer interaction ───────────────────────────────
    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width  / rect.width);
      const y = (e.clientY - rect.top)  * (canvas.height / rect.height);
      const color = generateColor();
      color.r *= 30; color.g *= 30; color.b *= 30;
      splat(x, y, config.SPLAT_FORCE * (Math.random() - 0.5),
                  config.SPLAT_FORCE * (Math.random() - 0.5), color);
    }

    canvas.addEventListener('pointermove', onPointerMove);
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
      }}
    />
  );
};

export default FluidBackground;
