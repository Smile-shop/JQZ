<template>
  <keep-alive :include="['HomeQueryResult']">
    <router-view/>
  </keep-alive>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import BaseLayout from '@/layouts/base-layout.vue';

@Component({
  components: {
    BaseLayout,
  },
})
export default class Home extends Vue {
}
</script>

<style lang="scss" scoped>
</style>
