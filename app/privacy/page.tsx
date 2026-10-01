import type { Metadata } from "next";
import Link from "next/link";
import { TypographyLogoIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: "타이포그래피 기초 북마크의 개인정보 처리방침 안내 페이지입니다.",
  robots: { index: true, follow: true },
};

const SERVICE_NAME = "타이포그래피 기초 북마크";
const OPERATOR_NAME = "곽신(개인)";
const CONTACT_EMAIL = "no.type.shin@gmail.com";
const EFFECTIVE_DATE = new Date().toISOString().slice(0, 10);

const sections = [
  ["s1", "개인정보의 처리 목적"],
  ["s2", "처리하는 개인정보의 항목"],
  ["s3", "개인정보의 처리 및 보유 기간"],
  ["s4", "개인정보의 파기 절차 및 방법"],
  ["s5", "개인정보 처리업무의 위탁"],
  ["s6", "정보주체의 권리·의무 및 행사방법"],
  ["s7", "개인정보의 안전성 확보 조치"],
  ["s8", "쿠키 운영 및 거부 방법"],
  ["s9", "개인정보 보호책임자"],
  ["s10", "권익침해 구제방법"],
  ["s11", "처리방침의 변경"],
] as const;

const sectionClassName = "mb-10 scroll-mt-20";
const headingClassName = "mb-4 text-[20px] font-semibold leading-[1.3] tracking-[-0.025em]";
const paragraphClassName = "leading-[1.7]";
const tableHeaderClassName = "border border-[var(--border)] bg-[var(--hover-bg)] px-3 py-2 text-left font-semibold";
const tableCellClassName = "border border-[var(--border)] px-3 py-2 align-top";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-[720px] px-6 py-10 text-[16px] text-[var(--text)] md:py-14">
      <Link className="auth-logo-hover mb-10 flex w-fit items-center gap-2.5 rounded-lg px-2 py-1.5" href="/login">
        <span className="grid size-8 place-items-center rounded-lg bg-[var(--text)] p-1.5 text-white">
          <TypographyLogoIcon />
        </span>
        <span className="text-[16px] font-semibold tracking-[-0.025em]">{SERVICE_NAME}</span>
      </Link>

      <header className="mb-10 border-b border-[var(--border)] pb-6">
        <p className="mb-2 text-xs font-semibold tracking-[0.1em] text-[var(--accent)]">PRIVACY</p>
        <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.04em]">개인정보 처리방침</h1>
        <p className="mt-3 text-[14px] text-[var(--text-sub)]">
          시행일: <time dateTime={EFFECTIVE_DATE}>{EFFECTIVE_DATE}</time>
        </p>
      </header>

      <section className="mb-10">
        <p className={paragraphClassName}>
          {SERVICE_NAME}(이하 &quot;서비스&quot;)은 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여 개인정보를 적법하게 처리하고 안전하게 관리합니다. 「개인정보 보호법」 제30조에 따라 개인정보 처리와 보호에 관한 절차 및 기준을 안내하고 관련 고충을 신속하게 처리하기 위해 다음과 같이 개인정보 처리방침을 수립·공개합니다.
        </p>
      </section>

      <nav className="mb-12 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5" aria-label="목차">
        <h2 className="mb-3 text-[16px] font-semibold">목차</h2>
        <ol className="list-decimal space-y-1.5 pl-5 text-[14px] text-[var(--text-sub)]">
          {sections.map(([id, title]) => (
            <li key={id}><a className="auth-link-hover" href={`#${id}`}>{title}</a></li>
          ))}
        </ol>
      </nav>

      <section id="s1" className={sectionClassName}>
        <h2 className={headingClassName}>1. 개인정보의 처리 목적</h2>
        <p className={`mb-3 ${paragraphClassName}`}>서비스는 다음 목적을 위해 개인정보를 처리합니다. 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행합니다.</p>
        <ol className="list-decimal space-y-2 pl-6 leading-[1.7]">
          <li><strong>회원 가입 및 관리:</strong> 가입 의사 확인, 본인 식별·인증, 회원자격 유지·관리, 부정 이용 방지</li>
          <li><strong>서비스 제공:</strong> 북마크와 폴더 기능 제공 및 서비스 운영</li>
          <li><strong>고충 처리:</strong> 문의사항 확인, 사실조사를 위한 연락·통지 및 처리 결과 안내</li>
        </ol>
      </section>

      <section id="s2" className={sectionClassName}>
        <h2 className={headingClassName}>2. 처리하는 개인정보의 항목</h2>
        <div className="mb-4">
          <h3 className="mb-2 font-semibold">가. 회원가입 시 수집·이용 항목</h3>
          <ul className="list-disc space-y-1 pl-6 leading-[1.7]">
            <li><strong>법적 근거:</strong> 「개인정보 보호법」 제15조제1항제4호(계약 체결·이행)</li>
            <li><strong>필수 항목:</strong> 이름, 이메일 주소, 비밀번호(단방향 암호화하여 저장하며 원문은 보관하지 않음)</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">나. 서비스 이용 과정에서 자동 수집되는 항목</h3>
          <p className={paragraphClassName}>IP 주소, 쿠키, 서비스 이용 기록, 접속 로그, 브라우저 정보, 기기 정보</p>
        </div>
      </section>

      <section id="s3" className={sectionClassName}>
        <h2 className={headingClassName}>3. 개인정보의 처리 및 보유 기간</h2>
        <p className={`mb-4 ${paragraphClassName}`}>서비스는 법령에 따른 보유·이용기간 또는 정보주체로부터 동의받은 기간 내에서 개인정보를 처리·보유합니다.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-[14px]">
            <thead><tr><th className={tableHeaderClassName}>처리 목적</th><th className={tableHeaderClassName}>보유 기간</th></tr></thead>
            <tbody>
              <tr><td className={tableCellClassName}>회원 가입 및 관리</td><td className={tableCellClassName}>회원 탈퇴 시까지</td></tr>
              <tr><td className={tableCellClassName}>서비스 제공</td><td className={tableCellClassName}>서비스 제공 완료 시까지</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[14px] leading-[1.7] text-[var(--text-sub)]">관계 법령 위반에 따른 수사·조사가 진행 중이거나 관련 법령에 보존 의무가 있는 경우에는 해당 기간이 끝날 때까지 보유합니다.</p>
      </section>

      <section id="s4" className={sectionClassName}>
        <h2 className={headingClassName}>4. 개인정보의 파기 절차 및 방법</h2>
        <p className={`mb-3 ${paragraphClassName}`}>개인정보 보유기간 경과, 처리 목적 달성 등으로 개인정보가 불필요해졌을 때에는 지체 없이 파기합니다.</p>
        <ul className="list-disc space-y-2 pl-6 leading-[1.7]">
          <li><strong>파기 절차:</strong> 회원 탈퇴 요청 또는 보유기간 만료 시 파기</li>
          <li><strong>파기 방법:</strong> 전자적 파일은 복구 및 재생이 불가능한 방법으로 영구 삭제</li>
        </ul>
      </section>

      <section id="s5" className={sectionClassName}>
        <h2 className={headingClassName}>5. 개인정보 처리업무의 위탁</h2>
        <p className={`mb-4 ${paragraphClassName}`}>서비스의 원활한 운영을 위해 다음과 같이 개인정보 처리업무를 위탁합니다. 수탁 서비스는 대한민국 리전에서 개인정보를 저장·처리합니다.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-[14px]">
            <thead><tr><th className={tableHeaderClassName}>수탁업체</th><th className={tableHeaderClassName}>위탁 업무</th><th className={tableHeaderClassName}>처리 지역</th><th className={tableHeaderClassName}>보유·이용 기간</th></tr></thead>
            <tbody>
              <tr><td className={tableCellClassName}>Supabase Inc.</td><td className={tableCellClassName}>회원 정보 저장, 인증 처리, 데이터베이스 운영</td><td className={tableCellClassName}>대한민국(Seoul)</td><td className={tableCellClassName}>회원 탈퇴 또는 위탁계약 종료 시까지</td></tr>
              <tr><td className={tableCellClassName}>Vercel Inc.</td><td className={tableCellClassName}>웹 서비스 호스팅 및 배포</td><td className={tableCellClassName}>대한민국(Seoul Edge)</td><td className={tableCellClassName}>위탁계약 종료 시까지</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[14px] leading-[1.7] text-[var(--text-sub)]">서비스는 「개인정보 보호법」 제26조에 따라 위탁계약 시 개인정보의 안전한 처리, 재위탁 제한, 관리·감독 및 책임에 관한 사항을 계약에 반영합니다.</p>
      </section>

      <section id="s6" className={sectionClassName}>
        <h2 className={headingClassName}>6. 정보주체의 권리·의무 및 행사방법</h2>
        <p className={`mb-3 ${paragraphClassName}`}>정보주체는 언제든지 개인정보 열람, 정정·삭제, 처리정지 및 동의 철회를 요구할 수 있습니다.</p>
        <p className={paragraphClassName}>권리 행사는 <a className="auth-link-hover font-semibold text-[var(--accent)]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>로 요청할 수 있으며, 서비스는 지체 없이 조치합니다.</p>
      </section>

      <section id="s7" className={sectionClassName}>
        <h2 className={headingClassName}>7. 개인정보의 안전성 확보 조치</h2>
        <ul className="list-disc space-y-2 pl-6 leading-[1.7]">
          <li><strong>기술적 조치:</strong> 접근 권한 관리, 비밀번호 단방향 암호화 저장, HTTPS 통신 암호화, Row Level Security(RLS) 적용</li>
          <li><strong>관리적 조치:</strong> 개인정보 취급 담당자 최소화, 정기적인 자체 점검</li>
          <li><strong>물리적 조치:</strong> 보안 인증을 획득한 클라우드 인프라의 대한민국 리전 활용</li>
        </ul>
      </section>

      <section id="s8" className={sectionClassName}>
        <h2 className={headingClassName}>8. 개인정보 자동 수집 장치(쿠키)의 설치·운영 및 거부</h2>
        <p className={`mb-3 ${paragraphClassName}`}>서비스는 로그인 상태 유지 및 이용자 환경 설정 저장을 위해 쿠키를 사용합니다.</p>
        <p className={paragraphClassName}>웹브라우저의 개인정보 보호 및 보안 설정에서 쿠키 저장을 거부할 수 있습니다. 다만 쿠키를 거부하면 로그인이 필요한 기능을 이용하기 어려울 수 있습니다.</p>
      </section>

      <section id="s9" className={sectionClassName}>
        <h2 className={headingClassName}>9. 개인정보 보호책임자</h2>
        <p className={`mb-3 ${paragraphClassName}`}>개인정보 처리에 관한 업무와 정보주체의 불만 처리 및 피해구제를 담당하는 개인정보 보호책임자는 다음과 같습니다.</p>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 leading-[1.7]">
          <p><strong>개인정보 보호책임자:</strong> {OPERATOR_NAME}</p>
          <p><strong>연락처:</strong> <a className="auth-link-hover font-semibold text-[var(--accent)]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
        </div>
      </section>

      <section id="s10" className={sectionClassName}>
        <h2 className={headingClassName}>10. 권익침해 구제방법</h2>
        <p className={`mb-3 ${paragraphClassName}`}>개인정보 침해로 인한 구제를 위해 다음 기관에 분쟁 해결이나 상담을 신청할 수 있습니다.</p>
        <ul className="list-disc space-y-1.5 pl-6 leading-[1.7]">
          <li>개인정보분쟁조정위원회: 1833-6972 (<a className="auth-link-hover text-[var(--accent)]" href="https://www.kopico.go.kr" target="_blank" rel="noreferrer noopener">www.kopico.go.kr</a>)</li>
          <li>개인정보침해신고센터: 118 (<a className="auth-link-hover text-[var(--accent)]" href="https://privacy.kisa.or.kr" target="_blank" rel="noreferrer noopener">privacy.kisa.or.kr</a>)</li>
          <li>대검찰청: 1301 (<a className="auth-link-hover text-[var(--accent)]" href="https://www.spo.go.kr" target="_blank" rel="noreferrer noopener">www.spo.go.kr</a>)</li>
          <li>경찰청: 182 (<a className="auth-link-hover text-[var(--accent)]" href="https://ecrm.cyber.go.kr" target="_blank" rel="noreferrer noopener">ecrm.cyber.go.kr</a>)</li>
        </ul>
      </section>

      <section id="s11" className={sectionClassName}>
        <h2 className={headingClassName}>11. 개인정보 처리방침의 변경</h2>
        <p className={paragraphClassName}>이 개인정보 처리방침은 {EFFECTIVE_DATE}부터 적용됩니다. 법령, 정책 또는 보안기술 변경에 따라 내용이 추가·삭제·수정되는 경우 시행 7일 전부터 서비스 내 공지사항을 통해 안내합니다.</p>
      </section>

      <footer className="mt-16 border-t border-[var(--border)] pt-6 text-[14px] text-[var(--text-sub)]">
        <p>시행일: {EFFECTIVE_DATE}</p>
      </footer>
    </main>
  );
}
