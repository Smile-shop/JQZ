<template>
  <div class="prize-set">
    <router-view/> 
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class PrizeSet extends Vue {
}
</script>

<style lang="scss" scoped>
.prize-set {
}
</style>


