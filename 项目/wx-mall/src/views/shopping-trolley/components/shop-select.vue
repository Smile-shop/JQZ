<template>
  <popup
    v-model="isShowCurrent"
    position="bottom"
  >
    <article class="shop-select">
      <header>
        选择附近门店
      </header>
      <ul>
        <li>
          <div class="left">
            <span class="name">金千枝广州店</span>
            <span>地址：广州市花都区建设路28号</span>
            <span>电话：0755-89819966</span>
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
.shop-select {
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
      padding: 1.3rem 1.7rem;
      font-size: 1.8rem;

      & > .left {
        display: grid;
        grid-row-gap: .3rem;
        line-height: 1.5;

        & > span{
          font-size: 1.5rem;
          color: #666666;

          &.name {
            font-size: 1.8rem;
            color: var(--color-theme);
          }
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
