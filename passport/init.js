const login = require('./login.js');
const singup = require('./signup');
const User = require('../models/mern_user.model');

module.exports = function(passport) {       // Passport是從父親傳遞下來的passport.js

    // 為了讓之後的session永久支援保持登入，passport需要能夠序列化、反序列化User (還沒完全理解是甚麼意思)
    // Passport提供兩種方法來達到此目的

    // 序列化 (傳遞user進passport.serializeUser方法，完成後呼叫callback (done)
    passport.serializeUser((user, done) => {
        done(null, user_id);
    })

    // 反序列化
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    })


    // 接下來開始寫login、signup，但在這專案裡我們將這兩段程式碼分為兩個檔案，所以在此將passport傳遞給子元件
    login(passport);
    // singup(passport);
}