import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "회원가입 | 타이포그래피 기초 북마크",
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
