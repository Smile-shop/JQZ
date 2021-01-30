<template>
  <div class="gift-set">
    <div class="prompt">
      <span class="prompt-title">中奖概率：</span>
      <br />
      1、抽奖次数：总抽奖次数，例如：设置99次，即抽99次后，第100次才触发中奖概率（若设置抽奖次数，必须设置中奖概率，且概率总和必须小于100%）
      <br />
      2、中奖概率：单位游戏总次数条件下的中奖次数，例如：中奖率6% 即玩100次游戏最多能中奖6次 （也可能中奖0次）
    </div>
    <el-row>
      <el-col :span="24">
        <el-checkbox v-model="isShowPhoto" true-label="1" false-label="0">是否在规则页显示奖品介绍</el-checkbox>
      </el-col>
    </el-row>
    <div class="margin-line">
      <el-row type="flex" align="middle">
        <el-col class="gift-setting">
          <p>奖品设置：</p>
        </el-col>
        <el-col class="gift-addText">
          <el-button type="primary" @click="setGiftLine">添加奖品</el-button>
        </el-col>
        <el-col class="gift-contentText">
          <p class="image-sizeTip">（奖品图片尺寸：225px * 150px，小于50KB）</p>
          <p v-if="redEnvelope" class="case-text">
            <span class="probabilityTotal middleSize">概率总和</span>
            <span :class="totalFre > 100 ? 'input-warring middleSize' : ''">{{totalFre}}%</span>
            <span :class="totalFre > 100 ? 'input-warring middleSize' : ''">(注：中奖概率合计不能大于100%)</span>
          </p>
          <p v-else class="case-text">
            <span class="probabilityTotal middleSize">概率总和</span> 
            <span :class="totalFre > 100 ? 'input-warring middleSize' : 'middleSize'">{{totalFre}} %</span>
            <span :class="totalFre > 100 ? 'input-warring middleSize note' : 'middleSize note'">(注：中奖概率合计不能大于100%)</span>
          </p>
        </el-col>
      </el-row>
    </div>
    <el-row
      :gutter="15"
      type="flex"
      align="middle"
      v-for="(item,index) in giftList"
      :key="index"
      class="margin-line"
    >
      <el-col class="serial">序号:</el-col>
      <el-col class="serial-number">
          <el-input v-model="item.sequence"></el-input>
      </el-col>
      <el-col class="gift-name">
        <el-select v-model="item.jmpGiftCode" @change="selGift(item)">
          <el-option
            v-for="gift in options"
            :key="gift.id"
            :label="gift.shelfName"
            :value="gift.giftCode"
          ></el-option>
        </el-select>
      </el-col>
      <el-col class="gift-num">数量</el-col>
      <el-col class="gift-number">
        <el-input v-model="item.giftNum" disabled></el-input>
      </el-col>
      <el-col class="gift-lottery">抽奖</el-col>
      <el-col class="gift-count">
        <el-input type="number" min="0" max="9999" v-model="item.minDrawNumber" @input="changeCount"></el-input>
      </el-col>
      <el-col class="gift-lottery-num">次触发中奖概率</el-col>
      <el-col class="gift-winning">中奖概率</el-col>
      <el-col class="gift-probability">
        <el-input type="text" min="0" max="100" v-model="item.probability" @input="changeProbability"></el-input>
      </el-col>
      <el-col class="gift-proporition">%</el-col>
      <el-col :class="minDrawNumber ? '' : 'closeCol'" :span="1.5">
        <span>最低次数中奖</span>
      </el-col>
      <el-col :class="minDrawNumber ? '' : 'closeCol'" :span="2">
        <el-input v-model="item.minDrawNumber"></el-input>
      </el-col>
      <el-col :class="minDrawNumber ? '' : 'closeCol'" :span="0.5">
        <span>次</span>
      </el-col>
      <el-col :span="1.5">
        <div class="giftPic">
          <img :src="item.imgName" alt />
        </div>
      </el-col>
      <el-col :span="2.5">
        <el-upload
          :show-file-list="false"
          :headers="uploadHeaders"
          :on-success="(response, file) => {return uploadPicSuccessHandle(response, file, index)}"
          :action="baseURL+'\/jop-marketing-web\/market\/upload'"
        >
          <el-button type="primary">重新上传图片</el-button>
        </el-upload>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-minus" circle @click="deleteGift(index)"></el-button>
      </el-col>
    </el-row>
    <section class="btns">
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </section>
  </div>
