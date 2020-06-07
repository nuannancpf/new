const mongoose = require('mongoose');

var tokenschema = mongoose.Schema({
    token: String
},{collection:'token'})

var tokenmodel = mongoose.model('token',tokenschema);

module.exports = tokenmodel;