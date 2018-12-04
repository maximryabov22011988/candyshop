'use strict';

(function () {
  var KEYCODE = {
    '0': 48,
    '9': 57,
    'ENTER': 13,
    'ESC': 27,
    'BACKSPACE': 8,
    'TAB': 9,
    'LEFT_MOUSE_BUTTON': 1
  };

  var deepCopy = function (object) {
    var clone = Object.create(Object.getPrototypeOf(object));
    var properties = Object.getOwnPropertyNames(object);

    properties.forEach(function (property) {
      var descriptor = Object.getOwnPropertyDescriptor(object, property);

      if (descriptor.value && typeof descriptor.value === 'object') {
        descriptor.value = deepCopy(descriptor.value);
      }

      Object.defineProperty(clone, property, descriptor);
    });

    return clone;
  };

  var convertToArray = function (pseudoArray) {
    return Array.prototype.slice.call(pseudoArray);
  };

  var isEnterEvent = function (evt, action) {
    if (evt.which === KEYCODE['ENTER']) {
      action(evt);
    }
  };

  var isEscEvent = function (evt, action) {
    if (evt.which === KEYCODE['ESC']) {
      action(evt);
    }
  };

  window.util = {
    KEYCODE: KEYCODE,
    deepCopy: deepCopy,
    convertToArray: convertToArray,
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent
  };
})();
