
<style>
.el-container {
  flex-direction: column;
}
.el-main {
  position: relative;
}
.el-header {
  padding: 0;
}
.el-menu {
  width: 100%;
  height: 60px;
  padding: 0px 20px;
  box-sizing: border-box;
}
.userinfo {
  width: 140px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;
}
.avatar {
  margin-right: 15px;
}
.welcome {
  line-height: 60px;
  color: #ffffff;
  font-size: 20px;
  margin-left: 30px;
}
.el-menu-item {
  font-size: 16px;
}
.tbs_box {
  border: 1px solid #dcdfe6;
  height: 730px;
  margin: 20px;
}
.el-tabs__item {
  font-size: 18px;
  height: 60px;
  line-height: 60px;
}
.operation {
  width: 20%;
}
.el-input__inner {
  height: 40px;
  line-height: 40px;
}
.el-table {
  font-size: 16px;
  max-height: 585px;
  overflow-y: auto;
  min-height: 585px;
  box-sizing: content-box;
}
.el-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 45px;
}
.el-pager li {
  height: 30px;
  line-height: 30px;
  font-size: 18px;
  font-weight: 400;
}
.el-form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.el-form-item {
  width: 80%;
}
.el-form-item__content {
  line-height: 20px;
}
.type_box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.add {
  display: flex;
  width: 50%;
  margin-top: 20px;
}
.input_add {
  flex: 1;
}
.modifypwd {
  width: 60%;
  position: absolute;
  top: 50px;
  left: 50%;
  margin-left: -30%;
  min-width: 460px;
  max-width: 560px;
}
.el-table td,
.el-table th {
  margin-right: 120px;
}
.cell {
  font-size: 16px;
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  white-space: normal;
}
</style>

