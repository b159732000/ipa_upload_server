// 定義router遇到GET/POST請求時，讀取/增加資料庫的Exercise項目的動作 (此檔案名稱即為資料庫中資料表名)
const router = require('express').Router();
let Exercise = require('../models/mern_exercise.model.js');

router.route('/').get((req, res) => {
    Exercise.find()
        .then(exercises => res.json(exercises))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/add').post((req, res) => {
    const username = req.body.username;
    const description = req.body.description;
    const duration = Number(req.body.duration);
    const date = Date(req.body.date);

    const newExercise = new Exercise({
        username,
        description,
        duration,
        date
    });

    newExercise.save()
        .then(() => res.json('Exercise added!'))
        .catch(err => res.status(400).json('Error: ' + err));
})

// 以下的:id, 都是MongoDB自動產生的ObjectID
router.route('/:id').get((req, res) => {            // 網址長得像這樣 http://127.0.0.1:5000/mern_exercises/5dca289711f444e9網址長得像這樣 
    Exercise.findById(req.params.id)
        .then(exercise => res.json(exercise))       // 這裡的exercise即為findById找到的物件
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/:id').delete((req, res) => {
    Exercise.findByIdAndDelete(req.params.id)
        .then(() => res.json('Exercise deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/update/:id').post((req, res) => {
    Exercise.findById(req.params.id)
        .then(exercise => {
            exercise.username = req.body.username;
            exercise.description = req.body.description;
            exercise.duration = Number(req.body.duration);
            exercise.date = Date.parse(req.body.date);

            exercise.save()
                .then(() => res.json('Exercised updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;