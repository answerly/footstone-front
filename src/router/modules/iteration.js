/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const iterationManagerRouter = {
  path: '/iteration',
  component: Layout,
  redirect: '/iteration/index',
  name: 'iterationManager',
  meta: {
    title: '配置管理',
    icon: 'form',
    roles: ['iteration_list', 'iteration_add', 'package_list', 'package_add']
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/iteration/index'),
      name: 'iteration',
      meta: {
        title: '迭代管理',
        roles: ['iteration_list', 'iteration_add']
      }
    },
    {
      path: 'package',
      component: () => import('@/views/package/index'),
      name: 'package',
      meta: {
        title: '项目发包',
        roles: ['package_list', 'package_add']
      }
    }
  ]
}
export default iterationManagerRouter
