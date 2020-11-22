// 引入封装好的接口
import { getCateList } from '../../utils/axios';

const state = {
  cateList: [],
}

const getters = {
  getCateList(state) {
    return state.cateList
  }
}

const mutations = {
  REQ_CATELIST(state, pauload) {
    state.cateList = pauload;
  }
}

const actions = {
  getCateListAction({ commit }) {
    getCateList({
      istree: true
    })
      .then(res => {
        console.log(res, 'cateList成功');
        if (res.data.code === 200) {
          commit('REQ_CATELIST', res.data.list)
        }
      })
      .catch(err => {
        console.log(err, '失败');
      })
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
}