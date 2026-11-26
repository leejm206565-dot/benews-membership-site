/* 방문 기록 공용 스크립트 (2026-11-03 사장 지시 '배포 전 추가 수정' 1·3·5번)
   <script src="js/bxvis.js" defer data-page="main|openmedia|pay|register|kit"></script>
   - 방문자ID: 무작위 값, 쿠키 bxv + localStorage bx:vid (400일). 24시간 고유 방문자를 세는 데만 쓴다. 이름·연락처 같은 정보는 보내지 않는다.
   - 지문: 브라우저 정보·화면 크기·언어·시간대를 섞은 짧은 해시. 방문자ID가 지워진 경우에만 서버가 24시간 중복 판단에 쓴다. IP는 쓰지 않는다.
   - 머문 시간: 화면에 실제로 보인 시간만(다른 탭·화면 꺼짐 제외). 15초마다 보내고, 떠날 때 마지막으로 보낸다.
   - 구역 시간: data-section 구역이 화면 절반 이상 보인 시간.
   - 직원 추천: ?ref=코드 링크로 들어온 뒤 3일(72시간) 기억, 마지막 링크 기준(2026-11-27 사장 지시). 회원가입(첫 로그인) 때 담당자가 정해지고 평생 유지된다. 직원 링크 방문은 채널을 보내지 않는다.
   - 내부: ?team=1 로 한 번 열면 그 브라우저는 집계에서 빠진다(?team=0 으로 해제). */
