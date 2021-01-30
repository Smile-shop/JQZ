<template>
  <div class="clue-from">
    <el-button icon="el-icon-plus" type="primary" @click="addPoupShow = true">新增{{baseData.name}}</el-button>
    <el-table
      :data="baseData.list"
      border
      style="width: 100%;margin-top:20px">
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        :label="baseData.title || baseData.name"
        align="center"
        width="180">
        <template slot-scope="scope">
          <el-input v-if="scope.$index === updateTableIndex" size="small" v-model="scope.row.name"></el-input>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align="center"
        width="180">
        <template slot-scope="scope">
          <el-input v-if="scope.$index === updateTableIndex" size="small" v-model="scope.row.remark"></el-input>
          <span v-else>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        align="center"
        label="下拉顺序">
        <template slot-scope="scope">
          <el-input v-if="scope.$index === updateTableIndex" size="small" v-model="scope.row.sort"></el-input>
          <span v-else>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="modifyTime"
        align="center"
        label="最后修改时间">
        <template slot-scope="scope">
          <div>{{scope.row.modifyTime | momentFilter}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="enable"
        align="center"
        label="是否有效">
        <template slot-scope="scope">
          <i v-if="scope.row.enable == 1" class="el-icon-success" style="font-size:24px;color:#6699ff"></i>
          <i v-else class="el-icon-error" style="font-size:24px;color:#eb3941"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        align="center"
        label="操作"
        width="280">
        <template slot-scope="scope">
          <div>
            <el-button size="mini" type="success" @click="editBasisData(scope.row, false)" v-if="scope.$index === updateTableIndex">保存</el-button>
            <el-button size="mini" @click="updateTableIndex = scope.$index" v-else>编辑</el-button>
            <el-button size="mini" @click="editBasisData(scope.row, true)">设为{{scope.row.enable === 0 ? '有' : '无'}}效</el-button>
            <el-button size="mini" type="danger" @click="deleteItem(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="`新增-${baseData.name}`"
      :visible.sync="addPoupShow"
      width="30%"
      :before-close="handleClose">
      <el-form ref="basisDataForm" :model="basisDataForm" label-width="120px">
        <el-form-item
          v-if="baseData.name === '负责人'"
          :label="baseData.title || baseData.name"
          prop="name"
          :rules="{
            required: true, message: '域名不能为空', trigger: 'blur'
          }">
          <el-select :placeholder="baseData.title || baseData.name" style="width:100%" v-model="basisDataForm.name">
            <el-option v-for="item in baseData.JMPAccountList" :key="item.jmpAccountId" :label="item.jmpAccountName" :value="item.jmpAccountId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-else
          :label="baseData.title || baseData.name"
          prop="name"
          :rules="{
            required: true, message: '域名不能为空', trigger: 'blur'
          }">
          <el-input :type="`${baseData.title ? 'textarea' : ''}`" :placeholder="baseData.title || baseData.name" v-model="basisDataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="basisDataForm.remark" placeholder="备注"></el-input>
        </el-form-item>

        <el-form-item
          label="下拉顺序："
          prop="sort"
          :rules="[
            { type: 'number', message: '年龄必须为数字值', trigger: 'blur'}
          ]">
          <!-- <el-input type="age" v-model.number="basisDataForm.sort" prop="name" placeholder="下拉顺序"></el-input> -->
          <el-input-number style="width:100%" v-model="basisDataForm.sort" :min="1" :max="10000" label="下拉顺序"></el-input-number>
        </el-form-item>

        <el-form-item label="是否有效：">
          <el-radio-group v-model="basisDataForm.enable">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item style="text-align:right">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="updateBasisData">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { BaseData, getClueBasisDataString } from '@/utils/nameExchange';
import PoupBox from '@/components/PoupBox.vue';
import {removeBasisData, updateBasisData} from '@/api/common';

@Component({
  components: {
    PoupBox
  }
})
export default class ClueFrom extends Vue {
  @Prop()
  baseData!: BaseData

  private tableData = [];
  private addPoupShow: boolean = false;
  private updateTableIndex: number = -1;
  private basisDataForm = {
    name: '',
    remark: '',
    sort: 1,
    enable: 1
  }

  mounted() {
    // console.log(this.baseData)
  }

  private editBasisData(item: any, type: boolean) {
    if (item.name) {
      const params = {
        btype: this.baseData.type,
        id: item.id,
        name: item.name,
        remark: item.remark,
        sort: item.sort,
        enable: type ? (item.enable === 1 ? 0 : 1) : item.enable
      }
      updateBasisData(params).then((res: any) => {
        this.handleClose();
        this.$emit('updateTable', {
          type: 'update',
          baseDataType: this.baseData
        });
      })
    } else {
      this.$message({
        type: 'info',
        message: `${this.baseData.name}不能为空！`
      });
    }
  }

  private updateBasisData() {
    (this.$refs as any).basisDataForm.validate((valid: boolean) => {
      if (valid) {
        const params = {
          btype: this.baseData.type,
          id: 0,
          ...this.basisDataForm
        }
        updateBasisData(params).then((res: any) => {
          this.handleClose();
          this.$emit('updateTable', {
            type: 'update',
            baseDataType: this.baseData
          });
        })
      }
    })
  }

  private handleClose() {
    this.basisDataForm = {
      name: '',
      remark: '',
      sort: 1,
      enable: 1
    };
    this.addPoupShow = false;
    this.updateTableIndex = -1;
  }

  private deleteItem(item: any) {
    this.$confirm(`此操作将删除该条${this.baseData.name}, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      removeBasisData({id: item.id}).then((res: any) => {
        this.$emit('updateTable', {
          type: 'remove',
          baseDataType: this.baseData,
          data: item
        });
      })
    }).catch(() => {
      console.log('cancel')
    });
  }
}
</script>

<style lang="scss" scoped>
</style>


