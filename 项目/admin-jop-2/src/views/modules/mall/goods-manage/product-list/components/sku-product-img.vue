<template>
    <div>
    <!-- 提示确认框 -->
    <a-modal width="32%" destroyOnClose centered :visible="visible" :title="initData.comfirms.title" @cancel="onCancelHander">
        <vuedraggable class="img-form-box" v-model="initData.fileList">
          <div v-for="(item,index) in initData.fileList" :key="index">
              <div  class="img-form-box-div">
                <img class="img-box" :src="item.url"/>
                <img v-if="index==0" class="img-shoutu" src="@/assets/img/modules/mall/shoutu.png"/>
                <a-icon type="close-circle" class="img-icon" @click="handDel(index)"/>
              </div>
          </div>
                <a-upload
                :headers="headers"
                style="margin-top: 10px;"
                accept=".jpg, .jpeg, .png"
                list-type="picture-card"
                :action="initData.comfirms.action"
                :multiple="true"
                :fileList="initData.fileList"
                :show-upload-list="false"
                :before-upload="beforeUpload"
                @change="handleChange"
              >
                <div v-if="initData.fileList.length < imageNum">
                  <a-icon  :type="initData.loading ? 'loading' : 'plus'" />
                </div>
              </a-upload>
        </vuedraggable>
        <div>
          <p class="sub-title">说明：</p>
          <p class="sub-text">1、最多添加{{imageNum}}张图片，仅支持jpg、png图片格式，第一张图片默认为首图展示，您可以拖动图片改变其显示顺序；</p>
          <p class="sub-text">2、尺寸建议为正方形图片，宽度为750，图片大小控制在500K以内，并保持图片大小一致；</p>
          <p class="sub-text">3、可通过拖拽的方式将桌面的图片添加至图片栏中。</p>
        </div>
        <div class="btn-foop" slot="footer">
            <a-button @click="onCancelHander">取消</a-button>
            <a-button type="primary"  @click="onSavelHander">保存</a-button>
        </div>
    </a-modal>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted, computed } from '@vue/composition-api';
import { imgAction } from '@/api/common/image';
import store from '@/store/index';
import vuedraggable from 'vuedraggable';
export default defineComponent({
  components: {
    vuedraggable: vuedraggable as any
  },
  props: {
    visible: {
      type: Boolean,
      value: false
    },
    imgList: {
      type: Array,
      value: []
    },
    addImgType: {
      type: Number,
      value: 0
    },
    imageNum: {
      type: Number,
      value: 0
    }
  },
  setup(props, context) {
    // 确认框标题
    const initData = reactive({
      loading: false,
      comfirms: {
        title: '添加图片',
        content: '本地图片',
        action: imgAction,
        headers: {
          authorization: 'authorization-text',
        }
      },
      fileList: [] as any[]
    });
    onMounted(() => {
      initData.fileList = (props.imgList as any[]).map((item: any, index:any) => {
        return {
          name: 'image',
          url: item,
          status: 'done',
          uid: -(index + 1)
        }
      });
    });

    const onCancelHander = () => {
      context.emit('onCancelHander');
    };
    const handDel = (index:number) => {
      initData.fileList.splice(index, 1);
    }
    const beforeUpload = (file:any) => {
      const imageNum:number = Number(props.imageNum);
      if (initData.fileList.length >= imageNum) {
        context.root.$message.error('最多添加' + imageNum + '张图片!');
        return false;
      }
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        context.root.$message.error('只支持jpg和png格式的图片!');
        return false;
      }
      const isLt2M = file.size / 1024 > 500;
      if (isLt2M) {
        context.root.$message.error('文件大小不能大于500kb!')
        return false;
      }
    }
    const handleChange = (info: any) => {
      if (info.file.status === 'uploading') {
        initData.loading = true;
      }
      if (info.file.status === 'done') {
        initData.loading = false;
      }
      let fileList = [...info.fileList];
      fileList = fileList.map(file => {
        if (file.response && file.response.data) {
          file.url = file.response.data.imgFullPathUrl
        }
        return file;
      });
      initData.fileList = fileList.filter(item => item.status === 'uploading' || item.status === 'done');
      const imageNum:number = Number(props.imageNum);
      initData.fileList = initData.fileList.splice(0, imageNum);
    };
    const onSavelHander = () => {
      context.emit('onSavelHander', props.addImgType, initData.fileList);
    }
    const headers = computed(() => { return { epid: store.state.user.epid } });
    return { initData, handDel, beforeUpload, onCancelHander, handleChange, onSavelHander, headers }
  }
})
</script>

<style lang="scss" scoped>
.btn-foop{
  text-align: right;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.sub-title{
    margin-bottom: 0px;
    font-size: 12px;
    color: #40445C;
    font-weight: 400;
}
.sub-text{
    margin-bottom: 0px;
    font-size: 12px;
    font-weight: 400;
    color: #40445C;
}
.img-form-box {
  display: grid;
  grid-template-columns: 110px 110px 110px 110px 110px;
  .img-form-box-div {
    width: 100px;
    height: 100px;
    margin-top: 10px;
    margin-right: 10px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  .img-box {
    width: 100%;
    height: 100%;
  }
  .img-icon{
    position: absolute;
    right: -2px;
    top: -2px;
    z-index: 2;
  }
  .img-shoutu{
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 2;
  }
}
}
</style>
