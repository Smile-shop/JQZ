<template>
    <div>
           <el-upload
                class="upload-demo"
                ref="upload"
                action=""
                :headers="opt()"
                :multiple="true"
                :http-request="uploadUrl"
                :file-list="fileList"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :limit=8
                :on-exceed="limitUpload"
                :auto-upload="true">
                <el-button ref="uploadUp" class="params-button" slot="trigger" size="small" type="primary">本地上传</el-button>
            </el-upload>
             <ul class="upload-img-box" v-if="fileList">
                <li class="upload-li" v-for="(item, index) in fileList" :key="index">
                    <div class="btn-div" >
                        <el-checkbox
                            v-model="item.lable"
                            true-label="1"
                            false-label="0"
                        >
                        </el-checkbox>
                        <img src="@/assets/images/super-crm/cloud-showroom/close-circle.png"  @click="onDelectItem(item)"/>
                    </div>
                    <div class="upload-im" >
                        <img  v-if="item.url" :src="item.url" alt="" @click="onSelectImg(item)">
                        <img v-else src="@/assets/images/super-crm/cloud-showroom/default.png" @click="onSelectImg(item)"/>
                    </div>
                </li>
            </ul>
            <!-- 图片删除弹窗 -->
            <el-dialog
                class=""
                title="提示"
                :visible.sync="deleteDialog"
                :append-to-body="true"
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
import user from '@/utils/user';
import {marketupload} from '@/api/common';
export default {
   props: {
        imglist: {
           type: Array
        }
    },
    data() {
        return {
            fileList: [],
            deleteDialog: false, // 删除图片提示窗
            deleteItem: null // 删除图片数组的索引
        }
    },
    mounted() {
        this.initFileList();
    },
    methods: {
        // 删除图片
        deleteImg() {
            const index = this.fileList.indexOf(this.deleteItem);
            if (index != -1) {
                this.fileList.splice(index, 1);
            }
            this.deleteDialog = false;
        },
        initFileList() {
            this.fileList = Object.assign(this.imglist);
        },
        onDelectItem(item) {
            this.deleteDialog = true;
            this.deleteItem = item;
        },
        onSelectImg(item) {
            item.lable = item.lable == '0' ? '1' : '0';
        },
        uploadUrl(res) {
            const {file} = res;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('alias', 'photos');
            marketupload(formData).then((res) => {
                const {data} = res;
                this.fileList.push({url: data[0], lable: '1'});
            })
        },
        opt() {
            const opt = {
            ticket: user.serverUser.ticket,
            companyKey: user.serverUser.account.companyKey
            };
            return opt;
        },
        // 点击上传文件
        goUpLoad() {
            this.showUploadDialog = true;
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
        // 上传文件限制个数
        limitUpload(files, fileList) {
            this.$message({
                message: '最多可添加8张图片',
                type: 'error'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
 .upload-img-box{
    overflow: scroll;
    display: grid;
    grid-template-columns: repeat(7, 80px);
    grid-column-gap: 10px;
 }
 .btn-div{
    display:flex;
    align-items: center;
    justify-content: space-between;
    position:absolute;
    z-index:10;
    width: 100%;
    top: -4px;
 }
 .upload-li{
     margin-top: 10px;
    border-radius: 4px;
    border: 1px solid #D9D9D9;
    position: relative;
    width: 80px;
    height: 80px;
    margin-left: 0px;
 }
 .upload-im{
    width: 100%;
    height: 80px;
    border-radius: 4px;
    border: 1px solid #D9D9D9;
    position: relative;
    img{
        width: 100%;
        height:100%;
        border-radius: 4px;
        object-fit: contain;
    }
}
.dialog-footer{
        .params-button{
            width: 68px;
            padding: 7px;
            font-size: 12px;
        }
    }
</style>