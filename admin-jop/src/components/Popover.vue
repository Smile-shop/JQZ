<template>
  <div class="popover" @mousemove="show = true" @mouseleave="show = false">
    <div class="show-content">
      <slot name="show-content"></slot>
    </div>
    <div class="reference" v-show="show">
      <slot name="reference"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class Popover extends Vue {
  private show: boolean = false;
}
</script>

<style lang="scss" scoped>
.popover {
  display: flex;
  align-items: center;
  width: fit-content;
  .show-content {
    padding: 0 12px;
  }
}
</style>


