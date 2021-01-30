<template>
  <div
    id="the-not-data"
  >
    <i :class="['iconfont', icon]"></i>
    <p>{{text}}</p>
    <router-link
      tag="button"
      :to="buttonLink"
    >
      {{buttonText}}
    </router-link>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Model, Emit, Watch} from 'vue-property-decorator';

@Component({})
export default class TheNotData extends Vue {
  @Prop({
    required: true,
  })
  private icon!: string;

  @Prop({
    required: true,
  })
  private text!: string;

  @Prop({
    required: true,
  })
  private buttonText!: string;

  @Prop({
    required: true,
  })
  private buttonLink!: string;
}
</script>

<style lang="scss" scoped>
#the-not-data {
  display: grid;
  align-content: start;
  justify-items: center;
  grid-row-gap: 3rem;
  padding-top: 7.4rem;
  width: 100%;

  & > .iconfont {
    font-size: 7.3rem;
    color: #dddddd;
  }

  & > p {
    margin: 0;
    font-size: 1.8rem;
    color: #666666;
  }

  & > button {
    border: 2px solid var(--color-theme);
    border-radius: .3rem;
    padding: 1rem 2.5rem;
    background-color: transparent;
    font-size: 1.8rem;
    color: var(--color-theme);
  }
}
</style>