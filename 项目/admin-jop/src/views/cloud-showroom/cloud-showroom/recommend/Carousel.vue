<template>
  <div class="carousel">
    <set-layout>
      <div slot="preview">
        <preview
          :carousel="formData.list"
          tabIndex="carousel"
        />
      </div>
      <div slot="set">
        <div class="carousel-set">
          <draggable
            v-model="formData.list"
            tag="ul"
          >
            <li
              v-for="(item, index) of formData.list"
              :key="index"
            >
              <div class="sort" title="移动">
                <i class="iconfont el-icon-rank"></i>
              </div>
              <div class="index">
                {{index + 1}}
              </div>
              <div class="img-upload">
                <img
                  v-if="item.pictureUrl"
                  :src="item.pictureUrl"
                  alt="图片"
                >
                <i
                  class="iconfont el-icon-upload"
                >
                </i>
                <input
                  type="file"
                  accept="image/*"
                  @change="onFileInputChange($event, index)"
                >
              </div>
              <div class="info">
                <div>
                  <input
                    maxlength="20"
                    type="text"
                    v-model="item.title"
                    placeholder="备注, 备注不对外展示"
                  >
                </div>
                <div>
                  <input
                    type="text"
                    v-model="item.rederectUrl"
                    @blur="checkIsInsideLink($event, index)"
                    placeholder="内部链接"
                  >
                  <p class="remark">
                    <router-link
                      :to="{
                        path: '/super-crm/cloud-showroom/shelves',
                        query: {
                          index: 'second'
                        }
                      }"
                    >
                      请前往已上架列表复制商品编码，手动粘贴内部链接
                    </router-link>
                  </p>
                </div>
              </div>
              <div class="edit">
                <!-- <el-button
                  size="small"
                  type="primary"
                  @click="onPasteID(index)"
                >
                  粘贴商品编码
                </el-button> -->
                <el-button
                  size="small"
                  type="warning"
                  @click="deleteShowPictures(index)"
                >
                  删除
                </el-button>
              </div>
            </li>
          </draggable>
          <el-button
            v-show="formData.list.length <= 5"
            class="add"
            @click="addRow"
          >
            添加行
          </el-button>
          <el-button
            type="primary"
            class="submit"
            @click="updateShowPictures"
          >
            提交
          </el-button>
        </div>
        <dl class="explain">
          <dt>
            说明：
          </dt>
          <dd>
            1. 由于微信小程序限制，暂不支持外部链接跳转；
          </dd>
          <dd>
            2. 图片尺寸建议：7：4，400K以内。
          </dd>
        </dl>
      </div>
    </set-layout>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import SetLayout from '../page-settings/components/SetLayout.vue';
import Preview from '../page-settings/components/Preview.vue';
import draggable from 'vuedraggable'
import { uploadImage } from '@/utils/uploadImage';
import { queryShowPictures, updateShowPictures, deleteShowPictures } from '@/api/super-crm/cloud-showroom-recommend';
import { readText } from '@/utils/copyText';

@Component({
  components: {
    SetLayout,
    Preview,
    draggable
  }
})
export default class Carousel extends Vue {
  formData: any = {
    list: [
      {
        pictureUrl: '',
        title: '',
        rederectUrl: '',
        status: 1
      }
    ]
  }

  mounted() {
    this.queryShowPictures();
  }

  addRow() {
    this.formData.list.push({
      pictureUrl: '',
      title: '',
      rederectUrl: '',
      status: 1
    })
  }

  // 粘贴商品id
  async onPasteID(index: number) {
    try {
      const text = await readText();
      this.formData.list[index].rederectUrl = text;
    } catch (error) {
      this.$message.warning(error);
    }
  }

