<template>
  <base-layout
    :isShowFooter="false"
    :isShowHeader="true"
    :isShowHeaderLogin="false"
    :custom-footer="true"
    title="收货地址"
  >
    <article
      id="location-receive"
    >
      <div
        v-if="dataList.length"
        class="has-content"
        key="hasData"
      >
        <ul>
          <li
            v-for="(item, index) of dataList"
            :key="index"
          >
            <div class="top">
              <div>
                <span>{{item.addressee}}</span>
                <span>{{item.phone}}</span>
              </div>
              <div>
                {{item.province.concat(item.city, item.district, item.address)}}
              </div>
            </div>
            <div class="bottom">
              <div class="left">
                <span
                  v-if="item.isDefault"
                >
                  默认
                </span>
              </div>
              <div class="right">
                <span
                  @click="updateAddress(item)"
                >
                  <i class="iconfont icon-bianji"></i>
                  编辑
                </span>
                <span
                  @click="deleteAddressHandle(item.id)"
                >
                  <i class="iconfont icon-shanchu"></i>
                  删除
                </span>
              </div>
            </div>
          </li>
        </ul>
        <router-link
          tag="footer"
          to="/user/location-create"
        >
          添加收货地址
        </router-link>
      </div>

      <div
        v-else
        class="not-content"
        key="notData"
      >
        <i class="iconfont icon-xingxing"></i>
        <p>您还没有添加收货地址</p>
        <router-link
          tag="button"
          to="/user/location-create"
        >
          添加收货地址
        </router-link>
      </div>
    </article>
  </base-layout>
</template>

<script lang="ts">
// vue
import {Vue, Component} from 'vue-property-decorator';
import {Mutation, namespace} from 'vuex-class';

// 组件
import BaseLayout from '@/layouts/base-layout.vue';
import {Toast, Dialog} from 'vant';

// http
import {httpReq} from '@/utils/http-req';
import {addressListReq, addressDeleteReq} from '@/serves/user';

@Component({
  components: {
    BaseLayout,
  },
})
export default class LocationReceive extends Vue {
  @namespace('userModule').Mutation('setAddressChecked')
  private setAddressChecked!: any;

  private dataList: any[] = [];

  private mounted() {
    this.selectAddressList();
  }

  // 查询地址列表
  private selectAddressList() {
    return new Promise((resolve, reject) => {
      const body = {};

      addressListReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(addressListReq);
      Toast.loading('查询中...');
      httpRes.then(data => {
        this.dataList = data;
        Toast.clear();
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 删除地址处理
  private deleteAddressHandle(id: string) {
    Dialog.confirm({
      title: '请确认删除',
    }).then(onfulfilled => {
      this.deleteAddress(id);
    });
  }

  // 删除地址
  private deleteAddress(id: string) {
    return new Promise((resolve, reject) => {
      const body = {
        id,
      };

      addressDeleteReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(addressDeleteReq);
      Toast.loading('删除中...');
      httpRes.then(data => {
        this.dataList = data;
        Toast('删除成功');
        setTimeout(() => {
          this.selectAddressList();
        }, 1000);
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 编辑地址
  private updateAddress(addressObj: object) {
    this.setAddressChecked(addressObj);
    this.$router.push({
      path: '/user/location-create',
      query: {
        edit: '1',
      },
    });
  }
}
</script>

<style lang="scss" scoped>
#location-receive {
  & > .has-content{
    & > ul {
      & > li {
        margin-bottom: .5rem;
        background-color: #fff;

        &:last-of-type {
          margin-bottom: 0;
        }

        & > .top {
          display: grid;
          align-content: start;
          grid-row-gap: 1rem;
          padding: 1.8rem 1.5rem;
          border-bottom: 1px solid #f5f5f5;

          & > div {
            &:first-of-type {
              display: grid;
              grid-auto-flow: column;
              justify-content: space-between;
              align-items: center;
              font-size: 1.8rem;
              color: #333333;
            }

            &:last-of-type {
              font-size: 1.8rem;
              color: #333333;
            }
          }
        }

        & > .bottom {
          display: grid;
          justify-content: space-between;
          grid-auto-flow: column;
          padding: 1.5rem;
          font-size: 1.8rem;

          & > .left {
            color: var(--color-theme);
          }

          & > .right {
            display: grid;
            justify-content: start;
            grid-auto-flow: column;
            grid-column-gap: 3rem;
            color: #666666;

            & .iconfont {
              font-size: 2rem;
              color: #999999;
            }
          }
        }
      }
    }

    & > footer {
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;;
      padding: 1.7rem;
      text-align: center;
      background-color: var(--color-theme);
      font-size: 1.8rem;
      color: #ffffff;
    }
  }

  & > .not-content {
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
}
</style>