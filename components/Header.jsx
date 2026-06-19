import Link from "next/link";
import { MobileMenu } from "./MobileMenu";
import { NavActionLink } from "./NavActionLink";
import { NavLinks } from "./NavLinks";
import { SunMark } from "./SunMark";

export const navigationLinks = [
  { href: "/rankings", label: "Rankings" },
  { href: "/#score", label: "Worth-It Score" },
  { href: "/blog", label: "Journal" },
  { href: "/methodology", label: "Methodology" },
];

export function Header() {
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link className="wordmark" href="/" aria-label="Solar Payback Map home">
          <SunMark />
          Solar Payback Map
        </Link>
        <NavLinks links={navigationLinks} />
        <div className="nav-spacer" />
        <NavActionLink href="/calculator">
          Calculator
        </NavActionLink>
        <MobileMenu links={navigationLinks} />
      </div>
    </header>
  );
}
