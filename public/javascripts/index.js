var Slido = (function(window, _){

  'use strict';

  var slidesData = [
  [
  {
    template: 'title',
    header: 'New Slide',
    body: 'Genki Furumi'
  },
  {
    template: 'title',
    header: '新しいスライド',
    body: '古見元気'
  }
  ],
  [
  {
    template: 'standard',
    header: 'Slide 1',
    body: 'Wow, this presentation software is so cool!!'
  }
  ],
  [
  {
    template: 'standard',
    header: 'Slide 2',
    body: 'Wow, this presentation software is efficient!!'
  }
  ]
  ],
  maxOfsubSlideLength = 1,
  dom = {},
  config = {
    SOCKET_PORT : 8889
  };

  function initialize(){
    setupSlidesDOM();

    addEventListeners();
    var routes = {
      '/edit/:index/:subIndex': setEditPage,
      '/overview': setOverviewPage,
      '/publish': publish
    };

    var router = Router(routes);
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
    dom.tags = document.getElementById('tags');
    
    for( var v = 0, len1 = slidesData.length; v < len1; v++ ) {
      var newSlidesPack = document.createElement('div');
      newSlidesPack.classList.add('slides-pack');
      dom.slides.appendChild(newSlidesPack);
      for( var h = 0, len2 = slidesData[v].length; h < len2; h++) {
        var slide = slidesData[v][h];

        var newSlideCompiled = _.template(
          document.getElementById('slide-' + slide.template + '-template').innerHTML, 
          {
            header: slide.header,
            body: slide.body
          });

        var newSlide = document.createElement('div');

        newSlide.classList.add('slide-wrapper');
        newSlide.innerHTML = newSlideCompiled;
        //newSlide.setAttribute('id', 'slide-' + v + '-' + h);
        newSlide.querySelector('.slide').setAttribute('data-slide-index', v);
        newSlide.querySelector('.slide').setAttribute('data-slide-subindex', h);
      
        newSlide.querySelector('.slide').classList.add('slide-' + slide.template);
   
        newSlidesPack.appendChild(newSlide);
      }

      // Add slide placeholder
      var newSlideCompiled = _.template(document.getElementById('slide-placeholder-template').innerHTML, {});
      var newSlide = document.createElement('div');
      newSlide.classList.add('slide-wrapper');
      newSlide.innerHTML = newSlideCompiled;
      newSlide.querySelector('.slide').setAttribute('data-slide-index', v);
      newSlide.querySelector('.slide').setAttribute('data-slide-type', 'subSlide');
      newSlidesPack.appendChild(newSlide);
      maxOfsubSlideLength = (maxOfsubSlideLength < slidesData[v].length) ? slidesData[v].length : maxOfsubSlideLength;
    }

    // Add slide placeholder
    var newSlidesPack = document.createElement('div');
    newSlidesPack.classList.add('slides-pack');
    dom.slides.appendChild(newSlidesPack);

    var newSlideCompiled = _.template(document.getElementById('slide-placeholder-template').innerHTML, {});
   
    var newSlide = document.createElement('div');
    newSlide.classList.add('slide-wrapper');

    newSlide.innerHTML = newSlideCompiled;

    newSlide.querySelector('.slide').setAttribute('data-slide-type', 'mainSlide');
    newSlidesPack.appendChild(newSlide);
    
    layout();
  };

  function addSlide(slideType, slideIndex){
    if (slideType === 'mainSlide') {
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


       // Add slide placeholder
      var newSlideCompiled = _.template(document.getElementById('slide-placeholder-template').innerHTML, {});
      var newSlide = document.createElement('div');
      newSlide.classList.add('slide-wrapper');
      newSlide.innerHTML = newSlideCompiled;
      newSlide.querySelector('.slide').setAttribute('data-slide-index', slideIndex);
      newSlide.querySelector('.slide').setAttribute('data-slide-type', 'subSlide');
      newSlidesPack.appendChild(newSlide);


      // Add slide placeholder
      newSlidesPack = document.createElement('div');
      newSlidesPack.classList.add('slides-pack');
      dom.slides.appendChild(newSlidesPack);
      var newSlideCompiled = _.template(document.getElementById('slide-placeholder-template').innerHTML, {});
      var newSlide = document.createElement('div');
      newSlide.classList.add('slide-wrapper');
      newSlide.innerHTML = newSlideCompiled;
      newSlide.querySelector('.slide').setAttribute('data-slide-type', 'mainSlide');
      newSlidesPack.appendChild(newSlide);

      layout();
      addEventListeners();
    }else {

      var slidesPack = dom.slides.children[slideIndex];
      slidesPack.removeChild(slidesPack.lastChild);

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
      newSlide.querySelector('.slide').setAttribute('data-slide-subindex', slidesPack.children.length);
      newSlide.querySelector('.slide').classList.add('slide-standard');

      slidesPack.appendChild(newSlide);

      // Add slide placeholder
      var newSlideCompiled = _.template(document.getElementById('slide-placeholder-template').innerHTML, {});
      var newSlide = document.createElement('div');
      newSlide.classList.add('slide-wrapper');
      newSlide.innerHTML = newSlideCompiled;
      newSlide.querySelector('.slide').setAttribute('data-slide-index', slideIndex);
      newSlide.querySelector('.slide').setAttribute('data-slide-type', 'subSlide');
      slidesPack.appendChild(newSlide);

      layout();
      addEventListeners(); 
    }
  };

  function removeSlide(){

  }

  function setEditPage(slideIndex, slideSubIndex){
    if (dom.body.classList.contains('overview'))
      dom.body.classList.remove('overview');
    dom.body.classList.add('edit');
    dom.body.setAttribute('data-slide-index', slideIndex);
    dom.body.setAttribute('data-slide-subindex', slideSubIndex);

    window.scrollTo(0,0);
    var transform = 'scale(1.0, 1.0) translate( -' + slideIndex * window.innerWidth + 'px, -' + slideSubIndex * window.innerHeight +'px)';

    dom.slides.style.WebkitTransform = transform;
    dom.slides.style.MozTransform = transform;
    dom.slides.style.msTransform = transform;
    dom.slides.style.OTransform = transform;
    dom.slides.style.transform = transform;

    addEventListeners();  
  }

  function setOverviewPage(){
    if (dom.body.classList.contains('edit')) {
      dom.body.classList.remove('edit');
      dom.body.removeAttribute('data-slide-index');
      dom.body.removeAttribute('data-slide-subindex');
    }
    dom.body.classList.add('overview');
    var transform = 'scale(0.3,0.3) translate( -110%, -110%)';

    dom.slides.style.WebkitTransform = transform;
    dom.slides.style.MozTransform = transform;
    dom.slides.style.msTransform = transform;
    dom.slides.style.OTransform = transform;
    dom.slides.style.transform = transform;
    addEventListeners();  
  }

  function publish() {
    var slides = document.querySelectorAll('.slide-title, .slide-standard');
    var slideObjects = [];
    toArray(slides).forEach(function(slide){
      var slideObject = {};

      //template
      if (slide.classList.contains('slide-title')){
        slideObject.template = 'title';
      }else if (slide.classList.contains('slide-standard')) {
        slideObject.template = 'standard';
      }
      //header
      slideObject.header = slide.querySelector('.header > *').innerHTML;
      //body
      slideObject.body = slide.querySelector('.body > *').innerHTML;

      //tags
      slideObject.tags = _.map(slide.querySelectorAll('.tag'), function(dom){ 
        return dom.innerHTML.toLowerCase()
      });
      //index
      slideObject.index = slide.getAttribute('data-slide-index');
      //subindex
      slideObject.subIndex = slide.getAttribute('data-slide-subindex');
      slideObjects.push(slideObject);
    });
    var slideObjectsGrouped = _.groupBy(slideObjects, function(slide){ return slide.index});
    var slideObjectsGroupedSorted = _.map(slideObjectsGrouped, function(slides){ 
      return _.sortBy(slides, function(slide){ return slide.subIndex})
    });

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://' + window.location.host);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(slideObjects));
    xhr.onload = function(){
        var res = JSON.parse(xhr.responseText);
        if (res.status ==='ok'){
          var message = document.querySelector('.message');
          var anchor = message.querySelector('.messagecontent')
          anchor.innerHTML = 'http://' + window.location.host +'/dist';
          anchor.href =  'http://' + window.location.host +'/dist';
          anchor.target = 'blank';
        }else {

        }
    };
    xhr.onerror = function(err) {
      alert('Sorry! There are something wrong in the previous action');
    }
    window.location.hash = '/overview';
  }

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

    if (dom.body.classList.contains('overview')) {
      //add Eventlistener to slide
      var slides = dom.slides.querySelectorAll('.slide-standard, .slide-title');
      toArray(slides).forEach(function(slide){
        slide.addEventListener('click', onSlideClick, false);
        // add drop target to sub-slides
        if (slide.getAttribute('data-slide-subindex') !== '0'){
          slide.addEventListener('dragenter', cancel, false);
          slide.addEventListener('dragover', cancel, false);
          slide.addEventListener('drop', onTagDropped, false);
          slide.addEventListener('dragend', onTagDropped, false);

          var tags = slide.querySelectorAll('.tag');
          _.each(_.toArray(tags), function(tag){
            tag.addEventListener('click', onTagClick, false);
          });
        }
      });

      //add Eventlistener to slide-placehoder
      var slidePlaceholders = dom.slides.querySelectorAll('.slide-placeholder');
      toArray(slidePlaceholders).forEach(function(slide) {
        slide.addEventListener('click', onSlidePlaceholderClick, false);
      });

      //add eventlisterer to tags
      var tags = dom.tags.querySelectorAll('.tag');
      toArray(tags).forEach(function(tag){
        tag.addEventListener('dragstart', onTagDragStarted, false);
      });
    }

    if (dom.body.classList.contains('edit')) {
      var elements = dom.slides.querySelectorAll('.element');
      toArray(elements).forEach(function(element) {
        element.addEventListener('dblclick', onElementDoubleClick, false);
      });
    }

  };

  // --------------------------------------------------------------------//
  // ------------------------- RELATED TO TAG ---------------------------//
  // --------------------------------------------------------------------//

  function addTagToSlide(tagkind, slide){
    var tags = slide.querySelector('.tags');
    var tagNameList = _.map(tags.querySelectorAll('.tag'), function(dom){ 
      return dom.innerHTML.toLowerCase()
    });
    if (!_.contains(tagNameList, tagkind)){ 
      var tagDom = document.createElement('div');
      tagDom.classList.add('tag');
      tagDom.classList.add(tagkind);
      tagDom.innerHTML = capitaliseFirstLetter(tagkind);
      tags.appendChild(tagDom); 
    }

    addEventListeners();
  }

  // --------------------------------------------------------------------//
  // ----------------------------- EVENTS -------------------------------//
  // --------------------------------------------------------------------//
  function cancel(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    return false;
  }

  /*
   * when slide is clicked, edit mode will be dispatched;
   */
  function onSlideClick(){
   var slidePositionIndex = this.getAttribute('data-slide-index'),
       slidePositionSubIndex = this.getAttribute('data-slide-subindex');
       window.location.hash='/edit/' + slidePositionIndex + '/' + slidePositionSubIndex;
  }

  /*
   * when slide placeholer is clicked, new slide will be created;
   */
  function onSlidePlaceholderClick(){
   var slideType = this.getAttribute('data-slide-type'),
       slidePositionIndex = this.getAttribute('data-slide-index');
       addSlide(slideType, slidePositionIndex);
  }

  /*
   * when slide placeholer is clicked, new slide will be created;
   */
  function onElementDoubleClick(){
    var cachedNode = this,
        parentNode = this.parentNode,
        input = document.createElement('textarea');  
    toArray(this.classList).forEach(function(className){
      input.classList.add(className);
    });
    input.value = cachedNode.innerHTML;
    input.setAttribute('type', 'text');
    input.addEventListener('blur', function(){
      cachedNode.innerHTML = input.value;
      parentNode.replaceChild(cachedNode, input);
    });
    parentNode.replaceChild(input, this);
    input.focus();

  }

  // when tag is started to drag, information is set to tag attribution;
  function onTagDragStarted(e){
    e.dataTransfer.setData('tagkind', this.getAttribute('data-tagkind'));
  }

  // when tag is  dropped to slide, information is sent to slide;
  function onTagDropped(e){
    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }
    if (e.preventDefault) {
      e.preventDefault(); 
    }
    addTagToSlide(e.dataTransfer.getData('tagkind'), this);
  }



  function onTagClick (e){
    var tagsdom = this.parentNode;
    tagsdom.removeChild(this);
    e.stopPropagation();
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
  function capitaliseFirstLetter(string)
  {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  // --------------------------------------------------------------------//
  // ----------------------------- APIS -------------------------------//
  // --------------------------------------------------------------------//

  return {
    initialize : initialize
  };

})(window, _);