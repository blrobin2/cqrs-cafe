/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Container = __webpack_require__(27);

var _Container2 = _interopRequireDefault(_Container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var waitStaff = ['Carl', 'Meghan', 'Dave', 'Brittney'];

var menu = [{
  menuNumber: 1,
  description: 'Coke',
  price: 1.5,
  isDrink: true
}, {
  menuNumber: 10,
  description: 'Mushroom and Bacon Pasta',
  price: 6,
  isDrink: false
}];

var el = React.createElement;
ReactDOM.render(el(_Container2.default, {
  waitStaff: waitStaff, menu: menu
}), document.getElementById('root'));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MessageDispatcher = function () {
  function MessageDispatcher(eventStore) {
    _classCallCheck(this, MessageDispatcher);

    this.eventStore = eventStore;
    this.commandHandlers = new Map();
    this.eventSubscribers = new Map();
  }

  _createClass(MessageDispatcher, [{
    key: 'sendCommand',
    value: function sendCommand(command) {
      var commandName = command.constructor.name;
      if (!this.commandHandlers.has(commandName)) {
        throw new Error('No command handler register for ' + commandName);
      }
      this.commandHandlers.get(commandName)(command);
    }
  }, {
    key: '_publishEvent',
    value: function _publishEvent(events) {
      var _this = this;

      events.forEach(function (event) {
        var eventName = event.constructor.name;
        if (_this.eventSubscribers.has(eventName)) {
          _this.eventSubscribers.get(eventName).forEach(function (sub) {
            return sub(event);
          });
        }
      });
    }
  }, {
    key: 'addHandlerFor',
    value: function addHandlerFor(command, aggregate) {
      var _this2 = this;

      if (this.commandHandlers.has(command)) {
        throw new Error('Command handler already registered for ' + command);
      }

      this.commandHandlers.set(command, function (c) {
        var agg = new aggregate();
        agg.id = c.id;
        agg.applyEvents(_this2.eventStore.loadEventsFor(agg.id));

        var resultEvents = Object.getOwnPropertyNames(aggregate.prototype).filter(function (method) {
          return method === 'handle' + command;
        }).map(function (method) {
          return agg[method](c);
        });

        if (resultEvents.length > 0) {
          _this2.eventStore.saveEventsFor(agg.id, agg.eventsLoaded, resultEvents);
        }

        resultEvents.forEach(function (event) {
          return _this2._publishEvent(event);
        });
      });
    }
  }, {
    key: 'addSubscriberFor',
    value: function addSubscriberFor(event, subscriber) {
      if (!this.eventSubscribers.has(event)) {
        this.eventSubscribers.set(event, []);
      }
      this.eventSubscribers.get(event).push(function (e) {
        return subscriber['apply' + event](e);
      });
    }
  }, {
    key: 'scanInstance',
    value: function scanInstance(instance) {
      var _this3 = this;

      var instanceMethods = this._isConstructor(instance) ? Object.getOwnPropertyNames(instance.prototype) : Object.getOwnPropertyNames(instance.constructor.prototype);
      var handlers = instanceMethods.filter(function (method) {
        return method.startsWith('handle');
      });
      handlers.map(function (handler) {
        return handler.replace('handle', '');
      }).forEach(function (handler) {
        return _this3.addHandlerFor(handler, instance);
      });

      var subscribers = instance.iSubscribeTo || [];
      subscribers.forEach(function (sub) {
        return _this3.addSubscriberFor(sub, instance);
      });
    }
  }, {
    key: '_isConstructor',
    value: function _isConstructor(f) {
      try {
        new f();
      } catch (err) {
        return false;
      }
      return true;
    }
  }]);

  return MessageDispatcher;
}();

exports.default = MessageDispatcher;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stream = function Stream() {
  _classCallCheck(this, Stream);

  this.events = [];
};

var EventStore = function () {
  function EventStore() {
    _classCallCheck(this, EventStore);

    this._store = new Map();
  }

  _createClass(EventStore, [{
    key: "loadEventsFor",
    value: function loadEventsFor(id) {
      if (this._store.has(id)) {
        return this._store.get(id).events;
      }

      return [];
    }
  }, {
    key: "saveEventsFor",
    value: function saveEventsFor(aggregteId, eventsLoaded, newEvents) {
      if (!this._store.has(aggregteId)) {
        this._store.set(aggregteId, new Stream());
      }

      var store = this._store.get(aggregteId);
      var eventList = store.events;

      var prevEvents = eventList ? eventList.length : 0;

      var newEventList = eventList ? [].concat(_toConsumableArray(eventList)) : [];
      newEventList.push.apply(newEventList, _toConsumableArray(newEvents));

      if (newEventList.filter(function (e) {
        return !eventList.includes(e);
      }).length > 0) {
        this._store.get(aggregteId).events = newEventList;
      }
    }
  }]);

  return EventStore;
}();

exports.default = EventStore;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Aggregate2 = __webpack_require__(4);

var _Aggregate3 = _interopRequireDefault(_Aggregate2);

var _OpenTab = __webpack_require__(5);

var _OpenTab2 = _interopRequireDefault(_OpenTab);

var _TabOpened = __webpack_require__(6);

var _TabOpened2 = _interopRequireDefault(_TabOpened);

var _DrinksOrdered = __webpack_require__(7);

var _DrinksOrdered2 = _interopRequireDefault(_DrinksOrdered);

var _FoodOrdered = __webpack_require__(8);

var _FoodOrdered2 = _interopRequireDefault(_FoodOrdered);

var _DrinksServed = __webpack_require__(9);

var _DrinksServed2 = _interopRequireDefault(_DrinksServed);

var _FoodPrepared = __webpack_require__(10);

var _FoodPrepared2 = _interopRequireDefault(_FoodPrepared);

var _FoodServed = __webpack_require__(11);

var _FoodServed2 = _interopRequireDefault(_FoodServed);

var _TabClosed = __webpack_require__(12);

var _TabClosed2 = _interopRequireDefault(_TabClosed);

var _Exceptions = __webpack_require__(13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Representation of a Tab for an Order
 * 
 * @extends Aggregate
 */
var TabAggregate = function (_Aggregate) {
  _inherits(TabAggregate, _Aggregate);

  /**
   * Constructs a new TabAggregate
   */
  function TabAggregate() {
    _classCallCheck(this, TabAggregate);

    var _this = _possibleConstructorReturn(this, (TabAggregate.__proto__ || Object.getPrototypeOf(TabAggregate)).call(this));

    _this.open = false;
    _this.outstandingDrinks = [];
    _this.outstandingFood = [];
    _this.preparedFood = [];
    _this.servedItemsValue = 0;
    return _this;
  }

  /**
   * Handles OpenTab command
   * 
   * @param {OpenTab} command - The OpenTab command
   * @return {Array[TabOpened]} The events fired
   * @throws {Error}
   */


  _createClass(TabAggregate, [{
    key: 'handleOpenTab',
    value: function handleOpenTab(command) {
      if (!command instanceof _OpenTab2.default) {
        throw new Error('Invalid command: Expected OpenTab, recieved ' + command.constructor.name);
      }
      return [new _TabOpened2.default({
        id: command.id,
        tableNumber: command.tableNumber,
        waiter: command.waiter
      })];
    }

    /**
     * Handles PlaceOrder command
     * 
     * @param {PlaceOrder} command
     * @return {Array[DrinksOrdered|FoodOrdered]}
     * @throws {TabNotOpen} - When tab isn't open
     */

  }, {
    key: 'handlePlaceOrder',
    value: function handlePlaceOrder(command) {
      if (!this.open) {
        throw new _Exceptions.TabNotOpen();
      }
      var events = [];
      var drinks = command.orderedItems.filter(function (i) {
        return i.isDrink;
      });
      if (drinks.length > 0) {
        events.push(new _DrinksOrdered2.default({
          id: command.id,
          orderedItems: drinks
        }));
      }

      var food = command.orderedItems.filter(function (i) {
        return !i.isDrink;
      });
      if (food.length > 0) {
        events.push(new _FoodOrdered2.default({
          id: command.id,
          orderedItems: food
        }));
      }

      return events;
    }

    /**
     * Handles MarkDrinksServed command
     * 
     * @param {MarkDrinksServed} command
     * @return {Array[DrinksServed]}
     * @throws {DrinksNotOutstanding}
     */

  }, {
    key: 'handleMarkDrinksServed',
    value: function handleMarkDrinksServed(command) {
      if (!this._areDrinksOutstanding(command.menuNumbers)) {
        throw new _Exceptions.DrinksNotOutstanding();
      }
      return [new _DrinksServed2.default({
        id: command.id,
        menuNumbers: command.menuNumbers
      })];
    }
  }, {
    key: 'handleMarkFoodPrepared',
    value: function handleMarkFoodPrepared(command) {
      if (!this._isFoodOutstanding(command.menuNumbers)) {
        throw new _Exceptions.FoodNotOutstanding();
      }
      return [new _FoodPrepared2.default({
        id: command.id,
        menuNumbers: command.menuNumbers
      })];
    }
  }, {
    key: 'handleMarkFoodServed',
    value: function handleMarkFoodServed(command) {
      if (!this._isFoodPrepared(command.menuNumbers)) {
        throw new _Exceptions.FoodNotPrepared();
      }
      return [new _FoodServed2.default({
        id: command.id,
        menuNumbers: command.menuNumbers
      })];
    }

    /**
     * Handles CloseTab command
     * 
     * @param {CloseTab} command
     * @return {Array[TabClosed]} 
     */

  }, {
    key: 'handleCloseTab',
    value: function handleCloseTab(command) {
      if (!this.open) {
        throw new _Exceptions.TabNotOpen();
      }
      if (command.amountPaid < this.servedItemsValue) {
        throw new _Exceptions.MustPayEnough();
      }
      if (this.outstandingDrinks.length > 0 || this.outstandingFood.length > 0 || this.preparedFood.length > 0) {
        throw new _Exceptions.TabHasUnservedItems();
      }
      return [new _TabClosed2.default({
        id: command.id,
        amountPaid: command.amountPaid,
        orderValue: this.servedItemsValue,
        tipValue: command.amountPaid - this.servedItemsValue
      })];
    }

    /**
     * Applies TabOpened event
     * 
     * @param {TabOpened} event
     */

  }, {
    key: 'applyTabOpened',
    value: function applyTabOpened(event) {
      this.open = true;
    }

    /**
     * Applies DrinksOrdered event
     * 
     * @param {DrinksOrdered} event 
     */

  }, {
    key: 'applyDrinksOrdered',
    value: function applyDrinksOrdered(event) {
      var _outstandingDrinks;

      (_outstandingDrinks = this.outstandingDrinks).push.apply(_outstandingDrinks, _toConsumableArray(event.orderedItems));
    }

    /**
     * Applies FoodOrdered event
     * 
     * @param {FoodOrdered} event 
     */

  }, {
    key: 'applyFoodOrdered',
    value: function applyFoodOrdered(event) {
      var _outstandingFood;

      (_outstandingFood = this.outstandingFood).push.apply(_outstandingFood, _toConsumableArray(event.orderedItems));
    }
  }, {
    key: 'applyFoodPrepared',
    value: function applyFoodPrepared(event) {
      var _this2 = this;

      event.menuNumbers.map(function (i) {
        return parseInt(i);
      }).forEach(function (num) {
        var itemIndex = _this2.outstandingFood.findIndex(function (d) {
          return d.menuNumber === num;
        });
        if (itemIndex > -1) {
          var _preparedFood;

          var food = _this2.outstandingFood.splice(itemIndex, 1);
          (_preparedFood = _this2.preparedFood).push.apply(_preparedFood, _toConsumableArray(food));
        }
      });
    }

    /**
     * Applies DrinkServed event
     * 
     * @param {DrinksServed} event 
     */

  }, {
    key: 'applyDrinksServed',
    value: function applyDrinksServed(event) {
      var _this3 = this;

      event.menuNumbers.forEach(function (num) {
        var itemIndex = _this3.outstandingDrinks.findIndex(function (d) {
          return d.menuNumber === num;
        });
        if (itemIndex > -1) {
          _this3.servedItemsValue += _this3.outstandingDrinks[itemIndex].price;
          _this3.outstandingDrinks.splice(itemIndex, 1);
        }
      });
    }

    /**
     * Applies FoodServed event
     * 
     * @param {FoodServed} event 
     */

  }, {
    key: 'applyFoodServed',
    value: function applyFoodServed(event) {
      var _this4 = this;

      event.menuNumbers.forEach(function (num) {
        var itemIndex = _this4.preparedFood.findIndex(function (d) {
          return d.menuNumber === num;
        });
        if (itemIndex > -1) {
          _this4.servedItemsValue += _this4.preparedFood[itemIndex].price;
          _this4.preparedFood.splice(itemIndex, 1);
        }
      });
    }
  }, {
    key: 'applyTabClosed',
    value: function applyTabClosed(event) {
      this.open = false;
    }

    /**
     * Checks if there are any outstanding drinks
     * 
     * @param {Array[number]} menuNumbers
     * @return {Boolean}
     */

  }, {
    key: '_areDrinksOutstanding',
    value: function _areDrinksOutstanding(menuNumbers) {
      return this.outstandingDrinks.filter(function (item) {
        return menuNumbers.includes(item.menuNumber);
      }).length > 0;
    }

    /**
     * Checks if there is any outstanding food
     * 
     * @param {Array[number]} menuNumbers
     * @return {Boolean}
     */

  }, {
    key: '_isFoodOutstanding',
    value: function _isFoodOutstanding(menuNumbers) {
      return this.outstandingFood.filter(function (item) {
        return menuNumbers.includes(item.menuNumber.toString());
      }).length > 0;
    }
  }, {
    key: '_isFoodPrepared',
    value: function _isFoodPrepared(menuNumbers) {
      return this.preparedFood.filter(function (item) {
        return menuNumbers.includes(item.menuNumber);
      }).length > 0;
    }
  }]);

  return TabAggregate;
}(_Aggregate3.default);

exports.default = TabAggregate;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Aggregate = function () {
  function Aggregate() {
    _classCallCheck(this, Aggregate);

    this.eventsLoaded = 0;
  }

  _createClass(Aggregate, [{
    key: 'applyEvents',
    value: function applyEvents(events) {
      var _this = this;

      events.forEach(function (event) {
        _this.applyOneEvent(event);
      });
    }
  }, {
    key: 'applyOneEvent',
    value: function applyOneEvent(event) {
      var _this2 = this;

      if (Array.isArray(event)) {
        event.forEach(function (evt) {
          return _this2.applyOneEvent(evt);
        });
        return;
      }
      if (typeof this['apply' + event.constructor.name] === 'undefined') {
        throw new Error('Aggregate ' + this.constructor.name + ' does not know how to apply ' + event.constructor.name);
      }

      this['apply' + event.constructor.name](event);
      this.eventsLoaded++;
    }
  }]);

  return Aggregate;
}();

exports.default = Aggregate;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OpenTab = function OpenTab(_ref) {
  var id = _ref.id,
      tableNumber = _ref.tableNumber,
      waiter = _ref.waiter;

  _classCallCheck(this, OpenTab);

  this.id = id;
  this.tableNumber = tableNumber;
  this.waiter = waiter;
};

exports.default = OpenTab;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TabOpened = function TabOpened(_ref) {
  var id = _ref.id,
      tableNumber = _ref.tableNumber,
      waiter = _ref.waiter;

  _classCallCheck(this, TabOpened);

  this.id = id;
  this.tableNumber = tableNumber;
  this.waiter = waiter;
};

exports.default = TabOpened;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DrinksOrdered = function DrinksOrdered(_ref) {
  var id = _ref.id,
      orderedItems = _ref.orderedItems;

  _classCallCheck(this, DrinksOrdered);

  this.id = id;
  this.orderedItems = orderedItems;
};

exports.default = DrinksOrdered;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FoodOrdered = function FoodOrdered(_ref) {
  var id = _ref.id,
      orderedItems = _ref.orderedItems;

  _classCallCheck(this, FoodOrdered);

  this.id = id;
  this.orderedItems = orderedItems;
};

exports.default = FoodOrdered;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DrinksServed = function DrinksServed(_ref) {
  var id = _ref.id,
      menuNumbers = _ref.menuNumbers;

  _classCallCheck(this, DrinksServed);

  this.id = id;
  this.menuNumbers = menuNumbers;
};

exports.default = DrinksServed;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FoodPrepared = function FoodPrepared(_ref) {
  var id = _ref.id,
      menuNumbers = _ref.menuNumbers;

  _classCallCheck(this, FoodPrepared);

  this.id = id;
  this.menuNumbers = menuNumbers;
};

exports.default = FoodPrepared;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FoodServed = function FoodServed(_ref) {
  var id = _ref.id,
      menuNumbers = _ref.menuNumbers;

  _classCallCheck(this, FoodServed);

  this.id = id;
  this.menuNumbers = menuNumbers;
};

exports.default = FoodServed;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TabClosed = function TabClosed(_ref) {
  var id = _ref.id,
      amountPaid = _ref.amountPaid,
      orderValue = _ref.orderValue,
      tipValue = _ref.tipValue;

  _classCallCheck(this, TabClosed);

  this.id = id;
  this.amountPaid = amountPaid;
  this.orderValue = orderValue;
  this.tipValue = tipValue;
};

exports.default = TabClosed;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabNotOpen = exports.TabHasUnservedItems = exports.MustPayEnough = exports.FoodNotPrepared = exports.FoodNotOutstanding = exports.DrinksNotOutstanding = undefined;

var _ExtendableError7 = __webpack_require__(14);

var _ExtendableError8 = _interopRequireDefault(_ExtendableError7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrinksNotOutstanding = exports.DrinksNotOutstanding = function (_ExtendableError) {
  _inherits(DrinksNotOutstanding, _ExtendableError);

  function DrinksNotOutstanding() {
    _classCallCheck(this, DrinksNotOutstanding);

    return _possibleConstructorReturn(this, (DrinksNotOutstanding.__proto__ || Object.getPrototypeOf(DrinksNotOutstanding)).apply(this, arguments));
  }

  return DrinksNotOutstanding;
}(_ExtendableError8.default);

var FoodNotOutstanding = exports.FoodNotOutstanding = function (_ExtendableError2) {
  _inherits(FoodNotOutstanding, _ExtendableError2);

  function FoodNotOutstanding() {
    _classCallCheck(this, FoodNotOutstanding);

    return _possibleConstructorReturn(this, (FoodNotOutstanding.__proto__ || Object.getPrototypeOf(FoodNotOutstanding)).apply(this, arguments));
  }

  return FoodNotOutstanding;
}(_ExtendableError8.default);

var FoodNotPrepared = exports.FoodNotPrepared = function (_ExtendableError3) {
  _inherits(FoodNotPrepared, _ExtendableError3);

  function FoodNotPrepared() {
    _classCallCheck(this, FoodNotPrepared);

    return _possibleConstructorReturn(this, (FoodNotPrepared.__proto__ || Object.getPrototypeOf(FoodNotPrepared)).apply(this, arguments));
  }

  return FoodNotPrepared;
}(_ExtendableError8.default);

var MustPayEnough = exports.MustPayEnough = function (_ExtendableError4) {
  _inherits(MustPayEnough, _ExtendableError4);

  function MustPayEnough() {
    _classCallCheck(this, MustPayEnough);

    return _possibleConstructorReturn(this, (MustPayEnough.__proto__ || Object.getPrototypeOf(MustPayEnough)).apply(this, arguments));
  }

  return MustPayEnough;
}(_ExtendableError8.default);

var TabHasUnservedItems = exports.TabHasUnservedItems = function (_ExtendableError5) {
  _inherits(TabHasUnservedItems, _ExtendableError5);

  function TabHasUnservedItems() {
    _classCallCheck(this, TabHasUnservedItems);

    return _possibleConstructorReturn(this, (TabHasUnservedItems.__proto__ || Object.getPrototypeOf(TabHasUnservedItems)).apply(this, arguments));
  }

  return TabHasUnservedItems;
}(_ExtendableError8.default);

var TabNotOpen = exports.TabNotOpen = function (_ExtendableError6) {
  _inherits(TabNotOpen, _ExtendableError6);

  function TabNotOpen() {
    _classCallCheck(this, TabNotOpen);

    return _possibleConstructorReturn(this, (TabNotOpen.__proto__ || Object.getPrototypeOf(TabNotOpen)).apply(this, arguments));
  }

  return TabNotOpen;
}(_ExtendableError8.default);

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
function ExtendableError(message) {
  this.name = this.constructor.name;
  this.message = message || "Error: " + this.name;
  this.stack = new Error().stack;
}
ExtendableError.prototype = Object.create(Error.prototype);
ExtendableError.prototype.constructor = ExtendableError;

exports.default = ExtendableError;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GUID = function () {
    function GUID() {
        _classCallCheck(this, GUID);
    }

    _createClass(GUID, null, [{
        key: 'newGuid',
        value: function newGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : r & 0x3 | 0x8;
                return v.toString(16);
            });
        }
    }]);

    return GUID;
}();

