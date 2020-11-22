import { getUserList, getUserCount } from '../../utils/axios'

const state = {
  userList: [],
  size: 2,
  page: 1,
  count: 0,
}

const getters = {
  getUserList() {
    return state.userList
  },
  getUserCount() {
    return state.count
  },
  getUserSize() {
    return state.size
  },
}

const mutations = {
  REQ_USERLIST(state, payload) {
    state.userList = payload
  },
  REQ_USERCOUNT(state, payload) {
    state.count = payload
  },
  REQ_PAGE(state, payload) {
    state.page = payload
  }
}

const actions = {
  getUserAction(context) {
    getUserList({
      size: context.state.size,
      page: context.state.page,
    })
      .then(res => {
        if (res.data.code == 200) {
          let data =  res.data.list ? res.data.list : []
          context.commit('REQ_USERLIST', data)
          // 优化当前页删除完不变页数
          if(context.state.page != 1 && data.length == 0){
            context.dispatch('changePageAction', context.state.page - 1)
            context.dispatch('getUserAction')
            return
          }
        }
      })
      .catch(err => {
        console.log(err);
      })
  },
  getCountAction({commit}) {
    getUserCount()
    .then(res => {
      if(res.data.code == 200){
        commit('REQ_USERCOUNT', res.data.list[0].total)
      }
    })
  },
  changePageAction(context, payload) {
    context.commit('REQ_PAGE', payload)
    context.dispatch('getUserAction')
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
}