<template>
  <page-wrapper class="goods-list">
    <!-- 表格组件 -->
    <page-table>
      <!-- 查询表单 -->
      <template #form>
        <div class="goods-box">
          <div class="product-mess">商品信息</div>
          <div @click="goSpecification('1','product-specification')">关联商品</div>
          <div @click="goSpecification('2','product-detail')">商品详情</div>
        </div>
        <title-header titleHeader="基本信息"></title-header>
        <div>
          <a-form-model
          :model="initData.form"
          :label-col="initData.labelCol"
          :wrapper-col="initData.wrapperCol"
          ref="ruleForm"
          :rules="initData.rules"
          class="ruleStyle"
          >
            <a-form-model-item label="商品名称：" prop="title">
              <a-input v-model="initData.form.title" placeholder="请输入商品名称" class="a-width" />
              <p>说明：商品名称；仅支持文字、数字、英文；最多输入30个字。</p>
            </a-form-model-item>
            <a-form-model-item label="一级分类：" prop="cateIdLevel1">
              <a-select placeholder="请选择一级分类" class="a-width" v-model="initData.form.cateIdLevel1" :disabled="initData.id !==  ''  ? true : false">
                <a-select-option :value="item.value" v-for="(item, index) in initData.oneType" :key="index">
                  {{item.label}}
                </a-select-option>
              </a-select>
              <p>说明：商品的一级分类；如果未添加分类，请到分类设置中添加。</p>
            </a-form-model-item>
            <a-form-model-item label="二级分类：" prop="cateIdLevel2">
              <a-select placeholder="请选择二级分类" class="a-width" v-model="initData.form.cateIdLevel2" :disabled="initData.id !==  ''  ? true : false">
                <a-select-option :value="item.value" v-for="(item, index) in initData.twoType" :key="index">
                  {{item.label}}
                </a-select-option>
              </a-select>
              <p>说明：商品的二级分类；如果未添加分类，请到分类设置中添加。</p>
            </a-form-model-item>
            <a-form-model-item label="货品类型：" prop="goodsKind">
              <a-radio-group v-model="initData.form.goodsKind" :disabled="initData.id !== '' ? true : false">
                <a-radio :value="item.value" v-for="(item, index) in initData.allShopList" :key="index">
                  {{item.label}}
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          <a-form-model-item>
            <div class="product-wrap">
              <a-button class="product-back" @click="goBack">返回</a-button>
              <a-button type="primary" @click="toNext">下一步</a-button>
            </div>
          </a-form-model-item>
          </a-form-model>
        </div>
      </template>
    </page-table>
    <!-- 确认弹窗 -->
    <a-modal centered v-model="initData.showModal" title="温馨提示" @ok="okModal">
      <p>商品信息还未保存，确认离开该页？？</p>
    </a-modal>
  </page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from '@vue/composition-api'
