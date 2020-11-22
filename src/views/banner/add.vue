<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd ? '添加轮播图' : '修改轮播图'"
      :visible.sync="addInfo.isShow"
      center
      :before-close="cancel"
    >
      <el-form :model="form" :rules="rules" ref="formDialog">

        <!-- 标题 -->
        <el-form-item
          prop="title"
          label="标题"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 分类类型 -->
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
import { getBannerAdd, getBannerInfo, getBannerEdit } from "../../utils/axios";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {
        title: "", // 轮播图名称
        img: "", // 图片(文件，一般用于二级分类)
        status: 1, // 状态 1正常 2禁用
      },
      rules: {
        title: [
          { required: true, message: "请输入轮播图名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      dialogImageUrl: "", // 预览图片地址
      dialogVisible: false, // 预览图片的弹框
      imgUrl: '', // 用来接收图片信息
      fileList: [],// 文件上传列表
      formLabelWidth: "120px",
    };
  },
  props: ["addInfo"],
  computed: {
    ...mapGetters({
      bannerList: "banner/getCateList",
    }),
  },
  methods: {
    onPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    onRemove(file, fileList) {},
    reset() {
      this.form = {
        title: "", // 轮播图名称
        img: "", // 图片(文件，一般用于二级分类)
        status: 1, // 状态 1正常 2禁用
      };
      this.fileList = []// 文件上传列表
    },
    // 图片上传时触发的函数
    onChange(file, fileList) {
      this.imgUrl = file.raw
    },
    ...mapActions({
      getBannerList: "banner/getBannerListAction",
    }),
    cancel() {
      this.$emit("cancel", false);
      this.reset();
    },
    // 添加事件
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = this.form
          let file = new FormData()
          for (const key in data) {
            file.append(key, data[key])
          }
          file.append('img', this.imgUrl)
          getBannerAdd(file)
            .then((res) => {
              // console.log(res, '添加的响应');
              if (res.data.code === 200) {
                this.$message.success(res.data.msg);
                console.log(res);
                this.cancel();
                this.getBannerList();
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
    onExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    // 查看一条事件
    look(id) {
      // console.log(id);
      // 调取接口
      getBannerInfo({ id })
        .then((res) => {
          if (res.data.code == 200) {
            this.form = res.data.list;
            this.form.id = id;
            this.fileList =  this.form.img ?  [{url: `${this.$imgUrl}${this.form.img}`}] : []
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
          let data = this.form;
          let file = new FormData()
          for (let i in data) {
            file.append(i, data[i])
          }
          console.log(this.form);
          this.imgUrl = this.imgUrl ? this.imgUrl : this.form.img;
          file.append('img', this.imgUrl)
          getBannerEdit(file)
            .then((res) => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.cancel();
                this.getBannerList();
              } else {
                this.$message.error(res.data.msg);
              }
            })
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