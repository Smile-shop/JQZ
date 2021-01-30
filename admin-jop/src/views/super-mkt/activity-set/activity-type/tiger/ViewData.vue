<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="活动数据" name="dataTable">
        <ActiveDataPage
          :activeDataVo="activeData"
          :chartData="chartData"
          @searchData="activeSearch"
        ></ActiveDataPage>
      </el-tab-pane>
      <el-tab-pane label="参与记录" name="history">
        <HistoryDataPage :historyAllData="historyAllData" @searchData="historySearch"></HistoryDataPage>
      </el-tab-pane>
      <el-tab-pane label="中奖记录" name="winningNotes">
        <WinningNotesPage :winningAllData="winningAllData" @searchData="winningSearch" @downloadWinningNote="tigerDownload"></WinningNotesPage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { imagesUrl } from '@/utils/imageUrl'
import { downloadWinningRecord } from '@/api/super-mkt/prize-set/prize-info'
import {
  joinRecords,
  dataShow,
  winningRecords
} from '@/api/super-mkt/activity-set/tiger'
import downloadWinTable from '@/utils/exportWinRecords'
import ActiveDataPage from '../set-template/view-data/ActiveData'
import HistoryDataPage from '../set-template/view-data/HistoryData'
import WinningNotesPage from '../set-template/view-data/WinningNotes'
export default {
  components: {
    ActiveDataPage,
    HistoryDataPage,
    WinningNotesPage
  },
  data() {
    return {
      activeName: 'dataTable',
      activeData: {},
      chartData: {},
      historyAllData: {},
      winningAllData: {},
      activeId: this.$route.query.id,
      pageSize: 0,
      downloading: false,
    }
  },
  created() {
    this._getActiveData()
    this._getHistoryData()
    this._getWinningData()
  },
  methods: {
    winningSearch(options) {
      const params = Object.assign(options, {
        activeId: this.activeId,
        beginTime: options.winningTime ? options.winningTime[0] : '',
        endTime: options.winningTime ? options.winningTime[1] : ''
      })

      this._getWinningData(params)
    },
    async _getWinningData(options = { activeId: this.$route.query.id }) {
      try {
        const result = await winningRecords(options)
        this.pageSize = result.data.total
        result.data.list.forEach(item => {
          item.picURL = imagesUrl({
            name: Array.isArray(item.picList) ? item.picList[0] : '',
            alias:
              item.shelfProductType === '1'
                ? 'Gift'
                : item.shelfProductType === '2'
                ? 'Coupon'
                : item.shelfProductType === '3'
                ? 'Integral'
                : ''
          })
        })
        this.winningAllData = result.data
      } catch (error) {
        this.$message({
          type: 'error',
          message: error
        })
      }
    },
    historySearch(options) {
      const params = Object.assign(options, {
        activeId: this.activeId,
        beginTime: options.winningTime[0] ? options.winningTime[0] : '',
        endTime: options.winningTime[1] ? options.winningTime[1] : ''
      })

      this._getHistoryData(params)
    },
    async _getHistoryData(options = { activeId: this.$route.query.id }) {
      try {
        const result = await joinRecords(options)
        this.historyAllData = result.data
      } catch (error) {
        this.$message({
          type: 'error',
          message: error
        })
      }
    },
    activeSearch(options) {
      this._getActiveData(options)
    },
    // 下载中奖记录
    tigerDownload(options) {
      if (this.downloading) {
        this.$message({
          type: 'warning',
          message: '导出中请稍后'
        })
        return
      }
      this.downloading = true
      const params = {}
      params.name = '老虎机'
      options.pageNum = 1
      options.pageSize = this.pageSize
      downloadWinningRecord(options).then(res => {
        this.downloading = false
        const data = res.data
        params.data = data.list
        params.detail = data.marketActive.activityName
        downloadWinTable(params)
      }).catch(err => {
        console.log(err)
      })
    },
    async _getActiveData(options = { activeId: this.$route.query.id }) {
      try {
        const result = await dataShow(options)
        const { activeDataVo, datas, shows } = result.data

        const joinPersonObj = {}
        const shareDataObj = {}

        datas.map(item => {
          joinPersonObj[item.createTime] = item.joinNumberSum
          shareDataObj[item.createTime] = item.shareNumberSum
        })

        const rows = shows.map(item => {
          return {
            日期: item.createTime,
            展示量: item.showNumberSum,
            参与人数: joinPersonObj[item.createTime]
              ? joinPersonObj[item.createTime]
              : 0,
            分享次数: shareDataObj[item.createTime]
              ? shareDataObj[item.createTime]
              : 0
          }
        })
        rows.reverse()
        this.chartData = {
          columns: ['日期', '展示量', '参与人数', '分享次数'],
          rows
        }

        this.activeData = activeDataVo
      } catch (error) {
        console.log('TCL: _getActiveData -> error', error)
      }
    }
  }
}
</script>
<style>
</style>