'use strict'
import { getConfig, setArchivePath, setTitlesPath, setArchiveServer } from '@/api/system'

const state = {
  archivePath: null, // 归档源路径
  titlesPath: null, // 作品路径
  archiveServer: null // 归档服务器配置
}

const getters = {
  archive_path: state => state.archivePath || [],
  titles_path: state => state.titlesPath || [],
  archive_server: state => state.archiveServer || { host: 'http://127.0.0.1', key: 'your secret key' }
}

const mutations = {
  SET_ARCHIVEPATH: (state, paths) => {
    state.archivePath = paths
  },
  SET_TITLESPATH: (state, paths) => {
    state.titlesPath = paths
  },
  SET_ARCHIVESERVER: (state, { host, key }) => {
    state.archiveServer = { host, key }
  }
}

const actions = {
  // 加载配置
  async loadConfig({ state, commit }) {
    if (state.archivePath === null || state.titlesPath === null) {
      const config = await getConfig()
      commit('SET_ARCHIVEPATH', config.archive_path)
      commit('SET_TITLESPATH', config.titles_path)
      commit('SET_ARCHIVESERVER', config.archive_server)
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
  },
  // 设置归档服务器信息
  async setArchiveServer({ commit }, data) {
    await setArchiveServer(data)
    commit('SET_ARCHIVESERVER', data)
  }
}

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions
}
