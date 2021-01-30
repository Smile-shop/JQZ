<template>
  <div class="paySet">
    <el-form label-width="150px" :model="formData">
      <el-form-item label="名称">
        <el-input class="pay-input" v-model="formData.appid" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="微信支付商户ID">
        <el-input class="pay-input" v-model="formData.id" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="支付密钥（APIKEY）">
        <el-input class="pay-input" v-model="formData.apikey" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="goSave">保存</el-button>
      </el-form-item>
    </el-form>
    <!-- 保存提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="comfirmDialogVisible"
      width="30%"
      center>
      <div style="text-align: center;">是否确定保存设置？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="comfirmDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
@Component({})
export default class GiftList extends Vue {
  private comfirmDialogVisible: boolean = false;
  private formData = {
    appid: '',
    id: '',
    apikey: '8d8j3i989089j2'
  }
  private mounted() {
    const apiKey = this.formData.apikey;
    this.formData.apikey = apiKey.length > 0 ? apiKey.substring(0, 4) + '***' + apiKey.substring(apiKey.length - 4, apiKey.length) : '';
    console.log(this.formData.apikey)
  }
  private goSave() {
    this.comfirmDialogVisible = true;
  }
}
</script>

<style lang="scss">
.paySet {
  margin-top: 30px;
  .pay-input {
    width: 50%;
  }
}
</style>