import type { RouteRecordRaw } from 'vue-router';

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
            title: 'login',
        },
    },
    {
        path: '/register',
        component: () => import('@/views/register/index.vue'),
        name: 'register',
        meta: {
            title: 'register',
        },
    },
    {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        name: 'home',
        meta: {
            title: 'home',
        },
    },
]
