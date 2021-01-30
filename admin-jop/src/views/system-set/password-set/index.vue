<template>
  <div class="password-set">
    <router-view/>
  </div> 
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class PasswordSet extends Vue {
}
</script>

<style lang="scss" scoped>
.password-set {
}
</style>


