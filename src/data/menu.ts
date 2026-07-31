import type { MenuItem } from '@/types/menu'

/** C 端主导航：首页大屏 / 买东西 / 短视频 / 直播 */
const menuList: MenuItem[] = [
  {
    id: 'dashboard',
    title: '首页',
    path: '/home/dashboard',
    icon: 'dashboard',
  },
  {
    id: 'shop',
    title: '买东西',
    icon: 'shop',
    children: [
      {
        id: 'shop-home',
        title: '商城首页',
        path: '/home/shop',
        icon: 'shop-home',
      },
      {
        id: 'shop-category',
        title: '商品分类',
        path: '/home/shop/category',
        icon: 'category',
      },
      {
        id: 'shop-cart',
        title: '购物车',
        path: '/home/shop/cart',
        icon: 'cart',
      },
      {
        id: 'shop-orders',
        title: '我的订单',
        path: '/home/shop/orders',
        icon: 'orders',
      },
    ],
  },
  {
    id: 'video',
    title: '短视频',
    icon: 'video',
    children: [
      {
        id: 'video-feed',
        title: '推荐',
        path: '/home/video',
        icon: 'feed',
      },
      {
        id: 'video-follow',
        title: '关注',
        path: '/home/video/follow',
        icon: 'follow',
      },
      {
        id: 'video-nearby',
        title: '同城',
        path: '/home/video/nearby',
        icon: 'nearby',
      },
    ],
  },
  {
    id: 'live',
    title: '直播',
    icon: 'live',
    children: [
      {
        id: 'live-hall',
        title: '直播大厅',
        path: '/home/live',
        icon: 'live-hall',
      },
      {
        id: 'live-preview',
        title: '直播预告',
        path: '/home/live/preview',
        icon: 'preview',
      },
      {
        id: 'live-replay',
        title: '直播回放',
        path: '/home/live/replay',
        icon: 'replay',
      },
    ],
  },
]

export default menuList
