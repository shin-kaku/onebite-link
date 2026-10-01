import type { Metadata } from "next";
import { PasswordResetForm } from "@/components/PasswordResetForm";
import { createPageMetadata } from "@/utils/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "새 비밀번호 설정",
  description: "타이포그래피 기초 북마크 계정의 새 비밀번호를 설정하세요.",
  noIndex: true,
});

export default function ResetPasswordPage() {
  return <PasswordResetForm mode="update" />;
}
