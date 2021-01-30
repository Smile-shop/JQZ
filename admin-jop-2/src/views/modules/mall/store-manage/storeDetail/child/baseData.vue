<template>
  <div class="baseData">
    <a-form-model :model="data.form" label-align="left" :label-col="data.labelCol" :wrapper-col="data.wrapperCol">
      <a-form-model-item label="线上门店名称" required>
        <a-input v-model="data.form.name" :maxLength="40" placeholder="请输入名称" />
      </a-form-model-item>
      <a-form-model-item label="所属分销商">
        <a-input disabled v-model="data.form.distName" />
      </a-form-model-item>
      <a-form-model-item label="地址" required>
        <a-col :span="21">
          <a-input v-model="data.form.address" placeholder="请输入地址">
            <span slot="prefix">
              <img style="width: 12px;" src="@/assets/img/address-icon.png" alt="">
            </span>
          </a-input>
        </a-col>
        <a-col class="baseData-selete">
          <a @click="seleteAddress">选择</a>
        </a-col>
      </a-form-model-item>
      <a-form-model-item label="坐标">
        <a-input disabled v-model="data.form.coordTx" />
      </a-form-model-item>
      <a-form-model-item label="门店简介">
        <a-input v-model="data.form.description" type="textarea" :autoSize="{ minRows: 3, maxRows: 50 }" placeholder="请输入门店简介" counter :maxLength="600" />
        <span class="num">{{data.form.description && data.form.description.length || 0}} / 600</span>
      </a-form-model-item>
      <a-form-model-item label="门店联系电话">
        <a-input v-model="data.form.tel" placeholder="请输入门店联系电话" />
      </a-form-model-item>
      <a-form-model-item label="营业状态">
        <a-radio-group v-model="data.form.status">
          <a-radio value="OPEN">
            正常营业
          </a-radio>
          <a-radio value="CLOSE">
            暂停营业
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="门店logo" required>
        <div class="clearfix">
          <!-- <a-upload
            accept=".jpg, .jpeg, .png"
            multiple
            list-type="picture-card"
            :file-list="data.fileList"
            :before-upload="beforeUpload"
            @preview="handlePreview"
            @change="handleChange"
            :remove="handDel"
            :customRequest="customRequest"
          >
            <div v-if="data.fileList.length < 100">
              <a-icon v-if="!data.loading" type="plus" />
              <a-progress v-else type="circle" :percent="data.percent" :width="60" />
            </div>
          </a-upload> -->
          <a-upload
            accept=".jpg, .jpeg, .png"
            list-type="picture-card"
            :headers="headers"
            :action="data.imgAction"
            :multiple="true"
            @preview="handlePreview"
            :file-list="data.fileList"
            :before-upload="beforeUpload"
            :remove="handDel"
            @change="handleChange"
          >
            <div v-if="data.fileList.length < 1">
              <a-icon v-if="!data.loading" type="plus" />
            </div>
          </a-upload>
          <div style="color: #80869D;font-size: 12px">说明：支持扩展名：.png .jpg，1:1正方形图片，大小100K以内；仅可上传1张图片。</div>
          <a-modal :visible="data.previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="data.previewImage" />
          </a-modal>
        </div>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="data.form.status === 'CLOSE' ? showConfirm() : save()">
          保存
        </a-button>
        <!-- <a-button @click="back" style="margin-left: 10px;">
          取消
        </a-button> -->
      </a-form-model-item>
    </a-form-model>
    <a-modal :visible="data.showMap" width="800px" title="选择地址" @cancel="data.showMap = false">
      <mapContent @getPosition="getPosition" :center="data.center" />
      <div slot="footer">
        <a-button type="primary" @click="confirm">确定</a-button>
        <a-button @click="data.showMap = false">取消</a-button>
      </div>
    </a-modal>
    <a-modal :visible="data.showConfirm" title="提示" @cancel="data.showConfirm = false">
      <span>确定要关闭门店？关闭后所有用户将无法访问查看门店信息。</span>
      <div slot="footer">
        <a-button type="primary" @click="save">确定</a-button>
        <a-button @click="data.showConfirm = false">取消</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref, computed } from '@vue/composition-api'
