<template>
  <div class="activity-type-home">
    <header>
      <el-button icon="el-icon-plus" type="primary" @click="toAddPage">添加活动</el-button>
    </header>

    <app-gutter />

    <el-table empty-text="暂无游戏" :data="dataList" border style="width: 100%">
      <el-table-column label="编号" prop="activitiyNo" width="100">
        <!-- <template slot-scope="scope">{{scope.$index + 1}}</template> -->
      </el-table-column>
      <el-table-column prop="activitiyName" label="活动名称" min-width="180"></el-table-column>
      <el-table-column prop="keyWord" label="关键字" min-width="120"></el-table-column>
      <el-table-column prop="beginTime" label="开始时间" min-width="140">
        <template slot-scope="scope">{{scope.row.beginTime | ymdhm}}</template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" min-width="140">
        <template slot-scope="scope">{{scope.row.endTime | ymdhm}}</template>
      </el-table-column>
      <el-table-column label="活动状态" min-width="120">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status != -1"
            :type="scope.row.status == 1 ? 'primary' : scope.row.status == 2 ? 'success' : scope.row.status == 3 ? 'success' : scope.row.status == 4 ? 'danger' : 'info'"
            size="small"
          >{{scope.row.statusStr}}</el-button>
          <el-tooltip class="item" effect="light" :content="scope.row.errorState" placement="left">
            <el-button
              v-if="scope.row.status == -1"
              type="warning"
              size="small"
              icon="el-icon-question"
            >异常状态</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="420">
        <template slot-scope="scope">
          <el-button
            class="btn"
            icon="el-icon-setting"
            size="small"
            @click="toPage('set', scope.row)"
          >活动设置</el-button>
          <el-button
            class="btn"
            icon="el-icon-tickets"
            size="small"
            @click="toPage('data', scope.row)"
          >活动数据</el-button>
          <el-button
            class="btn"
            icon="el-icon-delete"
            size="small"
            v-if="scope.row.status == 1 || scope.row.status == 5"
            @click="setActive('delete', scope.row)"
          >删除</el-button>
          <el-button class="btn" size="small" @click="showQrCode(scope.row)">推广</el-button>
          <el-button class="btn" size="small" @click="goPrizeList(scope.row)">奖品列表</el-button>
          <el-button
            class="btn"
            size="small"
            @click="setActive('public', scope.row)"
            v-if="scope.row.status == 1"
          >发布</el-button>
          <el-button
            class="btn"
            type="danger"
            size="small"
            v-if="scope.row.status == 2 || scope.row.status == 3"
            @click="setActive('stop', scope.row)"
          >终止活动</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="预览" :visible.sync="showCode" width="350px">
      <div style="text-align: center;">
        <img style="width: 250px;" :src="img500Url" alt />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" style="width: 135px" @click="downloadFile(1)">下载图片500*500</el-button>
        <el-button size="small" style="width: 135px" @click="downloadFile(2)">下载图片2500*2500</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  queryWxActivePage,
  overWxActive,
  deleteWxActive,
  publishWxActive,
  showQrCode,
} from '@/api/super-mkt/activity-set/fans_plus';
import AppGutter from '@/components/AppGutter.vue';
import FormBar from '@/components/FormBar.vue';
import Editor from '@/components/WangEditor.vue';
import ElIcon from '@/components/ElIcon.vue';
import user from '@/utils/user';

@Component({
  components: {
    AppGutter,
    FormBar,
    Editor,
    ElIcon,
  },
})
export default class PrizeSetActivityTypeHome extends Vue {
  dataList: any[] = [];
  showCode: boolean = false;
  img500Url: string = require('@/assets/images/super-mkt/code.png');
  img2500Url: string = require('@/assets/images/super-mkt/code.png');
  id: string = '';

