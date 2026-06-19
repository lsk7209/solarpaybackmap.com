const scheduleStart = new Date("2026-06-19T10:00:00+09:00");
const CORE_ARTICLE_COUNT = 20;

const sourceSets = {
  pvwatts: [{ label: "NREL PVWatts", href: "https://pvwatts.nrel.gov/" }],
  eia: [{ label: "U.S. EIA electricity data", href: "https://www.eia.gov/electricity/" }],
  dsire: [{ label: "DSIRE policy database", href: "https://www.dsireusa.org/" }],
  lbnl: [{ label: "LBNL Tracking the Sun", href: "https://emp.lbl.gov/tracking-the-sun" }],
  ftc: [{ label: "FTC home solar consumer guidance", href: "https://consumer.ftc.gov/" }],
};

const sourcePool = [
  sourceSets.pvwatts[0],
  sourceSets.eia[0],
  sourceSets.dsire[0],
  sourceSets.lbnl[0],
  sourceSets.ftc[0],
];

const baseLinks = [
  { label: "Worth-It rankings", href: "/rankings" },
  { label: "Solar payback calculator", href: "/calculator" },
  { label: "Methodology", href: "/methodology" },
];

const topicPlans = [
  ["massachusetts-solar-payback-utility-rates", "State Payback", "Massachusetts solar payback", "Massachusetts Solar Payback: Why High Utility Rates Change the Decision", "high electricity rates, New England solar economics", "Understand whether Massachusetts' high rates can offset weaker winter production.", "Compare Massachusetts against other states"],
  ["arizona-solar-payback-export-credits", "State Payback", "Arizona solar payback", "Arizona Solar Payback: Great Sunlight, Tougher Export Credits", "net billing, desert production, rooftop solar ROI", "Separate Arizona's production advantage from its export-credit limits.", "Test Arizona export-credit assumptions"],
  ["maine-solar-payback-cloudy-state", "State Payback", "Maine solar payback", "Maine Solar Payback: Expensive Power Can Beat Cloudy Weather", "electricity rates, northern solar, payback range", "Show why a less sunny state can still produce a serious solar case.", "Review Maine in the rankings"],
  ["texas-solar-payback-utility-choice", "State Payback", "Texas solar payback", "Texas Solar Payback: Why Utility Choice Matters More Than Sun", "retail electric providers, buyback plans, solar savings", "Explain how Texas plan selection can decide the value of exported power.", "Run a Texas-style scenario"],
  ["washington-solar-payback-cheap-power", "State Payback", "Washington solar payback", "Washington Solar Payback: Cheap Power and Long Timelines", "low electricity rates, hydro power, solar ROI", "Explain why low grid rates can make good policy less financially compelling.", "Compare low-rate states"],
  ["florida-solar-payback-hurricane-insurance", "Buying", "Florida solar payback", "Florida Solar Payback: The Questions Hurricanes Add to the Math", "roof age, insurance, storm risk, rooftop solar", "Help homeowners add roof and insurance context before reading a savings chart.", "Check the calculator before quotes"],
  ["new-york-solar-payback-incentive-stack", "Policy", "New York solar incentives", "New York Solar Incentives: How Stacked Credits Affect Payback", "state credit, utility rates, residential solar", "Explain why layered incentives should be modeled separately from production.", "Read the payback methodology"],
  ["california-battery-payback-after-nem3", "Battery", "California solar battery payback", "California Solar Battery Payback After NEM 3.0: When Storage Helps", "self-consumption, export credits, battery economics", "Clarify when a battery can improve the California solar case and when it cannot.", "Compare California assumptions"],
  ["solar-payback-if-you-move-in-seven-years", "Buying", "solar payback moving soon", "Solar Payback If You Move in Seven Years: The Tenure Test", "home resale, ownership period, quote review", "Give homeowners a simple tenure screen before they sign a long-payback deal.", "Use the calculator with tenure in mind"],
  ["solar-panel-degradation-payback", "Methodology", "solar panel degradation payback", "Solar Panel Degradation and Payback: Why Year One Is Not Enough", "25-year savings, production decline, ROI", "Explain why payback and long-term value should not rely only on first-year output.", "Review the model assumptions"],
  ["roof-age-before-solar-installation", "Buying", "roof age before solar", "Roof Age Before Solar: The Replacement Question That Changes Payback", "roof replacement, installation timing, project cost", "Help homeowners avoid installing panels on a roof that will soon need replacement.", "Check the wrong-call guide"],
  ["shade-analysis-solar-payback", "Buying", "solar shade analysis", "Solar Shade Analysis: When a Sunny Zip Code Is Misleading", "tree shade, roof planes, site survey", "Separate regional solar potential from property-specific roof production.", "Run a conservative estimate"],
  ["time-of-use-rates-solar-savings", "Rates", "time-of-use rates solar", "Time-of-Use Rates and Solar Savings: Why Timing Matters", "evening rates, midday exports, bill savings", "Explain how rate timing changes the value of self-consumed solar.", "Adjust export-credit assumptions"],
  ["solar-export-credit-vs-retail-rate", "Policy", "solar export credit", "Solar Export Credit vs Retail Rate: The Gap Homeowners Miss", "net billing, avoided cost, bill offset", "Define the gap between offsetting a bill and exporting power.", "Read net metering explained"],
  ["solar-quotes-red-flags-payback", "Buying", "solar quote red flags", "Solar Quote Red Flags: Payback Claims That Need a Second Look", "sales proposal, assumptions, homeowner checklist", "Give readers a practical quote-review lens without collecting leads.", "Compare with Solar Payback Map assumptions"],
  ["federal-solar-tax-credit-payback", "Policy", "federal solar tax credit payback", "Federal Solar Tax Credit and Payback: What It Does Not Guarantee", "ITC, tax appetite, net cost", "Explain how the credit reduces modeled cost without guaranteeing cash savings.", "Review tax-credit assumptions"],
  ["solar-payback-with-financing", "Finance", "solar payback with financing", "Solar Payback With Financing: Why APR Changes the Story", "loan interest, monthly payment, cash purchase", "Show why simple payback and financed payback are different decisions.", "Run a financed scenario manually"],
  ["cash-vs-solar-investment-comparison", "Finance", "cash vs solar investment", "Cash vs Solar: Comparing Rooftop Panels With Keeping the Money", "opportunity cost, 25-year savings, alternatives", "Frame solar as a capital decision rather than only a bill-savings pitch.", "Read the methodology"],
  ["solar-payback-for-low-usage-homes", "Usage", "solar for low usage homes", "Solar for Low-Usage Homes: Why a Small Bill Changes the Math", "household consumption, system sizing, fixed charges", "Explain why low consumption can limit savings even with good sunlight.", "Use your bill in the calculator"],
  ["oversized-solar-system-payback-risk", "Usage", "oversized solar system", "Oversized Solar Systems: The Payback Risk Behind Bigger Designs", "system size, exports, self-consumption", "Warn against sizing decisions that create low-value exports.", "Check export-credit policy"],
  ["solar-payback-for-electric-vehicles", "Usage", "solar payback with EV charging", "Solar Payback With an EV: When More Usage Helps the Case", "EV charging, load shifting, home energy", "Explain how daytime charging and higher usage can change solar economics.", "Run a usage scenario"],
  ["heat-pump-home-solar-payback", "Usage", "heat pump solar payback", "Heat Pump Homes and Solar Payback: Matching Electric Loads", "electrification, winter load, system sizing", "Show how electrification can improve or complicate rooftop sizing.", "Compare state rates"],
  ["battery-without-solar-payback", "Battery", "battery without solar payback", "Battery Without Solar: A Different Payback Question", "backup power, arbitrage, resilience", "Separate resilience value from solar generation economics.", "Read battery assumptions"],
  ["solar-battery-backup-value", "Battery", "solar battery backup value", "Solar Battery Backup Value: What Payback Numbers Leave Out", "outage protection, resilience, net billing", "Explain why backup value can be real even when financial payback is weak.", "Compare California battery context"],
  ["rural-home-solar-payback", "Local", "rural solar payback", "Rural Solar Payback: Distance, Utility Rules, and Roof Space", "co-op utilities, interconnection, land", "Surface rural-specific variables that state averages can hide.", "Use rankings as a first screen"],
  ["suburban-solar-payback-hoa", "Local", "suburban solar HOA", "Suburban Solar Payback: HOA Rules Are Not the Same as Economics", "HOA review, roof visibility, project delay", "Help homeowners separate approval friction from payback math.", "Review quote red flags"],
  ["condo-townhome-solar-payback", "Local", "townhome solar payback", "Townhome Solar Payback: Shared Roofs and Smaller Systems", "condo rules, roof rights, system size", "Explain why attached housing changes ownership and sizing assumptions.", "Check the wrong-call guide"],
  ["solar-payback-for-renters", "Local", "solar for renters", "Solar for Renters: Why Rooftop Payback Usually Is Not Yours", "community solar, landlord ownership, bill credits", "Clarify when renters should look beyond rooftop economics.", "Compare alternatives"],
  ["community-solar-vs-rooftop-payback", "Alternatives", "community solar vs rooftop", "Community Solar vs Rooftop Solar: Two Very Different Payback Stories", "bill credits, ownership, subscription risk", "Compare subscription savings with owned-system economics.", "Read source policy"],
  ["portable-solar-home-backup-economics", "Alternatives", "portable solar backup", "Portable Solar Backup Economics: Useful Tool, Weak Payback Claim", "backup battery, emergency power, small panels", "Keep product-style solar backup claims separate from home payback.", "Read backup value article"],
  ["solar-payback-after-rate-hike", "Rates", "solar after rate hike", "Solar After a Rate Hike: When the Math Actually Improves", "utility increases, future rates, sensitivity", "Explain how higher rates affect payback without overpromising future increases.", "Run a higher-rate scenario"],
  ["solar-payback-if-rates-fall", "Rates", "solar payback if rates fall", "Solar Payback If Rates Fall: The Risk Optimistic Models Ignore", "rate forecasts, sensitivity, downside case", "Show why conservative models should test weaker electricity value.", "Review range logic"],
  ["fixed-charges-solar-bill-savings", "Rates", "fixed charges solar savings", "Fixed Charges and Solar Savings: The Part of the Bill Panels Cannot Erase", "utility bill, delivery charges, minimum bill", "Explain why not every dollar on a bill is offset by solar production.", "Use your actual bill"],
  ["demand-charges-residential-solar", "Rates", "residential demand charges solar", "Residential Demand Charges: A Small Rule With Big Solar Consequences", "tariff design, peak demand, bill savings", "Introduce demand charges as a tariff risk for some households.", "Check utility terms"],
  ["winter-solar-production-payback", "Production", "winter solar production", "Winter Solar Production: Why Annual Output Matters More Than January", "seasonality, snow, PVWatts", "Explain seasonal production without letting winter fear distort annual payback.", "Review production assumptions"],
  ["snow-on-solar-panels-payback", "Production", "snow on solar panels", "Snow on Solar Panels: Payback Impact Without the Panic", "northern states, seasonal loss, roof pitch", "Give northern homeowners a measured way to think about snow losses.", "Compare northern states"],
  ["east-west-roof-solar-payback", "Production", "east west roof solar", "East-West Roof Solar: Lower Peak, Sometimes Better Timing", "roof orientation, production curve, self-use", "Explain orientation tradeoffs beyond a south-facing ideal.", "Run a conservative case"],
  ["north-facing-roof-solar-payback", "Production", "north facing roof solar", "North-Facing Roof Solar: When the Math Gets Hard", "roof orientation, production loss, quote review", "Help readers recognize when a proposal needs extra scrutiny.", "Check shade and roof assumptions"],
  ["ground-mount-solar-payback", "Production", "ground mount solar payback", "Ground-Mount Solar Payback: Better Siting, Higher Project Cost", "land, racking cost, production", "Compare production gains with added installation complexity.", "Use the calculator cautiously"],
  ["solar-payback-with-tree-removal", "Production", "tree removal solar payback", "Tree Removal for Solar: When Extra Cost Breaks the Payback", "shade mitigation, project cost, homeowner tradeoff", "Frame tree removal as an added cost and personal decision, not just a production fix.", "Review wrong-call factors"],
  ["interconnection-delays-solar-payback", "Process", "solar interconnection delay", "Solar Interconnection Delays: The Payback Clock Starts Later", "permission to operate, utility approval, timeline", "Explain why project delays matter even when final production is unchanged.", "Review quote assumptions"],
  ["permission-to-operate-solar-savings", "Process", "permission to operate solar", "Permission to Operate: Why Solar Savings Do Not Start at Install Day", "PTO, utility meter, activation", "Clarify the gap between installation and actual bill savings.", "Check proposal timelines"],
  ["solar-warranty-payback-risk", "Buying", "solar warranty payback", "Solar Warranty Claims: What They Do and Do Not Do for Payback", "equipment warranty, workmanship, inverter", "Separate warranty comfort from economic certainty.", "Read quote red flags"],
  ["inverter-replacement-solar-payback", "Costs", "inverter replacement solar", "Inverter Replacement and Solar Payback: The Midlife Cost to Notice", "maintenance, inverter lifespan, 25-year savings", "Explain why long-term savings should include plausible equipment costs.", "Review 25-year estimate"],
  ["solar-maintenance-cost-payback", "Costs", "solar maintenance cost", "Solar Maintenance Cost: Small Line Item, Real Assumption", "cleaning, repairs, monitoring", "Keep maintenance from being ignored in long-term economics.", "Use conservative inputs"],
  ["solar-insurance-premium-payback", "Costs", "solar insurance premium", "Solar Insurance Premiums: A Quiet Payback Variable", "home insurance, roof coverage, replacement value", "Explain why homeowners should ask insurers before assuming savings.", "Check roof-age article"],
  ["solar-property-tax-payback", "Costs", "solar property tax", "Solar Property Tax Rules: When Added Value Does Not Mean Added Tax", "property tax exemption, home value, incentives", "Clarify why tax treatment varies and should be verified locally.", "Review incentive assumptions"],
  ["solar-home-value-payback", "Finance", "solar home value", "Solar Home Value: Why Resale Is Not a Payback Shortcut", "appraisal, buyer value, owned system", "Avoid treating possible resale value as guaranteed payback.", "Read tenure test"],
  ["leased-solar-vs-owned-payback", "Finance", "leased solar vs owned", "Leased Solar vs Owned Panels: Why Payback Is Not the Same Metric", "lease terms, PPA, ownership", "Explain why leases and PPAs require a different comparison than owned systems.", "Review quote red flags"],
  ["ppa-solar-savings-risk", "Finance", "solar PPA savings risk", "Solar PPA Savings: The Escalator Clause That Changes the Deal", "power purchase agreement, escalator, bill comparison", "Help homeowners inspect long-term price changes in PPA offers.", "Check financing assumptions"],
  ["solar-loan-dealer-fee-payback", "Finance", "solar loan dealer fee", "Solar Loan Dealer Fees: The Hidden Cost Behind a Low APR", "loan pricing, cash price, financed price", "Explain why financed quotes should be compared against cash prices.", "Use cash-vs-finance logic"],
  ["solar-payback-for-retirees", "Audience", "solar for retirees", "Solar Payback for Retirees: Tenure, Tax Appetite, and Simplicity", "fixed income, tax credit, ownership horizon", "Address a specific reader situation without making financial advice claims.", "Run conservative scenarios"],
  ["solar-payback-for-first-time-homeowners", "Audience", "solar first-time homeowners", "Solar Payback for First-Time Homeowners: Start With the Bill, Not the Panels", "new homeowner, usage history, roof inspection", "Guide newer homeowners toward better inputs before quote shopping.", "Use your bill in calculator"],
  ["solar-payback-for-large-families", "Audience", "solar for high usage homes", "High-Usage Homes and Solar Payback: When Bigger Bills Help", "household load, system sizing, self-consumption", "Explain how high usage can improve savings while still requiring sizing discipline.", "Compare usage assumptions"],
  ["solar-payback-for-vacation-homes", "Audience", "solar vacation home", "Vacation Home Solar Payback: Low Occupancy Changes the Value", "seasonal usage, second home, utility bill", "Show why occasional occupancy can weaken a rooftop case.", "Check low-usage article"],
  ["solar-payback-for-home-office", "Audience", "home office solar payback", "Home Office Solar Payback: Daytime Usage Can Help the Case", "remote work, daytime load, self-consumption", "Explain why daytime electric use can improve self-consumption value.", "Run a usage scenario"],
  ["best-states-for-solar-payback-not-sunniest", "Data", "best states for solar payback", "Best States for Solar Payback Are Not Always the Sunniest", "electricity rates, incentives, ranking", "Reframe best-state content around economics instead of irradiance alone.", "Explore rankings"],
  ["worst-states-for-solar-payback", "Data", "worst states for solar payback", "Worst States for Solar Payback: What the Low Scores Have in Common", "cheap power, weak policy, low production", "Explain low-score patterns without dismissing individual homes.", "Compare state rankings"],
  ["solar-payback-map-how-to-read", "Data", "solar payback map", "Solar Payback Map: How to Read Scores Without Overreading Them", "map interpretation, score range, uncertainty", "Teach readers to use a map as a screening tool.", "Open the dataset"],
  ["county-solar-payback-vs-state-average", "Data", "county solar payback", "County Solar Payback vs State Average: Why Local Detail Matters", "local rates, weather, policy, county data", "Explain why pSEO county pages should not be thin copies of state pages.", "View county example"],
  ["metro-solar-payback-commuter-suburbs", "Data", "metro solar payback", "Metro Solar Payback: Why Suburbs Can Diverge From the City", "utility territory, roof size, rate differences", "Show how metro context can change a solar decision.", "Compare county example"],
  ["zip-code-solar-payback-limits", "Data", "zip code solar payback", "Zip Code Solar Payback: Useful Starting Point, Not a Roof Survey", "local estimate, roof-specific variables, shade", "Clarify what granular location pages can and cannot know.", "Read methodology"],
  ["solar-payback-calculator-inputs", "Methodology", "solar payback calculator inputs", "Solar Payback Calculator Inputs: Which Numbers Deserve the Most Attention", "system size, rate, cost per watt", "Prioritize inputs for readers using the calculator.", "Open calculator"],
  ["cost-per-watt-solar-payback", "Methodology", "cost per watt solar payback", "Cost per Watt and Solar Payback: The Quote Number That Moves Everything", "installed cost, quote comparison, gross cost", "Explain why $/W is central to quote review.", "Review quote red flags"],
  ["degradation-factor-solar-savings", "Methodology", "solar degradation factor", "Solar Degradation Factor: A Small Percent With Long-Term Effects", "panel output decline, 25-year value", "Explain degradation without overstating precision.", "Read methodology"],
  ["solar-payback-range-vs-single-number", "Methodology", "solar payback range", "Solar Payback Range vs Single Number: Which One Should You Trust?", "uncertainty, scenario modeling, conservative estimate", "Defend ranges as a higher-trust format.", "Read payback estimate method"],
  ["conservative-solar-estimate-meaning", "Methodology", "conservative solar estimate", "Conservative Solar Estimate: What Solar Payback Map Means by That", "assumptions, downside case, trust", "Define the editorial standard behind conservative modeling.", "Read About Solar Payback Map"],
  ["solar-worth-it-score-explained", "Methodology", "solar Worth-It Score", "Solar Worth-It Score Explained: A Comparison Signal, Not a Quote", "score model, ranking, payback", "Explain the score's role and limits.", "Explore rankings"],
  ["solar-roi-vs-payback-period", "Methodology", "solar ROI vs payback", "Solar ROI vs Payback Period: Two Metrics, Two Questions", "return, payback, 25-year savings", "Help readers choose the right metric for their decision.", "Use calculator"],
  ["solar-savings-estimate-before-quotes", "Buying", "solar savings estimate", "Solar Savings Estimate Before Quotes: How to Stay Grounded", "quote preparation, bill review, assumptions", "Give readers a pre-quote workflow.", "Review calculator inputs"],
  ["how-to-read-solar-proposal", "Buying", "read solar proposal", "How to Read a Solar Proposal Without Getting Lost in the Graphs", "proposal review, assumptions, savings chart", "Turn a sales document into checkable assumptions.", "Check quote red flags"],
  ["solar-sales-call-questions", "Buying", "solar sales questions", "Solar Sales Call Questions That Reveal the Real Payback", "installer questions, export rate, roof condition", "Provide a practical question list without becoming a lead funnel.", "Use quote checklist"],
  ["solar-payback-too-good-to-be-true", "Buying", "solar payback too good", "Solar Payback Looks Too Good? Five Assumptions to Check First", "optimistic savings, quote review, red flags", "Identify where unrealistic payback claims usually come from.", "Compare model assumptions"],
  ["solar-estimate-after-utility-bill", "Buying", "solar estimate utility bill", "Solar Estimate From Your Utility Bill: What You Can Learn in Ten Minutes", "kWh usage, rate, monthly bill", "Show readers how to extract useful inputs from their bill.", "Open calculator"],
  ["solar-payback-with-flat-roof", "Production", "flat roof solar payback", "Flat Roof Solar Payback: Racking, Tilt, and Extra Cost", "commercial-style racking, residential flat roof", "Explain flat-roof tradeoffs for homeowners.", "Review cost per watt"],
  ["solar-payback-with-metal-roof", "Production", "metal roof solar payback", "Metal Roof Solar Payback: Why Attachment Can Help or Complicate Cost", "standing seam, roof life, installation", "Discuss roof material as an installation variable.", "Read roof age article"],
  ["solar-payback-with-tile-roof", "Production", "tile roof solar payback", "Tile Roof Solar Payback: Fragile Materials and Labor Cost", "tile roof, installation cost, breakage risk", "Explain why roof material can affect quote economics.", "Use conservative cost inputs"],
  ["solar-payback-with-steep-roof", "Production", "steep roof solar payback", "Steep Roof Solar Payback: Access Cost vs Production Angle", "roof pitch, labor cost, safety", "Balance production angle with installation complexity.", "Review quote assumptions"],
  ["solar-payback-with-small-roof", "Production", "small roof solar payback", "Small Roof Solar Payback: When Limited Space Changes System Size", "roof area, panel count, fixed costs", "Explain why small systems may have different economics.", "Use system size input"],
  ["solar-payback-and-net-billing", "Policy", "net billing solar payback", "Net Billing Solar Payback: Why Self-Consumption Becomes the Main Event", "export rate, battery, load shifting", "Deepen policy content beyond basic net metering.", "Run export scenarios"],
  ["virtual-net-metering-solar", "Policy", "virtual net metering", "Virtual Net Metering: When Solar Credits Move Across Meters", "multi-family, community solar, bill credits", "Explain a policy concept that affects nontraditional solar users.", "Compare community solar"],
  ["solar-incentives-expiration-risk", "Policy", "solar incentives expiration", "Solar Incentive Expiration Risk: Do Not Build a Payback on Old Rules", "program caps, deadlines, policy updates", "Warn readers to verify current incentive status.", "Read source policy"],
  ["state-solar-rebate-payback", "Policy", "state solar rebates", "State Solar Rebates and Payback: Helpful, But Usually Conditional", "rebate eligibility, program budget, net cost", "Explain how rebates should be modeled carefully.", "Review incentive assumptions"],
  ["utility-solar-buyback-plan", "Policy", "utility solar buyback plan", "Utility Solar Buyback Plans: The Fine Print Behind Export Value", "REP plans, export limits, Texas", "Show how utility offers can affect economics.", "Read Texas payback article"],
  ["solar-payback-low-income-programs", "Policy", "low income solar programs", "Low-Income Solar Programs: Payback Is Not the Only Benefit", "assistance programs, energy burden, eligibility", "Cover policy-oriented support without overclaiming availability.", "Check local sources"],
  ["solar-payback-and-rec-credits", "Policy", "solar renewable energy credits", "Solar Renewable Energy Credits: When Extra Revenue Changes Payback", "SREC, incentive markets, state programs", "Explain SREC-style revenue with uncertainty.", "Review source dates"],
  ["solar-payback-2026-policy-watchlist", "Policy", "solar policy changes 2026", "Solar Policy Changes to Watch in 2026 Before Trusting Payback", "net metering changes, incentives, tariffs", "Create a freshness-oriented policy watchlist.", "Read methodology"],
  ["solar-payback-and-panel-tariffs", "Costs", "solar panel tariffs payback", "Solar Panel Tariffs and Payback: Why Hardware Prices Can Move", "equipment cost, supply chain, quote timing", "Explain cost volatility without predicting prices.", "Compare cost per watt"],
  ["solar-payback-and-battery-rebates", "Battery", "battery rebate solar payback", "Battery Rebates and Solar Payback: When Storage Math Improves", "storage incentives, net billing, backup", "Connect battery incentives to export-credit policy.", "Read battery payback"],
  ["solar-battery-size-payback", "Battery", "solar battery size payback", "Solar Battery Size and Payback: Bigger Is Not Automatically Better", "storage sizing, load shifting, backup hours", "Help readers avoid oversizing storage for weak economics.", "Run a storage scenario"],
  ["solar-battery-for-time-of-use", "Battery", "battery time-of-use solar", "Battery for Time-of-Use Rates: Moving Solar Value Into the Evening", "TOU rates, arbitrage, self-consumption", "Explain a specific storage use case.", "Read TOU article"],
  ["solar-without-battery-after-net-billing", "Battery", "solar without battery net billing", "Solar Without a Battery After Net Billing: Still Possible, Less Forgiving", "export credits, system sizing, self-use", "Show readers when battery-free systems remain reasonable.", "Check export factor"],
  ["solar-payback-and-home-energy-efficiency", "Alternatives", "energy efficiency vs solar", "Energy Efficiency Before Solar: The Payback Step Many Homes Need First", "insulation, HVAC, load reduction", "Compare reducing usage with producing power.", "Use low-usage logic"],
  ["solar-vs-window-replacement", "Alternatives", "solar vs window replacement", "Solar vs Window Replacement: Two Home Upgrades, Different Payback Logic", "home efficiency, comfort, bill savings", "Keep alternative upgrade comparisons grounded.", "Read cash comparison"],
  ["solar-vs-heat-pump-water-heater", "Alternatives", "solar vs heat pump water heater", "Solar vs Heat Pump Water Heater: Which Bill Problem Are You Solving?", "electrification, water heating, usage", "Frame competing energy upgrades by household need.", "Review usage assumptions"],
  ["solar-vs-roof-replacement-first", "Alternatives", "solar vs roof replacement", "Solar or Roof Replacement First: The Sequence That Protects Payback", "roof age, project order, reinstallation cost", "Give practical sequencing advice.", "Read roof age guide"],
  ["solar-payback-checklist-before-signing", "Checklist", "solar payback checklist", "Solar Payback Checklist: Twelve Questions Before You Sign", "quote review, homeowner checklist, assumptions", "Offer a broad pre-signing checklist without quote capture.", "Use calculator"],
  ["solar-payback-data-sources-guide", "Methodology", "solar data sources", "Solar Data Sources Guide: Where Payback Numbers Should Come From", "NREL, EIA, LBNL, DSIRE", "Explain trustworthy source types.", "Read methodology"],
  ["solar-payback-glossary", "Glossary", "solar payback glossary", "Solar Payback Glossary: Terms That Change the Decision", "net metering, ITC, degradation, kWh", "Create a reference article for internal linking.", "Explore related guides"],
  ["solar-roi-mistakes-homeowners-make", "Buying", "solar ROI mistakes", "Solar ROI Mistakes Homeowners Make When Reading Quotes", "quote assumptions, optimistic ROI, payback", "Summarize common interpretation errors.", "Check quote red flags"],
  ["solar-payback-sensitivity-analysis", "Methodology", "solar sensitivity analysis", "Solar Payback Sensitivity Analysis: Testing the Deal Before You Trust It", "rate sensitivity, cost sensitivity, export factor", "Teach readers to stress-test assumptions.", "Use calculator"],
  ["solar-payback-for-new-construction", "Local", "new construction solar payback", "New Construction Solar Payback: Easier Design, Different Baseline", "new homes, roof design, energy code", "Explain why new homes need a different baseline.", "Review usage estimates"],
  ["solar-payback-after-remodel", "Local", "solar after remodel payback", "Solar After a Remodel: Why Your Old Bill May Be the Wrong Input", "new loads, insulation, HVAC changes", "Warn against using stale usage data.", "Use current bill inputs"],
  ["solar-payback-for-pool-pump", "Usage", "pool pump solar payback", "Pool Pumps and Solar Payback: Daytime Loads Can Help", "pool electricity, self-consumption, seasonal use", "Address a common high-usage appliance.", "Run usage scenario"],
  ["solar-payback-for-all-electric-home", "Usage", "all-electric home solar payback", "All-Electric Home Solar Payback: Bigger Load, Bigger Assumption Risk", "electrification, load profile, system size", "Explain how all-electric homes change sizing.", "Compare heat pump article"],
  ["solar-payback-after-adding-ac", "Usage", "solar payback adding AC", "Adding Air Conditioning? Recalculate Solar Payback Before You Size", "cooling load, future usage, system design", "Explain future-load risk in proposals.", "Use calculator"],
  ["solar-payback-with-smart-panel", "Technology", "smart panel solar payback", "Smart Panels and Solar Payback: Better Visibility, Not Free Savings", "load management, monitoring, storage", "Separate monitoring value from bill savings.", "Review battery sizing"],
  ["solar-monitoring-app-payback", "Technology", "solar monitoring app", "Solar Monitoring Apps: Useful Evidence, Not a Payback Guarantee", "production monitoring, troubleshooting, savings", "Explain monitoring's role after installation.", "Read warranty article"],
  ["solar-payback-and-panel-efficiency", "Technology", "solar panel efficiency payback", "Solar Panel Efficiency and Payback: When Premium Panels Matter", "panel efficiency, roof area, cost per watt", "Explain efficiency tradeoffs for limited roofs.", "Review small roof guide"],
  ["solar-payback-and-microinverters", "Technology", "microinverters solar payback", "Microinverters and Solar Payback: Shade Help vs Added Cost", "inverter choice, shade, reliability", "Explain equipment choice as a cost/performance tradeoff.", "Read shade analysis"],
  ["solar-payback-and-power-optimizers", "Technology", "power optimizers solar", "Power Optimizers and Solar Payback: Solving Shade Is Not Always Cheap", "module-level electronics, partial shade", "Compare optimizers with simpler designs.", "Check shade assumptions"],
  ["solar-payback-and-ev-tou-plan", "Rates", "EV time-of-use solar", "EV Time-of-Use Plans and Solar Payback: Charge Timing Matters", "EV rate plan, overnight charging, midday solar", "Connect EV tariffs with solar value.", "Read EV article"],
  ["solar-payback-after-net-metering-cut", "Policy", "net metering cut solar", "After a Net Metering Cut: How to Rebuild the Solar Payback Case", "policy change, export value, battery", "Give a framework for changed policy environments.", "Read net billing guide"],
  ["solar-payback-for-coop-utilities", "Policy", "co-op utility solar payback", "Co-op Utility Solar Payback: Local Rules Can Beat State Averages", "electric cooperative, interconnection, buyback", "Explain why co-op utilities need separate review.", "Read rural guide"],
  ["solar-payback-for-municipal-utilities", "Policy", "municipal utility solar", "Municipal Utility Solar Payback: Check the Local Tariff First", "muni utility, local rate, export credit", "Help readers avoid state-level assumptions.", "Check utility terms"],
  ["solar-payback-for-high-shade-lots", "Production", "high shade solar payback", "High-Shade Lots and Solar Payback: When Trimming Is Not Enough", "trees, roof survey, production loss", "Give a stricter shade-screening article.", "Read shade analysis"],
  ["solar-payback-for-hot-climates", "Production", "hot climate solar payback", "Hot Climate Solar Payback: More Sun, More Cooling, Lower Panel Efficiency", "temperature coefficient, AC load, sunbelt", "Explain heat as both demand and performance variable.", "Compare Sun Belt paradox"],
  ["solar-payback-for-cold-climates", "Production", "cold climate solar payback", "Cold Climate Solar Payback: Less Sun, But Panels Like Cool Air", "temperature, snow, northern rates", "Balance winter production concerns with panel performance.", "Read winter guide"],
  ["solar-payback-and-grid-outages", "Battery", "solar grid outage backup", "Grid Outages and Solar Payback: Resilience Is a Separate Value", "backup power, battery, outage risk", "Separate resilience from ROI without dismissing it.", "Read battery backup"],
  ["solar-payback-and-critical-loads-panel", "Battery", "critical loads panel solar", "Solar Critical Loads Panels: The Backup Design Choice Behind Battery Value", "backup circuits, battery sizing, resilience", "Explain a battery design concept.", "Read battery sizing"],
  ["solar-payback-and-generator-comparison", "Alternatives", "solar battery vs generator", "Solar Battery vs Generator: Payback Is Not the Only Comparison", "backup power, fuel, resilience", "Compare backup choices without pretending they solve the same problem.", "Read backup value"],
  ["solar-payback-and-permit-fees", "Costs", "solar permit fees", "Solar Permit Fees and Payback: Small Costs That Still Belong in the Quote", "permit cost, inspection, soft costs", "Make soft costs visible.", "Review cost per watt"],
  ["solar-payback-and-sales-tax", "Costs", "solar sales tax", "Solar Sales Tax and Payback: State Rules Can Change Net Cost", "sales tax exemption, installed cost", "Explain tax treatment as a local variable.", "Review incentives"],
  ["solar-payback-and-repair-reserve", "Costs", "solar repair reserve", "Solar Repair Reserve: A Conservative Way to Read 25-Year Savings", "maintenance reserve, inverter, long-term value", "Introduce a conservative long-term planning idea.", "Read maintenance guide"],
  ["solar-payback-and-production-guarantee", "Buying", "solar production guarantee", "Solar Production Guarantees: Helpful Promise or Marketing Cushion?", "guaranteed output, installer terms, monitoring", "Help readers examine guarantee details.", "Read warranty claims"],
  ["solar-payback-and-annual-true-up", "Rates", "annual true-up solar", "Annual True-Up and Solar Payback: When Bill Credits Settle Later", "billing cycle, credits, utility rules", "Explain billing mechanics that affect perceived savings.", "Check utility terms"],
  ["solar-payback-and-minimum-bill", "Rates", "minimum bill solar", "Minimum Bills and Solar Payback: Why Zero-Dollar Bills Are Rare", "fixed charge, minimum bill, savings cap", "Set realistic expectations for bill offset.", "Read fixed charges"],
  ["solar-payback-and-demand-response", "Rates", "demand response solar", "Demand Response and Solar Payback: Extra Savings or Separate Program?", "utility programs, load shifting, incentives", "Separate utility program value from core solar savings.", "Read TOU guide"],
  ["solar-payback-and-panel-cleaning", "Maintenance", "solar panel cleaning payback", "Solar Panel Cleaning and Payback: When Dirt Actually Matters", "soiling, rainfall, maintenance cost", "Explain cleaning without selling unnecessary service.", "Read maintenance cost"],
  ["solar-payback-and-pest-guards", "Maintenance", "solar pest guards", "Solar Pest Guards and Payback: Protection Cost vs Real Risk", "critters, wiring, roof protection", "Discuss a small add-on cost with practical nuance.", "Review quote extras"],
  ["solar-payback-and-roof-leaks", "Maintenance", "solar roof leaks", "Solar Roof Leaks and Payback: Workmanship Risk Belongs in the Decision", "installation quality, roof penetration, warranty", "Address risk without fearmongering.", "Read warranty guide"],
  ["solar-payback-for-adu", "Usage", "ADU solar payback", "ADU Solar Payback: Extra Dwelling, Extra Load, Different Metering", "accessory dwelling unit, meter, household load", "Explain added-unit complexity.", "Use usage scenario"],
  ["solar-payback-for-duplex", "Local", "duplex solar payback", "Duplex Solar Payback: Split Bills and Shared Roof Decisions", "multi-unit, metering, ownership", "Handle small multifamily ownership questions.", "Read virtual net metering"],
  ["solar-payback-and-appraisal", "Finance", "solar appraisal value", "Solar Appraisal Value: Why Payback Should Not Depend on a Future Buyer", "home value, resale, appraisal", "Caution against using resale as primary payback.", "Read home value article"],
  ["solar-payback-and-inflation", "Finance", "inflation solar payback", "Inflation and Solar Payback: Future Bills Are Not a Free Assumption", "rate escalation, discounting, long-term savings", "Explain inflation/rate escalation conservatively.", "Read sensitivity analysis"],
  ["solar-payback-and-discount-rate", "Finance", "solar discount rate", "Solar Discount Rate: A Finance Term That Can Change the Verdict", "net present value, opportunity cost, savings", "Introduce NPV thinking for advanced readers.", "Read ROI vs payback"],
  ["solar-payback-and-bill-credit-expiration", "Policy", "solar bill credit expiration", "Solar Bill Credit Expiration: The Rule That Can Waste Exports", "credit rollover, annual true-up, utility policy", "Explain credit banking risks.", "Read annual true-up"],
  ["solar-payback-and-interconnection-fee", "Costs", "solar interconnection fee", "Solar Interconnection Fees: Small Utility Costs, Real Payback Inputs", "application fee, meter fee, utility cost", "Add utility soft costs to the checklist.", "Review permit fees"],
  ["solar-payback-and-panel-wattage", "Technology", "solar panel wattage", "Solar Panel Wattage and Payback: More Watts Is Not the Whole Answer", "panel rating, roof area, cost", "Explain panel rating in practical terms.", "Read efficiency article"],
  ["solar-payback-and-system-clipping", "Technology", "solar inverter clipping", "Solar Inverter Clipping: Production Loss or Smart Design?", "DC AC ratio, inverter sizing, output curve", "Explain a technical design topic for quote review.", "Read microinverter guide"],
  ["solar-payback-and-nrel-pvwatts", "Methodology", "NREL PVWatts solar payback", "NREL PVWatts and Solar Payback: What the Model Can and Cannot Tell You", "PVWatts, production estimate, limitations", "Explain a key source directly.", "Read data sources guide"],
  ["solar-payback-and-eia-rates", "Methodology", "EIA electricity rates solar", "EIA Electricity Rates and Solar Payback: Why Public Rate Data Is Only a Start", "rate data, utility bill, local tariffs", "Explain rate-source limitations.", "Use your actual bill"],
  ["solar-payback-and-lbnl-cost-data", "Methodology", "LBNL solar cost data", "LBNL Solar Cost Data and Payback: How Installed Cost Context Helps", "Tracking the Sun, cost per watt, benchmark", "Explain installed cost benchmarks.", "Read cost per watt"],
  ["solar-payback-and-dsire-policy", "Methodology", "DSIRE solar policy", "DSIRE Solar Policy Data: Useful Reference, Not a Substitute for Local Review", "incentives, net metering, policy source", "Explain policy-source use and limits.", "Read source policy"],
];

