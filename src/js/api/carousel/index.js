import { fetchAPI } from "/src/js/api/client.js";

export async function fetchCarousels(position = "sub1") {
  const data = await fetchAPI(`/banners?position=${position}`);
  const list = data?.banners ?? [];

  return list
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ imageUrl, title, linkUrl }) => ({
      imageUrl,
      name: title,
      href: linkUrl ?? "#",
    }));
}
