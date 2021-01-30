<template>
  <div class="withdrawList">
    <div class="export-data">
      <el-button type="primary" size="mini" @click="addCustomer">添加客服</el-button>
    </div>
    <div class="table">
      <el-table stripe :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" align="center" width="80"></el-table-column>
        <el-table-column prop="name" label="客服名称" align="center"></el-table-column>
        <el-table-column prop="phone" align="center" label="手机号码"></el-table-column>
        <el-table-column prop="img" align="center" label="客服二维码">
          <template slot-scope="scope">
            <img
              style="width:50px;height:50px"
              v-if="scope.row.img"
              :src="scope.row.img"
              alt="kfHeadimgurl"
            />
          </template>
        </el-table-column>
        <el-table-column prop="regCode" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="editRow(scope.$index, tableData)"
              type="text"
              size="small"
            >修改</el-button>
            <el-popover placement="top" width="160" v-model="scope.row.regCode">
              <p style="text-align: center">
                <i class="el-icon-warning" style="color: #e6a23c"></i>
                确定要删除吗？
              </p>
              <div style="text-align: right; margin-top: 10px">
                <el-button size="mini" @click="scope.row.regCode = false">取消</el-button>
                <el-button type="danger" size="mini" @click="deleteRow(scope.row)">确定</el-button>
              </div>
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog title="客服信息" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="客服名称：" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入客服名称"></el-input>
        </el-form-item>
        <el-form-item label="手机号/座机号：" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="form.phone" autocomplete="off" placeholder="请输入客服手机号"></el-input>
        </el-form-item>
        <el-form-item label="客户二维码：" :label-width="formLabelWidth" prop="qrCode">
          <el-upload
            class="avatar-uploader"
            :headers="opt()"
            :action="baseURL+'\/jop-marketing-web\/market\/upload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip" style="color: #C0C4CC">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template> 

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  searchCustomerList,
  delCustomer,
  modifyCusServer,
  addCusServer,
} from '@/api/super-mkt/activity-set/fission.ts';
import { addCoustomerSev, editSave } from '@/utils/buttonPermission';
import user from '@/utils/user';

@Component({
  components: {},
})
export default class CustomerInstall extends Vue {
  baseURL = VUE_APP_BASE_API;
  formInline = {
    timer: '',
    region: 'shanghai',
  };

  tableData = [];

  currentPage4 = 1;

  pageSize = 10;

  total = 0;

  addCus = false;

  dialogFormVisible = false;

  form = {
    id: '',
    name: '',
    phone: '',
    qrCode: '',
    companyKey: '',
    mark: '0',
  };

  formLabelWidth: string = '140px';

  visible: boolean = true;

  imageUrl = '';

  rules = {
    name: [
      {
        required: true,
        message: '请填写客服名称',
        trigger: 'change',
      },
      {
        min: 2,
        max: 10,
        message: '长度在 2 到 10 个字符',
        trigger: 'blur',
      },
    ],
    phone: [
      {
        required: true,
        message: '请填写客服手机号/电话',
        trigger: 'change',
      },
      {
        min: 7,
        max: 12,
        message: '长度在 7 到 12 个字符',
        trigger: 'blur',
      },
    ],
    qrCode: [
      {
        required: true,
        message: '请上传客服二维码',
        trigger: 'change',
      },
    ],
  };

  mounted() {
    this.searchList();
  }

  transShow(data: any) {
    const result: any = [];
    const arr = data;
    arr.map((item: any) => {
      const showModel: any = {};
      showModel.companyKey = item.companyKey;
      showModel.id = item.id;
      showModel.name = item.kfName;
      showModel.img = item.qrcodeUrl;
      showModel.phone = item.phone;
      result.push(showModel);
    });
    return result;
  }

  searchList() {
    const params = {
      pageNum: this.currentPage4,
      pageSize: this.pageSize,
    };
    searchCustomerList(params).then((res: any) => {
      const { list, total } = res.data;
      this.tableData = this.transShow(list);
      this.total = total;
    });
  }

