<template>
  <div class="wrapper" @click="close" v-show="show">
    <div class="container" @click.stop="showContent">
      <div class="title">
        <div class="confirm-title">{{title}}</div>
        <div class="confirm-close" @click.stop="close">X</div>
      </div>
      <div class="content">
        <div v-if="setting == 1">
          <div class="setting-data">
            <div class="data-title">自动录入用户数据：</div>
            <div class="data-item">
              <!-- <div class="data-left">
                <input type="radio">
                <span class="label">关闭</span>
                </div>
              <div class="data-rigth">
                <input type="radio">
                <span class="label">开启</span>
              </div> -->
                <el-radio-group v-model="autoInput">
                  <el-radio :label="0">关闭</el-radio>
                  <el-radio :label="1">开启</el-radio>
                </el-radio-group>
              <p class="data-tip">说明：若开启，用户在小程序中授权后，列表会自动增加用户账号数据</p>
            </div>
          </div>
          <div class="setting-auth">
            <div class="auth-title">用户访问权限：</div>
            <div class="auth-item">
              <!-- <div class="auth-top">
                <input type="radio" name="" id="">
                <span class="label">后台录入用户</span>
              </div> -->
              <el-radio-group class="inputAndRatio" v-model="inputAndRatio">
                <el-radio :label="0">后台录入用户</el-radio>
                <el-radio :label="1" class="subItem">所有用户</el-radio>
              </el-radio-group>
              <div class="auth-input">
               <!-- <div class="all-select">
                  <input type="radio" name="" id="">
                  <span class="label">所有用户</span>
               </div> -->
               <div class="all-input" v-show="inputAndRatio == 1">
                 <div class="all-price">
                   <div class="all-input-title">默认价格倍率：</div>
                   <!-- <input type="number" name="" id="" placeholder="请输入价格倍率"> -->
                   <el-input class="allInput" v-model="userRatio" size="mini" placeholder="请输入价格倍率"></el-input>
                 </div>
                 <p class="default-tip">可填范围0.1-10，0.1即一折</p>
               </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="setting == 2" class="magnification">
          <div class="magnification-input">
            <!-- <input type="number" name="" id="" placeholder="1"> -->
            <el-input v-model="priceRatio" size="medium" placeholder="请输入内容"></el-input>
          </div>
          <p class="magnification-tip">（可填范围0.1-10，0.1即一折）</p>
        </div>
        <div v-else class="permission">
          <div class="permission-title">访问权限：</div>
          <div class="permission-oprat">
            <!-- <div class="permission-open">
              <input type="radio" name="" id="">
              <span class="label">启用</span>
            </div>
            <div class="permission-close">
              <input type="radio" name="" id="">
              <span class="label">禁用</span>
            </div> -->
              <el-radio-group v-model="radio">
                <el-radio :label="0">启用</el-radio>
                <el-radio :label="1">禁用</el-radio>
              </el-radio-group>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="cancel" @click.stop="close">
          <el-button >取消</el-button>
        </div>
        <div class="sure" @click.stop="sure">
          <el-button  type="primary" >确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit, } from 'vue-property-decorator'
import {
  findDefault,
} from '@/api/super-crm/cloud-showroom-clientele'

@Component({})
export default class JqzConfirm extends Vue {
  @Prop() title!: string
  @Prop() show!: boolean
  @Prop() setting!: number
  private inputAndRatio = 0
  private autoInput = 0
  private userRatio = 1
  private radio: number = 0
  private priceRatio: string = ''
  @Emit('close')
  private close() {
    console.log('关闭')
  }
  private showContent() {
    console.log('内如区域')
  }
  @Emit('sure')
  private toSure(val: any) {
   console.log('didid')
  }
  private sure() {
    console.log('确定', this.setting)
    const item = this.setting
    if (item == 1) {
      if (this.checkPriceRatio(this.userRatio)) {
        this.toSure({setting: {auto: this.autoInput, allUser: this.inputAndRatio, backInput: this.userRatio}})
      }
    }
    if (item == 2) {
      if (this.checkPriceRatio()) {
          this.toSure({ratio: this.priceRatio})
      }
    }
    if (item == 3) {
      this.toSure({status: this.radio})
    }
  }

  private mounted() {
    this.findDefault()
  }

  // 获取默认设置
  private async findDefault() {
    const setting: any = await findDefault()
    const { replyData } = setting
    console.log('或趋势默认', replyData)
    const { accessPermition, autoEnter, defaultRate } = replyData
    this.inputAndRatio = accessPermition
    this.autoInput = autoEnter
    this.userRatio = defaultRate
  }

