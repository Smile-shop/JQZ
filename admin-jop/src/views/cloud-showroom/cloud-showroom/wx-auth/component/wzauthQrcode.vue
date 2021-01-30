<template>
  <article class="wx-bind">
    <el-select v-model="initValue" placeholder="请选择" @change="changeSelectedKey">
      <el-option
        v-for="item in options"
        :key="item.companyKey"
        :label="item.componentName"
        :value="item.companyKey"
      ></el-option>
    </el-select>
    <PoupBox @cancel="poupCancel" title="微信小程序授权" v-model="qrShow">
      <div slot="body" class="poup-body">
        <div class="modal-content" v-if="true">
          <canvas id="canvas-qr"></canvas>
          <p>请使用微信小程序绑定的管理员个人微信号扫描</p>
        </div>
        <div class="modal-content" v-else>
          <i class="el-icon-success"></i>
          <p style="font-size: 20px;">授权成功</p>
        </div>
      </div>
      <div slot="footer"></div>
    </PoupBox>
    <el-button @click="handleAuth">微信小程序授权</el-button>

    <el-card class="box-card auth-list">
      <div
        v-for="o in AuthList"
        :key="o.authorAppId"
        class="text item"
      >{{'已授权微信小程序: ' + o.componentName }}</div>
    </el-card>
  </article>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
  getWxCompanyKeyInfo,
  subCompanyKeyInfo,
  getCompanyKeyPerssionInfo,
} from '@/api/super-crm/wx-params-set'
import {
  getWxThirdPartyInfo,
  companyKey,
  getAuthSuccess,
  getAuthSuccessInfo,
} from '@/api/super-crm/wx-miniProgrma'
import user from '@/utils/user'
import QRious from 'qrious'
import PoupBox from '@/components/PoupBox.vue'
import { getLocalStorage } from '@/utils/storage'

function ajaxMethods(url: string) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('get', url)
    xhr.setRequestHeader('content-type', 'application/json')
    xhr.send()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const res = JSON.parse(xhr.responseText)
        resolve(res)
      }
    }
  })
}

@Component({
  components: {
    PoupBox,
  },
})
export default class WzAuthQrcode extends Vue {
  private activeName: string = '1'
  private options: any = []
  private initValue: any = null
  private companyKey: any = null
  private selectedCompanyKey: any = null
  private AuthList: any = []
  private form = {
    publicName: '',
    publicId: '',
    publicAppid: '',
    mchId: '',
    paternerKey: '',
    publicAppsecret: '',
    publicType: '',
  }
  private isGet: boolean = true
  private customer = {
    img: '',
    name: '',
  }
  private qrShow: boolean = false
  private timer: any

  private mounted() {
    this.getAuthSuccessInfo().then(() => {
      this.getReadyAuthList()
    })

    const key = companyKey()
    this.companyKey = key
  }

  private getUserInfo() {
    const info = getLocalStorage()
    return info
  }

  private getReadyAuthList() {
    const info: any = this.getUserInfo()
    getWxThirdPartyInfo().then((res: any) => {
      const { data } = res
      const template: any = this.AuthList // 已授权列表
      const list: any = []
      this.AuthList.map((item: any) => {
        const innerItem: any = {}
        innerItem.companyKey = item.companyKey
        innerItem.thirdCompanyKey = item.thirdCompanyKey
        list.push(innerItem)
      })
      let result: any = []
      const len = list.length
      if (len > 0) {
        const total: any = []
        list.map((item: any) => {
          data.map((ite: any) => {
            if (
              !(
                ite.companyKey == item.thirdCompanyKey &&
                item.companyKey == info.user.companyKey
              )
            ) {
              total.push(ite)
            }
          })
        })
        const args: any = []
        const showItem: any = []
        total.map((item: any) => {
          if (!args.includes(item.companyKey)) {
            // 去重
            args.push(item.companyKey)
            showItem.push(item)
          }
        })
        result = showItem
      } else {
        result = data
      }
      this.options = result
    })
  }

  private getAuthSuccessInfo() {
    const key = companyKey()
    const data = { authCompanyKey: key }
    return new Promise((resolve, reject) => {
      getAuthSuccessInfo(data).then((res: any) => {
        const { data } = res
        this.AuthList = data || []
        resolve()
      })
    })
  }

