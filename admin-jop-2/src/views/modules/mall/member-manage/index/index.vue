<template>
  <div class="goods-info">
    <a-card style="width:100%">
      <div class="search">
        <a-form class="reset-form">
          <div class="search-item">
            <a-form-item>
              <a-select v-model="initData.sarchStoreName" style="width: 120px" placeholder="所有门店">
                <a-select-option value>所有门店</a-select-option>
                <a-select-option
                  :value="item.name"
                  v-for="(item, index) in initData.shopList"
                  :key="index"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="search-item">
            <a-form-item>
              <a-select v-model="initData.timeLable" style="width: 120px" placeholder="不按时间">
                <a-select-option value>不按时间</a-select-option>
                <a-select-option
                  :value="item.val"
                  v-for="(item, index) in initData.selecteTime"
                  :key="index"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="search-item">
            <a-form-item>
              <a-range-picker
                :show-time="{
                  hideDisabledOptions: true,
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')]
                }"
                format="YYYY-MM-DD HH:mm:ss"
                :default-value="[moment(initData.searchTime[0]), moment(initData.searchTime[1])]"
                v-model="initData.searchTime"
              />
            </a-form-item>
          </div>
          <div class="search-item">
            <a-form-item>
              <a-input addon-before="微信昵称" placeholder="请输入微信昵称" v-model="initData.wxNickName" />
            </a-form-item>
          </div>
          <div class="search-item">
            <a-form-item>
              <a-input
                addon-before="手机号码"
                placeholder="请输入手机号码"
                type="tel"
                v-model="initData.phone"
              />
            </a-form-item>
          </div>
          <div class="search-item">
            <a-form-item>
              <a-button type="primary" @click="handleSearch">搜索</a-button>
            </a-form-item>
          </div>
          <div class="search-item">
            <a-form-item>
              <a-button @click="handleReset">重置</a-button>
            </a-form-item>
          </div>
        </a-form>
      </div>
      <a-table :columns="initData.columns" :data-source="initData.table" :pagination="false">
        <span slot="member.id" slot-scope="text">
          <p v-if="text.member.id">{{ text.member.id }}</p>
          <p v-else>——</p>
        </span>
        <span slot="nickName" slot-scope="text">
          <p v-if="text.nickName">{{ text.nickName }}</p>
          <p v-else>——</p>
        </span>
        <span slot="member.cardNo" slot-scope="text">
          <p v-if="text.member.cardNo">{{ text.member.cardNo }}</p>
          <p v-else>——</p>
        </span>
        <span slot="member.availablePoint" slot-scope="text">
          <p v-if="text.member.availablePoint >= 0">{{ text.member.availablePoint }}</p>
          <p v-else>——</p>
        </span>
        <span slot="store.name" slot-scope="text">
          <p v-if="text.store.name">{{ text.store.name }}</p>
          <p v-else>——</p>
        </span>
        <span slot="member.guideName" slot-scope="text">
          <p v-if="text.member.guideName">{{ text.member.guideName }}</p>
          <p v-else>——</p>
        </span>
        <span slot="member.phone" slot-scope="text">
          <p v-if="text.member.phone">{{ text.member.phone }}</p>
          <p v-else>——</p>
        </span>
        <span slot="member.createTime" slot-scope="text">
          <p v-if="text.member.createTime">{{ text.member.createTime }}</p>
          <p v-else>——</p>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="orderDetail">订单详情 {{ record.name }}</a>
          <a-divider type="vertical" />
          <a @click="memberDetail(record)">会员详情</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link" @click="integralDetail">积分明细</a>
        </span>
      </a-table>
      <div class="page-pagination">
        <a-pagination
          show-quick-jumper
          :defaultPageSize="10"
          :default-current="initData.pagination.curPage"
          :total="initData.pagination.totalPage"
          @change="onChange"
        />
        <div>
          <span class="pre-caption">每页</span>
          <a-select default-value="10" style="width: 120px" @change="handleChange">
            <a-select-option value="10">10</a-select-option>
            <a-select-option value="20">20</a-select-option>
            <a-select-option value="50">50</a-select-option>
            <a-select-option value="100">100</a-select-option>
          </a-select>
          <span class="next-unit">条</span>
        </div>
        <div class="total-table">共{{ initData.pagination.totalRecord }}条,</div>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import { defineComponent, reactive, onMounted, ref } from '@vue/composition-api'
