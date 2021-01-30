<template>
  <div class="layout-main" ref="layoutMain">
    <layout-Header class="header"/>
    <main ref="main">
      <layout-menu-list class="menu-list"/>
      <section
        class="content-box"
      >
        <div class="title" v-if="routeMeta.title">
          <i
            :class="['iconfont', routeMeta.icon]"
          >
          </i>
          {{routeMeta.title}}
        </div>
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
}
</script>

<style lang="scss" scoped>
.layout-main {
  background: #fff;

  > .header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1030;
  }

  > main {
    display: flex;
    margin-top: 60px;
    overflow: hidden;

    > .content-box {
      height: calc(100vh - 60px);
      flex-grow: 1;
      overflow: auto;

      > .title {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e4e7ed;
        padding: 25px;
        color: #333333;
        font-size: 22px;

        > .iconfont {
          margin-right: 10px;
          font-size: 24px;
        }
      }

      > .content {
        padding: 25px;
      }
    }
  }
}
</style>


