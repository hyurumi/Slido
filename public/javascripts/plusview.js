var Slido = (function(window, _, io){

  'use strict';
  var maxOfsubSlideLength = 1,
  currentSlide=0,
  dom = {},
  config = {
    SOCKET_PORT : 9090
  },
  isEventByPresenter = false,
  socket = io.connect('http://' + window.location.hostname + ':' + config.SOCKET_PORT + '/presentation');

  function initialize(){
    setupSlidesDOM();
    addEventListeners();
    var routes = {
      '/:index': setSlides,
      '/:index/:subSlideTitle': setSlides,
    };

    var router = Router(routes);
    router.setRoute('/0');
    router.init();
  };

  /**
   * Finds and stores references to DOM elements which are
   * required by the presentation. If a required element is
   * not found, it is created.
   */
  function setupSlidesDOM() {
    dom.body = document.getElementsByTagName('body')[0];
    dom.wrapper = document.getElementById('wrapper');
    dom.slides = document.getElementById('slides');
    dom.header = document.getElementById('header');
    setupLinksInHeader();
    layout();
  };

  function setupLinksInHeader() {
    var slideLinks = dom.header.querySelectorAll('.slide-links');
    _.each(slideLinks, function(links, i){
      _.each(links.children, function(link){
        link.href = '#/' + i + "/" + urlEncode(link.innerHTML);
      });
    });
  };


  // TODO: Prepare question stack slide
  function addSlide(slideType, slideIndex){
      dom.slides.removeChild(dom.slides.lastChild);
      slideIndex = slideIndex || dom.slides.children.length;

      // Add new slides pack
      var newSlidesPack = document.createElement('div');
      newSlidesPack.classList.add('slides-pack');

      dom.slides.appendChild(newSlidesPack);
      var newSlideCompiled = _.template(
        document.getElementById('slide-standard-template').innerHTML,
        {
          header: 'New Slide',
          body: 'body of new slide'
        });
      var newSlide = document.createElement('div');
      newSlide.classList.add('slide-wrapper');
      newSlide.innerHTML = newSlideCompiled;
      newSlide.querySelector('.slide').setAttribute('data-slide-index', slideIndex);
      newSlide.querySelector('.slide').setAttribute('data-slide-subindex', 0);
      newSlide.querySelector('.slide').classList.add('slide-standard');

      newSlidesPack.appendChild(newSlide);

      layout();
      addEventListeners();
  };


  /*
   * sizes of elements will be changed and fitted 
   */
  function layout() {
    var slides = document.querySelectorAll('.slide-wrapper');
    toArray(slides).forEach(function(slideWrapper){

      slideWrapper.style.paddingLeft = window.innerWidth * 0.05- 2 + 'px';
      slideWrapper.style.paddingRight = window.innerWidth * 0.05 - 2 + 'px';

      slideWrapper.style.paddingTop = window.innerHeight * 0.05 - 2 + 'px';
      slideWrapper.style.paddingBottom = window.innerHeight * 0.05 -2 + 'px';

      var slide = slideWrapper.querySelector('.slide')

      slide.style.width = window.innerWidth * 0.9 + 'px';
      slide.style.height = window.innerHeight * 0.9 + 'px';

    });
    dom.slides.style.width = window.innerWidth * (dom.slides.children.length + 1) + 'px';
    dom.slides.style.height = window.innerHeight * (maxOfsubSlideLength + 1) + 'px';
    

    window.scrollTo(0,0);
    var currentSlide = (window.location.hash).split('/')[1];
    var transform = 'scale(1.0, 1.0) translate( -' + currentSlide * window.innerWidth + 'px, 0px)';

    dom.slides.style.WebkitTransform = transform;
    dom.slides.style.MozTransform = transform;
    dom.slides.style.msTransform = transform;
    dom.slides.style.OTransform = transform;
    dom.slides.style.transform = transform;
    
    dom.slides.style.display = 'block';

  }

  function setSlides (index, subSlideTitle){
    var subIndex = calculateSubIndexFromTitle(index, subSlideTitle); 
    var transform = 'scale(1.0, 1.0) translate( -' + index * window.innerWidth + 'px, -' + subIndex * window.innerHeight + 'px)';
    var transitionDuration = (isEventByPresenter)? '0.8s' : '0s';
    isEventByPresenter = false;
    dom.slides.style.WebkitTransitionDuration = transitionDuration;
    dom.slides.style.MozTransitionDuration    = transitionDuration;
    dom.slides.style.msTransitionDuration     = transitionDuration;
    dom.slides.style.transitionDuration       = transitionDuration;

    dom.slides.style.WebkitTransform = transform;
    dom.slides.style.MozTransform = transform;
    dom.slides.style.msTransform = transform;
    dom.slides.style.transform = transform;

    var slideLinks = dom.header.querySelectorAll('.slide-links');
    _.each(_.toArray(slideLinks), function(link,i){
      if (index === i.toString())
        link.classList.remove('hidden');
      else
        link.classList.add('hidden');
    });
  }

  function calculateSubIndexFromTitle(index, subSlideTitle) {
    var subIndex = 0;
    var slides = dom.slides.querySelectorAll('.slides-pack').item(index);
    _.each(slides.children, function(slide, i){
      if (urlEncode(slide.querySelector('.header>.element').innerHTML.trim()) === subSlideTitle) {
        subIndex = i;
      };
    });
    return subIndex;
  }


  /*
   * Binds all event listeners.
   */
  function addEventListeners(){
    window.addEventListener( 'resize', onWindowResize, false );
    //document.addEventListener('click', onDocumentClick, false);

  };


  // --------------------------------------------------------------------//
  // ----------------------------- EVENTS -------------------------------//
  // --------------------------------------------------------------------//


  /*
   *  hash changed event
   */
  function onWindowResize(){
    layout();
  }

  // --------------------------------------------------------------------//
  // ----------------------- SOCKET EVENTS ------------------------------//
  // --------------------------------------------------------------------//
  socket.on('connect', function(){
    console.log('open');
    socket.emit('querySlide');
  });

  socket.on('nextSlide', function(dataObject){
    isEventByPresenter = true;
    window.location.hash = '/' + dataObject.currentSlide;
  });



  // --------------------------------------------------------------------//
  // ---------------------------- LIBRARIES -----------------------------//
  // --------------------------------------------------------------------//

  /**
   * Converts the target object to an array.
   */
  function toArray( o ) {
    return Array.prototype.slice.call( o );
  }

  function urlEncode (string) {
    return encodeURIComponent(string.trim()).replace(/%/g, '-');
  }
  function urlDecode (string) {
    return decodeURIComponent(string.replace(/-/g, '%'));
  }
  // --------------------------------------------------------------------//
  // ----------------------------- APIS -------------------------------//
  // --------------------------------------------------------------------//

  return {
    initialize : initialize
  };

})(window, _, io);