exports.default = GUID;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TodoListItem = function TodoListItem(_ref) {
  var menuNumber = _ref.menuNumber,
      description = _ref.description;

  _classCallCheck(this, TodoListItem);

  this.menuNumber = menuNumber;
  this.description = description;
};

var TodoListGroup = function TodoListGroup(_ref2) {
  var tab = _ref2.tab,
      items = _ref2.items;

  _classCallCheck(this, TodoListGroup);

  this.tab = tab;
  this.items = items;
};

var ChefTodoList = function () {
  function ChefTodoList() {
    _classCallCheck(this, ChefTodoList);

    this.iSubscribeTo = ['FoodOrdered', 'FoodPrepared'];
    this.todoList = [];
  }

  _createClass(ChefTodoList, [{
    key: 'getTodoList',
    value: function getTodoList() {
      return this.todoList.map(function (grp) {
        return new TodoListGroup({
          tab: grp.tab,
          items: grp.items
        });
      });
    }
  }, {
    key: 'applyFoodOrdered',
    value: function applyFoodOrdered(event) {
      var group = new TodoListGroup({
        tab: event.id,
        items: event.orderedItems.map(function (i) {
          return new TodoListItem({
            menuNumber: i.menuNumber,
            description: i.description
          });
        })
      });

      this.todoList.push(group);
    }
  }, {
    key: 'applyFoodPrepared',
    value: function applyFoodPrepared(event) {
      var group = this.todoList.find(function (g) {
        return g.tab === event.id;
      });
      event.menuNumbers.map(function (i) {
        return parseInt(i);
      }).forEach(function (num) {
        var itemIndex = group.items.findIndex(function (i) {
          return i.menuNumber === num;
        });
        if (itemIndex > -1) {
          group.items.splice(itemIndex, 1);
        }
      });

      if (group.items.length === 0) {
        var groupIndex = this.todoList.findIndex(function (g) {
          return g.tab === event.id;
        });
        this.todoList.splice(groupIndex, 1);
      }
    }
  }]);

  return ChefTodoList;
}();

