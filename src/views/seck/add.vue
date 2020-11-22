<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd ? '添加活动' : '修改活动'"
      :visible.sync="addInfo.isShow"
      center
      :before-close="cancel"
    >
      <el-form :model="form" :rules="rules" ref="formDialog">
        <!-- 活动名称 -->
        <el-form-item
          prop="title"
          label="活动名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 活动期限 -->
        <el-form-item label="活动期限" :label-width="formLabelWidth">
          <el-date-picker
            v-model="timer"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          >
          </el-date-picker>
        </el-form-item>

        <!-- 一级分类 -->
        <el-form-item label="一级分类" :label-width="formLabelWidth">
          <el-select
            v-model="form.first_cateid"
            placeholder="请选择"
            @change="change(false)"
          >
            <el-option value label="请选择" disabled></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.catename"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 二级分类 -->
        <el-form-item label="二级分类" :label-width="formLabelWidth">
          <el-select
            @change="secondChange()"
            v-model="form.second_cateid"
            placeholder="请选择"
          >
            <el-option value label="请选择" disabled></el-option>
            <el-option
              v-for="item in secondArr"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 商品 -->
        <el-form-item label="商品" :label-width="formLabelWidth">
          <el-select v-model="form.goodsid" placeholder="请选择">
            <el-option
              v-for="item in goodsArr"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 状态 -->
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch
            v-model="form.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          v-if="addInfo.isAdd"
          @click="add('formDialog')"
          >添 加</el-button
        >
        <el-button type="primary" v-else @click="update('formDialog')"
          >修 改</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入封装好的接口
import {
  getSeckAdd,
  getSeckInfo,
  getSeckEdit,
  getGoodsList,
} from "../../utils/axios";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {
        title: "", // 限时秒杀名称
        begintime: "", // 开始时间
        endtime: "", // 结束时间
        first_cateid: "", // 商品一级分类编号
        second_cateid: "", // 商品二级分类编号
        goodsid: "", // 商品编号
        status: 1, // 状态 1正常 2禁用
      },
      // time: [new Date(2020, 11, 14, 18, 40), new Date(2020, 11, 10, 19, 40)],
      timer: [],
      rules: {
        title: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      // selist: [],
      // seid: 0,
      formLabelWidth: "120px",
      // secondList: [],
      // 创建一个二级分类数组
      secondArr: [],
      // 创建一个商品数组
      goodsArr: [],
    };
  },
  props: ["addInfo"],
  computed: {
    ...mapGetters({
      seckList: "seck/getSeckList",
      cateList: "cate/getCateList",
      goodsList: "goods/getGoodsList",

      // goodsCount: 'goods/getGoodsCount',
      // goodsSize: 'goods/getGoodsSize',
    }),
  },
  mounted() {
    this.getCateList();
    this.getGoodsAction();
  },
  methods: {
    reset() {
      this.form = {
        title: "", // 限时秒杀名称
        begintime: "", // 开始时间
        endtime: "", // 结束时间
        first_cateid: "", // 商品一级分类编号
        second_cateid: "", // 商品二级分类编号
        goodsid: "", // 商品编号
        status: 1, // 状态 1正常 2禁用
      };
      this.time = [];
    },
    ...mapActions({
      getSeckList: "seck/getSeckListAction",
      getCateList: "cate/getCateListAction",
      getGoodsAction: "goods/getGoodsAction",
    }),
    cancel() {
      this.$emit("cancel", false);
      this.reset();
    },
    change(e) {
      let index = this.cateList.findIndex(
        (item) => this.form.first_cateid == item.id
      );
      this.secondArr = this.cateList[index].children;
      if (!e) {
        this.form.second_cateid = this.form.goodsid = "";
      }
    },
    secondChange(e) {
      getGoodsList({
        fid: this.form.first_cateid,
        sid: this.form.second_cateid,
      }).then((res) => {
        if (res.data.code == 200) {
          this.goodsArr = res.data.list;
          if (!e) {
            this.form.goodsid = "";
          }
        }
      });
    },
    // 添加事件
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.begintime = new Date(this.timer[0]).getTime();
          this.form.endtime = new Date(this.timer[1]).getTime();

          getSeckAdd(this.form)
            .then((res) => {
              console.log(res, "添加的响应");
              if (res.data.code === 200) {
                this.$message.success(res.data.msg);
                this.cancel();
                this.getSeckList();
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 查看一条事件
    look(id) {
      // console.log(id);
      // 调取接口
      getSeckInfo({ id })
        .then((res) => {
          if (res.data.code == 200) {
            this.form = res.data.list;
            this.form.id = id;
            this.timer = [
              new Date(parseInt(this.form.begintime)),
              new Date(parseInt(this.form.begintime)),
            ];
            this.change(true);
            this.secondChange(true)
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 确定修改
    update(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          getSeckEdit(this.form)
            .then((res) => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.cancel();
                this.getSeckList();
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style>
</style>