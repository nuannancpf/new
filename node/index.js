const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer')
const path = require('path')
const crytpo = require("crypto");
const jwt = require('jsonwebtoken');

const usermodel = require('./util/usermodel')
const tokenmodel = require('./util/tokenmodel')
const newsmodel = require('./util/newsmodel')
const typemodel = require('./util/typemodel')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public', 'avatar'))
    },
    filename: function (req, file, cb) {
        var arr = file.originalname.split('.')
        cb(null, Date.now() + '.' + arr[arr.length - 1])
    }
})
var upload = multer({ storage: storage })

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use(
    function (req, res, next) {
        res.header({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'X-Requested-With',
            'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DETELE',//,GET,OPTIONS,PUT,DETELE
        })
        next();
    }
)

//上传头像
app.post('/avatar', upload.single('avatar'), (req, res) => {
    res.json({
        imgurl: req.file.filename
    })
})

//注册接口(username,password,avatar)
app.post('/sign', (req, res) => {
    console.log(req.body)
    let username = req.body.username;
    let password = req.body.password;
    let avatar = req.body.avatar;
    if (username && password && avatar) {
        var md5 = crytpo.createHash("md5");
        var md5Sum = md5.update(password);
        var pwd = md5Sum.digest('hex');

        let user = new usermodel({
            username,
            password: pwd,
            avatar
        })

        user.save((err, info) => {
            if (err) {
                res.json({
                    status: 'fail',
                    msg: '注册失败',
                    data: err
                })
            } else {
                res.json({
                    status: 'success',
                    msg: '注册成功',
                    data: info
                })
            }
        })
    } else {
        res.json({
            status: 'fail',
            msg: '注册失败',
            data: { error: '参数错误' }
        })
    }
})

//登录接口(username,password)
app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
        var md5 = crytpo.createHash("md5");
        var md5Sum = md5.update(password);
        var pwd = md5Sum.digest('hex');
        usermodel.findOne({ username, password: pwd }, (err, info) => {
            if (info) {
                let user = {
                    _id: info._id,
                    username: info.username,
                    avatar: info.avatar
                }
                let tokeninfo = jwt.sign(
                    user,
                    'secret',
                    { expiresIn: '7d' }
                )
                let token1 = new tokenmodel({
                    token: tokeninfo
                })
                token1.save((err, token) => {
                    if (info) {
                        res.json({
                            status: 'success',
                            msg: '登录成功',
                            data: {
                                token: tokeninfo,
                                userinfo: user
                            }
                        })
                    }
                })
            } else {
                res.json({
                    status: 'fail',
                    msg: '登录失败',
                    data: err
                })
            }
        })
    } else {
        res.json({
            status: 'fail',
            msg: '登录失败',
            data: '用户名或密码错误'
        })
    }
})

//登录状态(token)
app.post('/status', (req, res) => {
    let token = req.body.token;
    console.log(token)
    if (token) {
        tokenmodel.findOne({ token }, (err) => {
            if (err) {
                res.json({
                    status: 'fail',
                    msg: "查询失败",
                    data: ''
                })
            } else {
                try {
                    var tokeninfo = jwt.verify(token, 'secret');
                } catch (error) {
                    res.json({
                        status: 'fail',
                        msg: "登录过期",
                        data: error
                    })
                }
                if (tokeninfo) {
                    res.json({
                        status: 'success',
                        msg: "查询成功",
                        data: tokeninfo
                    })
                }
            }
        })
    } else {
        res.json({
            status: 'fail',
            msg: '未携带token',
            data: '未携带token'
        })
    }

})

/*  
    新闻字段:
    标题  title
    内容  content
    时间  pubtime
    头图  picture
    来源  media
    类别  type
*/
//新闻列表
app.get('/news', (req, res) => {
    newsmodel.find((err, info) => {
        if (info) {
            res.json({
                status: 'success',
                msg: '查询成功',
                data: info
            })
        } else {
            res.json({
                status: 'fail',
                msg: '查询失败',
                data: err
            })
        }
    })
})

//删除新闻(title,type)
app.post('/delnews', (req, res) => {
    let _id = req.body._id;
    if (_id) {
        newsmodel.deleteOne({ _id }, (err) => {
            if (err) {
                res.json({
                    status: 'fail',
                    msg: '删除失败',
                    data: err
                })
            } else {
                res.json({
                    status: 'success',
                    msg: '删除成功',
                    data: 'ok'
                })
            }
        })
    } else {
        res.json({
            status: 'fail',
            msg: '删除失败',
            data: '缺少_id'
        })
    }
})

