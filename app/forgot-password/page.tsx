import type { Metadata } from "next";
import { PasswordResetForm } from "@/components/PasswordResetForm";

export const metadata: Metadata = {
  title: "비밀번호 찾기 | 타이포그래피 기초 북마크",
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const initialError = error === "invalid-link" ? "리셋 링크가 만료되었거나 올바르지 않습니다. 다시 요청해 주세요." : "";

  return <PasswordResetForm mode="request" initialError={initialError} />;
}
