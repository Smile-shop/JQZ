<template>
  <article class="user-set">
    <router-view/> 
  </article>
</template> 

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class UserSet extends Vue {
}
</script>

<style lang="scss" scoped>
.user-set {
}
</style>
