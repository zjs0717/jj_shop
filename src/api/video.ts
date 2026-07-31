import { request } from '@/api/request'
import type { VideoFeedData } from '@/types/video'

/** 读缓存的 10 条，不触发爬取 */
export const fetchVideoFeed = (): Promise<VideoFeedData> => {
  return request<VideoFeedData>('/api/video/feed')
}

/** 重新爬取并覆盖存储的 10 条 */
export const refreshVideoFeed = (): Promise<VideoFeedData> => {
  return request<VideoFeedData>('/api/video/feed/refresh', {
    method: 'POST',
  })
}
