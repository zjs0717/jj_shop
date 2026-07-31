<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppSide from '@/components/side/index.vue'

const collapsed = ref(false)
</script>

<template>
  <div class="home" :class="{ 'is-collapsed': collapsed }">
    <AppSide v-model:collapsed="collapsed" />

    <div class="home__main">
      <main class="home__content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.home {
  --side-width: 220px;
  --side-gap: 16px;

  min-height: 100vh;
  display: flex;
  background:
    radial-gradient(ellipse 80% 50% at 10% -10%, rgba(45, 212, 191, 0.18), transparent 55%),
    radial-gradient(ellipse 60% 40% at 90% 0%, rgba(56, 189, 248, 0.12), transparent 50%),
    linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
  box-sizing: border-box;
}

.home.is-collapsed {
  --side-width: 72px;
}

.home__main {
  flex: 1;
  min-width: 0;
  margin-left: calc(var(--side-width) + var(--side-gap) * 2);
  padding: 12px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: margin-left 0.22s ease;
  box-sizing: border-box;
}

.home__content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.home__content > :deep(*) {
  flex: 1;
}
</style>
