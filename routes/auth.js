// 因為我們已經在passport.js(自訂的檔案)中擴展了passport.js(from npm)的功能，所以在此可以放心使用passport.js(from npm)
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');        // 為了回傳Token
const passport = require('passport');       // 在自訂的passport.js，我們將passport模組附加了個自訂的中間件，以便在資料庫中查找username/password
const mern_userModel = require('../models/mern_user.model.js');

// 只有訪問/login，且帳密符合才會從這裡(伺服器)給出Token
router.route('/login').post((req, res, next) => {
    console.log('接收到/auth/login POST請求，這句話是從對應的routes傳出的回應');
    passport.authenticate(
        'local',                        // 使用本地驗證
        { session: false },             // 一些參數，也可以設定(successRedirect: '/users/profile', failureRedirect: '/users/sigin', failureFlash: true)...等等其他參數
        (err, user, info) => {          // 驗證後的callback (info是傳遞甚麼我暫時不知道，目前也沒用到，先不理)
            console.log('正在執行訪問/auth/login的passport.authenticate');
            // 如果驗證時出錯
            if (err !== null && err !== {} && err !== undefined) {         // 這兩個參數是從我們自訂的passport.js回傳的
                console.log('err !== null && err !== {} && err !== undefined');
                console.log(err);
                return res.status(400).json({
                    err: err,
                    info,
                    message: '驗證時程式出錯，尚無法確定有沒有User',
                    user: user,
                })
            }
            
            // 如果沒有user (若密碼不正確也會沒有user)
            if (!user) {         // 這兩個參數是從我們自訂的passport.js回傳的
                console.log('!user');
                return res.status(400).json({
                    message: info || '出錯了',
                    user: user,
                })
            }

            // 有user且密碼符合才執行
            // passport提供的登入方法，會建立一個session(在此專案禁用)，可以保持該用戶持續登入的狀態
            req.login(
                user,                   // 傳入查到的username
                { session: false },     // 一些參數 (在此我們不建立會話，因為我們用token來驗證是否登入)
                (err) => {              // 登入時執行的程式碼 (我們在此回傳簽名的Token和綁在Token中的資料，原則是盡量只提供必要的資料；另外還可以將依些資料寫成明文放在res中)
                    if (err !== null && err !== {} && err !== undefined) {
                        console.log('出錯了');
                        console.log(err);
                        return res.josn(err);
                    }

                    const token = jwt.sign({user}, process.env.ATLAS_TOKENSECRET);      // 因為是使用mongoose, 所以必須jwt.sign({物件})或jwt.sign(物件.toJson()
                    return res.json({ user, token });
                })
        })

        (req, res);
})

module.exports = router;