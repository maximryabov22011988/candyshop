'use strict';

(function () {
  window.debounce = function (fn, wait) {
    var lastTimeout = null;

    return function () {
      var args = [].slice.call(arguments);

      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }

      lastTimeout = window.setTimeout(function () {
        fn.apply(null, args);
      }, wait);
    };
  };
})();
