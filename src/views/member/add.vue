<template>
  <div>
    <el-dialog
      title="编辑会员"
      :visible.sync="addInfo.isShow"
      center
      :before-close="cancel"
    >
      <el-form :model="form" :rules="rules">
        <el-form-item prop="phone" label="手机号" :label-width="formLabelWidth">
          <el-input v-model.number="form.phone" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          prop="nickname"
          label="昵称"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          prop="password"
          label="密码"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.password" autocomplete="off"></el-input>
          <p>留空则不修改</p>
        </el-form-item>

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
        <el-button type="primary" @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getMemberAdd, getMemberInfo, getMemberEdit } from "../../utils/axios";

export default {
  data() {
    return {
      form: {
        nickname: "", // 昵称
        phone: "", // 手机号
        password: "", // 魔码
        status: 1, // 状态
      },
      rules: {
        nickname: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            min: 11,
            max: 11,
            type: "number",
            message: "长度 11 位",
            trigger: "blur",
          },
        ],
      },
      formLabelWidth: "120px",
    };
  },
  props: ["addInfo"],
  computed: {
    ...mapGetters({
      memberList: "member/getMemberList",
    }),
  },
  methods: {
    cancel() {
      this.$emit("cancel", false);
      this.reset();
    },
    reset() {
      this.form = {
        rolename: "",
        status: 1,
      };
    },
    ...mapActions({
      getMemberList: "member/getMemberAction",
    }),
    look(id) {
      getMemberInfo({ id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id = id;
        }
      });
    },
    update() {
      getMemberEdit(this.form).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
          this.getMemberList();
          this.cancel();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
  },
  mounted() {
    this.getMemberList();
  },
};
</script>

<style>
</style>