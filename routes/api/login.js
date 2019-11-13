const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();

const User = require('../../models/User');

// GET登入頁面
router.get('/signin', (req, res, next) => {
    console.log(res.locals);
    // res.render('signin');        //代表渲染根目錄views/index.html (其中views是預設的路徑)
    res.json('登入成功');
})

// POST登入頁面
router.post('/signin',
    passport.authenticate('local', {        //驗證用戶是否已登入
        successRedirect: '/users/profile',
        // failureRedirect: '/users/sigin',
        // failureFlash: false
    }),
    (req, res) => {                         //認證成功才會掉用此函數
        // res.redirect('/users/profile');
        res.json('認證成功');
    }
)

// GET註冊頁面
router.get('/signup', (req, res, next) => {
    res.render('signup', { errors: '' });
})

// POST註冊頁面
router.post('/signup', (req, res, next) => {
    // Parse Info (取得請求中傳來的username, password)
    let username = req.body.username;
    let password = req.body.password;       //req.body{ "username": "james", "password": "123123" }

    // Create User (使用我們自己在User.js中定義的User格式，來創造一個新的User物件)
    let newUser = new User({
        username: username,
        password: password
    })

    // 使用我們自己在User.js中定義的createUser方法
    User.createUser(newUser, (err, user) => {
        if (err) throw err;
    })

    res.redirect('/api/login/signin');
})

// GET登入後的profile頁面
// 這邊使用ensureAuthenticated來看使用者是不是已登入過，如果沒有就不可以來這一頁
router.get('/profile', ensureAuthenticated, (req, res, next) => {
    console.log(req.user);
    res.render('profile', {
        user: req.user.username
    })
})

// GET登出
router.get('/logout', (req, res, next) => {
    req.logout();
    req.flash('success_mas', 'You are logged out');
    res.redirect('/users/signin');
})

module.exports = router;

// 跟Passport相關的一些函數
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();      //繼續執行下一行程式(或後續的callback)
    } else {
        req.flash('error_msg', 'You are now logged in');
        res.redirect('/users/signin');
    }
}

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({ username: username }, (err, user) => {

            if (err) { return done(err) };

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            User.comparePassword(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            })
        })
    }
))

passport.serializeUser((user, done) => {
    done(null, user.id);
})

// REVISED with validation feature. Post Sign Up
router.post('/signup', function (req, res, next) {
    // Parse Info
    var username = req.body.username
    var password = req.body.password
    // Validation
    req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()
    var errors = req.validationErrors();
    if (errors) {
        res.render('signup', { errors: errors })
    } else {
        //Create User
    }
    router.get('/logout', function (req, res, next) {
        req.flash('success_msg', 'You are logged out')
    })
});