<template>
  <div
    class="base-select"
    @click="emitClickEvent"
  >
    <div
      class="icon-box"
    >
      <i :class="['iconfont', icon]"></i>
    </div>
    <input
      :value="type === 'date' ? dateYMD(value) : value"
      readonly
      :placeholder="placeholder"
    >
    <div class="right">
      <i class="iconfont icon-you"></i>
    </div>
    <div
      class="required-icon"
      v-if="required"
    >
      *
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Model, Emit, Watch} from 'vue-property-decorator';
import {dateYMD} from '@/filters/format-date';
import moment from 'moment';

@Component({
  filters: {
    dateYMD,
  },
})
export default class BaseInput extends Vue {
  @Prop({
    required: false,
  })
  private icon!: string;

  @Prop({
    required: false,
  })
  private placeholder!: string;

  @Prop({
    default: false,
    required: false,
  })
  private required!: boolean;

  // 选中的数据
  @Prop({
    default: false,
    required: true,
  })
  private value!: string;

  // 选择器类型
  @Prop({
    default: 'mormal',
    required: false,
  })
  private type!: 'normal' | 'date';

  // 触发click时间
  @Emit('click')
  private emitClickEvent() {
    return false;
  }

  private dateYMD(date: string): string {
    if (date) {
      return moment(date).format('YYYY-MM-DD');
    } else {
      return '';
    }
  }
}
</script>

<style lang="scss" scoped>
.base-select {
  position: relative;
  display: flex;
  justify-content: space-between;
  border-radius: .3rem;
  background-color: #ffffff;

  & > .icon-box {
    flex-basis: 4.5rem;
    text-align: center;
    align-self: center;

    & > .iconfont {
      font-size: 2.5rem;
      color: #dddddd;
    }
  }

  & > input {
    flex-grow: 1;
    outline: none;
    border: none;
    font-size: 1.8rem;
    background-color: transparent;
  }

  & > .right {
    padding: .9rem;
    align-self: center;
  }

  & > .required-icon {
    align-self: center;
    left: -2rem;
    position: absolute;
    font-size: 1.8rem;
    color: var(--color-theme);
  }
}
</style>