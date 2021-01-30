<template>
  <div class="wx-website">
    <router-view/>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class WxWebsite extends Vue {
}
</script>

<style lang="scss" scoped>
.wx-website {
}
</style>


