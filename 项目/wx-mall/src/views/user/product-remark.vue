<template>
  <base-layout
    title="我要评价"
  >
    <article
      id="product-remark"
    >
      <section class="product">
        <the-product-info-row
          type="order"
        />
      </section>
      <section class="satisfaction-degree">
        <span class="name">
          满意度
        </span>
        <rate
          v-model="starLevel"
        />
      </section>
      <section class="remark">
        <textarea
          v-model="remark"
          placeholder="请输入评论"
          maxlength="100"
        >
        </textarea>
        <section class="picture">
          <div class="picture-add">
            <!-- :max-size="8388608" -->
            <uploader
              multiple
              :after-read="pictureAddAfter"
              :max-size="8388608"
            >
              <i class="iconfont icon-xiangji"></i>
              <span>上传照片</span>
            </uploader>
          </div>
          <div
            v-for="(item, index) in pictureUrls"
            :key="index"
            class="img-box"
            :style="{
              'background-image': `url(${item.content})`
            }"
          >
            <i
              class="iconfont icon-unif060"
              @click="pictureDelete(index)"
            >
            </i>
          </div>
        </section>
      </section>
      <footer>
        <the-button-submit
          buttonText="提交评价"
          @click="submitHandle"
        >
        </the-button-submit>
      </footer>
    </article>
  </base-layout>
</template>

<script lang="ts">
// vue
import {Vue, Component} from 'vue-property-decorator';

// 组件
import BaseLayout from '@/layouts/base-layout.vue';
import TheProductInfoRow from '@/components/the-product-info-row.vue';
import TheButtonSubmit from '@/components/the-button-submit.vue';
import {Rate, Uploader, Toast} from 'vant';

// http
import {httpReq} from '@/utils/http-req';
import {productRemarkReq, uploadIMGReq} from '@/serves/order';

@Component({
  components: {
    BaseLayout,
    TheProductInfoRow,
    Rate,
    TheButtonSubmit,
    Uploader,
  },
})
export default class UserProductRemark extends Vue {
  // 图片列表
  private pictureUrls: any[] = [];

  // 评论
  private remark: string = '';

  // 星级
  private starLevel: number = 0;

  // 是否上传中
  private isLoading: boolean = false;

  // 图片添加到后面
  private pictureAddAfter(files: object | any[]): void {
    if (Array.isArray(files)) {
      this.pictureUrls = this.pictureUrls.concat(files);
    } else {
      this.pictureUrls.push(files);
    }
  }

  // 图片删除
  private pictureDelete(index: number): void {
    this.pictureUrls.splice(index, 1);
  }

  // 验证
  private pattern() {
    if (!this.remark) {
      Toast('请输入评论');
      return false;
    } else if (this.remark.length < 5) {
      Toast('评论需要大于5个字');
      return false;
    }

    if (!this.starLevel) {
      Toast('请选择满意度');
      return false;
    }
    return true;
  }

  // 提交评论处理
  private async submitHandle() {
    if (!this.isLoading) {
      this.isLoading = true;

      if (this.pattern()) {
        if (!this.pictureUrls.length) {
          // 没有图片时
          const remarkRes = await this.undateProductRemark();
        } else {
          // 有图片时
          const imgRes: any = await this.uploadIMG();
          const remarkRes: any = await this.undateProductRemark(imgRes);
        }

        this.$router.back();
      }

      this.isLoading = false;
    }
  }

  // 更新产品评论
  private undateProductRemark(imgs?: any[]) {
    return new Promise((resolve, reject) => {
      const body = {
        code: this.$route.query.productID,
        evaContent: this.remark,
        orderNum: this.$route.query.orderID,
        csr: this.starLevel,
        pnames: imgs ? imgs.join(',') : '',
      };

      Toast.loading('评论上传中');
      productRemarkReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(productRemarkReq);

      httpRes.then(data => {
        Toast('评论成功');
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 上传图片
  private uploadIMG() {
    return new Promise((resolve, reject) => {
      const body = new FormData();

      body.append('edit', 'edit');

      this.pictureUrls.forEach(item => {
        body.append('file', item.file);
      });

      Toast.loading({
        message: '图片上传中...',
        duration: 0,
      });
      uploadIMGReq.requestInit.body = body;
      const httpRes = httpReq(uploadIMGReq);

      httpRes.then(data => {
        Toast('图片上传成功');
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }
}
</script>

<style lang="scss" scoped>
#product-remark {
  & > .product {
    border-bottom: 1px solid #f5f5f5;
  }

  & > .satisfaction-degree {
    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
    padding: 0 1.6rem;
    height: 5.5rem;
    background-color: #fff;

    & > .name {
      font-size: 1.8rem;
      color: #333333;
    }
  }

  & > .remark {
    display: grid;
    grid-row-gap: 1.3rem;
    padding: 1.2rem 1.5rem;
    background-color: #fff;

    & > textarea {
      border: none;
      padding: 1.2rem;
      font-size: 1.5rem;
      min-height: 12.5rem;
      line-height: 1.5;
      color: #333333;
      background-color: #f5f5f5;
    }

    & > .picture {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-auto-rows: 8.1rem;
      grid-gap: .6rem;

      & > .picture-add {
        display: grid;

        & > .van-uploader {
          display: grid;
          align-content: center;
          justify-items: center;
          grid-row-gap: 1rem;
          background-color: #ddd;
          line-height: 1;
          color: #fff;
          font-size: 1.5rem;

          & > .iconfont {
            font-size: 3rem;
          }
        }
      }

      & > .img-box {
        position: relative;
        display: grid;
        overflow: hidden;
        background-size: cover;
        background-repeat: no-repeat;

        & > .iconfont {
          position: absolute;
          top: .3rem;
          right: .3rem;
          font-size: 1.5rem;
          color: var(--color-theme);
        }
      }

    }
  }

  & > footer {
    display: grid;
    padding: 2.5rem 1.5rem;
    height: 5.5rem;
  }
}
</style>