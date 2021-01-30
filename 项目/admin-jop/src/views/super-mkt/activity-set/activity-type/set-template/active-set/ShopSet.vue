<template>
  <div class="shop-set">
    <h6>参与门店</h6>
    <section class="margin-line">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkeds" @change="handleCheckedShopsChange">
        <el-checkbox
          class="diy-checkbox"
          v-for="shop in allShop"
          :label="shop.shopName"
          :key="shop.shopId"
        >{{shop.shopName}}</el-checkbox>
      </el-checkbox-group>
    </section>
    <div class="btns">
      <el-button v-if="relatedJMP" type="primary" @click="onSubmit">保存</el-button>
      <el-button v-else type="info" >保存</el-button>
      <span v-show="!relatedJMP" class="infoTip">请先前往 JMP 关联奖品</span>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    initDataFuncObj() {
      return { ...this.getDataFunc }
    }
  },
  props: {
    getDataFunc: {
      type: Object
    },
    relatedJMP: {
      type: Boolean
    }
  },
  data() {
    return {
      checkAll: false,
      checkeds: [],
      isIndeterminate: true,
      allShop: []
    }
  },
  created() {
    this._getAllShop()
  },
  methods: {
    queryJMPRelated() {
      return this.relatedJMP
    },
    tipJMP() {
      this.$message({
        type: 'warning',
        message: '请前往JMP关联奖品'
      })
    },
    checkRelated() {
      let result = false
      if (!this.queryJMPRelated()) {
        this.tipJMP()
        result = true
      }
      return result
    },
    async onSubmit() {
      if (this.checkRelated()) {
        return
      }
      try {
        const options = {
          activeId: this.$route.query.id,
          designatedStore: this.checkeds.join(',')
        }

        const { msg } = await this.initDataFuncObj.updateShops(options)
        this.$message.success(msg)
        this._getAllShop()
      } catch (error) {
        console.log('TCL: onSubmit -> error', error)
        this.$message.error(error)
        this._getAllShop()
      }
    },
    handleCheckAllChange(val) {
      if (this.checkRelated()) {
        return
      }
      this.checkeds = val ? [...this.allShop.map(item => item.shopName)] : []
      this.isIndeterminate = false
    },
    handleCheckedShopsChange(value) {
      if (this.checkRelated()) {
        return
      }
      const checkedCount = value.length
      this.checkAll = checkedCount === this.allShop.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.allShop.length
    },
    async _getAllShop(
      options = {
        activeId: this.$route.query.id
      }
    ) {
      const { data } = await this.initDataFuncObj.queryShopList(options)
      data.forEach(shop => {
        shop.isChecked = shop.isChecked ? shop.isChecked : '0'
      })

      this.allShop = data
      this.checkeds = this.allShop
        .filter(item => item.isChecked === '1')
        .map(item => item.shopName)
    }
  }
}
</script>
<style lang='scss' scoped>
.shop-set {
  .margin-line {
    margin: 15px 0;
  }
  .btns {
    padding: 15px 0;
    background-color: #eeeeee;
    text-align: center;
  }
  .diy-checkbox {
    width: 250px;
  }
  .infoTip {
    margin-left: 20px;
    color: #f00;
  }
}
</style>