//修改新闻(title,type)
app.post('/modifynews', (req, res) => {
    let _id = req.body._id;
    let title = req.body.title;
    let type = req.body.type;
    let content = req.body.content;
    if (title && type) {
        newsmodel.updateOne({ _id }, { type, title, content }, (err, info) => {
            if (err) {
                res.json({
                    status: 'fail',
                    msg: '修改失败',
                    data: err
                })
            } else {
                console.log(info)
                res.json({
                    status: 'success',
                    msg: '修改成功',
                    data: info
                })
            }
        })
    } else {
        res.json({
            status: 'fail',
            msg: '修改失败',
            data: '缺少参数'
        })
    }
})

//添加新闻(title,type,content,pubtime,media,picture)
app.post('/addnews', (req, res) => {
    console.log(req.body)
    let title = req.body.title;
    let type = req.body.type;
    let content = req.body.content;
    let pubtime = req.body.pubtime;
    let media = req.body.media;
    let picture = req.body.picture;
    if (title && type && content && pubtime && media || picture) {
        let news = new newsmodel({
            title,
            type,
            content,
            pubtime,
            media,
            picture
        })
        news.save((err, info) => {
            if (err) {
                res.json({
                    status: 'fail',
                    msg: '添加失败',
                    data: err
                })
            } else {
                res.json({
                    status: 'success',
                    msg: '添加成功',
                    data: info
                })
            }
        })
    } else {
        res.json({
            status: 'fail',
            msg: '添加失败',
            data: '缺少参数'
        })
    }
})

//分类列表
app.get('/typelist', (req, res) => {
    typemodel.find((err, info) => {
        if (info) {
            res.json({
                status: 'success',
                msg: '查询成功',
                data: info
            })
        } else {
            res.json({
                status: 'fail',
                msg: '查询失败',
                data: err
            })
        }
    })
})

//删除分类(type)
app.post('/deltype', (req, res) => {
    let type = req.body.type;
    if (type) {
        typemodel.deleteOne({ type: type }, (err) => {
            if (err) {
                res.json({
                    status: 'fail',
                    msg: '删除失败',
                    data: err
                })
            } else {
                res.json({
                    status: 'success',
                    msg: '删除成功',
                    data: 'ok'
                })
            }
        })
    } else {
        res.json({
            status: 'fail',
            msg: '删除失败',
            data: '缺少分类'
        })
    }
})

//添加分类(type)
app.post("/addtype", (req, res) => {
    let type = req.body.type;
    if (type) {
        let types = new typemodel({
            type
        })
        types.save((err, info) => {
            if (err) {
                res.json({
                    status: 'fail',
                    msg: '添加失败',
                    data: err
                })
            } else {
                res.json({
                    status: 'success',
                    msg: '添加成功',
                    data: info
                })
            }
        })
    } else {
        res.json({
            status: 'fail',
            msg: '添加失败',
            data: '缺少标题'
        })
    }
})

//修改密码(_id,newpassword,oldpassword)
app.post('/modifypwd', (req, res) => {
    let _id = req.body._id;
    let oldpassword = req.body.oldpassword;
    let newpassword = req.body.newpassword;
    var md5 = crytpo.createHash("md5");
    var md5Sum = md5.update(oldpassword);
    var oldpwd = md5Sum.digest('hex');

    var md5 = crytpo.createHash("md5");
    var md5Sum = md5.update(newpassword);
    var newpwd = md5Sum.digest('hex');
    if (_id && newpassword) {
        usermodel.updateOne({ _id, password: oldpwd }, { password: newpwd }, (err) => {
            if (err) {
                res.json({
                    status: 'fail',
                    msg: '修改失败',
                    data: err
                })
            } else {
                res.json({
                    status: 'success',
                    msg: '修改成功',
                    data: 'ok'
                })
            }
        })
    } else {
        res.json({
            status: 'fail',
            msg: '修改失败',
            data: '缺少参数'
        })
    }
})

//修改密码后删除之前登陆的token
app.post("/deltoken", (req, res) => {
    let token = req.body.token;
    if (token) {
        tokenmodel.deleteOne({ token }, (err) => {
            if (err) {
                res.json({
                    status: 'fail',
                    msg: '删除失败',
                    data: err
                })
            } else {
                res.json({
                    status: 'success',
                    msg: '删除成功',
                    data: 'ok'
                })
            }
        })
    } else {
        res.json({
            status: 'fail',
            msg: '删除失败',
            data: '缺少参数'
        })
    }

})

app.listen(5454)