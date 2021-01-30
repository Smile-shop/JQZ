<template>
  <article class="wx-chat">
    <router-view/>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class WxChat extends Vue {
}
</script>

<style lang="scss" scoped>
.wx-chat {
}
</style>


