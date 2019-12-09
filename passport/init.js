const login = require('./login.js');
const singup = require('./signup');
const User = require('../models/mern_user.model');

module.exports = function (passport) {       // Passport是從父親傳遞下來的passport.js

    // 為了讓之後的session永久支援保持登入，passport需要能夠序列化、反序列化User (還沒完全理解是甚麼意思)
    // Passport提供兩種方法來達到此目的

    // 第一次嘗試的方法 (passport可以用，但不知道怎麼讀取user的資料，所以嘗試第二種方法)
    // // 序列化 (傳遞user進passport.serializeUser方法，完成後呼叫callback (done)
    // passport.serializeUser((user, done) => {
    //     done(null, user_id);
    // })
    // // 反序列化
    // passport.deserializeUser((id, done) => {
    //     User.findById(id, (err, user) => {
    //         done(err, user);
    //     })
    // })

    // 第二種方法
    // serializeUser 是將使用者資訊存在 session 中
    passport.serializeUser(function (user, done) {
        done(null, user.name);
    });
    // deserializeUser 則是讓 express 的 req.user 可以取得目前的使用者詳細資料
    passport.deserializeUser(function (username, done) {
        done(null, Users[username]);
    });

    // 接下來開始寫login、signup，但在這專案裡我們將這兩段程式碼分為兩個檔案，所以在此將passport傳遞給子元件
    login(passport);
    // singup(passport);
}