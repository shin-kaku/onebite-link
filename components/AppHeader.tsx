import Link from "next/link";
import { LinkLogoIcon } from "./icons";

export function AppHeader() {
  return (
    <header className="app-header">
      <Link
        className="brand"
        href="/"
        aria-label="타이포그래피 기초 수업 링크 홈"
      >
        <span className="brand-mark">
          <LinkLogoIcon />
        </span>
        <span>타이포그래피 기초 수업 링크</span>
      </Link>
      <Link className="new-link-button" href="/new">
        <span aria-hidden="true">+</span>새 링크
      </Link>
    </header>
  );
}
