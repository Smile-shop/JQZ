<!--
 * @Descripttion:
 * @version:
 * @Author: XJHong
 * @Date: 2020-06-19 10:14:32
 * @LastEditTime: 2020-07-14 17:59:56
-->
<template>
    <div class="order-detail-wrapper">
        <div class="order-detail-top">
            <span class="order-info">订单号：{{orderId}}</span>
            <span class="order-info">客户名称：{{customerName}}</span>
            <span class="order-info">订单数量：{{total}}</span>
            <span class="order-info">订单总金额(元)：{{totalAmount}}</span>
        </div>
        <!-- 表格数据 -->
        <el-table
            :data="tableData"
            class="detail-table">
            <el-table-column
                type="index"
                label="序号"
                align="center"
                :index="indexMethod"
                width="120">
            </el-table-column>
            <el-table-column
                prop="productName"
                label="商品名称"
                align="center">
            </el-table-column>
            <el-table-column
                prop="code"
                label="商品编号"
                align="center">
            </el-table-column>
            <el-table-column
                prop="storageType"
                label="类型"
                align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.storageType === 1 ? '首饰' : '饰品'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="largeCategory"
                label="大类"
                align="center">
            </el-table-column>
            <el-table-column
                prop="smallCategory"
                label="小类"
                align="center">
            </el-table-column>
            <el-table-column
                prop="orderedPrice"
                label="线上价格"
                align="center">
            </el-table-column>
            <el-table-column
                prop="stockPrice"
                label="线下价格"
                align="center">
            </el-table-column>
            <el-table-column
                prop="ratio"
                label="客户倍率"
                align="center">
            </el-table-column>
            <el-table-column
                prop="productCount"
                label="下单数量（件）"
                align="center">
            </el-table-column>
            <el-table-column
                prop="stockNum"
                label="JMP库存"
                align="center">
            </el-table-column>
            <el-table-column
                label="需补"
                align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.productCount > scope.row.stockNum ? scope.row.productCount - scope.row.stockNum : 0 }}</span>
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
import {orderDetails} from '@/api/super-crm/cloud-showroom-orderRecord'
@Component({})
export default class Index extends Vue {
    private tableData = []
    private page = {
        total: 0,
        pageSize: 10,
        current: 1
    }
    private orderId = ''
    private customerName: string = ''
    private totalAmount: string = ''
    private total: string = ''
    // 索引
    private indexMethod(index: any) {
        return index + this.page.pageSize * (this.page.current - 1) + 1;
    }
    private mounted() {
        const orderId: any = this.$route.query.orderId;
        const customerName: any = this.$route.query.customerName;
        const totalAmount: any = this.$route.query.totalAmount;
        const total: any = this.$route.query.total;
        this.orderId = orderId
        this.customerName = customerName
        this.totalAmount = totalAmount
        this.total = total
        this.init();
    }
    private init() {
        const params = {
            data: {
                orderId: this.$route.query.orderId
            },
            page: {
                pageNum: this.page.current,
                pageSize: this.page.pageSize
            }
        }
        orderDetails(params, this.$route.query.customerId).then((res: any) => {
            this.tableData = res.data.list || [];
            this.page.total = res.data.total || 0;
        })
    }
}
</script>

<style lang="scss">
.order-detail-wrapper {
    .order-detail-top{
        margin-top: 10px;
        .order-info{
            font-size: 16px;
            color: #000;
            &:not(:first-child) {
                margin-left: 70px;
            }
        }
    }
    .detail-table{
        margin-top: 20px;
        .el-table__header{
            .has-gutter{
                tr{
                    th.is-leaf{
                        background: #EBEEF3;
                    }
                }
            }
        }
    }
    .table-page{
        margin-top: 20px;
        text-align: right;
    }
}
</style>