  // @Emit('foucus')
  // private focusFn() {
  //   console.log('1')
  // }

  // @Emit('input')
  // private onInput(val?: any) {
  //   console.log('2')
  // }
  // private foucus() {
  //   this.focusFn()
  // }
  // private input() {
  //   this.onInput(this.priceRatio)
  // }

  // 回复默认倍率值
  private resetPriceRatio() {
    this.priceRatio = ''
  }

  // 检测倍率合格
  private checkPriceRatio(val: any = this.priceRatio) {
    let result: boolean = true
    const num = Number(val)
    if (num < 0.1 || num > 10) {
      result = false
      this.$message.error('请合理设置倍率，可填范围0.1-10，0.1即一折');
    }
    return result
  }
}
</script>

<style lang="scss">
.wrapper {
  ::-webkit-input-placeholder { /* WebKit browsers */
  color: #999;
  font-size: 12px;
}

::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: #999;
  font-size: 12px;
}

:-ms-input-placeholder { /* Internet Explorer 10+ */
  color: #999;
  font-size: 12px;
}
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  .container {
    z-index: 2;
    width: 600px;
    background-color: #ffffff;
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .title {
      height: 52px;
      border-bottom: 1px solid #EBEEF5;
      display: flex;
      justify-content: space-between;
      .confirm-title {
        display: inline-block;
        padding: 16px 0 0 16px;
      }
      .confirm-close {
        display: inline-block;
        width: 60px;
        text-align: center;
        padding: 16px 0 0 16px;
        cursor: pointer;
      }
    }
    .content {
      flex: 1;
      padding: 30px 10px;
      .setting-data {
        padding: 30px;
        display: flex;
        .data-title {
          width: 130px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #263446;
          line-height: 20px;

        }
        .data-item {
          .data-left {
            display: inline-block;
            margin-right: 50px;
          }
          .data-rigth {
            display: inline-block;
          }
          .data-tip {
            width: 372px;
            height: 20px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #80869D;
            line-height: 20px;
            margin-top: 10px;
          }
        }
      }
      .setting-auth {
        display: flex;
        padding: 30px;
        height: 140px;
        .auth-title {
          width: 130px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #263446;
          line-height: 20px;
        }
        .auth-item {
          flex: 1;
          .auth-top {
            margin-bottom: 30px;
          }
          .inputAndRatio {
            display: flex;
            flex-direction: column;
            .subItem {
              display: inline-block;
              margin-top: 30px;
            }
          }
          .auth-input {
            display: flex;
            align-items: top;
            justify-content: flex-end;
            margin-top: -22px;
            .all-input {
              display: inline-block;
              .all-input-title {
                display: inline-block;
                height: 20px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #263446;
                line-height: 20px;
              }
              .allInput {
                width: 180px;
              }
              .all-price {
                display: flex;
                align-items: center;
              }
            }
            .all-select {
              display: inline-block;
              margin-right: 10px;
            }
          }
          .default-tip {
            height: 21px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #80869D;
            line-height: 20px;
          }
        }
      }
      .magnification {
        display: flex;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        .magnification-input {
          margin-bottom: 10px;
          width: 190px;
          margin-left: 34%;
        }
        .magnification-tip {
          height: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #80869D;
          line-height: 20px;
        }
      }
      .permission {
        display: flex;
        justify-content: center;
        align-items: center;
        .permission-title {
          display: inline-block;
        }
        .permission-oprat {
          display: flex;
          .permission-open, .permission-open {
            display: inline-block;
            margin-right: 80px;
            margin-left: 16px;
          }
        }
      }
      .label {
        margin-left: 5px;
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #263446;
        line-height: 20px;
      }
    }
    .footer {
      height: 50px;
      display: flex;
      justify-content: flex-end;
      .cancel {
        // display: inline-block;
        margin: 0 20px 20px 0;
        // width: 76px;
        // height: 32px;
        // line-height: 32px;
        // border-radius: 2px;
        // border: 1px solid #979797;
        // color: #263446;
        // text-align: center;
      }
      .sure {
        // display: inline-block;
        margin: 0 50px 20px 0;
        // color: #ffffff;
        // width: 76px;
        // height: 32px;
        // line-height: 32px;
        // background: #6699FF;
        // border-radius: 2px;
        // text-align: center;
      }
    }
  }
}
</style>