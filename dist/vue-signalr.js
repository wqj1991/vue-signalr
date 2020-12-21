'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getOwnPropertyNames = require('babel-runtime/core-js/object/get-own-property-names');

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _signalr = require('@microsoft/signalr');

var SignalR = _interopRequireWildcard(_signalr);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventEmitter = require('events');

var defaultOptions = {
	log: false
};

var SocketConnection = function (_EventEmitter) {
	(0, _inherits3.default)(SocketConnection, _EventEmitter);

	function SocketConnection(connection) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		(0, _classCallCheck3.default)(this, SocketConnection);

		var _this = (0, _possibleConstructorReturn3.default)(this, (SocketConnection.__proto__ || (0, _getPrototypeOf2.default)(SocketConnection)).call(this));

		_this.connection = connection;
		_this.options = (0, _assign2.default)(defaultOptions, options);
		_this.listened = [];

		_this.toSend = [];

		_this.offline = false;

		_this.socket = undefined;
		return _this;
	}

	/**
  * 同一种消息只定义一次
  *
  * @param {string| symbol} event
  * @param {(...args: any[]) => void} listener
  * @memberof SocketConnection
  */


	(0, _createClass3.default)(SocketConnection, [{
		key: 'one',
		value: function one(event, listener) {
			if (this.listeners(event).length === 0) {
				this.on(event, listener);
			}
		}
	}, {
		key: '_initialize',
		value: function () {
			var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
				var _this2 = this;

				return _regenerator2.default.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.prev = 0;
								_context2.next = 3;
								return this.socket.start();

							case 3:
								this.emit('onstart');
								if (this.offline) {
									this.emit('onrestart');
								}
								this.offline = false;
								_context2.next = 11;
								break;

							case 8:
								_context2.prev = 8;
								_context2.t0 = _context2['catch'](0);

								setTimeout((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
									return _regenerator2.default.wrap(function _callee$(_context) {
										while (1) {
											switch (_context.prev = _context.next) {
												case 0:
													_context.next = 2;
													return _this2._initialize();

												case 2:
												case 'end':
													return _context.stop();
											}
										}
									}, _callee, _this2);
								})), 5000);

							case 11:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this, [[0, 8]]);
			}));

			function _initialize() {
				return _ref.apply(this, arguments);
			}

			return _initialize;
		}()
	}, {
		key: 'start',
		value: function () {
			var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
				var _this3 = this;

				var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
				return _regenerator2.default.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								this.options = (0, _assign2.default)(defaultOptions, options);

								// 组件重新加载时, 如果 socket 存在, 不需要新建

								if (this.socket) {
									_context4.next = 6;
									break;
								}

								this.socket = new SignalR.HubConnectionBuilder().configureLogging(SignalR.LogLevel.Information).withUrl(this.connection, this.options).build();

								this.socket.onclose((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
									return _regenerator2.default.wrap(function _callee3$(_context3) {
										while (1) {
											switch (_context3.prev = _context3.next) {
												case 0:
													_this3.offline = true;
													_this3.emit('onclose');
													_context3.next = 4;
													return _this3._initialize();

												case 4:
												case 'end':
													return _context3.stop();
											}
										}
									}, _callee3, _this3);
								})));

								_context4.next = 6;
								return this._initialize();

							case 6:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function start() {
				return _ref3.apply(this, arguments);
			}

			return start;
		}()
	}, {
		key: 'authenticate',
		value: function () {
			var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(accessToken) {
				var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
				return _regenerator2.default.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								this.connection = this.connection + '?authorization=' + accessToken;

								/* eslint-disable no-underscore-dangle */
								_context5.next = 3;
								return this.start();

							case 3:
							case 'end':
								return _context5.stop();
						}
					}
				}, _callee5, this);
			}));

			function authenticate(_x4) {
				return _ref5.apply(this, arguments);
			}

			return authenticate;
		}()
	}, {
		key: 'listen',
		value: function listen(method) {
			var _this4 = this;

			if (this.offline) return;

			if (this.listened.some(function (v) {
				return v === method;
			})) return;
			this.listened.push(method);

			this.one('onstart', function () {
				_this4.socket.on(method, function (data) {
					if (_this4.options.log) console.log({ type: 'receive', method: method, data: data });

					_this4.emit(method, data);
				});
			});
		}
	}, {
		key: 'send',
		value: function send(methodName) {
			var _this5 = this;

			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			if (this.options.log) console.log({ type: 'send', methodName: methodName, args: args });
			if (this.offline) return;

			if (this.socket) {
				var _socket;

				(_socket = this.socket).send.apply(_socket, [methodName].concat(args));
				return;
			}

			this.one('onstart', function () {
				var _socket2;

				return (_socket2 = _this5.socket).send.apply(_socket2, [methodName].concat(args));
			});
		}
	}, {
		key: 'invoke',
		value: function () {
			var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(methodName) {
				var _this6 = this;

				for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
					args[_key2 - 1] = arguments[_key2];
				}

				var _socket3;

				return _regenerator2.default.wrap(function _callee7$(_context7) {
					while (1) {
						switch (_context7.prev = _context7.next) {
							case 0:
								if (this.options.log) console.log({ type: 'invoke', methodName: methodName, args: args });

								if (!this.offline) {
									_context7.next = 3;
									break;
								}

								return _context7.abrupt('return', false);

							case 3:
								if (!this.socket) {
									_context7.next = 5;
									break;
								}

								return _context7.abrupt('return', (_socket3 = this.socket).invoke.apply(_socket3, [methodName].concat((0, _toConsumableArray3.default)(args))));

							case 5:
								return _context7.abrupt('return', new _promise2.default(function () {
									var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(resolve) {
										return _regenerator2.default.wrap(function _callee6$(_context6) {
											while (1) {
												switch (_context6.prev = _context6.next) {
													case 0:
														return _context6.abrupt('return', _this6.one('onstart', function () {
															var _socket4;

															return resolve((_socket4 = _this6.socket).invoke.apply(_socket4, [methodName].concat((0, _toConsumableArray3.default)(args))));
														}));

													case 1:
													case 'end':
														return _context6.stop();
												}
											}
										}, _callee6, _this6);
									}));

									return function (_x6) {
										return _ref7.apply(this, arguments);
									};
								}()));

							case 6:
							case 'end':
								return _context7.stop();
						}
					}
				}, _callee7, this);
			}));

			function invoke(_x5) {
				return _ref6.apply(this, arguments);
			}

			return invoke;
		}()
	}]);
	return SocketConnection;
}(EventEmitter);

if (!SignalR) {
	throw new Error('[Vue-SignalR] Cannot locate signalr-client');
}

function install(Vue, connection) {
	if (!connection) {
		throw new Error('[Vue-SignalR] Cannot locate connection');
	}

	var Socket = new SocketConnection(connection);

	Vue.socket = Socket;

	(0, _defineProperties2.default)(Vue.prototype, {
		$socket: {
			get: function get() {
				return Socket;
			}
		}
	});

	Vue.mixin({
		created: function created() {
			var _this7 = this;

			if (this.$options.sockets) {
				var methods = (0, _getOwnPropertyNames2.default)(this.$options.sockets);

				methods.forEach(function (method) {
					Socket.listen(method);

					Socket.one(method, function (data) {
						return _this7.$options.sockets[method].call(_this7, data);
					});
				});
			}

			if (this.$options.subscribe) {
				Socket.one('authenticated', function () {
					_this7.$options.subscribe.forEach(function (channel) {
						Socket.invoke('join', channel);
					});
				});
			}
		}
	});
}

exports.default = install;
