import { plannedPosts } from "./planned-posts.js";

const legacyPosts = [
  {
    slug: "how-we-estimate-solar-payback",
    category: "Methodology",
    read: 9,
    date: "2026-05-28",
    updated: "2026-05-28",
    title: "Solar Payback Estimate: How Solar Payback Map Calculates It Without Selling Leads",
    subtitle:
      "A public, conservative method for residential solar payback: production, electricity rates, installed cost, incentives, and export-credit policy.",
    excerpt:
      "The full formula, every assumption, and why we would rather under-promise. We walk through generation, rates, install cost, and policy.",
    featured: true,
    keywords: ["solar payback estimate", "residential solar ROI", "PVWatts solar calculator"],
    cta: { label: "Compare your state score", href: "/rankings" },
    internalLinks: [
      { label: "Worth-It rankings", href: "/rankings" },
      { label: "Solar payback calculator", href: "/calculator" },
      { label: "Full methodology", href: "/methodology" },
    ],
    externalSources: [
      { label: "NREL PVWatts", href: "https://pvwatts.nrel.gov/" },
      { label: "LBNL Tracking the Sun", href: "https://emp.lbl.gov/tracking-the-sun" },
    ],
    sections: [
      {
        id: "short-answer",
        heading: "Solar payback estimate, in one sentence",
        body: [
          "A solar payback estimate is the number of years it takes for bill savings and eligible incentives to recover the net installed cost of a rooftop system.",
          "Solar Payback Map treats that number as a screening tool, not a quote. If the estimate looks weak before roof-specific details, the homeowner should know that before entering a sales funnel.",
        ],
      },
      {
        id: "formula",
        heading: "Solar payback formula used by Solar Payback Map",
        body: [
          "The model starts with annual production, multiplies it by local electricity value, adjusts for export-credit policy, then compares that savings estimate with net installed cost.",
        ],
        table: [
          ["Annual production", "System size multiplied by modeled output for the location."],
          ["Annual savings", "Production multiplied by electricity rate and export-credit factor."],
          ["Net cost", "Installed cost minus the federal credit and modeled local incentives."],
          ["Payback range", "Net cost divided by annual savings, widened for conservative and typical cases."],
        ],
      },
      {
        id: "sources",
        heading: "Solar payback sources and assumptions",
        body: [
          "The model favors public sources over installer-marketplace assumptions. That means visible source labels and review dates are part of the product, not footnotes.",
        ],
        bullets: [
          "Solar generation: NREL PVWatts-style production modeling.",
          "Electricity value: residential rate context from public utility and energy datasets.",
          "Installed cost: national and state cost context from research datasets.",
          "Policy: net metering, net billing, and export-credit treatment reviewed separately.",
        ],
      },
      {
        id: "range",
        heading: "Why a solar payback range is more honest",
        body: [
          "A precise-looking payback number hides roof angle, shade, financing, usage, future rates, degradation, and tenure. A range is less tidy, but it better matches how homeowners actually make the decision.",
        ],
        callout:
          "Editorial rule: when an assumption can reasonably go two ways, Solar Payback Map uses the one less flattering to solar and shows the assumption.",
      },
    ],
  },
  {
    slug: "net-metering-explained",
    category: "Policy",
    read: 7,
    date: "2026-05-21",
    updated: "2026-05-24",
    title: "Net Metering Explained: Why Solar Export Credits Decide Payback",
    subtitle:
      "Full retail credit, net billing, and avoided-cost exports can change the value of every kilowatt-hour your roof sends to the grid.",
    excerpt:
      "The single policy that moves payback the most, mapped in plain English for homeowners comparing solar quotes.",
    keywords: ["net metering explained", "solar export credit", "solar payback policy"],
    cta: { label: "Run the calculator with export credits", href: "/calculator" },
    internalLinks: [
      { label: "Solar payback calculator", href: "/calculator" },
      { label: "California NEM 3.0 example", href: "/solar/california" },
      { label: "Methodology", href: "/methodology" },
    ],
    externalSources: [
      { label: "DSIRE policy database", href: "https://www.dsireusa.org/" },
      { label: "California Public Utilities Commission NEM", href: "https://www.cpuc.ca.gov/" },
    ],
    sections: [
      {
        id: "short-answer",
        heading: "Net metering explained for solar payback",
        body: [
          "Net metering is the rule that decides how much credit you receive when your solar panels export unused electricity to the grid.",
          "If exports receive full retail credit, solar savings usually improve. If exports receive a lower avoided-cost or net-billing credit, payback can stretch even in sunny places.",
        ],
      },
      {
        id: "credit-types",
        heading: "Full retail credit vs net billing",
        body: [
          "Full retail net metering treats exported power close to the same value as power you buy from the grid. Net billing usually credits exports at a lower rate, so using your own solar power becomes more valuable than sending it out.",
        ],
        table: [
          ["Full retail net metering", "Exports are credited near the retail electricity rate."],
          ["Net billing", "Exports are credited at a lower policy-defined value."],
          ["No statewide rule", "Utility-specific terms can make payback harder to compare."],
        ],
      },
      {
        id: "why-it-matters",
        heading: "Why net metering changes solar ROI",
        body: [
          "The payback effect is simple: every exported kilowatt-hour is either a high-value bill offset or a lower-value credit. The more a system exports, the more the policy matters.",
        ],
        callout:
          "For homeowners, the key question is not just how much solar the roof can produce. It is how much of that production your home can use at full value.",
      },
      {
        id: "next-step",
        heading: "How to use net metering before getting quotes",
        body: [
          "Before comparing installers, check whether your state uses retail net metering, net billing, or utility-specific export rates. Then run a calculator scenario with a weaker export-credit factor to see whether the deal still works.",
        ],
      },
    ],
  },
  {
    slug: "when-solar-is-the-wrong-call",
    category: "Buying",
    read: 6,
    date: "2026-05-14",
    updated: "2026-05-14",
    title: "Is Solar Worth It? When Rooftop Solar Is the Wrong Call",
    subtitle:
      "Short tenure, cheap power, heavy shade, and weak export credits can make a rooftop system look better in a quote than it is in real life.",
    excerpt:
      "The honest disqualifiers a lead-generation site rarely leads with.",
    keywords: ["is solar worth it", "solar not worth it", "solar buying mistakes"],
    cta: { label: "Check your state before quotes", href: "/rankings" },
    internalLinks: [
      { label: "Worth-It rankings", href: "/rankings" },
      { label: "Solar payback calculator", href: "/calculator" },
      { label: "Net metering explainer", href: "/blog/net-metering-explained" },
    ],
    externalSources: [
      { label: "Federal Trade Commission solar guidance", href: "https://consumer.ftc.gov/" },
    ],
    sections: [
      {
        id: "short-answer",
        heading: "When solar is not worth it",
        body: [
          "Solar is often not worth it when the payback range is longer than the time you expect to stay in the home, when electricity is cheap, when the roof is shaded, or when export credits are weak.",
          "That does not mean solar is bad. It means the economics need to clear a higher bar than a sales presentation may suggest.",
        ],
      },
      {
        id: "tenure",
        heading: "Short homeowner tenure can break solar payback",
        body: [
          "If you expect to move in five years and the conservative payback range is twelve to sixteen years, the system may not recover its cost during your ownership period.",
        ],
      },
      {
        id: "cheap-power",
        heading: "Cheap electricity weakens solar savings",
        body: [
          "Solar saves money by offsetting utility power. In a low-rate state, each kilowatt-hour offset is worth less, so the same system can take longer to pay back than it would in a high-rate state.",
        ],
      },
      {
        id: "shade-policy",
        heading: "Shade and export policy are deal breakers",
        body: [
          "Heavy shade cuts production. Weak export credits cut the value of excess production. Together, they can turn an attractive gross production estimate into a marginal financial result.",
        ],
        callout:
          "A good quote should explain why your specific roof avoids these disqualifiers, not just show a best-case bill-savings chart.",
      },
    ],
  },
  {
    slug: "cheap-electricity-kills-solar-math",
    category: "Data",
    read: 8,
    date: "2026-05-07",
    updated: "2026-05-09",
    title: "Solar Payback by State: Why Cheap Electricity Hurts the Math",
    subtitle:
      "In low-rate states, every kilowatt-hour you offset is worth less. That can matter more than sunshine.",
    excerpt:
      "A data-led explanation of why great sun does not automatically mean great payback.",
    keywords: ["cheap electricity solar", "solar payback by state", "electricity rates solar ROI"],
    cta: { label: "Compare solar payback by state", href: "/rankings" },
    internalLinks: [
      { label: "State rankings", href: "/rankings" },
      { label: "Solar payback calculator", href: "/calculator" },
      { label: "Methodology", href: "/methodology" },
    ],
    externalSources: [
      { label: "U.S. EIA electricity data", href: "https://www.eia.gov/electricity/" },
      { label: "NREL PVWatts", href: "https://pvwatts.nrel.gov/" },
    ],
    sections: [
      {
        id: "short-answer",
        heading: "Solar payback by state depends on electricity value",
        body: [
          "Sunshine matters, but the value of the electricity you avoid buying often matters more. A sunny state with cheap grid power can have weaker solar economics than a cloudier state with expensive electricity.",
        ],
      },
      {
        id: "rate-effect",
        heading: "Electricity rates turn production into savings",
        body: [
          "A rooftop system produces kilowatt-hours. The local utility rate decides how many dollars those kilowatt-hours are worth. That is why rate context belongs near every solar payback number.",
        ],
      },
      {
        id: "sunbelt-paradox",
        heading: "The Sun Belt solar payback paradox",
        body: [
          "High solar production can be offset by lower utility rates or weaker export-credit policy. That is the Sun Belt paradox: the resource is excellent, but the payback is not automatically exceptional.",
        ],
        callout:
          "The best solar markets usually combine decent sun, expensive grid power, reasonable installed cost, and fair export credit.",
      },
      {
        id: "how-to-compare",
        heading: "How to compare solar payback by state",
        body: [
          "Use state rankings as a first screen, then adjust the calculator with your own electricity rate and export-credit assumptions. If the result only works in the optimistic case, treat quotes carefully.",
        ],
      },
    ],
  },
  // ?€?€?€ New pillar articles ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
  {
    slug: "federal-solar-tax-credit-30-percent",
    category: "Incentives",
    read: 8,
    date: "2026-05-14",
    updated: "2026-05-28",
    title: "Federal Solar Tax Credit: What the 30% ITC Actually Covers",
    subtitle:
      "The Inflation Reduction Act extended the residential clean energy credit at 30% through 2032. Here is what qualifies, what does not, and how it interacts with your payback.",
    excerpt:
      "The federal ITC is real and substantial, but three misunderstandings make homeowners overbuild or underclaim. We walk through the calculation, eligibility, and carry-forward rules.",
    keywords: ["federal solar tax credit", "ITC 30 percent", "residential clean energy credit", "solar tax credit 2026"],
    cta: { label: "Run payback with ITC applied", href: "/calculator" },
    internalLinks: [
      { label: "Solar payback calculator", href: "/calculator" },
      { label: "State-by-state rankings", href: "/rankings" },
      { label: "Solar payback methodology", href: "/methodology" },
    ],
    externalSources: [
      { label: "IRS Form 5695", href: "https://www.irs.gov/forms-pubs/about-form-5695" },
      { label: "IRS Energy Credits Overview", href: "https://www.irs.gov/credits-deductions/energy-efficient-home-improvement-credit" },
    ],
    directAnswer: [
      "The federal solar tax credit equals 30% of your total installed cost ??panels, inverter, racking, wiring, and labor ??and reduces what you owe in federal income tax that year.",
      "It does not reduce the cost of the system directly; it reduces your tax bill. Unused credit carries forward to future tax years.",
      "The credit is non-refundable: if your tax liability is less than 30% of system cost, the remainder rolls over rather than generating a refund.",
    ],
    sections: [
      {
        id: "short-answer",
        heading: "The 30% credit applies to the full installed cost",
        body: [
          "The residential clean energy credit ??commonly called the ITC (Investment Tax Credit) ??equals 30% of the gross installed cost of a qualifying solar system installed on your primary or secondary residence.",
          "For a $30,000 installed system, the credit is $9,000. That credit offsets your federal income tax liability dollar for dollar in the year you file. If your tax liability is only $6,000 that year, you claim $6,000 now and carry the remaining $3,000 forward to future tax years.",
        ],
      },
      {
        id: "what-qualifies",
        heading: "What counts toward the 30% basis",
        body: [
          "The credit applies to equipment and installation costs for the solar electric system. Several line items that some homeowners expect to exclude actually qualify.",
        ],
        table: [
          ["Solar panels (modules)", "Qualifies ??all panel types including monocrystalline, polycrystalline, thin-film"],
          ["Inverter and microinverters", "Qualifies ??string inverters, string + optimizer, microinverter systems"],
          ["Racking and mounting hardware", "Qualifies"],
          ["Wiring and electrical balance-of-system", "Qualifies"],
          ["Labor for installation", "Qualifies ??including permitting fees paid to the installer"],
          ["Battery storage (with solar)", "Qualifies if charged solely by the solar system"],
          ["Battery storage (standalone)", "Qualifies under IRA rules if ?? kWh capacity"],
          ["Roof work required for solar", "Partial ??only the portion directly necessary for mounting"],
        ],
      },
      {
        id: "tax-liability-requirement",
        heading: "The credit only helps if you have federal tax liability",
        body: [
          "This is the most important caveat: the ITC is a non-refundable tax credit. It reduces what you owe, but does not generate a refund if your tax bill is zero.",
          "Homeowners with modest income, large standard deductions, or other credits may find that their tax liability is less than 30% of system cost. The unused portion carries forward indefinitely under current law, but that only matters if future tax liability recovers.",
        ],
        callout:
          "Talk to a tax professional before assuming the full 30% credit is accessible in year one. The math in your payback estimate should reflect your actual projected tax liability.",
      },
      {
        id: "itc-in-payback",
        heading: "How the ITC appears in solar payback calculations",
        body: [
          "Solar Payback Map applies the 30% federal ITC to gross system cost to arrive at net cost. For a $30,000 gross installation, net cost after ITC is $21,000. That net cost is what the annual savings must recover.",
          "We do not layer in state incentives by default because they vary significantly. States like Maryland, New Jersey, and Pennsylvania add SREC (Solar Renewable Energy Credit) value on top of the ITC, while most other states do not.",
        ],
      },
      {
        id: "timeline",
        heading: "ITC rates through 2032 and beyond",
        body: [
          "Under the Inflation Reduction Act, the 30% credit applies to systems placed in service through 2032. It steps down to 26% in 2033, 22% in 2034, and is currently scheduled to expire in 2035 for residential installations. Verify current rates before signing a contract ??energy policy can change.",
        ],
        callout:
          "Solar Payback Map checks the ITC rate before significant content updates. Last confirmed: 30% current for 2026.",
      },
    ],
    faq: [
      {
        q: "Does the 30% solar tax credit apply to the full price including installation?",
        a: "Yes. The basis includes equipment, labor, wiring, racking, permits, and battery storage charged by solar. It does not include purely cosmetic roof work or the cost of a new roof beyond what is structurally required to mount panels.",
      },
      {
        q: "Can I claim the ITC if I lease my solar system?",
        a: "No. Only the system owner can claim the credit. Under a lease or PPA, the installer owns the system and claims the credit ??which is one reason lease pricing can appear attractive. If you buy outright or finance with a loan, you own the system and can claim the credit.",
      },
      {
        q: "What if my credit is more than my tax bill?",
        a: "The excess carries forward to future tax years under current IRS rules. You do not lose it, but you do need future tax liability to use it. If you expect low income for several years, the carry-forward benefit is delayed.",
      },
    ],
  },
  {
    slug: "california-nem-3-solar-payback-impact",
    category: "Policy",
    read: 10,
    date: "2026-05-07",
    updated: "2026-05-28",
    title: "California NEM 3.0: What the Net Billing Tariff Does to Solar Payback",
    subtitle:
      "California's April 2023 shift from full-retail net metering to a time-of-use net billing tariff cut daytime export values by up to 75%. The payback math changed completely.",
    excerpt:
      "NEM 3.0 is the most significant US solar policy change in a decade. Here is what changed, how it hits the numbers, and who it affects least.",
    keywords: ["california NEM 3.0", "net billing tariff", "california solar payback", "NEM 3.0 export credits"],
    cta: { label: "Compare California vs other states", href: "/rankings" },
    internalLinks: [
      { label: "State rankings", href: "/rankings" },
      { label: "Net metering explained", href: "/blog/net-metering-explained" },
      { label: "Solar payback calculator", href: "/calculator" },
    ],
    externalSources: [
      { label: "CPUC Net Billing Tariff Decision", href: "https://www.cpuc.ca.gov/nem" },
      { label: "California Energy Commission", href: "https://www.energy.ca.gov/programs-and-topics/programs/solar-equipment-lists" },
    ],
    directAnswer: [
      "California's NEM 3.0 (Net Billing Tariff), effective April 2023, replaced full-retail export credit with time-of-use export rates averaging 3??Â¢/kWh during peak daytime hours ??roughly 75% lower than retail.",
      "A solar-only system that formerly paid back in 6?? years now takes 10??4 years for export-heavy generation profiles under the new tariff.",
      "Battery storage partially restores the economics by shifting captured daytime surplus to evening peak hours where TOU rates can reach 40??5Â¢/kWh.",
    ],
    sections: [
      {
        id: "what-changed",
        heading: "What NEM 3.0 actually changed",
        body: [
          "Under NEM 1.0 and 2.0, California homeowners received a credit equal to the full retail rate for every kilowatt-hour exported to the grid. Under NEM 3.0 ??formally the Net Billing Tariff (NBT) ??export credits are set by a separate schedule that averages roughly 3??Â¢/kWh during peak solar production hours (10am??pm), compared to retail rates of 25??5Â¢/kWh.",
          "This matters because typical residential solar systems in California produce far more than a home can consume on a sunny afternoon. Under prior rules, that excess was valued at retail. Under NBT, the same excess generates a fraction of that.",
        ],
      },
      {
        id: "payback-impact",
        heading: "How NEM 3.0 extends solar payback",
        body: [
          "A 10 kW system in Los Angeles that previously exported 40% of production and received retail credits for that export saw its effective electricity value per kWh drop significantly. Annual savings that were roughly $3,000 under NEM 2.0 are now closer to $1,800??2,200 for a solar-only system, depending on usage pattern.",
        ],
        table: [
          ["Annual savings (NEM 2.0)", "~$2,800??3,200 (10kW, export-heavy)"],
          ["Annual savings (NEM 3.0, solar only)", "~$1,800??2,200 (same system)"],
          ["Effective net metering factor", "0.55??.65 (vs 1.0 under NEM 2.0)"],
          ["Payback range (NEM 2.0)", "Approx. 6?? years"],
          ["Payback range (NEM 3.0, solar only)", "Approx. 9??4 years"],
          ["Payback range (NEM 3.0, solar + battery)", "Approx. 7??1 years (depends on TOU optimization)"],
        ],
      },
      {
        id: "who-it-hits-most",
        heading: "Who NEM 3.0 hurts most ??and least",
        body: [
          "The impact is highest for homeowners who work outside the home during the day, run no significant daytime loads (EV charging, pool pump, AC), and send most solar production to the grid. These households lose the most per kWh.",
          "The impact is lowest for homeowners who work from home, charge an EV during the day, run high-consumption appliances in mid-morning, or pair solar with a battery that captures daytime surplus for evening use.",
        ],
        callout:
          "Self-consumption is the new payback lever in California. A home that consumes 80% of its solar production on-site sees far less NEM 3.0 penalty than one consuming 40%.",
      },
      {
        id: "battery-interaction",
        heading: "Why battery storage partially restores the California solar case",
        body: [
          "Battery storage reshapes the generation profile: instead of exporting surplus at low daytime rates, the battery charges during peak production and discharges during evening peak-rate hours (4pm??pm). In SDG&E and PG&E territories, evening TOU rates can reach 40??5Â¢/kWh ??substantially higher than retail average and far above the NBT export rate.",
          "A 13 kWh battery system paired with 10 kW of solar can shift 8??2 kWh of evening consumption per day away from peak grid rates in warm months. That shifts the effective export credit factor back toward 0.80??.90 compared to 0.55??.65 for solar-only.",
        ],
      },
      {
        id: "grandfathering",
        heading: "Grandfathering and new system rules",
        body: [
          "Customers who had systems approved before April 14, 2023 are on NEM 2.0 terms for 20 years. New applications after that date are under the Net Billing Tariff. Customers expanding a system by more than 10% also move to NBT terms.",
          "LADWP (Los Angeles Department of Water and Power) is a municipal utility and not under CPUC jurisdiction. LADWP retained a modified net metering structure. If you are in LADWP territory, the NEM 3.0 analysis above does not apply ??verify your utility.",
        ],
      },
    ],
    faq: [
      {
        q: "Does NEM 3.0 apply to all California homeowners?",
        a: "NEM 3.0 (Net Billing Tariff) applies to customers of the three investor-owned utilities: PG&E, SCE, and SDG&E. Municipal utilities like LADWP operate their own net metering programs and are not subject to the CPUC ruling.",
      },
      {
        q: "Should I still go solar in California under NEM 3.0?",
        a: "The answer depends on your electricity rate, self-consumption share, and whether you pair battery storage. California still has among the highest residential electricity rates in the country ($0.28??0.40+/kWh). High rates mean even reduced export value still produces meaningful savings. The case is weaker than under NEM 2.0 but not gone ??run the calculator with a net metering factor of 0.60.",
      },
      {
        q: "Is there a way to lock in NEM 2.0 rates?",
        a: "The NEM 2.0 grandfathering window closed in April 2023. New systems go on NBT. There is no current pathway to NEM 2.0 terms for new installations.",
      },
    ],
  },
  {
    slug: "solar-financing-cash-loan-lease-ppa",
    category: "Finance",
    read: 9,
    date: "2026-05-05",
    updated: "2026-05-28",
    title: "Solar Financing: Cash, Loan, Lease, and PPA ??How Each Changes the Math",
    subtitle:
      "How you pay for solar is almost as important as whether solar makes sense at all. Ownership, tax credit access, and long-term flexibility depend entirely on financing structure.",
    excerpt:
      "Four ways to finance solar, with honest payback comparisons. One structure hands the federal tax credit to the installer. Two require you to stay in your home for the numbers to work.",
    keywords: ["solar financing", "solar loan vs lease", "solar PPA", "solar cash purchase"],
    cta: { label: "Run payback for a cash purchase", href: "/calculator" },
    internalLinks: [
      { label: "Solar payback calculator", href: "/calculator" },
      { label: "Federal tax credit", href: "/blog/federal-solar-tax-credit-30-percent" },
      { label: "How to read a solar quote", href: "/blog/how-to-read-a-solar-quote" },
    ],
    externalSources: [
      { label: "LBNL Tracking the Sun", href: "https://emp.lbl.gov/tracking-the-sun" },
    ],
    directAnswer: [
      "Cash purchase gives you full ownership, access to the federal ITC, and the highest long-term return ??but requires capital upfront.",
      "A solar loan offers the same ownership and ITC access with monthly payments, though interest charges reduce net lifetime savings.",
      "A lease or PPA means the installer owns the system: you pay a monthly fee or rate, receive no ITC benefit directly, and face contractual transfer requirements if you sell your home.",
    ],
    sections: [
      {
        id: "ownership-first",
        heading: "Ownership determines who gets the federal tax credit",
        body: [
          "The 30% federal ITC goes to the system owner. Under a cash purchase or solar loan, you own the system from day one and can claim the credit. Under a lease or PPA, the installer retains ownership and claims the ITC ??which helps them offer lower rates, but means you do not receive the credit directly.",
          "On a $30,000 system, the ITC is worth $9,000. Whether that value flows to you or to the installer's financing model is the single largest dollar difference between ownership and non-ownership structures.",
        ],
      },
      {
        id: "comparison",
        heading: "Side-by-side: cash, loan, lease, PPA",
        body: [
          "Each structure has a different upfront cost, monthly cash flow, long-term return profile, and resale implication.",
        ],
        table: [
          ["Structure", "Cash", "Solar Loan", "Lease", "PPA"],
          ["You own the system?", "Yes", "Yes (once paid)", "No", "No"],
          ["Federal ITC", "You claim it", "You claim it", "Installer claims it", "Installer claims it"],
          ["Upfront cost", "Full system cost", "Low or $0 down", "$0 down", "$0 down"],
          ["Monthly payment", "None (after purchase)", "Loan payment", "Fixed monthly fee", "Per-kWh rate"],
          ["Long-term ROI", "Highest", "Moderate (minus interest)", "Lowest", "Low"],
          ["Resale flexibility", "Adds home value", "Can transfer loan", "Lease transfer required", "PPA transfer required"],
        ],
      },
      {
        id: "solar-loans",
        heading: "Solar loans: the most common path to ownership",
        body: [
          "Solar loans allow homeowners to finance a system with $0 down while retaining ownership and the ability to claim the ITC. The loan is repaid over 10??5 years at rates that vary significantly by lender, credit score, and whether the loan is secured or unsecured.",
          "Many solar loans include a 'dealer fee' that the installer pays to the lender ??this fee is typically 15??5% of the loan amount and is baked into the financed price, not always disclosed explicitly. A $25,000 cash price may become a $29,000??31,000 loan amount. Ask your installer to quote both the cash price and the financed amount separately.",
        ],
        callout:
          "Solar Payback Map red flag: if the financed amount is more than 20% higher than the cash price, ask specifically what dealer fee is included.",
      },
      {
        id: "lease-ppa",
        heading: "Leases and PPAs: lower risk, lower return",
        body: [
          "Leases charge a fixed monthly fee for use of the system. PPAs (Power Purchase Agreements) charge a per-kWh rate for power the system produces ??often below your current utility rate at the time of signing, with annual escalators of 1??% per year.",
          "Both structures eliminate maintenance risk (the installer handles panels and inverters) and require no upfront capital. In exchange, you lose direct access to the ITC and gain a contractual obligation that must be managed if you sell your home.",
        ],
      },
      {
        id: "home-sale",
        heading: "What happens when you sell your home",
        body: [
          "A paid-off owned system transfers with the home and may add to appraisal value. A solar loan can sometimes be paid off from sale proceeds or transferred to the buyer ??terms vary. A lease or PPA must be either assumed by the buyer (who must qualify) or prepaid by the seller, sometimes at a significant cost.",
          "In competitive real estate markets, a leased or PPA system that cannot be easily transferred can become a negotiating obstacle. This is less common in states where solar is already widespread.",
        ],
      },
    ],
    faq: [
      {
        q: "Is a $0-down solar loan actually free?",
        a: "No. The loan carries interest, and many loans have dealer fees rolled into the principal. The cost is paid over the loan term rather than upfront. Read the total loan amount, interest rate, and any prepayment penalties before signing.",
      },
      {
        q: "Can I switch from a lease to ownership later?",
        a: "Some lease contracts include a buyout option at certain anniversaries (often year 5, 10, or the end of the term). The buyout price can vary significantly. Check your lease contract for buyout terms before signing, especially if you think you might want to own the system eventually.",
      },
    ],
  },
  {
    slug: "how-to-read-a-solar-quote",
    category: "Buying",
    read: 8,
    date: "2026-05-03",
    updated: "2026-05-28",
    title: "How to Read a Solar Quote: What to Check Before You Sign",
    subtitle:
      "A solar proposal contains eight to twelve line items that most homeowners skip. Three of them are the ones that get people into trouble.",
    excerpt:
      "What every solar quote should include, what common omissions mean, and the three assumptions that make the biggest difference in whether the payback is real.",
    keywords: ["how to read solar quote", "solar proposal review", "solar quote checklist", "solar quote red flags"],
    cta: { label: "Check your quote assumptions in the calculator", href: "/calculator" },
    internalLinks: [
      { label: "Solar payback calculator", href: "/calculator" },
      { label: "Solar financing options", href: "/blog/solar-financing-cash-loan-lease-ppa" },
      { label: "Federal tax credit", href: "/blog/federal-solar-tax-credit-30-percent" },
    ],
    externalSources: [
      { label: "FTC Solar Panel Guidance", href: "https://consumer.ftc.gov/articles/solar-energy" },
      { label: "NREL PVWatts", href: "https://pvwatts.nrel.gov/" },
    ],
    directAnswer: [
      "A solar quote should clearly state system size in kW-DC, panel and inverter manufacturer and model, estimated annual production in kWh, gross price, itemized federal ITC calculation, and production guarantee.",
      "If any of those are missing, ask for them explicitly before comparing proposals from different installers.",
      "The three inputs that most change payback math are the production estimate, the electricity rate assumed, and the net price after any financing dealer fees.",
    ],
    sections: [
      {
        id: "short-answer",
        heading: "Three numbers decide most of the payback argument",
        body: [
          "Most solar disputes and buyer regrets trace back to three numbers: estimated annual production (kWh), effective electricity rate used in savings calculations, and the net price after credits and dealer fees.",
          "Everything else in a quote ??panel brand, inverter type, warranty length ??matters less than whether these three are accurate and verifiable.",
        ],
      },
      {
        id: "what-should-be-there",
        heading: "What a complete solar quote should include",
        body: [
          "A professional solar proposal should answer every one of these questions without you having to ask.",
        ],
        bullets: [
          "System size: kW-DC and kW-AC separately, along with total panel count and individual panel wattage.",
          "Equipment: exact manufacturer and model for panels and inverter. Not 'tier-1 panels' ??actual model numbers.",
          "Production estimate: kWh/year, the source of that estimate (PVWatts address or satellite shade), and what losses are assumed.",
          "Gross price and cash price separately from financed price. If financed, the full loan amount and interest rate.",
          "Federal ITC calculation: which amount the 30% applies to, and confirmation that you (not the installer) will claim it.",
          "Production guarantee: what happens if the system produces less than the estimate.",
          "Interconnection timeline: utility interconnection is often the longest delay after installation.",
        ],
      },
      {
        id: "production-assumption",
        heading: "The production estimate is where most quotes go optimistic",
        body: [
          "Installers generate production estimates from software like PVWatts, Aurora, or Helioscope. The accuracy depends heavily on how shade is modeled. A tree that blocks 15% of production in July looks different in satellite imagery versus an on-site shade analysis.",
          "Run the installer's estimated annual production through PVWatts yourself: enter your address, system size, and the same losses figure (typically 10??4%). If the installer's number is more than 10% above PVWatts output at default settings, ask why.",
        ],
        callout:
          "Solar Payback Map rule: use the installer's production estimate in your payback, then re-run the calculator at 85% of that number. If the payback still works, the proposal has a reasonable margin.",
      },
      {
        id: "electricity-rate",
        heading: "Verify the electricity rate assumption",
        body: [
          "Solar proposals calculate savings using an assumed electricity rate. If that rate is your current bill average rather than your marginal rate (the rate on the next kWh you would have used), the savings figure overstates the value.",
          "Many bills have tiered pricing: the first 400??00 kWh is cheaper, the next block is more expensive. Solar offsets your most expensive consumption first. That can mean your effective rate for solar savings purposes is higher than your average rate ??but only by a controlled amount.",
          "Check what rate the proposal uses. If it shows 'annual rate escalation of 3.5%', that assumption is driving a significant portion of 25-year savings. A 2% escalation instead of 3.5% can shift the 25-year net savings by 20??0%.",
        ],
      },
      {
        id: "net-price",
        heading: "Net price: what you actually pay",
        body: [
          "The gross price minus the federal ITC is the net cost your payback must recover. For a financed system, the net cost also includes interest ??a $21,000 loan at 6.99% over 20 years costs about $19,000 in interest, nearly doubling the net cost of a $30,000 system.",
          "Ask every installer for: gross price, cash price, financed price (if relevant), and what dealer fee is built in to the financed price. Comparing only the 'net cost after ITC' on financed proposals misses the financing cost layer.",
        ],
      },
    ],
    faq: [
      {
        q: "How many solar quotes should I get?",
        a: "At least three, ideally from installers with at least five years of local installation history. Price variance between installers for the same system size can be 15??5%. Get quotes from both national and regional installers if possible.",
      },
      {
        q: "What does a production guarantee actually mean?",
        a: "Production guarantees vary. Some promise a specific kWh/year and compensate you if production falls short (cash payment or credits). Others guarantee the equipment will produce 'to spec' but put the burden of proof on you. Read the guarantee terms: what triggers a claim, what the compensation mechanism is, and how long it runs.",
      },
      {
        q: "Is it a red flag if an installer won't give me a PVWatts comparison?",
        a: "It is worth noting. Most legitimate installers will walk you through their production modeling on request. Reluctance to show the model inputs usually means the estimate uses optimistic shading or loss assumptions.",
      },
    ],
  },
  {
    slug: "solar-panel-degradation-25-year-reality",
    category: "Data",
    read: 7,
    date: "2026-05-10",
    updated: "2026-05-28",
    title: "Solar Panel Degradation: What Actually Happens Over 25 Years",
    subtitle:
      "Modern panels degrade about 0.5% per year. After 25 years, that adds up to roughly 12% lower output than year one. The payback math should reflect it.",
    excerpt:
      "Degradation is real and measurable. We walk through the numbers, explain the year-1 LID dip, compare manufacturer warranties, and show how much it changes the long-run savings estimate.",
    keywords: ["solar panel degradation", "solar panel lifespan", "panel degradation rate", "25-year solar output"],
    cta: { label: "See how degradation affects your payback", href: "/calculator" },
    internalLinks: [
      { label: "Solar payback calculator", href: "/calculator" },
      { label: "Solar payback methodology", href: "/methodology" },
      { label: "How we estimate solar payback", href: "/blog/how-we-estimate-solar-payback" },
    ],
    externalSources: [
      { label: "NREL Panel Degradation Research", href: "https://www.nrel.gov/docs/fy12osti/51664.pdf" },
      { label: "Lawrence Berkeley National Lab PV Research", href: "https://emp.lbl.gov/" },
    ],
    directAnswer: [
      "Modern monocrystalline solar panels degrade at roughly 0.4??.7% per year after an initial year-1 LID (light-induced degradation) drop of 1??%.",
      "After 25 years, a panel rated at 400W typically outputs around 340??60W ??about 85??0% of original nameplate capacity.",
      "Most leading manufacturers warrant 80??7% output at year 25. Solar Payback Map models degradation at 0.5%/yr, consistent with NREL median research.",
    ],
    sections: [
      {
        id: "short-answer",
        heading: "Panels get slightly less productive every year",
        body: [
          "Solar panel degradation is the gradual reduction in output caused by UV exposure, thermal cycling, humidity ingress, and chemical changes in the silicon. It is measurable, predictable, and already factored into manufacturer warranties.",
          "The industry median is approximately 0.5% efficiency loss per year. That means a panel producing 1,000 kWh in year one produces about 995 kWh in year two, 990 kWh in year three, and about 880 kWh in year 25. It is not dramatic ??but it is real, and it belongs in any honest 25-year savings estimate.",
        ],
      },
      {
        id: "year-one-lid",
        heading: "Year-one LID: the first-year performance dip",
        body: [
          "Light-induced degradation (LID) is a different phenomenon from long-term wear. It happens in the first several hours to days of sun exposure as boron-oxygen defects form in crystalline silicon cells.",
          "LID typically causes a 1??% output reduction in year one alone. High-quality panels are pre-tested or use LID-resistant cell technology (n-type TOPCon, HJT). Budget monocrystalline panels may experience higher LID. After the initial LID, the degradation rate stabilizes to the long-term 0.4??.7%/yr trajectory.",
        ],
      },
      {
        id: "warranty-types",
        heading: "Power warranty vs product warranty: two different guarantees",
        body: [
          "Panels come with two warranties. The product warranty (10??5 years, sometimes 25 years) covers manufacturing defects and physical failure. The power warranty guarantees minimum output at specific time points.",
        ],
        table: [
          ["Manufacturer tier", "Year-1 minimum", "Year-25 minimum", "Degradation rate implied"],
          ["Budget (polycrystalline)", "97.5%", "80%", "~0.7%/yr"],
          ["Mid-range mono", "98.0%", "83%", "~0.6%/yr"],
          ["Premium (mono/TOPCon)", "98.0%", "86??8%", "~0.45%/yr"],
          ["Solar Payback Map model assumption", "-", "88%", "0.5%/yr"],
        ],
      },
      {
        id: "impact-on-payback",
        heading: "How much degradation changes the 25-year savings estimate",
        body: [
          "At 0.5%/yr, a 10 kW system producing 10,000 kWh/year initially produces about 231,000 kWh over 25 years ??versus 250,000 kWh at no degradation. That 7.6% production reduction translates directly to 7.6% lower 25-year savings.",
          "On a $21,000 net cost system saving $2,500/year in year one, the undegraded 25-year estimate is about $41,500 net. With realistic 0.5% degradation modeled, it comes to about $38,000 net ??a $3,500 difference that optimistic installers often omit.",
        ],
        callout:
          "If a solar proposal shows 25-year savings calculated at a flat annual rate (no degradation applied), the number is optimistic by roughly 7??%.",
      },
      {
        id: "failure-vs-degradation",
        heading: "Degradation is not failure",
        body: [
          "A panel degrading at 0.5%/yr is working correctly. It is not failing. Actual failure ??cracking, delamination, junction box issues ??is what the product warranty covers and is less predictable.",
          "Degradation projections assume a working panel. A panel that fails outright before year 25 is a warranty claim, not a degradation event. Installers with strong product warranties and responsive service teams matter more for this risk than the panel brand alone.",
        ],
      },
    ],
    faq: [
      {
        q: "Do all solar panels degrade at the same rate?",
        a: "No. Panel technology and quality affect degradation rate. N-type cells (TOPCon, HJT, IBC) generally degrade slower (0.3??.45%/yr) than standard p-type mono panels (0.5??.7%/yr). Polycrystalline panels are generally on the higher end. Premium manufacturers publish independent third-party degradation test data ??ask for it if it matters to your decision.",
      },
      {
        q: "Should I oversizing my system to account for degradation?",
        a: "Sometimes. If your utility allows a net metering credit for excess production, oversizing slightly (10??5%) can offset year-25 output reduction. However, oversizing increases upfront cost and may exceed interconnection limits in some utility territories. Run the numbers in the calculator before assuming oversizing is worth it.",
      },
    ],
  },
  {
    slug: "electricity-rate-inflation-solar-roi",
    category: "Rates",
    read: 7,
    date: "2026-05-12",
    updated: "2026-05-28",
    title: "Electricity Rate Inflation and Solar ROI: What the Trend Actually Shows",
    subtitle:
      "Solar proposals often bake in 3??% annual rate escalation. The EIA historical average is closer to 2.3%. That gap moves the 25-year savings figure by 20??0%.",
    excerpt:
      "Rate escalation is real. The disagreement is how fast. We look at EIA historical data, explain the difference between nominal and real rate increases, and show how the assumption changes payback math.",
    keywords: ["electricity rate inflation", "solar ROI rate escalation", "electricity rates over time", "solar savings projection"],
    cta: { label: "Test your payback with conservative rate assumptions", href: "/calculator" },
    internalLinks: [
      { label: "Solar payback calculator", href: "/calculator" },
      { label: "State rankings", href: "/rankings" },
      { label: "Cheap electricity kills solar math", href: "/blog/cheap-electricity-kills-solar-math" },
    ],
    externalSources: [
      { label: "EIA Annual Energy Review", href: "https://www.eia.gov/totalenergy/" },
      { label: "EIA Electricity Data Browser", href: "https://www.eia.gov/electricity/data/browser/" },
    ],
    directAnswer:
      "U.S. average residential electricity rates have increased at roughly 2.1??.5% per year in nominal terms over the past 20 years (EIA data). Solar proposals often use 3??% escalation to project 25-year savings. At 3% escalation vs 2.3%, a 25-year savings estimate for a typical system increases by 15??0%. The difference is real but the direction is right: rates generally rise. Solar Payback Map uses 0% rate escalation for base payback and shows the upside scenario separately.",
    sections: [
      {
        id: "short-answer",
        heading: "Electricity rates rise ??slowly, inconsistently, and differently by state",
        body: [
          "From 2003 to 2023, the national average residential electricity rate rose from about 8.7Â¢/kWh to 16.2Â¢/kWh (EIA). That is a 2.9% compound annual growth rate ??but not every state follows the national average, and the trajectory has had multi-year flat periods and sharp spike years.",
          "Solar proposals that use 3.5% or 5% annual escalation are not lying ??rates probably will be higher in 25 years. But the assumption inflates the savings projection meaningfully, and homeowners should know how sensitive the number is to that assumption.",
        ],
      },
      {
        id: "historical",
        heading: "What EIA historical data actually shows",
        body: [
          "EIA publishes monthly average retail electricity prices by sector and state. Looking at residential rates over the past 20 years nationally: the 2003??023 compound annual growth rate is approximately 2.9% nominal. Adjust for CPI inflation and the real rate increase is closer to 0.3??.5%/yr. In real dollars, electricity has barely gotten more expensive.",
        ],
        table: [
          ["Period", "Nominal rate increase (CAGR)"],
          ["2003??013", "~3.4%/yr"],
          ["2013??019", "~0.8%/yr (near-flat)"],
          ["2020??023", "~5.2%/yr (inflation spike)"],
          ["2003??023 average", "~2.9%/yr"],
        ],
      },
      {
        id: "state-variance",
        heading: "State variance makes the national average misleading",
        body: [
          "California's residential rates have grown faster than the national average, driven by utility infrastructure charges, wildfire liability costs, and grid upgrade investments. Pacific Gas & Electric rates increased roughly 60% from 2018 to 2023 alone ??that is an outlier, not a national baseline.",
          "States like Texas and states with regulated coal-heavy utilities saw flat or minimal rate growth through 2022. If you are in a historically low-rate state, projecting 3??% annual increases in your solar payback model is optimistic.",
        ],
        callout:
          "The honest approach: run your payback with 0% rate escalation (conservative) and show 2??% escalation as an upside scenario. If the conservative case still shows acceptable payback, the rate escalation assumption is icing, not cake.",
      },
      {
        id: "impact-on-25yr",
        heading: "How the escalation rate changes 25-year savings",
        body: [
          "For a system saving $2,000/year in year one, the cumulative savings over 25 years at different escalation rates:",
        ],
        table: [
          ["Annual rate escalation", "25-year cumulative savings"],
          ["0% (no increase)", "$50,000"],
          ["2% escalation", "$64,200"],
          ["3% escalation", "$72,900"],
          ["4% escalation", "$83,300"],
          ["5% escalation", "$95,400"],
        ],
      },
      {
        id: "rate-caps",
        heading: "Rate caps, restructuring, and deregulated markets",
        body: [
          "Regulated utility markets have rate caps requiring Public Utility Commission approval for increases. Deregulated markets (parts of Texas, Illinois, Ohio) have market-rate electricity where prices can move more sharply in either direction. If you are on a variable-rate plan, the rate escalation assumption in a solar proposal has extra uncertainty.",
          "Community solar and fixed-rate utility plans add another layer: if you lock in a rate, your escalation exposure is reduced, which also reduces the option value of solar production.",
        ],
      },
    ],
    faq: [
      {
        q: "Should I assume electricity rates will keep rising?",
        a: "Probably yes, but not at the rates solar installers often project. The national trend is upward. Individual states vary significantly. The safest approach is to run your payback with today's rate (0% escalation) and treat rate increases as optionality ??if rates rise faster, solar ROI improves. Do not count on 4??% annual increases to make a marginal payback work.",
      },
      {
        q: "My solar proposal shows 30-year savings ??is 30 years realistic?",
        a: "It is more speculative than 25 years. Most standard panel warranties cover 25 years. Inverters typically need replacement at 10??5 years. Projecting out to 30 years adds uncertainty without much corresponding warranty protection. Solar Payback Map uses 25 years as the modeling horizon and treats years 26??0 as an upside scenario.",
      },
    ],
  },
  {
    slug: "solar-battery-storage-when-it-changes-math",
    category: "Battery",
    read: 9,
    date: "2026-05-15",
    updated: "2026-05-28",
    title: "Solar Battery Storage: When It Actually Changes the Payback Math",
    subtitle:
      "A battery adds $10,000??18,000 to system cost. In most US markets, that extends payback rather than shortening it ??with three specific exceptions.",
    excerpt:
      "Battery storage is not a universal payback enhancer. We run the numbers on three scenarios where battery actually improves the case: California NEM 3.0, TOU peak shaving, and backup power valuation.",
    keywords: ["solar battery storage payback", "home battery ROI", "solar plus battery", "Tesla Powerwall payback"],
    cta: { label: "Run solar-only vs solar+battery payback", href: "/calculator" },
    internalLinks: [
      { label: "California NEM 3.0 impact", href: "/blog/california-nem-3-solar-payback-impact" },
      { label: "Solar payback calculator", href: "/calculator" },
      { label: "Solar financing options", href: "/blog/solar-financing-cash-loan-lease-ppa" },
    ],
    externalSources: [
      { label: "LBNL Behind the Meter Storage Tracking", href: "https://emp.lbl.gov/tracking-the-sun" },
    ],
    directAnswer:
      "A home battery system (10??5 kWh) added to solar costs $10,000??18,000 installed after the 30% federal ITC. In most US utility territories with simple net metering, a battery extends payback because the solar-only economics are already reasonable and the battery adds cost without proportional savings. Battery economics are strongest in three scenarios: California NEM 3.0 / Net Billing Tariff (where daytime export is nearly worthless), utilities with high TOU peak rates (evening premiums above 40Â¢/kWh), and homeowners who heavily value backup power during outages.",
    sections: [
      {
        id: "short-answer",
        heading: "Batteries rarely improve payback ??they change what payback measures",
        body: [
          "A solar system's payback period is measured in financial terms: years to recover net cost from bill savings. A battery extends the payback period in most markets because it adds cost without a proportional increase in electricity savings.",
          "This does not mean batteries are bad decisions. Backup power during outages has real value that financial ROI does not capture. The key is being honest about whether you are buying an economic investment or a resilience product.",
        ],
      },
      {
        id: "three-scenarios",
        heading: "Three scenarios where battery actually improves the financial case",
        body: [
          "Outside these scenarios, battery addition is primarily a resilience purchase, not a payback optimizer.",
        ],
        bullets: [
          "California NEM 3.0 / Net Billing Tariff: Daytime solar export earns 3??Â¢/kWh. Evening TOU peak rates can reach 40??5Â¢/kWh in PG&E and SDG&E territory. A battery that captures daytime surplus and discharges in the 4pm??pm peak window can shift 8??2 kWh/day in summer months, recovering the value that NEM 3.0 removed.",
          "High TOU peak rates (40Â¢+/kWh evening): If your utility charges a sharp evening premium ??common in states moving toward time-of-use pricing ??a battery can arbitrage the peak. This works regardless of net metering policy, but requires a TOU plan, not a flat-rate plan.",
          "High-frequency outage areas: If you experience more than 8 hours of outages per year and value that backup, a rough calculation: assume $50??100/hour value for backup power (food spoilage, medical equipment, work-from-home productivity). At 8 hours/year, that is $400??800/yr in avoided loss ??not enough to justify a $15,000 battery on its own, but meaningful as a combined value calculation.",
        ],
      },
      {
        id: "nem-2-territory",
        heading: "In full net-metering states, battery payback is usually marginal",
        body: [
          "If your utility offers full retail net metering (equal credit for every kWh exported), a battery cannot improve on that: you are already getting maximum value for your exported solar. Adding a battery in this context is purely a resilience purchase.",
          "States like Massachusetts, New York, New Jersey, Colorado, and most of the Northeast currently offer full retail net metering. Installers who project meaningful financial returns from battery addition in these markets are either modeling backup-power value or using optimistic assumptions.",
        ],
        callout:
          "Battery financial ROI and backup resilience value are different products. Be clear which one you are buying before signing a battery contract.",
      },
      {
        id: "cost",
        heading: "What a battery system actually costs in 2025??026",
        body: [
          "A single 13.5 kWh battery (such as a Tesla Powerwall 3 or Enphase IQ Battery 10T) installed with solar runs approximately $12,000??18,000 gross, or $8,400??12,600 after the 30% ITC. Two batteries (for whole-home backup on larger houses) can run $18,000??28,000 gross.",
          "Standalone battery additions to an existing solar system cost slightly more per unit than solar-plus-battery packages, because mobilization cost is spread over a smaller job.",
        ],
        table: [
          ["Battery configuration", "Gross installed cost", "After 30% ITC"],
          ["Single 13??4 kWh battery", "$12,000??18,000", "$8,400??12,600"],
          ["Two-battery stack (27 kWh)", "$22,000??32,000", "$15,400??22,400"],
          ["Standalone addition to existing solar", "$14,000??20,000", "$9,800??14,000"],
        ],
      },
      {
        id: "total-system",
        heading: "Solar + battery as a total system",
        body: [
          "When battery is added to solar at point of installation, the combined system cost typically runs $38,000??55,000 gross for a 10 kW system with one battery ??or $26,600??38,500 after ITC.",
          "A combined system payback of 10??4 years in a full net-metering state is common. In California with NEM 3.0 and battery optimization, the same system can run 9??3 years, making the addition of battery more justifiable financially.",
        ],
      },
    ],
    faq: [
      {
        q: "Does adding a battery change my solar panel system size?",
        a: "Sometimes. A battery needs to be charged, and charging from solar rather than the grid is both cheaper and the condition for the battery to qualify for the 30% ITC. Installers may recommend a slightly larger solar system to ensure reliable battery charging. In low-production months (winter), undersizing solar relative to battery means the battery charges from the grid ??which changes the economics and the tax credit qualification.",
      },
      {
        q: "How long do home batteries last?",
        a: "Most battery warranties cover 10 years or a specified number of cycles. Degradation at 10 years is typically 20??0% capacity loss (e.g., a 13.5 kWh battery holds 9.5??1 kWh). Unlike solar panels, batteries do not last 25+ years without replacement under current technology. Factor one battery replacement cycle into a full 25-year analysis.",
      },
    ],
  },
  {
    slug: "roof-constraints-solar-payback",
    category: "Roof",
    read: 7,
    date: "2026-05-17",
    updated: "2026-05-28",
    title: "Roof Constraints and Solar Payback: Shade, Orientation, and Age",
    subtitle:
      "A south-facing unshaded roof is not the only roof that works for solar. But shade, orientation, and structural condition each hit production in ways that make conservative quotes matter more.",
    excerpt:
      "The three roof factors that separate a great solar site from a marginal one ??and why a site-specific shade analysis beats an average production estimate every time.",
    keywords: ["roof orientation solar", "solar panel shading", "solar roof requirements", "east west solar panels"],
    cta: { label: "Check how orientation affects payback", href: "/calculator" },
    internalLinks: [
      { label: "How to read a solar quote", href: "/blog/how-to-read-a-solar-quote" },
      { label: "Solar payback calculator", href: "/calculator" },
      { label: "When solar is the wrong call", href: "/blog/when-solar-is-the-wrong-call" },
    ],
    externalSources: [
      { label: "NREL PVWatts orientation tool", href: "https://pvwatts.nrel.gov/" },
      { label: "NREL Shade Impact Study", href: "https://www.nrel.gov/docs/fy12osti/54528.pdf" },
    ],
    directAnswer:
      "South-facing roof at 15??0Â° tilt produces maximum annual output. East or west-facing roofs produce 10??0% less annually but can be preferred in TOU rate structures where morning or afternoon production is more valuable. Shading is the most impactful variable: a single shaded panel can reduce the output of an entire string inverter circuit by 50??0% during shade hours. Roofs needing replacement within 5?? years should typically be replaced before solar installation to avoid panel removal costs.",
    sections: [
      {
        id: "orientation",
        heading: "Roof orientation: south is best, east and west are viable",
        body: [
          "A south-facing roof at 30Â° tilt produces the most annual energy at most US latitudes. PVWatts models this as the reference case. East and west-facing roofs produce 10??0% less annually, but they spread production more evenly across morning and afternoon hours rather than concentrating it at solar noon.",
          "In utilities with time-of-use pricing, a west-facing array can actually be more valuable per kWh than a south-facing one: it generates in late afternoon when peak TOU rates apply. If you are on a flat rate plan, south is still optimal.",
        ],
        table: [
          ["Orientation", "Annual production vs south-facing"],
          ["South (180Â°)", "100% ??reference case"],
          ["Southwest (225Â°)", "96??8%"],
          ["Southeast (135Â°)", "95??7%"],
          ["West (270Â°)", "82??0%"],
          ["East (90Â°)", "81??8%"],
          ["North (flat roofs only, tilted)", "60??5%"],
        ],
      },
      {
        id: "shading",
        heading: "Shading: the biggest production variable",
        body: [
          "Shade from trees, chimneys, dormers, or neighboring structures affects solar production in two ways. First, shaded panels produce less power directly. Second, with string inverter systems, a shaded panel drags down the output of every panel connected to the same string ??sometimes reducing whole-string output by 50??0% during the shade event.",
          "Microinverters and power optimizers (panel-level electronics) largely eliminate the string effect: each panel operates independently, so a shaded panel affects only its own output.",
        ],
        callout:
          "A system sized for full sun on a shaded roof is not a good deal. Ask specifically how much of the roof area is shaded between 9am and 3pm in summer months, and whether the design uses panel-level electronics to handle it.",
      },
      {
        id: "shade-tools",
        heading: "How shade analysis should be done",
        body: [
          "Professional shade analysis uses either a device like the Solmetric SunEye (physically measures shade on the roof) or shading software like Aurora or Helioscope, which models shade from satellite and LiDAR data.",
          "Satellite-based shade models are faster and less expensive, but can miss seasonal shade from deciduous trees, new construction, or obstructions that do not appear clearly in imagery. An in-person roof assessment is more accurate for shade-sensitive sites.",
        ],
        bullets: [
          "Ask the installer: what shade analysis tool did you use?",
          "Ask: did the analysis include winter sun angles, or only summer peak production?",
          "Ask: are any panels placed under known shade paths? If yes, does the design use panel-level electronics?",
          "Self-check with PVWatts: enter your address and check the 'shading' input ??it lets you manually model shade fractions by month.",
        ],
      },
      {
        id: "roof-age",
        heading: "Roof age and structural condition",
        body: [
          "Solar panels are warrantied for 25 years. If your roof is 15+ years old and made of asphalt shingles with an expected lifespan of 20??5 years, the roof may need replacement while panels are installed ??triggering a $5,000??15,000 panel removal and reinstallation cost.",
          "Reroofing after solar installation is not impossible, but it adds cost and complexity. Most solar installers recommend replacing an aging roof before installation, particularly if the roof is within 7 years of expected end-of-life.",
        ],
      },
      {
        id: "not-viable",
        heading: "When roof constraints make solar not viable",
        body: [
          "North-facing roofs in the northern US (above 35Â° latitude) are rarely economically viable ??production is too low. Heavy year-round shading from mature trees or nearby buildings can reduce production enough that payback periods exceed 20 years on a realistic basis.",
          "Flat commercial-style roofs on residential buildings are workable with tilted racking, but add cost and sometimes require structural assessment. Very complex roofs with many small planes are harder to design efficiently.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I put solar on an east-west roof with no south exposure?",
        a: "Yes, many systems use both east and west faces of a ridge roof. Each face gets half the system and produces at different times of day. The combined annual output is roughly 85??0% of a same-size south-facing system. In TOU rate markets, the morning east-array production and afternoon west-array production can align well with peak rates.",
      },
      {
        q: "How much does shading actually reduce solar production?",
        a: "It depends on the system design. With string inverters, a single panel at 50% shade during peak hours can reduce the output of 4?? connected panels proportionally during that window. With panel-level electronics (microinverters or power optimizers), the same shading affects only the single panel. In heavily shaded sites without panel-level electronics, annual production losses of 20??0% are not uncommon.",
      },
    ],
  },
];

export const posts = [...legacyPosts, ...plannedPosts];

export function isPublished(post, now = new Date()) {
  if (!post.publishAt) return true;
  return post.status === "ready" && new Date(post.publishAt) <= now;
}

export function getPublishedPosts(now = new Date()) {
  return posts.filter((post) => isPublished(post, now));
}

export function getPublishedCategories(now = new Date()) {
  return Array.from(new Set(getPublishedPosts(now).map((post) => post.category))).sort();
}

export function getPublishedPostsByCategory(category, now = new Date()) {
  return getPublishedPosts(now).filter((post) => post.category === category);
}

export function getPlannedPosts() {
  return plannedPosts;
}

export function getPost(slug) {
  return posts.find((post) => post.slug === slug);
}

export function getPublishedPost(slug, now = new Date()) {
  const post = getPost(slug);
  return post && isPublished(post, now) ? post : undefined;
}
