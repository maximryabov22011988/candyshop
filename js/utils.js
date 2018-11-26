'use strict';

(function () {
  var KEYCODE = {
    'LEFT_MOUSE_BUTTON': 1,
    'TAB': 9,
    'ENTER': 13,
    'ESC': 27,
    'BACKSPACE': 8,
    '0': 48,
    '9': 57
  };

  var deepCopy = function (object) {
    var clone = Object.create(Object.getPrototypeOf(object));
    var properties = Object.getOwnPropertyNames(object);

    for (var propertyIndex = 0; propertyIndex < properties.length; propertyIndex++) {
      var property = properties[propertyIndex];
      var descriptor = Object.getOwnPropertyDescriptor(object, property);

      if (descriptor.value && typeof descriptor.value === 'object') {
        descriptor.value = deepCopy(descriptor.value);
      }

      Object.defineProperty(clone, property, descriptor);
    }

    return clone;
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
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent
  };
})();
