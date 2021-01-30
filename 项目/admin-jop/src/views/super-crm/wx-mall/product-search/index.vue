<template>
  <div class="product-search">
    <!-- 首饰大类 -->
    <div class="jewelry-large-type">
      <el-checkbox
        @change="checkAll('jewelLargeType')"
        v-model="selectedQueryCriteria.jewelLargeTypeCheckAll"
      >
        首饰大类
      </el-checkbox>
      <el-checkbox-group
        v-model="selectedQueryCriteria.jewelLargeType"
        @change="checkboxGroupChange('jewelLargeType')"
      >
        <el-checkbox
          v-for="(item, index) of queryCriteria.jewelLargeType"
          :key="index"
          :label="item.id"
          :style="{
            width: '150px',
            'marginBottom': '10px'
          }"
        > 
          {{item.name}}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <!-- 首饰小类 -->
    <div class="jewelry-small-type">
      <el-checkbox
        @change="checkAll('jewelSmallType')"
        v-model="selectedQueryCriteria.jewelSmallTypeCheckAll"
      >
        首饰小类
      </el-checkbox>
      <el-checkbox-group
        v-model="selectedQueryCriteria.jewelSmallType"
        @change="checkboxGroupChange('jewelSmallType')"
      >
        <el-checkbox
          v-for="(item, index) of queryCriteria.jewelSmallType"
          :key="index"
          :label="item.id"
          :style="{
            width: '150px',
            'marginBottom': '10px'
          }"
        >
          {{item.name}}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <!-- 首饰类型 -->
    <div class="materials-grade">
      <el-checkbox
        @change="checkAll('jewelType')"
        v-model="selectedQueryCriteria.jewelTypeCheckAll"
      >
        首饰类型
      </el-checkbox>
      <el-checkbox-group
        v-model="selectedQueryCriteria.jewelType"
        @change="checkboxGroupChange('jewelType')"
      >
        <el-checkbox
          v-for="(item, index) of queryCriteria.jewelType"
          :key="index"
          :label="item.id"
          :style="{
            width: '150px',
            'marginBottom': '10px'
          }"
        >
          {{item.name}}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <!-- 主石名称 -->
    <div class="materials-neatness">
      <el-checkbox
        @change="checkAll('mainStone')"
        v-model="selectedQueryCriteria.mainStoneCheckAll"
      >
        主石名称
      </el-checkbox>
      <el-checkbox-group
        v-model="selectedQueryCriteria.mainStone"
        @change="checkboxGroupChange('mainStone')"
      >
        <el-checkbox
          v-for="(item, index) of queryCriteria.mainStone"
          :key="index"
          :label="item.id"
          :style="{
            width: '150px',
            'marginBottom': '10px'
          }"
        >
          {{item.name}}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <!-- 主石颜色 -->
    <div class="materials-neatness">
      <el-checkbox
        @change="checkAll('mainStoneColor')"
        v-model="selectedQueryCriteria.mainStoneColorCheckAll"
      >
        主石颜色
      </el-checkbox>
      <el-checkbox-group
        v-model="selectedQueryCriteria.mainStoneColor"
        @change="checkboxGroupChange('mainStoneColor')"
      >
        <el-checkbox
          v-for="(item, index) of queryCriteria.mainStoneColor"
          :key="index"
          :label="item.id"
          :style="{
            width: '150px',
            'marginBottom': '10px'
          }"
        >
          {{item.name}}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <!-- 主石净度 -->
    <div class="materials-neatness">
      <el-checkbox
        @change="checkAll('mainStoneQuality')"
        v-model="selectedQueryCriteria.mainStoneQualityCheckAll"
      >
        主石净度
      </el-checkbox>
      <el-checkbox-group
        v-model="selectedQueryCriteria.mainStoneQuality"
        @change="checkboxGroupChange('mainStoneQuality')"
      >
        <el-checkbox
          v-for="(item, index) of queryCriteria.mainStoneQuality"
          :key="index"
          :label="item.id"
          :style="{
            width: '150px',
            'marginBottom': '10px'
          }"
        >
          {{item.name}}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <!-- 材料成色 -->
    <div class="materials-neatness">
      <el-checkbox
        @change="checkAll('material')"
        v-model="selectedQueryCriteria.materialCheckAll"
      >
        材料成色
      </el-checkbox>
      <el-checkbox-group
        v-model="selectedQueryCriteria.material"
        @change="checkboxGroupChange('material')"
      >
        <el-checkbox
          v-for="(item, index) of queryCriteria.material"
          :key="index"
          :label="item.id"
          :style="{
            width: '150px',
            'marginBottom': '10px'
          }"
        >
          {{item.name}}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <!-- 成色含量 -->
    <div class="materials-neatness">
      <el-checkbox
        @change="checkAll('materialColor')"
        v-model="selectedQueryCriteria.materialColorCheckAll"
      >
        成色含量
      </el-checkbox>
      <el-checkbox-group
        v-model="selectedQueryCriteria.materialColor"
        @change="checkboxGroupChange('materialColor')"
      >
        <el-checkbox
          v-for="(item, index) of queryCriteria.materialColor"
          :key="index"
          :label="item.id"
          :style="{
            width: '150px',
            'marginBottom': '10px'
          }"
        >
          {{item.name}}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <!-- 其它 -->
    <div>
      <el-checkbox
        v-model="selectedQueryCriteria.deputyStone"
      >
        副石
      </el-checkbox>
      <el-checkbox
        v-model="selectedQueryCriteria.goldWeight"
      >
        金重
      </el-checkbox>
      <el-checkbox
        v-model="selectedQueryCriteria.mainStoneWeight"
      >
        主石重
      </el-checkbox>
      <el-checkbox
        v-model="selectedQueryCriteria.handInch"
      >
        手寸
      </el-checkbox>
      <el-checkbox
        v-model="selectedQueryCriteria.mainStoneNum"
      >
        主石粒数
      </el-checkbox>
      <el-checkbox
        v-model="selectedQueryCriteria.styleSer"
      >
        款式系列
      </el-checkbox>
      <el-checkbox
        v-model="selectedQueryCriteria.barcode"
      >
        条码号
      </el-checkbox>
      <el-checkbox
        v-model="selectedQueryCriteria.certificateNum"
      >
        证书号
      </el-checkbox>
    </div>
    <div>
      <el-button
        type="primary"
        @click="updateCondition"
      >
        保存
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {queryConditionsOptions, updateConditionOptions} from '@/api/super-crm/wx-mall';
import {Message} from 'element-ui';
import {getSessionStorage} from '@/utils/storage';

