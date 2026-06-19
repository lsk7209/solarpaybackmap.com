export function categoryToSlug(category) {
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function slugToCategory(slug, categories) {
  return categories.find((category) => categoryToSlug(category) === slug);
}

export function getCategoryPath(category) {
  return `/blog/category/${categoryToSlug(category)}`;
}

const categoryProfiles = {
  Battery: {
    description:
      "Battery articles test backup goals, time-of-use savings, export-credit limits, and when storage improves or weakens solar payback.",
    intent:
      "Use this hub when a quote adds storage, claims backup value, or depends on battery arbitrage to make solar economics work.",
  },
  Buying: {
    description:
      "Buying guides focus on quote comparison, disqualifiers, homeowner tenure, and the practical questions to ask before signing a solar contract.",
    intent:
      "Use this hub before entering a sales funnel or when two installer proposals make different savings claims.",
  },
  Data: {
    description:
      "Data explainers connect public solar production, rate, cost, and policy inputs to homeowner-facing payback ranges.",
    intent:
      "Use this hub when you need to understand which public data inputs move a solar payback estimate.",
  },
  Finance: {
    description:
      "Finance articles separate cash, loan, lease, tax-credit, and breakeven assumptions so solar savings claims are easier to audit.",
    intent:
      "Use this hub when financing terms, tax-credit timing, monthly payments, or ownership structure change the payback math.",
  },
  Incentives: {
    description:
      "Incentive hubs track credits, rebates, eligibility constraints, expiration risk, and how incentives change net solar system cost.",
    intent:
      "Use this hub when a quote depends on rebates, tax credits, adders, or policy timing to shorten payback.",
  },
  Methodology: {
    description:
      "Methodology articles explain how Solar Payback Map models solar payback, why ranges beat false precision, and which assumptions matter.",
    intent:
      "Use this hub to audit the model, source choices, conservative assumptions, and limits behind Solar Payback Map estimates.",
  },
  Policy: {
    description:
      "Policy articles cover net metering, net billing, export credits, state rules, and the policy changes that move solar payback.",
    intent:
      "Use this hub when export-credit rules, net metering changes, or state policy determine whether a system pencils out.",
  },
  Rates: {
    description:
      "Rate articles review utility prices, time-of-use plans, bill offsets, demand charges, and why electricity value can outweigh sun.",
    intent:
      "Use this hub when utility rates, usage timing, or retail electricity value are the main uncertainty in a quote.",
  },
  Roof: {
    description:
      "Roof articles cover shade, orientation, age, repairs, electrical constraints, and site conditions that can break a clean solar quote.",
    intent:
      "Use this hub when physical roof conditions could reduce production, add cost, or make a payback estimate too optimistic.",
  },
};

export function getCategoryDescription(category) {
  return (
    categoryProfiles[category]?.description ||
    `${category} articles group related Solar Payback Map solar payback decisions, source checks, and quote-review context.`
  );
}

export function getCategoryIntent(category) {
  return (
    categoryProfiles[category]?.intent ||
    `Use this hub to review ${category.toLowerCase()} questions before trusting a solar payback claim.`
  );
}

export function getCategoryMetaDescription(category) {
  const description = getCategoryDescription(category);
  const intent = getCategoryIntent(category);
  return `${description} ${intent}`;
}

export function getCategoryKeywords(category) {
  const normalized = category.toLowerCase();
  return [
    `${normalized} solar payback`,
    `${normalized} solar articles`,
    `${normalized} rooftop solar`,
    `${normalized} solar economics`,
    "residential solar payback",
  ];
}
