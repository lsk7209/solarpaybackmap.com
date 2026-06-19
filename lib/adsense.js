const ADSENSE_PUBLISHER_PATTERN = /^(?:ca-)?pub-(\d{10,})$/;

export function getAdsenseClientId(value) {
  if (!value) return "";
  const trimmed = value.trim();
  const match = trimmed.match(ADSENSE_PUBLISHER_PATTERN);
  if (!match || /^0+$/.test(match[1])) return "";
  return trimmed.startsWith("ca-") ? trimmed : `ca-${trimmed}`;
}

export function getAdsensePublisherId(value) {
  return getAdsenseClientId(value).replace(/^ca-/, "");
}
