<template>
  <div>
    <el-table :data="specsList" border style="width: 100%">
      <el-table-column
        prop="id"
        label="规格编号"
        width="180"
      ></el-table-column>

      <el-table-column
        prop="specsname"
        label="规格名称"
        width="180"
      ></el-table-column>

      <el-table-column
        prop="attrs"
        label="规格属性"
        width="180"
      >
        <template slot-scope="scope">
          <div>
            <el-tag v-for="item of scope.row.attrs" :key="item" type="info" >{{item}}</el-tag>
          </div>
        </template>
      </el-table-column>

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
            <el-button type="info" plain @click="edit(item.row.id)"
              >编辑</el-button
            >
            <el-button type="danger" plain @click="del(item.row.id)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="specsCount"
      :page-size="specsSize"
      @current-change="currentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getSpecsDelete } from "../../utils/axios";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      specsList: "specs/getSpecsList",
      specsCount: 'specs/getSpecsCount',
      specsSize: 'specs/getSpecsSize',
    }),
  },
  mounted() {
    this.getSpecsAction();
    this.getSpecsCount()
  },
  methods: {
    ...mapActions({
      getSpecsAction: "specs/getSpecsAction",
      getSpecsCount: 'specs/getSpecsCount',
      changePage: 'specs/changePageAction'
    }),
    del(id) {
      this.$confirm("确定要删除这条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          getSpecsDelete({ id }).then((res) => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.getSpecsAction();
              this.getSpecsCount()
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
    edit(id) {
      this.$emit("edit", id);
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