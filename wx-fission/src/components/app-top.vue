<template>
  <div class="app-top">
    <header>
      <i class="iconfont icon-jiangbei"></i>
      幸运榜单
    </header>
    <table>
      <thead>
        <tr>
          <th>排名</th>
          <th>用户名称</th>
          <th v-if="type == 1">邀请人数</th>
          <th v-else>收益</th>
        </tr>
      </thead>
      <tbody v-if="modelValue.length > 0">
        <tr v-for="(item, index) of modelValue" :key="index">
          <td>{{index + 1}}</td>
          <td class="middle">
            <img v-if="item.headimgUrl" :src="item.headimgUrl" alt="头像" />
            <img v-else src="~@/assets/img/avatar.png" alt="头像" />
            <div class="text">
              {{item.nickname}}
            </div>
            <i v-if="index < 3" class="crown iconfont icon-huangguan"></i>
          </td>
          <td v-if="type == 1">累计邀请{{item.inviteNum}}人</td>
          <td v-else>累计收益{{item.earning}}元</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td :colspan="type == 1 ? 4 : 3">
            <div class="app-top-emptyImg">
              <img src="@/assets/img/no-data.png" alt="暂无相关数据" />
            </div>
            <div class="app-top-emptyText">暂无相关数据</div>
          </td>
        </tr>
      </tbody>
    </table>
    <footer @click="toUser" v-if="page == 'home'">
      查看完整排行榜
      <i class="iconfont icon-gengduo"></i>
    </footer>
    <footer
      @click="onNextClick"
      v-if="page == 'user' && topPagination.isOver == false && modelValue.length > 0"
    >
      加载更多
      <i class="iconfont icon-gengduo"></i>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { queryRanking } from '@/api';

export default defineComponent({
  emits: ['next-click', 'update:modelValue'],
  props: {
    type: {
      type: Number,
      default: 1, //  2 = 收益 | 1 = 邀请人数
    },
    page: {
      type: [String, Number],
      default: 'home', // home | user
    },
    modelValue: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  setup(props: any, { emit }) {
    const router = useRouter();
    const topPagination = reactive({
      isOver: false,
      body: {
        offset: 0,
        top: 10,
      },
    });

    function toUser() {
      router.push({
        path: '/user',
      });
    }

    // 获取排行榜
    async function getTop() {
      const body = topPagination.body;

      try {
        const res = await queryRanking(body);

        if (res) {
          if (props.modelValue.length) {
            emit('update:modelValue', props.modelValue.concat(res));
          } else {
            emit('update:modelValue', res);
          }
          if (res.length < topPagination.body.top) {
            topPagination.isOver = true;
          }
        } else {
          topPagination.isOver = true;
        }
      } catch (error) {
        console.warn(error);
      }
    }

    // 排行榜翻页
    function topNext() {
      if (topPagination.isOver) {
        return;
      }

      topPagination.body.offset = props.modelValue.length;

      getTop();
    }

    function onNextClick() {
      emit('next-click');
      topNext();
    }

    onMounted(() => {
      getTop();
    });

    return {
      topPagination,
      toUser,
      onNextClick,
      topNext,
    };
  },
});
</script>

<style lang="scss" scoped>
.app-top {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 3.2vw;
  padding: 5vw 3vw;
  &-emptyImg {
    text-align: center;
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
  > header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 3vw;
    font-size: 4.8vw;
    color: #fc7125;

    > .iconfont {
      margin-right: 2vw;
      font-size: 7vw;
    }
  }

  > table {
    width: 100%;

    &:not(:last-child) {
      margin-bottom: 5vw;
    }

    > thead {
      width: 100%;
      > tr {
        font-size: 3.7vw;
        color: #1d0800;

        > th {
          padding: 4vw 0;

          &:nth-of-type(1) {
            text-align: center;
          }

          &:nth-of-type(2) {
            padding-left: 5vw;
            padding-right: 5vw;
            width: 30vw;
          }

          &:nth-of-type(3) {
            text-align: end;
          }
        }
      }
    }

    > tbody {
      width: 100%;
      > tr {
        font-size: 3.7vw;
        color: #1d0800;

        &:nth-of-type(1) {
          > td:nth-of-type(1) {
            color: #fd7b2b;
          }

          > td:nth-of-type(2) {
            > .crown {
              color: #fd7b2b;
            }
          }
        }

        &:nth-of-type(2) {
          > td:nth-of-type(1) {
            color: #b2e2fc;
          }

          > td:nth-of-type(2) {
            > .crown {
              color: #b2e2fc;
            }
          }
        }

        &:nth-of-type(3) {
          > td:nth-of-type(1) {
            color: #f2c29d;
          }

          > td:nth-of-type(2) {
            > .crown {
              color: #f2c29d;
            }
          }
        }

        > td {
          padding: 2vw 0;
        }

        > td:nth-of-type(1) {
          text-align: center;
          width: 10vw;
        }

        > td:nth-of-type(2) {
          overflow: hidden;
          text-overflow: ellipsis;
          position: relative;
          display: flex;
          align-items: center;
          padding-left: 5vw;
          padding-right: 5vw;

          > .crown {
            position: absolute;
            font-size: 6vw;
            top: -0.7vw;
            left: 3.5vw;
          }

          > img {
            margin-right: 2vw;
            object-fit: cover;
            object-position: center center;
            border-radius: 50%;
            height: 10.7vw;
            width: 10.7vw;
          }

          > .text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 30vw;
          }
        }

        > td:nth-of-type(3) {
          text-align: end;
          color: #fc7125;
        }
      }
    }
  }

  > footer {
    text-align: center;
    font-size: 3.2vw;
    color: #fc7125;

    > .iconfont {
      font-size: inherit;
    }
  }
}
</style>
