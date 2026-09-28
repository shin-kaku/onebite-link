import { ArrowIcon } from "./icons";
import { bookmarks, folders } from "@/data/bookmarks";

type Bookmark = (typeof bookmarks)[number];

function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  const folder = folders.find((item) => item.id === bookmark.folderId);

  return (
    <article className="bookmark-card">
      <div className="card-topline">
        <div className="site-icon" style={{ backgroundColor: bookmark.color }}>{bookmark.initial}</div>
        <span className="folder-pill">{folder?.name}</span>
      </div>
      <div className="card-copy"><h2>{bookmark.title}</h2><p>{bookmark.description}</p></div>
      <a className="card-link" href={`https://${bookmark.url}`} target="_blank" rel="noreferrer"><span>{bookmark.url}</span><ArrowIcon /></a>
    </article>
  );
}

export function BookmarkGrid({ items = bookmarks }: { items?: readonly Bookmark[] }) {
  return <section className="bookmark-grid" id="all" aria-label="저장한 링크">{items.map((bookmark) => <BookmarkCard key={bookmark.url} bookmark={bookmark}/>)}</section>;
}
