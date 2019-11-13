import express from 'express';
const router = express.Router();
const auth = require('../controllers/AuthController.js');

// 使用專屬於此router的middleware
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();  
});

// 訪問首頁的使用者，轉到驗證登入頁面
router.get('/', function(req, res) {
    res.data = '成功';
});

// 導航到註冊頁面
router.get('/register', auth.register);

// POST 執行註冊的動作
router.post('/register', auth.doRegister);

// 導航到登入頁面
router.get('/login', auth.login);

// POST 執行登入的動作
router.post('/login', auth.doLogin);

// GET 執行登出動作
router.get('/logout', auth.logout);

// export default router;   // 不能這樣寫
module.exports = router;