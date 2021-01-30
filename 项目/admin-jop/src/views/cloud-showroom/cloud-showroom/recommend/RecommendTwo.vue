<template>
  <recommend-one/>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import RecommendOne from './RecommendOne.vue';

@Component({
  components: {
    RecommendOne
  },
})
export default class RecommendTwo extends Vue {
}
</script>

<style lang="scss" scoped>
</style>
