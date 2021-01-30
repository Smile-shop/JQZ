<template>
  <div
    id="the-advanced-query-checkbox-gourp"
  >
    <header
      @click="showSwitch"
    >
      <span>{{title}}</span>
      <i :class="['iconfont', iconType]"></i>
    </header>
    <div
      v-show="isShow"
    >
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Model, Emit, Watch} from 'vue-property-decorator';

@Component({
})
export default class TheAdvancedQueryCheckboxGroup extends Vue {
  @Prop({
    required: true,
  })
  private title!: string;

  @Prop({
    required: false,
  })
  private isDefaultShow!: boolean;

  private isShow: boolean = false;

  private iconType: string = 'icon-xia';

  @Emit('click')
  private emitClick(top: number, mouseY: number) {
    return top;
  }

  private beforeMount() {
    this.isShow = this.isDefaultShow;

    if (this.isDefaultShow) {
      this.iconType = 'icon-shang';
    }
  }

  private showSwitch(event: any) {
    this.isShow = !this.isShow;
    const target = event.target;

    if (this.isShow) {
      this.iconType = 'icon-shang';
    } else {
      this.iconType = 'icon-xia';
    }

    const toElement = event.toElement;
    this.emitClick(toElement.getBoundingClientRect().top, event.y);
  }
}
</script>

<style lang="scss" scoped>
#the-advanced-query-checkbox-gourp {
  border-bottom: 1px solid var(--color-bg);

  & > header {
    display: flex;
    justify-content: space-between;
    padding: 1.3rem;
    font-size: 1.8rem;
    color: #333333;
  }
}
</style>