'use strict';

(function () {
  var convertToArray = window.util.convertToArray;
  var customValidation = window.validate.customValidation;
  var validateField = window.validate.validateField;
  var verifyField = window.validate.verifyField;

  var fieldsContainer = document.querySelector('.payment__inputs');

  fieldsContainer.addEventListener('input', function (evt) {
    validateField(evt, customValidation);

    if (evt.target.checkValidity() === true) {
      verifyField(evt, customValidation);
    }
  });

  fieldsContainer.addEventListener('blur', function () {
    var fields = convertToArray(fieldsContainer.querySelectorAll('.text-input__input'));
    var statusMessage = fieldsContainer.querySelector('.payment__card-status');

    var totalVerification = [];

    fields.forEach(function (field, i) {
      totalVerification[i] = customValidation[field.name].checkValue(field.value);
    });

    var isVerify = totalVerification.every(function (verifyValue) {
      return verifyValue === true;
    });

    if (isVerify) {
      statusMessage.textContent = 'Одобрен';
      statusMessage.style.color = '#6e58d9';
    } else {
      statusMessage.textContent = 'Не определён';
    }
  }, true);
})();
