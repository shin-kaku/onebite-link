export const folders = [
  { id: "development", name: "개발", color: "blue" },
  { id: "design", name: "디자인", color: "violet" },
  { id: "articles", name: "아티클", color: "orange" },
  { id: "inspiration", name: "영감", color: "green" },
] as const;

export const bookmarks = [
  { title: "React", url: "react.dev", description: "사용자 인터페이스를 만들기 위한 JavaScript 라이브러리", folderId: "development", color: "#087ea4", initial: "R" },
  { title: "Next.js", url: "nextjs.org", description: "풀스택 웹 애플리케이션을 위한 React 프레임워크", folderId: "development", color: "#111111", initial: "N" },
  { title: "TypeScript", url: "typescriptlang.org", description: "JavaScript에 타입을 더해 더 나은 개발 경험을 제공합니다", folderId: "development", color: "#3178c6", initial: "TS" },
  { title: "Figma", url: "figma.com", description: "팀을 위한 협업형 인터페이스 디자인 도구", folderId: "design", color: "#a259ff", initial: "F" },
  { title: "Mobbin", url: "mobbin.com", description: "세계 최고의 앱에서 수집한 모바일 디자인 패턴", folderId: "design", color: "#ff5c35", initial: "M" },
  { title: "요즘IT", url: "yozm.wishket.com", description: "개발자와 디자이너를 위한 실무 중심의 IT 콘텐츠", folderId: "articles", color: "#6255f6", initial: "Y" },
  { title: "GeekNews", url: "news.hada.io", description: "개발과 기술에 관한 새롭고 흥미로운 이야기", folderId: "articles", color: "#ff7a00", initial: "G" },
  { title: "Are.na", url: "are.na", description: "아이디어를 저장하고 연결하며 영감을 발견하는 공간", folderId: "inspiration", color: "#245cff", initial: "A" },
] as const;

export type FolderId = (typeof folders)[number]["id"];

export function getFolder(folderId: string) {
  return folders.find((folder) => folder.id === folderId);
}

export function getFolderBookmarks(folderId: FolderId) {
  return bookmarks.filter((bookmark) => bookmark.folderId === folderId);
}
