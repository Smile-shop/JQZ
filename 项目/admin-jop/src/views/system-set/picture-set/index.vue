<template>
  <div class="picture-set">
    <router-view/> 
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class PictureSet extends Vue {
}
</script>

<style lang="scss" scoped>
.picture-set {
}
</style>


