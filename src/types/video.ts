export interface VideoItem {
  id: string
  bvid?: string
  title: string
  cover: string
  coverRaw?: string
  author: string
  playCount: number
  likeCount: number
  duration: number
  sourceUrl: string
  playUrl?: string
  keyword: string
}

export interface VideoFeedData {
  updatedAt: string
  source: string
  keyword: string
  total: number
  list: VideoItem[]
  ready?: boolean
  crawling?: boolean
}