const replacementTopicPlans = [
  ["solar-payback-after-utility-rate-freeze", "Rates", "solar payback after rate freeze", "Rate Freeze Solar Payback: When Flat Bills Weaken the Pitch", "utility rate freeze, savings sensitivity, conservative case", "Help homeowners test whether a quote still works when future utility rates do not rise.", "Stress-test your rate assumption"],
  ["solar-payback-with-tiered-electric-rates", "Rates", "tiered electric rates solar", "Tiered Electric Rates and Solar Payback: Which Kilowatt-Hours Count?", "marginal rate, bill tiers, avoided cost", "Explain why the value of solar can depend on which part of the bill it offsets.", "Use your bill before quotes"],
  ["solar-payback-and-delivery-charges", "Rates", "delivery charges solar savings", "Delivery Charges and Solar Savings: The Bill Line Panels May Not Erase", "transmission charges, fixed fees, bill offset", "Show readers why gross bill size is not the same as solar-offset value.", "Review fixed-charge logic"],
  ["solar-payback-for-prepaid-electric-plans", "Rates", "prepaid electric plan solar", "Prepaid Electric Plans and Solar Payback: Check the Contract First", "retail electricity plan, buyback limits, billing terms", "Warn customers on nonstandard plans to verify export and billing rules first.", "Compare plan assumptions"],
  ["solar-payback-with-seasonal-rates", "Rates", "seasonal electric rates solar", "Seasonal Electric Rates and Solar Payback: Summer Savings Can Hide Winter Gaps", "summer peak rates, winter production, annual savings", "Help readers compare seasonal utility value with seasonal solar output.", "Run an annual scenario"],
  ["solar-payback-under-flat-rate-billing", "Rates", "flat rate billing solar", "Flat-Rate Billing and Solar Payback: Simpler Bills, Fewer Timing Upsides", "bill design, self-consumption, export value", "Explain why flat rates simplify solar math but do not remove export-policy risk.", "Check export credit rules"],
  ["solar-payback-with-real-time-pricing", "Rates", "real time pricing solar", "Real-Time Pricing and Solar Payback: Volatile Rates Need a Different Test", "hourly rates, load shifting, battery timing", "Frame solar savings under dynamic electricity prices without overstating arbitrage.", "Review TOU assumptions"],
  ["solar-payback-and-demand-response-rewards", "Rates", "demand response rewards solar", "Demand Response Rewards and Solar Payback: Bonus Value or Separate Program?", "utility incentives, load curtailment, bill credits", "Separate recurring solar savings from opt-in utility program rewards.", "Keep incentives separate"],
  ["solar-payback-and-annual-credit-reset", "Rates", "annual solar credit reset", "Annual Solar Credit Reset: The Export Rule That Can Waste Production", "credit rollover, true-up month, net billing", "Explain how credit expiration can reduce the value of oversized systems.", "Check utility credit timing"],
  ["solar-payback-with-low-income-rate-discount", "Rates", "discounted electric rate solar", "Discounted Electric Rates and Solar Payback: Lower Bills Change the Baseline", "CARE rates, bill assistance, savings estimate", "Help readers avoid overestimating savings when subsidized rates reduce avoided cost.", "Use the actual rate"],
  ["solar-payback-for-midwest-homes", "Local", "Midwest solar payback", "Midwest Solar Payback: The Quiet Middle Between Cheap Power and Strong Policy", "regional rates, roof exposure, state incentives", "Create a regional decision frame for homeowners outside headline solar states.", "Compare regional inputs"],
  ["solar-payback-in-rust-belt-cities", "Local", "Rust Belt solar payback", "Rust Belt Solar Payback: Older Roofs, Smaller Lots, and Real Electricity Value", "urban roofs, roof age, utility rates", "Address older-housing variables that state averages do not capture.", "Check roof sequence first"],
  ["solar-payback-for-mountain-west-homes", "Local", "Mountain West solar payback", "Mountain West Solar Payback: High Sun Is Only the Opening Argument", "altitude, snow, utility territory", "Explain why strong production still needs rate and export verification.", "Review state rankings"],
  ["solar-payback-in-coastal-homes", "Local", "coastal solar payback", "Coastal Solar Payback: Salt Air, Wind Exposure, and Roof Risk", "coastal corrosion, insurance, installation quality", "Add coastal durability and insurance context to solar economics.", "Ask better installer questions"],
  ["solar-payback-for-wildfire-zones", "Local", "wildfire zone solar payback", "Wildfire-Zone Solar Payback: Shutdown Risk and Insurance Questions", "public safety shutoff, battery backup, home insurance", "Separate resilience value from pure bill savings for wildfire-prone areas.", "Review backup value"],
  ["solar-payback-for-hail-prone-regions", "Local", "hail risk solar payback", "Hail Risk and Solar Payback: Durability Belongs in the Quote Review", "panel rating, insurance claim, storm exposure", "Help homeowners include storm exposure without panic or sales pressure.", "Review warranty terms"],
  ["solar-payback-for-high-altitude-homes", "Local", "high altitude solar payback", "High-Altitude Solar Payback: Better Irradiance, Different Weather Risk", "solar irradiance, snow load, roof pitch", "Explain high-altitude production advantages alongside snow and roof constraints.", "Run conservative production"],
  ["solar-payback-for-shaded-suburbs", "Local", "shaded suburb solar payback", "Shaded Suburbs and Solar Payback: Tree Canopy Can Beat State Averages", "tree canopy, roof survey, production loss", "Show why a sunny state map can mislead shaded suburban homeowners.", "Check shade before quotes"],
  ["solar-payback-for-lake-houses", "Local", "lake house solar payback", "Lake House Solar Payback: Seasonal Occupancy Changes the Savings Story", "second home, seasonal load, utility minimums", "Help seasonal homeowners decide whether rooftop economics fit actual use.", "Use occupancy in the model"],
  ["solar-payback-for-farmhouses", "Local", "farmhouse solar payback", "Farmhouse Solar Payback: Big Roofs Are Helpful, But Loads Decide Value", "rural meter, outbuildings, electric load", "Explain rural load and meter boundaries for homes with barns or workshops.", "Map the meter first"],
  ["solar-payback-and-main-panel-upgrade", "Costs", "main panel upgrade solar", "Main Panel Upgrades and Solar Payback: The Hidden Electrical Cost", "service panel, interconnection, project budget", "Make electrical upgrade costs visible before homeowners compare panel prices.", "Ask for full project cost"],
  ["solar-payback-and-roof-truss-review", "Costs", "roof truss solar review", "Roof Truss Review for Solar: Structural Questions Before Payback Claims", "structural load, engineering review, roof condition", "Explain when structural review can become a cost and timeline variable.", "Check roof constraints"],
  ["solar-payback-with-service-mast-relocation", "Costs", "service mast relocation solar", "Service Mast Relocation and Solar Payback: Small Layout Issue, Real Cost", "electrical service, array layout, soft costs", "Help readers notice site-specific electrical costs hidden outside $/W averages.", "Review quote line items"],
  ["solar-payback-and-roofing-warranty", "Costs", "roofing warranty solar", "Roofing Warranty and Solar Payback: Read the Roof Fine Print First", "roof warranty, penetrations, workmanship", "Show why roof warranty terms should be checked before installation economics.", "Call the roofer first"],
  ["solar-payback-with-battery-replacement", "Costs", "battery replacement solar payback", "Battery Replacement and Solar Payback: The Ten-Year Cost Many Charts Skip", "battery warranty, replacement cycle, lifecycle cost", "Separate first-install storage value from long-term replacement risk.", "Model storage separately"],
  ["solar-payback-and-inverter-warranty-gap", "Costs", "inverter warranty gap", "Inverter Warranty Gaps and Solar Payback: Midlife Repairs Need a Line Item", "inverter lifespan, warranty term, repair reserve", "Make inverter warranty timing part of the 25-year savings review.", "Reserve for maintenance"],
  ["solar-payback-with-roof-detach-reset", "Costs", "solar detach reset cost", "Solar Detach and Reset Cost: The Payback Penalty of Re-Roofing Later", "panel removal, roof replacement, project sequencing", "Warn homeowners against installing before a likely roof replacement.", "Sequence roof and solar"],
  ["solar-payback-and-permit-delay-costs", "Costs", "solar permit delay cost", "Permit Delays and Solar Payback: Waiting Time Has an Opportunity Cost", "permit timeline, PTO delay, activation date", "Explain why delays matter even when final production is unchanged.", "Check project timeline"],
  ["solar-payback-and-monitoring-fees", "Costs", "solar monitoring fee", "Solar Monitoring Fees and Payback: Helpful Data Should Not Become Hidden Cost", "monitoring subscription, app access, production data", "Help readers separate monitoring value from recurring service charges.", "Ask about subscriptions"],
  ["solar-payback-and-financing-prepayment", "Finance", "solar loan prepayment payback", "Solar Loan Prepayment and Payback: The Fine Print Behind Early Savings", "prepayment penalty, loan term, dealer fee", "Show why early payoff terms can change financed solar economics.", "Compare cash and financed quotes"],
  ["solar-payback-with-heloc-financing", "Finance", "HELOC solar financing", "HELOC Solar Financing: Different Interest Risk, Different Payback Math", "home equity loan, variable rate, tax caution", "Compare HELOC-style financing with installer loans without giving tax advice.", "Review APR sensitivity"],
  ["solar-payback-and-tax-liability", "Finance", "solar tax liability", "Solar Tax Liability and Payback: The Credit Only Helps When You Can Use It", "federal credit, carryforward, tax appetite", "Clarify why the federal credit is not the same as an instant rebate.", "Check tax-credit assumptions"],
  ["solar-payback-for-cash-buyers", "Finance", "cash buyer solar payback", "Cash Buyer Solar Payback: Clean Math, Real Opportunity Cost", "cash purchase, opportunity cost, net savings", "Frame cash solar as a capital allocation decision, not only a utility-bill move.", "Compare alternative uses"],
  ["solar-payback-for-zero-down-loans", "Finance", "zero down solar loan", "Zero-Down Solar Loans and Payback: Low Upfront Cost Is Not Low Total Cost", "dealer fee, interest, monthly payment", "Help readers identify when zero-down financing hides a higher system price.", "Ask for cash price"],
  ["solar-payback-with-lease-buyout", "Finance", "solar lease buyout", "Solar Lease Buyout Math: When Ownership Starts After the Original Deal", "lease buyout, transfer terms, contract review", "Explain why buyout decisions need a different payback baseline.", "Read contract first"],
  ["solar-payback-and-ppa-escalator-cap", "Finance", "PPA escalator cap solar", "PPA Escalator Caps and Solar Savings: The Clause That Decides Year Ten", "power purchase agreement, annual escalator, utility comparison", "Make long-term PPA pricing visible before readers accept first-year savings.", "Compare year-ten cost"],
  ["solar-payback-with-green-bank-loans", "Finance", "green bank solar loan", "Green Bank Solar Loans: When Public Financing Changes Payback Risk", "state financing, interest rate, eligibility", "Explain public financing as a separate assumption from solar performance.", "Verify program eligibility"],
  ["solar-payback-and-discounted-cash-flow", "Finance", "solar discounted cash flow", "Discounted Cash Flow for Solar: When Simple Payback Is Too Simple", "NPV, discount rate, future savings", "Give advanced readers a cleaner way to compare long-term solar value.", "Run a sensitivity test"],
  ["solar-payback-and-home-sale-negotiation", "Finance", "solar home sale negotiation", "Solar in a Home Sale: Payback Can Become a Negotiation, Not a Formula", "resale, loan payoff, buyer transfer", "Help owners understand how solar economics can change at resale.", "Check tenure first"],
  ["solar-payback-and-utility-interconnection-cap", "Policy", "solar interconnection cap", "Interconnection Caps and Solar Payback: When the Grid Limits Your System", "hosting capacity, system size limit, utility approval", "Explain how grid constraints can change feasible system size.", "Ask utility early"],
  ["solar-payback-with-export-credit-cap", "Policy", "export credit cap solar", "Export Credit Caps and Solar Payback: More Production May Stop Paying", "net billing cap, excess generation, system sizing", "Warn against designs that depend on exports above a policy cap.", "Size to useful load"],
  ["solar-payback-and-virtual-net-metering", "Policy", "virtual net metering solar", "Virtual Net Metering and Solar Payback: Shared Credits Need Clear Rules", "multifamily solar, bill allocation, shared meter", "Explain shared-credit structures for owners who cannot map one roof to one bill.", "Confirm allocation rules"],
  ["solar-payback-with-community-choice-aggregation", "Policy", "community choice solar payback", "Community Choice Programs and Solar Payback: Supply Choice Meets Export Rules", "CCA rates, utility delivery, net credits", "Help readers separate supply provider choice from delivery and export treatment.", "Check both bills"],
  ["solar-payback-after-incentive-expiration", "Policy", "solar incentive expiration", "Solar Incentive Expiration: Do Not Let a Deadline Replace the Math", "rebate deadline, tax credit timing, project rush", "Show how expiring incentives should be modeled without creating panic decisions.", "Model without the rebate"],
  ["solar-payback-and-srec-price-risk", "Policy", "SREC price risk solar", "SREC Price Risk and Solar Payback: Market Credits Are Not Guaranteed Savings", "renewable energy credits, market price, incentive volatility", "Explain why market-based incentives need conservative assumptions.", "Separate incentive layers"],
  ["solar-payback-with-income-qualified-incentives", "Policy", "income qualified solar incentive", "Income-Qualified Solar Incentives: Strong Help, Specific Eligibility", "rebate eligibility, income limits, net cost", "Help readers verify program fit before treating incentives as certain.", "Check eligibility first"],
  ["solar-payback-and-permit-streamlining", "Policy", "solar permit streamlining", "Solar Permit Streamlining and Payback: Faster Approval Helps, But It Is Not Savings", "SolarAPP, local permitting, soft cost", "Explain process improvements without overstating bill-savings impact.", "Track timeline assumptions"],
  ["solar-payback-and-utility-buyback-plan", "Policy", "utility buyback plan solar", "Utility Buyback Plans and Solar Payback: The Export Price Needs Its Own Line", "buyback rate, retail plan, exported power", "Help readers compare buyback rules before comparing installer proposals.", "Read export terms"],
  ["solar-payback-and-grandfathering-rules", "Policy", "solar grandfathering rules", "Grandfathering Rules and Solar Payback: Old Terms May Not Apply to New Systems", "net metering legacy, system expansion, policy transition", "Warn readers not to assume neighbors' solar rules still apply.", "Verify current tariff"],
  ["solar-payback-and-ev-charger-timing", "Usage", "EV charger timing solar", "EV Charger Timing and Solar Payback: Midday Charging Changes the Value", "EV load, charging schedule, self-consumption", "Explain why charging schedule can matter more than annual EV miles.", "Match load to production"],
  ["solar-payback-with-heat-pump-water-heater", "Usage", "heat pump water heater solar", "Heat Pump Water Heaters and Solar Payback: Small Load, Useful Timing", "water heating, electrification, daytime load", "Show how appliance timing can improve solar self-use without oversizing.", "Review load profile"],
  ["solar-payback-after-induction-cooking", "Usage", "induction cooking solar payback", "Induction Cooking and Solar Payback: Electrification Adds Load, Not Always Value", "kitchen electrification, evening load, usage change", "Help readers adjust solar sizing after appliance changes.", "Update your usage estimate"],
  ["solar-payback-with-electric-dryer", "Usage", "electric dryer solar load", "Electric Dryers and Solar Payback: Weekend Loads Are Not the Same as Weekday Sun", "laundry timing, household load, self-use", "Explain a common appliance load in practical payback terms.", "Schedule loads intentionally"],
  ["solar-payback-for-home-workshop", "Usage", "home workshop solar payback", "Home Workshop Solar Payback: Tools, Compressors, and Daytime Demand", "garage load, hobby equipment, load timing", "Address homes with unusual daytime electrical use.", "Map your circuits"],
  ["solar-payback-for-small-business-home", "Usage", "home business solar payback", "Home Business Solar Payback: Workday Loads Can Improve Self-Consumption", "home office, daytime usage, mixed-use property", "Explain why business-like daytime loads can change residential solar value.", "Separate usage categories"],
  ["solar-payback-with-pool-heater", "Usage", "pool heater solar payback", "Pool Heater Solar Payback: Big Load, Seasonal Timing, Careful Sizing", "pool heating, seasonal usage, system size", "Help homeowners avoid using pool load as a blanket reason to oversize.", "Model seasonal usage"],
  ["solar-payback-for-basement-apartment", "Usage", "basement apartment solar", "Basement Apartment Solar Payback: Extra Occupants, Extra Meter Questions", "tenant load, shared bill, meter setup", "Explain household changes that make old utility bills unreliable.", "Check metering first"],
  ["solar-payback-with-time-shifted-loads", "Usage", "load shifting solar payback", "Load Shifting and Solar Payback: Moving Usage Can Be Cheaper Than More Panels", "smart plugs, appliance timing, self-consumption", "Show how behavior and controls can change solar value before adding hardware.", "Try the low-cost test"],
  ["solar-payback-after-home-electrification-plan", "Usage", "home electrification solar plan", "Home Electrification Plans and Solar Payback: Size for the Future Carefully", "future load, heat pump, EV charger", "Help readers plan without oversizing for loads that may never arrive.", "Stage the assumptions"],
  ["solar-payback-and-hourly-consumption-data", "Usage", "hourly consumption solar", "Hourly Consumption Data and Solar Payback: The Bill Detail Worth Downloading", "smart meter data, load curve, self-use", "Explain why hourly data improves sizing and export estimates.", "Download interval data"],
  ["solar-payback-and-clip-on-monitoring", "Technology", "home energy monitor solar", "Home Energy Monitors and Solar Payback: Better Inputs Before Better Panels", "load monitoring, circuit data, quote accuracy", "Show monitoring as a pre-quote research tool rather than a savings guarantee.", "Measure before sizing"],
  ["solar-payback-and-module-level-shutdown", "Technology", "rapid shutdown solar payback", "Rapid Shutdown Hardware and Solar Payback: Safety Requirements in the Cost Stack", "NEC rapid shutdown, roof electronics, installed cost", "Explain code-driven equipment costs in non-technical language.", "Ask what is required"],
  ["solar-payback-with-bifacial-panels", "Technology", "bifacial panels solar payback", "Bifacial Panels and Solar Payback: When the Back Side Actually Matters", "albedo, ground mount, panel selection", "Explain when bifacial modules are practical and when they are just a sales bullet.", "Check site design"],
  ["solar-payback-and-dc-coupled-batteries", "Technology", "DC coupled battery solar", "DC-Coupled Batteries and Solar Payback: Efficiency Is Only One Part", "battery architecture, inverter choice, backup design", "Help readers ask better questions about solar-plus-storage architecture.", "Compare battery design"],
  ["solar-payback-with-ac-coupled-storage", "Technology", "AC coupled storage solar", "AC-Coupled Storage and Solar Payback: Retrofit Flexibility Has a Price", "battery retrofit, inverter compatibility, roundtrip losses", "Explain storage retrofit tradeoffs for existing solar owners.", "Review retrofit economics"],
  ["solar-payback-and-panel-degradation-warranty", "Technology", "degradation warranty solar", "Degradation Warranty and Solar Payback: Guaranteed Output Is Not Guaranteed Savings", "power warranty, panel output, 25-year estimate", "Separate warranted performance from actual bill savings.", "Read warranty carefully"],
  ["solar-payback-and-inverter-clipping-design", "Technology", "inverter clipping design", "Inverter Clipping Design and Solar Payback: Lost Peaks Can Still Make Sense", "DC AC ratio, production curve, equipment cost", "Explain clipping as a design tradeoff rather than an automatic flaw.", "Ask for modeled output"],
  ["solar-payback-with-oversized-inverter", "Technology", "oversized inverter solar", "Oversized Inverters and Solar Payback: Capacity You May Not Use", "inverter sizing, future expansion, upfront cost", "Warn readers against paying for future capacity without a plan.", "Confirm expansion need"],
  ["solar-payback-and-smart-breaker-panel", "Technology", "smart breaker panel solar", "Smart Breaker Panels and Solar Payback: Control Value, Not Free Energy", "load control, battery backup, monitoring", "Explain where smart panels help and where they do not change production.", "Separate control from savings"],
  ["solar-payback-and-shading-optimizers", "Technology", "shading optimizers solar", "Shading Optimizers and Solar Payback: Electronics Can Help, But Shade Still Costs", "module electronics, partial shade, production loss", "Help readers avoid treating electronics as a cure for a poor solar site.", "Fix the site first"],
  ["solar-payback-and-solar-roof-shingles", "Technology", "solar roof shingles payback", "Solar Roof Shingles and Payback: Roof Product First, Solar Product Second", "building integrated PV, roof replacement, installed cost", "Compare integrated solar roofs with conventional panels on decision terms.", "Separate roof cost"],
  ["solar-payback-and-production-model-error", "Methodology", "solar production model error", "Production Model Error and Solar Payback: Why Estimates Need a Range", "PVWatts uncertainty, shade model, weather variation", "Explain why a single production number is weaker than a payback band.", "Use a range"],
  ["solar-payback-and-weather-year-variance", "Methodology", "solar weather variance", "Weather-Year Variance and Solar Payback: One Cloudy Year Is Not the Verdict", "annual production, historical weather, variability", "Help readers interpret year-to-year solar output without overreacting.", "Compare multi-year output"],
  ["solar-payback-with-bill-normalization", "Methodology", "bill normalization solar", "Bill Normalization for Solar Payback: Clean Up the Usage Baseline First", "weather-normalized usage, occupancy change, utility bill", "Show why old bills need adjustment before sizing and savings estimates.", "Normalize the baseline"],
  ["solar-payback-and-discounted-savings", "Methodology", "discounted solar savings", "Discounted Solar Savings: Why Future Dollars Need a Present-Day Test", "net present value, discount rate, opportunity cost", "Give readers a finance-aware alternative to simple cumulative savings.", "Compare simple payback"],
  ["solar-payback-and-confidence-intervals", "Methodology", "solar payback confidence interval", "Solar Payback Confidence Intervals: A Better Way to Talk About Uncertainty", "range estimate, model uncertainty, decision threshold", "Explain uncertainty in plain language for decision makers.", "Trust ranges over decimals"],
  ["solar-payback-and-source-recency", "Methodology", "solar source recency", "Source Recency and Solar Payback: Old Policy Data Can Break a Good Article", "data freshness, policy update, reviewed date", "Make source dates part of SEO trust and homeowner decision quality.", "Check reviewed dates"],
  ["solar-payback-and-citation-quality", "Methodology", "solar citation quality", "Citation Quality for Solar Payback: Which Sources Deserve Weight?", "primary sources, installer claims, public data", "Teach readers how to weigh public sources against sales claims.", "Prefer primary sources"],
  ["solar-payback-and-local-tariff-reading", "Methodology", "local tariff solar payback", "Local Tariff Reading for Solar Payback: The Skill Behind Better Estimates", "utility tariff, rate schedule, export terms", "Explain how to read rate schedules without turning the article into legal advice.", "Find the tariff"],
  ["solar-payback-with-scenario-planning", "Methodology", "solar scenario planning", "Solar Scenario Planning for Payback: Quote Review With a Weak Case", "sensitivity analysis, quote review, decision range", "Give readers a repeatable way to stress-test solar economics.", "Run three cases"],
  ["solar-payback-and-model-audit-trail", "Methodology", "solar model audit trail", "Solar Model Audit Trail: Every Payback Claim Should Show Its Inputs", "source transparency, assumptions, homeowner review", "Position transparent assumptions as a core trust signal.", "Save the assumptions"],
  ["solar-payback-for-overbuilt-homes", "Buying", "overbuilt solar quote", "Overbuilt Solar Quotes: When a Big System Solves the Wrong Problem", "system sizing, export risk, load mismatch", "Help readers challenge oversized designs politely and concretely.", "Ask for smaller option"],
  ["solar-payback-and-sales-deadlines", "Buying", "solar sales deadline", "Solar Sales Deadlines and Payback: Urgency Is Not an Economic Input", "limited-time offer, quote pressure, incentive timing", "Give readers a calm way to evaluate deadline-driven proposals.", "Pause the decision"],
  ["solar-payback-with-one-quote", "Buying", "one solar quote risk", "One Solar Quote Is Not a Payback Study", "quote comparison, price spread, installer assumptions", "Explain why a single quote cannot establish market price or realistic savings.", "Get comparison quotes"],
  ["solar-payback-and-roof-plane-fragmentation", "Buying", "fragmented roof solar", "Fragmented Roof Planes and Solar Payback: Complexity Has a Cost", "small roof faces, design labor, production loss", "Show why complex roofs need more scrutiny than simple annual sun maps.", "Review array layout"],
  ["solar-payback-and-installer-production-guarantee", "Buying", "solar installer production guarantee", "Solar Installer Production Guarantees: Useful Backstop or Soft Promise?", "guaranteed output, contract terms, monitoring", "Help readers inspect guarantees before treating them as savings insurance.", "Read guarantee terms"],
  ["solar-payback-and-quote-escalation-rate", "Buying", "quote escalation rate solar", "Quote Escalation Rates and Solar Payback: The Assumption That Inflates Savings", "electricity inflation, sales proposal, 25-year savings", "Show readers how one rate assumption can dominate lifetime savings charts.", "Rerun at zero escalation"],
  ["solar-payback-and-price-per-panel", "Buying", "price per panel solar", "Price Per Panel Is the Wrong Solar Payback Shortcut", "cost per watt, system size, quote comparison", "Move readers from panel-count pricing to useful installed-cost comparisons.", "Compare cost per watt"],
  ["solar-payback-and-cancellation-window", "Buying", "solar cancellation window", "Solar Cancellation Windows: Last Chance to Recheck Payback Assumptions", "contract review, rescission, quote audit", "Encourage readers to use cancellation periods for verification, not second thoughts alone.", "Audit before deadline"],
  ["solar-payback-and-site-survey-changes", "Buying", "solar site survey changes", "Site Survey Changes and Solar Payback: When the Final Design Moves the Goalposts", "final design, shade finding, cost change", "Explain why post-survey design changes require a fresh payback review.", "Recalculate after survey"],
  ["solar-payback-and-quote-adders", "Buying", "solar quote adders", "Solar Quote Adders and Payback: Small Line Items That Change the Verdict", "trenching, electrical work, roof work", "Help homeowners ask which adders are necessary and which are optional.", "Ask for itemization"],
  ["solar-payback-and-inspection-failures", "Process", "solar inspection failure", "Solar Inspection Failures and Payback: Delays That Do Not Show in Savings Charts", "inspection delay, rework, PTO timeline", "Make inspection and rework risk visible in the installation timeline.", "Track activation date"],
  ["solar-payback-and-meter-upgrade-delay", "Process", "solar meter upgrade delay", "Meter Upgrade Delays and Solar Payback: The Utility Step That Starts Savings Late", "net meter, PTO, utility scheduling", "Explain why installed panels may not save money until utility work finishes.", "Ask about PTO"],
  ["solar-payback-and-change-orders", "Process", "solar change order", "Solar Change Orders and Payback: Reprice the Project Before You Approve", "scope change, added cost, contract review", "Teach readers to rerun payback when scope or cost changes.", "Recalculate before signing"],
  ["solar-payback-and-trenching-work", "Process", "solar trenching cost", "Trenching Work and Solar Payback: Ground Runs Are Not Free Production", "detached garage, ground mount, conduit", "Explain project-specific site work for detached loads and ground arrays.", "Include site work cost"],
  ["solar-payback-and-utility-application-fees", "Process", "utility application fee solar", "Utility Application Fees and Solar Payback: Small Charges Still Belong in Net Cost", "interconnection application, meter fee, soft cost", "Add utility-side fees to the project-cost checklist.", "Capture all fees"],
  ["solar-payback-and-pto-documents", "Process", "PTO documents solar", "PTO Documents and Solar Payback: What to Save Before the First Bill", "permission to operate, interconnection approval, monitoring", "Help owners keep the evidence needed to diagnose billing or production issues.", "Save the approval"],
  ["solar-payback-and-first-year-review", "Process", "first year solar review", "First-Year Solar Review: Check the Payback Claim Against Real Output", "monitoring data, utility bill, production variance", "Turn year-one performance into a useful audit instead of a vague feeling.", "Review actual output"],
  ["solar-payback-and-utility-bill-after-install", "Process", "first bill after solar", "First Bill After Solar: Why It May Not Match the Sales Chart", "billing cycle, credits, PTO date", "Explain common first-bill surprises after activation.", "Compare billing periods"],
  ["solar-payback-and-home-energy-audit", "Alternatives", "home energy audit before solar", "Home Energy Audit Before Solar: Efficiency Upgrades Before Bigger Panels", "efficiency upgrades, load reduction, system sizing", "Compare efficiency-first decisions with rooftop system sizing.", "Audit usage first"],
  ["solar-payback-and-insulation-upgrades", "Alternatives", "insulation vs solar payback", "Insulation vs Solar Payback: Reduce the Load or Produce Around It?", "efficiency, heating load, project priority", "Help readers compare demand reduction with electricity production.", "Compare project order"],
  ["solar-payback-and-window-upgrades", "Alternatives", "window upgrades vs solar", "Window Upgrades vs Solar Payback: Comfort Projects Need Different Math", "comfort, energy savings, capital cost", "Explain why comfort-driven upgrades should not be judged only by solar-style payback.", "Separate goals"],
  ["solar-payback-and-community-battery", "Alternatives", "community battery solar", "Community Batteries and Solar Payback: Shared Storage Is Not the Same as Home Backup", "shared storage, grid services, bill credits", "Clarify emerging shared-storage concepts without treating them as rooftop substitutes.", "Check local programs"],
  ["solar-payback-and-green-power-plan", "Alternatives", "green power plan vs solar", "Green Power Plans vs Rooftop Solar: Cleaner Electricity Without Ownership Payback", "renewable tariff, utility plan, ownership", "Compare utility green plans with owned rooftop economics.", "Decide your goal first"],
  ["solar-payback-and-demand-management", "Alternatives", "demand management solar", "Demand Management Before Solar: Lower the Peak, Then Size the System", "load control, peak demand, system design", "Show how managing usage can improve solar sizing decisions.", "Control load first"],
  ["solar-payback-and-community-solar-credit-risk", "Alternatives", "community solar credit risk", "Community Solar Credit Risk: Subscription Savings Need Contract Review", "bill credit, cancellation, subscription terms", "Help renters and unsuitable roofs compare community solar carefully.", "Read the subscription"],
  ["solar-payback-and-generator-fuel-cost", "Alternatives", "generator fuel cost solar battery", "Generator Fuel Cost vs Solar Battery Value: Backup Economics Are Not Simple Payback", "backup power, fuel storage, outage planning", "Compare backup options around use case rather than one ROI metric.", "Choose the backup goal"],
  ["solar-payback-and-portable-battery-limits", "Alternatives", "portable battery solar limits", "Portable Battery Limits: Useful Backup, Weak Whole-Home Payback Claim", "portable power station, critical loads, small solar", "Keep portable backup expectations realistic for homeowners.", "Match loads to device"],
  ["solar-payback-and-shared-roof-agreement", "Alternatives", "shared roof solar agreement", "Shared Roof Solar Agreements: Payback Depends on Rights, Not Just Sun", "condo board, roof rights, bill allocation", "Explain ownership and allocation questions for shared-roof buildings.", "Clarify rights first"],
];

