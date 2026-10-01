import Link from "next/link";
import { TypographyLogoIcon } from "./icons";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const isSignup = mode === "signup";

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
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

          <form className="grid gap-5">
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
                />
              </div>
            ) : null}

            <button
              className="primary-hover mt-1 h-11 cursor-pointer rounded-md bg-[var(--accent)] px-4 text-[14px] font-semibold text-white"
              type="button"
            >
              {isSignup ? "회원가입" : "로그인"}
            </button>
          </form>

          <p className="mt-6 text-center text-[14px] text-[var(--text-sub)]">
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