import router from '@/router'
import { queryMemberList, getShopList } from '@/api/modules/mall/member-manage'
export default defineComponent({
  setup(props, context) {
    const initData = reactive({
      columns: [
        {
          title: '序号',
          key: 'num',
          dataIndex: 'num',
        },
        {
          title: '会员ID',
          scopedSlots: { customRender: 'member.id' },
          key: 'member.id',
        },
        {
          title: '微信名称',
          scopedSlots: { customRender: 'nickName' },
          key: 'nickName',
        },
        {
          title: '会员卡',
          key: 'member.cardNo',
          scopedSlots: { customRender: 'member.cardNo' },
        },
        {
          title: '积分',
          key: 'member.availablePoint',
          scopedSlots: { customRender: 'member.availablePoint' },
        },
        {
          title: '所属门店',
          key: 'store.name',
          scopedSlots: { customRender: 'store.name' },
        },
        {
          title: '关联导购',
          key: 'member.guideName',
          scopedSlots: { customRender: 'member.guideName' },
        },
        {
          title: '手机号码',
          key: 'member.phone',
          scopedSlots: { customRender: 'member.phone' },
        },
        {
          title: '注册时间',
          key: 'member.createTime',
          scopedSlots: { customRender: 'member.createTime' },
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      table: [] as any[],
      pagination: {} as any,
      shopList: [] as any[],
      selecteTime: [
        {
          name: '创建时间',
          val: 'time',
          selected: false,
        },
      ] as any[],
      searchTime: [] as any[],
      wxNickName: '',
      sarchStoreName: undefined as any,
      timeLable: undefined as any,
      phone: '',
      searchCase: {
        endTime: '',
        nickName: '',
        phone: '',
        startTime: '',
        storeName: '' as any,
      },
    })

    const handleSearch = () => {
      const time = initData.timeLable
      const options = initData.searchCase
      options.startTime = time
        ? moment(initData.searchTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : ''
      options.endTime = time
        ? moment(initData.searchTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : ''
      options.nickName = initData.wxNickName
      options.phone = initData.phone
      options.storeName = initData.sarchStoreName
      initData.searchCase = options
      pageQueryMemberList(options)
    }

    const handleReset = () => {
      initData.searchTime = []
      initData.wxNickName = ''
      initData.phone = ''
      initData.sarchStoreName = undefined
      initData.timeLable = undefined
    }

    const onChange = (e: any) => {
      const searchOptions = initData.searchCase
      const body = {
        curPage: e,
      }
      const options = Object.assign({}, searchOptions, body)
      pageQueryMemberList(options)
    }

    const handleChange = (e: any) => {
      const searchOptions = initData.searchCase
      const body = {
        pageSize: e,
      }
      const options = Object.assign({}, searchOptions, body)
      pageQueryMemberList(options)
    }

    const orderDetail = () => {
      console.log('test 订单详情')
    }

    const memberDetail = (item: any) => {
      const id = item.id || ''
      router.push({ path: `/mall/member-manage/list/info?id=${id}` })
    }

    const integralDetail = () => {
      console.log('积分明细')
      // router.push({ path: '/mall/member-manage/list/detail' })
    }

    // 设置列表数据
    const renderPage = (data: any) => {
      data.records.forEach((item: any, index: number) => {
        item.num = index + 1
        item.key = index
        return item
      })
      initData.table = data.records
      initData.pagination = data
    }

    // 查询列表
    const pageQueryMemberList = async (obj: any = {}) => {
      const body = {
        appId: '',
        curPage: 1,
        endTime: '',
        nickName: '',
        pageSize: 10,
        phone: '',
        startTime: '',
        storeName: '',
      }
      const options = Object.assign({}, body, obj)
      const res = await queryMemberList(options)
      renderPage(res)
    }

    // 赋值商店
    const empowerShopList = async (list: any) => {
      list.forEach((item: any) => {
        item.selected = false
      })
      initData.shopList = list
    }

    // 查询门店
    const queryShopList = async () => {
      const body = {
        address: '',
        appId: '',
        city: '',
        coordCur: '',
        coordTx: '',
        description: '',
        distId: '',
        district: '',
        id: '',
        name: '',
        province: '',
        status: '',
        tel: '',
      }
      const res = await getShopList(body)
      empowerShopList(res)
    }

    onMounted(() => {
      pageQueryMemberList()
      queryShopList()
    })

    return {
      moment,
      initData,
      handleSearch,
      handleReset,
      onChange,
      handleChange,
      orderDetail,
      memberDetail,
      integralDetail,
    }
  },
})
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  width: 100%;
  height: 80px;
  align-items: center;
}
.reset-form {
  display: flex;
}
.search-item {
  margin: 0 10px;
}
.page-pagination {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin-top: 22px;
  margin-bottom: 70px;
}
.total-table {
  margin-right: 10px;
}
.pre-caption {
  margin-right: 5px;
}
.next-unit {
  margin: 0 3px;
}
</style>
