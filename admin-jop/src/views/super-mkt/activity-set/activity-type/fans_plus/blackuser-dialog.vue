<template>
  <div>
      <el-dialog :visible.sync="dialogTableVisible" :before-close="cancelDialog" width="50%">
         <el-table :data="tableData" style="width: 100%" max-height="500" height="500">
            <el-table-column
                prop="avatarUrl"
                label="图片">
                <template slot-scope="scope">
                    <img :src="scope.row.avatarUrl" class="avator-c"/>
                </template>
            </el-table-column>
            <el-table-column
                prop="nickname"
                label="微信昵称">
            </el-table-column>
            <el-table-column
                prop="popularityValue"
                label="人气值">
            </el-table-column>
            <el-table-column
                prop="recommendUserNum"
                label="累计助力人数">
            </el-table-column>
            <el-table-column
                prop="operation"
                label="操作">
              <template slot-scope="scope">
                <span class="blue-ulspan" @click="onDelect(scope.id)">删除</span>
              </template>
            </el-table-column>
         </el-table>
         <div style="text-align:right;margin-top:18px;">
          <el-pagination
              class="table-page"
              background
              layout="total, prev, pager, next, sizes, jumper"
              :page-sizes="[8, 15, 30, 50]"
              :page-size.sync="pageSize"
              @size-change="queryBlackUserPageFun"
              @current-change="queryBlackUserPageFun"
              :current-page.sync="currentPage"
              :total="tableTotal"
          ></el-pagination>
        </div>
      </el-dialog>
      <el-dialog
              title="提示"
              :visible.sync="deleteDialog"
              width="20%"
              :center='true'
              >
              <span style="display:block;text-align:center;">是否删除该用户？</span>
              <span slot="footer" class="dialog-footer">
                  <el-button @click="deleteDialog = false" class="params-button">取 消</el-button>
                  <el-button type="primary" @click="deleteItem" class="params-button">确 定</el-button>
              </span>
        </el-dialog>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {
  queryBlackUserPage,
  delBlackUser
} from '@/api/super-mkt/activity-set/fans_plus';
@Component({
})
export default class BlackUserDialog extends Vue {
  @Prop(Boolean) dialogTableVisible!: boolean;
  @Prop({default: null}) activitiyId!: any;
    tableData = [];
    pageSize: number = 8;
    currentPage: number = 1;
    tableTotal: number = 0;
      deleteDialog = false;
      deleteId = 0;
    mounted() {
        this.queryBlackUserPageFun();
    }

   onDelect(id: number) {
      this.deleteDialog = true;
      this.deleteId = id;
   }

   // 删除用户
  async deleteItem() {
    const param = {id: this.deleteId};
    const data: any = await delBlackUser(param);
    this.$message({
        type: 'success',
        message: '删除用户成功！'
      });
    this.deleteDialog = false;
    this.queryBlackUserPageFun();
}

  private async queryBlackUserPageFun() {
    const param = {
      page: {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      },
      params: {
        activitiyId: this.activitiyId
      }
    }
    const data: any = await queryBlackUserPage(param);
    this.tableTotal = data.data.total || 0;
    this.tableData = data.data.list && data.data.list.length > 0 ? data.data.list.map((item: any) => {
      return {
        id: item.id,
        activitiyId: item.activitiyId,
        avatarUrl: item.avatarUrl,
        companyKey: item.companyKey,
        createTime: item.createTime,
        nickname: item.nickname,
        openid: item.openid,
        remarks: item.remarks,
        popularityValue: item.popularityValue,
        recommendUserNum: item.recommendUserNum
      }
    }) : [];
  }

   private cancelDialog() {
    this.tableData = [];
    this.$emit('cancelDialog')
  }
}
</script>
<style lang="scss" scoped>
.blue-ulspan{
    margin:15px;
    color: #409EFF;
    text-decoration:underline;
    cursor:pointer;
}
</style>