import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: null,
  nick: null,
  roles: null
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
      state.roles = null
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
    const { token } = await login(username.trim(), password)
    commit('SET_TOKEN', token)
  },

  // get user info
  async getInfo({ commit, state }) {
    const data = await getInfo(state.token)
    commit('SET_USERINFO', data)
    return state
  },

  // user logout
  async logout({ commit, state, dispatch }) {
    await logout(state.token)
    commit('SET_TOKEN', '')
    resetRouter()

    // reset visited views and cached views
    // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
    dispatch('tagsView/delAllViews', null, { root: true })
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