exports.default = ChefTodoList;

/***/ }),
/* 17 */,
/* 18 */,
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlaceOrder = function PlaceOrder(_ref) {
  var id = _ref.id,
      orderedItems = _ref.orderedItems;

  _classCallCheck(this, PlaceOrder);

  this.id = id;
  this.orderedItems = orderedItems;
};

exports.default = PlaceOrder;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OrderedItem = function OrderedItem(_ref) {
  var menuNumber = _ref.menuNumber,
      description = _ref.description,
      isDrink = _ref.isDrink,
      price = _ref.price;

  _classCallCheck(this, OrderedItem);

  this.menuNumber = menuNumber;
  this.description = description;
  this.isDrink = isDrink;
  this.price = price;
};

exports.default = OrderedItem;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OpenTab = function (_React$Component) {
  _inherits(OpenTab, _React$Component);

  function OpenTab(props) {
    _classCallCheck(this, OpenTab);

    var _this = _possibleConstructorReturn(this, (OpenTab.__proto__ || Object.getPrototypeOf(OpenTab)).call(this, props));

    _this.initialState = {
      tableNumber: 0,
      waiter: ''
    };
    _this.state = _this.initialState;

    _this.handleTableChange = _this.handleTableChange.bind(_this);
    _this.handleWaiterChange = _this.handleWaiterChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  _createClass(OpenTab, [{
    key: 'handleTableChange',
    value: function handleTableChange(_ref) {
      var tableNumber = _ref.target.value;

      this.setState({ tableNumber: tableNumber });
    }
  }, {
    key: 'handleWaiterChange',
    value: function handleWaiterChange(_ref2) {
      var waiter = _ref2.target.value;

      this.setState({ waiter: waiter });
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      event.preventDefault();
      var _state = this.state,
          tableNumber = _state.tableNumber,
          waiter = _state.waiter;

      this.setState(this.initialState);
      if (tableNumber === 0 || waiter === '') {
        alert('FILL OUT THE FORM');
        return;
      }
      this.props.handleAddTable(tableNumber, waiter);
    }
  }, {
    key: 'render',
    value: function render() {
      var el = React.createElement;
      return el('div', null, el('h2', null, 'Open Tab'), el('form', {
        id: 'openTab',
        onSubmit: this.handleSubmit
      }, el('fieldset', null, el('div', { className: 'form-group' }, el('label', { htmlFor: 'tableNumber' }, 'Table Number'), el('input', {
        type: 'number',
        name: 'tableNumber',
        id: 'tableNumber',
        className: 'form-control',
        value: this.state.tableNumber,
        onChange: this.handleTableChange
      })), el('div', { className: 'form-group' }, el('label', { htmlFor: 'waiter' }, 'Waiter/Waitress'), el('select', {
        name: 'waiter',
        id: 'waiter',
        className: 'form-control',
        value: this.state.waiter,
        onChange: this.handleWaiterChange
      }, el('option', { value: 0, key: -1 }, '--Select--'), this.props.waitStaff.map(function (w, i) {
        return el('option', { value: w, key: i }, w);
      }))), el('button', {
        type: 'submit',
        className: 'btn'
      }, 'Submit'))));
    }
  }]);

  return OpenTab;
}(React.Component);

exports.default = OpenTab;

/***/ }),
/* 22 */,
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TabItem = function TabItem(_ref) {
  var menuNumber = _ref.menuNumber,
      description = _ref.description,
      price = _ref.price;

  _classCallCheck(this, TabItem);

  this.menuNumber = menuNumber;
  this.description = description;
  this.price = price;
};

