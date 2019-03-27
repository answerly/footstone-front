/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const systemManagerRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/properties',
  name: 'systemManager',
  meta: {
    title: '运维管理',
    icon: 'example',
    roles: ['sys_props_add', 'sys_props_list', 'datasource_list', 'datasource_add']
  },
  children: [
    {
      path: 'properties',
      component: () => import('@/views/systemProperties/index'),
      name: 'systemProperties',
      meta: {
        title: '环境配置',
        roles: ['sys_props_add', 'sys_props_list']
      }
    },
    {
      path: 'datasource',
      component: () => import('@/views/datasource/index'),
      name: 'datasource',
      meta: {
        title: '数据源管理',
        roles: ['datasource_list', 'datasource_add']
      }
    },
    {
      path: 'dataExec',
      component: () => import('@/views/dataExec/index'),
      name: 'dataExec',
      meta: {
        title: '数据变更',
        roles: ['datasource_list', 'datasource_add']
      }
    },
    {
      path: 'dataExec/add',
      component: () => import('@/views/dataExec/add'),
      name: 'dataExecAdd',
      hidden: true,
      meta: {
        title: '新建数据变更',
        roles: ['datasource_list', 'datasource_add']
      }
    },
    {
      path: 'dataExec/detail',
      component: () => import('@/views/dataExec/detail'),
      name: 'dataExecDetail',
      hidden: true,
      meta: {
        title: '数据变更明细',
        roles: ['datasource_list', 'datasource_add']
      }
    }
  ]
}
export default systemManagerRouter
