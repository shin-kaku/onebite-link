import type { Metadata } from "next";
import { RecoveryConfirmation } from "@/components/RecoveryConfirmation";
import { createPageMetadata } from "@/utils/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "비밀번호 재설정 확인",
    description: "비밀번호 재설정 요청을 안전하게 확인합니다.",
    noIndex: true,
  }),
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
