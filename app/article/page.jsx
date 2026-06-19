import { permanentRedirect } from "next/navigation";

export default function LegacyArticlePage() {
  permanentRedirect("/blog/how-we-estimate-solar-payback");
}
