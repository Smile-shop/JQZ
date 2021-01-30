<template>
  <div class="basicSet">
    <ul class="From-tab">
      <li class="info-col">
        <span class="lable">活动主题图：</span>
        <div class="row2">
          <el-upload
            class="upload-demo"
            action
            :show-file-list="false"
            :multiple="false"
            :limit="1"
            :http-request="uploadImg"
          >
            <el-button size="small" type="primary">上传图片</el-button>
            <span slot="tip" class="el-upload__tip">750px*300px，小于100KB</span>
          </el-upload>
        </div>
      </li>

      <li class="info-col">
        <span class="lable"></span>
        <div class="row2 bannerImg">
          <img v-if="form.imgName" :src="form.imgName" />
        </div>
      </li>

      <li class="info-col">
        <span class="lable">活动标题：</span>
        <div class="row2">{{form.activityName}}</div>
      </li>
      <li class="info-col">
        <span class="lable mushInput">活动副标题：</span>
        <div class="row2">
          <input
            type="text"
            class="subNamebox"
            v-model="form.activeTheme"
            @input="changeActiveTheme"
          />
        </div>
      </li>
      <li class="info-col">
        <span class="lable mushInput">活动时间：</span>
        <div class="row2">
          <el-date-picker
            v-model="dateValue"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="limitDate($event)"
          ></el-date-picker>
        </div>
      </li>

      <li class="info-col">
        <span class="lable mushInput">活动状态：</span>
        <div class="row2">
          <el-radio v-model="form.isPaused" label="0">开启活动</el-radio>
          <el-radio v-model="form.isPaused" label="1">关闭活动</el-radio>
        </div>
      </li>

      <li class="info-col">
        <span class="lable mushInput">可参与用户：</span>
        <div class="row2">
          <el-radio v-model="form.isMember" label="1" @change="isMemberStatus($event)">所有用户</el-radio>
          <el-radio v-model="form.isMember" label="0" @change="isMemberStatus($event)">仅限会员</el-radio>
        </div>
      </li>
      <li class="degree" v-show="!readonlyStatus">
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="item in memberGrade" :label="item" :key="item"></el-checkbox>
        </el-checkbox-group>
      </li>

      <li class="info-col" v-if="form.isMember === '0'">
        <span class="lable mushInput">消耗积分：</span>
        <div class="row2">
          每次抽奖将消耗
          <input
            type="number"
            min="1"
            max="1000"
            :readonly="readonlyStatus"
            :class="{'disable': readonlyStatus}"
            class="integralInput num-input"
            @input="inputFun"
            data-type="consumeIntegral"
            v-model="form.consumeIntegral"
          />积分
          <span v-show="form.isMember === '0'" style="color:red">（仅限选择会员参与才生效）</span>
        </div>
      </li>

      <li class="info-col">
        <span class="lable mushInput">总参与次数：</span>
        <div class="row2">
          <el-radio :disabled="isPublishid" v-model="isNum" label="2">
            活动期间可参数总次数
            <input
              :disabled="isPublishid"
              type="number"
              min="0"
              @input="inputFun"
              class="RateNum num-input"
              data-type="totalNum"
              v-model="totalNum"
            />次
          </el-radio>
          <el-radio
            :disabled="isPublishid"
            v-model="isNum"
            :label="gameNum"
            @change="infinit"
          >不限制总次数</el-radio>
        </div>
      </li>
      <li class="info-col">
        <span class="lable mushInput">每天参与次数：</span>
        <div class="row2">
          <span class="lable">每天可抽奖</span>
          <input
            :disabled="isPublishid"
            class="diy-input"
            type="number"
            min="1"
            v-model="participateNum"
          />
          <span class="lable">次</span>
          <span class="tip">（每天参与次数不能大于总参与次数）</span>
        </div>
      </li>

      <li class="info-col" v-show="probability!==100">
        <span class="lable mushInput">中奖次数限制：</span>
        <div class="row2">
          <span class="lable">每人最多可中奖</span>
          <input
            :disabled="isPublishid || probability===100"
            class="diy-input"
            type="number"
            min="1"
            v-model="maxWinning"
          />
          <span class="lable">次</span>
          <span class="tip">（请输入≥1的整数倍）</span>
        </div>
      </li>

      <li class="info-col">
        <span class="lable mushInput">售后设置：</span>
        <div class="row2">
          <input type="text" placeholder="请输入售后服务地址" class="concatInput" v-model="form.serviceAddr" />
          <input
            type="text"
            placeholder="请输入售后服务电话"
            class="concatInput"
            v-model="form.servicePhone"
          />
        </div>
      </li>

      <li class="info-col">
        <span class="lable mushInput" style="position:absolute;top:0">活动规则：</span>
        <span class="lable" style="min-width: 111px;"></span>
        <div class="row2">
          <WangEditor :type="'mkt-setting'" ref="ue" class="editor"></WangEditor>
        </div>
      </li>
    </ul>
    <div class="submit">
      <button @click="submitBasicSet" :class="{'disable': isJmpGift=='1'}">提交</button>
      <span style="color:red;margin-left:20px;" v-show="isJmpGift=='1'?true:false">请先前往JMP关联奖品!</span>
    </div>
  </div>
