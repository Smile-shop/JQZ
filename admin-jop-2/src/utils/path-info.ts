import store from '@/store/index';
import customMenus from '@/config/custom-menus';

// 设置路径权限信息
export function setPathInfo(menus: any[]) {
  const pathInfo: Record<string, any> = {};
  const componentNames: string[] = [];
  const concatMenus = [
    ...menus,
    ...customMenus
  ]

  function pathToComponentName(path: string) {
    const split = path.replace(/-/g, '/').split('/');

    const name = split.reduce((previousValue, currentValue) => {
      return previousValue + currentValue[0].toUpperCase().concat(currentValue.slice(1));
    })

    componentNames.push(name);
  }

  function addPathInfo(menus: any[]) {
    menus.forEach((value) => {
      const {
        name,
        webUrl,
        subMenuList,
        featureList,
        node,
        visible,
      } = value;

      const meta: any = {
        name,
        webUrl,
        node,
        visible,
        feature: {},
      };

      featureList.forEach((value: any) => {
        meta.feature[value.code] = value.enabled === 'Y';
      });

      pathInfo[webUrl] = meta;
      pathToComponentName(webUrl);

      if (subMenuList instanceof Array && subMenuList.length) {
        addPathInfo(subMenuList);
      }
    });
  }

  addPathInfo(concatMenus);
  store.commit('setPathInfo', pathInfo);
  store.commit('setComponentNames', componentNames);
}
