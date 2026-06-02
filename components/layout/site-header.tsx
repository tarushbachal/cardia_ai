import Link from "next/link";
import { Wordmark } from "./wordmark";
import { Button } from "@/components/ui/button";

/** Quiet, sticky header. Calm — never a nav bar competing with the content. */
export function SiteHeader() {
  return (
    <header className="border-border-hair/70 bg-canvas/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          aria-label="Cardia AI — home"
          className="rounded-md transition-opacity hover:opacity-80"
        >
          <Wordmark />
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Primary">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/#how-it-works">How it works</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/assessment">Start</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
