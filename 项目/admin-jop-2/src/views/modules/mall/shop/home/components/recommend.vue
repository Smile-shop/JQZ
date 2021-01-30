<template>
  <div class="recommend">
    <div class="section-1">
      <h3>
        推荐位
      </h3>
      <a-form-model
        ref="form"
        :model="data.form"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 10 }"
      >
        <a-form-model-item label="推荐位设置" prop="visible">
          <a-radio-group v-model="data.form.visible">
            <a-radio value="Y">
              开启推荐位
            </a-radio>
            <a-radio value="N">
              隐藏推荐位
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="推荐位标题" prop="title">
          <a-input :max-length="20" v-model="data.form.title" />
        </a-form-model-item>
        <a-form-model-item v-show="kind === 'RCD1'" label="推荐位图片">
          <div class="img-box">
            <img
              v-if="data.form.imgUrl"
              :src="data.form.imgUrl"
              alt="推荐位图片"
            >
            <div @click="removeRecomendImage" class="close">
              <i class="iconfont icon-close">
              </i>
            </div>
          </div>
          <app-upload
            @uploadSuccess="onUploadSuccess"
            :size="500000"
            :isUploadAgain="data.form.imgUrl !== ''"
          />
          <p>
            说明：jpg/png   不能超过500k
          </p>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 10, offset: 4 }">
          <a-button
            type="primary"
            @click="onSubmit"
          >
            保存
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>

    <div class="section-2">
      <h3>
        推荐位商品
      </h3>
      <page-table>
        <template #buttons>
          <a-button
            type="primary"
            @click="data.isShowAddProductDialog = true;"
          >
            点击添加
          </a-button>
        </template>
        <!-- 表格 -->
        <a-table
          :columns="data.columns"
          :data-source="data.datas"
          :pagination="data.pagination"
          :row-selection="{ selectedRowKeys: data.selectedRowKeys, onChange: onSelectChange }"
          row-key="id"
          @change="tableChange"
        >
          <template #operation="id, item">
            <a-popconfirm
              title="确定要删除吗?"
              @confirm="onDelete([item.id])"
            >
              <a href="javascript:;">
                <i class="iconfont icon-delete"></i>
              </a>
            </a-popconfirm>
          </template>
          <template #imgUrl="text">
            <img class="product-image" :src="text" alt="图片">
          </template>
          <template #cateIdLevel1Name="id, item">
            {{item.cateIdLevel1Name}}{{item.cateIdLevel2Name || ``}}
          </template>
          <template #footer>
            <a-popconfirm
              title="确定要删除吗?"
              :disabled="data.selectedRowKeys.length === 0"
              @confirm="onDelete(data.selectedRowKeys)"
            >
              <a-button
                :disabled="data.selectedRowKeys.length === 0"
              >
                批量删除
              </a-button>
            </a-popconfirm>
          </template>
        </a-table>
      </page-table>
    </div>

    <select-products
      :recommandKind="kind"
      v-model="data.isShowAddProductDialog"
      @confirm="addData"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, watch } from '@vue/composition-api';
import AppUpload from '@/components/app-upload.vue';
import {
  addSpuRecommandation,
  delSpuRecommandationById,
  getRecommandationByKind,
  queryAllRecommandationList,
  querySpuPageByRecommandation,
  querySpuRecommandationPage,
  updateRecommandation,
} from '@/api/modules/mall/shop-setting';
import { message } from 'ant-design-vue';
import PageTable from '@/layout/page-table.vue';
import SelectProducts from './select-products.vue';
import { confirmMessage } from '@/utils/modal';

interface Data {
}

