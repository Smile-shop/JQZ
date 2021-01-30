<template>
  <div class="rat-form">
    <el-dialog title="新增奖品" :visible="consistency" @close="closeDialog" center>
      <el-form :model="form">
        <el-form-item v-if="giftDataImg" label="奖品图片有" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            list-type="picture"
            :file-list="fileList"
            :before-upload="beforeAvatarUpload"
            :headers="uploadHeaders"
            :action="baseURL+'\/jop-marketing-web\/market\/upload'"
            :multiple="false"
            :on-success="(response, file) => uploadPicSuccessHandle(response, file, [...fileList[0]])"
            :limit="1"
          >
            <el-button size="small" type="primary">上传图片</el-button>
            <span slot="tip" class="el-upload__tip">最佳尺寸：250px*250px 奖品规格小于250KB</span>
          </el-upload>
        </el-form-item>
        <el-form-item v-else label="奖品图片无" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            :before-upload="beforeAvatarUpload"
            :headers="uploadHeaders"
            :action="baseURL+'\/jop-marketing-web\/market\/upload'"
            :multiple="false"
            :on-success="(response, file) => uploadPicSuccessHandle(response, file, [...fileList[0]])"
            :limit="1"
          >
            <el-button size="small" type="primary">上传图片</el-button>
            <span slot="tip" class="el-upload__tip">最佳尺寸：250px*250px 奖品规格小于250KB</span>
          </el-upload>
        </el-form-item>

        <el-form-item label="奖品名称" :label-width="formLabelWidth">
          <el-select v-model="giftData.data.productName" placeholder="请选择">
            <el-option
              v-for="item in jmpGift"
              :key="item.id"
              :label="item.shelfName"
              :value="item.shelfName"
            ></el-option>
          </el-select>
          <el-button type="info" style="margin-left: 10px">{{giftNum}}</el-button>
        </el-form-item>
        <el-form-item v-show="removing" label="发放范围" :label-width="formLabelWidth">
          <el-select v-model="giftData.data.prizeDistance" placeholder="请选择">
            <el-option
              v-for="item in distance"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
          <p
            style="font-size: 12px; line-height: 20px; margin-top: 10px;"
          >注：只能获得单份奖品，以最终距离的奖品发放，比如：用户达到50米，也达到了100米，只能获得100米的奖品</p>
        </el-form-item>
        <el-form-item label="超库存发放" :label-width="formLabelWidth">
          <el-checkbox
            @change="changOver"
            v-model="giftData.data.exceedStock"
            true-label="1"
            false-label="0"
          >开启</el-checkbox>
          <p
            style="font-size: 12px; line-height: 20px; margin-top: 10px;"
          >开启后可以解决无库存情况下继续运行游戏，但要确保线下礼品库存充足。</p>
        </el-form-item>
        <el-form-item label="库存预警" :label-width="formLabelWidth">
          <el-row>
            <p class="inventory">
              <span>若库存低于</span>
              <el-input
                v-model="giftData.data.stockAlarm"
                placeholder="请输入"
                type="text"
                style="width: 80px;"
              ></el-input>
              <span>值时，提示预警信息</span>
              <br />
            </p>
          </el-row>
          <el-row>
            <p
              style="font-size: 12px; line-height: 20px; margin-top: 10px; color: red;"
            >注：若不关注二维码无法收预警消息，请关注公众号并且登录</p>
          </el-row>
        </el-form-item>
        <div class="qr-code">
          <div class="qr-img">
            <img
              style="height: 100px; width: 100px;"
              src="http://www.jqzjop.com/ftp_images/01/common/jqz_platform_qrcode_20200107.jpg"
              alt
            />
          </div>
          <div class="qr-img-content">金千枝微信公众号</div>
        </div>
        <div class="bottomText">
          <p>温馨提示：</p>
          <p
            style="font-size: 12px; line-height: 20px; margin-top: 10px;"
          >当库存低于某个值时，通过公众号或APP发送预警信息，提示商家是否关闭游戏或者追加库存</p>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{closeText}}</el-button>
        <el-button type="primary" @click="setRowItem">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import user from '@/utils/user'
