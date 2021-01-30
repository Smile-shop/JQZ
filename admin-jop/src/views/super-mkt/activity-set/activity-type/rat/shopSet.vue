<template>
  <div class="StroeSet">
    <div class="title">*参与门店：</div>
    <div class="item-list">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-checkbox class="diy-checkbox" v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="submit">
      <button @click="submitStoreSet" :class="{'disable': isJmpGift == 1}">提交</button>
    </div>
  </div>
</template>
<script>
import { queryShopList, updateShops } from '@/api/super-mkt/activity-set/nine'
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      activeId: '',
      dataList: [],
      checkAll: false,
      checkedCities: [],
      cities: [],
      isIndeterminate: true
    }
  },
  computed: {
    ...mapState({
      singleActiveData: state => state.nines.singleActiveData,
      isJmpGift: state => state.nines.isJmpGift
    })
  },
  methods: {
    // 提交表单成功时，改变tabs选中状态
    changetab() {
      this.$emit('changetabName', 'fourth')
    },
    checkAry(data) {
      this.checkedCities = []
      data.forEach(val => {
        this.cities.push(val.shopName)
        if (val.isChecked == '1') {
          this.checkedCities.push(val.shopName)
        }
      })
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.cities : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length
    },
    submitStoreSet() {
      if (this.isJmpGift == 1) {
        return false
      } else {
        if (this.checkedCities == '') {
          this.$message({
            type: 'warning',
            message: '请选择门店！'
          })
        } else {
          updateShops({
            activeId: this.activeId,
            designatedStore: this.checkedCities.join(',')
          })
            .then(res => {
              this.$message({
                type: 'success',
                message: res.msg || '提交成功!'
              })
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err || '提交失败!'
              })
            })
        }
      }
    }
  },
  created() {
    this.activeId =
      this.$route.query.id ||
      this.singleActiveData.id ||
      this.singleActiveData.activeId
    queryShopList({ activeId: this.activeId }).then(res => {
      const { data, code, msg } = res
      if (code == 0) {
        this.dataList = data.map(val => {
          return {
            shopName: val.shopName,
            isChecked: val.isChecked,
            shopId: val.shopId
          }
        })
        this.checkAry(this.dataList)
      }
    })
  }
}
</script>
<style lang='scss' scoped>
.StroeSet {
  .diy-checkbox {
    width: 250px;
  }
  .submit {
    background: #f5f7fa;
    text-align: center;
    width: 100%;
    padding: 8px 0;
    margin-top: 45px;

    & > button {
      width: 98px;
      height: 40px;
      background: #409eff;
      border-radius: 5px;
      font-size: 14px;
      color: #fff;
      border: none;
    }
    .disable {
      background: #ddd;
    }
  }
}
</style>