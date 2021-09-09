"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RecordSet = void 0;

var _Bindable = require("curvature/base/Bindable");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _Fetch = Symbol('_Fetch');

var RecordSet = /*#__PURE__*/function () {
  function RecordSet() {
    var _this = this;

    _classCallCheck(this, RecordSet);

    _defineProperty(this, "length", 0);

    this.length = 1000;

    var get = function get(t, k) {
      if (k === 'length') {
        return _this.count();
      }

      if (_typeof(k) === 'symbol' || parseInt(k) !== Number(k)) {
        return t[k];
      }

      return _this[_Fetch](Number(k));
    }; // const set = (t, k, v) => {
    // 	// if(typeof k === 'symbol' || parseInt(k) !== Number(k))
    // 	// {
    // 	// 	return true;
    // 	// }
    // 	return true;
    // };


    var del = function del(t, k) {
      return true;
    };

    return _Bindable.Bindable.make(new Proxy(this, {
      get: get
    }));
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
        this.content = [];
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
}();

exports.RecordSet = RecordSet;