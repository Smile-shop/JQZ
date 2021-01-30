<template>
  <div class="msg-set">
    <router-view/> 
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class MsgSet extends Vue {
}
</script>

<style lang="scss" scoped>
.msg-set {
}
</style>


