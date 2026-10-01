import type { Metadata } from "next";
import { RecoveryConfirmation } from "@/components/RecoveryConfirmation";

export const metadata: Metadata = {
  title: "비밀번호 재설정 확인 | 타이포그래피 기초 북마크",
  referrer: "no-referrer",
};

export default async function ConfirmRecoveryPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string }>;
}) {
  const { token_hash: tokenHash = "" } = await searchParams;

  return <RecoveryConfirmation tokenHash={tokenHash} />;
}
