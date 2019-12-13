<template>
  <div class="app-container">
    <span>资源路径</span>
    <el-select v-model="curPath" placeholder="请选择">
      <el-option
        v-for="item in resource_path"
        :key="item"
        :value="item"
      />
    </el-select>
    <el-table
      v-loading="listLoading"
      :data="curList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="资源">
        <template slot-scope="scope">
          {{ scope.row.folder }}
        </template>
      </el-table-column>
      <el-table-column label="资源路径" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.path }}
        </template>
      </el-table-column>
      <el-table-column label="MD5" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.hash }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.updatetime | timeFilter }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getList } from '@/api/resource'
import { parseTime } from '@/utils'

export default {
  filters: {
    timeFilter(time) {
      return parseTime(time)
    }
  },
  data() {
    return {
      curPath: '',
      list: null,
      listLoading: true
    }
  },
  computed: {
    ...mapGetters('system', ['resource_path']),
    groupList() {
      const json = {}
      for (const item of this.list) {
        if (!json[item.path])json[item.path] = []
        json[item.path].push(item)
      }
      return json
    },
    curList() {
      if (this.list && this.resource_path && this.curPath !== '') {
        return this.groupList[this.curPath]
      }
      return []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 拉取数据
    async fetchData() {
      this.listLoading = true
      await this.$store.dispatch('system/loadConfig')
      this.curPath = this.resource_path[0] || ''
      this.list = await getList()
      this.listLoading = false
    }
  }
}
</script>
