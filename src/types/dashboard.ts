export type DashboardModule =
  | 'order'
  | 'video'
  | 'exam'
  | 'production'
  | 'offline'
  | 'supervise'
  | 'live'

export interface DashboardOverview {
  onlineUsers: number
  todayPV: number
  todayUV: number
  gmv: number
}

export interface OrderModuleStats {
  gmv: number
  orders: number
  visitors: number
  conversionRate: number
}

export interface VideoModuleStats {
  plays: number
  completes: number
  avgWatchSec: number
  publishCount: number
}

export interface ExamModuleStats {
  submits: number
  accuracy: number
  papers: number
  finishRate: number
}

export interface ProductionModuleStats {
  drills: number
  masteryRate: number
  rules: number
  applications: number
}

export interface OfflineModuleStats {
  attendance: number
  classes: number
  attendRate: number
  campuses: number
}

export interface SuperviseModuleStats {
  online: number
  sessions: number
  avgRespSec: number
  coverageRate: number
}

export interface LiveModuleStats {
  sessions: number
  viewers: number
  peakOnline: number
  interactionRate: number
}

export interface TrafficPoint {
  time: string
  order: number
  video: number
  exam: number
  production: number
  offline: number
  supervise: number
  live: number
}

export interface ShareItem {
  name: string
  value: number
}

export interface RankItem {
  module: DashboardModule
  name: string
  value: number
}

export interface RealtimeEvent {
  id: string
  time: string
  module: DashboardModule
  message: string
}

export interface RegionPoint {
  name: string
  lng: number
  lat: number
  province: string
  module: DashboardModule
  value: number
  /** @deprecated 兼容旧字段 */
  x?: number
  y?: number
}

export interface DashboardData {
  updatedAt: string
  overview: DashboardOverview
  modules: {
    order: OrderModuleStats
    video: VideoModuleStats
    exam: ExamModuleStats
    production: ProductionModuleStats
    offline: OfflineModuleStats
    supervise: SuperviseModuleStats
    live: LiveModuleStats
  }
  trafficTrend: TrafficPoint[]
  sourceShare: ShareItem[]
  topRank: RankItem[]
  realtimeEvents: RealtimeEvent[]
  regions: RegionPoint[]
}
