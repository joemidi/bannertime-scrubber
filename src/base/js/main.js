'use strict';

function Preview() {
  this.currentFormat = 0;
  this._bindSelectors();
  this._bindEvents();
}

Preview.prototype._bindSelectors = function() {
  this.links = Array.prototype.slice.call(document.querySelectorAll('a'));
  this.iframe = document.querySelector('iframe');
  this.sideBar = document.querySelector('.sidebar');
  this.up = document.querySelector('.up');
  this.down = document.querySelector('.down');
  this.left = document.querySelector('.left');
  this.right = document.querySelector('.right');
  this.range = document.querySelector('.range');
};

Preview.prototype._bindEvents = function() {
  this._onKeyDown = this._onKeyDown.bind(this);
  this._onKeyUp = this._onKeyUp.bind(this);
  this._onClick = this._onClick.bind(this);
  this._seek = this._seek.bind(this);
  this._trackTimeLine = this._trackTimeLine.bind(this);
  this._pause = this._pause.bind(this);
  this._play = this._play.bind(this);

  document.addEventListener('keydown', this._onKeyDown);
  document.addEventListener('keyup', this._onKeyUp);

  this.iframe.addEventListener("load", this._trackTimeLine);
  this.range.addEventListener("change", this._seek);
  this.range.addEventListener("mousedown", this._pause);
  this.range.addEventListener("mouseup", this._play);
 
  for (var i = 0; i < this.links.length; i++) {
    this.links[i].addEventListener('click', this._onClick);
  }
};

Preview.prototype._trackTimeLine = function(e) {
  var _this = this;
  console.log('IFRAME READY')
  setTimeout(function() {
    var tl = _this.iframe.contentWindow.banner.timeline;
    tl.restart();
    var counter = { var: tl.progress() };
    _this.tween = TweenLite.to(counter, tl.totalDuration()-tl.time(), {var: 1, onUpdate: function () {
        _this.range.value = tl.progress()*100;
        console.log('PROGRESS: 1/' + tl.progress());
        console.log('TIME: ' + tl.time());
    }});
  }, 1000);


}

Preview.prototype._seek = function(e) {
  var val = e.target.value;
  var tl = this.iframe.contentWindow.banner.timeline;
  tl.progress(e.target.value/100);
}

Preview.prototype._pause = function(e) {
  var tl = this.iframe.contentWindow.banner.timeline;
  this.tween.pause();
  tl.pause();
}

Preview.prototype._play = function(e) {
  // var _this = this;
  var tl = this.iframe.contentWindow.banner.timeline;
  // var counter = { var: tl.progress() };
  // this.tween = TweenLite.to(counter, tl.totalDuration()-tl.time(), {var: 100, onUpdate: function () {
  //       _this.range.value = tl.progress()*100;
  // }});
  // console.log(tl.totalDuration())
  // console.log(tl.time())
  tl.resume();
  this.tween.duration = tl.totalDuration()-tl.time();
  this.tween.resume();
}

Preview.prototype._nextFormat = function(array) {
  return array[this.currentFormat++];
};

Preview.prototype._prevFormat = function(array) {
  return array[this.currentFormat--];
};

Preview.prototype._onKeyDown = function(e) {
  switch (e.keyCode) {
    // Left arrow
    case 37:
      e.preventDefault();
      this.left.classList.add('active');
      TweenLite.to(this.sideBar, 1, {width: 0, padding: 0, ease: Power1.easeInOut});
    break;
    // Up arrow
    case 38:
      e.preventDefault();
      this.up.classList.add('active');
      this.iframe.src = this._prevFormat(this.links).href;
      if (this.currentFormat === -1) {
        this.currentFormat = this.links.length - 1;
      }
    break;
    // Right arrow
    case 39:
      e.preventDefault();
      this.right.classList.add('active');
      TweenLite.to(this.sideBar, 1, {width: 200, padding: '0 40px', ease: Power1.easeInOut});
    break;
    // Down arrow
    case 40:
      e.preventDefault();
      this.down.classList.add('active');
      this.iframe.src = this._nextFormat(this.links).href;
      if (this.currentFormat === this.links.length) {
        this.currentFormat = 0;
      }
    break;
  }
};

Preview.prototype._onKeyUp = function(e) {
  e.preventDefault();
  this.up.classList.remove('active');
  this.right.classList.remove('active');
  this.down.classList.remove('active');
  this.left.classList.remove('active');
};

Preview.prototype._onClick = function(e) {
  var _this = this;
  e.preventDefault();
  this.iframe.src = e.target.href;
  TweenLite.set('.iframe iframe', {autoAlpha: 0});
  TweenLite.set('.loading', {display: 'block', autoAlpha: 1});
  setTimeout(function() {
    var banner = _this.iframe.contentWindow.document.querySelector('.banner');
    if (banner) {
      TweenLite.set('.loading', {autoAlpha: 0});
      TweenLite.to('.iframe iframe', 1, {autoAlpha: 1});
      TweenLite.set(banner, {top: 0, right: 0, bottom: 0, left: 0, position: 'absolute', margin: 'auto'});
      var tl = this.iframe.contentWindow.banner.timeline;
      var counter = { var: 0 };
      tl.restart();
      TweenLite.to(counter, tl.totalDuration(), {var: 1, onUpdate: function () {
          _this.range.value = tl.progress()*100;
          console.log(tl.progress())
      }});
    }
  }, 1000);
};

document.addEventListener('DOMContentLoaded', function () {
  new Preview();
});
