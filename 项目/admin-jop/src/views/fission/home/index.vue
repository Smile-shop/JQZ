<template>
  <div class="app-home">
    <router-view />
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {State} from 'vuex-class';

@Component({
})
export default class FissionHome extends Vue {
}
</script>

<style lang="scss" scoped>
.app-home {
}
</style>
