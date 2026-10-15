export const pageHead = (title: string, description: string) => ({
  meta: [
    { title: `${title} · Bearny` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} · Bearny` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
