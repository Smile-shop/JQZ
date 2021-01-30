<template>
  <div class="nav">
    <div class="nav-1">
      <h3>
        上传快捷导航图标
      </h3>
      <div class="upload">
        <div class="left">
          <app-upload
            :disabled="data.datas.length >= 10"
            @uploadSuccess="onUploadSuccess"
            :size="100000"
          />
        </div>
        <div class="right">
          <ul>
            <li>
              图片格式：jpg/png
            </li>
            <li>
              分类图标最佳尺寸100px*100px
            </li>
            <li>
              图片大小不超过100k
            </li>
            <li>
              最多上传10个分类图标
            </li>
            <li>
              可点击图片区域进行拖动排序
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="nav-2">
      <h3>
        快捷导航图标
      </h3>
      <draggable tag="ul" :list="data.datas" class="nav-list" handle=".drag">
        <li
          class="nav-list-item"
          v-for="(item, index) of data.datas"
          :key="item.id"
        >
          <div class="index">
            {{index + 1}}
          </div>
          <div class="image">
            <img :src="item.imgUrl" alt="图片">
            <app-upload
              type="text"
              text="重新上传"
              @uploadSuccess="changeImage(index, $event)"
            />
          </div>
          <div class="clickEvent">
            <a-input v-model="item.title" :max-length="4" placeholder="输入快捷导航名称（最多输入8个字）" type="text"/>
            <a-radio-group
              v-model="item.redirectKind"
              default-value="CATE"
            >
              <a-radio value="CATE">
                商品分类
              </a-radio>
              <a-radio value="URL">
                商品链接
              </a-radio>
            </a-radio-group>
            <a-cascader
              v-if="item.redirectKind === 'CATE'"
              v-model="item.tempProductTypes"
              :options="data.productTypes"
              placeholder="请选择商品分类"
              :fieldNames="{
                label: 'name',
                value: 'id',
                children: 'level2CategoryList'
              }"
            />
            <a-input
              v-else
              v-model="item.url"
              placeholder="请输入链接"
            />
          </div>
          <div class="action">
            <a-popconfirm
              title="确定要删除吗?"
              @confirm="onDelete(index, item.id)"
            >
              <a href="javascript:;">
                <i class="iconfont icon-delete"></i>
              </a>
            </a-popconfirm>
            <a class="drag" href="javascript:;">
              <i class="iconfont icon-drag"></i>
            </a>
          </div>
        </li>
      </draggable>
    </div>
    <div>
      <a-button
        type="primary"
        @click="onSubmit"
      >
        保存
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, watch } from '@vue/composition-api';
import AppUpload from '@/components/app-upload.vue';
import {
  queryIndexNavigationList,
  delHomeNavigationByIds,
  addOrUpdateCateNavigation,
  queryCategoryLevelOneAndTwoList,
  addOrUpdateIndexNavigation,
  queryHomeCateNavigationList
} from '@/api/modules/mall/shop-setting';
import Draggable from 'vuedraggable';
import { message } from 'ant-design-vue';

interface Data {
  datas: any[],
  productTypes: any[],
}

export default defineComponent({
  components: {
    AppUpload,
    Draggable: Draggable as any,
  },
  setup(props, { emit }) {
    const data = reactive<Data>({
      datas: [],
      productTypes: [],
    });

    watch(() => data.datas, (value) => {
      emit('setComponentsData', 'nav', value);
    })

    function onUploadSuccess(url: string) {
      data.datas.push({
        imgUrl: url,
        redirectKind: 'CATE',
        cateIdLevel1: '',
        cateIdLevel2: '',
        title: '',
        url: '',
      });
    }

    async function getDatas() {
      const body = {
        curPage: 1,
        pageSize: 8
      }

      const res: any[] = await queryHomeCateNavigationList(body);
      res.forEach((value: any) => {
        const tempProductTypes = []

        if (value.cateIdLevel1) {
          tempProductTypes.push(value.cateIdLevel1);

          if (value.cateIdLevel2) {
            tempProductTypes.push(value.cateIdLevel2);
          }
        }

        value.tempProductTypes = tempProductTypes;
      })
      data.datas = res as any;
    }

    // 删除
    async function onDelete(index: number, id: string) {
      if (id) {
        const body = [id];

        await delHomeNavigationByIds(body);
        message.success('删除成功');
        data.datas.splice(index, 1);
      } else {
        data.datas.splice(index, 1);
        message.success('删除成功');
      }
    }

    // 获取产品分类
    async function getProductTypes() {
      const body = '';

      const res = await queryCategoryLevelOneAndTwoList(body);
      data.productTypes = res;
    }

    // 更换图片
    function changeImage(index: number, url: string) {
      data.datas[index].imgUrl = url;
    }

    // 提交修改
    async function onSubmit() {
      const body = data.datas;
      body.forEach((value: any) => {
        const { tempProductTypes } = value;

        if (tempProductTypes) {
          if (tempProductTypes[0]) {
            value.cateIdLevel1 = tempProductTypes[0];
          }

          if (tempProductTypes[1]) {
            value.cateIdLevel2 = tempProductTypes[1];
          }
        }
      })

      await addOrUpdateCateNavigation(body);
      message.success('提交成功');
      getDatas();
    }

    onMounted(() => {
      getDatas();
      getProductTypes();
    })

    return {
      data,
      onUploadSuccess,
      onDelete,
      changeImage,
      onSubmit,
    };
  },
});
</script>

<style lang="scss" scoped>
.nav {
  display: grid;
  gap: 30px;

  h3 {
    margin-bottom: 20px;
  }

  > .nav-1 {
    > .upload {
      display: grid;
      grid-template-columns: max-content auto;
      gap: 20px;

      > .right {
        > ul {
          font-size: 12px;
        }
      }
    }
  }

  > .nav-2 {
    > .nav-list {
      display: grid;
      gap: 20px;

      > .nav-list-item {
        display: grid;
        grid-template-columns: max-content max-content auto max-content;
        gap: 20px;
        align-items: center;

        > .index {
          color: #263446;
        }

        > .image {
          display: grid;
          justify-items: center;
          grid-template-rows: max-content max-content;
          gap: 10px;

          > img {
            border-radius: 3px;
            width: 82px;
            height: 82px;
            object-fit: contain;
            object-position: center center;
          }
        }

        > .clickEvent {
          display: grid;
          gap: 10px;
        }

        > .action {
          display: grid;
          grid-auto-flow: column;
          gap: 20px;

          .iconfont {
            font-size: 20px;
          }
        }
      }
    }
  }
}
</style>
