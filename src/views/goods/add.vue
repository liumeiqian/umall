<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd ? '添加商品' : '修改商品'"
      :visible.sync="addInfo.isShow"
      center
      :before-close="cancel"
      @opened="createEditor"
    >
      <el-form :model="form" :rules="rules" ref="formDialog">
        <!-- 一级分类 -->
        <el-form-item
          prop="first_cateid"
          label="一级分类"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="form.first_cateid"
            placeholder="请选择"
            @change="change(false)"
          >
            <el-option value label="请选择" disabled></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 二级分类 -->
        <el-form-item
          prop="second_cateid"
          label="二级分类"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.second_cateid" placeholder="请选择">
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
        <!-- 商品名称 -->
        <el-form-item
          prop="goodsname"
          label="商品名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.goodsname" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 价格 -->
        <el-form-item prop="price" label="价格" :label-width="formLabelWidth">
          <el-input v-model="form.price" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 市场价格 -->
        <el-form-item
          prop="market_price"
          label="市场价格"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.market_price" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 图片 -->
        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-upload
            action="#"
            list-type="picture-card"
            :on-preview="onPreview"
            :on-remove="onRemove"
            :auto-upload="false"
            :on-change="onChange"
            :file-list="fileList"
            :on-exceed="onExceed"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>

        <!-- 商品规格 -->
        <el-form-item
          prop="specsid"
          label="商品规格"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="form.specsid"
            placeholder="请选择"
            @change="secondChange(false)"
          >
            <el-option value label="请选择" disabled></el-option>
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 规格属性 -->
        <el-form-item
          prop="specsattr"
          label="规格属性"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.specsattr" multiple placeholder="请选择">
            <el-option value label="请选择" disabled></el-option>
            <el-option
              v-for="item in attrArr"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否新品" :label-width="formLabelWidth">
          <el-radio v-model="form.isnew" :label="1">是</el-radio>
          <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="是否热卖" :label-width="formLabelWidth">
          <el-radio v-model="form.ishot" :label="1">是</el-radio>
          <el-radio v-model="form.ishot" :label="2">否</el-radio>
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

        <!-- 商品描述 -->
        <el-form-item label="商品描述" :label-width="formLabelWidth">
          <!-- 插入富文本编辑器 -->
          <div id="editor"></div>
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
import { getGoodsAdd, getSpecsList, getGoodsInfo, getGoodsEdit } from "../../utils/axios";
import { mapActions, mapGetters } from "vuex";
// 引入富文本编辑器
import E from 'wangeditor'

