# 코드 리뷰 — 관리자 회원가입 페이지

> 대상: `src/pages/signup/admin/index.html`, `src/pages/signup/admin/index.js`
> (참고로 함께 비교한 파일: `src/pages/signup/user/index.html`, `src/pages/signup/user/index.js`,
> `src/js/signupUtils/validation.js`, `src/js/signupUtils/ui.js`)
> 관련 PR: #251, #253

이 문서는 **여러분이 작성한 코드를 평가하기 위한 글이 아니라**, 다음에 비슷한 화면을
만들 때 더 편하게 작업할 수 있도록 도와주기 위한 글입니다. 이미 동작하는 코드라는 것은
훌륭한 출발점이에요. 이번 리뷰는 "어떻게 하면 더 작게, 더 안전하게, 더 바꾸기 쉽게
만들 수 있을까?"에 초점을 맞췄습니다.

리뷰 기준은 두 가지입니다.

- **응집도(cohesion)는 높게**: 한 파일/한 함수는 "한 가지 일"만 한다.
- **결합도(coupling)는 낮게**: 한 곳을 고쳤을 때 다른 곳이 같이 깨지지 않는다.

그리고 **CSS는 꼭 필요할 때만 최소한으로**, 스타일은 **Tailwind CSS** 로 작성합니다.

---

## 1. 가장 큰 문제: `admin/index.js` 와 `user/index.js` 가 거의 똑같습니다

`src/pages/signup/admin/index.js` 와 `src/pages/signup/user/index.js` 를 나란히 놓고
보면, 거의 **95% 이상이 똑같은 코드**입니다. 다른 점은 단 두 가지뿐이에요.

| 항목 | user | admin |
| --- | --- | --- |
| 주소 입력 필드 | 있음 (`userAddress`, `userDetailAddress`) | 없음 |
| 인증 토큰 필드 | 없음 | 있음 (`adminToken`) |
| 호출 API | `signupUser` | `signupAdmin` |

나머지 약 270줄 — `getElements`, `initUI`, `bindPasswordToggle`,
`bindIdValidation`, `bindPasswordValidation`, `bindFieldValidations`, `handleSubmit`
의 뼈대 — 는 **두 파일에 그대로 두 번 적혀 있습니다.**

### 왜 이게 문제인가요?

복사-붙여넣기는 그 순간에는 가장 빠릅니다. 하지만 그때부터 두 파일은 "같이 늙어야"
합니다. 예를 들면 이런 일이 생깁니다.

- 비밀번호 규칙이 "8자 → 10자"로 바뀌면 → **두 파일 다 고쳐야 합니다.** 한 곳을 잊으면
  관리자만 8자가 됩니다. 사용자는 모릅니다.
- 디자인이 바뀌어서 에러 메시지를 빨강에서 주황으로 바꾸기로 했다 → 두 파일 다 고쳐야
  합니다.
- 누군가 user 쪽에서 버그를 고쳤는데 admin 쪽 같은 버그는 그대로 남아 있을 수 있어요.
  실제로 이런 일이 매우 자주 일어납니다.

이게 바로 "결합도가 높다"는 말입니다. **두 파일이 따로 떨어져 있는데 운명은 똑같이
같이 가야 하는 상태.** 응집도 측면에서도 좋지 않습니다. 한 파일 안에 "DOM 가져오기 +
입력 검증 + UI 토글 + 이벤트 바인딩 + 폼 제출 + 라우팅" 이 한꺼번에 들어 있어서,
파일이 한 가지 일만 하지 않거든요.

