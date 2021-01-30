<template>
<div>
        <el-dialog
            title="上传商品图片"
            v-if="deleteDialog"
            :visible.sync="deleteDialog"
            width="38%"
            :center='true'
            :before-close="onDialogClose"
            >
            <el-tabs v-model="activeName">
                <el-tab-pane :label="`本地图片`" name="first">
                    <imgListSet ref="imgListSet" :imglist="imglist"></imgListSet>
                </el-tab-pane>
                <el-tab-pane :label="`JMP图片`" name="second">
                    <jmpListSet ref="jmpListSet" :proPhotos.sync="proPhotos"></jmpListSet>
                </el-tab-pane>
            </el-tabs>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" class="params-button" @click="onSaveImg()">确认上传</el-button>
            </span>
        </el-dialog>
</div>
</template>
<script>
import imgListSet from './img-ListSet.vue';
import jmpListSet from './jmp-ListSet.vue';
export default {
    components: {imgListSet , jmpListSet},
    props: {
        firsUrl: {
            type: String
        },
        proPhotos: {
           type: Array
        },
        imglist: {
           type: Array
        },
        deleteDialog: {
            type: Boolean
        }
    }
    ,
    data() {
        return {
            activeName: 'first',
            selectImglist: []
        }
    },
    methods: {
        onSaveImg(e) {
            this.selectImglist = [];
            this.$refs.imgListSet.fileList.map((item) => {
                if (item.lable == '1') {
                    if (item.url == this.firsUrl) {
                        this.selectImglist.unshift({url: item.url});
                    } else {
                        this.selectImglist.push({url: item.url});
                    }
                }
            });
            this.proPhotos.map((item) => {
                if (item.lable == '1') {
                   if (item.url == this.firsUrl) {
                        this.selectImglist.unshift({url: item.url});
                    } else {
                        this.selectImglist.push({url: item.url});
                    }
                }
            });
            if (this.selectImglist.length > 8) {
                this.$message.error('最多可添加8张图片');
                return;
            }
            this.$emit('onImagSelectList', this.selectImglist);
            this.$emit('onDialogClose', e);
        },
       onDialogClose(e) {
           this.$emit('onDialogClose', e);
       }
    },
}
</script>
<style lang="scss">
    .dialog-footer{
        .params-button{
            width: 68px;
            padding: 7px;
            font-size: 12px;
        }
    }

</style>