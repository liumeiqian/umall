<template>
  <div>
    <!-- 面包屑 -->
    <v-bread></v-bread>
    <!-- 添加按钮 -->
    <el-button type="primary" plain size="small" @click="add">添加</el-button>
    <!-- 列表 -->
    <v-table @edit="edit"></v-table>
    <!-- 添加对话框 -->
    <v-dialog @cancel="cancel" ref="dialog" :addInfo="addInfo"></v-dialog>
  </div>
</template>

<script>
import vBread from "@/components/el-bread";
import vTable from "./list";
import vDialog from "./add";

export default {
  data() {
    return {
      addInfo: {
        isShow: false,
        isAdd: true,
      },
    };
  },
  components: {
    vBread,
    vTable,
    vDialog,
  },
  methods: {
    add() {
      this.addInfo.isShow = true;
      this.addInfo.isAdd = true;
    },
    cancel(e) {
      this.addInfo.isShow = false;
    },
    edit(e){
      this.addInfo.isShow = true;
      this.addInfo.isAdd = false;
      this.$refs.dialog.look(e);
    }
  },
};
</script>

<style lang="stylus" scoped>
.el-button {
  margin: 20px 0;
}
</style>