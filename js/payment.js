'use strict';

(function () {
  var convertToArray = window.util.convertToArray;
  var customValidation = window.validate.customValidation;
  var validateField = window.validate.validateField;
  var verifyField = window.validate.verifyField;
  var enableFields = window.order.enableFields;
  var disableFields = window.order.disableFields;
  var paymentTabs = window.tabs.paymentTabs;


  var cardTabElement = document.querySelector('.toggle-btn__label[for="payment__card"]');
  var cashTabElement = document.querySelector('.toggle-btn__label[for="payment__cash"]');
  var fieldsContainerElement = document.querySelector('.payment__inputs');

  paymentTabs.setActiveTab(0);
  paymentTabs.init();

  cardTabElement.addEventListener('click', function () {
    enableFields('payment__inputs');
  });

  cashTabElement.addEventListener('click', function () {
    disableFields('payment__inputs');
  });

  fieldsContainerElement.addEventListener('input', function (evt) {
    validateField(evt, customValidation);
    if (evt.target.checkValidity() === true) {
      verifyField(evt, customValidation);
    }
  });

  fieldsContainerElement.addEventListener('blur', function () {
    var totalVerification = [];
    var fieldsElements = convertToArray(fieldsContainerElement.querySelectorAll('.text-input__input'));
    var statusMessageElement = fieldsContainerElement.querySelector('.payment__card-status');

    fieldsElements.forEach(function (field, i) {
      totalVerification[i] = customValidation[field.name].checkValue(field.value);
    });

    var isVerify = totalVerification.every(function (value) {
      return value === true;
    });

    if (isVerify) {
      statusMessageElement.textContent = 'Одобрен';
      statusMessageElement.style.color = '#6e58d9';
    } else {
      statusMessageElement.textContent = 'Не определён';
    }
  }, true);
})();
