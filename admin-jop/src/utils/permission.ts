import store from '@/store/index';
import user from '@/utils/user';
import {
  superMKT,
  superCRM,
  superAPP,
  cloudShowroom,
  systemSet,
  fission,
  prestore
} from '@/store/state/permission';



// 初始化权限
export function initPermission(originPermission: any) {

  const {
    superMKTPermission,
    superCRMPermission,
    superAPPPermission,
    cloudShowroomPermission,
    fissionPermission,
    prestorePermission
  } = originPermission;

  const canAccessPaths: any[] = [];

  // 设置菜单权限
  function setAppMenuPermission(customMenu: any[], sessionMenu: any[]) {
    // 循环自定义菜单
    customMenu.forEach((item: any, index: number) => {
      const appCode = item.appCode;

      // 查询自定义菜单与系统返回菜单中一致的菜单项
      const selectedMenu = sessionMenu.find((item: any, index: number) => {
        return appCode === item.appCode;
      })

      if (selectedMenu) {
        if (selectedMenu.accept) {
          item.canAccess = true;

          if (item.path) {
            canAccessPaths.push({
              path: item.path,
              appCode: item.appCode,
            });
          }

          const itemChildren = item.children;
          const selectedMenuChildren = selectedMenu.children || [];

          // 如果有子栏目的话，继续设置权限
          if (itemChildren && itemChildren.length) {
            setAppMenuPermission(itemChildren, selectedMenuChildren);
          }
        } else {
          item.canAccess = false;
        }
      } else {
        // 如果默认允许访问就添加路径到可访问数组中
        if (item.canAccess) {
          // 判断是否拥有上级权限
          const pathMatch = (item.path as string).match(/^\/.*(?=\/)/i);

          // 查询可进入的路径的父路径是否可进入
          if (pathMatch) {
            // 判断父路径是否有权限
            const hasParentPath = canAccessPaths.some((item) => {
              return item.path === pathMatch[0];
            });

            // 父路径有权限的话再添加否则不添加
            if (hasParentPath) {
              canAccessPaths.push({
                path: item.path,
                appCode: item.appCode,
              });
            }
          } else {
            // 如果没有父路径的话直接添加
            canAccessPaths.push({
              path: item.path,
              appCode: item.appCode,
            });
          }
        }
      }
    })
  }

  // 设置模块权限
  function setAppMudolePermission(customPermission: any, sessionPermission: any) {
    const { canAccess } = customPermission;
    if (canAccess) {
      canAccessPaths.push({
        path: customPermission.path,
        appCode: customPermission.appCode,
      });

      // 设置子菜单路由
      setAppMenuPermission(customPermission.children, sessionPermission.children);
    } else {
      // 判断当前模块是否能进入
      if (sessionPermission.accept) {
        // 添加模块路由
        customPermission.canAccess = true;
        canAccessPaths.push({
          path: customPermission.path,
          appCode: customPermission.appCode,
        });

        // 设置子菜单路由
        setAppMenuPermission(customPermission.children, sessionPermission.children);
      }
    }
  }

  // 是否是主账号
  function isAdmin(): boolean {
    if (user && user.serverUser) {
      const { isAdmin } = user.serverUser.account;

      if (isAdmin === '1') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  // 初始化自定义模块
  function initCustomModule() {
    // 如果不是主账号
    if (isAdmin()) {
      // 系统设置能进入
      systemSet.canAccess = true;
    } else {
      // 系统设置不能进入
      systemSet.canAccess = false;
    }
  }

  initCustomModule();

  // 设置自定义菜单权限
  function setCustomMenuPermission(customMenu: any[]) {
    if (customMenu && customMenu.length) {
      customMenu.forEach((item, index) => {
        const {
          canAccess,
          path,
          children,
          appCode
        } = item;

        if (canAccess) {
          canAccessPaths.push({
            path,
            appCode
          });

          if (children && customMenu.length) {
            setCustomMenuPermission(children)
          }
        }
      })
    }
  }

  // 设置自定义模块权限
  function setCustomModulePermission(customPermission: any) {
    if (customPermission.canAccess) {
      // 添加模块路由
      canAccessPaths.push({
        path: customPermission.path,
        appCode: customPermission.appCode,
      });

      // 设置子菜单路由
      setCustomMenuPermission(customPermission.children);
    }
  }

  // 设置模块权限
  setAppMudolePermission(superAPP, superAPPPermission);
  setAppMudolePermission(superMKT, superMKTPermission);
  setAppMudolePermission(superCRM, superCRMPermission);
  setAppMudolePermission(cloudShowroom, cloudShowroomPermission);
  setAppMudolePermission(fission, fissionPermission);
  setAppMudolePermission(prestore, prestorePermission);

  // 设置自定义模块权限
  setCustomModulePermission(systemSet);

  store.commit('setPermission', {
    superMKT,
    superCRM,
    superAPP,
    cloudShowroom,
    fission,
    prestore,
    systemSet
  })

  store.commit('setCanAccessAppURL', canAccessPaths);
}

// 是否能进入
export function pathCanAccess(path: string) {
  const mark = 'fission_retail'
  const canAccessAppURL = store.state.canAccessAppURL;
  return canAccessAppURL.some((item: any) => {
    return item.path === path;
  })
}
