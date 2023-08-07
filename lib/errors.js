export const LOGIN_FAILED = 'core_citizen_login_failed'
export const EMAIL_NOT_VERIFIED = 'core_citizen_email_not_verified'
export const EMAIL_IN_USE = 'core_citizen_email_in_used'
export const EMAIL_NOT_FOUND = 'CITIZEN_EMAIL_NOT_FOUND'
export const FORBIDDEN_HANDLE = 'core_citizen_forbidden_handle'
export const HANDLE_IN_USE = 'core_citizen_handle_in_used'
export const WRONG_CITIZEN_PASSWORD = 'WRONG_CITIZEN_PASSWORD' // @ updatePassword
export const NOT_FOUND = 'system_not_found'
export const INVALID_TOKEN = 'system_invalid_token'
export const FE_UNAUTHORIZED = 'fe_unauthorized'
export const MAP = {
  [LOGIN_FAILED]: '登入失敗，Email 或密碼錯誤',
  [EMAIL_NOT_VERIFIED]: 'Email 未認證',
  [EMAIL_IN_USE]: 'Email 有人用了',
  [EMAIL_NOT_FOUND]: 'Email 找不到',
  [FORBIDDEN_HANDLE]: '禁用的草民代號',
  [HANDLE_IN_USE]: '草民代號有人用了',
  [WRONG_CITIZEN_PASSWORD]: '密碼錯誤',
  [NOT_FOUND]: '就找不到',
  [INVALID_TOKEN]: '身分驗證無效',
  [FE_UNAUTHORIZED]: '權限不足'
}

export const EMAIL_INVALID = 'must be a valid email'
export const KEYWORD_MAP = [
  {
    keyword: EMAIL_INVALID,
    message: 'Email 格式不正確'
  }
]
