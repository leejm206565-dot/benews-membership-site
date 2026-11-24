/* [2026-11-24 사장 지시] 홈페이지 미니 상담창(채널톡 형태): 첫 화면 = 인사 + 카카오톡 문의 카드 + 자주 묻는 질문 목록, 질문 누르면 답 화면(뒤로 가기).
 * 답변 문구는 카카오 챗봇(오픈빌더 '브경단' 봇)과 같게 유지한다(benews-membership/챗봇_자동응답_문구.md). 가격은 공개 규칙대로 "월 2만원부터(VAT 별도)"까지만. */
(function () {
  if (window.__bxchat) return; window.__bxchat = 1;
  var KAKAO = 'https://pf.kakao.com/_xkCxkNX/chat', HOME = 'https://membership.openxcorp.co.kr', MY = HOME + '/my.html', LOGO = '/img/favicon-512.png';
  var QA = [
    ["요금이 얼마예요?", "한 달에 2만원부터예요. (VAT 별도)\n\n요금제는 3가지예요.\n정확한 가격은 로그인하면 보여요.\n\n언제든 그만둘 수 있어요.", ["로그인하고 가격 보기", MY]],
    ["어떻게 가입해요?", "1. 카카오·네이버·구글로 로그인\n2. 요금제 고르고 결제\n3. 내 기자실에서 '기자 계정 만들기'\n\n끝나면 내 기자실에 아이디가 나와요.", ["내 기자실 가기", MY]],
    ["기사는 어떻게 올려요?", "내 기자실에 나온 아이디로\n브랜드경제신문에 로그인해서 올리면 돼요.\n\n편집국이 확인하면 신문에 실려요.", ["내 기자실 가기", MY]],
    ["기자증은 어떻게 받아요?", "Pro·Max 회원은 기자증을 택배로 받아요. (무료)\n\n내 기자실 '기자증 발급 신청'에\n사진과 주소를 보내 주세요.\n\n14일 안에 보내 드려요. (주말·공휴일 빼고)"],
    ["네이버 뉴스에도 낼 수 있어요?", "Pro·Max 회원은 네이버 뉴스에 나오는\n큰 언론사에도 기사를 낼 수 있어요.\n\n언론사마다 비용이 따로 있어요.\n신청은 내 기자실에서 해요."],
    ["해지는 어떻게 해요?", "내 기자실 → 요금제 → '해지 신청'을 누르세요.\n\n다음 결제일 3일 전까지 신청하면\n다음 달 요금이 안 나가요. (주말·공휴일 빼고 3일)", ["환불 기준 보기", HOME + '/refund.html']],
    ["세금계산서 돼요?", "네, 발급해 드려요.\n\n사업자등록증과 받을 이메일을\n카카오톡으로 보내 주세요."]
  ];
  var F = '"Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif';
  var css = ''
    + '#bxc-btn{position:fixed;right:10px;bottom:calc(20px + env(safe-area-inset-bottom));z-index:70;width:60px;height:60px;border:0;border-radius:50%;background:#0B6B3A;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(11,107,58,.35),0 2px 6px rgba(0,0,0,.12);cursor:pointer;transition:bottom .2s,transform .15s}'
    + '#bxc-btn:hover{transform:scale(1.06)}#bxc-btn:focus-visible{outline:3px solid #FEE500;outline-offset:3px}#bxc-btn .ic-x{display:none}#bxc-btn[aria-expanded=true] .ic-c{display:none}#bxc-btn[aria-expanded=true] .ic-x{display:block}'
    + '#bxc{position:fixed;right:20px;bottom:calc(92px + env(safe-area-inset-bottom));z-index:71;width:380px;height:min(620px,calc(100vh - 120px));display:flex;flex-direction:column;background:#F4F5F7;border-radius:24px;box-shadow:0 20px 60px rgba(0,0,0,.22),0 2px 8px rgba(0,0,0,.08);overflow:hidden;font-family:' + F + ';color:#1B1D1F;letter-spacing:-.01em;-webkit-font-smoothing:antialiased}'
    + '#bxc[hidden]{display:none}#bxc *{box-sizing:border-box;margin:0}#bxc button{font-family:inherit;letter-spacing:inherit}'
    + '#bxc .bx-top{display:flex;align-items:center;gap:8px;height:60px;padding:0 10px 0 18px;flex:none}'
    + '#bxc .bx-top b{font-size:17px;font-weight:700}#bxc .bx-ib{width:40px;height:40px;border:0;border-radius:12px;background:transparent;color:#5B6067;display:flex;align-items:center;justify-content:center;cursor:pointer}#bxc .bx-ib:hover{background:#E8EAED}#bxc .bx-ib:focus-visible{outline:2px solid #0B6B3A}'
    + '#bxc .bx-sp{flex:1}#bxc .bx-view{flex:1;overflow-y:auto;padding:4px 16px 16px;overscroll-behavior:contain}'
    + '#bxc .bx-hi{padding:6px 4px 18px}#bxc .bx-hi .bx-av{width:52px;height:52px;border-radius:16px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.1);display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:14px}#bxc .bx-hi .bx-av img{width:40px;height:40px}'
    + '#bxc .bx-hi h2{font-size:22px;font-weight:700;line-height:1.35}#bxc .bx-hi p{margin-top:6px;font-size:15px;color:#5B6067;line-height:1.5}'
    + '#bxc .bx-card{background:#fff;border-radius:18px;box-shadow:0 1px 2px rgba(0,0,0,.06);padding:18px;margin-bottom:12px}'
    + '#bxc .bx-card h3{font-size:15px;font-weight:700}#bxc .bx-card .bx-s{margin-top:4px;font-size:13.5px;color:#7A7F86;display:flex;align-items:center;gap:6px}#bxc .bx-dot{width:7px;height:7px;border-radius:50%;background:#22B14C;flex:none}'
    + '#bxc .bx-kk{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:50px;margin-top:14px;border-radius:14px;background:#FEE500;color:#191919;font-size:16px;font-weight:700;text-decoration:none}#bxc .bx-kk:hover{background:#F5DC00}#bxc .bx-kk:focus-visible{outline:3px solid #0B6B3A;outline-offset:2px}'
    + '#bxc .bx-list{padding:6px 0}#bxc .bx-list h3{padding:12px 18px 6px}'
    + '#bxc .bx-row{display:flex;align-items:center;gap:10px;width:100%;min-height:52px;padding:0 14px 0 18px;border:0;background:none;text-align:left;font-size:15px;font-weight:500;color:#1B1D1F;cursor:pointer;border-top:1px solid #F0F1F3}#bxc .bx-row:first-of-type{border-top:0}#bxc .bx-row span{flex:1;line-height:1.4;padding:12px 0}#bxc .bx-row:hover{background:#F7F8F9}#bxc .bx-row:focus-visible{outline:2px solid #0B6B3A;outline-offset:-2px}#bxc .bx-row svg{color:#A0A5AB;flex:none}'
    + '#bxc .bx-q{align-self:flex-end;margin:4px 0 14px auto;max-width:85%;width:fit-content;padding:11px 15px;border-radius:18px 18px 4px 18px;background:#0B6B3A;color:#fff;font-size:15px;font-weight:600;line-height:1.45}'
    + '#bxc .bx-msg{display:flex;gap:10px;align-items:flex-start}#bxc .bx-msg .bx-av{width:36px;height:36px;border-radius:12px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.1);display:flex;align-items:center;justify-content:center;flex:none;overflow:hidden}#bxc .bx-msg .bx-av img{width:28px;height:28px}'
    + '#bxc .bx-msg .bx-nm{font-size:13px;font-weight:600;color:#5B6067;margin-bottom:5px}#bxc .bx-bub{background:#fff;border-radius:4px 18px 18px 18px;padding:14px 16px;font-size:15px;line-height:1.6;white-space:pre-line;word-break:keep-all;overflow-wrap:anywhere;box-shadow:0 1px 2px rgba(0,0,0,.06)}'
    + '#bxc .bx-go{display:flex;align-items:center;justify-content:center;gap:4px;margin-top:12px;height:44px;border-radius:12px;background:#EEF6F1;color:#0B6B3A;font-size:14.5px;font-weight:700;text-decoration:none}#bxc .bx-go:hover{background:#E1F0E7}'
    + '#bxc .bx-more{margin-top:20px;text-align:center;font-size:14px;color:#7A7F86}#bxc .bx-more button{margin-top:10px;height:40px;padding:0 16px;border:1px solid #DDE0E4;border-radius:999px;background:#fff;color:#1B1D1F;font-size:14px;font-weight:600;cursor:pointer}#bxc .bx-more button:hover{border-color:#0B6B3A;color:#0B6B3A}'
    + '#bxc .bx-ft{flex:none;padding:10px 16px 14px;background:#F4F5F7}#bxc .bx-ft .bx-kk{margin-top:0}'
    + '@media (max-width:480px){#bxc{left:0;right:0;bottom:0!important;width:auto;height:min(88vh,680px);border-radius:24px 24px 0 0}}'
    + '@media (prefers-reduced-motion:reduce){#bxc-btn{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var SV = function (p, w) { return '<svg width="' + (w || 24) + '" height="' + (w || 24) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
  var I_CHAT = '<svg class="ic-c" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.6 1.6 4.9 4 6.4V21l3.6-2.3c.8.2 1.6.3 2.4.3 5.5 0 10-3.6 10-8s-4.5-8-10-8z"/></svg>';
  var I_X = SV('<path d="M18 6 6 18M6 6l12 12"/>'), I_BACK = SV('<path d="M15 18l-6-6 6-6"/>'), I_R = SV('<path d="M9 18l6-6-6-6"/>', 18);
  var I_KK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#191919" aria-hidden="true"><path d="M12 3.5C6.8 3.5 2.5 6.8 2.5 10.9c0 2.6 1.8 5 4.4 6.3l-1 3.7c-.1.3.3.6.6.4l4.3-2.9c.4 0 .8.1 1.2.1 5.2 0 9.5-3.3 9.5-7.5S17.2 3.5 12 3.5z"/></svg>';
  var KK = '<a class="bx-kk" href="' + KAKAO + '" target="_blank" rel="noopener" data-cta="chat-kakao">' + I_KK + '카카오톡으로 문의하기</a>';
  var AV = '<img src="' + LOGO + '" alt="" width="40" height="40">';
  var btn = document.createElement('button'); btn.type = 'button'; btn.id = 'bxc-btn'; btn.setAttribute('aria-label', '상담 열기'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'bxc'); btn.dataset.cta = 'chat-open';
  btn.innerHTML = I_CHAT + '<span class="ic-x">' + I_X + '</span>';
  var box = document.createElement('section'); box.id = 'bxc'; box.hidden = true; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', '브경단 상담');
  document.body.appendChild(box); document.body.appendChild(btn);
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function home() {
    var rows = QA.map(function (x, i) { return '<button type="button" class="bx-row" data-i="' + i + '" data-cta="chat-q' + (i + 1) + '"><span>' + esc(x[0]) + '</span>' + I_R + '</button>'; }).join('');
    box.innerHTML = '<div class="bx-top"><span class="bx-sp"></span><button type="button" class="bx-ib bx-x" aria-label="상담창 닫기">' + I_X + '</button></div>'
      + '<div class="bx-view"><div class="bx-hi"><div class="bx-av">' + AV + '</div><h2>안녕하세요,<br>브경단입니다.</h2><p>궁금한 것을 눌러 보세요.</p></div>'
      + '<div class="bx-card"><h3>상담원에게 물어보기</h3><p class="bx-s"><span class="bx-dot"></span>평일 10:00~17:30 답변</p>' + KK + '</div>'
      + '<div class="bx-card bx-list"><h3>자주 묻는 질문</h3>' + rows + '</div></div>';
    bind();
  }
  function answer(i) {
    var x = QA[i], go = x[2] ? '<a class="bx-go" href="' + x[2][1] + '" data-cta="chat-go' + (i + 1) + '">' + esc(x[2][0]) + I_R + '</a>' : '';
    box.innerHTML = '<div class="bx-top"><button type="button" class="bx-ib bx-back" aria-label="질문 목록으로">' + I_BACK + '</button><b>자주 묻는 질문</b><span class="bx-sp"></span><button type="button" class="bx-ib bx-x" aria-label="상담창 닫기">' + I_X + '</button></div>'
      + '<div class="bx-view"><p class="bx-q">' + esc(x[0]) + '</p><div class="bx-msg"><div class="bx-av">' + AV + '</div><div style="flex:1;min-width:0"><p class="bx-nm">브경단</p><div class="bx-bub">' + esc(x[1]) + go + '</div></div></div>'
      + '<div class="bx-more"><button type="button" class="bx-back2">다른 질문 보기</button></div></div>'
      + '<div class="bx-ft">' + KK + '</div>';
    bind(); var b = box.querySelector('.bx-back'); if (b) b.focus();
  }
  function bind() {
    box.querySelector('.bx-x').addEventListener('click', function () { open(false); });
    [].forEach.call(box.querySelectorAll('.bx-row'), function (r) { r.addEventListener('click', function () { answer(+r.dataset.i); }); });
    [].forEach.call(box.querySelectorAll('.bx-back,.bx-back2'), function (b) { b.addEventListener('click', function () { home(); var f = box.querySelector('.bx-row'); if (f) f.focus(); }); });
  }
  function open(on) {
    if (on) home();
    box.hidden = !on; btn.setAttribute('aria-expanded', on ? 'true' : 'false'); btn.setAttribute('aria-label', on ? '상담 닫기' : '상담 열기');
    if (on) { var f = box.querySelector('.bx-kk'); if (f) f.focus(); } else btn.focus();
    small(); place();
  }
  btn.addEventListener('click', function () { open(box.hidden); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) open(false); });
  // 휴대폰: 창이 아래에서 올라오는 시트라 열려 있는 동안 둥근 버튼은 숨김(창 안 X로 닫음)
  var mq = window.matchMedia ? window.matchMedia('(max-width:480px)') : null;
  function small() { btn.style.display = mq && mq.matches && !box.hidden ? 'none' : ''; }
  // 첫 화면 아래쪽 고정 바(#bar, 휴대폰)·맨 위로(#totop) 버튼과 겹치지 않게
  var bar = document.getElementById('bar'), top = document.getElementById('totop');
  function place() {
    var h = bar && !bar.classList.contains('off') && bar.offsetHeight ? bar.offsetHeight : 0;
    if (top && !top.hidden) h += 60;   // 맨 위로(48px)+간격 위로 올림
    btn.style.bottom = 'calc(' + (20 + h) + 'px + env(safe-area-inset-bottom))';
    if (!(mq && mq.matches)) box.style.bottom = 'calc(' + (92 + h) + 'px + env(safe-area-inset-bottom))';
  }
  place(); window.addEventListener('scroll', place, { passive: true }); window.addEventListener('resize', function () { small(); place(); });
  if (window.MutationObserver) { if (bar) new MutationObserver(place).observe(bar, { attributes: true, attributeFilter: ['class'] }); if (top) new MutationObserver(place).observe(top, { attributes: true, attributeFilter: ['hidden'] }); }
})();
