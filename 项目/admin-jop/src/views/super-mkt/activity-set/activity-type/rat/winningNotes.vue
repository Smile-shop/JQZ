<template>
  <div class="winningNotes">
    <div class="search-box">
      <div>
        <span>兑奖码：</span>
        <input type="text" v-model="formParams.exchangeCode" />
        <span>奖品名称：</span>
        <input type="text" v-model="formParams.giftName" />
        <span>会员卡号：</span>
        <input type="text" v-model="formParams.memberCard" />
        <span>openid：</span>
        <input type="text" v-model="formParams.openId" />
        <span>手机号：</span>
        <input type="text" v-model="formParams.phoneNumber" />
        <span>&nbsp;&nbsp;&nbsp;领取状态：</span>
        <el-select
          v-model="accepetStatus"
          @change="changeStatus($event)"
          placeholder="请选择"
          size="small"
          class="Receive"
        >
          <el-option v-for="item in take" :key="item.value" :label="item.value" :value="item.value"></el-option>
        </el-select>
      </div>
      <div>
        <span>中奖时间：</span>
        <el-date-picker
          v-model="formParams.winningTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="limitDate($event)"
        ></el-date-picker>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;兑奖门店：</span>
        <el-select
          v-model="exchangeShop"
          @change="changeNth($event)"
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in shopList"
            :key="item.value"
            :label="item.shopName"
            :value="item.shopName"
          ></el-option>
        </el-select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button class="serchBtn" @click="onQuery">查询</button>
        <button class="getExcel" @click="exportTableData">导出</button>
      </div>
    </div>
    <div class="page">
      <section class="pagination-container">
        <el-pagination
          @current-change="pageChange"
          background
          :current-page="pageNum"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </section>
    </div>
    <div class="tableList">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="openId" label="openid" align="center"></el-table-column>
        <el-table-column prop="name" label="领奖人姓名" align="center"></el-table-column>
        <el-table-column prop="memberCard" label="会员卡号" align="center"></el-table-column>
        <el-table-column prop="phoneNumber" label="手机号" align="center"></el-table-column>
        <el-table-column prop="imgUrl" label="奖品图" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="imagesUrl({
              path: '/jop-wx-web/op/showimage',
              name: scope.row.picList?scope.row.picList[0]:'404',
              alias: 'Gift'
            })"
            ></el-image>
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

    <!-- <Table :columns="columns" :data="tableData" ref="table" v-show="false"></Table> -->
  </div>
