<template>
  <div class="layout-only-header">
    <layout-Header v-if="path === '/home/module'" />
    <main :class="path === '/home/module' ? 'hasHeader' : 'noHeader' ">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import LayoutHeader from './components/LayoutHeader.vue';

@Component({
  components: {
    LayoutHeader,
  },
})
export default class LayoutMain extends Vue {
  get path() {
    return this.$route.fullPath;
  }
}
</script>

<style lang="scss" scoped>
.layout-only-header {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 860px;
  background: #fff;

  > .layout-header {
    z-index: var(--zindex-sticky);
    position: sticky;
    top: 0;
    right: 0;
    left: 0;
  }

  > main {
    overflow: auto;
  }
  .hasHeader {
    height: calc(100vh - 60px);
    background-color: #ecf5ff;
  }
  .noHeader {
    height: 100vh;
    // background: #ecf5ff;
  }
}
</style>


