"use client";

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";

type CustomFolder = { id: string; name: string };
type FolderContextValue = {
  customFolders: readonly CustomFolder[];
  openFolderModal: () => void;
};

const STORAGE_KEY = "onebite-custom-folders";
const CHANGE_EVENT = "onebite-folders-changed";
const EMPTY_FOLDERS: readonly CustomFolder[] = [];
const FolderContext = createContext<FolderContextValue | null>(null);

let cachedRaw: string | null = null;
let cachedFolders: readonly CustomFolder[] = EMPTY_FOLDERS;

function getFoldersSnapshot() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedFolders;

  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cachedFolders = Array.isArray(parsed) ? parsed : EMPTY_FOLDERS;
  } catch {
    cachedFolders = EMPTY_FOLDERS;
  }
  return cachedFolders;
}

function subscribeToFolders(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function FolderProvider({ children }: { children: ReactNode }) {
  const customFolders = useSyncExternalStore(subscribeToFolders, getFoldersSnapshot, () => EMPTY_FOLDERS);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  function addFolder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("folderName") ?? "").trim();
    if (!name) return;

    const folder: CustomFolder = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...customFolders, folder]));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    setIsOpen(false);
  }

  return (
    <FolderContext.Provider value={{ customFolders, openFolderModal: () => setIsOpen(true) }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(55,53,47,0.32)] px-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}>
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
                <button className="secondary-hover h-10 cursor-pointer rounded-md border border-[var(--border)] px-4 text-[14px] font-semibold" type="button" onClick={() => setIsOpen(false)}>취소</button>
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
