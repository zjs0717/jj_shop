<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const orders = [
  {
    id: 'o1',
    status: '待发货',
    title: '柔雾唇釉套装 · 日常显白三色',
    price: 89,
    cover: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  },
  {
    id: 'o2',
    status: '配送中',
    title: '降噪蓝牙耳机 Pro · 续航 36h',
    price: 299,
    cover: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
  },
  {
    id: 'o3',
    status: '已完成',
    title: '日式低糖曲奇礼盒',
    price: 49,
    cover: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80',
  },
]

async function back(): Promise<void> {
  await router.push('/home/shop')
}
</script>

<template>
  <div class="orders">
    <header class="orders__head">
      <button type="button" class="back" @click="back">← 商城</button>
      <h1>我的订单</h1>
      <p>跟踪包裹，复购更方便</p>
    </header>

    <div class="list">
      <article v-for="o in orders" :key="o.id" class="order">
        <div class="order__top">
          <span>订单 {{ o.id.toUpperCase() }}</span>
          <strong>{{ o.status }}</strong>
        </div>
        <div class="order__body">
          <img :src="o.cover" :alt="o.title" />
          <div>
            <h3>{{ o.title }}</h3>
            <p class="price"><small>¥</small>{{ o.price }}</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.back {
  border: 0;
  background: transparent;
  color: var(--brand);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-bottom: 8px;
}

.orders__head h1 {
  font-family: var(--display);
  font-size: 28px;
  font-weight: 800;
}

.orders__head p {
  margin-top: 4px;
  color: var(--muted);
  font-size: 13px;
}

.list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order {
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 14px;
}

.order__top {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 12px;
}

.order__top strong {
  color: var(--brand);
  font-weight: 700;
}

.order__body {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 12px;
  align-items: center;
}

.order__body img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 12px;
}

.order__body h3 {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.price {
  margin-top: 8px;
  color: var(--ink);
  font-family: var(--display);
  font-size: 18px;
  font-weight: 800;
}

.price small {
  font-size: 12px;
}
</style>
