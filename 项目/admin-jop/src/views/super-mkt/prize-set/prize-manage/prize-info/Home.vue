<template>
  <div class="prize-info-home">
    <form-bar>
      <el-form v-model="formData" :inline="true" class="demo-form-inline">
        <el-form-item label="奖品名称">
          <el-input v-model="formData.awardName"></el-input>
        </el-form-item>
        <el-form-item label="奖品类型">
          <el-select v-model="formData.awardType">
            <el-option
              v-for="(item, index) of awardTypeList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动大类">
          <el-select v-model="formData.activityType">
            <el-option
              v-for="(item, index) of activityTypeList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="营销活动">
          <el-select v-model="formData.activityName">
            <el-option
              v-for="(item, index) of activityNameList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getQiftManaList">查询</el-button>
        </el-form-item>
      </el-form>
    </form-bar>

    <app-gutter />

    <el-table :data="awardList" border>
      <el-table-column prop="giftCode" label="编号" width="100"></el-table-column>
      <el-table-column prop="activeName" label="营销活动" width="180"></el-table-column>
      <el-table-column label="奖品图" width="150">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="imagesUrl({
              path: '/jop-wx-web/op/showimage',
              name: scope.row.picList[0],
              alias: scope.row.shelfProductType === '1' ? 'Gift' : scope.row.shelfProductType === '2' ? 'Coupon' : scope.row.shelfProductType === '3' ? 'Integral' : ''
            })"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="shelfName" label="奖品名称" width="180"></el-table-column>
      <el-table-column prop="productType" label="奖品类型" width="120"></el-table-column>
      <el-table-column prop="giftPrice" label="价值" width="120"></el-table-column>
      <el-table-column prop="giftNum" label="奖品数量" width="120"></el-table-column>
      <el-table-column label="上架时间" width="180">
        <template slot-scope="scope">{{scope.row.onShelfTime | momentFilter}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-setting" size="small" @click="toPage('edit', scope.row)">编辑</el-button>
          <el-button icon="el-icon-tickets" size="small" @click="toPage('detail', scope.row)">明细</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Message } from 'element-ui'
import {
  getGiftType,
  getActivityType,
  getActivityNameList,
  getQiftManaList
} from '@/api/super-mkt/prize-set/prize-info'
import AppGutter from '@/components/AppGutter.vue'
import FormBar from '@/components/FormBar.vue'
import { imagesUrl } from '@/utils/imageUrl'

@Component({
  components: {
    AppGutter,
    FormBar
  }
})
export default class PrizeSetPrizeManagePrizeInfoHome extends Vue {
  // 表单数据
  formData = {
    // 奖品名称
    awardName: '',
    // 奖品类型
    awardType: '',
    // 活动类型
    activityType: '',
    // 活动名称
    activityName: ''
  }
  // 奖品类型列表
  awardTypeList: any[] = []
  // 活动大类列表
  activityTypeList: any[] = []
  // 活动名称列表
  activityNameList: any[] = []
  // 奖品列表
  awardList: any[] = []

  imagesUrl = imagesUrl

  mounted() {
    // 查询活动大类列表
    this.getActivityType().then((res: any) => {
      Promise.all([
        // 查询活动名称列表
        this.getActivityNameList(),
        // 查询奖品类型列表
        this.getGiftType()
      ]).then((res: any) => {
        // 查询奖品列表
        this.getQiftManaList()
      })
    })
  }

  toPage(page: string, item: any) {
    switch (page) {
      case 'edit':
        this.$router.push({
          path: '/super-mkt/prize-set/prize-manage/prize-info/edit',
          query: {
            type: 'edit',
            id: item.id,
            activeName: item.activeName,
            giftCode: item.giftCode,
            activeClz: item.activeClz,
            jmpId: item.jmpId
          }
        })
        break
      case 'detail':
        this.$router.push({
          path: '/super-mkt/prize-set/prize-manage/prize-info/edit',
          query: {
            type: 'detail',
            id: item.id,
            activeName: item.activeName,
            giftCode: item.giftCode,
            activeClz: item.activeClz,
            jmpId: item.jmpId
          }
        })
        break
      default:
        break
    }
  }

  // 查询奖品类型列表
  getGiftType() {
    return new Promise((resolve, reject) => {
      const body = {}

      getGiftType(body)
        .then((res: any) => {
          const { data } = res

          if (data.length) {
            data.unshift('全部')
            this.awardTypeList = data
            this.formData.awardType = data[0]
          }

          resolve(res)
        })
        .catch((reason: any) => {
          reject(reason)
        })
    })
  }

  // 查询活动大类列表
  getActivityType() {
    return new Promise((resolve, reject) => {
      const body = {}

      getActivityType(body)
        .then((res: any) => {
          const { data } = res

          if (data.length) {
            data.unshift('全部')
            this.activityTypeList = data
            this.formData.activityType = data[0]
          }

          resolve(res)
        })
        .catch((reason: any) => {
          reject(reason)
        })
    })
  }

  // 查询活动名称列表
  getActivityNameList() {
    return new Promise((resolve, reject) => {
      const body = {
        activeClz:
          this.formData.activityType === '全部'
            ? ''
            : this.formData.activityType
      }

      getActivityNameList(body)
        .then((res: any) => {
          const { data } = res

          if (data.length) {
            data.unshift('全部')
            this.activityNameList = data
            this.formData.activityName = data[0]
          }

          resolve(res)
        })
        .catch((reason: any) => {
          reject(reason)
        })
    })
  }

  // 查询奖品列表
  getQiftManaList() {
    return new Promise((resolve, reject) => {
      const body = {
        activeClz:
          this.formData.activityType === '全部'
            ? ''
            : this.formData.activityType,
        activeName:
          this.formData.activityName === '全部'
            ? ''
            : this.formData.activityName,
        shelfName: this.formData.awardName,
        productType:
          this.formData.awardType === '全部' ? '' : this.formData.awardType
      }

      getQiftManaList(body)
        .then((res: any) => {
          const { data } = res

          this.awardList = data

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


