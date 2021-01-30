<template>
  <div>
    <a-table
      :columns="data.columns"
      :data-source="data.tableData"
      :pagination="false"
      row-key="id"
    >
      <template #serial="text, record, index">{{ index + 1 }}</template>
      <template #logo="record">
        <div class="img">
          <img :src="record.logo" :alt="record.name">
        </div>
      </template>
    </a-table>
    <div class="page">
      <a-pagination
          :total="85"
          :show-total="total => `共 ${total}条`"
          show-size-changer show-quick-jumper
          :default-current="1"
          :pageSizeOptions="['10', '20', '30', '40']"
        />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from '@vue/composition-api'
import router from '@/router'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '头像',
    scopedSlots: { customRender: 'logo' },
  },
  {
    title: '员工编号',
    dataIndex: 'id',
  },
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '角色',
    dataIndex: 'role',
  },
  {
    title: '性别',
    dataIndex: 'sex',
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
  }
]
export default defineComponent({
  name: 'SaleMansList',
  setup() {
    const data = reactive({
      tableData: [{ logo: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3916743799,2744069233&fm=26&gp=0.jpg', id: 1235545, name: '张珊', role: '店长', sex: '女', phone: '13539900478' }],
      columns
    });

    onMounted(() => {

    });

    return {
      data
    };
  },
});
</script>

<style lang="scss" scoped>
.img{
  width: 40px;
  border-radius: 40px;
  overflow: hidden;
  background: #eee;
  img{
    width: 100%;
  }
}
.page{
  margin-top: 20px;
  text-align: right;
}
</style>
