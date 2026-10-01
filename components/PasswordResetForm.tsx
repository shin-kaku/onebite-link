"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { TypographyLogoIcon } from "./icons";

type PasswordResetFormProps = {
  mode: "request" | "update";
  initialError?: string;
};

export function PasswordResetForm({ mode, initialError = "" }: PasswordResetFormProps) {
  const isRequest = mode === "request";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState(initialError);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = isRequest
    ? Boolean(email.trim()) && !isSubmitting
    : Boolean(password && passwordConfirm) && !isSubmitting && !isSuccess;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setMessage("");
    setIsSuccess(false);

    if (!isRequest && password !== passwordConfirm) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = isRequest
        ? await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: `${window.location.origin}/confirm-recovery`,
          })
        : await supabase.auth.updateUser({ password });

      if (error) {
        const normalizedMessage = error.message.toLowerCase();
        if (normalizedMessage.includes("rate limit") || normalizedMessage.includes("too many requests")) {
          setMessage("요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.");
        } else if (normalizedMessage.includes("password") && normalizedMessage.includes("characters")) {
          setMessage("비밀번호는 6자 이상 입력해 주세요.");
        } else {
          setMessage(
            isRequest
              ? "리셋 링크 발송에 실패했습니다. 잠시 후 다시 시도해 주세요."
              : "비밀번호 변경에 실패했습니다. 리셋 링크를 다시 요청해 주세요.",
          );
        }
        return;
      }

      setIsSuccess(true);
      setMessage(
        isRequest
          ? "입력한 이메일로 비밀번호 리셋 링크를 발송했습니다."
          : "비밀번호가 성공적으로 변경되었습니다.",
      );
    } catch {
      setMessage("요청에 실패했습니다. 인터넷 연결을 확인해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      {message ? (
        <div
          className={`fixed top-5 left-1/2 z-50 w-[calc(100%-32px)] max-w-[440px] -translate-x-1/2 rounded-lg border px-4 py-3 text-center text-[14px] font-medium ${isSuccess ? "border-[var(--success)] bg-[var(--success-bg)] text-[var(--success)]" : "border-[var(--error)] bg-[var(--error-bg)] text-[var(--error)]"}`}
          role={isSuccess ? "status" : "alert"}
          aria-live={isSuccess ? "polite" : "assertive"}
        >
          {message}
        </div>
      ) : null}

      <section className="w-full max-w-[400px]" aria-labelledby="reset-title">
        <Link className="auth-logo-hover mx-auto mb-10 flex w-fit items-center gap-3 rounded-lg px-2 py-1.5" href="/" aria-label="타이포그래피 기초 북마크 홈">
          <span className="grid size-10 place-items-center rounded-lg bg-[var(--text)] p-2 text-white"><TypographyLogoIcon /></span>
          <span className="text-[18px] font-semibold tracking-[-0.03em]">타이포그래피 기초 북마크</span>
        </Link>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <div className="mb-8 text-center">
            <h1 id="reset-title" className="text-[30px] font-bold leading-[1.2] tracking-[-0.04em]">{isRequest ? "비밀번호 찾기" : "새 비밀번호 설정"}</h1>
            <p className="mt-2 text-[14px] leading-[1.5] text-[var(--text-sub)]">{isRequest ? "가입한 이메일로 리셋 링크를 보내드릴게요." : "앞으로 사용할 새 비밀번호를 입력해 주세요."}</p>
          </div>

          <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
            {isRequest ? (
              <div className="grid gap-2">
                <label className="text-[14px] font-semibold" htmlFor="reset-email">이메일</label>
                <input className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-[16px] transition-colors duration-150" id="reset-email" name="email" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
            ) : (
              <>
                <div className="grid gap-2">
                  <label className="text-[14px] font-semibold" htmlFor="new-password">새 비밀번호</label>
                  <input className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-[16px] transition-colors duration-150" id="new-password" name="password" type="password" autoComplete="new-password" placeholder="새 비밀번호를 입력하세요" value={password} onChange={(event) => setPassword(event.target.value)} disabled={isSuccess} required />
                </div>
                <div className="grid gap-2">
                  <label className="text-[14px] font-semibold" htmlFor="new-password-confirm">새 비밀번호 확인</label>
                  <input className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-[16px] transition-colors duration-150" id="new-password-confirm" name="passwordConfirm" type="password" autoComplete="new-password" placeholder="새 비밀번호를 한 번 더 입력하세요" value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)} disabled={isSuccess} required />
                </div>
              </>
            )}

            <button className="primary-hover mt-1 h-11 cursor-pointer rounded-md bg-[var(--accent)] px-4 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40" type="submit" disabled={!canSubmit}>
              {isSubmitting ? (isRequest ? "발송 중..." : "변경 중...") : (isRequest ? "비밀번호 리셋 링크 발송" : "비밀번호 변경")}
            </button>
          </form>

          <p className="mt-6 text-center text-[14px]">
            <Link className="auth-link-hover font-semibold text-[var(--accent)]" href={isRequest ? "/login" : "/"}>{isRequest ? "로그인으로 돌아가기" : "홈으로 이동"}</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
