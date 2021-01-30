<template>
    <div class="client-search add-shelves">
        <!-- 搜索项 -->
        <div class="client-search-box" style="float: inherit;">
            <el-radio v-model="searchData.storageType" :label=1 @change="removeVal">首饰库</el-radio>
            <el-radio v-model="searchData.storageType" :label=2 @change="removeVal">饰品库</el-radio>
            <span style="color: #FD4D4D;margin-right:4px;">*</span><span class="search-title">上架规则：</span>
                <template v-if="searchData.storageType == 1">
                    <el-select v-model="searchData.shelvesRule"  placeholder="批量操作">
                        <el-option
                        v-for="item in shelvesRuleList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </template>
                <template v-else>
                    <el-select v-model="searchData.shelvesRule"  placeholder="批量操作">
                        <el-option
                        v-for="item in shelvesRuleList2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </template>
             <span class="search-title">价格区间：</span><el-input class="shelves-input" @keyup.native="handleClick('startPrice')" v-model.number="searchData.startPrice" placeholder="￥最低金额"></el-input>
                <span>-</span>
                <el-input class="shelves-input" @keyup.native="handleClick('endPrice')" v-model.number="searchData.endPrice" placeholder="￥最高金额"></el-input>
            <span class="search-title">库存区间：</span><el-input class="shelves-input" @keyup.native="handleClick('startStock')" v-model.number="searchData.startStock" placeholder="最低库存"></el-input>
                <span>-</span>
                <el-input class="shelves-input" @keyup.native="handleClick('endStock')" v-model.number="searchData.endStock" placeholder="最高库存"></el-input>
            <el-select class="goShop" @change="getShopChange" v-model="searchData.shopName" placeholder="分销商">
                <el-option
                v-for="(item, index) in shopNameList"
                :key="index"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select @focus="listCabinetGroup" v-model="searchData.inCabinetGroup" placeholder="柜组">
                <el-option
                v-for="(item, index) in inCabinetGroupList"
                :key="index"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select @focus="getDisplay" v-model="searchData.largeCategory" placeholder="大类">
                <el-option
                v-for="(item, index) in largeClassList"
                :key="index"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="searchData.smallCategory" placeholder="小类">
                <el-option
                v-for="(item, index) in subClassList"
                :key="index"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-input class="search-input" v-model.trim="searchData.code" placeholder="输入名称和款号"></el-input><el-button class="shelves-btn" @click="goSearch" type="primary">查询</el-button>
            <el-button type="info"  @click="resetFun" class="button-style shelves-btn">重置</el-button>
        </div>
        <!-- 表格数据 -->
        <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        class="table-wrapper"
        height="470"
        @selection-change="handleSelectionChange"
        >
        <el-table-column
            type="selection"
            label="选择"
            align="center"
            width="55">
        </el-table-column>
        <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="120">
        </el-table-column>
        <el-table-column
            prop="photo"
            label="图片"
            >
            <template slot-scope="scope">
                <img v-if="scope.row.photo" :src="scope.row.photo" style="width:40px;height:40px;object-fit:cover;">
                <img v-else src="@/assets/images/super-crm/cloud-showroom/default.png" style="width:40px;height: 40px;"/>
            </template>
        </el-table-column>
        <el-table-column
            prop="name"
            label="名称"
            key="name"
            >
        </el-table-column>
        <el-table-column
            key="code"
            prop="code"
            :label="coseValue === 1 ? '条码号' : coseValue === 2 ? '外部款号' :coseValue === 3 ? '内部款号' :coseValue === 4 ? '原编号' : '线上编号'"
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
            prop="strOPrice"
            label="总库标价"
            key="strOPrice"
            >
            <template slot-scope="scope">
                <span v-if="coseValue == 1">￥{{scope.row.strOPrice}}</span>
                <span v-else>￥{{scope.row.smallStrOPrice}} ~ ￥{{scope.row.largeStrOPrice}}</span>
            </template>
        </el-table-column>
        <template v-if="coseValue != 1">
            <el-table-column
                prop="waitShelfNum"
                label="待上架数量"
                key="waitShelfNum"
                >
            </el-table-column>
            <el-table-column
                prop="onShelfNum"
                label="已上架数量"
                key="onShelfNum"
                >
            </el-table-column>
            <el-table-column
                prop="downShelfNum"
                label="已下架数量"
                key="downShelfNum"
                >
            </el-table-column>
        </template>
        <el-table-column
            prop="stockNum"
            label="JMP库存数量"
            key="stockNum"
            >
        </el-table-column>
        <template v-if="coseValue == 1">
            <el-table-column
            prop="storageTime"
            label="入库时间"
            >
            <template slot-scope="scope">
                <span>{{timestampToTime(scope.row.storageTime, 1)}}</span>
            </template>
            </el-table-column>
        </template>
        </el-table>
        <!-- 全选 -->
        <div class="client-footer" style="margin-top: 20px">
            <el-button class="button-style" @click="toggleSelection(tableData)">全选</el-button>
            <el-button @click="getBatchAddWait" type="primary" class="button-style">添加到待上架列表</el-button>
        </div>
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
import {getFindStockProduts, getBatchAddWait, listCabinetGroup} from '@/api/super-crm/cloud-showroom-shelves'
import { getDisplay } from '@/api/super-crm/csr-classifySearch'
import { getWxShopList } from '@/api/super-crm/wx-member'
export default{
    // props: {
    //     largeClassList: {
    //         type: Array
    //     },
    //     subClassList: {
    //         type: Array
    //     }
    // },
    data() {
        return {
            currentPage: 1, // 当前页
            pageSize: 10,
            tableTotal: 0,
            multipleSelection: [],
            // 搜索值
            coseValue: null,
            searchData: {
                code: '', // 输入名称和款号进行搜索
                endPrice: '', // 最高金额
                endStock: '', // 最高库存
                largeCategory: '',  // 大类
                shelvesRule: 1, // 上架/搜索规则
                smallCategory: '', // 小类
                startPrice: '', // 最低金额
                startStock: '', // 最低库存
                storageType: 1, // 首饰
                shopName: null, // 分销商
                inCabinetGroup: null // 柜组
            },
            searchItem: {
                code: '', // 输入名称和款号进行搜索
                endPrice: '', // 最高金额
                endStock: '', // 最高库存
                largeCategory: '',  // 大类
                shelvesRule: 1, // 上架/搜索规则
                smallCategory: '', // 小类
                startPrice: '', // 最低金额
                startStock: '', // 最低库存
                storageType: 1 // 首饰
            },
            shopNameList: [], // 分销商
            inCabinetGroupList: [], // 柜组
            shelvesRuleList: [ // 首饰上架规则
                {
                    value: 1,
                    label: '条码号',
                },
                {
                    value: 2,
                    label: '外部款号',
                },
                {
                    value: 3,
                    label: '内部款号',
                },
                {
                    value: 4,
                    label: '原编号',
                },
                {
                    value: 5,
                    label: '线上编号',
                },
            ],
            shelvesRuleList2: [ // 饰品上架规则
                {
                    value: 1,
                    label: '条码号',
                },
                {
                    value: 2,
                    label: '外部款号',
                },
                {
                    value: 3,
                    label: '内部款号',
                },
                {
                    value: 4,
                    label: '原编号',
                }
            ],
            styleList: [ // 类型
                {
                    value: '0',
                    label: '类型'
                },
                {
                    value: '1',
                    label: '首饰'
                },
                {
                    value: '2',
                    label: '饰品'
                }
            ],
            largeClassList: [ // 大类
                {
                    value: '1',
                    label: '大类'
                }
            ],
            subClassList: [ // 小类
                {
                    value: '1',
                    label: '小类'
                }
            ],
            // 表格数据
            tableData: [],
        }
    },
    mounted() {
        this.getFindStockProduts();
        this.$emit('get-display');
        this.largeClassList.length = 0;
        this.subClassList.length = 0;
        this.getWxShopList();
    },
    methods: {
        // 查询分销商
        getWxShopList() {
            getWxShopList().then(res => {
                if (res.code === 0) {
                    this.shopNameList = res.data ? res.data.map(item => {
                        return {
                            value: item.shopName,
                            label: item.shopName
                        }
                    }) : []
                }
            })
        },
        // 分销商值改变后清空柜组选中的值
        getShopChange() {
           this.searchData.inCabinetGroup = ''
        },
        // 查询柜组
        listCabinetGroup() {
            if (!this.searchData.shopName) {
                this.inCabinetGroupList = []
                this.$message({
                    message: '请选择分销商',
                    type: 'error'
                });
                return
            }
            const params = {
                shopName: this.searchData.shopName
            }
            listCabinetGroup(params).then(res => {
                if (res.code === 0) {
                    this.inCabinetGroupList = res.data ? res.data.map(item => {
                        return {
                            value: item,
                            label: item
                        }
                    }) : []
                }
            })
        },
        // 索引
        indexMethod(index) {
            return index + this.pageSize * (this.currentPage - 1) + 1;
        },
        // 移除类型值
        removeVal() {
            this.searchData.largeCategory = '';
            this.searchData.smallCategory = '';
        },
        // 大类，小类数据查询
        getDisplay() {
            getDisplay().then((res) => {
                if (res.code === 0) {
                    if (this.searchData.storageType == 1) {
                        this.displayFun(res, '002', 'CTYPE');
                    } else {
                        this.displayFun(res, 'JRTYPE', 'PFT');
                    }

                }
            })
        },
        // 查询分类
        displayFun(res, bigC, smallC) {
            this.largeClassList = res.data ? res.data.reduce((acc, cur) => {
                const list = acc.concat(cur.subclassList)
                return list
            }, []).filter(p => p.identification == bigC).map(p => {
                return {
                    value: p.originalSubclass,
                    label: p.originalSubclass,
                }
            }) : []

            this.subClassList = res.data ? res.data.reduce((acc, cur) => {
                const list = acc.concat(cur.subclassList)
                return list
            }, []).filter(p => p.identification == smallC).map(p => {
                return {
                    value: p.originalSubclass,
                    label: p.originalSubclass
                }
            }) : []
        },
        // 输入数字
        handleClick(type) {
            switch (type) {
                case 'startPrice':
                    this.searchData.startPrice = this.searchData.startPrice.toString().replace(/[^\d.]/g, '');
                case 'endPrice' :
                    this.searchData.endPrice = this.searchData.endPrice.toString().replace(/[^\d.]/g, '');
                case 'startStock':
                    this.searchData.startStock = this.searchData.startStock.toString().replace(/[^\d]/g, '');
                case 'endStock' :
                    this.searchData.endStock = this.searchData.endStock.toString().replace(/[^\d]/g, '')
            }
        },

        // 全选
        toggleSelection(rows) {
            if (rows) {
                this.$refs.multipleTable.toggleAllSelection();
            }
        },
        // 分页
        handleSizeChange(val) {
            this.getFindStockProduts();
        },
        handleCurrentChange(val) {
            this.getFindStockProduts();
        },
        // 点击查询
        goSearch() {
            this.currentPage = 1;
            this.searchItem = this.searchData;
            this.getFindStockProduts();
        },
        // 查询
        getFindStockProduts() {
            let params = {}
            params = {
                data: {
                    ...this.searchItem
                },
                page: {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize
                }
            }
            getFindStockProduts(params).then((res) => {
                if (res.code === 0) {
                    this.coseValue = this.searchData.shelvesRule;
                    this.tableData = res.replyData.list ? res.replyData.list : [];
                    this.tableTotal = res.replyData.total;
                }
            })
        },
        // 批量添加
        getBatchAddWait() {
            const params = this.multipleSelection.map(item => {
                return {
                    code: item.code,
                    name: item.name,
                    priceRate: item.priceRate ? item.priceRate : null,
                    shelvesRule: this.searchData.shelvesRule,
                    storageType: this.searchData.storageType,
                    imgUrl: item.photo,
                    jopName: ''
                }
            })
            if (this.multipleSelection.length === 0) {
                this.$message({
                    type: 'error',
                    message: '请选择要操作的数据'
                })
                return
            }
            getBatchAddWait(params).then((res) => {
                if (res.code === 0) {
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                    this.$emit('getSelectShelvesStatusNum');
                    this.getFindStockProduts();
                }
            })
        },
        // 选中的值
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 重置
        resetFun() {
            this.searchData.endPrice = '';
            this.searchData.endStock = '';
            this.searchData.largeCategory = '';
            this.searchData.shelvesRule = 1;
            this.searchData.smallCategory = '';
            this.searchData.startPrice = '';
            this.searchData.startStock = '';
            this.searchData.storageType = 1;
            this.searchData.code = '';
            this.searchData.shopName = '';
            this.searchData.inCabinetGroup = '';
            this.searchItem = this.searchData;
        },
        // 时间戳转时间
        timestampToTime(timestamp) {
            const date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
            const Y = date.getFullYear() + '/';
            const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
            const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + ' ';
            const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
            return Y + M + D + h + m + s;
        }
    }
}
</script>

<style lang='scss' scoped>
.el-select-dropdown__item{
    font-size: 12px;
}
</style>