<template>
  <i
    ref="icon"
    :class="['iconfont', type]"
    :style="{
      fontSize: size,
      color: color
    }"
  >
  </i>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class ElIcon extends Vue {
  @Prop({
    type: String,
    required: false,
    default: 'el-icon-picture-outline-round'
  })
  type!: string;

  @Prop({
    type: String,
    required: false,
    default: '16px'
  })
  size!: string;

  @Prop({
    type: String,
    required: false,
    default: '#6699ff'
  })
  color!: string;
}
</script>

<style lang="scss" scoped>
.iconfont{

}
</style>


