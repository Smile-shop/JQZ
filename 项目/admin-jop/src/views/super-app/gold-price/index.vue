<template>
  <div class="gold-price">
    <router-view/>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class GoldPrice extends Vue {
}
</script>

<style lang="scss" scoped>
.gold-price {
}
</style>


