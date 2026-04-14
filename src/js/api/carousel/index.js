import { fetchAPI, fetchAPIWithFormData } from "/src/js/api/client.js";

export function fetchCarousels() {
  return fetchAPI("/carousels");
}

export function createCarousel({ imageUrl, name, desc }) {
  return fetchAPI("/carousels", {
    method: "POST",
    body: { imageUrl, name, desc },
  });
}

export function createCarouselWithFile(formData) {
  return fetchAPIWithFormData("/carousels", formData);
}

export function updateCarousel(id, { imageUrl, name, desc }) {
  return fetchAPI(`/carousels/${id}`, {
    method: "PUT",
    body: { imageUrl, name, desc },
  });
}

export function updateCarouselWithFile(id, formData) {
  return fetchAPIWithFormData(`/carousels/${id}`, formData);
}
