// Per-device convenience only; the app works the same without it.
const KEY = 'shompod.lastAccountId'

export function lastAccountId(): number | null {
  try {
    const id = Number(localStorage.getItem(KEY))
    return id > 0 ? id : null
  } catch {
    return null
  }
}

export function rememberAccount(id: number) {
  try {
    localStorage.setItem(KEY, String(id))
  } catch {
    // private mode / storage blocked: just don't remember
  }
}
