<template>
  <div class="custom-class">
    <div class="header">
      <p>自定义分类</p>
    </div>
    <div>
      <a-form-model
        ref="ruleForm"
        :model="initData.form"
        :rules="initData.rules"
        :label-col="initData.labelCol"
        :wrapper-col="initData.wrapperCol"
      >
        <a-form-model-item ref="level" label="分类级别：" prop="level" >
          <a-radio-group name="radioGroup" :default-value="1" v-model="initData.form.level" :disabled="(data&&data.use&&edtype==1)" @change="onChange">
            <a-radio :value="1">一级分类</a-radio>
            <a-radio :value="2">二级分类</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="name" label="分类名称：" prop="name">
          <a-input
             style="width:400px"
            :disabled="(data&&data.use&&edtype==1)"
            v-model="initData.form.name"
            placeholder="请输入分类名称"
          />
          <div class="des-font" v-if="initData.form.level==1" >说明：商品的一级分类名称；仅支持汉字、英文、数字；最多输入6个字。</div>
          <div class="des-font" v-else>说明：商品的二级分类名称；仅支持汉字、英文、数字，最多输入6个字。</div>
        </a-form-model-item>
        <template v-if="initData.form.level==1">
            <a-form-model-item ref="imgUrl" label="分类主图">
                <div v-if="initData.imgUrl1!=''" class="img-form-box-div">
                  <img class="img-box" :src="initData.imgUrl1"/>
                  <a-icon type="close-circle" class="img-icon" @click="handDel()"/>
                </div>
                <a-upload
                    :headers="headers"
                    list-type="picture-card"
                    class="avatar-uploader"
                    accept=".jpg, .jpeg, .png"
                    :show-upload-list="false"
                    :action="initData.uploadAction"
                    :before-upload="beforeUpload"
                    @change="handleChange"
                  >
                    <div v-if="initData.imgUrl1==''">
                      <a-icon :type="initData.loading ? 'loading' : 'plus'" />
                    </div>
                </a-upload>
              <div class="des-font">说明：一级分类主图片，尺寸建议为514x228，大小500K以内；仅可上传1张图片。</div>
            </a-form-model-item>
        </template>
        <template v-else>
            <a-form-model-item ref="imgUrl" label="分类图标" prop="imgUrl">
                <div v-if="initData.imgUrl2!=''" class="img-form-box-div">
                  <img class="img-box" :src="initData.imgUrl2"/>
                  <a-icon type="close-circle" class="img-icon" @click="handDel()"/>
                </div>
                <a-upload
                    :headers="headers"
                    list-type="picture-card"
                    class="avatar-uploader"
                    accept=".jpg, .jpeg, .png"
                    :show-upload-list="false"
                    :action="initData.uploadAction"
                    :before-upload="beforeUpload"
                    @change="handleChange"
                  >
                    <div v-if="initData.imgUrl2==''">
                      <a-icon :type="initData.loading ? 'loading' : 'plus'" />
                    </div>
                </a-upload>
                <div class="des-font">说明：二级分类图标，尺寸建议为150x150，1:1正方形图片，大小300K以内；仅可上传1张图片。</div>
            </a-form-model-item>
        </template>
      </a-form-model>
      <!-- 提示确认框 -->
      <a-modal centered v-model="initData.visible" :title="initData.comfirms.title" @ok="handleOk" @cancel="handleCancel">
        <p>{{initData.comfirms.content}}</p>
      </a-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, computed } from '@vue/composition-api';
import { upLoadImage, imgAction } from '@/api/common/image';
import store from '@/store/index';
export default defineComponent({
  props: {
    data: {
      type: Object,
      value: null
    },
    edtype: {
      type: Number,
      value: 0
    }
  },
  setup(props, context) {
    const token = localStorage.getItem('token');
    const initData = reactive({
      // 确认框
      visible: false,
      comfirms: {
        title: '',
        content: ''
      },
      uploadAction: imgAction,
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
      loading: false,
      form: { name: '', imgUrl: '', level: 1 } as any,
      imgUrl1: '',
      imgUrl2: '',
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { max: 6, message: '最多6个字', trigger: 'blur' },
          { pattern: '^[\u4e00-\u9fa5-a-zA-Z0-9]+$', message: '分类名称仅支持文字、数字、英文', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        imgUrl: [
          { required: true, message: '请提交分类图标', trigger: 'blur' }
        ]
      }
    });
    const beforeUpload = (file:any) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        context.root.$message.error('上传图片格式JPG或者PNG!');
      }
      const isLt300k = file.size / 1024 < 300;
      const isLt500k = file.size / 1024 < 500;
      const isLt = (initData.form.level === 1) ? isLt500k : isLt300k;
      const isLtStr = (initData.form.level === 1) ? '500k' : '300k';
      if (!isLt) {
        context.root.$message.error('图片大小需控制在' + isLtStr + '以内!');
      }
      return isJpgOrPng && isLt;
    };
    const handleChange = (info:any) => {
      if (info.file.status === 'uploading') {
        initData.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        if (info.file.response) {
          if (initData.form.level === 1) {
            initData.imgUrl1 = info.file.response.data.imgFullPathUrl;
            initData.form.imgUrl = info.file.response.data.imgFullPathUrl;
          } else {
            initData.imgUrl2 = info.file.response.data.imgFullPathUrl;
            initData.form.imgUrl = info.file.response.data.imgFullPathUrl;
          }
          initData.loading = false;
        }
      }
    };
    onMounted(() => {
      if (props.data) {
        initData.form = Object.assign({}, props.data);
        if (initData.form.level === 1) {
          initData.imgUrl1 = initData.form.imgUrl;
        } else {
          initData.imgUrl2 = initData.form.imgUrl;
        }
        if (props.edtype === 2) {
          initData.form.name = '';
        }
      }
    });
    const handDel = () => {
      initData.visible = true;
      initData.comfirms.title = '';
      initData.comfirms.content = '是否删除图片？';
    }

    // 确认方法
    const handleOk = (e: any) => {
      initData.visible = false;
      if (initData.form.level === 1) {
        initData.imgUrl1 = '';
      } else {
        initData.imgUrl2 = '';
      }
      initData.form.imgUrl = '';
    }
    // 取消方法
    const handleCancel = () => {
      initData.visible = false;
    }

    const onChange = () => {
      if (initData.form.level === 1) {
        initData.form.imgUrl = initData.imgUrl1;
      } else {
        initData.form.imgUrl = initData.imgUrl2;
      }
    }
    const headers = computed(() => { return { epid: store.state.user.epid } })
    return {
      initData,
      beforeUpload,
      handleChange,
      headers,
      handDel,
      onChange,
      handleOk,
      handleCancel
    };
  }
})
</script>

<style lang="scss" scoped>
.custom-class {
  .header {
    width: 100%;
    box-sizing: border-box;
    background: #F5F7FA;
    padding-left: 12px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin: 24px 0;
    p {
      color: #263446;
      padding-left: 8px;
      border-left: 3px solid #0045FF;
      margin: 0;
    }
  }
}
.des-font{
  font-size:14px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(128,134,157,1);
  line-height:20px;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
  .img-form-box-div {
    width: 100px;
    height: 100px;
    margin-top: 5px;
    margin-right: 5px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  .img-icon{
    position: absolute;
    right: -2px;
    top: -2px;
    z-index: 2;
  }
}
</style>
