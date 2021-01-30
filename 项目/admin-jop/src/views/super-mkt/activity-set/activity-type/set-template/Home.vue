<template>
  <div class="home">
    <header>
      <el-button icon="el-icon-plus" type="primary" @click="toAddPage">添加活动</el-button>
    </header>
    <el-table empty-text="暂无游戏" :data="initTableData" border style="width: 100%">
      <el-table-column label="编号" width="100">
        <template slot-scope="scope">{{scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column prop="activityName" label="活动名称" width="180"></el-table-column>
      <el-table-column prop="beginTime" label="开始时间" width="160">
        <template slot-scope="scope">{{scope.row.beginTime | ymdhm}}</template>
      </el-table-column>
      <el-table-column prop="beginTime" label="结束时间" width="160">
        <template slot-scope="scope">{{scope.row.endTime | ymdhm}}</template>
      </el-table-column>
      <el-table-column label="活动状态" width="120">
        <template slot-scope="scope">
          <el-button v-if="scope.row.activeStatus == 1" type="danger" size="small">未开始</el-button>
          <el-button v-if="scope.row.activeStatus == 2" type="success" size="small">进行中</el-button>
          <el-button v-if="scope.row.activeStatus == 3" type="warning" size="small">已暂停</el-button>
          <el-button v-if="scope.row.activeStatus == 4" type="info" size="small">已结束</el-button>
          <el-tooltip class="item" effect="light" :content="scope.row.errorState" placement="left">
            <el-button
              v-if="scope.row.activeStatus == 5"
              type="warning"
              size="small"
              icon="el-icon-question"
            >异常状态</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-setting" size="small" @click="toSetPage(scope.row)">活动设置</el-button>
          <el-button
            :class="scope.row.isPublish==='1' ? 'closeTestLink': ''"
            icon="el-icon-tickets"
            size="small"
            @click="shareLink(scope.row)"
          >测试链接</el-button>
          <el-button icon="el-icon-tickets" size="small" @click="publishGamge(scope.row)">发布链接</el-button>
          <el-button icon="el-icon-tickets" size="small" @click="toPage(scope.row)">活动数据</el-button>
          <el-button
            icon="el-icon-delete"
            size="small"
            type="danger"
            @click="deleteGame(scope.$index)"
          >删除</el-button>
          <el-switch
            class="switch-btn"
            @change="setActive(scope.$index)"
            v-model="scope.row.isPaused"
            active-value="0"
            inactive-value="1"
            active-color="#67c23a"
            inactive-color="#f56c6c"
            active-text="开启"
            inactive-text="关闭"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <QRCodeDialog :showQR.sync="showQR" :ActiveName="ActiveName" :LinkValue="LinkValue"></QRCodeDialog>
  </div>
</template>

<script>
import { publishNewGame } from '@/api/super-mkt/activity-set/nine'
import user from '@/utils/user'
import QRCodeDialog from '../components/QRCodeDialog'
export default {
  data() {
    return {
      LinkValue: '',
      ActiveName: '',
      showQR: false
    }
  },
  components: {
    QRCodeDialog
  },
  computed: {
    initTableData() {
      return this.dataList
    }
  },
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    activityPage: {
      type: String
    },
    dataViewPage: {
      type: String
    },
    setPage: {
      type: String
    }
  },
  methods: {
    deleteGame(index) {
      this.$confirm('是否删除该条信息？', {
        title: '警告',
        type: 'warning'
      })
        .then(() => {
          const active = this.initTableData[index]
          this.$emit('deleteGame', active)
        })
        .catch(_ => _)
    },
    shareLink(item) {
      this.showQR = true
      this.ActiveName = item.activityName
      this.LinkValue = `${VUE_APP_BASE_API}/wx-interface-web/wx/auth?companyKey=${user.serverUser.account.companyKey}&shareId=${item.id}&childPage=tigger&page=wx_game_group`
    },
    publishNewGameTip(options) {
      this.$confirm(
        '是否确定发布该活动，若发布后游戏的总参与次数、每天参与次数、中奖次数限制、分享获得次数不得修改',
        '温馨提示',
        {
          confirmButtonText: '发布',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          publishNewGame(options)
            .then(res => {
              this.$message({
                type: 'success',
                message: '发布成功!'
              })
              // this.getActiveList()
              this.$emit('updateTab')
            })
            .catch(reason => {
              this.$message({
                type: 'warning',
                message: reason || '发布失败!'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发布'
          })
        })
    },
    publishGamge(item) {
      const { id, isPublish } = item
      console.log('发布的游戏', id, isPublish, item)
      const options = { id }
      const publish = Number(isPublish)
      if (publish === 0) {
        this.publishNewGameTip(options)
      } else {
        this.shareLink(item)
      }
    },
    toAddPage() {
      this.$router.push(this.activityPage)
    },
    toPage(option) {
      this.$router.push({ path: this.dataViewPage, query: { id: option.id } })
    },
    toSetPage(option) {
      this.$router.push({
        path: this.setPage,
        query: { id: option.id, name: option.activityName }
      })
    },
    setActive(index) {
      const active = this.initTableData[index]
      this.$emit('isOpenGame', active)
    }
  }
}
</script>

<style lang='scss' scoped>
.home {
  & > header {
    margin-bottom: 10px;
  }
  .closeTestLink {
    display: none;
  }
  .switch-btn {
    display: inline-block;
    margin-left: 20px;
  }
}
</style>
