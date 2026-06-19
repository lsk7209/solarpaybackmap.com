import { permanentRedirect } from "next/navigation";

export default function LegacyCountyPage() {
  permanentRedirect("/solar/california/san-diego-county");
}
