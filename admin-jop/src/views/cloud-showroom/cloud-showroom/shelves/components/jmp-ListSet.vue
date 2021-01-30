<template>
    <div>
        <ul class="upload-img-box" v-if="proPhotos">
            <li class="upload-li" v-for="(item, index) in proPhotos" :key="index">
                    <div class="upload-im" >
                        <div class="btn-div" >
                        <el-checkbox
                            v-model="item.lable"
                            true-label="1"
                            false-label="0"
                        >
                        </el-checkbox>
                    </div>
                        <img v-if="item.url" :src="item.url" alt="" @click="onSelectImg(item)">
                        <img v-else src="@/assets/images/super-crm/cloud-showroom/default.png" @click="onSelectImg(item)"/>
                    </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        proPhotos: {
           type: Array
        }
    },
    methods: {
        onSelectImg(item) {
            item.lable = item.lable == '0' ? '1' : '0';
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