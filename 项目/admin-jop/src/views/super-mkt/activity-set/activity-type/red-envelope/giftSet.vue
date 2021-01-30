<template>
  <div class="Gift-set">
    <div class="from-table">
      <div>
        是否在规则页显示奖品介绍：
        <el-radio v-model="isShowPhoto" label="1">显示</el-radio>
        <el-radio v-model="isShowPhoto" label="0">不显示</el-radio>
      </div>
      <ul>
        <li class="info-col">
          <div class="row1">
            <span>奖品设置：</span>
          </div>
          <div>(最多设置8个奖品，每个序号可自由调整，但不可重复，奖品图片尺寸：180px*120px，小于5KB;概率小数点（.）后最多三位)</div>
        </li>
        <li class="info-col" v-for="(item,index) in ActiveList" :key="index">
          <!-- <div class="row1">
            <pre>序号：</pre>
            <el-select
              v-model="ActiveList[index].sequence"
              @change="changeNth($event,index)"
              placeholder="请选择"
              size="small"
            >
              <el-option
                v-for="item in groupNth"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>-->
          <div class="row2">
            <el-select
              v-model="ActiveList[index].productName"
              placeholder="请选择"
              size="small"
              @change="changeGiftCode($event,index)"
            >
              <el-option
                v-for="item in giftoptions"
                :key="item.giftCode"
                :label="item.shelfName"
                :value="item.giftCode"
              ></el-option>
            </el-select>
            <span>&nbsp;&nbsp;&nbsp;中奖概率&nbsp;&nbsp;&nbsp;</span>
            <input
              class="percentage"
              @input="inputFun($event,index)"
              v-model="ActiveList[index].probability"
            />%&nbsp;&nbsp;&nbsp;&nbsp;
            数量
            <span class="amount">{{item.giftNum}}</span>
            <img :src="ActiveList[index].imgName" class="gift-img" />
            <div @click="onupload($event,index,item.jmpGiftCode)" class="upload-demo">
              <el-upload
                action
                :show-file-list="false"
                :limit="1"
                :http-request="uploadImg"
                :class="item.jmpGiftCode == '-1' ? 'disable': ' '"
              >
                <el-button size="small" type="primary">重新上传图片</el-button>
                <!-- <span slot="tip" class="el-upload__tip">750px*354px，小于100KB</span> -->
              </el-upload>
            </div>
            <div class="delete" @click="deleteActiver($event,index)">
              <span></span>
            </div>
          </div>
        </li>
        <li class="info-col">
          <div class="row1">
            <span>未中奖设置:</span>
          </div>
          <div class="row2" @click="onupload($event,-1,'null')">
            <el-upload
              action
              :show-file-list="false"
              :multiple="false"
              :limit="1"
              :http-request="uploadImg"
            >
              <el-button size="small" type="primary">上传图片</el-button>
              <span slot="tip" class="el-upload__tip">&nbsp;&nbsp;&nbsp;&nbsp;180px*120px，小于5KB</span>
            </el-upload>
          </div>
        </li>
        <li class="info-col">
          <div class="Notwon-img">
            <img :src="invalidImg.imgName" />
          </div>
        </li>
      </ul>
    </div>
    <div class="submit">
      <button @click="submitGiftSet" :class="isJmpGift==1? 'disable':''">提交</button>
    </div>
  </div>
