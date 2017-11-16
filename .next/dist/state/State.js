'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = function (Component) {
  return function (props) {
    return _react2.default.createElement(_reactRedux.Provider, { store: _store2.default }, _react2.default.createElement(Component, props));
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXRlL1N0YXRlLmpzIl0sIm5hbWVzIjpbIkNvbXBvbmVudCIsInByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7Ozs7OztrQkFFZSxVQUFDLEFBQUQsV0FBQTtTQUFlLFVBQUMsQUFBRCxPQUFBO1dBQzVCLGdCQUFBLDBCQUFBLFlBQVUsZUFBVixBQUNFLHlDQUFDLEFBQUQsV0FBZSxBQUFmLEFBREYsQUFENEI7QUFBZjtBIiwiZmlsZSI6IlN0YXRlLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9wb250YWhvbnRhcy9TaXRlcy9kZXYvdGFqbXIifQ==