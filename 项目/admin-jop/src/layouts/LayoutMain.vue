<template>
  <div class="layout-main" ref="layoutMain">
    <layout-Header/>
    <main>
      <layout-menu-list/>
      <section
        class="content-box"
      >
        <header v-if="routeMeta.title">
          <div class="left">
            <i
              :class="['iconfont', routeMeta.icon]"
            >
            </i>
            {{routeMeta.title}}
          </div>
          <div class="right" v-if="!routeMeta.hiddenBack">
            <a
              class="back"
              @click="$router.back()"
            >
              <i
                class="iconfont icon-fanhui"
              >
              </i>
              返回
            </a>
          </div>
        </header>
        <section class="content">
          <router-view/>
        </section>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import LayoutMenuList from './components/LayoutMenuList.vue';
import LayoutHeader from './components/LayoutHeader.vue';
import {State, Getter} from 'vuex-class';

@Component({
  components: {
    LayoutMenuList,
    LayoutHeader,
  },
})
export default class LayoutMain extends Vue {
  @State('routeMeta')
  routeMeta: any;

  @Watch('routeMeta')
  watchRouteMeta(value: any) {
    if (value.title) {
      (this.$refs.layoutMain as HTMLDivElement).style.setProperty('--title-height', '80px');
    } else {
      (this.$refs.layoutMain as HTMLDivElement).style.setProperty('--title-height', '0px');
    }
  }

  mounted() {
    if (this.routeMeta.title) {
      (this.$refs.layoutMain as HTMLDivElement).style.setProperty('--title-height', '80px');
    } else {
      (this.$refs.layoutMain as HTMLDivElement).style.setProperty('--title-height', '0px');
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 1350px;
  background: #fff;

  --title-height: 80px;

  > main {
    flex-grow: 1;
    display: flex;

    > .content-box {
      overflow: hidden;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      padding: 25px;
      background-color: #fff;

      > header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        border-bottom: 1px solid #e4e7ed;
        padding-bottom: 15px;

        > .left {
          display: flex;
          align-items: center;
          color: #333333;
          font-size: 22px;

          > .iconfont {
            margin-right: 10px;
            font-size: 24px;
          }
          // .tips{
          //   color: #666;
          //   font-size: 14px;
          //   display: inline-block;
          //   margin-left: 20px;
          // }
        }

        > .right {
          display: flex;
          align-items: center;
          width: 80px;

          > .back {
            cursor: pointer;
            font-size: 14px;
            color: #6699ff;

            > .iconfont {
              margin-right: 6px;
            }

            &:hover {
              color: #77a5ff;
            }
          }
        }
      }

      > .content {
        flex-grow: 1;
        overflow: auto;
        height: calc(100vh - 60px - 30px - var(--title-height));
      }
    }
  }
}
</style>


