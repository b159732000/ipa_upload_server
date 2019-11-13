const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 創建Schema (綱要)
const ItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// 使用綱要，做出一個mongoose.model，名叫item
const Item = mongoose.model('item', ItemSchema);

module.exports = Item;