<template>
  <popup
    v-model="isShowCurrent"
    position="bottom"
  >
    <article class="discount-coupon-select">
      <header>
        选择优惠券
      </header>
      <nav>
        <div
          :class="{
            avtive: showNav === 'available'
          }"
          @click="showSwitch"
        >
          可使用（3）
        </div>
        <div
          :class="{
            avtive: showNav === 'invalid'
          }"
          @click="showSwitch"
        >
          不可使用（3）
        </div>
      </nav>
      <ul>
        <li
          v-if="showNav === 'available'"
        >
          <div class="left">
            <span>金百福珠宝满10000减50</span>
            <span>立减50/满10000元时可用</span>
          </div>
          <div class="right">
            <checkbox></checkbox>
          </div>
        </li>
      </ul>
      <footer>
        <div>
          不使用优惠券
        </div>
        <div>
          确定选择
        </div>
      </footer>
    </article>
  </popup>
</template>

<script lang="ts">
import {Vue, Component, Prop, Model, Emit, Watch} from 'vue-property-decorator';
import {Popup, Checkbox} from 'vant';

type navType = 'available' | 'invalid';

@Component({
  components: {
    Popup,
    Checkbox,
  },
})
export default class DiscountCouponSelect extends Vue {
  @Model('switch', {
    required: true,
  })
  private isShow!: boolean;

  private isShowCurrent: boolean = false;
  private showNav: navType = 'available';

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

  // 显示切换
  private showSwitch(): void {
    this.showNav = this.showNav === 'available' ? 'invalid' : 'available';
  }
}
</script>

<style lang="scss" scoped>
.discount-coupon-select {
  overflow: hidden;

  & > header {
    border-bottom: 1px solid #f5f5f5;
    padding: 1.7rem 1.5rem;
    font-size: 2rem;
    color: #333333;
  }

  & > nav {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    & > div {
      text-align: center;
      padding: 1.7rem;
      font-size: 1.8rem;
      color: #333333;
      border-bottom: 1px solid #f5f5f5;

      &.avtive {
        color: var(--color-theme);
        border-bottom: 1px solid var(--color-theme);
      }
    }
  }

  & > ul {
    height: calc(7.3rem * 4);
    overflow: hidden scroll;

    & > li {
      display: grid;
      grid-auto-flow: column;
      justify-content: space-between;
      border-bottom: 1px solid #f5f5f5;
      padding: 1.5rem 1.7rem;
      font-size: 1.8rem;

      & > .left {
        display: grid;
        grid-row-gap: 1rem;

        & > span:last-of-type {
          font-size: 1.5rem;
          color: #999999;
        }
      }

      & > .right {
        display: grid;
        align-items: center;
      }
    }
  }

  & > footer {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    & > div {
      border-top: 1px solid #f5f5f5;
      padding: 1.8rem;
      font-size: 2rem;
      text-align: center;
      color: #333333;

      &:last-of-type {
        color: #fff;
        background-color: var(--color-theme);
      }
    }
  }
}
</style>