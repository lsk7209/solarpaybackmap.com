export function getKeyTakeaways(post) {
  const candidates = [
    ...(post.directAnswer || []),
    ...(post.sections || []).flatMap((section) => [
      ...(section.bullets || []),
      section.callout,
    ]),
  ]
    .filter(Boolean)
    .map((item) => item.replace(/^Payback note:\s*/i, "").trim())
    .filter((item) => item.length > 45);

  const unique = [];
  for (const item of candidates) {
    const normalized = item.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (unique.some((existing) => existing.normalized === normalized)) continue;
    unique.push({ normalized, text: item });
    if (unique.length === 3) break;
  }

  if (unique.length >= 3) return unique.map((item) => item.text);

  return [
    `${post.mainKeyword} should be judged with conservative payback assumptions, not a single optimistic quote number.`,
    `Check ${post.expandedKeywords?.[0] || "the strongest assumption"} against public sources, current rates, and the homeowner's bill context.`,
    "Use the next-step links to compare rankings, rerun the calculator, and verify the methodology before treating the estimate as final.",
  ];
}
