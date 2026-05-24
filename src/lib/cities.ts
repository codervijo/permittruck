export interface CityData {
  slug: string;
  name: string;
  state: string;
  agency: string;
  feeRange: string;
  processingTime: string;
  renewal: string;
  notes: string;
}

export const CITIES: CityData[] = [
  { slug: "los-angeles", name: "Los Angeles", state: "CA", agency: "LA County Department of Public Health", feeRange: "$300–$800", processingTime: "2–4 weeks", renewal: "Annual", notes: "Requires commissary agreement and vehicle inspection." },
  { slug: "san-francisco", name: "San Francisco", state: "CA", agency: "SF Department of Public Health", feeRange: "$400–$1,200", processingTime: "4–8 weeks", renewal: "Annual", notes: "DPH Mobile Food Facility permit plus MFF location approval." },
  { slug: "san-diego", name: "San Diego", state: "CA", agency: "San Diego County DEHQ", feeRange: "$350–$900", processingTime: "3–5 weeks", renewal: "Annual", notes: "Plan check required for new builds; commissary letter required." },
  { slug: "austin", name: "Austin", state: "TX", agency: "Austin Public Health", feeRange: "$258–$594", processingTime: "2–3 weeks", renewal: "Annual", notes: "Mobile food vendor permit and central preparation facility required." },
  { slug: "houston", name: "Houston", state: "TX", agency: "Houston Health Department", feeRange: "$300–$700", processingTime: "2–4 weeks", renewal: "Annual", notes: "Mobile Food Unit permit, commissary, and propane inspection." },
  { slug: "dallas", name: "Dallas", state: "TX", agency: "Dallas Code Compliance", feeRange: "$285–$685", processingTime: "2–4 weeks", renewal: "Annual", notes: "Mobile food establishment permit and food manager certification." },
  { slug: "new-york", name: "New York", state: "NY", agency: "NYC DOHMH", feeRange: "$200–$1,000+", processingTime: "Months (waitlist)", renewal: "Biennial", notes: "Mobile Food Vendor License has a long waitlist; processing varies." },
  { slug: "chicago", name: "Chicago", state: "IL", agency: "Chicago Department of Public Health", feeRange: "$700–$1,000", processingTime: "4–6 weeks", renewal: "Two years", notes: "Mobile Food Preparer or Dispenser license required." },
  { slug: "phoenix", name: "Phoenix", state: "AZ", agency: "Maricopa County Environmental Services", feeRange: "$250–$650", processingTime: "2–3 weeks", renewal: "Annual", notes: "Mobile food permit plus city TPT tax license." },
  { slug: "seattle", name: "Seattle", state: "WA", agency: "Public Health – Seattle & King County", feeRange: "$400–$1,100", processingTime: "3–6 weeks", renewal: "Annual", notes: "Mobile Food Unit permit and commissary required." },
  { slug: "portland", name: "Portland", state: "OR", agency: "Multnomah County Environmental Health", feeRange: "$300–$750", processingTime: "2–4 weeks", renewal: "Annual", notes: "Mobile Food Unit license plus city business license." },
  { slug: "denver", name: "Denver", state: "CO", agency: "Denver Department of Public Health & Environment", feeRange: "$300–$700", processingTime: "2–4 weeks", renewal: "Annual", notes: "Retail food mobile license and city sales tax license." },
  { slug: "miami", name: "Miami", state: "FL", agency: "Florida DBPR", feeRange: "$347–$650", processingTime: "2–4 weeks", renewal: "Annual", notes: "Mobile food dispensing vehicle license from state DBPR." },
  { slug: "atlanta", name: "Atlanta", state: "GA", agency: "Fulton County Board of Health", feeRange: "$250–$600", processingTime: "2–4 weeks", renewal: "Annual", notes: "Mobile food service permit and base of operations." },
  { slug: "boston", name: "Boston", state: "MA", agency: "Boston Inspectional Services", feeRange: "$300–$850", processingTime: "4–8 weeks", renewal: "Annual", notes: "Mobile food truck permit with site-specific approvals." },
];

export function getCity(slug: string): CityData | undefined {
  return CITIES.find((c) => c.slug === slug);
}