import PageTable from '@/layout/page-table.vue'
import mapContent from './Tmap.vue'
import router from '@/router'
import store from '@/store/index'
import { queryWithDisByDistId, updateByDisId } from '@/api/modules/mall/store-manage'
import { upLoadImage, imgAction } from '@/api/common/image';
interface dataType {
  [props: string]: any
}
export default defineComponent({
  name: 'BaseData',
  components: { PageTable, mapContent },
  setup(props, context) {
    const data: dataType = reactive({
      loading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        name: '',
        distName: undefined,
        distId: undefined,
        address: undefined,
        coordTx: undefined,
        description: '',
        tel: undefined,
        status: 'OPEN',
        logo: '',
      },
      center: [],
      mapSeleted: {},
      previewVisible: false,
      previewImage: '',
      fileList: [],
      percent: 0,
      active: 0,
      showMap: false,
      showConfirm: false,
      imgAction
    });
    const headers = computed(() => { return { epid: store.state.user.epid } })
    onMounted(() => {
      if (router.currentRoute.query.distId) {
        getStoreDetail(router.currentRoute.query.distId)
      }
    })
    async function getStoreDetail(distId: any) {
      const body = distId
      const res = await queryWithDisByDistId(body)
      res.status = res.status || 'CLOSE'
      data.form = Object.assign({}, data.form, res)
      context.emit('getStoreId', res.id)
      context.emit('getStatus', res.status || 'CLOSE')
      data.fileList = res.imgs.map((item: any) => {
        return {
          name: 'image',
          url: item.url,
          status: 'done',
          uid: item.id
        }
      })
    }
    function confirm() {
      data.showMap = false
      // 腾讯
      data.form.address = (data.mapSeleted as any).detail.nearPois[0].address
      const point = (data.mapSeleted as any).detail.location
      data.form.coordTx = [point.lng, point.lat].join(',')
    }
    function getPosition(val: any) {
      data.mapSeleted = val
    }
    function seleteAddress() {
      data.showMap = true
      setTimeout(() => {
        data.center = (data.form.coordTx && (data.form.coordTx as any).split(',')) || []
      }, 0);
    }
    function back() {
      router.go(-1)
    }
    function change(val: number) {
      data.active = val
    }
    function getBase64(file: any) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }
    function handleCancel() {
      data.previewVisible = false;
    }
    async function handlePreview(file: any) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      data.previewImage = file.url || file.preview;
      data.previewVisible = true;
    }
    const beforeUpload = (file:any) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        context.root.$message.error('只支持jpg和png格式的图片!');
        return false
      }
      const isLt2M = file.size / 1024 > 100;
      if (isLt2M) {
        context.root.$message.error('文件大小不能大于100kb!')
        return false
      }
    }
    async function customRequest(file: any) {
      data.loading = true
      const formData = new FormData()
      formData.append('file', file.file)
      const intervalId = setInterval(() => {
        if (data.percent < 100) {
          data.percent++
        } else {
          clearInterval(intervalId)
        }
      }, 100)
      const res = await upLoadImage(formData)
      data.loading = false
      data.fileList.push({
        uid: String(-Math.random),
        name: 'image',
        status: 'done',
        url: res.imgFullPathUrl,
      })
    }
    function handDel(file: any) {
      data.fileList.splice(data.fileList.findIndex((item: any) => item.url === file.url), 1)
    }
    function checkValue() {
      if (!data.form.name) {
        context.root.$message.error('请输入线上门店名称')
        return false
      } else if (!data.form.address) {
        context.root.$message.error('请输入门店地址')
        return false
      } else if (!data.fileList.length) {
        context.root.$message.error('请上传门店logo')
        return false
      }
      return true
    }
    function showConfirm() {
      if (!checkValue()) {
        return
      }
      data.showConfirm = true
    }
    async function save() {
      if (!checkValue()) {
        return
      }
      const imgs = data.fileList.map((item: any, index: number) => {
        return {
          seq: item.seq ? item.seq : index,
          url: item.url
          // .substring(item.url.lastIndexOf('/') + 1)
          // url: item.url.replace(/^(https|http):\/\/[^/]+\//, '')
        }
      })
      const body = Object.assign({}, data.form, data.mapSeleted?.detail?.addressComponents, { imgs }, { appId: '68594CF2-E947-82FA-84D0-01D4556F9F54' })
      const res = await updateByDisId(body)
      context.root.$message.success('保存成功!')
      context.emit('getStoreId', res)
      context.emit('getStatus', data.form.status)
      data.showConfirm = false
    }
    function handleChange(info: any) {
      let fileList = [...info.fileList];
      fileList = fileList.map(file => {
        if (file.response) {
          file.url = file.response.data.imgFullPathUrl
        }
        return file;
      })
      data.fileList = fileList.filter(item => item.status === 'uploading' || item.status === 'done')
    }
    return {
      data,
      back,
      change,
      handleChange,
      handlePreview,
      beforeUpload,
      handleCancel,
      save,
      getPosition,
      confirm,
      seleteAddress,
      customRequest,
      handDel,
      showConfirm,
      headers
    };
  },
});
</script>

<style lang="scss" scoped>
.baseData{
  max-width: 800px;
  &-selete{
    margin-left: 10px;width: 30px;display: inline-block;
  }
  .num{
    position: absolute;
    right: 10px;
    top: -10px;
    color: #C0C6D1;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }
  ::v-deep .ant-upload-list-item-uploading-text{
    text-align: center;
  }
}
</style>
