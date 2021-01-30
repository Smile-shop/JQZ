<template>
  <div class="point-mall">
    <router-view/>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class PointMall extends Vue {
}
</script>

<style lang="scss" scoped>
.point-mall {
}
</style>


