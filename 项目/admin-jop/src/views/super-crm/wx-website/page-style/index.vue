<template>
  <div class="page-style">
    <component
      @edit="edit"
      @back="back"
      :is="showComponentName"
      :editData="editData"
    >
    </component> 
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import List from './List.vue';
import Edit from './Edit.vue';

@Component({
  components: {
    List,
    Edit
  }
})
export default class WxWebsitePageStyle extends Vue {
  showComponentName = 'List';

  editData = '';

  edit(res: any) {
    this.editData = res;
    this.showComponentName = 'Edit';
  }

  back(res: any) {
    this.showComponentName = 'List';
  }
}
</script>

<style lang="scss" scoped>
.page-style {
}
</style>