</template>
<script>
import { imagesUrl } from '@/utils/imageUrl'
import {
  queryShopList,
  winningRecords
} from '@/api/super-mkt/activity-set/nine'
import moment from 'moment'
export default {
  data() {
    return {
      columns: [
        {
          title: 'openid',
          key: 'openId'
        },
        {
          title: '领奖人姓名',
          key: 'name'
        },
        {
          title: '会员卡号',
          key: 'memberCard'
        },
        {
          title: '手机号',
          key: 'phoneNumber'
        },
        {
          title: '奖品图',
          key: 'imgUrl'
        },
        {
          title: '奖品名称',
          key: 'giftName'
        },
        {
          title: '中奖时间',
          key: 'winningTime'
        },
        {
          title: '兑奖门店',
          key: 'exchangeShop'
        },
        {
          title: '兑奖码',
          key: 'exchangeCode'
        },
        {
          title: '领奖时间',
          key: 'accepetTime'
        },
        {
          title: '领取状态',
          key: 'accepetStatus'
        }
      ],
      total: 0,
      pageNum: 1,
      TimestampNowDate: '',
      TimestampStart: '',
      TimestampEnd: '',
      dateValue: '',
      shoPvalue: '',
      shopList: [],
      pageSize: 10,
      take: [{ value: '已领取' }, { value: '未领取' }, { value: '全部状态' }],
      takeStatus: '未领取',
      exchangeShop: '',
      accepetStatus: '',
      tableData: [],
      formParams: {
        exchangeCode: '',
        giftName: '',
        memberCard: '',
        openId: '',
        phoneNumber: '',
        exchangeShop: '',
        accepetStatus: '',
        winningTime: ''
      }
    }
  },
  methods: {
    imagesUrl(body) {
      imagesUrl(body)
    },
    limitDate($event) {
      // 日期校验
      if (!$event) {
        this.TimestampStart = ''
        this.TimestampEnd = ''
      } else {
        const endTime = moment($event[1], 'YYYY-MM-DD HH:mm:ss').valueOf()
        this.TimestampNowDate = moment(
          new Date(),
          'YYYY-MM-DD HH:mm:ss'
        ).valueOf()
        if (endTime > this.TimestampNowDate) {
          this.$alert('不能大于当前时间', '日期选择有误', {
            confirmButtonText: '确定',
            callback: action => {
              this.dateValue = []
              return
            }
          })
          this.formParams.winningTime = []
        } else {
          this.TimestampStart = moment($event[0]).format('YYYY-MM-DD')
          this.TimestampEnd = moment($event[1]).format('YYYY-MM-DD')
        }
      }
    },
    changeNth($event) {
      if ($event == '查看全部门店') {
        this.formParams.exchangeShop = ''
      } else {
        this.formParams.exchangeShop = $event
      }
    },
    changeStatus($event) {
      if ($event == '全部状态') {
        this.formParams.accepetStatus = ''
      } else if ($event == '已领取') {
        this.formParams.accepetStatus = 'OCHH'
      } else if ($event == '未领取') {
        this.formParams.accepetStatus = 'OCHN'
      }
    },
    pageChange(pageNum) {
      const body = {
        pageNum,
        activeId: this.$route.query.id,
        beginTime: this.TimestampStart,
        endTime: this.TimestampEnd,
        ...this.formParams
      }
      this.getwinningRecords(body)
    },
    getwinningRecords(body) {
      winningRecords(body)
        .then(res => {
          console.log(res)
          if (code == 0) {
            if (data && data.list) {
              this.pageNum = data.pageNum
              this.pageSize = data.pageSize
              this.total = data.total
              this.tableData = data.list
            } else {
              this.$message({
                message: '暂无数据哦~',
                type: 'warning'
              })
            }
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    onQuery() {
      const body = {
        activeId: this.$route.query.id,
        beginTime: this.TimestampStart,
        endTime: this.TimestampEnd,
        ...this.formParams
      }
      this.getwinningRecords(body)
    },
    toqueryShopList(body) {
      queryShopList(body)
        .then(res => {
          const { data, code, msg } = res
          if (code == 0) {
            if (data) {
              this.shopList = data.map((val, i) => {
                return {
                  shopName: val.shopName,
                  shopId: val.shopId
                }
              })
              this.shopList.push({
                shopName: '查看全部门店',
                shopId: '-1'
              })
            } else {
              this.$message({
                message: '暂无数据哦~',
                type: 'warning'
              })
            }
          } else {
            this.$message.error(msg)
          }
        })
        .catch(err => {
          reject(err)
        })
    },
    exportTableData() {
      this.$refs.table.exportCsv({
        filename: '九宫格参与记录',
        columns: this.columns,
        data: this.tableData
      })
    }
  },
  created() {
    const body = {
      activeId: this.$route.query.id,
      beginTime: this.TimestampStart,
      endTime: this.TimestampEnd,
      ...this.formParams
    }
    this.getwinningRecords(body)
    this.toqueryShopList({ activeId: this.$route.query.id })
  }
}
</script>
<style lang='scss' scoped>
.page {
  padding: 10px 0px;

  .pagination-container {
    float: right;
  }
}
.OCHH {
  color: #409eff;
}
.OCHN {
  color: #f56c6c;
}
.winningNotes {
  .tableList {
    margin-top: 64px;

    & img {
      width: 100%;
      max-width: 67px;
    }
  }
  .search-box {
    padding: 18px;
    background: #f5f5f5;
    color: #333;
    line-height: 38px;

    & > div {
      margin-top: 20px;

      .getExcel {
        float: right;
      }
    }
    & > div input {
      width: 121px;
      height: 33px;
      border-radius: 5px;
      outline: none;
      border: solid 1px #dcdfe6;
      margin-right: 20px;
      padding-left: 10px;
    }
    & > div span {
      margin-right: 10px;
    }
    & > div button {
      width: 98px;
      height: 40px;
      color: #fff;
      background: #409eff;
      border-radius: 5px;
      border: none;
    }
  }
}
.el-select .el-input__inner {
  height: 38px !important;
}
.Receive .el-select {
  width: 79px !important;
}
</style>