import PageTable from '@/layout/page-table.vue';
import titleHeader from './components/search-form/title-header.vue';
import {
  addSpuFirst,
  updateSpu,
  getSpuById
} from '@/api/modules/mall/goods-manage/product-list/index';
import {
  queryRetailCategoryList
} from '@/api/modules/mall/goods-manage/classification/index';
export default defineComponent({
  components: {
    PageTable,
    titleHeader
  },
  setup(props, context) {
    onMounted(() => {
      initData.statusCode = context.root.$route.query.statusCode || 'N' as any;
      initData.id = context.root.$route.query.productId || '' as any;
      if (initData.id !== '') {
        getProductById(initData.id);
      }
      queryCategoryList(1);
      queryCategoryList(2);
    })
    const getProductById = async (id:any) => {
      const product:any = await getSpuById(id);
      initData.form.title = product.title;
      initData.form.cateIdLevel1 = product.cateIdLevel1;
      initData.form.cateIdLevel2 = product.cateIdLevel2;
      initData.form.goodsKind = product.goodsKind;
      initData.addSecond = product.addSecond;
    }
    const queryCategoryList = async (level:number) => {
      const body = { appId: '68594CF2-E947-82FA-84D0-01D4556F9F54', level: level };
      let datalist:any[] = await queryRetailCategoryList(body);
      datalist = datalist.map((item) => {
        return { label: item.name, value: item.id };
      });
      if (level === 1) {
        initData.oneType = datalist;
      } else {
        initData.twoType = datalist;
      }
    }
    const initData = reactive({
      statusCode: 'N', // 获取tabs状态码 N为待上架 Y为已上架
      id: '',
      addSecond: false,
      form: {
        title: '',
        goodsKind: undefined,
        cateIdLevel1: undefined,
        cateIdLevel2: undefined,
      },
      // 货品类型
      allShopList: [
        {
          label: '首饰',
          value: 'JW'
        },
        {
          label: '饰品',
          value: 'JWR'
        },
      ]as any[],
      // 一级分类
      oneType: [] as any[],
      // 二级分类
      twoType: [] as any[],
      showModal: false,
      fileList: [],
      labelCol: { span: 2 },
      wrapperCol: { span: 14 },
      rules: {
        title: [
          {
            required: true, message: '请选择商品名称', trigger: 'blur'
          },
          { min: 2, max: 30, message: '请输入2-30个字', trigger: 'blur' },
          { pattern: '^[\u4e00-\u9fa5-a-zA-Z0-9]+$', message: '商品名称仅支持文字、数字、英文', trigger: 'blur' }
        ],
        cateIdLevel1: [
          {
            required: true, message: '请选择一级分类', trigger: 'change'
          }
        ],
        cateIdLevel2: [
          {
            required: true, message: '请选择二级分类1', trigger: 'change'
          }
        ],
        goodsKind: [
          {
            required: true, message: '请选择货品类型', trigger: 'change'
          }
        ]
      }
    })
    const ruleForm = ref();
    // 去下一步
    const toNext = () => {
      ruleForm.value.validate((valid: any) => {
        if (valid) {
          onGotoSpe();
          return true;
        } else {
          return false;
        }
      })
    }
    const onGotoSpe = async () => {
      let goodsId = '';
      try {
        if (initData.id !== '') {
          await updateSpu({ id: initData.id, title: initData.form.title });
        } else {
          const body = Object.assign({ appId: '68594CF2-E947-82FA-84D0-01D4556F9F54' }, initData.form);
          goodsId = await addSpuFirst(body);
        }
        context.root.$router.push({
          path: 'product-specification',
          query: {
            type: '1',
            id: initData.id ? initData.id : goodsId,
            statusCode: initData.statusCode
          }
        });
      } catch (error) {}
    }

    // 商品规格-商品详情按钮
    const goSpecification = (type:string, path: string) => {
      ruleForm.value.validate((valid: any) => {
        if (valid) {
          if (initData.id === '') {
            context.root.$message.warning('请完成商品信息填写');
            return false;
          }
          if (type === '2' && !initData.addSecond) {
            context.root.$message.warning('请完成商品信息填写');
            return false;
          }
          context.root.$router.push({
            path,
            query: {
              type: type,
              id: initData.id,
              statusCode: initData.statusCode
            }
          })
        } else {
          context.root.$message.warning('请完成商品信息填写');
          return false;
        }
      })
    }
    // 返回
    const goBack = () => {
      if (initData.id === '') {
        if ((initData.form.title === '' && initData.form.goodsKind === undefined && initData.form.cateIdLevel1 === undefined && initData.form.cateIdLevel2 === undefined)) {
          context.root.$router.go(-1);
        } else {
          initData.showModal = true;
        }
      } else {
        context.root.$router.go(-1);
      }
    }
    // 弹窗确认
    const okModal = () => {
      context.root.$router.go(-1);
      initData.showModal = false;
    }
    return {
      initData,
      toNext,
      goBack,
      ruleForm,
      goSpecification,
      okModal
    }
  }
})
</script>

<style lang="scss" scoped>
.goods-list {
  .goods-bread {
    height: 53px;
    margin-bottom: 30px;
    box-shadow:0px 2px 30px 0px rgba(120,148,245,0.1);
    display: flex;
    align-items: center;
    padding-left: 12px;
    margin-top: -29px;
    margin-left: -23px;
  }
  .goods-box {
    display: flex;
    height: 48px;
    border:1px solid rgba(235,238,245,1);
    margin-bottom: 24px;
    div {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #263446;
      font-weight: 500;
      cursor: pointer;
    }
    .product-mess {
      background: #0045FF;
      color: #fff;
    }
  }
  .product-back {
    margin-right: 14px;
  }
  .a-width {
    width: 240px;
  }
  .product-wrap {
    margin-left: 68px;
  }
}
</style>
