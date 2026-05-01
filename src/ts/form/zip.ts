// ========================================
// FORM / zip.ts
// ----------------------------------------
// 郵便番号 → 住所自動入力（ZipCloud API）
// ========================================

import type { ZipCloudResponse, ZipLookupOptions } from "./types";

const ZIP_API_BASE = "https://zipcloud.ibsnet.co.jp/api/search";

async function fetchAddress(zipcode: string): Promise<ZipCloudResponse | null> {
  try {
    const res = await fetch(`${ZIP_API_BASE}?zipcode=${zipcode}`);
    if (!res.ok) return null;
    return (await res.json()) as ZipCloudResponse;
  } catch {
    return null;
  }
}

export function initZipLookup(options: ZipLookupOptions = {}): void {
  const {
    zipcodeSelector = "#postcode",
    addressSelector = "#address",
    debounceMs = 300,
  } = options;

  const zipcodeEl = document.querySelector<HTMLInputElement>(zipcodeSelector);
  const addressEl = document.querySelector<HTMLInputElement>(addressSelector);

  if (!zipcodeEl) return;

  // 郵便番号フィールド右端にローディング表示用のラッパーを構築
  const wrapper = zipcodeEl.closest<HTMLElement>(".c-form__input-wrap");
  const statusEl = wrapper?.querySelector<HTMLElement>(".c-form__zip-status");

  function setStatus(msg: string, isError = false): void {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.dataset.error = isError ? "true" : "false";
  }

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  zipcodeEl.addEventListener("input", () => {
    const digits = zipcodeEl.value.replace(/[^\d]/g, "");

    if (digits.length !== 7) {
      if (statusEl) statusEl.textContent = "";
      return;
    }

    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      setStatus("住所を検索中...");

      const data = await fetchAddress(digits);

      if (!data) {
        setStatus("住所の取得に失敗しました。", true);
        return;
      }

      if (!data.results || data.results.length === 0) {
        setStatus("該当する住所が見つかりませんでした。", true);
        return;
      }

      const { address1, address2, address3 } = data.results[0];
      const fullAddress = `${address1}${address2}${address3}`;

      if (addressEl) {
        addressEl.value = fullAddress;
        // バリデーションのクリアを通知
        addressEl.dispatchEvent(new Event("input", { bubbles: true }));
        addressEl.focus();
      }

      setStatus("住所を入力しました。");
    }, debounceMs);
  });
}
