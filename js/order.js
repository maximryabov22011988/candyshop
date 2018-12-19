'use strict';

(function () {
  var backendApi = window.backendApi;
  var convertToArray = window.util.convertToArray;
  var customValidation = window.validate.customValidation;
  var validateField = window.validate.validateField;
  var verifyField = window.validate.verifyField;
  var showSuccessModal = window.modal.showSuccessModal;

  var orderForm = document.querySelector('.buy__form');
  var orderFields = convertToArray(orderForm.querySelectorAll('input'));
  var contactFields = convertToArray(orderForm.querySelectorAll('.contact-data__inputs input'));
  var bankCardFields = convertToArray(orderForm.querySelectorAll('.payment__inputs input'));
  var courierFields = convertToArray(orderForm.querySelectorAll('.deliver__address-entry-fields input'));
  var paymentMessage = orderForm.querySelector('.payment__card-status');

  var blockFields = function (boolean) {
    orderFields.forEach(function (field) {
      field.disabled = boolean;
    });
  };

  var resetFields = function (containerClassName) {
    var fields = convertToArray(orderForm.querySelectorAll('.' + containerClassName + ' input'));
    fields.forEach(function (field) {
      field.setAttribute('checked', false);
      field.checked = false;
    });
  };

  var disableFields = function (containerClassName) {
    window.util.convertToArray(orderForm.querySelectorAll('.' + containerClassName + ' input')).forEach(function (field) {
      field.disabled = true;
    });
  };

  var enableFields = function (containerClassName) {
    window.util.convertToArray(orderForm.querySelectorAll('.' + containerClassName + ' input')).forEach(function (field) {
      field.disabled = false;
    });
  };

  var checkFields = function (evt, fields) {
    var validityFields = [];

    fields.forEach(function (field) {
      if (field.required === true) {
        var isValidField = validateField(evt, customValidation, field);

        if (isValidField) {
          var isVerifyField = verifyField(evt, customValidation, field);
          if (!isVerifyField) {
            field.focus();
          }
        }

        if (field.checkValidity() === true) {
          validityFields.push(true);
        } else {
          validityFields.push(false);
        }
      }
    });

    return validityFields.every(function (isValidField) {
      return isValidField === true;
    });
  };


  var successHandler = function (response, evt) {
    showSuccessModal();

    orderFields.forEach(function (field) {
      var fieldContainer = field.parentElement;
      field.value = '';

      if (fieldContainer.classList.contains('text-input')) {
        fieldContainer.classList.remove('text-input--error');
        fieldContainer.classList.remove('text-input--correct');
      }
    });

    paymentMessage.textContent = 'Не определён';
    paymentMessage.style.color = '';
  };

  var errorHandler = function (errorMessage) {
    throw new Error(errorMessage);
  };

  orderForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    blockFields(false);

    var cardPaymentInput = orderForm.querySelector('#payment__card');
    var courierDeliveryInput = orderForm.querySelector('#deliver__courier');
    var isCorrectContactFields = checkFields(evt, contactFields);
    var isCorrectBankCard = null;
    var isCorrectCourierFields = null;

    if (cardPaymentInput.checked === true && courierDeliveryInput.checked === true) {
      resetFields('deliver__store-list');
      checkFields(evt, bankCardFields);
      isCorrectBankCard = paymentMessage.textContent.toLowerCase() === 'одобрен';
      isCorrectCourierFields = checkFields(evt, courierFields);
      if (isCorrectContactFields && isCorrectBankCard && isCorrectCourierFields) {
        backendApi.sendData(new FormData(orderForm), successHandler, errorHandler);
      }
      return;
    }

    if (cardPaymentInput.checked === true) {
      checkFields(evt, bankCardFields);
      isCorrectBankCard = paymentMessage.textContent.toLowerCase() === 'одобрен';
      if (isCorrectContactFields && isCorrectBankCard) {
        backendApi.sendData(new FormData(orderForm), successHandler, errorHandler);
      }
      return;
    }

    if (courierDeliveryInput.checked === true) {
      resetFields('deliver__store-list');
      isCorrectCourierFields = checkFields(evt, courierFields);
      if (isCorrectContactFields && isCorrectCourierFields) {
        backendApi.sendData(new FormData(orderForm), successHandler, errorHandler);
      }
      return;
    }

    if (isCorrectContactFields) {
      backendApi.sendData(new FormData(orderForm), successHandler, errorHandler);
    }
  });

  window.order = {
    blockFields: blockFields,
    disableFields: disableFields,
    enableFields: enableFields
  };
})();
