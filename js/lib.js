'use strict';

(function () {
  var script = document.createElement('script');
  script.src = 'https://unpkg.com/imask';
  document.body.appendChild(script);

  script.addEventListener('load', function () {
    var phoneField = document.querySelector('#contact-data__tel');
    var maskOptions = {
      mask: '+{7} (000) 000-00-00'
    };
    var mask = new IMask(phoneField, maskOptions);
  });
})();
