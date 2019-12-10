'use strict'
import { getConfig, setArchivePath, setTitlesPath } from '@/api/system'

const state = {
  archivePath: null, // 归档源路径
  titlesPath: null // 作品路径
}

const getters = {
  archive_path: state => state.archivePath || [],
  titles_path: state => state.titlesPath || []
}

const mutations = {
  SET_ARCHIVEPATH: (state, paths) => {
    state.archivePath = paths
  },
  SET_TITLESPATH: (state, paths) => {
    state.titlesPath = paths
  }
}

const actions = {
  // 加载配置
  async loadConfig({ state, commit }) {
    if (state.archivePath === null || state.titlesPath === null) {
      const config = await getConfig()
      commit('SET_ARCHIVEPATH', config.archive_path)
      commit('SET_TITLESPATH', config.titles_path)
    }
  },
  // 设置归档路径
  async setArchivePath({ commit }, paths) {
    await setArchivePath(paths)
    commit('SET_ARCHIVEPATH', paths)
  },
  // 设置监控路径
  async setTitlesPath({ commit }, paths) {
    await setTitlesPath(paths)
    commit('SET_TITLESPATH', paths)
  }
}

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions
}
