"use client";

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { folders } from "@/data/bookmarks";
import { createClient } from "@/utils/supabase/client";

type CustomFolder = { id: string; name: string };
export type DatabaseFolder = { id: string; name: string };
export type DatabaseLink = { id: string; title: string; description: string; thumbnail: string | null; url: string; folderId: string; source: "database" };
export type SavedBookmark = { id: string; title: string; description: string; thumbnail: string | null; url: string; folderId: string };
type FolderToDelete = CustomFolder & { isCustom: boolean; isDatabase?: boolean };
type FolderToEdit = FolderToDelete & { isDatabase?: boolean };
type BookmarkToDelete = { key: string; title: string; isSaved: boolean; isDatabase?: boolean };
export type BookmarkOverride = { title: string; description: string; folderId: string };
type BookmarkToEdit = BookmarkOverride & { key: string; isSaved: boolean; isDatabase?: boolean };
type FolderState = { customFolders: readonly CustomFolder[]; deletedFolderIds: readonly string[]; renamedFolders: Readonly<Record<string, string>>; savedBookmarks: readonly SavedBookmark[]; deletedBookmarkKeys: readonly string[]; bookmarkOverrides: Readonly<Record<string, BookmarkOverride>> };
type FolderContextValue = FolderState & {
  databaseFolders: readonly DatabaseFolder[];
  databaseLinks: readonly DatabaseLink[];
  addDatabaseLink: (link: DatabaseLink) => void;
  openFolderModal: () => void;
  requestDeleteFolder: (folder: FolderToDelete) => void;
  requestEditFolder: (folder: FolderToEdit) => void;
  addBookmark: (bookmark: Omit<SavedBookmark, "id">) => void;
  requestDeleteBookmark: (bookmark: BookmarkToDelete) => void;
  requestEditBookmark: (bookmark: BookmarkToEdit) => void;
};

const STORAGE_KEY = "onebite-custom-folders";
const CHANGE_EVENT = "onebite-folders-changed";
const EMPTY_STATE: FolderState = { customFolders: [], deletedFolderIds: [], renamedFolders: {}, savedBookmarks: [], deletedBookmarkKeys: [], bookmarkOverrides: {} };
const FolderContext = createContext<FolderContextValue | null>(null);

let cachedRaw: string | null = null;
let cachedState: FolderState = EMPTY_STATE;

function getFoldersSnapshot() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedState;
  cachedRaw = raw;

  try {
    const parsed = raw ? JSON.parse(raw) : EMPTY_STATE;
    cachedState = Array.isArray(parsed)
      ? { customFolders: parsed, deletedFolderIds: [], renamedFolders: {}, savedBookmarks: [], deletedBookmarkKeys: [], bookmarkOverrides: {} }
      : {
          customFolders: Array.isArray(parsed.customFolders) ? parsed.customFolders : [],
          deletedFolderIds: Array.isArray(parsed.deletedFolderIds) ? parsed.deletedFolderIds : [],
          renamedFolders: parsed.renamedFolders && typeof parsed.renamedFolders === "object" ? parsed.renamedFolders : {},
          savedBookmarks: Array.isArray(parsed.savedBookmarks) ? parsed.savedBookmarks : [],
          deletedBookmarkKeys: Array.isArray(parsed.deletedBookmarkKeys) ? parsed.deletedBookmarkKeys : [],
          bookmarkOverrides: parsed.bookmarkOverrides && typeof parsed.bookmarkOverrides === "object" ? parsed.bookmarkOverrides : {},
        };
  } catch {
    cachedState = EMPTY_STATE;
  }
  return cachedState;
}

