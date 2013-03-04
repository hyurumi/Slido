var Slido = (function(window, _, io){

  'use strict';

  var slidesData = [
  {
    template: 'title',
    header: 'New Slide',
    body: 'Genki Furumi'
  },
  {
    template: 'standard',
    header: 'Slide 1',
    body: 'Wow, this presentation software is so cool!!'
  },
  {
    template: 'standard',
    header: 'Slide 2',
    body: 'Wow, this presentation software is efficient!!'
  }
  ],
  maxOfsubSlideLength = 1,
  currentSlide=0,
  dom = {},
  config = {
    SOCKET_PORT : 8889
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
    
    for( var v = 0, len1 = slidesData.length; v < len1; v++ ) {
      var newSlidesPack = document.createElement('div');
      newSlidesPack.classList.add('slides-pack');
      dom.slides.appendChild(newSlidesPack);
      var slide = slidesData[v];

      var newSlideCompiled = _.template(
        document.getElementById('slide-' + slide.template + '-template').innerHTML, 
        {
          header: slide.header,
          body: slide.body
        });

      var newSlide = document.createElement('div');

      newSlide.classList.add('slide-wrapper');
      newSlide.innerHTML = newSlideCompiled;
      newSlide.querySelector('.slide').setAttribute('data-slide-index', v);
      newSlide.querySelector('.slide').setAttribute('data-slide-subindex', 0);
      
      newSlide.querySelector('.slide').classList.add('slide-' + slide.template);

      newSlidesPack.appendChild(newSlide);
    }

   
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

    // if edit mode, control the slide side depending on the window size
    if (dom.body.classList.contains('edit')) {
      window.scrollTo(0,0);
      var slideIndex = dom.body.getAttribute('data-slide-index'),
      slideSubIndex = dom.body.getAttribute('data-slide-subindex');
      var transform = 'scale(1.0, 1.0) translate( -' + slideIndex * window.innerWidth + 'px, -' + slideSubIndex * window.innerHeight +'px)';

      dom.slides.style.WebkitTransform = transform;
      dom.slides.style.MozTransform = transform;
      dom.slides.style.msTransform = transform;
      dom.slides.style.OTransform = transform;
      dom.slides.style.transform = transform;
    }

  }

  /*
   * Binds all event listeners.
   */
  function addEventListeners(){
    window.addEventListener( 'resize', onWindowResize, false );
    //document.addEventListener('click', onDocumentType, false);
    document.addEventListener('click', onDocumentClick, false);

  };


  // --------------------------------------------------------------------//
  // ----------------------------- EVENTS -------------------------------//
  // --------------------------------------------------------------------//

  /*
   * when slide is clicked, edit mode will be dispatched;
   */
   function onDocumentClick(){
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

  /*
   *  hash changed event
   */
  function onWindowResize(){
    layout();
  }


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