<template>
  <div class="rat-gift-set">
    <div class="prompt">
      <p>奖品设置说明：</p>
      <p>1、1秒大概可以点击8-12次，8-12秒可以点击100次（100米），请合理设置奖品距离</p>
      <p>2、奖品设定只获得单份，以最终距离的奖品发放，比如：用户达到50米，也达到了100米，只能获得100米的奖品</p>
    </div>
    <el-row>
      <el-col :span="24">
        <el-checkbox v-model="isShowPhoto" true-label="1" false-label="0">是否在规则页显示奖品介绍</el-checkbox>
      </el-col>
    </el-row>
    <div class="margin-line">
      <el-row type="flex" align="middle">
        <el-col :span="2.5">
          <p>奖品设置：</p>
        </el-col>
        <el-col :span="2.5">
          <el-button size="mini" type="primary" @click="setKudo">+ 添加奖品</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table :data="kudo" style="width: 60%">
      <el-table-column label="序号">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发放范围">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ distanceUnit(scope.row.prizeDistance)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖品名称">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖品数量">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.giftNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖品图片">
        <template slot-scope="scope">
          <span style="margin-left: 10px;">
            <img :src="scope.row.imgName" alt />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="超库存发放" width="120">
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
            :class="scope.row.exceedStock === '1' ? 'open': '' "
          >{{ scope.row.exceedStock === '1' ? '开启' : '未设置'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存预警">
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
            :class="scope.row.stockAlarm > 0 ? 'open': '' "
          >{{ scope.row.stockAlarm > 0 ? '开启' : '未设置' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delKudoIndex(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="margin-line">
      <el-row type="flex" align="middle">
        <el-col :span="2.5">
          <p>安慰奖品设置：</p>
        </el-col>
        <el-col :span="2.5">
          <el-button size="mini" type="primary" @click="setConfort">+ 添加奖品</el-button>
        </el-col>
      </el-row>
      <p class="confort">注：添加后用户未到达奖品线都可获得安慰奖品，若用户达到奖品线则不获得该奖品</p>
    </div>
    <el-table :data="confort" style="width: 50%">
      <el-table-column label="奖品名称">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖品数量">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.giftNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖品图片">
        <template slot-scope="scope">
          <span style="margin-left: 10px;">
            <img :src="scope.row.imgName" alt />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="超库存发放" width="120">
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
            :class="scope.row.exceedStock === '1' ? 'open': '' "
          >{{ scope.row.exceedStock === '1' ? '开启' : '未设置' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存预警">
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
            :class="scope.row.stockAlarm > 0 ? 'open': '' "
          >{{scope.row.stockAlarm > 0 ? '开启' : '未设置' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEditConfort(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <section class="btns">
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </section>
    <dialog-form
      :distance="distance"
      :selectedDistance="selectedExtend"
      :consistency="dialog"
      :removing="confortHide"
      :giftData="setRowGift"
      :jmpGift="jmpGift"
      @closeDialog="closeDialog"
      @sureIndexGift="setIndexGift"
    />
  </div>
</template>

<script>
import user from '@/utils/user'
import DialogForm from './DialogForm'

const COMFORTPRIZE = '1' // 安慰奖
const UNCOMFORTPRIZE = '0' // 正常奖

export default {
  components: {
    DialogForm
  },
  computed: {
    initDataFuncObj() {
      return { ...this.getDataFunc }
    }
  },
  props: {
    lineSize: {
      type: Number,
      default: Infinity
    },
    getDataFunc: {
      type: Object
    },
    minDrawNumber: {
      type: Boolean,
      default: () => false
    }
  },
  created() {
    this._getGifts()
    this.initDistance(20)
  },
  data() {
    return {
      baseURL: VUE_APP_BASE_API,
      uploadHeaders: {
        ticket: user.serverUser.ticket,
        companyKey: user.serverUser.account.companyKey,
        accountId: user.serverUser.account.accountId
      },
      isShowPhoto: '0',
      selectedExtend: [],
      distance: [], // 距离
      options: [],
      value: '',
      dialog: false,
      giftList: [],
      unit: '米', // 单位
      jmpGift: [], // jmp 设置的奖品
      confort: [], // 安慰奖
      kudo: [], // 奖品
      confortHide: true, // 安慰奖不显示距离
      setRowGift: {
        data: {}, // 数据
        row: '' // 行
      } // 设置的礼品
    }
  },
  methods: {
    initDistance(len) {
      let result = ''
      const arr = []
      const unit = '米'
      const flag = 50
      for (let i = 1; i <= len; i++) {
        result = ''
        result += flag * i + unit
        const options = {
          value: result,
          label: result
        }
        arr.push(options)
      }
      this.distance = arr
    },
    distanceUnit(item) {
      let result = null
      const flag = String(item)
      const uni = this.unit
      if (flag.includes(uni)) {
        result = flag
      } else {
        result = flag + uni
      }

      return result
    },
    formatDistance() {
      const kudo = this.kudo.map(item => {
        let result = null
        const distance = String(item.prizeDistance)
        const unit = '米'
        if (distance.includes(unit)) {
          result = Number(item.prizeDistance.split(unit)[0])
        } else {
          result = Number(distance)
        }

        return result
      })
      const options = this.distance.map(item => {
        const value = Number(item.value.split('米')[0])
        if (kudo.includes(value)) {
          item.disabled = true
        } else {
          item.disabled = false
        }
        return item
      })

      this.distance = options
    },
    getExtend(item) {
      if (!this.selectedExtend.includes(item)) {
        this.selectedExtend.push(item)
      }
    },
    handleEditConfort(row, item) {
      const exceedStock = item.exceedStock
      const flag = String(item.prizeDistance)
      const prizeDistance = flag ? flag + '米' : ''
      item.exceedStock = exceedStock
      item.prizeDistance = prizeDistance
      this.setRowGift = {
        data: item,
        row,
        edit: true
      }
      this.confortHide = false
      this.dialog = true
    },
    handleEdit(row, item) {
      const exceedStock = item.exceedStock
      const flag = String(item.prizeDistance)
      const prizeDistance = flag ? flag + '米' : ''
      item.exceedStock = exceedStock
      item.prizeDistance = prizeDistance
      this.setRowGift = {
        data: item,
        row,
        edit: true
      }
      this.confortHide = true
      this.dialog = true
      this.formatDistance() // 置灰已选中
    },
    setIndexGift(item) {
      const conf = item.comfortPrize
      if (conf === COMFORTPRIZE) {
        this.confortSet(item)
      } else {
        this.naturalSet(item)
      }
    },
    confortSet(item) {
      if (!item.edit) {
        this.confort.push(item)
      }
      const index = item.sequence
      this.confort.splice(index, 1, item)
    },
    naturalSet(item) {
      if (!item.edit) {
        this.kudo.push(item)
        return
      }
      const index = item.sequence
      this.kudo.splice(index, 1, item)
    },
    closeDialog() {
      this.dialog = false
    },
    sendChild(ele, row, data) {
      this.setRowGift = {
        key: ele,
        row,
        data
      }
    },
    // 检测 JMP 关联奖品
    checkJMPGift() {
      const gift = this.jmpGift || []
      const len = gift.length
      let result = false
      if (len === 0) {
        this.$message({
          type: 'warning',
          message: '请前往JMP关联奖品'
        })
        result = true
      }
      return result
    },
    // 添加跑道奖品
    setKudo() {
      if (this.checkJMPGift()) {
        return
      }
      const baseGift = {
        sequence: '',
        productName: '',
        probability: '',
        giftNum: '',
        productType: '',
        imgName: '',
        jmpGiftCode: '',
        prizeDistance: '',
        exceedStock: '',
        comfortPrize: '',
        stockAlarm: ''
      }
      baseGift.comfortPrize = UNCOMFORTPRIZE
      const options = baseGift
      if (this.kudo.length < this.lineSize) {
        this.sendChild('add', null, options)
        this.dialog = true
        this.confortHide = true
        this.formatDistance() // 置灰掉一些距离
      } else {
        this.$notify.warning({
          title: '注意',
          message: `已达奖品上限，无法添加奖品`
        })
      }
    },
    delKudoIndex(row) {
      this.kudo.splice(row, 1)
    },
    handleDelete() {
      this.confort = []
    },
    // 添加安慰奖
    setConfort() {
      if (this.checkJMPGift()) {
        return
      }
      const baseGift = {
        sequence: '',
        productName: '',
        probability: '',
        giftNum: '',
        productType: '',
        imgName: '',
        jmpGiftCode: '',
        prizeDistance: '',
        exceedStock: '',
        comfortPrize: '',
        stockAlarm: ''
      }
      baseGift.comfortPrize = COMFORTPRIZE
      const options = baseGift
      if (this.confort.length < 1) {
        this.sendChild('add', null, options)
        this.dialog = true
        this.confortHide = false
      } else {
        this.$notify.warning({
          title: '注意',
          message: `已达安慰奖品上限，无法添加奖品`
        })
      }
    },
    selGift(gift) {
      this.options.forEach(item => {
        if (gift.jmpGiftCode === item.giftCode) {
          gift.giftNum = item.giftNum
          gift.productName = item.shelfName
          gift.productType = item.shelfProductType
        }
      })
    },
    async onSubmit() {
      try {
        const gifts = {
          invalidImg:
            'http://www.jqzjop.com/ftp_images/01/market/f02d18e50ff54c2f.jpg',
          isShowPhoto: this.isShowPhoto,
          activeId: this.$route.query.id
        }

        let verfiy = true

        if (this.kudo.length > 0) {
          for (let i = 0; i < this.kudo.length; i++) {
            if (!this.kudo[i].imgName) {
              this.$notify.warning({
                title: '校验失败',
                message: `请检查第${i + 1}行是否有礼品图片！`
              })
              verfiy = false
              return
            }
            if (!this.kudo[i].prizeDistance) {
              this.$notify.warning({
                title: '校验失败',
                message: `请检查第${i + 1}行是否有发放范围！`
              })
              verfiy = false
              return
            }
            if (!this.kudo[i].productName) {
              this.$notify.warning({
                title: '校验失败',
                message: `请检查第${i + 1}行是否有奖品名称！`
              })
              verfiy = false
              return
            }
            if (
              !Number(this.kudo[i].stockAlarm) &&
              Number(this.kudo[i].stockAlarm) !== 0
            ) {
              this.$notify.warning({
                title: '校验失败',
                message: `请检查第${i +
                  1}行库存预警，请设置为数字并且大于等于0！`
              })
              verfiy = false
              return
            }
            if (Number(this.kudo[i].stockAlarm) < 0) {
              this.$notify.warning({
                title: '校验失败',
                message: `请检查第${i +
                  1}行库存预警，请设置为数字并且大于等于0！`
              })
              verfiy = false
              return
            }
          }
        }

        if (!verfiy) {
          return
        }

        if (this.confort[0] && !this.confort[0].imgName) {
          this.$notify.warning({
            title: '校验失败',
            message: '请上传安慰奖图片'
          })
          return
        }
        if (this.confort[0] && !this.confort[0].productName) {
          this.$notify.warning({
            title: '校验失败',
            message: '请选择安慰奖奖品'
          })
          return
        }

        const allGift = this.kudo.concat(this.confort)
        gifts.activePros = allGift

        if (allGift.length === 0) {
          this.$notify.warning({
            title: '校验失败',
            message: '至少设定1个奖品'
          })
          return
        }

        const { code, msg } = await this.initDataFuncObj.productsSave(gifts)
        if (code === 0) {
          this.$message.success(msg)
          this.kudo = []
          this.confort = []
          this._getGifts()
        }
      } catch (error) {
        console.log('TCL: onSubmit -> error', error)
        this.kudo = []
        this.confort = []
        this._getGifts()
      }
    },
    uploadPicSuccessHandle(response, file, index) {
      const { code, data } = response
      if (code === '0' && data.length) {
        this.giftList[index].imgName = data[0]
      }
    },
    deleteGift(index) {
      this.giftList.splice(index, 1)
    },
    async _getGifts(
      options = {
        activityName: this.$route.query.name,
        activeId: this.$route.query.id
      }
    ) {
      const { data: giftList } = await this.initDataFuncObj.queryProducts(
        options
      )
      const len = giftList.activePros.length
      if (len) {
        giftList.activePros.map(item => {
          if (item.comfortPrize === COMFORTPRIZE) {
            this.confort.push(item)
          } else {
            this.getExtend(item.prizeDistance)
            this.kudo.push(item)
          }
        })
      }

      this.giftList = giftList.activePros
      this.isShowPhoto = giftList.isShowPhoto

      const { data } = await this.initDataFuncObj.queryActiveAndJmpGift(options)

      this.jmpGift = data || []
      this.giftList.forEach(item1 => {
        data.forEach(item2 => {
          if (item1.jmpGiftCode === item2.giftCode) {
            item1.giftNum = item2.giftNum
          }
        })
      })

      this.$emit('initGiftList', this.giftList)

      this.options = data
    }
  }
}
</script>

<style lang='scss'>
.rat-gift-set .margin-line input.el-input__inner {
  text-align: center;
}

.rat-gift-set {
  .closeCol {
    display: none;
  }
  .prompt {
    width: 952px;
    height: 70px;
    line-height: 20px;
    border-radius: 4px;
    font-size: 14px;
  }

  .margin-line {
    margin: 15px 0;
  }

  .giftPic {
    width: 50px;
    height: 50px;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .confort {
    margin-top: 10px;
  }

  .open {
    color: #02a7f0;
  }
}
</style>