</template>
<script>
import {
  queryProducts,
  productsSave,
  queryActiveAndJmpGift,
  uploadBgImg
} from '@/api/super-mkt/activity-set/nine'
import { mapState } from 'vuex'
const ActiveLength = 6
export default {
  data() {
    return {
      activeId: '',
      uploadIndex: -1,
      timer: '',
      changeActiveIndex: 0,
      giftoptions: [], // 奖品选择种类
      InitqueryData: [], // 默认初始化活动列表8条
      ActiveList: [], // 请求活动列表
      isShowPhoto: '1',
      invalidImg: {
        // 所谓的安慰奖
        imgName:
          'http://www.jqzjop.com/ftp_images/01/jiugongge/b7a154edfa974c74.jpg' // 安慰奖图片
      },
      allProbability: 0,
      groupNth: [
        // 序号列表
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
        { value: 6 },
        { value: 7 },
        { value: 8 }
      ]
    }
  },
  watch: {
    singleActiveData: {
      handler(newVal) {
        console.log(0)
      },
      deep: true
    }
  },

  computed: {
    ...mapState({
      singleActiveData: state => state.nines.singleActiveData,
      isJmpGift: state => state.nines.isJmpGift
    })
  },

  methods: {
    deleteActiver($event, index) {
      this.$confirm('您确定要删除此条活动奖品数据吗？', '删除数据', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const obj = Object.assign({
            sequence: index + 1,
            probability: 0,
            giftNum: '未知',
            imgName: this.invalidImg.imgName,
            jmpGiftCode: -1,
            productName: '谢谢参与'
          })
          this.ActiveList.splice(index, 1)
          this.ActiveList.splice(index, 0, obj)
          this.changeActive()
        })
        .catch(() => {
          console.log('已取消')
        })
    },
    // 提交表单成功时，改变tabs选中状态
    changetab() {
      this.$emit('changetabName', 'third')
    },
    changeActive() {
      this.$emit('changeActive', this.ActiveList)
    },
    beforeAvatarUpload(file) {
      const reg = /\.(jpg|jpeg|png|JPG|PNG)$/
      const isJPG = !reg.test(file.type)
      const isLt2KB = file.size / 1024 < 220
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2KB) {
        this.$message.error('上传 活动主题图 大小不能超过 200kB!')
      }
      // return isJPG && isLt2M;
      return isLt2KB
    },
    onupload(event, index, codeIndex) {
      // 安慰奖图片上传时，获取index 单独处理
      this.uploadIndex = index
      if (codeIndex == -1) {
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    },
    uploadImg(res) {
      const { file } = res
      const formData = new FormData()
      const index = this.uploadIndex
      formData.append('file', file)
      formData.append('alias', 'market')
      uploadBgImg(formData)
        .then(res => {
          const { data, code, msg } = res
          if (code == 0) {
            if (index == '-1') {
              // 这里判断是否为谢谢参与图片上传
              this.invalidImg.imgName = data[0]
              this.ActiveList.forEach((val, i) => {
                if (val.jmpGiftCode == -1) {
                  const obj = Object.assign(this.ActiveList[i], {
                    imgName: data[0]
                  })
                  this.ActiveList.splice(i, 1)
                  this.ActiveList.splice(i, 0, obj)
                }
              })
            } else {
              const jmpGiftCode = this.ActiveList[index].jmpGiftCode
              this.ActiveList.forEach((val, i) => {
                if (val.jmpGiftCode == jmpGiftCode) {
                  const obj = Object.assign(this.ActiveList[i], {
                    imgName: data[0]
                  })
                  this.ActiveList.splice(i, 1)
                  this.ActiveList.splice(i, 0, obj)
                }
              })
            }
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
    UploadImgSuccess(res) {
      const { data, code, msg } = res
      if (code == 0) {
        const index = this.uploadIndex
        if (index == '-1') {
          // 这里判断是否为谢谢参与图片上传
          this.invalidImg.imgName = data[0]
          this.ActiveList.forEach((val, i) => {
            if (val.jmpGiftCode == -1) {
              const obj = Object.assign(this.ActiveList[i], {
                imgName: data[0]
              })
              this.ActiveList.splice(i, 1)
              this.ActiveList.splice(i, 0, obj)
            }
          })
        } else {
          const jmpGiftCode = this.ActiveList[index].jmpGiftCode
          this.ActiveList.forEach((val, i) => {
            if (val.jmpGiftCode == jmpGiftCode) {
              const obj = Object.assign(this.ActiveList[i], {
                imgName: data[0]
              })
              this.ActiveList.splice(i, 1)
              this.ActiveList.splice(i, 0, obj)
            }
          })
        }
      } else {
        this.$message({
          message: msg,
          type: 'warning'
        })
      }
    },
    // 公共方法，循环所有活动列表
    loopActiveList(num) {
      for (let i = 0; i < this.ActiveList.length; i++) {
        if (this.ActiveList[i].jmpGiftCode == '-1') {
          const obj = Object.assign(this.ActiveList[i], { probability: num })
          this.ActiveList.splice(i, 1)
          this.ActiveList.splice(i, 0, obj)
        }
      }
    },
    // 计算积分
    computeFractional() {
      let IntegerAry // 整数集合
      let pointAry // 浮点数集合
      let totalInteger // 整数总和
      let residuenum // 剩余概率——谢谢参与
      let totalpoint // 浮点数总和
      let pointed
      IntegerAry = []
      pointAry = []
      totalInteger = 0
      residuenum = 0
      totalpoint = 0
      pointed = 0
      const { activePros } = this.filterActive()
      activePros.forEach((val, i) => {
        let arr
        arr = [] // 转成数组，解决浮点数问题；
        if (val.probability) {
          // 贴狗皮膏药，解决转换的问题
          arr = val.probability + ''.split('.')
          if (arr.length == 2) {
            IntegerAry.push(arr[0])
            if (arr[1]) {
              pointAry.push('0.' + arr[1])
            } else {
              pointAry.push(0)
            }
          } else {
            IntegerAry.push(arr[0])
            pointAry.push(0)
          }
        }
      })
      IntegerAry.forEach((val, i) => {
        let Value
        Value = Number(val)
        totalInteger = totalInteger + Value
      })
      pointAry.forEach((val, i) => {
        totalpoint = totalpoint + parseFloat(val) * 1000
      })
      const strtotalpoint = String(totalpoint)
      let residue
      residue = 0
      if (String(totalpoint).length >= 4) {
        pointed = parseFloat(strtotalpoint.slice(1))
        totalpoint = Number(strtotalpoint.slice(0, 1))

        residue = 1000 - pointed
        const leg = String(residue).length

        if (leg == 1) {
          residue = '.00' + residue
        } else if (leg == 2) {
          residue = '.0' + residue
        } else if (leg == 3) {
          residue = '.' + residue
        }
        residuenum = 100 - totalInteger - totalpoint + residue
        totalInteger = Number(totalInteger)
        totalpoint = Number(totalpoint)
        this.allProbability = totalInteger + totalpoint
      } else {
        pointed = parseFloat(strtotalpoint.slice(0))
        this.allProbability = totalInteger

        if (totalpoint != 0) {
          totalpoint = Number(totalpoint)
          residue = 1000 - totalpoint
          const leg = String(residue).length

          if (leg == 1) {
            residue = '.00' + residue
          } else if (leg == 2) {
            residue = '.0' + residue
          } else if (leg == 3) {
            residue = '.' + residue
          }
        }

        this.allProbability = Number(this.allProbability)
        if (residue > 0) {
          residuenum = 100 - 1 - this.allProbability + residue
        } else {
          residuenum = 100 - this.allProbability + residue
        }
      }
      if (Number(residuenum) < 0) {
        residuenum = 0
      }
      return { residuenum, pointed }
    },
    inputFun($event, index) {
      // 此方法校验所有表单输入框   /(^[0-9]+$)|(^\s*$)/  这个校验允许有小数点/^(\d|[1-9]\d|100)$|(^\s?)$|([0-9]\.\d{0,9})$/
      const Val = $event.target.value
      const reg = /^(\d|[1-9]\d|100)$|(^\s?)$|(^\s?)$|([0-9]\.\d{0,3})$/
      const That = $event.target.getAttribute('data-type')
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = ''
      }
      this.timer = setTimeout(() => {
        // 节流处理
        if (reg.test(Val)) {
          const { pointed, residuenum } = this.computeFractional()
          if (
            this.allProbability > 100 ||
            (this.allProbability >= 100 && pointed > 0)
          ) {
            this.$alert('活动总概率不得高于100%！', '活动总概率有误', {
              confirmButtonText: '确定',
              callback: action => {
                const obj = Object.assign(this.ActiveList[index], {
                  probability: ''
                })
                this.ActiveList.splice(index, 1)
                this.ActiveList.splice(index, 0, obj)
              }
            })
          } else {
            this.loopActiveList(residuenum)
          }
        } else {
          this.$alert('输入值有误', '输入有误', {
            confirmButtonText: '确定',
            callback: action => {
              const obj = Object.assign(this.ActiveList[index], {
                probability: ''
              })
              this.ActiveList.splice(index, 1)
              this.ActiveList.splice(index, 0, obj)
            }
          })
        }
      }, 500)
    },

    // 序号更改
    changeNth($event, index) {
      // 获取活动奖品列表谢谢参与数据；
      const item = this.ActiveList.find(val => {
        return val.jmpGiftCode == '-1'
      })
      const obj = Object.assign({}, this.ActiveList[index])
      this.ActiveList.splice(index, 1)
      this.ActiveList.splice(index, 0, obj)
      const repeat = this.checkSequence()
      if (!repeat) {
        const { activePros } = this.filterActive() // 刷选活动，（activePros）除去谢谢参与
        const sequenceAry = activePros.map((val, i) => {
          let sequence
          sequence = Number(val.sequence)
          return sequence - 1
        })
        const strSequence = sequenceAry.join(',')

        for (let i = 0; i < ActiveLength; i++) {
          // 循环重绘活动奖品列表

          if (strSequence.indexOf(i) >= 0) {
            const activeProsItem = activePros.findIndex(val => {
              let index
              index = Number(val.sequence) - 1
              return index == i
            })
            this.ActiveList.splice(i, 1)
            this.ActiveList.splice(i, 0, activePros[activeProsItem])
          } else {
            const objnowin = {
              sequence: i + 1,
              probability: item.probability,
              giftNum: '未知',
              imgName: this.invalidImg ? this.invalidImg.imgName : '',
              jmpGiftCode: -1,
              productName: '谢谢参与'
            }
            this.ActiveList.splice(i, 1)
            this.ActiveList.splice(i, 0, objnowin)
          }
        }
      }
    },

    // 活动更改
    changeGiftCode($event, index) {
      const selectGift = this.giftoptions.find(item => {
        return item.giftCode === $event
      })
      let obj
      obj = Object.assign(this.ActiveList[index], {
        productName: selectGift.shelfName,
        jmpGiftCode: selectGift.giftCode,
        giftNum: selectGift && selectGift.giftNum ? selectGift.giftNum : 0,
        productType: selectGift.productType,
        probability: 0
      })
      this.ActiveList.splice(index, 1)
      this.ActiveList.splice(index, 0, obj)
    },

    // 初始化活动列表方法
    initActive() {
      this.ActiveList = []
      for (let i = 0; i < ActiveLength; i++) {
        const obj = {
          sequence: i + 1,
          probability: 0,
          giftNum: '未知',
          imgName: this.invalidImg.imgName,
          jmpGiftCode: -1,
          productName: '谢谢参与'
        }

        this.ActiveList[i] = obj // 序号
      }
      this.changeActive()
    },

    // 筛选活动列表
    filterActive() {
      let activePros
      let NotwonList
      activePros = []
      NotwonList = []
      this.ActiveList.forEach(val => {
        const obj = Object.assign(val)
        if (val.jmpGiftCode == '-1') {
          NotwonList.push(obj)
        } else {
          activePros.push(obj)
        }
      })
      return { activePros, NotwonList }
    },

    // 重绘活动列表
    ResetActive(Data, i, Ary) {
      this.ActiveList[Ary[i]] = Object.assign(Data[i])
    },

    // 获取活动数据
    async toqueryProducts() {
      const body = {
        activeId: this.singleActiveData.activeId || this.singleActiveData.id,
        activityName: this.singleActiveData.activityName
      }
      const res = await this.toqueryActiveAndJmpGift(body)
      return new Promise((resolve, reject) => {
        queryProducts(body)
          .then(res => {
            const { data, code, msg } = res
            if (code == 0) {
              let Data
              Data = data.activePros // 活动数据
              Data = Data.map((val, i) => {
                if (val.jmpGiftCode != -1) {
                  const jmpGiftCode = val.jmpGiftCode
                  this.giftoptions.forEach((item, i) => {
                    if (jmpGiftCode.indexOf(item.giftCode) >= 0) {
                      val.giftNum = item.giftNum
                    }
                  })
                  return val
                }
              })
              if (!!data.invalidImg) {
                this.invalidImg.imgName = data.invalidImg // 安慰奖图片
              }
              this.isShowPhoto = data && data.isShowPhoto == '0' ? '0' : '1'
              const Activeleg = Data.length
              if (Activeleg >= 1) {
                const sequenceAry = Data.map((val, i) => {
                  return Number(val.sequence) - 1
                })
                for (let i = 0; i < Activeleg; i++) {
                  this.ResetActive(Data, i, sequenceAry)
                }
                this.changeActive()
              }
              const { residuenum } = this.computeFractional()
              this.loopActiveList(residuenum)
            } else {
              reject(msg)
            }
          })
          .catch(reason => {
            reject(reason)
          })
      })
    },
    toqueryActiveAndJmpGift() {
      const { id, name } = this.$route.query
      const body = {
        activeId: id,
        activityName: name,
      }
      return new Promise((resolve, reject) => {
        queryActiveAndJmpGift(body)
          .then(res => {
            const { data, code, msg } = res
            if (code == 0 && data) {
              this.giftoptions = data.map((val, index) => {
                return {
                  giftCode: val.giftCode,
                  giftNum: val && val.giftNum ? val.giftNum : 0,
                  shelfName: val.shelfName,
                  productType: val.shelfProductType
                }
              })
              this.giftoptions.push({
                // 添加安慰奖
                giftCode: -1,
                giftNum: '未知',
                shelfName: '谢谢参与'
              })
              this.changeActive()
              resolve(data)
            } else {
              reject(msg)
            }
          })
          .catch(err => {
            reject(err)
            this.$alert(err, '奖品设置页面')
          })
      })
    },
    // 检测序号
    checkSequence() {
      const sequenceAry = this.ActiveList.map((val, i) => {
        return Number(val.sequence) - 1
      })
      let temp
      let status
      temp = []
      status = false
      sequenceAry.forEach((val, i) => {
        if (temp.indexOf(val) == -1) {
          temp.push(val)
        } else if (temp.indexOf(val) >= 0) {
          status = true
        }
      })
      return status
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
            result = true
          }
        })
      }
      return new Object({prizeMark: result, seat})
    },
    submitGiftSet() {
      const {prizeMark, seat} = this.checkFullPrize()
      if (prizeMark) {
        this.$notify.warning({
            title: '校验失败',
            message: `第${seat + 1}行中奖概率不能为0`
        })
        return
      }
      // (\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}
      const { activePros } = this.filterActive()
      const activeleg = activePros.length
      if (this.isJmpGift == 1) {
        return false
      } else {
        const repeat = this.checkSequence()
        if (repeat) {
          this.$alert('序号不允许重复，请重新检查', '序号有误', {
            confirmButtonText: '确定',
            callback: action => {
              return
            }
          })
        } else if (this.invalidImg.imgName == null) {
          this.$alert('请上传未中奖图片', '温馨提示', {
            confirmButtonText: '确定',
            callback: action => {
              return
            }
          })
        } else if (activeleg == 8 && this.allProbability <= 100) {
          this.$alert(
            '如果活动中未有‘谢谢参与’，则总活动中奖概率必须等于100%(中奖概率总和=100%)。',
            '温馨提示',
            {
              confirmButtonText: '确定',
              callback: action => {
                return
              }
            }
          )
        } else {
          const { activePros } = this.filterActive()
          const from = {
            activeId: this.activeId,
            invalidImg: this.invalidImg.imgName,
            isShowPhoto: this.isShowPhoto,
            activePros
          }
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: '表单提交中...',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.toproductsSave(from)
            .then(res => {
              this.changetab()
              loading.close()
              this.changeActive()
            })
            .catch(err => {
              loading.close()
              this.$message({
                type: 'error',
                message: err || '提交失败!'
              })
            })
        }
      }
    },
    toproductsSave(body) {
      return new Promise((resolve, reject) => {
        productsSave(body)
          .then(res => {
            const { data, code, msg } = res
            if (code == 0) {
              resolve(data)
            } else {
              reject(msg)
            }
          })
          .catch(reason => {
            reject(reason)
          })
      })
    }
  },

  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.invalidImg.imgName =
      this.singleActiveData && this.singleActiveData.invalidImg
        ? this.singleActiveData.invalidImg
        : this.invalidImg.imgName
    this.initActive() // 初始化默认数据
    if (!this.singleActiveData.id) {
      this.$router.push('/super-mkt/activity-set/activity-type/nine/home')
    } else {
      this.toqueryProducts().catch(err => {
        this.$message({
          type: 'error',
          message: err || '请求失败!'
        })
      })
      this.toqueryActiveAndJmpGift()
      this.activeId = this.$route.query.id
    }
  }
}
</script>
<style lang='scss'>
.Gift-set {
  .from-table {
    padding-left: 20px;

    .info-col {
      display: flex;
      justify-content: left;
      align-items: center;
      margin-top: 20px;

      .Notwon-img {
        & > img {
          width: 180px;
          height: 120px;
        }
      }
      .row1 {
        width: 80px;
        display: flex;
        justify-content: left;
        align-items: center;
      }
      .row2 {
        padding-left: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        & > img {
          height: 31px;
          vertical-align: middle;
        }

        .upload-demo {
          display: inline-block;
        }

        .amount {
          display: inline-block;
          width: 74px;
          height: 38px;
          background: #d4d0d0;
          text-align: center;
          line-height: 38px;
          margin-left: 10px;
          border-radius: 5px;
        }

        .gift-img {
          margin: 0 10px;
          width: 50px;
        }

        .percentage {
          width: 74px;
          height: 38px;
          border-radius: 5px;
          text-align: center;
          border: solid 1px #dcdfe6;
          margin: 0 5px;
          font-size: 14px;
          font-weight: bold;
        }

        .delete {
          display: inline-block;
          width: 24px;
          height: 24px;
          background: #409eff;
          line-height: 24px;
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          color: #fff;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          margin-left: 10px;
          align-items: center;
          & > span {
            width: 60%;
            height: 3px;
            background: #fff;
          }
        }
      }
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
    }
    .disable {
      background: #ddd;
    }
  }
}

* {
  list-style: none;
}
.row1 .el-select .el-input__inner {
  padding-right: 10px;
  padding-left: 10px;
  text-align: center;
  min-width: 29px;
}
.row1 .el-input__suffix {
  display: none;
}
.disable .el-button {
  border: 1px solid #ddd;
  background: #ddd;
  cursor: not-allowed;
}
</style>