var TabStaus = function TabStaus(_ref2) {
  var tabId = _ref2.tabId,
      tableNumber = _ref2.tableNumber,
      toServe = _ref2.toServe,
      inPreparation = _ref2.inPreparation,
      served = _ref2.served;

  _classCallCheck(this, TabStaus);

  this.tabId = tabId;
  this.tableNumber = tableNumber;
  this.toServe = toServe;
  this.inPreparation = inPreparation;
  this.served = served;
};

var TabInvoice = function TabInvoice(_ref3) {
  var tabId = _ref3.tabId,
      tableNumber = _ref3.tableNumber,
      items = _ref3.items,
      total = _ref3.total,
      hasUnservedItems = _ref3.hasUnservedItems;

  _classCallCheck(this, TabInvoice);

  this.tabId = tabId;
  this.tableNumber = tableNumber;
  this.items = items;
  this.total = total;
  this.hasUnservedItems = hasUnservedItems;
};

var Tab = function Tab(_ref4) {
  var id = _ref4.id,
      tableNumber = _ref4.tableNumber,
      waiter = _ref4.waiter;

  _classCallCheck(this, Tab);

  this.id = id;
  this.tableNumber = tableNumber;
  this.waiter = waiter;
  this.toServe = [];
  this.inPreparation = [];
  this.served = [];
};

