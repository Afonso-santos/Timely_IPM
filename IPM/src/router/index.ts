import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('../views/AppHome.vue')
        },
        {
            path: '/about',
            component: () => import('../views/AppTasks.vue')
        }
    ]
})

export default router