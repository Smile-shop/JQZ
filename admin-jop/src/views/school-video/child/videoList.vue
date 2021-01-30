<template>
  <div class="videopage">
    <div class="VideoList" id="content" :style="`height: ${offsetHeight}px`">
      <div class="VideoList-list">
        <div
          class="VideoList-list-item"
          v-for="(item, index) in videoList"
          :key="index"
          @click="select(item)"
        >
          <el-image :src="item.poster" class="img">
            <div slot="placeholder">
              加载中
              <span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <img src="@/assets/images/school-video/bg_default_video.png" alt />
            </div>
          </el-image>
          <div class="VideoList-list-item-text">{{item.title}}</div>
        </div>
      </div>
    </div>
    <div class="page">
      <el-pagination
        v-show="total > 0"
        background
        layout="total, prev, pager, next, sizes, jumper"
        :page-sizes="[12, 24, 48, 96]"
        :page-size.sync="page.pageSize"
        @size-change="getList"
        @current-change="getList"
        :current-page.sync="page.pageNum"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { query } from '@/api/school-video';
interface Page {
  pageNum: number;
  pageSize: number;
}
@Component({
  name: 'VideoList',
  components: {},
})
export default class VideoList extends Vue {
  offsetHeight: number = document.body.offsetHeight;
  videoList: any[] = [];
  total: number = 2;
  page = { pageNum: 1, pageSize: 12 };
  scrollTop: number = 0;
  public get type(): string {
    return this.$route.params.type;
  }
  @Watch('type')
  chageType(val: string) {
    if (val) {
      this.page.pageNum = 1
      this.getList();
    }
  }
  created() {
    this.getList();
  }
  activated() {
    window.addEventListener('resize', this.height);
    const content: any = document.querySelector('#content');
    content.scrollTop = this.scrollTop;
  }
  deactivated() {
    window.removeEventListener('resize', this.height);
  }
  async getList() {
    const res = await query({ ...this.page, category: this.type });
    this.total = res.data.total || 0;
    this.videoList = res.data.list;
    this.videoList.forEach((item: any) => {
      this.$set(item, 'poster', `${item.url}${item.filePath}/${item.cover}`);
      this.$set(
        item,
        'videoUrl',
        `${item.url}${item.filePath}/${item.fileName}`
      );
    });
    this.height();
  }
  recordScrollTop() {
    const content: any = document.querySelector('#content');
    this.scrollTop = content ? content.scrollTop : 0;
  }
  height() {
    const headerHeight = (document.getElementsByClassName('header')[0] as any)
      .offsetHeight;
    const pageHeight =
      (document.getElementsByClassName('page')[0] as any)?.offsetHeight || 0;
    this.offsetHeight = document.body.offsetHeight - headerHeight - pageHeight;
  }
  select(item: any) {
    this.$router.push({
      path: '/school-video/index/player',
      query: { item: encodeURI(JSON.stringify(item)) },
    });
    this.recordScrollTop();
  }
}
</script>

<style lang="scss" scoped>
.videopage {
  text-align: center;
  .VideoList {
    padding: 56px;
    display: flex;
    justify-content: center;
    overflow: auto;
    @media screen and (min-width: 200px) and (max-width: 699px) {
      &-list {
        display: inline-block;
        min-width: 530px;
        width: 530px;
        &-item {
          width: 208px;
          height: 161px;
          margin: 0 56px 56px 0;
          float: left;
          cursor: pointer;
          &:hover .VideoList-list-item-text {
            color: #409eff;
          }
          .img,
          img {
            border-radius: 8px;
            overflow: hidden;
            width: 100%;
            height: 138px;
          }
          &-text {
            margin-top: 11px;
            text-align: left;
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: 14px;
            color: #333;
          }
        }
      }
    }
    @media screen and (min-width: 700px) and (max-width: 999px) {
      &-list {
        display: inline-block;
        min-width: 700px;
        width: 700px;
        &-item {
          width: 208px;
          height: 161px;
          margin: 0 30px 56px 0;
          float: left;
          cursor: pointer;
          &:hover .VideoList-list-item-text {
            color: #409eff;
          }
          &:nth-child(3n + 3) {
            margin-right: 0;
          }
          .img,
          img {
            border-radius: 8px;
            overflow: hidden;
            width: 100%;
            height: 138px;
          }
          &-text {
            margin-top: 11px;
            text-align: left;
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: 14px;
            color: #333;
          }
        }
      }
    }
    @media screen and (min-width: 1000px) and (max-width: 1300px) {
      &-list {
        display: inline-block;
        min-width: 1000px;
        width: 1000px;
        &-item {
          width: 208px;
          height: 161px;
          margin: 0 56px 56px 0;
          float: left;
          cursor: pointer;
          &:hover .VideoList-list-item-text {
            color: #409eff;
          }
          &:nth-child(4n + 4) {
            margin-right: 0;
          }
          .img,
          img {
            border-radius: 8px;
            overflow: hidden;
            width: 100%;
            height: 138px;
          }
          &-text {
            margin-top: 11px;
            text-align: left;
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: 14px;
            color: #333;
          }
        }
      }
    }
    @media screen and (min-width: 1300px) and (max-width: 1599px) {
      &-list {
        display: inline-block;
        min-width: 1200px;
        width: 120px;
        &-item {
          width: 208px;
          height: 161px;
          margin: 0 37px 56px 0;
          float: left;
          cursor: pointer;
          &:hover .VideoList-list-item-text {
            color: #409eff;
          }
          &:nth-child(5n + 5) {
            margin-right: 0;
          }
          .img,
          img {
            border-radius: 8px;
            overflow: hidden;
            width: 100%;
            height: 138px;
          }
          &-text {
            margin-top: 11px;
            text-align: left;
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: 14px;
            color: #333;
          }
        }
      }
    }
    @media screen and (min-width: 1600px) {
      &-list {
        display: inline-block;
        min-width: 1433px;
        width: 1433px;
        &-item {
          width: 208px;
          height: 161px;
          margin: 0 37px 56px 0;
          float: left;
          cursor: pointer;
          &:hover .VideoList-list-item-text {
            color: #409eff;
          }
          &:nth-child(6n + 6) {
            margin-right: 0;
          }
          .img,
          img {
            border-radius: 8px;
            overflow: hidden;
            width: 100%;
            height: 138px;
          }
          &-text {
            margin-top: 11px;
            text-align: left;
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: 14px;
            color: #333;
          }
        }
      }
    }
  }
  .page {
    padding: 15px;
  }
}
</style>


