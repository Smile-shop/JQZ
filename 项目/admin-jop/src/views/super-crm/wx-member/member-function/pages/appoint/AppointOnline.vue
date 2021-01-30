<template>
  <section>
    <article class="appoint-online" v-show="editAppointShow">
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column type="index" align="center" label="序号" width="100"></el-table-column>
        <el-table-column prop="title" align="center" label="标题"></el-table-column>
        <el-table-column prop="shopName" align="center" label="门店"></el-table-column>
        <el-table-column prop="name" align="center" label="是否显示" width="180">
          <template slot-scope="scope">
            <!-- <span style="margin-left: 10px">{{ scope.row.date }}</span> -->
            <i
              class="el-icon-success"
              style="font-size:28px;color:#6699ff"
              v-if="scope.row.enAble && scope.row.enAble === '1'"
            ></i>
            <i class="el-icon-error" style="font-size:28px;color:#eb3941" v-else></i>
          </template>
        </el-table-column>
        <el-table-column prop="address" align="center" label="操作" width="450">
          <template slot-scope="scope">
            <!-- <span style="margin-left: 10px">{{ scope.row.date }}</span> -->
            <el-button size="mini" @click="editAppoint(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              @click="setAppointShow(scope.row)"
            >设为{{scope.row.enAble === '1' ? '不' : ''}}显示</el-button>
            <el-button size="mini" @click="record(scope.row)">预约记录</el-button>
            <el-button
              size="mini"
              :id="`btn-${scope.row.id}`"
              :data-clipboard-text="copuText(scope.row)"
              @click="copyItemLink(scope.row)"
            >复制链接</el-button>
            <el-button size="mini" type="danger" @click="removeAppoint(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="table-page"
        background
        layout="total, prev, pager, next, sizes, jumper"
        :page-sizes="[20, 50, 100, 200, 500]"
        :page-size.sync="pageSize"
        :hide-on-single-page="isSinglePage"
        @size-change="getWxAppointInfo"
        @current-change="getWxAppointInfo"
        :current-page.sync="currentPage"
        :total="tableTotal"
      ></el-pagination>
    </article>
    <article class="edit-appoint-online" v-show="!editAppointShow">
      <div class="edit-item">
        <div class="title">标题：</div>
        <div class="content">{{ editForm.title }}</div>
      </div>
      <div class="edit-item">
        <div class="title">是否显示：</div>
        <div class="content">
          <el-switch
            v-model="editForm.enAble"
            active-value="1"
            inactive-value="0"
            active-color="#409eff"
          ></el-switch>
        </div>
      </div>
      <div class="edit-item">
        <div class="title">短信通知：</div>
        <div class="content">
          <el-checkbox v-model="editForm.enableSms" true-label="1" false-label="0">客户预约成功将发送短信通知</el-checkbox>
        </div>
      </div>
      <div class="edit-item">
        <div class="title">预约详情：</div>
        <div class="content">
          <WangEditor ref="ue"></WangEditor>
        </div>
      </div>
      <div class="edit-item" style="margin-top:24px">
        <div class="title"></div>
        <div class="content">
          <el-button type="primary" @click="updateProject">保存</el-button>
          <el-button @click="cancelUpdate">取消</el-button>
        </div>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
  getWxAppointInfo,
  removeWxAppointInfo,
  setAppointShow
} from '@/api/super-crm/wx-member-functions'
import user from '@/utils/user'
import WangEditor from '@/components/WangEditor.vue'
import { htmlEncodeByRegExp, htmlDecodeByRegExp } from '@/utils/storeageCompile'
import ClipboardJS from 'clipboard'

@Component({
  components: {
    WangEditor
  }
})
export default class AppointOnline extends Vue {
  private tableData = []
  private editAppointShow: boolean = true
  private value2: boolean = true
  private checked: boolean = true

  private pageSize: number = 20
  private isSinglePage: boolean = true
  private currentPage: number = 1
  private tableTotal: number = 0

  private editForm = {
    title: '',
    enAble: '',
    enableSms: '',
    id: ''
  }

  private mounted() {
    this.getWxAppointInfo()
  }

  private record(item: any) {
    console.log(item)
    this.$router.push({
      path: '/super-crm/wx-member/member-function/appoint/record',
      query: {
        id: item.id
      }
    })
  }

  private editAppoint(item: any) {
    this.editAppointShow = false
    this.editForm.title = item.title
    this.editForm.enAble = item.enAble
    this.editForm.enableSms = item.enableSms
    this.editForm.id = item.id
    if (item.content) {
      (this.$refs.ue as any).setContent(htmlDecodeByRegExp(item.content))
    }
  }

  private getWxAppointInfo() {
    const params = {
      page: {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      },
      params: {
        companyKey: user.serverUser.account.companyKey
      }
    }
    getWxAppointInfo(params).then((res: any) => {
      this.tableData = res.data.list || []
      this.tableTotal = res.data.total || 0
    })
  }

  private copuText(item: any) {
    return `${VUE_APP_BASE_API}/wx-interface-web/wx/auth?companyKey=${user.serverUser.account.companyKey}&page=wx_member&childPage=app-online`
  }

  private copyItemLink(item: any) {
    const clipboard = new ClipboardJS(`#btn-${item.id}`)
    clipboard.on('success', (e: any) => {
      this.$message({
        type: 'success',
        message: '复制成功！'
      })
      e.clearSelection()
    })
  }

  private setAppointShow(item: any) {
    const params = {
      enAble: item.enAble === '1' ? '0' : '1',
      id: item.id,
      companyKey: user.serverUser.account.companyKey
    }
    setAppointShow(params).then((res: any) => {
      this.getWxAppointInfo()
      this.$message({
        type: 'success',
        message: '修改成功！'
      })
    })
  }

  private removeAppoint(item: any) {
    this.$confirm('确定删除该条预约？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        removeWxAppointInfo({
          id: item.id,
          companyKey: user.serverUser.account.companyKey
        }).then((res: any) => {
          this.getWxAppointInfo()
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  private updateProject() {
    let wangContent = ''
    if ((this.$refs.ue as any).getContentText()) {
      wangContent = (this.$refs.ue as any).getContent()
    }
    const params = {
      enAble: this.editForm.enAble,
      id: this.editForm.id,
      title: this.editForm.title,
      enableSms: this.editForm.enableSms,
      companyKey: user.serverUser.account.companyKey,
      content: wangContent ? htmlEncodeByRegExp(wangContent) : ''
    }
    setAppointShow(params).then((res: any) => {
      this.getWxAppointInfo()
      this.cancelUpdate()
      this.$message({
        type: 'success',
        message: '修改成功！'
      })
    })
  }

  private cancelUpdate() {
    this.editAppointShow = true
  }
}
</script>

<style lang="scss" scoped>
.appoint-online {
  .table-page {
    position: fixed;
    bottom: 15px;
    right: 20px;
  }
}
.edit-appoint-online {
  .edit-item {
    display: flex;
    min-height: 45px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #606266;
    .title {
      width: 70px;
      text-align: right;
    }
    .content {
      padding-left: 8px;
    }
  }
}
</style>


