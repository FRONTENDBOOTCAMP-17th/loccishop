import { fetchAPI, fetchAPIWithFormData } from "/src/js/api/client.js";

// 리뷰 추천수 토글
export function toggleRecommendReview(reviewId) {
  return fetchAPI(`/reviews/${reviewId}/recommend`, { method: "POST" });
}

// 리뷰 이미지 업로드
export async function uploadReviewImages(imageFiles) {
  const urls = [];
  for (const file of imageFiles) {
    const formData = new FormData();
    formData.append("file", file); // ← "images" → "file"
    const data = await fetchAPIWithFormData("/reviews/images", formData);
    urls.push(data.imageUrl);
  }
  return urls;
}

// 리뷰 데이터 전송
export async function submitReview(productId, reviewData, imageFiles = []) {
  let imageUrls = [];

  if (imageFiles.length > 0) {
    imageUrls = await uploadReviewImages(imageFiles);
  }

  return fetchAPI(`/products/${productId}/reviews`, {
    method: "POST",
    body: { ...reviewData, images: imageUrls },
  });
}
