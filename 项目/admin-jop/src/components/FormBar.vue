<template>
  <div class="form-bar">
    <div class="left">
      <slot>
      </slot>
    </div>
    <div class="right">
      <slot name="right">
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
})
export default class FormBar extends Vue {
}
</script>

<style lang="scss" scoped>
.form-bar {
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  padding: 22px 15px 0 15px;
  background-color: #f5f5f5;

  .left {
    /* /deep/ .el-form-item:last-of-type {
      margin-bottom: 0;
    } */
  }

  .right {
    display: flex;
    align-items: flex-end;
    padding-bottom: 22px;
  }
}
</style>