</template>
<script>
import {
  basicUpdate,
  uploadBgImg,
  queryActive
} from '@/api/super-mkt/activity-set/nine'
import { queryMemberGrade } from '@/api/super-mkt/spread-set/set-plan'
import WangEditor from '@/components/WangEditor.vue'
import moment from 'moment'
import { mapMutations, mapState } from 'vuex'
export default {
  components: { WangEditor },
  props: {
    probability: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      isJmpGift: '',
      readonlyStatus: false,
      timer: '', // 节流
      TimestampStart: '', // 开始日期时间戳
      TimestampEnd: '', // 结束日期时间戳
      dateValue: [], // 日期
      TimestampNowDate: '', // 当前时间
      editContext: '',
      memberGrade: [], // 会员等级
      checkList: [], // 选中会员
      totalNum: 1, // 游戏总抽奖次数
      isNum: '1', // 是否限制抽奖次数
      participateNum: 1, // 每天可抽奖次数
      maxWinning: 1, // 这大中奖次数
      imgName:
        'http://www.jqzjop.com/ftp_images/01/market/45c0f3fecc9e41dd.jpg',
      form: {
        activeTheme: '', // 副标题
        imgName:
          'http://www.jqzjop.com/ftp_images/01/market/45c0f3fecc9e41dd.jpg', // 广告图
        activityName: '红包大抽奖，大奖等着您',
        subName: '新人专享好礼，最大888元红包',
        jmpId: '130',
        id: '',
        isPublish: '0', // 发布情况
        beginTime: '', // 开始日期
        endTime: '', // 结束日期
        isPaused: '1', // 活动状态
        isMember: '1', // 可参与用户值
        consumeIntegral: 0, // 消耗积分值
        participateNum: '', // 参与次数限制值
        isNum: '1', // 是否限制游戏次数
        serviceAddr: '', // 地址
        servicePhone: '', // 号码
        rule: '', // 活动规则
        totalNum: 0
      }
    }
  },
  computed: {
    ...mapState({
      singleActiveData: state => state.nines.singleActiveData
    }),
    gameNum() {
      let result = '1'
      const num = this.isNum ? Number(this.isNum) : '1'
      const flag = 2
      if (num !== flag) {
        result = String(num)
      }

      return result
    },
    isPublishid() {
      let result = false
      const flag = this.form.isPublish
      if (flag === '1') {
        result = true
      }

      return result
    }
  },
  // 监控data中的数据变化
  watch: {
    imgName(newVal) {
      this.$emit('bannerImage', newVal)
    }
  },
  // 方法集合
  methods: {
    ...mapMutations(['setsingleActiveData', 'setisJmpGift']),
    // 提交表单成功时，改变tabs选中状态
    changetab() {
      this.$emit('changetabName', 'second')
    },
    changeActiveTheme(e) {
      const Val = e.target.value
      this.$emit('changeActiveTheme', Val)
    },
    getQueryMemberGrade(data) {
      queryMemberGrade(data).then(res => {
        const data = res.data
        this.memberGrade = data
      })
    },
    setqueryActive(Data) {
      queryActive(Data)
        .then(res => {
          const { code, data, msg } = res
          if (code == 0) {
            this.form = Object.assign(this.form, data)
            this.checkList = data.grade ? data.grade.split(',') : []
            this.isNum = data.isNum ? String(data.isNum) : '1'
            this.totalNum = data.totalNum ? Number(data.totalNum) : 1
            this.participateNum = data.participateNum
              ? Number(data.participateNum)
              : 1
            this.maxWinning = data.maxWinning ? Number(data.maxWinning) : 1
            const dateValue = {
              startTime: moment(data.beginTime).format('YYYY-MM-DD HH:mm:ss'),
              endTime: moment(data.endTime).format('YYYY-MM-DD HH:mm:ss')
            }
            this.$emit('dateChange', dateValue)
            if (data.isMember == 0) {
              this.readonlyStatus = false
            } else {
              this.readonlyStatus = true
            }
            this.isJmpGift = data.isJmpGift
            this.setisJmpGift(this.isJmpGift)
            this.setsingleActiveData({ isJmpGift: this.isJmpGift })
            if (!this.form.imgName) {
              this.form.imgName = this.imgName
            }
            if (!data.beginTime || !data.endTime) {
              this.dateValue = ''
            } else {
              this.dateValue.push(new Date(data.beginTime))
              this.dateValue.push(new Date(data.endTime))
            }
          } else {
            this._Alert(msg)
          }
        })
        .catch(err => {
          this._Alert(err)
        })
    },
    // 图片上传前
    beforeAvatarUpload(file) {
      const reg = /\.(jpg|jpeg|png|JPG|PNG)$/
      const isJPG = !reg.test(file.type)
      const isLt2KB = file.size / 1024 < 120
      // console.log(isLt2KB)
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2KB) {
        this.$message.error('上传 活动主题图 大小不能超过 100kB!')
      }
      // return isJPG && isLt2M;
      return isLt2KB
    },
    // 图片上传
    uploadImg(res) {
      const { file } = res
      const formData = new FormData()

      formData.append('file', file)
      formData.append('alias', 'market')
      uploadBgImg(formData)
        .then(res => {
          const { data, code, msg } = res
          if (code == 0) {
            this.form.imgName = res.data[0]
            this.imgName = res.data[0]
            this.$emit('bannerImage', res.data[0])
          } else {
            this.$message({
              message: msg,
              type: 'warning'
            })
          }
        })
        .catch(err => {
          this.$message({
            message: err,
            type: 'warning'
          })
        })
    },
    // 图片上传成功
    UploadImgSuccess(res, file) {
      const { data, code, msg } = res
      if (code == 0) {
        this.form.imgName = res.data[0]
        this.$emit('bannerImage', res.data[0])
      } else {
        this.$message({
          message: msg,
          type: 'warning'
        })
      }
    },
    Nolimit() {
      // 参与次数限制
      this.form.participateNum = ''
    },
    infinit() {
      this.totalNum = 1
    },
    isMemberStatus($event) {
      if ($event == 0) {
        this.readonlyStatus = false
      } else {
        this.readonlyStatus = true
      }
    },
    limitDate($event) {
      // 日期校验
      if (!this.dateValue) {
        this.form.beginTime = ''
        this.form.endTime = ''
        this.$alert('需从新选择活动日期！', '日期选择有误', {
          confirmButtonText: '确定',
          callback: action => {
            this.dateValue = ''
            return
          }
        })
      } else {
        this.TimestampStart = moment($event[0], 'YYYY-MM-DD HH:mm:ss').valueOf()
        this.TimestampEnd = moment($event[1], 'YYYY-MM-DD HH:mm:ss').valueOf()
        this.TimestampNowDate = moment(
          new Date(),
          'YYYY-MM-DD HH:mm:ss'
        ).valueOf()
        if (
          this.TimestampStart == this.TimestampEnd ||
          this.TimestampNowDate > this.TimestampEnd
        ) {
          this.$alert(
            '开始时间不能大于或等于结束时间 且 不能小于当前期间',
            '日期选择有误',
            {
              confirmButtonText: '确定',
              callback: action => {
                this.dateValue = ''
                return
              }
            }
          )
          return false
        } else {
          const dateValue = {
            startTime: moment(this.dateValue[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(this.dateValue[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          this.$emit('dateChange', dateValue)
          return true
        }
      }
    },
    _Alert(msg, title) {
      // 提示框
      this.$alert(msg, title, {
        confirmButtonText: '确定',
        callback: action => {
          return
        }
      })
    },
    updateMaxWin() {
      if (this.probability === 100) {
        this.maxWinning = 1
      }
    },
    tipJMP() {
      this.$message({
        type: 'warning',
        message: '请前往JMP关联奖品'
      })
    },
    submitBasicSet() {
      const MARK = '1'
      if (this.isJmpGift == MARK) {
        this.tipJMP()
        return
      }
      const LIMIT = '2'
      const NO_LIMIT = '1'
      this.updateMaxWin()
      // 表单提交以及表单校验
      this.form.rule = this.$refs.ue.getContent()

      if (!this.readonlyStatus && this.checkList.length === 0) {
        this._Alert('请选中参与活动的会员等级', '可参与用户')
        return false
      } else {
        this.form.grade = this.checkList.join(',')
      }

      if (String(this.isNum) === '1' && Number(this.totalNum) < 1) {
        this._Alert('请设置活动期间可参与总次数', '总参与次数')
        return false
      } else {
        this.form.totalNum = this.totalNum
      }

      const consumeIntegral = Number(this.form.consumeIntegral)
      if (!this.readonlyStatus && consumeIntegral < 1) {
        this._Alert('消耗积分应该设置为1至1000之间', '消耗积分')
        return
      }

      if (!this.readonlyStatus && consumeIntegral > 1000) {
        this._Alert('消耗积分应该设置为1至1000之间', '消耗积分')
        return
      }

      if (this.form.isMember === '1') {
        this.form.consumeIntegral = 0 // 所有用户的情况给消耗积分为 0
      }

      if (Number(this.participateNum) < 1) {
        this._Alert('每天抽奖次数必须大于等于1', '每天抽奖次数')
        return
      }

      if (Number(this.maxWinning) < 1) {
        this._Alert('每天中奖次数必须大于等于1', '中奖次数限制')
        return
      }

      if (
        String(this.isNum) === LIMIT &&
        Number(this.participateNum) > Number(this.totalNum)
      ) {
        this._Alert('每天抽奖次数不可大于活动期间可参与总次数', '每天参与次数')
        return false
      } else {
        this.form.participateNum = this.participateNum
      }

      if (
        this.isNum === LIMIT &&
        Number(this.maxWinning) > Number(this.totalNum)
      ) {
        this._Alert(
          '每人最多可中奖次数不可大于活动期间可参与总次数',
          '中奖次数限制'
        )
        return false
      } else {
        this.form.maxWinning = this.maxWinning
      }

      if (String(this.isNum) === NO_LIMIT) {
        // this.form.totalNum = null 不限制总次数为 后台数据类型为 int
        this.form.totalNum = 0
      }

      this.form.isNum = this.isNum

      if (this.isJmpGift == 1) {
        return false
      } else if (!this.form.rule) {
        this._Alert('活动规则内容不能为空！', '活动规则')
        return false
      } else if (this.form.imgName == '') {
        this._Alert('活动主题图未上传！', '请选择活动主题图')
        return false
      } else if (this.form.isNum == '0' && this.form.participateNum == '') {
        this._Alert('参与次数限制选择值不能为空', '参与次数限制选择值有误')
        return false
      } else if (!this.form.serviceAddr) {
        this._Alert('服务地址不能为空', '服务地址')
        return false
      } else if (!this.form.servicePhone) {
        this._Alert('服务电话不能为空', '服务电话')
        return false
      } else if (this.dateValue == '' || !this.limitDate(this.dateValue)) {
        this._Alert(
          '开始时间不能大于或等于结束时间 且 不能小于当前期间,请重新选择！',
          '日期选择有误'
        )
        return false
      } else {
        this.form.beginTime = moment(this.dateValue[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        this.form.endTime = moment(this.dateValue[1]).format(
          'YYYY-MM-DD HH:mm:ss'
        ) // HH:mm:ss

        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: '表单提交中...',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        basicUpdate(this.form)
          .then(res => {
            const { code, dada, msg } = res
            this.$message.success(msg)
            if (code == 0) {
              loading.close()
              this.changetab()
            } else {
              loading.close()
              this._Alert(msg)
            }
          })
          .catch(err => {
            loading.close()
            // this._Alert('抱歉！系统繁忙中，请稍后再试。', '系统繁忙')
          })
      }
    },
    inputFun(e) {
      // 此方法校验输入框
      const input = e.target
      const Val = input.value
      const reg = /(^[0-9]+$)|(^\s*$)/
      const That = input.getAttribute('data-type')
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = ''
      }
      this.timer = setTimeout(() => {
        if (!reg.test(Val)) {
          input.value = ''
        }
      }, 500)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    initQueryJmp(obj) {
      queryActive(obj).then(res => {
        const MARK = 0
        const { data, code, msg } = res
        if (code == MARK) {
          this.isJmpGift = data.isJmpGift
          this.imgName = data.imgName == null ? this.imgName : data.imgName
          this.$emit('changeActiveTheme', data.activeTheme)
        }
      })
    }
  },
  created() {
    const { id } = this.$route.query
    if (!id) {
      this.$router.push('/super-mkt/activity-set/activity-type/nine/home')
    } else {
      const options = {
        activeId: id,
      }
      this.setqueryActive(options)
      this.initQueryJmp(options)
    }

    const options = {
      activeId: id
    }

    this.getQueryMemberGrade(options)
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.$refs.ue.setContent(this.singleActiveData.rule)
  }
}
</script>
<style lang='scss' scoped>
.basicSet {
  padding: 0;

  .From-tab {
    padding: 0;

    .info-col {
      flex: 1;
      display: flex;
      justify-content: left;
      align-items: center;
      margin: 25px 0;
      position: relative;

      .mushInput::before {
        content: '*';
        color: #f00;
        margin-right: 2px;
      }

      .row2 {
        padding: 0;

        .el-upload__tip {
          margin-left: 20px;
        }

        .diy-input {
          width: 74px;
          height: 38px;
          border-radius: 5px;
          border: solid 1px #dcdfe6;
          margin: 0 5px;
          outline: none;
          text-align: center;
        }

        .num-input {
          width: 74px;
          height: 38px;
          border-radius: 5px;
          border: solid 1px #dcdfe6;
          margin: 0 5px;
          outline: none;
          text-align: center;
        }

        .concatInput {
          width: 255px;
          height: 40px;
          border-radius: 5px;
          border: solid 1px #dcdfe6;
          margin-right: 20px;
          padding-left: 15px;
        }
        .subNamebox {
          width: 255px;
          height: 40px;
          outline: none;
          border: none;
          border-bottom: solid 1px #ddd;
          margin-right: 20px;
          padding-left: 15px;
        }
      }
      .bannerImg {
        width: 200px;
        height: 94px;

        & > img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .lable {
      width: 120px;
      text-align: right;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      line-height: 40px;
      letter-spacing: 1px;
      color: #606266;
      min-width: 90px;
    }
    .degree {
      width: 721px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      padding-left: 20px;
      margin-left: 110px;
      label {
        height: 45px;
        line-height: 45px;
      }
    }
    .tip {
      font-size: 12px;
      color: #999;
    }
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
      outline: none;
    }
    & > button.disable {
      background: #ddd;
    }
  }
}
.disable {
  background: #ddd;
}
.integralInput {
  width: 74px;
  height: 38px;
  text-align: center;
}
/deep/ .w-e-text-container {
  color: #333;
  // min-height: 200px;
}
.From-tab input::-webkit-input-placeholder {
  color: #c0c4cc;
}

.editor {
  width: 530px;
  /deep/.column {
    display: none;
  }
  /deep/.editor-menu {
    display: none;
  }
}
</style>