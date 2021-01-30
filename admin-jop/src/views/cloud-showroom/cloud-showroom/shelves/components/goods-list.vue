<template>
    <div class="goods-list">
        <!-- 新增 -->
        <div class="goods-box">
            <!-- <el-button v-if="shelveRule === 1" type="info" disabled>新增</el-button> -->
            <el-button  type="primary" class="goods-button" @click="dialogAddFn">新增</el-button>
            <el-button  type="success" class="goods-button" @click="goBack">返回</el-button>
            <div class="rule-select">
                <span class="rule-status">上架状态：</span>
                <el-select @change="selectChange" v-model="searchValue.statusRule"  placeholder='上架规则'>
                    <el-option
                    v-for="item in statusRuleList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>

        <!-- 表格数据 -->
        <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @filter-change="filterChange"
        @selection-change="handleSelectionChange"
        class="table-wrapper"
        >   <el-table-column
                type="selection"
                key="selection"
                label="选择"
                align="center"
                width="55">
            </el-table-column>
            <el-table-column
                type="index"
                label="序号"
                key="index"
                :index="indexMethod"
                >
            </el-table-column>
            <el-table-column
                prop="photo"
                label="图片"
                key="photo"
                >
                <template slot-scope="scope">
                    <img v-if="scope.row.photo" :src="scope.row.photo" style="width: 60px;height:60px;object-fit: contain;">
                    <img v-else src="@/assets/images/super-crm/cloud-showroom/default.png" style="width:60px;height: 60px;"/>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称"
                key="name"
                width="140">
            </el-table-column>
            <el-table-column
                prop="code"
                label="条码号"
                key="code"
                >
            </el-table-column>
            <el-table-column
                prop="largeCategory"
                label="大类"
                key="largeCategory"
                >
            </el-table-column>
            <el-table-column
                prop="smallCategory"
                label="小类"
                key="smallCategory"
                >
            </el-table-column>
            <el-table-column
                prop="price"
                label="总库存标价"
                key="price"
                >
            </el-table-column>
            <el-table-column
                prop="stockCount"
                label="JMP库存"
                key="stockCount"
                >
            </el-table-column>
            <!-- <el-table-column
                label="上架状态"
                prop="status"
                :filters="filterStatus"
                :filter-multiple="false"
                :column-key="'types'"
                key="status"
                >
                 <template slot-scope="scope">
                    <span>
                    {{scope.row.status == 1 ? '已上架' : scope.row.status == 0 ? '未上架' : scope.row.status == 2 ? '已下架' : '请选择'}}
                    </span>
                </template>
            </el-table-column> -->
            <el-table-column
                prop="status"
                label="上架状态"
                key="stockCounts"
                >
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 1">已上架</span>
                    <span v-if="scope.row.status == 2">已下架</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                key="opertion"
                >
                <template slot-scope="scope">
                    <span class="opertion-text" @click="updateSubProStatus(scope.row.proId, 1, scope.row.id)" v-if="scope.row.status == 0">
                       上架
                    </span>
                    <span class="opertion-text" @click="updateSubProStatus(scope.row.proId, 2, scope.row.id)" v-if="scope.row.status == 1">
                        下架
                    </span>
                    <span class="opertion-text" @click="updateSubProStatus(scope.row.proId, 1, scope.row.id)" v-if="scope.row.status == 2">
                       上架
                    </span> |
                    <span class="opertion-text" @click="updateSubProStatus(scope.row.proId, 3, scope.row.id,)">
                       移除
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <div class="client-footer" style="margin-top: 20px">
            <el-button class="button-style button-btn" @click="toggleSelection(tableData)">全选</el-button>
            <el-button class="button-style" type="info" @click="updateSubProStatus('', 2)">批量下架</el-button>
            <el-button class="button-style" type="info" @click="updateSubProStatus('', 1)">批量上架</el-button>
            <el-button class="button-style" type="info" @click="updateSubProStatus('', 3, '')">批量移除</el-button>
        </div>
        <!-- 新增上架 -->
        <el-dialog
            title="商品筛选"
            :visible.sync="dialogAddShelves"
            width="96%"
            class="select-dialog">
            <add-goods ref="addElemt" :proId="goodsId" :stockTyp="stockTyp" @get-data="getProductSubDetail(goodsId, 1)"></add-goods>
        </el-dialog>
        <!-- 分页 -->
        <div class="pagination-box">
            <el-pagination
                layout="total,prev, pager, next,sizes, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                background
                :page-sizes="[10, 20, 50, 100, 200, 500]"
                :page-size.sync="pageSize"
                :total="tableTotal"
                >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import addGoods from './add-goods'
