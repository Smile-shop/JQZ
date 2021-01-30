<!--
 * @Author: your name
 * @Date: 2021-01-27 17:51:36
 * @LastEditTime: 2021-01-27 18:23:39
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \admin-jop\src\views\super-mkt\activity-set\activity-type\prestore\Add.vue
-->
<template>
  <div class="edit-from-view">
        <el-tabs v-model="tabname">
        <el-tab-pane label="1-基本设置" name="first" :disabled="tabname!='first'">
          <BaseSet v-if="tabname=='first'" :curToken="this.curToken"  @onNextActive="onNextActive"></BaseSet>
        </el-tab-pane>
        <el-tab-pane label="2-礼品设置" name="second" :disabled="tabname!='second'">
          <Retail v-if="tabname=='second'" :curToken="this.curToken" :activitiyId="this.activitiyId" @onNextActive="onGoto('third')" @onPreActive="onGoto('first')"></Retail>
        </el-tab-pane>
        <el-tab-pane label="3-兑换设置" name="third" :disabled="tabname!='third'">
          <Convert v-if="tabname=='third'" :curToken="this.curToken" :activitiyId="this.activitiyId" @onNextActive="onGoto('fourth')"  @onPreActive="onGoto('second')"></Convert>
        </el-tab-pane>
        <el-tab-pane label="4-高级设置" name="fourth" :disabled="tabname!='fourth'">
          <Set  v-if="tabname=='fourth'" :curToken="this.curToken" :activitiyId="this.activitiyId" @onPreActive="onGoto('third')"></Set>
        </el-tab-pane>
        </el-tabs>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import BaseSet from './Base.vue';
import Retail from './Retail.vue';
import Convert from './Convert.vue';
import Set from './Set.vue';
@Component({
  components: {
    BaseSet,
    Retail,
    Convert,
    Set
  }
})
export default class FansPlusAdd extends Vue {
  tabname = 'first';
  activitiyId: any = null;
  curToken: string = '';
   mounted() {
    if (this.$route.query.id) {
        this.activitiyId = this.$route.query.id;
    }
   }
    onGoto(name: string) {
    this.tabname = name;
  }
    onNextActive(curToken: any) {
    this.curToken = curToken;
    this.onGoto('second');
  }
}
</script>
<style lang="scss">
  .edit-from-view {
    flex: 1;
    font-size: 14px;
    padding-left: 20px;
    padding-bottom: 80px;
  }
  .button-div{
  position: fixed;
    height: 80px;
    bottom: 0;
    text-align: center;
    width:calc(100% - 175px);
    background: #fff;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>