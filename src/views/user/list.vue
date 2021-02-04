<template>
  <a-table
    :loading="loading"
    :pagination="pagination"
    :columns="columns"
    :data-source="data"
    @change="onSelectChange"
    bordered
  >
    <template
      v-for="col in ['email', 'password', 'nickname', 'phone']"
      :slot="col"
      slot-scope="text, record"
    >
      <div :key="col">
        <a-input
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          @change="(e) => handleChange(e.target.value, record.key, col)"
        />
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>
    <template slot="operation" slot-scope="text, record">
      <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.key)">保存</a>
          <a @click="() => cancel(record.key)">取消</a>
        </span>
        <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.key)"
            >编辑</a
          >
        </span>
        <a-popconfirm title="确定要取消吗?" @confirm="() => del(record.key)">
          <a :disabled="editingKey !== ''">删除</a>
        </a-popconfirm>
      </div>
    </template>
  </a-table>
</template>
<script>
import { getList, update, del } from '@/services/user';

const columns = [
  {
    title: '邮箱',
    dataIndex: 'email',
    width: '25%',
    scopedSlots: { customRender: 'email' },
  },
  {
    title: '密码',
    dataIndex: 'password',
    width: '15%',
    scopedSlots: { customRender: 'password' },
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    width: '20%',
    scopedSlots: { customRender: 'nickname' },
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: '20%',
    scopedSlots: { customRender: 'phone' },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
];

export default {
  data() {
    return {
      columns,
      editingKey: '',
      data: [],
      pagination: {
        total: 0,
        pageSize: 5,
        current: 1,
      },
      loading: false,
    };
  },
  methods: {
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter((item) => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    onSelectChange(pageInfo) {
      const { current, pageSize } = pageInfo;
      const params = { pageIndex: current, pageSize };
      this.getList(params);
    },
    edit(key) {
      const newData = [...this.data];
      const target = newData.filter((item) => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    save(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.filter((item) => key === item.key)[0];
      const targetCache = newCacheData.filter((item) => key === item.key)[0];
      if (target && targetCache) {
        delete target.editable;
        this.data = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = '';
      this.loading = true;
      update(target).then((res) => {
        console.log(res);
        this.loading = false;
      });
    },
    cancel(key) {
      const newData = [...this.data];
      console.log('newData', newData);
      const target = newData.filter((item) => key === item.key)[0];
      this.editingKey = '';
      if (target) {
        Object.assign(
          target,
          this.cacheData.filter((item) => key === item.key)[0],
        );
        delete target.editable;
        this.data = newData;
      }
    },
    del(key) {
      const params = {
        _id: key,
      };
      del(params).then((res) => {
        console.log(res);
        this.getList();
      });
    },
    getList(params) {
      const { current, pageSize } = this.pagination;
      // eslint-disable-next-line no-param-reassign
      params = params || {
        pageIndex: current,
        pageSize,
      };
      return getList(params).then((res) => {
        console.log(res);
        const { data } = res;
        this.data = data.list.map((item) => {
          const element = item;
          // eslint-disable-next-line no-underscore-dangle
          element.key = element._id;
          return element;
        });
        this.pagination = {
          total: data.count,
          pageSize: data.pageInfo.pageSize,
          current: data.pageInfo.pageIndex,
        };
        this.cacheData = JSON.parse(JSON.stringify(this.data));
      });
    },
  },
  mounted() {
    this.loading = true;
    this.getList().then(() => {
      this.loading = false;
    });
  },
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
