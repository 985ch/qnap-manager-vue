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
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="文件或目录">
        <template slot-scope="scope">
          {{ scope.row.file }}
        </template>
      </el-table-column>
      <el-table-column label="归档方案" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.rule | ruleFilter }}
        </template>
      </el-table-column>
      <el-table-column label="来源路径" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.source }}
        </template>
      </el-table-column>
      <el-table-column label="目标路径" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.dest }}
        </template>
      </el-table-column>
      <el-table-column label="归档时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.timestamp | timeFilter }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getHistory } from '@/api/archive'
import { parseTime } from '@/utils'

export default {
  filters: {
    timeFilter(time) {
      return parseTime(time)
    },
    ruleFilter(rule) {
      const rules = {
        default: '直接复制',
        files: '复制目录内文件'
      }
      return rules[rule]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 拉取数据
    async fetchData() {
      this.listLoading = true
      this.list = await getHistory()
      this.listLoading = false
    }
  }
}
</script>
