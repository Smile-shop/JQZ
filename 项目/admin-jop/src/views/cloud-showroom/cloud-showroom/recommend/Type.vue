<template>
  <div class="type">
    <set-layout>
      <div slot="preview">
        <preview
          :type="formData.list"
          tabIndex="type"
        />
      </div>
      <div slot="set">
        <div class="type-set">
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
                <input type="file" accept="image/*" @change="onFileInputChange($event, index)">
              </div>
              <div class="glink">
                 <dt style="margin-bottom:5px">
                  关联方式
                </dt>
                 <el-radio-group v-model="item.relevanceType">
                  <el-radio :label="'CAT'">分类跳转</el-radio>
                  <el-radio :label="'EXT'" class="class-radio">外部链接</el-radio>
                </el-radio-group>
                <div v-if="item.relevanceType=='CAT'" class="class-cascader">
                  <el-cascader
                    v-model="item.checkedType"
                    :options="typeList"
                    clearable
                    change-on-select
                  >
                  </el-cascader>
                </div>
                <div v-if="item.relevanceType=='EXT'" class="class-input">
                    <el-input style="margin-top:10px" v-model="item.outName" placeholder="请输入外部链接名称" maxlength="6"></el-input>
                    <el-input style="margin-top:10px" v-model="item.outAppId" placeholder="请输入小程序App id"></el-input>
                    <el-input style="margin-top:10px" v-model="item.outUrl" placeholder="请输入路径地址"></el-input>
                </div>
              </div>
              <div class="edit">
                <el-button
                  size="small"
                  type="warning"
                  @click="deleteRow(index)"
                >
                  删除
                </el-button>
              </div>
            </li>
          </draggable>
          <el-button
            v-show="formData.list.length <= 9"
            class="add"
            @click="addRow"
          >
            添加行
          </el-button>
          <el-button
            type="primary"
            class="submit"
            @click="updateClassifiedRecommend"
          >
            提交
          </el-button>
        </div>
        <dl class="explain">
          <dt>
            说明：
          </dt>
          <dd>
            1.图片尺寸建议：1:1正方形，100K以内<br/>
            2.请填写正确的外部链接信息，若填写错误则不跳转<br/>
            3.外部链接名称不得超过6个字<br/>
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
import { queryClassifiedRecommend, updateClassifiedRecommend, delClassifiedRecommend } from '@/api/super-crm/cloud-showroom-recommend';
import { getDisplay } from '@/api/super-crm/csr-classifySearch';

@Component({
  components: {
    SetLayout,
    Preview,
    draggable
  }
})
export default class Carousel extends Vue {
  formData: {
    list: any[]
  } = {
    list: [
      {
        classIdentification: null, // 大类
        pictureUrl: null, // 图片地址
        subclassId: null, // 子类id
        relevanceType: 'CAT',
        outName: null,
        outAppId: '',
        outUrl: '',
        checkedType: [],
        status: 1
      }
    ]
  }

  typeList: any[] = [];

  deletedList: any[] = [];

  mounted() {
    this.queryClassifiedRecommend();
    this.getTypeList();
  }

  // 添加行
  addRow() {
    this.formData.list.push({
      classIdentification: null, // 大类
      pictureUrl: null, // 图片地址
      subclassId: null, // 子类id
      relevanceType: 'CAT',
      outAppId: '',
      outUrl: '',
      checkedType: [],
      status: 1
    })
  }

  // 删除行
  async deleteRow(index: number) {
    this.formData.list.splice(index, 1);
  }

  // 删除行
  /* async deleteRow(index: number) {
    const body = {
      ...this.formData.list[index]
    }

    if (body.id != undefined) {
      const res = await delClassifiedRecommend(body);
    }
    this.formData.list.splice(index, 1);

    this.$message.success('删除成功');
  } */

  // 查询列表
  async queryClassifiedRecommend() {
    const body = {};

    const { data } = await queryClassifiedRecommend(body);

    if (data instanceof Array) {
      this.formData.list = data.map((value) => {
        value.checkedType = [value.classIdentification, value.subclassId];
        return value;
      });
    }
  }

  // 更新列表
  async updateClassifiedRecommend() {
    let isEmpty = false;
    const body = this.formData.list.map((value, index) => {
      const [first, second] = value.checkedType;
      value.outName = value.outName ? value.outName.trim() : ''
      value.outAppId = value.outAppId ? value.outAppId.trim() : ''
      value.outUrl = value.outUrl ? value.outUrl.trim() : ''
      if (value.relevanceType == 'CAT') {
          value.classIdentification = first || null;
      }
      value.subclassId = second || null;
      value.sequence = index;
      if (value.relevanceType == 'CAT' && (!value.checkedType.length)) {
          isEmpty = true;
      }
      if (value.relevanceType == 'EXT' && (value.outAppId == '' || value.outUrl == '' || value.outName == '')) {
          isEmpty = true;
      }
      return value;
    });

    if (isEmpty) {
      this.$message.warning('请正确选择或填写完整类型');
      return Promise.reject('请正确选择或填写完整类型');
    } else {
      const res = await updateClassifiedRecommend(body);
      this.$message.success('提交成功');
      this.queryClassifiedRecommend();
    }
  }

  // 上传文件
  async onFileInputChange(event: Event, index: number) {
    const url = await uploadImage(event);
    this.formData.list[index].pictureUrl = url;
  }

  // 获取分类
  async getTypeList() {
    const body = {}

    const {data} = await getDisplay(body);
    if (data instanceof Array) {
      const filterData = data.filter((value) => {
        return value.type == 1;
      });

      this.typeList = filterData.map((value, index) => {
        return {
          value: value.identification,
          label: value.alias || value.original,
          children: value.subclassList instanceof Array ? value.subclassList.map((value: any) => {
            return {
              value: value.primarySubclassId,
              label: value.aliasSubclass || value.originalSubclass,
            }
          }) : []
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .type {
    .type-set {
      > ul {
        margin-bottom: 20px;

        > li {
          display: flex;
          justify-content: space-between;
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
            width: 70px;
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
              color: #FFFFFF;
            }

            > input[type=file] {
              z-index: 1000;
              position: absolute;
              height: 70px;
              width: 70px;
              top: 0;
              left: 0;
              opacity: 0;
              background-color: red;
            }
          }
          > .glink {
            align-items: center;
            flex-grow: 1;

            > .el-select {
              &:not(:last-of-type) {
                margin-right: 20px;
              }
            }
          }
          // > .info {
          //   display: flex;
          //   align-items: center;
          //   flex-grow: 1;

          //   > .el-select {
          //     &:not(:last-of-type) {
          //       margin-right: 20px;
          //     }
          //   }
          // }
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
    .class-radio{
        margin-left: 120px;
    }
    .class-cascader{
         margin-top: 10px;
         display: flex;
    }
    .class-input{
       margin-left: 220px;
       width: 300px;
    }
  }
</style>
