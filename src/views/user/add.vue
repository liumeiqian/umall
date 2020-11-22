<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd ? '添加管理员' : '修改管理员'"
      :visible.sync="addInfo.isShow"
      center
      :before-close="cancel"
    >
      <el-form :model="form" :rules="rules" ref="formDialog">
        <!-- 所属角色 -->
        <el-form-item
          prop="roleid"
          label="所属角色"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="form.roleid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 用户名称 -->
        <el-form-item
          prop="username"
          label="管理员名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
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
import { getUserAdd, getUserInfo, getUserEdit } from "../../utils/axios";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {
        roleid: "", // 角色编号
        username: "", // 管理员名称
        password: "", // 密码
        status: 1, // 状态 1正常 2禁用
      },
      rules: {
        username: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        roleid: [
          { required: true, message: "请输入上级菜单", trigger: "blur" },
        ],
      },
      formLabelWidth: "120px",
    };
  },
  props: ["addInfo"],
  computed: {
    ...mapGetters({
      roleList: "role/getRoleList",
    }),
  },
  mounted() {
    if(this.roleList.length == 0){
      this.getRoleList()
    }
  },
  methods: {
    reset() {
      this.form = {
        roleid: "", // 角色编号
        username: "", // 管理员名称
        password: "", // 密码
        status: 1, // 状态 1正常 2禁用
      };
    },
    ...mapActions({
      getRoleList: "role/getRoleAction",
      getUserList: 'user/getUserAction',
      getCountAction: 'user/getCountAction'
    }),
    cancel() {
      this.$emit("cancel", false);
      this.reset();
    },
    // 添加事件
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getUserAdd(this.form)
            .then((res) => {
              // console.log(res, '添加的响应');
              if (res.data.code === 200) {
                this.$message.success(res.data.msg);
                this.cancel();
                this.getUserList();
                this.getCountAction()
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
    look(uid) {
      // console.log(id);
      // 调取接口
      getUserInfo({ uid })
        .then((res) => {
          // console.log(res);
          if (res.data.code == 200) {
            this.form = res.data.list;
            this.form.uid = uid;
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
          getUserEdit(this.form)
            .then((res) => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.cancel();
                this.getUserList();
                this.getCountAction()
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