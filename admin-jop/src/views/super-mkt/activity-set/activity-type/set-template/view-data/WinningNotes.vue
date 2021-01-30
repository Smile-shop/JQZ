<template>
  <div class="winningNotes">
    <div class="search-box">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="form">
            <el-form-item label="兑奖码：">
              <el-input v-model="form.exchangeCode"></el-input>
            </el-form-item>
            <el-form-item label="奖品名称：">
              <el-input v-model="form.giftName"></el-input>
            </el-form-item>
            <el-form-item label="会员卡号：">
              <el-input v-model="form.memberCard"></el-input>
            </el-form-item> 
            <el-form-item label="openid：">
              <el-input v-model="form.openId"></el-input>
            </el-form-item>
            <el-form-item label="手机号：">
              <el-input v-model="form.phoneNumber"></el-input>
            </el-form-item>
            <el-form-item label="领取状态：">
              <el-select v-model="form.accepetStatus" clearable>
                <el-option label="已领取" value="OCHH"></el-option>
                <el-option label="未领取" value="OCHN"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="21">
          <el-form :inline="true" :model="form">
            <el-form-item label="中奖时间：">
              <el-date-picker
                v-model="form.winningTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="兑奖门店：">
              <el-input v-model="form.exchangeShop"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="emitSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" plain icon="el-icon-download" @click="downloadWinningNote">导出查询结果</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="page">
      <section class="pagination-container">
        <el-pagination
          background
          @current-change="pageChange"
          :current-page="pagination.pageNum"
          :page-size="pagination.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="pagination.total"
        ></el-pagination>
      </section>
    </div>
    <div class="tableList">
      <el-table :data="initTableData" border style="width: 100%">
        <el-table-column prop="openId" label="openid" align="center"></el-table-column>
        <el-table-column prop="name" label="领奖人姓名" align="center"></el-table-column>
        <el-table-column prop="memberCard" label="会员卡号" align="center"></el-table-column>
        <el-table-column prop="phoneNumber" label="手机号" align="center"></el-table-column>
        <el-table-column prop="imgUrl" label="奖品图" align="center">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.picURL"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="giftName" label="奖品名称" align="center"></el-table-column>
        <el-table-column prop="winningTime" label="中奖时间" align="center"></el-table-column>
        <el-table-column prop="exchangeShop" label="兑奖门店" align="center"></el-table-column>
        <el-table-column prop="exchangeCode" label="兑奖码" align="center"></el-table-column>
        <el-table-column prop="accepetTime" label="领奖时间" align="center"></el-table-column>
        <el-table-column prop="accepetStatus" label="领取状态" align="center">
          <template slot-scope="scope">
            <span
              :class="scope.row.accepetStatus=='OCHH'?'OCHH':'OCHN'"
            >{{scope.row.accepetStatus=='OCHH'?'已领取':'未领取'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    pagination() {
      return {
        total: this.winningAllData.total,
        pageNum: this.winningAllData.pageNum,
        pageSize: this.winningAllData.pageSize
      }
    },
    initTableData() {
      return this.winningAllData.list
    }
  },
  props: {
    winningAllData: {
      type: Object
    }
  },
  data() {
    return {
      form: {
        pageNum: 1,
        exchangeCode: '',
        giftName: '',
        memberCard: '',
        openId: '',
        phoneNumber: '',
        exchangeShop: '',
        accepetStatus: '',
        winningTime: []
      },
      cache: {
        activeId: this.$route.query.id,
      }
    }
  },
  methods: {
    pageChange(pageNum) {
      this.form.pageNum = pageNum
      this.$emit('searchData', this.form)
    },
    emitSearch() {
      this.$emit('searchData', this.form)
      this.updateCache(this.form)
    },
    updateCache(val) {
      this.cache = Object.assign(this.cache, val)
    },
    downloadWinningNote() {
      const list = this.winningAllData.list
      const options = this.cache
      if (list.length <= 0) {
        this.$message({
          type: 'warning',
          message: '没有数据需要导出'
        })
      } else {
        this.$emit('downloadWinningNote', options)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.tableList {
  margin-top: 64px;
  & img {
    width: 100%;
    max-width: 67px;
  }
}
.page {
  padding: 10px 0px;
  .pagination-container {
    float: right;
  }
}
.search-box {
  padding: 18px;
  background: #f5f5f5;
  color: #333;
  line-height: 38px;
}
</style>
