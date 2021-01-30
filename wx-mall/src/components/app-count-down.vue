<template>
  <span>
    {{timeRemaining | minuteSecond}}
  </span>
</template>

<script lang="ts">
import {Vue, Component, Prop, Model, Emit, Watch} from 'vue-property-decorator';
import moment from 'moment';

@Component({
  filters: {
    minuteSecond(millisecond) {
      return moment(millisecond).format('mm:ss');
    },
  },
})
export default class AppCountDown extends Vue {
  @Prop({
    required: true,
  })
  private startTime!: number;

  @Prop({
    required: true,
  })
  private endMinute!: number;

  // 倒计时
  private timeRemaining: number = 1800000;

  // 定时器
  private timer: null | number = null;

  // 触发倒计时结束
  @Emit('end')
  private emitEndEvent() {
    return true;
  }

  private mounted() {
    this.timer = setInterval(this.timeRemainingStart, 1000);
  }

  // 倒计时开始
  private timeRemainingStart() {
    const endMillisecond = this.endMinute * 60 * 1000;
    const endTime = endMillisecond + this.startTime;
    this.timeRemaining = endTime - Date.now();

    if (this.timeRemaining < 0) {
      this.emitEndEvent();
      this.timeRemaining = 0;
      clearInterval(this.timer as number);
    }
  }
}
</script>

<style lang="scss" scoped>
.badge {
  position: absolute;
  left: 55%;
  border-radius: 2rem;
  padding: .2rem .5rem;
  line-height: 1;
  font-size: 1.5rem;
  background-color: var(--color-theme);
  color: #fff;
}
</style>