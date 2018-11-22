'use strict';

(function () {
  var KEYCODE = {
    'LEFT_MOUSE_BUTTON': 1,
    'ENTER': 13,
    'BACKSPACE': 8,
    '0': 48,
    '9': 57
  };

  var RATING_MAP = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five'
  };

  var getRatingClassName = function (value) {
    return 'stars__rating--' + RATING_MAP[value];
  };

  var generateRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  };

  var generateString = function (array) {
    array.length = generateRandomNumber(3, array.length - 1);
    return array.join(', ');
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
    getRatingClassName: getRatingClassName,
    generateRandomNumber: generateRandomNumber,
    generateString: generateString,
    deepCopy: deepCopy,
    blockOrderFields: blockOrderFields
  };
})();
