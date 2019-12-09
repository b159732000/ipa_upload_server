import express from 'express';
import bodyParser from 'body-parser';                       // 讀取req的body
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;
const logger = require('morgan');                           // 開發時顯示更詳細的console.log
const expressSession = require('express-session');          // 用來create session
// const MongoStore = require('connect-mongo')(session);    // 直接直營並將session存入, logout後會自動刪除該document
const flash = require('connect-flash');                     // 用來顯示錯誤或成功訊息
const expressValidator = require('express-validator');      // 用來驗證使用者的input
const cors = require('cors');   
// const fileupload = require('express-fileupload');
const user = require('./routes/user');                      // 跨域
require('dotenv').config();                                 // 為了使用自訂的process.env.??? (在.env檔中定義)
let Projects = require('./models/projects.model.js');

// const login = require('./routes/api/login.js');     // Route用的，所有指向/api/login的請求，都轉由此login.js來處理
// const items = require('./routes/api/items.js');     // Route用的，所有指向/api/items的請求，都轉由此items.js來處理


// console.log('測試');

// 載入express
const app = express();

// middleware
app.use(logger('dev'));         // 開發時顯示更詳細的console.log
app.use(express.json());
// app.use(bodyParser.json());                                    // 在新版的express中好像可以省略
// app.use(bodyParser.urlencoded({ extended: true }));            // 在新版的express中好像可以省略
app.use(cookieParser());
app.use('/ipa_upload_server/public', express.static('public'));   // 靜態文件
app.use(cors());                // 跨域
// app.use(fileupload());       // 啟用此行會擋掉multer的功能

// 連接資料庫 MongoDB
// 設定mongoose連結資訊
const mongoDBUri = process.env.ATLAS_URI;   // 此行亦可寫成 => const mongoDBUri = require('./config/keys.js').mongoURI; 
mongoose.connect(mongoDBUri, { useNewUrlParser: true, useCreateIndex: true })       // useNewUrlParser: true 是為了避免mongo version >= 3.1.0時會出現就版UrlParser將會移除的警告提示
    .then(() => { console.log('MongoDB 連接成功') })        // 此then可換句話說，如下面約十行處
    .catch((err) => console.log(err));
// 讓mongoose.Promise用global.Promise
mongoose.Promise = global.Promise;
// 取得預設連結
var connection = mongoose.connection;
// 將連結綁定至報錯系統 (這樣才能取得出錯提示)
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
// connection.once('open', ()=>{console.log('MongoDB 連接成功')});    // 此行為前面約十行處 mongoose.connect.then('連接成功')的換句話說

// Passport啟用區域
// 引入express-session
// app.use(expressSession({
//     secret: 'this is secret',   //加密簽名
//     resave: true,              //不論request的過程有無變更，都強制儲存session store
//     saveUninitialized: true    //將新的或未變更過的儲存在session store中
// }));
// 啟用passport
// app.use(passport.initialize());
// app.use(passport.session());

// 初始化passport
// const initPassport = require('./passport/init.js');
// initPassport(passport);

// Use Routes
// app.use('/api/items', items);
// app.use('/api/login', login);

// // 顯示錯誤訊息
// app.use(flash());
// // setup local variables so we can use it anywhere in our app
// app.use(function (req, res, next) {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.error = req.flash('error');
//     res.locals.user = req.user || null;
//     next();
// });

// Medium教學 (JWT password.js 前後端分離)
require('./passport.js');                      // 擴充passport.js(from npm)的功能，添加自訂的方法=>查找資料庫有無username/password，是為了在auth中使用
const auth = require('./routes/auth.js');      // 實際處理登入驗證的邏輯(route)
const upload = require('./routes/upload.js');
const projects = require('./routes/projects.js');
app.use('/ipa_upload_server/auth', auth);
app.use('/ipa_upload_server/user', passport.authenticate('jwt', {session:false}), user);
// app.use('/upload', upload);     // 可正常上傳檔案
app.use('/ipa_upload_server/upload', passport.authenticate('jwt', {session:false}), upload);     // 可正常上傳檔案

// 用專案object id(單個)查詢專案下載頁面的資訊  (不放projects route內是因為這個動作不需要使用者驗證)
// @route  POST projects/findByObjectIDResDownloadInfo
// @params { queryId: 'id1' }
// @res    json { projectname, version, filesize, updatetime, appfilename, appfileiconname }
// @access Public (此行目前先忽略)
app.post('/ipa_upload_server/projects/findByObjectIDResDownloadInfo', (req, res, next) => {
    if(req.body.queryId) {
        let queryId = req.body.queryId;

        // find(查詢條件, 控制返回的欄位, 控制選項, callback)
        // findById(查詢id, 控制返回的欄位, 控制選項, callback)
        Projects.findById(
            queryId,
            {projectname: 1, versions: 1},
            {},
            (err, docs) => {
                res.send(docs);
            }
        )
    }
})

app.use('/ipa_upload_server/projects', passport.authenticate('jwt', {session:false}), projects);
// app.bind('/projects', passport.authenticate('jwt', {session:false}), projects);

// MERN Youtube教學
// 引入並使用自訂的Model (以供刪除、編輯、增加...等動作)
// const mern_exercisesRouter = require('./routes/mern_exercises');
// app.use('/mern_exercises', mern_exercisesRouter);
const mern_usersRouter = require('./routes/mern_users');
app.use('/ipa_upload_server/mern_users', mern_usersRouter);       // 內有添加user的方法

// 啟動伺服器監聽
const port = process.env.PORT || 5000;
var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    // 下面兩行的寫法都OK
    console.log(`Server is running on port: ${port}`);
})