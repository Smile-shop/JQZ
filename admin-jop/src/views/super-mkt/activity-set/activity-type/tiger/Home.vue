<template>
  <div class="home-root">
    <Home
      :activityPage="activityPage"
      :dataViewPage="dataViewPage"
      :dataList="tableData"
      :setPage="setPage"
      @isOpenGame="isOpenGame"
      @deleteGame="deleteGame"
      @updateTab="handleUpdate"
    ></Home>
  </div>
</template>
 
<script>
import {
  queryActiveList,
  updatePaused,
  gameActiveDel
} from '@/api/super-mkt/activity-set/tiger'
import Home from '../set-template/Home'
export default {
  created() {
    this._getDataList()
  },
  components: {
    Home
  },
  data() {
    return {
      tableData: [],
      activityPage: '/super-mkt/activity-set/activity-type/tiger/add',
      dataViewPage: '/super-mkt/activity-set/activity-type/tiger/viewdata',
      setPage: '/super-mkt/activity-set/activity-type/tiger/edit'
    }
  },
  methods: {
    async deleteGame(options) {
      try {
        const { id } = options
        const { msg } = await gameActiveDel({ id })
        this.$message.success(msg)
        this._getDataList()
      } catch (error) {
        console.log('TCL: isOpenGame -> error', error)
        this._getDataList()
      }
    },
    handleUpdate() {
      this._getDataList()
    },
    async isOpenGame(options) {
      try {
        const { id, isPaused } = options
        const { msg } = await updatePaused({
          activeId: id,
          isPaused
        })
        this.$message.success(msg)
        this._getDataList()
      } catch (error) {
        console.log('TCL: isOpenGame -> error', error)
        this._getDataList()
      }
    },
    async _getDataList() {
      const options = {
        parentActive: '老虎机'
      }
      const { data } = await queryActiveList(options)
      this.tableData = data
    }
  }
}
</script>

<style>
</style>
