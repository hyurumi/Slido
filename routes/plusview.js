
/*
 * Preview page.
 */

var preview = function(app, redisClient){
    app.get('/preview', function(req, res){
      res.render('dist', { title: 'Express' });
  });
};

module.exports = preview;