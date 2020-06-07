const mongoose = require('mongoose')

/*
    标题  title
    内容  content
    时间  pubtime
    头图  picture
    来源  media
    类别  type
*/
const newsschema = mongoose.Schema({
    type: String,
    title: String,
    content: String,
    pubtime: String,
    picture: String,
    media: String
},{collection:'news'})

const newsmodel = mongoose.model('news',newsschema)

module.exports = newsmodel;