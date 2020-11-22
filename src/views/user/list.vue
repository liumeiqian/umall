<template>
  <div>
    <el-table :data="userList" border style="width: 100%">
      <el-table-column
        prop="uid"
        label="用户编号"
        width="180"
      ></el-table-column>

      <el-table-column
        prop="username"
        label="用户名称"
        width="180"
      ></el-table-column>

      <el-table-column
        prop="rolename"
        label="所属角色"
        width="180"
      ></el-table-column>

      <el-table-column prop="status" label="状态">
        <template slot-scope="item">
          <div>
            <el-tag type="success" v-if="item.row.status == 1">启用</el-tag>
            <el-tag type="danger" v-else>禁用</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="item">
          <div>
            <el-button type="info" plain @click="edit(item.row.uid)"
              >编辑</el-button
            >
            <el-button type="danger" plain @click="del(item.row.uid)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="userCount"
      :page-size="userSize"
      @current-change="currentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getUserDelete } from "../../utils/axios";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      userList: "user/getUserList",
      userCount: 'user/getUserCount',
      userSize: 'user/getUserSize',
    }),
  },
  mounted() {
    this.getUserAction();
    this.getCountAction()
  },
  methods: {
    ...mapActions({
      getUserAction: "user/getUserAction",
      getCountAction: 'user/getCountAction',
      changePage: 'user/changePageAction'
    }),
    del(uid) {
      this.$confirm("确定要删除这条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          getUserDelete({ uid }).then((res) => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.getUserAction();
              this.getCountAction()
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    edit(uid) {
      this.$emit("edit", uid);
    },
    // 改变页数
    currentChange(e) {
      this.changePage(e)
    }
  },
};
</script>

<style lang="stylus" scoped>
.el-pagination {
  float: right;
  margin: 20px 10px 0 0;
}
</style>