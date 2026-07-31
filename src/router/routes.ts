import type { RouteRecordRaw } from 'vue-router'

export const routeList: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta: {
      title: '登录',
    },
  },
  {
    path: '/register',
    component: () => import('@/views/register/index.vue'),
    name: 'register',
    meta: {
      title: '注册',
    },
  },
  {
    path: '/home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
    },
    children: [
      {
        path: '',
        redirect: '/home/dashboard',
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/home/pages/dashboard/index.vue'),
        meta: { title: '数据大屏', module: 'dashboard' },
      },
      // 买东西
      {
        path: 'shop',
        name: 'shop-home',
        component: () => import('@/views/home/pages/shop/ShopHome.vue'),
        meta: { title: '商城首页', module: 'shop' },
      },
      {
        path: 'shop/category',
        name: 'shop-category',
        component: () => import('@/views/home/pages/shop/ShopCategory.vue'),
        meta: { title: '商品分类', module: 'shop' },
      },
      {
        path: 'shop/cart',
        name: 'shop-cart',
        component: () => import('@/views/home/pages/shop/ShopCart.vue'),
        meta: { title: '购物车', module: 'shop' },
      },
      {
        path: 'shop/orders',
        name: 'shop-orders',
        component: () => import('@/views/home/pages/shop/ShopOrders.vue'),
        meta: { title: '我的订单', module: 'shop' },
      },
      // 短视频
      {
        path: 'video',
        name: 'video-feed',
        component: () => import('@/views/home/pages/video/VideoFeed.vue'),
        meta: { title: '推荐', module: 'video' },
      },
      {
        path: 'video/follow',
        name: 'video-follow',
        component: () => import('@/views/home/pages/video/VideoFollow.vue'),
        meta: { title: '关注', module: 'video' },
      },
      {
        path: 'video/nearby',
        name: 'video-nearby',
        component: () => import('@/views/home/pages/video/VideoNearby.vue'),
        meta: { title: '同城', module: 'video' },
      },
      // 直播
      {
        path: 'live',
        name: 'live-hall',
        component: () => import('@/views/home/pages/live/LiveHall.vue'),
        meta: { title: '直播大厅', module: 'live' },
      },
      {
        path: 'live/preview',
        name: 'live-preview',
        component: () => import('@/views/home/pages/live/LivePreview.vue'),
        meta: { title: '直播预告', module: 'live' },
      },
      {
        path: 'live/replay',
        name: 'live-replay',
        component: () => import('@/views/home/pages/live/LiveReplay.vue'),
        meta: { title: '直播回放', module: 'live' },
      },
    ],
  },
]
