<template>
  <div id="user">
    <main>
      <div class="user-top">
        <div class="left">
          <img v-if="user.headimgUrl" :src="user.headimgUrl" alt="头像" />
          <img v-else src="~@/assets/img/avatar.png" alt="头像" />
          <div class="right">
            <div class="name">
              {{user.nickname}}
            </div>
            <div class="top">
              <i class="iconfont icon-huiyuan"></i>
              {{user.ranking ? `第${user.ranking}位` : '排名未上榜'}}
            </div>
          </div>
        </div>
        <div @click="showFollow" class="right">
          <i class="iconfont icon-xiaoxi"></i>
          收益提醒
        </div>
      </div>
      <div class="income">
        <div class="left">
          <div class="to-account">
            <div class="key">
              已到账
            </div>
            <div class="value">
              <span class="cny">￥</span>
              {{user.arrivedAmount}}
            </div>
          </div>
          <div class="vertical-line"></div>
          <div class="withdraw-deposit">
            <div class="key">
              已提现
            </div>
            <div class="value">
              <span class="cny">￥</span>
              {{user.withdrawedAmount}}
            </div>
          </div>
        </div>
        <div class="right">
          <button
            @click="withdrawDeposit"
          >
            提现
          </button>
        </div>
      </div>
      <router-link custom to="/invite-record" v-slot="{ navigate }">
        <div @click="navigate" class="invite">
          <header>
            <div class="left">
              邀请明细
            </div>
            <div class="right">
              <i class="iconfont icon-gengduo1"></i>
            </div>
          </header>
          <div class="detail">
            <div class="detail-item invite">
              <div class="key">
                邀请人数
              </div>
              <div class="value">
                {{user.inviteNum}}
              </div>
            </div>
            <div class="detail-item sell">
              <div class="key">
                分销订单
              </div>
              <div class="value">
                {{user.distributionNum}}
              </div>
            </div>
          </div>
        </div>
      </router-link>
      <app-top
        page="user"
        :type="home.rankingType"
        v-model="top"
      />
    </main>
    <app-copyright/>
    <app-control page="1"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { useStore } from "vuex";
import { addWithdraw, queryRanking } from "@/api";
import AppTop from '../components/app-top.vue';
import AppCopyright from '../components/app-copyright.vue';
import AppControl from '../components/app-control.vue';
import appMessage from '@/utils/app-message';

export default defineComponent({
  components: {
    AppTop,
    AppCopyright,
    AppControl,
  },
  setup() {
    const store = useStore();
    const top = ref([]);

    // 提现
    async function withdrawDeposit() {
      const body = {};

      try {
        const res = await addWithdraw(body);

        if (res) {
          appMessage(res.msg);
          store.dispatch('getUserInfo');
        }
      } catch (error) {
        console.warn(error);
      }
    }

    // 显示关注公众号
    function showFollow() {
      store.commit('setIsShowFollow', true);
    }

    async function init() {
      store.dispatch('getUserInfo');
    }

    onMounted(() => {
      init();
    });

    return {
      home: computed(() => store.state.home),
      user: computed(() => store.state.user),
      top,
      showFollow,
      withdrawDeposit,
    }
  }
})
</script>

<style lang="scss" scoped>
#user {
  min-height: 100vh;
  background-color: #F7F7F7;

  > main {
    min-height: 78vh;
    padding: 6vw 4vw 0 4vw;

    > .user-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 7.7vw;

      > .left {
        display: flex;
        align-items: center;

        > img {
          margin-right: 2.7vw;
          object-position: center;
          object-fit: cover;
          border-radius: 50%;
          width: 14.9vw;
          height: 14.9vw;
        }

        > .right {
          > .name {
            margin-bottom: 1.3vw;
            font-size: 4.3vw;
            color: #1D0800;
          }

          > .top {
            display: flex;
            align-items: center;
            font-size: 3.2vw;
            color: #9D9595;

            > .iconfont {
              margin-right: 2vw;
              font-size: 5vw;
              color: #FD7B2B;
            }
          }
        }
      }

      > .right {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-left: 1px solid #D2C5BB;
        padding-left: 3vw;
        font-size: 3.2vw;
        color: #FC7125;

        > .iconfont {
          margin-bottom: 1vw;
          font-size: 7vw;
          color: #FC7125;
        }
      }
    }

    > .income {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 2.1vw;
      background-image: url(~@/assets/img/rect.png);
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      padding: 4.8vw 3vw 4.8vw 7vw;
      margin-bottom: 9vw;

      > .left {
        display: flex;

        > .to-account, .withdraw-deposit {
          font-size: 3.2vw;
          color: #FFFFFF;

          > .key {
            margin-bottom: 2vw;
          }

          > .value {
            font-size: 4.8vw;

            > .cny {
              font-size: 3.2vw;
            }
          }
        }

        > .vertical-line {
          margin: 0 5.5vw;
          width: 1px;
          background-color: #FFF;
        }
      }

      > .right {
        > button {
          border: none;
          padding: 1.5vw 7vw;
          background: #FFFFFF;
          border-radius: 4vw;
          font-size: 3.7vw;
          color: #FC7125;
        }
      }
    }

    > .invite {
      margin-bottom: 11vw;

      > header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 3.7vw;
        font-size: 3.7vw;
        font-weight: bold;
        color: #000104;

        > .right {
          > .iconfont {
            font-size: 2.8vw;
            color: #B3B8C1;
          }
        }
      }

      > .detail {
        display: flex;
        justify-content: space-between;

        > .detail-item {
          padding: 3.5vw 4vw;
          width: 43vw;
          background: #FFFFFF;
          border-radius: 2.1vw;
          background-position: bottom right;
          background-repeat: no-repeat;
          background-size: 14vw 12vw;

          > .key {
            margin-bottom: 3vw;
            font-size: 3.2vw;
            color: #9D9595;
          }

          > .value {
            font-size: 5.3vw;
            color: #1D0800;
            font-weight: bold;
          }

          &.invite {
            background-image: url(~@/assets/img/invite.png);
          }

          &.sell {
            background-image: url(~@/assets/img/sell.png);
          }
        }
      }
    }
  }
}
</style>
