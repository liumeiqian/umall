<template>
  <div>
    <!-- 面包屑 -->
    <v-bread class="bread"></v-bread>
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
    cancel(e) {
      this.addInfo.isShow = false;
    },
    edit(e) {
      this.addInfo.isShow = true;
      this.addInfo.isAdd = false;
      this.$refs.dialog.look(e);
    },
  },
};
</script>

<style lang="stylus" scoped>
.el-button {
  margin: 20px 0;
}

.bread {
  margin-bottom: 20px;
}
</style>