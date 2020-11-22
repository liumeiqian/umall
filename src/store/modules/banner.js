// 引入封装好的接口
import { getBannerList } from '../../utils/axios';

const state = {
  bannerList: [],
}

const getters = {
  getBannerList(state) {
    return state.bannerList
  }
}

const mutations = {
  REQ_BANNERLIST(state, pauload) {
    state.bannerList = pauload;
  }
}

const actions = {
  getBannerListAction({ commit }) {
    getBannerList()
      .then(res => {
        if (res.data.code === 200) {
          if (!res.data.list) {
            res.data.list = []
          }
          commit('REQ_BANNERLIST', res.data.list)
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