export default defineComponent({
  components: {
    AppUpload,
    PageTable,
    SelectProducts
  },
  props: {
    kind: {
      type: String,
      default: 'RCD1'
    }
  },
  setup(props, { emit }) {
    const data = reactive({
      form: {
        imgUrl: '',
        kind: props.kind,
        title: '',
        visible: 'Y',
        remark: '',
        id: '',
      },
      datas: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showTotal(total: number) {
          return `共${total}条`
        },
        showSizeChanger: true
      },
      selectedRowKeys: [],
      columns: [
        {
          title: '商品图片',
          dataIndex: 'imgUrl',
          scopedSlots: { customRender: 'imgUrl' },
        },
        {
          title: '商品标题',
          dataIndex: 'title',
        },
        {
          title: '上架',
          dataIndex: 'statusStr',
        },
        {
          title: '类型',
          dataIndex: 'cateIdLevel1Name',
          scopedSlots: { customRender: 'cateIdLevel1Name' },
        },
        {
          title: '操作',
          dataIndex: 'id',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      isShowAddProductDialog: false,
    });

    watch(() => data.form, (value) => {
      if (props.kind === 'RCD1') {
        emit('setComponentsData', 'homeRecommendOne', {
          info: data.form,
          list: data.datas,
        });
      }

      if (props.kind === 'RCD2') {
        emit('setComponentsData', 'homeRecommendTwo', {
          info: data.form,
          list: data.datas,
        });
      }
    })

    watch(() => data.datas, (value) => {
      if (props.kind === 'RCD1') {
        emit('setComponentsData', 'homeRecommendOne', {
          info: data.form,
          list: data.datas,
        });
      }

      if (props.kind === 'RCD2') {
        emit('setComponentsData', 'homeRecommendTwo', {
          info: data.form,
          list: data.datas,
        });
      }
    })

    // 获取表单
    async function getForm() {
      const body = {
        kind: props.kind
      };

      const res = await getRecommandationByKind(body);

      data.form = res;
    }

    // 获取列表信息
    async function getDatas() {
      const body = {
        rcdId: data.form.id,
        curPage: data.pagination.current,
        pageSize: data.pagination.pageSize,
      }

      const res = await querySpuRecommandationPage(body);
      data.pagination.total = res.totalRecord;
      data.datas = res.records;
    }

    function onUploadSuccess(url: string) {
      data.form.imgUrl = url;
    }

    // 更新表单
    async function updateForm() {
      const body = data.form;

      await updateRecommandation(body);
      message.success('修改成功');
    }

    // 提交
    async function onSubmit() {
      updateForm();
    }

    // 删除
    async function onDelete(ids: string[]) {
      const body = ids;

      await delSpuRecommandationById(body);
      message.success('删除成功');
      getDatas();
    }

    // 多选
    function onSelectChange(selectedRowKeys: never[], b: any) {
      data.selectedRowKeys = selectedRowKeys;
    }

    function tableChange(pagination: any, filters: any, sorter: any) {
      const { current, pageSize } = pagination;

      data.pagination.current = current;
      data.pagination.pageSize = pageSize;
      getDatas();
    }

    // 删除推荐位图片
    async function removeRecomendImage() {
      data.form.imgUrl = '';
    }

    async function init() {
      await getForm();
      getDatas();
    }

    async function addData(datas: any[]) {
      if (datas.length) {
        const body = {
          rcdKindList: [
            {
              rcdKind: props.kind
            }
          ],
          spuIdList: datas
        }

        await addSpuRecommandation(body);
        getDatas();
        message.success('添加成功');
      }
    }

    onMounted(() => {
      init();
    })

    return {
      data,
      onSubmit,
      onUploadSuccess,
      getDatas,
      updateForm,
      onSelectChange,
      tableChange,
      onDelete,
      addData,
      removeRecomendImage,
    };
  },
});
</script>

<style lang="scss" scoped>
.recommend {
  h3 {
    margin-bottom: 20px;
    font-size: 16px;
  }

  .img-box {
    position: relative;
    display: inline-block;
    margin-right: 20px;

    &:hover {
      & > .close {
        visibility: unset;
      }
    }

    > img {
      height: 80px;
      width: 80px;
      object-fit: contain;
      object-position: center center;
    }

    > .close {
      visibility: hidden;
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 0;
      height: 30px;
      width: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      background-color: #eee;
    }
  }

  .section-2 {
    .product-image {
      width: 80px;
      height: auto;
    }
  }
}
</style>
