import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "타이포그래피 기초 북마크",
  description: "좋아하는 링크를 한입에 모아보세요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
