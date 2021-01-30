<template>
  <div class="page-show">
    <el-tabs v-model="activeName">
      <el-tab-pane
        label="界面风格"
        name="style"
      >
        <style-set/>
      </el-tab-pane>
      <el-tab-pane
        label="交易规则"
        name="rule"
      >
        <rule-set/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import StyleSet from './StyleSet.vue';
import RuleSet from './RuleSet.vue';

@Component({
  components: {
    StyleSet,
    RuleSet
  }
})
export default class WxMallPageSet extends Vue {
  activeName = 'style'
}
</script>

<style lang="scss" scoped>
.page-show {
}
</style>


