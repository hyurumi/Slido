var redis = require('redis');
/*
 * GET home page.
 */

 var index = function(app, redisClient){
   app.get('/', function(req, res) {
     res.render('index', { title: 'Express' });
   });

   app.post('/', function(req, res) {
     redisClient.set('slides', JSON.stringify(req.body), redis.print);   
     res.json({status: 'ok'});
   })
};
module.exports = index;