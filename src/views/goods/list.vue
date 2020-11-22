<template>
  <div>
    <el-table :data="goodsList" border style="width: 100%">
      <el-table-column prop="id" label="商品编号" width="180"></el-table-column>

      <el-table-column
        prop="goodsname"
        label="商品名称"
        width="180"
      ></el-table-column>
      
      <el-table-column
        prop="price"
        label="商品价格"
        width="180"
      ></el-table-column>
      
      <el-table-column
        prop="market_price"
        label="市场价格"
        width="180"
      ></el-table-column>
      
      <el-table-column label="图片" width="180">
        <template slot-scope="item">
          <div>
            <img class="img" :src="$imgUrl + item.row.img" alt="" />
          </div>
        </template>
      </el-table-column>
      
      <el-table-column prop="isnew" label="是否新品">
        <template slot-scope="item">
          <div>
            <el-tag type="success" v-if="item.row.isnew == 1">是</el-tag>
            <el-tag type="danger" v-else>否</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="ishot" label="是否热卖">
        <template slot-scope="item">
          <div>
            <el-tag type="success" v-if="item.row.ishot == 1">是</el-tag>
            <el-tag type="danger" v-else>否</el-tag>
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
      :total="goodsCount"
      :page-size="goodsSize"
      @current-change="currentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getGoodsDelete } from "../../utils/axios";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      goodsList: "goods/getGoodsList",
      goodsCount: "goods/getGoodsCount",
      goodsSize: "goods/getGoodsSize",
    }),
  },
  mounted() {
    this.getGoodsAction();
    this.getGoodsCount();
  },
  methods: {
    ...mapActions({
      getGoodsAction: "goods/getGoodsAction",
      getGoodsCount: "goods/getGoodsCount",
      changePage: "goods/changePageAction",
    }),
    del(id) {
      this.$confirm("确定要删除这条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          getGoodsDelete({ id }).then((res) => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.getGoodsAction();
              this.getGoodsCount();
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
      this.changePage(e);
    },
  },
};
</script>

<style lang="stylus" scoped>
.el-pagination {
  float: right;
  margin: 20px 10px 0 0;
}
img{
  width: 100px;
}
</style>