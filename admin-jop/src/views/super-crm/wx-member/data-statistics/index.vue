<template>
  <div class="data-statistics">
    <router-view/>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class DataStatistics extends Vue {
}
</script>

<style lang="scss" scoped>
.data-statistics {
}
</style>