</template>

<script>
import user from '@/utils/user'
export default {
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
    },
    redEnvelope: {
      type: Boolean,
      default: () => false
    },
    start: {
      type: Boolean,
      default: () => true
    },
  },
  created() {
    this._getGifts()
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
      options: [],
      value: '',
      giftList: [],
      totalFre: null
    }
  },
  methods: {
    queryJMPGift() {
      const arr = this.options || []
      const len = arr.length
      let result = false
      if (len == 0) {
        this.$message({
          type: 'warning',
          message: '请前往JMP关联奖品'
        })
        result = true
      }
      return result
    },
    setGiftLine() {
      if (this.queryJMPGift())  {
        return
      }
      const giftLineObj = {
        activeId: this.$route.query.id,
        companyKey: user.serverUser.account.companyKey,
        createTime: '',
        creator: '',
        expiration: '',
        giftNum: '',
        id: '',
        imgName: '',
        jmpGiftCode: '',
        margin: '',
        modify: '',
        modifyTime: '',
        minDrawNumber: 0,
        probability: 0,
        productName: '',
        productType: '',
        sequence: this.giftList.length + 1,
        sign: '',
        sumProbability: ''
      }
      if (this.giftList.length < this.lineSize) {
        this.giftList.push(giftLineObj)
      } else {
        this.$notify.warning({
          title: '警告',
          message: `超过可允许添加奖品数量，奖品最多只能添加${this.lineSize}个！`
        })
        return
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
    asyncJMPandJOPName(obj) {
      const o = obj
      const l = o.activePros
      const arr = this.options
      const result = []
      l.map(item => {
        arr.map(ite => {
          if (item.jmpGiftCode === ite.giftCode) {
             item.productName = ite.shelfName
             result.push(item)
          }
        })
      })
      o.activePros = result
      return o
    },
    changeProbability() {
      let result = 0
      const expand = 100
      const list = this.giftList
      list.map(item => {
        if (Number(item.probability)) {
          result += Number(item.probability) * expand
        }
      })
      this.totalFre = (result / expand).toString().includes('.') ? (result / expand).toFixed(2) : (result / expand)
    },
    changeCount(e) {
      if (e.includes('.')) {
        this.$message({
          message: '次数不能填小数',
          type: 'warning'
        });
      }
    },
    checkSetGift() {
      // 检查礼品设置
      const len = this.giftList.length
      let result = false
      if (len === 0) {
        this.$message({
          type: 'warning',
          message: '请添加奖品'
        })
        result = true
      }
      return result
    },
    checkFullPrize() {
      // 检查奖品顶格
      let result = false
      let seat = null
      const max = this.lineSize
      const len = this.giftList.length
      const list = this.giftList
      if (max === len) {
        list.map((item, index) => {
          if ((Number(item.minDrawNumber) === 0) && (Number(item.probability) === 0) && !result) {
            seat = index
            result = false //  false 中奖概率可以为 0， true 中奖概率不可以为 0
          }
        })
      }
      return new Object({prizeMark: result, seat})
    },
    mustIncludesZero() {
      let result = false
      const mark = 0
      const max = this.lineSize
      const len = this.giftList.length
      const list = this.giftList
      if (max == len) {
        result = true
        list.map((item) => {
          if (item.minDrawNumber == 0) {
             result = false
          }
        })
      }

      return result
    },
    mustIncludesGift() {
      let result = false
      const mark = 0
      const max = this.lineSize
      const len = this.giftList.length
      const list = this.giftList
      const cache = []
      if (max == len) {
        list.map((item) => {
          if ((Number(item.minDrawNumber) != mark)) {
            cache.push(item.minDrawNumber)
          }
        })
        list.map((item) => {
          console.log(item.probability)
          if ((Number(item.probability) == mark) && (cache.length > mark)) {
            result = true
          }
        })
      }

      return result
    },
    async onSubmit() {
      if (this.checkSetGift()) {
        return
      }
      const {prizeMark, seat} = this.checkFullPrize()
      if (prizeMark) {
        this.$notify.warning({
            title: '校验失败',
            message: `第${seat + 1}行中奖概率不能为0`
      })
        return
      }
      if (this.mustIncludesZero()) {
        this.$notify.warning({
            title: '校验失败',
            message: `必须有一个抽奖次数为 0`
        })
        return
      }
      if (this.mustIncludesGift()) {
        this.$notify.warning({
            title: '校验失败',
            message: `中奖概率设置为0后，抽奖次数需设置为0`
        })
        return
      }
      try {
        const gifts = {
          invalidImg:
            'http://www.jqzjop.com/ftp_images/01/market/f02d18e50ff54c2f.jpg',
          isShowPhoto: this.isShowPhoto,
          activeId: this.$route.query.id
        }
        gifts.activePros = this.giftList

        let result = 0
        if (this.giftList.length) {
          try {
            this.giftList.forEach((item, index) => {
              if (Number(item.probability) >= 0) {
                result = (result + (Number(item.probability) * 100))
              } else {
                throw new Error(
                  `请检查第${index + 1}行输入的中奖概率不合法！`
                )
              }

              if (!item.imgName) {
                throw new Error(`请检查第${index + 1}行是否有礼品图片！`)
              }
            })
          } catch (error) {
            this.$notify.warning({
              title: '校验失败',
              message: error.message
            })
            return
          }
        }
        result = result / 100

        if (this.giftList.length) {
          try {
            this.giftList.forEach((item, index) => {
              if (item.minDrawNumber && item.minDrawNumber.toString().includes('.')) {
                throw new Error(
                  `请检查第${index + 1}行输入的抽奖次数是否有小数！`
                )
              } else if (item.minDrawNumber < 0) {
                throw new Error(
                  `请检查第${index + 1}行输入的抽奖次数超过最小值0！`
                )
              } else if (item.minDrawNumber > 9999) {
                throw new Error(
                  `请检查第${index + 1}行输入的抽奖次数超过最大值9999！`
                )
              }
            })
          } catch (error) {
            this.$notify.warning({
              title: '校验失败',
              message: error.message
            })
            return
          }
        }

        //  检测必须抽奖次数为 0 有一个
        const miniMark = []
        if (this.giftList.length) {
          this.giftList.forEach((item) => {
            if (item.minDrawNumber == 0) {
              miniMark.push(item.minDrawNumber)
            }
          })
        }

        if ((miniMark.length === 0) && (this.giftList.length > 0) && this.start) {
          try {
            throw new Error(`请检查输入的抽奖次数必须有0次！`)
          } catch (error) {
            this.$notify.warning({
              title: '校验失败',
              message: error.message
            })
            return
          }
        }

        // 检测有设置次数必须有概率
        if (this.giftList.length) {
          try {
            this.giftList.forEach((item, index) => {
              if ((item.minDrawNumber != 0) && (item.probability == 0)) {
                throw new Error(`请检查${index + 1}行设置中奖概率不能为0`)
              } else if ((item.probability.toString().includes('.')) && (item.probability.toString().split('.')[1].length >= 3)) {
                throw new Error(`请检查${index + 1}行设置中奖概率只能有两位小数`)
              }
            })
          } catch (error) {
            this.$notify.warning({
              title: '校验失败',
              message: error.message
            })
            return
          }
        }

        // 检测选奖品
        if (this.giftList.length) {
          try {
            this.giftList.forEach((item, index) => {
              if ((!item.jmpGiftCode) && (!item.productName)) {
                 throw new Error(`请检查${index + 1}行选择奖品`)
              }
            })
          } catch (error) {
            this.$notify.warning({
              title: '校验失败',
              message: error.message
            })
            return
          }
        }

        // 又可以设置小于 100%
        if (
          this.giftList.length === this.lineSize &&
          !(this.lineSize === Infinity)
        ) {
          if (result < 100) {
            this.$notify.warning({
              title: '校验失败',
              message: '所有的中奖概率总和需要设置为100%，请修改后再试！'
            })
            return
          }
        }

        if (result <= 0) {
          this.$notify.warning({
            title: '校验失败',
            message: '中奖概率不能为0，请修改后再试！'
          })
          return
        }

        if (result > 100) {
          this.$notify.warning({
            title: '校验失败',
            message: '所有的中奖概率总和不能大于100%，请修改后再试！'
          })
          return
        }

        const saveData = this.asyncJMPandJOPName(gifts)
        const { code, msg } = await this.initDataFuncObj.productsSave(saveData)
        if (code === 0) {
          this.$message.success(msg)
          this._getGifts()
        }
      } catch (error) {
        console.log('TCL: onSubmit -> error', error)
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
      this.giftList = giftList.activePros
      this.isShowPhoto = giftList.isShowPhoto

      let totalPro = 0
      const expand = 100
      this.giftList.forEach(item => {
        if (Number(item.probability)) {
          totalPro += Number(item.probability) * 100
        }
      })

      this.totalFre = (totalPro / expand).toString().includes('.') ? (totalPro / expand).toFixed(2) : (totalPro / expand)

      const { data } = await this.initDataFuncObj.queryActiveAndJmpGift(options)
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
.gift-set .margin-line input.el-input__inner {
  text-align: center;
}

.gift-set {
  .gift-setting {
    display: inline-block;
    width: 70px;
  }
  .gift-addText {
    display: inline-block;
    width: 100px;
  }
  .gift-contentText {
    display: inline-block;
    width: 1200px;
    height: 50px;
    line-height: 50px;
  }
  .image-sizeTip {
    display: inline-block;
    width: 300px;
  }
  .case-text {
    display: inline-block;
    margin-left: 320px;
  }
  .probabilityTotal {
    margin-right: 30px;
  }
  .input-warring {
    color: #ff0000;
  }
  .middleSize {
    font-size: 16px;
    font-weight: bold;
  }
  .note {
    margin-left: 30px;
  }
  .closeCol {
    display: none;
  }
  .prompt {
    width: 1100px;
    height: 80px;
    line-height: 24px;
    background-color: #f3f3f3;
    border-radius: 4px;
    padding-left: 10px;
    font-size: 14px;
    .prompt-title {
      font-weight: bold;
    }
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
  .serial {
    display: inline-block;
    width: 60px;
  }
  .serial-number {
    display: inline-block;
    width: 80px;
  }
  .gift-name {
    display: inline-block;
    width: 150px;
  }
  .gift-num {
    display: inline-block;
    width: 60px;
    text-align: right;
  }
  .gift-number {
    display: inline-block;
    width: 120px;
  }
  .gift-count {
    display: inline-block;
    width: 120px;
  }
  .gift-probability {
    display: inline-block;
    width: 100px;
  }
  .gift-lottery {
    display: inline-block;
    width: 60px;
    text-align: right;
  }
  .gift-winning {
    display: inline-block;
    width: 80px;
    text-align: right;
  }
  .gift-lottery-num {
    display: inline-block;
    width: 120px;
  }
  .gift-proporition {
    display: inline-block;
    width: 60px;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      -webkit-appearance: none;
  }
  input[type='number']{
      -moz-appearance: textfield;
  }
}
</style>
