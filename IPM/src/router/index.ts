import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('../views/AppHome.vue')
        },
        {
            path: '/tasks',
            component: () => import('../views/AppTasks.vue')
        },
        {
            path: '/students',
            component: () => import('../views/AppStudents.vue')
        },
        {
            path: '/ucs',
            component: () => import('../views/AppUCs.vue')
        },
        {
            path: '/requests',
            component: () => import('../views/AppRequests.vue')
        },
        {
            path: '/statistics',
            component: () => import('../views/AppStatistics.vue')
        },
        {
          path: '/profile',
          component: () => import('../views/AppProfile.vue'),
        },
    ]
})

export default router