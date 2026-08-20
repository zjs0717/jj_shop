const FOLLOW_KEY = 'jj_followed_user_ids'

function readIds(): number[] {
  try {
    const raw = localStorage.getItem(FOLLOW_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.map(Number).filter((n) => Number.isFinite(n) && n > 0)
  } catch {
    return []
  }
}

function writeIds(ids: number[]): void {
  localStorage.setItem(FOLLOW_KEY, JSON.stringify([...new Set(ids)]))
}

export function isFollowing(userId: number): boolean {
  return readIds().includes(userId)
}

export function followUser(userId: number): void {
  if (!userId) return
  const ids = readIds()
  if (!ids.includes(userId)) {
    ids.push(userId)
    writeIds(ids)
  }
}

export function unfollowUser(userId: number): void {
  writeIds(readIds().filter((id) => id !== userId))
}

export function toggleFollow(userId: number): boolean {
  if (isFollowing(userId)) {
    unfollowUser(userId)
    return false
  }
  followUser(userId)
  return true
}
