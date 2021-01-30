<template>
  <div class="member-set">
    <router-view/>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class MemberSet extends Vue {
}
</script>

<style lang="scss" scoped>
.member-set {
}
</style>


