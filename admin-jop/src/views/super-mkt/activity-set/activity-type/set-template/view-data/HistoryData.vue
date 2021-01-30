<template>
  <div class="container">
    <div class="search-box">
      <div>
        <el-row>
          <el-col :span="24">
            <el-form :inline="true" :model="form">
              <el-form-item label="openid：">
                <el-input v-model="form.openid"></el-input>
              </el-form-item>
              <el-form-item label="会员姓名：">
                <el-input v-model="form.memberName"></el-input>
              </el-form-item>
              <el-form-item label="会员卡号：">
                <el-input v-model="form.memberCard"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form :inline="true" :model="form">
              <el-form-item label="参与时间：">
                <el-date-picker
                  v-model="form.winningTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="emitSearch">查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
    <section class="pagination-container">
      <el-pagination
        @current-change="pageChange"
        background
        :current-page="pagination.pageNum"
        :page-size="pagination.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="pagination.total"
      ></el-pagination>
    </section>
    <el-table :data="initTableData.list ? initTableData.list : []" border style="width: 100%">
      <el-table-column prop="openid" label="openid" align="center"></el-table-column>
      <el-table-column v-if="img" label="头像" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatarUrl" alt />
        </template>
      </el-table-column>
      <el-table-column v-if="img" prop="memberName" label="昵称" align="center"></el-table-column>
      <el-table-column v-else prop="memberName" label="会员姓名" align="center"></el-table-column>
      <el-table-column prop="memberCard" label="会员卡号" align="center"></el-table-column>
      <el-table-column v-if="distance" label="距离" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.gameDistance ? scope.row.gameDistance + '米' : '0米'}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="distance" prop="drawNumber" label="参与次数" align="center"></el-table-column>
      <el-table-column v-else prop="drawNumber" label="抽奖次数" align="center"></el-table-column>
      <el-table-column prop="shareNumber" label="分享次数" width="150"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  computed: {
    pagination() {
      return {
        total: this.historyAllData.total,
        pageNum: this.historyAllData.pageNum,
        pageSize: this.historyAllData.pageSize
      }
    },
    initTableData() {
      return this.historyAllData
    }
  },
  props: {
    historyAllData: {
      type: Object
    },
    distance: {
      type: Boolean,
      default: false
    },
    img: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        pageNum: 1,
        openCode: '',
        memberName: '',
        memberCard: '',
        winningTime: [],
        openid: ''
      }
    }
  },
  methods: {
    emitSearch() {
      this.$emit('searchData', this.form)
    },
    pageChange(pageNum) {
      this.form.pageNum = pageNum
      this.$emit('searchData', this.form)
    }
  }
}
</script>

<style lang='scss'>
.container {
  .search-box {
    padding: 18px;
    background: #f5f5f5;
    color: #333;
    line-height: 38px;
  }
  & > .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    margin-bottom: 10px;
  }
}
</style>
