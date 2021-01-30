<template>
  <div class="channelPopularize">
    <el-button
      type="primary"
      size="small"
      icon="el-icon-plus"
      :disabled="total>=20"
      @click="showAdd=true;addForm.channelName=''"
    >添加渠道二维码</el-button>
    <table-data :dataList="dataList">
      <template slot-scope="scope" slot="action">
        <el-button type="text" @click="download(scope.row)">下载</el-button>
        <el-button type="text" @click="copy(scope.row)">复制链接</el-button>
        <!-- <el-button
            type="text"
        @click="handleEdit(scope.row)">数据</el-button>-->
        <!-- <el-popover placement="top" width="160" v-model="scope.row.visible">
          <p>
            <i style="color:#e6a23c" class="el-icon-warning"></i> 确定删除吗？
          </p>
          <div style="text-align: center; margin: 5px">
            <el-button class="popover-btn-btn" size="mini" @click="scope.row.visible = false">取消</el-button>
            <el-button
              class="popover-btn-btn"
              type="danger"
              size="mini"
              @click="del(scope.row, scope.$index)"
            >确定</el-button>
          </div>
          <el-button slot="reference" style="margin-left: 10px" type="text">删除</el-button>
        </el-popover>-->
      </template>
    </table-data>
    <div style="text-align: right; margin-top: 20px">
      <el-pagination
        v-show="total > 0"
        background
        layout="total, prev, pager, next, sizes, jumper"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="page.pageSize"
        @size-change="getChannelist($route.query.distributionId)"
        @current-change="getChannelist($route.query.distributionId)"
        :current-page.sync="page.pageNum"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog title="添加渠道" :visible.sync="showAdd" width="550px" @close="showAdd=false">
      <el-input
        size="small"
        type="text"
        placeholder="请输入内容"
        v-model="addForm.channelName"
        maxlength="20"
        show-word-limit
      />
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="showAdd=false">取 消</el-button>
        <el-button size="small" type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
    <!-- <QRCodeDialog ref="copy" :LinkValue="LinkValue" /> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import tableData from './child/tableData.vue';
import {
  pageQueryChannel,
  addDistributionChannel,
  deleteChannel,
  downloadChannelQrCode,
  getChannelQrCode,
} from '@/api/super-mkt/activity-set/fission_retail';
import { copyText } from '@/utils/copyText';
import QRCodeDialog from '@/views/super-mkt/activity-set/activity-type/components/QRCodeDialog.vue';
import user from '@/utils/user';
interface Page {
  pageNum: number;
  pageSize: number;
}
interface AddForm {
  channelName: string;
  companyKey?: string;
  createTime?: string;
  distributionId?: string;
  id?: 0;
}
@Component({ components: { tableData, QRCodeDialog } })
export default class ChannelPopularize extends Vue {
  showAdd: boolean = false;
  channelName: string = '';
  dataList: object[] = [];
  total: number = 0;
  page: Page = { pageNum: 1, pageSize: 10 };
  addForm: AddForm = {
    channelName: '',
    distributionId: '',
    companyKey: user.serverUser.account.companyKey,
  };
  LinkValue: string = '';
  created() {
    this.addForm.distributionId = this.$route.query.distributionId as string;
    this.getChannelist((this.$route.query.distributionId as string) || '');
  }
  async save() {
    if (!this.addForm.channelName.trim()) {
      return this.$message.error('渠道名称不能为空');
    }
    this.addForm.channelName = this.addForm.channelName.trim();
    const res: any = await addDistributionChannel(this.addForm);
    const { code } = res;
    if (!code) {
      this.showAdd = false;
      this.getChannelist((this.$route.query.distributionId as string) || '');
      this.$message({
        message: '添加成功',
        type: 'success',
      });
    }
  }
  async getChannelist(distributionId: string) {
    const res = await pageQueryChannel({ ...this.page, distributionId });
    this.total = res.data.total || 0;
    this.dataList = res.data.list;
  }
  async download(item: any) {
    const res: any = await downloadChannelQrCode({ channelId: item.id });
    const { code, data } = res;
    if (!code && data) {
      const xhr = new XMLHttpRequest();
      xhr.open('get', data, true);
      xhr.responseType = 'blob';
      xhr.onload = (res: any) => {
        if (res.target.status === 200) {
          const blob = new Blob([res.target.response], {
            type: res.target.response.type,
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = '';
          link.click();
          URL.revokeObjectURL(url);
        }
      };
      xhr.send();
    }
  }
  async copy(item: any) {
    /* const oInput = document.createElement('input');
    oInput.value = item.channelUrl;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象;
    document.execCommand('copy'); // 执行浏览器复制命令
    this.$message({
      message: '复制成功',
      type: 'success',
    });
    document.body.removeChild(oInput); */
    await copyText(item.channelUrl);
    this.$message({
      message: '复制成功',
      type: 'success',
    });
  }
  handleEdit(item: any) {
    console.log(item);
  }
  async del(item: any) {
    const res: any = await deleteChannel({ id: item.id });
    const { code } = res;
    if (!code) {
      item.visible = false;
      this.$message({
        message: '删除成功',
        type: 'success',
      });
      this.getChannelist(this.$route.query.distributionId as string);
    }
  }
}
</script>

<style lang="scss" scoped>
.channelPopularize {
  .table-content {
    margin-top: 20px;
  }
}
.popover-btn-btn {
  padding: 5px 8px;
}
</style>
