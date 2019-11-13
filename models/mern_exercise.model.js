// 創造隨處可用的 - 建立mongoDB項目 的模板
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const exerciseSchema = new Schema(
    {   //第一個欄位及設定的參數
        username: { type: String, required: true },
        description: { type: String, required: true },
        duration: { type: Number, required: true },
        date: { type: Date, required: true },
    },
    {   //第二個欄位及設定的參數
        timestamps: true,
    }
);

const Exercise = mongoose.model('MERN_Exercise', exerciseSchema);    // 前面的User只是用來export的變數名，後面的User才是真正要被使用的module name

module.exports = Exercise;