import type { DashboardModule } from '@/types/dashboard'

export function formatNumber(value: number): string {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(value >= 100000 ? 1 : 2)}万`
  }
  return value.toLocaleString('zh-CN')
}

export function formatMoney(value: number): string {
  if (value >= 10000) {
    return `¥${(value / 10000).toFixed(2)}万`
  }
  return `¥${value.toLocaleString('zh-CN')}`
}

export function formatUpdatedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '--'
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

export const moduleLabel: Record<DashboardModule, string> = {
  order: '订单',
  video: '学习视频',
  exam: '做试卷',
  production: '学习产生式',
  offline: '线下辅导',
  supervise: '在线督导',
  live: '直播课',
}

export const moduleColor: Record<DashboardModule, string> = {
  order: '#2dd4bf',
  video: '#38bdf8',
  exam: '#a78bfa',
  production: '#f472b6',
  offline: '#34d399',
  supervise: '#818cf8',
  live: '#f59e0b',
}
