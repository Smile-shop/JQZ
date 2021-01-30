import {httpReq} from '@/utils/http-req';
import {batchAddToShoppingCartReq} from '@/serves/shopping-cart';
import {Toast} from 'vant';
import store from '@/stores';

export function batchAddToShoppingCart(productID: string[]) {
  return new Promise((resolve, reject) => {
    if (!store.state.isLogin) {
      const shoppingCart = window.localStorage.getItem('wxMallShoppingCart');
      let shoppingCartJSON: string[] = [];

      if (shoppingCart) {
        shoppingCartJSON = JSON.parse(shoppingCart);
      }

      const shoppingCartSet = new Set(shoppingCartJSON);

      productID.forEach((item, index) => {
        shoppingCartSet.add(item);
      });
      shoppingCartJSON = [...shoppingCartSet];
      window.localStorage.setItem('wxMallShoppingCart', JSON.stringify(shoppingCartJSON));
      store.commit('setShoppingCartCount', shoppingCartSet.size);
      Toast('添加成功');
      resolve(shoppingCartJSON);
    } else {
      const body = {
        codeList: productID.map((item) => {
          return {
            code: item,
          };
        }),
      };

      batchAddToShoppingCartReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(batchAddToShoppingCartReq);

      httpRes.then(data => {
        store.dispatch('selectShoppingCartCount');
        Toast('添加成功');
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    }
  });
}

