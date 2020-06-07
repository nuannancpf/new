<style>
.signbox {
  width: 40%;
  min-width: 500px;
  height: 500px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -20%;
  margin-top: -250px;
  background-color: #ffffff;
}
.el-header {
  background-color: #005cce;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-header span {
  color: #ffffff;
  font-size: 18px;
}
.el-main {
  position: relative;
}
.el-form {
  width: 100%;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -50%;
  margin-top: -150px;
}
.info {
  width: 80%;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -40%;
  margin-top: -150px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.avatar {
  width: 50px;
  height: 50px;
  display: block;
}
.el-form-item__content {
  line-height: 20px;
}
</style>

<template>
  <el-container class="signbox">
      <el-header>
        <span>新闻管理系统</span>
      </el-header>
      <el-main>
        <div class="info">
          <el-form
            :label-position="labelPosition"
            ref="info"
            label-width="80px"
            :model="info"
            :rules="rules"
            status-icon
            hide-required-asterisk
          >
            <el-form-item label="用户名:" prop="username">
              <el-input v-model="info.username"></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password">
              <el-input type="password" v-model="info.password"></el-input>
            </el-form-item>
            <el-form-item label="重复密码:" prop="rpassword">
              <el-input type="password" v-model="info.rpassword"></el-input>
            </el-form-item>

            <el-form-item label="头像:">
              <el-upload
                name="avatar"
                class="avatar-uploader"
                action="http://118.89.191.110:5454/avatar"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-alert v-if="isavatar" title="请选择头像" type="error" show-icon></el-alert>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm('info')">注册</el-button>
              <el-button @click="gologin">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.info.password.length < 6 || this.info.password.length > 20) {
          callback(new Error("长度在 6 到 20 个字符"));
        } else {
          callback();
        }
      }
    };
    var validaterPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入重复密码"));
      } else {
        if (this.info.rpassword.length < 6 || this.info.rpassword.length > 20) {
          callback(new Error("长度在 6 到 20 个字符"));
        } else if (this.info.rpassword != this.info.password) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      }
    };
    return {
      labelPosition: "right",
      info: {
        username: "",
        password: "",
        rpassword: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        password: [{ validator: validatePass, trigger: "blur" }],
        rpassword: [{ validator: validaterPass, trigger: "blur" }]
      },
      fileList: [],
      imageUrl: null,
      isavatar: null,
      imgurl: ""
    };
  },
  methods: {
    submitForm(info) {
      this.$refs[info].validate(valid => {
        if (!this.imageUrl) {
          this.isavatar = true;
          return false;
        } else {
          if (valid) {
            this.$axios
              .post(
                "/sign",
                {
                  username: this.info.username,
                  password: this.info.password,
                  avatar: this.imgurl
                },
                {
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  }
                }
              )
              .then(res => {
                console.log(res.data);
                if (res.data.status == "success") {
                  this.$message({
                    message: "注册成功",
                    duration: 1500,
                    type: "success"
                  });
                  setTimeout(() => {
                    this.$router.push({ name: "login" });
                  }, 1500);
                } else {
                  this.$message({
                    message: "注册失败",
                    duration: 1500,
                    type: "error"
                  });
                }
              });
          } else {
            console.log("输入错误!");
            return false;
          }
        }
      });
    },
    gologin() {
      this.$router.push({ name: "login" });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.imgurl = res.imgurl;
      this.isavatar = false;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }
    }
  },
  mounted() {
    document
      .querySelector("body")
      .setAttribute(
        "style",
        "background-image: url('https://goss.veer.com/creative/vcg/veer/800water/veer-134758095.jpg');background-size: cover;height:" +
          window.innerHeight +
          "px"
      );
  },
  beforeDestroy() {
    document.querySelector("body").removeAttribute("style");
  }
};
</script>