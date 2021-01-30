<template>
  <component class="position-manage" :data="bindData" @goBack="currentTabComponent = 'PositionTable'" @posBind="posBind" v-bind:is="currentTabComponent"></component>
</template> 

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import PositionTable from './PositionTable.vue';
import PositionBind from './PositionBind.vue';

@Component({
  components: {
    PositionTable,
    PositionBind
  }
})
export default class PositionManage extends Vue {
  private currentTabComponent: string = 'PositionTable';
  private bindData: any = null;
  private posBind(item: any) {
    this.bindData = item;
    this.currentTabComponent = 'PositionBind';
  }
}
</script>
