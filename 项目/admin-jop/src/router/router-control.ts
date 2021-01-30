/*
 * @Descripttion:
 * @version:
 * @Author: XJHong
 * @Date: 2020-06-12 16:25:27
 * @LastEditTime: 2020-06-19 15:27:58
 */
import router from './index';
import store from '@/store/index';
import { Message } from 'element-ui';
import { pathCanAccess } from '@/utils/permission';

router.beforeEach((to, from, next) => {
  const { meta, matched, path } = to;
  const user = sessionStorage.getItem('user');

  if (user) {
    const canAccess = pathCanAccess(to.path);

    // 是否忽略验证
    const isIgnore = matched.some((item, index) => {
      return item.meta.isIgnore;
    });
    if (isIgnore) {
      next();
    } else {
      if (canAccess) {
        next();
      } else {
        Message.info('您还没有开通该模块');
      }
    }
  } else if (path === '/login') {
    next()
  } else {
    next({
      path: '/login'
    })
  }
})

router.afterEach((to, from) => {
  const { matched } = to;
  const rootRout = matched[0];
  const { commit } = store;
  // 设置根模块路由
  commit('setModuleRouteMeta', rootRout.meta);

  // 设置当前路由
  commit('setRouteMeta', to.meta);
})