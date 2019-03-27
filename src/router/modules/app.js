/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const appManagerRouter = {
  path: '/app',
  component: Layout,
  redirect: '/app/index',
  name: 'appManager',
  meta: {
    title: '应用管理',
    icon: 'table',
    roles: ['app_add', 'app_list', 'props_list', 'props_add', 'props_publish', 'props_offline']
  },
  children: [
    {
      path: 'app',
      component: () => import('@/views/app/index'),
      name: 'app',
      meta: {
        title: '应用管理',
        roles: ['app_add', 'app_list']
      }
    },
    {
      path: 'detail',
      component: () => import('@/views/app/detail'),
      name: 'detail',
      hidden: true,
      meta: {
        title: '应用详情',
        roles: ['app_add', 'app_list']
      }
    },
    {
      path: 'properties',
      component: () => import('@/views/appProperties/index'),
      name: 'properties',
      meta: {
        title: '应用配置',
        roles: ['props_list', 'props_add', 'props_publish', 'props_offline']
      }
    }
  ]
}
export default appManagerRouter
