# 해결 가이드 — 관리자 회원가입 페이지 리팩터링

이 문서는 [코드 리뷰](./CODE_REVIEW_ADMIN_SIGNUP.md)에서 짚었던 문제들을
**한 단계씩, 따라 할 수 있게** 정리한 안내서입니다.

> "리팩터링(refactoring)"이라는 말이 처음이라면 이렇게 생각해 보세요.
> **"동작은 그대로 두면서, 코드의 모양만 더 깔끔하게 바꾸는 일"** 입니다.
> 그래서 리팩터링을 시작하기 전에는 **"지금 코드가 잘 동작하는지" 부터** 한 번
> 확인하는 게 중요합니다. 동작을 확인했다면 안심하고 바꾸기 시작해도 돼요.

---

## 들어가기 전에 — 한 가지 약속

> **한 번에 하나씩만 바꾸세요.**

이 가이드에는 6가지 주제가 있습니다. 한꺼번에 다 적용하지 마세요.
1번을 끝내고 → 브라우저에서 동작 확인 → 커밋 → 그 다음 2번. 이렇게 가는 게
실제 회사에서도 가장 안전한 방식입니다.

리팩터링 중에 뭔가 깨지면 마지막 커밋으로 돌아가면 됩니다. 한 번에 다 바꿔놓은
상태에서 깨지면 어디서 깨졌는지 찾기가 정말 힘들어요.

---

## 1. 가장 큰 문제부터: `admin/index.js` 와 `user/index.js` 의 중복 없애기

### 1단계: "다른 부분" 만 따로 적어 보기

먼저 종이에 두 파일의 **"진짜 다른 부분"** 을 적어 보세요. 이렇게 나옵니다.

| 항목 | user | admin |
| --- | --- | --- |
| 추가 입력 필드 | 주소(`baseAddress`, `detailAddress`) | 토큰(`adminToken`) |
| API 함수 | `signupUser` | `signupAdmin` |
| 성공 메시지 | "회원가입이 완료되었습니다." | "관리자 회원가입이 완료되었습니다." |

진짜 다른 건 이게 전부예요. 나머지는 다 똑같습니다. 그 말은 — **하나의 함수가
"다른 부분만 인자(파라미터)로 받아서"** 만들어질 수 있다는 뜻이에요.

### 2단계: 공통 함수를 만들 자리 정하기

`src/js/signupUtils/` 폴더에 이미 `validation.js`, `ui.js` 가 있어요. 같은 곳에
새 파일을 하나 만듭니다.

```
src/js/signupUtils/createSignupPage.js
```

> 왜 거기일까? **응집도** 때문이에요. "회원가입 페이지를 도와주는 코드들"이 한 폴더에
> 모여 있게 됩니다. 한 가지 일(회원가입) 을 도와주는 코드들이 한 곳에 있으면, 다음에
> 회원가입 관련해서 뭔가 찾을 때 거기만 보면 됩니다.

### 3단계: 공통 함수의 모양 잡기

대략 이런 모양이 됩니다. (전체를 한 번에 다 짜지 마세요. 일단 뼈대만.)

```js
// src/js/signupUtils/createSignupPage.js
import { checkId } from "/src/js/api/auth/index.js";
import {
  isValidUsername,
  isValidEmail,
  isValidPassword,
} from "./validation.js";
import { setValid, setError, clearState } from "./ui.js";

/**
 * 회원가입 페이지(사용자/관리자)에 공통으로 필요한 동작을 한 번에 묶어줍니다.
 *
 * @param {object} options
 * @param {(body: object) => Promise<any>} options.signupApi - 실제로 호출할 API 함수
 * @param {(els: object) => object} options.collectExtraFields - admin/user 마다 다른 추가 필드를 모아주는 함수
 * @param {(els: object) => boolean} options.validateExtraFields - 추가 필드 검증
 * @param {string} options.successMessage - 성공 시 alert 문구
 */
export function createSignupPage({
  signupApi,
  collectExtraFields,
  validateExtraFields,
  successMessage,
}) {
  // ... 여기에 기존 admin/index.js 의 공통 로직을 그대로 옮깁니다.
}
```

### 4단계: 옮길 코드 정하기

옮길 것:

- `getElements()` 의 **공통 부분**
- `initUI()` (이건 사실 곧 없앨 거예요. 7번 항목 참고)
- `bindPasswordToggle`
- `bindIdValidation`
- `bindPasswordValidation`
- 폼 제출 핸들러의 **공통 분기**

각 페이지(`user/index.js`, `admin/index.js`)에 남길 것:

