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
export default class BaseCheckbox extends Vue {
  @Model('checked')
  private checkedArray!: string[] | boolean;

  @Prop({
    required: true,
  })
  private value!: string;

  @Prop({
    required: true,
  })
  private text!: string;

  private checked: boolean = false;

  private currentChecked: string[] | boolean = [];

  @Watch('checkedArray')
  private watchCheckedArray(value: string[] | boolean) {
    this.currentChecked = value;
  }

  @Watch('currentChecked', {
    immediate: true,
  })
  private watchCurrentChecked(value: string[] | boolean) {
    if (Array.isArray(value)) {
      if (value.includes(this.value)) {
        this.checked = true;
      } else {
        this.checked = false;
      }
    } else {
      this.checked = value;
    }
  }

  private mounted() {
    this.currentChecked = this.checkedArray;
  }

  @Emit('checked')
  private emitCheckedEvent(): string[] | boolean | undefined {
    const currentChecked = this.currentChecked;

    if (Array.isArray(currentChecked)) {
      const valueIndex = currentChecked.indexOf(this.value);
      if (valueIndex === -1) {
        if (this.value !== '') {
          currentChecked.push(this.value);
        }
      } else {
        if (this.value !== '') {
          currentChecked.splice(valueIndex, 1);
        }
      }

      if (currentChecked.length > 1 && currentChecked.includes('')) {
        const allIndex = currentChecked.indexOf('');
        currentChecked.splice(allIndex, 1);
      } else if (this.value === '') {
        currentChecked.splice(0, currentChecked.length);
        currentChecked.push('');
      } else if (currentChecked.length === 0) {
        currentChecked.push('');
      }
      return currentChecked;
    } else if (typeof currentChecked === 'boolean') {
      this.currentChecked = !this.currentChecked;
      this.checked = !this.checked;
      return this.checked;
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