import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "로그인 | 타이포그래피 기초 북마크",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const initialError = error === "oauth" ? "카카오 로그인에 실패했습니다. 다시 시도해 주세요." : "";

  return <AuthForm mode="login" initialError={initialError} />;
}
