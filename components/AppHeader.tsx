"use client";

import Link from "next/link";
import { TypographyLogoIcon } from "./icons";
import { useFolders } from "./FolderProvider";

export function AppHeader() {
  const { openFolderModal } = useFolders();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] px-5 backdrop-blur-md md:px-8">
      <Link
        className="flex items-center gap-2.5 text-[16px] font-semibold tracking-[-0.025em]"
        href="/"
        aria-label="타이포그래피 기초 북마크 홈"
      >
        <span className="grid size-8 place-items-center rounded-lg bg-[var(--text)] p-1.5 text-white">
          <TypographyLogoIcon />
        </span>
        <span>타이포그래피 기초 북마크</span>
      </Link>
      <div className="flex items-center gap-2">
        <button className="secondary-hover flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3.5 text-[14px] font-semibold" type="button" onClick={openFolderModal}>
          <span className="text-lg font-normal leading-none" aria-hidden="true">+</span><span className="hidden sm:inline">새 폴더</span><span className="sm:hidden">폴더</span>
        </button>
        <Link className="primary-hover flex h-9 items-center gap-1.5 rounded-md bg-[var(--accent)] px-3.5 text-[14px] font-semibold text-white" href="/new">
          <span className="text-lg font-normal leading-none" aria-hidden="true">+</span><span className="hidden sm:inline">새 링크</span><span className="sm:hidden">링크</span>
        </Link>
      </div>
    </header>
  );
}
