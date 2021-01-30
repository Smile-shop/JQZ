<template>
  <popup
    v-model="isShowCurrent"
    position="bottom"
  >
    <article class="shop-select">
      <header>
        选择地址
      </header>
      <ul>
        <li
          v-for="(item, index) of dataList"
          :key="index"
          @click="emitChangeEvent(index)"
        >
          <div class="left">
            <span class="name">{{item.addressee}}</span>
            <span>电话：{{item.phone}}</span>
            <span>地址：{{item | addressConcat}}</span>
          </div>
          <div class="right">
            <Radio
              v-model="checkedID"
              :name="item.id"
            >
            </Radio>
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

  @Prop({
    type: Array,
    required: true,
  })
  private dataList!: any[];

  private checkedID: string = '';

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

  @Watch('dataList')
  private dataListWatch(): void {
    this.setDefaultID();
  }

  @Emit('switch')
  private emitSwitchEvent(): boolean {
    return this.isShowCurrent;
  }

  @Emit('change')
  private emitChangeEvent(index: number): number {
    this.checkedID = this.dataList[index].id;
    this.isShowCurrent = false;
    return index;
  }

  private mounted(): void {
    this.isShowCurrent = this.isShow;
    this.setDefaultID();
  }

  // 设置默认id
  private setDefaultID() {
    const defaultAddress = this.dataList.find(item => {
      return item.isDefault === 1;
    });

    if (defaultAddress) {
      this.checkedID = defaultAddress.id;
    }
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