- "추가 필드"의 ID 목록 (admin: `adminToken`, user: `userAddress` …)
- "추가 필드"의 검증 규칙
- 호출할 API 함수
- 성공 메시지

### 5단계: 적용 후 `admin/index.js` 의 모습

리팩터링이 끝나면 `admin/index.js` 는 이렇게 짧아질 수 있어요.

```js
import { signupAdmin } from "/src/js/api/auth/index.js";
import { createSignupPage } from "/src/js/signupUtils/createSignupPage.js";
import { setError } from "/src/js/signupUtils/ui.js";

createSignupPage({
  signupApi: signupAdmin,
  successMessage: "관리자 회원가입이 완료되었습니다.",

  collectExtraFields: (els) => ({
    adminToken: els.adminToken.value,
  }),

  validateExtraFields: (els) => {
    if (!els.adminToken.value) {
      setError(els.tokenErrorIcon, els.tokenCheckIcon, els.tokenErrorText);
      els.adminToken.focus();
      return false;
    }
    return true;
  },
});
```

300줄이 30줄이 됐습니다. 그리고 비밀번호 규칙이 바뀌어도 이제 **한 군데(공통 함수)
만 고치면** user/admin 양쪽이 동시에 고쳐져요.

> 이것이 **결합도를 낮추는** 가장 효과적인 방법입니다. "같은 일을 하는 코드는
> 한 곳에 모으기."

### 6단계: 잊지 말 것

- user 쪽도 똑같이 새 함수를 쓰도록 바꾸세요. (둘 다 바꿔야 진짜로 중복이 사라집니다.)
- 한 번에 다 바꾸지 말고, **admin 쪽만 먼저** 바꿔서 동작 확인 → 커밋 → 그다음 user.
- 처음 시도할 때는 어디까지 공통화할지 욕심내지 마세요. "검증 부분만 일단" 같은
  식으로 작게 시작해도 충분히 큰 성과입니다.

---

## 2. `getElements()` 줄이기 — "필드 묶음" 으로 생각하기

지금은 30개의 ID 를 한 함수가 알고 있습니다. 대신 **"한 필드는 한 묶음"** 으로 생각해
보세요.

```html
<!-- 한 묶음(field) 의 표시 -->
<div data-field="userId">
  <label class="text-sm font-medium" for="userId-input">아이디*</label>
  <div class="relative">
    <input
      id="userId-input"
      data-field-input
      class="..."
    />
    <img data-field-icon="error" src="/src/assets/icon/error.svg" class="hidden ..." alt="" />
    <img data-field-icon="check" src="/src/assets/icon/check.svg" class="hidden ..." alt="" />
  </div>
  <p data-field-message="error" class="hidden text-error-red text-xs">잘못된 형식입니다.</p>
</div>
```

JS 쪽에서는 이렇게 한 묶음을 한꺼번에 다룹니다.

```js
function getField(name) {
  const root = document.querySelector(`[data-field="${name}"]`);
  return {
    root,
    input: root.querySelector("[data-field-input]"),
    errorIcon: root.querySelector('[data-field-icon="error"]'),
    checkIcon: root.querySelector('[data-field-icon="check"]'),
    errorMessage: root.querySelector('[data-field-message="error"]'),
  };
}

const idField = getField("userId");
const pwField = getField("userPw");
```

좋은 점이 두 가지예요.

1. **HTML 의 ID 를 JS 가 외울 필요가 없습니다.** "data-field 묶음" 이라는 약속만
   지키면 돼요. → 결합도 ↓
2. **새 필드를 추가할 때 JS 는 거의 그대로** 입니다. HTML 에 한 묶음을 더 적고,
   JS 에서 `getField("새이름")` 한 줄만 추가하면 끝. → 응집도 ↑

> "굳이 ID 를 안 쓰고 `data-*` 를 쓰는 이유가 뭐예요?"
> 아주 좋은 질문입니다. ID 는 페이지 안에서 **유일해야** 합니다. 같은 모양의 입력이 두
> 개 있으면 ID 를 두 번 못 써요. `data-*` 는 여러 번 써도 되고, "이건 우리 약속" 이라는
> 의미를 더 잘 드러냅니다.

---

## 3. `style.display` 대신 Tailwind `hidden` 클래스 쓰기

### Before

```js
// ui.js
export function setValid(errorIcon, checkIcon, errorText) {
  if (errorIcon) errorIcon.style.display = "none";
  checkIcon.style.display = "block";
  if (errorText) errorText.style.display = "none";
}
```

### After

