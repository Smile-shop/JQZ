import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import store from '@/store/index';
import * as modules from './modules/index';
import { message } from 'ant-design-vue';
import customMenus from '@/config/custom-menus';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/layout/page-router-view.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/login/index.vue')
      },
      {
        path: 'reset-password',
        component: () => import('@/views/login/reset-password.vue')
      }
    ]
  },
  {
    path: '/join',
    component: () => import('@/layout/page-router-view.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/join/index.vue')
      },
      {
        path: 'fail',
        component: () => import('@/views/join/fail.vue')
      },
      {
        path: 'success',
        component: () => import('@/views/join/success.vue')
      }
    ]
  },
  {
    path: '/home',
    component: () => import('@/layout/layout-main.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/home/index.vue')
      }
    ]
  },
  {
    path: '/user',
    component: () => import('@/layout/layout-main.vue'),
    children: [
      {
        path: 'info',
        component: () => import('@/views/user/info.vue'),
      },
      {
        path: 'reset-password',
        component: () => import('@/views/user/reset-password.vue'),
      },
    ],
  },
  {
    path: '/example',
    component: () => import('@/layout/layout-main.vue'),
    children: [
      {
        path: '',
        component: () => import('@/example/index.vue'),
      },
    ],
  },
];

// 添加模块路由
for (const value of Object.values(modules)) {
  routes.push(value);
}

const router = new VueRouter({
  routes
});

// 路由前置守卫
router.beforeEach((to, from, next) => {
  const { matched: toMatched, path } = to;
  const { matched: fromMatched } = from;
  const { state, commit } = store;
  const { menus } = state;

  // 添加历史菜单
  function setHistoryPath(pathMeta: any) {
    const { webUrl, name } = pathMeta;
    const { historyPaths } = state.layout;
    const isInclude = historyPaths.some((value) => {
      return value.path === webUrl;
    });

    if (!isInclude) {
      if (historyPaths.length >= 10) {
        historyPaths.shift();
      }

      historyPaths.push({
        name,
        path: webUrl,
      });

      commit('setLayoutHistoryPaths', historyPaths);
    } else {
    }
  }

  // 设置菜单
  function setMenus() {
    const toRootPath = toMatched[0]?.path;
    const formRootPath = fromMatched[0]?.path;

    if (toRootPath !== formRootPath) {
      const menu = menus.find((item: any) => item.webUrl === toRootPath);

      if (menu) {
        commit('setSubMenus', (menu as any).subMenuList || []);
      } else {
        // 自定义菜单
        const menu = customMenus.find((item: any) => item.webUrl === toRootPath);

        if (menu) {
          commit('setSubMenus', menu.subMenuList || []);
        } else {
          commit('setSubMenus', []);
        }
      }
    }
  }

  // 设置路由meta信息和查询权限
  function checkPermissionAndSetMeta() {
    const { pathInfo } = store.state;
    for (let index = 0; index < toMatched.length; index++) {
      const pathMeta = (pathInfo as any)[toMatched[index].path];

      // 是否是权限控制的路径
      if (pathMeta) {
        // 是否有权限
        if (pathMeta.visible === 'Y') {
          // 是否是页面节点
          if (pathMeta.node === 'N') {
            // 添加历史路径
            setHistoryPath(pathMeta);
            for (const [key, value] of Object.entries(pathMeta)) {
              to.meta[key] = value;
            }

            return true;
          }
        } else {
          message.info('您没有此页面的权限，请联系管理员');
          return false;
        }
      } else {
        return true;
      }
    }

    return true;
  }

  if (checkPermissionAndSetMeta()) {
    setMenus();
    next();
  }
});

export default router;
