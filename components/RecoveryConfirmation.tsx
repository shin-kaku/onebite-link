"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { TypographyLogoIcon } from "./icons";

export function RecoveryConfirmation({ tokenHash }: { tokenHash: string }) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleContinue = async () => {
    if (!tokenHash || isVerifying) return;

    setIsVerifying(true);
    setErrorMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "recovery",
      });

      if (error) {
        setErrorMessage("리셋 링크가 만료되었거나 이미 사용되었습니다. 새 링크를 요청해 주세요.");
        return;
      }

      router.replace("/reset-password");
      router.refresh();
    } catch {
      setErrorMessage("링크 확인에 실패했습니다. 인터넷 연결을 확인해 주세요.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      {errorMessage ? (
        <div className="fixed top-5 left-1/2 z-50 w-[calc(100%-32px)] max-w-[440px] -translate-x-1/2 rounded-lg border border-[var(--error)] bg-[var(--error-bg)] px-4 py-3 text-center text-[14px] font-medium text-[var(--error)]" role="alert" aria-live="assertive">
          {errorMessage}
        </div>
      ) : null}

      <section className="w-full max-w-[400px]" aria-labelledby="recovery-title">
        <Link className="auth-logo-hover mx-auto mb-10 flex w-fit items-center gap-3 rounded-lg px-2 py-1.5" href="/login" aria-label="로그인 페이지로 이동">
          <span className="grid size-10 place-items-center rounded-lg bg-[var(--text)] p-2 text-white"><TypographyLogoIcon /></span>
          <span className="text-[18px] font-semibold tracking-[-0.03em]">타이포그래피 기초 북마크</span>
        </Link>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 text-center sm:p-8">
          <h1 id="recovery-title" className="text-[30px] font-bold leading-[1.2] tracking-[-0.04em]">비밀번호 재설정</h1>
          <p className="mt-3 text-[14px] leading-[1.6] text-[var(--text-sub)]">
            아래 버튼을 누르면 리셋 링크를 확인하고<br />새 비밀번호 설정 페이지로 이동합니다.
          </p>

          <button className="primary-hover mt-8 h-11 w-full cursor-pointer rounded-md bg-[var(--accent)] px-4 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40" type="button" onClick={handleContinue} disabled={!tokenHash || isVerifying}>
            {isVerifying ? "링크 확인 중..." : "비밀번호 재설정 계속하기"}
          </button>

          {!tokenHash ? (
            <p className="mt-4 text-[14px] text-[var(--error)]">올바르지 않은 리셋 링크입니다.</p>
          ) : null}

          <p className="mt-6 text-[14px]">
            <Link className="auth-link-hover font-semibold text-[var(--accent)]" href="/forgot-password">새 리셋 링크 요청하기</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
