var redis = require('redis')
, _     = require('underscore');

var dist = function(app, redisClient){
  app.get('/dist', function(req, res){
    redisClient.get('slides', function(err, data){
      var rawSlidesList = _.filter(JSON.parse(data), function(slide){ 
        return slide.subIndex === '0'
      });
      var formattedSlidesList = _.map(rawSlidesList, function(slide){
        return {
          header: slide.header,
          body: slide.body,
          index: slide.index,
          slideStandard: slide.template ==='standard',                   
          slideTitle: slide.template ==='title'            
        };
      });
      console.log(formattedSlidesList);
      res.render('dist', {slides: formattedSlidesList});
    });   
  });
};


module.exports = dist;