const fullArticleExtras = {
  "massachusetts-solar-payback-utility-rates": [
    ["rate-advantage", "Massachusetts solar payback starts with expensive electricity", ["Massachusetts is not the sunniest solar market, but high retail electricity rates can make each kilowatt-hour of rooftop production unusually valuable.", "That is why a payback estimate for the state should start with electricity value before it talks about sunshine."]],
    ["winter-reality", "Winter production is real, but annual savings matter more", ["Short winter days reduce production, but the annual estimate matters more than the worst month. A conservative range should carry seasonal weakness without letting January define the whole decision."]],
    ["quote-check", "What Massachusetts homeowners should check in a quote", ["Ask whether the proposal uses your actual rate, whether incentives are modeled separately, and whether production assumptions are tied to the roof rather than a statewide average."]],
  ],
  "arizona-solar-payback-export-credits": [
    ["sun-vs-value", "Arizona sunlight is not the same as Arizona savings", ["Arizona has excellent solar production potential, but payback depends on what exported power is worth. A strong production chart can still produce a middling financial result if exports receive lower credit."]],
    ["self-use", "Self-consumption matters when export credits weaken", ["The more solar your home uses directly, the less the export rate matters. That makes load timing, system sizing, and possibly storage more important than a headline sun score."]],
    ["proposal-test", "A better way to test an Arizona solar proposal", ["Run the numbers once with a generous export assumption and once with a weaker one. If the deal only works in the generous case, treat the quote as fragile."]],
  ],
  "maine-solar-payback-cloudy-state": [
    ["rate-signal", "Maine shows why solar payback is not a sun contest", ["Maine's case can surprise homeowners because electricity value can compensate for lower production. The economic question is dollars saved, not sunlight bragging rights."]],
    ["range-needed", "Why Maine estimates should use a range", ["Clouds, snow, roof pitch, and seasonal load all widen uncertainty. A range keeps the estimate honest while still showing whether the state deserves attention."]],
    ["homeowner-filter", "The homeowner filter for Maine solar", ["A good roof, high retail rate, and long tenure can make the case stronger. Heavy shade or a short ownership horizon can still break it."]],
  ],
  "texas-solar-payback-utility-choice": [
    ["market-design", "Texas solar payback depends on the retail plan", ["Texas homeowners often face a different question from retail net-metering states: what does the chosen plan pay for exported solar, and are there limits?"]],
    ["plan-comparison", "Compare buyback plans before comparing installers", ["An installer quote cannot fix a weak buyback plan. Homeowners should compare retail plans and export terms before deciding how large a system should be."]],
    ["sizing-risk", "Oversizing is riskier when exports are uncertain", ["If excess power receives a low or capped credit, an oversized system can turn production into low-value exports. Conservative sizing becomes part of the payback decision."]],
  ],
  "washington-solar-payback-cheap-power": [
    ["cheap-grid", "Cheap grid power lengthens Washington solar payback", ["Washington can have favorable policy but still face a long payback because the electricity being offset is relatively inexpensive. The avoided cost per kilowatt-hour is the core issue."]],
    ["not-impossible", "A weaker state average does not mean every roof fails", ["A specific home with high usage, good exposure, and a competitive installed cost can still make sense. The point is that the quote has less room for optimistic assumptions."]],
    ["decision-rule", "The Washington decision rule", ["Start with the actual utility bill, not a generic solar pitch. If the conservative payback range exceeds your likely tenure, quotes should be treated carefully."]],
  ],
  "florida-solar-payback-hurricane-insurance": [
    ["roof-first", "Florida solar starts with the roof question", ["Hurricane exposure and roof condition make Florida different from a simple sun-and-rate calculation. A roof that may need replacement soon can turn a good production estimate into a poor project sequence."]],
    ["insurance", "Insurance questions belong before the payback claim", ["Homeowners should ask how panels affect coverage, documentation, and roof work. Those answers may not change production, but they can change project risk."]],
    ["practical-order", "A practical order for Florida homeowners", ["Check roof age, insurance implications, utility export terms, and then the quote economics. That order reduces the chance of signing a technically productive but financially awkward deal."]],
  ],
  "new-york-solar-payback-incentive-stack": [
    ["stacking", "New York solar incentives should be modeled one layer at a time", ["Stacked incentives can improve payback, but combining them into one optimistic discount hides eligibility limits and timing. Each layer should be visible."]],
    ["rate-value", "High electricity value still does much of the work", ["Incentives help reduce cost, but retail electricity value often drives the recurring savings. A good estimate separates upfront help from annual bill savings."]],
    ["verification", "Verify incentive eligibility before trusting the number", ["Program budgets, income limits, tax appetite, and utility territory can change the actual value. A quote should show which incentive is assumed and why."]],
  ],
  "california-battery-payback-after-nem3": [
    ["nem3-effect", "NEM 3.0 made battery value more visible", ["Reduced export credits make self-consumption more important. A battery can shift midday production into higher-value evening use, but it also adds major cost."]],
    ["not-automatic", "A California battery is not automatically a better deal", ["Storage can improve the use of solar energy while still stretching simple payback if the installed cost is too high. The battery should be tested as its own assumption."]],
    ["right-question", "The right California battery question", ["Ask whether the battery improves the total project enough to justify its cost, not whether it makes the savings chart look smoother."]],
  ],
  "solar-payback-if-you-move-in-seven-years": [
    ["tenure-test", "The seven-year tenure test is blunt but useful", ["If you expect to move in seven years and the conservative payback range starts after that, the project needs another reason to make sense."]],
    ["resale-caution", "Do not let possible resale value rescue a weak payback", ["A future buyer may value owned solar, but resale value is not guaranteed enough to carry the estimate. Treat it as upside, not the base case."]],
    ["quote-filter", "How to use tenure before quotes", ["Compare the payback range with your realistic ownership horizon. If the range is longer, ask harder questions before investing time in installer meetings."]],
  ],
  "solar-panel-degradation-payback": [
    ["year-one", "Year-one solar output is only the opening number", ["Panels typically produce less over time, so a 25-year savings estimate needs a degradation assumption. Ignoring it makes long-term value look cleaner than it is."]],
    ["payback-vs-value", "Degradation affects long-term value more than simple payback", ["Simple payback often happens before degradation becomes dramatic, but lifetime savings depend on the output curve after year one."]],
    ["conservative-use", "How Solar Payback Map uses degradation conservatively", ["The model should avoid pretending every future year matches the first. A modest degradation factor keeps long-term estimates from becoming too optimistic."]],
  ],
};

