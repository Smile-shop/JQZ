<template>
  <div class="page-set">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        label="首页名称"
        name="name"
      >
        <name-set :tabIndex="tabIndex"/>
      </el-tab-pane>
      <el-tab-pane
        label="客户设置"
        name="client"
      >
        <client-set/>
      </el-tab-pane>
      <el-tab-pane
        label="风格设置"
        name="style"
      >
        <style-set :tabIndex="tabIndex"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import NameSet from './NameSet.vue';
import ClientSet from './ClientSet.vue';
import StyleSet from './StyleSet.vue';

@Component({
  components: {
    NameSet,
    ClientSet,
    StyleSet
  }
})
export default class PageSettings extends Vue {
  activeName = 'name';
  private tabIndex = 'name'
  private handleClick(tab: any) {
    this.tabIndex = tab.name;
  }
}
</script>

<style lang="scss" scoped>

</style>