  // 选中文件后上传
  async onFileInputChange(event: Event, index: number) {
    const { target } = event;

    if (target) {
      const inputElement = target as HTMLInputElement;
      const file = inputElement.files ? inputElement.files[0] : null;

      if (file) {
        if (file.size / 1024 <= 400) {
          const url = await uploadImage(event);
          this.formData.list[index].pictureUrl = url;
        } else {
          this.$message.warning('文件大于400k, 请压缩后再上传');
        }

        inputElement.value = '';
      } else {
        this.$message.warning('没有文件');
      }
    }
  }

  // 查询列表
  async queryShowPictures() {
    const body = {};

    const res = await queryShowPictures(body);
    this.formData.list = res.data || [];
  }

  // 更新列表
  async updateShowPictures() {
    const hasPictureUrl = this.formData.list.every((value: any) => {
      return value.pictureUrl != '';
    })

    if (hasPictureUrl) {
      const body = this.formData.list.map((value: any, index: number) => {
        value.sequence = index;
        return value;
      });

      const { data } = await updateShowPictures(body);
      const { failedSequences } = data;

      if (failedSequences instanceof Array && failedSequences.length) {
        const text = `提交成功，但第${failedSequences.join('，')}条内部链接错误`
        this.$message.warning(text);
      } else {
        this.$message.success('提交成功');
      }
      this.queryShowPictures();
    } else {
      this.$message.warning('轮播图需要上传图片');
    }
  }

  // 删除轮播图
  async deleteShowPictures(index: number) {
    this.formData.list.splice(index, 1);
  }

  // 检查是否为内部链接
  checkIsInsideLink(event: any, index: number) {
    const input: HTMLInputElement = event.target;
    const regexp = /(http|https|www|\.)/i;
    const notPass = regexp.test(input.value)

    if (notPass) {
      this.formData.list[index].rederectUrl = '';
      this.$message.warning('不能输入外部链接');
    }
  }
}
</script>

<style lang="scss" scoped>
  .carousel {
    .carousel-set {
      > ul {
        width: 100%;
        margin-bottom: 20px;

        > li {
          display: flex;
          align-items: center;
          background:rgba(255,255,255,1);
          box-shadow:0px 2px 18px 0px rgba(102,125,205,0.18);
          border-radius:8px;
          padding: 20px 15px;

          &:not(:last-of-type) {
            margin-bottom: 15px;
          }

          & > div:not(:last-of-type) {
            margin-right: 20px;
          }

          > .sort {
            cursor: move;
          }

          > .index {
            color: #40445C;
            font-size: 14px;
          }

          > .img-upload {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            flex-shrink: 0;
            height: 70px;
            width: 170px;
            background:rgba(245,245,250,1);

            > img {
              height: 100%;
              width: 100%;
              object-fit: cover;
              object-position: center center;
            }

            > .iconfont {
              z-index: 100;
              position: absolute;
              font-size: 40px;
              color: #DBDBE3;
            }

            > input[type=file] {
              z-index: 1000;
              position: absolute;
              height: 70px;
              width: 170px;
              top: 0;
              left: 0;
              opacity: 0;
              background-color: red;
            }
          }

          > .info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 80px;

            > div {
              display: flex;
              flex-direction: column;

              > label {
                width: 65px;
                color: #7E869F;
                font-size: 12px;
              }

              > input {
                background:rgba(255,255,255,1);
                border-radius:4px;
                border:1px solid rgba(217,217,217,1);
                outline: none;
                font-size: 12px;
                padding: 5px;
                flex-grow: 1;
              }

              > .remark {
                font-size: 12px;
              }
            }
          }

          > .edit {
            display: flex;
            justify-content: flex-end;
            flex-grow: 1;
          }
        }
      }

      > .add {
        margin-bottom: 20px;
        width: 100%;
      }

      > .submit {
        margin: 0 0 20px 0;
      }
    }

    .explain {
      color: #40445C;
      line-height: 2;

      dt {
        font-size: 14px;
      }

      dd {
        font-size: 12px;
      }
    }
  }
</style>
