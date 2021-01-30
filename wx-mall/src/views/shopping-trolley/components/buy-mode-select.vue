<template>
  <popup
    v-model="isShowCurrent"
    position="bottom"
  >
    <article class="buy-model-select">
      <header>
        选择购买方式
      </header>
      <ul>
        <li>
          <div class="left">
            现金支付：
            <span>
              ¥10000
            </span>
          </div>
          <div class="right">
            <Radio></Radio>
          </div>
        </li>
        <li>
          <div class="left">
            现金+积分：
            <span>
              ¥9000+20000积分
            </span>
          </div>
          <div class="right">
            <Radio></Radio>
          </div>
        </li>
      </ul>
    </article>
  </popup>
</template>

<script lang="ts">
import {Vue, Component, Prop, Model, Emit, Watch} from 'vue-property-decorator';
import {Popup, Radio} from 'vant';

@Component({
  components: {
    Popup,
    Radio,
  },
})
export default class DiscountCouponSelect extends Vue {
  @Model('switch', {
    required: true,
  })
  private isShow!: boolean;

  private isShowCurrent: boolean = false;

  @Watch('isShowCurrent')
  private isShowCurrentWatch(): void {
    if (this.isShow !== this.isShowCurrent) {
      this.emitSwitchEvent();
    }
  }

  @Watch('isShow')
  private isShowWatch(): void {
    if (this.isShow !== this.isShowCurrent) {
      this.isShowCurrent = this.isShow;
    }
  }

  @Emit('switch')
  private emitSwitchEvent(): boolean {
    return this.isShowCurrent;
  }

  private mounted(): void {
    this.isShowCurrent = this.isShow;
  }
}
</script>

<style lang="scss" scoped>
.buy-model-select {
  overflow: hidden;

  & > header {
    border-bottom: 1px solid #f5f5f5;
    padding: 1.7rem 1.5rem;
    font-size: 2rem;
    color: #333333;
  }

  & > ul {
    height: calc(7.3rem * 4);
    overflow: hidden scroll;

    & > li {
      display: grid;
      grid-auto-flow: column;
      justify-content: space-between;
      border-bottom: 1px solid #f5f5f5;
      align-items: center;
      padding: 1.3rem 1.7rem;
      font-size: 1.8rem;

      & > .left {
        font-size: 1.8rem;
        color: #666666;

        & > span{
          color: var(--color-theme);
        }
      }

      & > .right {
        display: grid;
        align-items: center;
      }
    }
  }
}
</style>