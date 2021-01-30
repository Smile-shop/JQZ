<template>
  <div class="wx-mall">
    <router-view/>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class WxMall extends Vue {
}
</script>

<style lang="scss" scoped>
.wx-mall {
}
</style>