@Component({
})
export default class WxMallCredentialParameter extends Vue {
  queryCriteria: any = {
    jewelLargeType: [],
    jewelSmallType: [],
    jewelType: [],
    mainStone: [],
    mainStoneColor: [],
    mainStoneQuality: [],
    material: [],
    materialColor: [],
    deputyStone: 1,
    goldWeight: 1,
    mainStoneWeight: 1,
    handInch: 1,
    mainStoneNum: 1,
    styleSer: 1,
    barcode: 1,
    certificateNum: 1,
  }

  selectedQueryCriteria: any = {
    jewelLargeType: [],
    jewelLargeTypeCheckAll: false,
    jewelSmallType: [],
    jewelSmallTypeCheckAll: false,
    jewelType: [],
    jewelTypeCheckAll: false,
    mainStone: [],
    mainStoneCheckAll: false,
    mainStoneColor: [],
    mainStoneColorCheckAll: false,
    mainStoneQuality: [],
    mainStoneQualityCheckAll: false,
    material: [],
    materialCheckAll: false,
    materialColor: [],
    materialColorCheckAll: false,
    deputyStone: false,
    goldWeight: false,
    mainStoneWeight: false,
    handInch: false,
    mainStoneNum: false,
    styleSer: false,
    barcode: false,
    certificateNum: false,
  }

  @Watch('queryCriteria')
  watchQueryCriteria(value1: any) {
    for (const [key, value] of Object.entries(value1)) {
      if (Array.isArray(value)) {
        const showItemList = value.filter((item) => {
          return item.isShow == '1';
        })

        this.selectedQueryCriteria[key] = showItemList.map((item) => {
          return item.id;
        })

        if (this.selectedQueryCriteria[key].length === value1[key].length) {
          this.selectedQueryCriteria[key.concat('CheckAll')] = true;
        } else {
          this.selectedQueryCriteria[key.concat('CheckAll')] = false;
        }
      } else {
        this.selectedQueryCriteria[key] = value == 1 ? true : false;
      }
    }
  }

  mounted() {
    this.queryConditions();
  }

  checkAll(key: any) {
    const bool = this.selectedQueryCriteria[key.concat('CheckAll')]

    if (bool) {
      this.selectedQueryCriteria[key] = this.queryCriteria[key].map((item: any) => {
        return item.id;
      })
    } else {
      this.selectedQueryCriteria[key] = []
    }
  }
  checkboxGroupChange(key: any) {
    const isAll = this.selectedQueryCriteria[key].length === this.queryCriteria[key].length;

    if (isAll) {
      this.selectedQueryCriteria[key.concat('CheckAll')] = true;
    } else {
      this.selectedQueryCriteria[key.concat('CheckAll')] = false;
    }
  }

  // 查询参数列表
  queryConditions() {
    return new Promise((resolve, reject) => {
      const body = {
      }

      queryConditionsOptions(body).then((res: any) => {
        const {data} = res;
        const {queryCriteria} = data;
        this.queryCriteria = queryCriteria;
      })
    })
  }

  // 保存参数列表
  updateCondition() {
    return new Promise((resolve, reject) => {
      const body = {
        queryCriteria: this.queryCriteria,
      }

      for (const [key, value] of Object.entries(body.queryCriteria)) {
        if (typeof value === 'number') {
          body.queryCriteria[key] = this.selectedQueryCriteria[key] ? 1 : 0;
        } else if (Array.isArray(value)) {
          const selectedQueryCriteria = this.selectedQueryCriteria

          body.queryCriteria[key] = value.map((item, index) => {
            if (selectedQueryCriteria[key].includes(item.id)) {
              item.isShow = '1';
            } else {
              item.isShow = '0';
            }

            return item;
          })
        }
      }

      body.queryCriteria = JSON.stringify(body.queryCriteria);

      updateConditionOptions(body).then((res: any) => {
        Message.success('保存成功');
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.product-search {
  > div {
    margin-bottom: 20px;
    border-bottom: 1px solid #f5f5f5;
    padding-bottom: 10px;

    &:last-of-type {
      border-bottom: none;
    }

    > .el-checkbox {
      margin-bottom: 5px;

      /deep/ .el-checkbox__label {
        font-size: 16px;
      }
    }
  }
}
</style>


