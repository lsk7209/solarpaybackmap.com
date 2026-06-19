"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isActive } from "./NavLinks";

export function MobileMenu({ links }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const firstLinkRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) firstLinkRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        className="btn btn-ghost btn-sm nav-toggle"
        type="button"
        aria-label={open ? "Close mobile navigation" : "Open mobile navigation"}
        aria-controls="mobile-navigation"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
      <nav
        aria-label="Mobile navigation"
        className={`mobile-menu ${open ? "open" : ""}`}
        hidden={!open}
        id="mobile-navigation"
      >
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                ref={link === links[0] ? firstLinkRef : undefined}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/calculator"
              aria-current={pathname === "/calculator" ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              Calculator
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
