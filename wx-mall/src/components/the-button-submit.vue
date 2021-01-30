<template>
  <section
    class="the-button-submit"
  >
    <button
      @click="emitClickEvent"
    >
      {{buttonText}}
    </button>
  </section>
</template>

<script lang="ts">
import {Vue, Component, Prop, Model, Emit, Watch} from 'vue-property-decorator';
import TheTechnicalSupport from '@/components/the-technical-support.vue';

@Component({
  components: {
    TheTechnicalSupport,
  },
})
export default class TheButtonSubmit extends Vue {
  @Prop({
    default: '提交',
    required: false,
  })
  private buttonText!: string;

  @Emit('click')
  private emitClickEvent() {
    return null;
  }
}
</script>

<style lang="scss" scoped>
.the-button-submit {
  display: grid;
  align-content: start;
  justify-items: center;
  padding:  1.5rem 0;

  & > button {
    width: 28.5rem;
    height: 5.5rem;
    border: none;
    border-radius: .6rem;
    background-color: var(--color-theme);
    font-size: 2rem;
    color: #fff;
  }
}
</style>