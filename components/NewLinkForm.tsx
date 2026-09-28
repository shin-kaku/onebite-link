import Link from "next/link";
import { folders } from "@/data/bookmarks";

export function NewLinkForm() {
  return (
    <section className="new-link-panel" aria-labelledby="new-link-title">
      <div className="form-heading">
        <p className="eyebrow">ADD TO COLLECTION</p>
        <h1 id="new-link-title">새 링크 저장</h1>
        <p>나중에 다시 보고 싶은 링크를 저장해 보세요.</p>
      </div>

      <form className="new-link-form">
        <div className="form-field">
          <label htmlFor="link-url">링크</label>
          <input id="link-url" name="url" type="url" placeholder="https://example.com" autoComplete="url" required />
          <span>저장하려는 페이지의 주소를 입력해주세요.</span>
        </div>

        <div className="form-field">
          <label htmlFor="link-folder">폴더</label>
          <div className="select-wrap">
            <select id="link-folder" name="folder" defaultValue="">
              <option value="" disabled>폴더를 선택해주세요</option>
              {folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <Link className="cancel-button" href="/">취소</Link>
          <button className="save-button" type="submit">링크 저장</button>
        </div>
      </form>
    </section>
  );
}
