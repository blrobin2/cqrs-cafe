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


var _MessageDispatcher = __webpack_require__(1);

var _MessageDispatcher2 = _interopRequireDefault(_MessageDispatcher);

var _EventStore = __webpack_require__(2);

var _EventStore2 = _interopRequireDefault(_EventStore);

var _GUID = __webpack_require__(15);

var _GUID2 = _interopRequireDefault(_GUID);

var _TabAggregate = __webpack_require__(3);

var _TabAggregate2 = _interopRequireDefault(_TabAggregate);

var _OpenTab = __webpack_require__(5);

var _OpenTab2 = _interopRequireDefault(_OpenTab);

var _ChefTodoList = __webpack_require__(16);

var _ChefTodoList2 = _interopRequireDefault(_ChefTodoList);

var _PlaceOrder = __webpack_require__(19);

var _PlaceOrder2 = _interopRequireDefault(_PlaceOrder);

var _OrderedItem = __webpack_require__(20);

var _OrderedItem2 = _interopRequireDefault(_OrderedItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dispatcher = new _MessageDispatcher2.default(new _EventStore2.default());
dispatcher.scanInstance(_TabAggregate2.default);

// this.openTabQueries = new OpenTabs
// this.dispatcher.scanInstance(this.openTabQueries)

var chefTodoQueries = new _ChefTodoList2.default();
dispatcher.scanInstance(chefTodoQueries);

function sendOpenTab(_ref) {
  var tableNumber = _ref.tableNumber,
      waiter = _ref.waiter;

  var id = _GUID2.default.newGuid();
  dispatcher.sendCommand(new _OpenTab2.default({
    id: id,
    tableNumber: tableNumber,
    waiter: waiter
  }));
  dispatcher.sendCommand(new _PlaceOrder2.default({
    id: id,
    orderedItems: [new _OrderedItem2.default({
      menuNumber: 1,
      description: 'Hot Dog',
      isDrink: false,
      price: 4
    })]
  }));
}

window.sendOpenTab = sendOpenTab;
window.chefTodoQueries = chefTodoQueries;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
    value: function _publishEvent(_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
          event = _ref2[0];

      var eventName = event.constructor.name;
      if (this.eventSubscribers.has(eventName)) {
        this.eventSubscribers.get(eventName).forEach(function (sub) {
          return sub(event);
        });
      }
    }
  }, {
    key: 'addHandlerFor',
    value: function addHandlerFor(command, aggregate) {
      var _this = this;

      if (this.commandHandlers.has(command)) {
        throw new Error('Command handler already registered for ' + command);
      }

      this.commandHandlers.set(command, function (c) {
        var agg = new aggregate();
        agg.id = c.id;
        agg.applyEvents(_this.eventStore.loadEventsFor(agg.id));

        var resultEvents = Object.getOwnPropertyNames(aggregate.prototype).filter(function (method) {
          return method === 'handle' + command;
        }).map(function (method) {
          return agg[method](c);
        });

        if (resultEvents.length > 0) {
          _this.eventStore.saveEventsFor(agg.id, agg.eventsLoaded, resultEvents);
        }

        resultEvents.forEach(function (event) {
          return _this._publishEvent(event);
        });
      });
    }
  }, {
    key: 'addSubscriberFor',
    value: function addSubscriberFor(event, subscriber) {
      console.log(event);
      if (!this.eventSubscribers.has(event)) {
        this.eventSubscribers.set(event, []);
      }
      this.eventSubscribers.get(event).push(function (e) {
        return subscriber['handle' + event](e);
      });
    }
  }, {
    key: 'scanInstance',
    value: function scanInstance(instance) {
      var _this2 = this;

      var instanceMethods = this._isConstructor(instance) ? Object.getOwnPropertyNames(instance.prototype) : Object.getOwnPropertyNames(instance.constructor.prototype);
      var handlers = instanceMethods.filter(function (method) {
        return method.startsWith('handle');
      });
      handlers.map(function (handler) {
        return handler.replace('handle', '');
      }).forEach(function (handler) {
        return _this2.addHandlerFor(handler, instance);
      });

      var subscribers = instance.iSubscribeTo || [];
      subscribers.forEach(function (sub) {
        return _this2.addSubscriberFor(sub, instance);
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

      event.menuNumbers.forEach(function (num) {
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
        return menuNumbers.includes(item.menuNumber);
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

var _TodoListGroup = __webpack_require__(17);

var _TodoListGroup2 = _interopRequireDefault(_TodoListGroup);

var _TodoListItem = __webpack_require__(18);

var _TodoListItem2 = _interopRequireDefault(_TodoListItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        return new _TodoListGroup2.default({
          tab: grp.tab,
          items: grp.items
        });
      });
    }
  }, {
    key: 'handleFoodOrdered',
    value: function handleFoodOrdered(event) {
      var group = new _TodoListGroup2.default({
        tab: event.id,
        items: event.orderedItems.map(function (i) {
          return new _TodoListItem2.default({
            menuNumber: i.menuNumber,
            description: i.description
          });
        })
      });

      this.todoList.push(group);
    }
  }, {
    key: 'handleFoodPrepared',
    value: function handleFoodPrepared(event) {
      var group = this.todoList.find(function (g) {
        return g.tab === event.id;
      });
      event.menuNumbers.forEach(function (num) {
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TodoListGroup = function TodoListGroup(_ref) {
  var tab = _ref.tab,
      items = _ref.items;

  _classCallCheck(this, TodoListGroup);

  this.tab = tab;
  this.items = items;
};

exports.default = TodoListGroup;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TodoListItem = function TodoListItem(_ref) {
  var menuNumber = _ref.menuNumber,
      description = _ref.description;

  _classCallCheck(this, TodoListItem);

  this.menuNumber = menuNumber;
  this.description = description;
};

exports.default = TodoListItem;

/***/ }),
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

/***/ })
/******/ ]);