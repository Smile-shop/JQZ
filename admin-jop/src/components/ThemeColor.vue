<template>
  <div class="color-picker">
    <el-color-picker v-model="componentColor"></el-color-picker>
    <div class="preinstall-color">
      <div
        v-for="(item, index) of recommendColor"
        :key="index"
        :style="{
          backgroundColor: item
        }"
        @click="setThemeColor(item)"
      >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Emit, Watch} from 'vue-property-decorator';

@Component({
})
export default class FormBar extends Vue {
  @Prop({
    type: String,
    required: true,
  })
  color!: string;

  componentColor = '#e12f30';

  recommendColor = [
    '#e12f30',
    '#9e0028',
    '#f66b77',
    '#e83b66',
    '#dbb866',
    '#e4c589',
    '#6e73b8',
    '#f1ae85',
    '#d9b39b',
  ]

  @Watch('color')
  watchColor(value: string) {
    this.componentColor = value;
  }

  @Watch('componentColor')
  watchComponentColor(value: string) {
    this.emitThemeColor();
  }

  setThemeColor(value: string) {
    this.componentColor = value;
  }

  @Emit('update:color')
  emitThemeColor() {
    return this.componentColor;
  }

  mounted() {
    this.componentColor = this.color;
  }
}
</script>

<style lang="scss" scoped>
.color-picker {
  display: flex;

  > .preinstall-color {
    display: flex;
    margin-left: 10px;

    > div {
      cursor: pointer;
      height: 40px;
      width: 40px;
    }
  }
}
</style>


