const mongoose = require('mongoose')

const typeschema = mongoose.Schema({
    type: { type: String}
},{collection:'type'})


const typemodel = mongoose.model('type',typeschema);

module.exports = typemodel;