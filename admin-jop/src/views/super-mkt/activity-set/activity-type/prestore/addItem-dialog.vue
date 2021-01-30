<template>
  <div>
    <el-dialog title="下拉框设置" :visible.sync="dialogTableVisible" :before-close="cancelDialog" width="30%">
      <div>
          <el-input
              v-model="context"
              style="width:250px;margin-left:10px"
              type="text"
              placeholder="请输入内容"
              :maxlength="20"
              show-word-limit
              >
          </el-input>
          <el-button style="margin-left:20px" type="primary" @click="addContext">添加</el-button>
      </div>
     <el-divider></el-divider>
    <div style="display:flex;width:100%;margin-bottom:5px" v-for="(item,index) in valueList" :key="index">
      <template v-if="item.isedit">
          <el-input
              v-model="item.edname"
              style="width:350px;margin-left:10px"
              type="text"
              :maxlength="20"
              show-word-limit
              >
          </el-input>
          <span style="display:flex;align-items:center;">
            <i class="el-icon-check" style="font-size:20px;margin-left:10px" @click="onEditOkItem(index)"></i>
            <i class="el-icon-close" style="font-size:20px;margin-left:10px" @click="onCancelEditItem(index)"></i>
          </span>
      </template>
      <template v-else>
          <span style="width:350px;margin-left:30px">{{item.name}}</span>
          <span style="display:flex;align-items:center;">
            <i class="el-icon-edit" style="font-size:20px;margin-left:10px" @click="onEditItem(index)"></i>
            <i class="el-icon-delete" style="font-size:20px;margin-left:10px" @click="onDelectItem(index)"></i>
          </span>
      </template>
    </div>
     <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
@Component({})
export default class AddItemDialog extends Vue {
  @Prop(Boolean) dialogTableVisible!: boolean;
  @Prop({ default: [] }) itemList!: any[];
   valueList: any[] = [];
   context = '';
   mounted() {
       this.initValueList();
   }


  initValueList() {
      this.valueList = Object.assign(this.itemList);
  }

   private addContext() {
     if (this.context != '') {
       if (this.valueList.length > 20) {
         this.$message({
                message: '最多添加20项选择',
                type: 'warning',
              });
         return false;
       }
       this.valueList.push({isedit: false, edname: this.context, name: this.context});
     }
     this.context = '';
   }
  private onEditOkItem(index: number) {
    this.valueList[index].name = this.valueList[index].edname;
    this.valueList[index].isedit = false;
  }

  private onDelectItem(index: number) {
    this.valueList.splice(index, 1);
  }
  private onEditItem(index: number) {
    this.valueList[index].isedit = true;
  }

  private onCancelEditItem(index: number) {
    this.valueList[index].edname = this.valueList[index].name;
    this.valueList[index].isedit = false;
  }

   // 确定事件
  private async addConfirm() {
      const items: any[] = Object.assign([], this.valueList.map((item) => {
        return item.name;
      }));
      this.$emit('addConfirm', items);
      this.context = '';
      this.valueList = [];
  }
  private cancelDialog() {
      this.$emit('cancelDialog');
      this.context = '';
      this.valueList = [];
  }
}
</script>
<style lang="scss" scoped>
</style>