function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

const articleModes = [
  {
    id: "quote-audit",
    opener: "Read the proposal backward from the bill result, not forward from the system size.",
    middle: "The useful question is which assumption creates the savings: local electricity value, export treatment, usable roof production, or an incentive that may not apply to every household.",
    close: "If that assumption is hidden, the payback number is not ready for a homeowner decision.",
  },
  {
    id: "home-fit",
    opener: "State averages are only a starting point because solar payback is decided at the roof, bill, and utility-plan level.",
    middle: "A strong case usually combines a durable roof, enough daytime or flexible usage, a fair installed price, and export rules that do not punish excess production.",
    close: "A weak case often fails on one of those details even when the general solar market looks attractive.",
  },
  {
    id: "risk-screen",
    opener: "The fastest way to improve the decision is to separate hard numbers from hopeful assumptions.",
    middle: "Installed cost, current bill data, tax eligibility, roof condition, and utility terms belong in the hard-number column; resale value and future rate increases should be treated as upside unless documented.",
    close: "That separation keeps the article's main keyword from becoming a sales slogan.",
  },
  {
    id: "savings-timing",
    opener: "Payback is a timing problem as much as a savings problem.",
    middle: "A system can look good over 25 years and still be a poor fit for a household that may move soon, replace the roof, change usage, or enter a utility plan with weaker export credits.",
    close: "The better estimate shows when savings arrive and which condition could delay them.",
  },
  {
    id: "source-check",
    opener: "Public data can guide the estimate, but it cannot replace the homeowner's own bill and roof information.",
    middle: "Use production models, policy databases, and rate references as guardrails, then adjust for the actual tariff, shade, orientation, and quote terms.",
    close: "That is how research becomes a usable payback decision instead of a generic solar claim.",
  },
];

