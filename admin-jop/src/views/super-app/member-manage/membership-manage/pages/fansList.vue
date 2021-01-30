<template>
    <div class="fans-list">
        <div class="fans-list-wrapper">
            <p class="fans-title-text">粉丝列表查看权限</p>
            <p class="fans-title">公共粉丝</p>
            <div class="fans-radio">
                <el-radio-group v-model="checkList.community">
                    <el-radio label="1">所有导购可看</el-radio>
                    <el-radio label="2">仅店长可看</el-radio>
                    <el-radio label="3">全部关闭</el-radio>
                </el-radio-group>
            </div>
            <p class="fans-title fans-title2">本店粉丝</p>
            <div class="fans-radio">
                <el-radio-group v-model="checkList.shop">
                    <el-radio label="1">所有导购可看</el-radio>
                    <el-radio label="2">仅店长可看</el-radio>
                    <el-radio label="3">全部关闭</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="fans-list-wrapper fans-list-box">
            <p class="fans-title-text">粉丝领取上限<span class="title-sub">仅对导购领取时有数量限制，对店长分配不产生影响</span></p>
            <div class="fans-radio">
                <el-radio-group v-model="checkList.limit" class="fans-box">
                    <el-radio label="Y">不限制领取上限</el-radio>
                    <el-radio label="N">限制导购领取</el-radio><el-input v-model="checkList.range" :disabled="checkList.limit === 'Y' ? true : false" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input><span style="font-size: 14px;color:#606266;">个粉丝</span>
                </el-radio-group>
            </div>
        </div>
        <div class="fans-button">
            <el-button type="primary" class="message-btn" @click="fansSetting">保存</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import { fansSetting, fansPermissions } from '@/api/system-set';
@Component({
})
export default class FansList extends Vue {
    // 合并注释
    private publicFans: string = '0';
    private fansNumber: string = '';
    private checkList = {
        community: '1', // 公共粉丝权限  1:所有导购可看  2:仅店长可看 3:全部关闭
        shop: '1', // 本店粉丝权限  1:所有导购可看  2:仅店长可看 3:全部关闭
        limit: 'Y', // 粉丝领取上限  Y不限制领取上限 N限制领取上限
        range: '1000', // 限制领取上限数量
    }
    private mounted() {
        this.fansPermissions();
    }
    // 粉丝列表权限查询
    private fansPermissions() {
        fansPermissions().then((res: any) => {
            if (res.code === 0) {
                this.checkList = res.data ? res.data : this.checkList;
                if (res.data.range === 0 || res.data.range === null) {
                    this.checkList.range = '1000';
                }
            }
        })
    }
    // 粉丝权限设置
    private fansSetting() {
        if (this.checkList.limit === 'N' && (this.checkList.range === '' || this.checkList.range === '0')) {
            this.$message.error('请输入粉丝领取上限数');
            const docElem: any = document.querySelector('.fans-box .el-input__inner');
            docElem.focus();
            return;
        }
        const params = this.checkList;
        fansSetting(params).then((res: any) => {
            if (res.code === 0) {
                this.$message({
                    message: res.msg,
                    type: 'success'
                });
                this.fansPermissions();
            }
        })
    }
}
</script>

<style lang="scss">
.fans-list{
    .fans-list-wrapper{
        margin-top: 20px;
        .fans-title-text{
            color: #333;
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: bold;
            .title-sub{
                font-size: 12px;
                margin-left: 18px;
                color: #B7C0CB;
                font-weight: 400;
            }
        }
        .fans-title{
            font-size: 16px;
            color: #333;
            margin-top: 20px;
            .title-sub{
                font-size: 13px;
                margin-left: 18px;
                color: #999;
            }
        }
        .fans-title2{
            margin-top: 40px;
        }
        .fans-radio{
            margin-top: 20px;
        }
    }
    .fans-list-box{
        margin-top: 50px;
        .fans-box{
            .el-radio{
                &:not(:first-child) {
                    margin-right: 4px;
                    margin-left: 20px;
                }
            }
            .el-input{
                display: inline;
                margin: 0 6px;
                .el-input__inner{
                    width: 100px;
                    text-align: center;
                }
            }
        }
    }
    .fans-button{
        margin-top: 50px;
        .message-btn{
            padding: 12px 45px;
        }
    }
}
</style>