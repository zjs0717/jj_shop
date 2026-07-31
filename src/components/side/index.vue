<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import menuList from '@/data/menu'
import { clearToken } from '@/api/request'
import MenuNode from './MenuNode.vue'

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
}>()

const router = useRouter()
const menus = menuList

const isCollapsed = computed({
  get: () => props.collapsed,
  set: (value: boolean) => emit('update:collapsed', value),
})

function toggle(): void {
  isCollapsed.value = !isCollapsed.value
}

async function logout(): Promise<void> {
  clearToken()
  await router.push('/login')
}
</script>

<template>
  <aside class="side" :class="{ 'is-collapsed': collapsed }" aria-label="主导航">
    <div class="side__brand">
      <span class="side__logo">JJ</span>
      <div v-show="!collapsed" class="side__brand-text">
        <strong>JJ Shop</strong>
        <span>发现好物</span>
      </div>
    </div>

    <nav class="side__nav">
      <ul class="side__list">
        <MenuNode
          v-for="item in menus"
          :key="item.id"
          :item="item"
          :level="1"
          :collapsed="collapsed"
        />
      </ul>
    </nav>

    <div class="side__footer">
      <button
        type="button"
        class="side__logout"
        :title="collapsed ? '退出登录' : undefined"
        @click="logout"
      >
        <span class="side__logout-icon" aria-hidden="true">⎋</span>
        <span v-show="!collapsed">退出登录</span>
      </button>

      <button
        type="button"
        class="side__toggle"
        :aria-expanded="!collapsed"
        :aria-label="collapsed ? '展开菜单' : '收起菜单'"
        @click="toggle"
      >
        <span class="side__toggle-icon" aria-hidden="true">‹</span>
        <span v-show="!collapsed" class="side__toggle-text">收起</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.side {
  --menu-text: #334155;
  --menu-text-muted: #64748b;
  --menu-text-active: #0f172a;
  --menu-hover: rgba(15, 23, 42, 0.05);
  --menu-active: #0d9488;
  --menu-active-bg: rgba(13, 148, 136, 0.1);
  --menu-border: rgba(148, 163, 184, 0.28);

  position: fixed;
  top: 16px;
  left: 16px;
  bottom: 16px;
  z-index: 40;
  width: 220px;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 18px;
  box-shadow:
    0 10px 30px rgba(15, 23, 42, 0.08),
    0 2px 8px rgba(15, 23, 42, 0.04);
  color: var(--menu-text);
  box-sizing: border-box;
  overflow: hidden;
  transition: width 0.22s ease, box-shadow 0.22s ease;
}

.side.is-collapsed {
  width: 72px;
}

.side__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 16px 14px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  min-height: 64px;
  box-sizing: border-box;
}

.side.is-collapsed .side__brand {
  justify-content: center;
  padding-inline: 12px;
}

.side__logo {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 11px;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: #042f2e;
  background: linear-gradient(135deg, #5eead4, #14b8a6);
}

.side__brand-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.2;
  min-width: 0;
}

.side__brand-text strong {
  font-size: 15px;
  color: #0f172a;
  font-weight: 650;
}

.side__brand-text span {
  font-size: 12px;
  color: #94a3b8;
}

.side__nav {
  flex: 1;
  overflow: auto;
  padding: 12px 10px;
}

.side.is-collapsed .side__nav {
  padding-inline: 8px;
}

.side__list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  list-style: none;
}

.side__footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 10px 12px;
  border-top: 1px solid rgba(226, 232, 240, 0.9);
}

.side.is-collapsed .side__footer {
  padding-inline: 8px;
}

.side__logout,
.side__toggle {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  color: #475569;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.side__logout:hover {
  background: #fff1f2;
  border-color: #fecdd3;
  color: #be123c;
}

.side__toggle:hover {
  background: #f1f5f9;
  color: #0f172a;
  border-color: #cbd5e1;
}

.side__logout-icon {
  font-size: 14px;
  line-height: 1;
}

.side__toggle-icon {
  display: inline-block;
  font-size: 18px;
  line-height: 1;
  transition: transform 0.22s ease;
}

.side.is-collapsed .side__toggle-icon {
  transform: rotate(180deg);
}

.side__toggle-text {
  line-height: 1;
}
</style>
