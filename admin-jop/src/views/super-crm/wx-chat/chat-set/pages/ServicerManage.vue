<template>
  <article class="servicer-manage">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="客服：">
        <el-select v-model="formInline.shopName" placeholder="选择门店">
          <el-option label="全部" value=""></el-option>
          <el-option :label="item.name" :value="item.name" v-for="item in shopList" :key="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border class="table-content" style="width: 100%;margin-top:18px;">
      <el-table-column
        type="index"
        width="50"
        label="序号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="shopName"
        label="门店"
        align="center">
      </el-table-column>
      <el-table-column
        prop="kfNum"
        label="客服工号"
        align="center">
        <template slot-scope="scope">
          <el-input v-if="scope.$index === editableIndex" size="small" v-model="scope.row.kfNum"></el-input>
          <span v-else>{{ scope.row.kfNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="kfPhone"
        label="客服电话"
        align="center">
        <template slot-scope="scope">
          <el-input v-if="scope.$index === editableIndex" size="small" v-model="scope.row.kfPhone"></el-input>
          <span v-else>{{ scope.row.kfPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="jopNum"
        label="JOP账号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="nick"
        label="昵称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="positionName"
        label="职位"
        align="center">
      </el-table-column>
      <el-table-column
        prop="age"
        label="头像"
        align="center">
        <template slot-scope="scope">
          <img style="width:50px;height:50px" v-if="scope.row.kfHeadimgurl" :src="scope.row.kfHeadimgurl" alt="kfHeadimgurl">
        </template>
      </el-table-column>
      <el-table-column
        prop="age"
        label="操作"
        width="240"
        align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            v-if="scope.$index === editableIndex"
            @click="submitEdit(scope.$index, scope.row)">保存</el-button>
          <el-button
            size="mini"
            v-else
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-upload
            style="display: inline-block;margin-left:5px;"
            :headers="uploadOpt"
            :data="uploadData"
            :action="uploadUrl()"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            v-if="!scope.row.rowkfHeadimgurl"
            name="file"
          >
            <el-button size="mini" @click="toUploadMethod(scope.$index, scope.row)" type="primary" plain>上传图片</el-button>
          </el-upload>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="false"
      class="table-page"
      background
      layout="total, prev, pager, next, sizes, jumper"
      :page-sizes="[20, 50, 100, 200, 500]"
      :page-size.sync="pageSize"
      @size-change="onSubmit"
      @current-change="onSubmit"
      :current-page.sync="currentPage"
      :total="tableTotal"
    ></el-pagination>
  </article>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { getChatShopList, getCustomerList, updateCustom } from '@/api/super-crm/wx-chat';
import user from '@/utils/user';

@Component({})
export default class ServicerManage extends Vue {
  private shopList = [];
  private tableData = [{}];
  private pageSize: number = 10;
  private currentPage: number = 1;
  private tableTotal: number = 0;

  private uploadData = {
    accountId: null
  };

  private editableIndex: number = -1;
  private formInline = {
    shopName: ''
  };

  // 上传图片header设置
  get uploadOpt() {
    return {
      ticket: user.serverUser.ticket,
      companyKey: user.serverUser.account.companyKey
    }
  }

  private mounted() {
    getChatShopList().then((res: any) => {
      this.shopList = res.data || [];
    });
    this.onSubmit();
  }


  // 上传图片路径
  private uploadUrl(): string {
    return `${VUE_APP_BASE_API}/chat-web/chatInfo/uploadImg`;
  }

  // 上传头像
  private toUploadMethod(index: number, row: any) {
    this.editableIndex = -1;
    this.uploadData.accountId = row.accountId;
  }

  private uploadSuccess(res: any) {
    if (res.code === 0) {
      this.onSubmit();
      this.$message({
        type: 'success',
        message: '上传成功！'
      });
    } else {
      this.uploadError();
    }
  }

  private uploadError() {
    this.$message.error('上传失败，请重新上传！');
  }

  private handleEdit(index: number, row: any) {
    this.editableIndex = index;
  }

  private submitEdit(index: number, row: any) {
    const params = {
      accountId: row.accountId,
      kfPhone: row.kfPhone,
      kfNum: row.kfNum
    }
    updateCustom(params).then((res: any) => {
      this.editableIndex = -1;
      this.$message({
        type: 'success',
        message: '修改成功！'
      });
    })
  }

  private onSubmit() {
    const params = {
      page: {
        pageSize: this.pageSize,
        pageNum: this.currentPage
      },
      params: {
        shopName: this.formInline.shopName
      }
    }
    getCustomerList(params).then((res: any) => {
      this.tableData = res.data || [];
      // this.tableData = res.data.list || [];
      // this.tableTotal = res.data.total || 0;
    })
  }
}
</script>

<style lang="scss" scoped>
.servicer-manage {
  .table-page {
    position: fixed;
    bottom: 15px;
    right: 20px;
  }
  .table-content {
    .order-control {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      > div {
        width: 32px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        border-radius: 50%;
        border: 1px solid #E4E7ED;
        cursor: pointer;
      }
      > div:hover {
        border: 1px solid #409EFF;
        color: #409EFF;
        opacity: .5;
      }
    }
  }
  .demo-form-inline {
    height: 80px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 5px;
    margin-bottom: 20px;
  }
}
</style>
