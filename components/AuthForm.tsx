"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { TypographyLogoIcon } from "./icons";

type AuthFormProps = {
  mode: "login" | "signup";
  initialError?: string;
};

export function AuthForm({ mode, initialError = "" }: AuthFormProps) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isKakaoSubmitting, setIsKakaoSubmitting] = useState(false);
  const canSubmit = isSignup
    ? Boolean(displayName.trim() && email.trim() && password && passwordConfirm && privacyAgreed) && !isSubmitting
    : Boolean(email.trim() && password) && !isSubmitting;

  const getAuthErrorMessage = (message: string) => {
    const normalizedMessage = message.toLowerCase();

    if (!isSignup) {
      if (normalizedMessage.includes("invalid login credentials")) {
        return "이메일 또는 비밀번호가 올바르지 않습니다.";
      }
      if (normalizedMessage.includes("email not confirmed")) {
        return "이메일 인증을 완료한 후 로그인해 주세요.";
      }
      if (normalizedMessage.includes("invalid email")) {
        return "올바른 이메일 주소를 입력해 주세요.";
      }
      if (normalizedMessage.includes("rate limit") || normalizedMessage.includes("too many requests")) {
        return "로그인 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
      }

      return "로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.";
    }

    if (normalizedMessage.includes("already registered") || normalizedMessage.includes("already been registered")) {
      return "이미 가입된 이메일입니다.";
    }
    if (normalizedMessage.includes("invalid email")) {
      return "올바른 이메일 주소를 입력해 주세요.";
    }
    if (normalizedMessage.includes("password") && normalizedMessage.includes("characters")) {
      return "비밀번호는 6자 이상 입력해 주세요.";
    }
    if (normalizedMessage.includes("rate limit")) {
      return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
    }

    return "회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) return;

    setErrorMessage("");

    if (isSignup && password.length < 6) {
      setErrorMessage("비밀번호는 6자 이상 입력해 주세요.");
      return;
    }

    if (isSignup && /[^\p{L}\p{N}]/u.test(password)) {
      setErrorMessage("비밀번호에는 특수기호를 사용할 수 없습니다.");
      return;
    }

    if (isSignup && password !== passwordConfirm) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const credentials = { email: email.trim(), password };
      const { error } = isSignup
        ? await supabase.auth.signUp({
            ...credentials,
            options: { data: { display_name: displayName.trim() } },
          })
        : await supabase.auth.signInWithPassword(credentials);

      if (error) {
        setErrorMessage(getAuthErrorMessage(error.message));
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setErrorMessage(
        `${isSignup ? "회원가입" : "로그인"}에 실패했습니다. 인터넷 연결을 확인해 주세요.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKakaoLogin = async () => {
    if (isKakaoSubmitting) return;

    setErrorMessage("");
    setIsKakaoSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/`,
        },
      });

      if (error) {
        setErrorMessage("카카오 로그인을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.");
        setIsKakaoSubmitting(false);
      }
    } catch {
      setErrorMessage("카카오 로그인을 시작하지 못했습니다. 인터넷 연결을 확인해 주세요.");
      setIsKakaoSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      {errorMessage ? (
        <div
          className="fixed top-5 left-1/2 z-50 w-[calc(100%-32px)] max-w-[440px] -translate-x-1/2 rounded-lg border border-[var(--error)] bg-[var(--error-bg)] px-4 py-3 text-center text-[14px] font-medium text-[var(--error)]"
          role="alert"
          aria-live="assertive"
        >
          {errorMessage}
        </div>
      ) : null}
      <section className="w-full max-w-[400px]" aria-labelledby="auth-title">
        <Link
          className="auth-logo-hover mx-auto mb-10 flex w-fit items-center gap-3 rounded-lg px-2 py-1.5"
          href="/"
          aria-label="타이포그래피 기초 북마크 홈"
        >
          <span className="grid size-10 place-items-center rounded-lg bg-[var(--text)] p-2 text-white">
            <TypographyLogoIcon />
          </span>
          <span className="text-[18px] font-semibold tracking-[-0.03em]">
            타이포그래피 기초 북마크
          </span>
        </Link>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <div className="mb-8 text-center">
            <h1
              id="auth-title"
              className="text-[30px] font-bold leading-[1.2] tracking-[-0.04em]"
            >
              {isSignup ? "회원가입" : "로그인"}
            </h1>
            <p className="mt-2 text-[14px] leading-[1.5] text-[var(--text-sub)]">
              {isSignup
                ? "계정을 만들고 링크를 한곳에 모아보세요."
                : "저장해 둔 링크를 다시 만나보세요."}
            </p>
          </div>

          <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
            {isSignup ? (
              <div className="grid gap-2">
                <label className="text-[14px] font-semibold" htmlFor="signup-display-name">
                  이름
                </label>
                <input
                  className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-[16px] transition-colors duration-150"
                  id="signup-display-name"
                  name="displayName"
                  type="text"
                  autoComplete="name"
                  placeholder="이름을 입력하세요"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  maxLength={50}
                  required
                />
              </div>
            ) : null}

            <div className="grid gap-2">
              <label className="text-[14px] font-semibold" htmlFor={`${mode}-email`}>
                이메일
              </label>
              <input
                className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-[16px] transition-colors duration-150"
                id={`${mode}-email`}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-[14px] font-semibold" htmlFor={`${mode}-password`}>
                비밀번호
              </label>
              <input
                className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-[16px] transition-colors duration-150"
                id={`${mode}-password`}
                name="password"
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {isSignup ? (
              <div className="grid gap-2">
                <label className="text-[14px] font-semibold" htmlFor="signup-password-confirm">
                  비밀번호 확인
                </label>
                <input
                  className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-[16px] transition-colors duration-150"
                  id="signup-password-confirm"
                  name="passwordConfirm"
                  type="password"
                  autoComplete="new-password"
                  placeholder="비밀번호를 한 번 더 입력하세요"
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  aria-describedby="signup-password-help"
                  required
                />
                <ul className="grid gap-1 text-xs leading-relaxed text-[var(--text-sub)]" id="signup-password-help">
                  <li>• 특수기호는 사용할 수 없습니다.</li>
                  <li>• 비밀번호는 6자 이상 입력해야 합니다.</li>
                </ul>
              </div>
            ) : null}

            {isSignup ? (
              <label className="flex items-start gap-2.5 text-[14px] leading-[1.5] text-[var(--text-sub)]">
                <input
                  className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
                  type="checkbox"
                  checked={privacyAgreed}
                  onChange={(event) => setPrivacyAgreed(event.target.checked)}
                  required
                />
                <span>
                  [필수]{" "}
                  <Link className="auth-link-hover font-semibold text-[var(--accent)]" href="/privacy" target="_blank">
                    개인정보 처리방침
                  </Link>
                  에 동의합니다.
                </span>
              </label>
            ) : null}

            <button
              className="primary-hover mt-1 h-11 cursor-pointer rounded-md bg-[var(--accent)] px-4 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              type="submit"
              disabled={!canSubmit}
            >
              {isSubmitting ? (isSignup ? "가입 중..." : "로그인 중...") : (isSignup ? "회원가입" : "로그인")}
            </button>
          </form>

          {!isSignup ? (
            <button
              className="kakao-login-hover mt-3 block w-full cursor-pointer overflow-hidden rounded-md disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
              onClick={handleKakaoLogin}
              disabled={isKakaoSubmitting || isSubmitting}
              aria-label={isKakaoSubmitting ? "카카오 로그인 진행 중" : "카카오 로그인"}
            >
              <Image
                className="h-auto w-full"
                src="/kakao_login_large_wide.png"
                alt=""
                width={600}
                height={90}
                priority
              />
            </button>
          ) : null}

          {!isSignup ? (
            <p className="mt-6 text-center text-[14px]">
              <Link className="auth-link-hover font-semibold text-[var(--accent)]" href="/forgot-password">
                비밀번호를 잊으셨나요?
              </Link>
            </p>
          ) : null}

          <p className={`${isSignup ? "mt-6" : "mt-3"} text-center text-[14px] text-[var(--text-sub)]`}>
            {isSignup ? "이미 계정이 있으신가요?" : "아직 계정이 없으신가요?"}{" "}
            <Link
              className="auth-link-hover font-semibold text-[var(--accent)]"
              href={isSignup ? "/login" : "/signup"}
            >
              {isSignup ? "로그인" : "회원가입"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
