<template>
  <div class="wx-credential">
    <router-view/>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class WxCredential extends Vue {
}
</script>

<style lang="scss" scoped>
.wx-credential {
}
</style>


