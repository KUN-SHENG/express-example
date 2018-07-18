var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', async function(req, res) {
  let users = await models.User.findAll({
    include: [models.Task]
  });

  res.render('index', {
    title: 'Sequelize: Express Example',
    users: users
  });

});
router.get('/api/users/:user_name/tasks', async function (req, res) {
  let username = req.params.user_name;
  let user = await models.User.findOne({
    where: {username}
  });

  let UserId = user.id;
  let tasks = await models.Task.findAll({
    where: {UserId}
  });

  res.json({tasks});

});


router.post('/api/users/:user_name/tasks/create', async function (req, res) {
  let username = req.params.user_name;
  let user = await models.User.findOne({
    where: {username}
  });

  let title = req.body.title;
  let task = await models.Task.create({
    title,
    UserId: user.id
  })

  res.json({task});
});

router.put('/api/task/:id', async function (req, res) {
  let id = req.params.id;
  let completed = req.body.completed;

  let task = await models.Task.findOne({
    where: {id}
  });

  task.completed = completed;
  task = await task.save();

  res.json({task});
});

router.delete('/api/task/:id', async function (req, res) {
  // 接收從 url 傳入的參數
  let id = req.params.id;

  // 查出 id 對應的 task 
  let task = await models.Task.findOne({
    where: {id}
  });

  // 進行刪除
  task = await task.destroy();

  // 回傳刪除成功的資料內容
  res.json({task});
});

module.exports = router;
