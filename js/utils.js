'use strict';

(function () {
  var KEYCODE = {
    'LEFT_MOUSE_BUTTON': 1,
    'ENTER': 13,
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

  var blockOrderFields = function (boolean) {
    var orderForm = document.querySelector('.buy form');
    var fields = orderForm.querySelectorAll('input');

    for (var i = 0; i < fields.length; i++) {
      fields[i].disabled = boolean;
    }
  };

  window.util = {
    KEYCODE: KEYCODE,
    deepCopy: deepCopy,
    blockOrderFields: blockOrderFields
  };
})();
