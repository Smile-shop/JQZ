<template>
  <div class="search-header">
    <a-form-model
      :label-col="initData.labelCol"
      :wrapper-col="initData.wrapperCol"
    >
      <a-form-model-item label="商品类型：">
        <div class="search-flex">
          <div class="search-left">
            <span class="sort-name">一级分类：{{spuObj.cateIdLevel1Name}}</span>
            <span class="sort-name">二级分类：{{spuObj.cateIdLevel2Name}}</span>
            <span class="sort-name">货品类型：{{(spuObj.goodsKind=="JW")?"首饰":"饰品"}}</span>
          </div>
          <div class="input-flex">
            <div class="input-group">
              <a-input-group compact style="display: inline">
                <a-select v-model="initData.formobj.nameType" placeholder="搜索条件" style="width:110px" @keyup.enter.native="onSearhClick">
                  <a-select-option v-for="(item, index) in initData.selectOption" :key="index" :value="item.value">
                    {{item.label}}
                  </a-select-option>
                </a-select>
                <a-input style="width: 170px" placeholder="输入名称搜索"  v-model="initData.formobj.name" @keyup.enter.native="onSearhClick"/>
              </a-input-group>
            </div>
            <div class="input-button">
              <a-button type="primary" class="searh-btn" @click="onSearhClick" @keyup.enter.native="onSearhClick">搜索</a-button>
              <a-button @click="onResetClick" @keyup.enter.native="onSearhClick">重置</a-button>
            </div>
          </div>
        </div>
      </a-form-model-item>
      <a-form-model-item label="商品属性：">
        <div class="specification-wrapper">
          <div class="specification-flex" v-show="!initData.collapseShow">
            <span style="margin-left:10px;" :value="item.value" v-for="(item, index) in getGoodsPropTypeList(spuObj.goodsPropTypeList)" :key="index">
              <template v-if="item.propType=='DB_INPUT'">
                    <span class="specifi-span">{{item.goodsPropName}}</span>
                    <a-input class="spe-input input2" placeholder="" v-model="item.goodsPropValue1" @keyup.enter.native="onSearhClick"/>
                    <span class="specifi-line">-</span>
                    <a-input class="spe-input input2" placeholder="" v-model="item.goodsPropValue2" @keyup.enter.native="onSearhClick"/>
              </template>
             <template v-else>
                    <span class="specifi-span">{{item.goodsPropName}}</span>
                    <a-input class="spe-input" placeholder="请输入" v-model="item.goodsPropValue1" @keyup.enter.native="onSearhClick"/>
              </template>
            </span>
          </div>
          <div class="collect-box" v-if="(spuObj.goodsPropTypeList&&spuObj.goodsPropTypeList.length>6)">
            <a-button @click="collapseOpen">展开所有属性<a-icon type="down" /></a-button>
          </div>
          <!-- 展开属性单品 -->
          <div class="collasp-box" v-show="initData.collapseShow">
            <div class="specification-flex">
              <span style="margin-left:20px;width:230px" :value="item.value" v-for="(item, index) in spuObj.goodsPropTypeList" :key="index">
                <template v-if="item.propType=='DB_INPUT'">
                      <span class="specifi-span">{{item.goodsPropName}}</span>
                      <a-input class="spe-input input2" placeholder="" v-model="item.goodsPropValue1" @keyup.enter.native="onSearhClick"/>
                      <span class="specifi-line">-</span>
                      <a-input class="spe-input input2" placeholder="" v-model="item.goodsPropValue2" @keyup.enter.native="onSearhClick"/>
                </template>
                <template v-else>
                      <span class="specifi-span">{{item.goodsPropName}}</span>
                      <a-input class="spe-input" placeholder="请输入" v-model="item.goodsPropValue1" @keyup.enter.native="onSearhClick"/>
                </template>
            </span>
            </div>
            <div class="collect-box">
              <a-button @click="collapseClose">收起属性<a-icon type="up" /></a-button>
            </div>
          </div>
        </div>
      </a-form-model-item>
      <a-form-model-item label="查看方式" v-if="!(spuObj.goodsKind=='JW')">
        <a-select default-value="noGoods" style="width: 120px;margin-left: 30px;" @keyup.enter.native="onSearhClick">
          <a-select-option value="noGoods">
            无货
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api'
import PageTable from '@/layout/page-table.vue';
export default defineComponent({
  props: {
    spuObj: {
      type: Object
    }
  },
  components: {
    PageTable,
  },
  setup(props, context) {
    const initData = reactive({
      labelCol: { span: 1 },
      wrapperCol: { span: 22 },
      collapseShow: false,
      formobj: { nameType: undefined, name: '', goodsPropList: []as any[] },
      selectOption: [
        {
          label: '商品名称',
          value: 'GOODS_NAME'
        },
        {
          label: '内部款号',
          value: 'INNER_STYLE_NO'
        },
        {
          label: '条码号',
          value: 'BARCODE_NO'
        },
      ]
    })
    // 展开属性
    const collapseOpen = () => {
      initData.collapseShow = true;
    }
    // 关闭属性
    const collapseClose = () => {
      initData.collapseShow = false
    }
    const getGoodsPropTypeList = (proplist:any[]) => {
      if (proplist) {
        return proplist.slice(0, 6);
      } else {
        return [];
      }
    }
    const onResetClick = () => {
      initData.formobj = { nameType: undefined, name: '', goodsPropList: [] };
      (props.spuObj as any).goodsPropTypeList.map((item:any) => {
        item.goodsPropValue1 = '';
        item.goodsPropValue2 = '';
        return item;
      });
    }
    const onSearhClick = () => {
      let goodsPropList:any[] = (props.spuObj as any).goodsPropTypeList.filter((item:any) => (item.goodsPropValue1 !== null || item.goodsPropValue1 !== ''));
      goodsPropList = goodsPropList.map((item:any) => {
        return { goodsPropCode: item.goodsPropCode, goodsPropValue1: item.goodsPropValue1 ? item.goodsPropValue1 : '', goodsPropValue2: item.goodsPropValue2 ? item.goodsPropValue2 : '' };
      });
      initData.formobj.goodsPropList = goodsPropList;
      context.emit('onSearhClick', initData.formobj);
    }
    return {
      initData,
      collapseOpen,
      collapseClose,
      getGoodsPropTypeList,
      onSearhClick,
      onResetClick
    }
  }
})
</script>

<style lang="scss" scoped>
.search-header {
  .search-flex {
    display: flex;
    .search-left {
      flex: 1;
    }
  }
  .collect-box {
    text-align: center;
    margin-top: 5px;;
    .ant-btn {
      color: #C0C6D1;
    }
  }
  .specification-wrapper {
    position: relative;
  }
  .collasp-box {
    position: absolute;
    width: 1600px;
    top: 0;
    left: 8px;
    z-index: 2;
    background: #FFFFFF;
    box-shadow: 0px 2px 8px 0px rgba(201, 201, 201, 0.5);
    padding: 10px;
  }
  .sort-name {
    margin-left: 40px;
  }
  .specification-flex {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-left: 30px;
    .specifi-span:not(:nth-child(1)) {
      margin-left: 6px;
    }
    .spe-input {
      width: 122px;
      margin-left: 6px;
    }
    .input2 {
      width: 50px;
      text-align: center;
    }
    .specifi-line {
      margin-left: 4px;
    }
  }
  .input-flex {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .input-group {
      display: flex;
      align-items: center;
      height: 40px;
    }
    .input-button {
      .searh-btn {
        margin: 0 10px;
      }
    }
  }
}
</style>
