<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ID" width="80">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="资源路径" align="center">
        <template slot-scope="scope">
          {{ scope.row.path }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in keys"
        :key="item.key"
        :label="item.label"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row[item.key] }}
        </template>
      </el-table-column>
      <el-table-column label="完成时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.timestamp | timeFilter }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getScanHistory } from '@/api/resource'
import { parseTime } from '@/utils'

export default {
  filters: {
    timeFilter(time) {
      return parseTime(time)
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      keys: [
        { key: 'keep', label: '忽略' },
        { key: 'add', label: '新增' },
        { key: 'add_failed', label: '新增失败' },
        { key: 'del', label: '移除' },
        { key: 'del_failed', label: '移除失败' },
        { key: 'modify', label: '变更' },
        { key: 'modify_failed', label: '变更失败' }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 拉取数据
    async fetchData() {
      this.listLoading = true
      this.list = await getScanHistory()
      this.listLoading = false
    }
  }
}
</script>
