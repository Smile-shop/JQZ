<template>
  <div class="program-manage">
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
import List from './ProgramList.vue';
import Edit from './ProgramEdit.vue';

@Component({
  components: {
    List,
    Edit
  }
})
export default class WxWebsiteProgramManage extends Vue {
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
.program-manage {
}
</style>