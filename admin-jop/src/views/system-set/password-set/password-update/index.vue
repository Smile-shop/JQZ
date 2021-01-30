<template>
  <div class="change-password">
    <router-view/>
  </div> 
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class ChangePassword extends Vue {
}
</script>

<style lang="scss" scoped>
.change-password {
}
</style>


