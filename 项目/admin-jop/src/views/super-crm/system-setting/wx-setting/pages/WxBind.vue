<template>
  <article class="wx-bind">
    <el-tabs v-model="activeName">
      <el-tab-pane label="接口绑定" name="1">
        <el-form ref="form" class="form" :model="form" label-width="140px" style="width:572px">
          <div class="title">微信公众号</div>
          <el-form-item label="公众号名称：">
            <el-input v-model="form.publicName"></el-input>
          </el-form-item>
          <el-form-item label="公众号原始ID：">
            <el-input v-model="form.publicId"></el-input>
          </el-form-item>
          <el-form-item label="公众号appid：">
            <el-input v-model="form.publicAppid"></el-input>
          </el-form-item>
          <el-form-item label="公众号appsecret：">
            <el-input v-model="form.publicAppsecret"></el-input>
          </el-form-item>
          <el-form-item label="公众号类型：">
            <el-select v-model="form.publicType" placeholder="公众号类型" style="width: 100%">
              <el-option label="订阅号" value="2"></el-option>
              <el-option label="服务号" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="subCompanyKeyInfo" type="primary">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="授权绑定" name="2">
        <div class="bind-title">温馨提示：</div>
        <div class="bind-info" v-if="isGet">1、建议您授权绑定认证服务号，以方便使用微信公众号平台的所有功能。</div>
        <div class="bind-info" v-if="isGet">2、为保证功能的正常使用，授权时请保持默认选择。</div>
        <div class="bind-info" v-if="!isGet">解除微信公众号服务授权后，将会影响您的相关业务，请慎重考虑取消授权。</div>
        <el-button @click="reGetPerssion" v-if="isGet" type="success" class="bind-btn">
          <i class="iconfont icon-gongzhonghao"></i>马上授权
        </el-button>

        <div class="has-btn-content" v-if="!isGet">
          <div class="get-img">
            <img :src="customer.img" alt="tupian" />
            <p>{{customer.name}}</p>
          </div>
          <div class="to-img">
            <p>已授权</p>
            <img src="~@/assets/images/super-crm/wx-member/sqjt.png" alt="tupian" />
          </div>
          <div class="get-img">
            <img src="~@/assets/images/super-crm/wx-member/logo.png" alt="tupian" />
            <p>金千枝</p>
          </div>
        </div>
        <div v-if="!isGet" class="get-btn">
          <el-button type="success" @click="reGetPerssion">重新授权</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="微信支付" name="3">
        <el-form ref="form" class="form" :model="form" label-width="140px" style="width:572px">
          <el-form-item label="商户ID：">
            <el-input v-model="form.mchId"></el-input>
          </el-form-item>
          <el-form-item label="合作密钥：">
            <el-input v-model="form.paternerKey"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="subCompanyKeyInfo" type="primary">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <PoupBox @cancel="poupCancel" title="公众号授权" v-model="qrShow">
      <div slot="body" class="poup-body">
        <div class="modal-content" v-if="true">
          <canvas id="canvas-qr"></canvas>
          <p>请使用公众号绑定得管理员个人微信号扫描</p>
        </div>
        <div class="modal-content" v-else>
          <i class="el-icon-success"></i>
          <p style="font-size: 20px;">授权成功</p>
        </div>
      </div>
      <div slot="footer"></div>
    </PoupBox>
  </article>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
  getWxCompanyKeyInfo,
  subCompanyKeyInfo,
  getCompanyKeyPerssionInfo
} from '@/api/super-crm/wx-params-set'
import user from '@/utils/user'
import QRious from 'qrious'
import PoupBox from '@/components/PoupBox.vue'

function ajaxMethods(url: string) {
  return new Promise(resolve => {
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
    PoupBox
  }
})
export default class WxBind extends Vue {
  private activeName: string = '1'
  private form = {
    publicName: '',
    publicId: '',
    publicAppid: '',
    mchId: '',
    paternerKey: '',
    publicAppsecret: '',
    publicType: ''
  }
  private isGet: boolean = true
  private customer = {
    img: '',
    name: ''
  }
  private qrShow: boolean = false
  private timer: any

  private mounted() {
    getWxCompanyKeyInfo().then((res: any) => {
      if (res.data) {
        this.form = {
          publicAppid: res.data.publicAppid,
          publicName: res.data.publicName,
          publicType: res.data.publicType,
          publicAppsecret: res.data.publicAppsecret,
          publicId: res.data.publicId,
          mchId: res.data.mchId,
          paternerKey: res.data.paternerKey
        }
      }
    })
    this.getPerssionInfo()
  }

  private subCompanyKeyInfo() {
    const params = {
      publicAppid: this.form.publicAppid,
      publicName: this.form.publicName,
      publicType: this.form.publicType,
      publicAppsecret: this.form.publicAppsecret,
      publicId: this.form.publicId,
      mchId: this.form.mchId,
      paternerKey: this.form.paternerKey
    }
    subCompanyKeyInfo(params).then((res: any) => {
      this.$message({
        type: 'success',
        message: '保存成功！'
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

  private reGetPerssion() {
    this.qrShow = true
    this.$nextTick(() => {
      const params = {
        element: document.getElementById('canvas-qr'),
        value: `${VUE_APP_BASE_API}/wx-interface-web/wtppa/auth/${user.serverUser.account.companyKey}?t=wx`,
        size: 240
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
}
</style>