<template>
  <div class="activity-type">
    <keep-alive
      include="data"
    > 
      <router-view/>
    </keep-alive>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class PrizeSetActivityType extends Vue {
}
</script>

<style lang="scss" scoped>
.activity-type {
}
</style>


