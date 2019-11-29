import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: null,
  nick: null,
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    if (token !== '') {
      setToken(token)
    } else {
      removeToken()
      state.name = null
      state.nick = null
      state.roles = []
    }
  },
  SET_USERINFO: (state, { name, nick, permissions }) => {
    state.name = name
    state.nick = nick
    state.roles = permissions
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    const res = await login(username.trim(), password)
    const { token, data } = res.data
    commit('SET_TOKEN', token)
    commit('SET_USERINFO', data)
  },

  // get user info
  async getInfo({ commit, state }) {
    const data = await getInfo(state.token)
    commit('SET_USERINFO', data.data)
  },

  // user logout
  async logout({ commit, state }) {
    await logout(state.token)
    commit('SET_TOKEN', '')
    resetRouter()
  },

  // remove token
  async resetToken({ commit }) {
    await commit('SET_TOKEN', '')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

