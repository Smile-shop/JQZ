<template>
  <div class="goods-info">
    <a-card style="width: 100%">
    <div class="page-title">
      <span>可用积分:</span>
      <span>4756分</span>
      <span class="grand-total">累计获得积分:</span>
      <span>4756分</span>
    </div>
    <div class="search">
      <a-range-picker @change="onChange" style="margin-right: 10px" />
      <a-select default-value="lucy" style="width: 120px" @change="handleChange">
        <a-select-option value="jack">
          Jack
        </a-select-option>
        <a-select-option value="lucy">
          Lucy
        </a-select-option>
        <a-select-option value="disabled" disabled>
          Disabled
        </a-select-option>
        <a-select-option value="Yiminghe">
          yiminghe
        </a-select-option>
      </a-select>
      <a-input type="text" placeholder="请输入关键词" style="width: 180px; margin: 0 10px" />
      <a-button type="primary">搜索</a-button>
    </div>
    <a-table :columns="data.columns" :data-source="data.data" :pagination="false">
    <a slot="name" slot-scope="text">{{ text }}</a>
    <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
    <span slot="tags" slot-scope="tags">
      <a-tag
        v-for="tag in tags"
        :key="tag"
        :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
      >
        {{ tag.toUpperCase() }}
      </a-tag>
    </span>
    <span slot="action" slot-scope="text, record">
      <a>Invite 一 {{ record.name }}</a>
      <a-divider type="vertical" />
      <a>Delete</a>
      <a-divider type="vertical" />
      <a class="ant-dropdown-link"> More actions </a>
    </span>
  </a-table>
  <div class="table-pagination">
    <a-pagination show-quick-jumper :default-current="2" :total="500" @change="onChange" />
    <div>
      <span class="pre-caption">每页</span>
        <a-select default-value="10" style="width: 120px" @change="handleChange">
          <a-select-option value="10">
            10
          </a-select-option>
          <a-select-option value="50">
            50
          </a-select-option>
          <a-select-option value="100">
            100
          </a-select-option>
          <a-select-option value="200">
            200
          </a-select-option>
        </a-select>
      <span class="next-unit">条</span>
    </div>
    <div class="total-table">
      共500条,
    </div>
  </div>
  </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api'
export default defineComponent({
  setup(props, context) {
    const data = reactive({
      columns: [
        {
          title: '序号',
          dataIndex: 'name',
          key: 'name',
          slots: { title: 'customTitle' },
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '会员ID',
          dataIndex: 'memberCard',
          key: 'memberCard',
        },
        {
          title: '微信名称',
          dataIndex: 'wxName',
          key: 'wxName',
        },
        {
          title: '积分明细',
          dataIndex: 'integral',
          key: 'integral',
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: '记录时间',
          dataIndex: 'bookTime',
          key: 'bookTime',
        },
        {
          title: '备注',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      data: [
        {
          key: '1',
          name: '1',
          memberCard: 32,
          wxName: '张三',
          type: '抽奖',
          integral: '+10',
          bookTime: '2020-08-23',
          address: 'New York No. 1 Lake Park',
          tags: ['nice', 'developer'],
        },
        {
          key: '2',
          name: '2',
          memberCard: 42,
          wxName: '李四',
          type: '翻牌',
          integral: '+50',
          bookTime: '2020-08-28',
          address: 'London No. 1 Lake Park',
          tags: ['loser'],
        },
        {
          key: '3',
          name: '3',
          memberCard: 22,
          wxName: '王二',
          type: '老虎机',
          integral: '+15',
          bookTime: '2020-08-21',
          address: 'Sidney No. 1 Lake Park',
          tags: ['cool', 'teacher'],
        },
      ],
    })

    const handleChange = () => {

    }

    const onChange = () => {

    }

    return {
      data,
      onChange,
      handleChange,
    }
  }
})
</script>

<style lang="scss" scoped>
.page-title {
  height:56px;
  line-height: 56px;
  background:rgba(245,247,250,1);
  box-shadow:0px 1px 0px 0px rgba(235,238,245,1);
  margin-bottom: 28px;
  padding-left: 24px;
  font-size:14px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(38,52,70,1);
}
.grand-total {
  margin-left: 85px;
}
.search {
  margin-bottom: 24px;
}
.table-pagination {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin-top: 24px;
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