  private subCompanyKeyInfo() {
    const params = {
      publicAppid: this.form.publicAppid,
      publicName: this.form.publicName,
      publicType: this.form.publicType,
      publicAppsecret: this.form.publicAppsecret,
      publicId: this.form.publicId,
      mchId: this.form.mchId,
      paternerKey: this.form.paternerKey,
    }
    subCompanyKeyInfo(params).then((res: any) => {
      this.$message({
        type: 'success',
        message: '保存成功！',
      })
    })
  }

  private async getPerssionInfo() {
    const params = `${VUE_APP_BASE_API}/wx-interface-web/wtppa/check_auth/${user.serverUser.account.companyKey}`
    const res = await ajaxMethods(params)
    if ((res as any).code === 0) {
      this.isGet = false
      this.customer.img =
        (res as any).data.authorizer_info.head_img ||
        '../../../assets/images/wx-icon.png'
      this.customer.name = (res as any).data.authorizer_info.nick_name || ''
    } else {
      this.isGet = true
    }
  }

  private clearTimer() {
    window.clearInterval(this.timer)
    this.timer = null
  }

  private authBackSuccess(data: any) {
    getAuthSuccess(data).then((res: any) => {
      const { data } = res
      if (data) {
        this.qrShow = false
        this.clearTimer()
        this.$message({
          type: 'success',
          message: '授权成功',
        })
        this.getAuthSuccessInfo().then(() => {
          this.getReadyAuthList()
        })
      }
    })
  }

  private changeSelectedKey(data: any) {
    this.selectedCompanyKey = data
  }

  private handleAuth() {
    const auth = this.companyKey
    const thrid = this.selectedCompanyKey
    const len = this.options.length == 0 ? true : false
    if (auth && thrid) {
      this.qrShow = true
      const authInfo = {
        thirdCompanyKey: thrid,
        authCompanyKey: auth,
      }
      this.$nextTick(() => {
        const linkurl = `${VUE_APP_BASE_API}/jip-admin-web/mini/auth/${thrid}/${auth}/authorization`
        const params = {
          element: document.getElementById('canvas-qr'),
          value: linkurl,
          size: 240,
        }
        const qRious = new QRious(params)
      })
      this.getAuthInfoTimeInterval(authInfo)
    } else if (len) {
      this.$message({
        type: 'warning',
        message: '暂无可授权微信小程序',
      })
    } else {
      this.$message({
        type: 'warning',
        message: '请选择',
      })
    }
  }

  private getAuthInfoTimeInterval(data: any) {
    this.timer = window.setInterval(() => {
      this.authBackSuccess(data)
    }, 1000)
  }

  private reGetPerssion() {
    this.qrShow = true
    this.$nextTick(() => {
      const params = {
        element: document.getElementById('canvas-qr'),
        value: `${VUE_APP_BASE_API}/wx-interface-web/wtppa/auth/${user.serverUser.account.companyKey}?t=wx`,
        size: 240,
      }
      const qRious = new QRious(params)
    })
    this.getPerssionInfoTimeInterval()
  }

  private getPerssionInfoTimeInterval() {
    this.timer = window.setInterval(() => {
      this.getPerssionInfo()
    }, 1000)
  }

  private poupCancel() {
    this.qrShow = false
    window.clearInterval(this.timer)
    this.timer = null
  }

  private destroyed() {
    window.clearInterval(this.timer)
    this.timer = null
  }
}
</script>

<style lang="scss" scoped>
.wx-bind {
  .form {
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #333333;
      padding: 12px 0;
    }
  }
  .bind-title {
    font-size: 14px;
    color: #6699ff;
  }
  .bind-info {
    font-size: 14px;
    color: #666666;
    padding-top: 10px;
    line-height: 18px;
  }
  .bind-btn {
    margin-top: 15px;
    i {
      margin-right: 12px;
    }
  }
  .has-btn-content {
    display: flex;
    align-items: center;
    height: 173px;
    width: 565px;
    margin: 20px auto;
    border-radius: 5px;
    border: solid 1px #e4e7ed;
    .get-img {
      flex-grow: 1;
      text-align: center;
      p {
        font-size: 14px;
        color: #333333;
      }
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
    }
    .to-img {
      width: 150px;
      text-align: center;
      p {
        color: #6699ff;
        font-weight: bold;
      }
    }
  }
  .get-btn {
    text-align: center;
  }
  .modal-content {
    font-size: 0;
    text-align: center;
    p {
      font-size: 14px;
      padding: 12px 0;
    }
    i {
      font-size: 120px;
      color: #33cc66;
    }
  }
  .auth-list {
    margin-top: 20px;
  }
}
</style>