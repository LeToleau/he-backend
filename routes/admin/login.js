var express = require('express');
var router = express.Router();
var userModel = require('./../../models/userModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/login', { 
    layout: 'admin/layout' 
  });
});

router.post('/', async (req, res, next) => {
    try {
        var user = req.body.user;
        var password = req.body.password;

        var data = await userModel.getUser(user, password)

        if (data != undefined) {
            req.session.user_id = data.id;
            req.session.username = data.username;
            req.session.isLogged = true

            res.redirect('/')
        } else {
            req.session.isLogged = false
            res.render('admin/login', {
                layout: 'admin/layout',
                error: true
            })
        }
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;