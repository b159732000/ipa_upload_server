// 擴充passport方法(加入此中間件)，找資料庫是否有username/password
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const MERN_User = require('./models/mern_user.model.js');

// 建立初次登入時的passport查找策略中間件
passport.use(
    new LocalStrategy(
        { usernameField: 'username', passwordField: 'password', passReqToCallback: true },         // 自訂LocalStrategy的帳號密碼欄位名, 以及將req傳給後面的callback
        (req, username, password, done) => {                        // 使用帳號密碼查找資料庫 (在此使用自訂的MERN_User模型，因為我們有對該模型定義為mongoose.model，所以會有findone的方法)
            console.log('執行初次登入時的passport查找策略中間件驗證成功，正在執行此驗證策略中間件所含callback');
            return MERN_User.findOne({ username, password })
                .then(user => {                                         // 如果查找成功
                    // 如果沒有user
                    if (!user) {
                        return done(null, false, { message: 'username或password為空或錯誤' });
                    }
                    // 如果username/password都正確，則回傳callback(err, 查到的username, res.body)
                    return done(null, user, { message: 'Logged In Successfully!' });
                })
                .catch(err => done(err));                           // 如果查找失敗
        }
    )
)

// 建立passport驗證策略中間件
passport.use(
    new JWTStrategy(
        { jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), secretOrKey: process.env.ATLAS_TOKENSECRET },    //解密Token所需的參數，會將Token解出來的東西傳到後面的callback，如果驗證成功才會執行接下來的callback
        (jwtPayload, callback) => {
            console.log('執行passport驗證策略中間件驗證成功，正在執行此驗證策略中間件所含callback', jwtPayload);
            // 如果要進資料庫查user的話，可以在此寫函數，但我們為了節省效能，已經把username寫在Token裡了，所以在本專案裡不需要進資料庫查

            // 回傳用Token內涵的userid找到資料庫中的使用者資訊
            return MERN_User.findOne(jwtPayload.user)
                .then(user => { return callback(null, user) })    // 第一個參數是err，在此不傳
                .catch(err => { return callback(err) })
        }
    )
)