<template>
  <div class="page-style-list">
    <section class="type-list">
      <div
        v-for="(item, index) of dataList"
        :key="index"
        :class="{
          'type-list-item': true,
          active: item.status == 1,
        }"
      > 
        <div class="top">
          <img src="@/assets/images/super-crm/wx-website/home-style-1.jpg" alt="图片">
        </div>
        <div class="bottom">
          <el-button
            size="small"
            @click="onEditClick(index, item)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            @click="checked(index, item)"
          >
            选择
          </el-button>
        </div>
      </div>
    </section>
    <section>
      <el-form
        ref="form"
        label-width="120px"
      >
        <el-form-item label="网站主色">
          <ul class="color-list">
            <li
              v-for="(item, index) of colorList"
              v-setBg="item"
              :key="index"
              @click="customColor = item"
            >
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="自定义颜色">
          <el-color-picker
            v-model="customColor"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {Message} from 'element-ui';
import {
  getStyleOptions,
  setStyleOptions,
} from '@/api/super-crm/wx-website';

@Component({
  components: {
  },
  directives: {
    setBg(element, VNodeDirective) {
      element.style.background = VNodeDirective.value;
    }
  }
})
export default class WxWebsitePageStyleList extends Vue {
  dataList: any[] = [];
  colorList: string[] = [
    '#e12f30',
    '#9e0028',
    '#f66b77',
    '#e83b66',
    '#dbb866',
    '#e4c589',
    '#6e73b8',
    '#f1ae85',
    '#d9b39b',
  ];
  customColor = '#e12f30';

  mounted() {
    this.getStyle();
  }

  // 获取样式
  getStyle() {
    return new Promise((resolve, reject) => {
      const body = {}

      getStyleOptions(body).then((res: any) => {
        const {data} = res;

        const {customColor, styleList} = data;
        this.dataList = styleList;
        this.customColor = customColor;
        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 设置样式
  setStyle(item: any) {
    return new Promise((resolve, reject) => {
      const {id, status} = item;
      const body = {
        id,
        status,
        backColor: this.customColor,
      }

      setStyleOptions(body).then((res: any) => {
        const {data} = res;
        Message.success('设置成功');
        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 提交
  onSubmit() {
    const item = this.dataList.find((value) => {
      return value.status == 1;
    })
    this.setStyle(item);
  }

  // 编辑
  onEditClick(index: number, item: any) {
    this.$emit('edit', item.id)
  }

  // 选中
  checked(index: number, item: any) {
    this.dataList.forEach((value, index) => {
      this.$set(value, 'status', 0)
    })
    this.$set(item, 'status', 1)
  }
}
</script>

<style lang="scss" scoped>
.page-style-list {
  & > .type-list {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 2rem;

    & > .type-list-item {
      border: 1px solid #f5f5f5;
      border-radius: .3rem;
      padding: .8rem;
      width: 15.8rem;
      margin-right: 2rem;

      &:last-of-type {
        margin-right: 0;
      }

      &.active {
        border: 1px solid #6699ff;
      }

      & > .top {
        margin-bottom: 1rem;

        & > img {
          width: 100%;
          height: auto;
        }
      }

      & > .bottom {
        display: flex;
        justify-content: space-between;
      }
    }
  }

  & .color-list {
    list-style: none;
    display: flex;
    flex-wrap: wrap;

    & > li {
      height: 5rem;
      width: 5rem;
    }
  }
}
</style>