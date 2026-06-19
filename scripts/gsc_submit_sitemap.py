"""Submit and verify a sitemap in Google Search Console.

This script intentionally reads credential paths from environment variables and
prints only site/sitemap status, never token contents.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import tempfile
import time
from pathlib import Path
from urllib.parse import urlparse

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


SCOPES = ["https://www.googleapis.com/auth/webmasters"]


def normalize_site_url(value: str) -> str:
    if value.startswith("sc-domain:"):
        return value
    return value if value.endswith("/") else f"{value}/"


def same_origin_or_domain_property(site_url: str, sitemap_url: str) -> bool:
    if site_url.startswith("sc-domain:"):
        domain = site_url.replace("sc-domain:", "")
        return urlparse(sitemap_url).hostname == domain or urlparse(sitemap_url).hostname.endswith(f".{domain}")
    site = urlparse(site_url)
    sitemap = urlparse(sitemap_url)
    return site.scheme == sitemap.scheme and site.netloc == sitemap.netloc


def load_credentials(token_file: Path, client_secrets_file: Path, write_token: bool) -> Credentials:
    with token_file.open(encoding="utf-8") as handle:
        token_data = json.load(handle)
    with client_secrets_file.open(encoding="utf-8") as handle:
        client_data = json.load(handle)["installed"]

    token_data.setdefault("client_id", client_data["client_id"])
    token_data.setdefault("client_secret", client_data["client_secret"])
    token_data.setdefault("token_uri", "https://oauth2.googleapis.com/token")
    token_data.setdefault("universe_domain", "googleapis.com")
    if "token" not in token_data and "access_token" in token_data:
        token_data["token"] = token_data["access_token"]

    with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".json", delete=False) as tmp:
        json.dump(token_data, tmp)
        tmp_path = tmp.name
    try:
        creds = Credentials.from_authorized_user_file(tmp_path, SCOPES)
    finally:
        try:
            os.remove(tmp_path)
        except OSError:
            pass

    if not creds.valid and creds.expired and creds.refresh_token:
        creds.refresh(Request())
        refreshed = json.loads(creds.to_json())
        refreshed["access_token"] = refreshed.get("token", "")
        if write_token:
            with token_file.open("w", encoding="utf-8") as handle:
                json.dump(refreshed, handle, indent=2)

    return creds


def main() -> int:
    parser = argparse.ArgumentParser(description="Submit sitemap.xml to Google Search Console.")
    parser.add_argument("--site-url", default=os.environ.get("GSC_SITE_URL"))
    parser.add_argument("--sitemap-url", default=os.environ.get("GSC_SITEMAP_URL"))
    parser.add_argument("--token-file", default=os.environ.get("GSC_TOKEN_FILE", r"D:\env\gsc_token.json"))
    parser.add_argument(
        "--client-secrets-file",
        default=os.environ.get("GSC_CLIENT_SECRETS_FILE", r"D:\env\adsense_oauth_client.json"),
    )
    parser.add_argument("--wait-seconds", type=int, default=30)
    parser.add_argument("--poll-attempts", type=int, default=10)
    parser.add_argument("--no-write-token", action="store_true")
    args = parser.parse_args()

    if not args.site_url or not args.sitemap_url:
        print("Missing GSC_SITE_URL or GSC_SITEMAP_URL.", file=sys.stderr)
        return 2

    site_url = normalize_site_url(args.site_url)
    sitemap_url = args.sitemap_url
    token_file = Path(args.token_file)
    client_secrets_file = Path(args.client_secrets_file)

    if not token_file.exists():
        print(f"Missing token file: {token_file}", file=sys.stderr)
        return 2
    if not client_secrets_file.exists():
        print(f"Missing OAuth client file: {client_secrets_file}", file=sys.stderr)
        return 2
    if not same_origin_or_domain_property(site_url, sitemap_url):
        print(f"GSC_SITE_URL and GSC_SITEMAP_URL do not match: {site_url} vs {sitemap_url}", file=sys.stderr)
        return 2

    creds = load_credentials(token_file, client_secrets_file, write_token=not args.no_write_token)
    service = build("webmasters", "v3", credentials=creds)

    sites = service.sites().list().execute().get("siteEntry", [])
    verified = {item["siteUrl"]: item.get("permissionLevel", "") for item in sites}
    if site_url not in verified:
        print(f"GSC property not found or not accessible: {site_url}", file=sys.stderr)
        print("Accessible verified properties include:")
        for item in sites:
            level = item.get("permissionLevel", "")
            if level in {"siteOwner", "siteFullUser", "siteRestrictedUser"}:
                print(f"  {item['siteUrl']} ({level})")
        return 3

    try:
        service.sitemaps().submit(siteUrl=site_url, feedpath=sitemap_url).execute()
        print(f"Submitted: {sitemap_url}")
    except HttpError as exc:
        print(f"GSC API error: {exc}", file=sys.stderr)
        return 4

    match = None
    for attempt in range(1, max(args.poll_attempts, 1) + 1):
        time.sleep(max(args.wait_seconds, 0) if attempt > 1 else 0)
        sitemaps = service.sitemaps().list(siteUrl=site_url).execute().get("sitemap", [])
        match = next((item for item in sitemaps if item.get("path") == sitemap_url), None)
        if not match:
            print(f"Attempt {attempt}: submitted sitemap not visible yet.")
            continue
        errors = int(match.get("errors", 0))
        warnings = int(match.get("warnings", 0))
        pending = bool(match.get("isPending", False))
        last_downloaded = match.get("lastDownloaded", "")
        print(
            f"Attempt {attempt}: visible=True downloaded={bool(last_downloaded)} "
            f"pending={pending} errors={errors} warnings={warnings}"
        )
        if errors == 0 and warnings == 0 and not pending and last_downloaded:
            break

    if not match:
        print("Submitted sitemap is not visible in GSC sitemap list yet.", file=sys.stderr)
        return 5

    errors = int(match.get("errors", 0))
    warnings = int(match.get("warnings", 0))
    pending = bool(match.get("isPending", False))
    last_downloaded = match.get("lastDownloaded", "")
    status = "SUCCESS" if errors == 0 and warnings == 0 and not pending and last_downloaded else "PENDING_OR_NEEDS_REVIEW"
    print(f"Status: {status}")
    print(f"Last downloaded: {last_downloaded or 'not downloaded yet'}")
    print(f"Errors: {errors}")
    print(f"Warnings: {warnings}")
    return 0 if status == "SUCCESS" else 6


if __name__ == "__main__":
    raise SystemExit(main())
