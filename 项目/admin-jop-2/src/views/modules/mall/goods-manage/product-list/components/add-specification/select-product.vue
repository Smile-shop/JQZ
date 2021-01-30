<template>
  <div class="select-product">
    <div class="select-one">已选商品</div>
    <div class="select-two">
      <!-- 一码多货 -->
      <div class="select-t-flex" v-for=" (item, index) in selectData" :key="index">
        <div class="flex-1">{{item.seq}}</div>
        <div class="flex-2">
          <img class="name-img" :src="item.imgUrl" alt="">
        </div>
        <div class="flex-3">
          <p class="flex-3-title">{{item.name}}</p>
          <p>内部款号：{{item.styleNo}}</p>
          <p>条码号：{{item.barcode}}</p>
          <p>线下价格：¥ {{item.price}}</p>
        </div>
        <div class="flex-4">
          <p><a-icon type="delete" @click="onDelectHandler(item.key)"/></p>
        </div>
      </div>
    </div>
    <div class="select-three">
      <a-form-model
        :label-col="initData.labelCol"
      >
        <a-form-model-item label="已选商品价格范围：" class="s-form-item">
            <a-button class="select-input" >
              {{minGoodsPrice}}
            </a-button>
            <span class="select-line">-</span>
            <a-button class="select-input">
              {{maxGoodsPrice}}
            </a-button>
        </a-form-model-item>
         <a-form-model-item label="商品统一售价(原价)：" class="price s-form-item">
            <a-input-number class="select-input input2" v-model="initData.origPrice" :min="0" :precision="2"/>
          <div class="select-foot">
            <a-button class="btn" size="default" @click="popMethod('clearAll')">清空全部</a-button>
            <a-button class="btn" type="primary" size="default" @click="popMethod('comfirm')">保存</a-button>
          </div>
        </a-form-model-item>
      </a-form-model>
    </div>
    <!-- 弹窗 -->
    <a-modal centered v-model="initData.addModal" :title="initData.modalTitle" @ok="onClickHander">
      <p>{{initData.modalContent}}</p>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api'
export default defineComponent({
  // 已选商品数据
  props: {
    selectData: {
      type: Array
    },
    maxGoodsPrice: {
      type: Number,
      value: 0
    },
    minGoodsPrice: {
      type: Number,
      value: 0
    }
  },
  setup(props, context) {
    const initData = reactive({
      labelCol: { span: 11 },
      origPrice: '',
      activeKey: ['1'],
      addModal: false, // 弹窗显示隐藏
      modalContent: '', // 弹窗内容
      modalTitle: '', // 弹窗标题
      modalType: ''
    })
    // 弹窗方法
    const popMethod = (type: any) => {
      initData.addModal = true;
      initData.modalType = type;
      // 清空全部
      if (type === 'clearAll') {
        initData.modalTitle = '清空商品';
        initData.modalContent = '是否确认清空已选商品？';
      }
      // 确认添加 有价格差异
      if (type === 'comfirm') {
        initData.modalTitle = '确认添加商品';
        if ((Number(initData.origPrice) === props.minGoodsPrice) && (Number(initData.origPrice) === props.maxGoodsPrice)) {
          initData.modalContent = '是否确认添加已选的商品？';
        } else {
          initData.modalContent = '已选的商品存在价格差异，是否确认添加商品？';
        }
      }
    }
    const onClickHander = () => {
      if (initData.modalType === 'clearAll') {
        context.emit('onClearAllSelect');
        initData.addModal = false;
      } else if (initData.modalType === 'comfirm') {
        context.emit('onSaveAllSelect', initData.origPrice);
        initData.addModal = false;
      }
    }
    const onDelectHandler = (key:string) => {
      context.emit('onDelectHandler', key);
    }
    return {
      initData,
      popMethod,
      onClickHander,
      onDelectHandler
    }
  }
})
</script>

<style lang="scss" scoped>
.select-product {
  position: relative;
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .select-foot {
    margin-left: 136px;
  }
  .select-one {
    background: #fafafa;
    height: 54px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid #e8e8e8;
    padding-left: 14px;
    color: #263446;
    font-weight: 500;
  }
  .select-two {
    flex: 1;
    overflow: auto;
    .select-t-flex {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #EBEEF5;
      div {
        flex: 1;
        text-align: center;
      }
      .flex-2 {
        img {
          width: 60px;
          height: 60px;
        }
      }
      .flex-3 {
        flex: 2;
        text-align: left;
        margin: 0 6px;
        p {
          font-size: 12px;
          margin: 0;
        }
        .flex-3-title {
          color: #263446;
          font-size: 14px;
        }
      }
      .flex-4 {
        .title {
          font-size: 12px;
        }
      }
    }
  }
  .select-three {
    .select-input {
      width: 64px;
    }
    .input2 {
      width: 157px;
    }
    .btn {
      margin: 0 2px;
    }
    .select-line {
      margin: 0 10px;
      color: #263446;
    }
    .s-form-item {
      margin-bottom: 12px;
    }
  }
  .price {
    ::v-deep  .ant-col-10 {
      width: 30%;
    }
  }

  .sele-collect {
    background: #fff;
    ::v-deep .ant-collapse-content {
      width: 100%;
    }
  }
}
</style>
