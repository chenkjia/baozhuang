import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Layout from '../layouts/MainLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'applications',
        name: 'Applications',
        component: () => import('../views/applications/ApplicationList.vue')
      },
      {
        path: 'applications/create',
        name: 'CreateApplication',
        component: () => import('../views/applications/CreateApplication.vue')
      },
      {
        path: 'applications/:id',
        name: 'ApplicationDetail',
        component: () => import('../views/applications/ApplicationDetail.vue')
      },
      {
        path: 'review',
        name: 'Review',
        component: () => import('../views/review/ReviewList.vue')
      },
      {
        path: 'construction',
        name: 'Construction',
        component: () => import('../views/construction/ConstructionList.vue')
      },
      {
        path: 'installation',
        name: 'Installation',
        component: () => import('../views/installation/InstallationList.vue')
      },
      {
        path: 'account-setup',
        name: 'AccountSetup',
        component: () => import('../views/account-setup/AccountSetupList.vue')
      },
      {
        path: 'accounts',
        name: 'Accounts',
        component: () => import('../views/accounts/AccountList.vue')
      },
      {
        path: 'accounts/:id',
        name: 'AccountDetail',
        component: () => import('../views/accounts/AccountDetail.vue')
      },
      {
        path: 'system/users',
        name: 'Users',
        component: () => import('../views/system/UserManagement.vue')
      },
      {
        path: 'system/roles',
        name: 'Roles',
        component: () => import('../views/system/RoleManagement.vue')
      },
      {
        path: 'system/settings',
        name: 'Settings',
        component: () => import('../views/system/SystemSettings.vue')
      },
      {
        path: 'system/logs',
        name: 'Logs',
        component: () => import('../views/system/LogQuery.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('user')
  if (to.path !== '/login' && !isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