var OpenTabs = function () {
  function OpenTabs() {
    _classCallCheck(this, OpenTabs);

    this.iSubscribeTo = ['DrinksOrdered', 'DrinksServed', 'FoodOrdered', 'FoodPrepared', 'FoodServed', 'TabClosed', 'TabOpened'];
    this.todoByTab = new Map();
  }

  _createClass(OpenTabs, [{
    key: 'activeTableNumbers',
    value: function activeTableNumbers() {
      return Array.from(this.todoByTab.values()).map(function (tab) {
        return tab.tableNumber;
      });
    }
  }, {
    key: 'todoListForWaiter',
    value: function todoListForWaiter(waiter) {
      return Array.from(this.todoByTab).filter(function (tab) {
        return tab.waiter === waiter;
      }).filter(function (tab) {
        return tab.toServe.length > 0;
      });
    }
  }, {
    key: 'tabIdForTable',
    value: function tabIdForTable(table) {
      return Array.from(this.todoByTab.values()).find(function (tab) {
        return tab.tableNumber === table;
      }).id;
    }
  }, {
    key: 'tabForTable',
    value: function tabForTable(table) {
      var tab = Array.from(this.todoByTab.values()).find(function (t) {
        return t.tableNumber === table;
      });
      return new TabStatus({
        tabId: tab.id,
        tableNumber: tab.tableNumber,
        toServe: this._copyItems(tab, function (t) {
          return t.toServe;
        }),
        inPreparation: this._copyItems(tab, function (t) {
          return t.inPreparation;
        }),
        served: this._copyItems(tab, function (t) {
          return t.served;
        })
      });
    }
  }, {
    key: 'invoiceForTable',
    value: function invoiceForTable(table) {
      var tab = Array.from(this.todoByTab).find(function (t) {
        return t.tableNumber === table;
      });

      return new TabInvoice({
        taId: tab.id,
        tableNumber: tab.tableNumber,
        items: [].concat(_toConsumableArray(tab.served)),
        total: tab.served.reduce(function (sum, item) {
          return sum + item.price;
        }, 0),
        hasUnservedItems: tab.inPreparation.length > 0 || tab.toServe.length > 0
      });
    }
  }, {
    key: 'applyTabOpened',
    value: function applyTabOpened(event) {
      this.todoByTab.set(event.id, new Tab({
        id: event.id,
        tableNumber: event.tableNumber,
        waiter: event.waiter
      }));
    }
  }, {
    key: 'applyDrinksOrdered',
    value: function applyDrinksOrdered(event) {
      this._addItems(event.id, event.orderedItems.map(function (drink) {
        return new TabItem({
          menuNumber: drink.menuNumber,
          description: drink.description,
          price: drink.price
        });
      }), function (tab) {
        return tab.inPreparation;
      });
    }
  }, {
    key: 'applyFoodOrdered',
    value: function applyFoodOrdered(event) {
      this._addItems(event.id, event.orderedItems.map(function (food) {
        return new TabItem({
          menuNumber: food.menuNumber,
          description: food.description,
          price: food.price
        });
      }), function (tab) {
        return tab.inPreparation;
      });
    }
  }, {
    key: 'applyFoodPrepared',
    value: function applyFoodPrepared(event) {
      this._moveItems(event.id, event.menuNumbers, function (tab) {
        return tab.inPreparation;
      }, function (tab) {
        return tab.toServe;
      });
    }
  }, {
    key: 'applyDrinksServed',
    value: function applyDrinksServed(event) {
      this._moveItems(event.id, event.menuNumbers, function (tab) {
        return tab.toServe;
      }, function (tab) {
        return tab.served;
      });
    }
  }, {
    key: 'applyFoodServed',
    value: function applyFoodServed(event) {
      this._moveItems(event.id, event.menuNumbers, function (tab) {
        return tab.toServe;
      }, function (tab) {
        return tab.served;
      });
    }
  }, {
    key: 'applyTabClosed',
    value: function applyTabClosed(event) {
      var tabIndex = this.todoByTab.delete(event.id);
    }
  }, {
    key: '_getTab',
    value: function _getTab(id) {
      return this.todoByTab.get(id);
    }
  }, {
    key: '_addItems',
    value: function _addItems(tabId, newItems, to) {
      var _to;

      var tab = this._getTab(tabId);
      (_to = to(tab)).push.apply(_to, _toConsumableArray(newItems));
    }
  }, {
    key: '_copyItems',
    value: function _copyItems(tableTodo, selector) {
      return [].concat(_toConsumableArray(selector(tableTodo)));
    }
  }, {
    key: '_moveItems',
    value: function _moveItems(tabId, menuNumbers, from, to) {
      var tab = this._getTab(tabId);
      var fromList = from(tab);
      var toList = to(tab);
      menuNumbers.forEach(function (num) {
        var serveItemIndex = fromList.findIndex(function (f) {
          return f.menuNumber === num;
        });
        var serveItem = fromList.splice(serveItemIndex, 1);
        toList.push(serveItem);
      });
    }
  }]);

  return OpenTabs;
}();

