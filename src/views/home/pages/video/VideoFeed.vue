<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { fetchVideoFeed, refreshVideoFeed } from '@/api/video'
import type { VideoFeedData, VideoItem } from '@/types/video'

const data = ref<VideoFeedData | null>(null)
const loading = ref(true)
const refreshing = ref(false)
const error = ref('')
const index = ref(0)
const playing = ref(false)

const trackRef = ref<HTMLElement | null>(null)
const startX = ref(0)
const deltaX = ref(0)
const swiping = ref(false)

let pollTimer: ReturnType<typeof setTimeout> | null = null

const list = computed(() => data.value?.list ?? [])
const current = computed(() => list.value[index.value] || null)
const canPrev = computed(() => index.value > 0)
const canNext = computed(() => index.value < list.value.length - 1)

const trackStyle = computed(() => {
  const offset = -index.value * 100 + (swiping.value ? (deltaX.value / (window.innerWidth || 1)) * 100 : 0)
  return {
    transform: `translate3d(${offset}%, 0, 0)`,
    transition: swiping.value ? 'none' : 'transform 0.28s ease',
  }
})

function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(n >= 100000 ? 1 : 2)}万`
  return n.toLocaleString('zh-CN')
}

function formatDuration(sec: number): string {
  if (!sec || sec < 0) return '--:--'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function clearPoll(): void {
  if (pollTimer) {
    clearTimeout(pollTimer)
    pollTimer = null
  }
}

function go(nextIndex: number): void {
  if (!list.value.length) return
  index.value = Math.max(0, Math.min(list.value.length - 1, nextIndex))
  playing.value = false
}

function prev(): void {
  if (canPrev.value) go(index.value - 1)
}

function next(): void {
  if (canNext.value) go(index.value + 1)
}

function playCurrent(): void {
  if (current.value?.playUrl) {
    playing.value = true
  }
}

function onTouchStart(e: TouchEvent): void {
  if (!list.value.length) return
  startX.value = e.touches[0]?.clientX ?? 0
  deltaX.value = 0
  swiping.value = true
}

function onTouchMove(e: TouchEvent): void {
  if (!swiping.value) return
  deltaX.value = (e.touches[0]?.clientX ?? 0) - startX.value
}

function onTouchEnd(): void {
  if (!swiping.value) return
  const threshold = 64
  if (deltaX.value > threshold) prev()
  else if (deltaX.value < -threshold) next()
  swiping.value = false
  deltaX.value = 0
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

async function load(): Promise<void> {
  loading.value = true
  error.value = ''
  clearPoll()
  try {
    const res = await fetchVideoFeed()
    if (!res.ready || !res.list?.length) {
      data.value = null
      pollTimer = setTimeout(() => {
        void load()
      }, 1200)
      return
    }
    data.value = res
    index.value = 0
    playing.value = false
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载失败'
  } finally {
    loading.value = false
  }
}

async function onRefresh(): Promise<void> {
  refreshing.value = true
  error.value = ''
  data.value = null
  loading.value = true
  playing.value = false
  try {
    data.value = await refreshVideoFeed()
    index.value = 0
  } catch (err) {
    error.value = err instanceof Error ? err.message : '刷新失败'
    await load()
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

watch(index, () => {
  playing.value = false
})

onMounted(() => {
  void load()
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  clearPoll()
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <section class="phone">
    <header class="phone__bar">
      <div>
        <h2 class="phone__title">推荐</h2>
        <p class="phone__desc">
          左右滑动切换 · 共 {{ list.length || 10 }} 条
          <template v-if="data?.ready"> · {{ index + 1 }}/{{ list.length }}</template>
        </p>
      </div>
      <button type="button" class="phone__refresh" :disabled="loading || refreshing" @click="onRefresh">
        {{ refreshing ? '爬取中…' : '换一批' }}
      </button>
    </header>

    <p v-if="error" class="phone__error">{{ error }}</p>

    <div v-if="loading || refreshing || !data" class="phone__stage phone__stage--skeleton" aria-busy="true">
      <div class="skeleton-phone">
        <div class="skeleton-phone__media" />
        <div class="skeleton-phone__line" />
        <div class="skeleton-phone__line short" />
      </div>
    </div>

    <div
      v-else
      class="phone__stage"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend="onTouchEnd"
    >
      <button type="button" class="nav nav--prev" :disabled="!canPrev" aria-label="上一个" @click="prev">‹</button>
      <button type="button" class="nav nav--next" :disabled="!canNext" aria-label="下一个" @click="next">›</button>

      <div ref="trackRef" class="phone__track" :style="trackStyle">
        <article v-for="(item, i) in list" :key="item.id" class="slide">
          <div class="slide__frame">
            <!-- 当前条播放：B 站嵌入播放器 -->
            <iframe
              v-if="playing && i === index && item.playUrl"
              class="slide__player"
              :src="item.playUrl"
              scrolling="no"
              border="0"
              frameborder="no"
              framespacing="0"
              allowfullscreen="true"
              title="video-player"
            />

            <!-- 未播放：封面 + 播放按钮 -->
            <template v-else>
              <img
                class="slide__cover"
                :src="item.cover"
                :alt="item.title"
                referrerpolicy="no-referrer"
                loading="lazy"
              />
              <button
                v-if="i === index"
                type="button"
                class="slide__play"
                :disabled="!item.playUrl"
                @click="playCurrent"
              >
                {{ item.playUrl ? '▶ 播放' : '暂不可播' }}
              </button>
              <span class="slide__duration">{{ formatDuration(item.duration) }}</span>
            </template>

            <div class="slide__info">
              <h3>{{ item.title }}</h3>
              <p>@{{ item.author }}</p>
              <div class="slide__meta">
                <span>播放 {{ formatCount(item.playCount) }}</span>
                <span>点赞 {{ formatCount(item.likeCount) }}</span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div class="phone__dots">
        <i
          v-for="(item, i) in list"
          :key="`dot-${item.id}`"
          :class="{ 'is-on': i === index }"
          @click="go(i)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.phone {
  --phone-w: min(420px, 100%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: calc(100vh - 48px);
}

.phone__bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.phone__title {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 650;
  color: #0f172a;
}

.phone__desc {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.phone__refresh {
  height: 36px;
  padding: 0 14px;
  border: 1px solid #99f6e4;
  border-radius: 999px;
  background: #f0fdfa;
  color: #0f766e;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.phone__refresh:disabled {
  opacity: 0.6;
  cursor: wait;
}

.phone__error {
  margin: 0;
  color: #e11d48;
  font-size: 14px;
}

.phone__stage {
  position: relative;
  flex: 1;
  min-height: 640px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 24px;
  background:
    radial-gradient(ellipse 60% 40% at 50% 0%, rgba(45, 212, 191, 0.16), transparent 55%),
    #0b1220;
  border: 1px solid #1e293b;
  touch-action: pan-y;
  user-select: none;
}

.phone__stage--skeleton {
  background: #0b1220;
}

.phone__track {
  display: flex;
  width: var(--phone-w);
  height: min(78vh, 720px);
  will-change: transform;
}

.slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  box-sizing: border-box;
}

.slide__frame {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 400px;
  border-radius: 28px;
  overflow: hidden;
  background: #020617;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
}

.slide__cover,
.slide__player {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  background: #020617;
}

.slide__player {
  border: 0;
}

.slide__play {
  position: absolute;
  left: 50%;
  top: 46%;
  transform: translate(-50%, -50%);
  z-index: 3;
  height: 48px;
  padding: 0 22px;
  border: none;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.92);
  color: #ecfeff;
  font: inherit;
  font-size: 15px;
  font-weight: 650;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(15, 118, 110, 0.45);
}

.slide__play:disabled {
  background: rgba(71, 85, 105, 0.9);
  box-shadow: none;
  cursor: not-allowed;
}

.slide__duration {
  position: absolute;
  right: 14px;
  top: 14px;
  z-index: 2;
  padding: 4px 8px;
  border-radius: 8px;
  background: rgba(2, 6, 23, 0.7);
  color: #f8fafc;
  font-size: 12px;
}

.slide__info {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  padding: 48px 16px 18px;
  background: linear-gradient(180deg, transparent, rgba(2, 6, 23, 0.88));
  color: #f8fafc;
}

.slide__info h3 {
  margin: 0 0 6px;
  font-size: 15px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.slide__info p {
  margin: 0 0 8px;
  font-size: 13px;
  color: #94a3b8;
}

.slide__meta {
  display: flex;
  gap: 14px;
  font-size: 12px;
  color: #cbd5e1;
}

.nav {
  position: absolute;
  top: 50%;
  z-index: 5;
  transform: translateY(-50%);
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.72);
  color: #e2e8f0;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
}

.nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav--prev { left: 16px; }
.nav--next { right: 16px; }

.phone__dots {
  position: absolute;
  left: 50%;
  bottom: 14px;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 5;
}

.phone__dots i {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.45);
  cursor: pointer;
}

.phone__dots i.is-on {
  width: 16px;
  background: #2dd4bf;
}

.skeleton-phone {
  width: min(400px, 86%);
  height: min(78vh, 720px);
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: #020617;
  padding: 16px;
  box-sizing: border-box;
}

.skeleton-phone__media {
  height: 78%;
  border-radius: 18px;
  background: linear-gradient(90deg, #1e293b 25%, #334155 37%, #1e293b 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}

.skeleton-phone__line {
  margin-top: 14px;
  height: 12px;
  width: 88%;
  border-radius: 6px;
  background: linear-gradient(90deg, #1e293b 25%, #334155 37%, #1e293b 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}

.skeleton-phone__line.short {
  width: 52%;
  margin-top: 10px;
}

@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}

@media (max-width: 900px) {
  .nav { display: none; }
  .phone__stage { min-height: 560px; }
}
</style>
