"use client";

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";

type CustomFolder = { id: string; name: string };
type FolderToDelete = CustomFolder & { isCustom: boolean };
type FolderToEdit = FolderToDelete;
type FolderState = { customFolders: readonly CustomFolder[]; deletedFolderIds: readonly string[]; renamedFolders: Readonly<Record<string, string>> };
type FolderContextValue = FolderState & {
  openFolderModal: () => void;
  requestDeleteFolder: (folder: FolderToDelete) => void;
  requestEditFolder: (folder: FolderToEdit) => void;
};

const STORAGE_KEY = "onebite-custom-folders";
const CHANGE_EVENT = "onebite-folders-changed";
const EMPTY_STATE: FolderState = { customFolders: [], deletedFolderIds: [], renamedFolders: {} };
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
      ? { customFolders: parsed, deletedFolderIds: [], renamedFolders: {} }
      : {
          customFolders: Array.isArray(parsed.customFolders) ? parsed.customFolders : [],
          deletedFolderIds: Array.isArray(parsed.deletedFolderIds) ? parsed.deletedFolderIds : [],
          renamedFolders: parsed.renamedFolders && typeof parsed.renamedFolders === "object" ? parsed.renamedFolders : {},
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

export function FolderProvider({ children }: { children: ReactNode }) {
  const folderState = useSyncExternalStore(subscribeToFolders, getFoldersSnapshot, () => EMPTY_STATE);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FolderToDelete | null>(null);
  const [editTarget, setEditTarget] = useState<FolderToEdit | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isCreateOpen && !deleteTarget && !editTarget) return;
    if (isCreateOpen || editTarget) inputRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCreateOpen(false);
        setDeleteTarget(null);
        setEditTarget(null);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isCreateOpen, deleteTarget, editTarget]);

  function addFolder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("folderName") ?? "").trim();
    if (!name) return;

    const folder: CustomFolder = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name };
    saveState({ ...folderState, customFolders: [...folderState.customFolders, folder] });
    setIsCreateOpen(false);
  }

  function deleteFolder() {
    if (!deleteTarget) return;
    saveState(deleteTarget.isCustom
      ? { ...folderState, customFolders: folderState.customFolders.filter((folder) => folder.id !== deleteTarget.id) }
      : { ...folderState, deletedFolderIds: [...new Set([...folderState.deletedFolderIds, deleteTarget.id])] });
    setDeleteTarget(null);
  }

  function editFolder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editTarget) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get("folderName") ?? "").trim();
    if (!name) return;

    saveState(editTarget.isCustom
      ? { ...folderState, customFolders: folderState.customFolders.map((folder) => folder.id === editTarget.id ? { ...folder, name } : folder) }
      : { ...folderState, renamedFolders: { ...folderState.renamedFolders, [editTarget.id]: name } });
    setEditTarget(null);
  }

  const closeCreateModal = () => setIsCreateOpen(false);
  const closeDeleteModal = () => setDeleteTarget(null);
  const closeEditModal = () => setEditTarget(null);

  return (
    <FolderContext.Provider value={{ ...folderState, openFolderModal: () => setIsCreateOpen(true), requestDeleteFolder: setDeleteTarget, requestEditFolder: setEditTarget }}>
      {children}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(55,53,47,0.32)] px-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCreateModal(); }}>
          <section className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6" role="dialog" aria-modal="true" aria-labelledby="new-folder-title">
            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold tracking-[0.1em] text-[var(--accent)]">새 컬렉션</p>
              <h2 className="text-xl font-semibold leading-[1.3] tracking-[-0.025em]" id="new-folder-title">새 폴더 만들기</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-sub)]">관련된 링크를 모아둘 폴더의 이름을 입력하세요.</p>
            </div>
            <form className="grid gap-5" onSubmit={addFolder}>
              <div className="grid gap-2">
                <label className="text-[14px] font-semibold" htmlFor="folder-name">폴더 이름</label>
                <input ref={inputRef} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-base transition-colors" id="folder-name" name="folderName" placeholder="예: 읽어볼 글" maxLength={30} required />
              </div>
              <div className="flex justify-end gap-2">
                <button className="secondary-hover h-10 cursor-pointer rounded-md border border-[var(--border)] px-4 text-[14px] font-semibold" type="button" onClick={closeCreateModal}>취소</button>
                <button className="primary-hover h-10 cursor-pointer rounded-md bg-[var(--accent)] px-4 text-[14px] font-semibold text-white" type="submit">저장</button>
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
            <div className="mt-6 flex justify-end gap-2">
              <button className="secondary-hover h-10 cursor-pointer rounded-md border border-[var(--border)] px-4 text-[14px] font-semibold" type="button" onClick={closeDeleteModal}>취소</button>
              <button className="delete-hover h-10 cursor-pointer rounded-md bg-[var(--error)] px-4 text-[14px] font-semibold text-white" type="button" onClick={deleteFolder}>삭제</button>
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
            <form className="grid gap-5" onSubmit={editFolder}>
              <div className="grid gap-2">
                <label className="text-[14px] font-semibold" htmlFor="edit-folder-name">폴더 이름</label>
                <input ref={inputRef} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-base transition-colors" id="edit-folder-name" name="folderName" defaultValue={editTarget.name} maxLength={30} required />
              </div>
              <div className="flex justify-end gap-2">
                <button className="secondary-hover h-10 cursor-pointer rounded-md border border-[var(--border)] px-4 text-[14px] font-semibold" type="button" onClick={closeEditModal}>취소</button>
                <button className="primary-hover h-10 cursor-pointer rounded-md bg-[var(--accent)] px-4 text-[14px] font-semibold text-white" type="submit">저장</button>
              </div>
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