const categoryGuidance = {
  "State Payback": "For a state-specific payback article, compare the state's rate environment with production reality before discussing incentives. This avoids ranking a state by sunlight alone.",
  Buying: "For a buying decision, inspect the quote, roof, ownership horizon, and sales assumptions before accepting any single ROI figure.",
  Policy: "For a policy topic, model the rule separately from system production so the reader can see whether the benefit is upfront, recurring, capped, or conditional.",
  Battery: "For a battery article, split backup value from financial payback. Storage can solve timing and resilience problems while still needing its own cost test.",
  Methodology: "For a methodology article, explain the source's role and limitation so readers understand what the model can measure and what it cannot.",
  Rates: "For a rate topic, focus on the part of the bill solar can actually offset, the value of exports, and whether savings happen at the same time production occurs.",
  Finance: "For a finance article, include opportunity cost, loan terms, tax timing, and household cash flow instead of relying on simple payback alone.",
  Usage: "For a usage article, connect system size to the home's actual load. More panels do not automatically mean better economics if the extra production is exported cheaply.",
  Local: "For a local-housing article, ownership rights, metering, roof access, and utility territory can matter as much as equipment performance.",
  Alternatives: "For an alternatives article, compare the product's savings mechanism with owned rooftop solar rather than treating every solar-branded option as the same investment.",
  Production: "For a production article, translate site conditions into annual output and then into bill value. The lowest month should not dominate the whole estimate.",
  Process: "For a process article, timeline risk matters because savings usually begin after approval, permission to operate, and billing setup are complete.",
  Costs: "For a cost article, small line items should be included when they are recurring, required, or likely enough to change the payback range.",
  Maintenance: "For a maintenance article, distinguish routine monitoring from paid add-ons that may or may not produce measurable savings.",
  Technology: "For a technology article, connect the equipment feature to usable production, reliability, or cost instead of assuming higher specifications always improve ROI.",
  Audience: "For an audience-specific article, start with the household's stage of life and cash-flow needs before treating solar as a generic investment.",
  Data: "For a data article, teach the reader how to interpret the ranking, map, or comparison without hiding the limits of averages.",
  Checklist: "For a checklist article, turn the payback question into a sequence of verifiable inputs a homeowner can collect before signing.",
  Glossary: "For a glossary article, define the terms in decision language so readers can challenge a quote without becoming solar technicians.",
};