```js
// ui.js
export function setValid(errorIcon, checkIcon, errorText) {
  errorIcon?.classList.add("hidden");
  checkIcon.classList.remove("hidden");
  errorText?.classList.add("hidden");
}

export function setError(errorIcon, checkIcon, errorText) {
  errorIcon?.classList.remove("hidden");
  checkIcon.classList.add("hidden");
  errorText?.classList.remove("hidden");
}

export function clearState(errorIcon, checkIcon, errorText) {
  errorIcon?.classList.add("hidden");
  checkIcon.classList.add("hidden");
  errorText?.classList.add("hidden");
}
```

> `?.` 는 "있으면 사용하고, 없으면 그냥 넘어가" 라는 뜻입니다(Optional chaining).
> 기존의 `if (errorIcon) ...` 보다 짧고 의도가 분명해요.

그리고 **HTML 쪽에서 처음부터 `hidden` 을 붙여 두세요.**

```html
<!-- Before -->
<img id="idCheckIcon" src="/src/assets/icon/check.svg" class="absolute right-3 ..." />

<!-- After -->
<img id="idCheckIcon" src="/src/assets/icon/check.svg" class="hidden absolute right-3 ..." />
```

이렇게 하면 `initUI()` 함수 전체를 지울 수 있습니다. 코드가 줄어들 뿐 아니라,
"화면이 처음 어떻게 생겼는지"가 HTML 한 곳에서 다 보여요. 응집도가 올라갑니다.

> 한 가지 주의: `hidden` 클래스와 Tailwind 의 `flex`, `grid` 같은 디스플레이 클래스가
> 같은 요소에 동시에 있을 때는 **`hidden` 이 이깁니다** (Tailwind 의 우선순위 때문에).
> 그래서 보통은 잘 동작합니다.

---

## 4. 긴 Tailwind 클래스 정리하기

### 4-1. 의심스러운 값부터 손보기

`admin/index.html` 14번째 줄 근처:

```html
<!-- Before -->
<div class="w-161 h-417 px-2 flex flex-col">
```

`w-161 h-417` 은 거의 확실히 잘못된 값이에요. 의도는 "Figma 시안의 너비/높이를 그대로
재현하기" 였을 텐데, 실제로는 화면을 넘어버리는 크기가 됩니다. 이렇게 바꾸세요.

```html
<!-- After -->
<div class="w-full max-w-[640px] px-2 flex flex-col">
```

높이는 적지 마세요. 안에 있는 내용이 자연스럽게 정해주는 게 좋습니다.

### 4-2. 임의값(arbitrary value) 줄이기

```html
<!-- Before -->
<input class="bg-grey-99 border border-grey-45 my-2 h-10 py-2.25 pl-[7.67px] pr-[31.7px] w-full" />

<!-- After -->
<input class="w-full h-10 my-2 px-2 bg-grey-99 border border-grey-45" />
```

- `py-2.25` → `py-2` 로 충분합니다 (사람 눈에는 차이가 안 보여요).
- `pl-[7.67px] pr-[31.7px]` → 좌우를 따로 둘 이유가 없으면 `px-2`. 만약 오른쪽에
  아이콘이 있어서 공간이 필요하면 `pl-2 pr-8` 정도가 적당합니다.
- 클래스 순서도 정리해 보세요. 보통 **레이아웃(w/h) → 여백(margin/padding) → 색/테두리**
  순서로 적으면 읽기 쉬워요. (꼭 지킬 규칙은 아니지만, 팀이 같은 순서를 쓰면 코드 리뷰가
  편해집니다.)

### 4-3. 같은 클래스가 여러 군데에 반복되면

가장 간단한 해결: **JS 에서 상수로 빼기.**

```js
// src/js/signupUtils/styles.js
export const INPUT_CLASS =
  "w-full h-10 my-2 px-2 bg-grey-99 border border-grey-45";
```

그리고 HTML 안에서는 그대로 쓰되, 디자인이 바뀌면 이 상수만 바꾸면 됩니다.
(고급 단계로 가면 Tailwind 의 `@apply` 나 컴포넌트 함수로 추출할 수 있어요. 지금은
이 정도면 충분합니다.)

> ⚠️ 주의: Tailwind v4 의 JIT 빌더는 "코드에 문자열 형태로 등장한" 클래스만 CSS 로
> 만들어 줍니다. 그래서 `INPUT_CLASS` 같이 상수에 넣을 때, 클래스 이름을 **문자열을
> 끊지 말고 그대로** 적어야 합니다. (예: `"w-full" + size` 같은 동적 조합은 동작하지
> 않을 수 있어요.)

---

## 5. 라우팅 문자열 한곳으로 모으기 + "뒤로 가기" 를 링크로 바꾸기

