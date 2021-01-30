<template>
  <div :class="['app-upload', disabled]">
    <input
      type="file"
      :accept="accept"
      @change="onChange"
      :disabled="disabled"
    >
    <div
      v-if="type === 'button'"
      class="button-type"
    >
      <span v-if="isUploadAgain" class="upload-again">
        重新上传
      </span>

      <span v-else class="upload">
        <i
          v-if="disabled"
          class="iconfont icon-stop"
        >
        </i>
        <i
          v-else-if="data.status === uploadStatus.ready"
          class="iconfont icon-plus"
        >
        </i>
        <i
          v-else-if="data.status === uploadStatus.uploading"
          class="iconfont icon-cloud-upload"
        >
        </i>
      </span>
    </div>
    <div
      v-else-if="type === 'text'"
      class="text-type"
    >
      <i class="iconfont icon-upload"></i>
      {{text}}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api';
import { upLoadImage } from '@/api/common/image';
import { message } from 'ant-design-vue';

interface Data {
  status: uploadStatus;
}

enum uploadStatus {
  ready,
  uploading,
}

export default defineComponent({
  props: {
    // 显示类型分为 'button' | 'text'
    type: {
      type: String,
      default: 'button'
    },
    isUploadAgain: {
      type: Boolean,
      default: false
    },
    // 上传
    text: {
      type: String,
      default: '上传'
    },
    // 接受的格式
    accept: {
      type: String,
      default: 'image/png, image/jpeg, image/jpg'
    },
    // 最大文件大小
    size: {
      type: Number,
      default: 100000000
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const data = reactive<Data>({
      status: uploadStatus.ready
    })

    async function upload(files: FileList) {
      try {
        const acceptFileTypes = props.accept.split(/,\s*/);
        const canUpload = [...files].every((value, index) => {
          const hasType = acceptFileTypes.includes(value.type);

          if (hasType === false) {
            message.warning(`不支持该格式, 请重新选择, 支持的格式为${props.accept}`);
            return false;
          }

          const lessEqualSize = value.size <= props.size;

          if (lessEqualSize === false) {
            message.warning(`文件太大了,请重新选择, 不能超过${(props.size / 1000).toFixed(1)}KB`);
            return false;
          }

          return true;
        });

        if (canUpload) {
          const body = new FormData();
          body.append('file', files[0]);
          data.status = uploadStatus.uploading;

          const res = await upLoadImage(body);
          data.status = uploadStatus.ready;
          context.emit('uploadSuccess', res.imgFullPathUrl);
          message.success('上传成功');
        }
      } catch (error) {
        message.warning('上传失败');
        console.warn(error);
      }
    }

    async function onChange(event: Event) {
      const target = (event.target as HTMLInputElement);
      const files = target.files;

      if (files && files.length) {
        await upload(files);
        target.value = '';
      } else {
        message.warn('文件选择错误');
      }
    }

    return {
      onChange,
      data,
      uploadStatus,
    };
  },
});
</script>

<style lang="scss" scoped>
.app-upload {
  display: inline-block;
  position: relative;

  > input {
    z-index: 1;
    position: absolute;
    opacity: 0;
    display: block;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  > .button-type {
    display: grid;
    place-items: center;
    border: 1px dashed #D6DDEC;
    height: 80px;
    width: 80px;
    background-color: #F7F8FA;

    .iconfont {
      font-size: 30px;
      color: #4C5E75;
    }
  }

  > .text-type {
    display: flex;
    align-items: center;
    color: #0045FF;

    > .iconfont {
      margin-right: 5px;
    }
  }
}
</style>
