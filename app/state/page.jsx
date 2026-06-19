import { permanentRedirect } from "next/navigation";

export default function LegacyStatePage() {
  permanentRedirect("/solar/california");
}
