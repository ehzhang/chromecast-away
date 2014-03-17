// Generated by CoffeeScript 1.7.0
(function() {
  var CastAway, CustomReceiver, MediaControls, MediaReceiver, Receiver,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CastAway = (function() {
    function CastAway(_arg) {
      var _ref;
      _ref = _arg != null ? _arg : {}, this.applicationID = _ref.applicationID, this.namespace = _ref.namespace;
      if (!chrome.cast) {
        throw "chrome.cast namespace not found";
      }
      this.cast = chrome.cast;
    }

    CastAway.prototype.initialize = function(callbacks) {
      this.callbacks = callbacks;
      return window['__onGCastApiAvailable'] = (function(_this) {
        return function(loaded, errorInfo) {
          var apiConfig, app, error, sessionRequest, success;
          if (loaded) {
            app = _this.applicationID || _this.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
            sessionRequest = new _this.cast.SessionRequest(app);
            apiConfig = new _this.cast.ApiConfig(sessionRequest, function() {
              var data;
              data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return _this.sessionListener.apply(_this, data);
            }, function() {
              var data;
              data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return _this.receiverListener.apply(_this, data);
            });
            success = function() {};
            error = function() {
              var args;
              args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return _this.emit('initialize:error');
            };
            return _this.cast.initialize(apiConfig, success, error);
          }
        };
      })(this);
    };

    CastAway.prototype.sessionListener = function(session) {
      if (session.media.length !== 0) {
        this.session = session.media[0];
      }
      return session.addUpdateListener(this.sessionUpdateListener);
    };

    CastAway.prototype.receiverListener = function(receiver) {
      var state;
      state = receiver === this.cast.ReceiverAvailability.AVAILABLE ? 'available' : 'unavailable';
      return this.emit("receivers:" + state);
    };

    CastAway.prototype.sessionUpdateListener = function(isAlive) {
      if (!isAlive) {
        this.session = null;
        return this.emit('session:release');
      }
    };

    CastAway.prototype.createSession = function(callbacks) {
      var getReceiver;
      getReceiver = function(session) {
        if (this.applicationID) {
          return new CustomReceiver(session);
        } else {
          return new MediaReceiver(session);
        }
      };
      if (this.session != null) {
        return typeof callbacks.success === "function" ? callbacks.success(getReceiver(this.session)) : void 0;
      } else {
        return this.cast.requestSession((function(_this) {
          return function(session) {
            return typeof callbacks.success === "function" ? callbacks.success(getReceiver(session)) : void 0;
          };
        })(this), function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return typeof callbacks.error === "function" ? callbacks.error.apply(callbacks, args) : void 0;
        });
      }
    };

    return CastAway;

  })();

  Receiver = (function() {
    function Receiver(session, namespace) {
      this.session = session;
      this.namespace = namespace;
      if (!chrome.cast) {
        throw "chrome.cast namespace not found";
      }
      this.cast = chrome.cast;
    }

    Receiver.prototype.release = function(success, error) {
      if (!this.session) {
        return;
      }
      return this.session.stop(function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return typeof success === "function" ? success.apply(null, args) : void 0;
      }, function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return typeof error === "function" ? error.apply(null, args) : void 0;
      });
    };

    return Receiver;

  })();

  CustomReceiver = (function(_super) {
    __extends(CustomReceiver, _super);

    function CustomReceiver() {
      return CustomReceiver.__super__.constructor.apply(this, arguments);
    }

    CustomReceiver.prototype.load = function(url, callbacks) {};

    return CustomReceiver;

  })(Receiver);

  MediaReceiver = (function(_super) {
    __extends(MediaReceiver, _super);

    function MediaReceiver() {
      return MediaReceiver.__super__.constructor.apply(this, arguments);
    }

    MediaReceiver.prototype.load = function(media, callbacks) {
      var mediaInfo, request;
      if (!media.url) {
        throw "No media url set";
      }
      if (!media.contentType) {
        throw "No media content type set";
      }
      mediaInfo = new this.cast.media.MediaInfo(media.url, media.contentType);
      request = new this.cast.media.LoadRequest(mediaInfo);
      return this.session.loadMedia(request, (function(_this) {
        return function(receiver) {
          return typeof callbacks.success === "function" ? callbacks.success(new MediaControls(receiver)) : void 0;
        };
      })(this), function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return typeof callbacks.error === "function" ? callbacks.error.apply(callbacks, args) : void 0;
      });
    };

    return MediaReceiver;

  })(Receiver);

  MediaControls = (function() {
    function MediaControls(receiver) {
      this.receiver = receiver;
      if (!this.receiver) {
        throw "No receiver passed";
      }
    }

    MediaControls.prototype.play = function(success, error) {
      return this.receiver.play(null, function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return typeof success === "function" ? success.apply(null, args) : void 0;
      }, function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return typeof error === "function" ? error.apply(null, args) : void 0;
      });
    };

    MediaControls.prototype.pause = function(success, error) {
      return this.receiver.pause(null, function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return typeof success === "function" ? success.apply(null, args) : void 0;
      }, function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return typeof error === "function" ? error.apply(null, args) : void 0;
      });
    };

    MediaControls.prototype.stop = function(success, error) {
      return this.receiver.stop(null, function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return typeof success === "function" ? success.apply(null, args) : void 0;
      }, function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return typeof error === "function" ? error.apply(null, args) : void 0;
      });
    };

    MediaControls.prototype.seek = function(time, success, error) {
      var seekRequest;
      seekRequest = this.cast.media.SeekRequest(time);
      return this.receiver.seek(seekRequest, function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return typeof success === "function" ? success.apply(null, args) : void 0;
      }, function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return typeof error === "function" ? error.apply(null, args) : void 0;
      });
    };

    return MediaControls;

  })();

  window.CastAway = CastAway;

}).call(this);
