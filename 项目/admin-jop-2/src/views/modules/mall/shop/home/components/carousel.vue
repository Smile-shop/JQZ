<template>
  <div class="carousel">
    <div class="carousel-1">
      <h3>
        上传轮播图
      </h3>
      <div class="upload">
        <div class="left">
          <app-upload
            :disabled="data.carousel.length >= 8"
            @uploadSuccess="onUploadSuccess"
            :size="500000"
          />
        </div>
        <div class="right">
          <ul>
            <li>
              图片格式：jpg/png
            </li>
            <li>
              轮播图最佳图片尺寸：750px*450px
            </li>
            <li>
              图片最大不超过500k
            </li>
            <li>
              最多上传8张轮播图
            </li>
            <li>
              可点击图片区域进行拖动排序
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="carousel-2">
      <h3>
        首页轮播图
      </h3>
      <draggable tag="ul" :list="data.carousel" class="carousel-list" handle=".drag">
        <li
          class="carousel-list-item"
          v-for="(item, index) of data.carousel"
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
            <a-input v-model="item.remark" placeholder="请输入图片备注（页面不展示）" type="text"/>
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
  addOrUpdateIndexNavigation
} from '@/api/modules/mall/shop-setting';
import Draggable from 'vuedraggable';
import { message } from 'ant-design-vue';

interface Data {
  carousel: any[],
  productTypes: any[],
}

export default defineComponent({
  components: {
    AppUpload,
    Draggable: Draggable as any,
  },
  setup(props, { emit }) {
    const data = reactive<Data>({
      carousel: [],
      productTypes: [],
    });

    watch(() => data.carousel, (value) => {
      emit('setComponentsData', 'carousel', value);
    })

    function onUploadSuccess(url: string) {
      data.carousel.push({
        imgUrl: url,
        redirectKind: 'CATE',
        cateIdLevel1: '',
        cateIdLevel2: '',
        remark: '',
        url: '',
      });
    }

    async function getCarousel() {
      const body = {
        curPage: 1,
        pageSize: 8
      }

      const res: any[] = await queryIndexNavigationList(body);
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
      data.carousel = res as any;
    }

    // 删除轮播图
    async function onDelete(index: number, id: string) {
      if (id) {
        const body = [id];

        await delHomeNavigationByIds(body);
        message.success('删除成功');
        data.carousel.splice(index, 1);
      } else {
        data.carousel.splice(index, 1);
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
      data.carousel[index].imgUrl = url;
    }

    // 提交修改
    async function onSubmit() {
      const body = data.carousel;
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

      await addOrUpdateIndexNavigation(body);
      message.success('提交成功');
      getCarousel();
    }

    onMounted(() => {
      getCarousel();
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
.carousel {
  display: grid;
  gap: 30px;

  h3 {
    margin-bottom: 20px;
  }

  > .carousel-1 {
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

  > .carousel-2 {
    > .carousel-list {
      display: grid;
      gap: 20px;

      > .carousel-list-item {
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
            width: 140px;
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
