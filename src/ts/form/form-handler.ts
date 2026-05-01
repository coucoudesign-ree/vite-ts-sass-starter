// ========================================
// FORM / form-handler.ts
// ----------------------------------------
// フォーム送信・バリデーション・エラー表示
// alert() 不使用・インラインエラー表示
// ========================================

import type { ApiResponse, FormFieldName, FormHandlerOptions, ValidationErrors } from "./types";

// バリデーション対象フィールド（順番 = エラー時フォーカス優先度）
const REQUIRED_FIELDS: FormFieldName[] = [
  "name",
  "furigana",
  "email",
  "tel",
  "postcode",
  "address",
  "message",
];

// =====================================
// バリデーション
// =====================================
function validate(form: HTMLFormElement): ValidationErrors {
  const errors: ValidationErrors = {};

  const get = (name: FormFieldName): string =>
    ((form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? "").trim();

  const name = get("name");
  if (!name) errors.name = "お名前を入力してください。";

  const furigana = get("furigana");
  if (!furigana) {
    errors.furigana = "フリガナを入力してください。";
  // eslint-disable-next-line no-irregular-whitespace
  } else if (!/^[ァ-ヶー\s　]+$/.test(furigana)) {
    errors.furigana = "フリガナはカタカナで入力してください。";
  }

  const email = get("email");
  if (!email) {
    errors.email = "メールアドレスを入力してください。";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "メールアドレスの形式が正しくありません。";
  }

  const tel = get("tel");
  if (!tel) {
    errors.tel = "電話番号を入力してください。";
  } else {
    const digits = tel.replace(/[^\d]/g, "");
    if (digits.length < 10 || digits.length > 11) {
      errors.tel = "電話番号は10〜11桁で入力してください（例: 03-1234-5678）。";
    }
  }

  const postcode = get("postcode");
  if (!postcode) {
    errors.postcode = "郵便番号を入力してください。";
  } else if (!/^\d{3}-?\d{4}$/.test(postcode)) {
    errors.postcode = "郵便番号は7桁の数字で入力してください（例: 1234567）。";
  }

  const address = get("address");
  if (!address) errors.address = "住所を入力してください。";

  const message = get("message");
  if (!message) errors.message = "お問い合わせ内容を入力してください。";

  return errors;
}

// =====================================
// エラー表示・クリア
// =====================================
function showFieldError(fieldName: string, message: string): void {
  const input = document.getElementById(fieldName);
  const errorEl = document.getElementById(`${fieldName}-error`);
  input?.classList.add("c-form__input--error", "c-form__textarea--error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }
}

function clearFieldError(fieldName: string): void {
  const input = document.getElementById(fieldName);
  const errorEl = document.getElementById(`${fieldName}-error`);
  input?.classList.remove("c-form__input--error", "c-form__textarea--error");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.hidden = true;
  }
}

function clearAllErrors(form: HTMLFormElement): void {
  REQUIRED_FIELDS.forEach(clearFieldError);
  hideGlobalError(form);
}

function showGlobalError(form: HTMLFormElement, message: string): void {
  const alertEl = form.querySelector<HTMLElement>("[data-form-alert]");
  if (!alertEl) return;
  alertEl.textContent = message;
  alertEl.hidden = false;
  alertEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideGlobalError(form: HTMLFormElement): void {
  const alertEl = form.querySelector<HTMLElement>("[data-form-alert]");
  if (!alertEl) return;
  alertEl.textContent = "";
  alertEl.hidden = true;
}

// =====================================
// 送信ボタン状態管理
// =====================================
function setSubmitting(btn: HTMLButtonElement, loading: boolean): void {
  if (loading) {
    btn.dataset.originalText = btn.textContent ?? "送信する";
    btn.textContent = "送信中...";
    btn.disabled = true;
    btn.classList.add("c-form__submit--loading");
  } else {
    btn.textContent = btn.dataset.originalText ?? "送信する";
    btn.disabled = false;
    btn.classList.remove("c-form__submit--loading");
  }
}

// =====================================
// CSRF トークン
// =====================================
async function fetchCsrfToken(endpoint: string): Promise<string | null> {
  try {
    const res = await fetch(endpoint, { credentials: "same-origin" });
    if (!res.ok) return null;
    const data = (await res.json()) as { token?: string };
    return data.token ?? null;
  } catch {
    return null;
  }
}

// =====================================
// メイン初期化
// =====================================
export function initForm(options: FormHandlerOptions = {}): void {
  const {
    formSelector = "#js-contact-form",
    csrfEndpoint = "/api/csrf-token.php",
  } = options;

  const form = document.querySelector<HTMLFormElement>(formSelector);
  if (!form) return;

  const submitBtn = form.querySelector<HTMLButtonElement>('[type="submit"]');
  const csrfInput = form.querySelector<HTMLInputElement>('input[name="csrf_token"]');

  // ---- CSRF トークン取得 ----
  if (csrfInput) {
    fetchCsrfToken(csrfEndpoint).then((token) => {
      if (token) csrfInput.value = token;
    });
  }

  // ---- リアルタイムバリデーション（blur / input） ----
  REQUIRED_FIELDS.forEach((fieldName) => {
    const el = form.elements.namedItem(fieldName) as HTMLElement | null;
    if (!el) return;

    el.addEventListener("blur", () => {
      const errors = validate(form);
      if (errors[fieldName]) {
        showFieldError(fieldName, errors[fieldName]!);
      } else {
        clearFieldError(fieldName);
      }
    });

    el.addEventListener("input", () => clearFieldError(fieldName));
  });

  // ---- 送信処理 ----
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearAllErrors(form);
    const errors = validate(form);

    // クライアントバリデーション失敗
    if (Object.keys(errors).length > 0) {
      (Object.entries(errors) as [FormFieldName, string][]).forEach(([field, msg]) => {
        showFieldError(field, msg);
      });
      // 最初のエラーフィールドにフォーカス
      const firstError = REQUIRED_FIELDS.find((f) => errors[f]);
      if (firstError) document.getElementById(firstError)?.focus();
      return;
    }

    if (submitBtn) setSubmitting(submitBtn, true);

    try {
      const action = options.actionOverride ?? form.action;
      const res = await fetch(action, {
        method: "POST",
        body: new FormData(form),
        credentials: "same-origin",
      });

      const result = (await res.json()) as ApiResponse;

      // CSRF トークン更新（サーバーが返した場合）
      if (csrfInput && result.token) {
        csrfInput.value = result.token;
      }

      if (result.status === "success") {
        window.location.href = result.redirect;
        return;
      }

      showGlobalError(form, result.error ?? "送信に失敗しました。もう一度お試しください。");
    } catch {
      showGlobalError(form, "通信エラーが発生しました。時間を置いて再度お試しください。");
    } finally {
      if (submitBtn) setSubmitting(submitBtn, false);
    }
  });
}
