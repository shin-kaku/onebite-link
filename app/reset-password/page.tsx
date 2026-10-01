import type { Metadata } from "next";
import { PasswordResetForm } from "@/components/PasswordResetForm";

export const metadata: Metadata = {
  title: "새 비밀번호 설정 | 타이포그래피 기초 북마크",
};

export default function ResetPasswordPage() {
  return <PasswordResetForm mode="update" />;
}