> 핵심 원칙: **같은 코드가 두 군데 이상에 있다면, 한 군데로 모을 수 있는지 먼저 고민한다.**
> 프로그래밍에는 이걸 줄여서 "DRY"(Don't Repeat Yourself, 같은 걸 반복하지 마라) 라고
> 부릅니다.

해결 방법은 [해결 가이드](./CODE_REVIEW_ADMIN_SIGNUP_GUIDE.md) 1번에 자세히 적었습니다.

---

## 2. `getElements()` 가 너무 큽니다 — DOM ID 결합도 문제

```js
function getElements() {
  return {
    form: document.getElementById("signupForm"),
    userId: document.getElementById("userId"),
    userPw: document.getElementById("userPw"),
    // ... 25줄 가까이 더 있음 ...
    tokenErrorText: document.getElementById("tokenErrorText"),
  };
}
```

이 함수는 약 30개의 DOM ID를 알고 있습니다. 즉, **HTML 의 ID 가 하나라도 바뀌면
JS 도 같이 고쳐야** 합니다. 이게 바로 "결합도가 높다"의 또 다른 모습이에요.

거기에 더해 `initUI(els)` 함수는 **`getElements` 가 알고 있는 ID 들을 다시 한 번
나열**해서 `style.display = "none"` 을 걸어줍니다. 즉, 똑같은 ID 목록이 한 파일 안에
두 군데에 적혀 있어요. 새 필드가 하나 추가되면 적어도 두세 군데를 동시에 고쳐야 합니다.

### 어떤 부분이 안 좋은 신호인가요?

- "필드 하나 추가하기"가 두려워지면 결합도가 너무 높다는 신호입니다.
- 한 함수가 화면을 끝에서 끝까지 다 알고 있으면 응집도가 떨어진다는 신호입니다.
  (이 함수는 "아이디 입력 필드 한 묶음"만 책임지면 충분합니다.)

해결법은 가이드 2번에 정리했습니다 — 필드 하나를 "입력 + 아이콘 + 메시지" 한 묶음으로
다루는 작은 함수를 만드는 방법입니다.

---

## 3. JS 안에서 `style.display = "none"` 을 직접 만지고 있습니다 — Tailwind 원칙 위반

```js
els.idDuplicateText.style.display = "none";
els.idAvailableText.style.display = "block";
```

또는 `setValid` / `setError` 안에도 `el.style.display = "block"` 같은 코드가 있습니다.

이 프로젝트는 **Tailwind CSS 우선** 규칙을 따르고 있어요. 그런데 위 코드는 자바스크립트
안에서 인라인 스타일을 직접 만지고 있습니다. 이건 두 가지 문제를 만듭니다.

1. **Tailwind 클래스로 정한 디자인 규칙이 무력화됩니다.** 예를 들어 디자이너가 나중에
   "에러 메시지는 inline-flex 로 보여달라" 라고 하면, 우리는 JS 안의 문자열
   `"block"` 을 찾아서 다 고쳐야 합니다.
2. **CSS 와 JS 가 섞입니다.** 응집도가 떨어져요. "보이고 안 보이는 것"은 표시
   영역(View)의 책임입니다. JS 는 "지금 상태가 valid 다/error 다" 만 알려주면 되고,
   "그래서 어떻게 보일지" 는 클래스가 정해야 합니다.

Tailwind 에는 이미 `hidden` 이라는 유틸리티 클래스가 있습니다. 보이고 싶을 때는
`hidden` 을 떼고, 숨기고 싶을 때는 `hidden` 을 붙이면 됩니다.

```js
// 안 좋은 예
errorIcon.style.display = "block";

// 좋은 예 (Tailwind 우선)
errorIcon.classList.remove("hidden");
```

또 한 가지, **HTML 에서 처음부터 숨겨야 하는 것은 HTML 에서 숨기세요.** 지금은
`initUI()` 함수가 페이지가 뜬 다음에 자바스크립트로 12개의 아이콘을 다 숨깁니다.
하지만 이 아이콘들은 사실 처음부터 보일 필요가 없어요. 그렇다면 HTML 에서 그냥
`class="... hidden"` 을 붙여 두는 게 자연스럽습니다. 그러면 `initUI()` 함수 자체가
필요 없어집니다 — 응집도가 올라갑니다.

---

## 4. Tailwind 클래스가 너무 길고, 반복이 많고, 값이 이상합니다

### 4-1. 반복

`index.html` 의 입력창들을 보면 거의 모든 `<input>` 에 같은 클래스가 붙어 있어요.

```html
class="bg-grey-99 border border-grey-45 my-2 h-10 py-2.25 pl-[7.67px] pr-[31.7px] w-full"
```

이게 6개 입력 필드에 **거의 그대로 6번** 등장합니다. 누가 디자인을 한 번만 바꿔도
6군데를 똑같이 고쳐야 해요. 결합도가 높습니다.

### 4-2. 의심스러운 값

- `w-161 h-417` → Tailwind v4 의 단위로 풀면 약 644rem × 1668rem 입니다. **화면보다
  훨씬 큰 박스**예요. 디자인 시안의 px 값을 그대로 쓰려고 한 흔적인데, 의도가
  맞는다면 `max-w-[644px]` (또는 `max-w-lg` 같은 의미 있는 값)으로 바꿔야 합니다.
  높이는 보통 콘텐츠가 정하게 두는 게 좋아서 빼는 걸 추천합니다.
- `py-2.25`, `pl-[7.67px]`, `pr-[31.7px]` → 0.25 단위가 아닌 임의값(arbitrary value)
  이 너무 많이 들어가 있습니다. Figma 의 픽셀 값을 한 자리까지 그대로 가져온 것 같은데,
  실제 화면에서는 0.5px 차이는 사람이 못 봐요. `py-2`, `pl-2`, `pr-8` 정도로 충분합니다.
  값을 단순하게 만들면 다른 입력 필드와 정렬도 자동으로 맞습니다.
- `text-[14px]`, `text-[12px]` → 디자인 토큰(`text-sm`, `text-xs`)이 있다면 그쪽을
  쓰는 게 좋습니다. "14px" 이라는 숫자가 코드 곳곳에 박히면 나중에 "전체 본문을 한
  단계씩 키우자" 같은 일을 할 때 한 번에 못 바꿉니다.

> 핵심 원칙: **Tailwind 의 임의값(`[14px]`, `[7.67px]`)은 진짜 어쩔 수 없을 때만**
> 씁니다. 디자인 토큰이나 기본 스케일(`text-sm`, `p-2`, `gap-4` …)을 먼저 시도해
> 보세요. 코드가 짧아질 뿐 아니라, 디자이너와 같은 언어로 이야기할 수 있게 됩니다.

### 4-3. CSS 파일에 `body.special-page` 같은 클래스가 따로 있는 것 같습니다

`<body class="special-page">` 처럼 의미를 알 수 없는 클래스 이름이 보입니다. 이게 어떤
CSS 파일에서 정의된 것이라면, **가능하면 Tailwind 클래스로 옮기세요**. 우리 프로젝트
규칙은 "CSS 는 어쩔 수 없을 때 최소한으로" 입니다.

---

## 5. 작은(하지만 중요한) 결합도 문제들

### 5-1. 라우팅 문자열이 코드 곳곳에 흩어져 있습니다

```js
window.location.href = "/src/pages/login/index.html"; // handleSubmit 안
// ...
window.location.href = "/src/pages/login/index.html"; // backBtn 안
```

같은 경로가 두 번 나옵니다. 만약 누군가 로그인 페이지 위치를 옮기면 (이미 #251 에서
관리자 회원가입 페이지를 옮겼던 것처럼) 이 문자열들도 다 같이 따라가야 해요. 한 번
빠뜨리면 사용자가 404 를 만납니다. 이걸 막기 위해 가이드 5번에서는 **상수 한 군데에서
관리하기** 방법을 보여드립니다.

### 5-2. "뒤로 가기" 버튼은 사실 링크여야 합니다

```html
<button type="button" id="backBtn" class="...">뒤로 가기</button>
```

```js
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "/src/pages/login/index.html";
});
```

이 버튼이 하는 일은 단지 "다른 페이지로 이동" 입니다. 이건 **`<a href>` 가 해야 하는
일** 이에요. `<a>` 로 만들면:

- JS 가 한 줄 줄어듭니다 (응집도 ↑).
- 사용자가 "새 탭으로 열기"(중간 클릭)를 할 수 있습니다.
- 스크린 리더가 "링크" 라고 정확히 알려줍니다 (접근성 ↑).
- 자바스크립트가 깨졌을 때도 동작합니다.

겉모양은 Tailwind 클래스로 똑같이 만들 수 있습니다. 가이드 5번에 예시가 있어요.

### 5-3. `setError(els.idErrorIcon, els.idCheckIcon, null)` — `null` 을 신호로 쓰고 있어요

```js
} else {
  ...
  setError(els.idErrorIcon, els.idCheckIcon, null); // ← null 을 넘김
}
```

여기서 `null` 은 "에러 텍스트는 다른 곳(`idDuplicateText`)에서 따로 처리할 거니까,
공용 헬퍼는 만지지 마세요" 라는 뜻입니다. 하지만 코드만 봐서는 그 의도를 알 수 없어요.
이런 식으로 "특별한 값을 넘겨서 동작을 바꾸는" 패턴은 읽는 사람을 헷갈리게 만듭니다.

같은 함수 안에서 한 줄은 헬퍼를 쓰고, 다른 줄은 `style.display = "block"` 을 직접
만지는 것도 일관성을 떨어뜨려요. 가이드 6번에서 정리하는 방법을 보여드립니다.

### 5-4. 에러를 문자열 검사로 분기하고 있습니다

```js
if (error.message.includes("401") || error.message.includes("403")) {
  setError(els.tokenErrorIcon, els.tokenCheckIcon, els.tokenErrorText);
  ...
}
```

서버가 401/403 을 줄 때 이 분기를 타게 하려는 의도이지만, **에러 메시지 문자열은
언제든 바뀝니다.** 예를 들어 백엔드가 다음 주에 메시지를 영어에서 한국어로 바꾸면 이
조건이 무너져요. 가능하다면 `error.status === 401` 같은 형태로 상태 코드를 직접
보도록 API 클라이언트(`signupAdmin`) 쪽을 살짝 고치는 게 좋습니다.

---

## 6. 접근성(Accessibility) 한 줄 메모

학생 단계에서 너무 깊이 파지 않아도 되지만, 알아두면 좋은 것 두 가지만 적습니다.

- 비밀번호 보기 버튼(`<button id="togglePassword">`) 안에 `<img>` 만 있고 텍스트가
  없어요. 스크린 리더 사용자에게는 "버튼" 이라고만 들립니다. `aria-label="비밀번호 보기"`
  를 붙여 주세요.
- 에러/통과를 **이미지로만** 보여주고 있어요. 색맹/시각장애 사용자에게는 잘 안 보일 수
  있습니다. `aria-invalid="true"` 를 입력에 붙이고, 메시지를 `aria-describedby` 로
  연결하면 훨씬 좋아집니다.

---

## 7. 잘하신 점 (계속 유지하면 좋은 것)

리뷰가 길어서 "다 잘못했나?" 싶을 수 있는데, 정말로 그렇지 않습니다. 잘하신 부분도 많아요.

- **`validation.js` / `ui.js` 로 로직을 분리한 것** — 응집도를 높이는 좋은 방향이에요.
  여기서 한 걸음 더 나아가면 됩니다. (예: 검증 함수가 boolean 만 반환해서 순수하다.)
- **`bindXxx` 형태로 함수를 쪼갠 것** — 한 함수가 너무 커지지 않게 하려는 의도가 보여요.
- **`pageshow` + `e.persisted` 로 BFCache 처리** — 이걸 신경 쓴 건 정말 잘하셨어요.
  뒤로가기로 돌아왔을 때 폼이 비어 있는 게 사용자 경험상 더 자연스럽습니다.
- **HTML 에서 `required` 를 쓰고, JS 에서도 한 번 더 검증** — 이중 안전망을 둔 것은 좋은
  습관입니다.
- **`alert` 메시지를 한국어로 명확하게 작성** — 사용자에게 친절합니다.

---

## 8. 다음 단계

이 리뷰만 보면 막막할 수 있어요. 그래서 같은 문제를 **어떻게 고치면 되는지** 단계별로
보여드리는 가이드를 따로 만들었습니다.

→ **[해결 가이드: CODE_REVIEW_ADMIN_SIGNUP_GUIDE.md](./CODE_REVIEW_ADMIN_SIGNUP_GUIDE.md)**

가이드를 다 따라할 필요는 없어요. 한 번에 다 고치려고 하지 말고, **1번(중복 제거)부터
하나씩** 적용해 보시는 걸 추천합니다. 한 번에 한 가지 문제만 손대는 게 학습에도, 실제
프로젝트에도 더 좋습니다.

리뷰는 사람을 평가하는 게 아니라 **코드를 더 좋게 만드는 대화** 입니다. 질문이 있으면
편하게 댓글로 남겨 주세요. 모든 질문은 환영입니다.
