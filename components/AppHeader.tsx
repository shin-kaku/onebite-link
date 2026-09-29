import Link from "next/link";
import { LinkLogoIcon } from "./icons";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] px-5 backdrop-blur-md md:px-8">
      <Link
        className="flex items-center gap-2.5 text-[16px] font-semibold tracking-[-0.025em]"
        href="/"
        aria-label="타이포그래피 기초 북마크 홈"
      >
        <span className="grid size-8 place-items-center rounded-lg bg-[var(--accent)] p-2 text-white">
          <LinkLogoIcon />
        </span>
        <span>타이포그래피 기초 북마크</span>
      </Link>
      <Link className="primary-hover flex h-9 items-center gap-1.5 rounded-md bg-[var(--accent)] px-3.5 text-[14px] font-semibold text-white" href="/new">
        <span className="text-lg font-normal leading-none" aria-hidden="true">+</span>새 링크
      </Link>
    </header>
  );
}