import { getProductSubDetail, updateSubProStatus, delSubPro } from '@/api/super-crm/cloud-showroom-shelves'
export default {
    components: {
        addGoods
    },
    props: {
        goodsId: {
            type: Number
        },
        shelveRule: {
            type: Number
        },
        stockTyp: {
            type: Number
        },
        searchValues: {
            type: Object
        }
    },
    data() {
        return {
            tableData: [],
            filterStatus: [{text: '已上架', value: '1'}, {text: '未上架', value: '0'}, {text: '已下架', value: '2'}],
            currentPage: 1, // 当前页
            pageSize: 10,
            tableTotal: 0,
            selectStatus: 1,
            dialogAddShelves: false, // 新增
            proId: null,
            multipleSelection: [],
            statusRuleList: [ // 上架规则
                {
                    value: null,
                    label: '全部',
                },
                {
                    value: 1,
                    label: '已上架',
                },
                {
                    value: 2,
                    label: '已下架',
                }
            ],
            searchValue: {
                statusRule: null
            }
        }
    },
    methods: {
        // 新增
        dialogAddFn() {
            this.dialogAddShelves = true;
            this.$nextTick(() => {
                this.$refs.addElemt.getFindStockProduts();
            })
        },
        // 索引
        indexMethod(index) {
            return index + this.pageSize * (this.currentPage - 1) + 1;
        },
        // 返回
        goBack() {
            this.$emit('go-back');
        },
        filterChange(filters) {
            if (filters.types.length > 0) { // goodsId: 24
                this.getProductSubDetail(this.goodsId, filters.types[0]);
                this.selectStatus = filters.types[0];
            }
        },
        // 全选的值
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
         // 全选
        toggleSelection(rows) {
            if (rows) {
                this.$refs.multipleTable.toggleAllSelection();
            }
        },
        // （子商品列表分页查询）
        getProductSubDetail(id, status) {
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
                data: {
                    id,
                    status, // 上架状态
                    // ...this.searchValues
                    ...searchItem
                },
                page: {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize
                }
            }
            getProductSubDetail(params).then((res) => {
                if (res.code === 0) {
                    this.tableData = res.replyData.list ? res.replyData.list : [];
                    this.tableTotal = res.replyData.total;
                    const tData = this.tableData.filter(p => p.proId);
                    // this.proId = tData[0].proId;
                }
            });
        },
        // 查询选中的值
        selectChange(val) {
            this. getProductSubDetail(this.goodsId, val);
        },
        // 商品详情2子商品上架状态修改 以及移除
        updateSubProStatus(id, status, subId) {
            let params = {};
            if (id) {
                params = {
                    // proId: id,
                    status,
                    ids: [subId]
                }
            } else {
                if (this.multipleSelection.length == 0) {
                    this.$message({
                        type: 'error',
                        message: '请选择要操作的数据'
                    })
                    return
                }
                const ids = this.multipleSelection.map((item) => {
                    return item.id
                })
                // const proIds = this.multipleSelection.length > 0 ? this.multipleSelection[0].proId : '';
                params = {
                    // proId: proIds,
                    status,
                    ids
                }
            }
            updateSubProStatus(params).then((res) => {
                if (res.code === 0) {
                    if (status === 1) {
                        this.$message({
                            message: '上架成功',
                            type: 'success'
                        });
                    }
                    if (status === 2) {
                        this.$message({
                            message: '下架成功',
                            type: 'success'
                        });
                    }
                    if (status === 3) {
                        this.$message({
                            message: '移除成功',
                            type: 'success'
                        });
                    }
                    if (status === 0) {
                        this.$message({
                            message: '上架成功',
                            type: 'success'
                        });
                    }
                    this.getProductSubDetail(this.goodsId, this.searchValue.statusRule);
                }
            });
        },
        // 移除
        delSubPro(id, code, style) {
            let params = {};
            // style 1 单个移除 2批量移除
            if (style === 1) {
                params = {
                    proId: id,
                    ids: [code]
                }
            } else {
                if (this.multipleSelection.length == 0) {
                    this.$message({
                        type: 'error',
                        message: '请选择要操作的数据'
                    })
                    return
                }
                const codes = this.multipleSelection.map((item) => {
                    return item.code
                })
                const proIds = this.multipleSelection.length > 0 ? this.multipleSelection[0].proId : '';
                params = {
                    proId: proIds,
                    ids: codes
                }
            }
            updateSubProStatus(params).then((res) => {
                if (res.code === 0) {
                    this.$message.success('移除成功');
                    this.getProductSubDetail(this.goodsId, this.searchValue.statusRule);
                }
            })
        },
        // 分页
        handleSizeChange(val) {
            this.getProductSubDetail(this.goodsId, this.searchValue.statusRule);
        },
        handleCurrentChange(val) {
            this.getProductSubDetail(this.goodsId, this.searchValue.statusRule);
        },
    },
}
</script>

<style lang="scss">
.goods-list{
    margin-top: 30px;
    .goods-box{
        margin-bottom: 30px;
        .goods-button{
            width: 68px;
            padding: 7px;
            font-size: 12px;
            font-weight: 400;
        }
    }
    .rule-select{
        float: right;
        margin-right: 2px;
        .rule-status{
            font-size: 12px;
            font-weight: 600;
        }
        .el-select{
            width: 100px;
            .el-input{
                font-size: 12px;
            }
        }
    }
    .table-wrapper{
        .has-gutter{
            th{
                background: #F2F5F8;
                .cell{
                    font-size: 12px;
                    font-weight: 600;
                    color: #666;
                }
            }
        }
        .el-table__body{
            tr{
                .cell{
                    font-size: 12px;
                    font-weight: 400;
                    color: #666;
                }
            }
        }
        .opertion-text{
            color: #3E3EF4;
            cursor: pointer;
        }
    }
    .pagination-box{
        position: relative;
        padding: 50px 0 10px;
        .el-pagination{
            position: absolute;
            bottom: 0;
            right: 0;
        }
    }
    .client-footer{
        .button-btn{
            margin-right: 30px;
        }
        .button-style{
            background: #E9E9E9;
            border:1px solid rgba(233,233,233,1);
            color: #666;
            font-size: 12px;
        }
    }
}
</style>
<style lang='scss' scoped>
.el-select-dropdown__item{
    font-size: 12px;
}
</style>