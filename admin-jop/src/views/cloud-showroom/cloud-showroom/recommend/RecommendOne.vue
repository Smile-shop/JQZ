<template>
  <div class="recommend-one">
    <set-layout>
      <div slot="preview">
        <preview
          :recommendOne="number == 1 ? {
            presenterName: formData.data.presenterName,
            productDetaileds: tableData
          } : undefined"
          :recommendTwo="number == 2 ? {
            presenterName: formData.data.presenterName,
            productDetaileds: tableData
          }: undefined"
          :tabIndex= "number == 1 ? 'recommendOne' : 'recommendTwo'"
        />
      </div>
      <div slot="set">
        <el-form ref="form" class="form" :model="formData.data" :inline="true">
          <el-form-item label="推荐位名称">
            <el-input v-model="formData.data.presenterName" placeholder="输入推荐位名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateRecommend">提交</el-button>
          </el-form-item>
        </el-form>
        <!-- 图片上传 -->
        <div class="param-upload-box" v-if="number != 1">
            <p class="img-tip">上传推荐图片：</p>
            <el-button @click="goUpLoad" class="el-icon-upload upload-btn"  size="small" type="primary">点击从本地上传</el-button>
            <el-upload
                class="upload-demo"
                ref="upload"
                :headers="opt()"
                :action="uploadUrl()"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :show-file-list="false"
                list-type="picture-card"
                :on-change="chanFile"
                :on-success="uploadLogoSuccess"
                :on-error="uploadLogoError"
                :before-upload="beforeAvatarUpload"
                :limit=1
                :on-exceed="limitUpload"
                :auto-upload="true">
                <el-button ref="uploadUp" style="display:none" class="el-icon-upload upbtn" slot="trigger" size="small" type="primary">点击从本地上传</el-button>
            </el-upload>
            <ul class="upload-img-box" v-if="fileList">
                <li class="upload-li" v-for="(item, index) in fileList" :key="index">
                    <div class="upload-im">
                        <img v-if="item.url" :src="item.url" alt="" >
                        <img v-else src="@/assets/images/super-crm/cloud-showroom/default.png"/>
                    </div>
                    <p @click="deleteDialogFun(index)" class="upload-delete">删除</p>
                </li>
            </ul>
          <dl class="explain">
          <dt>
            图片说明：
          </dt>
            <dd>
              1、尺寸建议：335x116，长方形图片，大小不超过500k
            </dd>
            <dd>
              2、图片支持png、jpg格式，仅可添加1张图片
            </dd>
          </dl>
        </div>
        <el-button type="primary" @click="addRow" style="margin-top:10px">添加</el-button>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            label="图片"
            width="120"
          >
            <template slot-scope="scope">
              <el-image
                style="width: 80px; height: 80px"
                :src="scope.row.photo"
              >
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            label="名称"
            width="160"
            prop="name"
          >
          </el-table-column>
          <el-table-column
            label="条码 / 款号"
            width="120"
            prop="code"
          >
          </el-table-column>
          <el-table-column
            label="大类"
            width="100"
            prop="largeCategory"
          >
          </el-table-column>
          <el-table-column
            label="小类"
            width="100"
            prop="smallCategory"
          >
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="toDetailPage(scope.row)"
              >
                编辑详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="recommend-one-footer" style="margin-top: 20px">
          <el-button type="warning" @click="batchDelete">批量删除</el-button>
          <el-pagination
            class="pagination"
            @current-change="pageTurning"
            :current-page.sync="formData.page.pageNum"
            :page-size="formData.page.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="formData.page.total"
            background
          >
          </el-pagination>
        </div>
      </div>
    </set-layout>
    <el-dialog
      title="添加商品"
      :visible.sync="dialogVisible"
      width="90%"
    >
      <add-commodity
        :id="formData.data.id"
        @added="queryRecommendProduct"
        :isShow="dialogVisible"
      />
    </el-dialog>
     <!-- 图片删除弹窗 -->
        <el-dialog
            title="提示"
            :visible.sync="deleteDialog"
            width="20%"
            :center='true'
            >
            <span style="display:block;text-align:center;">是否删除推荐位图片，删除后小程序不显示哦</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialog = false" class="params-button">取 消</el-button>
                <el-button type="primary" @click="deleteImg" class="params-button">确 定</el-button>
            </span>
      </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import SetLayout from '../page-settings/components/SetLayout.vue';
