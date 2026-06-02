import Link from "next/link";
import { Wordmark } from "./wordmark";
import { Disclaimer } from "./disclaimer";
import { REG } from "@/lib/content/regulatory";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-border-hair bg-surface mt-24 border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm space-y-3">
            <Wordmark />
            <p className="text-ink-muted text-sm leading-relaxed">{REG.sourcesNote}</p>
          </div>
          <nav aria-label="Footer" className="text-sm">
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-ink-muted hover:text-accent-strong transition-colors"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="/assessment"
                  className="text-ink-muted hover:text-accent-strong transition-colors"
                >
                  Start an assessment
                </Link>
              </li>
              <li className="text-ink-subtle pt-1 text-xs">
                Accounts, saved history &amp; AI explanations — coming soon
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-border-hair mt-10 space-y-3 border-t pt-8">
          <Disclaimer variant="footnote" />
          <Disclaimer variant="footnote">{REG.notADevice}</Disclaimer>
          <p className="text-ink-subtle text-xs">
            © {year} Cardia AI · {REG.privacyShort}
          </p>
        </div>
      </div>
    </footer>
  );
}
