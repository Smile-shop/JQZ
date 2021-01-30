<template>
  <div class="set-plan">
    <!-- <div class="view-mobile"></div> -->
    <div class="set-warpper">
      <el-form ref="form" :model="form" label-width="80px" label-position="left">
        <el-form-item label="方案名称" required>
          <el-col :span="8">
            <el-input v-model="form.scheme"></el-input>
          </el-col> 
        </el-form-item>
        <el-form-item label="轮播图">
          <el-upload
            :show-file-list="false"
            :headers="uploadHeaders"
            :on-success="uploadPicSuccessHandle"
            :action="baseURL+'\/jop-marketing-web\/market\/upload'"
          >
            <el-button type="primary">上传图片</el-button>
            <div slot="tip" class="el-upload__tip">图片格式：*jpg、png，尺寸：宽722px*192px</div>
          </el-upload>
        </el-form-item>
        <el-form-item label>
          <el-col :span="24">
            <el-table :data="form.advertistings" border>
              <el-table-column width="375" label="广告图" header-align="center" align="center">
                <template slot-scope="props">
                  <img :src="props.row.advertisingImg" style="height: 100px;width: 375px;" alt />
                </template>
              </el-table-column>
              <el-table-column label="链接网址" header-align="center" align="center">
                <template slot-scope="props">
                  <el-input v-model="props.row.advertisingLink" prefix-icon="el-icon-link"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                label="排序"
                width="120"
                header-align="center"
                align="center"
              >
                <template slot-scope="props">
                  <el-button
                    type="primary"
                    icon="el-icon-caret-top"
                    circle
                    :disabled="props.$index === 0"
                    @click="topSort(props.$index)"
                  ></el-button>
                  <el-button
                    type="primary"
                    icon="el-icon-caret-bottom"
                    circle
                    :disabled="props.$index === form.advertistings.length - 1"
                    @click="bottomSort(props.$index)"
                  ></el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                width="120"
                label="操作"
                header-align="center"
                align="center"
              >
                <template slot-scope="props">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    @click="deleteLine(props.$index)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-form-item>
        <el-form-item label>
          <el-checkbox v-model="form.integralIsShow" true-label="1" false-label="0">显示积分商城</el-checkbox>
          <el-checkbox v-model="form.smallIsShow" true-label="1" false-label="0">显示微商城商品推荐</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import user from '@/utils/user'
import {
  updateScheme,
  querySchemeInfo
} from '@/api/super-mkt/spread-set/set-plan'
export default {
  data() {
    return {
      baseURL: VUE_APP_BASE_API,
      uploadHeaders: {
        ticket: user.serverUser.ticket,
        companyKey: user.serverUser.account.companyKey,
        accountId: user.serverUser.account.accountId
      },
      form: {
        companyKey: user.serverUser.account.companyKey,
        scheme: '',
        integralIsShow: '1',
        smallIsShow: '1',
        advertistings: []
      }
    }
  },
  created() {
    this._getDetail()
  },
  methods: {
    async _getDetail(options = { id: this.$route.query.id || '' }) {
      if (options.id) {
        const { data, msg } = await querySchemeInfo(options)
        Object.assign(this.form, data)
      }
    },
    _setLine() {
      return {
        creator: null,
        createTime: null,
        modify: null,
        modifyTime: null,
        id: '',
        scheme: '', // 必填
        companyKey: this.uploadHeaders.companyKey,
        advertisingImg: '', // 必填
        advertisingLink: '', // 必填,
        source: null
      }
    },
    topSort(index) {
      const temp = this.form.advertistings[index - 1]
      this.$set(
        this.form.advertistings,
        index - 1,
        this.form.advertistings[index]
      )
      this.$set(this.form.advertistings, index, temp)
    },
    bottomSort(index) {
      const temp = this.form.advertistings[index + 1]
      this.$set(
        this.form.advertistings,
        index + 1,
        this.form.advertistings[index]
      )
      this.$set(this.form.advertistings, index, temp)
    },
    deleteLine(index) {
      this.form.advertistings.splice(index, 1)
    },
    uploadPicSuccessHandle(response, file, index) {
      const { code, data } = response
      if (code === '0' && data.length) {
        const line = this._setLine()
        line.advertisingImg = data[0]
        line.scheme = this.form.id ? this.form.id : ''

        this.form.advertistings.push(line)
      }
    },
    async onSubmit() {
      try {
        if (this.form.scheme.trim()) {
          const { msg } = await updateScheme(this.form)
          this._getDetail()
          this.$message.success(msg)
          this.$router.go(-1)
        } else {
          this.$message.error('必填字段校验失败，请规范填写！')
        }
      } catch (error) {
        console.log('TCL: onSubmit -> error', error)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.set-plan {
  display: flex;
  .view-mobile {
    width: 369px;
    height: 737px;
    flex-shrink: 0;
    background: url('~@/assets/images/super-crm/mine/test-phone.png') no-repeat
      top center/100%;
  }
  .set-warpper {
    margin-left: 20px;
    // flex-grow: 1;
    width: 70%;
  }
}
</style>
