const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/mern_user.model.js');
const bCrypt = require('bcrypt-nodejs');

module.exports = function (passport) {
    passport.use(
        'login',                                               // 前面的loging是在外層使用時，用來呼叫的函數名稱
        new LocalStrategy(
            { passReqToCallback: true },                       // 將req傳給後面的callback
            function (req, username, password, done) {         // callback (username, password為預設，可調整為自訂名(但需另外設定))
                User.findOne(
                    { 'username': username },                  // 找資料庫中有沒有此人的username
                    (err, user) => {                           // findOne傳遞找到的user和出現的錯誤，傳給後面的callback
                        // 如果出錯
                        if (err) { return done(err) };

                        // 如果沒有此使用者
                        if (!user) {
                            console.log('User Not Found With username ' + username);
                            return (null, false, req.flash('message', 'User Not Found'));
                        }

                        // 如果有使用者，但密碼錯誤
                        if (!isValidPassword(user, password)) {
                            console.log('Invalid Password');
                            return done(null, false, req.flash('message', 'Invalid Password'));
                        }

                        // 如果有使用者而且密碼正確
                        return (null, user);
                    }
                )
            }
        )
    )
}