function subscribeToFolders(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function saveState(state: FolderState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function FolderProvider({ children, initialDatabaseFolders, initialDatabaseLinks }: { children: ReactNode; initialDatabaseFolders: DatabaseFolder[]; initialDatabaseLinks: DatabaseLink[] }) {
  const folderState = useSyncExternalStore(subscribeToFolders, getFoldersSnapshot, () => EMPTY_STATE);
  const [databaseFolders, setDatabaseFolders] = useState(initialDatabaseFolders);
  const [databaseLinks, setDatabaseLinks] = useState(initialDatabaseLinks);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FolderToDelete | null>(null);
  const [isDeletingFolder, setIsDeletingFolder] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<FolderToEdit | null>(null);
  const [isEditingFolder, setIsEditingFolder] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [bookmarkDeleteTarget, setBookmarkDeleteTarget] = useState<BookmarkToDelete | null>(null);
  const [isDeletingBookmark, setIsDeletingBookmark] = useState(false);
  const [bookmarkDeleteError, setBookmarkDeleteError] = useState<string | null>(null);
  const [bookmarkEditTarget, setBookmarkEditTarget] = useState<BookmarkToEdit | null>(null);
  const [isEditingBookmark, setIsEditingBookmark] = useState(false);
  const [bookmarkEditError, setBookmarkEditError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isAddingFolderRef = useRef(false);

  useEffect(() => {
    if (!isCreateOpen && !deleteTarget && !editTarget && !bookmarkDeleteTarget && !bookmarkEditTarget) return;
    if (isCreateOpen || editTarget || bookmarkEditTarget) inputRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCreateOpen(false);
        setDeleteTarget(null);
        setEditTarget(null);
        setBookmarkDeleteTarget(null);
        setBookmarkEditTarget(null);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isCreateOpen, deleteTarget, editTarget, bookmarkDeleteTarget, bookmarkEditTarget]);

  async function addFolder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isAddingFolderRef.current) return;

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("folderName") ?? "").trim();
    if (!name) return;

    isAddingFolderRef.current = true;
    setIsAddingFolder(true);
    setCreateError(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("folders")
        .insert({ nam: name })
        .select("id, nam")
        .single();

      if (error) throw error;

      setDatabaseFolders((current) => [...current, { id: String(data.id), name: data.nam }]);
      formElement.reset();
      setIsCreateOpen(false);
    } catch {
      setCreateError("폴더를 저장하지 못했습니다. 다시 시도해 주세요.");
    } finally {
      isAddingFolderRef.current = false;
      setIsAddingFolder(false);
    }
  }

  async function deleteFolder() {
    if (!deleteTarget) return;

    if (deleteTarget.isDatabase) {
      setIsDeletingFolder(true);
      setDeleteError(null);

      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("folders")
          .delete()
          .eq("id", deleteTarget.id);

        if (error) throw error;

        setDatabaseFolders((current) => current.filter((folder) => folder.id !== deleteTarget.id));
        setDeleteTarget(null);
      } catch {
        setDeleteError("폴더를 삭제하지 못했습니다. 다시 시도해 주세요.");
      } finally {
        setIsDeletingFolder(false);
      }
      return;
    }

    saveState(deleteTarget.isCustom
      ? { ...folderState, customFolders: folderState.customFolders.filter((folder) => folder.id !== deleteTarget.id) }
      : { ...folderState, deletedFolderIds: [...new Set([...folderState.deletedFolderIds, deleteTarget.id])] });
    setDeleteTarget(null);
  }

  async function editFolder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editTarget) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get("folderName") ?? "").trim();
    if (!name) return;

    if (editTarget.isDatabase) {
      setIsEditingFolder(true);
      setEditError(null);

      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("folders")
          .update({ nam: name })
          .eq("id", editTarget.id);

        if (error) throw error;

        setDatabaseFolders((current) => current.map((folder) => folder.id === editTarget.id ? { ...folder, name } : folder));
        setEditTarget(null);
      } catch {
        setEditError("폴더 이름을 수정하지 못했습니다. 다시 시도해 주세요.");
      } finally {
        setIsEditingFolder(false);
      }
      return;
    }

    saveState(editTarget.isCustom
      ? { ...folderState, customFolders: folderState.customFolders.map((folder) => folder.id === editTarget.id ? { ...folder, name } : folder) }
      : { ...folderState, renamedFolders: { ...folderState.renamedFolders, [editTarget.id]: name } });
    setEditTarget(null);
  }

  function addBookmark(bookmark: Omit<SavedBookmark, "id">) {
    saveState({ ...folderState, savedBookmarks: [...folderState.savedBookmarks, { ...bookmark, id: crypto.randomUUID() }] });
  }

  async function deleteBookmark() {
    if (!bookmarkDeleteTarget) return;

    if (bookmarkDeleteTarget.isDatabase) {
      setIsDeletingBookmark(true);
      setBookmarkDeleteError(null);

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("links")
          .delete()
          .eq("id", bookmarkDeleteTarget.key)
          .select("id")
          .single();

        if (error) throw error;

        setDatabaseLinks((current) => current.filter((link) => link.id !== String(data.id)));
        setBookmarkDeleteTarget(null);
      } catch {
        setBookmarkDeleteError("링크를 삭제하지 못했습니다. 다시 시도해 주세요.");
      } finally {
        setIsDeletingBookmark(false);
      }
      return;
    }

    saveState(bookmarkDeleteTarget.isSaved
      ? { ...folderState, savedBookmarks: folderState.savedBookmarks.filter((bookmark) => bookmark.id !== bookmarkDeleteTarget.key) }
      : { ...folderState, deletedBookmarkKeys: [...new Set([...folderState.deletedBookmarkKeys, bookmarkDeleteTarget.key])] });
    setBookmarkDeleteTarget(null);
  }

  async function editBookmark(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!bookmarkEditTarget) return;
    const form = new FormData(event.currentTarget);
    const updated: BookmarkOverride = {
      folderId: String(form.get("folder")),
      title: String(form.get("title") ?? "").trim(),
      description: String(form.get("description") ?? "").trim(),
    };
    if (!updated.folderId || !updated.title || !updated.description) return;

    if (bookmarkEditTarget.isDatabase) {
      setIsEditingBookmark(true);
      setBookmarkEditError(null);

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("links")
          .update({
            title: updated.title,
            description: updated.description,
            folder_id: updated.folderId,
          })
          .eq("id", bookmarkEditTarget.key)
          .select("id, title, description, folder_id")
          .single();

        if (error) throw error;

        setDatabaseLinks((current) => current.map((link) => link.id === String(data.id)
          ? { ...link, title: data.title ?? link.url, description: data.description ?? "", folderId: data.folder_id === null ? "" : String(data.folder_id) }
          : link));
        setBookmarkEditTarget(null);
      } catch {
        setBookmarkEditError("링크를 수정하지 못했습니다. 다시 시도해 주세요.");
      } finally {
        setIsEditingBookmark(false);
      }
      return;
    }

    saveState(bookmarkEditTarget.isSaved
      ? { ...folderState, savedBookmarks: folderState.savedBookmarks.map((bookmark) => bookmark.id === bookmarkEditTarget.key ? { ...bookmark, ...updated } : bookmark) }
      : { ...folderState, bookmarkOverrides: { ...folderState.bookmarkOverrides, [bookmarkEditTarget.key]: updated } });
    setBookmarkEditTarget(null);
  }

  const closeCreateModal = () => {
    if (isAddingFolderRef.current) return;
    setCreateError(null);
    setIsCreateOpen(false);
  };
  const closeDeleteModal = () => {
    if (isDeletingFolder) return;
    setDeleteError(null);
    setDeleteTarget(null);
  };
  const closeEditModal = () => {
    if (isEditingFolder) return;
    setEditError(null);
    setEditTarget(null);
  };
  const closeBookmarkDeleteModal = () => {
    if (isDeletingBookmark) return;
    setBookmarkDeleteError(null);
    setBookmarkDeleteTarget(null);
  };
  const closeBookmarkEditModal = () => {
    if (isEditingBookmark) return;
    setBookmarkEditError(null);
    setBookmarkEditTarget(null);
  };

  return (
    <FolderContext.Provider value={{ ...folderState, databaseFolders, databaseLinks, addDatabaseLink: (link) => setDatabaseLinks((current) => [...current, link]), openFolderModal: () => { setCreateError(null); setIsCreateOpen(true); }, requestDeleteFolder: (folder) => { setDeleteError(null); setDeleteTarget(folder); }, requestEditFolder: (folder) => { setEditError(null); setEditTarget(folder); }, addBookmark, requestDeleteBookmark: (bookmark) => { setBookmarkDeleteError(null); setBookmarkDeleteTarget(bookmark); }, requestEditBookmark: (bookmark) => { setBookmarkEditError(null); setBookmarkEditTarget(bookmark); } }}>
      {children}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(55,53,47,0.32)] px-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCreateModal(); }}>
          <section className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6" role="dialog" aria-modal="true" aria-labelledby="new-folder-title">
            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold tracking-[0.1em] text-[var(--accent)]">새 컬렉션</p>
              <h2 className="text-xl font-semibold leading-[1.3] tracking-[-0.025em]" id="new-folder-title">새 폴더 만들기</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-sub)]">관련된 링크를 모아둘 폴더의 이름을 입력하세요.</p>
            </div>
            <form className="grid gap-5" onSubmit={addFolder} aria-busy={isAddingFolder}>
              <div className="grid gap-2">
                <label className="text-[14px] font-semibold" htmlFor="folder-name">폴더 이름</label>
                <input ref={inputRef} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-base transition-colors" id="folder-name" name="folderName" placeholder="예: 읽어볼 글" maxLength={30} required disabled={isAddingFolder} />
              </div>
              {createError && <p className="text-[13px] text-[var(--error)]" role="alert">{createError}</p>}
              <div className="flex justify-end gap-2">
                <button className="secondary-hover h-10 cursor-pointer rounded-md border border-[var(--border)] px-4 text-[14px] font-semibold" type="button" onClick={closeCreateModal} disabled={isAddingFolder}>취소</button>
                <button className="primary-hover h-10 cursor-pointer rounded-md bg-[var(--accent)] px-4 text-[14px] font-semibold text-white" type="submit" disabled={isAddingFolder}>{isAddingFolder ? "저장 중..." : "저장"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(55,53,47,0.32)] px-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDeleteModal(); }}>
          <section className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6" role="alertdialog" aria-modal="true" aria-labelledby="delete-folder-title" aria-describedby="delete-folder-description">
            <p className="mb-2 text-xs font-semibold tracking-[0.1em] text-[var(--error)]">폴더 삭제</p>
            <h2 className="text-xl font-semibold leading-[1.3] tracking-[-0.025em]" id="delete-folder-title">‘{deleteTarget.name}’ 폴더를 삭제할까요?</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-sub)]" id="delete-folder-description">삭제한 폴더는 사이드바에서 사라집니다. 이 작업은 되돌릴 수 없습니다.</p>
            {deleteError && <p className="mt-3 text-[13px] text-[var(--error)]" role="alert">{deleteError}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button className="secondary-hover h-10 cursor-pointer rounded-md border border-[var(--border)] px-4 text-[14px] font-semibold" type="button" onClick={closeDeleteModal} disabled={isDeletingFolder}>취소</button>
              <button className="delete-hover h-10 cursor-pointer rounded-md bg-[var(--error)] px-4 text-[14px] font-semibold text-white" type="button" onClick={deleteFolder} disabled={isDeletingFolder}>{isDeletingFolder ? "삭제 중..." : "삭제"}</button>
            </div>
          </section>
        </div>
      )}
      {editTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(55,53,47,0.32)] px-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditModal(); }}>
          <section className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6" role="dialog" aria-modal="true" aria-labelledby="edit-folder-title">
            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold tracking-[0.1em] text-[var(--accent)]">폴더 수정</p>
              <h2 className="text-xl font-semibold leading-[1.3] tracking-[-0.025em]" id="edit-folder-title">폴더 이름 바꾸기</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-sub)]">새로운 폴더 이름을 입력하세요.</p>
            </div>
            <form className="grid gap-5" onSubmit={editFolder} aria-busy={isEditingFolder}>
              <div className="grid gap-2">
                <label className="text-[14px] font-semibold" htmlFor="edit-folder-name">폴더 이름</label>
                <input ref={inputRef} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-base transition-colors" id="edit-folder-name" name="folderName" defaultValue={editTarget.name} maxLength={30} required disabled={isEditingFolder} />
              </div>
              {editError && <p className="text-[13px] text-[var(--error)]" role="alert">{editError}</p>}
              <div className="flex justify-end gap-2">
                <button className="secondary-hover h-10 cursor-pointer rounded-md border border-[var(--border)] px-4 text-[14px] font-semibold" type="button" onClick={closeEditModal} disabled={isEditingFolder}>취소</button>
                <button className="primary-hover h-10 cursor-pointer rounded-md bg-[var(--accent)] px-4 text-[14px] font-semibold text-white" type="submit" disabled={isEditingFolder}>{isEditingFolder ? "저장 중..." : "저장"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
      {bookmarkDeleteTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(55,53,47,0.32)] px-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeBookmarkDeleteModal(); }}>
          <section className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6" role="alertdialog" aria-modal="true" aria-labelledby="delete-bookmark-title" aria-describedby="delete-bookmark-description">
            <p className="mb-2 text-xs font-semibold tracking-[0.1em] text-[var(--error)]">링크 삭제</p>
            <h2 className="text-xl font-semibold leading-[1.3] tracking-[-0.025em]" id="delete-bookmark-title">‘{bookmarkDeleteTarget.title}’ 링크를 삭제할까요?</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-sub)]" id="delete-bookmark-description">삭제한 링크는 컬렉션에서 사라집니다. 이 작업은 되돌릴 수 없습니다.</p>
            {bookmarkDeleteError && <p className="mt-3 text-[13px] text-[var(--error)]" role="alert">{bookmarkDeleteError}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button className="secondary-hover h-10 cursor-pointer rounded-md border border-[var(--border)] px-4 text-[14px] font-semibold" type="button" onClick={closeBookmarkDeleteModal} disabled={isDeletingBookmark}>취소</button>
              <button className="delete-hover h-10 cursor-pointer rounded-md bg-[var(--error)] px-4 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40" type="button" onClick={deleteBookmark} disabled={isDeletingBookmark}>{isDeletingBookmark ? "삭제 중..." : "삭제"}</button>
            </div>
          </section>
        </div>
      )}
      {bookmarkEditTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(55,53,47,0.32)] px-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeBookmarkEditModal(); }}>
          <section className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6" role="dialog" aria-modal="true" aria-labelledby="edit-bookmark-title">
            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold tracking-[0.1em] text-[var(--accent)]">링크 수정</p>
              <h2 className="text-xl font-semibold leading-[1.3] tracking-[-0.025em]" id="edit-bookmark-title">링크 정보 수정하기</h2>
            </div>
            <form className="grid gap-4" onSubmit={editBookmark} aria-busy={isEditingBookmark}>
              <div className="grid gap-2"><label className="text-[14px] font-semibold" htmlFor="edit-bookmark-folder">폴더</label><select className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-base" id="edit-bookmark-folder" name="folder" defaultValue={bookmarkEditTarget.folderId} required disabled={isEditingBookmark}>{databaseFolders.map((folder) => <option key={`database-${folder.id}`} value={folder.id}>{folder.name}</option>)}{!bookmarkEditTarget.isDatabase && folders.filter((folder) => !folderState.deletedFolderIds.includes(folder.id)).map((folder) => <option key={folder.id} value={folder.id}>{folderState.renamedFolders[folder.id] ?? folder.name}</option>)}{!bookmarkEditTarget.isDatabase && folderState.customFolders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}</select></div>
              <div className="grid gap-2"><label className="text-[14px] font-semibold" htmlFor="edit-bookmark-name">제목</label><input ref={inputRef} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-base" id="edit-bookmark-name" name="title" defaultValue={bookmarkEditTarget.title} maxLength={120} required disabled={isEditingBookmark} /></div>
              <div className="grid gap-2"><label className="text-[14px] font-semibold" htmlFor="edit-bookmark-description">설명</label><textarea className="min-h-28 w-full resize-y rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-base leading-relaxed outline-none focus:border-[var(--accent)]" id="edit-bookmark-description" name="description" defaultValue={bookmarkEditTarget.description} maxLength={300} required disabled={isEditingBookmark} /></div>
              {bookmarkEditError && <p className="text-[13px] text-[var(--error)]" role="alert">{bookmarkEditError}</p>}
              <div className="mt-2 flex justify-end gap-2"><button className="secondary-hover h-10 cursor-pointer rounded-md border border-[var(--border)] px-4 text-[14px] font-semibold" type="button" onClick={closeBookmarkEditModal} disabled={isEditingBookmark}>취소</button><button className="primary-hover h-10 cursor-pointer rounded-md bg-[var(--accent)] px-4 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40" type="submit" disabled={isEditingBookmark}>{isEditingBookmark ? "저장 중..." : "저장"}</button></div>
            </form>
          </section>
        </div>
      )}
    </FolderContext.Provider>
  );
}

export function useFolders() {
  const context = useContext(FolderContext);
  if (!context) throw new Error("useFolders must be used within FolderProvider");
  return context;
}
