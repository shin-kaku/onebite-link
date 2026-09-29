import { ArrowIcon } from "./icons";
import { bookmarks, folders } from "@/data/bookmarks";

type Bookmark = (typeof bookmarks)[number];

function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  const folder = folders.find((item) => item.id === bookmark.folderId);
  const iconClass = `site-${bookmark.title.toLowerCase().replace(".", "").replace("요즘it", "yozmit")}`;

  return (
    <article className="card-hover flex min-h-52 flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-start justify-between">
        <div className={`${iconClass} grid size-10 place-items-center rounded-lg text-[13px] font-bold text-white`}>{bookmark.initial}</div>
        <span className="rounded bg-[var(--hover-bg)] px-2 py-1 text-xs text-[var(--text-sub)]">{folder?.name}</span>
      </div>
      <div className="mt-5"><h2 className="text-lg font-semibold tracking-[-0.025em]">{bookmark.title}</h2><p className="mt-2 text-[14px] leading-relaxed text-[var(--text-sub)]">{bookmark.description}</p></div>
      <a className="external-hover mt-auto flex items-center justify-between border-t border-[var(--border)] pt-4 text-xs text-[var(--text-sub)]" href={`https://${bookmark.url}`} target="_blank" rel="noreferrer"><span>{bookmark.url}</span><ArrowIcon className="size-4" /></a>
    </article>
  );
}

export function BookmarkGrid({ items = bookmarks }: { items?: readonly Bookmark[] }) {
  return <section className="grid grid-cols-1 gap-3 sm:grid-cols-2" id="all" aria-label="저장한 링크">{items.map((bookmark) => <BookmarkCard key={bookmark.url} bookmark={bookmark}/>)}</section>;
}