### 5-1. 경로 상수

```js
// src/js/constants/routes.js
export const ROUTES = {
  LOGIN: "/src/pages/login/index.html",
  HOME: "/",
  SIGNUP_USER: "/src/pages/signup/user/index.html",
  SIGNUP_ADMIN: "/src/pages/signup/admin/index.html",
};
```

이제 `window.location.href = ROUTES.LOGIN;` 처럼 쓰세요. 나중에 페이지가 옮겨가도 한
파일만 고치면 됩니다. (#251 같은 일이 또 일어나도 안전해요.)

### 5-2. "뒤로 가기" 는 `<a>` 로

```html
<!-- Before -->
<button type="button" id="backBtn" class="flex-1 py-2 bg-orange-90">
  뒤로 가기
</button>

<!-- After -->
<a
  href="/src/pages/login/index.html"
  class="flex-1 py-2 bg-orange-90 text-center"
>
  뒤로 가기
</a>
```

그리고 JS 에서 다음 코드를 **삭제**하세요. 이제 필요 없습니다.

```js
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "/src/pages/login/index.html";
});
```

> "버튼이랑 링크가 모양이 똑같으면 그냥 버튼 써도 되지 않나요?"
> 모양은 같아도 **하는 일이 다르면 다른 태그** 를 써야 합니다. "다른 페이지로 가는
> 일" 은 링크의 본분이에요. 사용자가 가운데 클릭으로 새 탭에서 열고 싶을 수도 있고,
> 스크린 리더가 "링크입니다" 라고 알려줘야 합니다.

---

## 6. `setError(..., null)` 정리하기

지금은 `setError(els.idErrorIcon, els.idCheckIcon, null)` 처럼 `null` 을 일부러 넘기는
부분이 있습니다. 이건 "에러 아이콘만 토글하고 싶다" 는 뜻인데, 코드만 봐서는 알 수
없어요. 그럴 때는 **함수 두 개로 나누는 게** 더 솔직합니다.

```js
// ui.js
export function showOnlyErrorIcon(errorIcon, checkIcon) {
  errorIcon.classList.remove("hidden");
  checkIcon.classList.add("hidden");
}
```

그리고 호출하는 쪽:

```js
// 중복확인에서 "이미 사용 중" 일 때
showOnlyErrorIcon(els.idErrorIcon, els.idCheckIcon);
els.idDuplicateText.classList.remove("hidden");
els.idAvailableText.classList.add("hidden");
```

함수 이름이 길어졌지만, **무엇을 할지 이름만 봐도 알 수 있어요.** 코드를 처음 보는
사람도 헷갈리지 않습니다.

---

## 7. 응집도/결합도 체크리스트 (마지막 점검용)

리팩터링이 끝났다고 생각될 때, 이 7가지를 한 번씩 확인해 보세요.

- [ ] 같은 코드가 두 군데 이상에 있나요? → 한 곳으로 모을 수 있는지 확인.
- [ ] 한 함수가 50줄을 넘나요? → 작은 함수들로 나눌 수 있는지 확인.
- [ ] HTML 의 ID/클래스가 JS 안에 흩어져 있나요? → `data-*` 나 헬퍼로 정리.
- [ ] JS 안에 `style.something = ...` 이 있나요? → Tailwind 클래스로 바꿀 수 있는지 확인.
- [ ] `1`, `"/src/pages/..."`, `"401"` 같은 매직 값이 코드 안에 박혀 있나요? → 상수로 추출.
- [ ] 새 필드 하나를 추가한다고 상상해 보세요. **몇 군데를 고쳐야 하나요?** 한 군데면
      성공입니다. 다섯 군데면 결합도가 아직 높아요.
- [ ] 동작이 그대로인가요? **브라우저에서 직접** 회원가입 흐름을 한 번 돌려보세요.

---

## 마지막으로

리팩터링은 한 번에 완벽해질 수 없어요. 처음에는 **1번(중복 제거)** 만 해도 코드가
크게 좋아집니다. 거기서 멈춰도 됩니다. 시간이 더 있을 때 2번, 3번… 으로 천천히
나아가세요.

가장 중요한 건 **"같은 코드를 두 번 이상 적게 만들기"** 와 **"한 곳을 고쳤을 때 다른
곳이 따라 깨지지 않게 만들기"** 입니다. 이 두 가지만 머릿속에 두고 코드를 보면, 다음
프로젝트는 자연스럽게 더 단단해질 거예요.

질문이나 막히는 부분이 있으면 언제든 물어보세요. 좋은 질문은 좋은 코드만큼 가치가
있습니다.
