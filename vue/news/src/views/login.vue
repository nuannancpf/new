<style scoped>
.el-container {
  width: 40%;
  min-width: 500px;
  height: 400px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -20%;
  margin-top: -200px;
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
.info {
  width: 80%;
  height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -40%;
  margin-top: -100px;
}
</style>

<template>
  <el-container>
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
          <el-form-item label="用户名:" prop="name">
            <el-input v-model="info.name"></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input type="password" v-model="info.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('info')">登录</el-button>
            <el-button @click="gosign">注册</el-button>
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
    return {
      labelPosition: "right",
      info: {
        name: "",
        password: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        password: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(info) {
      this.$refs[info].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "/login",
              {
                username: this.info.name,
                password: this.info.password
              },
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              }
            )
            .then(res => {
              console.log(res.data)
              if (res.data.status == "success") {
                localStorage.setItem("user",JSON.stringify(res.data.data));
                this.$message({
                  message: "登录成功",
                  duration: 1500,
                  type: "success"
                });
                setTimeout(() => {
                  this.$router.push({ name: "index" });
                }, 1500);
              } else {
                this.$message({
                  message: "登录失败",
                  duration: 1500,
                  type: "error"
                });
              }
            });
        } else {
          console.log("输入错误!");
          return false;
        }
      });
    },
    gosign() {
      this.$router.push({ path: "/sign" });
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