<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="1">首页</el-menu-item>
        <span class="welcome">欢迎您！ {{username}}</span>
        <div class="userinfo">
          <el-avatar :src="avatarurl" :size="50" class="avatar"></el-avatar>
          <el-button style="font-size: 16px;" type="text" @click="loginout">退出</el-button>
        </div>
      </el-menu>
    </el-header>
    <el-main>
      <el-tabs
        style="height: 800px;"
        tabPosition="left"
        type="border-card"
        v-model="active_tabs"
        :before-leave="beforeleave"
      >
        <el-tab-pane label="新闻列表" style="font-size= 20px;" name="newslist">
          <!-- 新闻列表 -->
          <el-main class="tbs_box">
            <el-table
              :data="newsData.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
              style="width: 100%"
            >
              <el-table-column label="时间" prop="pubtime" width="100"></el-table-column>
              <el-table-column label="标题" prop="title" width="220"></el-table-column>
              <el-table-column label="分类" prop="type" width="100"></el-table-column>
              <el-table-column label="内容" prop="content"></el-table-column>
              <el-table-column align="right" width="200">
                <template slot="header" slot-scope="scope">
                  <el-input v-model="search" placeholder="输入关键字搜索" />
                </template>
                <template slot-scope="scope">
                  <el-button type="danger" @click="delnews(scope.$index, scope.row)">删除</el-button>
                  <el-button @click="modifybtn(scope.$index, scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination
              background
              layout="prev, pager, next"
              :total="size"
              :page-size="8"
              @current-change="changepage"
            ></el-pagination>
          </el-main>
        </el-tab-pane>
        <el-tab-pane :label="labelname" name="addnews">
          <el-main class="tbs_box">
            <!-- 增加新闻 -->
            <el-form
              v-if="isadd"
              :label-position="labelPosition"
              ref="info_box"
              label-width="80px"
              :model="newsinfo"
              :rules="rules"
              status-icon
              hide-required-asterisk
            >
              <el-form-item label="标题:" prop="title">
                <el-input v-model="newsinfo.title" placeholder="请输入新闻标题"></el-input>
              </el-form-item>

              <el-form-item label="分类:">
                <!-- 分类下拉框 -->
                <el-select v-model="newsinfo.type" filterable placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-alert v-if="selectinfo" :title="selectinfo" type="error" show-icon></el-alert>
              </el-form-item>
              <!-- 富文本编辑器 -->
              <el-form-item label="内容:">
                <editor-bar
                  class="editor"
                  :value="newsinfo.detail"
                  :isClear="isClear"
                  @change="change"
                  @getimgurl="getimgurl"
                ></editor-bar>
                <el-alert v-if="contentinfo" :title="contentinfo" type="error" show-icon></el-alert>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  width="200"
                  @click="evevts? addnews():modifynews()"
                >{{btninfo}}</el-button>
              </el-form-item>
            </el-form>
          </el-main>
        </el-tab-pane>
        <el-tab-pane label="分类管理" name="type">
          <!-- 分类管理 -->
          <el-main class="tbs_box">
            <el-main class="type_box">
              <el-table
                :data="typeData.filter(data => !search || data.type.toLowerCase().includes(search.toLowerCase()))"
                style="width: 80%"
              >
                <el-table-column label="分类" prop="type"></el-table-column>
                <el-table-column align="right" width="300">
                  <template slot="header" slot-scope="scope">
                    <el-input v-model="search" placeholder="输入关键字搜索" />
                  </template>
                  <template slot-scope="scope">
                    <el-button type="danger" @click="deltype(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <div class="add">
                <el-input
                  v-model="add_type"
                  width="100%"
                  class="input_add"
                  placeholder="请输入你想添加的分类"
                ></el-input>
                <el-button type="primary" @click="addtype()">添加</el-button>
              </div>
            </el-main>
          </el-main>
        </el-tab-pane>

        <el-tab-pane label="密码修改" name="modifypwd">
          <!-- 密码修改 -->
          <el-main class="tbs_box">
            <el-form
              :label-position="labelPosition"
              class="modifypwd"
              ref="info"
              label-width="80px"
              :model="info"
              :rules="rules"
              status-icon
              hide-required-asterisk
            >
              <el-form-item label="旧密码:" prop="oldpassword">
                <el-input type="password" v-model="info.oldpassword"></el-input>
              </el-form-item>
              <el-form-item label="新密码:" prop="newpassword">
                <el-input type="password" v-model="info.newpassword"></el-input>
              </el-form-item>
              <el-form-item label="重复密码:" prop="rpassword">
                <el-input type="password" v-model="info.rpassword"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="modifypwd('info')">确定修改</el-button>
              </el-form-item>
            </el-form>
          </el-main>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import EditorBar from "../components/editor";
import time from "../util/time";
import dispose from "../util/dispose";

