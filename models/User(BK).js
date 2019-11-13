// 創建身分驗證需求的模型
import mongoose from 'mongoose';
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

console.log('開始執行User.js');

var UserSchema = new Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);