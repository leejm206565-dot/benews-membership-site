/* [2026-11-24 사장 지시] 홈페이지 미니 상담창: 오른쪽 아래 버튼 → 자주 묻는 질문 8개 바로 답 + 카카오톡 채널(@브경단)로 상담원 연결.
 * 답변 문구는 카카오 챗봇(오픈빌더 '브경단' 봇)과 같게 유지한다(benews-membership/챗봇_자동응답_문구.md). 가격은 공개 규칙대로 "월 2만원부터(VAT 별도)"까지만. */
(function () {
  if (window.__bxchat) return; window.__bxchat = 1;
  var KAKAO = 'https://pf.kakao.com/_xkCxkNX/chat', HOME = 'https://membership.openxcorp.co.kr', MY = HOME + '/my.html';
  var QA = [
    ['요금제', '브경단은 기사 건당 요금이 아닌 월 구독이에요.\n월 2만원부터(VAT 별도) 시작하고, 요금제(Standard·Pro·Max)별 가격과 혜택은 간편 로그인하시면 바로 보실 수 있어요.\n최소 이용 기간은 없어요.', ['간편 로그인하고 요금제 보기', MY]],
    ['가입 방법', '가입은 3단계예요.\n① 카카오·네이버·구글로 간편 로그인\n② 요금제를 골라 결제\n③ 내 기자실에서 \'기자 계정 만들기\' (1분)\n\n기자 계정을 만들면 보통 몇 분 안에 아이디와 임시 비밀번호가 내 기자실에 나와요.', ['내 기자실 열기', MY]],
    ['기사 올리는 법', '내 기자실에 나온 아이디로 브랜드경제신문에 로그인해 기사를 올리면 돼요.\n올린 기사는 평일 편집국 확인을 거쳐 게재되고, 제휴 언론사와 검색에도 함께 반영돼요.\n기사 쓰는 방법과 AI 기사 작성 도움 자료는 내 기자실 \'기자 자료\'에 있어요.', ['내 기자실 열기', MY]],
    ['기자증', 'Pro·Max 회원은 처음 가입할 때 실물 기자증 1개를 택배로 보내 드려요(배송비 무료).\n내 기자실 \'기자증 발급 신청\'에서 영문 이름·증명사진·받는 곳을 보내 주시면, 주말·공휴일 빼고 14일 안에 보내 드려요.\n디자인은 A·B·C·D 4가지 중에서 고를 수 있어요.'],
    ['메이저 언론사', 'Pro·Max 회원은 네이버 뉴스에 실리는 메이저 언론사에도 보도자료를 낼 수 있어요.\n언론사마다 이용료가 따로 있고(멤버십과 별도), 송출까지 1 영업일이 걸려요.\n언론사 목록·가격과 신청 방법은 내 기자실 \'네이버 메이저 언론사 기사 송출하기\'에 있어요.'],
    ['해지', '최소 이용 기간 없이 언제든 해지할 수 있어요.\n내 기자실 → 요금제 → \'해지 신청\'을 눌러 주세요.\n월간은 다음 결제일 3영업일 전까지 신청하시면 다음 결제부터 청구되지 않아요. 이미 결제된 달은 끝까지 이용하실 수 있어요.', ['환불 기준 보기', HOME + '/refund.html']],
    ['세금계산서', '요청하시면 관계 법령에 따라 세금계산서·현금영수증을 발급해 드려요.\n아래 \'카카오톡으로 상담원 연결\'에서 사업자등록증과 받으실 이메일을 남겨 주세요.'],
    ['상담원 연결', '상담원은 카카오톡 채널 \'브경단\'에서 연결돼요.\n아래 버튼을 눌러 궁금한 내용을 남겨 주시면 평일 10:00~17:30에 순서대로 답변드려요.\n결제·계정 문의는 가입하신 이름(또는 접수번호)을 함께 적어 주시면 더 빨라요.']
  ];
  var css = '#bxc-btn{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:70;display:flex;align-items:center;gap:8px;height:56px;padding:0 20px 0 16px;border:0;border-radius:999px;background:#0B6B3A;color:#fff;font:800 15px/1 Pretendard,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.22);cursor:pointer;transition:bottom .2s,transform .2s}'
    + '#bxc-btn:hover{transform:translateY(-2px)}#bxc-btn:focus-visible{outline:3px solid #FEE500;outline-offset:3px}#bxc-btn svg{flex:none}'
    + '#bxc{position:fixed;right:16px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:71;width:360px;max-width:calc(100vw - 32px);height:min(560px,calc(100vh - 120px));display:flex;flex-direction:column;background:#F7F5EF;border-radius:18px;box-shadow:0 16px 48px rgba(0,0,0,.28);overflow:hidden;font:15px/1.6 Pretendard,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;color:#111}'
    + '#bxc[hidden]{display:none}#bxc *{box-sizing:border-box}'
    + '#bxc .h{display:flex;align-items:center;gap:10px;padding:14px 14px 14px 16px;background:#0B6B3A;color:#fff}#bxc .h b{display:block;font-size:16px}#bxc .h small{display:block;font-size:12.5px;opacity:.85}'
    + '#bxc .x{margin-left:auto;width:40px;height:40px;border:0;border-radius:10px;background:rgba(255,255,255,.15);color:#fff;font-size:22px;line-height:1;cursor:pointer}#bxc .x:focus-visible{outline:2px solid #FEE500}'
    + '#bxc .m{flex:1;overflow-y:auto;padding:14px 14px 6px;display:flex;flex-direction:column;gap:10px}'
    + '#bxc .b{max-width:88%;padding:10px 13px;border-radius:14px;white-space:pre-line;word-break:keep-all;overflow-wrap:anywhere}#bxc .bot{align-self:flex-start;background:#fff;border:1px solid #E4DED0;border-top-left-radius:4px}#bxc .me{align-self:flex-end;background:#0B6B3A;color:#fff;border-top-right-radius:4px}'
    + '#bxc .lk{display:inline-block;margin-top:8px;padding:7px 12px;border-radius:10px;border:1.5px solid #0B6B3A;color:#0B6B3A;font-weight:800;font-size:14px;text-decoration:none}'
    + '#bxc .q{display:flex;flex-wrap:wrap;gap:6px;padding:8px 14px 10px;border-top:1px solid #E4DED0;background:#fff}'
    + '#bxc .q button{min-height:36px;padding:0 12px;border:1.5px solid #E4DED0;border-radius:999px;background:#fff;color:#111;font:700 13.5px/1 inherit;font-family:inherit;cursor:pointer}#bxc .q button:hover,#bxc .q button:focus-visible{border-color:#0B6B3A;color:#0B6B3A;outline:none}'
    + '#bxc .k{display:flex;align-items:center;justify-content:center;gap:8px;margin:0 14px 14px;min-height:46px;border-radius:12px;background:#FEE500;color:#191919;font-weight:800;font-size:15px;text-decoration:none}#bxc .k:focus-visible{outline:3px solid #0B6B3A}'
    + '@media (max-width:480px){#bxc{right:12px;left:12px;width:auto;max-width:none;height:min(70vh,560px)}#bxc-btn{padding:0 16px}#bxc-btn span{display:none}}'
    + '@media (prefers-reduced-motion:reduce){#bxc-btn{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var CHAT = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z"/></svg>';
  var btn = document.createElement('button'); btn.type = 'button'; btn.id = 'bxc-btn'; btn.setAttribute('aria-label', '상담하기'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'bxc'); btn.dataset.cta = 'chat-open';
  btn.innerHTML = CHAT + '<span>상담하기</span>';
  var box = document.createElement('section'); box.id = 'bxc'; box.hidden = true; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', '브경단 상담');
  box.innerHTML = '<div class="h">' + CHAT + '<div><b>브경단 상담</b><small>궁금한 내용을 눌러 보세요 · 상담원 평일 10:00~17:30</small></div><button type="button" class="x" aria-label="상담창 닫기">×</button></div>'
    + '<div class="m" aria-live="polite"></div><div class="q" role="group" aria-label="자주 묻는 질문"></div>'
    + '<a class="k" href="' + KAKAO + '" target="_blank" rel="noopener" data-cta="chat-kakao">카카오톡으로 상담원 연결</a>';
  document.body.appendChild(box); document.body.appendChild(btn);
  var m = box.querySelector('.m'), q = box.querySelector('.q');
  function say(text, who, link) {
    var d = document.createElement('div'); d.className = 'b ' + who; d.textContent = text;
    if (link) { var a = document.createElement('a'); a.className = 'lk'; a.href = link[1]; a.target = link[1].indexOf(HOME) === 0 ? '_self' : '_blank'; a.rel = 'noopener'; a.textContent = link[0] + ' →'; d.appendChild(document.createElement('br')); d.appendChild(a); }
    m.appendChild(d); m.scrollTop = m.scrollHeight;
  }
  QA.forEach(function (x, i) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = x[0]; b.dataset.cta = 'chat-q' + (i + 1);
    b.addEventListener('click', function () { say(x[0], 'me'); setTimeout(function () { say(x[1], 'bot', x[2]); }, 250); });
    q.appendChild(b);
  });
  say('안녕하세요, 브경단(브랜드경제신문 기자단)입니다.\n회사 소식을 직접 기사로 써서 브랜드경제신문과 300여 곳 제휴 언론사에 함께 보도할 수 있어요.\n아래에서 궁금한 내용을 눌러 보세요.', 'bot');
  function open(on) {
    box.hidden = !on; btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    if (on) { var f = q.querySelector('button'); if (f) f.focus(); } else btn.focus();
  }
  btn.addEventListener('click', function () { open(box.hidden); });
  box.querySelector('.x').addEventListener('click', function () { open(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) open(false); });
  // 첫 화면 아래쪽 고정 바(#bar, 휴대폰)·맨 위로(#totop) 버튼과 겹치지 않게
  var bar = document.getElementById('bar'), top = document.getElementById('totop');
  function place() {
    var h = bar && !bar.classList.contains('off') && bar.offsetHeight ? bar.offsetHeight : 0;
    if (top && !top.hidden) h += 60;   // 맨 위로(48px)+간격 위로 올림
    btn.style.bottom = 'calc(' + (16 + h) + 'px + env(safe-area-inset-bottom))';
    box.style.bottom = 'calc(' + (84 + h) + 'px + env(safe-area-inset-bottom))';
  }
  place(); window.addEventListener('scroll', place, { passive: true }); window.addEventListener('resize', place);
  if (window.MutationObserver) { if (bar) new MutationObserver(place).observe(bar, { attributes: true, attributeFilter: ['class'] }); if (top) new MutationObserver(place).observe(top, { attributes: true, attributeFilter: ['hidden'] }); }
})();