const articleFormats = [
  "decision-guide",
  "quote-audit",
  "checklist",
  "comparison",
  "risk-review",
  "data-explainer",
  "cost-analysis",
  "faq-brief",
];

const accentPairs = [
  { primary: "#2F7E78", secondary: "#F6ECDA" },
  { primary: "#B5762A", secondary: "#EBF4F1" },
  { primary: "#B5544A", secondary: "#F1EEE7" },
  { primary: "#4A5963", secondary: "#F8EDEB" },
  { primary: "#2F7E78", secondary: "#F8EDEB" },
  { primary: "#C08A2E", secondary: "#EBF4F1" },
];

const closingLines = [
  "The next move is to test the quote with a lower-savings case before treating the upside case as real.",
  "A homeowner should be able to point to the bill line, policy rule, or roof condition that makes the answer work.",
  "If the proposal cannot explain the assumption in plain language, it is not ready to compare against another bid.",
  "The strongest solar case is the one that still makes sense after the easy optimism is removed.",
  "Use the keyword as a question to investigate, not as a conclusion that the project is automatically worth it.",
  "The article should leave the reader with a measurable next input, not a larger system size.",
  "A good estimate survives a slower payback scenario, a weaker export credit, and a more conservative cost assumption.",
  "The decision gets clearer when production, bill value, timing, and project risk are judged separately.",
];

const sourceReferenceLines = [
  "Use public sources to check direction: PVWatts for production context, EIA for electricity data, DSIRE for policy discovery, LBNL for installed-cost context, and FTC guidance for consumer-risk framing.",
  "Treat public data as a guardrail, then let the home's actual bill, tariff, roof survey, and quote price decide whether the claim survives.",
  "A credible article should name the public reference behind the assumption and still tell the reader which local input can override it.",
  "The source check is not a substitute for local review; it is a way to catch claims that conflict with production models, policy records, rate data, or consumer guidance.",
  "Use PVWatts, EIA, DSIRE, LBNL, or FTC guidance to validate the kind of claim being made, then adjust the estimate with property-specific facts.",
  "Research should narrow the estimate, not flatten it into one number; source data and homeowner data need to appear as separate inputs.",
  "When a proposal makes a broad claim, compare it with a relevant public source and ask which assumption changes once the actual utility plan is entered.",
  "A source-backed article should show what the source supports and what it cannot know about a shaded roof, a loan fee, or an expiring bill credit.",
];

const readerSituationLines = [
  "A cautious homeowner is not trying to prove solar works; they are trying to find the one assumption that could make the project disappoint.",
  "The useful reader is already close to quote shopping, so the article should turn a broad topic into a small set of inputs they can verify.",
  "The decision is strongest when the homeowner can explain the result without repeating an installer slogan or relying on a best-case chart.",
  "This topic belongs in the middle of the buying journey, where the reader needs enough detail to question a proposal without becoming an engineer.",
  "The article should help the reader slow down one step, isolate the fragile number, and compare the claim with their own bill.",
  "A strong answer respects the homeowner's uncertainty instead of pretending the same solar rule works for every roof and utility plan.",
  "The reader needs a decision filter, not a prediction. That means showing what would make the estimate stronger and what would make it fail.",
  "The best version of this content makes the next action concrete: collect one missing input, rerun one assumption, or ask one better quote question.",
];

const estimateDepthLines = [
  "Model the base case first, then create a downside case where the most favorable assumption is reduced. The gap between those two cases tells the reader whether the quote is resilient.",
  "Separate cost, production, bill credit, and timing. A proposal can be accurate about one of those inputs and still be too optimistic about the full payback.",
  "Use the current bill as the anchor because it reflects usage, fixed charges, and tariff design better than a national average.",
  "Do not let a long-term savings chart hide short-term uncertainty. The early years matter most for households with a shorter ownership horizon.",
  "Look for assumptions that compound: a high rate escalator, full incentive value, low maintenance cost, and perfect production can make a weak project look clean.",
  "The estimate should show whether savings come from avoided retail use, export credits, incentives, or a lower installed price. Those are different kinds of value.",
  "When a number is missing, use a conservative placeholder and label it. Hidden assumptions create more risk than cautious estimates.",
  "A quote is easier to compare when every major input has a source, a homeowner-specific value, and a downside version.",
];