export default {
  data() {
    return {
      form: {
        first_cateid: "", // 一级分类编号
        second_cateid: "", // 二级分类编号
        goodsname: "", // 商品名称
        price: "", // 商品价格
        market_price: "", // 市场价格
        img: "", // 商品图片（文件）
        description: "", // 商品描述
        specsid: "", // 商品规格编号
        specsattr: "", // 商品规格属性
        isnew: 1, // 是否新品
        ishot: 1, // 是否热卖推荐
        status: 1, // 状态 1正常 2禁用
      },
      rules: {
        first_cateid: [
          { required: true, message: "请选择一级分类编号", trigger: "change" },
        ],
        second_cateid: [
          { required: true, message: "请选择二级分类编号", trigger: "change" },
        ],
        goodsname: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        market_price: [
          { required: true, message: "请输入市场价格", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        specsid: [
          { required: true, message: "请选择商品规格编号", trigger: "change" },
        ],
        specsattr: [
          { required: true, message: "请选择商品规格属性", trigger: "change" },
        ],
      },
      radio: "1",
      dialogImageUrl: "", // 预览图片地址
      dialogVisible: false, // 预览图片的弹框
      imgUrl: "", // 用来接收图片信息
      fileList: [], // 文件上传列表
      formLabelWidth: "120px",
      secondArr: [], //二级分类数组
      attrArr: [], //规格属性的数组
      editor: null, // 定义一个编辑器变量
      specsList: []

      // secondList: [],
      // oneindex: 0,
      // specsIndex: 0,
      // secondSpecsList: [],
    };
  },
  props: ["addInfo"],
  mounted() {
    this.getCateList()
    getSpecsList()
    .then(res=> {
      if(res.data.code == 200){
        this.specsList =  res.data.list
      }
    })
  },
  computed: {
    ...mapGetters({
      cateList: "cate/getCateList",
      // specsList: "specs/getSpecsList",
    }),
  },
  methods: {
    reset() {
      this.form = {
        first_cateid: "", // 一级分类编号
        second_cateid: "", // 二级分类编号
        goodsname: "", // 商品名称
        price: "", // 商品价格
        market_price: "", // 市场价格
        img: "", // 商品图片（文件）
        description: "", // 商品描述
        specsid: "", // 商品规格编号
        specsattr: "", // 商品规格属性
        isnew: 1, // 是否新品
        ishot: 1, // 是否热卖推荐
        status: 1, // 状态 1正常 2禁用
      };
      this.fileList = [];
      this.secondArr = [];
      this.attrArr = [];
      // 清空规则验证
      this.$refs['formDialog'].resetFields();
    },
    ...mapActions({
      getGoodsList: "goods/getGoodsAction",
      changePageAction: "goods/changePageAction",
      getGoodsCount: "goods/getGoodsCount",
      getCateList: "cate/getCateListAction",
      // getSpecsList: "specs/getSpecsAction",
    }),
    cancel() {
      this.$emit("cancel", false);
      this.reset();
    },
    onPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    onRemove(file, fileList) {},
    change(e) {
      let index = this.cateList.findIndex((item, i) => {
        return this.form.first_cateid == item.id;
      });
      this.secondArr = this.cateList[index].children;
      if (!e) {
        this.form.second_cateid = "";
      }

      // -------------------------------------------
      // this.oneindex = e;
      // this.form.first_cateid = this.cateList[e].catename
      // if (this.cateList[e].children) {
      //   this.secondList = this.cateList[e].children;
      // } else {
      //   this.secondList = [];
      //   this.form.second_cateid = "";
      // }
      // this.form.second_cateid = "";
    },
    secondChange(e) {
      let index = this.specsList.findIndex((item, i) => {
        return this.form.specsid == item.id
      })
      this.attrArr = this.specsList[index].attrs
      if(!e) {
        this.form.specsattr = ''
      }

      // this.specsIndex = e;
      // // this.form.first_cateid = this.specsList[e].catename
      // console.log(this.specsList[e].attrs);
      // if (this.specsList[e].attrs) {
      //   this.secondSpecsList = this.specsList[e].attrs;
      //   console.log(this.secondSpecsList);
      // } else {
      //   this.secondSpecsList = [];
      //   this.form.specsattr = "";
      // }
    },
    // 弹框打开加载富文本编辑器
    createEditor(){
      this.editor = new E('#editor')
      // 调用富文本编辑器 create 方法
      this.editor.create()
      // 设置内容
      this.editor.txt.html(this.form.description)
    },
    // 图片上传时触发的函数
    onChange(file, fileList) {
      this.imgUrl = file.raw;
    },
    onExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    // 添加事件
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.form.first_cateid = this.cateList[this.oneindex].id;
          // this.form.specsid = this.specsList[this.specsIndex].id;
          // this.form.price = parseFloat(this.form.price);
          // this.form.market_price = parseFloat(this.form.market_price);
          this.form.specsattr = this.form.specsattr ? this.form.specsattr.join(',') : [];
          this.form.description = this.editor.txt.html()

          let data = this.form;
          let file = new FormData();
          for (const key in data) {
            file.append(key, data[key]);
          }
          file.append("img", this.imgUrl);

          getGoodsAdd(file)
            .then((res) => {
              // console.log(res, '添加的响应');
              if (res.data.code === 200) {
                this.$message.success(res.data.msg);
                this.cancel();
                this.getGoodsList();
                this.getGoodsCount();
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
      // 调取接口
      getGoodsInfo({ id })
        .then((res) => {
          if (res.data.code == 200) {
            this.form = res.data.list;
            this.form.id = id;
            this.fileList = this.form.img
              ? [{ url: `${this.$imgUrl}${this.form.img}` }]
              : [];
            this.form.specsattr  =this.form.specsattr ? this.form.specsattr.split(',') : []
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
      this.form.price = this.form.price.toString();
      this.form.market_price = this.form.market_price.toString();
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.specsattr = this.form.specsattr ? this.form.specsattr.join(',') : [];
          this.form.description = this.editor.txt.html()

          let data = this.form;
          let file = new FormData();
          for (const key in data) {
            file.append(key, data[key]);
          }
          this.imgUrl = this.imgUrl ? this.imgUrl : this.form.img;
          file.append("img", this.imgUrl);

          getGoodsEdit(file)
            .then((res) => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.cancel();
                this.getGoodsList();
                this.getGoodsCount();
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

<style scoped>
.inputW {
  width: 70%;
}
</style>