<template>
  <div class="playing-card">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class PrizeSetPlayingCard extends Vue {}
</script>

<style lang="scss" scoped>
.playing-card {
  display: block;
}
</style>


