<template>
  <div class="app-container">
    <el-table
      v-loading="isLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
    <el-form>
      <el-form-item></el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getConfig, setArchivePath, setTitlesPath } from '@/api/system'

export default {
  data() {
    return {
      archivePaths: null,
      titlesPaths: null,
      isLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.isLoading = true
      await getConfig().then(response => {
        this.list = response.data.items
        this.isLoading = false
      })
    }
  }
}
</script>
