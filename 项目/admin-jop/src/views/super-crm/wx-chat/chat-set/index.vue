<template>
  <article class="chat-set">
    <router-view/>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class ChatSet extends Vue {
}
</script>

<style lang="scss" scoped>
.chat-set {
}
</style>


