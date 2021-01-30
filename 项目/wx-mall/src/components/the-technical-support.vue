<template>
  <p class="technical-support">技术支持：金千枝数字化技术中心</p>
</template>

<script lang="ts">
import {Vue, Component, Prop, Model, Emit, Watch} from 'vue-property-decorator';

@Component({})
export default class TheTechnicalSupport extends Vue {
}
</script>

<style lang="scss" scoped>
.technical-support {
  margin: 2.5rem 0 0 0;
  color: #cccccc;
  text-align: center;
  font-size: 1.5rem;
}
</style>