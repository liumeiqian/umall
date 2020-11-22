<template>
  <div>
    <!-- 面包屑 -->
    <v-bread></v-bread>
    <!-- 添加 -->
    <el-button type="primary" size="small" @click="isAdd">添加</el-button>
    <!-- 列表 -->
    <v-list @edit='edit'></v-list>
    <!-- 弹框 -->
    <v-add ref="dialog" :addInfo='addInfo' @cancel='cancel'></v-add>
  </div>
</template>

<script>
import vBread from '@/components/el-bread'
import vList from './list'
import vAdd from './add'

export default {
  data() {
    return {
      addInfo: {
        isShow: false,
        isAdd: true,
      },
    }
  },
  components: {
    vBread,
    vList,
    vAdd,
  },
  methods: {
    isAdd() {
      this.addInfo.isShow = true
      this.addInfo.isAdd = true
    },
    cancel(e) {
      this.addInfo.isShow = e;
    },
    edit(e) {
      this.addInfo.isShow = true,
      this.addInfo.isAdd = false,

      this.$refs.dialog.look(e)
    }
  }
};
</script>

<style lang="stylus" scoped>
.el-button
  margin-top 20px
</style>