import mongoose from 'mongoose';
import { resolve } from 'url';
const router = require('express').Router();
const path = require('path');
let Projects = require('../models/projects.model.js');
let Mern_user = require('../models/mern_user.model.js');

// 添加新專案
// @route  POST projects/addNewProject
// @desc-detail 將資訊加入versions中，將此專案的objectid加入使用者的專案列表中
// @params req.body.{version: '', title: '', description: '', filesize: number, appfilename: '',appiconfilename: ''}
// @access Public (此行目前先忽略)
router.post('/addNewProject', (req, res, next) => {
    const projectname = req.body.projectname;       // 專案名
    const versions = [{
        version: req.body.version,                  // 版本號碼
        title: req.body.title,                      // 更新名 (在前端預設為'初始化')
        description: req.body.description,          // 更新日誌
        filesize: req.body.filesize,                // app檔案大小
        appfilename: req.body.appfilename,          // app檔案本體名
        appiconfilename: req.body.appiconfilename,  // app縮圖檔案名
        plistname: req.body.plistname               // plist名
    }];

    const newProject = new Projects({
        projectname: projectname,
        versions: versions
    });

    newProject.save()
        .then((result) => {     // 傳遞這次新增到mongoDB的物件內容

            // 更新使用者資訊 (中的所有專案清單)
            // Model.update(conditions, doc, [options], [callback])
            let tempNewProjectsArray = req.user.projects;
            tempNewProjectsArray.push(result._id);
            // console.log('新的project陣列 ---> ' + tempNewProjectsArray);
            // console.log(JSON.stringify(tempNewProjectsArray));
            // console.log('此次POST的使用者名稱 ---> ', req.user._id);
            Mern_user.update(
                { _id: req.user._id },                // 查詢條件
                // {username: 'JamesNeasdfw'},
                { projects: tempNewProjectsArray },   // 需要修改的資料
                { multi: false },                     // 控制選項
                (err, docs) => {                      // callback，返回的是受影響的行數
                    // if(err)console.log(err);
                    // console.log('更改成功: ', docs)
                }
            )

            console.log(result._id);
            // console.log('此次更新的使用者 ---> ', req.user);
            res.json('Project added!');
        })
        .catch(err => res.status(400).json('Error: ' + err));
    // res.json('success');
})

// 更新舊專案 (暫時還沒有做功能)
// @route  POST projects/update
// @desc-detail 更新專案
// @params req.body.{_id: '', version: '', title: '', description: '', filesize: number, appfilename: '', appiconfilename: '', plistname: ''}
// @access Public (此行目前先忽略)
router.post('/update', (req, res, next) => {
    const projectname = req.body.projectname;
    const projectId = req.body._id;                 // 專案object id
    const versions = {
        // _id: req.body._id,                          // 專案object id
        version: req.body.version,                  // 版本號碼
        title: req.body.title,                      // 更新名 (在前端預設為'初始化')
        description: req.body.description,          // 更新日誌
        filesize: req.body.filesize,                // app檔案大小
        appfilename: req.body.appfilename,          // app檔案本體名
        appiconfilename: req.body.appiconfilename,  // app縮圖檔案名
        plistname: req.body.plistname               // plist名
    };

    // 透過id查詢專案，並進行修改
    Projects.findByIdAndUpdate(
        projectId,        // 查詢條件
        { $push: { versions: versions } },                         // 需修改的資料
        {},                         // 控制選項
        (err, docs) => {                       // callback
            // if(err) console.log(err);
            // console.log('更改成功: ', docs);
            res.send(docs);
        }
    )

    // const newProject;

    // newProject.save()
    //     .then(() => res.json('Project added!'))
    //     .catch(err => res.status(400).json('Error: ' + err));
})

// 用專案object id(陣列)查詢所有專案細節
// @route  POST projects/findByObjectID
// @params { _idArray: ['id1', 'id2', ...] }
// @access Public (此行目前先忽略)
router.post('/findByObjectID', (req, res, next) => {
    let searchIdArray = req.body._idArray;
    let resultArray = [];
    let i = 1;

    // 針對陣列中的每一個project id，都去查詢該id的詳細資料，然後放到result array中
    searchIdArray.map(searchId => {
        Projects.findById(searchId, (err, doc) => {
            resultArray.push(doc);

            if (i >= searchIdArray.length) {
                res.send(resultArray);
            }
            i++;
        });
    });
});

