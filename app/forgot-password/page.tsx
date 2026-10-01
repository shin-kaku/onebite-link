import type { Metadata } from "next";
import { PasswordResetForm } from "@/components/PasswordResetForm";
import { createPageMetadata } from "@/utils/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "비밀번호 찾기",
  description: "비밀번호를 재설정할 수 있는 링크를 요청하세요.",
  noIndex: true,
});

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const initialError = error === "invalid-link" ? "리셋 링크가 만료되었거나 올바르지 않습니다. 다시 요청해 주세요." : "";

  return <PasswordResetForm mode="request" initialError={initialError} />;
}