import Preview from '../page-settings/components/Preview.vue';
import AddCommodity from '../page-settings/components/AddCommodity.vue';
import { queryRecommendProduct, updateRecommendProduct, delRecommendProduct } from '@/api/super-crm/cloud-showroom-recommend';
import { imagesUrl } from '@/utils/imageUrl';
import user from '@/utils/user';
@Component({
  components: {
    SetLayout,
    Preview,
    AddCommodity
  },
})
export default class RecommendOne extends Vue {
  number = 1;

  formData = {
    page: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
    data: {
      presenterName: '推荐位',
      id: null,
      number: this.number,
      presenterUrl: ''
    }
  }

  // 表格数据
  tableData = [];

  multipleSelection = [];

  dialogVisible = false;

  imagesUrl = imagesUrl;

  deleteDialog = false;
  deleteIndex = 0;
  fileList: any[] = [];
  presenterUrl = ''

  mounted() {
    this.number = this.$route.meta.number;
    this.queryRecommendProduct();
  }

  // 删除图片确认框
  deleteDialogFun(index: number) {
      this.deleteDialog = true;
      this.deleteIndex = index;
  }

  handleRemove(file: any) {
            console.log(file);
  }

  handlePreview(file: any) {
      console.log(file);
  }

  chanFile(file: any, fileList: any) {
     this.fileList = fileList;
  }

  // 点击上传文件
  goUpLoad() {
     const upbtn: any =  document.querySelector('.upbtn');
     upbtn.click();
  }

  uploadUrl() {
      return `${VUE_APP_BASE_API}/jop-marketing-web/market/upload`;
  }

  opt() {
        const opt = {
        ticket: user.serverUser.ticket,
        companyKey: user.serverUser.account.companyKey
        };
        return opt;
    }
// 删除图片
    deleteImg() {
        if (this.fileList.length > 0) {
          this.fileList.splice(this.deleteIndex, 1);
          this.deleteDialog = false;
          this.presenterUrl = '';
          this.updateRecommend();
        }
    }

  uploadLogoSuccess(res: any, file: any, fileList: any) {
          if (res.code == '0') {
            this.presenterUrl = res.data[0];
            this.updateRecommend();
          } else {
              this.$message({
                type: 'error',
                message: res.msg
            })
          }
    }

    // 上传文件限制个数
    limitUpload(files: any, fileList: any) {
        this.$message({
            message: '最多可添加1张图片',
            type: 'error'
        })
    }

