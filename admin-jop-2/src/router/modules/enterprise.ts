import { RouteConfig } from 'vue-router';

export const enterpriseRoute: RouteConfig = {
  path: '/enterprise',
  component: () => import('@/layout/layout-main.vue'),
  children: [
    {
      path: 'account',
      component: () => import('@/layout/page-router-view.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/modules/enterprise/account/index.vue'),
        },
      ],
    },
    {
      path: 'organization',
      component: () => import('@/layout/page-router-view.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/modules/enterprise/organization/index.vue'),
        },
      ],
    },
    {
      path: 'role',
      component: () => import('@/layout/page-router-view.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/modules/enterprise/role/index.vue'),
        },
        {
          path: 'create-or-edit',
          component: () => import('@/views/modules/enterprise/role/create-or-edit.vue'),
        },
      ],
    },
    {
      path: 'position',
      component: () => import('@/layout/page-router-view.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/modules/enterprise/position/index.vue'),
        },
      ],
    },
  ],
};
