// Generated by CoffeeScript 1.7.1
(function() {
  var MediaSessionView;

  MediaSessionView = (function() {
    function MediaSessionView() {
      this.$el = $('.session');
    }

    MediaSessionView.prototype.template = "<div class=\"controls\">\n  <a href=\"#\" class=\"release\">\n    <i class=\"fa fa-times\"></i>\n  </a>\n  <a href=\"#\" class=\"pause\">\n    <i class=\"fa fa-pause\"></i>\n  </a>\n  <a href=\"#\" class=\"play\">\n    <i class=\"fa fa-play\"></i>\n  </a>\n  <a href=\"#\" class=\"stop\">\n    <i class=\"fa fa-stop\"></i>\n  </a>\n</div>\n<h3 class=\"receiver_name\">Not Casting</h3>\n<p class=\"display_name\"></p>";

    MediaSessionView.prototype.render = function() {
      return this.$el.html(this.template);
    };

    MediaSessionView.prototype.attachEvents = function(session, controls) {
      $('.controls', this.$el).show();
      $('.pause', this.$el).click((function(_this) {
        return function(ev) {
          ev.preventDefault();
          controls.pause();
          return _this.markAsSelected($(ev.currentTarget));
        };
      })(this));
      $('.play', this.$el).click((function(_this) {
        return function(ev) {
          ev.preventDefault();
          controls.play();
          return _this.markAsSelected($(ev.currentTarget));
        };
      })(this));
      $('.stop', this.$el).click((function(_this) {
        return function(ev) {
          ev.preventDefault();
          controls.stop();
          return _this.markAsSelected($(ev.currentTarget));
        };
      })(this));
      return $('.release', this.$el).click(function(ev) {
        ev.preventDefault();
        $('.name').text('Not casting');
        $('.controls').hide();
        return session.release();
      });
    };

    MediaSessionView.prototype.updateSession = function(session) {
      $('.receiver_name').text(session.receiverName());
      $('.display_name').text(session.displayName());
      session.on('play', (function(_this) {
        return function() {
          return _this.markAsSelected($('.play'));
        };
      })(this));
      session.on('pause', (function(_this) {
        return function() {
          return _this.markAsSelected($('.pause'));
        };
      })(this));
      session.on('stop', (function(_this) {
        return function() {
          return _this.markAsSelected($('.stop'));
        };
      })(this));
      return session.on('release', (function(_this) {
        return function() {
          $('.receiver_name').text('Not casting');
          return $('.display_name').text('');
        };
      })(this));
    };

    MediaSessionView.prototype.markAsSelected = function($el) {
      $('.current', this.$el).removeClass('current');
      return $el.addClass('current');
    };

    return MediaSessionView;

  })();

  window.MediaSessionView = MediaSessionView;

}).call(this);
