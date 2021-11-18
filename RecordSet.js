"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RecordSet = void 0;

var _Bindable = require("curvature/base/Bindable");

var _Mixin = require("curvature/base/Mixin");

var _EventTargetMixin = require("curvature/mixin/EventTargetMixin");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _Fetch = Symbol('_Fetch');

var RecordSet = /*#__PURE__*/function (_Mixin$with) {
  _inherits(RecordSet, _Mixin$with);

  var _super = _createSuper(RecordSet);

  function RecordSet() {
    var _this;

    _classCallCheck(this, RecordSet);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "length", 0);

    _this.length = 1000;

    var get = function get(t, k) {
      if (k === 'length') {
        return _this.count();
      }

      if (_typeof(k) === 'symbol' || parseInt(k) !== Number(k)) {
        return t[k];
      }

      return _this[_Fetch](Number(k));
    };

    _this.offsets = new Map();

    var set = function set(t, k, v) {
      if (_typeof(k) === 'symbol' || parseInt(k) !== Number(k)) {
        _this[k] = v;
        return true;
      }

      if (!_this.content) {
        _this.content = _Bindable.Bindable.make([]);
      }

      if (_this.content[k]) {
        _this.content.splice(k, 0, v);
      } else {
        _this.content[k] = v;
      } // if(this.offsets.has(k))
      // {
      // 	this.offsets.set(k, 1 + Number(this.offsets.get(k)));
      // }
      // else
      // {
      // 	this.offsets.set(k, 1);
      // }


      _this.length = 1 + _this.length;
      _this.content[k] = v;

      _this.dispatchEvent(new CustomEvent('recordChanged', {
        detail: {
          key: k,
          value: v,
          length: _this.length
        }
      }));

      return true;
    };

    var del = function del(t, k) {
      return true;
    };

    return _possibleConstructorReturn(_this, _Bindable.Bindable.make(new Proxy(_assertThisInitialized(_this), {
      get: get,
      set: set
    })));
  }

  _createClass(RecordSet, [{
    key: "count",
    value: function count() {
      return this.length;
    }
  }, {
    key: "header",
    value: function header() {
      return false;
    }
  }, {
    key: _Fetch,
    value: function value(k) {
      var header = this.header();

      if (k === 0 && header) {
        header.___header = 'is-header';
        return header;
      }

      if (!this.content) {
        this.content = _Bindable.Bindable.make([]);
      }

      if (!this.content[k]) {
        this.content[k] = this.fetch(k);
      }

      return this.content[k];
    }
  }, {
    key: "fetch",
    value: function fetch(k) {
      return undefined;
    }
  }]);

  return RecordSet;
}(_Mixin.Mixin["with"](_EventTargetMixin.EventTargetMixin));

exports.RecordSet = RecordSet;