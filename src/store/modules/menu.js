// 引入封装好的接口
import { getMenuList } from '../../utils/axios';

const state = {
  menuList: [],
}

const getters = {
  getMenuList(state) {
    return state.menuList
  }
}

const mutations = {
  REQ_MENULIST(state, pauload) {
    state.menuList = pauload;
  }
}

const actions = {
  getMenuListAction({ commit }) {
    getMenuList({
      istree:true
    })
      .then(res => {
        // console.log(res, '成功');
        if (res.data.code === 200) {
          console.log(res.data.list, 'menu');
          commit('REQ_MENULIST', res.data.list)
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