import { getSpecsList, getSpecsCount } from '../../utils/axios'

const state = {
  specsList: [],
  size: 2,
  page: 1,
  count: 0,
}

const getters = {
  getSpecsList() {
    return state.specsList
  },
  getSpecsCount() {
    return state.count
  },
  getSpecsSize() {
    return state.size
  },
}

const mutations = {
  REQ_SPECSLIST(state, payload) {
    state.specsList = payload
  },
  REQ_SPECSCOUNT(state, payload) {
    state.count = payload
  },
  REQ_PAGE(state, payload) {
    state.page = payload
  }
}

const actions = {
  getSpecsAction(context) {
    getSpecsList({
      size: context.state.size,
      page: context.state.page,
    })
      .then(res => {
        if (res.data.code == 200) {
          context.commit('REQ_SPECSLIST', res.data.list)
        }
      })
      .catch(err => {
        console.log(err);
      })
  },
  getSpecsCount({commit}) {
    getSpecsCount()
    .then(res => {
      if(res.data.code == 200){
        commit('REQ_SPECSCOUNT', res.data.list[0].total)
      }
    })
  },
  changePageAction(context, payload) {
    context.commit('REQ_PAGE', payload)
    context.dispatch('getSpecsAction')
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
}