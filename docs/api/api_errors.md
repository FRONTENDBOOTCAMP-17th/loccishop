# 🛑 API Error & Requirement Report

프로젝트 진행 중 발견된 API 오류 사항과 프론트엔드 개발을 위해 필요한 추가 데이터 필드를 정리한 문서입니다.

---

### 1. 에러 요약 (Summary)

현재 발생 중인 주요 오류 리스트입니다. (상태 코드 및 현상 중심)

| 순번 | API 경로 (Endpoint)                             | 상태 코드 | 주요 현상                                       | 우선순위 |
| :--- | :---------------------------------------------- | :-------: | :---------------------------------------------- | :------: |
| 1    | `PUT /api/loccishop/v1/members/me`              |   `403`   | 테스트 계정 수정 권한 제한으로 기능 테스트 불가 | **High** |
| 2    | `PATCH /api/loccishop/v1/members/me/password`   |   `403`   | 테스트 계정 비밀번호 변경 불가                  |  Medium  |
| 3    | `POST /api/loccishop/v1/members/me/withdraw`    |   `403`   | 테스트 계정 탈퇴 처리 불가                      |  Medium  |
| 4    | `POST /api/loccishop/v1/auth/admin/signup`      |   `403`   | 관리자 인증 토큰 오류로 가입 프로세스 차단      | **High** |
| 5    | `POST /api/loccishop/v1/admin/categories`       |   `500`   | 카테고리 등록 시 서버 내부 오류 발생            | **High** |
| 6    | `PATCH /api/loccishop/v1/admin/categories/{id}` |   `500`   | 카테고리 수정 시 서버 내부 오류 발생            |  Medium  |
| 7    | `POST /api/loccishop/v1/admin/banners`          |   `201`   | 등록 성공 응답 후 실제 데이터 조회 시 누락됨    | **High** |

---

### 2. 필드 추가 및 수정 요청 (Feature Request)

프론트엔드 UI 및 데이터 바인딩을 위해 다음 API의 응답/요청 값에 필드 추가를 요청합니다.

| 관련 기능          | 해당 API 경로 (Endpoint)                | 추가 요청 필드                                 |
| :----------------- | :-------------------------------------- | :--------------------------------------------- |
| **상품 조회**      | `GET /api/loccishop/v1/products`        | 응답 데이터 내 `categoryId` 추가               |
| **재고 조회**      | `GET /api/loccishop/v1/admin/stocks`    | 응답 데이터 내 `productName` (상품명) 추가     |
| **리뷰 조회**      | `GET /api/loccishop/v1/reviews`         | 응답 데이터 내 `productId`, `productName` 추가 |
| **전체 회원 조회** | `GET /api/loccishop/v1/admin/members`   | 응답 데이터 내 `username` 추가                 |
| **상품 등록**      | `POST /api/loccishop/v1/admin/products` | 응답 데이터 내 생성된 `productId` 추가         |

---

### 3. 오류 상세 내용 (Details)

#### [상세 1~3] 내 정보 수정 / 비밀번호 변경 / 회원 탈퇴

- **대상 경로:** `PUT /api/loccishop/v1/members/me` 등 관련 API 전체
- **문제 현상:**

1. 관리자(Admin) 계정으로 로그인 후 API 호출 시에도 `403 Forbidden ("테스트 계정은 수정/탈퇴할 수 없습니다.")` 응답 발생.
2. 문서(Swagger) 상의 `curl Example` 헤더에 유효하지 않은(혹은 고정된) `testuser` 전용 Bearer 토큰이 강제 세팅되어 있음.

- **요청 사항:**
- 현재 로그인한 사용자의 토큰이 `curl` 예시 및 실제 호출 시 **동적으로 반영(Dynamic Injection)**되도록 Swagger 설정 수정 요청.
- 혹은 테스트 시 `testuser`의 권한 제한을 일시적으로 해제하거나, 수정 가능한 별도의 테스트 계정 정보 제공 필요.
- **비고:** 프론트엔드에서 `Request Body`만 수정해서는 테스트가 불가능한 구조임 (헤더 토큰 고정 문제).

#### [상세 4] 관리자 가입

- **대상 경로:** `POST /api/loccishop/v1/auth/admin/signup`
- **에러 메시지:** `403 Forbidden "관리자 인증 토큰이 올바르지 않습니다."`
- **확인 필요:** 관리자 가입 시 필요한 `admin token`의 유효성 혹은 전달 방식 확인이 필요합니다.

#### [상세 5~6] 관리자 카테고리 등록 및 수정

- **대상 경로:** - `POST /api/loccishop/v1/admin/categories`
  - `PATCH /api/loccishop/v1/admin/categories/{id}`
- **에러 메시지:** `500 Internal Server Error "서버 내부 오류가 발생했습니다."`
- **현상:** 관리자 권한으로 카테고리 조작 시 서버 단에서 예외가 발생합니다.

#### [상세 7] 배너 등록 및 조회 불일치

- **대상 경로:** `POST /api/loccishop/v1/admin/banners`
- **현상:** 1. 배너 등록 요청 시 `201 Created` 응답 확인 (예: id: 8 생성). 2. 이후 배너 전체 조회(`GET /api/loccishop/v1/banners`) 시 방금 생성한 id: 8번 데이터가 목록에 나타나지 않음.
- **확인 필요:** DB 반영 지연 혹은 조회 쿼리의 필터링 조건 확인이 필요합니다.