(function () {
  var EP = (typeof SHEET_ENDPOINT === 'string' && SHEET_ENDPOINT) ||
    'https://script.google.com/macros/s/AKfycbxPac_qwfiW7pf0NvfCQr4Vyr9bLXWjq4KYFwclAmy2buZFajcD9AKsBcbd5BD0SCu9zA/exec';
  var me = document.currentScript, page = (me && me.getAttribute('data-page')) || 'main';
  var PC = { main: 'm', openmedia: 'o', pay: 'p', register: 'r', kit: 'k' }[page] || 'm';
  var noop = { sec: function () {}, pay: function () {} };
  window.BXVIS = noop;
  if (!window.URLSearchParams) return;
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} return null; }
  function rnd() { try { var a = new Uint32Array(3); crypto.getRandomValues(a); return Array.prototype.map.call(a, function (x) { return x.toString(36); }).join(''); } catch (e) { return Date.now().toString(36) + Math.random().toString(36).slice(2); } }
  var qs = new URLSearchParams(location.search);
  // 내부(직원) 브라우저
  if (qs.get('team') === '1') ls('bx:team', '1'); else if (qs.get('team') === '0') ls('bx:team', null);
  var team = ls('bx:team') || navigator.webdriver ? '1' : '0';   // [2026-11-16] 자동 점검 프로그램(웹드라이버) 방문은 내부로
  // 방문자ID (쿠키 + localStorage, 둘 중 하나만 남아 있어도 복구)
  var ck = (/(?:^|;\s*)bxv=([a-z0-9]{6,32})/.exec(document.cookie) || [])[1], st = ls('bx:vid'), uid = ck || st, nid = '0';
  if (!uid || !/^[a-z0-9]{6,32}$/.test(uid)) { uid = rnd().slice(0, 24); nid = '1'; }
  if (st !== uid) ls('bx:vid', uid);
  if (ck !== uid) { try { document.cookie = 'bxv=' + uid + '; max-age=' + 400 * 86400 + '; path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : ''); } catch (e) {} }
  // 지문(짧은 해시, FNV-1a)
  var fp = (function () {
    var s = [navigator.userAgent, screen.width + 'x' + screen.height, window.devicePixelRatio || 1, navigator.language || '',
      (Intl.DateTimeFormat && Intl.DateTimeFormat().resolvedOptions().timeZone) || '', navigator.platform || ''].join('|'), h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 0x01000193) >>> 0; }
    return h.toString(36);
  })();
  // [2026-11-27 사장 지시] 직원 추천 코드: 마지막 직원 링크부터 3일(72시간) 이 브라우저에 기억. 다른 직원 링크로 오면 그 직원으로 바꾸고 3일 다시
  var rq = String(qs.get('ref') || '').toLowerCase(), rcode = '', REF_MS = 72 * 3600 * 1000;
  try {
    var R0 = JSON.parse(ls('bx:ref3') || 'null');
    if (/^[a-z0-9]{2,16}$/.test(rq)) { R0 = { ref: rq, at: Date.now() }; ls('bx:ref3', JSON.stringify(R0)); }
    rcode = R0 && /^[a-z0-9]{2,16}$/.test(R0.ref) && Date.now() - Number(R0.at) <= REF_MS ? R0.ref : '';
  } catch (e) { rcode = /^[a-z0-9]{2,16}$/.test(rq) ? rq : ''; }
  window.BXREF = function () { return rcode; };
  // [2026-11-20 사장 지시] 처음 들어온 경로는 이 브라우저에 오래 기억(직원 링크로 와서 나중에 다른 창에서 가입·결제해도 그 직원으로). 로그인할 때 my.html 이 서버로 보냄
  try {
    var F0 = JSON.parse(ls('bx:first') || 'null'), okR = /^[a-z0-9]{2,16}$/.test(rq);
    if (!F0 || (!F0.ref && okR)) {
      var rh = ''; try { rh = document.referrer && new URL(document.referrer).hostname !== location.hostname ? new URL(document.referrer).hostname : ''; } catch (e) {}
      ls('bx:first', JSON.stringify({ ref: (F0 && F0.ref) || (okR ? rq : ''), src: (F0 && F0.src) || srcQ() || (rh ? '?src=' + rh : 'direct'), at: (F0 && F0.at) || Date.now() }));
    }
  } catch (e) {}
  // [2026-11-27] 마지막으로 들어온 경로(사장 담당 신규 가입의 경로 = 가입 직전 마지막 방문). 탭의 첫 화면에서만, 우리 사이트 안 이동은 빼고
  try {
    if (!sessionStorage.getItem('bx:sid')) {
      var rh2 = ''; try { rh2 = document.referrer && new URL(document.referrer).hostname !== location.hostname ? new URL(document.referrer).hostname : ''; } catch (e) {}
      if (!(document.referrer && !rh2)) ls('bx:last', JSON.stringify({ src: srcQ() || (rh2 ? '?src=' + rh2 : 'direct'), at: Date.now() }));
    }
  } catch (e) {}
  // 세션(탭)마다 + 페이지마다 한 줄
  var sid = '';
  try { sid = sessionStorage.getItem('bx:sid') || ''; if (!sid) { sid = Date.now().toString(36) + Math.random().toString(36).slice(2, 8); sessionStorage.setItem('bx:sid', sid); } } catch (e) { sid = rnd().slice(0, 12); }
  sid = sid + PC;
  // 유입: 앱 안 브라우저가 링크 꼬리를 떼도 출처 표시
  function srcQ() {
    var q = (location.search || '').slice(0, 200);
    if (/[?&](src|utm_source)=/.test(q)) return q;
    var ua = navigator.userAgent || '', rf = document.referrer || '', add = '';
    if (/Barcelona/i.test(ua) || /threads\.(net|com)/i.test(rf)) add = 'utm_source=threads&utm_medium=app';
    else if (/Instagram/i.test(ua) || /instagram\.com/i.test(rf)) add = 'utm_source=instagram&utm_medium=app';
    return add ? (q ? q + '&' : '?') + add : q;
  }
  // 보인 시간
  var vis = 0, since = document.visibilityState === 'visible' ? Date.now() : 0;
  function seen() { return Math.round((vis + (since ? Date.now() - since : 0)) / 1000); }
  // 구역 시간
  var secs = {}, secT = {}, secOn = {};
  function secNow() { var o = {}; Object.keys(secT).forEach(function (k) { o[k] = secT[k] + (secOn[k] && since ? Date.now() - secOn[k] : 0); }); return o; }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        var k = x.target.getAttribute('data-section'); if (!k) return;
        if (x.isIntersecting) { secs[k] = 1; if (!(k in secT)) secT[k] = 0; if (!secOn[k]) secOn[k] = Date.now(); }
        else if (secOn[k]) { secT[k] += Date.now() - secOn[k]; secOn[k] = 0; }
      });
    }, { threshold: 0.5 });
    var hook = function () { Array.prototype.forEach.call(document.querySelectorAll('[data-section]'), function (el) { io.observe(el); }); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hook); else hook();
  }
  var pay = '0', n = 0, lastBeat = -1;
  function send(kind) {
    if (++n > 400) return;
    try {
      var so = secNow(), st = Object.keys(so).map(function (k) { return k + ':' + Math.round(so[k] / 1000); }).join(',');
      var d = new URLSearchParams({ action: 'visit', vid: sid, kind: kind, page: page, uid: uid, fp: fp, nid: nid, src: rcode ? '' : srcQ(),   // [2026-11-27] 직원 링크 방문은 채널을 남기지 않음
        ref: rcode ? '' : (document.referrer || '').split(/[?#]/)[0].slice(0, 100), dev: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? '모바일' : 'PC',
        secs: Object.keys(secs).join(','), st: st.slice(0, 600), sec: String(seen()), pay: pay, team: team, rcode: rcode, website: '' });
      if (!(navigator.sendBeacon && navigator.sendBeacon(EP, d))) fetch(EP, { method: 'POST', body: d, keepalive: true }).catch(function () {});
    } catch (e) {}
  }
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      if (since) { vis += Date.now() - since; since = 0; }
      Object.keys(secOn).forEach(function (k) { if (secOn[k]) { secT[k] += Date.now() - secOn[k]; secOn[k] = Date.now(); } });
      send('leave');
    } else { since = Date.now(); Object.keys(secOn).forEach(function (k) { if (secOn[k]) secOn[k] = Date.now(); }); }
  });
  window.addEventListener('pagehide', function () { if (since) send('leave'); });
  // [2026-11-16] 결제가 느려지지 않게: 체류 신호를 15초마다 → 15·30·60·120·240·480초, 그 뒤 15분마다(떠날 때 신호가 정확한 시간을 보냄)
  var nextBeat = 15;
  setInterval(function () { if (!since) return; var s = seen(); if (s >= nextBeat && s - lastBeat >= 10) { lastBeat = s; nextBeat = nextBeat < 480 ? nextBeat * 2 : s + 900; send('beat'); } }, 5000);
  send('land');
  window.BXVIS = { sec: function (s) { secs[s] = 1; }, pay: function () { pay = '1'; send('pay'); } };
})();
