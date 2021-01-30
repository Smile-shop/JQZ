<template>
  <div
    v-if="count"
    class="badge"
    v-topSet="top"
  >
    {{count}}
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Model, Emit, Watch} from 'vue-property-decorator';

@Component({
  directives: {
    topSet({style}, {value}) {
      style.top = value;
    },
  },
})
export default class BaseBadge extends Vue {
  @Prop({
    required: true,
  })
  private count!: number | string;

  @Prop({
    required: false,
    default: '1rem',
  })
  private top!: string;
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