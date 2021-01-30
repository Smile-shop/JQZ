<template>
  <div class="set-layout">
    <el-card shadow="never">
      <div slot="header">
        <span>预览</span>
      </div>
      <slot name="preview"/>
    </el-card>
    <el-card shadow="never">
      <div slot="header">
        <span>编辑</span>
      </div>
      <slot name="set"/>
    </el-card>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';

@Component({
})
export default class SetLayout extends Vue {
}
</script>

<style lang="scss" scoped>
  .set-layout {
    display: grid;
    grid-template-columns: 400px auto;
    column-gap: 20px;
    min-height: 800px;
    padding: 10px;
  }
</style>