// 用專案object id(單個)查詢專案下載頁面的資訊  (不放這裡改放server.js，是因為這個動作不需要使用者驗證)
// @route  POST projects/findByObjectIDResDownloadInfo
// @params { queryId: 'id1' }
// @res    json { projectname, version, filesize, updatetime, appfilename, appfileiconname }
// @access Public (此行目前先忽略)
// router.post('/findByObjectIDResDownloadInfo', (req, res, next) => {
//     if(req.body.queryId) {
//         let queryId = req.body.queryId;

//         // find(查詢條件, 控制返回的欄位, 控制選項, callback)
//         // findById(查詢id, 控制返回的欄位, 控制選項, callback)
//         Projects.findById(
//             queryId,
//             {projectname: 1, versions: 1},
//             {},
//             (err, docs) => {
//                 res.send(docs);
//             }
//         )
//     }
// })

// 
// 刪除使用者專案清單中的指定專案id (透過id)
// @route  POST projects/deleteProjectById
// @desc-detail 刪除使用者專案清單中的指定專案id
// @params req.body.{_id: ''}
// @access Public (此行目前先忽略)
router.post('/deleteProjectByIdInUserProfile', (req, res, next) => {
    // Projects.remove({_id: req.body._id}, (err, docs) => {
    // // Projects.remove({_id: "5dd3a22f9c283446686852af"}, (err, docs) => {
    // // Projects.remove({projectname: "123"}, (err, docs) => {
    //     console.log(req.body._id)
    //     if(err) console.log(err);
    //     console.log('刪除成功: ', docs);
    //     res.send('刪除成功');
    // })

    // 讀取使用者資訊內含的專案清單陣列
    let userProjectsArray = req.user.projects;
    // 將陣列中移除此次指定要刪除的專案id
    let idWillBeRemoveFromArray = req.body._id;
    console.log('從使用者專案清單刪除專案id: ', idWillBeRemoveFromArray);
    // 定位此id在數列的第幾項
    let index = userProjectsArray.indexOf(idWillBeRemoveFromArray);
    // 實際將此id從數列中移除，並產生一個更新後的陣列
    if (index > -1) {
        userProjectsArray.splice(index, 1);
        // let newUserProjectsArray = userProjectsArray.splice(index, 1);   //不能這樣寫，因為這樣這個變數會等於刪掉的那個元素
    }
    // 將更新後的陣列放回使用者資訊中
    Mern_user.update(
        { _id: req.user._id },                // 查詢條件
        // {username: 'JamesNeasdfw'},
        { projects: userProjectsArray },      // 需要修改的資料
        { multi: false },                     // 控制選項
        (err, docs) => {                      // callback，返回的是受影響的行數
            // if(err)console.log(err);
            // console.log('更改成功: ', docs)
        }
    )

    res.send(null);
})

// 刪除專案本體(從專案資料庫中) (透過id)
// @route  POST projects/deleteProjectById
// @desc-detail 刪除專案 (透過id)
// @params req.body.{_id: ''}
// @access Public (此行目前先忽略)
router.post('/deleteProjectById', (req, res, next) => {
    Projects.remove({ _id: req.body._id }, (err, docs) => {
        // Projects.remove({_id: "5dd3a22f9c283446686852af"}, (err, docs) => {
        // Projects.remove({projectname: "123"}, (err, docs) => {
        console.log(req.body._id)
        if (err) console.log(err);
        console.log('刪除成功: ', docs);
        res.send('刪除成功');
    })
})

// 讓使用者下載指定專案
router.post('/downloadProject', (req, res, next) => {

    // 如果要下載文件的話，單用這個就行了(用第三行，前兩行是備註)
    // res.download(path.join(__dirname, "/downloads/report.pdf"));
    // console.log(path.join(process.cwd(), "/public/1574307297231images.jpg"))
    res.download(path.join(process.cwd(), "/public/1574307297231images.jpg"));
})

module.exports = router;