exports.default = OpenTabs;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openTabQueries = exports.chefTodoQueries = exports.dispatcher = undefined;

var _MessageDispatcher = __webpack_require__(1);

var _MessageDispatcher2 = _interopRequireDefault(_MessageDispatcher);

var _EventStore = __webpack_require__(2);

var _EventStore2 = _interopRequireDefault(_EventStore);

var _TabAggregate = __webpack_require__(3);

var _TabAggregate2 = _interopRequireDefault(_TabAggregate);

var _ChefTodoList = __webpack_require__(16);

var _ChefTodoList2 = _interopRequireDefault(_ChefTodoList);

var _OpenTabs = __webpack_require__(23);

var _OpenTabs2 = _interopRequireDefault(_OpenTabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dispatcher = new _MessageDispatcher2.default(new _EventStore2.default());
dispatcher.scanInstance(_TabAggregate2.default);

var chefTodoQueries = new _ChefTodoList2.default();
dispatcher.scanInstance(chefTodoQueries);

var openTabQueries = new _OpenTabs2.default();
dispatcher.scanInstance(openTabQueries);

exports.dispatcher = dispatcher;
exports.chefTodoQueries = chefTodoQueries;
exports.openTabQueries = openTabQueries;

/***/ }),
/* 25 */,
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Domain = __webpack_require__(24);

