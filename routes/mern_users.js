// 定義router遇到GET/POST請求時，讀取/增加資料庫的User項目的動作 (此檔案名稱即為資料庫中資料表名)
const router = require('express').Router();
let User = require('../models/mern_user.model.js');

router.route('/').get((req, res) => {
    User.find()                                                 // find是mongoose.model的內建方法，可以搜尋mondoDB中符合User格式的物件
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/add').post((req, res) => {
    const username = req.body.username;                         // 取得req的body的username
    const password = req.body.password;

    const newUser = new User({ username: username, password: password });                     // 使用取得的username創造一個新的User(用我們定義的User模板)

    newUser.save()                                              // save是mongoose.model的內建方法，可以將物件存入mondoDB中
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;