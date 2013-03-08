var redis = require('redis')
, _     = require('underscore');

var plusview = function(app, redisClient){
    app.get('/plusview', function(req, res){
    var acceptLanguage = req.headers['accept-language'];
    console.log(acceptLanguage)
    redisClient.get('slides', function(err, data){
 
      var formattedSlidesList = _.map(JSON.parse(data), function(slide){
        return {
          header: slide.header,
          body: slide.body,
          index: slide.index,
          subIndex: slide.subIndex,

          tagJapanese: _.contains(slide.tags, 'japanese'),
          tagEnglish: _.contains(slide.tags, 'english'),
          tagFrench: _.contains(slide.tags, 'french'),
          tagNovice: _.contains(slide.tags, 'novice'),
          tagExpert: _.contains(slide.tags, 'expert'),

          slideStandard: slide.template ==='standard',                   
          slideTitle: slide.template ==='title'            
        };
      });

      if (!acceptLanguage.match(/ja/) {
        formattedSlidesList = _.filter(formattedSlidesList, function(slide){
        return !slide.tagJapanese;
       });
      }

      if (!acceptLanguage.match(/en/)) {
        formattedSlidesList = _.filter(formattedSlidesList, function(slide){
        return !slide.tagEnglish;
       });
      }

      if (acceptLanguage.match(/fr/)) {
        formattedSlidesList = _.filter(formattedSlidesList, function(slide){
        return !slide.tagFrench;
       });
      }

      console.log(formattedSlidesList);
      var groupedSlidesList = _.map(_.values(_.groupBy(formattedSlidesList, function(slide){
        return slide.index;
      })), function(slides){
        return {'slides': slides}
      });

      res.render('plusview', {slidesGroup: groupedSlidesList});
    });   
  });
};


module.exports = plusview;