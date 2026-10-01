import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import { createPageMetadata } from "@/utils/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "회원가입",
  description: "계정을 만들고 나만의 북마크 컬렉션을 시작하세요.",
  noIndex: true,
});

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
