<template>
  <div>
    <header>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="$router.push('/super-mkt/market-promotion/promotion-set/set-plan/edit')"
      >新增方案</el-button>
    </header> 
    <section class="plan-list">
      <div class="plan-view" v-for="(item, index) in viewList" :key="index">
        <ul>
          <li>
            <img :src="item.advertistings[0].advertisingImg" style="height: 80px;width: 300px;" alt />
          </li>
          <li class="plan-name">
            <span>{{item.scheme}}</span>
          </li>
          <li>
            <el-button size="small" @click="view(item.id)">预览</el-button>
            <el-button
              size="small"
              @click="$router.push({
              path: '/super-mkt/market-promotion/promotion-set/set-plan/edit',
              query: {
                id: item.id
              }
            })"
            >编辑</el-button>
            <el-button size="small" @click="deleteView(item.id)">删除</el-button>
          </li>
        </ul>
      </div>
    </section>
    <el-dialog :title="viewInfo.scheme" :visible.sync="dialogVisible" width="417px">
      <ViewPage :viewData="viewInfo"></ViewPage>
    </el-dialog>
  </div>
</template>

<script>
import {
  querySchemeInfo,
  querySchemeList,
  deleteScheme
} from '@/api/super-mkt/spread-set/set-plan'
import ViewPage from './View'
export default {
  components: {
    ViewPage
  },
  created() {
    this._getSchemeList()
  },
  data() {
    return {
      viewInfo: {},
      dialogVisible: false,
      viewList: []
    }
  },
  methods: {
    async view(id) {
      const { data } = await querySchemeInfo({ id })
      this.viewInfo = data
      this.dialogVisible = true
    },
    deleteView(id) {
      this.$confirm('是否删除该条信息？', {
        title: '警告',
        type: 'warning'
      })
        .then(() => {
          deleteScheme({ id }).then(result => {
            try {
              const { msg } = result
              this.$message.success(msg)
              this._getSchemeList()
            } catch (error) {
              console.log('TCL: deleteView -> error', error)
              this._getSchemeList()
            }
          })
        })
        .catch(_ => _)
    },
    async _getSchemeList() {
      try {
        const { data } = await querySchemeList({})
        this.viewList = data
      } catch (error) {
        this.viewList = []
        console.log('TCL: _getSchemeList -> error', error)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.plan-list {
  margin-top: 10px;
  overflow: hidden;
  .plan-view {
    margin-top: 20px;
    margin-right: 30px;
    float: left;
    width: 320px;
    height: 175px;
    text-align: center;
    border-radius: 4px;
    border: solid 1px #dddddd;
    ul {
      margin: 10px 0;
      .plan-name {
        height: 35px;
        line-height: 35px;
        span {
          width: 90%;
          display: inline-block;
          border-bottom: 1px solid #ddd;
        }
      }

      & li:last-child {
        margin-top: 6px;
      }
    }
  }
}
</style>
