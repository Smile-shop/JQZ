<template>
  <div class="wx-setting">
    <router-view/>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class WxSetting extends Vue {
}
</script>

<style lang="scss" scoped>
.wx-setting {
}
</style>


