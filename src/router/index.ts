import { createRouter, createWebHashHistory } from 'vue-router';
import { routeList } from './routes';

const router = createRouter({
    history: createWebHashHistory(),
    routes: routeList,
});

export default router;