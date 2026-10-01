import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import { createPageMetadata } from "@/utils/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "로그인",
  description: "타이포그래피 기초 북마크에 로그인하세요.",
  noIndex: true,
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const initialError = error === "oauth" ? "카카오 로그인에 실패했습니다. 다시 시도해 주세요." : "";

  return <AuthForm mode="login" initialError={initialError} />;
}