var _OrderedItem = __webpack_require__(20);

var _OrderedItem2 = _interopRequireDefault(_OrderedItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlaceOrder = function (_React$Component) {
  _inherits(PlaceOrder, _React$Component);

  function PlaceOrder(props) {
    _classCallCheck(this, PlaceOrder);

    var _this = _possibleConstructorReturn(this, (PlaceOrder.__proto__ || Object.getPrototypeOf(PlaceOrder)).call(this, props));

    var order = _this.props.menu.reduce(function (obj, item) {
      obj[item.menuNumber] = 0;
      return obj;
    }, {});

    _this.state = Object.assign({}, order, { tableNumber: 0 });

    _this.handleChangeAmount = _this.handleChangeAmount.bind(_this);
    _this.handleChangeTable = _this.handleChangeTable.bind(_this);
    _this.handlePlaceOrder = _this.handlePlaceOrder.bind(_this);
    return _this;
  }

  _createClass(PlaceOrder, [{
    key: 'handleChangeAmount',
    value: function handleChangeAmount(event) {
      this.setState(_defineProperty({}, event.target.id, parseInt(event.target.value)));
    }
  }, {
    key: 'handleChangeTable',
    value: function handleChangeTable(event) {
      this.setState({
        tableNumber: event.target.value
      });
    }
  }, {
    key: 'handlePlaceOrder',
    value: function handlePlaceOrder(event) {
      var _this2 = this;

      event.preventDefault();
      var order = this.props.menu.filter(function (item) {
        return _this2.state[item.menuNumber] > 0;
      }).reduce(function (orderedItems, item) {
        var newItems = [];
        for (var i = 0; i < _this2.state[item.menuNumber]; i++) {
          newItems.push(new _OrderedItem2.default({
            menuNumber: item.menuNumber,
            description: item.description,
            isDrink: item.isDrink,
            price: item.price
          }));
        }
        return orderedItems.concat(newItems);
      }, []);

      this.props.handlePlaceOrder(order, this.state.tableNumber);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var el = React.createElement;
      return el('form', { onSubmit: this.handlePlaceOrder }, el('h2', null, 'Place Order'), el('div', { className: 'form-group' }, el('label', { htmlFor: 'tableNumber' }, 'Table'), el('select', {
        className: 'form-control',
        name: 'tableNumber',
        onChange: this.handleChangeTable,
        value: this.state.tableNumber
      }, el('option', null, '--SELECT TABLE #--'), this.props.activeTableNumbers.map(function (t, i) {
        return el('option', { value: t, key: i }, t);
      }))), el('table', { className: 'table' }, el('thead', null, el('tr', null, el('th', null, 'Menu #'), el('th', null, 'Description'), el('th', null, 'Price'), el('th', null, '# Order'))), el('tbody', null, this.props.menu.map(function (i) {
        return el('tr', { key: i.menuNumber }, el('td', null, i.menuNumber, el('input', { type: 'hidden', value: i.menuNumber })), el('td', null, i.description), el('td', null, '$' + i.price.toFixed(2)), el('td', null, el('input', {
          type: 'number',
          id: i.menuNumber,
          name: 'numberToOrder',
          value: _this3.state[i.menuNumber],
          className: 'form-control',
          onChange: _this3.handleChangeAmount
        })));
      }))), el('button', { type: 'submit', className: 'btn' }, 'Place Order'));
    }
  }]);

  return PlaceOrder;
}(React.Component);

exports.default = PlaceOrder;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _OpenTab = __webpack_require__(21);

var _OpenTab2 = _interopRequireDefault(_OpenTab);

var _PlaceOrder = __webpack_require__(26);

var _PlaceOrder2 = _interopRequireDefault(_PlaceOrder);

var _MealsToPrepare = __webpack_require__(28);

var _MealsToPrepare2 = _interopRequireDefault(_MealsToPrepare);

var _GUID = __webpack_require__(15);

var _GUID2 = _interopRequireDefault(_GUID);

var _Domain = __webpack_require__(24);

var _OpenTab3 = __webpack_require__(5);

var _OpenTab4 = _interopRequireDefault(_OpenTab3);

var _PlaceOrder3 = __webpack_require__(19);

var _PlaceOrder4 = _interopRequireDefault(_PlaceOrder3);

var _MarkFoodPrepared = __webpack_require__(29);

var _MarkFoodPrepared2 = _interopRequireDefault(_MarkFoodPrepared);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Container = function (_React$Component) {
  _inherits(Container, _React$Component);

  function Container(props) {
    _classCallCheck(this, Container);

    var _this = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

    _this.state = {
      tables: [],
      orders: []
    };

    _this.handleAddTable = _this.handleAddTable.bind(_this);
    _this.handlePlaceOrder = _this.handlePlaceOrder.bind(_this);
    _this.handleMarkFoodPrepared = _this.handleMarkFoodPrepared.bind(_this);
    return _this;
  }

  _createClass(Container, [{
    key: 'handleAddTable',
    value: function handleAddTable(tableNumber, waiter) {
      _Domain.dispatcher.sendCommand(new _OpenTab4.default({
        id: _GUID2.default.newGuid(),
        tableNumber: tableNumber,
        waiter: waiter
      }));
      this.setState({ tables: this.state.tables.concat(tableNumber) });
    }
  }, {
    key: 'handlePlaceOrder',
    value: function handlePlaceOrder(items, tableNumber) {
      _Domain.dispatcher.sendCommand(new _PlaceOrder4.default({
        orderedItems: items,
        id: _Domain.openTabQueries.tabIdForTable(tableNumber)
      }));
      this.setState({ orders: this.state.orders.concat(tableNumber) });
    }
  }, {
    key: 'handleMarkFoodPrepared',
    value: function handleMarkFoodPrepared(id, menuNumbers) {
      _Domain.dispatcher.sendCommand(new _MarkFoodPrepared2.default({
        id: id,
        menuNumbers: menuNumbers
      }));
      this.setState({ orders: this.state.orders.concat(tableNumber) });
    }
  }, {
    key: 'render',
    value: function render() {
      var el = React.createElement;
      return el('div', { className: 'container' }, el('div', { className: 'row justify-content-md-center' }, el('div', { className: 'col-3' }, el(_OpenTab2.default, {
        waitStaff: this.props.waitStaff.sort(),
        handleAddTable: this.handleAddTable.bind(this)
      })), el('div', { className: 'col' }, el(_PlaceOrder2.default, {
        menu: this.props.menu,
        activeTableNumbers: _Domain.openTabQueries.activeTableNumbers(),
        handlePlaceOrder: this.handlePlaceOrder.bind(this)
      }))), el('div', { className: 'row' }, el(_MealsToPrepare2.default, {
        todoList: _Domain.chefTodoQueries.getTodoList(),
        handleMarkFoodPrepared: this.handleMarkFoodPrepared.bind(this)
      })));
    }
  }]);

  return Container;
}(React.Component);

exports.default = Container;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MealsToPrepare = function (_React$Component) {
  _inherits(MealsToPrepare, _React$Component);

  function MealsToPrepare(props) {
    _classCallCheck(this, MealsToPrepare);

    var _this = _possibleConstructorReturn(this, (MealsToPrepare.__proto__ || Object.getPrototypeOf(MealsToPrepare)).call(this, props));

    _this.state = {};
    _this.handlePrepareFood = _this.handlePrepareFood.bind(_this);
    _this.handleChangePrepared = _this.handleChangePrepared.bind(_this);
    return _this;
  }

  _createClass(MealsToPrepare, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var state = nextProps.todoList.reduce(function (obj, group) {
        obj[group.tab] = group.items.reduce(function (obj2, item, i) {
          obj2[item.menuNumber + '-' + i] = false;
          return obj2;
        }, {});
        return obj;
      }, {});

      this.setState(state);
    }
  }, {
    key: 'handleChangePrepared',
    value: function handleChangePrepared(event) {
      var _event$target$dataset = event.target.dataset,
          group = _event$target$dataset.group,
          menuNumber = _event$target$dataset.menuNumber,
          index = _event$target$dataset.index;

      var newState = Object.assign({}, this.state);
      newState[group][menuNumber + '-' + index] = event.target.checked;
      this.setState(newState);
    }
  }, {
    key: 'handlePrepareFood',
    value: function handlePrepareFood(event) {
      var _this2 = this;

      event.preventDefault();
      var id = event.target.id.value;
      var menuNumbers = Object.keys(this.state[id]).filter(function (menuNumber) {
        return _this2.state[id]['' + menuNumber];
      }).map(function (menuNumberPlusIndex) {
        return menuNumberPlusIndex.split('-')[0];
      });
      this.props.handleMarkFoodPrepared(id, menuNumbers);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var el = React.createElement;
      return el('div', null, el('h2', null, 'Meals to Prepare'), this.props.todoList.map(function (group, index) {
        return el('form', { key: index, onSubmit: _this3.handlePrepareFood }, el('input', {
          type: 'hidden',
          name: 'id',
          value: group.tab
        }), el('table', { className: 'table' }, el('thead', null, el('tr', null, el('th', null, 'Menu #'), el('th', null, 'Description'), el('th', null, 'Prepared'))), el('tbody', null, group.items.map(function (item, subIndex) {
          return el('tr', { key: subIndex }, el('td', null, item.menuNumber), el('td', null, item.description), el('td', null, el('input', {
            type: 'checkbox',
            name: 'prepared_' + group.tab + '_' + item.menuNumber + '_' + subIndex,
            onChange: _this3.handleChangePrepared,
            'data-group': group.tab,
            'data-menu-number': item.menuNumber,
            'data-index': subIndex,
            checked: _this3.state[group.tab][item.menuNumber + '-' + subIndex]
          })));
        }))), el('button', {
          type: 'submit',
          className: 'btn'
        }, 'Mark Prepared'));
      }));
    }
  }]);

  return MealsToPrepare;
}(React.Component);

exports.default = MealsToPrepare;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MarkFoodPrepared = function MarkFoodPrepared(_ref) {
  var id = _ref.id,
      menuNumbers = _ref.menuNumbers;

  _classCallCheck(this, MarkFoodPrepared);

  this.id = id;
  this.menuNumbers = menuNumbers;
};

exports.default = MarkFoodPrepared;

/***/ })
/******/ ]);