<template>
  <article class="user">
    <router-view/>
  </article>
</template> 

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class User extends Vue {
}
</script>
