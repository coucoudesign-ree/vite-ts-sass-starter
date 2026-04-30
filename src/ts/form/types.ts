// ========================================
// FORM / types.ts
// ----------------------------------------
// フォーム関連の型定義
// ========================================

export type FormFieldName =
  | "name"
  | "furigana"
  | "email"
  | "tel"
  | "postcode"
  | "address"
  | "address_building"
  | "message";

export type ValidationErrors = Partial<Record<FormFieldName, string>>;

// -------------------------------------
// API レスポンス
// -------------------------------------
export interface ApiSuccessResponse {
  status: "success";
  redirect: string;
  message: string;
  token?: string;
}

export interface ApiErrorResponse {
  status: "error";
  error: string;
  token?: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// -------------------------------------
// ZipCloud API
// -------------------------------------
export interface ZipCloudResult {
  address1: string; // 都道府県
  address2: string; // 市区町村
  address3: string; // 町域
  kana1: string;
  kana2: string;
  kana3: string;
  prefcode: string;
  zipcode: string;
}

export interface ZipCloudResponse {
  message: string | null;
  results: ZipCloudResult[] | null;
  status: number;
}

// -------------------------------------
// 設定オプション
// -------------------------------------
export interface FormHandlerOptions {
  /** フォームセレクタ（デフォルト: #js-contact-form） */
  formSelector?: string;
  /** CSRF トークン取得エンドポイント（デフォルト: /api/csrf-token.php） */
  csrfEndpoint?: string;
  /** 送信先エンドポイント（form[action] を優先） */
  actionOverride?: string;
}

export interface ZipLookupOptions {
  /** 郵便番号 input のセレクタ（デフォルト: #postcode） */
  zipcodeSelector?: string;
  /** 住所 input のセレクタ（デフォルト: #address） */
  addressSelector?: string;
  /** デバウンス時間 ms（デフォルト: 300） */
  debounceMs?: number;
}
