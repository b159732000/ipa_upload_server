// 創建身分驗證需求的模型
import mongoose from 'mongoose';
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// 創造資料庫需要的欄位(schema)
const UserSchema = mongoose.Schema({
    username: { type: String, index: true },
    password: { type: String }
})

const User = module.exports = mongoose.model('User', UserSchema);   // 用了一些mongoose內涵的方法，例如findOne

// 建立CreateUser方法, 然後用bycrypt加密 + 存檔
module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {     // 用bcrypt.genSalt方法加密，暫時理解為加密迭代次數為10次
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}

// getUserByUsername, 用username來找使用者
module.exports.getUserByUsername = function (username, callback) {
    let query = { username: username };
    User.findOne(query, callback);
}

// getUserById, 用id來找使用者
module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

// comparePassword, 當使用者登入的時候我們要比對登入密碼跟我們資料庫的密碼相同
module.exports.comparePassword = function(candidataPassword, hash, callback) {
    bcrypt.compare(candidataPassword, hash, (err, isMatch) => {     //bcrypt會比較candidatePassword和hash是否相符，之後觸發後面的函數()=>{}
        if(err) throw err;
        callback(null, isMatch);
    })
}