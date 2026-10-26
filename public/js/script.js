// =========================================
// 다시, 나 - 기능 파일
// 1일차: 파일 연결 확인용 (기능은 3일차)
// =========================================

// 브라우저 개발자도구(F12) 콘솔에 연결 확인 메시지 출력
console.log('다시, 나: script.js 연결 완료');


// =========================================
// 2. 휴대폰 메뉴 접기·펼치기 (3일차)
// =========================================

// 메뉴 버튼과 메뉴를 찾아서 변수에 저장
const menuBtn = document.querySelector('#menu-btn');
const mainNav = document.querySelector('#main-nav');

// 메뉴를 닫는 동작을 함수로 묶어 둠 (여러 곳에서 다시 사용)
function closeMenu() {
  mainNav.classList.remove('open');
  menuBtn.textContent = '☰';
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', '메뉴 열기');
}

// 메뉴 버튼을 누르면 메뉴를 열거나 닫음
menuBtn.addEventListener('click', function () {
  // open 표시를 붙였다 뗐다 함 (붙으면 true)
  const isOpen = mainNav.classList.toggle('open');
  menuBtn.textContent = isOpen ? '✕' : '☰';
  menuBtn.setAttribute('aria-expanded', isOpen);
  menuBtn.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
});

// 메뉴 항목을 누르면 메뉴를 자동으로 닫음
mainNav.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', closeMenu);
});


// =========================================
// 3. 맨 위로 가기 버튼 (3일차)
// =========================================
const topBtn = document.querySelector('#top-btn');

// 스크롤할 때마다 위치를 확인해 버튼을 보이거나 숨김
window.addEventListener('scroll', function () {
  if (window.scrollY > 300) {
    topBtn.classList.add('show');
  } else {
    topBtn.classList.remove('show');
  }
});

// 버튼을 누르면 맨 위로 부드럽게 이동
topBtn.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =========================================
// 4. 문의 폼 입력 확인 + 서버로 전송 (4일차 수정)
// =========================================
const contactForm = document.querySelector('#contact-form');
const formMsg = document.querySelector('#form-msg');

function showMessage(text, type) {
  formMsg.textContent = text;
  formMsg.className = type;
}

// async: 서버의 대답을 기다려야 하므로 붙임
contactForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim();
  const message = document.querySelector('#message').value.trim();
  const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name === '') {
    showMessage('이름을 입력해 주세요.', 'error');
    return;
  }
  if (!emailRule.test(email)) {
    showMessage('올바른 이메일 주소를 입력해 주세요.', 'error');
    return;
  }
  if (message.length < 10) {
    showMessage('문의 내용을 10자 이상 입력해 주세요.', 'error');
    return;
  }

  // 검사를 통과하면 서버로 보내기 (4일차 추가)
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });
    const data = await res.json();

    if (res.ok) {
      showMessage(data.message, 'success');
      contactForm.reset();
    } else {
      showMessage(data.message, 'error');
    }
  } catch (err) {
    // 서버가 꺼져 있거나 Live Server로 열었을 때
    showMessage('서버에 연결할 수 없습니다. npm start로 서버를 실행해 주세요.', 'error');
  }
});