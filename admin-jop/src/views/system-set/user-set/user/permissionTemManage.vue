<template>
  <component class="tem-manage" :permissionsTemplatesId.sync="permissionsTemplatesId" @temId="getTemId" @change="change" v-bind:is="showContent"></component>
</template> 

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import temList from './perssionTemChild/perssionTemList.vue';
import TemDetail from './perssionTemChild/perssionTemDetail.vue';

@Component({
  components: {
    temList,
    TemDetail
  }
})
export default class PositionManage extends Vue {
  private showContent: string = 'temList';
  private permissionsTemplatesId: string = '';
  private change(item: any) {
    this.showContent = item.comName;
    if (item.type) {
      this.permissionsTemplatesId = ''
    }
  }
  private getTemId(id: string) {
    this.permissionsTemplatesId = id
  }
}
</script>
