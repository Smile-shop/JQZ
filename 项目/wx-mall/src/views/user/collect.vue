<template>
  <base-layout
    :isShowFooter="true"
    :isShowHeader="true"
    :isShowHeaderLogin="false"
    title="我的收藏"
  >
    <list
      v-model="isLoading"
      :finished="isFinished"
      :finished-text="dataList.length ? '没有更多了' : ''"
      @load="loadMore(false, getCollectList)"
    >
      <article
        v-if="dataList.length"
        id="user-collect-hasdata"
        key="hasData"
      >
        <header>
          <div class="amount">
            共<mark>{{dataList.length}}</mark>件商品
          </div>
          <div
            class="delete"
            @click="deleteAllCollectHandle"
          >
            全部删除
          </div>
        </header>
        <the-product-info-row
          type="collect"
          :dataList="dataList"
          @delete="removeCollecHandle"
        />
      </article>
      <article
        v-else
        id="user-collect-notdata"
        key="notData"
      >
        <i class="iconfont icon-xingxing"></i>
        <p>你还没有收藏商品哦！</p>
        <router-link
          tag="button"
          to="/home"
        >
          去逛逛
        </router-link>
      </article>
    </list>
  </base-layout>
</template>

<script lang="ts">
// vue
import {Vue, Component, Mixins} from 'vue-property-decorator';
import {State, Mutation} from 'vuex-class';

// 组件
import BaseLayout from '@/layouts/base-layout.vue';
import TheProductInfoRow from '@/components/the-product-info-row.vue';
import TheTechnicalSupport from '@/components/the-technical-support.vue';
import {Toast, Dialog} from 'vant';
import LoadMore from '@/mixins/load-more';

// http
import {httpReq} from '@/utils/http-req';
import {collectListReq, collectDeleteReq, collectDeleteAllReq} from '@/serves/user';


@Component({
  components: {
    BaseLayout,
    TheProductInfoRow,
    TheTechnicalSupport,
  },
})
export default class UserCollect extends Mixins(LoadMore) {
  // 删除中
  private deleting: boolean = false;

  private created() {
    this.loadMore(true, this.getCollectList);
  }

  // 查询收藏列表
  private getCollectList() {
    return new Promise((resolve, reject) => {
      const body = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };

      collectListReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(collectListReq);
      httpRes.then(data => {
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 删除所有处理
  private deleteAllCollectHandle() {
    Dialog.confirm({
      title: '确定要删除所有收藏吗？',
    }).then(data => {
      this.deleteAllCollectReq().then(() => {
        this.loadMore(true, this.getCollectList);
      });
    });
  }

  // 删除所有
  private deleteAllCollectReq() {
    return new Promise((resolve, reject) => {
      const body = {
      };

      collectDeleteAllReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(collectDeleteAllReq);
      Toast.loading('删除中...');
      httpRes.then(data => {
        Toast('删除成功');
        setTimeout(() => {
          this.loadMore(true, this.getCollectList);
        }, 500);
        resolve();
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 删除处理
  private removeCollecHandle(index: number) {
    if (!this.deleting) {
      this.deleting = true;
      this.removeCollectReq(this.dataList[index].code).then((value) => {
        this.dataList.splice(index, 1);
        this.getCollectList();
      }).finally(() => {
        this.deleting = false;
      });
    } else {
      Toast('操作太快了~~');
    }
  }

  // 移除收藏
  private removeCollectReq(id: string) {
    return new Promise((resolve, reject) => {
      const body = {
        productCode: id,
      };

      collectDeleteReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(collectDeleteReq);
      httpRes.then(data => {
        Toast('删除成功');
        setTimeout(() => {
          this.loadMore(true, this.getCollectList);
        }, 500);
        resolve();
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }
}
</script>

<style lang="scss" scoped>
#user-collect-hasdata {
  width: 100%;

  & > header {
    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
    padding: 1.5rem;
    color: #666666;
    font-size: 1.5rem;

    & > .amount {
      & > mark {
        color: var(--color-theme);
        background-color: inherit;
      }
    }

    & > .delete {
      color: var(--color-theme);
    }
  }
}

#user-collect-notdata {
  display: grid;
  align-content: start;
  justify-items: center;
  grid-row-gap: 3rem;
  padding-top: 7.4rem;
  width: 100%;

  & > .iconfont {
    font-size: 7.3rem;
    color: #dddddd;
  }

  & > p {
    margin: 0;
    font-size: 1.8rem;
    color: #666666;
  }

  & > button {
    border: 2px solid var(--color-theme);
    border-radius: .3rem;
    padding: 1rem 2.5rem;
    background-color: transparent;
    font-size: 1.8rem;
    color: var(--color-theme);
  }
}
</style>
