<template>
    <div class="param-wrapper">
        <div class="param-box">
            <p class="p-title">商品名称：<span>{{paramNumber.length > 0 ? paramNumber[0].name : ''}}</span></p>
            <p class="p-title">上架编号：<span>{{paramNumber.length > 0 ? paramNumber[0].code : ''}}</span></p>
        </div>
        <!-- 图片上传 -->
        <div class="param-upload-box">
            <p class="img-tip">或从本地上传图片：</p>
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
                :limit=8
                :on-exceed="limitUpload"
                :auto-upload="true">
                <el-button ref="uploadUp" style="display:block" class="el-icon-upload upbtn" slot="trigger" size="small" type="primary">点击从本地上传</el-button>
            </el-upload>
            <ul class="upload-img-box" v-if="fileList">
                <li class="upload-li" v-for="(item, index) in fileList" :key="index">
                    <div class="upload-im" @mouseenter="showImgEnter($event)" @mouseleave="showImgleave($event)">
                        <img v-if="item.url" :src="item.url" alt="" >
                        <img v-else src="@/assets/images/super-crm/cloud-showroom/default.png"/>
                        <div class="upload-wrap">
                            <span @click="leftRemoveItem(item, index)" class="left" :class="{'lastleft' : index == 0}"><i></i></span>
                            <span @click="onLeftItem(item, index)" class="turn-left" :class="{'lastleft' : index == 0}"></span>
                            <span @click="onRightItem(item, index)" class="turn-right"></span>
                            <span @click="rightRemoveItem(item, index)" class="right"><i></i></span>
                        </div>
                    </div>
                    <p @click="deleteDialogFun(index)" class="upload-delete">删除</p>
                </li>
            </ul>
            <!-- <el-button @click="submitUpload" class="upload-save"  size="small" type="primary">保存</el-button> -->
        </div>
        <!-- 首饰参数 -->
        <div class="param-box">
            <p class="param-title">首饰参数:</p>
            <div class="param-number">
                <el-table
                ref="multipleTable"
                :data="paramNumber"
                tooltip-effect="dark"
                style="width: 100%"
                class="table-wrapper"
                >
                    <el-table-column
                        prop="category"
                        label="首饰类别"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>{{scope.row.category ? scope.row.category : '-'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="category"
                        label="上架类别"
                        align="center"
                        >
                        <template slot-scope="scope">
                            <!-- <span>{{this.storageType && this.storageType == 1 ? "首饰": '饰品'}}</span> -->
                            <span>{{scope.row.storageType == 1 ? "首饰": '饰品'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="styleSeries"
                        label="款式系列"
                        align="center"
                        >
                        <template slot-scope="scope">
                            <span>{{scope.row.styleSeries ? scope.row.styleSeries : '-'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="goldQuality"
                        label="成色"
                        align="center"
                        >
                        <template slot-scope="scope">
                            <span>{{scope.row.goldQuality ? scope.row.goldQuality : '-'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="quality"
                        label="含量"
                        align="center"
                        >
                        <template slot-scope="scope">
                            <span>{{scope.row.quality ? scope.row.quality : '-'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="credentials"
                        label="证书号"
                        align="center"
                        >
                        <template slot-scope="scope">
                            <span>{{scope.row.credentials ? scope.row.credentials : '-'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="largeGoldWeight"
                        label="金重(g)"
                        align="center"
                        >
                        <template slot-scope="scope">
                            <span >{{scope.row.smallGoldWeight && scope.row.largeGoldWeight == scope.row.smallGoldWeight   ? scope.row.largeGoldWeight : scope.row.largeGoldWeight || scope.row.largeGoldWeight == scope.row.smallGoldWeight ? scope.row.smallGoldWeight + ' ~ '+  scope.row.largeGoldWeight: '-'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="smallMainStoneWeight"
                        label="主石重(ct)"
                        align="center"
                        >
                        <template slot-scope="scope">
                            <span>{{scope.row.smallMainStoneWeight && scope.row.smallMainStoneWeight == scope.row.largeMainStoneWeight ? scope.row.largeMainStoneWeight : scope.row.smallMainStoneWeight || scope.row.smallMainStoneWeight == scope.row.largeMainStoneWeight ? scope.row.smallMainStoneWeight +' ~ '+ scope.row.largeMainStoneWeight : '-'}}</span>
                        </template>
                    </el-table-column>
                    <!-- <template slot-scope="scope">
                        <span>{{scope.row.smallGoldWeight}}~{{scope.row.largeMainStoneWeight}}</span>
                    </template> -->
                    <el-table-column
                        v-if="storageType == 1"
                        prop="mainStoneColor"
                        label="颜色"
                        align="center"
                        >
                        <template slot-scope="scope">
                            <span>{{scope.row.mainStoneColor ? scope.row.mainStoneColor : '-'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="storageType == 1"
                        label="净度"
                        prop="mainStoneQuality"
                        align="center"
                        >
                        <template slot-scope="scope">
                            <span>{{scope.row.mainStoneQuality ? scope.row.mainStoneQuality : '-'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="storageType == 1"
                        label="手寸(#)"
                        prop="handInch"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>{{scope.row.handInch ? scope.row.handInch : '-'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="storageType == 2"
                        label="规格(#)"
                        prop="handInch"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>{{scope.row.handInch ? scope.row.handInch : '-'}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="param-sort"><span style="font-size: 12px; color: #373E4F;font-weight:600">热门分类：</span><span class="sort-text" v-for="(item,index) in paramSortList" :key="index">{{item.classifiedName}}</span>
                <el-button  class="upload-save" @click="getSelectOnLineCategorys" size="small" type="primary">修改</el-button>
            </div>
            <div class="param-command">
                <span style="font-size: 12px; color: #373E4F;font-weight:600">推荐位：</span>
                <el-checkbox-group v-model="paramList" class="param-check">
                    <el-checkbox  v-for="(item, index) in paramListData" :key="index" :label="item.presenterSequence + ','+ item.presenterId">{{item.presenterName}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <!-- 说明 -->
        <div class="param-tip">
            <p style="margin-bottom: 8px;">说明：</p>
            <p>1. 首图为该商品默认展示图片；</p>
            <p>2. 支持图片格式：png，jpg； </p>
            <p>3. 图片尺寸建议：1:1正方形，大小300K以内；</p>
            <p>4. 最多可展示8张图片。</p>
        </div>
        <!-- 保存按钮 -->
        <div class="save-btn">
            <!-- <el-button @click="submitUpload" class="upload-save"  size="small" type="primary">保存</el-button> -->
             <el-button class="upload-back"  type="success" @click="goBack">返回</el-button>
            <el-button class="upload-save" @click="submitUpload" type="primary">保存</el-button>
        </div>
        <!-- 热门分类 修改弹窗 -->
        <el-dialog
            title="选择热门分类"
            :visible.sync="sortDialog"
            width="39%"
            center>
            <el-checkbox-group v-model="sortLists" class="param-check">
                    <el-checkbox v-for="(item, index) in selectCheckData"   :label="item.categoryId" :key="index">{{item.classifiedName}}</el-checkbox>
                </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="sortDialog = false" class='params-button'>取 消</el-button>
                <el-button type="primary" @click="saveDialogOnline" class='params-button'>保 存</el-button>
            </span>
        </el-dialog>
        <!-- 图片删除弹窗 -->
        <el-dialog
            title="提示"
            :visible.sync="deleteDialog"
            width="20%"
            :center='true'
            >
            <span style="display:block;text-align:center;">确定删除吗?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialog = false" class="params-button">取 消</el-button>
                <el-button type="primary" @click="deleteImg" class="params-button">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getProductDetail, updateProDetailImg, getSelectOnLineCategorys, getBatchUpdateOnlineType, updateDetailPresenter, updateDetailOnlineType } from '@/api/super-crm/cloud-showroom-shelves'
import user from '@/utils/user';
export default {
    props: {
        goodsId: {
            type: Number
        },
        storageType: {
            type: Number
        },
        searchValues: {
            type: Object
        }
    },
    data() {
        return {
            fileList: [], // 图片列表
            paramList: [], // 推荐位值
            paramListData: [], // 推荐位
            selectCheckData: [], // 修改推荐位值
            paramNumber: [], // 首饰参数
            paramSortList: ['文本标签一', '文本标签二'],
            sortDialog: false, // 是否显示弹窗
            sortLists: [], // 分类弹窗选择值
            showImgDialog: false,
            deleteDialog: false, // 删除图片提示窗
            deleteIndex: 0, // 删除图片数组的索引
            goodsDetailData: [],
            tableData: [{

            }]
        }
    },
    mounted() {
        const goodsId = this.goodsId;
        this.getProductDetail(goodsId);
    },
    methods: {
        // 商品详情
        getProductDetail(id) {
            // delete this.searchValues.presenter;
            // delete this.searchValues.shelvesRule;
            // delete this.searchValues.status;
            const searchItem = {
                storageType: null, // 饰品类型
                startPrice: '',  // 最低金额
                endPrice: '', // 最高金额
                startStock: '', // 最低库存
                endStock: '', // 最高库存
                largeCategory: '', // 大类
                smallCategory: '', // 小类
                text: '', // 搜索框
            }
            const params = {
                id,
                // ...this.searchValues
                ...searchItem
            }
            getProductDetail(params).then((res) => {
                if (res.code === 0) {
                    this.goodsDetailData = res.replyData ? res.replyData : [];
                    this.fileList = this.goodsDetailData.proPhotos.map((item) => {
                        return {
                            url: item.url,
                            response: {
                                data: [item.url]
                            }
                        }
                    });
                    this.paramNumber.length = 0;
                    this.paramSortList = this.goodsDetailData.classifiedOnLineVO.length > 0 ? this.goodsDetailData.classifiedOnLineVO.filter(item => item.isOpen === 1) : [];
                    this.paramListData = this.goodsDetailData.recommendVOs.length > 0 ? this.goodsDetailData.recommendVOs : [];
                    this.paramNumber.push(this.goodsDetailData.jewelryParams);
                    const param =  this.paramListData.filter(p => p.isOpen === 1);
                    this.paramList = param.map((item) => {
                        return item.presenterSequence + ',' + item.presenterId
                    });
                }
            })
        },
        getStockType() {
            if (this.paramNumber.length > 0) {
                return this.paramNumber[0].storageType;
            }
        },
        // 修改推荐位
        updateDetailPresenter() {
            const proId = parseInt(this.goodsId, 10);
            const recommendProductVo = this.paramList.map((item) => {
                return {
                    presenterSequence: parseInt(item.split(',')[0], 10),
                    id: parseInt(item.split(',')[1], 10)
                }
            });
            const params = {
                recommendProductVo,
                proId
            }
            updateDetailPresenter(params).then((res) => {
                if (res.code === 0) {
                    console.log();
                }
            });
        },
        // 返回
        goBack() {
            this.$emit('go-back');
        },
        onLeftItem(item, index) {
            this.fileList.splice(index - 1, 0, item);
            this.fileList.splice(index + 1, 1);
        },
        onRightItem(item, index) {
            this.fileList.splice(index + 2, 0, item);
            this.fileList.splice(index, 1);
        },
        // 移动最左边
        leftRemoveItem(item, index) {
            const subData = this.fileList.splice(0, 0, item);
            this.fileList.splice(index + 1, 1);
        },
        // 移动最右边
        rightRemoveItem(item, index) {
            this.fileList.push(item);
            this.fileList.splice(index, 1);
        },
        // 鼠标移入的时候
        showImgEnter(e) {
            const elem = e.target.lastElementChild;
            elem.style.display = 'flex';
        },
        showImgleave(e) {
            const elem = e.target.lastElementChild;
            elem.style.display = 'none';
        },
        // 上传图片之前
        beforeAvatarUpload(file) {
            const imgMsg = file.name.substring(file.name.lastIndexOf('.') + 1);
            const extension = imgMsg === 'jpg' || imgMsg === 'JPG' || imgMsg === 'png' || imgMsg === 'PNG'
            const isLt50M = file.size / 1024 / 1024 <= 0.3;
            if (!extension) {
                this.$message.error('仅支持jpg，png格式的图片');
                return false;
            }
            if (!isLt50M) {
                this.$message.error('上传图片大小不能超过300k');
                return false;
            }
            return extension && isLt50M;
        },
        // 上传图片
        submitUpload() {
            // this.$refs.upload.submit();
            console.log(this.fileList)
            const params = this.fileList.map((item) => {
                return {
                    proId: this.goodsId,
                    url: item.response.data[0]
                }
            });
            updateProDetailImg(params).then((res) => {
                if (res.code === 0) {
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    })
                }
            });
            this.updateDetailPresenter();
        },
        handleRemove(file) {
            console.log(file);
        },
        handlePreview(file) {
            console.log(file);
        },
        chanFile(file, fileList) {
        //    this.fileList = fileList;
        },
        uploadUrl() {
            return `${VUE_APP_BASE_API}/jop-marketing-web/market/upload`;
        },
         opt() {
            const opt = {
            ticket: user.serverUser.ticket,
            companyKey: user.serverUser.account.companyKey
            };
            return opt;
        },
         uploadLogoSuccess(res, file, fileList) {
             if (res.code == '0') {
                this.fileList = fileList;
                console.log(fileList)
             } else {
                 this.$message({
                    type: 'error',
                    message: res.msg
                })
             }
        },
        uploadLogoError() {
            this.$message.error('上传失败，请重新上传！');
        },
        // 点击上传文件
        goUpLoad() {
           document.querySelector('.upbtn').click();
        },
        // 删除图片
        deleteImg() {
            if (this.deleteIndex != 0) {
                // e.target.parentNode.remove();
                this.fileList.splice(this.deleteIndex, 1);
                this.deleteDialog = false;
                this.submitUpload();
            }
        },
        // 删除图片确认框
        deleteDialogFun(index) {
            if (index != 0) {
                this.deleteDialog = true;
                this.deleteIndex = index;
            }
        },
        // 上传文件限制个数
        limitUpload(files, fileList) {
            this.$message({
                message: '最多可添加8张图片',
                type: 'error'
            })
        },
        // 热门分类结果集查询
        getSelectOnLineCategorys() {
            this.sortDialog = true;
            const params = {
                jqzPage: {
                    pageNum: 1,
                    pageSize: 10
                }
            }
            getSelectOnLineCategorys(params).then((res) => {
                if (res.code === 0) {
                    this.selectCheckData = res.data.list ? res.data.list : [];
                    this.selectCheckData = this.selectCheckData.filter(item => item.status === 1);
                    // 返回商品选中的
                    const newArr = [];
                    this.selectCheckData.forEach((v) => {
                        this.paramSortList.forEach(item => {
                            if (v.categoryId == item.categoryId) {
                                newArr.push(v)
                            }
                        })
                    })
                    this.sortLists = newArr.map((item) => {
                        return item.categoryId
                    })
                }
            })
        },
        // 批量热门分类-确定
        saveDialogOnline() {
            const proIds = this.goodsId;
            const params = {
                onlineTypeIds: this.sortLists,
                proId: this.goodsId
            }
            updateDetailOnlineType(params).then((res) => {
                if (res.code === 0) {
                    this.sortDialog = false;
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    })
                    this.getProductDetail(this.goodsId);
                }
            })
        },
    }
}
</script>

<style lang="scss">
.param-wrapper{
    margin-top: 30px;
    .param-check{
        display: inline-block;
        .el-checkbox{
            margin-bottom: 15px;
        }
        .el-checkbox__label{
            width: 80px;
            font-size: 12px;
        }
    }
    .param-box{
        .p-title{
            font-size: 12px;
            font-weight: 600;
            color: #373E4F;
            margin-bottom: 30px;
            span{
                font-size: 12px;
                color: #40445C;
                font-weight: 400;
            }
        }
    }
    .param-upload-box{
        .el-upload--picture-card{
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
    }
    .param-box{
        margin-top: 20px;
        font-size: 14px;
       .param-title{
           margin: 10px 0;
           font-size: 12px;
           color: #373E4F;
           font-weight: 600;
       }
       .param-number{
           span{
               margin-right: 20px;
           }
       }
       .param-sort{
           margin: 10px 0;
           .sort-text{
               margin-right: 20px;
               font-size: 12px;
           }
           .upload-save{
               margin-left: 20px;
               background: #F7F7F7;
               color: #666;
               border-color: #E9E9E9;
               text-align: center;
           }
       }
       .param-command{
           margin: 10px 0;
           .param-check{
               display: inline-block;
               .el-checkbox{
                    margin-bottom: 15px;
                }
               .el-checkbox__label{
                   width: 80px;
                   font-size: 12px;
               }
           }
        }
    }
    .param-tip{
        margin-top: 20px;
        font-size: 12px;
        color: #40445C;
        font-weight: 400;
    }
    .save-btn {
        margin-top: 40px;
        .upload-back{
            width:190px;
            // background:rgba(242,245,248,1);
            // color: #5B81FE;
            font-size: 12px;
            margin-right: 10px;
            padding: 7px;
        }
        .upload-save{
            width: 312px;
            margin: 16px 0;
            margin-left: 20px;
            color: #FFF;
            text-align: center;
            color: #fff;
            margin: 6px 0;
            font-size: 12px;
            cursor: pointer;
            padding: 7px;
        }
    }
    .table-wrapper{
        margin-bottom: 30px;
        .has-gutter{
            tr{
                th{
                    div{
                        font-size: 12px;
                        color: #666;
                        font-weight: 600;
                    }
                }
            }
        }
        .el-table__header-wrapper{
            th{
                background: #F2F5F8;
            }
        }
        .el-table__body {
            .el-table__row {
                span{
                    margin-right: 0;
                    font-size: 12px;
                    font-weight: 400;
                }
            }
        }
    }
    .dialog-footer{
        .params-button{
            width: 68px;
            padding: 7px;
            font-size: 12px;
        }
    }
}
</style>