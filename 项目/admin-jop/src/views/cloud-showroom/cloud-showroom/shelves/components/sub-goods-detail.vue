<template>
    <div class="sub-goods-wrapper">
        <div class="sub-goods-tip">
            <p class="sub-title">说明：</p>
            <p class="sub-text">1. 不添加时默认展示为空白</p>
            <p class="sub-text">2. 每项简介支持文字、图片，字数不能超过2000</p>
            <p class="sub-text">3. 单张图片最大不得超过500k</p>
        </div>
        <div class="sub-goods-box">
            <p class="sub-title">产品介绍：</p>
            <el-form ref="form"
            :model="formData"
            label-width="0px"
            >
                <el-form-item >
                    <wang-editor ref="ue" type="shelves"/>
                </el-form-item>
                <el-form-item>
                    <el-button
                    class="button-style"
                    type="primary"
                    @click="updateProductDetail"
                    >
                    保存
                    </el-button>
                    <el-button  type="success" @click="goBack" class="button-style">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import WangEditor from '@/components/WangEditor.vue';
import { getProductDetail, updateProDetailText } from '@/api/super-crm/cloud-showroom-shelves'
export default {
    components: {
        WangEditor
    },
    props: {
        goodsId: {
            type: Number
        }
    },
    data() {
        return {
            formData: {
                detail: ''
            },
            text: '',
            goodsDetailData: [], // 商品详情数据
        }
    },
    methods: {
        // 返回
        goBack() {
            this.$emit('go-back');
        },
        setContents() {
            // 给富文本赋值
            this.$refs.ue.setContent(this.goodsDetailData.text);
        },
        updateProductDetail() {
            // 获取富文本纯数字内容
            const temp = this.$refs.ue.getContentText().replace(/<\/?[^>]*>/g, '').replace(/[ | ]*\n/g, '\n').replace(/&nbsp;/ig, 's');
            const imgVal = this.$refs.ue.getContent();
            const regex = new RegExp(/<img\b[^>]*src\s*=\s*"[^>"]*\.(?:png|jpg|bmp|gif)" *?(?=alt=)[^>]*>/g);
            const emioLen = imgVal.match(regex);
            let imgLen = 0;
            if (emioLen && Array.isArray(emioLen) && emioLen.length > 0) {
                imgLen = emioLen.length;
            }
            const limitNumber = temp.length + imgLen;
            if (limitNumber > 2000) {
                this.$message.error('字数不能超过2000');
                return
            }
            this.formData.detail =  this.$refs.ue.getContent();
            updateProDetailText({id: this.goodsId, text: this.formData.detail}).then((res) => {
                if (res.code === 0) {
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                }
            });
        },
        // 商品详情
        getProductDetail(id) {
            const params = {
                id
            }
            getProductDetail(params).then((res) => {
                if (res.code === 0) {
                    this.goodsDetailData = res.replyData ? res.replyData : [];
                    this.setContents();
                }
            })
        },
    }
}
</script>

<style lang="scss">
.sub-goods-wrapper{
    margin-top: 30px;
    color: #40445C;
    font-size: 14px;
    .sub-goods-tip{
        .sub-title{
            margin-bottom: 20px;
            font-size: 12px;
            color: #40445C;
            font-weight: 400;
        }
        .sub-text{
            font-size: 12px;
            font-weight: 400;
            color: #40445C;
        }
    }
    .sub-goods-box{
        margin-top: 30px;
        .sub-title{
            margin-bottom: 20px;
            font-size: 12px;
            color: #40445C;
        }
        .save-button{
            width: 450px;
        }
        .el-form{
            width: 560px;
        }
        .button-style{
            width: 68px;
            padding: 7px;
            font-size: 12px;
        }
    }
}
</style>