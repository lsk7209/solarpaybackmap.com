export function formatDisplayDate(value, options = {}) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
    ...options,
  }).format(new Date(value));
}

export function toDateTime(value) {
  return new Date(value).toISOString();
}

export function getLatestUpdated(posts) {
  return posts
    .map((post) => post.updated)
    .sort()
    .at(-1);
}
