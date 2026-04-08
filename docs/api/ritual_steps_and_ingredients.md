# Ritual Steps API + productInfo.ingredients 별칭 안내

> 2026-04-08: `docs/api/20260408_api_추가요청.md`의 요청사항을 처리했습니다.

API 문서: https://www.fullstackfamily.com/loccishop/api-docs

---

## 1. Ritual Steps API

### 공개 API: 상품의 리추얼 스텝 조회

```
GET /api/loccishop/v1/products/{productId}/ritual-steps
```

**응답 (리추얼이 있는 경우)**:
```json
{
  "title": "부드러운 손, 윤기 나는 손톱",
  "description": "3단계 핸드 & 네일 리추얼을 경험해 보세요.",
  "steps": [
    {
      "step": 1,
      "productId": 1,
      "productName": "시어 핸드 스크럽",
      "volume": "30ml",
      "price": 19000,
      "imageUrl": "https://storage.fullstackfamily.com/.../rep.jpg"
    },
    {
      "step": 2,
      "productId": 2,
      "productName": "시어 버터 핸드 크림",
      "volume": "75ml",
      "price": 29000,
      "imageUrl": "https://storage.fullstackfamily.com/.../rep.jpg"
    }
  ]
}
```

**응답 (리추얼이 없는 경우)**:
```json
{
  "steps": []
}
```

프론트엔드 처리:
- `steps`가 빈 배열이면 리추얼 섹션 렌더링하지 않음
- `description`이 null이면 설명 영역 표시하지 않음
- `volume`은 상품의 label 필드에서 가져옴

```javascript
const res = await fetch(`/api/loccishop/v1/products/${productId}/ritual-steps`)
const { data } = await res.json()

if (data.steps.length > 0) {
  // 리추얼 섹션 렌더링
  console.log(data.title)
  data.steps.forEach(step => {
    console.log(`Step ${step.step}: ${step.productName} (${step.volume}) - ${step.price}원`)
  })
}
```

### 관리자 API: 리추얼 세트 관리

```bash
# 세트 생성
POST /admin/ritual-sets
{ "title": "핸드 케어 리추얼", "description": "3단계 핸드 케어" }
→ 201 { id, title, description }

# 스텝 추가
POST /admin/ritual-sets/{setId}/steps
{ "step": 1, "productId": 1 }
→ 201 { id, ritualSetId, step, productId }

# 세트 목록
GET /admin/ritual-sets
→ { ritualSets: [...] }

# 세트 삭제 (스텝도 함께 삭제)
DELETE /admin/ritual-sets/{id}

# 개별 스텝 삭제
DELETE /admin/ritual-sets/{setId}/steps/{stepId}
```

---

## 2. productInfo.ingredients 별칭

상품 등록/수정 시 `productInfo` 내에서 `ingredients`와 `fullIngredients` 중 어느 것을 보내도 동일하게 처리됩니다.

```json
// 이렇게 보내도 됩니다 (학생 요청 형식)
{
  "productInfo": {
    "ingredients": "정제수, 시어버터, 글리세린 ...",
    "howToUse": "적당량을 덜어 바릅니다.",
    "productDisclosure": "내용물의 용량: 75ml"
  }
}

// 기존 형식도 그대로 동작합니다
{
  "productInfo": {
    "fullIngredients": "정제수, 시어버터, 글리세린 ...",
    "howToUse": "적당량을 덜어 바릅니다.",
    "productDisclosure": "내용물의 용량: 75ml"
  }
}
```

---

## 3. options (용량 옵션) 안내

상품의 용량 옵션은 **`groupId`로 자동 매핑**됩니다. 별도의 `options` 배열을 보낼 필요가 없습니다.

같은 `groupId`를 가진 상품들이 자동으로 옵션으로 연결됩니다:

```bash
# 30ml 상품 등록
POST /admin/products
{ "groupId": "SHEA-HAND", "name": "시어 핸드크림 30ml", "label": "30ml", "price": 17000, ... }

# 75ml 상품 등록 (같은 groupId)
POST /admin/products
{ "groupId": "SHEA-HAND", "name": "시어 핸드크림 75ml", "label": "75ml", "price": 29000, ... }
```

상품 상세 조회 시 자동으로 `options` 배열이 반환됩니다:
```json
{
  "options": [
    { "id": 1, "label": "30ml", "url": "/product/detail/1", "isCurrent": true },
    { "id": 2, "label": "75ml", "url": "/product/detail/2", "isCurrent": false }
  ]
}
```

프로덕션에 이미 반영되었습니다.
