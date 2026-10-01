import type { User } from "@supabase/supabase-js";

export type CurrentUserProfile = {
  displayName: string;
  email: string;
};

export type AppRole = "master" | "graduate" | "student";

export const ROLE_LABELS: Record<AppRole, string> = {
  master: "강사(마스터)",
  graduate: "졸업생",
  student: "재학생",
};

export function getCurrentUserProfile(user: User | null): CurrentUserProfile | null {
  if (!user?.email) return null;

  const metadata = user.user_metadata;
  const nameCandidates = [
    metadata.display_name,
    metadata.full_name,
    metadata.name,
    metadata.nickname,
    metadata.user_name,
  ];
  const displayName = nameCandidates.find((value): value is string => typeof value === "string" && value.trim().length > 0)?.trim()
    ?? user.email.split("@")[0];

  return { displayName, email: user.email };
}