export default {
  props: {
    consistency: {
      type: Boolean,
      default: () => false
    },
    removing: {
      type: Boolean,
      default: () => true
    },
    giftData: {
      type: Object,
      default: {}
    },
    jmpGift: {
      type: Array,
      default: []
    },
    distance: {
      type: Array,
      default: []
    },
    selectedDistance: {
      type: Array,
      default: []
    }
  },
  computed: {
    giftNum() {
      let result = 0
      const flag = this.giftData.data.productName
      this.jmpGift.map(item => {
        if (item.shelfName === flag) {
          result = item.giftNum
        }
      })
      return result
    },
    giftDataImg() {
      let result = false
      const flag = this.giftData.data.imgName
      if (flag) {
        this.fileList[0].url = flag
        result = true
      }

      return result
    },
    closeText() {
      let result = '取消'
      const flag = this.giftData.edit
      if (flag) {
        result = '关闭'
      }

      return result
    }
  },
  data() {
    return {
      options: [],
      num: 0, // 当前选中的奖品数据
      input: 0, // 默认的百分比
      gridData: [],
      baseURL: VUE_APP_BASE_API,
      dialogTableVisible: false,
      dialogFormVisible: true,
      checked: false, // 超库发放
      uploadHeaders: {
        ticket: user.serverUser.ticket,
        companyKey: user.serverUser.account.companyKey,
        accountId: user.serverUser.account.accountId
      },
      fileList: [
        {
          name: '',
          url: ''
        }
      ],
      form: {
        region: '',
        distance: '',
        giftNum: ''
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJPG = file.type.startsWith('image')
      const isLt2M = file.size / 1024 / 1024 < 0.25

      if (!isJPG) {
        this.$message.error('上传头像图片只能是图片格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 250kb!')
      }
      return isJPG && isLt2M
    },
    changOver() {
      if (this.giftData.data.overStock == '1') {
        this.giftData.data.overStock = '1'
      } else {
        this.giftData.data.overStock = '0'
      }
    },
    deleteImg() {
      this.giftData.data.imgName = ''
    },
    closeDialog() {
      this.$emit('closeDialog')
      const flag = this.giftData.edit // 点击编辑按钮标识
      const distance = String(this.giftData.data.prizeDistance)
      const unit = '米'
      if (distance.includes(unit)) {
        const num = Number(distance.split(unit)[0])
        this.giftData.data.prizeDistance = num
      }

      if (flag) {
        this.setRowItem()
      }
      this.efface()
    },
    // 清理掉预览图
    efface() {
      this.fileList = [
        {
          name: '',
          url: ''
        }
      ]
      // 延迟
      setTimeout(() => {
        this.giftData.data.imgName = ''
      }, 20)
    },
    // 上传二维码
    uploadPicSuccessHandle(response, file, picture) {
      const { code, data } = response
      if (code === '0' && data.length) {
        this.fileList[0].name = ''
        this.giftData.data.imgName = data[0]

        if (picture[0].name === '微信分享图标') {
          this.form.shareImg = data[0]
        } else {
          this.form.publicAccount = data[0]
        }
      }
    },
    getGiftNumAndCode(jmpGift, giftName) {
      let result = {}
      jmpGift.map(item => {
        if (item.shelfName === giftName) {
          result = {
            giftNum: item.giftNum,
            jmpGiftCode: item.giftCode,
            productType: item.shelfProductType,
            integralValue: item.integralValue
          }
        }
      })
      return result
    },
    setConfortGift() {
      const gift = this.giftData.data.productName
      const over = this.giftData.data.exceedStock
      const distance = ''
      const {
        jmpGiftCode,
        giftNum,
        productType,
        integralValue
      } = this.getGiftNumAndCode(this.jmpGift, gift)
      const img = this.giftData.data.imgName ? this.giftData.data.imgName : ''
      const warning = this.giftData.data.stockAlarm ? this.giftData.data.stockAlarm : 0
      const serial = '' // 安慰奖没有行
      const CONFORT = '1' // 是安慰奖
      const edit = this.giftData.edit

      const options = {
        integralValue,
        jmpGiftCode,
        giftNum,
        edit,
        productType,
        productName: gift,
        probability: '',
        imgName: img,
        exceedStock: over,
        prizeDistance: distance,
        stockAlarm: warning,
        sequence: serial,
        comfortPrize: CONFORT
      }
      return options
    },
    setNaturalGift() {
      const unit = '米'
      const gift = this.giftData.data.productName
      const over = this.giftData.data.exceedStock
      let dist = 0
      const flag = String(this.giftData.data.prizeDistance)
      if (flag.includes(unit)) {
        dist = Number(flag.split(unit)[0])
      } else {
        dist = flag
      }
      const {
        jmpGiftCode,
        giftNum,
        productType,
        integralValue
      } = this.getGiftNumAndCode(this.jmpGift, gift)
      const img = this.giftData.data.imgName ? this.giftData.data.imgName : ''
      const warning = this.giftData.data.stockAlarm ? this.giftData.data.stockAlarm : 0
      const serial = this.giftData.row
      const UNCONFORT = '0' // 不是安慰奖
      const edit = this.giftData.edit

      const options = {
        integralValue,
        jmpGiftCode,
        giftNum,
        edit,
        productType,
        productName: gift,
        probability: '',
        imgName: img,
        exceedStock: over,
        prizeDistance: dist,
        stockAlarm: warning,
        sequence: serial,
        comfortPrize: UNCONFORT
      }
      return options
    },
    // 设置完成一行
    setRowItem(item) {
      let result = null
      const flag = this.giftData.data.comfortPrize
      const CONFORT = '1'
      if (flag == CONFORT) {
        result = this.setConfortGift() // 安慰奖
      } else {
        result = this.setNaturalGift() // 正常奖
      }
      this.$emit('sureIndexGift', result)
      this.efface()
      this.$emit('closeDialog')
    }
  }
}
</script>

<style lang="scss" scope>
.rat-form {
  .example {
    position: relative;
    border: 1px solid #eeeeee;
    border-radius: 5px;
    .removeIcon {
      position: absolute;
      top: -12px;
      right: -5px;
      font-size: 18px;
      width: 25px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      border: 1px solid #999;
      border-radius: 50%;
      color: #f00;
      background-color: #fff;
      cursor: pointer;
    }
  }
  .upload-demo {
    width: 420px;
  }
  .waring {
    color: red;
    letter-spacing: 1.5px;
  }
  .inventory {
    position: static;
  }
  .qr-code {
    position: relative;
    .qr-img {
      position: absolute;
      left: 32rem;
      top: -7rem;
    }
    .qr-img-content {
      position: absolute;
      left: 31.8rem;
    }
  }
  .bottomText {
    margin-top: 40px;
    margin-left: 40px;
  }
}
</style>