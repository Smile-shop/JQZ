<template>
  <div id="invite-record">
    <main>
      <div v-if="inviteRecords.length == 0" class="empty">
        <div class="empty-emptyImg">
          <img src="@/assets/img/no-data.png" alt="暂无相关数据" />
        </div>
        <div class="empty-emptyText">暂无相关数据</div>
      </div>
      <ul v-else>
        <li v-for="(item, index) of inviteRecords" :key="index">
          <div class="collect" @click="item.isShowDetail = !item.isShowDetail">
            <div class="left">
              <img v-if="item.headimgUrl" :src="item.headimgUrl" alt="头像" />
              <img v-else src="~@/assets/img/avatar.png" alt="头像" />
              {{item.nickname}}
              <i
                v-if="item.earning > 0"
                class="iconfont icon-xuanzhong"
              ></i>
            </div>
            <div class="right">
              {{item.earning}}元
              <i
                v-if="item.isShowDetail == false"
                class="iconfont icon-arrow-down-bold"
              ></i>
              <i v-else class="iconfont icon-arrow-up-bold"></i>
            </div>
          </div>
          <div v-show="item.isShowDetail" class="detail">
            <div class="detail-item">一级收益：{{item.earningOne}}</div>
            <div class="detail-item">二级收益：{{item.earningTwo}}</div>
          </div>
        </li>
      </ul>
    </main>
    <app-copyright/>
    <app-control page="1" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import AppCopyright from '../components/app-copyright.vue';
import AppControl from '../components/app-control.vue';
import { queryUserInviteRecord } from '@/api/index';

export default defineComponent({
  components: {
    AppCopyright,
    AppControl,
  },
  setup() {
    const inviteRecords = ref<any[]>([]);

    async function getInviteRecord() {
      const body = {};

      try {
        const res = await queryUserInviteRecord(body);

        if (res instanceof Array) {
          res.forEach((value) => {
            if (value.earning > 0) {
              value.isShowDetail = true;
            } else {
              value.isShowDetail = false;
            }
          });
          inviteRecords.value = res;
        }
      } catch (error) {
        console.warn(error);
      }
    }

    function init() {
      //
    }

    onMounted(() => {
      init();
      getInviteRecord();
    });

    return {
      inviteRecords,
    };
  },
});
</script>

<style lang="scss" scoped>
#invite-record {
  min-height: 100vh;
  background-color: #f7f7f7;

  > main {
    min-height: 78vh;
    padding: 3vw 4vw;

    .empty {
      height: 70vh;
      text-align: center;
      overflow: hidden;
      &-emptyImg {
        margin-top: 26vw;
        img {
          width: 32vw;
        }
      }
      &-emptyText {
        margin-top: 6.4vw;
        font-size: 3.7vw;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
    }

    > ul {
      > li {
        background: #ffffff;
        border-radius: 2.1vw;
        padding: 3vw;

        &:not(:last-of-type) {
          margin-bottom: 3vw;
        }

        > .collect {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5vw;

          > .left {
            position: relative;
            display: flex;
            align-items: center;
            font-size: 3.7vw;
            color: #1d0800;

            > img {
              margin-right: 3vw;
              object-fit: cover;
              object-position: center center;
              border-radius: 50%;
              width: 12.3vw;
              height: 12.3vw;
            }

            > .iconfont {
              position: absolute;
              left: 10vw;
              bottom: 0;
              font-size: 5vw;
              color: #ff0000;
            }
          }

          > .right {
            font-size: 3.7vw;
            color: #fc7125;

            > .iconfont {
              margin-left: 2.5vw;
              color: #b3b8c1;
            }
          }
        }

        > .detail {
          display: flex;
          justify-content: space-between;
          background: #f7f7f7;
          border-radius: 2.1vw;
          padding: 4vw 5vw;

          > .detail-item {
            font-size: 3.7vw;
            color: #9d9595;
          }
        }
      }
    }
  }
}
</style>