  endTimer(time: any) {
    const all = time.split(' ');
    const result = all[0] + '23:59:59';
    return result;
  }

  handleDialog() {
    this.dialogFormVisible = false;
  }

  sendCardInfo(params: any) {
    this.handleDialog();
    if (Number(params.mark) > 0) {
      this.modifySucServer(params);
    } else {
      this.addCusServer(params);
    }
  }

  onSubmit(formName: any) {
    const params = {
      companyKey: this.form.companyKey,
      id: this.form.id,
      kfName: this.form.name,
      phone: this.form.phone,
      qrcodeUrl: this.form.qrCode,
      mark: this.form.mark,
    };
    (this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
        this.sendCardInfo(params);
      } else {
        return false;
      }
    });
  }

  modifySucServer(params: any) {
    modifyCusServer(params).then((res: any) => {
      const { code, msg } = res;
      if (code == 0) {
        this.successNotice(msg);
        this.searchList();
      }
    });
  }

  opt() {
    const opt = {
      ticket: user.serverUser.ticket,
      companyKey: user.serverUser.account.companyKey,
    };
    return opt;
  }

  // 处理掉填完后的残留
  clearnSubmit() {
    this.form = {
      companyKey: '',
      id: '',
      name: '',
      phone: '',
      qrCode: '',
      mark: '0',
    };
    this.imageUrl = '';
  }

  addCusServer(params: any) {
    addCusServer(params).then((res: any) => {
      const { code, msg } = res;
      if (code == 0) {
        this.successNotice(msg);
        this.searchList();
        this.clearnSubmit();
      }
    });
  }

  handleSizeChange(val: any) {
    this.pageSize = val;
    this.searchList();
  }

  handleCurrentChange(val: any) {
    this.currentPage4 = val;
    this.searchList();
  }

  async addCustomer() {
    if (!(await addCoustomerSev())) {
      return;
    }
    this.dialogFormVisible = true;
    this.clearForm();
  }

  clearForm() {
    const mark = this.form.mark;
    if (Number(mark) > 0) {
      this.form = {
        companyKey: '',
        id: '',
        name: '',
        phone: '',
        qrCode: '',
        mark: '0',
      };
      this.imageUrl = '';
    }
  }

  async editRow(val: any, arr: any) {
    if (!(await editSave())) {
      return;
    }
    const modify = arr[val];
    modify.mark = '1';
    this.dialogFormVisible = true;
    const { id, img, name, phone, mark, companyKey } = modify;
    this.form.id = id;
    this.form.companyKey = companyKey;
    this.form.name = name;
    this.form.phone = phone;
    this.form.qrCode = img;
    this.form.mark = mark;
    this.imageUrl = img;
  }

  successNotice(msg: string) {
    this.$message({
      message: msg,
      type: 'success',
    });
  }

  deleteRow(obj: any) {
    const { id: cusId } = obj;
    const params = {
      id: cusId,
    };
    delCustomer(params).then((res: any) => {
      const { code, msg } = res;
      if (code == 0) {
        this.successNotice(msg);
        this.searchList();
      }
    });
  }

  handlDel() {
    console.log('提示');
  }

  handleAvatarSuccess(res: any, file: any) {
    const url = file.response.data[0];
    this.imageUrl = URL.createObjectURL(file.raw);
    this.form.qrCode = url;
    this.form = Object.assign({}, this.form);
  }

  beforeAvatarUpload(file: any) {
    const isLt2M = file.size / 1024 < 500;
    if (!isLt2M) {
      this.$message.error('上传头像图片大小不能超过 500KB!');
    }
    return isLt2M;
  }
}
</script>

<style lang="scss" scoped>
.withdrawList {
  .export-data {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;
    margin-left: 20px;
  }
  .page {
    margin-top: 100px;
    text-align: right;
  }
  .addCustomer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  /deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /deep/ .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  /deep/ .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  /deep/ .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>