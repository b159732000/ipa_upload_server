const express = require('express');
const router = express.Router();
const multer = require('multer');
const mime = require('mime-types');     // 為了取得上傳的檔案的檔案格式

// let upload = multer({
//     dest: 'public/',
//     // limits: {fileSize: 1000000, files: 1}       // 大小上限1MB, 一個檔案
// })

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: function (req, file, cb) {
        // console.log(file.originalname);
        console.log(file);
        // cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype))

        // 決定本檔案存在伺服器中的檔名
        // 當接收到ipa，ipa的檔名使用客戶端定義的檔名 (已經包含時間的)
        // 其他檔案則用檔案夾代的檔名加上日期
        console.log(file.originalname.indexOf('ipa'));
        if(file.originalname.indexOf('ipa') !== -1) {
            // 用客戶端傳過來的檔名
            cb(null, file.originalname)
        } else {
            // 用檔案夾代的檔名加上日期
            cb(null, Date.now() + file.originalname)
        }

    }
})
let upload = multer({ storage: storage });

// let upload = multer({ dest: 'public/' });

// 將收到的上傳的檔案放到指定位置，並且在使用者的資料庫內加上本檔案和專案的資訊
router.post('/',
    upload.fields([
        { name: 'mainfile', maxCount: 1 },      // 主程式檔
        { name: 'iconfile', maxCount: 1 },      // 縮圖
        { name: 'plistfile', maxCount: 1 }      // plist
    ]),
    (req, res, next) => {
        try {
            // res.json(req.files);
            res.send(req.files);
        } catch (err) {
            console.log(err);
            res.send(400);
        }
    }
)

module.exports = router;