
<template>
    <el-table empty-text="暂无数据" :data="dataList" border style="width:100%">
      <el-table-column>
        <template slot="header"> 
             <span>礼品名字</span>
             <el-tooltip placement="top">
              <div slot="content">活动展示名称，发布后不可修改</div>
                <i class="el-icon-warning-outline" style="color:#409EFF;margin-left:10px;"></i>
              </el-tooltip>
        </template>
          <template slot-scope="scope">
              <el-input
              v-model="scope.row.giftName"
              maxlength="10"
              placeholder="请输入"
              :style="{width:'100px'}"
              show-word-limit    
              ></el-input>
          </template>
      </el-table-column>
      <el-table-column>
        <template slot="header"> 
             <span>礼品标题</span>
             <el-tooltip placement="top">
              <div slot="content">活动展示标题，发布后不可修改</div>
                <i class="el-icon-warning-outline" style="color:#409EFF;margin-left:10px;"></i>
              </el-tooltip>
        </template>
        <template slot-scope="scope">
            <el-input
              v-model="scope.row.giftTitle"
              maxlength="10"
              placeholder="请输入"
              :style="{width:'100px'}"
              show-word-limit    
              ></el-input>
        </template>
      </el-table-column>
       <el-table-column label="图片" prop="giftImg">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-plus" @click="onAddImg(scope.row)"></el-button>
          </template>
      </el-table-column>
      <el-table-column label="市场参考价格（元）" prop="price">
          <template slot-scope="scope">
           <el-input-number v-model="scope.row.price"  :controls="false" :min="1" :max="99999" :style="{width: '80px'}"></el-input-number>
          </template>
      </el-table-column>
      <el-table-column label="库存" prop="strock">
         <template slot-scope="scope">
           <el-input-number v-model="scope.row.strock"  :controls="false" :min="1" :max="99999" :style="{width: '80px'}"></el-input-number>
          </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
            <span class="key-ckspan" @click="onDelectItem(scope.row)">删除</span>
        </template>  
      </el-table-column>
    </el-table>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
@Component({})
export default class GiftTable extends Vue {
    dataList = [{giftName: '名称', giftTitle: '标题', giftImg: '------------', price: 1000, strock: 100}];
   mounted() {
//
   }
   onDelectItem(item: any) {
//
   }
   onAddImg(item: any) {
//
   }
}
</script>
<style lang="scss" scoped>
.key-ckspan {
  margin-left:10px;
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
}
</style>

