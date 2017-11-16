'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reducers = require('../reducers');

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _redux.compose; // eslint-disable-line
var composed = composeEnhancers((0, _redux.applyMiddleware)(_reduxThunk2.default));

var initialState = {};
var store = (0, _redux.createStore)(_reducers2.default, initialState, composed);

exports.default = store;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXRlL3N0b3JlL2luZGV4LmpzIl0sIm5hbWVzIjpbImNvbXBvc2VFbmhhbmNlcnMiLCJ3aW5kb3ciLCJfX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9DT01QT1NFX18iLCJjb21wb3NlZCIsImluaXRpYWxTdGF0ZSIsInN0b3JlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU0sbUJBQW1CLE9BQU8sQUFBUCwrQ0FBekIsQSxTQUFpRjtBQUNqRixJQUFNLFdBQVcsaUJBQWlCLHlDQUFqQixBQUFqQjs7QUFFQSxJQUFNLGVBQWUsQUFBckI7QUFDQSxJQUFNLFFBQVEsNENBQXNCLEFBQXRCLGNBQW9DLEFBQXBDLEFBQWQ7O2tCQUVlLEEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3BvbnRhaG9udGFzL1NpdGVzL2Rldi90YWptciJ9