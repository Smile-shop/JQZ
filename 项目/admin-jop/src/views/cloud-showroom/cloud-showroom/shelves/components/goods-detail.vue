<template>
    <div class="goods-detail-wrapper">
        <!-- 预览 -->
        <div class="goods-left-box">
            <div style="position: relative;">
                <div class="goods-title">
                    <span>商品详情</span>
                </div>
            </div>
            <div class="goods-preview">
                <span>预览</span>
                <div class="goods-div">
                    <p class="goods-ps"></p>
                    <div class="preview_bg">
                        <!-- <img src="@/assets/images/super-crm/cloud-showroom/goods.png" alt=""> -->
                        <div class="preview_img">
                            <img :src="detailImgage" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 商品参数 -->
        <div class="goods-right-box">
            <el-tabs v-model="tabActiveName" @tab-click="handleClick">
                <el-tab-pane label="商品参数" name="first">
                    <goods-parameter ref="goodsParam" :code="code" :searchValues="searchValue" :goodsId="goodsId" @go-back="goback" :storageType="storageType"></goods-parameter>
                </el-tab-pane>
                <el-tab-pane label="子商品列表" name="second">
                    <goods-list ref="goodsList" :searchValues="searchValue" :goodsId="goodsId" :shelveRule="shelveRule" @go-back="goback" :stockTyp="stockTyp"></goods-list>
                </el-tab-pane>
                <el-tab-pane label="商品详情" name="third">
                    <sub-goods-detail ref="goodsDea" :goodsId="goodsId" @go-back="goback"></sub-goods-detail>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import goodsList from './goods-list'
import goodsParameter from './goods-parameter'
import subGoodsDetail from './sub-goods-detail'
export default {
    components: {
        goodsList,
        goodsParameter,
        subGoodsDetail,
    },
    props: {
        code: {
            type: String
        },
        goodsId: {
            type: Number
        },
        goodsStatus: {
            type: Number
        },
        shelveRule: {
            type: Number
        },
        storageType: {
            type: Number
        },
        searchValue: {
            type: Object
        }
    },
    data() {
        return {
            tabActiveName: 'first',
            tabIndex: '0',
            detailImgage: require('@/assets/images/super-crm/cloud-showroom/detail.png'),
            goodsDetailValue: [],
            stockTyp: null // 获取商品参数的类型
        }
    },
    methods: {
        handleClick(tab, event) {
            this.tabIndex = tab.index;
            if (this.tabIndex == 0 || this.tabIndex == 2) {
                this.$refs.goodsParam.getProductDetail(this.goodsId);
            }
            if (this.tabIndex == 1) {
                this.$refs.goodsList.getProductSubDetail(this.goodsId, null);
                this.stockTyp = this.$refs.goodsParam.getStockType();
            }
            if (this.tabIndex == 2) {
                this.$refs.goodsDea.getProductDetail(this.goodsId);
            }
        },
        // 返回
        goback() {
            if (this.$route.query.goodsDetailId) {
                this.$router.back();
            } else {
                this.$emit('go-back', '0');
                const getCurrentPage = localStorage.getItem('currentPage');
                this.$emit('get-curPage', getCurrentPage);
            }
        }
    }
}
</script>

<style lang="scss">
.goods-detail-wrapper{
    display: flex;
    flex-direction: row;
    .goods-left-box{
        width: 500px;
        // width: 639px;
        min-height: 800px;
        position: relative;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 39px 0px rgba(120,148,245,0.1);
        border-radius:12px;
        .goods-title{
            padding: 8px 20px 12px;
            &::after{
                position: absolute;
                bottom: 0;
                left: 20px;
                right: 20px;
                height: 1px;
                content: '';
                -webkit-transform: scaleY(.5);
                transform: scaleY(.5);
                background-color: #EAEEF6;
            }
            span{
                padding: 0 0 11px;
                color: #666666;
                font-size: 14px;
                border-bottom: 2px solid #2E5BFF;
            }
        }
        .goods-preview{
            margin-top: 30px;
            text-align: center;
            width: 500px;
            position: relative;
            span{
                font-size: 14px;
                color: #373E4F;
            }
            .goods-div{
                width:266px;
                position:absolute;
                margin:auto;
                left:0;
                top:10px;
                right:0;
                bottom:0;
                .goods-ps{
                    position: relative;
                    width: 225px;
                    height: 18px;
                    z-index: 99;
                    bottom: -83px;
                    background: #fff;
                    left: 27px;
                }
                .preview_bg{
                    width: 280px;
                    height: 694px;
                    background: url(~@/assets/images/super-crm/cloud-showroom/goods.png) no-repeat;
                    background-size: 100%;
                    margin-top: 29px;
                    .preview_img{
                        width: 100%;
                        height: 500px;
                        overflow: hidden;
                    }
                }
                img{
                    width: 232px;
                    position: relative;
                    top: 40px;
                }
            }
        }
    }
    .goods-right-box{
        flex: 1;
        margin-left: 30px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 39px 0px rgba(120,148,245,0.1);
        border-radius:12px;
        padding-left: 30px;
    }
}
</style>