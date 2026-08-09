export function slugify(input: string, fallbackPrefix = "item") {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[\u4e00-\u9fff]+/g, "") // strip CJK for URL-safe slug
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (base.length >= 2) return base.slice(0, 64);
  return `${fallbackPrefix}-${Date.now().toString(36)}`;
}
