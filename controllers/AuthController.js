//創建用於身分驗證的Controller
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/User.js');

var userController = {};

// 當路徑指定為home時執行
userController.home = function (req, res) {
    // res.render('index', { user: req.user });
    
}

// 導航到註冊頁面 (供Routes使用)
userController.register = function (req, res) {
    res.render('register');
}

// POST 註冊
userController.doRegister = function (req, res) {
    // 對User.js註冊新用戶 (username, userpassword, callback)
    User.register(
        new User({
            username: req.body.username,
            name: req.body.name,
        }),
        req.body.password,
        function (err, user) {
            // 如果出錯，則中斷
            if (err) {
                return res.render('register', { user: user })
            }

            // 如果沒錯，用passport local策略驗證登入是否成功，之後導航回"/"
            passport.authenticate('local')(req, res, function () {
                res.redirect('/');
            })
        }
    )
}

// 前往登入頁
userController.login = function(req, res) {
    res.render('login');
}

// POST 登入
userController.doLogin = function (req, res) {
    // 用passport local策略驗證登入是否成功，之後導航回"/"
    passport.authenticate('local')(req, res, function() {
        res.redirect('/');
    })
}

// 登出
userController.logout = function(req, res) {
    req.logout();
    res.redirect('/');
}

module.exports = userController;