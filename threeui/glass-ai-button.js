/* GlassAiButton (ThreeUI, source SHA-256 a484571de316) — 사이트는 React가 아니라서 같은 동작을 그대로 옮긴 버전.
   원본 컴포넌트처럼: 화면에 보일 때만 iframe(sandbox="allow-scripts")을 붙이고, 탭이 숨으면 떼고, 로드되면 서서히 보인다.
   사용: <div class="threeui-background glass-ai-button" data-src="threeui/glass-ai-button.html" data-href="/pay?p=month"></div> */
(function () {
  function mountAll() {
    document.querySelectorAll('.glass-ai-button[data-src]').forEach(function (host) {
      if (host.__glass) return; host.__glass = 1;
      host.setAttribute('role', 'group');
      host.setAttribute('aria-label', host.getAttribute('data-label') || 'Interactive glass AI button');
      host.style.position = 'relative'; host.style.overflow = 'hidden'; host.style.background = host.hasAttribute('data-clear') || /bx2/.test(host.getAttribute('data-src')) ? 'transparent' : '#a8b0bd'; host.style.pointerEvents = 'auto';
      var hostVisible = false, docVisible = !document.hidden, frame = null;
      function sync() {
        var mounted = hostVisible && docVisible;
        host.setAttribute('data-state', !mounted ? 'paused' : (frame && frame.__ready ? 'ready' : 'loading'));
        if (mounted && !frame) {
          frame = document.createElement('iframe');
          frame.title = host.getAttribute('data-label') || 'Glass AI Button';
          frame.src = host.getAttribute('data-src');
          frame.setAttribute('sandbox', 'allow-scripts');
          frame.loading = 'eager';
          frame.style.cssText = 'position:absolute;inset:0;display:block;width:100%;height:100%;border:0;background:transparent;opacity:0;pointer-events:none;transition:opacity 240ms ease-out';
          var waitMsg = /bx2/.test(frame.src);
          frame.onload = function () { if (waitMsg) return; frame.__ready = 1; frame.style.opacity = '1'; frame.style.pointerEvents = 'auto'; host.setAttribute('data-state', 'ready'); };
          frame.__show = function () { frame.__ready = 1; frame.style.opacity = '1'; frame.style.pointerEvents = 'auto'; host.setAttribute('data-state', 'ready'); };
          host.appendChild(frame);
        } else if (!mounted && frame) { frame.remove(); frame = null; }
      }
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { hostVisible = es[0] ? es[0].isIntersecting : true; sync(); }, { rootMargin: '80px' }).observe(host);
      } else { hostVisible = true; }
      document.addEventListener('visibilitychange', function () { docVisible = !document.hidden; sync(); });
      host.__frameWin = function () { return frame && frame.contentWindow; };
      sync();
    });
  }
  /* 우리 버전: 버튼을 누르면 입자 효과를 잠깐 보여 준 뒤 결제 화면으로 이동 */
  window.addEventListener('message', function (e) {
    if (e.data && e.data.bx === 'glass-ready') { document.querySelectorAll('.glass-ai-button').forEach(function (h) { var f = h.querySelector('iframe'); if (f && f.contentWindow === e.source && f.__show) f.__show(); }); return; }
    if (!e.data || e.data.bx !== 'glass-activate') return;
    document.querySelectorAll('.glass-ai-button[data-href]').forEach(function (host) {
      if (host.__frameWin && host.__frameWin() === e.source) {
        try { if (window.__bxEv) window.__bxEv('pay_click', { cta: host.getAttribute('data-cta') || 'glass' }); } catch (x) {}
        var fb = host.parentNode && host.parentNode.querySelector('a.pay-go'); var to = (fb && fb.href) || host.getAttribute('data-href');   // [11-10] 유입 꼬리표(&s=)가 붙은 주소로
        setTimeout(function () { location.href = to; }, 280);   // [11-10] 빛 효과 잠깐만 보이고 바로 결제 화면
      }
    });
  });
  /* [11-10] 첫 화면이 다 그려진 뒤(한가할 때) 3D 를 붙인다. 그동안은 같은 모양의 가벼운 버튼이 보인다 */
  /* [2026-11-19] 속도: 약한 기기·데이터 절약·움직임 줄이기 설정이면 3D를 붙이지 않는다(같은 모양의 가벼운 버튼 그대로).
     3D는 화면이 다 뜨고 2.5초 뒤, 한가할 때 붙인다(첫 화면을 보는 동안 멈춤 방지) */
  function weak() {
    var n = navigator, c = n.connection || {};
    if (c.saveData || /(^|-)2g$/.test(c.effectiveType || '')) return true;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    if (n.deviceMemory && n.deviceMemory < 4) return true;
    if (n.hardwareConcurrency && n.hardwareConcurrency < 4) return true;
    return false;
  }
  function later() { if (weak()) return; setTimeout(function () { (window.requestIdleCallback || function (f) { setTimeout(f, 300); })(mountAll, { timeout: 2000 }); }, 2500); }
  if (document.readyState === 'complete') later(); else addEventListener('load', later);
  /* 결제 서버를 미리 깨워 둔다: 화면이 다 뜬 뒤 한 번 + 버튼에 손이 가면 한 번 [2026-11-19 모바일은 마우스가 없어 미리 깨우기가 안 됐음] */
  function wake() { try { fetch('https://script.google.com/macros/s/AKfycbxPac_qwfiW7pf0NvfCQr4Vyr9bLXWjq4KYFwclAmy2buZFajcD9AKsBcbd5BD0SCu9zA/exec?action=ping', { credentials: 'omit', keepalive: true }).catch(function () {}); } catch (x) {} }
  addEventListener('load', function () { setTimeout(wake, 4000); });
  var warmed = 0; document.addEventListener('pointerover', function (e) { if (warmed || !e.target.closest || !e.target.closest('.hp-join,.pay-go')) return; warmed = 1;
    try { fetch('https://script.google.com/macros/s/AKfycbxPac_qwfiW7pf0NvfCQr4Vyr9bLXWjq4KYFwclAmy2buZFajcD9AKsBcbd5BD0SCu9zA/exec?action=ping', { credentials: 'omit', keepalive: true }).catch(function () {}); } catch (x) {} }, { passive: true });
})();