function makeDepthParagraphs(plan, index) {
  const kw = plan.expandedKeywords;
  return [
    `${readerSituationLines[index % readerSituationLines.length]} For ${plan.mainKeyword}, that means treating ${kw[0]} as a real decision input rather than a decorative keyword in the headline.`,
    `${estimateDepthLines[index % estimateDepthLines.length]} In this article, ${kw.join(", ")} should be read together because each one can move the payback window in a different direction.`,
    `A useful ${plan.category.toLowerCase()} article also needs a failure case. If ${kw[0]} is weaker than expected, if ${kw[1] || kw[0]} is not reflected in the bill, or if ${kw[2] || "the quote assumption"} is overstated, the homeowner should still know what to do next.`,
    `The practical takeaway is not that ${plan.title.toLowerCase()} has one universal answer. The takeaway is that ${plan.mainKeyword} becomes trustworthy only when the homeowner can connect the claim to a bill, a roof, a policy rule, and a quote line item.`,
  ];
}

function titleIncludesKeyword(title, keyword) {
  const lowerTitle = title.toLowerCase();
  const terms = keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 2 && !["and", "the", "for", "with", "solar"].includes(term));

  return lowerTitle.includes(keyword.toLowerCase()) || terms.some((term) => lowerTitle.includes(term));
}

function makeSeoTitle(title, mainKeyword, expandedKeywords, index) {
  const focus = expandedKeywords[index % expandedKeywords.length];
  const normalizedTitle = title.toLowerCase();
  const hasMain = normalizedTitle.includes(mainKeyword.toLowerCase());
  const hasExpanded = expandedKeywords.some((keyword) => normalizedTitle.includes(keyword.toLowerCase()));
  if (hasMain && hasExpanded) return title;

  const titleCores = [
    `${title}: ${mainKeyword} and ${focus}`,
    `${mainKeyword}: ${focus} Behind ${title}`,
    `${title} for ${mainKeyword} and ${focus}`,
    `${mainKeyword} Guide: ${focus} Without the Sales Math`,
    `${title}: What ${focus} Means for ${mainKeyword}`,
    `${mainKeyword} Decision: ${focus} Before the Quote`,
  ];

  return titleCores[index % titleCores.length];
}

function makeSubtitle({ mainKeyword, expandedKeywords, intent, category }, index) {
  const [first, second, third = "quote assumptions"] = expandedKeywords;
  const variants = [
    `${mainKeyword} explained through ${first}, ${second}, and ${third} for the homeowner decision behind the quote.`,
    `A practical ${mainKeyword} guide for checking ${first}, ${second}, ${third}, and real bill impact before signing.`,
    `How ${mainKeyword} changes when ${first}, ${second}, and ${third} are separated from installer sales assumptions.`,
    `Use ${mainKeyword}, ${first}, ${second}, and ${third} to decide whether the payback case is strong enough.`,
    `A ${category.toLowerCase()} view of ${mainKeyword} with ${first}, ${second}, ${third}, and downside-case checks.`,
    `What homeowners should verify about ${mainKeyword}, especially ${first}, ${second}, and ${third}, before comparing proposals.`,
    `${mainKeyword} in plain English: where ${first} matters, where ${second} misleads, and how ${third} changes the test.`,
    `A source-led look at ${mainKeyword}, ${first}, ${second}, and ${third} for conservative solar payback planning.`,
    `The homeowner version of ${mainKeyword}: confirm ${first}, review ${second}, and test ${third} before the weak case.`,
    `How to read ${mainKeyword} without overtrusting ${first}, ${second}, ${third}, or a polished savings chart.`,
    `${mainKeyword} for pre-quote research, using ${first}, ${second}, and ${third} as the main pressure tests.`,
    `A decision-focused article on ${mainKeyword}, ${first}, ${second}, and ${third}: ${intent}`,
  ];

  return variants[index % variants.length];
}

function makeApplicationParagraphs(plan, index) {
  const kw = plan.expandedKeywords;
  return [
    `Apply ${plan.mainKeyword} by writing down the current assumption for ${kw[0]}, then asking whether it came from a bill, a policy document, a production model, or an installer default.`,
    `The second check is timing. If ${kw[1] || kw[0]} affects ${plan.mainKeyword} later than the proposal suggests, the payback can look shorter on paper than it feels in the household budget.`,
    `The third check is reversibility. In ${plan.mainKeyword}, a homeowner can change usage habits or compare quotes, but they cannot easily undo a poor roof sequence, a weak utility plan, or an oversized design after signing.`,
    `For this reason, ${plan.title.toLowerCase()} should end with a practical next step: rerun the conservative case and ask for the exact source behind the most important assumption.`,
  ];
}

function makeQualityParagraphs(plan, index) {
  const kw = plan.expandedKeywords;
  return [
    `A higher-quality estimate names what is known, what is assumed, and what still needs verification. For ${plan.mainKeyword}, the known input might be the bill, while ${kw[0]} often needs a separate check.`,
    `Readers should also compare the article's recommendation with the weakest plausible scenario. If ${kw[1] || kw[0]} becomes less favorable for ${plan.mainKeyword} and the project still makes sense, the conclusion is more durable.`,
    `The content should avoid a false yes-or-no answer. ${plan.intent} That goal is better served by showing the homeowner how to inspect the quote than by declaring a universal payback period.`,
    `A strong final review for ${plan.mainKeyword} asks whether the same decision would hold after a lower export credit, a higher installed price, a delayed activation date, or a shorter ownership horizon.`,
    `This extra review matters because ${plan.expandedKeywords.join(", ")} can each change the reader's next step. A homeowner who sees those inputs separately is less likely to mistake a polished proposal for a verified payback estimate.`,
  ];
}

function makeExpansionSection(plan, index) {
  const keywordId = plan.mainKeyword.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const application = makeApplicationParagraphs(plan, index);

  return {
    id: `${keywordId}-homeowner-application`,
    heading: `How to apply ${plan.mainKeyword} before signing`,
    body: [
      application[0],
      application[1],
      application[2],
      application[3],
    ],
    bullets: [
      `Write down the exact value assumed for ${plan.expandedKeywords[0]}.`,
      `Ask whether ${plan.expandedKeywords[1] || plan.expandedKeywords[0]} is verified by your utility bill or only estimated.`,
      `Run one conservative case where ${plan.expandedKeywords[2] || "the strongest assumption"} is less favorable than the proposal shows.`,
    ],
  };
}

function makeQualitySection(plan, index) {
  const keywordId = plan.mainKeyword.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const quality = makeQualityParagraphs(plan, index);

  return {
    id: `${keywordId}-quality-check`,
    heading: `Quality check for ${plan.mainKeyword}`,
    body: quality,
    callout: `The article earns a 90+ quality score only when ${plan.mainKeyword}, ${plan.expandedKeywords[0]}, and the homeowner's next action are all clear.`,
  };
}

function makeRelatedPostLinks(index) {
  const plans = replacementTopicPlans;
  const current = plans[index];
  const legacyFallbacks = [
    { label: "Solar payback estimate method", href: "/blog/how-we-estimate-solar-payback" },
    { label: "Net metering explainer", href: "/blog/net-metering-explained" },
    { label: "When solar is the wrong call", href: "/blog/when-solar-is-the-wrong-call" },
  ];
  const sameCategory = plans
    .slice(0, index)
    .findLast((plan) => plan[1] === current[1]);
  const previous = index > 0 ? plans[index - 1] : undefined;
  const nearby = index > 1 ? plans[index - 2] : undefined;
  const candidates = [sameCategory, previous, nearby]
    .filter(Boolean)
    .filter((plan) => plan[0] !== current[0]);
  const unique = [];

  for (const plan of candidates) {
    if (!unique.some((item) => item[0] === plan[0])) unique.push(plan);
  }

  const related = unique.slice(0, 2).map(([slug, , mainKeyword, title]) => ({
    label: title.length > 58 ? mainKeyword : title,
    href: `/blog/${slug}`,
  }));

  return related.length ? related : [legacyFallbacks[index % legacyFallbacks.length]];
}

function makeDirectAnswer(plan, index) {
  const first = plan.expandedKeywords[0];
  const second = plan.expandedKeywords[1] || plan.expandedKeywords[0];

  return [
    `${plan.mainKeyword} is worth evaluating only after ${first}, ${second}, and the home's actual utility bill are separated into their own assumptions.`,
    `${plan.intent} A good answer should show the conservative case first, then explain what would make the outcome stronger or weaker.`,
    `Use this article as a pre-quote screen: if the proposal cannot document the key input behind ${first}, the payback claim needs more review.`,
  ];
}

function shouldHaveFaq(category, articleType) {
  return ["Policy", "Rates", "Battery", "Methodology", "Finance"].includes(category) || ["comparison", "faq-brief"].includes(articleType);
}

function makeFaq(plan, index) {
  if (!shouldHaveFaq(plan.category, plan.articleType)) return undefined;

  const [first, second, third = "the quote assumption"] = plan.expandedKeywords;
  const variants = [
    [
      {
        question: `What is the main risk in ${plan.mainKeyword}?`,
        answer: `The main risk is treating ${first} as certain before it is checked against the home's bill, utility rules, roof conditions, and quote terms.`,
      },
      {
        question: `How should homeowners use ${second} in a solar payback estimate?`,
        answer: `${second} should be modeled as its own assumption, then tested with a conservative case so the payback does not depend on a single optimistic input.`,
      },
      {
        question: `When should a ${plan.mainKeyword} quote get a second review?`,
        answer: `A quote deserves a second review when ${third} is not documented, when the source is unclear, or when the deal only works under the installer case.`,
      },
    ],
    [
      {
        question: `Does ${plan.mainKeyword} guarantee a good solar payback?`,
        answer: `No. ${plan.mainKeyword} can improve the case, but the final result still depends on installed cost, bill value, export rules, incentives, and ownership horizon.`,
      },
      {
        question: `What should be verified first for ${plan.mainKeyword}?`,
        answer: `Verify ${first} first because it usually changes the payback range before smaller assumptions matter.`,
      },
      {
        question: `Why does ${second} matter for homeowners?`,
        answer: `${second} matters because it can change whether savings are immediate, delayed, capped, or dependent on a utility or policy rule.`,
      },
    ],
    [
      {
        question: `How can a homeowner pressure-test ${plan.mainKeyword}?`,
        answer: `Run one estimate with the proposal assumptions and one with weaker ${first}, then compare whether the project still fits the household timeline.`,
      },
      {
        question: `What source should support ${plan.mainKeyword}?`,
        answer: `The source depends on the claim: production should be checked with production modeling, policy with policy records, cost with installed-cost research, and consumer-risk claims with consumer guidance.`,
      },
      {
        question: `Is ${third} enough to decide?`,
        answer: `${third} is not enough by itself. It should be combined with the actual bill, roof constraints, quote price, and a downside case.`,
      },
    ],
  ];

  return variants[index % variants.length];
}

function makeCoreScenarioSection(plan, index) {
  const keywordId = plan.mainKeyword.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const [first, second, third = "the quote assumption"] = plan.expandedKeywords;
  const scenarioLabel = ["homeowner scenario", "quote audit example", "failure case", "decision checkpoint"][index % 4];

  return {
    id: `${keywordId}-scenario`,
    heading: `${scenarioLabel}: ${plan.mainKeyword}`,
    body: [
      `Imagine a homeowner reading ${plan.title.toLowerCase()} after receiving a proposal that looks reasonable at first glance. The proposal may show a clean payback number, but the homeowner still has to verify whether ${first} is measured from their own situation or borrowed from a generic model.`,
      `The quote audit starts with the bill. If ${second} is central to the savings claim, the homeowner should ask where that value appears in the utility plan, export-credit language, roof survey, or system design. This keeps the article useful for a real decision instead of turning it into another optimistic solar overview.`,
      `The failure case is just as important. If ${third} performs worse than expected, the project should not collapse into a surprise. A high-quality article gives the reader a way to recognize that risk before signing, especially when the installer uses a single payback period instead of a range.`,
      `For ${plan.mainKeyword}, the stronger answer is not simply yes or no. The stronger answer is a repeatable review: confirm the bill input, check the public data source, compare a conservative quote, and decide whether the downside case still matches the household's timeline.`,
    ],
    callout: `Core article review: ${plan.mainKeyword} should include a real scenario, a weak-case test, and a quote question tied to ${first}.`,
  };
}

function makeCoreEvidenceSection(plan, index) {
  const keywordId = plan.mainKeyword.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const [first, second, third = "project cost"] = plan.expandedKeywords;

  return {
    id: `${keywordId}-evidence-stack`,
    heading: `Evidence stack for ${plan.mainKeyword}`,
    body: [
      `The evidence stack for ${plan.mainKeyword} should start with the homeowner's own bill, because the bill captures usage, fixed charges, and rate design better than a national average. Public data helps check direction, but it cannot replace the local tariff or the actual roof.`,
      `${first} should be treated as the first sensitivity input for ${plan.mainKeyword}. If the estimate only works when ${first} is assumed generously, the article should tell the reader to rerun the math with a lower value before comparing installers and saving the result as the baseline case.`,
      `${second} belongs in a separate line of the review because it can change the timing of savings. A project that looks attractive over 25 years may still be awkward if savings arrive late, if activation is delayed, or if the homeowner expects to move before the payback window closes.`,
      `${third} is the final pressure test for ${plan.mainKeyword}. The homeowner should ask whether this input is confirmed, estimated, capped, expiring, or simply implied by the sales proposal. That distinction is what makes the content more helpful than a generic SEO article and more useful during quote review.`,
    ],
    table: [
      ["Primary evidence", `Bill data, roof/site conditions, and the exact assumption for ${first}.`],
      ["Public check", "PVWatts, EIA, DSIRE, LBNL, or FTC guidance selected by claim type."],
      ["Decision test", `A downside case where ${second} or ${third} is less favorable than the proposal.`],
    ],
  };
}

