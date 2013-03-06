var Slido = (function(window, _, io){

  'use strict';
  var maxOfsubSlideLength = 1,
  currentSlide=0,
  dom = {},
  config = {
    SOCKET_PORT : 9090
  },
  socket = io.connect('http://' + window.location.hostname + ':' + config.SOCKET_PORT + '/presentation');

  function initialize(){
    setupSlidesDOM();
    addEventListeners();
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
   
    layout();
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
    var transform = 'scale(1.0, 1.0) translate( -' + currentSlide * window.innerWidth + 'px, 0px)';

    dom.slides.style.WebkitTransform = transform;
    dom.slides.style.MozTransform = transform;
    dom.slides.style.msTransform = transform;
    dom.slides.style.OTransform = transform;
    dom.slides.style.transform = transform;
    
    dom.slides.style.display = 'block';
  }

  /*
   * Binds all event listeners.
   */
  function addEventListeners(){
    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener('keyup', onDocumentType, false);
    document.addEventListener('click', onDocumentClick, false);

  };


  // --------------------------------------------------------------------//
  // ----------------------------- EVENTS -------------------------------//
  // --------------------------------------------------------------------//

  /*
   * when slide is clicked, slidesMove;
   */
   function onDocumentType(e){
    switch(e.keyCode) {
      case 13:  // Enter
      case 32:  // Space
      case 39: {// Right
        nextSlide();
        break;
      }
      case 37: {//left
        previousSlide();
        break;
      }
      default:{
        console.log(e.keyCode)
      }
    }
   }

   function onDocumentClick(){
    nextSlide();
   }

   function nextSlide(){
     socket.emit('nextSlide',{currentSlide: currentSlide});
     if (currentSlide < dom.slides.children.length - 1){
       currentSlide++;
     } else {
       currentSlide = 0;
     }
     var transform = 'scale(1.0, 1.0) translate( -' + currentSlide * window.innerWidth + 'px, 0px)';
     var transitionDuration = '0.8s';
     dom.slides.style.WebkitTransitionDuration = transitionDuration;
     dom.slides.style.MozTransitionDuration    = transitionDuration;
     dom.slides.style.msTransitionDuration     = transitionDuration;
     dom.slides.style.transitionDuration       = transitionDuration;

     dom.slides.style.WebkitTransform = transform;
     dom.slides.style.MozTransform = transform;
     dom.slides.style.msTransform = transform;
     dom.slides.style.transform = transform;

   }
   function previousSlide(){
     if (currentSlide != 0){
       currentSlide--;
     } else {
       currentSlide = dom.slides.children.length - 1;
     }
     var transform = 'scale(1.0, 1.0) translate( -' + currentSlide * window.innerWidth + 'px, 0px)';
     var transitionDuration = '0.8s';
     dom.slides.style.WebkitTransitionDuration = transitionDuration;
     dom.slides.style.MozTransitionDuration    = transitionDuration;
     dom.slides.style.msTransitionDuration     = transitionDuration;
     dom.slides.style.transitionDuration       = transitionDuration;

     dom.slides.style.WebkitTransform = transform;
     dom.slides.style.MozTransform = transform;
     dom.slides.style.msTransform = transform;
     dom.slides.style.transform = transform;

   }

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
  // --------------------------------------------------------------------//
  // ----------------------------- APIS -------------------------------//
  // --------------------------------------------------------------------//

  return {
    initialize : initialize
  };

})(window, _, io);