<template>
  <div class="activity-type">
    <router-view />
  </div>
</template> 

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class PrizeSetActivityType extends Vue {}
</script>
