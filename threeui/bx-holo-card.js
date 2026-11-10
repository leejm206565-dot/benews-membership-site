/* 브경단 홀로 카드 — ThreeUI DarkSoulsHoloCard(Cindermane, SHA-256 a34740e8…)의 카드 부분만 옮김.
   그대로 옮긴 것: 카드 움직임(step: 자동 흔들림·포인터 기울기·스프링·드래그 회전과 관성·가까운 면으로 멈춤·뒤집기·6초 뒤 앞면 복귀),
   입력(setupInput: 드래그 회전 계수 85e-4/65e-4, 위아래 ±0.95 제한, 더블클릭/F 뒤집기, 화살표 키),
   조명 방향(uLightDir), 홀로 필름 GLSL(LAMINATE 햇살 격자 + 거울 반사 + sweep 빛 띠 + glitter 금속 조각, COMMON 의 hash·vnoise·hue·holo).
   뺀 것: Three.js 엔진, 배경 세계(성당·칼·나무·불), 블룸 후처리, 13MB 그림. 카드 그림은 HTML 로, 필름은 작은 WebGL 하나로 그린다. */
(function () {
  var root = document.querySelector('.bxh'); if (!root) return;
  var card = root.querySelector('.bxh-card'), foil = root.querySelector('.bxh-foil'), fr = root.querySelector('.bxh-front'), bk = root.querySelector('.bxh-back');
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var S = { rot: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, face: 0, hover: 0, ptr: { x: 0, y: 0, t: -99, inside: false },
    drag: false, inertia: false, spin: -1, introT: 0, lastInput: 0, time: 0, last: { x: 0, y: 0, t: 0 } };
  var nearestFace = function (y) { return Math.round(y / Math.PI) * Math.PI; };
  var isFront = function (y) { return Math.abs(Math.round(y / Math.PI)) % 2 === 0; };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var easeInOut = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var ease = function (t) { t = clamp(t, 0, 1); return 1 - Math.pow(1 - t, 3); };
  function touch() { S.lastInput = S.time; }
  function flip() { S.face = nearestFace(S.rot.y) + Math.PI; S.inertia = false; S.spin = -1; touch(); hint(); }
  function hint() { var h = root.querySelector('.bxh-hint'); if (h) h.classList.add('gone'); }

  // ---- 입력 (원본 setupInput, 카드 영역 기준)
  function toN(e) { var r = root.getBoundingClientRect();
    return { x: clamp(((e.clientX - r.left) / r.width - .5) / .45, -1.3, 1.3), y: clamp(-((e.clientY - r.top) / r.height - .5) / .5, -1.3, 1.3) }; }
  root.addEventListener('pointermove', function (e) {
    var n = toN(e);
    if (S.drag) {
      var dx = e.clientX - S.last.x, dy = e.clientY - S.last.y, now = performance.now(), dt = Math.max((now - S.last.t) / 1e3, 1 / 120);
      S.rot.y += dx * 85e-4; S.rot.x = clamp(S.rot.x + dy * 65e-4, -.95, .95);
      S.vel.x = clamp(S.vel.x * .55 + dy * 65e-4 / dt * .45, -3, 3); S.vel.y = clamp(S.vel.y * .55 + dx * 85e-4 / dt * .45, -7.5, 7.5);
      S.last = { x: e.clientX, y: e.clientY, t: now }; hint();
    }
    S.ptr = { x: n.x, y: n.y, t: S.time, inside: true };
    if (S.spin >= 0) { S.face = nearestFace(S.rot.y); S.spin = -1; }
    touch();
  });
  root.addEventListener('pointerleave', function () { S.ptr.inside = false; });
  card.addEventListener('pointerdown', function (e) {
    if (e.button !== 0) return;
    S.drag = true; S.inertia = false; S.spin = -1; touch();
    S.last = { x: e.clientX, y: e.clientY, t: performance.now() }; S.vel.x = S.vel.y = 0;
    try { card.setPointerCapture(e.pointerId); } catch (_) {}
    root.classList.add('dragging');
  });
  function up() { if (!S.drag) return; S.drag = false; S.inertia = true; if (performance.now() - S.last.t > 90) { S.vel.x = S.vel.y = 0; } root.classList.remove('dragging'); touch(); }
  card.addEventListener('pointerup', up); card.addEventListener('pointercancel', up); card.addEventListener('lostpointercapture', up);
  card.addEventListener('dblclick', flip);
  card.addEventListener('keydown', function (e) {
    var k = e.key.toLowerCase(); touch();
    if (k === 'f' || k === 'enter' || k === ' ') { e.preventDefault(); flip(); return; }
    if (k === 'arrowleft') S.vel.y -= 2.2; else if (k === 'arrowright') S.vel.y += 2.2; else if (k === 'arrowup') S.vel.x -= 1.6; else if (k === 'arrowdown') S.vel.x += 1.6; else return;
    e.preventDefault(); S.inertia = true; hint();
  });

  // ---- 움직임 (원본 step)
  var light = [0, .5, 1];
  function step(dt, t) {
    S.time = t;
    var since = S.time - S.ptr.t, wantHover = S.ptr.inside && since < 2.6 && !S.drag;
    S.hover += ((wantHover ? 1 : 0) - S.hover) * (1 - Math.exp(-dt * (wantHover ? 5 : 1.4)));
    var sway = reduced ? 0 : 1;
    var auto = { x: .1 * Math.sin(t * .53 + .6) * sway, y: .36 * Math.sin(t * .37) * sway };
    var hov = { x: -S.ptr.y * .36, y: S.ptr.x * .52 };
    var idle = S.time - S.lastInput, busy = S.drag || S.inertia;
    if (!busy && !reduced && idle > 6 && !isFront(S.face) && S.spin < 0) S.face += Math.PI;
    if (!busy && !reduced && idle > 15 && isFront(S.face) && S.spin < 0 && S.introT > 3) S.spin = 0;
    var spinOff = 0;
    if (S.spin >= 0) { S.spin += dt / 6; spinOff = easeInOut(S.spin) * Math.PI * 2; if (S.spin >= 1) { S.face += Math.PI * 2; spinOff = 0; S.spin = -1; touch(); } }
    var face = S.face + spinOff, tx = lerp(auto.x, hov.x, S.hover), ty = face + lerp(auto.y, hov.y, S.hover);
    if (S.drag) {
    } else if (S.inertia) {
      S.rot.x = clamp(S.rot.x + S.vel.x * dt, -.95, .95); S.rot.y += S.vel.y * dt;
      var d = Math.exp(-dt * 2.6); S.vel.x *= d; S.vel.y *= d;
      if (Math.hypot(S.vel.x, S.vel.y) < .9) { S.inertia = false; S.face = nearestFace(S.rot.y); }
    } else {
      var k = S.introT < 2.2 ? 16 : 34, c = 2 * Math.sqrt(k) * .72;
      S.vel.x += (k * (tx - S.rot.x) - c * S.vel.x) * dt; S.vel.y += (k * (ty - S.rot.y) - c * S.vel.y) * dt;
      S.rot.x += S.vel.x * dt; S.rot.y += S.vel.y * dt;
    }
    S.introT += dt;
    var rise = ease(S.introT / 1.9);
    var y = lerp(60, 0, rise) + (reduced ? 0 : Math.sin(t * .8) * 4), sc = lerp(.86, 1, rise), rz = reduced ? 0 : Math.sin(t * .31) * .012;
    // three.js 회전(rotation.x, y, z) → CSS (x 는 방향이 반대)
    card.style.transform = 'translateY(' + y.toFixed(2) + 'px) scale(' + sc.toFixed(4) + ') rotateX(' + (-S.rot.x).toFixed(4) + 'rad) rotateY(' + S.rot.y.toFixed(4) + 'rad) rotateZ(' + (-rz).toFixed(4) + 'rad)';
    var showBack = Math.cos(S.rot.y) < 0;   // [11-10] 뒷면 숨기기를 브라우저에만 맡기지 않고 직접 정한다(일부 화면에서 뒷면이 비쳐 보이던 문제)
    if (showBack !== S.showBack) { S.showBack = showBack; card.classList.toggle('is-back', showBack); fr.style.visibility = showBack ? 'hidden' : 'visible'; bk.style.visibility = showBack ? 'visible' : 'hidden'; }
    var la = [Math.sin(t * .29) * .75, .42 + .3 * Math.sin(t * .21 + 1.2), 1], lh = [S.ptr.x * 1.15, .48 + S.ptr.y * .85, .9];
    light = [lerp(la[0], lh[0], S.hover), lerp(la[1], lh[1], S.hover), lerp(la[2], lh[2], S.hover)];
    var L = Math.hypot(light[0], light[1], light[2]); light = [light[0] / L, light[1] / L, light[2] / L];
    card.style.setProperty('--gx', (50 + light[0] * 45).toFixed(1) + '%'); card.style.setProperty('--gy', (50 - light[1] * 45).toFixed(1) + '%');
  }

  // ---- 홀로 필름 (원본 GLSL: COMMON 일부 + LAMINATE + sweep + glitter), 겨울 빛깔로 섞음
  var gl = null, prog = null, U = {};
  try { gl = foil.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false }); } catch (e) {}
  if (gl) {
    var VS = 'attribute vec2 p;varying vec2 vUv;void main(){vUv=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}';
    var FS = ['precision highp float;varying vec2 vUv;uniform float uTime,uGlare,uFoil,uHover;uniform vec3 uLightDir;uniform mat3 uRootRot;',
      'float hash12(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}',
      'vec2 hash22(vec2 p){vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973));p3+=dot(p3,p3.yzx+33.33);return fract((p3.xx+p3.yz)*p3.zy);}',
      'float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash12(i),hash12(i+vec2(1,0)),f.x),mix(hash12(i+vec2(0,1)),hash12(i+vec2(1,1)),f.x),f.y);}',
      'vec3 hue(float t){return clamp(abs(fract(t+vec3(0.,2./3.,1./3.))*6.-3.)-1.,0.,1.);}',
      'vec3 holo(float t){return mix(hue(t),vec3(1.),.22);}',
      'vec3 axisT(){return normalize(uRootRot*vec3(1.,0.,0.));}vec3 axisB(){return normalize(uRootRot*vec3(0.,-1.,0.));}vec3 axisN(){return normalize(uRootRot*vec3(0.,0.,1.));}',
      'float sweepX(vec2 cardUv,vec3 V){vec2 v2=vec2(dot(V,axisT()),dot(V,axisB()));vec2 l2=vec2(dot(uLightDir,axisT()),dot(uLightDir,axisB()));return dot(cardUv-.5,vec2(.85,-.53))-(v2.x*1.35-v2.y*.9+l2.x*.45);}',
      'float sweepBand(float x,float w){return exp(-x*x/(w*w));}',
      'vec3 glitter(vec2 p,vec3 N,vec3 V,vec3 T,vec3 B,float density,float power){vec2 id=floor(p),f=fract(p);float on=step(1.-density,hash12(id+7.7));float d=length(f-(.25+.5*hash22(id)));float flake=smoothstep(.32,.0,d);vec2 tilt=(hash22(id+3.3)-.5)*.9;vec3 fn=normalize(N+T*tilt.x+B*tilt.y);float s=pow(max(dot(fn,normalize(uLightDir+V)),0.),power);return holo(hash12(id+1.9))*mix(.5,1.,hash12(id))*s*flake*on;}',
      'vec3 winter(vec3 c){return mix(c,vec3(.62,.82,1.)*dot(c,vec3(.33)),.35);}',
      'void main(){vec3 T=axisT(),B=axisB(),N=axisN();vec3 V=vec3(0.,0.,1.);',
      ' vec2 v2=vec2(dot(V,T),dot(V,B)),l2=vec2(dot(uLightDir,T),dot(uLightDir,B));',
      ' vec2 d=(vUv-vec2(.5,.330))*vec2(1.,1.397);float ang=atan(d.y,d.x),rad=length(d);vec2 g=vec2(cos(ang),sin(ang));',
      ' vec2 h=v2+l2;float mirror=exp(-dot(h,h)*7.);float rays=pow(.5+.5*cos(ang*90.),2.);',
      ' float grain=vnoise(vUv*vec2(360.,540.));float dust=pow(vnoise(vUv*vec2(1100.,1650.)),4.)*3.;',
      ' vec3 c=mix(hue(dot(h,g)*2.4+rad*1.6+grain*.06),vec3(1.),.38);',
      ' float amt=uFoil*(.004+.24*mirror)*(.30+.70*rays)*(.25+.75*dust+.2*grain);vec3 col=winter(c)*amt;',
      ' col+=vec3(.92,.96,1.)*pow(mirror,6.)*.035*uGlare;',
      ' float sx=sweepX(vUv,V);col+=winter(hue(sx*4.2+.1))*sweepBand(sx,.11)*uFoil*.20*(.35+.65*dust+.25*rays);',
      ' col+=glitter(vUv*vec2(150.,225.),N,V,T,B,.30,420.)*2.2*uFoil;',
      ' col*=1.9+uHover*.8;gl_FragColor=vec4(col,max(max(col.r,col.g),col.b));}'].join('\n');
    var sh = function (t, src) { var s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(s); return s; };
    try {
      prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog); gl.useProgram(prog);
      var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['uTime', 'uGlare', 'uFoil', 'uHover', 'uLightDir', 'uRootRot'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
    } catch (e) { gl = null; }
  }
  function sizeFoil() { if (!gl) return; var r = foil.getBoundingClientRect(), pr = Math.min(devicePixelRatio || 1, 1);
    var w = Math.max(2, Math.round(r.width * pr)), h = Math.max(2, Math.round(r.height * pr)); if (foil.width !== w || foil.height !== h) { foil.width = w; foil.height = h; } gl.viewport(0, 0, w, h); }
  function rotMat(x, y, z) { // three.js Euler XYZ → 3x3 (열 우선)
    var a = Math.cos(x), b = Math.sin(x), c = Math.cos(y), d = Math.sin(y), e = Math.cos(z), f = Math.sin(z), ae = a * e, af = a * f, be = b * e, bf = b * f;
    return [c * e, af + be * d, bf - ae * d, -c * f, ae - bf * d, be + af * d, d, -b * c, a * c];
  }
  function draw(t) {
    if (!gl) return;
    gl.uniform1f(U.uTime, t); gl.uniform1f(U.uGlare, 1); gl.uniform1f(U.uFoil, 1); gl.uniform1f(U.uHover, S.hover);
    gl.uniform3f(U.uLightDir, light[0], light[1], light[2]);
    gl.uniformMatrix3fv(U.uRootRot, false, rotMat(S.rot.x, S.rot.y, 0));
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // ---- 화면에 보일 때만 돈다
  var on = false, last = 0, t0 = performance.now(), raf = 0;
  var lastDraw = 0;
  function loop(ms) { raf = 0; if (!on) return; var dt = Math.min((ms - last) / 1e3, .05); last = ms; step(dt, (ms - t0) / 1e3);
    if (ms - lastDraw > 33) { lastDraw = ms; draw((ms - t0) / 1e3); }   // [11-10] 필름은 초당 30번만 그려도 같아 보임(가볍게)
    raf = requestAnimationFrame(loop); }
  function start() { if (on) return; on = true; last = performance.now(); sizeFoil(); raf = requestAnimationFrame(loop); }
  function stop() { on = false; }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { (es[0].isIntersecting && !document.hidden) ? start() : stop(); }, { rootMargin: '80px' }).observe(root); else start();
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); });
  addEventListener('resize', sizeFoil);
})();
