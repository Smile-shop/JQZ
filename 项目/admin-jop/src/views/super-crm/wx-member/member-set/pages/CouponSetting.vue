<template>
  <section>
    <el-form ref="form" class="form-content" :model="couponSetting">
      <el-form-item>
        <el-radio-group v-model="couponSetting.isAll" @change="setCouponSettings">
          <div style="margin-top:15px">
            <el-radio label="0">只展示所属门店优惠券</el-radio>
          </div>
          <div style="margin-top:30px">
            <el-radio label="1">展示全部优惠券</el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getCouponSettings, setCouponSettings } from '@/api/super-crm/wx-member'

@Component({})
export default class HomeModule extends Vue {
  private couponSetting = {
    isAll: '0'
  }
  private mounted() {
    this.getCouponSettings();
  }
  private getCouponSettings() {
    getCouponSettings().then(res => {
      this.couponSetting.isAll = res.data.isAll || '0';
    })
  }
  private setCouponSettings() {
    const params = {
      isAll: this.couponSetting.isAll
    }
    setCouponSettings(params).then(res => {
      this.$message({
        message: '保存成功！',
        type: 'success'
      })
    })
  }
}
</script>