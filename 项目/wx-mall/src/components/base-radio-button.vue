<template>
  <div
    :class="{
      'checkbox-button': true,
      checked: checked,
    }"
    @click="emitCheckedEvent"
  >
    {{text}}
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Model, Emit, Watch} from 'vue-property-decorator';

@Component({})
export default class BaseRadioBox extends Vue {
  @Model('checked')
  private checkedData!: string | object;

  @Prop({
    required: true,
  })
  private value!: string | object;

  @Prop({
    default: false,
    required: false,
  })
  private canCancel!: boolean;

  @Prop({
    required: true,
  })
  private text!: string;

  private checked: boolean = false;

  @Watch('checkedData', {
    deep: true,
  })
  private checkedDataWatch(value: any, oldValue: any): void {
    if (this.checkedData === this.value) {
      this.checked = true;
    } else {
      this.checked = false;
    }
  }

  private mounted() {
    if (this.checkedData === this.value) {
      this.checked = true;
    }
  }

  @Emit('checked')
  private emitCheckedEvent(): string | object {
    if (this.canCancel && this.checkedData === this.value) {
      return '';
    } else {
      return this.value;
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox-button {
  display: grid;
  align-items: center;
  justify-items: center;
  border-radius: .3rem;
  padding: 1.3rem 0;
  width: 100%;
  font-size: 1.5rem;
  color: #333333;
  background-color: #f5f5f5;

  &.checked {
    border: 1px solid var(--color-theme);
    background-color: #fef5f5;
    color: var(--color-theme);
  }
}
</style>