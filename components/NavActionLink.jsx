"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavActionLink({ href, children }) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className="btn btn-ghost btn-sm"
      aria-current={pathname === href ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
