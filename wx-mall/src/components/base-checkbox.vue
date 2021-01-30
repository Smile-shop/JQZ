<template>
  <div
    class="base-checkbox"
  >
    <input
      type="text"
    >
    <i class="iconfont icon-bianji"></i>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Model, Emit, Watch} from 'vue-property-decorator';

@Component({})
export default class BaseCheckbox extends Vue {
}
</script>

<style lang="scss" scoped>
.base-checkbox {
  height: 2.2rem;
  width: 2.2rem;
  background-color: var(--color-theme);
}
</style>