<template>
  <div class="store-image">
    <div class="store-tip">
      <p>说明：门店图片展示在微会员公众号附近门店功能及其他涉及到门店展示的地方；</p>
      <p>支持扩展名：.jpg，.png；</p>
      <p>尺寸：750*500。</p>
    </div>
    <el-table :data="tableData" border class="table-content" style="width: 100%;margin-top:18px;">
      <el-table-column
        prop="shopName"
        label="门店名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="image1"
        label="当前门店图片图1"
        align="center">
        <template slot-scope="scope">
          <div class="store-box">
            <img v-if="scope.row.image1.url" :src="scope.row.image1.url" class="store-set-img"/>
            <el-popover
              placement="top"
              width="160"
              v-model="scope.row.image1.show">
              <p>确定删除图片吗？</p>
              <div style="text-align: right;margin-top:10px;">
                <el-button size="mini" type="text" @click="scope.row.image1.show = false">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteWxShopImg(1, scope.row, scope.row.image1.url)">删除</el-button>
              </div>
              <i v-show="scope.row.image1.url" class="el-icon-delete store-delete" slot="reference"></i>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="image2"
        label="当前门店图片图2"
        align="center">
        <template slot-scope="scope">
          <div class="store-box">
            <img v-if="scope.row.image2.url" :src="scope.row.image2.url" class="store-set-img"/>
            <el-popover
              placement="top"
              width="160"
              v-model="scope.row.image2.show">
              <p>确定删除图片吗？</p>
              <div style="text-align: right;margin-top:10px;">
                <el-button size="mini" type="text" @click="scope.row.image2.show = false">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteWxShopImg(2, scope.row, scope.row.image2.url)">删除</el-button>
              </div>
              <i v-show="scope.row.image2.url" class="el-icon-delete store-delete" slot="reference"></i>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="image3"
        label="当前门店图片图3"
        align="center">
        <template slot-scope="scope">
          <div class="store-box">
            <img v-if="scope.row.image3.url" :src="scope.row.image3.url" class="store-set-img"/>
            <el-popover
              placement="top"
              width="160"
              v-model="scope.row.image3.show">
              <p>确定删除图片吗？</p>
              <div style="text-align: right;margin-top:10px;">
                <el-button size="mini" type="text" @click="scope.row.image3.show = false">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteWxShopImg(3, scope.row, scope.row.image3.url)">删除</el-button>
              </div>
              <i class="el-icon-delete store-delete" slot="reference" v-show="scope.row.image3.url"></i>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="shopName"
        label="门店图片编辑"
        width="240"
        align="center">
        <template slot-scope="scope">
          <el-upload
            :multiple="false"
            style="display: inline-block;margin-left:5px;"
            :http-request="upload"
            :show-file-list="false"
            :on-exceed="handleExceed"
            :limit=3
            :file-list="scope.row.fileList"
            :before-upload="beforeAvatarUpload"
            action
          >
            <el-button size="mini" @click="toUploadMethod(scope.row)"  type="primary" plain>上传图片</el-button>
          </el-upload>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import user from '@/utils/user';
import {getWxShopList, uploadWxShopImg, upload, deleteWxShopImg} from '@/api/super-crm/wx-member.ts'
@Component({})
export default class StoreImage extends Vue {
  private visible = false;
  private shopId = '';
  private tableData = [];
  private uploadData = {
    accountId: null
  };
  private fileImg = ''

  private mounted() {
    this.getWxShopList();
  }
  // 查询门店
  private async getWxShopList() {
    const res = await getWxShopList();
    const { data } = res;
    this.tableData = data.length > 0 ? data.map((item: any) => {
      const images = item.shopImgs ? item.shopImgs.split(',') : [];
      const fileList = images.map((item: any, index: any) => {
        return {
          url: item
        }
      })
      return {
        shopId: item.shopId,
        shopName: item.nameOut || item.shopName,
        image1: { url: images.length > 0 ? images[0] : '', show: false},
        image2: { url: images.length > 0 ? images[1] : '', show: false},
        image3: { url: images.length > 0 ? images[2] : '', show: false},
        fileList
      }
    }) : []
  }
  // 上传图片header设置
  get uploadOpt() {
    return {
      ticket: user.serverUser.ticket,
      companyKey: user.serverUser.account.companyKey
    }
  }
  private handleExceed(file: any, fileList: any) {
    this.$message.warning('最多上传3张图片')
  }
  private handlePictureCardPreview(file: any) {
    console.log(file)
  }
  // 删除图片
  private async deleteWxShopImg(type: number, row: any, imgUrl: '') {
    const body  = {
      shopId: row.shopId,
      shopImgs: imgUrl
    }
    await deleteWxShopImg(body);
    this.$message.success('图片删除成功');
    this.getWxShopList();
    if (type === 1) {
      row.image1.show = false;
    }
    if (type === 2) {
      row.image2.show = false;
    }
    if (type === 3) {
      row.image3.show = false;
    }
  }
  // 上传图片路径
  private async upload(res: any) {
    const { file } = res as any;
    const formData = new FormData();
    formData.append('imgFiles', file);
    const data = await upload(formData);
    this.uploadWxShopImg(data.data)
  }

  private async uploadWxShopImg(imgUrl: string) {
    let imgArr = '';
    if (this.fileImg) {
      const arr = this.fileImg.split(',');
      arr.push(imgUrl);
      imgArr = arr.join(',');
    } else {
      imgArr = imgUrl
    }
    const body = {
      shopId: this.shopId,
      shopImgs: imgArr || this.fileImg
    }
    await uploadWxShopImg(body);
    this.$message.success('图片上传成功');
    this.getWxShopList();
  }


  // 上传头像
  private toUploadMethod(row: any) {
    let arr = '';
    row.fileList.forEach((item: any) => {
      arr += item.url + ',';
    })
    arr = arr.substring(0, arr.length - 1)
    this.fileImg = arr;
    this.shopId = row.shopId;
  }
  // 上传图片之前
  private beforeAvatarUpload(file: any) {
      const imgMsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      const extension = imgMsg === 'jpg' || imgMsg === 'JPG' || imgMsg === 'png' || imgMsg === 'PNG'
      const isLt50M = file.size / 1024 / 1024 <= 0.5;
      if (!extension) {
          this.$message.error('仅支持jpg，png格式的图片');
          return false;
      }
      if (!isLt50M) {
          this.$message.error('上传图片大小不能超过500k');
          return false;
      }
      return extension && isLt50M;
  }
}
</script>

<style lang="scss" scoped>
.store-image {
  .store-tip {
    font-size: 14px;
    color: #606266;
  }
  .store-box {
    display: flex;
    align-items: center;
    justify-content: center;
    .store-set-img {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
    .store-delete {
      &::before {
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
}
</style>