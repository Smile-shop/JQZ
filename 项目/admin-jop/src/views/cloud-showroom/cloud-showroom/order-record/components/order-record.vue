<!--
 * @Descripttion:
 * @version:
 * @Author: XJHong
 * @Date: 2020-06-19 10:13:16
 * @LastEditTime: 2020-07-15 14:00:41
-->
<template>
    <div class="order-wrapper">
        <div class="order-record-search">
            <div class="info">全部订单：<span>{{page.total}}</span></div>
            <el-form :inline="true" :model="orderSearch" class="demo-form-inline">
                <el-form-item label="筛选订单：">
                    <el-select v-model="orderSearch.orderStatus" placeholder="请选择">
                    <el-option label="全部" value=4></el-option>
                    <el-option
                        v-for="item in searchName"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间：">
                    <el-date-picker
                    v-model="timer"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="record-input">
                    <el-input placeholder="输入订单号/客户名" v-model="orderSearch.likeName"></el-input>
                </el-form-item>
                <el-form-item class="record-btn">
                    <el-button type="primary" @click="init">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" @click="resetMethod" class="record-reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table :data="tableData" class="order-record-box">
            <el-table-column
                type="index"
                label="序号"
                align="center"
                :index="indexMethod"
                width="120">
            </el-table-column>
            <el-table-column
                prop="orderId"
                label="订单编号"
                align="center">
            </el-table-column>
            <el-table-column
                prop="customerName"
                label="客户名称"
                align="center">
            </el-table-column>
            <el-table-column
                prop="principal"
                label="联系人"
                align="center">
            </el-table-column>
            <el-table-column
                prop="customerPhone"
                label="联系方式"
                align="center">
            </el-table-column>
            <el-table-column
                prop="submitTime"
                label="下单时间"
                align="center">
            </el-table-column>
            <el-table-column
                prop="orderStatus"
                label="订单状态"
                align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.orderStatus === 0 ? '待确认': scope.row.orderStatus === 1 ? '已确认':  scope.row.orderStatus === 2 ? '配货中' : scope.row.orderStatus === 3 ? '已完成':  '已取消'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="customerRemark"
                label="订单备注"
                align="center">
            </el-table-column>
            <el-table-column
                prop="total"
                label="下单数量（件）"
                align="center">
            </el-table-column>
            <el-table-column
                prop="totalAmount"
                label="订单总金额"
                align="center">
            </el-table-column>
            <el-table-column
                prop="clerkName"
                label="营业员"
                align="center">
            </el-table-column>
            <el-table-column
                label="订单详情"
                align="center">
                <template slot-scope="scope">
                    <span class="table-column-go" @click="goDetail(scope.row)">查看</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
          class="table-page"
          background
          layout="total, prev, pager, next, sizes, jumper"
          :page-sizes="[10, 20, 50, 100, 200, 500]"
          :page-size.sync="page.pageSize"
          @size-change="init"
          @current-change="init"
          :current-page.sync="page.current"
          :total="page.total"
        ></el-pagination>
    </div>
</template>
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator'
import {orderHistory} from '@/api/super-crm/cloud-showroom-orderRecord'
@Component({})
export default class Index extends Vue {
    private orderSearch = {
        orderStatus: null,
        likeName: ''
    }
    private timer = ''
    // private searchName = ['待确认', '已确认', '备货中', '已取消']
    private searchName = [
        {
            label: '待确认',
            value: 0
        },
        {
            label: '已确认',
            value: 1
        },
        {
            label: '配货中',
            value: 2
        },
        {
            label: '已取消',
            value: -1
        },
        {
            label: '已完成',
            value: 3
        },
    ]
    private tableData = []
    private page = {
        total: 0,
        pageSize: 10,
        current: 1
    }
    // 索引
    private indexMethod(index: any) {
        return index + this.page.pageSize * (this.page.current - 1) + 1;
    }
    private mounted() {
        this.init();
    }
    // 重置
    private resetMethod() {
        this.orderSearch.orderStatus = null;
        this.orderSearch.likeName = ''
        this.timer = ''
    }
    private init() {
        // 订单记录
        const params = {
            data: {
                ...this.orderSearch,
                strTime: this.timer ? this.timer[0] : '',
                endTime: this.timer ? this.timer[1] : ''
            },
            page: {
                pageNum: this.page.current,
                pageSize: this.page.pageSize
            }
        }
        orderHistory(params).then((res: any) => {
            this.tableData = res.data.list || [];
            this.page.total = res.data.total || 0;
        })
    }
    private goDetail(data: any) {
        this.$router.push({
            path: 'order-detail',
            query: {
                orderId: data.orderId,
                customerName: data.customerName,
                totalAmount: data.totalAmount,
                total: data.total,
                customerId: data.customerId
            }
        })
    }
}
</script>

<style lang="scss">
.order-wrapper {
    .order-record-search{
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        .info{
            justify-content: flex-start;
            font-size: 16px;
            color: #000;
        }
        .demo-form-inline{
            flex: 1;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .el-form-item{
                margin-bottom: 0;
                .el-form-item__label{
                    color: #000;
                }
                .record-reset{
                    background: #f7f7f7;
                    border: 1px solid #E9E9E9;
                    span{
                        color: #666;
                    }
                }
            }
            .record-input{
                margin-right: 0;
                .el-input{
                    input{
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                    }
                }
            }
            .record-btn{
                .el-button{
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                }
            }
        }
    }
    .order-record-box{
        .el-table__header{
            .has-gutter{
                tr{
                    th{
                        background: #EBEEF3;
                    }
                }
            }
        }
        .el-table__body {
            .table-column-go{
                font-size: 14px;
                color: #2870FE;
                cursor: pointer;
            }
        }

    }
    .table-page{
        margin-top: 20px;
        text-align: right;
    }
}
</style>