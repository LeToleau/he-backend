var express = require('express');
var router = express.Router();

/* GET logout page. */
router.get('/', function(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      res.redirect('/admin/login'); // Redirige a la página de inicio de sesión después de cerrar sesión
    }
  });
});

module.exports = router;