  mounted() {
    this.getActiveList();
  }
  goPrizeList(item: any) {
    this.$router.push({
      path: '/super-mkt/activity-set/activity-type/fans_plus/prizeList',
      query: { id: item.id, activitiyName: item.activitiyName },
    });
  }
  async downloadFile(type: number) {
    window.open(
      `${VUE_APP_BASE_API}/jop-marketing-web/market/downloadQrCode?type=${type}&activitiyId=${this.id}&accountId=${user.serverUser.account.accountId}&companyKey=${user.serverUser.account.companyKey}&ticket=${user.serverUser.ticket}`
    );
  }
  async showQrCode(item: any) {
    this.id = item.id;
    if (
      item.status === '1' ||
      item.status === '5' ||
      item.status === '-1' ||
      item.status === '2'
    ) {
      return item.status === '2'
        ? this.$message.error(
            `活动${item.statusStr}，但还没到活动开始时间，推广海报无法显示`
          )
        : this.$message.error(`活动${item.statusStr}，推广海报无法显示`);
    }
    const res: any = await showQrCode({ activitiyId: item.id, type: 1 });
    this.showCode = true;
    const { code, data } = res;
    if (!code && data) {
      this.img500Url = data.img500Url;
      this.img2500Url = data.img2500Url;
    }
  }
  // 查询活动名称列表
  async getActiveList() {
    const body = {
      page: {
        pageNum: 1,
        pageSize: 100000,
      },
      params: {
        parentActive: '人气值千金PLUS',
      },
    };
    const res: any = await queryWxActivePage(body);
    const { code, data } = res;
    if (!code && data) {
      this.dataList = data.list;
    }
  }

  // 页面跳转
  toPage(page: string, row: any) {
    switch (page) {
      case 'set':
        this.$router.push({
          path: '/super-mkt/activity-set/activity-type/fans_plus/add',
          query: {
            id: row.id,
            status: row.status,
          },
        });
        break;
      case 'data':
        this.$router.push({
          path: '/super-mkt/activity-set/activity-type/fans_plus/data',
          query: {
            id: row.id,
          },
        });
        break;
      default:
        break;
    }
  }

  // 前往添加页面
  toAddPage() {
    this.$router.push({
      path: '/super-mkt/activity-set/activity-type/fans_plus/add',
    });
  }

  // 活动设置
  setActive(type: string, item: any) {
    switch (type) {
      case 'delete':
        this.$confirm(
          '<div>确定删除此活动？</div><div style="color: red;font-size: 12px;">* 活动删除后将无法恢复</div>',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
          }
        ).then(() => {
          this.deleteWxActive(item);
        });
        break;
      case 'public':
        this.$confirm(
          '<div>确定发布活动？</div><div style="color: red;font-size: 12px;">* 活动发布后，部分设置将不可更改</div>',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
          }
        ).then(() => {
          this.publishWxActive(item);
        });
        break;
      case 'stop':
        this.$confirm(
          '<div>确定中止活动？</div><div style="color: red;font-size: 12px;">* 中止后将无法继续开启活动</div>',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
          }
        ).then(() => {
          this.overWxActive(item);
        });
        break;
    }
  }

  // 发布活动
  async publishWxActive(item: any) {
    const body = {
      activitiyId: item.id,
      isPublish: 1,
    };
    try {
      const res: any = await publishWxActive(body);
      this.$message({
        type: 'success',
        message: '发布成功!',
      });

      this.getActiveList();
    } catch (error) {
      this.$message({
        type: 'error',
        message: error || '发布失败!',
      });
    }
  }

  // 删除活动
  async deleteWxActive(item: any) {
    const body = {
      activitiyId: item.id,
    };
    try {
      const res: any = await deleteWxActive(body);
      this.$message({
        type: 'success',
        message: '删除成功!',
      });

      this.getActiveList();
    } catch (error) {
      this.$message({
        type: 'error',
        message: error || '删除失败!',
      });
    }
  }

  // 结束活动
  async overWxActive(item: any) {
    const body = {
      activitiyId: item.id,
      isOver: 1,
    };
    try {
      const res: any = await overWxActive(body);
      this.$message({
        type: 'success',
        message: '操作成功!',
      });
      this.getActiveList();
    } catch (error) {
      console.log(error);
      this.$message({
        type: 'error',
        message: error || '操作失败!',
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
  margin: 2.5px;
}
.dialog-footer {
  text-align: center;
}
</style>