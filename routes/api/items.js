const express = require('express');
const router = express.Router();

// Item Model
const Item = require('../../models/Item.js');

// @route  GET api/items
// @desc   取得全部items
// @access Public
// 底下用'/'，即以此文件為根目錄，而非指到整個程式的入口start.js或server.js
router.get('/', (req, res) => {
    Item.find()                              //運用自己定義的item.find方法，用mongoose去資料庫檢索所有資料
        .sort({ date: -1 })                  //針對檢索到的資料按照日期排序，排序方向可以為 1 or -1
        .then(items => { res.json(items) })  //因為檢索到的資料是json格式，所以放到res中，要用json方法
});

// @route  POST api/items
// @desc   建立一個Item
// @access Public
router.post('/', (req, res) => {
    const newItem = new Item({
        name: req.body.name                         //因為有中間件bodyParser, 所以可以在此直接讀body的值
    });

    newItem.save().then(item => res.json(item));    //將此物件通過自定義的item.save方法，用mongoose存資料到資料庫中
});

// @route  DELETE api/items/:id
// @desc   移除一個Item
// @access Public
router.delete('/:id', (req, res) => {
    Item.findById(req.params.id)                                                //用url裡的id在資料庫中找到物件
        .then(item => item.remove().then(() => res.json({ success: true })))    //移除此物件，then回傳成功的消息
        .catch(err => res.status(404).json({ success: false }));                //回傳404及失敗的消息
});

module.exports = router;