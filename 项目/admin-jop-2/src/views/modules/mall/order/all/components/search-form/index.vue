<template>
  <div>
    <a-form-model
      ref="queryFormModel"
      layout="inline"
    >
      <a-form-model-item>
        <a-select v-model="dataInit.formValue.storeId" placeholder="所有门店" class="select-width"  @keyup.enter.native="goSearch">
          <a-select-option value="">所有门店</a-select-option>
          <a-select-option :value="item.value" v-for="(item, index) in dataInit.allShopList" :key="index">
            {{item.label}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <a-select v-model="dataInit.formValue.recvManner" placeholder="订单类型" class="select-width" @keyup.enter.native="goSearch">
          <a-select-option :value="item.value" v-for="(item, index) in dataInit.orderType" :key="index">
            {{item.label}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <a-select v-model="dataInit.formValue.goodsKind" placeholder="所有类型" class="select-width" @keyup.enter.native="goSearch">
          <a-select-option :value="item.value" v-for="(item, index) in dataInit.allType" :key="index">
            {{item.label}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <a-select v-model="dataInit.formValue.cateIdLevel1" placeholder="选择一级分类" class="select-width3" @keyup.enter.native="goSearch">
          <a-select-option value="">请选择一级分类</a-select-option>
          <a-select-option :value="item.value" v-for="(item, index) in dataInit.oneSort" :key="index">
            {{item.label}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <a-select v-model="dataInit.formValue.cateIdLevel2" placeholder="选择二级分类" class="select-width3" @keyup.enter.native="goSearch">
          <a-select-option value="">请选择二级分类</a-select-option>
          <a-select-option :value="item.value" v-for="(item, index) in dataInit.twoSort" :key="index">
            {{item.label}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <a-select default-value="" @change="dateKeySelect" placeholder="时间类型" class="select-width" @keyup.enter.native="goSearch">
          <a-select-option value="">不按时间</a-select-option>
          <a-select-option :value="item.value" v-for="(item, index) in dataInit.timeType" :key="index">
            {{item.label}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <a-range-picker :value="dataInit.pickerTime"   show-time @change="changeDate"/>
      </a-form-model-item>
      <a-form-model-item>
        <a-select v-model="dataInit.formValue.fieldKey" placeholder="请选择" class="select-width select-width2" @keyup.enter.native="goSearch">
          <a-select-option value="">请选择</a-select-option>
          <a-select-option :value="item.value" v-for="(item, index) in dataInit.orderCode" :key="index">
            {{item.label}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <a-input v-model="dataInit.formValue.fieldValue" placeholder="请输入关键词" @keyup.enter.native="goSearch"/>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="goSearch">
          搜索
        </a-button>
      </a-form-model-item>
      <a-form-model-item>
        <a-button>
          导出
        </a-button>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="link" @click="resetFun" @keyup.enter.native="goSearch">
          重置
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive } from '@vue/composition-api';
import {
  queryRetailCategoryList
} from '@/api/modules/mall/goods-manage/classification/index';
import {
  querySelectOrderDate,
  querySelectOrderField,
  querySelectRecMethod
} from '@/api/modules/mall/order-manage/all-order/index';
export default defineComponent({
  props: {
    data: {
      type: String,
    }
  },
  setup(props, context) {
    const dataInit = reactive({
      // 所有门店
      allShopList: [],
      // 订单类型
      orderType: [
        {
          label: '全部类型',
          value: ''
        },
        {
          label: '快递配送',
          value: 'EXP'
        },
        {
          label: '门店自提',
          value: 'DIY'
        }
      ],
      // 一级分类
      allType: [
        {
          label: '所有类型',
          value: ''
        },
        {
          label: '首饰',
          value: 'JW'
        },
        {
          label: '饰品',
          value: 'JWR'
        }
      ],
      // 一级分类
      oneSort: [] as any[],
      // 二级分类
      twoSort: [] as any[],
      // 时间类型
      timeType: [
        {
          label: '不按时间',
          value: '1'
        },
        {
          label: '下单时间',
          value: '2'
        },
        {
          label: '付款时间',
          value: '3'
        },
        {
          label: '发货时间',
          value: '4'
        },
        {
          label: '完成时间',
          value: '5'
        },
      ],
      // 订单编号
      orderCode: [],
      formValue: {
        storeId: undefined,
        goodsKind: '',
        cateIdLevel1: undefined, // 一级分类
        cateIdLevel2: undefined, // 二级分类
        recvManner: undefined, // 订单类型
        fieldKey: undefined, // 查询字段
        fieldValue: '', // 查询字段值
        dateStartValue: null, // 查询开始时间
        dateEndValue: null, // 查询结束时间
        dateKey: '', // 查询时间
      },
      pickerTime: null
    })
    // 查询时间选择方法
    const dateKeySelect = (selectedItems: any) => {
      dataInit.formValue.dateKey = selectedItems;
    }
    // 选择日期方法
    const changeDate = (date: any, dateString: any) => {
      dataInit.pickerTime = date;
      dataInit.formValue.dateStartValue = dateString[0];
      dataInit.formValue.dateEndValue = dateString[1];
    }
    // 搜索方法
    const goSearch = () => {
      context.emit('go-search', dataInit.formValue);
    }
    // 重置方法
    const resetFun = () => {
      dataInit.formValue.storeId = undefined;
      dataInit.formValue.goodsKind = '';
      dataInit.formValue.cateIdLevel1 = undefined;
      dataInit.formValue.cateIdLevel2 = undefined;
      dataInit.formValue.recvManner = undefined;
      dataInit.formValue.fieldKey = undefined;
      dataInit.formValue.fieldValue = '';
      dataInit.formValue.dateStartValue = null;
      dataInit.formValue.dateEndValue = null;
      dataInit.formValue.dateKey = '';
      dataInit.pickerTime = null;
    }
    // 查询分类请求接口
    const queryCategoryList = async (level:number) => {
      const body = {
        appId: '68594CF2-E947-82FA-84D0-01D4556F9F54',
        level: level
      };
      let datalist:any[] = await queryRetailCategoryList(body);
      datalist = datalist.map((item) => {
        return { label: item.name, value: item.id };
      });
      if (level === 1) {
        dataInit.oneSort = datalist;
      } else {
        dataInit.twoSort = datalist;
      }
    }
    // 订单时间类型选择接口请求
    const querySelectOrderDateFun = async () => {
      const body = '';
      const responData = await querySelectOrderDate(body);
      dataInit.timeType = responData.map((item: any) => {
        return {
          label: item.name,
          value: item.value
        }
      })
    }
    // 订单字段选择接口请求
    const querySelectOrderFieldFun = async () => {
      const body = '';
      const responData = await querySelectOrderField(body);
      dataInit.orderCode = responData.map((item: any) => {
        return {
          label: item.name,
          value: item.value
        }
      })
    }
    // 门店下拉选择接口请求
    const querySelectRecMethodFun = async () => {
      const body = '';
      const responData = await querySelectRecMethod(body);
      dataInit.allShopList = responData.map((item: any) => {
        return {
          label: item.name,
          value: item.value
        }
      })
    }
    onMounted(() => {
      querySelectOrderDateFun();
      querySelectOrderFieldFun();
      querySelectRecMethodFun();
      queryCategoryList(1);
      queryCategoryList(2);
    })
    return {
      dataInit,
      dateKeySelect,
      changeDate,
      goSearch,
      resetFun
    }
  }
})
</script>

<style lang="scss" scoped>
.select-width {
  width: 110px;
}.select-width2 {
  width: 112px;
}
.select-width3 {
  width: 130px;
}
</style>