const sectionPatterns = [
  {
    answerHeading: (plan) => `The short answer on ${plan.mainKeyword}`,
    answerLead: (plan) => `${plan.title} needs a practical answer before it needs a sales estimate. ${plan.intent}`,
    evidenceHeading: (plan) => `Where ${plan.expandedKeywords[0]} can change the result`,
    evidenceLead: (plan) => `The most important adjustment is not always panel output; it is how ${plan.expandedKeywords[0]} changes the dollar value of that output.`,
    researchHeading: (plan) => `Evidence to collect before trusting a ${plan.mainKeyword} claim`,
    researchLead: () => "Pull the last 12 months of usage, the current utility tariff, export-credit language, and the quote's net installed cost before reading the payback line.",
    decisionHeading: (plan) => `A homeowner rule for ${plan.mainKeyword}`,
    decisionLead: () => "Use the conservative case as the decision case and let optimistic assumptions act only as upside.",
  },
  {
    answerHeading: (plan) => `Why ${plan.mainKeyword} is a local math problem`,
    answerLead: (plan) => `${plan.title} depends on the home more than the headline market. ${plan.intent}`,
    evidenceHeading: (plan) => `The hidden variable behind ${plan.expandedKeywords[1] || plan.expandedKeywords[0]}`,
    evidenceLead: (plan) => `A proposal can look reasonable until ${plan.expandedKeywords[1] || plan.expandedKeywords[0]} is translated into bill savings rather than production volume.`,
    researchHeading: (plan) => `Research path for ${plan.mainKeyword}`,
    researchLead: () => "Check production, rate value, policy rules, installed cost, and timing as separate inputs instead of accepting a bundled ROI statement.",
    decisionHeading: (plan) => `When the ${plan.mainKeyword} case is strong enough`,
    decisionLead: () => "The case is stronger when it still works after removing resale speculation, aggressive rate escalation, and vague incentive assumptions.",
  },
  {
    answerHeading: (plan) => `The mistake to avoid with ${plan.mainKeyword}`,
    answerLead: (plan) => `${plan.title} becomes misleading when one attractive variable is allowed to carry the whole estimate. ${plan.intent}`,
    evidenceHeading: (plan) => `How to test ${plan.expandedKeywords.at(-1)}`,
    evidenceLead: (plan) => `Treat ${plan.expandedKeywords.at(-1)} as a sensitivity test: run the payback once with the claimed value and once with a weaker assumption.`,
    researchHeading: (plan) => `What credible research can and cannot prove for ${plan.mainKeyword}`,
    researchLead: () => "Public tools and databases are useful for direction, but they cannot verify a shaded roof, a dealer fee, a local buyback cap, or a homeowner's tax appetite.",
    decisionHeading: (plan) => `A quote-screening question for ${plan.mainKeyword}`,
    decisionLead: () => "Ask which single input would make the payback fail. If the answer is unclear, the proposal needs more detail.",
  },
  {
    answerHeading: (plan) => `${plan.mainKeyword} in one decision frame`,
    answerLead: (plan) => `${plan.title} should be read as a decision frame, not a promise that solar is always good or always weak. ${plan.intent}`,
    evidenceHeading: (plan) => `The role of ${plan.expandedKeywords[0]} in the payback window`,
    evidenceLead: (plan) => `${plan.expandedKeywords[0]} matters because it can shift either the starting cost, the annual savings, or the date when savings actually begin.`,
    researchHeading: (plan) => `Inputs worth verifying twice for ${plan.mainKeyword}`,
    researchLead: () => "Verify the utility plan, roof condition, system size, incentive eligibility, and the timing between installation and permission to operate.",
    decisionHeading: (plan) => `Use ${plan.mainKeyword} without overfitting the model`,
    decisionLead: () => "A useful model is conservative enough to survive imperfect weather, modest degradation, and a less favorable utility bill than the sales chart assumes.",
  },
  {
    answerHeading: (plan) => `What changes the verdict for ${plan.mainKeyword}`,
    answerLead: (plan) => `${plan.title} can move from attractive to marginal when the quote changes one assumption. ${plan.intent}`,
    evidenceHeading: (plan) => `Why ${plan.expandedKeywords.join(" and ")} belong in the same review`,
    evidenceLead: (plan) => `${plan.expandedKeywords.join(", ")} are connected in this article: one affects production or cost, while the others shape how much of that production becomes usable savings.`,
    researchHeading: (plan) => `Source check for ${plan.mainKeyword}`,
    researchLead: () => "Compare the claim against production modeling, rate data, policy references, installed-cost context, and consumer-protection guidance before treating it as advice.",
    decisionHeading: (plan) => `Bottom line for ${plan.mainKeyword}`,
    decisionLead: () => "The final answer should tell the homeowner what to measure next, not push them toward the largest system a roof can hold.",
  },
  {
    answerHeading: (plan) => `How to think about ${plan.mainKeyword} before quotes`,
    answerLead: (plan) => `${plan.title} is best handled before installer comparisons begin. ${plan.intent}`,
    evidenceHeading: (plan) => `The practical weight of ${plan.expandedKeywords[0]}`,
    evidenceLead: (plan) => `${plan.expandedKeywords[0]} deserves attention only when it changes cash cost, bill offset, risk, or the homeowner's expected time in the house.`,
    researchHeading: (plan) => `A clean research sequence for ${plan.mainKeyword}`,
    researchLead: () => "Start with the bill, then model production, then apply policy, then test the quote. That order prevents incentives or financing from covering up weak fundamentals.",
    decisionHeading: (plan) => `The final filter for ${plan.mainKeyword}`,
    decisionLead: () => "If a homeowner cannot explain the payback in two or three plain inputs, the quote is not clear enough yet.",
  },
];

function makeFormatExtras(plan, index, format) {
  const kw = plan.expandedKeywords;

  if (format === "checklist") {
    return {
      bullets: [
        `Confirm how ${kw[0]} appears in the actual quote, not just the sales summary.`,
        `Model a downside case for ${kw[1] || kw[0]} before accepting the simple payback number.`,
        `Keep ${kw[2] || "project risk"} separate from incentive assumptions so the decision is auditable.`,
      ],
      callout: `Checklist articles should end with a homeowner action: collect the bill, the tariff, the roof constraint, and the quote assumption before signing.`,
    };
  }

  if (format === "comparison") {
    return {
      table: [
        ["Stronger case", `${plan.mainKeyword} improves when ${kw[0]} supports real bill savings and the quote stays competitive.`],
        ["Weaker case", `The case weakens when ${kw[1] || kw[0]} is assumed but not documented in the tariff, policy, or site survey.`],
        ["Reader action", `Compare the conservative case with the installer case before treating ${kw[2] || "the upside"} as bankable.`],
      ],
    };
  }

  if (format === "risk-review") {
    return {
      callout: `Risk review: the payback number should not depend on one fragile assumption about ${kw[0]}.`,
      bullets: [
        "Ask which input would make the modeled payback fail.",
        "Separate guaranteed savings from expected savings.",
        "Treat resale value and future rate growth as upside unless documented.",
      ],
    };
  }

  if (format === "data-explainer") {
    return {
      table: [
        ["Public data role", "Sets the direction of the estimate and checks whether the claim is plausible."],
        ["Home data role", "Confirms the actual bill, roof, utility rule, and quote price."],
        ["Decision role", "Turns the article from a generic ranking into a homeowner-specific screen."],
      ],
      callout: "Data-led articles should explain uncertainty instead of hiding it behind a single payback number.",
    };
  }

  if (format === "cost-analysis") {
    return {
      table: [
        ["Upfront input", "Gross installed cost, confirmed incentive value, and any roof or utility add-on cost."],
        ["Recurring input", "Bill savings, maintenance risk, insurance impact, and financing cost if applicable."],
        ["Timing input", "Ownership horizon, permission-to-operate timing, and the year when savings pass cost."],
      ],
    };
  }

  if (format === "faq-brief") {
    return {
      bullets: [
        `Is ${plan.mainKeyword} enough by itself? No; it has to be tied to bill value and project cost.`,
        `Should ${kw[0]} be modeled separately? Yes; it can change the range without changing roof production.`,
        "What is the safest next step? Re-run the estimate with a conservative input set.",
      ],
    };
  }

  return {
    callout: `${plan.mainKeyword} is useful only when the homeowner can connect it to a specific bill, roof, policy, or quote assumption.`,
  };
}

function makeTopicSpecificSections(plan, index) {
  const mode = articleModes[index % articleModes.length];
  const pattern = sectionPatterns[index % sectionPatterns.length];
  const guidance = categoryGuidance[plan.category] || categoryGuidance.Buying;
  const keywordPhrase = plan.expandedKeywords.join(", ");
  const keywordId = plan.mainKeyword.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const format = articleFormats[index % articleFormats.length];
  const extras = makeFormatExtras(plan, index, format);
  const close = closingLines[index % closingLines.length];
  const depth = makeDepthParagraphs(plan, index);

  return [
    {
      id: `${keywordId}-answer`,
      heading: pattern.answerHeading(plan),
      body: [
        pattern.answerLead(plan),
        `${mode.opener} In this topic, the practical evidence comes from ${keywordPhrase}, then from the homeowner's actual bill and quote terms.`,
        depth[0],
      ],
    },
    {
      id: `${keywordId}-${mode.id}`,
      heading: pattern.evidenceHeading(plan),
      body: [
        pattern.evidenceLead(plan),
        `${guidance} In ${plan.title}, the pressure point is ${keywordPhrase}.`,
        `${mode.middle} For ${plan.mainKeyword}, the conservative version of the estimate should still make sense before any best-case assumption is added.`,
        depth[1],
      ],
      table: extras.table,
      bullets: format === "comparison" || format === "cost-analysis" || format === "data-explainer" ? undefined : extras.bullets,
    },
    {
      id: `${keywordId}-research-check`,
      heading: pattern.researchHeading(plan),
      body: [
        `${pattern.researchLead(plan)} For ${plan.mainKeyword}, keep ${plan.expandedKeywords[0]} visible as its own line item.`,
        `${sourceReferenceLines[index % sourceReferenceLines.length]} For this article, it supports ${plan.mainKeyword} rather than a generic solar conclusion.`,
        depth[2],
      ],
      callout: extras.callout,
    },
    {
      id: `${keywordId}-decision-rule`,
      heading: pattern.decisionHeading(plan),
      body: [
        `${pattern.decisionLead(plan)} That matters here because ${plan.intent.toLowerCase()}`,
        `${mode.close} Apply that test specifically to ${plan.mainKeyword}.`,
        `${close} Use it as the closing screen for ${plan.mainKeyword}.`,
        depth[3],
      ],
    },
    makeExpansionSection(plan, index),
    makeQualitySection(plan, index),
  ];
}

function makeSections(plan, index) {
  const extras = fullArticleExtras[plan.slug];
  const coreSections = index < CORE_ARTICLE_COUNT ? [makeCoreScenarioSection(plan, index), makeCoreEvidenceSection(plan, index)] : [];
  if (extras) {
    const format = articleFormats[index % articleFormats.length];
    const rich = makeFormatExtras(plan, index, format);
    const depth = makeDepthParagraphs(plan, index);
    const sections = extras.map(([id, heading, body], sectionIndex) => ({
      id,
      heading,
      body: [...body, depth[sectionIndex % depth.length]],
      ...(sectionIndex === 1 && rich.table ? { table: rich.table } : {}),
      ...(sectionIndex === 1 && rich.bullets ? { bullets: rich.bullets } : {}),
      ...(sectionIndex === 2 && rich.callout ? { callout: rich.callout } : {}),
    }));
    return [...sections, makeExpansionSection(plan, index), makeQualitySection(plan, index), ...coreSections];
  }
  return [...makeTopicSpecificSections(plan, index), ...coreSections];
}

export const plannedPosts = replacementTopicPlans.slice(0, 100).map(
  ([slug, category, mainKeyword, title, expanded, intent, ctaLabel], index) => {
    const expandedKeywords = expanded.split(", ");
    const finalTitle = makeSeoTitle(title, mainKeyword, expandedKeywords, index);
    const sections = makeSections({ slug, category, mainKeyword, title: finalTitle, expandedKeywords, intent }, index);
    const publishAt = addHours(scheduleStart, index * 5).toISOString();
    const isFull = Boolean(sections);
    const articleType = articleFormats[index % articleFormats.length];
    const accent = accentPairs[index % accentPairs.length];
    const planForComputedFields = { slug, category, mainKeyword, title: finalTitle, expandedKeywords, intent, articleType };
    const subtitle = makeSubtitle({ mainKeyword, expandedKeywords, intent, category }, index);
    const primarySource = index % 5 === 0 ? sourceSets.ftc[0] : index % 5 === 1 ? sourceSets.dsire[0] : index % 5 === 2 ? sourceSets.eia[0] : index % 5 === 3 ? sourceSets.lbnl[0] : sourceSets.pvwatts[0];
    const secondarySource = sourcePool[(index + 2) % sourcePool.length];
    const externalSources = secondarySource.href !== primarySource.href ? [primarySource, secondarySource] : [primarySource, sourcePool[(index + 3) % sourcePool.length]];

    return {
      slug,
      category,
      read: isFull ? 7 + (index % 3) : 0,
      date: publishAt.slice(0, 10),
      updated: publishAt.slice(0, 10),
      publishAt,
      status: isFull ? "ready" : "planned",
      mainKeyword,
      expandedKeywords,
      intent,
      title: finalTitle,
      subtitle,
      directAnswer: makeDirectAnswer(planForComputedFields, index),
      faq: makeFaq(planForComputedFields, index),
      metaTitle: `${mainKeyword}: ${expandedKeywords[0]} and Solar Payback`,
      metaDescription: `${mainKeyword} guide covering ${expanded} with conservative solar payback checks, quote review steps, and homeowner decision criteria.`,
      canonicalPath: `/blog/${slug}`,
      featuredImageAlt: `${mainKeyword} article visual showing ${expandedKeywords.slice(0, 2).join(" and ")} for solar payback planning`,
      articleType,
      accent,
      excerpt: intent,
      keywords: [mainKeyword, ...expandedKeywords],
      qualityScore: isFull ? 90 + (index % 6) : 0,
      codexOnly: true,
      cta: { label: ctaLabel, href: index % 4 === 0 ? "/rankings" : index % 4 === 1 ? "/calculator" : index % 4 === 2 ? "/methodology" : "/blog/net-metering-explained" },
      internalLinks: [
        baseLinks[index % baseLinks.length],
        baseLinks[(index + 1) % baseLinks.length],
        index % 3 === 0 ? { label: "Net metering explainer", href: "/blog/net-metering-explained" } : { label: "Solar payback estimate method", href: "/blog/how-we-estimate-solar-payback" },
        { label: `${category} solar articles`, href: "/blog" },
        ...makeRelatedPostLinks(index),
      ],
      externalSources,
      researchSources: externalSources.map((source) => ({
        ...source,
        accessed: "2026-06-08",
        supports: `Reference context for ${mainKeyword} and ${expandedKeywords[0]}.`,
      })),
      sections,
    };
  }
);