    // 上传图片之前
    beforeAvatarUpload(file: any) {
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

    uploadLogoError() {
        this.$message.error('上传失败，请重新上传！');
    }

  // 前往详情页面
  toDetailPage(row: any) {
    this.$router.push({
      path: '/cloud-showroom/cloud-showroom/shelves',
      query: {
        id: row.id,
        goodsDetailId: '1',
        code: row.code
      }
    })
  }

  // 翻页
  pageTurning(value: number) {
    this.queryRecommendProduct();
  }

  // 提交
  submit() {
    this.$message.success('设置成功');
  }

  // 多选
  handleSelectionChange(value: any) {
    this.multipleSelection = value;
  }

  // 推荐位修改
  async updateRecommend() {
    if (this.fileList.length > 0) {
      this.formData.data.presenterUrl = this.presenterUrl;
    } else {
      this.formData.data.presenterUrl = '';
    }

    const body = {
      ...this.formData.data
    }

    const res = updateRecommendProduct(body);
    this.$message.success('修改成功');
  }

  // 批量删除
  async batchDelete() {
    const body = this.multipleSelection.map((value: any) => {
      return value.relatedId;
    });
    const len = body.length
    if (len <= 0) {
      this.$message.warning('请选择商品')
      return
    }
    const res = await delRecommendProduct(body);
    this.queryRecommendProduct();
    this.$message.success('删除成功');
    this.queryRecommendProduct();
  }

  // 添加行
  addRow() {
    this.dialogVisible = true;
  }

  // 查询推荐位产品
  async queryRecommendProduct() {
    const body = {
      ...this.formData,
      data: this.number
    }

    const { data } = await queryRecommendProduct(body);
    this.formData.data.presenterName = data.presenterName;
    this.formData.data.id = data.id;
    const { list, pageNum, pageSize, total } = data.productDetaileds;
    this.tableData = list;
    this.formData.page.pageNum = pageNum;
    this.formData.page.pageSize = pageSize;
    this.formData.page.total = total;
    const presenterUrl = data.presenterUrl;
    this.presenterUrl = presenterUrl;
    if (presenterUrl != '') {
        this.fileList = [{url: presenterUrl}];
    }
  }
}
</script>

<style lang="scss" scoped>
  .recommend-one {
    .recommend-one-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
   .param-upload-box{
        /deep/ .el-upload--picture-card{
            display: none;
        }
        .img-tip{
            font-size: 12px;
            font-weight: 400;
            color: #40445C;
        }
        .upload-btn{
            margin:14px 0;
            width: 400px;
            background: #fff;
            border: 1px solid #D9D9D9;
            color: #5B81FE;
            font-size: 12px;
            font-weight: 400;
            &::before{
                margin-right: 12px;
            }
        }
        .upload-img-box{
            &::after{
                display: block;
                content: '';
                clear: both;
            }
            li{
                width: 80px;
                float: left;
                margin-right: 10px;
                .upload-im{
                    width: 100%;
                    height: 80px;
                    border-radius: 4px;
                    border: 1px solid #D9D9D9;
                    position: relative;
                    img{
                        width: 100%;
                        height:100%;
                        object-fit: contain;
                    }
                    .upload-wrap{
                        position: absolute;
                        width: 100%;
                        height: 80px;
                        top: 0;
                        left: 0;
                        background:rgba(2,2,2,1);
                        opacity:0.59;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        display: none;
                        span{
                            color: #fff;
                            cursor: pointer;
                            width:0;
                            height:0;
                            margin: auto 4px;
                        }
                        .left{
                            border-top:9px solid transparent;
                            border-bottom:9px solid transparent;
                            border-right:9px solid rgba(255, 255, 255, 1);
                            position: relative;
                            i{
                                position: absolute;
                                width: 1px;
                                height: 16px;
                                border-left: 2px solid rgba(255, 255, 255, 1);
                                top: -8px;
                                left: -4px;
                            }
                        }
                        .lastleft{
                            border-right:9px solid rgba(255, 255, 255, 1);
                            i{
                                border-left-color: rgba(187, 186, 186, 1);
                            }
                        }
                        .turn-left{
                            border-top:9px solid transparent;
                            border-bottom:9px solid transparent;
                            border-right:9px solid #fff;
                        }
                        .turn-right{
                            border-top:9px solid transparent;
                            border-bottom: 9px solid transparent;
                            border-left: 9px solid #fff;
                        }
                        .right{
                            border-top:9px solid transparent;
                            border-bottom: 9px solid transparent;
                            border-left: 9px solid #fff;
                            position: relative;
                            i{
                                position: absolute;
                                width: 1px;
                                height: 16px;
                                border-left: 2px solid #fff;
                                top: -8px;
                                right: -4px;
                            }
                        }
                    }
                }
                .upload-delete{
                    text-align: center;
                    color: #5B81FE;
                    margin: 6px 0;
                    font-size: 12px;
                    cursor: pointer;
                }
            }
        }
        .upload-save{
            width: 400px;
            margin: 16px 0;
        }
        .explain {
          color: #40445C;
          line-height: 2;
          dt {
            font-size: 14px;
          }
          dd {
            font-size: 12px;
          }
      }
    }
</style>
