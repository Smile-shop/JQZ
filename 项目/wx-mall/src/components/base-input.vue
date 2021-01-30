<template>
  <div
    class="base-input"
  >
    <div
      class="icon-box"
    >
      <i :class="['iconfont', icon]"></i>
    </div>
    <input
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
    >
    <div class="right">
      <slot>
      </slot>
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

@Component({})
export default class BaseInput extends Vue {
  @Model('input')
  private value!: string;

  @Prop({
    default: 'text',
    required: false,
  })
  private type!: 'text' | 'password';

  @Prop({
    default: false,
    required: false,
  })
  private required!: boolean;

  @Prop({
    required: false,
  })
  private icon!: string;

  @Prop({
    required: false,
  })
  private placeholder!: string;

  private inputValue: string = '';

  // 监听inputValue
  @Watch('inputValue')
  private watchInputValueChange(value: string) {
    this.emitInputEvent();
  }

  // 监听value
  @Watch('value')
  private watchValueChange(value: string) {
    this.inputValue = value;
  }

  // 触发input
  @Emit('input')
  private emitInputEvent(): string {
    return this.inputValue;
  }

  // 绑定后
  private mounted() {
    this.initInputValue();
  }

  // 初始化数据
  private initInputValue() {
    this.inputValue = this.value;
  }
}
</script>

<style lang="scss" scoped>
.base-input {
  position: relative;
  display: flex;
  border-radius: .3rem;
  height: 5.5rem;
  background-color: #ffffff;

  & > .icon-box {
    flex-basis: 4.5rem;
    align-self: center;
    text-align: center;

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
  }

  & > .right {
    align-self: center;
    padding: .9rem;
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