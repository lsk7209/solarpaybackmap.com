"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function isActive(pathname, href) {
  if (href === "/#score") return false;
  if (href === "/blog") return pathname === "/blog" || pathname.startsWith("/blog/");
  return pathname === href;
}

export function NavLinks({ links }) {
  const pathname = usePathname();

  return (
    <nav className="nav-links" aria-label="Primary navigation" id="primary-navigation">
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
