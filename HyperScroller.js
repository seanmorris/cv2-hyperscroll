"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HyperScroller = void 0;

var _View = require("curvature/base/View");

var _Mixin = require("curvature/base/Mixin");

var _Tag = require("curvature/base/Tag");

var _GeoIn = require("curvature/animate/ease/GeoIn");

var _GeoOut = require("curvature/animate/ease/GeoOut");

var _Linear = require("curvature/animate/ease/Linear");

var _ElasticOut = require("curvature/animate/ease/ElasticOut");

var _Row = require("./Row");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var HyperScroller = /*#__PURE__*/function (_Mixin$from) {
  _inherits(HyperScroller, _Mixin$from);

  var _super = _createSuper(HyperScroller);

  function HyperScroller(args, parent) {
    var _this;

    _classCallCheck(this, HyperScroller);

    _this = _super.call(this, args, parent);
    _this.template = "<div class = \"cv-hyperscroller\" cv-ref  = \"list\">\n\t<div class = \"cv-hyperscroller-row\" cv-ref = \"row\" cv-bind = \"row\"></div>\n</div>\n";

    _this.preRuleSet.add('[cv-ref="list"]', function (_ref) {
      var element = _ref.element;
      element.setAttribute('tabindex', -1);
      element.setAttribute('cv-each', 'visible:row:r');
      element.setAttribute('cv-view', 'cv2-hyperscroll/Row');
    });

    _this.args.visible = [];
    _this.args.content = undefined;
    _this.first = null;
    _this.last = null;
    _this.changing = false;
    _this.lastScroll = false;
    _this.topSpeed = 0;
    _this.speed = 0;
    _this.args.width = '100%';
    _this.args.height = '100%';
    _this.args.scrollTop = 0;
    _this.args.scrollDir = 0;
    _this.args.snapOffset = 0;
    _this.args.rowHeight = _this.args.rowHeight || 32;

    _this.args.bindTo('scrollTop', function (v, k, t) {
      _this.args.scrollDir = 0;

      if (v > t[k]) {
        _this.args.scrollDir = 1;
      } else if (v < t[k]) {
        _this.args.scrollDir = -1;
      }
    });

    return _this;
  }

  _createClass(HyperScroller, [{
    key: "onRendered",
    value: function onRendered() {
      var _this2 = this;

      var container = this.container = this.tags.list;
      var scroller = this.scroller = this.tags.scroller || container;
      var shim = new _Tag.Tag('<div data-tag = "shim">');
      scroller.style({
        overflowY: 'scroll',
        position: 'relative',
        display: 'block',
        width: '100%'
      });
      shim.style({
        pointerEvents: 'none',
        position: 'absolute',
        opacity: 0,
        height: 'var(--shimHeight)',
        width: '1px'
      });
      this.listen(scroller.node, 'scroll', function (event) {
        return _this2.updateViewport(event);
      });
      this.args.bindTo('snapOffset', function (v) {
        return container.style({
          '--snapperOffset': "".concat(-1 * v, "px")
        });
      }, {
        wait: 0
      });
      this.args.bindTo('snapOffset', function (v) {
        return container.style({
          '--snapperOffset': "".concat(-1 * v, "px")
        });
      }, {
        wait: 0
      });
      scroller.append(shim.element);

      var setHeights = function setHeights(v, k) {
        return scroller.style(_defineProperty({}, "--".concat(k), "".concat(v, "px")));
      };

      this.args.bindTo('height', function (v) {
        return container.style({
          height: v
        });
      });
      this.args.bindTo('width', function (v) {
        return container.style({
          width: v
        });
      });
      this.args.bindTo('rowHeight', setHeights);
      this.args.bindTo('shimHeight', setHeights);
      this.args.bindTo('rowHeight', function (v, k, t) {
        var headers = _this2.header && _this2.header();

        var headerRow = headers ? -1 : 0;
        t[k] = parseInt(v);
        var rows = headerRow + _this2.args.content ? _this2.args.content.length : 0;
        _this2.args.shimHeight = rows * _this2.args.rowHeight;
        _this2.scroller.scrollTop = _this2.first * _this2.args.rowHeight;

        _this2.onNextFrame(function () {
          return _this2.updateViewport();
        });
      });
      this.contentDebind = this.args.bindTo('content', function (v, k, t) {
        var headers = _this2.header && _this2.header();

        var headerRow = headers ? 1 : 0;
        var rows = headerRow + v ? v.length : 0;
        _this2.args.shimHeight = rows * _this2.args.rowHeight;
        _this2.lengthDebind && _this2.lengthDebind();

        if (v) {
          _this2.lengthDebind = v.bindTo('length', function (v) {
            var headers = _this2.header && _this2.header();

            v = Number(v);

            _this2.updateViewport();

            _this2.args.shimHeight = v * _this2.args.rowHeight;

            if (_this2.args.changedScroll) {
              _this2.container.scrollTo({
                behavior: 'smooth',
                top: _this2.container.scrollHeight
              });
            }
          }, {
            wait: 0
          });
        } else {
          _this2.updateViewport();
        }
      }, {
        wait: 0
      });
      this.updateViewport();
      this.container.scrollTo({
        top: this.container.scrollHeight
      });
    }
  }, {
    key: "updateViewport",
    value: function updateViewport(event) {
      var _this3 = this;

      var container = this.container;
      var scroller = this.scroller || container;

      if (this.changing) {
        return;
      }

      this.snapper && this.snapper.cancel();
      var headers = this.header && this.header();
      var start = this.args.scrollTop = scroller.scrollTop;
      var depth = this.args.scrollHeight = scroller.scrollHeight;
      var space = container.offsetHeight;
      var fold = start + space;
      scroller.style({
        '--scrollTop': start
      });
      this.args.scrollMax = depth - space;
      var first = Math.floor(start / this.args.rowHeight);
      var last = Math.ceil(fold / this.args.rowHeight);
      var lastScroll = {
        time: Date.now(),
        pos: start
      };

      if (!this.speedTimer) {
        this.speedTimer = this.onTimeout(100, function () {
          var timeDiff = Date.now() - lastScroll.time;
          var posDiff = scroller.scrollTop - start;
          _this3.speed = posDiff / timeDiff * 1000;
          var absSpeed = Math.abs(_this3.speed);

          if (absSpeed > Math.abs(_this3.topSpeed)) {
            _this3.topSpeed = _this3.speed;
          }

          if (!_this3.speed) {
            _this3.topSpeed = _this3.speed;
          }

          _this3.args.speed = _this3.speed.toFixed(2);
        });
        this.speedTimer = false;
      }

      if (!this.args.content && !Array.isArray(this.args.content)) {
        return;
      }

      container.style({
        '--hasHeaders': Number(!!headers)
      });

      if (first > this.args.content.length) {
        first = this.args.content.length - 1;
      }

      if (last > this.args.content.length) {
        last = this.args.content.length - 1;
      }

      this.setVisible(first, last);

      if (start === 0 || fold === depth) {
        container.style({
          '--inertiaOffset': "0px"
        });
        container.style({
          '--snapperOffset': "0px"
        });
        this.args.snapOffset = 0;
        this.snapperDone && this.snapperDone();
        return;
      }

      if (!event) {
        return;
      }

      var closeRow = Math.round(start / this.args.rowHeight);
      var groove = closeRow * this.args.rowHeight;
      var diff = groove - start;
      var duration = Math.abs(diff * this.args.rowHeight);

      if (duration > 512) {
        duration = 512;
      }

      var snapper = Math.abs(diff) > Math.min(15, this.args.rowHeight / 3) ? new _ElasticOut.ElasticOut(duration * 3, {
        friction: 0.15
      }) : new _Linear.Linear(diff);
      this.snapperDone && this.snapperDone();
      this.snapperDone = this.onFrame(function () {
        var offset = snapper.current() * diff;
        _this3.args.snapOffset = offset;
      });
      snapper.then(function (elapsed) {
        if (_this3.args.snapOffset == 0) {
          return;
        }

        if (scroller.scrollTop !== groove) {
          scroller.scrollTop = groove;
        }

        _this3.args.snapOffset = 0;
        _this3.snapperDone && _this3.snapperDone();
        event.preventDefault();
      })["catch"](function (elapsed) {// const offset = this.snapper.current() * diff;
        // this.args.snapOffset = 0;
      });
      this.scrollFrame && cancelAnimationFrame(this.scrollFrame);
      this.scrollFrame = requestAnimationFrame(function () {
        return snapper.start();
      });
      this.snapper = snapper;
    }
  }, {
    key: "setVisible",
    value: function setVisible(first, last) {
      if (this.changing) {
        // cancelAnimationFrame(this.changing);
        // this.changing = false;
        return;
      }

      if (this.first === first && this.last === last) {
        return;
      }

      if (!this.tags.list) {
        return;
      }

      var listTag = this.tags.list;
      var visibleList = this.viewLists.get(listTag.node);

      if (!visibleList) {
        return;
      }

      var visible = visibleList.views;
      var del = [];

      if (first <= last) {
        for (var i in visible) {
          var index = parseInt(i);
          var entry = visible[index];

          if (first === last && last === 0) {
            del.unshift(index);
            continue;
          }

          if (index < first || index > last) {
            del.unshift(index);
            continue;
          }

          if (entry && (!entry.visible || entry.removed)) {
            del.unshift(index);
            continue;
          }
        }
      } else {
        visible.map(function (v, k) {
          return del.push(k);
        });
      }

      for (var _i = 0, _del = del; _i < _del.length; _i++) {
        var d = _del[_i];

        if (d === 0 && this.header()) {
          continue;
        }

        visible[d] && visible[d].remove();
        delete visible[d];
        delete this.args.visible[d];
      }

      for (var _i2 = first; _i2 <= last; _i2++) {
        if (this.args.content.length <= _i2) {
          continue;
        }

        this.args.visible[_i2] = this.args.content[_i2];
      }

      ;
      this.first = first;
      this.last = last;
      this.changing = false;
    }
  }, {
    key: "header",
    value: function header() {
      if (!this.args.content) {
        return false;
      }

      if (Array.isArray(this.args.content)) {
        return false;
      }

      if (typeof this.args.content.header !== 'function') {
        return false;
      }

      return this.args.content.header();
    }
  }, {
    key: "leftPad",
    value: function leftPad(x) {
      return String(x).padStart(4, 0);
    }
  }]);

  return HyperScroller;
}(_Mixin.Mixin.from(_View.View));

exports.HyperScroller = HyperScroller;