'use strict';

(function () {
  var KEYCODE = {
    'ENTER': 13,
    'ESC': 27,
    'LEFT_MOUSE_BUTTON': 1
  };

  /**
   * Копирует объект.
   *
   * @param  {object} object - исходный объект
   * @return {copy}          - копия объекта
   */
  var deepCopy = function (object) {
    var copy = Object.create(Object.getPrototypeOf(object));
    var properties = Object.getOwnPropertyNames(object);

    properties.forEach(function (property) {
      var descriptor = Object.getOwnPropertyDescriptor(object, property);

      if (descriptor.value && typeof descriptor.value === 'object') {
        descriptor.value = deepCopy(descriptor.value);
      }

      Object.defineProperty(copy, property, descriptor);
    });

    return copy;
  };

  /**
   * Конвертирует псевдомассив / массивоподобный объект в массив.
   *
   * @param  {htmlCollection} pseudoArray - псевдомассив / массивоподобный объект
   * @return {array}                      - массив
   */
  var convertToArray = function (pseudoArray) {
    return Array.prototype.slice.call(pseudoArray);
  };

  /**
   * Показывает элемент.
   *
   * @param  {DOM} node - DOM-элемент, который нужно показать
   */
  var showElement = function (node) {
    node.classList.remove('visually-hidden');
  };

  /**
   * Скрывает элемент.
   *
   * @param  {DOM} node - DOM-элемент, который нужно скрыть
   */
  var hideElement = function (node) {
    node.classList.add('visually-hidden');
  };

  /**
   * Обработчик при нажатии на Enter.
   *
   * @param  {object}  evt      - объект event
   * @param  {function}  action - обработчик события
   */
  var isEnterEvent = function (evt, action) {
    if (evt.which === KEYCODE['ENTER']) {
      action(evt);
    }
  };


  window.util = {
    KEYCODE: KEYCODE,
    deepCopy: deepCopy,
    convertToArray: convertToArray,
    showElement: showElement,
    hideElement: hideElement,
    isEnterEvent: isEnterEvent
  };
})();
