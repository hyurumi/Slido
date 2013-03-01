
/*
 * GET home page.
 */

exports.dist = function(req, res){
  res.render('dist', { title: 'Express' });
};