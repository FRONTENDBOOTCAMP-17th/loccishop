# 코드 리뷰 해결 가이드

> `code-review.md`에서 지적된 문제들의 **구체적인 해결 방법**입니다.
> 각 해결 방법은 초보자도 따라할 수 있도록 **단계별로** 설명합니다.

---

## 목차

1. [3.1 해결: 회원가입 코드 중복 제거](#31-해결-회원가입-코드-중복-제거)
2. [3.2 해결: 에러 객체에 상태 코드 넣기](#32-해결-에러-객체에-상태-코드-넣기)
3. [3.3 해결: innerHTML 대신 createElement 사용](#33-해결-innerhtml-대신-createelement-사용)
4. [3.4 해결: 거대 함수 쪼개기](#34-해결-거대-함수-쪼개기)
5. [3.5 해결: 전역 상태를 객체로 묶기](#35-해결-전역-상태를-객체로-묶기)
6. [3.6 해결: 매직 넘버를 상수로](#36-해결-매직-넘버를-상수로)
7. [3.7 해결: CSS를 TailwindCSS로 통일](#37-해결-css를-tailwindcss로-통일)
8. [3.8 해결: loadHTML에 에러 처리 추가](#38-해결-loadhtml에-에러-처리-추가)
9. [3.9 해결: 이중 직렬화 수정](#39-해결-이중-직렬화-수정)
10. [3.10 해결: 모달 접근성 개선](#310-해결-모달-접근성-개선)

---

## 3.1 해결: 회원가입 코드 중복 제거

### 문제 요약
`signup/user/index.js`와 `admin/signup/index.js`가 90% 동일합니다.

### 해결 전략: 공통 팩토리 함수 만들기

**"팩토리 함수"란?** 설정값을 받아서 결과물을 만들어주는 함수입니다. 쿠키 틀을 떠올려보세요 - 같은 틀(팩토리)에 다른 반죽(설정)을 넣으면 다른 쿠키(결과)가 나옵니다.

### 단계 1: 공통 모듈 만들기

새 파일 `src/js/signupUtils/signupForm.js`를 만듭니다:

```javascript
// src/js/signupUtils/signupForm.js
import { checkId } from "/src/js/api/auth/index.js";
import { isValidUsername, isValidEmail, isValidPassword } from "./validation.js";
import { setValid, setError, clearState } from "./ui.js";

/**
 * 회원가입 폼을 초기화하는 팩토리 함수
 *
 * @param {Object} config - 설정 객체
 * @param {Function} config.getElements - DOM 요소를 가져오는 함수
 * @param {Function} config.getExtraValidation - 추가 검증 함수 (admin: 토큰 검증)
 * @param {Function} config.buildRequestBody - API 요청 본문을 만드는 함수
 * @param {Function} config.submitAPI - 회원가입 API 함수
 * @param {string} config.successMessage - 성공 메시지
 */
export function initSignupForm(config) {
  const {
    getElements,
    getExtraValidation = () => true,  // 기본값: 항상 통과
    buildRequestBody,
    submitAPI,
    successMessage = "회원가입이 완료되었습니다.",
  } = config;

  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      const form = document.getElementById("signupForm");
      if (form) form.reset();
    }
  });

  window.addEventListener("DOMContentLoaded", () => {
    const els = getElements();
    const state = { isIdChecked: false, isIdAvailable: false };

    // 아이콘/텍스트 초기 숨기기 (공통)
    initUI(els);

    // 비밀번호 토글 (공통)
    bindPasswordToggle(els);

    // 아이디 중복확인 (공통)
    bindIdValidation(els, state);

    // 비밀번호 유효성 검사 (공통)
    bindPasswordValidation(els);

    // 이름, 이메일 유효성 검사 (공통)
    bindCommonFieldValidations(els);

    // 추가 필드 바인딩 (admin: 토큰 등)
    if (config.bindExtraFields) {
      config.bindExtraFields(els);
    }

    // 뒤로가기 버튼
    document.getElementById("backBtn").addEventListener("click", () => {
      window.location.href = "/src/pages/login/index.html";
    });

    // 폼 제출
    els.form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // 공통 검증
      if (!isValidUsername(els.userId.value)) {
        setError(els.idErrorIcon, els.idCheckIcon, els.idErrorText);
        return els.userId.focus();
      }
      if (!state.isIdChecked || !state.isIdAvailable) {
        alert("아이디 중복확인을 해주세요.");
        return els.userId.focus();
      }
      if (!isValidPassword(els.userPw.value)) {
        setError(els.pwErrorIcon, els.pwCheckIcon, els.pwErrorText);
        return els.userPw.focus();
      }
      if (els.userPw.value !== els.userPwConfirm.value) {
        setError(els.pwConfirmErrorIcon, els.pwConfirmCheckIcon, els.pwConfirmErrorText);
        return els.userPwConfirm.focus();
      }
      if (!els.userName.value.trim()) {
        setError(els.nameErrorIcon, els.nameCheckIcon, els.nameErrorText);
        return els.userName.focus();
      }
      if (!isValidEmail(els.userEmail.value)) {
        setError(els.emailErrorIcon, els.emailCheckIcon, els.emailErrorText);
        return els.userEmail.focus();
      }

      // 추가 검증 (admin: 토큰 등)
      if (!getExtraValidation(els)) return;

      // API 호출
      try {
        await submitAPI(buildRequestBody(els));
        alert(successMessage);
        window.location.href = "/src/pages/login/index.html";
      } catch (error) {
        console.error("회원가입 오류:", error);
        if (config.handleError) {
          config.handleError(error, els);
        } else {
          alert("회원가입에 실패했습니다. 다시 시도해주세요.");
        }
      }
    });
  });
}

// ── 아래는 공통 내부 함수들 (export 하지 않음) ──

function initUI(els) {
  // 모든 에러/체크 아이콘 숨기기
  const icons = [
    els.idErrorIcon, els.idCheckIcon,
    els.pwErrorIcon, els.pwCheckIcon,
    els.pwConfirmErrorIcon, els.pwConfirmCheckIcon,
    els.nameErrorIcon, els.nameCheckIcon,
    els.emailErrorIcon, els.emailCheckIcon,
  ];
  icons.forEach((el) => { if (el) el.style.display = "none"; });

  // 모든 에러 텍스트 숨기기
  const texts = [
    els.idErrorText, els.idDuplicateText, els.idAvailableText,
    els.pwErrorText, els.pwConfirmErrorText,
    els.nameErrorText, els.emailErrorText,
  ];
  texts.forEach((el) => { if (el) el.style.display = "none"; });
}

function bindPasswordToggle(els) {
  document.getElementById("togglePassword").addEventListener("click", () => {
    els.userPw.type = els.userPw.type === "password" ? "text" : "password";
  });
  document.getElementById("togglePasswordConfirm").addEventListener("click", () => {
    els.userPwConfirm.type = els.userPwConfirm.type === "password" ? "text" : "password";
  });
}

function bindIdValidation(els, state) {
  els.userId.addEventListener("input", () => {
    state.isIdChecked = false;
    state.isIdAvailable = false;
    els.idDuplicateText.style.display = "none";
    els.idAvailableText.style.display = "none";

    if (!els.userId.value) {
      return clearState(els.idErrorIcon, els.idCheckIcon, els.idErrorText);
    }
    isValidUsername(els.userId.value)
      ? setValid(els.idErrorIcon, els.idCheckIcon, els.idErrorText)
      : setError(els.idErrorIcon, els.idCheckIcon, els.idErrorText);
  });

  document.getElementById("checkIdBtn").addEventListener("click", async () => {
    if (!isValidUsername(els.userId.value)) {
      setError(els.idErrorIcon, els.idCheckIcon, els.idErrorText);
      return els.userId.focus();
    }

    try {
      const result = await checkId(els.userId.value);
      state.isIdChecked = true;
      if (result.isAvailable) {
        state.isIdAvailable = true;
        els.idDuplicateText.style.display = "none";
        els.idAvailableText.style.display = "block";
        setValid(els.idErrorIcon, els.idCheckIcon, els.idErrorText);
      } else {
        state.isIdAvailable = false;
        els.idAvailableText.style.display = "none";
        els.idDuplicateText.style.display = "block";
        setError(els.idErrorIcon, els.idCheckIcon, null);
      }
    } catch (error) {
      console.error("중복확인 오류:", error);
      alert("중복확인 중 오류가 발생했습니다.");
    }
  });
}

function bindPasswordValidation(els) {
  els.userPw.addEventListener("input", () => {
    if (!els.userPw.value) {
      clearState(els.pwErrorIcon, els.pwCheckIcon, els.pwErrorText);
      els.pwGuideText.style.display = "block";
      return;
    }
    els.pwGuideText.style.display = "none";
    isValidPassword(els.userPw.value)
      ? setValid(els.pwErrorIcon, els.pwCheckIcon, els.pwErrorText)
      : setError(els.pwErrorIcon, els.pwCheckIcon, els.pwErrorText);

    if (els.userPwConfirm.value) {
      els.userPw.value === els.userPwConfirm.value
        ? setValid(els.pwConfirmErrorIcon, els.pwConfirmCheckIcon, els.pwConfirmErrorText)
        : setError(els.pwConfirmErrorIcon, els.pwConfirmCheckIcon, els.pwConfirmErrorText);
    }
  });

  els.userPwConfirm.addEventListener("input", () => {
    if (!els.userPwConfirm.value) {
      return clearState(els.pwConfirmErrorIcon, els.pwConfirmCheckIcon, els.pwConfirmErrorText);
    }
    els.userPw.value === els.userPwConfirm.value
      ? setValid(els.pwConfirmErrorIcon, els.pwConfirmCheckIcon, els.pwConfirmErrorText)
      : setError(els.pwConfirmErrorIcon, els.pwConfirmCheckIcon, els.pwConfirmErrorText);
  });
}

function bindCommonFieldValidations(els) {
  els.userName.addEventListener("input", () => {
    if (!els.userName.value) {
      return clearState(els.nameErrorIcon, els.nameCheckIcon, els.nameErrorText);
    }
    els.userName.value.trim()
      ? setValid(els.nameErrorIcon, els.nameCheckIcon, els.nameErrorText)
      : setError(els.nameErrorIcon, els.nameCheckIcon, els.nameErrorText);
  });

  els.userEmail.addEventListener("input", () => {
    if (!els.userEmail.value) {
      return clearState(els.emailErrorIcon, els.emailCheckIcon, els.emailErrorText);
    }
    isValidEmail(els.userEmail.value)
      ? setValid(els.emailErrorIcon, els.emailCheckIcon, els.emailErrorText)
      : setError(els.emailErrorIcon, els.emailCheckIcon, els.emailErrorText);
  });
}
```

### 단계 2: user/index.js 간소화

```javascript
// src/pages/signup/user/index.js (리팩토링 후)
import { signupUser } from "/src/js/api/auth/index.js";
import { initSignupForm } from "/src/js/signupUtils/signupForm.js";

initSignupForm({
  // 이 페이지에서만 필요한 DOM 요소들
  getElements: () => ({
    form: document.getElementById("signupForm"),
    userId: document.getElementById("userId"),
    userPw: document.getElementById("userPw"),
    userPwConfirm: document.getElementById("userPwConfirm"),
    userName: document.getElementById("userName"),
    userEmail: document.getElementById("userEmail"),
    userAddress: document.getElementById("userAddress"),
    userDetailAddress: document.getElementById("userDetailAddress"),
    idErrorIcon: document.getElementById("idErrorIcon"),
    idCheckIcon: document.getElementById("idCheckIcon"),
    idErrorText: document.getElementById("idErrorText"),
    idDuplicateText: document.getElementById("idDuplicateText"),
    idAvailableText: document.getElementById("idAvailableText"),
    pwErrorIcon: document.getElementById("pwErrorIcon"),
    pwCheckIcon: document.getElementById("pwCheckIcon"),
    pwGuideText: document.getElementById("pwGuideText"),
    pwErrorText: document.getElementById("pwErrorText"),
    pwConfirmErrorIcon: document.getElementById("pwConfirmErrorIcon"),
    pwConfirmCheckIcon: document.getElementById("pwConfirmCheckIcon"),
    pwConfirmErrorText: document.getElementById("pwConfirmErrorText"),
    nameErrorIcon: document.getElementById("nameErrorIcon"),
    nameCheckIcon: document.getElementById("nameCheckIcon"),
    nameErrorText: document.getElementById("nameErrorText"),
    emailErrorIcon: document.getElementById("emailErrorIcon"),
    emailCheckIcon: document.getElementById("emailCheckIcon"),
    emailErrorText: document.getElementById("emailErrorText"),
    addressCheckIcon: document.getElementById("addressCheckIcon"),
    detailAddressCheckIcon: document.getElementById("detailAddressCheckIcon"),
  }),

  // 이 페이지만의 추가 필드 바인딩 (주소)
  bindExtraFields: (els) => {
    els.userAddress.addEventListener("input", () => {
      els.addressCheckIcon.style.display = els.userAddress.value.trim() ? "block" : "none";
    });
    els.userDetailAddress.addEventListener("input", () => {
      els.detailAddressCheckIcon.style.display = els.userDetailAddress.value.trim() ? "block" : "none";
    });
  },

  // API 요청 본문
  buildRequestBody: (els) => ({
    username: els.userId.value,
    password: els.userPw.value,
    name: els.userName.value.trim(),
    email: els.userEmail.value.trim(),
    baseAddress: els.userAddress.value.trim(),
    detailAddress: els.userDetailAddress.value.trim(),
  }),

  // 어떤 API를 호출할지
  submitAPI: signupUser,
  successMessage: "회원가입이 완료되었습니다.",
});
```

### 단계 3: admin/signup/index.js 간소화

```javascript
// src/pages/admin/signup/index.js (리팩토링 후)
import { signupAdmin } from "/src/js/api/auth/index.js";
import { setError } from "/src/js/signupUtils/ui.js";
import { initSignupForm } from "/src/js/signupUtils/signupForm.js";

initSignupForm({
  getElements: () => ({
    form: document.getElementById("signupForm"),
    userId: document.getElementById("userId"),
    userPw: document.getElementById("userPw"),
    userPwConfirm: document.getElementById("userPwConfirm"),
    userName: document.getElementById("userName"),
    userEmail: document.getElementById("userEmail"),
    adminToken: document.getElementById("adminToken"),
    // ... 공통 아이콘/텍스트들 (생략) ...
    idErrorIcon: document.getElementById("idErrorIcon"),
    idCheckIcon: document.getElementById("idCheckIcon"),
    idErrorText: document.getElementById("idErrorText"),
    idDuplicateText: document.getElementById("idDuplicateText"),
    idAvailableText: document.getElementById("idAvailableText"),
    pwErrorIcon: document.getElementById("pwErrorIcon"),
    pwCheckIcon: document.getElementById("pwCheckIcon"),
    pwGuideText: document.getElementById("pwGuideText"),
    pwErrorText: document.getElementById("pwErrorText"),
    pwConfirmErrorIcon: document.getElementById("pwConfirmErrorIcon"),
    pwConfirmCheckIcon: document.getElementById("pwConfirmCheckIcon"),
    pwConfirmErrorText: document.getElementById("pwConfirmErrorText"),
    nameErrorIcon: document.getElementById("nameErrorIcon"),
    nameCheckIcon: document.getElementById("nameCheckIcon"),
    nameErrorText: document.getElementById("nameErrorText"),
    emailErrorIcon: document.getElementById("emailErrorIcon"),
    emailCheckIcon: document.getElementById("emailCheckIcon"),
    emailErrorText: document.getElementById("emailErrorText"),
    tokenErrorIcon: document.getElementById("tokenErrorIcon"),
    tokenCheckIcon: document.getElementById("tokenCheckIcon"),
    tokenErrorText: document.getElementById("tokenErrorText"),
  }),

  // admin만의 추가 필드 바인딩
  bindExtraFields: (els) => {
    els.adminToken.addEventListener("input", () => {
      if (!els.adminToken.value) {
        els.tokenErrorIcon.style.display = "none";
        els.tokenCheckIcon.style.display = "none";
        els.tokenErrorText.style.display = "none";
        return;
      }
      els.tokenErrorIcon.style.display = "none";
      els.tokenCheckIcon.style.display = "block";
      els.tokenErrorText.style.display = "none";
    });
  },

  // admin만의 추가 검증 (토큰 필수)
  getExtraValidation: (els) => {
    if (!els.adminToken.value) {
      setError(els.tokenErrorIcon, els.tokenCheckIcon, els.tokenErrorText);
      els.adminToken.focus();
      return false;
    }
    return true;
  },

  buildRequestBody: (els) => ({
    username: els.userId.value,
    password: els.userPw.value,
    name: els.userName.value.trim(),
    email: els.userEmail.value.trim(),
    adminToken: els.adminToken.value,
  }),

  submitAPI: signupAdmin,
  successMessage: "관리자 회원가입이 완료되었습니다.",

  // admin만의 에러 처리
  handleError: (error, els) => {
    if (error.status === 401 || error.status === 403) {
      setError(els.tokenErrorIcon, els.tokenCheckIcon, els.tokenErrorText);
      els.adminToken.focus();
      return;
    }
    alert("회원가입에 실패했습니다. 다시 시도해주세요.");
  },
});
```

### 효과
- **변경 전**: 비밀번호 토글 버그 → 2개 파일 수정
- **변경 후**: 비밀번호 토글 버그 → `signupForm.js` 1개 파일만 수정

---

## 3.2 해결: 에러 객체에 상태 코드 넣기

### 문제 요약
에러를 `e.message.includes("401")` 같은 문자열 파싱으로 처리하고 있습니다.

### 단계 1: 커스텀 에러 클래스 만들기

```javascript
// src/js/api/client.js

// 1. 커스텀 에러 클래스 추가
class APIError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;  // ← 숫자로 상태 코드를 저장!
  }
}

const BASE_URL = "https://api.fullstackfamily.com/api/loccishop/v1";

export async function fetchAPI(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...(options.body && { body: JSON.stringify(options.body) }),
  });

  if (!res.ok) {
    // 2. 상태 코드를 에러 객체에 포함
    throw new APIError(res.status, `API 오류: ${res.status}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new APIError(500, json.message ?? "서버 오류가 발생했습니다.");
  }

  return json.data;
}

// 3. 다른 파일에서 사용할 수 있도록 export
export { APIError };
```

### 단계 2: catch 블록에서 숫자로 비교

```javascript
// src/js/api/cart/index.js (개선 후)
import { fetchAPI } from "/src/js/api/client.js";

export async function addToCart(productId, quantity) {
  try {
    return await fetchAPI("/members/me/cart/items", {
      method: "POST",
      body: { productId, quantity },  // ← 객체 그대로 전달! (3.9도 함께 수정)
    });
  } catch (e) {
    // 숫자로 비교! 문자열 파싱 X
    if (e.status === 401) {
      alert("로그인이 필요한 서비스입니다.");
      return null;
    }
    if (e.status === 400) {
      alert("재고가 부족합니다.");
      return null;
    }
    if (e.status === 404) {
      alert("상품을 찾을 수 없습니다.");
      return null;
    }
    throw e;
  }
}
```

### 왜 이게 더 좋은가?

```javascript
// Before (위험)
e.message.includes("401")  // "4010"도 매치됨!

// After (안전)
e.status === 401           // 정확히 401만 매치
```

---

## 3.3 해결: innerHTML 대신 createElement 사용

### 문제 요약
`innerHTML`에 변수를 직접 삽입하면 XSS 공격에 취약합니다.

### innerHTML vs createElement 비교

```javascript
// ❌ innerHTML 방식 (위험)
el.innerHTML = `<h2>${slide.name}</h2><p>${slide.desc}</p>`;

// ✅ createElement 방식 (안전)
const h2 = document.createElement("h2");
h2.textContent = slide.name;  // ← textContent는 HTML을 해석하지 않음!
const p = document.createElement("p");
p.textContent = slide.desc;
el.append(h2, p);
```

### `textContent` vs `innerHTML`의 차이

```javascript
const name = '<script>alert("해킹!")</script>';

// innerHTML: 스크립트가 실행될 수 있음 ❌
div.innerHTML = name;

// textContent: 그냥 텍스트로 표시됨 ✅
div.textContent = name;
// 화면에 보이는 것: <script>alert("해킹!")</script>
```

### main.js의 회전 캐러셀 개선 예시

```javascript
// ❌ 기존 코드 (main.js 214~231행)
el.innerHTML = `
  <div class="flex h-[480px] ...">
    <figure class="w-1/2 ...">
      <img src="${slide.image}" alt="${slide.name}" ... />
    </figure>
    <div class="w-1/2 ...">
      <h2 ...>${slide.name}</h2>
      <p ...>${slide.desc}</p>
    </div>
  </div>
`;

// ✅ 개선된 코드
function createSlideElement(slide) {
  const wrapper = document.createElement("div");
  wrapper.className = "flex h-[480px] overflow-hidden shadow-sm mx-1";

  // 이미지 영역
  const figure = document.createElement("figure");
  figure.className = "w-1/2 h-full flex-shrink-0 overflow-hidden";

  const img = document.createElement("img");
  img.src = slide.image;
  img.alt = slide.name;
  img.className = "w-full h-full object-cover pointer-events-none";
  img.draggable = false;
  figure.append(img);

  // 텍스트 영역
  const textArea = document.createElement("div");
  textArea.className = "w-1/2 h-full bg-[#edeae3] flex flex-col items-center justify-center text-center px-10 gap-5";

  const h2 = document.createElement("h2");
  h2.className = "text-lg font-bold text-woody-brown leading-snug whitespace-pre-line";
  h2.textContent = slide.name;  // ← textContent 사용!

  const p = document.createElement("p");
  p.className = "text-sm text-gray-500 leading-relaxed whitespace-pre-line";
  p.textContent = slide.desc;   // ← textContent 사용!

  const link = document.createElement("a");
  link.href = "#";
  link.className = "text-sm text-woody-brown border-b border-woody-brown pb-0.5 hover:opacity-60 transition-opacity";
  link.textContent = "지금 쇼핑하기";

  textArea.append(h2, p, link);
  wrapper.append(figure, textArea);
  return wrapper;
}
```

### 팁: 이미 잘 하고 있는 예시

`initReviews.js`의 `createReviewCard()` 함수는 **이미 createElement를 올바르게 사용**하고 있습니다! 이 패턴을 다른 곳에도 적용하면 됩니다.

---

## 3.4 해결: 거대 함수 쪼개기

### 문제 요약
`initRotatingCarousel()`이 143줄로 4가지 일을 합니다.

### 쪼개는 원칙: "이 함수는 OO를 한다"

함수 이름을 "~를 한다"로 설명할 수 있어야 합니다. 두 가지 이상 설명이 필요하면 쪼개야 합니다.

```javascript
// ❌ 설명이 길어지는 함수
// "initRotatingCarousel은 슬라이드를 만들고, 드래그를 처리하고, 터치를 처리하고, 리사이즈를 처리한다"

// ✅ 각각 하나만 설명되는 함수들
// "createSlides는 슬라이드 DOM을 만든다"
// "addDragSupport는 마우스 드래그를 처리한다"
// "addTouchSupport는 터치 드래그를 처리한다"
```

### 개선된 코드

```javascript
// src/js/main.js - 회전 캐러셀 부분

// 슬라이드 너비 비율, 드래그 감도 등을 상수로 (3.6 해결도 같이 적용)
const SLIDE_WIDTH_RATIO = 0.68;
const DRAG_THRESHOLD = 60;

function initRotatingCarousel() {
  const track = document.getElementById("rotating-track");
  if (!track) return;

  const section = track.closest("section");
  const prevBtn = document.getElementById("rotating-prev");
  const nextBtn = document.getElementById("rotating-next");
  const counter = document.getElementById("rotating-counter");
  const prevLabel = document.getElementById("rotating-prev-label");
  const nextLabel = document.getElementById("rotating-next-label");

  // 1. 슬라이드 생성 (별도 함수)
  createSlides(track);

  // 2. 캐러셀 상태 관리
  let currentIdx = 0;

  // 3. 네비게이션 (별도 함수)
  function goTo(idx) {
    currentIdx = Math.max(0, Math.min(ROTATING_SLIDES.length - 1, idx));
    applyTranslate(track, getTranslateForIdx(currentIdx), true);
    updateSlideStyles(track, currentIdx);
    updateNav(counter, prevLabel, nextLabel, prevBtn, nextBtn, currentIdx);
  }

  goTo(0);

  // 4. 버튼 이벤트
  prevBtn.addEventListener("click", () => goTo(currentIdx - 1));
  nextBtn.addEventListener("click", () => goTo(currentIdx + 1));

  // 5. 드래그 지원 (별도 함수)
  addMouseDrag(track, section, goTo, () => currentIdx);

  // 6. 터치 지원 (별도 함수)
  addTouchDrag(track, goTo, () => currentIdx);

  // 7. 리사이즈
  window.addEventListener("resize", () => {
    applyTranslate(track, getTranslateForIdx(currentIdx), false);
  });
}

// ── 분리된 함수들 ──

function createSlides(track) {
  ROTATING_SLIDES.forEach((slide) => {
    const el = document.createElement("div");
    el.className = "rotating-slide flex-shrink-0 select-none";
    el.style.width = `${SLIDE_WIDTH_RATIO * 100}vw`;
    el.style.transition = "transform 0.45s ease, opacity 0.45s ease";
    el.append(createSlideElement(slide));
    track.append(el);
  });
}

function getSlideWidth() {
  return window.innerWidth * SLIDE_WIDTH_RATIO;
}

function getTranslateForIdx(idx) {
  const slideW = getSlideWidth();
  const peek = (window.innerWidth - slideW) / 2;
  return peek - idx * slideW;
}

function applyTranslate(track, px, animate) {
  track.style.transition = animate
    ? "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
    : "none";
  track.style.transform = `translateX(${px}px)`;
}

function updateSlideStyles(track, currentIdx) {
  track.querySelectorAll(".rotating-slide").forEach((slide, i) => {
    const isActive = i === currentIdx;
    slide.style.transform = isActive ? "scale(1)" : "scale(0.78)";
    slide.style.opacity = isActive ? "1" : "0.5";
  });
}

function updateNav(counter, prevLabel, nextLabel, prevBtn, nextBtn, currentIdx) {
  const total = ROTATING_SLIDES.length;
  counter.textContent = `${currentIdx + 1} / ${total}`;
  prevLabel.textContent = currentIdx > 0 ? ROTATING_SLIDES[currentIdx - 1].name : "";
  nextLabel.textContent = currentIdx < total - 1 ? ROTATING_SLIDES[currentIdx + 1].name : "";
  prevBtn.style.visibility = currentIdx > 0 ? "visible" : "hidden";
  nextBtn.style.visibility = currentIdx < total - 1 ? "visible" : "hidden";
}

function addMouseDrag(track, section, goTo, getCurrentIdx) {
  let isDragging = false;
  let dragStartX = 0;
  let dragStartTranslate = 0;

  track.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    // translateX 현재 값 저장
    const transform = track.style.transform;
    dragStartTranslate = parseFloat(transform.replace("translateX(", "")) || 0;
    section.classList.add("is-dragging");
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX;
    applyTranslate(track, dragStartTranslate + delta, false);
  });

  document.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    section.classList.remove("is-dragging");
    const delta = e.clientX - dragStartX;
    const idx = getCurrentIdx();
    if (delta < -DRAG_THRESHOLD) goTo(idx + 1);
    else if (delta > DRAG_THRESHOLD) goTo(idx - 1);
    else goTo(idx);
  });
}

function addTouchDrag(track, goTo, getCurrentIdx) {
  let dragStartX = 0;
  let dragStartTranslate = 0;

  track.addEventListener("touchstart", (e) => {
    dragStartX = e.touches[0].clientX;
    const transform = track.style.transform;
    dragStartTranslate = parseFloat(transform.replace("translateX(", "")) || 0;
  }, { passive: true });

  track.addEventListener("touchmove", (e) => {
    const delta = e.touches[0].clientX - dragStartX;
    applyTranslate(track, dragStartTranslate + delta, false);
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    const delta = e.changedTouches[0].clientX - dragStartX;
    const idx = getCurrentIdx();
    if (delta < -DRAG_THRESHOLD) goTo(idx + 1);
    else if (delta > DRAG_THRESHOLD) goTo(idx - 1);
    else goTo(idx);
  });
}
```

---

## 3.5 해결: 전역 상태를 객체로 묶기

### 문제 요약
`initReviews.js`에 5개의 전역 변수가 여러 함수에서 읽고 쓰입니다.

### 해결: 상태 객체 패턴

```javascript
// ❌ 기존: 흩어진 전역 변수
let currentPage = 1;
let currentSort = "latest";
let currentProductId = null;
let totalPages = 1;
let currentRating = null;

// ✅ 개선: 하나의 상태 객체
const reviewState = {
  page: 1,
  sort: "latest",
  productId: null,
  totalPages: 1,
  rating: null,

  // 상태를 초기화하는 메서드
  reset(productId) {
    this.page = 1;
    this.sort = "latest";
    this.productId = productId;
    this.totalPages = 1;
    this.rating = null;
  },
};
```

### 왜 이게 더 좋은가?

```javascript
// Before: 어떤 변수들이 관련있는지 알기 어려움
currentPage = 1;
currentSort = "latest";
currentRating = null;

// After: "리뷰 상태"라는 하나의 개념으로 묶임
reviewState.reset(productId);

// Before: 함수 인자가 불분명
function initPagination(productId) {
  // totalPages는 어디서 왔지? → 전역 변수에서...
}

// After: 의존성이 명확
function initPagination(state) {
  // state.totalPages → 아, state에서 가져오는구나!
}
```

### 적용 예시

```javascript
// src/pages/product/detail/handlers/initReviews.js (개선)

const reviewState = {
  page: 1,
  sort: "latest",
  productId: null,
  totalPages: 1,
  rating: null,
  reset(productId) {
    this.page = 1;
    this.sort = "latest";
    this.productId = productId;
    this.totalPages = 1;
    this.rating = null;
  },
};

export async function initReviews(productId, { sort = "latest", rating = null } = {}) {
  reviewState.reset(productId);
  reviewState.sort = sort;
  reviewState.rating = rating;

  const result = await fetchProductReviews(productId, {
    page: 1,
    limit: 4,
    sort,
    ...(rating && { rating }),
  });

  const { reviews, meta } = result;
  reviewState.totalPages = meta.pagination.totalPages;

  // ... 나머지 렌더링 코드
}

export function initPagination(productId) {
  const container = document.querySelector("#more-reviews-btn");
  if (!container) return;

  const pagination = createPagination({
    totalPages: reviewState.totalPages,  // ← 상태 객체에서 읽기
    currentPage: 1,
    onPageChange: async (page) => {
      reviewState.page = page;  // ← 상태 객체에 쓰기
      // ...
    },
  });
  // ...
}
```

---

## 3.6 해결: 매직 넘버를 상수로

### 문제 요약
`68`, `0.68`, `60` 같은 숫자가 의미 없이 코드에 박혀 있습니다.

### 해결: 이름 있는 상수

```javascript
// ❌ Before
el.style.width = "68vw";
if (delta < -60) goTo(currentIdx + 1);

// ✅ After
const SLIDE_WIDTH_RATIO = 0.68;   // 슬라이드가 화면의 68%를 차지
const DRAG_THRESHOLD = 60;         // 60px 이상 드래그해야 슬라이드 전환

el.style.width = `${SLIDE_WIDTH_RATIO * 100}vw`;
if (delta < -DRAG_THRESHOLD) goTo(currentIdx + 1);
```

### 상수 이름 짓는 팁

| 값 | 나쁜 이름 | 좋은 이름 |
|----|----------|----------|
| `68` | `SIZE` | `SLIDE_WIDTH_RATIO` |
| `60` | `THRESHOLD` | `DRAG_THRESHOLD` |
| `4` | `LIMIT` | `REVIEWS_PER_PAGE` |
| `0.78` | `SCALE` | `INACTIVE_SLIDE_SCALE` |

```javascript
// 한곳에 모아두면 나중에 수정하기 쉬움
// src/js/constants.js (선택적)
export const SLIDE_WIDTH_RATIO = 0.68;
export const DRAG_THRESHOLD = 60;
export const INACTIVE_SLIDE_SCALE = 0.78;
export const INACTIVE_SLIDE_OPACITY = 0.5;
export const REVIEWS_PER_PAGE = 4;
```

---

## 3.7 해결: CSS를 TailwindCSS로 통일

### 문제 요약
`style.css`에 TailwindCSS로 충분히 표현할 수 있는 CSS가 있습니다.

### 원칙: CSS 파일에 남겨야 하는 것

| 유형 | CSS? | TailwindCSS? | 이유 |
|------|:---:|:---:|------|
| 복잡한 그라데이션 | O | X | Tailwind로 표현하면 클래스가 너무 길어짐 |
| `display: flex` | X | O | `flex` 한 단어로 충분 |
| 커스텀 애니메이션 | O | X | `@keyframes`는 CSS에서만 가능 |
| `width: 2.5rem` | X | O | `w-10`으로 충분 |
| 커스텀 색상 | O | X | `@theme`에 정의 (이미 잘 하고 있음!) |

### `.swiper-btn` 개선 예시

```css
/* ❌ Before (style.css) */
.swiper-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  cursor: pointer;
  transition: background-color 0.2s;
}
.swiper-btn:hover {
  background-color: #f9fafb;
}
```

```html
<!-- ✅ After (HTML에서 Tailwind 클래스 사용) -->
<button class="flex items-center justify-center w-10 h-10 rounded-full
               bg-white border border-gray-200 text-gray-500
               cursor-pointer transition-colors hover:bg-gray-50">
</button>
```

이렇게 하면 `style.css`에서 `.swiper-btn` 관련 코드 12줄을 삭제할 수 있습니다.

### 그라데이션은 남겨두세요

```css
/* ✅ 이건 CSS에 남겨도 됨 (Tailwind로 표현하면 너무 복잡) */
.years-gradient {
  background: linear-gradient(
    to right,
    #1a0e00 0%, #7a3c04 20%, #c87808 45%,
    #f0ba18 65%, #c08010 80%, #1a0e00 100%
  );
}

.gift-bg {
  background: linear-gradient(to bottom, #f9d840 0%, #fffbdc 45%, #fefce8 100%);
}
```

---

## 3.8 해결: loadHTML에 에러 처리 추가

### 문제 요약
`loadHTML()`이 네트워크 에러나 404에 대한 처리가 없습니다.

### 개선된 코드

```javascript
// src/pages/product/detail/index.js

async function loadHTML(selector, url) {
  const container = document.querySelector(selector);
  if (!container) return;

  try {
    const res = await fetch(url);

    // 서버가 에러를 응답한 경우
    if (!res.ok) {
      throw new Error(`${url} 로드 실패 (${res.status})`);
    }

    container.innerHTML = await res.text();
  } catch (error) {
    // 네트워크 에러 또는 서버 에러
    console.error("HTML 로드 실패:", error);
    container.innerHTML = `
      <p class="text-sm text-zambezi text-center py-10">
        콘텐츠를 불러올 수 없습니다.
      </p>
    `;
  }
}
```

### 추가 팁: 순차적 await 개선

현재 코드는 HTML을 **하나씩 순서대로** 불러옵니다:

```javascript
// ❌ 느림: 하나 끝나야 다음 것 시작
await loadHTML("#detail-main", "detail-main.html");
await loadHTML("#product-info", "detail-info.html");
await loadHTML("#detail-ritual-steps", "detail-ritual-steps.html");
```

서로 의존성이 없는 것들은 **동시에** 불러올 수 있습니다:

```javascript
// ✅ 빠름: 동시에 불러오기
await Promise.all([
  loadHTML("#detail-main", "detail-main.html"),
  loadHTML("#product-info", "detail-info.html"),
  loadHTML("#detail-ritual-steps", "detail-ritual-steps.html"),
  loadHTML("#detail-recommended", "detail-recommended.html"),
  loadHTML("#product-best-review", "detail-best-review.html"),
  loadHTML("#detail-reviews", "detail-review.html"),
]);

// HTML이 모두 로드된 후 초기화
renderProductMain(product);
initBadge();
// ...
```

---

## 3.9 해결: 이중 직렬화 수정

### 문제 요약
`cart/index.js`에서 `JSON.stringify()`를 하고, `client.js`에서도 또 합니다.

### 수정: body를 객체 그대로 전달

```javascript
// src/js/api/cart/index.js

export async function addToCart(productId, quantity) {
  try {
    return await fetchAPI("/members/me/cart/items", {
      method: "POST",
      // ❌ Before
      // headers: { "Content-Type": "application/json" },  ← client.js가 이미 추가함
      // body: JSON.stringify({ productId, quantity }),      ← client.js가 이미 직렬화함

      // ✅ After: 객체 그대로 전달
      body: { productId, quantity },
    });
  } catch (e) {
    // ... 에러 처리
  }
}
```

### 왜 이런 실수가 나는가?

`client.js`의 코드를 다시 보면:

```javascript
// client.js
const res = await fetch(`${BASE_URL}${path}`, {
  headers: {
    "Content-Type": "application/json",    // ← 이미 추가됨
    ...options.headers,
  },
  ...(options.body && { body: JSON.stringify(options.body) }), // ← 이미 직렬화됨
});
```

`client.js`가 이미 `Content-Type`과 `JSON.stringify`를 처리합니다.
API 함수에서는 **순수한 객체만** 넘기면 됩니다.

### 규칙
> **`fetchAPI()`를 쓸 때 `body`는 항상 일반 객체로!**
> `JSON.stringify()`나 `Content-Type` 헤더를 직접 설정하지 마세요.

---

## 3.10 해결: 모달 접근성 개선

### 문제 요약
모달에 포커스 트랩, ESC 닫기, ARIA 속성이 없습니다.

### 개선된 코드

```javascript
// src/components/ui/modal.js

export function createModal({ title, content }) {
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300";

  const container = document.createElement("div");
  container.className =
    "bg-white w-[90%] max-w-md rounded-lg shadow-xl transform scale-95 transition-transform duration-300 p-6";

  // ✅ 접근성: ARIA 속성 추가
  container.setAttribute("role", "dialog");
  container.setAttribute("aria-modal", "true");
  container.setAttribute("aria-label", title);

  const header = document.createElement("div");
  header.className = "flex justify-between items-center mb-4";

  const h2 = document.createElement("h2");
  h2.className = "text-xl font-bold";
  h2.textContent = title;

  const closeBtn = document.createElement("button");
  closeBtn.className = "text-2xl cursor-pointer";
  closeBtn.textContent = "\u00D7";  // × 문자
  closeBtn.setAttribute("aria-label", "닫기");  // ✅ 스크린리더용

  header.append(h2, closeBtn);

  const contentBody = document.createElement("div");
  if (typeof content === "string") {
    contentBody.textContent = content;
  } else {
    contentBody.append(content);
  }

  container.append(header, contentBody);
  overlay.append(container);

  // ✅ 이전 포커스 저장
  let previousFocus = null;

  const close = () => {
    overlay.classList.add("opacity-0");
    container.classList.add("scale-95");
    setTimeout(() => overlay.remove(), 300);
    document.body.style.overflow = "";  // ✅ 빈 문자열로 리셋 (원래 값 복원)

    // ✅ 이전 포커스 복원
    if (previousFocus) {
      previousFocus.focus();
    }
  };

  const open = () => {
    // ✅ 현재 포커스 저장
    previousFocus = document.activeElement;

    document.body.append(overlay);
    overlay.offsetHeight; // reflow
    overlay.classList.remove("opacity-0");
    container.classList.remove("scale-95");
    container.classList.add("scale-100");
    document.body.style.overflow = "hidden";

    // ✅ 모달 내 첫 번째 포커스 가능 요소로 이동
    const firstFocusable = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) {
      firstFocusable.focus();
    }
  };

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  // ✅ ESC 키로 닫기
  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      close();
    }

    // ✅ 포커스 트랩: Tab 키가 모달 밖으로 나가지 못하게
    if (e.key === "Tab") {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  return { open, close };
}
```

### 접근성 체크리스트

| 항목 | 기존 | 개선 |
|------|:---:|:---:|
| `role="dialog"` | X | O |
| `aria-modal="true"` | X | O |
| ESC 키로 닫기 | X | O |
| 포커스 트랩 | X | O |
| 이전 포커스 복원 | X | O |
| 닫기 버튼 `aria-label` | X | O |

---

## 요약: 우선순위별 작업 목록

### 지금 당장 고치세요 (심각도: 높음)
1. `cart/index.js`의 이중 직렬화 (3.9) - **버그입니다**
2. `client.js`에 커스텀 에러 클래스 추가 (3.2) - 에러 처리 안정성
3. `main.js`의 innerHTML → createElement (3.3) - 보안

### 다음 스프린트에서 (심각도: 중간)
4. 회원가입 코드 중복 제거 (3.1) - 유지보수성
5. 거대 함수 쪼개기 (3.4) - 가독성
6. 전역 상태 객체화 (3.5) - 안정성
7. 매직 넘버 상수화 (3.6) - 가독성
8. CSS 정리 (3.7) - 일관성

### 여유가 있을 때 (심각도: 낮음)
9. loadHTML 에러 처리 (3.8) - 안정성
10. 모달 접근성 (3.10) - 접근성
