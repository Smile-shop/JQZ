<template>
  <button
    :class="['base-button', type, theme]"
    @click.stop="emitClickEvent"
  >
    {{text}}
  </button>
</template>

<script lang="ts">
import {Vue, Component, Prop, Model, Emit, Watch} from 'vue-property-decorator';

@Component({})
export default class BaseCheckbox extends Vue {
  @Prop({
    required: false,
    default: 'primary',
  })
  private type!: 'primary' | 'border';

  @Prop({
    required: false,
    default: '',
  })
  private theme!: '' | 'dark';

  @Prop({
    required: false,
    default: '确认',
  })
  private text!: string;

  @Emit('click')
  private emitClickEvent() {
    return null;
  }
}
</script>

<style lang="scss" scoped>
.base-button {
  border-radius: .3rem;
  padding: 1rem 1.7rem;
  font-size: 1.5rem;

  &.primary {
    border: none;
    color: #fff;
    background-color: var(--color-theme);
  }

  &.border {
    border: 1px solid var(--color-theme);
    color: var(--color-theme);
    background-color: transparent;

    &.dark {
      background-color: #fff;
      border: 1px solid #eeeeee;
      color: #333333;
    }
  }
}
</style>