export default {
  components: {
    EditorBar
  },
  data() {
    // 验证分类
    var checktype = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择分类"));
      }
    };
    // 验证内容
    var checkdetail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请添加新闻内容"));
      }
    };
    // 验证旧密码
    var checkoldPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else {
        if (
          this.info.oldpassword.length < 6 ||
          this.info.oldpassword.length > 20
        ) {
          callback(new Error("长度在 6 到 20 个字符"));
        } else {
          callback();
        }
      }
    };
    // 验证新密码
    var checknewPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (
          this.info.newpassword.length < 6 ||
          this.info.newpassword.length > 20
        ) {
          callback(new Error("长度在 6 到 20 个字符"));
        } else {
          callback();
        }
      }
    };
    // 验证重复密码
    var checkrPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入重复密码"));
      } else {
        if (this.info.rpassword.length < 6 || this.info.rpassword.length > 20) {
          callback(new Error("长度在 6 到 20 个字符"));
        } else if (this.info.rpassword != this.info.newpassword) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      }
    };

    // 数据
    return {
      evevts: true,
      btninfo: "发布",
      active_tabs: "newslist",
      isadd: true,
      ismodify: false,
      labelname: "添加新闻",
      add_type: "",
      search: "",
      activeIndex: "1",
      avatarurl: "http://118.89.191.110:5454/avatar/",
      fit: "fill",
      username: "",
      newsData: [],
      typeData: [],
      size: 80,
      isClear: false,
      options: [],
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        oldpassword: [{ validator: checkoldPass, trigger: "blur" }],
        newpassword: [{ validator: checknewPass, trigger: "blur" }],
        rpassword: [{ validator: checkrPass, trigger: "blur" }]
      },
      labelPosition: "right",
      newsinfo: {
        title: null,
        type: null,
        detail: null
      },
      selectinfo: "",
      contentinfo: "",
      info: {
        oldpassword: "",
        newpassword: "",
        rpassword: ""
      },
      picture: "",
      newssize: 8,
      index: null,
      news: null,
      page: 1
    };
  },
  methods: {
    // 退出登陆
    loginout() {
      localStorage.removeItem("user");
      this.$message({
        message: "退出成功,即将跳转登录页面，请稍后...",
        type: "success",
        duration: 1500
      });
      setTimeout(() => {
        this.$router.push({ name: "login" });
      }, 1500);
    },

    //tabs跳转前
    beforeleave(active, old) {
      if (old == "addnews" && this.labelname == "修改新闻") {
        this.labelname = "增加新闻";
        this.btninfo = "发布";
        this.newsinfo.title = "";
        this.newsinfo.type = "";
        this.newsinfo.detail = "";
        this.evevts = true;
      }
    },

    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },

    //删除新闻
    delnews(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(
              "/delnews",
              {
                _id: row._id
              },
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              }
            )
            .then(res => {
              if (res.data.status == "success") {
                this.news.splice(index + (this.page - 1) * 8, 1);
                this.size -= 1;
                this.newsData = [];
                //当不是第一页并且当页的第一条
                if (
                  index == 0 &&
                  this.page != 1 &&
                  index + (this.page - 1) * 8 + 1
                ) {
                  for (
                    var i = (this.page - 2) * 8;
                    i < (this.page - 1) * 8;
                    i++
                  ) {
                    console.log(time(this.news[i].pubtime));
                    this.newsData.push({
                      pubtime: time(this.news[i].pubtime),
                      type: this.news[i].type,
                      title: this.news[i].title,
                      content: dispose(this.news[i].content),
                      time: this.news[i].pubtime,
                      contents: this.news[i].content,
                      _id: this.news[i]._id,
                      media: this.news[i].media,
                      picture: this.news[i].picture
                    });
                  }
                  this.page -= 1;
                } else {
                  for (
                    var i = (this.page - 1) * 8;
                    i <
                    (this.news.length < 8 ? this.news.length : this.page * 8);
                    i++
                  ) {
                    this.newsData.push({
                      pubtime: time(this.news[i].pubtime),
                      type: this.news[i].type,
                      title: this.news[i].title,
                      content: dispose(this.news[i].content),
                      time: this.news[i].pubtime,
                      contents: this.news[i].content,
                      _id: this.news[i]._id,
                      media: this.news[i].media,
                      picture: this.news[i].picture
                    });
                  }
                }

                this.$message({
                  message: "删除成功",
                  duration: 1500,
                  type: "success"
                });
              } else {
                this.$message({
                  message: "删除失败",
                  duration: 1500,
                  type: "error"
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //删除分类
    deltype(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(
              "/deltype",
              { type: row.type },
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              }
            )
            .then(res => {
              if (res.data.status == "success") {
                this.typeData.splice(index, 1);
                this.options.splice(index, 1);

                this.$message({
                  message: "删除成功",
                  duration: 1500,
                  type: "success"
                });
              } else {
                this.$message({
                  message: "删除失败",
                  duration: 1500,
                  type: "error"
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //新闻列表修改按钮
    modifybtn(index, row) {
      console.log(index, row);
      this.active_tabs = "addnews";
      this.labelname = "修改新闻";
      this.btninfo = "确认修改";
      this.evevts = false;
      this.index = index;

      this.newsinfo.title = row.title;
      this.newsinfo.type = row.type;
      this.newsinfo.detail = row.contents;
    },

    //切换分页
    changepage(currentPage) {
      this.page = currentPage;
      this.newsData = [];
      for (var i = (this.page - 1) * 8; i < this.page * 8; i++) {
        console.log(this.news);
        this.newsData.push({
          pubtime: time(this.news[i].pubtime),
          type: this.news[i].type,
          title: this.news[i].title,
          content: dispose(this.news[i].content),
          time: this.news[i].pubtime,
          contents: this.news[i].content,
          _id: this.news[i]._id,
          media: this.news[i].media,
          picture: this.news[i].picture
        });
      }
    },

    //获取富文本内容
    change(val) {
      this.newsinfo.detail = val;
    },

    //获取富文本上传的图片地址
    getimgurl(val) {
      this.picture = val[0];
    },

    //修改密码
    modifypwd() {
      this.$refs.info.validate(valid => {
        if (valid) {
          let _id = JSON.parse(localStorage.getItem("user")).userinfo._id;
          let newpassword = this.info.newpassword;
          let oldpassword = this.info.oldpassword;
          this.$axios
            .post(
              "/modifypwd",
              {
                _id,
                newpassword,
                oldpassword
              },
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              }
            )
            .then(res => {
              if (res.data.status == "success") {
                let token = JSON.parse(localStorage.getItem("user")).token;
                this.$axios
                  .post(
                    "/deltoken",
                    {
                      token
                    },
                    {
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      }
                    }
                  )
                  .then(res => {
                    if (res.data.status == "success") {
                      localStorage.removeItem("user");
                      this.$message({
                        message: "修改成功",
                        type: "success",
                        duration: 1500
                      });
                      setTimeout(() => {
                        this.$router.push({ name: "login" });
                      }, 1500);
                    } else {
                      this.$message({
                        message: "修改失败",
                        type: "error",
                        duration: 1500
                      });
                    }
                  });
              }
            });
        } else {
          console.log("输入错误!");
          return false;
        }
      });
    },

    //修改新闻
    modifynews() {
      this.$refs.info_box.validate(valid => {
        if (!this.newsinfo.type && !this.newsinfo.detail) {
          this.selectinfo = "请选择分类";
          this.contentinfo = "请输入内容";
          return false;
        } else {
          this.selectinfo = null;
          this.contentinfo = null;
          if (!this.newsinfo.type) {
            this.selectinfo = "请选择分类";
            return false;
          } else {
            this.selectinfo = null;
            if (!this.newsinfo.detail) {
              this.contentinfo = "请输入内容";
              return false;
            } else {
              this.contentinfo = null;
              if (valid) {
                // title,type,content,pubtime,media,picture
                let title = this.newsinfo.title;
                let type = this.newsinfo.type;
                let content = this.newsinfo.detail;
                let pubtime = this.newsData[this.index].pubtime;
                let media = this.newsData[this.index].media;
                let picture = this.newsData[this.index].picture;
                let _id = this.newsData[this.index]._id;
                console.log(title);
                console.log(type);
                console.log(content);

                this.$axios
                  .post(
                    "/modifynews",
                    {
                      _id,
                      title,
                      type,
                      content
                    },
                    {
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      }
                    }
                  )
                  .then(res => {
                    if (res.data.status == "success") {
                      console.log(res);
                      this.newsData[this.index].title = this.newsinfo.title;
                      this.newsData[this.index].type = this.newsinfo.type;
                      this.newsData[this.index].contents = this.newsinfo.detail;
                      this.newsData[this.index].content = dispose(
                        this.newsinfo.detail
                      );

                      this.newsinfo.title = "";
                      this.newsinfo.type = "";
                      this.newsinfo.detail = "";
                      this.active_tabs = 'newslist'
                      this.$message({
                        message: "修改成功",
                        duration: 1500,
                        type: "success"
                      });
                    } else {
                      this.$message({
                        message: "修改失败",
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
          }
        }
      });
    },

    // 添加新闻
    addnews() {
      this.$refs.info_box.validate(valid => {
        if (!this.newsinfo.type && !this.newsinfo.detail) {
          this.selectinfo = "请选择分类";
          this.contentinfo = "请输入内容";
          return false;
        } else {
          this.selectinfo = null;
          this.contentinfo = null;
          if (!this.newsinfo.type) {
            this.selectinfo = "请选择分类";
            return false;
          } else {
            this.selectinfo = null;
            if (!this.newsinfo.detail) {
              this.contentinfo = "请输入内容";
              return false;
            } else {
              this.contentinfo = null;
              console.log(valid);
              if (valid) {
                // title,type,content,pubtime,media,picture
                let title = this.newsinfo.title;
                let type = this.newsinfo.type;
                let content = this.newsinfo.detail;
                let pubtime = new Date().getTime();
                let media = "乐亦新闻";
                let picture = this.picture;

                this.$axios
                  .post(
                    "/addnews",
                    {
                      title,
                      type,
                      content,
                      pubtime,
                      media,
                      picture
                    },
                    {
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      }
                    }
                  )
                  .then(res => {
                    console.log(res);
                    if (res.data.status == "success") {
                      this.size += 1;
                      console.log(this.news.length);
                      console.log(this.news);
                      console.log(res.data.data);
                      this.news.push(res.data.data);
                      console.log(this.news.length);
                      console.log(this.news);
                      if (this.newsData.length < 8) {
                        this.newsData.push({
                          pubtime: time(res.data.data.pubtime),
                          type: res.data.data.type,
                          title: res.data.data.title,
                          content: dispose(res.data.data.content),
                          time: res.data.data.pubtime,
                          contents: res.data.data.content,
                          _id: res.data.data._id,
                          media: res.data.data.media,
                          picture: res.data.data.picture
                        });
                      }
                      this.newsinfo.title = "";
                      this.newsinfo.type = "";
                      this.newsinfo.detail = "";
                      this.$message({
                        message: "发表成功",
                        duration: 1500,
                        type: "success"
                      });
                    } else {
                      this.$message({
                        message: "发表失败",
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
          }
        }
      });
    },

    // 添加分类
    addtype() {
      let type = this.add_type;
      var flag = null;
      if (!this.add_type) {
        this.$message({
          message: "分类不为空",
          duration: 1500,
          type: "error"
        });
      } else {
        for (let item of this.options) {
          if (item.value == this.add_type) {
            flag = true;
          }
        }
        if (flag) {
          this.$message({
            message: "已存在该分类",
            duration: 1500,
            type: "error"
          });
        } else {
          this.$axios
            .post(
              "/addtype",
              { type },
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              }
            )
            .then(res => {
              if (res.data.status) {
                // let size = this.options.length;
                this.options.push({
                  value: res.data.data.type,
                  lable: res.data.data.type
                });
                this.typeData.push({
                  type: res.data.data.type
                });
                this.$message({
                  message: "添加成功",
                  duration: 1500,
                  type: "success"
                });
              } else {
                this.$message({
                  message: "添加失败",
                  duration: 1500,
                  type: "error"
                });
              }
            });
        }
      }
    }
  },
  // 获取分类列表和新闻列表
  mounted() {
    //分类列表
    this.username = JSON.parse(localStorage.getItem("user")).userinfo.username;
    this.avatarurl += JSON.parse(localStorage.getItem("user")).userinfo.avatar;
    this.$axios.get("/typelist").then(res => {
      if (res.data.status == "success") {
        for (let item of res.data.data) {
          this.options.push({
            value: item.type,
            lable: item.type
          });
          this.typeData.push({
            type: item.type
          });
        }
      }
    });

    // 新闻列表
    this.$axios.get("/news").then(res => {
      if (res.data.status == "success") {
        this.size = res.data.data.length;
        this.news = res.data.data;
        res.data.data.forEach((item, i) => {
          if (i < this.newssize) {
            this.newsData.push({
              pubtime: time(item.pubtime),
              type: item.type,
              title: item.title,
              content: dispose(item.content),
              time: item.pubtime,
              contents: item.content,
              _id: item._id,
              media: item.media,
              picture: item.picture
            });
          }
        });
      }
    });
  }
};
</script>

