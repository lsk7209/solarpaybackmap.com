import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <nav className="links" aria-label="Footer navigation">
          <ul>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/editorial-policy">Editorial policy</Link></li>
            <li><Link href="/authors/solarpaybackmap-editorial">Author profile</Link></li>
            <li><Link href="/content-manifest">Content manifest</Link></li>
            <li><Link href="/methodology">Methodology</Link></li>
            <li><Link href="/feed.xml">RSS feed</Link></li>
            <li><Link href="/feed.json">JSON feed</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/legal#privacy">Legal privacy</Link></li>
            <li><Link href="/legal#advertising">Advertising and cookies</Link></li>
            <li><Link href="/legal#disclaimer">Disclaimer</Link></li>
            <li><Link href="/legal#attribution">Data attribution</Link></li>
          </ul>
        </nav>
        <dl className="footer-trust" aria-label="Solar Payback Map trust summary">
          <div>
            <dt>Publisher</dt>
            <dd>2026 Solar Payback Map - Independent - No lead sales</dd>
          </div>
          <div>
            <dt>Data sources</dt>
            <dd>NREL - EIA - LBNL - DSIRE - last reviewed <time dateTime="2026-05">May 2026</time></dd>
          </div>
        </dl>
      </div>
    </footer>
  );
}
