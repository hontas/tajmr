'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _intervals = require('./intervals');

var _intervals2 = _interopRequireDefault(_intervals);

var _user = require('./user');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function version() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  return state;
}

exports.default = (0, _redux.combineReducers)({
  userSettings: _user.userSettings,
  intervals: _intervals2.default,
  version: version,
  user: _user.user
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXRlL3JlZHVjZXJzL2luZGV4LmpzIl0sIm5hbWVzIjpbInZlcnNpb24iLCJzdGF0ZSIsInVzZXJTZXR0aW5ncyIsImludGVydmFscyIsInVzZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLFNBQUEsQUFBUyxVQUFzQjtNQUFkLEFBQWMsNEVBQU4sQUFBTSxBQUM3Qjs7U0FBQSxBQUFPLEFBQ1I7Ozs7c0JBRThCLEFBRTdCO3lCQUY2QixBQUc3QjtXQUg2QixBQUk3QjtjQUphLEFBQWdCLEE7QUFBQSxBQUM3QixDQURhIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9wb250YWhvbnRhcy9TaXRlcy9kZXYvdGFqbXIifQ==