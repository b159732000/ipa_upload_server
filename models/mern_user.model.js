// 創造隨處可用的 - 建立mongoDB項目 的模板 (用來驗證使用者提交的req)
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {   //第一個欄位及設定的參數
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3
        },
        password: {
            type: String,
            required: true,
        },
        projects: [{        // 還不確定array是不是這樣定義，但反正查詢時是可以用的
            type: String
        }]
    },
    {   //第二個欄位及設定的參數
        timestamps: true,
    }
);

const User = mongoose.model('MERN_User', userSchema);    // 前面的User只是用來export的變數名，後面的User才是真正要被使用的module name

module.exports = User;