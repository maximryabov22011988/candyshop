'use strict';

(function () {
  var customValidation = window.validate.customValidation;
  var validateField = window.validate.validateField;
  var verifyField = window.validate.verifyField;

  var fieldsContainer = document.querySelector('.deliver__entry-fields-wrap');

  fieldsContainer.addEventListener('input', function (evt) {
    validateField(evt, customValidation);

    if (evt.target.checkValidity() === true) {
      verifyField(evt, customValidation);
    }
  });
})();
