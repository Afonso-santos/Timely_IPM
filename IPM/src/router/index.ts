import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStorage } from '@/stores/session.ts'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('../views/AppHome.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/tasks',
            component: () => import('../views/AppTasks.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/students',
            component: () => import('../views/AppStudents.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/ucs',
            component: () => import('../views/AppUCs.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/ucs/:abbreviation',
            component: () => import('../views/AppInfoUC.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/requests',
            component: () => import('../views/AppRequests.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/statistics',
            component: () => import('../views/AppStatistics.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/profile',
            component: () => import('../views/AppProfile.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/requests-students',
            component: () => import('../views/AppRequestsStudents.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/login',
            component: () => import('../views/AppLogin.vue')
        },
    ]
})

router.beforeEach((to, from, next) => {
    const session = useSessionStorage()

    if (to.meta.requiresAuth) {
        if (session.isLoggedIn) {
            next()
        } else {
            next('/login')
        }
    } else {
        next()
    }
})

export default router