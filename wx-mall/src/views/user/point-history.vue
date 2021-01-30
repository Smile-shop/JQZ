<template>
  <base-layout
    title="积分记录"
  >
    <article
      id="point-history"
    >
      <header>
        <div>
          <span>累计积分</span>
          <span>{{pointTotal.totalUnScore}}</span>
        </div>
        <div>
          <span>可用积分</span>
          <span>{{pointTotal.ableScore}}</span>
        </div>
      </header>
      <section class="content-box">
        <ul class="data-list">
          <li
            v-for="(item, index) of pointHistoryList"
            :key="index"
          >
            <div class="message">
              <span>
                {{item.title}}
              </span>
              <span>
                {{item.credit | pointSign}}
              </span>
            </div>
            <div class="date">
              {{item.createTime | dateYMDHMS}}
            </div>
            <div class="type">
              【{{item.type}}】
            </div>
          </li>
        </ul>
      </section>
    </article>
  </base-layout>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import BaseLayout from '@/layouts/base-layout.vue';
import {getLocalStorage} from '@/utils/local-storage';
import {httpReq} from '@/utils/http-req';
import {Toast} from 'vant';
import {pointSign} from '@/filters/format-point';
import {dateYMDHMS} from '@/filters/format-date';
import {
  pointHistoryReq,
} from '@/serves/user';

@Component({
  components: {
    BaseLayout,
  },
  filters: {
    pointSign,
    dateYMDHMS,
  },
})
export default class UserPointHistory extends Vue {
  private pointTotal: object = {};

  private pointHistoryList: any[] = [];

  private mounted() {
    this.userInfoSelect();
  }

  // 查询积分记录
  private userInfoSelect() {
    return new Promise((resolve, reject) => {
      const localStorageData = getLocalStorage();
      const body = {
        companyKey: localStorageData.wxUserInfo!.companyKey,
        cardCode: localStorageData.memberCard,
        openid: localStorageData.wxUserInfo!.openid,
      };

      pointHistoryReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(pointHistoryReq);
      Toast.loading('加载中...');
      httpRes.then(data => {
        Toast.clear();
        this.pointTotal = data.score;
        this.pointHistoryList = data.detail;
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }
}
</script>

<style lang="scss" scoped>
#point-history {
  display: grid;
  grid-template-rows: 6.3rem auto;

  & > header {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    padding: .9rem 0;
    font-size: 1.8rem;
    color: #fff;
    background-color: var(--color-theme);

    & > div {
      display: grid;
      grid-row-gap: .5rem;
      justify-items: center;

      &:first-of-type {
        border-right: 1px solid #fff;
      }
    }
  }

  & > .content-box {
    & > .data-list {
      & > li {
        display: grid;
        line-height: 1;
        grid-row-gap: 1.3rem;
        border-bottom: 1px solid #f5f5f5;
        padding: 1.3rem 1.6rem;
        background-color: #fff;

        & > .message {
          display: grid;
          grid-auto-flow: column;
          justify-content: space-between;
          color: #333333;
          font-size: 1.8rem;

          & > span {
            &:last-of-type {
              font-size: 2.3rem;
              color: var(--color-theme);
            }
          }
        }

        & > .date {
          color: #999999;
          font-size: 1.8rem;
        }

        & > .type {
          color: #333333;
          font-size: 1.8rem;
        }
      }
    }
  }
}
</style>