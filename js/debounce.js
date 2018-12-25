'use strict';

(function () {
  var convertToArray = window.util.convertToArray;


  var DEBOUNCE_INTERVAL = 500;

  /**
   * Функция-декоратор для создания задержки на действие пользователя
   * @param  {function} fn     - функция, для которой необходимо создать задержку
   * @param  {number}   delay  - время задержки в мс
   */
  var debounce = function (fn) {
    var lastTimeout = null;
    return function () {
      var args = convertToArray(arguments);
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        fn.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  };


  window.debounce = debounce;
})();
