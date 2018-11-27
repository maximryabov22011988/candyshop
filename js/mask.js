'use strict';

(function () {
  var phoneField = document.querySelector('#contact-data__tel');
  var maskOptions = {
    mask: '+{7} (000) 000-00-00'
  };

  window.mask = new IMask(phoneField, maskOptions);
})();
