'use strict';

(function () {
  var customValidation = window.validate.customValidation;
  var validateField = window.validate.validateField;
  var verifyField = window.validate.verifyField;


  var fieldsContainerElement = document.querySelector('.contact-data__inputs');

  fieldsContainerElement.addEventListener('input', function (evt) {
    validateField(evt, customValidation);
    if (evt.target.checkValidity() === true) {
      verifyField(evt, customValidation);
    }
  });
})();
