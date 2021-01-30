<template>
  <div class="activity-type-home">
    <header>
      <el-button icon="el-icon-plus" type="primary" @click="toAddPage">添加活动</el-button>
    </header>

    <app-gutter />

    <el-table empty-text="暂无游戏" :data="dataList" border style="width: 100%">
      <el-table-column label="编号" width="100">
        <template slot-scope="scope">{{scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column prop="activityName" label="活动名称" width="180"></el-table-column>
      <el-table-column prop="keyWord" label="关键字" width="180"></el-table-column>
      <el-table-column prop="beginTime" label="开始时间" width="160">
        <template slot-scope="scope">{{scope.row.beginTime | ymdhm}}</template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="160">
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
          <el-button icon="el-icon-setting" size="small" @click="toPage('set', scope)">活动设置</el-button>
          <el-button icon="el-icon-tickets" size="small" @click="toPage('data', scope)">活动数据</el-button>
          <el-button icon="el-icon-delete" size="small" @click="setActive('delete', scope.row)">删除</el-button>
          <el-button
            size="small"
            v-if="scope.row.activeStatus != 4 && scope.row.activeStatus != 5"
            @click="setActive('stop', scope.row)"
          >
            <el-icon type="stop" />结束
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
  getActiveList,
  deleteActive,
  pauseActive,
  overActive
} from '@/api/super-mkt/activity-set/fans'
import AppGutter from '@/components/AppGutter.vue'
import FormBar from '@/components/FormBar.vue'
import Editor from '@/components/WangEditor.vue'
import { Message } from 'element-ui'
import ElIcon from '@/components/ElIcon.vue'

@Component({
  components: {
    AppGutter,
    FormBar,
    Editor,
    ElIcon
  }
})
export default class PrizeSetActivityTypeHome extends Vue {
  dataList: any[] = []

  mounted() {
    this.getActiveList()
  }

  // 查询活动名称列表
  getActiveList() {
    return new Promise((resolve, reject) => {
      const body = {
        parentActive: '人气值千金'
      }

      getActiveList(body)
        .then((res: any) => {
          const { data } = res

          this.dataList = data

          resolve(res)
        })
        .catch((reason: any) => {
          reject(reason)
        })
    })
  }

  // 页面跳转
  toPage(page: string, scope: any) {
    switch (page) {
      case 'set':
        this.$router.push({
          path: '/super-mkt/activity-set/activity-type/fans/add',
          query: {
            id: scope.row.id,
            jmpId: scope.row.jmpId
          }
        })
        break
      case 'data':
        this.$router.push({
          path: '/super-mkt/activity-set/activity-type/fans/data',
          query: {
            id: scope.row.id,
            jmpId: scope.row.jmpId
          }
        })
        break
      default:
        break
    }
  }

  // 前往添加页面
  toAddPage() {
    this.$router.push({
      path: '/super-mkt/activity-set/activity-type/fans/add'
    })
  }

  // 活动设置
  setActive(type: string, item: any) {
    switch (type) {
      case 'delete':
        this.$confirm('是否确定删除该活动', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteActive(item)
            .then((res: any) => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })

              this.getActiveList()
            })
            .catch(reason => {
              this.$message({
                type: 'warning',
                message: reason || '删除失败!'
              })
            })
        })
        break
      case 'start':
        this.$confirm('是否确定开始该活动', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.pauseActive(item, { isPaused: '0' })
            .then((res: any) => {
              this.$message({
                type: 'success',
                message: '活动已开始!'
              })

              this.getActiveList()
            })
            .catch(reason => {
              this.$message({
                type: 'warning',
                message: reason || '活动开始失败!'
              })
            })
        })
        break
      case 'pause':
        this.$confirm('是否确定暂停该活动', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.pauseActive(item, { isPaused: '1' })
            .then((res: any) => {
              this.$message({
                type: 'success',
                message: '活动已暂停!'
              })

              this.getActiveList()
            })
            .catch(reason => {
              this.$message({
                type: 'warning',
                message: reason || '活动暂停失败!'
              })
            })
        })
        break
      case 'stop':
        this.$confirm('是否确定结束该活动，结束后将无法再次开启', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.overActive(item)
            .then((res: any) => {
              this.$message({
                type: 'success',
                message: '活动结束!'
              })

              this.getActiveList()
            })
            .catch(reason => {
              this.$message({
                type: 'warning',
                message: reason || '活动结束失败!'
              })
            })
        })
        break
      default:
        break
    }
  }

  // 删除活动
  deleteActive(item: any) {
    return new Promise((resolve, reject) => {
      const body = {
        id: item.id,
        jmpId: item.jmpId
      }

      deleteActive(body)
        .then((res: any) => {
          resolve(res)
        })
        .catch((reason: any) => {
          reject(reason)
        })
    })
  }

  // 删除活动
  pauseActive(item: any, options: any) {
    return new Promise((resolve, reject) => {
      const body = {
        id: item.id,
        jmpId: item.jmpId,
        isPaused: options.isPaused
      }

      pauseActive(body)
        .then((res: any) => {
          resolve(res)
        })
        .catch((reason: any) => {
          reject(reason)
        })
    })
  }

  // 结束活动
  overActive(item: any) {
    return new Promise((resolve, reject) => {
      const body = {
        id: item.id,
        jmpId: item.jmpId,
        isOver: '1'
      }

      overActive(body)
        .then((res: any) => {
          resolve(res)
        })
        .catch((reason: any) => {
          reject(reason)
        })
    })
  }
}
</script>

<style lang="scss" scoped>
</style>


