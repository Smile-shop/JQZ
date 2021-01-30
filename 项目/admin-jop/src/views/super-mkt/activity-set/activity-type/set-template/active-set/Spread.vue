<template>
  <div>
    <header>
      <el-checkbox v-model="isScheme" @change="isOpenSpread" true-label="1" false-label="0">是否开启推广方案</el-checkbox>
    </header>
    <section class="plan-list" v-show="isScheme === '1'">
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
              :type="item.id + '' === baseData.scheme ? 'primary' : ''"
              size="small"
              icon="el-icon-circle-check"
              @click="selectSpread(item)"
              :disabled="isScheme === '0'"
            >选择</el-button>
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
  querySchemeList,
  querySchemeInfo
} from '@/api/super-mkt/spread-set/set-plan'
import ViewPage from '@/views/super-mkt/spread-set/spread-manage/spread-info/View'

export default {
  components: {
    ViewPage
  },
  computed: {
    initDataFuncObj() {
      return { ...this.getDataFunc }
    }
  },
  props: {
    getDataFunc: {
      type: Object
    }
  },
  created() {
    this._getSchemeList()
    this._getActiveSet()
  },
  data() {
    return {
      dialogVisible: false,
      viewInfo: {},
      prevOptions: {},
      selected: false,
      baseData: {},
      isScheme: '0',
      viewList: []
    }
  },
  methods: {
    async view(id) {
      const { data } = await querySchemeInfo({ id })
      this.viewInfo = data
      this.dialogVisible = true
    },
    async isOpenSpread(value) {
      try {
        const options = {
          activeId: this.$route.query.id,
          isScheme: value,
          scheme: this.baseData.scheme
        }

        const { msg } = await this.initDataFuncObj.updateScheme(options)
        this._getActiveSet()
        this.$message.success(msg)
      } catch (error) {
        console.log('TCL: selectSpread -> error', error)
        this._getActiveSet()
      }
    },
    async _getActiveSet(options = { activeId: this.$route.query.id }) {
      const { data } = await this.initDataFuncObj.queryActive(options)
      this.baseData = data
      this.isScheme = this.baseData.isScheme
    },
    async selectSpread(item) {
      try {
        const options = {
          activeId: this.$route.query.id,
          isScheme: this.isScheme,
          scheme: item.id
        }

        const { msg } = await this.initDataFuncObj.updateScheme(options)
        this._getActiveSet()
        this.$message.success(msg)
      } catch (error) {
        console.log('TCL: selectSpread -> error', error)
        this._getActiveSet()
      }
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
    margin-top: 10px;
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
</style>
